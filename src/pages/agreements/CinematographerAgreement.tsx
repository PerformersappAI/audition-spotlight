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

interface CinematographerAgreementForm {
  production_name: string;
  production_company: string;
  dp_name: string;
  effective_date: string;
  project_description: string;
  services: string;
  prep_test_days: string;
  shoot_days: string;
  start_date: string;
  exclusivity: string;
  fee: string;
  payment_schedule: string;
  kit_rental: string;
  camera_package: string;
  credit: string;
  credit_placement: string;
  additional_provisions: string;
  governing_law: string;
}

const INITIAL_FORM: CinematographerAgreementForm = {
  production_name: "",
  production_company: "",
  dp_name: "",
  effective_date: "",
  project_description: "",
  services: "",
  prep_test_days: "",
  shoot_days: "",
  start_date: "",
  exclusivity: "Exclusive during principal photography",
  fee: "",
  payment_schedule: "",
  kit_rental: "",
  camera_package: "",
  credit: "",
  credit_placement: "Main title, separate card",
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
type AiField =
  | "project_description"
  | "services"
  | "payment_schedule"
  | "additional_provisions"
  | "camera_package";

const CinematographerAgreement = () => {
  const [form, setForm] = useState<CinematographerAgreementForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof CinematographerAgreementForm>(key: K, value: CinematographerAgreementForm[K]) =>
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

  const intro = `This Cinematographer Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.production_company, "producer / production company")} and ${v(
    form.dp_name,
    "cinematographer / DP"
  )}.`;

  const compensationBody = `As full consideration for Cinematographer's services and all rights granted, Producer shall pay Cinematographer a fee of ${v(
    form.fee,
    "fee"
  )}, payable as follows: ${v(form.payment_schedule, "payment schedule")}.${
    form.kit_rental.trim()
      ? ` In addition, Producer shall pay equipment/kit rental of ${form.kit_rental.trim()}.`
      : ""
  }`;

  const clauses: Clause[] = [
    {
      heading: "Engagement & Services",
      body: `${v(form.production_company, "producer / production company")} ("Producer") hereby engages ${v(
        form.dp_name,
        "cinematographer / DP"
      )} ("Cinematographer") to render cinematography services in connection with the motion picture presently entitled ${v(
        form.production_name,
        "production name"
      )} (${v(form.project_description, "description of the picture")}). Cinematographer shall render the following services: ${v(
        form.services,
        "cinematography services"
      )}.`,
    },
    {
      heading: "Term & Schedule",
      body: `Cinematographer's engagement shall commence on or about ${v(
        formatDate(form.start_date),
        "start date"
      )} and shall include ${v(form.prep_test_days, "prep / test days")} and ${v(
        form.shoot_days,
        "shoot days"
      )}. During principal photography Cinematographer's services shall be ${form.exclusivity.toLowerCase()}.`,
    },
    { heading: "Compensation", body: compensationBody },
    {
      heading: "Camera & Equipment Package",
      body: `The Picture shall be photographed using the following camera and equipment package: ${v(
        form.camera_package,
        "camera and equipment package"
      )}. Responsibility for supplying, insuring, and maintaining the package shall be as set forth herein or as otherwise agreed in writing.`,
    },
    {
      heading: "Credit",
      body: `Provided Cinematographer renders all required services, Producer shall accord Cinematographer credit substantially as: ${v(
        form.credit,
        "credit"
      )}, in the ${form.credit_placement.toLowerCase()}. Casual or inadvertent failure to comply shall not be a breach of this Agreement.`,
    },
    {
      heading: "Work Made for Hire; Ownership",
      body: "All results and proceeds of Cinematographer's services hereunder shall be deemed a work made for hire for Producer, and Producer shall be the sole author and owner of all right, title, and interest therein, including all copyrights and all rights of every kind, throughout the universe, in perpetuity, in all media now known or hereafter devised. To the extent any such results and proceeds are not deemed a work made for hire, Cinematographer hereby irrevocably assigns them in their entirety to Producer. Cinematographer waives all so-called \"moral rights\" and rights of droit moral to the fullest extent permitted by applicable law.",
    },
    {
      heading: "Representations & Warranties",
      body: "Cinematographer represents and warrants that Cinematographer is free to enter into this Agreement and to render the services herein and is not subject to any conflicting obligation; that all services, materials, and contributions furnished by Cinematographer shall be original to Cinematographer or fully cleared for use; and that Cinematographer shall comply with all applicable laws and with Producer's reasonable safety, conduct, and on-set policies.",
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

    write("CINEMATOGRAPHER AGREEMENT", 16, "bold", "center");
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
    write("CINEMATOGRAPHER", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.dp_name, "cinematographer / DP")}`);
    write("Date: __________________________________");
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = `${form.production_name || "DP"}_${form.dp_name || "Agreement"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Cinematographer_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Cinematographer (DP) Agreement</h1>
          <p className="text-muted-foreground">
            Engage a director of photography — services, camera package, credit, and ownership.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers engaging a director of photography.</li>
                <li>Productions specifying the camera package.</li>
                <li>DPs confirming their deal and credit in writing.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Sets the DP's services, fee, and schedule.</li>
                <li>Specifies prep, test, and shoot days and gear.</li>
                <li>Fixes credit and assigns work as work-for-hire.</li>
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
                  <Label htmlFor="dp_name">Cinematographer / DP</Label>
                  <Input
                    id="dp_name"
                    value={form.dp_name}
                    onChange={(e) => set("dp_name", e.target.value)}
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
                  {aiButton("project_description", "cinematographer agreement — description of the picture")}
                </div>
                <div>
                  <Label htmlFor="services">Services</Label>
                  <Textarea
                    id="services"
                    rows={3}
                    placeholder="Cinematography services — prep, camera tests, principal photography…"
                    value={form.services}
                    onChange={(e) => set("services", e.target.value)}
                  />
                  {aiButton("services", "cinematographer agreement — cinematography services")}
                </div>
                <div>
                  <Label htmlFor="prep_test_days">Prep / Test Days</Label>
                  <Input
                    id="prep_test_days"
                    placeholder="2 prep days + 1 camera test day"
                    value={form.prep_test_days}
                    onChange={(e) => set("prep_test_days", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="shoot_days">Shoot Days</Label>
                  <Input
                    id="shoot_days"
                    placeholder="15 shoot days"
                    value={form.shoot_days}
                    onChange={(e) => set("shoot_days", e.target.value)}
                  />
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
                    placeholder="$4,500 / week"
                    value={form.fee}
                    onChange={(e) => set("fee", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_schedule">Payment Schedule</Label>
                  <Textarea
                    id="payment_schedule"
                    rows={3}
                    placeholder="e.g., 1/3 on commencement, 1/3 on first shoot day, 1/3 on wrap"
                    value={form.payment_schedule}
                    onChange={(e) => set("payment_schedule", e.target.value)}
                  />
                  {aiButton("payment_schedule", "cinematographer agreement — payment schedule")}
                </div>
                <div>
                  <Label htmlFor="kit_rental">Kit / Package Rental (optional)</Label>
                  <Input
                    id="kit_rental"
                    placeholder="e.g., $750/week camera package rental"
                    value={form.kit_rental}
                    onChange={(e) => set("kit_rental", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Camera & Credit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="camera_package">Camera & Equipment Package</Label>
                  <Textarea
                    id="camera_package"
                    rows={3}
                    placeholder="Camera bodies, lenses, format/resolution, who supplies…"
                    value={form.camera_package}
                    onChange={(e) => set("camera_package", e.target.value)}
                  />
                  {aiButton("camera_package", "cinematographer agreement — camera and equipment package")}
                </div>
                <div>
                  <Label htmlFor="credit">Screen Credit</Label>
                  <Input
                    id="credit"
                    placeholder="Director of Photography — [DP Name]"
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ownership & Additional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="additional_provisions">Additional Provisions</Label>
                  <Textarea
                    id="additional_provisions"
                    rows={3}
                    placeholder="Any special terms — travel, perks, turnaround, cutting rights…"
                    value={form.additional_provisions}
                    onChange={(e) => set("additional_provisions", e.target.value)}
                  />
                  {aiButton("additional_provisions", "cinematographer agreement — additional provisions")}
                </div>
                <div>
                  <Label>Governing Law</Label>
                  <Select value={govChoice} onValueChange={(val) => {
                    setGovChoice(val);
                    set("governing_law", val === "Other" ? "" : val);
                  }}>
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
                </div>
                {govChoice === "Other" && (
                  <div>
                    <Label htmlFor="governing_law_custom">Custom Governing Law</Label>
                    <Input
                      id="governing_law_custom"
                      placeholder="Specify jurisdiction"
                      value={form.governing_law}
                      onChange={(e) => set("governing_law", e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: preview */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Live Preview</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="default" size="sm" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white text-black p-8 rounded-md shadow-sm min-h-[700px] font-serif text-sm leading-relaxed">
                    <h2 className="text-center text-xl font-bold uppercase tracking-wide mb-6">
                      Cinematographer Agreement
                    </h2>
                    <p className="mb-6">{intro}</p>
                    <ol className="list-decimal list-outside ml-5 space-y-4">
                      {clauses.map((c, i) => (
                        <li key={i}>
                          <span className="font-bold">{c.heading}.</span>{" "}
                          <span className="whitespace-pre-wrap">{c.body}</span>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-10 grid grid-cols-2 gap-8">
                      <div>
                        <p className="font-bold uppercase mb-2">Producer</p>
                        <p className="border-b border-black my-6" />
                        <p>{v(form.production_company, "producer / production company")}</p>
                        <p className="border-b border-black my-6" />
                        <p>Date</p>
                      </div>
                      <div>
                        <p className="font-bold uppercase mb-2">Cinematographer</p>
                        <p className="border-b border-black my-6" />
                        <p>{v(form.dp_name, "cinematographer / DP")}</p>
                        <p className="border-b border-black my-6" />
                        <p>Date</p>
                      </div>
                    </div>

                    <p className="mt-10 text-xs text-gray-600 italic">{DISCLAIMER}</p>
                  </div>
                </CardContent>
              </Card>

              <p className="text-center text-xs text-muted-foreground">
                Filmmaker Genius — Document Library. Template only; not legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematographerAgreement;
