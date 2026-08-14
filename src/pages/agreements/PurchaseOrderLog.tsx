import { Fragment, useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface POLogRow {
  poNumber: string;
  poDate: string;
  vendor: string;
  description: string;
  amount: number;
  status: string;
}

const STATUS_OPTIONS = ["Open", "Paid", "Partial", "Cancelled"];

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const PurchaseOrderLog = () => {
  const [productionName, setProductionName] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [asOfDate, setAsOfDate] = useState("");

  const [rows, setRows] = useState<POLogRow[]>([
    { poNumber: "", poDate: "", vendor: "", description: "", amount: 0, status: "Open" },
  ]);

  const updateRow = (index: number, patch: Partial<POLogRow>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { poNumber: "", poDate: "", vendor: "", description: "", amount: 0, status: "Open" },
    ]);

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const grandTotal = useMemo(
    () => rows.reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0),
    [rows]
  );

  const committedTotal = useMemo(
    () =>
      rows.reduce(
        (sum, row) =>
          row.status !== "Cancelled" ? sum + (Number.isFinite(row.amount) ? row.amount : 0) : sum,
        0
      ),
    [rows]
  );

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Prepared By", preparedBy, "Prepared By"],
    ["As Of", asOfDate, "As Of Date"],
  ] as const;

  const buildPDF = () => {
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
    doc.text("PURCHASE ORDER LOG", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, value, placeholder));

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
      const amount = Number.isFinite(row.amount) ? row.amount : 0;
      const descLines = doc.splitTextToSize(
        row.description.trim() || "—",
        colX.amount - colX.description - 6
      ) as string[];
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
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (asOfDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_Purchase_Order_Log.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setPreparedBy("");
    setAsOfDate("");
    setRows([{ poNumber: "", poDate: "", vendor: "", description: "", amount: 0, status: "Open" }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Purchase Order Log</h1>
          <p className="text-muted-foreground">
            The running register of every PO — vendor, amount, status, and a live total.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Production accountants and coordinators.</li>
                <li>UPMs tracking committed spend.</li>
                <li>Anyone reconciling purchase orders.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists every PO with vendor and amount.</li>
                <li>Tracks each PO's status at a glance.</li>
                <li>Totals committed spend automatically.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Header</CardTitle>
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
                    <Label htmlFor="prepared_by">Prepared By</Label>
                    <Input
                      id="prepared_by"
                      value={preparedBy}
                      onChange={(e) => setPreparedBy(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="as_of_date">As Of</Label>
                    <Input
                      id="as_of_date"
                      type="date"
                      value={asOfDate}
                      onChange={(e) => setAsOfDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rows.map((row, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap gap-2 items-end">
                      <div className="w-24">
                        <Label className="text-xs">PO #</Label>
                        <Input
                          value={row.poNumber}
                          onChange={(e) => updateRow(index, { poNumber: e.target.value })}
                        />
                      </div>
                      <div className="w-36">
                        <Label className="text-xs">Date</Label>
                        <Input
                          type="date"
                          value={row.poDate}
                          onChange={(e) => updateRow(index, { poDate: e.target.value })}
                        />
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Vendor</Label>
                        <Input
                          value={row.vendor}
                          onChange={(e) => updateRow(index, { vendor: e.target.value })}
                        />
                      </div>
                      <div className="flex-1 min-w-[140px]">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={row.description}
                          onChange={(e) => updateRow(index, { description: e.target.value })}
                        />
                      </div>
                      <div className="w-28">
                        <Label className="text-xs">Amount</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          className="text-right"
                          value={row.amount}
                          onChange={(e) => updateRow(index, { amount: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="w-32">
                        <Label className="text-xs">Status</Label>
                        <Select
                          value={row.status}
                          onValueChange={(value) => updateRow(index, { status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(index)}
                        disabled={rows.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Fragment>
                ))}
                <Button variant="outline" onClick={addRow}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add PO
                </Button>
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Purchase Order Log</h2>
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
                        <th className="text-left py-2 font-semibold">PO #</th>
                        <th className="text-left py-2 font-semibold">Date</th>
                        <th className="text-left py-2 font-semibold">Vendor</th>
                        <th className="text-left py-2 font-semibold">Description</th>
                        <th className="text-right py-2 font-semibold w-28">Amount</th>
                        <th className="text-left py-2 font-semibold w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index} className="border-b border-border/60">
                          <td className="py-2 text-muted-foreground">
                            {row.poNumber.trim() || "[PO #]"}
                          </td>
                          <td className="py-2 text-muted-foreground">{row.poDate.trim() || "[Date]"}</td>
                          <td className="py-2 text-muted-foreground">
                            {row.vendor.trim() || "[Vendor]"}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {row.description.trim() || "[Description]"}
                          </td>
                          <td className="py-2 text-right tabular-nums font-medium">
                            {formatMoney(Number.isFinite(row.amount) ? row.amount : 0)}
                          </td>
                          <td className="py-2 text-muted-foreground">{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="text-right space-y-1 text-sm">
                    <div className="tabular-nums text-muted-foreground">
                      Grand Total: {formatMoney(grandTotal)}
                    </div>
                    <div className="text-base font-bold tabular-nums pt-1 border-t border-border">
                      Committed (excl. cancelled): {formatMoney(committedTotal)}
                    </div>
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

export default PurchaseOrderLog;
