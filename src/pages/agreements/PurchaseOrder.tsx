import { Fragment, useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const PurchaseOrder = () => {
  const [productionName, setProductionName] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [poDate, setPoDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [department, setDepartment] = useState("");
  const [deliverTo, setDeliverTo] = useState("");
  const [neededBy, setNeededBy] = useState("");

  const [lines, setLines] = useState<LineItem[]>([{ description: "", qty: 1, unitPrice: 0 }]);

  const [taxRate, setTaxRate] = useState<string>("0");
  const [shipping, setShipping] = useState<string>("0");

  const [requestedBy, setRequestedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");

  const numericTaxRate = parseFloat(taxRate) || 0;
  const numericShipping = parseFloat(shipping) || 0;

  const lineAmounts = useMemo(
    () => lines.map((line) => Math.max(0, (Number.isFinite(line.qty) ? line.qty : 0) * (Number.isFinite(line.unitPrice) ? line.unitPrice : 0))),
    [lines]
  );

  const subtotal = useMemo(() => lineAmounts.reduce((sum, amount) => sum + amount, 0), [lineAmounts]);
  const taxAmount = useMemo(() => subtotal * (numericTaxRate / 100), [subtotal, numericTaxRate]);
  const total = useMemo(() => subtotal + taxAmount + numericShipping, [subtotal, taxAmount, numericShipping]);

  const updateLine = (index: number, patch: Partial<LineItem>) =>
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));

  const addLine = () => setLines((prev) => [...prev, { description: "", qty: 1, unitPrice: 0 }]);

  const removeLine = (index: number) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["PO #", poNumber, "PO #"],
    ["Date", poDate, "Date"],
    ["Vendor", vendor, "Vendor"],
    ["Department", department, "Department"],
    ["Deliver To", deliverTo, "Deliver To"],
    ["Needed By", neededBy, "Needed By"],
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
      }
    };

    const writeLine = (label: string, value: string, placeholder: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = `${label}: `;
      const labelWidth = doc.getTextWidth(labelText);
      doc.setFont("helvetica", "normal");
      const display = value.trim() || `[${placeholder}]`;
      const lines = doc.splitTextToSize(display, contentWidth - labelWidth) as string[];
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
    doc.text("PURCHASE ORDER", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, value, placeholder));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("LINE ITEMS", margin, y);
    y += 6;

    const colX = {
      description: margin,
      qty: margin + contentWidth * 0.55,
      unitPrice: margin + contentWidth * 0.68,
      amount: margin + contentWidth * 0.82,
    };

    const drawTableHeader = () => {
      ensure(10);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Description", colX.description + 2, y);
      doc.text("Qty", colX.qty + 2, y);
      doc.text("Unit $", colX.unitPrice + 2, y);
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
        colX.qty - colX.description - 6
      ) as string[];
      const rowHeight = Math.max(descLines.length * 5 + 4, 10);
      ensure(rowHeight + 4);

      descLines.forEach((lineText, i) => doc.text(lineText, colX.description + 2, y + 4 + i * 5));
      doc.text(String(line.qty || 0), colX.qty + 2, y + 4);
      doc.text(formatMoney(line.unitPrice || 0), colX.unitPrice + 2, y + 4);
      doc.text(formatMoney(amount), colX.amount + 2, y + 4);

      y += rowHeight;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
      doc.setDrawColor(180, 180, 180);
    });

    y += 6;
    const totalsX = pageWidth - margin;
    const labelX = margin + contentWidth * 0.5;

    ensure(50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal", labelX, y);
    doc.text(formatMoney(subtotal), totalsX, y, { align: "right" });
    y += 6;

    doc.text(`Tax (${numericTaxRate}%):`, labelX, y);
    doc.text(formatMoney(taxAmount), totalsX, y, { align: "right" });
    y += 6;

    doc.text("Shipping / Freight", labelX, y);
    doc.text(formatMoney(numericShipping), totalsX, y, { align: "right" });
    y += 6;

    doc.setDrawColor(0, 0, 0);
    doc.line(labelX, y - 2, totalsX, y - 2);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", labelX, y);
    doc.text(formatMoney(total), totalsX, y, { align: "right" });
    y += 12;

    ensure(40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Requested By", margin, y);
    doc.text("Approved By", margin + contentWidth / 2, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Signature: _________________________________", margin, y);
    doc.text("Signature: _________________________________", margin + contentWidth / 2, y);
    y += 7;
    doc.text(`Print name: ${requestedBy.trim() || "—"}`, margin, y);
    doc.text(`Print name: ${approvedBy.trim() || "—"}`, margin + contentWidth / 2, y);
    y += 7;
    doc.text("Date: _______________", margin, y);
    doc.text("Date: _______________", margin + contentWidth / 2, y);
    y += 10;

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safePo = (poNumber || "PO").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safePo}_Purchase_Order.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setPoNumber("");
    setPoDate("");
    setVendor("");
    setDepartment("");
    setDeliverTo("");
    setNeededBy("");
    setLines([{ description: "", qty: 1, unitPrice: 0 }]);
    setTaxRate("0");
    setShipping("0");
    setRequestedBy("");
    setApprovedBy("");
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Purchase Order</h1>
          <p className="text-muted-foreground">Authorize a purchase — vendor, line items, tax, and total.</p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Production coordinators and accountants.</li>
                <li>Department heads ordering goods or services.</li>
                <li>Anyone authorizing a purchase.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Details the vendor and what's being bought.</li>
                <li>Itemizes quantity, unit price, and amount.</li>
                <li>Totals subtotal, tax, shipping, and grand total.</li>
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
                  <Input
                    id="production_name"
                    value={productionName}
                    onChange={(e) => setProductionName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="po_number">PO #</Label>
                    <Input id="po_number" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="po_date">Date</Label>
                    <Input
                      id="po_date"
                      type="date"
                      value={poDate}
                      onChange={(e) => setPoDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="deliver_to">Deliver To (optional)</Label>
                  <Input id="deliver_to" value={deliverTo} onChange={(e) => setDeliverTo(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="needed_by">Needed By (optional)</Label>
                  <Input
                    id="needed_by"
                    type="date"
                    value={neededBy}
                    onChange={(e) => setNeededBy(e.target.value)}
                  />
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
                      <div className="flex-1 min-w-[140px]">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={line.description}
                          onChange={(e) => updateLine(index, { description: e.target.value })}
                        />
                      </div>
                      <div className="w-20">
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          min={0}
                          step="1"
                          value={line.qty}
                          onChange={(e) => updateLine(index, { qty: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="w-28">
                        <Label className="text-xs">Unit $</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={line.unitPrice}
                          onChange={(e) => updateLine(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="w-28 text-right">
                        <Label className="text-xs">Amount</Label>
                        <div className="h-10 flex items-center justify-end text-sm tabular-nums font-medium">
                          {formatMoney(lineAmounts[index] ?? 0)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLine(index)}
                        disabled={lines.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Fragment>
                ))}
                <Button variant="outline" onClick={addLine}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Line
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Totals</CardTitle>
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
                  <div>
                    <Label htmlFor="shipping">Shipping / Freight</Label>
                    <Input
                      id="shipping"
                      type="number"
                      min={0}
                      step="0.01"
                      value={shipping}
                      onChange={(e) => setShipping(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t border-border">
                  <div className="text-right space-y-1 text-sm">
                    <div className="tabular-nums">Subtotal: {formatMoney(subtotal)}</div>
                    <div className="tabular-nums">Tax ({numericTaxRate}%): {formatMoney(taxAmount)}</div>
                    <div className="tabular-nums">Shipping: {formatMoney(numericShipping)}</div>
                    <div className="text-base font-bold tabular-nums pt-1 border-t border-border">
                      TOTAL: {formatMoney(total)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="requested_by">Requested By</Label>
                  <Input id="requested_by" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} />
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

            <p className="text-xs text-muted-foreground">Filmmaker Genius — Document Library.</p>
          </div>

          {/* RIGHT: live preview */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card className="border-2 border-primary/20 shadow-sm print:shadow-none print:border-black">
              <CardContent className="p-6 space-y-6 print:text-black">
                <div className="text-center border-b border-border pb-4">
                  <h2 className="text-xl font-bold uppercase tracking-wide">Purchase Order</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {headerRows.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold">Description</th>
                        <th className="text-right py-2 font-semibold w-16">Qty</th>
                        <th className="text-right py-2 font-semibold w-24">Unit $</th>
                        <th className="text-right py-2 font-semibold w-28">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line, index) => (
                        <tr key={index} className="border-b border-border/60">
                          <td className="py-2 text-muted-foreground">
                            {line.description.trim() || "[Description]"}
                          </td>
                          <td className="py-2 text-right tabular-nums text-muted-foreground">{line.qty || 0}</td>
                          <td className="py-2 text-right tabular-nums text-muted-foreground">
                            {formatMoney(line.unitPrice || 0)}
                          </td>
                          <td className="py-2 text-right tabular-nums font-medium">
                            {formatMoney(lineAmounts[index] ?? 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="text-right space-y-1 text-sm">
                    <div className="tabular-nums text-muted-foreground">
                      Subtotal: {formatMoney(subtotal)}
                    </div>
                    <div className="tabular-nums text-muted-foreground">
                      Tax ({numericTaxRate}%): {formatMoney(taxAmount)}
                    </div>
                    <div className="tabular-nums text-muted-foreground">
                      Shipping: {formatMoney(numericShipping)}
                    </div>
                    <div className="text-base font-bold tabular-nums pt-2 border-t border-border">
                      TOTAL: {formatMoney(total)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border text-sm">
                  <div className="space-y-2">
                    <p className="font-semibold">Requested By</p>
                    <p className="text-muted-foreground">Signature: _______________________</p>
                    <p className="text-muted-foreground">Print: {v(requestedBy, "Requested By")}</p>
                    <p className="text-muted-foreground">Date: _______________</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Approved By</p>
                    <p className="text-muted-foreground">Signature: _______________________</p>
                    <p className="text-muted-foreground">Print: {v(approvedBy, "Approved By")}</p>
                    <p className="text-muted-foreground">Date: _______________</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrder;
