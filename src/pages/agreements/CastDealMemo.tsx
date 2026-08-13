import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Download, Loader2, Printer, RotateCcw, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface CastDealMemoForm {
  production_name: string;
  production_company: string;
  performer_name: string;
  role_character: string;
  union_status: string;
  compensation: string;
  rate_basis: string;
  guarantee: string;
  start_date: string;
  work_dates: string;
  work_overtime: string;
  billing: string;
  credit_detail: string;
  representation: string;
  additional_provisions: string;
  governing_law: string;
}

const INITIAL_FORM: CastDealMemoForm = {
  production_name: "",
  production_company: "",
  performer_name: "",
  role_character: "",
  union_status: "Non-Union",
  compensation: "",
  rate_basis: "per day",
  guarantee: "",
  start_date: "",
  work_dates: "",
  work_overtime: "",
  billing: "End Credits",
  credit_detail: "",
  representation: "",
  additional_provisions: "",
  governing_law: "the State of California",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Consult a qualified entertainment attorney before executing this or any agreement.";

const GOV_OPTIONS = [
  "the State of California",
  "the State of New York",
  "the State of Delaware",
  "the State of Georgia",
];

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

type LegalField = "work_overtime" | "additional_provisions";

const CastDealMemo = () => {
  const [form, setForm] = useState<CastDealMemoForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");
  const [legalizing, setLegalizing] = useState<LegalField | null>(null);

  const set = <K extends keyof CastDealMemoForm>(key: K, value: CastDealMemoForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const legalize = async (field: LegalField, context: string) => {
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

  const creditValue = form.credit_detail.trim()
    ? `${form.billing} — ${form.credit_detail.trim()}`
    : form.billing;

  const terms: { label: string; value: string }[] = [
    { label: "Performer", value: v(form.performer_name, "performer name") },
    { label: "Role / Character", value: v(form.role_character, "role / character") },
    { label: "Union Status", value: form.union_status },
    {
      label: "Compensation",
      value: `${v(form.compensation, "rate")} ${form.rate_basis}`,
    },
    { label: "Guarantee", value: v(form.guarantee, "guarantee") },
    { label: "Start Date", value: v(formatDate(form.start_date), "start date") },
    { label: "Work Dates", value: v(form.work_dates, "work dates") },
    { label: "Work / Overtime", value: v(form.work_overtime, "work and overtime terms") },
    { label: "Screen Credit", value: creditValue },
    { label: "Representation", value: v(form.representation, "representation") },
    {
      label: "Additional Provisions",
      value: v(form.additional_provisions, "additional provisions"),
    },
  ];

  const closing = `This deal memo is governed by the laws of ${v(
    form.governing_law,
    "governing law"
  )}.`;

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

    const term = (label: string, value: string) => {
      const labelWidth = 42;
      doc.setFontSize(10.5);
      doc.setFont("times", "bold");
      const lines = doc.splitTextToSize(value, contentWidth - labelWidth) as string[];
      ensure(lines.length * 5.5 + 2);
      doc.text(`${label}:`, margin, y);
      doc.setFont("times", "normal");
      lines.forEach((line, i) => {
        doc.text(line, margin + labelWidth, y + i * 5.5);
      });
      y += lines.length * 5.5 + 2;
    };

    write("CAST DEAL MEMO", 16, "bold", "center");
    y += 6;
    write(v(form.production_name, "production name"), 12, "bold", "center");
    write(v(form.production_company, "production company"), 10, "italic", "center");
    y += 6;

    terms.forEach((t) => term(t.label, t.value));

    y += 4;
    write(closing, 10, "italic");
    y += 12;

    ensure(34);
    const colWidth = (contentWidth - 10) / 2;
    const leftX = margin;
    const rightX = margin + colWidth + 10;
    doc.setFontSize(10);
    doc.setFont("times", "bold");
    doc.text("PERFORMER", leftX, y);
    doc.text("PRODUCER / PRODUCTION COMPANY", rightX, y);
    y += 12;
    doc.setFont("times", "normal");
    doc.setDrawColor(90, 90, 90);
    doc.line(leftX, y, leftX + colWidth - 6, y);
    doc.line(rightX, y, rightX + colWidth - 6, y);
    y += 5;
    doc.setFontSize(9);
    doc.text("Signature", leftX, y);
    doc.text("Signature", rightX, y);
    y += 12;
    doc.line(leftX, y, leftX + colWidth - 6, y);
    doc.line(rightX, y, rightX + colWidth - 6, y);
    y += 5;
    doc.text("Printed Name", leftX, y);
    doc.text("Printed Name", rightX, y);
    y += 12;
    doc.line(leftX, y, leftX + colWidth - 6, y);
    doc.line(rightX, y, rightX + colWidth - 6, y);
    y += 5;
    doc.text("Date", leftX, y);
    doc.text("Date", rightX, y);

    doc.setFontSize(8);
    doc.setFont("times", "italic");
    doc.setTextColor(120, 120, 120);
    const disclaimerLines = doc.splitTextToSize(DISCLAIMER, contentWidth) as string[];
    disclaimerLines.forEach((line, i) => {
      doc.text(line, margin, pageHeight - 14 + i * 4);
    });
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safe = `${form.production_name || "Production"}_${form.performer_name || "Performer"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    doc.save(`${safe}_Cast_Deal_Memo.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Cast Deal Memo</h1>
          <p className="text-muted-foreground">
            The one-page summary of a performer's engagement — terms, rate, dates, and credit.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers locking a performer's terms quickly.</li>
                <li>Production coordinators papering the cast.</li>
                <li>Anyone who needs a clean record of the deal.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Summarizes a cast member's engagement on one page.</li>
                <li>Captures rate, guarantee, dates, and screen credit.</li>
                <li>Serves as the deal record before a long-form contract.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. It is a starting point only. Have an entertainment
            attorney review any agreement before signing.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
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
                <div>
                  <Label htmlFor="production_company">Production Company</Label>
                  <Input
                    id="production_company"
                    value={form.production_company}
                    onChange={(e) => set("production_company", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="performer_name">Performer Name</Label>
                  <Input
                    id="performer_name"
                    value={form.performer_name}
                    onChange={(e) => set("performer_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role_character">Role / Character</Label>
                  <Input
                    id="role_character"
                    value={form.role_character}
                    onChange={(e) => set("role_character", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="union_status">Union Status</Label>
                  <Select value={form.union_status} onValueChange={(val) => set("union_status", val)}>
                    <SelectTrigger id="union_status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["SAG-AFTRA", "Non-Union"].map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compensation &amp; Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="compensation">Compensation</Label>
                    <Input
                      id="compensation"
                      placeholder="$500"
                      value={form.compensation}
                      onChange={(e) => set("compensation", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate_basis">Rate Basis</Label>
                    <Select value={form.rate_basis} onValueChange={(val) => set("rate_basis", val)}>
                      <SelectTrigger id="rate_basis">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["per day", "per week", "flat (all-in)"].map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="guarantee">Guarantee</Label>
                  <Input
                    id="guarantee"
                    placeholder="3 days guaranteed"
                    value={form.guarantee}
                    onChange={(e) => set("guarantee", e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={form.start_date}
                      onChange={(e) => set("start_date", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="work_dates">Work Dates</Label>
                    <Input
                      id="work_dates"
                      placeholder="Aug 13–15, 2026"
                      value={form.work_dates}
                      onChange={(e) => set("work_dates", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="work_overtime">Work / Overtime</Label>
                  <Textarea
                    id="work_overtime"
                    rows={3}
                    placeholder="Work day length, overtime, meal penalties…"
                    value={form.work_overtime}
                    onChange={(e) => set("work_overtime", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.work_overtime.trim() || legalizing === "work_overtime"}
                    onClick={() => legalize("work_overtime", "cast deal memo — work/overtime terms")}
                  >
                    {legalizing === "work_overtime" ? (
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
              <CardHeader>
                <CardTitle>Credit &amp; Representation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="billing">Billing</Label>
                  <Select value={form.billing} onValueChange={(val) => set("billing", val)}>
                    <SelectTrigger id="billing">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Main Title", "End Credits", "No Credit"].map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="credit_detail">Credit Detail</Label>
                  <Input
                    id="credit_detail"
                    placeholder={'as "DANNY"'}
                    value={form.credit_detail}
                    onChange={(e) => set("credit_detail", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="representation">Representation</Label>
                  <Input
                    id="representation"
                    placeholder="Agent / manager + contact"
                    value={form.representation}
                    onChange={(e) => set("representation", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Provisions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="additional_provisions">Additional Provisions</Label>
                  <Textarea
                    id="additional_provisions"
                    rows={3}
                    placeholder="Any special terms — travel, wardrobe, exclusivity…"
                    value={form.additional_provisions}
                    onChange={(e) => set("additional_provisions", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={
                      !form.additional_provisions.trim() || legalizing === "additional_provisions"
                    }
                    onClick={() =>
                      legalize("additional_provisions", "cast deal memo — additional provisions")
                    }
                  >
                    {legalizing === "additional_provisions" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
                </div>
                <div>
                  <Label htmlFor="governing_law_select">Governing Law</Label>
                  <Select
                    value={govChoice}
                    onValueChange={(val) => {
                      setGovChoice(val);
                      set("governing_law", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger id="governing_law_select">
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOV_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {govChoice === "Other" && (
                  <div>
                    <Label htmlFor="governing_law_custom">Custom Jurisdiction</Label>
                    <Input
                      id="governing_law_custom"
                      placeholder="e.g., the State of Texas, or the Republic of Italy"
                      value={form.governing_law}
                      onChange={(e) => set("governing_law", e.target.value)}
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  The jurisdiction whose laws govern this memo — usually where your company is formed.
                  Not where you film.
                </p>
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
                  <h2 className="text-center font-bold tracking-wide text-base">CAST DEAL MEMO</h2>
                  <div className="text-center space-y-1">
                    <p className="font-bold">{v(form.production_name, "production name")}</p>
                    <p className="text-xs italic text-muted-foreground">
                      {v(form.production_company, "production company")}
                    </p>
                  </div>

                  <dl className="space-y-2">
                    {terms.map((t) => (
                      <div key={t.label} className="sm:flex sm:gap-3">
                        <dt className="font-semibold sm:w-44 sm:shrink-0">{t.label}:</dt>
                        <dd className="whitespace-pre-line">{t.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="italic">{closing}</p>

                  <div className="grid grid-cols-2 gap-6 pt-8">
                    {["Performer", "Producer / Production Company"].map((party) => (
                      <div key={party} className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wide">{party}</p>
                        <div className="border-b border-foreground/50 h-6" />
                        <p className="text-[10px] text-muted-foreground">Signature</p>
                        <div className="border-b border-foreground/50 h-6" />
                        <p className="text-[10px] text-muted-foreground">Printed Name</p>
                        <div className="border-b border-foreground/50 h-6" />
                        <p className="text-[10px] text-muted-foreground">Date</p>
                      </div>
                    ))}
                  </div>

                  <p className="italic text-xs text-muted-foreground pt-6">{DISCLAIMER}</p>
                </article>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Filmmaker Genius — Document Library. Template only; not legal advice.
        </p>
      </div>
    </div>
  );
};

export default CastDealMemo;
