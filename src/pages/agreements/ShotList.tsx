import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface Shot {
  shot_number: string;
  size: string;
  angle: string;
  movement: string;
  lens: string;
  description: string;
}

const SIZE_OPTIONS = ["ECU", "CU", "MCU", "MS", "MWS", "WS", "EWS", "OTS", "POV", "Insert"];
const ANGLE_OPTIONS = ["Eye Level", "High", "Low", "Dutch", "Overhead", "Ground"];
const MOVEMENT_OPTIONS = ["Static", "Pan", "Tilt", "Dolly", "Track", "Handheld", "Steadicam", "Crane", "Zoom"];

const INITIAL_SHOTS: Shot[] = [
  {
    shot_number: "1",
    size: "WS",
    angle: "Eye Level",
    movement: "Static",
    lens: "24mm",
    description: "Establishing — family at breakfast table",
  },
  {
    shot_number: "2",
    size: "CU",
    angle: "Eye Level",
    movement: "Handheld",
    lens: "50mm",
    description: "Lorenz reacts to the knock at the door",
  },
];

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const ShotList = () => {
  const [productionName, setProductionName] = useState("");
  const [scene, setScene] = useState("");
  const [director, setDirector] = useState("");
  const [dp, setDp] = useState("");
  const [shots, setShots] = useState<Shot[]>(INITIAL_SHOTS);

  const updateShot = (index: number, patch: Partial<Shot>) => {
    setShots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addShot = () => {
    setShots((prev) => [
      ...prev,
      { shot_number: "", size: "MS", angle: "Eye Level", movement: "Static", lens: "", description: "" },
    ]);
  };

  const removeShot = (index: number) => {
    setShots((prev) => prev.filter((_, i) => i !== index));
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

    write("SHOT LIST", 16, "bold", "center");
    y += 4;

    const headerLine = `Production: ${v(productionName, "Production Name")}   ·   Scene: ${v(scene, "Scene")}   ·   Director: ${v(director, "Director")}   ·   DP: ${v(dp, "DP")}`;
    write(headerLine, 9, "italic", "center");
    y += 6;

    const colX: number[] = [margin];
    const colW = [16, 22, 26, 28, 22];
    let x = margin;
    colW.forEach((w) => {
      x += w;
      colX.push(x);
    });
    const descX = colX[colX.length - 1];
    const descW = contentWidth - (descX - margin);

    const rowHeight = (lines: number) => Math.max(7, lines * 4 + 3);

    const drawCell = (text: string, x: number, w: number, h: number, bold = false) => {
      doc.setFontSize(9);
      doc.setFont("times", bold ? "bold" : "normal");
      doc.rect(x, y, w, h, "S");
      const lines = doc.splitTextToSize(text, w - 3) as string[];
      lines.forEach((line, i) => {
        doc.text(line, x + 1.5, y + 4.5 + i * 4);
      });
    };

    const headers = ["Shot", "Size", "Angle", "Move", "Lens", "Description"];
    const widths = [...colW, descW];

    ensure(12);
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setTextColor(0, 0, 0);
    headers.forEach((h, i) => {
      doc.setFontSize(9);
      doc.setFont("times", "bold");
      doc.text(h, colX[i] + 1.5, y + 5);
    });
    y += 8;

    shots.forEach((shot) => {
      const descLines = doc.splitTextToSize(shot.description || "—", descW - 3) as string[];
      const h = rowHeight(descLines.length);
      ensure(h + 2);

      const cells = [
        shot.shot_number.trim() || "—",
        shot.size,
        shot.angle,
        shot.movement,
        shot.lens.trim() || "—",
        shot.description.trim() || "—",
      ];
      cells.forEach((text, i) => drawCell(text, colX[i], widths[i], h));
      y += h;
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
    const safeScene = (scene || "ShotList").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeScene}_ShotList.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setScene("");
    setDirector("");
    setDp("");
    setShots(INITIAL_SHOTS);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Shot List</h1>
          <p className="text-muted-foreground">
            Plan every shot for a scene — size, angle, movement, and lens.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Directors and DPs planning their coverage.</li>
                <li>1st ADs estimating setups per scene.</li>
                <li>Anyone prepping a scene's camera work.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists every planned shot for a scene.</li>
                <li>Captures size, angle, movement, and lens.</li>
                <li>Guides coverage and setup counts on the day.</li>
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="scene">Scene</Label>
                    <Input
                      id="scene"
                      placeholder="Sc. 9"
                      value={scene}
                      onChange={(e) => setScene(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="director">Director</Label>
                    <Input
                      id="director"
                      value={director}
                      onChange={(e) => setDirector(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dp">DP</Label>
                  <Input id="dp" value={dp} onChange={(e) => setDp(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Shots</CardTitle>
                <Button type="button" size="sm" onClick={addShot}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shot
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {shots.map((shot, index) => (
                  <div key={index} className="space-y-3 p-3 rounded-lg border border-border/50 bg-card">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 grid gap-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <Label htmlFor={`shot_number-${index}`}>Shot #</Label>
                            <Input
                              id={`shot_number-${index}`}
                              placeholder="1A"
                              value={shot.shot_number}
                              onChange={(e) => updateShot(index, { shot_number: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`size-${index}`}>Size</Label>
                            <Select
                              value={shot.size}
                              onValueChange={(val) => updateShot(index, { size: val })}
                            >
                              <SelectTrigger id={`size-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SIZE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <Label htmlFor={`angle-${index}`}>Angle</Label>
                            <Select
                              value={shot.angle}
                              onValueChange={(val) => updateShot(index, { angle: val })}
                            >
                              <SelectTrigger id={`angle-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ANGLE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`movement-${index}`}>Movement</Label>
                            <Select
                              value={shot.movement}
                              onValueChange={(val) => updateShot(index, { movement: val })}
                            >
                              <SelectTrigger id={`movement-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MOVEMENT_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`lens-${index}`}>Lens</Label>
                          <Input
                            id={`lens-${index}`}
                            placeholder="35mm"
                            value={shot.lens}
                            onChange={(e) => updateShot(index, { lens: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`description-${index}`}>Description</Label>
                          <Input
                            id={`description-${index}`}
                            placeholder="Brief shot description"
                            value={shot.description}
                            onChange={(e) => updateShot(index, { description: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-5 shrink-0"
                        disabled={shots.length <= 1}
                        onClick={() => removeShot(index)}
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
              <Button onClick={reset} variant="ghost">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <Card>
              <CardContent className="p-6 max-h-[75vh] overflow-y-auto">
                <article className="font-serif text-sm leading-relaxed space-y-3">
                  <h2 className="text-center font-bold tracking-wide text-base">SHOT LIST</h2>
                  <p className="text-center italic text-xs text-muted-foreground">
                    Production: {v(productionName, "Production Name")} · Scene: {v(scene, "Scene")} · Director:{" "}
                    {v(director, "Director")} · DP: {v(dp, "DP")}
                  </p>

                  <table className="w-full text-xs border-collapse mt-2">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border px-2 py-1 text-left">Shot</th>
                        <th className="border border-border px-2 py-1 text-left">Size</th>
                        <th className="border border-border px-2 py-1 text-left">Angle</th>
                        <th className="border border-border px-2 py-1 text-left">Move</th>
                        <th className="border border-border px-2 py-1 text-left">Lens</th>
                        <th className="border border-border px-2 py-1 text-left w-1/3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shots.map((shot, index) => (
                        <tr key={index}>
                          <td className="border border-border px-2 py-1">
                            {shot.shot_number.trim() || "—"}
                          </td>
                          <td className="border border-border px-2 py-1">{shot.size}</td>
                          <td className="border border-border px-2 py-1">{shot.angle}</td>
                          <td className="border border-border px-2 py-1">{shot.movement}</td>
                          <td className="border border-border px-2 py-1">
                            {shot.lens.trim() || "—"}
                          </td>
                          <td className="border border-border px-2 py-1">
                            {shot.description.trim() || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

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

export default ShotList;
