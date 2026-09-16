import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { loadUnicodeFonts } from "./exportBreakdownToPDF";
import {
  paymentLabel,
  statusDef,
  type Expense,
} from "@/lib/expenses/types";
import { formatMoney, round2 } from "@/lib/expenses/currency";

export interface ExpenseExportFilters {
  q?: string;
  status?: string;
  department?: string;
  payment?: string;
  from?: string;
  to?: string;
}

export interface ExpenseExportInput {
  productionTitle: string;
  company?: string | null;
  /** Already filtered + sorted, exactly what the producer sees. */
  expenses: Expense[];
  filters?: ExpenseExportFilters;
  /** item id → readable label for the linked checklist item. */
  linkedItems?: Record<string, { scene: string; department: string; text: string }>;
  /** storage path → signed URL (used for the optional receipt images). */
  signedUrls?: Record<string, string>;
  includeImages?: boolean;
}

const MARGIN = 15;

const slug = (s: string) =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "production";

const today = () => new Date().toISOString().slice(0, 10);

export const expensesFileName = (title: string, ext: "xlsx" | "csv") =>
  `expenses-${slug(title)}-${today()}.${ext}`;

export const expenseReportFileName = (title: string) =>
  `expense-report-${slug(title)}-${today()}.pdf`;

const dayLabel = (iso: string) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const dateOnly = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : "");

const stampLabel = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
};

/** "Status: Approved · Props · Oct 1–Oct 14" — describes what the export contains. */
export function describeFilters(filters?: ExpenseExportFilters): string {
  if (!filters) return "All expenses";
  const parts: string[] = [];
  if (filters.status) parts.push(`Status: ${statusDef(filters.status).label}`);
  if (filters.department) parts.push(filters.department);
  if (filters.payment) parts.push(paymentLabel(filters.payment));
  if (filters.from || filters.to) {
    if (filters.from && filters.to) parts.push(`${dayLabel(filters.from)}–${dayLabel(filters.to)}`);
    else if (filters.from) parts.push(`From ${dayLabel(filters.from)}`);
    else parts.push(`Until ${dayLabel(filters.to as string)}`);
  }
  if (filters.q) parts.push(`Search: "${filters.q}"`);
  return parts.length ? parts.join(" · ") : "All expenses";
}

const linkedLabel = (
  expense: Expense,
  linkedItems?: ExpenseExportInput["linkedItems"],
) => {
  if (!expense.linked_item_id) return "";
  const info = linkedItems?.[expense.linked_item_id];
  return info ? `${info.scene} · ${info.department} · ${info.text}` : "Linked item";
};

export const EXPENSE_COLUMNS = [
  "Date", "Submitted by", "Email", "Department", "Type", "Invoice #", "Vendor",
  "Description", "Currency", "Amount", "Payment method", "Status", "Status note",
  "Decided by", "Decided at", "Notes", "Linked checklist item", "Via crew link",
];

type Row = (string | number)[];

const expenseRows = (input: ExpenseExportInput): Row[] =>
  input.expenses.map((e) => [
    e.expense_date || "",
    e.submitted_by_name || "",
    e.submitted_by_email || "",
    e.department || "",
    e.kind === "invoice" ? "Invoice" : "Receipt",
    e.invoice_number || "",
    e.vendor || "",
    e.description || "",
    (e.currency || "").toUpperCase(),
    round2(e.amount),
    paymentLabel(e.payment_method),
    statusDef(e.status).label,
    e.status_note || "",
    e.decided_by_name || "",
    stampLabel(e.decided_at),
    e.notes || "",
    linkedLabel(e, input.linkedItems),
    e.submitted_by_crew_id ? "Yes" : "No",
  ]);

/* ---------------------------------- totals --------------------------------- */

interface CurrencyTotals {
  currency: string;
  submitted: number;
  approved: number;
  pending: number;
  paid: number;
  rejected: number;
  departments: { department: string; settled: number; pending: number }[];
}

/** Groups by currency — amounts in different currencies are never added together. */
export function currencyTotals(expenses: Expense[]): CurrencyTotals[] {
  const map = new Map<string, CurrencyTotals>();
  const deptMap = new Map<string, Map<string, { settled: number; pending: number }>>();

  expenses.forEach((e) => {
    const code = (e.currency || "USD").toUpperCase();
    if (!map.has(code)) {
      map.set(code, { currency: code, submitted: 0, approved: 0, pending: 0, paid: 0, rejected: 0, departments: [] });
      deptMap.set(code, new Map());
    }
    const t = map.get(code) as CurrencyTotals;
    const amount = round2(e.amount);
    t.submitted += amount;
    if (e.status === "approved") t.approved += amount;
    else if (e.status === "pending") t.pending += amount;
    else if (e.status === "paid") t.paid += amount;
    else if (e.status === "rejected") t.rejected += amount;

    const dept = e.department || "Other";
    const byDept = deptMap.get(code) as Map<string, { settled: number; pending: number }>;
    if (!byDept.has(dept)) byDept.set(dept, { settled: 0, pending: 0 });
    const d = byDept.get(dept) as { settled: number; pending: number };
    if (e.status === "approved" || e.status === "paid") d.settled += amount;
    else if (e.status === "pending") d.pending += amount;
  });

  return [...map.values()]
    .map((t) => ({
      ...t,
      submitted: round2(t.submitted),
      approved: round2(t.approved),
      pending: round2(t.pending),
      paid: round2(t.paid),
      rejected: round2(t.rejected),
      departments: [...(deptMap.get(t.currency) as Map<string, { settled: number; pending: number }>).entries()]
        .map(([department, v]) => ({ department, settled: round2(v.settled), pending: round2(v.pending) }))
        .sort((a, b) => b.settled - a.settled || a.department.localeCompare(b.department)),
    }))
    .sort((a, b) => b.submitted - a.submitted);
}

/* ----------------------------------- XLSX ---------------------------------- */

const setNumberFormat = (sheet: XLSX.WorkSheet, column: number, rows: number[]) => {
  rows.forEach((r) => {
    const ref = XLSX.utils.encode_cell({ c: column, r });
    const cell = sheet[ref] as XLSX.CellObject | undefined;
    if (cell && cell.t === "n") cell.z = "0.00";
  });
};

export function buildExpensesWorkbook(input: ExpenseExportInput): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  // Expenses
  const rows = expenseRows(input);
  const expensesSheet = XLSX.utils.aoa_to_sheet([EXPENSE_COLUMNS, ...rows]);
  expensesSheet["!cols"] = EXPENSE_COLUMNS.map((c, i) => ({ wch: i === 7 || i === 15 || i === 16 ? 34 : Math.max(12, c.length + 2) }));
  setNumberFormat(expensesSheet, 9, rows.map((_, i) => i + 1));
  XLSX.utils.book_append_sheet(wb, expensesSheet, "Expenses");

  // Summary
  const totals = currencyTotals(input.expenses);
  const summary: Row[] = [["Currency", "Submitted", "Approved", "Pending", "Paid", "Rejected"]];
  totals.forEach((t) => summary.push([t.currency, t.submitted, t.approved, t.pending, t.paid, t.rejected]));
  totals.forEach((t) => {
    summary.push([]);
    summary.push([`By department — ${t.currency}`]);
    summary.push(["Department", "Approved + paid", "Pending"]);
    t.departments.forEach((d) => summary.push([d.department, d.settled, d.pending]));
  });
  const summarySheet = XLSX.utils.aoa_to_sheet(summary);
  summarySheet["!cols"] = [{ wch: 28 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
  summary.forEach((_, r) => setNumberFormat(summarySheet, 1, [r]));
  [2, 3, 4, 5].forEach((c) => summary.forEach((_, r) => setNumberFormat(summarySheet, c, [r])));
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  // Line items
  const lineRows: Row[] = [];
  input.expenses.forEach((e) => {
    (e.line_items || []).forEach((l) => {
      lineRows.push([
        e.expense_date || "",
        e.submitted_by_name || "",
        e.kind === "invoice" ? "Invoice" : "Receipt",
        e.invoice_number || "",
        l.text || "",
        l.qty ?? "",
        l.rate ?? "",
        round2(l.amount),
        (e.currency || "").toUpperCase(),
      ]);
    });
  });
  const lineHead = ["Date", "Submitted by", "Type", "Invoice #", "Description", "Qty", "Rate", "Amount", "Currency"];
  const lineSheet = XLSX.utils.aoa_to_sheet([lineHead, ...lineRows]);
  lineSheet["!cols"] = [{ wch: 12 }, { wch: 18 }, { wch: 10 }, { wch: 12 }, { wch: 40 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 10 }];
  [5, 6, 7].forEach((c) => setNumberFormat(lineSheet, c, lineRows.map((_, i) => i + 1)));
  XLSX.utils.book_append_sheet(wb, lineSheet, "Line items");

  return wb;
}

export function exportExpensesToXLSX(input: ExpenseExportInput): void {
  XLSX.writeFile(buildExpensesWorkbook(input), expensesFileName(input.productionTitle, "xlsx"));
}

/* ------------------------------------ CSV ---------------------------------- */

const csvCell = (value: string | number) => {
  const s = typeof value === "number" ? value.toFixed(2) : (value ?? "").toString();
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function buildExpensesCSV(input: ExpenseExportInput): string {
  const rows = [EXPENSE_COLUMNS, ...expenseRows(input)];
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
}

export function exportExpensesToCSV(input: ExpenseExportInput): void {
  // BOM so Excel reads UTF-8 accents correctly.
  const blob = new Blob([`\uFEFF${buildExpensesCSV(input)}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = expensesFileName(input.productionTitle, "csv");
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------ PDF ---------------------------------- */

interface LoadedImage {
  dataUrl: string;
  width: number;
  height: number;
  caption: string;
}

const isPdfPath = (path: string) => /\.pdf$/i.test(path);

async function fetchReceiptImages(input: ExpenseExportInput): Promise<{ images: LoadedImage[]; pdfNotes: string[] }> {
  const images: LoadedImage[] = [];
  const pdfNotes: string[] = [];

  for (const e of input.expenses) {
    const path = e.receipt_path;
    if (!path) continue;
    const caption = `${e.expense_date} · ${e.submitted_by_name} · ${formatMoney(e.amount, e.currency)}`;
    if (isPdfPath(path)) {
      pdfNotes.push(`${caption} — PDF receipt — see app`);
      continue;
    }
    const url = input.signedUrls?.[path];
    if (!url) continue;
    try {
      const loaded = await new Promise<LoadedImage>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const max = 1400;
          const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
          const w = Math.max(1, Math.round(img.naturalWidth * scale));
          const h = Math.max(1, Math.round(img.naturalHeight * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("no canvas")); return; }
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.8), width: w, height: h, caption });
        };
        img.onerror = () => reject(new Error("image failed"));
        img.src = url;
      });
      images.push(loaded);
    } catch {
      pdfNotes.push(`${caption} — receipt image could not be loaded`);
    }
  }
  return { images, pdfNotes };
}

export async function buildExpensesPDF(input: ExpenseExportInput): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { body } = await loadUnicodeFonts(doc);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - MARGIN * 2;
  let y = 30;

  const ensure = (needed: number) => {
    if (y + needed > pageH - 20) { doc.addPage(); y = 30; }
  };

  const line = (text: string, size: number, style: "normal" | "bold", grey = false) => {
    doc.setFont(body, style);
    doc.setFontSize(size);
    doc.setTextColor(grey ? 110 : 20, grey ? 110 : 20, grey ? 110 : 20);
    const lines = doc.splitTextToSize(text, contentW) as string[];
    ensure(lines.length * (size * 0.45) + 2);
    lines.forEach((l) => { doc.text(l, MARGIN, y); y += size * 0.45; });
  };

  const tableStyles = {
    font: body, fontSize: 9, cellPadding: 2, textColor: [30, 30, 30] as [number, number, number],
    overflow: "linebreak" as const, lineColor: [200, 200, 200] as [number, number, number], lineWidth: 0.1,
  };
  const headStyles = {
    font: body, fontStyle: "bold" as const, fillColor: [238, 238, 238] as [number, number, number],
    textColor: [20, 20, 20] as [number, number, number], fontSize: 9,
  };

  const totals = currencyTotals(input.expenses);

  line("SUMMARY", 11, "bold");
  y += 1;
  if (!totals.length) {
    line("No expenses match these filters.", 9, "normal", true);
    y += 4;
  }

  totals.forEach((t) => {
    ensure(26);
    line(t.currency, 10, "bold");
    autoTable(doc, {
      startY: y,
      head: [["Submitted", "Approved", "Pending", "Paid", "Rejected"]],
      body: [[
        formatMoney(t.submitted, t.currency),
        formatMoney(t.approved, t.currency),
        formatMoney(t.pending, t.currency),
        formatMoney(t.paid, t.currency),
        formatMoney(t.rejected, t.currency),
      ]],
      margin: { left: MARGIN, right: MARGIN, top: 30, bottom: 20 },
      theme: "grid",
      styles: tableStyles,
      headStyles,
      columnStyles: { 0: { halign: "right" }, 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" } },
    });
    // @ts-expect-error lastAutoTable is added by jspdf-autotable
    y = (doc.lastAutoTable?.finalY ?? y) + 4;

    if (t.departments.length) {
      ensure(20);
      line(`By department — ${t.currency}`, 9, "bold");
      autoTable(doc, {
        startY: y,
        head: [["Department", "Approved + paid", "Pending"]],
        body: t.departments.map((d) => [d.department, formatMoney(d.settled, t.currency), formatMoney(d.pending, t.currency)]),
        margin: { left: MARGIN, right: MARGIN, top: 30, bottom: 20 },
        theme: "grid",
        styles: tableStyles,
        headStyles,
        columnStyles: { 0: { cellWidth: "auto" }, 1: { cellWidth: 38, halign: "right" }, 2: { cellWidth: 30, halign: "right" } },
      });
      // @ts-expect-error lastAutoTable is added by jspdf-autotable
      y = (doc.lastAutoTable?.finalY ?? y) + 6;
    }
  });

  if (input.expenses.length) {
    ensure(24);
    line("EXPENSES", 11, "bold");
    autoTable(doc, {
      startY: y,
      head: [["Date", "Submitted by", "Dept", "Type / Invoice #", "Vendor / Description", "Payment", "Status", "Amount"]],
      body: input.expenses.map((e) => [
        e.expense_date || "",
        e.submitted_by_name || "",
        e.department || "",
        `${e.kind === "invoice" ? "Invoice" : "Receipt"}${e.invoice_number ? `\n${e.invoice_number}` : ""}`,
        [e.vendor, e.description].filter(Boolean).join("\n"),
        paymentLabel(e.payment_method),
        statusDef(e.status).label,
        formatMoney(e.amount, e.currency),
      ]),
      margin: { left: MARGIN, right: MARGIN, top: 30, bottom: 20 },
      theme: "grid",
      styles: { ...tableStyles, fontSize: 8 },
      headStyles: { ...headStyles, fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 16 },
        1: { cellWidth: 24 },
        2: { cellWidth: 22 },
        3: { cellWidth: 22 },
        4: { cellWidth: "auto" },
        5: { cellWidth: 21 },
        6: { cellWidth: 17 },
        7: { cellWidth: 24, halign: "right" },
      },
    });
    // @ts-expect-error lastAutoTable is added by jspdf-autotable
    y = (doc.lastAutoTable?.finalY ?? y) + 6;
  }

  if (input.includeImages) {
    const { images, pdfNotes } = await fetchReceiptImages(input);
    if (pdfNotes.length) {
      ensure(20);
      line("RECEIPT FILES NOT PRINTED", 11, "bold");
      pdfNotes.forEach((n) => line(n, 8.5, "normal", true));
      y += 4;
    }
    images.forEach((img) => {
      doc.addPage();
      y = 30;
      doc.setFont(body, "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(doc.splitTextToSize(img.caption, contentW) as string[], MARGIN, y);
      y += 6;
      const availH = pageH - y - 20;
      const scale = Math.min(contentW / img.width, availH / img.height);
      doc.addImage(img.dataUrl, "JPEG", MARGIN, y, img.width * scale, img.height * scale);
    });
  }

  const generated = new Date().toLocaleString();
  const filterText = describeFilters(input.filters);
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFont(body, "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(`EXPENSE REPORT — ${input.productionTitle}`, MARGIN, 13);
    doc.setFont(body, "normal");
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    if (input.company) doc.text(input.company, pageW - MARGIN, 13, { align: "right" });
    doc.text(filterText, MARGIN, 18);
    doc.text(`Generated ${generated}`, pageW - MARGIN, 18, { align: "right" });
    doc.setDrawColor(190, 190, 190);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, 21, pageW - MARGIN, 21);

    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text("filmmakergenius.com", MARGIN, pageH - 10);
    doc.text(`Page ${i} of ${pages}`, pageW - MARGIN, pageH - 10, { align: "right" });
  }

  return doc;
}

export async function exportExpensesToPDF(input: ExpenseExportInput): Promise<void> {
  const doc = await buildExpensesPDF(input);
  doc.save(expenseReportFileName(input.productionTitle));
}
