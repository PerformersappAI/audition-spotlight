import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer, RotateCcw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Bio {
  name: string;
  role: string;
  category: string;
  bio: string;
  credits: string;
}

const emptyBio = (category = "Cast"): Bio => ({ name: "", role: "", category, bio: "", credits: "" });

const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

const CastCrewBio = () => {
  const [productionTitle, setProductionTitle] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [bios, setBios] = useState<Bio[]>([emptyBio("Cast")]);
  const [otherOpen, setOtherOpen] = useState<Record<number, boolean>>({});

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const has = (value: string) => value.trim().length > 0;

  const setBio = <K extends keyof Bio>(index: number, key: K, value: Bio[K]) =>
    setBios((prev) => prev.map((b, i) => (i === index ? { ...b, [key]: value } : b)));

  const addBio = () => setBios((prev) => [...prev, emptyBio("Cast")]);
  const removeBio = (index: number) => setBios((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const handleReset = () => {
    setProductionTitle("");
    setPreparedBy("");
    setBios([emptyBio("Cast")]);
    setOtherOpen({});
    toast.success("Form reset");
  };

  const grouped = useMemo(() => {
    const map = new Map<string, Bio[]>();
    bios.forEach((b) => {
      const key = b.category.trim() || "Other";
      const list = map.get(key);
      if (list) list.push(b);
      else map.set(key, [b]);
    });
    const ordered: [string, Bio[]][] = [];
    ["Cast", "Crew"].forEach((c) => {
      const list = map.get(c);
      if (list) {
        ordered.push([c, list]);
        map.delete(c);
      }
    });
    map.forEach((list, key) => ordered.push([key, list]));
    return ordered;
  }, [bios]);

  const bioCount = bios.length;

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 22;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const ensure = (h = 8) => {
      if (y + h > pageHeight - margin - 10) {
        doc.addPage();
        y = margin;
      }
    };

    const write = (
      text: string,
      size = 11,
      style: "normal" | "bold" | "italic" = "normal",
      align: "left" | "center" | "right" = "left"
    ) => {
      doc.setFontSize(size);
      doc.setFont("times", style);
      const lines = doc.splitTextToSize(text, contentWidth) as string[];
      lines.forEach((line) => {
        ensure(6);
        if (align === "center") doc.text(line, pageWidth / 2, y, { align: "center" });
        else if (align === "right") doc.text(line, pageWidth - margin, y, { align: "right" });
        else doc.text(line, margin, y);
        y += size * 0.55;
      });
    };

    write("CAST & CREW BIOS", 9, "normal", "center");
    y += 3;
    write(v(productionTitle, "Production Title"), 15, "bold", "center");
    if (has(preparedBy)) {
      y += 2;
      write(`Prepared by ${preparedBy.trim()}`, 9, "italic", "center");
    }
    y += 8;

    grouped.forEach(([category, list]) => {
      ensure(16);
      write(category.toUpperCase(), 12, "bold", "left");
      y += 3;
      list.forEach((b) => {
        ensure(20);
        write(`${v(b.name, "Name")} — ${b.role.trim() || "Role"}`, 11, "bold", "left");
        y += 1;
        write(b.bio.trim() || "[Bio paragraph]", 10.5, "normal", "left");
        if (has(b.credits)) {
          y += 1;
          write(`Selected credits: ${b.credits.trim()}`, 9.5, "italic", "left");
        }
        y += 5;
      });
      y += 3;
    });

    y += 6;
    ensure(12);
    doc.setTextColor(120, 120, 120);
    write("Filmmaker Genius — Document Library.", 8, "italic", "center");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = (productionTitle || "Cast_Crew_Bios").replace(/[^a-zA-Z0-9]/g, "_");
    buildPDF().save(`${base}_Cast_Crew_Bios.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Cast / Crew Bio Template</h1>
          <p className="text-muted-foreground">
            Write clean, consistent bios for your key cast and crew — for the press kit and program.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Publicists assembling cast and crew bios.</li>
                <li>Filmmakers writing bios for a press kit or program.</li>
                <li>Anyone standardizing talent bios for submissions.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Collects each person's role and bio in one place.</li>
                <li>Keeps bios consistent in length and tone.</li>
                <li>Exports a clean bios sheet.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="production_title">Production / Film Title</Label>
                  <Input id="production_title" value={productionTitle} onChange={(e) => setProductionTitle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="prepared_by">Prepared By</Label>
                  <Input id="prepared_by" value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Bios</span>
                  <span className="text-xs font-normal text-muted-foreground">{bioCount} total</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bios.map((b, i) => {
                  const isOther = otherOpen[i] || (b.category !== "Cast" && b.category !== "Crew" && b.category !== "");
                  return (
                    <div key={i} className="rounded-md border border-border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Bio {i + 1}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBio(i)}
                          disabled={bios.length === 1}
                        >
                          <Trash2 className="mr-1 h-4 w-4" /> Remove
                        </Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label>Name</Label>
                          <Input value={b.name} onChange={(e) => setBio(i, "name", e.target.value)} />
                        </div>
                        <div>
                          <Label>Role / Title</Label>
                          <Input
                            placeholder='e.g., Director or "as MAYA"'
                            value={b.role}
                            onChange={(e) => setBio(i, "role", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select
                          value={isOther ? "Other" : b.category}
                          onValueChange={(val) => {
                            if (val === "Other") {
                              setOtherOpen((p) => ({ ...p, [i]: true }));
                              setBio(i, "category", "");
                            } else {
                              setOtherOpen((p) => ({ ...p, [i]: false }));
                              setBio(i, "category", val);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cast">Cast</SelectItem>
                            <SelectItem value="Crew">Crew</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {isOther && (
                          <Input
                            className="mt-2"
                            placeholder="Custom category"
                            value={b.category}
                            onChange={(e) => setBio(i, "category", e.target.value)}
                          />
                        )}
                      </div>
                      <div>
                        <Label>Bio paragraph</Label>
                        <Textarea rows={5} value={b.bio} onChange={(e) => setBio(i, "bio", e.target.value)} />
                        <p className="mt-1 text-xs text-muted-foreground">{wordCount(b.bio)} words</p>
                      </div>
                      <div>
                        <Label>Selected Credits (optional)</Label>
                        <Input value={b.credits} onChange={(e) => setBio(i, "credits", e.target.value)} />
                      </div>
                    </div>
                  );
                })}
                <Button variant="outline" onClick={addBio}>
                  <Plus className="mr-2 h-4 w-4" /> Add Bio
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button variant="ghost" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          {/* RIGHT: preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[70vh] overflow-y-auto rounded-md bg-white p-6 text-[13px] leading-relaxed text-black">
                  <p className="text-center text-[10px] uppercase tracking-[0.25em] text-gray-500">Cast &amp; Crew Bios</p>
                  <p className="mt-1 text-center text-lg font-bold">{v(productionTitle, "Production Title")}</p>
                  {has(preparedBy) && (
                    <p className="text-center text-xs italic text-gray-600">Prepared by {preparedBy.trim()}</p>
                  )}

                  <div className="mt-6 space-y-6">
                    {grouped.map(([category, list]) => (
                      <div key={category}>
                        <h3 className="mb-2 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide">
                          {category.toUpperCase()}
                        </h3>
                        <div className="space-y-4">
                          {list.map((b, i) => (
                            <div key={i}>
                              <p className="font-bold">
                                {v(b.name, "Name")} — {b.role.trim() || "Role"}
                              </p>
                              <p className="text-justify">{b.bio.trim() || "[Bio paragraph]"}</p>
                              {has(b.credits) && (
                                <p className="italic text-gray-700">Selected credits: {b.credits.trim()}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-8 text-center text-[10px] italic text-gray-500">
                    Filmmaker Genius — Document Library.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastCrewBio;
