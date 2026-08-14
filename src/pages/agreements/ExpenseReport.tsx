import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer, RotateCcw, Trash2, Plus } from "lucide-react";

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const CATEGORIES = ["Travel", "Meals", "Lodging", "Supplies", "Transportation", "Other"] as const;

interface Expense {
  date: string;
  category: string;
  description: string;
  amount: number;
  receipt: boolean;
}

const emptyExpense = (): Expense => ({
  date: "",
  category: "Supplies",
  description: "",
  amount: 0,
  receipt: false,
});

const ExpenseReport = () => {
  const [productionName, setProductionName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [claimant, setClaimant] = useState("");
  const [department, setDepartment] = useState("");
  const [purpose, setPurpose] = useState("");
  const [reimburseTo, setReimburseTo] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([emptyExpense()]);

  const updateExpense = (index: number, patch: Partial<Expense>) =>
    setExpenses((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addExpense = () => setExpenses((rows) => [...rows, emptyExpense()]);
  const removeExpense = (index: number) =>
    setExpenses((rows) => (rows.length > 1 ? rows.filter((_, i) => i !== index) : rows));

  const grandTotal = useMemo(
    () => expenses.reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0),
    [expenses]
  );

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((row) => {
      const amount = Number.isFinite(row.amount) ? row.amount : 0;
      const key = row.category || "Other";
      totals[key] = (totals[key] || 0) + amount;
    });
    return totals;
  }, [expenses]);

  const visibleCategories = useMemo(
    () => Object.entries(categoryTotals).filter(([, total]) => total > 0),
    [categoryTotals]
  );

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Date", reportDate, "Date"],
    ["Claimant", claimant, "Claimant"],
    ["Department", department, "Department"],
    ["Purpose", purpose, "Purpose of Expenses"],
  ] as const;

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
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
    const ensure = (needed: number) => {
      if (y + needed > pageHeight - 18) {
        footer();
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("EXPENSE REPORT", pageWidth / 2, y, { align: "center" });
    y += 9;
    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = `${label}: `;
      const labelWidth = doc.getTextWidth(labelText);
      doc.setFont("helvetica", "normal");
      const wrapped = doc.splitTextToSize(value.trim() || `[${placeholder}]`, contentWidth - labelWidth) as string[];
      ensure(wrapped.length * 5 + 2);
      doc.setFont("helvetica", "bold");
      doc.text(labelText, margin, y);
      doc.setFont("helvetica", "normal");
      wrapped.forEach((line, i) => doc.text(line, margin + labelWidth, y + i * 5));
      y += wrapped.length * 5 + 1;
    });

    y += 5;

    const colDate = margin;
    const colCategory = margin + 26;
    const colDescription = margin + 58;
    const colRcpt = pageWidth - margin - 32;
    const colAmountRight = pageWidth - margin;
    const descriptionWidth = colRcpt - colDescription - 4;

    const drawTableHeader = () => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Date", colDate, y);
      doc.text("Category", colCategory, y);
      doc.text("Description", colDescription, y);
      doc.text("Rcpt", colRcpt, y);
      doc.text("Amount", colAmountRight, y, { align: "right" });
      y += 2;
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
    };

    ensure(20);
    drawTableHeader();

    expenses.forEach((row) => {
      const descLines = doc.splitTextToSize(row.description.trim() || "—", descriptionWidth) as string[];
      const rowHeight = Math.max(descLines.length, 1) * 5 + 2;
      if (ensure(rowHeight + 6)) drawTableHeader();
      doc.setFontSize(9);
      doc.text(row.date.trim() || "—", colDate, y);
      doc.text(row.category || "—", colCategory, y);
      descLines.forEach((line, i) => doc.text(line, colDescription, y + i * 5));
      doc.text(row.receipt ? "Y" : "", colRcpt, y);
      doc.text(formatMoney(Number.isFinite(row.amount) ? row.amount : 0), colAmountRight, y, { align: "right" });
      y += rowHeight;
    });

    y += 6;
    ensure(20 + visibleCategories.length * 6);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BY CATEGORY", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    if (visibleCategories.length === 0) {
      doc.text("—", margin, y);
      y += 6;
    } else {
      visibleCategories.forEach(([category, total]) => {
        doc.text(category, colAmountRight - 40, y, { align: "right" });
        doc.text(formatMoney(total), colAmountRight, y, { align: "right" });
        y += 6;
      });
    }

    doc.line(colAmountRight - 60, y - 4, colAmountRight, y - 4);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", colAmountRight - 40, y, { align: "right" });
    doc.text(formatMoney(grandTotal), colAmountRight, y, { align: "right" });
    y += 10;

    if (reimburseTo.trim()) {
      ensure(10);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = "Reimburse To: ";
      const labelWidth = doc.getTextWidth(labelText);
      doc.text(labelText, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(reimburseTo.trim(), margin + labelWidth, y);
      y += 10;
    }

    ensure(40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Claimant", margin, y);
    doc.text("Approved By", margin + contentWidth / 2, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Signature: _________________________________", margin, y);
    doc.text("Signature: _________________________________", margin + contentWidth / 2, y);
    y += 7;
    doc.text(`Print name: ${claimant.trim() || "—"}`, margin, y);
    doc.text(`Print name: ${approvedBy.trim() || "—"}`, margin + contentWidth / 2, y);
    y += 7;
    doc.text("Date: _______________", margin, y);
    doc.text("Date: _______________", margin + contentWidth / 2, y);

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safe = (s: string, f: string) => (s || f).replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(
      `${safe(productionName, "Production")}_${safe(claimant, "Claimant")}_${safe(reportDate, "Date")}_Expense_Report.pdf`
    );
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setReportDate("");
    setClaimant("");
    setDepartment("");
    setPurpose("");
    setReimburseTo("");
    setApprovedBy("");
    setExpenses([emptyExpense()]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Expense Report</h1>
          <p className="text-muted-foreground">
            A reimbursement claim — itemized expenses, category totals, and a grand total.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Crew claiming reimbursable expenses.</li>
                <li>Coordinators and accountants approving claims.</li>
                <li>Anyone tracking out-of-pocket spend.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Itemizes each expense with category.</li>
                <li>Subtotals by category and totals the claim.</li>
                <li>Confirms receipts and captures sign-off.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="production_name">Production Name</Label>
                  <Input id="production_name" value={productionName} onChange={(e) => setProductionName(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="report_date">Date</Label>
                    <Input id="report_date" type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="claimant">Claimant</Label>
                    <Input id="claimant" value={claimant} onChange={(e) => setClaimant(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose of Expenses</Label>
                  <Input id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenses.map((row, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2">
                    <Input
                      type="date"
                      className="w-36"
                      value={row.date}
                      onChange={(e) => updateExpense(index, { date: e.target.value })}
                    />
                    <Select value={row.category} onValueChange={(value) => updateExpense(index, { category: value })}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      className="flex-1 min-w-[10rem]"
                      placeholder="Description"
                      value={row.description}
                      onChange={(e) => updateExpense(index, { description: e.target.value })}
                    />
                    <Input
                      type="number"
                      className="w-28 text-right"
                      placeholder="0.00"
                      value={row.amount === 0 ? "" : row.amount}
                      onChange={(e) => updateExpense(index, { amount: parseFloat(e.target.value) || 0 })}
                    />
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        id={`receipt-${index}`}
                        checked={row.receipt}
                        onCheckedChange={(checked) => updateExpense(index, { receipt: checked === true })}
                      />
                      <Label htmlFor={`receipt-${index}`} className="text-xs font-normal">
                        Receipt
                      </Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExpense(index)}
                      disabled={expenses.length === 1}
                      aria-label="Remove expense"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addExpense}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reimburse</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="reimburse_to">Reimburse To / Method (optional)</Label>
                  <Input id="reimburse_to" value={reimburseTo} onChange={(e) => setReimburseTo(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sign-Off</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="approved_by">Approved By</Label>
                  <Input id="approved_by" value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="ghost" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* RIGHT: preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white text-black rounded-md p-6 text-sm leading-relaxed max-h-[70vh] overflow-y-auto">
                  <h2 className="text-center font-bold text-base mb-4 border-b border-gray-400 pb-2">EXPENSE REPORT</h2>

                  <div className="space-y-1 mb-4">
                    {headerRows.map(([label, value, placeholder]) => (
                      <p key={label}>
                        <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                      </p>
                    ))}
                  </div>

                  <table className="w-full text-xs mb-4">
                    <thead>
                      <tr className="border-b border-gray-500">
                        <th className="text-left py-1">Date</th>
                        <th className="text-left py-1">Category</th>
                        <th className="text-left py-1">Description</th>
                        <th className="text-center py-1">Receipt</th>
                        <th className="text-right py-1">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-1 align-top">{row.date.trim() || "—"}</td>
                          <td className="py-1 align-top">{row.category || "—"}</td>
                          <td className="py-1 align-top">{row.description.trim() || "—"}</td>
                          <td className="py-1 align-top text-center">{row.receipt ? "✓" : ""}</td>
                          <td className="py-1 align-top text-right">
                            {formatMoney(Number.isFinite(row.amount) ? row.amount : 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="ml-auto w-64 space-y-1 text-xs">
                    <p className="font-semibold uppercase tracking-wide">By Category</p>
                    {visibleCategories.length === 0 ? (
                      <p className="text-gray-600">—</p>
                    ) : (
                      visibleCategories.map(([category, total]) => (
                        <div key={category} className="flex justify-between">
                          <span>{category}</span>
                          <span>{formatMoney(total)}</span>
                        </div>
                      ))
                    )}
                    <div className="flex justify-between font-bold border-t border-gray-500 pt-1">
                      <span>TOTAL</span>
                      <span>{formatMoney(grandTotal)}</span>
                    </div>
                  </div>

                  {reimburseTo.trim() && (
                    <p className="mt-4">
                      <span className="font-semibold">Reimburse To:</span> {reimburseTo.trim()}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-6 pt-4 mt-4 border-t border-gray-300">
                    <div>
                      <p className="font-semibold mb-4">Claimant</p>
                      <p className="border-t border-gray-500 pt-1">Signature</p>
                      <p className="text-xs">{v(claimant, "Claimant")}</p>
                      <p className="border-t border-gray-500 pt-1 mt-4">Date</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-4">Approved By</p>
                      <p className="border-t border-gray-500 pt-1">Signature</p>
                      <p className="text-xs">{v(approvedBy, "Approved By")}</p>
                      <p className="border-t border-gray-500 pt-1 mt-4">Date</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">Filmmaker Genius — Document Library.</p>
      </div>
    </div>
  );
};

export default ExpenseReport;
