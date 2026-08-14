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

interface DirectorsStatementForm {
  film_title: string;
  director_name: string;
  film_type: string;
  statement: string;
  signature_name: string;
  sign_date: string;
  location: string;
}

const INITIAL_FORM: DirectorsStatementForm = {
  film_title: "",
  director_name: "",
  film_type: "",
  statement: "",
  signature_name: "",
  sign_date: "",
  location: "",
};

const DirectorsStatement = () => {
  const [form, setForm] = useState<DirectorsStatementForm>(INITIAL_FORM);

  const set = <K extends keyof DirectorsStatementForm>(key: K, value: DirectorsStatementForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    setForm(INITIAL_FORM);
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const has = (value: string) => value.trim().length > 0;

  const signatureLine = form.signature_name.trim() || form.director_name.trim();

  const statementParagraphs = form.statement
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString + "T00:00:00");
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dateString;
    }
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

    write("DIRECTOR'S STATEMENT", 16, "bold", "center");
    y += 4;

    write(v(form.film_title, "Film Title"), 14, "bold", "center");
    if (has(form.film_type)) {
      y += 2;
      write(form.film_type, 11, "italic", "center");
    }
    y += 10;

    if (statementParagraphs.length > 0) {
      statementParagraphs.forEach((paragraph) => {
        write(paragraph, 11, "normal", "left");
        y += 4;
      });
    } else {
      write(v(form.statement, "director's statement"), 11, "normal", "left");
      y += 4;
    }

    if (signatureLine || form.sign_date || form.location) {
      ensure(30);
      // Move sign-off toward the lower portion if there's room
      if (y < pageHeight - margin - 50) {
        y = pageHeight - margin - 50;
      }

      const signX = pageWidth - margin;
      doc.setDrawColor(0, 0, 0);
      doc.line(signX - 70, y, signX, y);
      y += 6;

      if (signatureLine) {
        write(signatureLine, 11, "normal", "right");
      }

      const signOffParts = [form.location, formatDate(form.sign_date)].filter(Boolean);
      if (signOffParts.length > 0) {
        y += 2;
        write(signOffParts.join(" · "), 10, "italic", "right");
      }
    }

    y += 10;
    ensure(12);
    doc.setTextColor(120, 120, 120);
    write("Filmmaker Genius — Document Library.", 8, "italic", "center");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = (form.film_title || "Directors_Statement").replace(/[^a-zA-Z0-9]/g, "_");
    buildPDF().save(`${base}_Directors_Statement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Director's Statement</h1>
          <p className="text-muted-foreground">
            Write a one-page director's statement for festivals and press — why you made this film.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Directors submitting to festivals and grants.</li>
                <li>Filmmakers including a statement in their press kit.</li>
                <li>Anyone articulating a film's intent and vision.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Frames the film's title and context.</li>
                <li>Presents your statement in a clean layout.</li>
                <li>Signs off with your name and date.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Film &amp; Director</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="film_title">Film Title</Label>
                  <Input id="film_title" value={form.film_title} onChange={(e) => set("film_title", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="director_name">Director</Label>
                  <Input id="director_name" value={form.director_name} onChange={(e) => set("director_name", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="film_type">Type / Runtime</Label>
                  <Input
                    id="film_type"
                    placeholder="e.g., Short Film · 14 min"
                    value={form.film_type}
                    onChange={(e) => set("film_type", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="statement"
                  rows={10}
                  placeholder="Why did you make this film? What drew you to the story, and what do you hope audiences take away?"
                  value={form.statement}
                  onChange={(e) => set("statement", e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sign-Off</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signature_name">Signature Name</Label>
                  <Input
                    id="signature_name"
                    placeholder={form.director_name || "Mirrors Director"}
                    value={form.signature_name}
                    onChange={(e) => set("signature_name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sign_date">Date</Label>
                    <Input id="sign_date" type="date" value={form.sign_date} onChange={(e) => set("sign_date", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Los Angeles, CA"
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                    />
                  </div>
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
                  <h2 className="mb-1 text-center text-xl font-bold uppercase tracking-wide">Director's Statement</h2>
                  <p className="mb-1 text-center text-base font-bold">{v(form.film_title, "Film Title")}</p>
                  {has(form.film_type) && <p className="mb-6 text-center italic text-gray-600">{form.film_type}</p>}

                  <div className="space-y-4 mb-8">
                    {statementParagraphs.length > 0 ? (
                      statementParagraphs.map((paragraph, i) => (
                        <p key={i} className="text-justify">{paragraph}</p>
                      ))
                    ) : (
                      <p className="text-justify">{v(form.statement, "director's statement")}</p>
                    )}
                  </div>

                  {(signatureLine || form.sign_date || form.location) && (
                    <div className="ml-auto w-full max-w-xs text-right">
                      <div className="border-t border-black mb-2 ml-auto w-40" />
                      {signatureLine && <p className="font-medium">{signatureLine}</p>}
                      <p className="italic text-gray-700 text-xs">
                        {[form.location, formatDate(form.sign_date)].filter(Boolean).join(" · ")}
                      </p>
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

export default DirectorsStatement;
