import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Download, Loader2, Printer, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface WaterfallTier {
  recipient: string;
  terms: string;
}

interface RecoupmentWaterfallForm {
  effective_date: string;
  company_name: string;
  project_title: string;
  net_definition: string;
  tiers: WaterfallTier[];
}

const INITIAL_TIERS: WaterfallTier[] = [
  {
    recipient: "Distributor / Sales Agent",
    terms: "Distribution fees and verified distribution and marketing expenses, plus sales commissions.",
  },
  {
    recipient: "Senior Lenders",
    terms: "Repayment of any senior debt or gap financing, plus accrued interest.",
  },
  {
    recipient: "Equity Investors",
    terms: "Return of 100% of invested capital, pari passu among investors.",
  },
  {
    recipient: "Equity Investors",
    terms: "Payment of the agreed preferred return on invested capital.",
  },
  {
    recipient: "Cast & Crew",
    terms: "Payment of any deferred compensation.",
  },
  {
    recipient: "Profit Participants",
    terms: "Remaining Net Proceeds split between the Company and profit participants per their respective agreements.",
  },
];

const INITIAL_FORM: RecoupmentWaterfallForm = {
  effective_date: "",
  company_name: "",
  project_title: "",
  net_definition:
    '"Gross Receipts" means all revenue actually received by the Company from exploitation of the Project. "Net Proceeds" means Gross Receipts remaining after the deductions set out in the waterfall below.',
  tiers: INITIAL_TIERS,
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Consult a securities or entertainment attorney before using this document.";

const formatDate = (value: string) => {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const RecoupmentWaterfall = () => {
  const [form, setForm] = useState<RecoupmentWaterfallForm>(INITIAL_FORM);
  const [legalizing, setLegalizing] = useState<"net_definition" | null>(null);

  const set = <K extends keyof RecoupmentWaterfallForm>(key: K, value: RecoupmentWaterfallForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateTier = (index: number, patch: Partial<WaterfallTier>) => {
    setForm((prev) => ({
      ...prev,
      tiers: prev.tiers.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)),
    }));
  };

  const addTier = () => {
    setForm((prev) => ({
      ...prev,
      tiers: [...prev.tiers, { recipient: "", terms: "" }],
    }));
  };

  const removeTier = (index: number) => {
    setForm((prev) => ({
      ...prev,
      tiers: prev.tiers.filter((_, i) => i !== index),
    }));
  };

  const legalize = async (field: "net_definition", context: string) => {
    const value = form[field].trim();
    if (!value) return;
    setLegalizing(field);
    try {
      const res = await aiInvoke<{ text?: string; error?: string }>("legalize-text", {
        body: { text: value, context },
      });
      if (res?.text) {
        set(field, res.text);
        toast.success("Clause rewritten");
      } else {
        toast.error(res?.error || "No text returned");
      }
    } catch (err) {
      if (!(err instanceof InsufficientCreditsError)) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setLegalizing(null);
    }
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

  const intro = `This Recoupment Schedule (the "Waterfall") for the motion picture tentatively titled "${v(
    form.project_title,
    "project title"
  )}" (the "Project"), produced by ${v(form.company_name, "company name")} (the "Company"), is effective as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )}. Revenue from the Project shall be applied in the following order of priority:`;

  const closing =
    "This schedule is subject to the definitive financing and participation agreements for the Project; in the event of any conflict, those agreements shall control.";
  const signatureLine = `ACKNOWLEDGED as of the Effective Date.\n\nCOMPANY: ____________________________   ${v(
    form.company_name,
    "company name"
  )}`;

  const tierLines = form.tiers.map(
    (tier, i) => `LEVEL ${i + 1} — ${v(tier.recipient, "recipient")}: ${v(tier.terms, "terms")}`
  );

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 22;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const ensure = (h = 8) => {
      if (y + h > pageHeight - margin - 12) {
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

    write("RECOUPMENT / WATERFALL SCHEDULE", 16, "bold", "center");
    y += 6;
    write(intro);
    y += 4;
    write(form.net_definition.trim() ? form.net_definition : `[Net Proceeds Definition]`);
    y += 6;

    form.tiers.forEach((tier, i) => {
      write(`LEVEL ${i + 1} — ${v(tier.recipient, "recipient")}: ${v(tier.terms, "terms")}`);
      y += 3;
    });

    y += 6;
    write(closing);
    y += 10;
    write("ACKNOWLEDGED as of the Effective Date.");
    y += 10;
    write(`COMPANY: ____________________________   ${v(form.company_name, "company name")}`);
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("times", "italic");
      doc.setTextColor(120, 120, 120);
      doc.text(
        "Filmmaker Genius — Document Library. Template only; not legal advice.",
        pageWidth / 2,
        pageHeight - margin + 6,
        { align: "center" }
      );
      doc.setTextColor(0, 0, 0);
    }

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeTitle = (form.project_title || "Recoupment_Waterfall_Schedule").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Recoupment_Waterfall_Schedule.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Recoupment / Waterfall Schedule</h1>
          <p className="text-muted-foreground">
            Set the order in which film revenue is paid out and generate a ready-to-review schedule.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It&apos;s For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Filmmakers showing investors how money comes back.</li>
                <li>Producers structuring the payout order of a film.</li>
                <li>Anyone mapping recoupment and profit distribution.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It&apos;s For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Sets the order in which film revenue is paid out.</li>
                <li>Shows fees, debt, recoupment, and profit splits by priority.</li>
                <li>Gives investors a clear picture of their position.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Revenue waterfalls may implicate securities, tax, and participation
            obligations. Consult a securities or entertainment attorney before using this document.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="effective_date">Effective Date</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    value={form.effective_date}
                    onChange={(e) => set("effective_date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company_name">Production Company</Label>
                  <Input
                    id="company_name"
                    value={form.company_name}
                    onChange={(e) => set("company_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="project_title">Project Title</Label>
                  <Input
                    id="project_title"
                    value={form.project_title}
                    onChange={(e) => set("project_title", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Proceeds Definition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="net_definition">Net Proceeds Definition</Label>
                  <Textarea
                    id="net_definition"
                    rows={4}
                    value={form.net_definition}
                    onChange={(e) => set("net_definition", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.net_definition.trim() || legalizing === "net_definition"}
                    onClick={() => legalize("net_definition", "Net Proceeds Definition")}
                  >
                    {legalizing === "net_definition" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Waterfall Tiers</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addTier}>
                  Add Tier
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.tiers.map((tier, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Level {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive hover:text-destructive"
                        disabled={form.tiers.length <= 1}
                        onClick={() => removeTier(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`tier_recipient_${index}`}>Recipient</Label>
                      <Input
                        id={`tier_recipient_${index}`}
                        value={tier.recipient}
                        onChange={(e) => updateTier(index, { recipient: e.target.value })}
                        placeholder="e.g., Equity Investors"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`tier_terms_${index}`}>Terms</Label>
                      <Textarea
                        id={`tier_terms_${index}`}
                        rows={2}
                        value={tier.terms}
                        onChange={(e) => updateTier(index, { terms: e.target.value })}
                        placeholder="Describe what this tier receives..."
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="ghost" onClick={() => setForm(INITIAL_FORM)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* RIGHT: live preview */}
          <div className="space-y-6">
            <Card className="bg-muted/30 border-border">
              <CardHeader>
                <CardTitle className="text-center">RECOUPMENT / WATERFALL SCHEDULE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 font-serif text-foreground leading-relaxed">
                <p>{intro}</p>
                <p>{form.net_definition.trim() ? form.net_definition : `[Net Proceeds Definition]`}</p>
                <ol className="list-decimal list-inside space-y-2">
                  {form.tiers.map((tier, i) => (
                    <li key={i}>
                      <span className="font-semibold">{v(tier.recipient, "recipient")}:</span>{" "}
                      {v(tier.terms, "terms")}
                    </li>
                  ))}
                </ol>
                <p>{closing}</p>
                <div className="whitespace-pre-line">{signatureLine}</div>
                <p className="text-xs italic text-muted-foreground">{DISCLAIMER}</p>
                <p className="text-xs italic text-muted-foreground text-center">
                  Filmmaker Genius — Document Library. Template only; not legal advice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoupmentWaterfall;
