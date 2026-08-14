import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface EpkForm {
  title: string;
  logline: string;
  genre: string;
  runtime: string;
  format: string;
  year: string;
  language: string;
  country: string;
  short_synopsis: string;
  long_synopsis: string;
  director: string;
  writer: string;
  producers: string;
  key_cast: string;
  cinematographer: string;
  editor: string;
  composer: string;
  director_statement: string;
  production_notes: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  screener_link: string;
  social: string;
}

const INITIAL_FORM: EpkForm = {
  title: "",
  logline: "",
  genre: "",
  runtime: "",
  format: "",
  year: "",
  language: "",
  country: "",
  short_synopsis: "",
  long_synopsis: "",
  director: "",
  writer: "",
  producers: "",
  key_cast: "",
  cinematographer: "",
  editor: "",
  composer: "",
  director_statement: "",
  production_notes: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  website: "",
  screener_link: "",
  social: "",
};

const EpkFeature = () => {
  const [form, setForm] = useState<EpkForm>(INITIAL_FORM);

  const set = <K extends keyof EpkForm>(key: K, value: EpkForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    setForm(INITIAL_FORM);
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const has = (value: string) => value.trim().length > 0;

  const metaParts = [
    form.genre,
    form.runtime,
    form.year,
    form.language,
    form.country,
    form.format,
  ].filter(Boolean);
  const metaLine = metaParts.join(" · ");

  const castLines = form.key_cast
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const contactItems = [
    { label: "Contact", value: form.contact_name },
    { label: "Email", value: form.contact_email },
    { label: "Phone", value: form.contact_phone },
    { label: "Website", value: form.website },
    { label: "Screener", value: form.screener_link },
    { label: "Social", value: form.social },
  ].filter((item) => has(item.value));

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

    const sectionHeading = (text: string) => {
      ensure(12);
      write(text.toUpperCase(), 12, "bold");
      y += 2;
    };

    write(v(form.title, "Film Title"), 18, "bold", "center");
    if (metaLine) {
      y += 2;
      write(metaLine, 10, "italic", "center");
    }
    y += 8;

    sectionHeading("Logline");
    write(v(form.logline, "one-line hook"));
    y += 6;

    sectionHeading("Synopsis");
    write(v(form.short_synopsis, "short synopsis"));
    if (has(form.long_synopsis)) {
      y += 3;
      write(form.long_synopsis);
    }
    y += 6;

    sectionHeading("Credits");
    write(`Directed by ${v(form.director, "director")}`);
    write(`Written by ${v(form.writer, "writer")}`);
    write(`Produced by ${v(form.producers, "producers")}`);
    write(`Cinematography by ${v(form.cinematographer, "cinematographer")}`);
    write(`Edited by ${v(form.editor, "editor")}`);
    write(`Composer ${v(form.composer, "composer")}`);
    if (castLines.length > 0) {
      y += 3;
      write("Cast", 11, "bold");
      castLines.forEach((line) => write(line));
    }
    y += 6;

    sectionHeading("Director's Statement");
    write(v(form.director_statement, "director's statement"));
    y += 6;

    if (has(form.production_notes)) {
      sectionHeading("Production Notes");
      write(form.production_notes);
      y += 6;
    }

    if (contactItems.length > 0) {
      sectionHeading("Contact");
      contactItems.forEach((item) => write(`${item.label}: ${item.value}`));
      y += 6;
    }

    ensure(12);
    doc.setTextColor(120, 120, 120);
    write("Filmmaker Genius — Document Library.", 8, "italic", "center");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = (form.title || "EPK_Feature").replace(/[^a-zA-Z0-9]/g, "_");
    buildPDF().save(`${base}_EPK_Feature.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">EPK Template — Feature</h1>
          <p className="text-muted-foreground">
            Build a complete electronic press kit for your feature — logline, synopsis, credits, and contacts.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers and publicists assembling a press kit.</li>
                <li>Filmmakers submitting to festivals and press.</li>
                <li>Sales teams sharing a title with buyers.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Collects the film's key info in one document.</li>
                <li>Presents synopsis, credits, and director's statement.</li>
                <li>Gives press and buyers your contacts and links.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Film Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="logline">Logline</Label>
                  <Textarea
                    id="logline"
                    rows={2}
                    placeholder="One-line hook"
                    value={form.logline}
                    onChange={(e) => set("logline", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Input id="genre" value={form.genre} onChange={(e) => set("genre", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="runtime">Runtime</Label>
                    <Input id="runtime" placeholder="e.g., 98 min" value={form.runtime} onChange={(e) => set("runtime", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="format">Format</Label>
                  <Input id="format" placeholder="e.g., DCP, 2.39:1, 5.1" value={form.format} onChange={(e) => set("format", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" value={form.year} onChange={(e) => set("year", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" value={form.language} onChange={(e) => set("language", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={form.country} onChange={(e) => set("country", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Synopsis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="short_synopsis">Short Synopsis</Label>
                  <Textarea
                    id="short_synopsis"
                    rows={3}
                    placeholder="~50 words"
                    value={form.short_synopsis}
                    onChange={(e) => set("short_synopsis", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="long_synopsis">Long Synopsis</Label>
                  <Textarea
                    id="long_synopsis"
                    rows={5}
                    placeholder="150–250 words"
                    value={form.long_synopsis}
                    onChange={(e) => set("long_synopsis", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="director">Director</Label>
                    <Input id="director" value={form.director} onChange={(e) => set("director", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="writer">Writer</Label>
                    <Input id="writer" value={form.writer} onChange={(e) => set("writer", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="producers">Producers</Label>
                  <Input id="producers" value={form.producers} onChange={(e) => set("producers", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="key_cast">Key Cast</Label>
                  <Textarea
                    id="key_cast"
                    rows={3}
                    placeholder="Name as Character, one per line"
                    value={form.key_cast}
                    onChange={(e) => set("key_cast", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cinematographer">Cinematographer</Label>
                    <Input id="cinematographer" value={form.cinematographer} onChange={(e) => set("cinematographer", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="editor">Editor</Label>
                    <Input id="editor" value={form.editor} onChange={(e) => set("editor", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="composer">Composer</Label>
                  <Input id="composer" value={form.composer} onChange={(e) => set("composer", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Director's Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="director_statement"
                  rows={5}
                  value={form.director_statement}
                  onChange={(e) => set("director_statement", e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="production_notes"
                  rows={4}
                  placeholder="Optional"
                  value={form.production_notes}
                  onChange={(e) => set("production_notes", e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact &amp; Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_name">Contact Name</Label>
                    <Input id="contact_name" value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Email</Label>
                    <Input id="contact_email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input id="contact_phone" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={form.website} onChange={(e) => set("website", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="screener_link">Screener Link</Label>
                  <Input id="screener_link" value={form.screener_link} onChange={(e) => set("screener_link", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="social">Social</Label>
                  <Input id="social" placeholder="e.g., @handle" value={form.social} onChange={(e) => set("social", e.target.value)} />
                </div>
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
                  <h2 className="mb-1 text-center text-xl font-bold">{v(form.title, "Film Title")}</h2>
                  {metaLine && <p className="mb-4 text-center italic text-gray-600">{metaLine}</p>}
                  <div className="mb-6">
                    <p className="font-bold uppercase tracking-wide">Logline</p>
                    <p className="text-justify">{v(form.logline, "one-line hook")}</p>
                  </div>
                  <div className="mb-6">
                    <p className="font-bold uppercase tracking-wide">Synopsis</p>
                    <p className="text-justify">{v(form.short_synopsis, "short synopsis")}</p>
                    {has(form.long_synopsis) && (
                      <p className="mt-2 text-justify">{form.long_synopsis}</p>
                    )}
                  </div>
                  <div className="mb-6">
                    <p className="font-bold uppercase tracking-wide">Credits</p>
                    <p>Directed by {v(form.director, "director")}</p>
                    <p>Written by {v(form.writer, "writer")}</p>
                    <p>Produced by {v(form.producers, "producers")}</p>
                    <p>Cinematography by {v(form.cinematographer, "cinematographer")}</p>
                    <p>Edited by {v(form.editor, "editor")}</p>
                    <p>Composer {v(form.composer, "composer")}</p>
                    {castLines.length > 0 && (
                      <div className="mt-2">
                        <p className="font-bold">Cast</p>
                        {castLines.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mb-6">
                    <p className="font-bold uppercase tracking-wide">Director's Statement</p>
                    <p className="text-justify">{v(form.director_statement, "director's statement")}</p>
                  </div>
                  {has(form.production_notes) && (
                    <div className="mb-6">
                      <p className="font-bold uppercase tracking-wide">Production Notes</p>
                      <p className="text-justify">{form.production_notes}</p>
                    </div>
                  )}
                  {contactItems.length > 0 && (
                    <div className="mb-6">
                      <p className="font-bold uppercase tracking-wide">Contact</p>
                      {contactItems.map((item, i) => (
                        <p key={i}>
                          <span className="font-semibold">{item.label}:</span> {item.value}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="mt-6 text-center text-[10px] italic text-gray-500">
                    Filmmaker Genius — Document Library.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Filmmaker Genius — Document Library.
        </p>
      </div>
    </div>
  );
};

export default EpkFeature;
