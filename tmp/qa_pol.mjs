import { jsPDF } from "jspdf";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const productionName = "Midnight Short";
const preparedBy = "Jane Doe";
const asOfDate = "2026-08-14";
const rows = [
  { poNumber: "PO-001", poDate: "2026-08-01", vendor: "Lens Rentals Inc.", description: "Camera package + lenses", amount: 2400, status: "Paid" },
  { poNumber: "PO-002", poDate: "2026-08-05", vendor: "Grip & Electric", description: "Lighting kit for warehouse scene", amount: 850, status: "Open" },
  { poNumber: "PO-003", poDate: "2026-08-10", vendor: "Catering Co.", description: "Catering for 3 days", amount: 1200, status: "Partial" },
  { poNumber: "PO-004", poDate: "2026-08-12", vendor: "Prop House", description: "Period furniture rental", amount: 0, status: "Cancelled" },
];

const grandTotal = rows.reduce((sum, row) => sum + row.amount, 0);
const committedTotal = rows.reduce((sum, row) => (row.status !== "Cancelled" ? sum + row.amount : sum), 0);

const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 16;
const contentWidth = pageWidth - margin * 2;

const footer = () => {
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(120, 120, 120);
  doc.text("Filmmaker Genius — Document Library.", margin, pageHeight - 10);
  doc.setTextColor(0, 0, 0);
};

let y = margin;

const ensure = (needed) => {
  if (y + needed > pageHeight - 18) {
    footer();
    doc.addPage();
    y = margin;
  }
};

const writeLine = (label, value, placeholder) => {
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const labelText = `${label}: `;
  const labelWidth = doc.getTextWidth(labelText);
  doc.setFont("helvetica", "normal");
  const display = value.trim() || `[${placeholder}]`;
  const lines = doc.splitTextToSize(display, contentWidth - labelWidth);
  ensure(lines.length * 5 + 2);
  doc.setFont("helvetica", "bold");
  doc.text(labelText, margin, y);
  doc.setFont("helvetica", "normal");
  lines.forEach((line, i) => {
    doc.text(line, margin + labelWidth, y + i * 5);
  });
  y += lines.length * 5 + 2;
};

doc.setFontSize(15);
doc.setFont("helvetica", "bold");
doc.text("PURCHASE ORDER LOG", pageWidth / 2, y, { align: "center" });
y += 9;

doc.setDrawColor(150, 150, 150);
doc.line(margin, y, pageWidth - margin, y);
y += 8;

[["Production", productionName, "Production Name"], ["Prepared By", preparedBy, "Prepared By"], ["As Of", asOfDate, "As Of Date"]].forEach(([label, value, placeholder]) => writeLine(label, value, placeholder));

y += 4;
ensure(10);
doc.setFontSize(11);
doc.setFont("helvetica", "bold");
doc.text("PURCHASE ORDERS", margin, y);
y += 6;

const colX = {
  poNumber: margin,
  poDate: margin + 38,
  vendor: margin + 74,
  description: margin + 138,
  amount: margin + contentWidth * 0.82,
  status: margin + contentWidth * 0.93,
};

const drawTableHeader = () => {
  ensure(10);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PO #", colX.poNumber + 2, y);
  doc.text("Date", colX.poDate + 2, y);
  doc.text("Vendor", colX.vendor + 2, y);
  doc.text("Description", colX.description + 2, y);
  doc.text("Amount", colX.amount + 2, y);
  doc.text("Status", colX.status + 2, y);
  y += 5;
  doc.setDrawColor(180, 180, 180);
  doc.line(margin, y - 2, pageWidth - margin, y - 2);
};

drawTableHeader();

doc.setFont("helvetica", "normal");
doc.setFontSize(9);
rows.forEach((row) => {
  const amount = row.amount;
  const descLines = doc.splitTextToSize(row.description.trim() || "—", colX.amount - colX.description - 6);
  const rowHeight = Math.max(descLines.length * 5 + 4, 10);
  ensure(rowHeight + 4);

  doc.text(row.poNumber.trim() || "—", colX.poNumber + 2, y + 4);
  doc.text(row.poDate.trim() || "—", colX.poDate + 2, y + 4);
  doc.text(row.vendor.trim() || "—", colX.vendor + 2, y + 4);
  descLines.forEach((line, i) => doc.text(line, colX.description + 2, y + 4 + i * 5));
  doc.text(formatMoney(amount), colX.amount + 2, y + 4, { align: "right" });
  doc.text(row.status.trim() || "—", colX.status + 2, y + 4);

  y += rowHeight;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y - 2, pageWidth - margin, y - 2);
  doc.setDrawColor(180, 180, 180);
});

y += 6;
const totalsX = pageWidth - margin;
const labelX = margin + contentWidth * 0.65;

ensure(30);
doc.setFontSize(10);
doc.setFont("helvetica", "normal");
doc.text("Grand Total", labelX, y);
doc.text(formatMoney(grandTotal), totalsX, y, { align: "right" });
y += 6;

doc.setFont("helvetica", "bold");
doc.text("Committed (excl. cancelled)", labelX, y);
doc.text(formatMoney(committedTotal), totalsX, y, { align: "right" });
y += 10;

footer();

doc.save("/tmp/purchase_order_log_qa.pdf");
console.log("saved /tmp/purchase_order_log_qa.pdf");
