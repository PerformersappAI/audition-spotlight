import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

type RowType = "Day Header" | "Scene";

interface ScheduleRow {
  type: RowType;
  // Day Header
  day_number: string;
  date: string;
  location: string;
  crew_call: string;
  // Scene
  scene: string;
  set: string;
  dn: string;
  pages: string;
  cast: string;
  est_time: string;
}

const INITIAL_ROWS: ScheduleRow[] = [
  {
    type: "Day Header",
    day_number: "1",
    date: "Mon, Aug 10",
    location: "INT. Apartment",
    crew_call: "08:00",
    scene: "",
    set: "",
    dn: "Day",
    pages: "",
    cast: "",
    est_time: "",
  },
  {
    type: "Scene",
    day_number: "",
    date: "",
    location: "",
    crew_call: "",
    scene: "9",
    set: "Living Room — breakfast",
    dn: "Day",
    pages: "3",
    cast: "1,2,3",
    est_time: "10:00–13:00",
  },
  {
    type: "Scene",
    day_number: "",
    date: "",
    location: "",
    crew_call: "",
    scene: "3",
    set: "Bedroom — romantic night",
    dn: "Night",
    pages: "2",
    cast: "1,2",
    est_time: "14:00–17:00",
  },
];

const DAY_NIGHT_OPTIONS = ["Day", "Night", "Dawn", "Dusk"];
const ROW_TYPE_OPTIONS: RowType[] = ["Day Header", "Scene"];

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const ShootingSchedule = () => {
  const [productionName, setProductionName] = useState("");
  const [rows, setRows] = useState<ScheduleRow[]>(INITIAL_ROWS);

  const updateRow = (index: number, patch: Partial<ScheduleRow>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        type: "Scene",
        day_number: "",
        date: "",
        location: "",
        crew_call: "",
        scene: "",
        set: "",
        dn: "Day",
        pages: "",
        cast: "",
        est_time: "",
      },
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
      align: "left" | "center" = "left",
      xOffset = 0
    ) => {
      doc.setFontSize(size);
      doc.setFont("times", style);
      const lines = doc.splitTextToSize(text, contentWidth - xOffset) as string[];
      lines.forEach((line) => {
        ensure(6);
        if (align === "center") doc.text(line, pageWidth / 2, y, { align: "center" });
        else doc.text(line, margin + xOffset, y);
        y += size * 0.55;
      });
    };

    write(
      productionName.trim()
        ? `SHOOTING SCHEDULE — ${productionName}`
        : "SHOOTING SCHEDULE — [Production Name]",
      16,
      "bold",
      "center"
    );
    y += 8;

    rows.forEach((row) => {
      ensure(10);
      if (row.type === "Day Header") {
        const dayNum = row.day_number.trim() || "—";
        const date = row.date.trim() || "—";
        const location = row.location.trim() || "—";
        const crewCall = row.crew_call.trim() || "—";
        const label = `DAY ${dayNum} — ${date}   |   ${location}   |   Crew Call: ${crewCall}`;
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
        const estTime = row.est_time.trim() ? `   ${row.est_time.trim()}` : "";
        const line = `Sc ${scene}  ${set}  (${dn})  ${pages} pgs  Cast: ${cast}${estTime}`;
        write(line, 10, "normal", "left", 4);
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
    doc.save(`${safeProduction}_ShootingSchedule.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Shooting Schedule</h1>
          <p className="text-muted-foreground">
            The full day-by-day plan the whole crew follows.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>1st ADs building the full shoot plan.</li>
                <li>Producers scheduling days, locations, and cast.</li>
                <li>Anyone turning the stripboard into a working schedule.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lays out the shoot day by day.</li>
                <li>Details scenes, times, cast, and locations per day.</li>
                <li>The working plan the whole crew follows.</li>
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
                            onValueChange={(val) => updateRow(index, { type: val as RowType })}
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

                        {row.type === "Day Header" ? (
                          <>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label htmlFor={`day_number-${index}`}>Day #</Label>
                                <Input
                                  id={`day_number-${index}`}
                                  value={row.day_number}
                                  onChange={(e) => updateRow(index, { day_number: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`date-${index}`}>Date</Label>
                                <Input
                                  id={`date-${index}`}
                                  placeholder="Mon, Aug 10"
                                  value={row.date}
                                  onChange={(e) => updateRow(index, { date: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <Label htmlFor={`location-${index}`}>Location</Label>
                                <Input
                                  id={`location-${index}`}
                                  value={row.location}
                                  onChange={(e) => updateRow(index, { location: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`crew_call-${index}`}>Crew Call</Label>
                                <Input
                                  id={`crew_call-${index}`}
                                  placeholder="08:00"
                                  value={row.crew_call}
                                  onChange={(e) => updateRow(index, { crew_call: e.target.value })}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
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
                            <div className="grid gap-3 sm:grid-cols-3">
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
                              <div>
                                <Label htmlFor={`est_time-${index}`}>Est. Time</Label>
                                <Input
                                  id={`est_time-${index}`}
                                  placeholder="10:00–13:00"
                                  value={row.est_time}
                                  onChange={(e) => updateRow(index, { est_time: e.target.value })}
                                />
                              </div>
                            </div>
                          </>
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
                      ? `SHOOTING SCHEDULE — ${productionName}`
                      : "SHOOTING SCHEDULE — [Production Name]"}
                  </h2>

                  {rows.map((row, index) => {
                    if (row.type === "Day Header") {
                      const dayNum = row.day_number.trim() || "—";
                      const date = row.date.trim() || "—";
                      const location = row.location.trim() || "—";
                      const crewCall = row.crew_call.trim() || "—";
                      return (
                        <div
                          key={index}
                          className="bg-muted border border-border rounded px-3 py-2 text-center font-bold text-sm"
                        >
                          DAY {dayNum} — {date} &nbsp;|&nbsp; {location} &nbsp;|&nbsp; Crew Call: {crewCall}
                        </div>
                      );
                    }
                    const scene = row.scene.trim() || "—";
                    const set = row.set.trim() || "—";
                    const dn = row.dn.trim() || "—";
                    const pages = row.pages.trim() || "—";
                    const cast = row.cast.trim() || "—";
                    const estTime = row.est_time.trim() ? `   ${row.est_time.trim()}` : "";
                    return (
                      <div key={index} className="text-sm pl-4">
                        Sc {scene} &nbsp; {set} &nbsp; ({dn}) &nbsp; {pages} pgs &nbsp; Cast: {cast}
                        {estTime}
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

export default ShootingSchedule;
