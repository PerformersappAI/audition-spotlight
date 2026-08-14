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

interface Shot {
  shotCode: string;
  scene: string;
  description: string;
  vendor: string;
  difficulty: string;
  dueDate: string;
  status: string;
}

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard", "Hero"];
const STATUS_OPTIONS = ["To Do", "In Progress", "In Review", "Final", "Omitted"];

const emptyShot = (): Shot => ({
  shotCode: "",
  scene: "",
  description: "",
  vendor: "",
  difficulty: "Medium",
  dueDate: "",
  status: "To Do",
});

const v = (value: string, placeholder: string) =>
  value.trim() ? value.trim() : `[${placeholder}]`;

const statusChipClass = (status: string): string => {
  switch (status) {
    case "Final":
      return "bg-green-500/20 text-green-300 border border-green-500/30";
    case "In Progress":
      return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
    case "In Review":
      return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
    case "Omitted":
      return "bg-red-500/20 text-red-300 border border-red-500/30 line-through opacity-70";
    default:
      return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
  }
};

const pdfStatusColor = (status: string): [number, number, number] => {
  switch (status) {
    case "Final":
      return [34, 197, 94];
    case "In Progress":
      return [59, 130, 246];
    case "In Review":
      return [245, 158, 11];
    case "Omitted":
      return [239, 68, 68];
    default:
      return [156, 163, 175];
  }
};

const VfxShotList = () => {
  const [productionTitle, setProductionTitle] = useState("");
  const [vfxSupervisor, setVfxSupervisor] = useState("");
  const [editor, setEditor] = useState("");
  const [turnoverDate, setTurnoverDate] = useState("");

  const [rows, setRows] = useState<Shot[]>([emptyShot()]);

  const updateRow = (index: number, patch: Partial<Shot>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addRow = () => setRows((prev) => [...prev, emptyShot()]);

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const counts = useMemo(() => {
    const final = rows.filter((r) => r.status === "Final").length;
    const inProgress = rows.filter((r) => r.status === "In Progress" || r.status === "In Review").length;
    const toDo = rows.filter((r) => r.status === "To Do").length;
    const omitted = rows.filter((r) => r.status === "Omitted").length;
    return {
      total: rows.length,
      final,
      inProgress,
      toDo,
      omitted,
    };
  }, [rows]);

  const headerRows = [
    ["Production", productionTitle, "Production Title"],
    ["VFX Supervisor", vfxSupervisor, "VFX Supervisor"],
    ["Editor / Turnover By", editor, "Editor / Turnover By"],
    ["Turnover Date", turnoverDate, "Turnover Date"],
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
    doc.text("VFX SHOT LIST / TURNOVER", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

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
      `Total: ${counts.total} · Final: ${counts.final} · In Progress: ${counts.inProgress} · To Do: ${counts.toDo} · Omitted: ${counts.omitted}`,
      margin,
      y
    );
    y += 10;

    const colX = {
      shot: margin,
      scene: margin + contentWidth * 0.12,
      description: margin + contentWidth * 0.22,
      vendor: margin + contentWidth * 0.52,
      diff: margin + contentWidth * 0.66,
      due: margin + contentWidth * 0.74,
      status: margin + contentWidth * 0.86,
    };

    const drawTableHeader = () => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Shot", colX.shot + 1, y);
      doc.text("Scene", colX.scene + 1, y);
      doc.text("Description", colX.description + 1, y);
      doc.text("Vendor", colX.vendor + 1, y);
      doc.text("Diff", colX.diff + 1, y);
      doc.text("Due", colX.due + 1, y);
      doc.text("Status", colX.status + 1, y);
      y += 5;
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 2, endX, y - 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    };

    drawTableHeader();

    rows.forEach((row) => {
      const descriptionLines = doc.splitTextToSize(
        row.description.trim() || "—",
        colX.vendor - colX.description - 4
      ) as string[];
      const lineCount = Math.max(descriptionLines.length, 1);
      const rowHeight = Math.max(lineCount * 5 + 4, 10);

      if (ensure(rowHeight + 4)) drawTableHeader();

      doc.setTextColor(0, 0, 0);
      doc.text(row.shotCode.trim() || "—", colX.shot + 1, y + 4);
      doc.text(row.scene.trim() || "—", colX.scene + 1, y + 4);
      descriptionLines.forEach((line, i) => doc.text(line, colX.description + 1, y + 4 + i * 5));
      doc.text(row.vendor.trim() || "—", colX.vendor + 1, y + 4);
      doc.text(row.difficulty.trim() || "—", colX.diff + 1, y + 4);
      doc.text(row.dueDate.trim() || "—", colX.due + 1, y + 4);

      const [r, g, b] = pdfStatusColor(row.status);
      doc.setTextColor(r, g, b);
      doc.text(row.status.trim() || "—", colX.status + 1, y + 4);
      doc.setTextColor(0, 0, 0);

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
    const safeDate = (turnoverDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_VFX_Shot_List.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionTitle("");
    setVfxSupervisor("");
    setEditor("");
    setTurnoverDate("");
    setRows([emptyShot()]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">VFX Shot List / Turnover</h1>
          <p className="text-muted-foreground">
            Track every VFX shot — scene, description, vendor, difficulty, and status — through delivery.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>VFX supervisors and producers tracking shots.</li>
                <li>Editors preparing turnover to vendors.</li>
                <li>Anyone managing the VFX pipeline to final.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists every VFX shot with its work description.</li>
                <li>Assigns a vendor, difficulty, and status.</li>
                <li>Shows what's outstanding on the way to final.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
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
                    <Label htmlFor="vfx_supervisor">VFX Supervisor</Label>
                    <Input
                      id="vfx_supervisor"
                      value={vfxSupervisor}
                      onChange={(e) => setVfxSupervisor(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="turnover_date">Turnover Date</Label>
                    <Input
                      id="turnover_date"
                      type="date"
                      value={turnoverDate}
                      onChange={(e) => setTurnoverDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editor">Editor / Turnover By (optional)</Label>
                  <Input id="editor" value={editor} onChange={(e) => setEditor(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shots</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rows.map((row, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap gap-2 items-end">
                      <div className="w-28">
                        <Label className="text-xs">Shot Code</Label>
                        <Input
                          placeholder="Shot Code"
                          value={row.shotCode}
                          onChange={(e) => updateRow(index, { shotCode: e.target.value })}
                        />
                      </div>
                      <div className="w-24">
                        <Label className="text-xs">Scene</Label>
                        <Input
                          placeholder="Scene"
                          value={row.scene}
                          onChange={(e) => updateRow(index, { scene: e.target.value })}
                        />
                      </div>
                      <div className="flex-1 min-w-[10rem]">
                        <Label className="text-xs">Work Description</Label>
                        <Input
                          placeholder="Work Description"
                          value={row.description}
                          onChange={(e) => updateRow(index, { description: e.target.value })}
                        />
                      </div>
                      <div className="w-36">
                        <Label className="text-xs">Vendor</Label>
                        <Input
                          placeholder="Vendor"
                          value={row.vendor}
                          onChange={(e) => updateRow(index, { vendor: e.target.value })}
                        />
                      </div>
                      <div className="w-32">
                        <Label className="text-xs">Difficulty</Label>
                        <Select
                          value={row.difficulty}
                          onValueChange={(next) => updateRow(index, { difficulty: next })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            {DIFFICULTY_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Due</Label>
                        <Input
                          type="date"
                          value={row.dueDate}
                          onChange={(e) => updateRow(index, { dueDate: e.target.value })}
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
                  Add Shot
                </Button>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Total: {counts.total}</span>
                  <span>·</span>
                  <span>Final: {counts.final}</span>
                  <span>·</span>
                  <span>In Progress: {counts.inProgress}</span>
                  <span>·</span>
                  <span>To Do: {counts.toDo}</span>
                  <span>·</span>
                  <span>Omitted: {counts.omitted}</span>
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">VFX Shot List / Turnover</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {headerRows.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                    </div>
                  ))}
                </div>

                <div className="text-sm font-medium">
                  Total: {counts.total} · Final: {counts.final} · In Progress: {counts.inProgress} · To Do:{" "}
                  {counts.toDo} · Omitted: {counts.omitted}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold">Shot</th>
                        <th className="text-left py-2 font-semibold">Scene</th>
                        <th className="text-left py-2 font-semibold">Description</th>
                        <th className="text-left py-2 font-semibold">Vendor</th>
                        <th className="text-left py-2 font-semibold">Diff</th>
                        <th className="text-left py-2 font-semibold">Due</th>
                        <th className="text-left py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index} className="border-b border-border/60">
                          <td className="py-2 text-muted-foreground">{row.shotCode.trim() || "[Shot Code]"}</td>
                          <td className="py-2 text-muted-foreground">{row.scene.trim() || "[Scene]"}</td>
                          <td className="py-2 text-muted-foreground">{row.description.trim() || "[Description]"}</td>
                          <td className="py-2 text-muted-foreground">{row.vendor.trim() || "[Vendor]"}</td>
                          <td className="py-2 text-muted-foreground">{row.difficulty}</td>
                          <td className="py-2 text-muted-foreground">{row.dueDate.trim() || "[Due]"}</td>
                          <td className="py-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusChipClass(
                                row.status
                              )}`}
                            >
                              {row.status}
                            </span>
                          </td>
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

export default VfxShotList;
