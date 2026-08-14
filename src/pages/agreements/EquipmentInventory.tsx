import { useMemo, useState } from "react";
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

interface InventoryRow {
  item: string;
  serial: string;
  qty: number;
  outBy: string;
  outDate: string;
  returnDue: string;
  condition: string;
  status: string;
  notes: string;
}

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const CONDITION_OPTIONS = ["New", "Good", "Fair", "Damaged"];
const STATUS_OPTIONS = ["Out", "Returned", "Overdue", "Lost"];

const EquipmentInventory = () => {
  const [productionName, setProductionName] = useState("");
  const [department, setDepartment] = useState("");
  const [loggedBy, setLoggedBy] = useState("");
  const [logDate, setLogDate] = useState("");

  const [items, setItems] = useState<InventoryRow[]>([
    { item: "", serial: "", qty: 1, outBy: "", outDate: "", returnDue: "", condition: "Good", status: "Out", notes: "" },
  ]);

  const updateItem = (index: number, patch: Partial<InventoryRow>) => {
    setItems((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { item: "", serial: "", qty: 1, outBy: "", outDate: "", returnDue: "", condition: "Good", status: "Out", notes: "" },
    ]);

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalQty = useMemo(() => items.reduce((sum, r) => sum + (Number.isFinite(r.qty) ? r.qty : 0), 0), [items]);
  const outCount = useMemo(() => items.filter((r) => r.status === "Out").length, [items]);
  const returnedCount = useMemo(() => items.filter((r) => r.status === "Returned").length, [items]);

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Department", department, "Department"],
    ["Logged By", loggedBy, "Logged By"],
    ["Date", logDate, "Date"],
  ] as const;

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;

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

    const writeLine = (label: string, value: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = `${label}: `;
      const labelWidth = doc.getTextWidth(labelText);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(value.trim() || "—", pageWidth - margin * 2 - labelWidth) as string[];
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
    doc.text("EQUIPMENT CHECKOUT / INVENTORY", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, v(value, placeholder)));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("INVENTORY", margin, y);
    y += 6;

    const colX = {
      item: margin,
      serial: margin + 60,
      qty: margin + 102,
      outBy: margin + 118,
      outDate: margin + 150,
      returnDue: margin + 180,
      condition: margin + 210,
      status: margin + 238,
      notes: margin + 266,
    };

    const drawTableHeader = () => {
      ensure(10);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Item", colX.item, y);
      doc.text("Serial", colX.serial, y);
      doc.text("Qty", colX.qty, y);
      doc.text("Out By", colX.outBy, y);
      doc.text("Out", colX.outDate, y);
      doc.text("Due", colX.returnDue, y);
      doc.text("Condition", colX.condition, y);
      doc.text("Status", colX.status, y);
      doc.text("Notes", colX.notes, y);
      y += 5;
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
    };

    drawTableHeader();

    doc.setFont("helvetica", "normal");
    items.forEach((row) => {
      const itemLines = doc.splitTextToSize(row.item.trim() || "—", colX.serial - colX.item - 4) as string[];
      const notesLines = doc.splitTextToSize(row.notes.trim() || "—", pageWidth - margin - colX.notes - 2) as string[];
      const rowHeight = Math.max(itemLines.length * 5 + 2, notesLines.length * 5 + 2, 8);
      ensure(rowHeight + 6);

      itemLines.forEach((line, i) => doc.text(line, colX.item, y + i * 5));
      doc.text(row.serial.trim() || "—", colX.serial, y);
      doc.text(String(row.qty || 0), colX.qty, y);
      doc.text(row.outBy.trim() || "—", colX.outBy, y);
      doc.text(row.outDate.trim() || "—", colX.outDate, y);
      doc.text(row.returnDue.trim() || "—", colX.returnDue, y);
      doc.text(row.condition.trim() || "—", colX.condition, y);
      doc.text(row.status.trim() || "—", colX.status, y);
      notesLines.forEach((line, i) => doc.text(line, colX.notes, y + i * 5));
      y += rowHeight;
    });

    y += 4;
    ensure(8);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Total items: ${totalQty} · Out: ${outCount} · Returned: ${returnedCount}`, margin, y);
    y += 10;

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (logDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_Equipment_Inventory.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setDepartment("");
    setLoggedBy("");
    setLogDate("");
    setItems([
      { item: "", serial: "", qty: 1, outBy: "", outDate: "", returnDue: "", condition: "Good", status: "Out", notes: "" },
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Equipment Checkout / Inventory</h1>
          <p className="text-muted-foreground">
            Track gear in and out — item, serial, condition, and return status.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Department heads and gear wranglers.</li>
                <li>Production managers tracking rentals.</li>
                <li>Anyone checking equipment in and out.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Logs each item with serial and quantity.</li>
                <li>Records who took it, out and return dates.</li>
                <li>Tracks condition and check-in status.</li>
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
                    <Label htmlFor="department">Department (optional)</Label>
                    <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="logged_by">Logged By</Label>
                    <Input id="logged_by" value={loggedBy} onChange={(e) => setLoggedBy(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="log_date">Date</Label>
                  <Input
                    id="log_date"
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((row, index) => (
                  <div key={index} className="flex flex-wrap gap-2 items-end border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-[140px]">
                      <Label className="text-xs">Item</Label>
                      <Input
                        value={row.item}
                        onChange={(e) => updateItem(index, { item: e.target.value })}
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Serial / Asset #</Label>
                      <Input
                        value={row.serial}
                        onChange={(e) => updateItem(index, { serial: e.target.value })}
                      />
                    </div>
                    <div className="w-16">
                      <Label className="text-xs">Qty</Label>
                      <Input
                        type="number"
                        min={0}
                        value={row.qty}
                        onChange={(e) => updateItem(index, { qty: parseInt(e.target.value || "0", 10) })}
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Out By</Label>
                      <Input
                        value={row.outBy}
                        onChange={(e) => updateItem(index, { outBy: e.target.value })}
                      />
                    </div>
                    <div className="w-36">
                      <Label className="text-xs">Out</Label>
                      <Input
                        type="date"
                        value={row.outDate}
                        onChange={(e) => updateItem(index, { outDate: e.target.value })}
                      />
                    </div>
                    <div className="w-36">
                      <Label className="text-xs">Return Due</Label>
                      <Input
                        type="date"
                        value={row.returnDue}
                        onChange={(e) => updateItem(index, { returnDue: e.target.value })}
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Condition</Label>
                      <Select value={row.condition} onValueChange={(value) => updateItem(index, { condition: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONDITION_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Status</Label>
                      <Select value={row.status} onValueChange={(value) => updateItem(index, { status: value })}>
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
                    <div className="flex-1 min-w-[140px]">
                      <Label className="text-xs">Notes</Label>
                      <Input
                        value={row.notes}
                        onChange={(e) => updateItem(index, { notes: e.target.value })}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Equipment Checkout / Inventory</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div>
                    <span className="font-semibold">Production:</span> {v(productionName, "Production Name")}
                  </div>
                  <div>
                    <span className="font-semibold">Department:</span> {v(department, "Department")}
                  </div>
                  <div>
                    <span className="font-semibold">Logged By:</span> {v(loggedBy, "Logged By")}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span> {v(logDate, "Date")}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold">Item</th>
                        <th className="text-left py-2 font-semibold">Serial</th>
                        <th className="text-left py-2 font-semibold">Qty</th>
                        <th className="text-left py-2 font-semibold">Out By</th>
                        <th className="text-left py-2 font-semibold">Out</th>
                        <th className="text-left py-2 font-semibold">Due</th>
                        <th className="text-left py-2 font-semibold">Condition</th>
                        <th className="text-left py-2 font-semibold">Status</th>
                        <th className="text-left py-2 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((row, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="py-2">{row.item.trim() || "—"}</td>
                          <td className="py-2">{row.serial.trim() || "—"}</td>
                          <td className="py-2">{row.qty || 0}</td>
                          <td className="py-2">{row.outBy.trim() || "—"}</td>
                          <td className="py-2">{row.outDate.trim() || "—"}</td>
                          <td className="py-2">{row.returnDue.trim() || "—"}</td>
                          <td className="py-2">{row.condition.trim() || "—"}</td>
                          <td className="py-2">{row.status.trim() || "—"}</td>
                          <td className="py-2">{row.notes.trim() || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-sm font-semibold">
                  Total items: {totalQty} · Out: {outCount} · Returned: {returnedCount}
                </p>

                <p className="text-center text-xs text-muted-foreground pt-4">
                  Filmmaker Genius — Document Library.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentInventory;
