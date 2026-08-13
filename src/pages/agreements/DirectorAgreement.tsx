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

interface DirectorAgreementForm {
  production_name: string;
  production_company: string;
  director_name: string;
  effective_date: string;
  project_description: string;
  services: string;
  start_date: string;
  engagement_period: string;
  exclusivity: string;
  fee: string;
  payment_schedule: string;
  contingent_comp: string;
  credit: string;
  credit_placement: string;
  final_cut: string;
  additional_provisions: string;
  governing_law: string;
}

const INITIAL_FORM: DirectorAgreementForm = {
  production_name: "",
  production_company: "",
  director_name: "",
  effective_date: "",
  project_description: "",
  services: "",
  start_date: "",
  engagement_period: "",
  exclusivity: "Exclusive during principal photography",
  fee: "",
  payment_schedule: "",
  contingent_comp: "",
  credit: "",
  credit_placement: "Main title, separate card",
  final_cut: "Director delivers a Director's Cut; Producer has final cut",
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

const EXCLUSIVITY_OPTIONS = [
  "Exclusive during principal photography",
  "Exclusive for the full term",
  "Non-exclusive",
];

const PLACEMENT_OPTIONS = ["Main title, separate card", "Shared card", "End credits only"];

const FINAL_CUT_OPTIONS = [
  "Producer retains final cut",
  "Director delivers a Director's Cut; Producer has final cut",
  "Director has final cut",
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

type Clause = { heading: string; body: string };
type AiField = "project_description" | "services" | "payment_schedule" | "additional_provisions";

const DirectorAgreement = () => {
  const [form, setForm] = useState<DirectorAgreementForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof DirectorAgreementForm>(key: K, value: DirectorAgreementForm[K]) =>
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

  const intro = `This Director Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.production_company, "producer / production company")} and ${v(
    form.director_name,
    "director name"
  )}.`;

  const finalCutBody = (() => {
    switch (form.final_cut) {
      case "Producer retains final cut":
        return "Producer shall have final cut and all final creative decisions with respect to the Picture. Director shall consult with Producer in good faith throughout production and post-production.";
      case "Director has final cut":
        return "Director shall have final cut of the Picture, subject to delivery requirements, any required ratings or classification, network, distributor or financier requirements, and all applicable legal and insurance requirements.";
      default:
        return "Director shall be afforded the opportunity to prepare and deliver one (1) Director's Cut of the Picture in accordance with the post-production schedule. Thereafter, Producer shall have final cut, subject to delivery requirements, any required ratings or classification, and all applicable legal requirements.";
    }
  })();

  const compensationBody = `As full consideration for Director's services and all rights granted, Producer shall pay Director a fee of ${v(
    form.fee,
    "fee"
  )}, payable as follows: ${v(form.payment_schedule, "payment schedule")}.${
    form.contingent_comp.trim()
      ? ` In addition, Director shall be entitled to contingent compensation of ${form.contingent_comp.trim()}.`
      : ""
  }`;

  const clauses: Clause[] = [
    {
      heading: "Engagement & Services",
      body: `${v(form.production_company, "producer / production company")} ("Producer") hereby engages ${v(
        form.director_name,
        "director name"
      )} ("Director") to render directing services in connection with the motion picture presently entitled ${v(
        form.production_name,
        "production name"
      )} (${v(form.project_description, "description of the picture")}). Director shall render the following services: ${v(
        form.services,
        "directing services"
      )}.`,
    },
    {
      heading: "Term",
      body: `Director's engagement shall commence on or about ${v(
        formatDate(form.start_date),
        "start date"
      )} and continue through ${v(
        form.engagement_period,
        "engagement period"
      )}. During this period Director's services shall be ${form.exclusivity.toLowerCase()}.`,
    },
    { heading: "Compensation", body: compensationBody },
    {
      heading: "Credit",
      body: `Provided Director renders all required services, Producer shall accord Director credit substantially as: ${v(
        form.credit,
        "credit"
      )}, in the ${form.credit_placement.toLowerCase()}. Casual or inadvertent failure to comply shall not be a breach of this Agreement.`,
    },
    { heading: "Creative Controls; Final Cut", body: finalCutBody },
    {
      heading: "Work Made for Hire; Ownership",
      body: "All results and proceeds of Director's services hereunder shall be deemed a work made for hire for Producer, and Producer shall be the sole author and owner of all right, title, and interest therein, including all copyrights and all rights of every kind, throughout the universe, in perpetuity, in all media now known or hereafter devised. To the extent any such results and proceeds are not deemed a work made for hire, Director hereby irrevocably assigns them in their entirety to Producer. Director waives all so-called \"moral rights\" and rights of droit moral to the fullest extent permitted by applicable law.",
    },
    {
      heading: "Representations & Warranties",
      body: "Director represents and warrants that Director is free to enter into this Agreement and to render the services herein and is not subject to any conflicting obligation; that all services, materials, and contributions furnished by Director shall be original to Director or fully cleared for use; and that Director shall comply with all applicable laws and with Producer's reasonable safety, conduct, and on-set policies.",
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

    write("DIRECTOR AGREEMENT", 16, "bold", "center");
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
    write("PRODUCER", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.production_company, "producer / production company")}`);
    write("Date: __________________________________");
    y += 8;
    write("DIRECTOR", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.director_name, "director name")}`);
    write("Date: __________________________________");
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = `${form.production_name || "Director"}_${form.director_name || "Agreement"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Director_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Director Agreement</h1>
          <p className="text-muted-foreground">
            Engage a director — services, compensation, credit, creative controls, and ownership.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers formally engaging a director.</li>
                <li>Production companies securing chain of title.</li>
                <li>Directors confirming their deal in writing.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Sets the director's services, fee, and schedule.</li>
                <li>Fixes credit, creative controls, and final cut.</li>
                <li>Assigns the work to the production as work-for-hire.</li>
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
                  <Label htmlFor="production_name">Production Name</Label>
                  <Input
                    id="production_name"
                    value={form.production_name}
                    onChange={(e) => set("production_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="production_company">Producer / Production Company</Label>
                  <Input
                    id="production_company"
                    value={form.production_company}
                    onChange={(e) => set("production_company", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="director_name">Director Name</Label>
                  <Input
                    id="director_name"
                    value={form.director_name}
                    onChange={(e) => set("director_name", e.target.value)}
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
                  <Label htmlFor="project_description">Project Description</Label>
                  <Textarea
                    id="project_description"
                    rows={3}
                    placeholder="The Picture — title, format, logline"
                    value={form.project_description}
                    onChange={(e) => set("project_description", e.target.value)}
                  />
                  {aiButton("project_description", "director agreement — description of the picture")}
                </div>
                <div>
                  <Label htmlFor="services">Services</Label>
                  <Textarea
                    id="services"
                    rows={3}
                    placeholder="Directing services to be rendered — prep, principal photography, post…"
                    value={form.services}
                    onChange={(e) => set("services", e.target.value)}
                  />
                  {aiButton("services", "director agreement — directing services")}
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
                  <Label htmlFor="engagement_period">Engagement Period</Label>
                  <Input
                    id="engagement_period"
                    placeholder="Pre-production through delivery of the Director's Cut"
                    value={form.engagement_period}
                    onChange={(e) => set("engagement_period", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Exclusivity</Label>
                  <Select value={form.exclusivity} onValueChange={(val) => set("exclusivity", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exclusivity" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXCLUSIVITY_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fee">Fee</Label>
                  <Input
                    id="fee"
                    placeholder="$25,000"
                    value={form.fee}
                    onChange={(e) => set("fee", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_schedule">Payment Schedule</Label>
                  <Textarea
                    id="payment_schedule"
                    rows={3}
                    placeholder="e.g., 1/3 on commencement, 1/3 on completion of photography, 1/3 on delivery"
                    value={form.payment_schedule}
                    onChange={(e) => set("payment_schedule", e.target.value)}
                  />
                  {aiButton("payment_schedule", "director agreement — payment schedule")}
                </div>
                <div>
                  <Label htmlFor="contingent_comp">Contingent Compensation (optional)</Label>
                  <Input
                    id="contingent_comp"
                    placeholder="e.g., 5% of net proceeds"
                    value={form.contingent_comp}
                    onChange={(e) => set("contingent_comp", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credit &amp; Creative Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="credit">Credit</Label>
                  <Input
                    id="credit"
                    placeholder="Directed by [Director Name]"
                    value={form.credit}
                    onChange={(e) => set("credit", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Credit Placement</Label>
                  <Select value={form.credit_placement} onValueChange={(val) => set("credit_placement", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select placement" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLACEMENT_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Final Cut</Label>
                  <Select value={form.final_cut} onValueChange={(val) => set("final_cut", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select final cut" />
                    </SelectTrigger>
                    <SelectContent>
                      {FINAL_CUT_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ownership &amp; Additional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="additional_provisions">Additional Provisions</Label>
                  <Textarea
                    id="additional_provisions"
                    rows={4}
                    placeholder="Any special terms — travel, perks, turnaround, cutting rights…"
                    value={form.additional_provisions}
                    onChange={(e) => set("additional_provisions", e.target.value)}
                  />
                  {aiButton("additional_provisions", "director agreement — additional provisions")}
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
                  <h2 className="mb-4 text-center text-lg font-bold">DIRECTOR AGREEMENT</h2>
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
                      <p className="font-bold">PRODUCER</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">
                        Printed Name: {v(form.production_company, "producer / production company")}
                      </p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                    <div>
                      <p className="font-bold">DIRECTOR</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.director_name, "director name")}</p>
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

export default DirectorAgreement;
