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

interface CcslEntry {
  tcIn: string;
  tcOut: string;
  scene: string;
  shotType: string;
  action: string;
  dialogue: string;
}

const SHOT_OPTIONS = ["WS", "MS", "CU", "ECU", "OTS", "POV", "INSERT", "ESTAB"];
const OTHER = "Other";

const emptyEntry = (): CcslEntry => ({
  tcIn: "",
  tcOut: "",
  scene: "",
  shotType: "WS",
  action: "",
  dialogue: "",
});

const v = (value: string, placeholder: string) =>
  value.trim() ? value.trim() : `[${placeholder}]`;

const CcslList = () => {
  const [productionTitle, setProductionTitle] = useState("");
  const [reelNumber, setReelNumber] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [runtime, setRuntime] = useState("");
  const [ccslDate, setCcslDate] = useState("");

  const [rows, setRows] = useState<CcslEntry[]>([emptyEntry()]);

  const updateRow = (index: number, patch: Partial<CcslEntry>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addRow = () => setRows((prev) => [...prev, emptyEntry()]);

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const entryCount = useMemo(() => rows.length, [rows]);

  const headerRows = [
    ["Production", productionTitle, "Production Title"],
    ["Reel / Part No.", reelNumber, "Reel / Part No."],
    ["Prepared By", preparedBy, "Prepared By"],
    ["Total Runtime", runtime, "Total Runtime"],
    ["Date", ccslDate, "Date"],
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
    doc.text("COMBINED CONTINUITY & SPOTTING LIST", pageWidth / 2, y, { align: "center" });
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
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Entries: ${entryCount}`, margin, y);
    y += 8;

    const fixedEnd = margin + 100;
    const actionWidth = (contentWidth - 100) * 0.5 - 2;
    const dialogueX = fixedEnd + actionWidth + 4;

    const colX = {
      tcIn: margin,
      tcOut: margin + 26,
      scene: margin + 52,
      shot: margin + 74,
      action: fixedEnd,
      dialogue: dialogueX,
    };

    const drawTableHeader = () => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("TC In", colX.tcIn + 1, y);
      doc.text("TC Out", colX.tcOut + 1, y);
      doc.text("Sc", colX.scene + 1, y);
      doc.text("Shot", colX.shot + 1, y);
      doc.text("Action / Description", colX.action + 1, y);
      doc.text("Dialogue / Spotting", colX.dialogue + 1, y);
      y += 5;
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    };

    drawTableHeader();

    rows.forEach((row) => {
      const actionLines = doc.splitTextToSize(
        row.action.trim() || "—",
        actionWidth - 4
      ) as string[];
      const dialogueLines = doc.splitTextToSize(
        row.dialogue.trim() || "—",
        pageWidth - margin - dialogueX - 4
      ) as string[];
      const lineCount = Math.max(actionLines.length, dialogueLines.length, 1);
      const rowHeight = Math.max(lineCount * 5 + 4, 10);

      if (ensure(rowHeight + 4)) drawTableHeader();

      doc.setFont("courier", "normal");
      doc.text(row.tcIn.trim() || "—", colX.tcIn + 1, y + 4);
      doc.text(row.tcOut.trim() || "—", colX.tcOut + 1, y + 4);
      doc.setFont("helvetica", "normal");
      doc.text(row.scene.trim() || "—", colX.scene + 1, y + 4);
      doc.text(row.shotType.trim() || "—", colX.shot + 1, y + 4);
      actionLines.forEach((line, i) => doc.text(line, colX.action + 1, y + 4 + i * 5));
      dialogueLines.forEach((line, i) => doc.text(line, colX.dialogue + 1, y + 4 + i * 5));

      y += rowHeight;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
      doc.setDrawColor(180, 180, 180);
    });

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionTitle || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (ccslDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_CCSL.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionTitle("");
    setReelNumber("");
    setPreparedBy("");
    setRuntime("");
    setCcslDate("");
    setRows([emptyEntry()]);
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
        <Select
          value={isKnown ? value : OTHER}
          onValueChange={(next) => onChange(next === OTHER ? "" : next)}
        >
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
          <h1 className="text-3xl font-bold mb-2">Combined Continuity & Spotting List (CCSL)</h1>
          <p className="text-muted-foreground">
            Log every shot with timecode, action, and dialogue — the continuity and spotting
            document distributors require.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Post and delivery teams preparing the CCSL.</li>
                <li>Localization / subtitling houses spotting dialogue.</li>
                <li>Distributors and archives needing a shot log.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Logs each shot with in/out timecode.</li>
                <li>Records the action and spoken dialogue.</li>
                <li>Provides the spotting text for subtitles.</li>
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
                    <Label htmlFor="reel_number">Reel / Part No. (optional)</Label>
                    <Input
                      id="reel_number"
                      value={reelNumber}
                      onChange={(e) => setReelNumber(e.target.value)}
                    />
                  </div>
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
                    <Label htmlFor="ccsl_date">Date</Label>
                    <Input
                      id="ccsl_date"
                      type="date"
                      value={ccslDate}
                      onChange={(e) => setCcslDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="runtime">Total Runtime (optional)</Label>
                  <Input
                    id="runtime"
                    value={runtime}
                    onChange={(e) => setRuntime(e.target.value)}
                    placeholder="1:42:00"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Continuity Entries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rows.map((row, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap gap-2 items-end">
                      <div className="w-32">
                        <Label className="text-xs">TC In</Label>
                        <Input
                          placeholder="01:00:00:00"
                          value={row.tcIn}
                          onChange={(e) => updateRow(index, { tcIn: e.target.value })}
                        />
                      </div>
                      <div className="w-32">
                        <Label className="text-xs">TC Out</Label>
                        <Input
                          placeholder="01:00:00:00"
                          value={row.tcOut}
                          onChange={(e) => updateRow(index, { tcOut: e.target.value })}
                        />
                      </div>
                      <div className="w-20">
                        <Label className="text-xs">Scene</Label>
                        <Input
                          placeholder="Scene"
                          value={row.scene}
                          onChange={(e) => updateRow(index, { scene: e.target.value })}
                        />
                      </div>
                      {renderChoice(
                        "Shot",
                        SHOT_OPTIONS,
                        row.shotType,
                        (next) => updateRow(index, { shotType: next }),
                        "w-36"
                      )}
                      <div className="flex-1 min-w-[10rem]">
                        <Label className="text-xs">Action / Description</Label>
                        <Input
                          placeholder="Action / Description"
                          value={row.action}
                          onChange={(e) => updateRow(index, { action: e.target.value })}
                        />
                      </div>
                      <div className="flex-1 min-w-[10rem]">
                        <Label className="text-xs">Dialogue / Spotting Text</Label>
                        <Input
                          placeholder="Dialogue / Spotting Text"
                          value={row.dialogue}
                          onChange={(e) => updateRow(index, { dialogue: e.target.value })}
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
                  Add Entry
                </Button>
                <p className="text-xs text-muted-foreground">Entries: {entryCount}</p>
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">
                    Combined Continuity & Spotting List
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {headerRows.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                    </div>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">Entries: {entryCount}</div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold">TC In</th>
                        <th className="text-left py-2 font-semibold">TC Out</th>
                        <th className="text-left py-2 font-semibold">Sc</th>
                        <th className="text-left py-2 font-semibold">Shot</th>
                        <th className="text-left py-2 font-semibold">Action / Description</th>
                        <th className="text-left py-2 font-semibold">Dialogue / Spotting</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index} className="border-b border-border/60">
                          <td className="py-2 text-muted-foreground tabular-nums">
                            {row.tcIn.trim() || "[TC In]"}
                          </td>
                          <td className="py-2 text-muted-foreground tabular-nums">
                            {row.tcOut.trim() || "[TC Out]"}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {row.scene.trim() || "[Sc]"}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {row.shotType.trim() || "[Shot]"}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {row.action.trim() || "[Action / Description]"}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {row.dialogue.trim() || "[Dialogue / Spotting]"}
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

export default CcslList;
