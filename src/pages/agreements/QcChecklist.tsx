import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  section: string;
  checked: boolean;
  result: string;
  note: string;
}

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const SECTIONS = ["Picture", "Sound", "Captions / Text", "Metadata / File", "Other"];
const RESULT_OPTIONS = ["Pass", "Fail", "N/A"];

const DEFAULT_ITEMS: ChecklistItem[] = [
  // Picture
  { id: "pic-1", label: "Black at head and tail per spec", section: "Picture", checked: false, result: "Pass", note: "" },
  { id: "pic-2", label: "No dropped or duplicated frames", section: "Picture", checked: false, result: "Pass", note: "" },
  { id: "pic-3", label: "No compression artifacts / banding", section: "Picture", checked: false, result: "Pass", note: "" },
  { id: "pic-4", label: "Correct aspect ratio & resolution", section: "Picture", checked: false, result: "Pass", note: "" },
  { id: "pic-5", label: "No unintended flash frames or dead pixels", section: "Picture", checked: false, result: "Pass", note: "" },
  { id: "pic-6", label: "Color/gamma consistent, legal levels", section: "Picture", checked: false, result: "Pass", note: "" },
  // Sound
  { id: "snd-1", label: "Audio in sync with picture", section: "Sound", checked: false, result: "Pass", note: "" },
  { id: "snd-2", label: "Loudness meets delivery spec (e.g., -24 LKFS)", section: "Sound", checked: false, result: "Pass", note: "" },
  { id: "snd-3", label: "No clipping, pops, or dropouts", section: "Sound", checked: false, result: "Pass", note: "" },
  { id: "snd-4", label: "Channel config correct (2.0 / 5.1)", section: "Sound", checked: false, result: "Pass", note: "" },
  { id: "snd-5", label: "M&E track present and clean (if required)", section: "Sound", checked: false, result: "Pass", note: "" },
  // Captions / Text
  { id: "cap-1", label: "Captions/subtitles in sync", section: "Captions / Text", checked: false, result: "Pass", note: "" },
  { id: "cap-2", label: "No spelling errors in titles/credits", section: "Captions / Text", checked: false, result: "Pass", note: "" },
  { id: "cap-3", label: "Caption reading speed & placement OK", section: "Captions / Text", checked: false, result: "Pass", note: "" },
  { id: "cap-4", label: "Required languages present", section: "Captions / Text", checked: false, result: "Pass", note: "" },
  // Metadata / File
  { id: "meta-1", label: "Filename & wrapper per delivery spec", section: "Metadata / File", checked: false, result: "Pass", note: "" },
  { id: "meta-2", label: "Timecode starts at spec (e.g., 01:00:00:00)", section: "Metadata / File", checked: false, result: "Pass", note: "" },
  { id: "meta-3", label: "Runtime matches deliverable", section: "Metadata / File", checked: false, result: "Pass", note: "" },
];

const generateId = () => `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const resultBadgeClass = (result: string): string => {
  switch (result) {
    case "Pass":
      return "bg-green-500/20 text-green-300 border border-green-500/30";
    case "Fail":
      return "bg-red-500/20 text-red-300 border border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
  }
};

const pdfResultColor = (result: string): [number, number, number] => {
  switch (result) {
    case "Pass":
      return [34, 197, 94];
    case "Fail":
      return [239, 68, 68];
    default:
      return [156, 163, 175];
  }
};

const QcChecklist = () => {
  const [productionTitle, setProductionTitle] = useState("");
  const [qcBy, setQcBy] = useState("");
  const [masterFormat, setMasterFormat] = useState("");
  const [qcDate, setQcDate] = useState("");
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_ITEMS.map((i) => ({ ...i })));

  const { reviewed, total, progress, issues } = useMemo(() => {
    const reviewed = items.filter((i) => i.checked).length;
    const total = items.length;
    const progress = total > 0 ? Math.round((reviewed / total) * 100) : 0;
    const issues = items.filter((i) => i.result === "Fail").length;
    return { reviewed, total, progress, issues };
  }, [items]);

  const grouped = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>();
    SECTIONS.forEach((section) => map.set(section, []));
    items.forEach((it) => {
      const list = map.get(it.section) || [];
      list.push(it);
      map.set(it.section, list);
    });
    return Array.from(map.entries()).filter(([, list]) => list.length > 0);
  }, [items]);

  const updateItem = (index: number, patch: Partial<ChecklistItem>) =>
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  const addItem = () =>
    setItems((prev) => [...prev, { id: generateId(), label: "", section: "Other", checked: false, result: "Pass", note: "" }]);

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
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

    const writeLine = (label: string, value: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = `${label}: `;
      const labelWidth = doc.getTextWidth(labelText);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(value.trim() || "—", contentWidth - labelWidth) as string[];
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
    doc.text("QC CHECKLIST", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    writeLine("Production", v(productionTitle, "Production Title"));
    writeLine("QC By", v(qcBy, "QC By"));
    writeLine("Master / Format Checked", v(masterFormat, "Master / Format"));
    writeLine("QC Date", v(qcDate, "QC Date"));

    y += 4;
    ensure(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${reviewed} of ${total} reviewed (${progress}%)`, margin, y);
    y += 5;

    const barWidth = contentWidth;
    const barHeight = 3;
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, barWidth, barHeight, "F");
    if (progress > 0) {
      doc.setFillColor(59, 130, 246);
      doc.rect(margin, y, (barWidth * progress) / 100, barHeight, "F");
    }
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const [ir, ig, ib] = issues > 0 ? [239, 68, 68] : [34, 197, 94];
    doc.setTextColor(ir, ig, ib);
    doc.text(`${issues} issue(s) flagged`, margin, y);
    doc.setTextColor(0, 0, 0);
    y += 8;

    grouped.forEach(([section, list]) => {
      ensure(10);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(section, margin, y);
      y += 6;

      list.forEach((it) => {
        const marker = it.checked ? "[X]" : "[ ]";
        const labelLines = doc.splitTextToSize(it.label.trim() || "—", contentWidth - 50) as string[];
        const note = it.note.trim() ? ` — ${it.note.trim()}` : "";
        const noteLines = note ? (doc.splitTextToSize(note, contentWidth - 50) as string[]) : [];
        const lineCount = Math.max(labelLines.length, 1) + noteLines.length;
        ensure(lineCount * 5 + 4);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(marker, margin, y + 5);
        labelLines.forEach((line, i) => doc.text(line, margin + 12, y + 5 + i * 5));

        const [r, g, b] = pdfResultColor(it.result);
        doc.setTextColor(r, g, b);
        doc.setFont("helvetica", "bold");
        doc.text(`— ${it.result.toUpperCase()}`, margin + contentWidth - 40, y + 5);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        noteLines.forEach((line, i) => doc.text(line, margin + 12, y + 5 + labelLines.length * 5 + i * 5));

        y += lineCount * 5 + 2;
      });

      y += 2;
    });

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionTitle || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (qcDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_QC_Checklist.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionTitle("");
    setQcBy("");
    setMasterFormat("");
    setQcDate("");
    setItems(DEFAULT_ITEMS.map((i) => ({ ...i })));
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">QC Checklist</h1>
          <p className="text-muted-foreground">
            Run a quality-control pass on picture, sound, and captions before you deliver.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Post supervisors and QC operators checking the master.</li>
                <li>Producers signing off before delivery.</li>
                <li>Anyone catching technical issues before they ship.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Steps through every QC check by category.</li>
                <li>Marks each check Pass, Fail, or N/A.</li>
                <li>Flags outstanding issues before delivery.</li>
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
                  <Label htmlFor="production_title">Production Title</Label>
                  <Input
                    id="production_title"
                    value={productionTitle}
                    onChange={(e) => setProductionTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="qc_by">QC By</Label>
                    <Input id="qc_by" value={qcBy} onChange={(e) => setQcBy(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="qc_date">QC Date</Label>
                    <Input
                      id="qc_date"
                      type="date"
                      value={qcDate}
                      onChange={(e) => setQcDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="master_format">Master / Format Checked</Label>
                  <Input
                    id="master_format"
                    placeholder="e.g., ProRes 4444 1080p 23.98"
                    value={masterFormat}
                    onChange={(e) => setMasterFormat(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Checklist</CardTitle>
                <Button type="button" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {grouped.map(([section, list]) => (
                  <div key={section} className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{section}</h3>
                    {list.map((it) => {
                      const index = items.findIndex((item) => item.id === it.id);
                      return (
                        <div key={it.id} className="flex items-center gap-3">
                          <Checkbox
                            id={`item-check-${it.id}`}
                            checked={it.checked}
                            onCheckedChange={(checked) => updateItem(index, { checked: checked === true })}
                            aria-label="Toggle reviewed"
                          />
                          <Input
                            className="flex-1"
                            placeholder="Check"
                            value={it.label}
                            onChange={(e) => updateItem(index, { label: e.target.value })}
                          />
                          <Select
                            value={it.section}
                            onValueChange={(next) => updateItem(index, { section: next })}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Section" />
                            </SelectTrigger>
                            <SelectContent>
                              {SECTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={it.result}
                            onValueChange={(next) => updateItem(index, { result: next })}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="Result" />
                            </SelectTrigger>
                            <SelectContent>
                              {RESULT_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            className="w-40"
                            placeholder="Note / status"
                            value={it.note}
                            onChange={(e) => updateItem(index, { note: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            disabled={items.length <= 1}
                            onClick={() => removeItem(index)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="ghost" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">Filmmaker Genius — Document Library.</p>
          </div>

          {/* RIGHT: preview */}
          <div className="space-y-6">
            <div className="sticky top-6 space-y-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-white text-black p-8 min-h-[600px]">
                    <h2 className="text-center text-2xl font-bold uppercase tracking-wide text-black mb-6">
                      QC Checklist
                    </h2>

                    <div className="text-sm space-y-1 mb-6">
                      <p>
                        <span className="font-semibold">Production:</span>{" "}
                        {productionTitle.trim() || (
                          <span className="italic text-gray-500">[Production Title]</span>
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">QC By:</span>{" "}
                        {qcBy.trim() || <span className="italic text-gray-500">[QC By]</span>}
                      </p>
                      <p>
                        <span className="font-semibold">Master / Format:</span>{" "}
                        {masterFormat.trim() || <span className="italic text-gray-500">[Master / Format]</span>}
                      </p>
                      <p>
                        <span className="font-semibold">QC Date:</span>{" "}
                        {qcDate.trim() || <span className="italic text-gray-500">[QC Date]</span>}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-1">
                        {reviewed} of {total} reviewed ({progress}%)
                      </p>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mb-6 ${
                        issues > 0
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}
                    >
                      {issues > 0 ? `⚠ ${issues} issue(s) flagged` : "No issues flagged"}
                    </div>

                    <div className="space-y-6">
                      {grouped.map(([section, list]) => (
                        <div key={section}>
                          <h3 className="font-semibold text-sm uppercase tracking-wide mb-2">{section}</h3>
                          <div className="space-y-2">
                            {list.map((it) => (
                              <div key={it.id} className="flex items-start gap-2 text-sm">
                                <span className="font-mono text-base leading-none mt-0.5">
                                  {it.checked ? "☑" : "☐"}
                                </span>
                                <div className="flex-1">
                                  <span className={it.checked ? "line-through text-gray-500" : ""}>
                                    {it.label.trim() || <span className="italic text-gray-500">—</span>}
                                  </span>
                                  {it.note.trim() && (
                                    <span className="text-gray-500"> — {it.note.trim()}</span>
                                  )}
                                </div>
                                <span
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${resultBadgeClass(
                                    it.result
                                  )}`}
                                >
                                  {it.result.toUpperCase()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-12">
                      Filmmaker Genius — Document Library.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QcChecklist;
