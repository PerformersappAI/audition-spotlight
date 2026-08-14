import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Printer, RotateCcw, Trash2, Plus } from "lucide-react";

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

interface Receipt {
  date: string;
  vendor: string;
  purpose: string;
  amount: number;
}

const emptyReceipt = (): Receipt => ({ date: "", vendor: "", purpose: "", amount: 0 });

const PettyCashReconciliation = () => {
  const [productionName, setProductionName] = useState("");
  const [envelopeDate, setEnvelopeDate] = useState("");
  const [holder, setHolder] = useState("");
  const [department, setDepartment] = useState("");
  const [floatAmount, setFloatAmount] = useState("");
  const [cashReturned, setCashReturned] = useState("");
  const [reconciledBy, setReconciledBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [receipts, setReceipts] = useState<Receipt[]>([emptyReceipt()]);

  const updateReceipt = (index: number, patch: Partial<Receipt>) =>
    setReceipts((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addReceipt = () => setReceipts((rows) => [...rows, emptyReceipt()]);
  const removeReceipt = (index: number) =>
    setReceipts((rows) => (rows.length > 1 ? rows.filter((_, i) => i !== index) : rows));

  const totalSpent = useMemo(
    () => receipts.reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0),
    [receipts]
  );
  const floatValue = useMemo(() => parseFloat(floatAmount) || 0, [floatAmount]);
  const returned = useMemo(() => parseFloat(cashReturned) || 0, [cashReturned]);
  const difference = useMemo(() => floatValue - totalSpent - returned, [floatValue, totalSpent, returned]);
  const balanced = Math.abs(difference) < 0.005;

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Date", envelopeDate, "Date"],
    ["Float Holder", holder, "Float Holder"],
    ["Department", department, "Department"],
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
    doc.text("PETTY CASH RECONCILIATION", pageWidth / 2, y, { align: "center" });
    y += 9;
    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = `${label}: `;
      const labelWidth = doc.getTextWidth(labelText);
      ensure(7);
      doc.text(labelText, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(value.trim() || `[${placeholder}]`, margin + labelWidth, y);
      y += 6;
    });

    y += 4;

    // Receipts table
    const colDate = margin;
    const colVendor = margin + 26;
    const colPurpose = margin + 66;
    const colAmountRight = pageWidth - margin;
    const purposeWidth = contentWidth - 66 - 26;

    const drawTableHeader = () => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Date", colDate, y);
      doc.text("Vendor", colVendor, y);
      doc.text("Purpose", colPurpose, y);
      doc.text("Amount", colAmountRight, y, { align: "right" });
      y += 2;
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
    };

    ensure(20);
    drawTableHeader();

    receipts.forEach((row) => {
      const purposeLines = doc.splitTextToSize(row.purpose.trim() || "—", purposeWidth) as string[];
      const rowHeight = Math.max(purposeLines.length, 1) * 5 + 2;
      if (ensure(rowHeight + 6)) drawTableHeader();
      doc.setFontSize(9);
      doc.text(row.date.trim() || "—", colDate, y);
      doc.text(doc.splitTextToSize(row.vendor.trim() || "—", 38)[0] as string, colVendor, y);
      purposeLines.forEach((line, i) => doc.text(line, colPurpose, y + i * 5));
      doc.text(formatMoney(Number.isFinite(row.amount) ? row.amount : 0), colAmountRight, y, { align: "right" });
      y += rowHeight;
    });

    y += 4;
    ensure(46);

    const stack: Array<[string, number, boolean]> = [
      ["Float Advanced", floatValue, false],
      ["Less: Total Spent", totalSpent, false],
      ["Less: Cash Returned", returned, false],
    ];

    doc.setFontSize(10);
    stack.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, colAmountRight - 40, y, { align: "right" });
      doc.text(formatMoney(value), colAmountRight, y, { align: "right" });
      y += 6;
    });

    doc.line(colAmountRight - 60, y - 4, colAmountRight, y - 4);
    doc.setFont("helvetica", "bold");
    doc.text("Difference", colAmountRight - 40, y, { align: "right" });
    doc.text(formatMoney(difference), colAmountRight, y, { align: "right" });
    y += 9;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      balanced ? "BALANCED" : `OUT OF BALANCE by ${formatMoney(Math.abs(difference))}`,
      margin,
      y
    );
    y += 12;

    ensure(40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Reconciled By", margin, y);
    doc.text("Approved By", margin + contentWidth / 2, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Signature: _________________________________", margin, y);
    doc.text("Signature: _________________________________", margin + contentWidth / 2, y);
    y += 7;
    doc.text(`Print name: ${reconciledBy.trim() || "—"}`, margin, y);
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
    doc.save(`${safe(productionName, "Production")}_${safe(envelopeDate, "Date")}_Petty_Cash_Reconciliation.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setEnvelopeDate("");
    setHolder("");
    setDepartment("");
    setFloatAmount("");
    setCashReturned("");
    setReconciledBy("");
    setApprovedBy("");
    setReceipts([emptyReceipt()]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Petty Cash Reconciliation</h1>
          <p className="text-muted-foreground">Reconcile a cash float — receipts, cash spent, and cash returned.</p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Anyone issued a petty cash float.</li>
                <li>Coordinators and accountants reconciling cash.</li>
                <li>Departments tracking small purchases.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists each receipt with vendor and amount.</li>
                <li>Totals cash spent against the float.</li>
                <li>Confirms the envelope balances to zero.</li>
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
                    <Label htmlFor="envelope_date">Date</Label>
                    <Input id="envelope_date" type="date" value={envelopeDate} onChange={(e) => setEnvelopeDate(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="holder">Float Holder</Label>
                    <Input id="holder" value={holder} onChange={(e) => setHolder(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="float_amount">Float Advanced</Label>
                    <Input id="float_amount" type="number" value={floatAmount} onChange={(e) => setFloatAmount(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receipts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {receipts.map((row, index) => (
                  <div key={index} className="flex flex-wrap items-end gap-2">
                    <Input
                      type="date"
                      className="w-36"
                      value={row.date}
                      onChange={(e) => updateReceipt(index, { date: e.target.value })}
                    />
                    <Input
                      className="w-40"
                      placeholder="Vendor"
                      value={row.vendor}
                      onChange={(e) => updateReceipt(index, { vendor: e.target.value })}
                    />
                    <Input
                      className="flex-1 min-w-[10rem]"
                      placeholder="Purpose"
                      value={row.purpose}
                      onChange={(e) => updateReceipt(index, { purpose: e.target.value })}
                    />
                    <Input
                      type="number"
                      className="w-28 text-right"
                      value={row.amount === 0 ? "" : row.amount}
                      placeholder="0.00"
                      onChange={(e) => updateReceipt(index, { amount: parseFloat(e.target.value) || 0 })}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeReceipt(index)}
                      disabled={receipts.length === 1}
                      aria-label="Remove receipt"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addReceipt}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Receipt
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="cash_returned">Cash Returned</Label>
                  <Input id="cash_returned" type="number" value={cashReturned} onChange={(e) => setCashReturned(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sign-Off</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reconciled_by">Reconciled By</Label>
                  <Input id="reconciled_by" value={reconciledBy} onChange={(e) => setReconciledBy(e.target.value)} />
                </div>
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
                  <h2 className="text-center font-bold text-base mb-4 border-b border-gray-400 pb-2">
                    PETTY CASH RECONCILIATION
                  </h2>

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
                        <th className="text-left py-1">Vendor</th>
                        <th className="text-left py-1">Purpose</th>
                        <th className="text-right py-1">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipts.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-1 align-top">{row.date.trim() || "—"}</td>
                          <td className="py-1 align-top">{row.vendor.trim() || "—"}</td>
                          <td className="py-1 align-top">{row.purpose.trim() || "—"}</td>
                          <td className="py-1 align-top text-right">
                            {formatMoney(Number.isFinite(row.amount) ? row.amount : 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="ml-auto w-64 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Float Advanced</span>
                      <span>{formatMoney(floatValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Less: Total Spent</span>
                      <span>{formatMoney(totalSpent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Less: Cash Returned</span>
                      <span>{formatMoney(returned)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-500 pt-1">
                      <span>Difference</span>
                      <span>{formatMoney(difference)}</span>
                    </div>
                  </div>

                  <p
                    className={`mt-3 inline-block rounded px-2 py-1 text-xs font-bold ${
                      balanced ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {balanced ? "BALANCED" : `OUT OF BALANCE by ${formatMoney(Math.abs(difference))}`}
                  </p>

                  <div className="grid grid-cols-2 gap-6 pt-4 mt-4 border-t border-gray-300">
                    <div>
                      <p className="font-semibold mb-4">Reconciled By</p>
                      <p className="border-t border-gray-500 pt-1">Signature</p>
                      <p className="text-xs">{v(reconciledBy, "Reconciled By")}</p>
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

export default PettyCashReconciliation;
