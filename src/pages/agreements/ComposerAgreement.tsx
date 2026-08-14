import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Download, Loader2, Printer, RotateCcw, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface ComposerAgreementForm {
  composer_name: string;
  composer_entity_type: string;
  producer_name: string;
  effective_date: string;
  project_title: string;
  project_type: string;
  runtime: string;
  services: string;
  deliverables: string;
  delivery_date: string;
  revisions: string;
  fee_type: string;
  fee_amount: string;
  package_covers: string;
  payment_schedule: string;
  royalties: string;
  ownership: string;
  publishing: string;
  credit_text: string;
  pro_affiliation: string;
}

const INITIAL_FORM: ComposerAgreementForm = {
  composer_name: "",
  composer_entity_type: "Individual",
  producer_name: "",
  effective_date: "",
  project_title: "",
  project_type: "Feature Film",
  runtime: "",
  services:
    "Compose, arrange, orchestrate, perform, record, mix, and deliver original score",
  deliverables: "Final stereo mixes, stems, and a completed music cue sheet",
  delivery_date: "",
  revisions: "2 rounds per cue",
  fee_type: "All-In / Package Deal",
  fee_amount: "",
  package_covers: "musicians, studio, software, and all recording costs",
  payment_schedule: "",
  royalties: "",
  ownership: "Work-Made-For-Hire (Producer owns)",
  publishing: "Producer controls publishing; composer retains writer's share",
  credit_text: "Original Music by [Composer]",
  pro_affiliation: "",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. A composer deal typically covers BOTH the composition/score copyright (usually work-made-for-hire) and delivery of the master recordings (stems and mixes). Consult a qualified entertainment attorney before executing this agreement.";

const ENTITY_OPTIONS = ["Individual", "Loan-out or Company"];
const PROJECT_TYPES = ["Feature Film", "Short Film", "Documentary", "Series", "Trailer"];
const FEE_TYPES = ["All-In / Package Deal", "Creative Fee + Budget", "Per-Cue"];
const OWNERSHIP_OPTIONS = [
  "Work-Made-For-Hire (Producer owns)",
  "Composer retains, licenses to Producer",
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
type AiField = "services" | "payment_schedule" | "additional_terms";

const ComposerAgreement = () => {
  const [form, setForm] = useState<ComposerAgreementForm>(INITIAL_FORM);
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [entityChoice, setEntityChoice] = useState("Individual");
  const [projectChoice, setProjectChoice] = useState("Feature Film");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof ComposerAgreementForm>(key: K, value: ComposerAgreementForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const getField = (field: AiField) => (field === "additional_terms" ? additionalTerms : form[field]);
  const setField = (field: AiField, value: string) =>
    field === "additional_terms" ? setAdditionalTerms(value) : set(field, value);

  const legalize = async (field: AiField, context: string) => {
    const value = getField(field).trim();
    if (!value) return;
    setLegalizing(field);
    try {
      const res = await aiInvoke<{ text?: string; error?: string }>("legalize-text", {
        body: { text: value, context },
      });
      if (res?.text) {
        setField(field, res.text);
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

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setAdditionalTerms("");
    setEntityChoice("Individual");
    setProjectChoice("Feature Film");
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

  // Strips trailing sentence punctuation so template sentences never double up on periods.
  const s = (value: string, placeholder: string) => v(value, placeholder).replace(/[.;,]+$/, "");

  const intro = `This Composer Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.composer_name, "composer")} (${v(
    form.composer_entity_type,
    "entity type"
  )}) ("Composer") and ${v(form.producer_name, "producer / company")} ("Producer").`;

  const clauses: Clause[] = useMemo(() => {
    const isPackage = form.fee_type === "All-In / Package Deal";
    const isWFH = form.ownership === "Work-Made-For-Hire (Producer owns)";

    return [
      {
        heading: "Engagement & Services",
        body: `Producer hereby engages Composer to ${s(
          form.services,
          "scope of services"
        )} for the motion picture or program presently entitled "${v(
          form.project_title,
          "project title"
        )}" (the "Project"), a ${v(form.project_type, "project type")}${
          form.runtime.trim() ? ` of approximately ${form.runtime.trim()}` : ""
        }. Composer shall render such services in a timely, professional manner and in accordance with Producer's creative direction.`,
      },
      {
        heading: "Delivery & Schedule",
        body: `Composer shall deliver the following: ${s(
          form.deliverables,
          "deliverables"
        )}. Delivery shall be completed no later than ${v(
          formatDate(form.delivery_date),
          "score delivery deadline"
        )}. ${s(
          form.revisions,
          "included revisions"
        )} of revisions are included within the compensation stated below, at no additional cost to Producer.`,
      },
      {
        heading: "Compensation",
        body: `Composer shall be compensated on a ${v(form.fee_type, "fee type")} basis in the amount of ${v(
          form.fee_amount,
          "fee (USD)"
        )}.${
          isPackage
            ? ` This is an all-in package fee inclusive of ${s(
                form.package_covers,
                "what the package covers"
              )}, and Composer shall be solely responsible for such costs.`
            : ""
        } Payment schedule: ${s(form.payment_schedule, "payment schedule")}.`,
      },
      {
        heading: "Royalties / Backend",
        body: form.royalties.trim()
          ? form.royalties.trim()
          : "No additional royalties, participations, or backend are payable beyond the fee stated above, except that Composer shall retain the writer's share of public-performance royalties collected through Composer's performing rights organization.",
      },
      {
        heading: "Ownership of Score",
        body: isWFH
          ? `All results and proceeds of Composer's services hereunder, including the score, all cues, arrangements, and master recordings, are created as works made for hire specially ordered and commissioned by Producer, and Producer shall be deemed the author and sole owner thereof throughout the universe in perpetuity, in all media now known or hereafter devised. To the extent any such material does not qualify as a work made for hire, Composer hereby irrevocably assigns to Producer all right, title, and interest therein, including all copyrights and renewals thereof.`
          : `Composer shall retain ownership of the copyright in the score and hereby grants Producer an exclusive, perpetual, irrevocable, worldwide license to record, synchronize, reproduce, distribute, perform, and otherwise exploit the score in and in connection with the Project and all versions, elements, advertising, and ancillary exploitation thereof, in all media now known or hereafter devised.`,
      },
      {
        heading: "Publishing",
        body: `${s(form.publishing, "publishing split / administration")}.${
          form.pro_affiliation.trim()
            ? ` Composer's performing rights organization affiliation is ${form.pro_affiliation.trim()}, and the parties shall promptly register the score and file a cue sheet accordingly.`
            : ""
        }`,
      },
      {
        heading: "Credit",
        body: `Subject to Composer's full performance hereunder, Producer shall accord Composer credit substantially as follows: ${s(
          form.credit_text,
          "credit"
        )}. Casual or inadvertent failure to comply shall not constitute a breach of this Agreement.`,
      },
      {
        heading: "Representations & Warranties",
        body: `Composer represents and warrants that the score is and shall be original to Composer, that it does not and will not infringe upon the copyright or any other right of any third party, and that any samples, loops, libraries, or other third-party elements incorporated therein shall be fully licensed and cleared at Composer's expense prior to delivery.`,
      },
      {
        heading: "Additional Terms",
        body: v(additionalTerms, "additional terms"),
      },
    ];
  }, [form, additionalTerms]);

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

    write("COMPOSER AGREEMENT", 15, "bold", "center");
    y += 6;
    write(intro);
    y += 4;

    clauses.forEach((c, i) => {
      ensure(14);
      write(`${i + 1}. ${c.heading.toUpperCase()}`, 11, "bold");
      y += 1;
      write(c.body);
      y += 4;
    });

    y += 4;
    write("IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.");
    y += 10;
    ensure(40);
    write("COMPOSER", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.composer_name, "composer")}`);
    write("Date: __________________________________");
    y += 8;
    ensure(30);
    write("PRODUCER", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.producer_name, "producer / company")}`);
    write("Date: __________________________________");
    y += 12;
    ensure(16);
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    write("Filmmaker Genius — Document Library.", 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = `${form.project_title || "Project"}_${form.composer_name || "Composer"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Composer_Agreement.pdf`);
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
      disabled={!getField(field).trim() || legalizing === field}
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

  const isPackageFee = form.fee_type === "All-In / Package Deal";

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Composer Agreement</h1>
          <p className="text-muted-foreground">
            Engage a composer to write, produce, and deliver original score for your film.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers hiring a composer for original score.</li>
                <li>Composers documenting scope, fee, and rights.</li>
                <li>Music supervisors formalizing a score deal.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Defines the score work, delivery, and schedule.</li>
                <li>Sets fee, package/all-in terms, and publishing.</li>
                <li>Assigns copyright (work-for-hire) and credit.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Consult an entertainment attorney before signing. A composer
            deal typically covers BOTH the composition/score copyright (usually work-made-for-hire) and
            delivery of the master recordings (stems and mixes).
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
                  <Label htmlFor="composer_name">Composer</Label>
                  <Input
                    id="composer_name"
                    value={form.composer_name}
                    onChange={(e) => set("composer_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Composer Entity Type</Label>
                  <Select
                    value={entityChoice}
                    onValueChange={(val) => {
                      setEntityChoice(val);
                      set("composer_entity_type", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ENTITY_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {entityChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., Partnership / Collective"
                      value={form.composer_entity_type}
                      onChange={(e) => set("composer_entity_type", e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="producer_name">Producer / Company</Label>
                  <Input
                    id="producer_name"
                    value={form.producer_name}
                    onChange={(e) => set("producer_name", e.target.value)}
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
                <CardTitle>Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project_title">Film / Project Title</Label>
                  <Input
                    id="project_title"
                    value={form.project_title}
                    onChange={(e) => set("project_title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Project Type</Label>
                  <Select
                    value={projectChoice}
                    onValueChange={(val) => {
                      setProjectChoice(val);
                      set("project_type", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {projectChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., Video Game / Podcast"
                      value={form.project_type}
                      onChange={(e) => set("project_type", e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="runtime">Approx. Runtime / # of Cues (optional)</Label>
                  <Input
                    id="runtime"
                    placeholder="e.g., 98 minutes / 24 cues"
                    value={form.runtime}
                    onChange={(e) => set("runtime", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services &amp; Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="services">Scope of Services</Label>
                  <Textarea
                    id="services"
                    rows={3}
                    value={form.services}
                    onChange={(e) => set("services", e.target.value)}
                  />
                  {aiButton("services", "composer agreement — scope of services")}
                </div>
                <div>
                  <Label htmlFor="deliverables">Deliverables (stems, mixes, cue sheet)</Label>
                  <Textarea
                    id="deliverables"
                    rows={3}
                    value={form.deliverables}
                    onChange={(e) => set("deliverables", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_date">Score Delivery Deadline</Label>
                  <Input
                    id="delivery_date"
                    type="date"
                    value={form.delivery_date}
                    onChange={(e) => set("delivery_date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="revisions">Included Revisions</Label>
                  <Input
                    id="revisions"
                    placeholder="e.g., 2 rounds per cue"
                    value={form.revisions}
                    onChange={(e) => set("revisions", e.target.value)}
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
                  <Label>Fee Type</Label>
                  <Select value={form.fee_type} onValueChange={(val) => set("fee_type", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FEE_TYPES.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fee_amount">Fee (USD)</Label>
                  <Input
                    id="fee_amount"
                    placeholder="$15,000"
                    value={form.fee_amount}
                    onChange={(e) => set("fee_amount", e.target.value)}
                  />
                </div>
                {isPackageFee && (
                  <div>
                    <Label htmlFor="package_covers">What the Package Covers</Label>
                    <Textarea
                      id="package_covers"
                      rows={2}
                      value={form.package_covers}
                      onChange={(e) => set("package_covers", e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="payment_schedule">Payment Schedule</Label>
                  <Textarea
                    id="payment_schedule"
                    rows={3}
                    placeholder="e.g., 1/3 on execution, 1/3 on spotting, 1/3 on delivery"
                    value={form.payment_schedule}
                    onChange={(e) => set("payment_schedule", e.target.value)}
                  />
                  {aiButton("payment_schedule", "composer agreement — payment schedule")}
                </div>
                <div>
                  <Label htmlFor="royalties">Writer's Share / Royalties / Backend (optional)</Label>
                  <Textarea
                    id="royalties"
                    rows={2}
                    value={form.royalties}
                    onChange={(e) => set("royalties", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rights &amp; Credit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Ownership</Label>
                  <Select value={form.ownership} onValueChange={(val) => set("ownership", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      {OWNERSHIP_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="publishing">Publishing Split / Administration</Label>
                  <Input
                    id="publishing"
                    value={form.publishing}
                    onChange={(e) => set("publishing", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="credit_text">Credit</Label>
                  <Textarea
                    id="credit_text"
                    rows={2}
                    value={form.credit_text}
                    onChange={(e) => set("credit_text", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pro_affiliation">PRO Affiliation (ASCAP/BMI/etc.) (optional)</Label>
                  <Input
                    id="pro_affiliation"
                    placeholder="ASCAP"
                    value={form.pro_affiliation}
                    onChange={(e) => set("pro_affiliation", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="additional_terms">Additional Terms</Label>
                <Textarea
                  id="additional_terms"
                  rows={4}
                  placeholder="Spotting sessions, soundtrack album rights, sequels/re-use, kill fee…"
                  value={additionalTerms}
                  onChange={(e) => setAdditionalTerms(e.target.value)}
                />
                {aiButton("additional_terms", "composer agreement — additional terms")}
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
                  <h2 className="mb-4 text-center text-lg font-bold">COMPOSER AGREEMENT</h2>
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
                      <p className="font-bold">COMPOSER</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.composer_name, "composer")}</p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                    <div>
                      <p className="font-bold">PRODUCER</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.producer_name, "producer / company")}</p>
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

export default ComposerAgreement;
