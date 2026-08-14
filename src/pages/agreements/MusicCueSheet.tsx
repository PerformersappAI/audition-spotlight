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

interface CueRow {
  cueNo: string;
  title: string;
  writers: string;
  publishers: string;
  pro: string;
  use: string;
  duration: string;
}

const PRO_OPTIONS = ["ASCAP", "BMI", "SESAC", "GMR", "PRS", "Public Domain"];
const USE_OPTIONS = [
  "Main Title",
  "End Title",
  "Featured Vocal",
  "Background Vocal",
  "Featured Instrumental",
  "Background Instrumental",
  "Theme",
  "Source",
  "Logo",
];

const OTHER = "Other";

const emptyCue = (): CueRow => ({
  cueNo: "",
  title: "",
  writers: "",
  publishers: "",
  pro: "ASCAP",
  use: "Background Instrumental",
  duration: "",
});

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const parseDuration = (raw: string): number => {
  const text = raw.trim();
  if (!text) return 0;
  const parts = text.split(":");
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return 0;
  if (minutes < 0 || seconds < 0 || seconds > 59) return 0;
  return minutes * 60 + seconds;
};

const formatDuration = (total: number): string => {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
};

const MusicCueSheet = () => {
  const [productionTitle, setProductionTitle] = useState("");
  const [productionCompany, setProductionCompany] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [totalRuntime, setTotalRuntime] = useState("");
  const [airReleaseDate, setAirReleaseDate] = useState("");
  const [composer, setComposer] = useState("");
  const [musicSupervisor, setMusicSupervisor] = useState("");
  const [contact, setContact] = useState("");

  const [rows, setRows] = useState<CueRow[]>([emptyCue()]);

  const updateRow = (index: number, patch: Partial<CueRow>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addRow = () => setRows((prev) => [...prev, emptyCue()]);

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const totalSeconds = useMemo(
    () => rows.reduce((sum, row) => sum + parseDuration(row.duration), 0),
    [rows]
  );

  const totalDuration = useMemo(() => formatDuration(totalSeconds), [totalSeconds]);

  const headerRows = [
    ["Production", productionTitle, "Production Title"],
    ["Company", productionCompany, "Production Company"],
    ["Episode", episodeTitle, "Episode Title / No."],
    ["Air / Release Date", airReleaseDate, "Air / Release Date"],
    ["Composer", composer, "Composer / Score By"],
    ["Music Supervisor", musicSupervisor, "Music Supervisor"],
    ["Prepared By", contact, "Prepared By / Contact"],
    ["Total Runtime", totalRuntime, "Total Runtime"],
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
        return true;
      }
      return false;
    };

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("MUSIC CUE SHEET", pageWidth / 2, y, { align: "center" });
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
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CUES", margin, y);
    y += 6;

    const colX = {
      cueNo: margin,
      title: margin + 16,
      writers: margin + contentWidth * 0.28,
      publishers: margin + contentWidth * 0.48,
      pro: margin + contentWidth * 0.68,
      use: margin + contentWidth * 0.78,
      duration: pageWidth - margin,
    };

    const drawTableHeader = () => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Cue #", colX.cueNo + 1, y);
      doc.text("Title", colX.title + 1, y);
      doc.text("Writer(s)", colX.writers + 1, y);
      doc.text("Publisher(s)", colX.publishers + 1, y);
      doc.text("PRO", colX.pro + 1, y);
      doc.text("Use", colX.use + 1, y);
      doc.text("Duration", colX.duration, y, { align: "right" });
      y += 5;
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    };

    drawTableHeader();

    rows.forEach((row) => {
      const titleLines = doc.splitTextToSize(
        row.title.trim() || "—",
        colX.writers - colX.title - 4
      ) as string[];
      const writerLines = doc.splitTextToSize(
        row.writers.trim() || "—",
        colX.publishers - colX.writers - 4
      ) as string[];
      const publisherLines = doc.splitTextToSize(
        row.publishers.trim() || "—",
        colX.pro - colX.publishers - 4
      ) as string[];
      const lineCount = Math.max(titleLines.length, writerLines.length, publisherLines.length, 1);
      const rowHeight = Math.max(lineCount * 5 + 4, 10);

      if (ensure(rowHeight + 4)) drawTableHeader();

      doc.text(row.cueNo.trim() || "—", colX.cueNo + 1, y + 4);
      titleLines.forEach((line, i) => doc.text(line, colX.title + 1, y + 4 + i * 5));
      writerLines.forEach((line, i) => doc.text(line, colX.writers + 1, y + 4 + i * 5));
      publisherLines.forEach((line, i) => doc.text(line, colX.publishers + 1, y + 4 + i * 5));
      doc.text(row.pro.trim() || "—", colX.pro + 1, y + 4);
      doc.text(row.use.trim() || "—", colX.use + 1, y + 4);
      doc.text(row.duration.trim() || "—", colX.duration, y + 4, { align: "right" });

      y += rowHeight;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
      doc.setDrawColor(180, 180, 180);
    });

    y += 8;
    ensure(12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total cues: ${rows.length} — Total timed: ${totalDuration}`,
      pageWidth - margin,
      y,
      { align: "right" }
    );
    y += 8;

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionTitle || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (airReleaseDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_Music_Cue_Sheet.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionTitle("");
    setProductionCompany("");
    setEpisodeTitle("");
    setTotalRuntime("");
    setAirReleaseDate("");
    setComposer("");
    setMusicSupervisor("");
    setContact("");
    setRows([emptyCue()]);
  };

  const renderChoice = (
    label: string,
    options: string[],
    value: string,
    onChange: (next: string) => void,
    width: string
  ) => {
    const isKnown = options.includes(value);
    return (
      <div className={width}>
        <Label className="text-xs">{label}</Label>
        <Select value={isKnown ? value : OTHER} onValueChange={(next) => onChange(next === OTHER ? "" : next)}>
          <SelectTrigger>
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
            <SelectItem value={OTHER}>{OTHER}</SelectItem>
          </SelectContent>
        </Select>
        {!isKnown && (
          <Input
            className="mt-1"
            placeholder={`Other ${label}`}
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
          <h1 className="text-3xl font-bold mb-2">Music Cue Sheet</h1>
          <p className="text-muted-foreground">
            Log every music cue with timing, writers, publishers, and PRO — the standard deliverable
            for broadcasters and PROs.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Music supervisors and composers preparing the cue sheet deliverable.</li>
                <li>Producers submitting to broadcasters, festivals, or PROs (ASCAP/BMI).</li>
                <li>Post teams documenting every piece of music in the film.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists every cue in order with exact timing.</li>
                <li>Records writers, publishers, PRO, and use type.</li>
                <li>Produces the clean cue sheet distributors and PROs require.</li>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="production_title">Production Title</Label>
                    <Input
                      id="production_title"
                      value={productionTitle}
                      onChange={(e) => setProductionTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="production_company">Production Company</Label>
                    <Input
                      id="production_company"
                      value={productionCompany}
                      onChange={(e) => setProductionCompany(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="episode_title">Episode Title / No. (optional)</Label>
                    <Input
                      id="episode_title"
                      value={episodeTitle}
                      onChange={(e) => setEpisodeTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_runtime">Total Runtime (optional)</Label>
                    <Input
                      id="total_runtime"
                      value={totalRuntime}
                      onChange={(e) => setTotalRuntime(e.target.value)}
                      placeholder="1:42:00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="air_release_date">Air / Release Date</Label>
                    <Input
                      id="air_release_date"
                      type="date"
                      value={airReleaseDate}
                      onChange={(e) => setAirReleaseDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="composer">Composer / Score By (optional)</Label>
                    <Input
                      id="composer"
                      value={composer}
                      onChange={(e) => setComposer(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="music_supervisor">Music Supervisor (optional)</Label>
                    <Input
                      id="music_supervisor"
                      value={musicSupervisor}
                      onChange={(e) => setMusicSupervisor(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact">Prepared By / Contact</Label>
                    <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rows.map((row, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap gap-2 items-end">
                      <div className="w-16">
                        <Label className="text-xs">Cue #</Label>
                        <Input
                          placeholder="Cue #"
                          value={row.cueNo}
                          onChange={(e) => updateRow(index, { cueNo: e.target.value })}
                        />
                      </div>
                      <div className="flex-1 min-w-[10rem]">
                        <Label className="text-xs">Cue Title</Label>
                        <Input
                          placeholder="Cue Title"
                          value={row.title}
                          onChange={(e) => updateRow(index, { title: e.target.value })}
                        />
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Writer(s)</Label>
                        <Input
                          placeholder="Writer(s)"
                          value={row.writers}
                          onChange={(e) => updateRow(index, { writers: e.target.value })}
                        />
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Publisher(s)</Label>
                        <Input
                          placeholder="Publisher(s)"
                          value={row.publishers}
                          onChange={(e) => updateRow(index, { publishers: e.target.value })}
                        />
                      </div>
                      {renderChoice("PRO", PRO_OPTIONS, row.pro, (next) => updateRow(index, { pro: next }), "w-36")}
                      {renderChoice("Use", USE_OPTIONS, row.use, (next) => updateRow(index, { use: next }), "w-44")}
                      <div className="w-24">
                        <Label className="text-xs">Duration</Label>
                        <Input
                          placeholder="0:00"
                          value={row.duration}
                          onChange={(e) => updateRow(index, { duration: e.target.value })}
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
                  Add Cue
                </Button>
                <p className="text-xs text-muted-foreground">
                  Total cues: {rows.length} · Total timed: {totalDuration}
                </p>
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Music Cue Sheet</h2>
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
                        <th className="text-left py-2 font-semibold">Cue #</th>
                        <th className="text-left py-2 font-semibold">Title</th>
                        <th className="text-left py-2 font-semibold">Writer(s)</th>
                        <th className="text-left py-2 font-semibold">Publisher(s)</th>
                        <th className="text-left py-2 font-semibold">PRO</th>
                        <th className="text-left py-2 font-semibold">Use</th>
                        <th className="text-right py-2 font-semibold w-20">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index} className="border-b border-border/60">
                          <td className="py-2 text-muted-foreground">{row.cueNo.trim() || "[#]"}</td>
                          <td className="py-2 text-muted-foreground">{row.title.trim() || "[Cue Title]"}</td>
                          <td className="py-2 text-muted-foreground">{row.writers.trim() || "[Writer(s)]"}</td>
                          <td className="py-2 text-muted-foreground">
                            {row.publishers.trim() || "[Publisher(s)]"}
                          </td>
                          <td className="py-2 text-muted-foreground">{row.pro.trim() || "[PRO]"}</td>
                          <td className="py-2 text-muted-foreground">{row.use.trim() || "[Use]"}</td>
                          <td className="py-2 text-right tabular-nums font-medium">
                            {row.duration.trim() || "0:00"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-right text-sm text-muted-foreground tabular-nums">
                  Total cues: {rows.length} · Total timed: {totalDuration}
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

export default MusicCueSheet;
