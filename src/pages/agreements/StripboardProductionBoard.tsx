import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface Strip {
  scene: string;
  ie: string;
  dn: string;
  description: string;
  pages: string;
  cast: string;
  location: string;
}

const INITIAL_STRIPS: Strip[] = [
  {
    scene: "9",
    ie: "INT",
    dn: "Day",
    description: "Living Room — Sunday breakfast",
    pages: "3",
    cast: "1,2,3",
    location: "Apartment",
  },
  {
    scene: "12",
    ie: "EXT",
    dn: "Day",
    description: "Street — the car theft",
    pages: "2 1/8",
    cast: "1,2,3,4,5",
    location: "Street",
  },
];

const INT_EXT_OPTIONS = ["INT", "EXT", "INT/EXT"];
const DAY_NIGHT_OPTIONS = ["Day", "Night", "Dawn", "Dusk"];

type ColorStyle = {
  bg: string;
  text: string;
  pdfFill: [number, number, number];
  pdfText: [number, number, number];
};

const getColorStyle = (ie: string, dn: string): ColorStyle => {
  const isNight = dn !== "Day";
  if (ie === "EXT" && !isNight) {
    return {
      bg: "bg-[#FEF08A]",
      text: "text-slate-900",
      pdfFill: [254, 240, 138],
      pdfText: [15, 23, 42],
    };
  }
  if (ie === "INT" && isNight) {
    return {
      bg: "bg-[#BFDBFE]",
      text: "text-slate-900",
      pdfFill: [191, 219, 254],
      pdfText: [15, 23, 42],
    };
  }
  if (ie === "EXT" && isNight) {
    return {
      bg: "bg-[#BBF7D0]",
      text: "text-slate-900",
      pdfFill: [187, 247, 208],
      pdfText: [15, 23, 42],
    };
  }
  // INT + Day default
  return {
    bg: "bg-white",
    text: "text-slate-900",
    pdfFill: [255, 255, 255],
    pdfText: [15, 23, 42],
  };
};

const StripboardProductionBoard = () => {
  const [productionName, setProductionName] = useState("");
  const [strips, setStrips] = useState<Strip[]>(INITIAL_STRIPS);

  const updateStrip = (index: number, patch: Partial<Strip>) => {
    setStrips((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addStrip = () => {
    setStrips((prev) => [
      ...prev,
      { scene: "", ie: "INT", dn: "Day", description: "", pages: "", cast: "", location: "" },
    ]);
  };

  const removeStrip = (index: number) => {
    setStrips((prev) => prev.filter((_, i) => i !== index));
  };

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const ensure = (h = 10) => {
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
      productionName.trim() ? `STRIPBOARD — ${productionName}` : "STRIPBOARD",
      16,
      "bold",
      "center"
    );
    y += 8;

    const stripHeight = 10;
    const colWidths = [18, 22, contentWidth - 18 - 22 - 22 - 25 - 30, 22, 25, 30];
    const headers = ["Scene", "I/E", "Description", "Pgs", "Cast", "Location"];

    // Header row
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, y, contentWidth, stripHeight, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("times", "bold");
    let x = margin;
    headers.forEach((h, i) => {
      doc.text(h, x + 2, y + 6.5);
      x += colWidths[i];
    });
    y += stripHeight + 2;

    strips.forEach((strip) => {
      ensure(stripHeight + 2);
      const style = getColorStyle(strip.ie, strip.dn);
      doc.setFillColor(...style.pdfFill);
      doc.rect(margin, y, contentWidth, stripHeight, "F");
      doc.setTextColor(...style.pdfText);
      doc.setFontSize(9);
      doc.setFont("times", "normal");

      const cells = [
        strip.scene || "—",
        `${strip.ie} ${strip.dn}`,
        strip.description || "—",
        strip.pages || "—",
        strip.cast || "—",
        strip.location || "—",
      ];
      x = margin;
      cells.forEach((cell, i) => {
        const text = doc.splitTextToSize(String(cell), colWidths[i] - 4) as string[];
        doc.text(text[0] || "", x + 2, y + 6.5);
        x += colWidths[i];
      });
      y += stripHeight + 2;
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
    doc.save(`${safeProduction}_Stripboard.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Stripboard / Production Board</h1>
          <p className="text-muted-foreground">
            Turn scenes into color-coded strips and set your shooting order.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>1st ADs sequencing the shoot.</li>
                <li>Producers ordering scenes for efficiency.</li>
                <li>Anyone building a shooting order from a breakdown.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Turns scenes into color-coded strips.</li>
                <li>Groups by location, INT/EXT, and day/night.</li>
                <li>Sets the order you'll actually shoot in.</li>
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
                <CardTitle>Strips</CardTitle>
                <Button type="button" size="sm" onClick={addStrip}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Strip
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {strips.map((strip, index) => {
                  const color = getColorStyle(strip.ie, strip.dn);
                  return (
                    <div
                      key={index}
                      className={`space-y-3 p-3 rounded-lg border border-border/50 ${color.bg} ${color.text}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-1 grid gap-3 sm:grid-cols-7">
                          <div className="sm:col-span-1">
                            <Label htmlFor={`scene-${index}`}>Scene #</Label>
                            <Input
                              id={`scene-${index}`}
                              value={strip.scene}
                              onChange={(e) => updateStrip(index, { scene: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`ie-${index}`}>I/E</Label>
                            <Select
                              value={strip.ie}
                              onValueChange={(val) => updateStrip(index, { ie: val })}
                            >
                              <SelectTrigger id={`ie-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {INT_EXT_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`dn-${index}`}>D/N</Label>
                            <Select
                              value={strip.dn}
                              onValueChange={(val) => updateStrip(index, { dn: val })}
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
                          <div className="sm:col-span-2">
                            <Label htmlFor={`description-${index}`}>Description</Label>
                            <Input
                              id={`description-${index}`}
                              value={strip.description}
                              onChange={(e) => updateStrip(index, { description: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pages-${index}`}>Pages</Label>
                            <Input
                              id={`pages-${index}`}
                              placeholder="2 3/8"
                              value={strip.pages}
                              onChange={(e) => updateStrip(index, { pages: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`cast-${index}`}>Cast</Label>
                            <Input
                              id={`cast-${index}`}
                              placeholder="1, 2, 3"
                              value={strip.cast}
                              onChange={(e) => updateStrip(index, { cast: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-5 shrink-0"
                          disabled={strips.length <= 1}
                          onClick={() => removeStrip(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Label htmlFor={`location-${index}`}>Location</Label>
                        <Input
                          id={`location-${index}`}
                          value={strip.location}
                          onChange={(e) => updateStrip(index, { location: e.target.value })}
                        />
                      </div>
                    </div>
                  );
                })}
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
                  setStrips(INITIAL_STRIPS);
                }}
                variant="ghost"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <Card>
              <CardContent className="p-6 max-h-[75vh] overflow-y-auto">
                <article className="font-serif text-sm leading-relaxed space-y-4">
                  <h2 className="text-center font-bold tracking-wide text-base">
                    {productionName.trim()
                      ? `STRIPBOARD — ${productionName}`
                      : "STRIPBOARD"}
                  </h2>

                  <div className="grid grid-cols-6 gap-1 text-xs font-bold border-b border-border pb-1">
                    <span>Scene</span>
                    <span>I/E</span>
                    <span className="col-span-2">Description</span>
                    <span>Pgs</span>
                    <span>Cast</span>
                    <span>Location</span>
                  </div>

                  {strips.map((strip, index) => {
                    const color = getColorStyle(strip.ie, strip.dn);
                    return (
                      <div
                        key={index}
                        className={`grid grid-cols-6 gap-1 text-xs items-center py-1 px-1 rounded ${color.bg} ${color.text}`}
                      >
                        <span>{strip.scene || "—"}</span>
                        <span>{`${strip.ie} ${strip.dn}`}</span>
                        <span className="col-span-2 truncate">{strip.description || "—"}</span>
                        <span>{strip.pages || "—"}</span>
                        <span>{strip.cast || "—"}</span>
                        <span>{strip.location || "—"}</span>
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

export default StripboardProductionBoard;
