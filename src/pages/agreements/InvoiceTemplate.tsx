import { Fragment, useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const InvoiceTemplate = () => {
  const [fromName, setFromName] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromPhone, setFromPhone] = useState("");

  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [toEmail, setToEmail] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dateIssued, setDateIssued] = useState("");
  const [dateDue, setDateDue] = useState("");
  const [poReference, setPoReference] = useState("");

  const [lines, setLines] = useState<LineItem[]>([{ description: "", quantity: 1, rate: 0 }]);

  const [taxRate, setTaxRate] = useState<string>("0");
  const [paymentTerms, setPaymentTerms] = useState("");

  const numericTaxRate = parseFloat(taxRate) || 0;

  const lineAmounts = useMemo(
    () =>
      lines.map((line) =>
        Math.max(0, (Number.isFinite(line.quantity) ? line.quantity : 0) * (Number.isFinite(line.rate) ? line.rate : 0))
      ),
    [lines]
  );

  const subtotal = useMemo(() => lineAmounts.reduce((sum, amount) => sum + amount, 0), [lineAmounts]);
  const taxAmount = useMemo(() => subtotal * (numericTaxRate / 100), [subtotal, numericTaxRate]);
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  const updateLine = (index: number, patch: Partial<LineItem>) =>
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));

  const addLine = () => setLines((prev) => [...prev, { description: "", quantity: 1, rate: 0 }]);

  const removeLine = (index: number) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

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
      }
    };

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth / 2, y, { align: "center" });
    y += 12;

    const fromLines = [
      fromName.trim() || "[Name / Company]",
      ...(fromAddress.trim() ? (fromAddress.split("\n") as string[]) : ["[Address]"]),
      fromEmail.trim() || "[Email]",
      fromPhone.trim() || "[Phone]",
    ];

    const rightBlock = [
      ["Invoice #", invoiceNumber.trim() || "[Invoice #]"],
      ["Date Issued", dateIssued.trim() || "[Date Issued]"],
      ["Date Due", dateDue.trim() || "[Date Due]"],
      ["PO / Reference", poReference.trim() || "[PO / Reference]"],
    ] as const;

    const leftStart = y;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    fromLines.forEach((line, i) => {
      doc.text(line, margin, y + i * 5);
    });

    const rightStart = y;
    rightBlock.forEach(([label, value], i) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, pageWidth - margin - 60, rightStart + i * 5);
      doc.setFont("helvetica", "normal");
      const wrapped = doc.splitTextToSize(value, 55) as string[];
      wrapped.forEach((line, j) => {
        doc.text(line, pageWidth - margin, rightStart + i * 5 + j * 5, { align: "right" });
      });
    });

    y = Math.max(leftStart + fromLines.length * 5, rightStart + rightBlock.length * 5) + 6;

    ensure(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const billLines = [
      toName.trim() || "[Name / Company]",
      ...(toAddress.trim() ? (toAddress.split("\n") as string[]) : ["[Address]"]),
      toEmail.trim() || "[Email]",
    ];
    billLines.forEach((line) => {
      doc.text(line, margin, y);
      y += 5;
    });

    y += 6;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("LINE ITEMS", margin, y);
    y += 6;

    const colX = {
      description: margin,
      quantity: margin + contentWidth * 0.55,
      rate: margin + contentWidth * 0.68,
      amount: margin + contentWidth * 0.82,
    };

    const drawTableHeader = () => {
      ensure(10);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Description", colX.description + 2, y);
      doc.text("Qty", colX.quantity + 2, y);
      doc.text("Rate", colX.rate + 2, y);
      doc.text("Amount", colX.amount + 2, y);
      y += 5;
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
    };

    drawTableHeader();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    lines.forEach((line, index) => {
      const amount = lineAmounts[index] ?? 0;
      const descLines = doc.splitTextToSize(
        line.description.trim() || "—",
        colX.quantity - colX.description - 6
      ) as string[];
      const rowHeight = Math.max(descLines.length * 5 + 4, 10);
      ensure(rowHeight + 4);

      descLines.forEach((lineText, i) => doc.text(lineText, colX.description + 2, y + 4 + i * 5));
      doc.text(String(line.quantity || 0), colX.quantity + 2, y + 4);
      doc.text(formatMoney(line.rate || 0), colX.rate + 2, y + 4);
      doc.text(formatMoney(amount), colX.amount + 2, y + 4);

      y += rowHeight;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
      doc.setDrawColor(180, 180, 180);
    });

    y += 6;
    const totalsX = pageWidth - margin;
    const labelX = margin + contentWidth * 0.5;

    ensure(40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal", labelX, y);
    doc.text(formatMoney(subtotal), totalsX, y, { align: "right" });
    y += 6;

    doc.text(`Tax (${numericTaxRate}%)`, labelX, y);
    doc.text(formatMoney(taxAmount), totalsX, y, { align: "right" });
    y += 6;

    doc.setDrawColor(0, 0, 0);
    doc.line(labelX, y - 2, totalsX, y - 2);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL DUE", labelX, y);
    doc.text(formatMoney(total), totalsX, y, { align: "right" });
    y += 10;

    if (paymentTerms.trim()) {
      ensure(30);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Terms", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const termsLines = doc.splitTextToSize(paymentTerms.trim(), contentWidth) as string[];
      termsLines.forEach((line) => {
        doc.text(line, margin, y);
        y += 5;
      });
    }

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeInvoice = (invoiceNumber || "Invoice").replace(/[^a-zA-Z0-9]/g, "_");
    const safeTo = (toName || "Client").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeInvoice}_${safeTo}_Invoice.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setFromName("");
    setFromAddress("");
    setFromEmail("");
    setFromPhone("");
    setToName("");
    setToAddress("");
    setToEmail("");
    setInvoiceNumber("");
    setDateIssued("");
    setDateDue("");
    setPoReference("");
    setLines([{ description: "", quantity: 1, rate: 0 }]);
    setTaxRate("0");
    setPaymentTerms("");
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Invoice Template</h1>
          <p className="text-muted-foreground">
            Bill a client or production for work and expenses — itemized, taxed, and totaled.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Vendors and crew billing a production.</li>
                <li>Production companies invoicing clients or investors.</li>
                <li>Anyone who needs a clean, itemized invoice.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Itemizes work and expenses with quantities and rates.</li>
                <li>Applies tax and computes the amount due.</li>
                <li>States payment terms and where to send payment.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>From (You)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="from_name">Name / Company</Label>
                  <Input id="from_name" value={fromName} onChange={(e) => setFromName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="from_address">Address</Label>
                  <Textarea
                    id="from_address"
                    rows={3}
                    value={fromAddress}
                    onChange={(e) => setFromAddress(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from_email">Email</Label>
                    <Input id="from_email" type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="from_phone">Phone</Label>
                    <Input id="from_phone" type="tel" value={fromPhone} onChange={(e) => setFromPhone(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bill To</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="to_name">Name / Company</Label>
                  <Input id="to_name" value={toName} onChange={(e) => setToName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="to_address">Address</Label>
                  <Textarea id="to_address" rows={3} value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="to_email">Email</Label>
                  <Input id="to_email" type="email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoice_number">Invoice #</Label>
                    <Input id="invoice_number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="po_reference">PO / Reference</Label>
                    <Input id="po_reference" value={poReference} onChange={(e) => setPoReference(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_issued">Date Issued</Label>
                    <Input
                      id="date_issued"
                      type="date"
                      value={dateIssued}
                      onChange={(e) => setDateIssued(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_due">Date Due</Label>
                    <Input id="date_due" type="date" value={dateDue} onChange={(e) => setDateDue(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lines.map((line, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap gap-2 items-end">
                      <div className="flex-1 min-w-[12rem]">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={line.description}
                          onChange={(e) => updateLine(index, { description: e.target.value })}
                        />
                      </div>
                      <div className="w-24">
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          min={0}
                          step="1"
                          value={line.quantity}
                          onChange={(e) => updateLine(index, { quantity: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="w-28">
                        <Label className="text-xs">Rate</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          className="text-right"
                          placeholder="0.00"
                          value={line.rate === 0 ? "" : line.rate}
                          onChange={(e) => updateLine(index, { rate: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="w-28 text-right">
                        <Label className="text-xs">Amount</Label>
                        <div className="h-10 flex items-center justify-end text-sm tabular-nums font-medium">
                          {formatMoney(lineAmounts[index] ?? 0)}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeLine(index)} disabled={lines.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Fragment>
                ))}
                <Button variant="outline" onClick={addLine}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Line Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Totals & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      min={0}
                      step="0.01"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t border-border">
                  <div className="text-right space-y-1 text-sm">
                    <div className="tabular-nums">Subtotal: {formatMoney(subtotal)}</div>
                    <div className="tabular-nums">Tax ({numericTaxRate}%): {formatMoney(taxAmount)}</div>
                    <div className="text-base font-bold tabular-nums pt-1 border-t border-border">
                      TOTAL DUE: {formatMoney(total)}
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="payment_terms">Payment Terms / Notes</Label>
                  <Textarea
                    id="payment_terms"
                    rows={3}
                    placeholder="Net 30. Payable by bank transfer to…"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                  />
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
                  <h2 className="text-center font-bold text-xl mb-4">INVOICE</h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold">{v(fromName, "Name / Company")}</p>
                      <p className="whitespace-pre-wrap">{fromAddress.trim() || "[Address]"}</p>
                      <p>{fromEmail.trim() || "[Email]"}</p>
                      <p>{fromPhone.trim() || "[Phone]"}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p>
                        <span className="font-semibold">Invoice #:</span> {v(invoiceNumber, "Invoice #")}
                      </p>
                      <p>
                        <span className="font-semibold">Date Issued:</span> {v(dateIssued, "Date Issued")}
                      </p>
                      <p>
                        <span className="font-semibold">Date Due:</span> {v(dateDue, "Date Due")}
                      </p>
                      <p>
                        <span className="font-semibold">PO / Reference:</span> {v(poReference, "PO / Reference")}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold">Bill To:</p>
                    <p className="font-semibold">{v(toName, "Name / Company")}</p>
                    <p className="whitespace-pre-wrap">{toAddress.trim() || "[Address]"}</p>
                    <p>{toEmail.trim() || "[Email]"}</p>
                  </div>

                  <table className="w-full text-xs mb-4">
                    <thead>
                      <tr className="border-b border-gray-500">
                        <th className="text-left py-1">Description</th>
                        <th className="text-right py-1">Qty</th>
                        <th className="text-right py-1">Rate</th>
                        <th className="text-right py-1">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-1 align-top">{line.description.trim() || "—"}</td>
                          <td className="py-1 align-top text-right">{line.quantity || 0}</td>
                          <td className="py-1 align-top text-right">{formatMoney(line.rate || 0)}</td>
                          <td className="py-1 align-top text-right">{formatMoney(lineAmounts[index] ?? 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="ml-auto w-64 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatMoney(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({numericTaxRate}%)</span>
                      <span>{formatMoney(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-500 pt-1">
                      <span>TOTAL DUE</span>
                      <span>{formatMoney(total)}</span>
                    </div>
                  </div>

                  {paymentTerms.trim() && (
                    <div className="mt-4">
                      <p className="font-semibold">Payment Terms</p>
                      <p className="whitespace-pre-wrap">{paymentTerms.trim()}</p>
                    </div>
                  )}
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

export default InvoiceTemplate;
