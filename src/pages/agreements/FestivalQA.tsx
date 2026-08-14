import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface QAItem {
  question: string;
  answer: string;
}

interface FestivalQAForm {
  film_title: string;
  speaker: string;
  event: string;
  items: QAItem[];
}

const DEFAULT_QUESTIONS = [
  "What inspired you to make this film?",
  "How did the project come together / get financed?",
  "What was the biggest challenge in production?",
  "How did you cast the film / work with the actors?",
  "What do you hope audiences take away?",
  "What's next for you and the film?",
];

const INITIAL_FORM: FestivalQAForm = {
  film_title: "",
  speaker: "",
  event: "",
  items: DEFAULT_QUESTIONS.map((q) => ({ question: q, answer: "" })),
};

const FestivalQA = () => {
  const [form, setForm] = useState<FestivalQAForm>(INITIAL_FORM);

  const set = <K extends keyof FestivalQAForm>(key: K, value: FestivalQAForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateItem = (index: number, patch: Partial<QAItem>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { question: "", answer: "" }] }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const has = (value: string) => value.trim().length > 0;

  const answeredCount = useMemo(
    () => form.items.filter((item) => item.answer.trim()).length,
    [form.items]
  );

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

    write("FESTIVAL Q&A", 12, "normal", "center");
    y += 4;

    write(v(form.film_title, "Film Title"), 14, "bold", "center");
    y += 4;

    const metaParts = [form.speaker, form.event].filter(Boolean);
    if (metaParts.length > 0) {
      write(metaParts.join(" · "), 10, "italic", "center");
      y += 6;
    }

    form.items.forEach((item, index) => {
      ensure(20);
      write(`Q${index + 1}. ${item.question || v(item.question, "question")}`, 11, "bold", "left");
      y += 2;
      write(`A. ${item.answer.trim() || "[Your answer]"}`, 11, "normal", "left");
      y += 6;
    });

    y += 10;
    ensure(12);
    doc.setTextColor(120, 120, 120);
    write("Filmmaker Genius — Document Library.", 8, "italic", "center");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = (form.film_title || "Festival_QA").replace(/[^a-zA-Z0-9]/g, "_");
    buildPDF().save(`${base}_Festival_QA.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Festival Q&A Template</h1>
          <p className="text-muted-foreground">
            Prep answers to the questions you'll get at festival screenings and in press interviews.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Directors and cast prepping for festival Q&As.</li>
                <li>Publicists preparing talent for interviews.</li>
                <li>Anyone who wants ready answers on hand.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Collects the common festival questions.</li>
                <li>Lets you draft and refine your answers.</li>
                <li>Exports a clean Q&A prep sheet.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Film &amp; Speaker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="film_title">Film Title</Label>
                  <Input id="film_title" value={form.film_title} onChange={(e) => set("film_title", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="speaker">Speaker / Interviewee</Label>
                  <Input
                    id="speaker"
                    placeholder="e.g., Director Jane Doe"
                    value={form.speaker}
                    onChange={(e) => set("speaker", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="event">Festival / Event</Label>
                  <Input
                    id="event"
                    value={form.event}
                    onChange={(e) => set("event", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Questions &amp; Answers</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {answeredCount} of {form.items.length} answered
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div>
                      <Label htmlFor={`question_${index}`}>Question</Label>
                      <Textarea
                        id={`question_${index}`}
                        rows={2}
                        value={item.question}
                        onChange={(e) => updateItem(index, { question: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`answer_${index}`}>Answer</Label>
                      <Textarea
                        id={`answer_${index}`}
                        rows={3}
                        placeholder="Your answer..."
                        value={item.answer}
                        onChange={(e) => updateItem(index, { answer: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={form.items.length <= 1}
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
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
                  <p className="text-center text-xs uppercase tracking-widest mb-1">Festival Q&amp;A</p>
                  <p className="text-center text-lg font-bold mb-1">{v(form.film_title, "Film Title")}</p>
                  {(has(form.speaker) || has(form.event)) && (
                    <p className="text-center text-sm italic text-gray-600 mb-6">
                      {[form.speaker, form.event].filter(Boolean).join(" · ")}
                    </p>
                  )}

                  <div className="space-y-5">
                    {form.items.map((item, index) => (
                      <div key={index}>
                        <p className="font-bold mb-1">
                          Q{index + 1}. {item.question || v(item.question, "question")}
                        </p>
                        <p className="text-gray-700">
                          A. {item.answer.trim() || <span className="italic text-gray-500">[Your answer]</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalQA;
