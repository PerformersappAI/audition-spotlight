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

interface ClearanceItem {
  item: string;
  type: string;
  rightsHolder: string;
  contact: string;
  dateRequested: string;
  status: string;
  notes: string;
}

const TYPE_OPTIONS = [
  "Music",
  "Artwork",
  "Photo",
  "Footage",
  "Product",
  "Trademark",
  "Location",
  "Talent",
  "Other",
];

const STATUS_OPTIONS = [
  "Pending",
  "Requested",
  "In Negotiation",
  "Cleared",
  "Denied",
  "N/A",
];

const OTHER = "Other";

const emptyItem = (): ClearanceItem => ({
  item: "",
  type: "",
  rightsHolder: "",
  contact: "",
  dateRequested: "",
  status: "Pending",
  notes: "",
});

const v = (value: string, placeholder: string) =>
  value.trim() ? value.trim() : `[${placeholder}]`;

const statusChipClass = (status: string): string => {
  switch (status) {
    case "Cleared":
      return "bg-green-500/20 text-green-300 border border-green-500/30";
    case "Denied":
      return "bg-red-500/20 text-red-300 border border-red-500/30";
    case "N/A":
      return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    default:
      return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
  }
};

const pdfStatusColor = (status: string): [number, number, number] => {
  switch (status) {
    case "Cleared":
      return [34, 197, 94];
    case "Denied":
      return [239, 68, 68];
    case "N/A":
      return [156, 163, 175];
    default:
      return [245, 158, 11];
  }
};

const ClearanceLog = () => {
  const [productionTitle, setProductionTitle] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [asOfDate, setAsOfDate] = useState("");

  const [rows, setRows] = useState<ClearanceItem[]>([emptyItem()]);

  const updateRow = (index: number, patch: Partial<ClearanceItem>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addRow = () => setRows((prev) => [...prev, emptyItem()]);

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const counts = useMemo(() => {
    const cleared = rows.filter((r) => r.status === "Cleared").length;
    const pending = rows.filter(
      (r) => r.status === "Pending" || r.status === "Requested" || r.status === "In Negotiation"
    ).length;
    const denied = rows.filter((r) => r.status === "Denied").length;
    const na = rows.filter((r) => r.status === "N/A").length;
    return {
      total: rows.length,
      cleared,
      pending,
      outstanding: pending,
      denied,
      na,
    };
  }, [rows]);

  const headerRows = [
    ["Production", productionTitle, "Production Title"],
    ["Prepared By", preparedBy, "Prepared By"],
    ["As-Of Date", asOfDate, "As-Of Date"],
  ] as const;

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    const endX = pageWidth - margin;

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
    doc.text("CLEARANCE LOG", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Header block, 2 columns
    const colWidth = contentWidth / 2;
    doc.setFontSize(10);
    for (let i = 0; i < headerRows.length; i += 2) {
      ensure(7);
      const pair = [headerRows[i], headerRows[i + 1]].filter(Boolean) as ReadonlyArray<
        readonly [string, string, string]
      >;
      pair.forEach((entry, col) => {
        const [label, value, placeholder] = entry;
        const x = margin + col * colWidth;
        doc.setFont("helvetica", "bold");
        const labelText = `${label}: `;
        doc.text(labelText, x, y);
        const labelWidth = doc.getTextWidth(labelText);
        doc.setFont("helvetica", "normal");
        const display = value.trim() || `[${placeholder}]`;
        const lines = doc.splitTextToSize(display, colWidth - labelWidth - 6) as string[];
        doc.text(lines[0] ?? "", x + labelWidth, y);
      });
      y += 6;
    }

    y += 4;
    ensure(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total: ${counts.total} · Cleared: ${counts.cleared} · Outstanding: ${counts.outstanding} · Denied: ${counts.denied} · N/A: ${counts.na}`,
      margin,
      y
    );
    y += 10;

    const colX = {
      item: margin,
      type: margin + contentWidth * 0.20,
      rightsHolder: margin + contentWidth * 0.30,
      contact: margin + contentWidth * 0.45,
      requested: margin + contentWidth * 0.58,
      status: margin + contentWidth * 0.69,
      notes: margin + contentWidth * 0.78,
    };

    const drawTableHeader = () => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Item", colX.item + 1, y);
      doc.text("Type", colX.type + 1, y);
      doc.text("Rights Holder", colX.rightsHolder + 1, y);
      doc.text("Contact", colX.contact + 1, y);
      doc.text("Requested", colX.requested + 1, y);
      doc.text("Status", colX.status + 1, y);
      doc.text("Notes", colX.notes + 1, y);
      y += 5;
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 2, endX, y - 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    };

    drawTableHeader();

    rows.forEach((row) => {
      const itemLines = doc.splitTextToSize(
        row.item.trim() || "—",
        colX.type - colX.item - 4
      ) as string[];
      const notesLines = doc.splitTextToSize(
        row.notes.trim() || "—",
        endX - colX.notes - 4
      ) as string[];
      const lineCount = Math.max(itemLines.length, notesLines.length, 1);
      const rowHeight = Math.max(lineCount * 5 + 4, 10);

      if (ensure(rowHeight + 4)) drawTableHeader();

      doc.setTextColor(0, 0, 0);
      itemLines.forEach((line, i) => doc.text(line, colX.item + 1, y + 4 + i * 5));
      doc.text(row.type.trim() || "—", colX.type + 1, y + 4);
      doc.text(row.rightsHolder.trim() || "—", colX.rightsHolder + 1, y + 4);
      doc.text(row.contact.trim() || "—", colX.contact + 1, y + 4);
      doc.text(row.dateRequested.trim() || "—", colX.requested + 1, y + 4);

      const [r, g, b] = pdfStatusColor(row.status);
      doc.setTextColor(r, g, b);
      doc.text(row.status.trim() || "—", colX.status + 1, y + 4);
      doc.setTextColor(0, 0, 0);

      notesLines.forEach((line, i) => doc.text(line, colX.notes + 1, y + 4 + i * 5));

      y += rowHeight;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y - 2, endX, y - 2);
      doc.setDrawColor(180, 180, 180);
    });

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionTitle || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (asOfDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_Clearance_Log.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionTitle("");
    setPreparedBy("");
    setAsOfDate("");
    setRows([emptyItem()]);
  };

  const renderTypeSelect = (value: string, onChange: (next: string) => void) => {
    const isKnown = TYPE_OPTIONS.includes(value);
    return (
      <div className="w-36">
        <Label className="text-xs">Type</Label>
        <Select value={isKnown ? value : OTHER} onValueChange={(next) => onChange(next === OTHER ? "" : next)}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isKnown && (
          <Input
            className="mt-1"
            placeholder="Other type"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Clearance Log</h1>
          <p className="text-muted-foreground">
            Track every clearance item — music, artwork, product, footage — and where each one stands.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers and clearance coordinators tracking rights.</li>
                <li>Post teams building the clearance/E&amp;O file.</li>
                <li>Anyone managing outstanding permissions before delivery.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists every item that needs clearance in one place.</li>
                <li>Tracks rights holder, contact, and current status.</li>
                <li>Shows at a glance what's still outstanding.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Production Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="production_title">Production Title</Label>
                  <Input
                    id="production_title"
                    value={productionTitle}
                    onChange={(e) => setProductionTitle(e.target.value)}
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
                    <Label htmlFor="as_of_date">As-Of Date</Label>
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
                <CardTitle>Clearance Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rows.map((row, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap gap-2 items-end">
                      <div className="flex-1 min-w-[10rem]">
                        <Label className="text-xs">Item / Element</Label>
                        <Input
                          placeholder="Item / Element"
                          value={row.item}
                          onChange={(e) => updateRow(index, { item: e.target.value })}
                        />
                      </div>
                      {renderTypeSelect(row.type, (next) => updateRow(index, { type: next }))}
                      <div className="w-40">
                        <Label className="text-xs">Rights Holder</Label>
                        <Input
                          placeholder="Rights Holder"
                          value={row.rightsHolder}
                          onChange={(e) => updateRow(index, { rightsHolder: e.target.value })}
                        />
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Contact</Label>
                        <Input
                          placeholder="Contact"
                          value={row.contact}
                          onChange={(e) => updateRow(index, { contact: e.target.value })}
                        />
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Requested</Label>
                        <Input
                          type="date"
                          value={row.dateRequested}
                          onChange={(e) => updateRow(index, { dateRequested: e.target.value })}
                        />
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Status</Label>
                        <Select
                          value={row.status}
                          onValueChange={(next) => updateRow(index, { status: next })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
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
                      <div className="flex-1 min-w-[8rem]">
                        <Label className="text-xs">Notes</Label>
                        <Input
                          placeholder="Notes"
                          value={row.notes}
                          onChange={(e) => updateRow(index, { notes: e.target.value })}
                        />
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
                  Add Item
                </Button>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Total: {counts.total}</span>
                  <span>·</span>
                  <span>Cleared: {counts.cleared}</span>
                  <span>·</span>
                  <span>Outstanding: {counts.outstanding}</span>
                  <span>·</span>
                  <span>Denied: {counts.denied}</span>
                  <span>·</span>
                  <span>N/A: {counts.na}</span>
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Clearance Log</h2>
                </div>

                <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-sm">
                  {headerRows.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                    </div>
                  ))}
                </div>

                <div className="text-sm font-medium">
                  Total: {counts.total} · Cleared: {counts.cleared} · Outstanding: {counts.outstanding} · Denied:{" "}
                  {counts.denied} · N/A: {counts.na}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold">Item</th>
                        <th className="text-left py-2 font-semibold">Type</th>
                        <th className="text-left py-2 font-semibold">Rights Holder</th>
                        <th className="text-left py-2 font-semibold">Contact</th>
                        <th className="text-left py-2 font-semibold">Requested</th>
                        <th className="text-left py-2 font-semibold">Status</th>
                        <th className="text-left py-2 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index} className="border-b border-border/60">
                          <td className="py-2 text-muted-foreground">{row.item.trim() || "[Item]"}</td>
                          <td className="py-2 text-muted-foreground">{row.type.trim() || "[Type]"}</td>
                          <td className="py-2 text-muted-foreground">{row.rightsHolder.trim() || "[Rights Holder]"}</td>
                          <td className="py-2 text-muted-foreground">{row.contact.trim() || "[Contact]"}</td>
                          <td className="py-2 text-muted-foreground">{row.dateRequested.trim() || "[Requested]"}</td>
                          <td className="py-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusChipClass(
                                row.status
                              )}`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2 text-muted-foreground">{row.notes.trim() || "[Notes]"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-muted-foreground italic border-t border-border pt-3">
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

export default ClearanceLog;
