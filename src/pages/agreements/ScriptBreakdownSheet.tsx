import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer, RotateCcw } from "lucide-react";

interface BreakdownForm {
  production_name: string;
  scene_number: string;
  page_count: string;
  int_ext: string;
  day_night: string;
  location: string;
  set: string;
  synopsis: string;
  cast: string;
  background: string;
  stunts: string;
  vehicles: string;
  props: string;
  set_dressing: string;
  wardrobe: string;
  makeup_hair: string;
  sfx: string;
  sound: string;
  special_equipment: string;
  animals: string;
  music: string;
  notes: string;
}

const INITIAL_FORM: BreakdownForm = {
  production_name: "",
  scene_number: "",
  page_count: "",
  int_ext: "INT",
  day_night: "Day",
  location: "",
  set: "",
  synopsis: "",
  cast: "",
  background: "",
  stunts: "",
  vehicles: "",
  props: "",
  set_dressing: "",
  wardrobe: "",
  makeup_hair: "",
  sfx: "",
  sound: "",
  special_equipment: "",
  animals: "",
  music: "",
  notes: "",
};

const INT_EXT_OPTIONS = ["INT", "EXT", "INT/EXT"];
const DAY_NIGHT_OPTIONS = ["Day", "Night", "Dawn", "Dusk"];

const elementFields: { key: keyof BreakdownForm; label: string }[] = [
  { key: "cast", label: "CAST" },
  { key: "background", label: "BACKGROUND / EXTRAS" },
  { key: "stunts", label: "STUNTS" },
  { key: "vehicles", label: "VEHICLES / PICTURE CARS" },
  { key: "props", label: "PROPS" },
  { key: "set_dressing", label: "SET DRESSING" },
  { key: "wardrobe", label: "WARDROBE" },
  { key: "makeup_hair", label: "MAKEUP / HAIR" },
  { key: "sfx", label: "SPECIAL EFFECTS" },
  { key: "sound", label: "SOUND" },
  { key: "special_equipment", label: "SPECIAL EQUIPMENT" },
  { key: "animals", label: "ANIMALS" },
  { key: "music", label: "MUSIC" },
  { key: "notes", label: "NOTES" },
];

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const ScriptBreakdownSheet = () => {
  const [form, setForm] = useState<BreakdownForm>(INITIAL_FORM);

  const set = <K extends keyof BreakdownForm>(key: K, value: BreakdownForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const filledElements = elementFields.filter(({ key }) => form[key].trim());

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 22;
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

    write("SCRIPT BREAKDOWN SHEET", 16, "bold", "center");
    y += 6;

    write(`Production: ${v(form.production_name, "production name")}`, 11, "bold");
    write(`Scene #: ${v(form.scene_number, "scene number")}    Page Count: ${v(form.page_count, "page count")}`);
    write(`${v(form.int_ext, "INT/EXT")} — ${v(form.day_night, "Day/Night")}`);
    write(`Location: ${v(form.location, "location")}`);
    write(`Set: ${v(form.set, "set")}`);
    y += 4;

    write("Synopsis:", 11, "bold");
    write(v(form.synopsis, "scene synopsis"));
    y += 6;

    filledElements.forEach(({ key, label }) => {
      write(`${label}:`, 11, "bold");
      write(form[key]);
      y += 2;
    });

    doc.setTextColor(120, 120, 120);
    write("Filmmaker Genius — Document Library.", 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (form.production_name || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeScene = (form.scene_number || "Scene").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_Scene_${safeScene}_Breakdown.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Script Breakdown Sheet</h1>
          <p className="text-muted-foreground">
            Break a scene into every element it needs and generate a printable breakdown sheet.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>1st ADs and line producers breaking down a script.</li>
                <li>Producers planning what each scene needs.</li>
                <li>Anyone scheduling and budgeting from a script.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists every element a scene requires.</li>
                <li>Organizes cast, props, wardrobe, effects, and more.</li>
                <li>Feeds your schedule and budget.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scene Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="production_name">Production Name</Label>
                  <Input
                    id="production_name"
                    value={form.production_name}
                    onChange={(e) => set("production_name", e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="scene_number">Scene Number</Label>
                    <Input
                      id="scene_number"
                      value={form.scene_number}
                      onChange={(e) => set("scene_number", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="page_count">Page Count (eighths)</Label>
                    <Input
                      id="page_count"
                      placeholder="2 3/8"
                      value={form.page_count}
                      onChange={(e) => set("page_count", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="int_ext">INT / EXT</Label>
                    <Select value={form.int_ext} onValueChange={(val) => set("int_ext", val)}>
                      <SelectTrigger id="int_ext">
                        <SelectValue placeholder="Select" />
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
                    <Label htmlFor="day_night">Day / Night</Label>
                    <Select value={form.day_night} onValueChange={(val) => set("day_night", val)}>
                      <SelectTrigger id="day_night">
                        <SelectValue placeholder="Select" />
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="set">Set</Label>
                    <Input
                      id="set"
                      value={form.set}
                      onChange={(e) => set("set", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="synopsis">Scene Synopsis</Label>
                  <Textarea
                    id="synopsis"
                    rows={4}
                    value={form.synopsis}
                    onChange={(e) => set("synopsis", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Elements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {elementFields.map(({ key, label }) => (
                  <div key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    <Textarea
                      id={key}
                      rows={2}
                      placeholder="Comma-separated items"
                      value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                    />
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
              <Button onClick={() => setForm(INITIAL_FORM)} variant="ghost">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <Card>
              <CardContent className="p-6 max-h-[75vh] overflow-y-auto">
                <article className="font-serif text-sm leading-relaxed space-y-4">
                  <h2 className="text-center font-bold tracking-wide text-base">
                    SCRIPT BREAKDOWN SHEET
                  </h2>
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold">Production:</span>{" "}
                      {v(form.production_name, "production name")}
                    </p>
                    <p>
                      <span className="font-semibold">Scene #:</span>{" "}
                      {v(form.scene_number, "scene number")}
                      <span className="ml-4 font-semibold">Page Count:</span>{" "}
                      {v(form.page_count, "page count")}
                    </p>
                    <p>
                      {v(form.int_ext, "INT/EXT")} — {v(form.day_night, "Day/Night")}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {v(form.location, "location")}
                    </p>
                    <p>
                      <span className="font-semibold">Set:</span> {v(form.set, "set")}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Synopsis:</p>
                    <p>{v(form.synopsis, "scene synopsis")}</p>
                  </div>
                  {filledElements.map(({ key, label }) => (
                    <p key={key}>
                      <span className="font-semibold">{label}:</span> {form[key]}
                    </p>
                  ))}
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

export default ScriptBreakdownSheet;
