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

interface CrewDealMemoForm {
  production_name: string;
  production_company: string;
  crew_name: string;
  department: string;
  position: string;
  classification: string;
  compensation: string;
  rate_basis: string;
  guaranteed_hours: string;
  kit_rental: string;
  start_date: string;
  work_dates: string;
  overtime_terms: string;
  screen_credit: string;
  additional_provisions: string;
  governing_law: string;
}

const INITIAL_FORM: CrewDealMemoForm = {
  production_name: "",
  production_company: "",
  crew_name: "",
  department: "",
  position: "",
  classification: "Employee (W-2)",
  compensation: "",
  rate_basis: "per day",
  guaranteed_hours: "",
  kit_rental: "",
  start_date: "",
  work_dates: "",
  overtime_terms: "",
  screen_credit: "",
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

type LegalField = "overtime_terms" | "additional_provisions";

const CrewDealMemo = () => {
  const [form, setForm] = useState<CrewDealMemoForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");
  const [legalizing, setLegalizing] = useState<LegalField | null>(null);

  const set = <K extends keyof CrewDealMemoForm>(key: K, value: CrewDealMemoForm[K]) =>
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

  const terms: { label: string; value: string }[] = [
    { label: "Crew Member", value: v(form.crew_name, "crew member") },
    { label: "Department", value: v(form.department, "department") },
    { label: "Position / Title", value: v(form.position, "position / title") },
    { label: "Classification", value: form.classification },
    {
      label: "Compensation",
      value: `${v(form.compensation, "rate")} ${form.rate_basis}`,
    },
    { label: "Guaranteed Hours", value: v(form.guaranteed_hours, "guaranteed hours") },
    { label: "Kit / Box Rental", value: v(form.kit_rental, "kit / box rental") },
    { label: "Start Date", value: v(formatDate(form.start_date), "start date") },
    { label: "Work Dates", value: v(form.work_dates, "work dates") },
    { label: "Overtime / Turnaround", value: v(form.overtime_terms, "overtime and turnaround terms") },
    { label: "Screen Credit", value: v(form.screen_credit, "screen credit") },
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

    write("CREW DEAL MEMO", 16, "bold", "center");
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
    doc.text("CREW MEMBER", leftX, y);
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
    const safe = `${form.production_name || "Production"}_${form.crew_name || "Crew"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    doc.save(`${safe}_Crew_Deal_Memo.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Crew Deal Memo</h1>
          <p className="text-muted-foreground">
            The one-page summary of a crew member's engagement — position, rate, hours, and gear.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Line producers and UPMs locking crew terms.</li>
                <li>Production coordinators papering the crew.</li>
                <li>Anyone who needs a clean record of the hire.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Summarizes a crew member's engagement on one page.</li>
                <li>Captures rate, guaranteed hours, and kit rental.</li>
                <li>Serves as the deal record before payroll setup.</li>
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
                  <Label htmlFor="crew_name">Crew Member</Label>
                  <Input
                    id="crew_name"
                    value={form.crew_name}
                    onChange={(e) => set("crew_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="Camera"
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position / Title</Label>
                  <Input
                    id="position"
                    placeholder="1st AC"
                    value={form.position}
                    onChange={(e) => set("position", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="classification">Classification</Label>
                  <Select value={form.classification} onValueChange={(val) => set("classification", val)}>
                    <SelectTrigger id="classification">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Employee (W-2)", "Independent Contractor (1099)"].map((opt) => (
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
                      placeholder="$450"
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
                  <Label htmlFor="guaranteed_hours">Guaranteed Hours</Label>
                  <Input
                    id="guaranteed_hours"
                    placeholder="10 hours / day"
                    value={form.guaranteed_hours}
                    onChange={(e) => set("guaranteed_hours", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="kit_rental">Kit / Box Rental</Label>
                  <Input
                    id="kit_rental"
                    placeholder="$50 / day"
                    value={form.kit_rental}
                    onChange={(e) => set("kit_rental", e.target.value)}
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
                      placeholder="Aug 13–17, 2026"
                      value={form.work_dates}
                      onChange={(e) => set("work_dates", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="overtime_terms">Overtime / Turnaround</Label>
                  <Textarea
                    id="overtime_terms"
                    rows={3}
                    placeholder="Overtime, turnaround, meal penalties…"
                    value={form.overtime_terms}
                    onChange={(e) => set("overtime_terms", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.overtime_terms.trim() || legalizing === "overtime_terms"}
                    onClick={() => legalize("overtime_terms", "crew deal memo — overtime and turnaround")}
                  >
                    {legalizing === "overtime_terms" ? (
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
                <CardTitle>Credit &amp; Additional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="screen_credit">Screen Credit</Label>
                  <Input
                    id="screen_credit"
                    placeholder="Camera Operator — End Credits"
                    value={form.screen_credit}
                    onChange={(e) => set("screen_credit", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="additional_provisions">Additional Provisions</Label>
                  <Textarea
                    id="additional_provisions"
                    rows={3}
                    placeholder="Any special terms — travel, per diem, exclusivity…"
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
                      legalize("additional_provisions", "crew deal memo — additional provisions")
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
                  <h2 className="text-center font-bold tracking-wide text-base">CREW DEAL MEMO</h2>
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
                    {["Crew Member", "Producer / Production Company"].map((party) => (
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

export default CrewDealMemo;
