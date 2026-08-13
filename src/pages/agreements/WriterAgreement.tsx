import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Download, Loader2, Printer, RotateCcw, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface WriterAgreementForm {
  effective_date: string;
  company_name: string;
  company_address: string;
  writer_name: string;
  writer_address: string;
  writing_services: string;
  project_title: string;
  based_on: string;
  services_description: string;
  delivery_schedule: string;
  total_fee: string;
  payment_schedule: string;
  contingent_comp: string;
  work_for_hire: boolean;
  credit: string;
  governing_law: string;
}

const INITIAL_FORM: WriterAgreementForm = {
  effective_date: "",
  company_name: "",
  company_address: "",
  writer_name: "",
  writer_address: "",
  writing_services: "Original Screenplay",
  project_title: "",
  based_on: "",
  services_description: "",
  delivery_schedule:
    "First Draft within [X] weeks; one set of revisions within [Y] weeks of Company's notes; one polish.",
  total_fee: "",
  payment_schedule:
    "50% upon commencement of services; 50% upon delivery of the First Draft.",
  contingent_comp: "",
  work_for_hire: true,
  credit: "Screenplay by [writer]",
  governing_law: "the State of California",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Consult a qualified entertainment attorney before executing this or any agreement.";

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

const GOV_OPTIONS = [
  "the State of California",
  "the State of New York",
  "the State of Delaware",
  "the State of Georgia",
];

const WRITING_SERVICES = [
  "Original Screenplay",
  "Treatment / Outline",
  "Rewrite",
  "Polish",
  "Adaptation",
];

type LegalizableField =
  | "services_description"
  | "delivery_schedule"
  | "payment_schedule"
  | "contingent_comp";

const WriterAgreement = () => {
  const [form, setForm] = useState<WriterAgreementForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof WriterAgreementForm>(key: K, value: WriterAgreementForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<LegalizableField | null>(null);

  const legalize = async (field: LegalizableField, context: string) => {
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

  const v = (value: string, placeholder: string) =>
    value.trim() ? value.trim() : `[${placeholder}]`;

  const intro = `This Writer Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.company_name, "company name")}, located at ${v(
    form.company_address,
    "company address"
  )} ("Company"), and ${v(form.writer_name, "writer name")}, located at ${v(
    form.writer_address,
    "writer address"
  )} ("Writer").`;

  const basedOnPart = form.based_on.trim()
    ? `, based on ${form.based_on.trim()},`
    : "";

  const clauses: Clause[] = [
    {
      heading: "1. ENGAGEMENT & SERVICES.",
      body: `Company engages Writer to render writing services in connection with the ${v(
        form.writing_services,
        "writing services"
      )} tentatively titled "${v(form.project_title, "project title")}"${basedOnPart} (the "Work"). Writer's services are described as: ${v(
        form.services_description,
        "services description"
      )}.`,
    },
    {
      heading: "2. DELIVERY SCHEDULE.",
      body: `Writer shall render and deliver the Work in accordance with the following schedule: ${v(
        form.delivery_schedule,
        "delivery schedule"
      )}.`,
    },
    {
      heading: "3. COMPENSATION.",
      body: `As full consideration for Writer's services and all rights granted, Company shall pay Writer ${v(
        form.total_fee,
        "total fee"
      )}, payable as follows: ${v(form.payment_schedule, "payment schedule")}.${
        form.contingent_comp.trim()
          ? ` In addition, Writer shall receive contingent compensation as follows: ${form.contingent_comp.trim()}.`
          : ""
      }`,
    },
    {
      heading: "4. OWNERSHIP.",
      body: form.work_for_hire
        ? `The Work is specially commissioned by Company as a "work made for hire" within the meaning of the U.S. Copyright Act. Company shall be deemed the sole author and owner of all right, title, and interest in and to the Work, including all copyright, throughout the universe in perpetuity. To the extent the Work is not deemed a work made for hire, Writer hereby irrevocably assigns all such rights to Company.`
        : `Writer hereby irrevocably assigns to Company all right, title, and interest, including all copyright, in and to the Work, throughout the universe in perpetuity.`,
    },
    {
      heading: "5. CREDIT.",
      body: `Subject to Writer's completion of the services, Company shall accord Writer the following credit: ${v(
        form.credit,
        "credit"
      )}.`,
    },
    {
      heading: "6. WARRANTIES.",
      body: "Writer warrants that the Work is original to Writer (except for any material supplied by Company), does not infringe upon the rights of any third party, and that Writer has the full right and authority to enter into this Agreement.",
    },
    {
      heading: "7. INDEPENDENT CONTRACTOR.",
      body: "Nothing in this Agreement creates a partnership or joint venture between the parties.",
    },
    {
      heading: "8. ASSIGNMENT.",
      body: "Company may freely assign this Agreement to a production entity, financier, or distributor.",
    },
    {
      heading: "9. GOVERNING LAW.",
      body: `This Agreement shall be governed by and construed in accordance with the laws of ${v(
        form.governing_law,
        "governing law"
      )}.`,
    },
    {
      heading: "10. ENTIRE AGREEMENT.",
      body: "This Agreement constitutes the entire agreement between the parties and supersedes all prior understandings.",
    },
  ];

  const closing =
    "IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.";
  const companyLine = `COMPANY: ____________________________   ${v(form.company_name, "company name")}`;
  const writerLine = `WRITER: ______________________________   ${v(form.writer_name, "writer name")}`;

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

    write("WRITER AGREEMENT (WORK MADE FOR HIRE)", 16, "bold", "center");
    y += 6;
    write(intro);
    y += 4;

    clauses.forEach((c) => {
      write(`${c.heading} ${c.body}`);
      y += 4;
    });

    y += 4;
    write(closing);
    y += 10;
    write(companyLine);
    y += 8;
    write(writerLine);
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeTitle = (form.project_title || "Writer_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Writer_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Writer Agreement (Work-for-Hire)</h1>
          <p className="text-muted-foreground">
            Hire a writer and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers and companies hiring a writer to create or rewrite a script.</li>
                <li>Screenwriters taking on paid writing assignments.</li>
                <li>Anyone commissioning original writing they need to own.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Engages a writer to deliver a script, treatment, or rewrite.</li>
                <li>Transfers full ownership of the writing to the company (work-for-hire).</li>
                <li>Sets the fee, payment schedule, deadlines, and credit.</li>
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
                <CardTitle>Parties</CardTitle>
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
                  <Label htmlFor="company_name">Company / Producer</Label>
                  <Input
                    id="company_name"
                    value={form.company_name}
                    onChange={(e) => set("company_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company_address">Company Address</Label>
                  <Input
                    id="company_address"
                    value={form.company_address}
                    onChange={(e) => set("company_address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="writer_name">Writer Name</Label>
                  <Input
                    id="writer_name"
                    value={form.writer_name}
                    onChange={(e) => set("writer_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="writer_address">Writer Address</Label>
                  <Input
                    id="writer_address"
                    value={form.writer_address}
                    onChange={(e) => set("writer_address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>The Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="writing_services">Writing Services</Label>
                  <Select
                    value={form.writing_services}
                    onValueChange={(val) => set("writing_services", val)}
                  >
                    <SelectTrigger id="writing_services">
                      <SelectValue placeholder="Select writing services" />
                    </SelectTrigger>
                    <SelectContent>
                      {WRITING_SERVICES.map((svc) => (
                        <SelectItem key={svc} value={svc}>
                          {svc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="project_title">Project Title</Label>
                  <Input
                    id="project_title"
                    value={form.project_title}
                    onChange={(e) => set("project_title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="based_on">Based On (optional)</Label>
                  <Input
                    id="based_on"
                    placeholder="e.g., the novel by Jane Doe"
                    value={form.based_on}
                    onChange={(e) => set("based_on", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="services_description">Services Description</Label>
                  <Textarea
                    id="services_description"
                    rows={3}
                    value={form.services_description}
                    onChange={(e) => set("services_description", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.services_description.trim() || legalizing === "services_description"}
                    onClick={() => legalize("services_description", "Services Description")}
                  >
                    {legalizing === "services_description" ? (
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
                <CardTitle>Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="delivery_schedule">Delivery Schedule</Label>
                  <Textarea
                    id="delivery_schedule"
                    rows={3}
                    value={form.delivery_schedule}
                    onChange={(e) => set("delivery_schedule", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.delivery_schedule.trim() || legalizing === "delivery_schedule"}
                    onClick={() => legalize("delivery_schedule", "Delivery Schedule")}
                  >
                    {legalizing === "delivery_schedule" ? (
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
                <CardTitle>Compensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="total_fee">Total Fee</Label>
                  <Input
                    id="total_fee"
                    placeholder="$5,000"
                    value={form.total_fee}
                    onChange={(e) => set("total_fee", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_schedule">Payment Schedule</Label>
                  <Textarea
                    id="payment_schedule"
                    rows={2}
                    value={form.payment_schedule}
                    onChange={(e) => set("payment_schedule", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.payment_schedule.trim() || legalizing === "payment_schedule"}
                    onClick={() => legalize("payment_schedule", "Payment Schedule")}
                  >
                    {legalizing === "payment_schedule" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
                </div>
                <div>
                  <Label htmlFor="contingent_comp">Contingent Compensation (optional)</Label>
                  <Textarea
                    id="contingent_comp"
                    rows={2}
                    placeholder="e.g., production bonus of $5,000 and 2.5% of net profits"
                    value={form.contingent_comp}
                    onChange={(e) => set("contingent_comp", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.contingent_comp.trim() || legalizing === "contingent_comp"}
                    onClick={() => legalize("contingent_comp", "Contingent Compensation")}
                  >
                    {legalizing === "contingent_comp" ? (
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
                <CardTitle>Rights &amp; Credit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="work_for_hire"
                    checked={form.work_for_hire}
                    onCheckedChange={(checked) => set("work_for_hire", checked === true)}
                  />
                  <Label htmlFor="work_for_hire" className="font-normal">
                    Work made for hire (Company owns all rights)
                  </Label>
                </div>
                <div>
                  <Label htmlFor="credit">Credit</Label>
                  <Input
                    id="credit"
                    placeholder="Screenplay by [writer]"
                    value={form.credit}
                    onChange={(e) => set("credit", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="governing_law_select">Governing Law</Label>
                  <Select
                    value={govChoice}
                    onValueChange={(val) => {
                      setGovChoice(val);
                      if (val !== "Other") {
                        set("governing_law", val);
                      } else {
                        set("governing_law", "");
                      }
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
                  The jurisdiction whose laws govern this agreement — usually where your company is
                  formed (e.g., California, New York, Delaware). Not where you film.
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
                  <h2 className="text-center font-bold tracking-wide text-base">
                    WRITER AGREEMENT (WORK MADE FOR HIRE)
                  </h2>
                  <p>{intro}</p>
                  {clauses.map((c) => (
                    <p key={c.heading}>
                      <span className="font-semibold">{c.heading}</span> {c.body}
                    </p>
                  ))}
                  <p>{closing}</p>
                  <p className="whitespace-pre-line pt-4">{companyLine}</p>
                  <p className="whitespace-pre-line">{writerLine}</p>
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

export default WriterAgreement;
