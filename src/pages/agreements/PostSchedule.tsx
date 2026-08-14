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

interface Milestone {
  phase: string;
  task: string;
  owner: string;
  startDate: string;
  dueDate: string;
  status: string;
}

const PHASE_OPTIONS = [
  "Editorial",
  "Picture Lock",
  "Sound Design",
  "Mix",
  "Music",
  "VFX",
  "Color",
  "Titles & Credits",
  "QC",
  "Deliverables",
  "Other",
];

const STATUS_OPTIONS = ["Not Started", "In Progress", "Review", "Complete", "Blocked"];

const OTHER = "Other";

const emptyMilestone = (): Milestone => ({
  phase: "Editorial",
  task: "",
  owner: "",
  startDate: "",
  dueDate: "",
  status: "Not Started",
});

const v = (value: string, placeholder: string) =>
  value.trim() ? value.trim() : `[${placeholder}]`;

const statusChipClass = (status: string): string => {
  switch (status) {
    case "Complete":
      return "bg-green-500/20 text-green-300 border border-green-500/30";
    case "In Progress":
      return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
    case "Review":
      return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
    case "Blocked":
      return "bg-red-500/20 text-red-300 border border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
  }
};

const pdfStatusColor = (status: string): [number, number, number] => {
  switch (status) {
    case "Complete":
      return [34, 197, 94];
    case "In Progress":
      return [59, 130, 246];
    case "Review":
      return [245, 158, 11];
    case "Blocked":
      return [239, 68, 68];
    default:
      return [156, 163, 175];
  }
};

const PostSchedule = () => {
  const [productionTitle, setProductionTitle] = useState("");
  const [postSupervisor, setPostSupervisor] = useState("");
  const [editor, setEditor] = useState("");
  const [targetDelivery, setTargetDelivery] = useState("");

  const [rows, setRows] = useState<Milestone[]>([emptyMilestone()]);

  const updateRow = (index: number, patch: Partial<Milestone>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addRow = () => setRows((prev) => [...prev, emptyMilestone()]);

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const counts = useMemo(() => {
    const complete = rows.filter((r) => r.status === "Complete").length;
    const inProgress = rows.filter((r) => r.status === "In Progress" || r.status === "Review").length;
    const notStarted = rows.filter((r) => r.status === "Not Started").length;
    const blocked = rows.filter((r) => r.status === "Blocked").length;
    return {
      total: rows.length,
      complete,
      inProgress,
      notStarted,
      blocked,
    };
  }, [rows]);

  const headerRows = [
    ["Production", productionTitle, "Production Title"],
    ["Post Supervisor", postSupervisor, "Post Supervisor"],
    ["Editor", editor, "Editor"],
    ["Target Delivery", targetDelivery, "Target Delivery Date"],
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
    doc.text("POST SCHEDULE", pageWidth / 2, y, { align: "center" });
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
      `Total: ${counts.total} · Complete: ${counts.complete} · In Progress: ${counts.inProgress} · Not Started: ${counts.notStarted} · Blocked: ${counts.blocked}`,
      margin,
      y
    );
    y += 10;

    const colX = {
      phase: margin,
      task: margin + contentWidth * 0.18,
      owner: margin + contentWidth * 0.46,
      start: margin + contentWidth * 0.62,
      due: margin + contentWidth * 0.74,
      status: margin + contentWidth * 0.86,
    };

    const drawTableHeader = () => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Phase", colX.phase + 1, y);
      doc.text("Task", colX.task + 1, y);
      doc.text("Owner", colX.owner + 1, y);
      doc.text("Start", colX.start + 1, y);
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
      const taskLines = doc.splitTextToSize(
        row.task.trim() || "—",
        colX.owner - colX.task - 4
      ) as string[];
      const lineCount = Math.max(taskLines.length, 1);
      const rowHeight = Math.max(lineCount * 5 + 4, 10);

      if (ensure(rowHeight + 4)) drawTableHeader();

      doc.setTextColor(0, 0, 0);
      doc.text(row.phase.trim() || "—", colX.phase + 1, y + 4);
      taskLines.forEach((line, i) => doc.text(line, colX.task + 1, y + 4 + i * 5));
      doc.text(row.owner.trim() || "—", colX.owner + 1, y + 4);
      doc.text(row.startDate.trim() || "—", colX.start + 1, y + 4);
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
    const safeDate = (targetDelivery || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_Post_Schedule.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionTitle("");
    setPostSupervisor("");
    setEditor("");
    setTargetDelivery("");
    setRows([emptyMilestone()]);
  };

  const renderPhaseSelect = (value: string, onChange: (next: string) => void) => {
    const isKnown = PHASE_OPTIONS.includes(value);
    return (
      <div className="w-40">
        <Label className="text-xs">Phase</Label>
        <Select value={isKnown ? value : OTHER} onValueChange={(next) => onChange(next === OTHER ? "" : next)}>
          <SelectTrigger>
            <SelectValue placeholder="Phase" />
          </SelectTrigger>
          <SelectContent>
            {PHASE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isKnown && (
          <Input
            className="mt-1"
            placeholder="Other phase"
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
          <h1 className="text-3xl font-bold mb-2">Post Schedule</h1>
          <p className="text-muted-foreground">
            Map every post milestone — edit, sound, VFX, color, and delivery — with dates and owners.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Post supervisors and producers planning the post timeline.</li>
                <li>Editors, sound, VFX, and color leads coordinating handoffs.</li>
                <li>Anyone tracking post milestones toward delivery.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lays out every post phase with start and due dates.</li>
                <li>Assigns an owner and status to each milestone.</li>
                <li>Shows the critical path from lock to delivery.</li>
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
                    <Label htmlFor="post_supervisor">Post Supervisor</Label>
                    <Input
                      id="post_supervisor"
                      value={postSupervisor}
                      onChange={(e) => setPostSupervisor(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target_delivery">Target Delivery Date</Label>
                    <Input
                      id="target_delivery"
                      type="date"
                      value={targetDelivery}
                      onChange={(e) => setTargetDelivery(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editor">Editor (optional)</Label>
                  <Input id="editor" value={editor} onChange={(e) => setEditor(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rows.map((row, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap gap-2 items-end">
                      {renderPhaseSelect(row.phase, (next) => updateRow(index, { phase: next }))}
                      <div className="flex-1 min-w-[10rem]">
                        <Label className="text-xs">Task / Description</Label>
                        <Input
                          placeholder="Task / Description"
                          value={row.task}
                          onChange={(e) => updateRow(index, { task: e.target.value })}
                        />
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Owner</Label>
                        <Input
                          placeholder="Owner"
                          value={row.owner}
                          onChange={(e) => updateRow(index, { owner: e.target.value })}
                        />
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Start</Label>
                        <Input
                          type="date"
                          value={row.startDate}
                          onChange={(e) => updateRow(index, { startDate: e.target.value })}
                        />
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
                  Add Milestone
                </Button>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Total: {counts.total}</span>
                  <span>·</span>
                  <span>Complete: {counts.complete}</span>
                  <span>·</span>
                  <span>In Progress: {counts.inProgress}</span>
                  <span>·</span>
                  <span>Not Started: {counts.notStarted}</span>
                  <span>·</span>
                  <span>Blocked: {counts.blocked}</span>
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Post Schedule</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {headerRows.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                    </div>
                  ))}
                </div>

                <div className="text-sm font-medium">
                  Total: {counts.total} · Complete: {counts.complete} · In Progress: {counts.inProgress} · Not
                  Started: {counts.notStarted} · Blocked: {counts.blocked}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold">Phase</th>
                        <th className="text-left py-2 font-semibold">Task</th>
                        <th className="text-left py-2 font-semibold">Owner</th>
                        <th className="text-left py-2 font-semibold">Start</th>
                        <th className="text-left py-2 font-semibold">Due</th>
                        <th className="text-left py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index} className="border-b border-border/60">
                          <td className="py-2 text-muted-foreground">{row.phase.trim() || "[Phase]"}</td>
                          <td className="py-2 text-muted-foreground">{row.task.trim() || "[Task]"}</td>
                          <td className="py-2 text-muted-foreground">{row.owner.trim() || "[Owner]"}</td>
                          <td className="py-2 text-muted-foreground">{row.startDate.trim() || "[Start]"}</td>
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

export default PostSchedule;
