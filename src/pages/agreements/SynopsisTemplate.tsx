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

interface SynopsisForm {
  title: string;
  logline: string;
  short_synopsis: string;
  paragraph_synopsis: string;
  long_synopsis: string;
}

const INITIAL_FORM: SynopsisForm = {
  title: "",
  logline: "",
  short_synopsis: "",
  paragraph_synopsis: "",
  long_synopsis: "",
};

const TARGETS = {
  short: 50,
  paragraph: 100,
  long: 250,
};

const SynopsisTemplate = () => {
  const [form, setForm] = useState<SynopsisForm>(INITIAL_FORM);

  const set = <K extends keyof SynopsisForm>(key: K, value: SynopsisForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    setForm(INITIAL_FORM);
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const has = (value: string) => value.trim().length > 0;

  const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

  const countClass = (count: number, target: number | null) => {
    if (!target) return "text-muted-foreground";
    return count > target * 1.2 ? "text-destructive" : "text-muted-foreground";
  };

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

    const sectionHeading = (text: string, count: number, target: number | null) => {
      const targetNote = target ? `(~${target} words)` : "";
      const countNote = `· ${count} word${count === 1 ? "" : "s"}`;
      const headingText = [text.toUpperCase(), targetNote, countNote].filter(Boolean).join(" ");
      ensure(12);
      write(headingText, 12, "bold");
      y += 2;
    };

    write("SYNOPSIS", 10, "normal", "center");
    y += 2;
    write(v(form.title, "Film Title"), 16, "bold", "center");
    y += 10;

    sectionHeading("Logline", wordCount(form.logline), null);
    write(v(form.logline, "one-sentence logline"));
    y += 6;

    sectionHeading("Short Synopsis", wordCount(form.short_synopsis), TARGETS.short);
    write(v(form.short_synopsis, "short synopsis ~50 words"));
    y += 6;

    if (has(form.paragraph_synopsis)) {
      sectionHeading("One-Paragraph Synopsis", wordCount(form.paragraph_synopsis), TARGETS.paragraph);
      write(form.paragraph_synopsis);
      y += 6;
    }

    if (has(form.long_synopsis)) {
      sectionHeading("Long Synopsis", wordCount(form.long_synopsis), TARGETS.long);
      write(form.long_synopsis);
      y += 6;
    }

    ensure(12);
    doc.setTextColor(120, 120, 120);
    write("Filmmaker Genius — Document Library.", 8, "italic", "center");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = (form.title || "Synopsis").replace(/[^a-zA-Z0-9]/g, "_");
    buildPDF().save(`${base}_Synopsis.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Synopsis (Short &amp; Long)</h1>
          <p className="text-muted-foreground">
            Write logline, short, one-paragraph, and festival-length synopses — with live word counts.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Filmmakers writing synopses for festivals and press.</li>
                <li>Producers filling submission forms at different lengths.</li>
                <li>Anyone who needs logline-to-long synopsis versions.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Drafts every synopsis length in one place.</li>
                <li>Shows live word counts against targets.</li>
                <li>Exports a clean synopsis sheet.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Film</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Film Title</Label>
                  <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="logline">Logline</Label>
                  <Textarea
                    id="logline"
                    rows={2}
                    placeholder="One sentence that hooks the reader"
                    value={form.logline}
                    onChange={(e) => set("logline", e.target.value)}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{wordCount(form.logline)} words</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Short Synopsis (~50 words)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="short_synopsis"
                  rows={4}
                  placeholder="A tight ~50-word summary"
                  value={form.short_synopsis}
                  onChange={(e) => set("short_synopsis", e.target.value)}
                />
                <p className={"mt-1 text-xs " + countClass(wordCount(form.short_synopsis), TARGETS.short)}>
                  {wordCount(form.short_synopsis)} / {TARGETS.short} words
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>One-Paragraph Synopsis (~100 words)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="paragraph_synopsis"
                  rows={5}
                  placeholder="A single paragraph ~100-word version"
                  value={form.paragraph_synopsis}
                  onChange={(e) => set("paragraph_synopsis", e.target.value)}
                />
                <p className={"mt-1 text-xs " + countClass(wordCount(form.paragraph_synopsis), TARGETS.paragraph)}>
                  {wordCount(form.paragraph_synopsis)} / {TARGETS.paragraph} words
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Long / Festival Synopsis (~250 words)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="long_synopsis"
                  rows={8}
                  placeholder="A fuller ~250-word synopsis for festival and press submissions"
                  value={form.long_synopsis}
                  onChange={(e) => set("long_synopsis", e.target.value)}
                />
                <p className={"mt-1 text-xs " + countClass(wordCount(form.long_synopsis), TARGETS.long)}>
                  {wordCount(form.long_synopsis)} / {TARGETS.long} words
                </p>
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
                  <p className="text-center text-[10px] uppercase tracking-widest text-gray-500">Synopsis</p>
                  <h2 className="mb-6 text-center text-xl font-bold">{v(form.title, "Film Title")}</h2>

                  <div className="mb-6">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-600">
                      Logline <span className="font-normal normal-case text-gray-400">· {wordCount(form.logline)} words</span>
                    </p>
                    <p className="text-justify">{v(form.logline, "one-sentence logline")}</p>
                  </div>

                  <div className="mb-6">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-600">
                      Short Synopsis (~50 words){" "}
                      <span className="font-normal normal-case text-gray-400">· {wordCount(form.short_synopsis)} words</span>
                    </p>
                    <p className="text-justify">{v(form.short_synopsis, "short synopsis ~50 words")}</p>
                  </div>

                  {has(form.paragraph_synopsis) && (
                    <div className="mb-6">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-600">
                        One-Paragraph Synopsis (~100 words){" "}
                        <span className="font-normal normal-case text-gray-400">· {wordCount(form.paragraph_synopsis)} words</span>
                      </p>
                      <p className="text-justify">{form.paragraph_synopsis}</p>
                    </div>
                  )}

                  {has(form.long_synopsis) && (
                    <div className="mb-6">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-600">
                        Long Synopsis (~250 words){" "}
                        <span className="font-normal normal-case text-gray-400">· {wordCount(form.long_synopsis)} words</span>
                      </p>
                      <p className="text-justify">{form.long_synopsis}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SynopsisTemplate;
