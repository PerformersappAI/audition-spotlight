import { useRef, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Printer, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

interface OneSheetForm {
  title: string;
  tagline: string;
  release_info: string;
  rating: string;
  laurels: string;
  billing_block: string;
}

const INITIAL_FORM: OneSheetForm = {
  title: "",
  tagline: "",
  release_info: "",
  rating: "",
  laurels: "",
  billing_block: "",
};

const BILLING_PLACEHOLDER =
  'STUDIO PRESENTS  A [PRODUCTION CO.] PRODUCTION  A [DIRECTOR] FILM  "[TITLE]"  [LEAD] [LEAD]  CASTING BY [..]  MUSIC BY [..]  COSTUME DESIGNER [..]  EDITOR [..]  PRODUCTION DESIGNER [..]  DIRECTOR OF PHOTOGRAPHY [..]  EXECUTIVE PRODUCERS [..]  PRODUCED BY [..]  WRITTEN BY [..]  DIRECTED BY [..]';

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const OneSheetPoster = () => {
  const [form, setForm] = useState<OneSheetForm>(INITIAL_FORM);
  const [keyArt, setKeyArt] = useState<string>("");
  const fileInput = useRef<HTMLInputElement | null>(null);

  const set = <K extends keyof OneSheetForm>(key: K, value: OneSheetForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setKeyArt(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setKeyArt("");
    if (fileInput.current) fileInput.current.value = "";
    toast.success("Form reset");
  };

  const laurelLines = form.laurels
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Key art across the top ~55% of the page
    const artH = pageHeight * 0.5;
    if (keyArt) {
      try {
        const format = keyArt.startsWith("data:image/png") ? "PNG" : "JPEG";
        doc.addImage(keyArt, format, margin, y, contentWidth, artH);
      } catch {
        doc.setDrawColor(180, 180, 180);
        doc.rect(margin, y, contentWidth, artH);
      }
    } else {
      doc.setDrawColor(180, 180, 180);
      doc.setFillColor(244, 244, 244);
      doc.rect(margin, y, contentWidth, artH, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text("KEY ART", pageWidth / 2, y + artH / 2, { align: "center" });
      doc.setTextColor(0, 0, 0);
    }
    y += artH + 8;

    if (laurelLines.length > 0) {
      doc.setFont("times", "italic");
      doc.setFontSize(8);
      laurelLines.forEach((line) => {
        doc.text(line, pageWidth / 2, y, { align: "center" });
        y += 4;
      });
      y += 4;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    const titleLines = doc.splitTextToSize(v(form.title, "TITLE").toUpperCase(), contentWidth) as string[];
    titleLines.forEach((line) => {
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += 12;
    });
    y += 2;

    doc.setFont("times", "italic");
    doc.setFontSize(12);
    const taglineLines = doc.splitTextToSize(v(form.tagline, "tagline"), contentWidth) as string[];
    taglineLines.forEach((line) => {
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += 6;
    });
    y += 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (form.release_info.trim()) {
      doc.text(form.release_info.trim(), pageWidth / 2, y, { align: "center" });
      y += 5;
    }
    if (form.rating.trim()) {
      doc.setFontSize(8);
      doc.text(form.rating.trim(), pageWidth / 2, y, { align: "center" });
      y += 5;
    }

    // Billing block at the bottom, tiny centered text
    const billing = form.billing_block.trim();
    if (billing) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      const lines = doc.splitTextToSize(billing.replace(/\n+/g, "  "), contentWidth) as string[];
      let by = pageHeight - margin - 8 - lines.length * 2.6;
      if (by < y + 4) by = y + 4;
      lines.forEach((line) => {
        doc.text(line, pageWidth / 2, by, { align: "center" });
        by += 2.6;
      });
    }

    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Filmmaker Genius — Document Library.", pageWidth / 2, pageHeight - margin + 4, { align: "center" });
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = (form.title || "One_Sheet").replace(/[^a-zA-Z0-9]/g, "_");
    buildPDF().save(`${base}_One_Sheet.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">One-Sheet / Poster Template</h1>
          <p className="text-muted-foreground">
            Lay out a film poster one-sheet — key art, title, tagline, laurels, and billing block.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Filmmakers and marketers building a poster.</li>
                <li>Festival submitters who need a one-sheet.</li>
                <li>Anyone laying out title art, laurels, and billing.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Places your key art with title and tagline.</li>
                <li>Adds festival laurels and release info.</li>
                <li>Formats the billing block for the poster.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Art</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="keyArt">Upload key art (optional)</Label>
                  <Input
                    id="keyArt"
                    type="file"
                    accept="image/*"
                    ref={fileInput}
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>
                {keyArt && (
                  <div className="flex items-center gap-3">
                    <img src={keyArt} alt="Key art preview" className="h-20 w-20 rounded object-cover" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setKeyArt("");
                        if (fileInput.current) fileInput.current.value = "";
                      }}
                    >
                      <X className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Title &amp; Tagline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Textarea
                    id="tagline"
                    rows={2}
                    placeholder="Short, punchy line"
                    value={form.tagline}
                    onChange={(e) => set("tagline", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="release_info">Release Info</Label>
                  <Input
                    id="release_info"
                    placeholder="In theaters March 2026"
                    value={form.release_info}
                    onChange={(e) => set("release_info", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating / Advisory</Label>
                  <Input
                    id="rating"
                    placeholder="Not Yet Rated"
                    value={form.rating}
                    onChange={(e) => set("rating", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Laurels / Selections</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="laurels"
                  rows={4}
                  placeholder="One festival selection or award per line"
                  value={form.laurels}
                  onChange={(e) => set("laurels", e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Block</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="billing_block"
                  rows={8}
                  placeholder={BILLING_PLACEHOLDER}
                  value={form.billing_block}
                  onChange={(e) => set("billing_block", e.target.value)}
                />
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

          {/* RIGHT: poster preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mx-auto max-h-[75vh] w-full max-w-sm overflow-y-auto rounded-md bg-neutral-950 p-4 text-white">
                  <div className="aspect-[2/3] flex flex-col">
                    {keyArt ? (
                      <img src={keyArt} alt="Key art" className="h-[52%] w-full rounded object-cover" />
                    ) : (
                      <div className="flex h-[52%] w-full items-center justify-center rounded border border-dashed border-white/25 text-[11px] uppercase tracking-widest text-white/40">
                        Key Art
                      </div>
                    )}

                    {laurelLines.length > 0 && (
                      <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[8px] uppercase tracking-widest text-white/70">
                        {laurelLines.map((line, i) => (
                          <span key={i}>{line}</span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 text-center">
                      <p className="text-2xl font-black uppercase leading-none tracking-tight">
                        {v(form.title, "TITLE")}
                      </p>
                      <p className="mt-2 text-[11px] italic text-white/80">{v(form.tagline, "tagline")}</p>
                      {form.release_info.trim() && (
                        <p className="mt-2 text-[9px] uppercase tracking-widest text-white/60">
                          {form.release_info.trim()}
                        </p>
                      )}
                      {form.rating.trim() && (
                        <p className="mt-1 text-[8px] uppercase tracking-widest text-white/40">{form.rating.trim()}</p>
                      )}
                    </div>

                    <div className="mt-auto pt-4">
                      {form.billing_block.trim() && (
                        <p className="text-center text-[5.5px] leading-[1.35] tracking-tight text-white/70">
                          {form.billing_block.trim().replace(/\n+/g, "  ")}
                        </p>
                      )}
                      <p className="mt-3 text-center text-[7px] italic text-white/35">
                        Filmmaker Genius — Document Library.
                      </p>
                    </div>
                  </div>
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

export default OneSheetPoster;
