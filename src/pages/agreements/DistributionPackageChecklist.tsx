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
  note: string;
}

const v = (value: string, placeholder: string) =>
  value.trim() ? value.trim() : `[${placeholder}]`;

const SECTIONS = [
  "Masters",
  "Audio",
  "Access / Localization",
  "Marketing Materials",
  "Metadata & Info",
  "Legal & Admin",
  "Other",
];

const DEFAULT_ITEMS: ChecklistItem[] = [
  // Masters
  { id: "mas-1", label: "Feature master (ProRes 4444 / DCP / IMF as specified)", section: "Masters", checked: false, note: "" },
  { id: "mas-2", label: "Textless master", section: "Masters", checked: false, note: "" },
  { id: "mas-3", label: "Trailer & teaser masters", section: "Masters", checked: false, note: "" },
  { id: "mas-4", label: "Language/dubbed versions (if any)", section: "Masters", checked: false, note: "" },
  // Audio
  { id: "aud-1", label: "5.1 and 2.0 mixes", section: "Audio", checked: false, note: "" },
  { id: "aud-2", label: "M&E (fully filled) track", section: "Audio", checked: false, note: "" },
  { id: "aud-3", label: "Dolby/immersive mix (if applicable)", section: "Audio", checked: false, note: "" },
  { id: "aud-4", label: "Audio configuration/layout sheet", section: "Audio", checked: false, note: "" },
  // Access / Localization
  { id: "loc-1", label: "Closed captions & subtitles (source language)", section: "Access / Localization", checked: false, note: "" },
  { id: "loc-2", label: "Dialogue list / CCSL", section: "Access / Localization", checked: false, note: "" },
  { id: "loc-3", label: "Translated subtitle templates (if required)", section: "Access / Localization", checked: false, note: "" },
  // Marketing Materials
  { id: "mkt-1", label: "Key art (layered + flat, print & digital)", section: "Marketing Materials", checked: false, note: "" },
  { id: "mkt-2", label: "Stills (production & unit photography)", section: "Marketing Materials", checked: false, note: "" },
  { id: "mkt-3", label: "EPK / behind-the-scenes", section: "Marketing Materials", checked: false, note: "" },
  { id: "mkt-4", label: "Trailer / TV spots", section: "Marketing Materials", checked: false, note: "" },
  { id: "mkt-5", label: "Synopses (short & long) + logline", section: "Marketing Materials", checked: false, note: "" },
  // Metadata & Info
  { id: "inf-1", label: "Title metadata sheet (cast, crew, genre, runtime)", section: "Metadata & Info", checked: false, note: "" },
  { id: "inf-2", label: "Spec/tech sheet (format, codec, TRT)", section: "Metadata & Info", checked: false, note: "" },
  { id: "inf-3", label: "Poster & billing block credits", section: "Metadata & Info", checked: false, note: "" },
  // Legal & Admin
  { id: "leg-1", label: "Chain of title / clearance file", section: "Legal & Admin", checked: false, note: "" },
  { id: "leg-2", label: "E&O insurance certificate", section: "Legal & Admin", checked: false, note: "" },
  { id: "leg-3", label: "Music cue sheet", section: "Legal & Admin", checked: false, note: "" },
  { id: "leg-4", label: "Signed delivery schedule", section: "Legal & Admin", checked: false, note: "" },
  { id: "leg-5", label: "QC report", section: "Legal & Admin", checked: false, note: "" },
];

const generateId = () => `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const DistributionPackageChecklist = () => {
  const [productionTitle, setProductionTitle] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [recipient, setRecipient] = useState("");
  const [packageDate, setPackageDate] = useState("");
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_ITEMS.map((i) => ({ ...i })));

  const { completed, total, progress } = useMemo(() => {
    const completed = items.filter((i) => i.checked).length;
    const total = items.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, progress };
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
    setItems((prev) => [
      ...prev,
      { id: generateId(), label: "", section: "Other", checked: false, note: "" },
    ]);

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
      const lines = doc.splitTextToSize(
        value.trim() || "—",
        contentWidth - labelWidth
      ) as string[];
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
    doc.text("DISTRIBUTION PACKAGE CHECKLIST", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    writeLine("Production", v(productionTitle, "Production Title"));
    writeLine("Prepared By", v(preparedBy, "Prepared By"));
    writeLine("Sales Agent / Distributor", v(recipient, "Sales Agent / Distributor"));
    writeLine("Date", v(packageDate, "Date"));

    y += 4;
    ensure(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${completed} of ${total} complete (${progress}%)`, margin, y);
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

    grouped.forEach(([section, list]) => {
      ensure(10);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(section, margin, y);
      y += 6;

      list.forEach((it) => {
        const marker = it.checked ? "[X]" : "[ ]";
        const note = it.note.trim() ? ` — ${it.note.trim()}` : "";
        const text = `${marker} ${it.label.trim() || "—"}${note}`;
        const lines = doc.splitTextToSize(text, contentWidth) as string[];
        ensure(lines.length * 5 + 2);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        lines.forEach((line, i) => doc.text(line, margin, y + i * 5));
        y += lines.length * 5 + 2;
      });

      y += 2;
    });

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionTitle || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (packageDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_Distribution_Package_Checklist.pdf`);
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
    setRecipient("");
    setPackageDate("");
    setItems(DEFAULT_ITEMS.map((i) => ({ ...i })));
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Distribution Package Checklist</h1>
          <p className="text-muted-foreground">
            Assemble everything a sales agent or distributor needs — masters, materials, marketing, and legal.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers preparing a film for market or sale.</li>
                <li>Sales agents and distributors receiving a title.</li>
                <li>Anyone assembling the full distribution package.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists every element a distributor expects.</li>
                <li>Tracks masters, materials, marketing, and paperwork.</li>
                <li>Shows completeness of the package at a glance.</li>
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
                    <Label htmlFor="prepared_by">Prepared By</Label>
                    <Input
                      id="prepared_by"
                      value={preparedBy}
                      onChange={(e) => setPreparedBy(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="package_date">Date</Label>
                    <Input
                      id="package_date"
                      type="date"
                      value={packageDate}
                      onChange={(e) => setPackageDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="recipient">Sales Agent / Distributor</Label>
                  <Input
                    id="recipient"
                    placeholder="e.g., XYZ Sales"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
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
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                      {section}
                    </h3>
                    {list.map((it) => {
                      const index = items.findIndex((item) => item.id === it.id);
                      return (
                        <div key={it.id} className="flex items-center gap-3">
                          <Checkbox
                            id={`item-check-${it.id}`}
                            checked={it.checked}
                            onCheckedChange={(checked) =>
                              updateItem(index, { checked: checked === true })
                            }
                            aria-label="Toggle item"
                          />
                          <Input
                            className="flex-1"
                            placeholder="Deliverable"
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
                      Distribution Package Checklist
                    </h2>

                    <div className="text-sm space-y-1 mb-6">
                      <p>
                        <span className="font-semibold">Production:</span>{" "}
                        {productionTitle.trim() || (
                          <span className="italic text-gray-500">[Production Title]</span>
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">Prepared By:</span>{" "}
                        {preparedBy.trim() || (
                          <span className="italic text-gray-500">[Prepared By]</span>
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">Sales Agent / Distributor:</span>{" "}
                        {recipient.trim() || (
                          <span className="italic text-gray-500">[Sales Agent / Distributor]</span>
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {packageDate.trim() || (
                          <span className="italic text-gray-500">[Date]</span>
                        )}
                      </p>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm font-semibold mb-1">
                        {completed} of {total} complete ({progress}%)
                      </p>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      {grouped.map(([section, list]) => (
                        <div key={section}>
                          <h3 className="font-semibold text-sm uppercase tracking-wide mb-2">
                            {section}
                          </h3>
                          <div className="space-y-2">
                            {list.map((it) => (
                              <div key={it.id} className="flex items-start gap-2 text-sm">
                                <span className="font-mono text-base leading-none mt-0.5">
                                  {it.checked ? "☑" : "☐"}
                                </span>
                                <div className="flex-1">
                                  <span className={it.checked ? "line-through text-gray-500" : ""}>
                                    {it.label.trim() || (
                                      <span className="italic text-gray-500">—</span>
                                    )}
                                  </span>
                                  {it.note.trim() && (
                                    <span className="text-gray-500"> — {it.note.trim()}</span>
                                  )}
                                </div>
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

export default DistributionPackageChecklist;
