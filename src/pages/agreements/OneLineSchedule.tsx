import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

type RowType = "Scene" | "Day Break";

interface ScheduleRow {
  type: RowType;
  scene: string;
  set: string;
  dn: string;
  pages: string;
  cast: string;
  day_label: string;
}

const INITIAL_ROWS: ScheduleRow[] = [
  {
    type: "Scene",
    scene: "9",
    set: "INT. Apartment — breakfast",
    dn: "Day",
    pages: "3",
    cast: "1,2,3",
    day_label: "",
  },
  {
    type: "Scene",
    scene: "10",
    set: "INT. Apartment — the raid",
    dn: "Day",
    pages: "2 4/8",
    cast: "1,2,3,4",
    day_label: "",
  },
  {
    type: "Day Break",
    scene: "",
    set: "",
    dn: "Day",
    pages: "",
    cast: "",
    day_label: "END OF DAY 1",
  },
];

const DAY_NIGHT_OPTIONS = ["Day", "Night", "Dawn", "Dusk"];
const ROW_TYPE_OPTIONS: RowType[] = ["Scene", "Day Break"];

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const OneLineSchedule = () => {
  const [productionName, setProductionName] = useState("");
  const [rows, setRows] = useState<ScheduleRow[]>(INITIAL_ROWS);

  const updateRow = (index: number, patch: Partial<ScheduleRow>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { type: "Scene", scene: "", set: "", dn: "Day", pages: "", cast: "", day_label: "" },
    ]);
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const ensure = (h = 8) => {
      if (y + h > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const write = (
      text: string,
      size = 11,
      style: "normal" | "bold" | "italic" = "normal",
      align: "left" | "center" = "left"
    ) => {
      doc.setFontSize(size);
      doc.setFont("times", style);
      const lines = doc.splitTextToSize(text, contentWidth) as string[];
      lines.forEach((line) => {
        ensure(6);
        if (align === "center") doc.text(line, pageWidth / 2, y, { align: "center" });
        else doc.text(line, margin, y);
        y += size * 0.55;
      });
    };

    write(
      productionName.trim()
        ? `ONE-LINE SCHEDULE — ${productionName}`
        : "ONE-LINE SCHEDULE — [Production Name]",
      16,
      "bold",
      "center"
    );
    y += 8;

    rows.forEach((row) => {
      ensure(10);
      if (row.type === "Day Break") {
        const label = row.day_label.trim() || "[Day Break]";
        const barHeight = 8;
        doc.setFillColor(230, 230, 230);
        doc.rect(margin, y, contentWidth, barHeight, "F");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("times", "bold");
        doc.text(label, pageWidth / 2, y + 5.5, { align: "center" });
        y += barHeight + 3;
      } else {
        const scene = row.scene.trim() || "—";
        const set = row.set.trim() || "—";
        const dn = row.dn.trim() || "—";
        const pages = row.pages.trim() || "—";
        const cast = row.cast.trim() || "—";
        const line = `Sc ${scene}  ${set}  (${dn})  ${pages} pgs  Cast: ${cast}`;
        write(line, 10, "normal");
        y += 2;
      }
    });

    y += 8;
    doc.setTextColor(120, 120, 120);
    write("Filmmaker Genius — Document Library.", 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_OneLineSchedule.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">One-Line Schedule</h1>
          <p className="text-muted-foreground">
            A condensed, one-line-per-scene overview of your shooting order.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>ADs and producers sharing a quick shoot overview.</li>
                <li>Department heads scanning the day's scenes.</li>
                <li>Anyone who needs the schedule at a glance.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Condenses the shoot to one line per scene.</li>
                <li>Shows scene, set, D/N, pages, and cast in order.</li>
                <li>Optionally breaks the schedule into shooting days.</li>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Rows</CardTitle>
                <Button type="button" size="sm" onClick={addRow}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Row
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {rows.map((row, index) => (
                  <div key={index} className="space-y-3 p-3 rounded-lg border border-border/50 bg-card">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 grid gap-3">
                        <div>
                          <Label htmlFor={`type-${index}`}>Type</Label>
                          <Select
                            value={row.type}
                            onValueChange={(val) =>
                              updateRow(index, { type: val as RowType })
                            }
                          >
                            <SelectTrigger id={`type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROW_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {row.type === "Scene" ? (
                          <>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label htmlFor={`scene-${index}`}>Scene #</Label>
                                <Input
                                  id={`scene-${index}`}
                                  value={row.scene}
                                  onChange={(e) => updateRow(index, { scene: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`dn-${index}`}>D/N</Label>
                                <Select
                                  value={row.dn}
                                  onValueChange={(val) => updateRow(index, { dn: val })}
                                >
                                  <SelectTrigger id={`dn-${index}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {DAY_NIGHT_OPTIONS.map((opt) => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`set-${index}`}>Set / Description</Label>
                              <Input
                                id={`set-${index}`}
                                value={row.set}
                                onChange={(e) => updateRow(index, { set: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label htmlFor={`pages-${index}`}>Pages</Label>
                                <Input
                                  id={`pages-${index}`}
                                  placeholder="2 3/8"
                                  value={row.pages}
                                  onChange={(e) => updateRow(index, { pages: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`cast-${index}`}>Cast</Label>
                                <Input
                                  id={`cast-${index}`}
                                  placeholder="1, 2, 3"
                                  value={row.cast}
                                  onChange={(e) => updateRow(index, { cast: e.target.value })}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div>
                            <Label htmlFor={`day_label-${index}`}>Day Break Label</Label>
                            <Input
                              id={`day_label-${index}`}
                              placeholder="END OF DAY 1 — Total: 5 3/8 pgs"
                              value={row.day_label}
                              onChange={(e) => updateRow(index, { day_label: e.target.value })}
                            />
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-5 shrink-0"
                        disabled={rows.length <= 1}
                        onClick={() => removeRow(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: preview */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                onClick={() => {
                  setProductionName("");
                  setRows(INITIAL_ROWS);
                }}
                variant="ghost"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <Card>
              <CardContent className="p-6 max-h-[75vh] overflow-y-auto">
                <article className="font-serif text-sm leading-relaxed space-y-3">
                  <h2 className="text-center font-bold tracking-wide text-base">
                    {productionName.trim()
                      ? `ONE-LINE SCHEDULE — ${productionName}`
                      : "ONE-LINE SCHEDULE — [Production Name]"}
                  </h2>

                  {rows.map((row, index) => {
                    if (row.type === "Day Break") {
                      return (
                        <div
                          key={index}
                          className="bg-muted border border-border rounded px-3 py-2 text-center font-bold text-sm"
                        >
                          {row.day_label.trim() || "[Day Break]"}
                        </div>
                      );
                    }
                    const scene = row.scene.trim() || "—";
                    const set = row.set.trim() || "—";
                    const dn = row.dn.trim() || "—";
                    const pages = row.pages.trim() || "—";
                    const cast = row.cast.trim() || "—";
                    return (
                      <div key={index} className="text-sm">
                        Sc {scene} &nbsp; {set} &nbsp; ({dn}) &nbsp; {pages} pgs &nbsp; Cast: {cast}
                      </div>
                    );
                  })}

                  <p className="italic text-xs text-muted-foreground pt-6">
                    Filmmaker Genius — Document Library.
                  </p>
                </article>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Filmmaker Genius — Document Library.
        </p>
      </div>
    </div>
  );
};

export default OneLineSchedule;
