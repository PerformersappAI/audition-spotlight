import { useRef, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, ImagePlus, Plus, Printer, RotateCcw, Trash2, X } from "lucide-react";

interface Panel {
  image: string;
  shot: string;
  action: string;
  dialogue: string;
  camera: string;
}

const INITIAL_PANELS: Panel[] = [
  {
    image: "",
    shot: "WS — Static",
    action: "Family at the breakfast table, morning light.",
    dialogue: "",
    camera: "24mm, locked off",
  },
  {
    image: "",
    shot: "CU — Handheld",
    action: "Lorenz turns toward the front door at the sound.",
    dialogue: '"Did you hear that?"',
    camera: "50mm, slight push-in",
  },
];

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const StoryboardTemplate = () => {
  const [productionName, setProductionName] = useState("");
  const [sequence, setSequence] = useState("");
  const [panels, setPanels] = useState<Panel[]>(INITIAL_PANELS);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  const updatePanel = (index: number, patch: Partial<Panel>) => {
    setPanels((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const addPanel = () => {
    setPanels((prev) => [...prev, { image: "", shot: "", action: "", dialogue: "", camera: "" }]);
  };

  const removePanel = (index: number) => {
    setPanels((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFile = (index: number, file: File | null | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updatePanel(index, { image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    const gutter = 8;
    const cellW = (contentWidth - gutter) / 2;
    const frameH = (cellW * 9) / 16;

    const footer = () => {
      doc.setFontSize(8);
      doc.setFont("times", "italic");
      doc.setTextColor(120, 120, 120);
      doc.text("Filmmaker Genius — Document Library.", margin, pageHeight - 10);
      doc.setTextColor(0, 0, 0);
    };

    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text(
      `STORYBOARD — ${v(productionName, "Production Name")} — ${v(sequence, "Sequence / Scene")}`,
      pageWidth / 2,
      margin,
      { align: "center" }
    );

    let y = margin + 10;

    for (let i = 0; i < panels.length; i += 2) {
      const row = panels.slice(i, i + 2);

      const noteHeights = row.map((panel, j) => {
        const idx = i + j;
        doc.setFontSize(8);
        doc.setFont("times", "normal");
        const lines = [
          `Shot: ${panel.shot.trim() || "—"}`,
          `Action: ${panel.action.trim() || "—"}`,
          `Dialogue: ${panel.dialogue.trim() || "—"}`,
          `Camera: ${panel.camera.trim() || "—"}`,
        ].flatMap((t) => doc.splitTextToSize(t, cellW - 4) as string[]);
        void idx;
        return 6 + lines.length * 3.6;
      });
      const rowH = frameH + Math.max(...noteHeights) + 6;

      if (y + rowH > pageHeight - 18) {
        footer();
        doc.addPage();
        y = margin;
      }

      row.forEach((panel, j) => {
        const x = margin + j * (cellW + gutter);
        doc.setDrawColor(120, 120, 120);
        doc.rect(x, y, cellW, frameH, "S");

        if (panel.image) {
          try {
            const format = panel.image.startsWith("data:image/png") ? "PNG" : "JPEG";
            doc.addImage(panel.image, format, x + 0.5, y + 0.5, cellW - 1, frameH - 1);
          } catch {
            /* bad image — leave the frame blank */
          }
        }

        let ty = y + frameH + 5;
        doc.setFontSize(9);
        doc.setFont("times", "bold");
        doc.text(`Panel ${i + j + 1}`, x, ty);
        ty += 4;

        doc.setFontSize(8);
        doc.setFont("times", "normal");
        [
          `Shot: ${panel.shot.trim() || "—"}`,
          `Action: ${panel.action.trim() || "—"}`,
          `Dialogue: ${panel.dialogue.trim() || "—"}`,
          `Camera: ${panel.camera.trim() || "—"}`,
        ].forEach((text) => {
          const lines = doc.splitTextToSize(text, cellW - 4) as string[];
          lines.forEach((line) => {
            doc.text(line, x, ty);
            ty += 3.6;
          });
        });
      });

      y += rowH;
    }

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeSequence = (sequence || "Storyboard").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeSequence}_Storyboard.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setSequence("");
    setPanels(INITIAL_PANELS);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Storyboard Template</h1>
          <p className="text-muted-foreground">
            Lay out your shots panel by panel — sketch or drop in a frame, then note the action and camera.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Directors visualizing coverage before the shoot.</li>
                <li>DPs and ADs planning camera and blocking.</li>
                <li>Anyone pitching a sequence to cast or crew.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>A printable grid of storyboard panels.</li>
                <li>Each panel holds a frame image plus shot notes.</li>
                <li>Print blank to sketch by hand, or drop in images.</li>
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
                <div>
                  <Label htmlFor="sequence">Sequence / Scene</Label>
                  <Input
                    id="sequence"
                    placeholder="Sc. 9 — The Knock"
                    value={sequence}
                    onChange={(e) => setSequence(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Panels</CardTitle>
                <Button type="button" size="sm" onClick={addPanel}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Panel
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {panels.map((panel, index) => (
                    <Card key={index} className="border-border/50">
                      <CardContent className="p-3 space-y-3">
                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                          {panel.image ? (
                            <>
                              <img
                                src={panel.image}
                                alt={`Storyboard panel ${index + 1} frame`}
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="secondary"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => updatePanel(index, { image: "" })}
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <div className="w-full h-full border-2 border-dashed border-border rounded-md flex items-center justify-center">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => fileInputs.current[index]?.click()}
                              >
                                <ImagePlus className="h-4 w-4 mr-2" />
                                Upload frame
                              </Button>
                            </div>
                          )}
                          <input
                            ref={(el) => {
                              fileInputs.current[index] = el;
                            }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFile(index, e.target.files?.[0])}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                            Panel {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={panels.length <= 1}
                            onClick={() => removePanel(index)}
                            aria-label="Remove panel"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div>
                          <Label htmlFor={`shot-${index}`}>Shot</Label>
                          <Input
                            id={`shot-${index}`}
                            placeholder="WS — Static"
                            value={panel.shot}
                            onChange={(e) => updatePanel(index, { shot: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`action-${index}`}>Action</Label>
                          <Textarea
                            id={`action-${index}`}
                            rows={2}
                            placeholder="What happens in frame"
                            value={panel.action}
                            onChange={(e) => updatePanel(index, { action: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`dialogue-${index}`}>Dialogue</Label>
                          <Textarea
                            id={`dialogue-${index}`}
                            rows={2}
                            placeholder="Key line, if any"
                            value={panel.dialogue}
                            onChange={(e) => updatePanel(index, { dialogue: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`camera-${index}`}>Camera</Label>
                          <Input
                            id={`camera-${index}`}
                            placeholder="Lens / move, e.g. 35mm dolly-in"
                            value={panel.camera}
                            onChange={(e) => updatePanel(index, { camera: e.target.value })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                <article className="font-serif text-sm leading-relaxed space-y-4">
                  <h2 className="text-center font-bold tracking-wide text-base">
                    STORYBOARD — {v(productionName, "Production Name")} — {v(sequence, "Sequence / Scene")}
                  </h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    {panels.map((panel, index) => (
                      <div key={index} className="space-y-2">
                        <div className="w-full aspect-video border border-border rounded-sm overflow-hidden bg-muted/30">
                          {panel.image ? (
                            <img
                              src={panel.image}
                              alt={`Panel ${index + 1} preview`}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <p className="font-bold text-xs">Panel {index + 1}</p>
                        <p className="text-xs">Shot: {panel.shot.trim() || "—"}</p>
                        <p className="text-xs">Action: {panel.action.trim() || "—"}</p>
                        <p className="text-xs">Dialogue: {panel.dialogue.trim() || "—"}</p>
                        <p className="text-xs">Camera: {panel.camera.trim() || "—"}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs italic text-muted-foreground pt-2">
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

export default StoryboardTemplate;
