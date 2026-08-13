import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Download, Loader2, Printer, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface InternVolunteerForm {
  production_name: string;
  company: string;
  intern_name: string;
  effective_date: string;
  role: string;
  status: string;
  duties: string;
  start_date: string;
  end_date: string;
  schedule: string;
  stipend: string;
  expenses: string;
  additional_provisions: string;
  governing_law: string;
}

const INITIAL_FORM: InternVolunteerForm = {
  production_name: "",
  company: "",
  intern_name: "",
  effective_date: "",
  role: "",
  status: "Unpaid Intern",
  duties: "",
  start_date: "",
  end_date: "",
  schedule: "",
  stipend: "",
  expenses: "",
  additional_provisions: "",
  governing_law: "the State of California",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Unpaid internships and volunteer roles are heavily regulated — misclassification carries real legal risk. Have an employment attorney review this before use.";

const GOV_OPTIONS = [
  "the State of California",
  "the State of New York",
  "the State of Delaware",
  "the State of Georgia",
];

const STATUS_OPTIONS = ["Unpaid Intern", "Volunteer", "Paid Intern (stipend)"];

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

type Clause = { heading: string; body: string };
type AiField = "duties" | "additional_provisions";

const InternVolunteerAgreement = () => {
  const [form, setForm] = useState<InternVolunteerForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof InternVolunteerForm>(key: K, value: InternVolunteerForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const legalize = async (field: AiField, context: string) => {
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

  const intro = `This Intern / Volunteer Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.company, "company / production")} and ${v(form.intern_name, "intern / volunteer")}.`;

  const compensationBody = (() => {
    const isPaid = form.status === "Paid Intern (stipend)";
    const hasStipend = form.stipend.trim();
    const hasExpenses = form.expenses.trim();

    if (isPaid || hasStipend) {
      return `Company shall provide ${v(form.stipend, "stipend / compensation")}.${
        hasExpenses ? ` Expenses: ${form.expenses.trim()}.` : ""
      }`;
    }
    return `This is an unpaid position. ${v(
      form.intern_name,
      "intern / volunteer"
    )} shall not receive wages and is not entitled to employee benefits.${
      hasExpenses ? ` Expenses: ${form.expenses.trim()}.` : ""
    }`;
  })();

  const clauses: Clause[] = [
    {
      heading: "Engagement",
      body: `${v(form.company, "company / production")} ("Company") engages ${v(
        form.intern_name,
        "intern / volunteer"
      )} as a ${form.status.toLowerCase()} in the role of ${v(
        form.role,
        "role / department"
      )} in connection with the production presently entitled ${v(
        form.production_name,
        "production name"
      )}. The duties and learning objectives are: ${v(form.duties, "duties and learning objectives")}.`,
    },
    {
      heading: "Term & Schedule",
      body: `The position shall commence on or about ${v(
        formatDate(form.start_date),
        "start date"
      )} and end on or about ${v(
        formatDate(form.end_date),
        "end date"
      )}, on the following schedule: ${v(
        form.schedule,
        "schedule"
      )}. Either party may end the relationship at any time, with or without cause.`,
    },
    { heading: "Compensation", body: compensationBody },
    {
      heading: "Educational Purpose; No Employment",
      body: "The position is primarily for the educational benefit of the participant or is performed voluntarily. The participant does not displace paid employees and works under the supervision of existing staff. This Agreement creates no promise or expectation of paid employment. The parties intend to comply with all applicable laws governing internships and volunteers.",
    },
    {
      heading: "Work Made for Hire; Ownership",
      body: "Any work product created by the participant in connection with this position shall be deemed a work made for hire for Company, and Company shall be the sole author and owner of all right, title, and interest therein, including all copyrights. To the extent any such work product is not deemed a work made for hire, the participant hereby irrevocably assigns it in its entirety to Company. The participant waives all so-called 'moral rights' and rights of droit moral to the fullest extent permitted by applicable law.",
    },
    {
      heading: "Confidentiality",
      body: "Participant shall keep Company's confidential and proprietary information secret, use it only for the purposes of this position, and return or destroy such information on request. These obligations survive the term of this Agreement.",
    },
    {
      heading: "Conduct & Safety",
      body: "Participant shall comply with all applicable laws and with Company's reasonable safety, conduct, and on-set policies, and shall follow the direction of supervising staff.",
    },
    {
      heading: "Representations & Warranties",
      body: "Participant represents and warrants that Participant is free to enter into this Agreement and is at least eighteen (18) years old. For participants under eighteen (18), a parent or guardian must sign the separate Parental / Guardian Consent. Participant further represents that all services, materials, and contributions furnished hereunder shall be original or fully cleared for use.",
    },
    {
      heading: "Additional Provisions",
      body: v(form.additional_provisions, "additional provisions"),
    },
    {
      heading: "Governing Law",
      body: `This Agreement shall be governed by and construed under the laws of ${v(
        form.governing_law,
        "governing law"
      )}, without regard to its conflict-of-laws principles.`,
    },
  ];

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

    write("INTERN / VOLUNTEER AGREEMENT", 16, "bold", "center");
    y += 6;
    write(intro);
    y += 4;

    clauses.forEach((c, i) => {
      write(`${i + 1}. ${c.heading.toUpperCase()}`, 11, "bold");
      y += 1;
      write(c.body);
      y += 4;
    });

    y += 4;
    write("IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.");
    y += 10;
    write("COMPANY", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.company, "company / production")}`);
    write("Date: __________________________________");
    y += 8;
    write("INTERN / VOLUNTEER", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.intern_name, "intern / volunteer")}`);
    write("Date: __________________________________");
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = `${form.production_name || "Intern"}_${form.intern_name || "Agreement"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Intern_Volunteer_Agreement.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const aiButton = (field: AiField, context: string) => (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="mt-2"
      disabled={!form[field].trim() || legalizing === field}
      onClick={() => legalize(field, context)}
    >
      {legalizing === field ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Make Professional
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Intern / Volunteer Agreement</h1>
          <p className="text-muted-foreground">
            Set expectations for an intern or volunteer — role, learning goals, and acknowledgments.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Productions taking on interns or volunteers.</li>
                <li>Companies documenting unpaid or stipend roles.</li>
                <li>Interns and volunteers confirming expectations.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Defines the role, schedule, and learning goals.</li>
                <li>Documents unpaid, volunteer, or stipend status.</li>
                <li>Assigns work product and confirms acknowledgments.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Unpaid internships and volunteer roles are heavily
            regulated — misclassification carries real legal risk. Have an employment attorney review
            this before use.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parties</CardTitle>
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
                  <Label htmlFor="company">Company / Production</Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="intern_name">Intern / Volunteer</Label>
                  <Input
                    id="intern_name"
                    value={form.intern_name}
                    onChange={(e) => set("intern_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="effective_date">Effective Date</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    value={form.effective_date}
                    onChange={(e) => set("effective_date", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="role">Role / Department</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Art Department Intern"
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(val) => set("status", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duties">Duties and Learning Objectives</Label>
                  <Textarea
                    id="duties"
                    rows={4}
                    placeholder="Duties and educational / learning objectives…"
                    value={form.duties}
                    onChange={(e) => set("duties", e.target.value)}
                  />
                  {aiButton("duties", "intern/volunteer agreement — duties and learning objectives")}
                </div>
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
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={form.end_date}
                    onChange={(e) => set("end_date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    placeholder="e.g., 2 days/week, ~16 hrs"
                    value={form.schedule}
                    onChange={(e) => set("schedule", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stipend">Stipend / Compensation (if any)</Label>
                  <Input
                    id="stipend"
                    placeholder="None (unpaid) / $150 per week stipend"
                    value={form.stipend}
                    onChange={(e) => set("stipend", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="expenses">Expenses (optional)</Label>
                  <Input
                    id="expenses"
                    placeholder="e.g., transit and meals reimbursed"
                    value={form.expenses}
                    onChange={(e) => set("expenses", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="additional_provisions">Additional Provisions</Label>
                  <Textarea
                    id="additional_provisions"
                    rows={4}
                    placeholder="Any special terms — academic credit, transportation, meals, termination…"
                    value={form.additional_provisions}
                    onChange={(e) => set("additional_provisions", e.target.value)}
                  />
                  {aiButton("additional_provisions", "intern/volunteer agreement — additional provisions")}
                </div>
                <div>
                  <Label>Governing Law</Label>
                  <Select
                    value={govChoice}
                    onValueChange={(val) => {
                      setGovChoice(val);
                      if (val !== "Other") set("governing_law", val);
                      else set("governing_law", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select governing law" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOV_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {govChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., the State of Texas"
                      value={form.governing_law}
                      onChange={(e) => set("governing_law", e.target.value)}
                    />
                  )}
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
                  <h2 className="mb-4 text-center text-lg font-bold">INTERN / VOLUNTEER AGREEMENT</h2>
                  <p className="mb-4 text-justify">{intro}</p>
                  <ol className="space-y-3">
                    {clauses.map((c, i) => (
                      <li key={c.heading}>
                        <p className="font-bold">
                          {i + 1}. {c.heading}
                        </p>
                        <p className="text-justify">{c.body}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5">
                    IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-bold">COMPANY</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">
                        Printed Name: {v(form.company, "company / production")}
                      </p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                    <div>
                      <p className="font-bold">INTERN / VOLUNTEER</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.intern_name, "intern / volunteer")}</p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                  </div>
                  <p className="mt-6 text-[10px] italic text-gray-500">{DISCLAIMER}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Filmmaker Genius — Document Library. Template only; not legal advice.
        </p>
      </div>
    </div>
  );
};

export default InternVolunteerAgreement;
