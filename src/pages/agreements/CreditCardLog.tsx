import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Printer, RotateCcw, Trash2, Plus } from "lucide-react";

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

interface Charge {
  date: string;
  merchant: string;
  purpose: string;
  accountGl: string;
  amount: number;
  receipt: boolean;
}

const emptyCharge = (): Charge => ({
  date: "",
  merchant: "",
  purpose: "",
  accountGl: "",
  amount: 0,
  receipt: false,
});

const CreditCardLog = () => {
  const [productionName, setProductionName] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [statementPeriod, setStatementPeriod] = useState("");
  const [reconciledBy, setReconciledBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [charges, setCharges] = useState<Charge[]>([emptyCharge()]);

  const updateCharge = (index: number, patch: Partial<Charge>) =>
    setCharges((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addCharge = () => setCharges((rows) => [...rows, emptyCharge()]);
  const removeCharge = (index: number) =>
    setCharges((rows) => (rows.length > 1 ? rows.filter((_, i) => i !== index) : rows));

  const total = useMemo(
    () => charges.reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0),
    [charges]
  );

  const receiptsHave = useMemo(() => charges.filter((row) => row.receipt).length, [charges]);
  const receiptsTotal = charges.length;
  const missingReceipts = receiptsTotal - receiptsHave;

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Cardholder", cardholder, "Cardholder"],
    ["Card (last 4)", cardLast4, "Card (last 4)"],
    ["Statement / Period", statementPeriod, "Statement / Period"],
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
    doc.text("CREDIT CARD LOG", pageWidth / 2, y, { align: "center" });
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
    const colMerchant = margin + 24;
    const colPurpose = margin + 66;
    const colGl = pageWidth - margin - 42;
    const colRcpt = pageWidth - margin - 24;
    const colAmountRight = pageWidth - margin;
    const purposeWidth = colGl - colPurpose - 4;

    const drawTableHeader = () => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Date", colDate, y);
      doc.text("Merchant", colMerchant, y);
      doc.text("Purpose", colPurpose, y);
      doc.text("GL", colGl, y);
      doc.text("Rcpt", colRcpt, y);
      doc.text("Amount", colAmountRight, y, { align: "right" });
      y += 2;
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
    };

    ensure(20);
    drawTableHeader();

    charges.forEach((row) => {
      const purposeLines = doc.splitTextToSize(row.purpose.trim() || "—", purposeWidth) as string[];
      const rowHeight = Math.max(purposeLines.length, 1) * 5 + 2;
      if (ensure(rowHeight + 6)) drawTableHeader();
      doc.setFontSize(9);
      doc.text(row.date.trim() || "—", colDate, y);
      doc.text(row.merchant.trim() || "—", colMerchant, y);
      purposeLines.forEach((line, i) => doc.text(line, colPurpose, y + i * 5));
      doc.text(row.accountGl.trim() || "—", colGl, y);
      doc.text(row.receipt ? "Y" : "", colRcpt, y);
      doc.text(formatMoney(Number.isFinite(row.amount) ? row.amount : 0), colAmountRight, y, { align: "right" });
      y += rowHeight;
    });

    y += 6;
    ensure(40);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.line(colAmountRight - 60, y - 4, colAmountRight, y - 4);
    doc.text("TOTAL", colAmountRight - 40, y, { align: "right" });
    doc.text(formatMoney(total), colAmountRight, y, { align: "right" });
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.text(`Receipts attached: ${receiptsHave} of ${receiptsTotal}`, margin, y);
    if (missingReceipts > 0) {
      doc.setTextColor(200, 120, 0);
      doc.text(` — ${missingReceipts} missing`, margin + doc.getTextWidth(`Receipts attached: ${receiptsHave} of ${receiptsTotal}`), y);
      doc.setTextColor(0, 0, 0);
    }
    y += 10;

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
    doc.save(
      `${safe(productionName, "Production")}_${safe(cardholder, "Cardholder")}_Credit_Card_Log.pdf`
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
    setCardholder("");
    setCardLast4("");
    setStatementPeriod("");
    setReconciledBy("");
    setApprovedBy("");
    setCharges([emptyCharge()]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Credit Card Log</h1>
          <p className="text-muted-foreground">
            Log every charge on a production card — merchant, coding, receipts, and total.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Cardholders reconciling a production card.</li>
                <li>Accountants matching charges to receipts.</li>
                <li>Anyone tracking card spend.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Logs each charge with merchant and coding.</li>
                <li>Flags which charges have receipts.</li>
                <li>Totals the statement for reconciliation.</li>
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
                    <Label htmlFor="cardholder">Cardholder</Label>
                    <Input id="cardholder" value={cardholder} onChange={(e) => setCardholder(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="card_last4">Card (last 4)</Label>
                    <Input id="card_last4" value={cardLast4} onChange={(e) => setCardLast4(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="statement_period">Statement / Period</Label>
                  <Input id="statement_period" value={statementPeriod} onChange={(e) => setStatementPeriod(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Charges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {charges.map((row, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2">
                    <Input
                      type="date"
                      className="w-36"
                      value={row.date}
                      onChange={(e) => updateCharge(index, { date: e.target.value })}
                    />
                    <Input
                      className="w-40"
                      placeholder="Merchant"
                      value={row.merchant}
                      onChange={(e) => updateCharge(index, { merchant: e.target.value })}
                    />
                    <Input
                      className="flex-1 min-w-[10rem]"
                      placeholder="Purpose"
                      value={row.purpose}
                      onChange={(e) => updateCharge(index, { purpose: e.target.value })}
                    />
                    <Input
                      className="w-28"
                      placeholder="GL"
                      value={row.accountGl}
                      onChange={(e) => updateCharge(index, { accountGl: e.target.value })}
                    />
                    <Input
                      type="number"
                      className="w-28 text-right"
                      placeholder="0.00"
                      value={row.amount === 0 ? "" : row.amount}
                      onChange={(e) => updateCharge(index, { amount: parseFloat(e.target.value) || 0 })}
                    />
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        id={`receipt-${index}`}
                        checked={row.receipt}
                        onCheckedChange={(checked) => updateCharge(index, { receipt: checked === true })}
                      />
                      <Label htmlFor={`receipt-${index}`} className="text-xs font-normal">
                        Receipt
                      </Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCharge(index)}
                      disabled={charges.length === 1}
                      aria-label="Remove charge"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addCharge}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Charge
                </Button>
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
                  <h2 className="text-center font-bold text-base mb-4 border-b border-gray-400 pb-2">CREDIT CARD LOG</h2>

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
                        <th className="text-left py-1">Merchant</th>
                        <th className="text-left py-1">Purpose</th>
                        <th className="text-left py-1">GL</th>
                        <th className="text-center py-1">Rcpt</th>
                        <th className="text-right py-1">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {charges.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-1 align-top">{row.date.trim() || "—"}</td>
                          <td className="py-1 align-top">{row.merchant.trim() || "—"}</td>
                          <td className="py-1 align-top">{row.purpose.trim() || "—"}</td>
                          <td className="py-1 align-top">{row.accountGl.trim() || "—"}</td>
                          <td className="py-1 align-top text-center">{row.receipt ? "✓" : ""}</td>
                          <td className="py-1 align-top text-right">
                            {formatMoney(Number.isFinite(row.amount) ? row.amount : 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="ml-auto w-64 space-y-1 text-xs">
                    <div className="flex justify-between font-bold border-t border-gray-500 pt-1">
                      <span>TOTAL</span>
                      <span>{formatMoney(total)}</span>
                    </div>
                    <p className="text-gray-600">
                      Receipts attached: {receiptsHave} of {receiptsTotal}
                      {missingReceipts > 0 && (
                        <span className="text-amber-600"> — {missingReceipts} missing</span>
                      )}
                    </p>
                  </div>

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

export default CreditCardLog;
