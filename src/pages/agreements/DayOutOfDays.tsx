import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Plus, Printer, RotateCcw, Trash2, X } from "lucide-react";

interface CastRow {
  name: string;
  codes: string[];
}

const INITIAL_DAYS = ["1", "2", "3"];
const INITIAL_CAST: CastRow[] = [
  { name: "Lorenz", codes: ["SW", "W", "W"] },
  { name: "Christa", codes: ["H", "SW", "WF"] },
  { name: "Michi", codes: ["", "SW", "W"] },
];

const LEGEND =
  "SW = Start Work · W = Work · H = Hold · F = Finish · WF = Work Finish · SWF = Start-Work-Finish · T = Travel · R = Rehearse";
const LEGEND_PDF =
  "SW = Start Work | W = Work | H = Hold | F = Finish | WF = Work Finish | SWF = Start-Work-Finish | T = Travel | R = Rehearse";

const workDays = (codes: string[]) =>
  codes.filter((c) => c.trim().toUpperCase().includes("W")).length;

const DayOutOfDays = () => {
  const [productionName, setProductionName] = useState("");
  const [days, setDays] = useState<string[]>(INITIAL_DAYS);
  const [cast, setCast] = useState<CastRow[]>(INITIAL_CAST);

  const addDay = () => {
    setDays((prev) => [...prev, String(prev.length + 1)]);
    setCast((prev) => prev.map((c) => ({ ...c, codes: [...c.codes, ""] })));
  };

  const removeDay = (index: number) => {
    setDays((prev) => prev.filter((_, i) => i !== index));
    setCast((prev) =>
      prev.map((c) => ({ ...c, codes: c.codes.filter((_, i) => i !== index) }))
    );
  };

  const addCast = () => {
    setCast((prev) => [...prev, { name: "", codes: days.map(() => "") }]);
  };

  const removeCast = (index: number) => {
    setCast((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDayLabel = (index: number, value: string) => {
    setDays((prev) => prev.map((d, i) => (i === index ? value : d)));
  };

  const updateCastName = (index: number, value: string) => {
    setCast((prev) => prev.map((c, i) => (i === index ? { ...c, name: value } : c)));
  };

  const updateCode = (rowIndex: number, dayIndex: number, value: string) => {
    const next = value.toUpperCase();
    setCast((prev) =>
      prev.map((c, i) =>
        i === rowIndex
          ? { ...c, codes: c.codes.map((code, j) => (j === dayIndex ? next : code)) }
          : c
      )
    );
  };

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text(
      `DAY OUT OF DAYS — ${productionName.trim() || "[Production Name]"}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );
    y += 10;

    const nameWidth = Math.min(50, contentWidth * 0.25);
    const totalWidth = 22;
    const dayColWidth = (contentWidth - nameWidth - totalWidth) / Math.max(days.length, 1);
    const rowHeight = 7;

    const drawHeader = () => {
      doc.setFillColor(235, 235, 235);
      doc.rect(margin, y, contentWidth, rowHeight, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("CAST", margin + 2, y + 4.8);
      days.forEach((d, i) => {
        const x = margin + nameWidth + dayColWidth * i + dayColWidth / 2;
        doc.text(d.trim() || String(i + 1), x, y + 4.8, { align: "center" });
      });
      doc.text("WORK DAYS", margin + nameWidth + dayColWidth * days.length + totalWidth / 2, y + 4.8, {
        align: "center",
      });
      y += rowHeight;
    };

    drawHeader();

    doc.setFont("helvetica", "normal");
    cast.forEach((row) => {
      if (y + rowHeight > pageHeight - margin - 14) {
        doc.addPage();
        y = margin;
        drawHeader();
        doc.setFont("helvetica", "normal");
      }
      doc.setFontSize(8);
      doc.setDrawColor(190, 190, 190);
      doc.rect(margin, y, contentWidth, rowHeight);
      doc.text(row.name.trim() || "—", margin + 2, y + 4.8);
      row.codes.forEach((code, i) => {
        const x = margin + nameWidth + dayColWidth * i + dayColWidth / 2;
        doc.text(code.trim().toUpperCase() || "", x, y + 4.8, { align: "center" });
      });
      doc.text(
        String(workDays(row.codes)),
        margin + nameWidth + dayColWidth * days.length + totalWidth / 2,
        y + 4.8,
        { align: "center" }
      );
      y += rowHeight;
    });

    y += 8;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    doc.splitTextToSize(LEGEND_PDF, contentWidth).forEach((line: string) => {
      doc.text(line, margin, y);
      y += 4;
    });

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text("Filmmaker Genius — Document Library.", margin, pageHeight - margin / 2);
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_DayOutOfDays.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const handleReset = () => {
    setProductionName("");
    setDays(INITIAL_DAYS);
    setCast(INITIAL_CAST);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Day Out of Days</h1>
          <p className="text-muted-foreground">
            Track which cast work, hold, travel, start, and finish on each shoot day.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>1st ADs and production managers scheduling cast.</li>
                <li>Producers tracking cast days for budgeting and SAG.</li>
                <li>Anyone mapping who is needed on which day.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Grids every cast member against every shoot day.</li>
                <li>Uses SWF status codes (Start, Work, Hold, Finish, etc.).</li>
                <li>Totals each performer's work days.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="max-w-sm mb-6">
          <Label htmlFor="production_name">Production Name</Label>
          <Input
            id="production_name"
            value={productionName}
            onChange={(e) => setProductionName(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleReset} variant="ghost">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={addCast} variant="secondary">
            <Plus className="h-4 w-4 mr-2" />
            Add Cast
          </Button>
          <Button onClick={addDay} variant="secondary">
            <Plus className="h-4 w-4 mr-2" />
            Add Day
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 overflow-x-auto">
            <h2 className="text-center font-bold tracking-wide text-base mb-4">
              {productionName.trim()
                ? `DAY OUT OF DAYS — ${productionName}`
                : "DAY OUT OF DAYS — [Production Name]"}
            </h2>
            <table className="w-full min-w-[640px] border-collapse text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left font-semibold w-48">Cast</th>
                  {days.map((day, i) => (
                    <th key={i} className="border border-border p-1 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Input
                          value={day}
                          onChange={(e) => updateDayLabel(i, e.target.value)}
                          className="h-7 w-14 text-center px-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          disabled={days.length <= 1}
                          onClick={() => removeDay(i)}
                          aria-label={`Remove day ${day}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </th>
                  ))}
                  <th className="border border-border p-2 text-center font-semibold">Work Days</th>
                  <th className="border border-border p-2 w-10" />
                </tr>
              </thead>
              <tbody>
                {cast.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-border p-1">
                      <Input
                        value={row.name}
                        onChange={(e) => updateCastName(rowIndex, e.target.value)}
                        className="h-8"
                        placeholder="Cast name"
                      />
                    </td>
                    {days.map((_, dayIndex) => (
                      <td key={dayIndex} className="border border-border p-1">
                        <Input
                          value={row.codes[dayIndex] ?? ""}
                          maxLength={4}
                          onChange={(e) => updateCode(rowIndex, dayIndex, e.target.value)}
                          className="h-8 w-14 text-center px-1 uppercase"
                        />
                      </td>
                    ))}
                    <td className="border border-border p-2 text-center font-semibold">
                      {workDays(row.codes)}
                    </td>
                    <td className="border border-border p-1 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={cast.length <= 1}
                        onClick={() => removeCast(rowIndex)}
                        aria-label="Remove cast row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-xs text-muted-foreground mt-4">{LEGEND}</p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Filmmaker Genius — Document Library.
        </p>
      </div>
    </div>
  );
};

export default DayOutOfDays;
