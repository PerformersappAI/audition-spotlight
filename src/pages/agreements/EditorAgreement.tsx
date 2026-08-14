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

interface EditorAgreementForm {
  editor_name: string;
  editor_entity_type: string;
  producer_name: string;
  effective_date: string;
  project_title: string;
  project_type: string;
  format_runtime: string;
  services: string;
  cuts: string;
  start_date: string;
  delivery_date: string;
  workspace: string;
  rate_type: string;
  rate_amount: string;
  guaranteed_period: string;
  kit_rental: string;
  payment_schedule: string;
  overtime: string;
  ownership: string;
  credit_text: string;
  credit_placement: string;
}

const INITIAL_FORM: EditorAgreementForm = {
  editor_name: "",
  editor_entity_type: "Individual",
  producer_name: "",
  effective_date: "",
  project_title: "",
  project_type: "Feature Film",
  format_runtime: "",
  services: "Assemble, edit, and refine picture through delivery of the final locked cut",
  cuts: "Editor's assembly, rough cut, director's cut, and final locked cut",
  start_date: "",
  delivery_date: "",
  workspace: "Editor's own suite/system",
  rate_type: "Weekly",
  rate_amount: "",
  guaranteed_period: "",
  kit_rental: "",
  payment_schedule: "",
  overtime: "",
  ownership: "Work-Made-For-Hire (Producer owns)",
  credit_text: "Edited by [Editor]",
  credit_placement: "Per producer's discretion",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Consult a qualified entertainment attorney before executing this agreement.";

const ENTITY_OPTIONS = ["Individual", "Loan-out or Company"];
const PROJECT_TYPES = ["Feature Film", "Short Film", "Documentary", "Series", "Trailer"];
const WORKSPACE_OPTIONS = ["Editor's own suite/system", "Producer-provided suite"];
const RATE_TYPES = ["Weekly", "Flat / Package", "Daily"];
const OWNERSHIP_OPTIONS = [
  "Work-Made-For-Hire (Producer owns)",
  "Editor retains, licenses to Producer",
];
const CREDIT_PLACEMENT_OPTIONS = ["Main titles", "End titles", "Per producer's discretion"];

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

const EditorAgreement = () => {
  const [form, setForm] = useState<EditorAgreementForm>(INITIAL_FORM);
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [entityChoice, setEntityChoice] = useState("Individual");
  const [projectChoice, setProjectChoice] = useState("Feature Film");
  const [workspaceChoice, setWorkspaceChoice] = useState("Editor's own suite/system");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof EditorAgreementForm>(key: K, value: EditorAgreementForm[K]) =>
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
    setWorkspaceChoice("Editor's own suite/system");
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const s = (value: string, placeholder: string) => v(value, placeholder).replace(/[.;,]+$/, "");

  const intro = `This Editor Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.editor_name, "editor")} (${v(
    form.editor_entity_type,
    "entity type"
  )}) ("Editor") and ${v(form.producer_name, "producer / company")} ("Producer").`;

  const clauses: Clause[] = useMemo(() => {
    const isWFH = form.ownership === "Work-Made-For-Hire (Producer owns)";

    return [
      {
        heading: "Engagement & Services",
        body: `Producer hereby engages Editor to ${s(
          form.services,
          "scope of services"
        )} for the motion picture or program presently entitled "${v(
          form.project_title,
          "project title"
        )}" (the "Project"), a ${v(form.project_type, "project type")}${
          form.format_runtime.trim() ? ` of approximately ${form.format_runtime.trim()}` : ""
        }. Editor shall render such services in a timely, professional manner and in accordance with Producer's creative direction.`,
      },
      {
        heading: "Cuts & Delivery",
        body: `Editor shall deliver the following cuts: ${s(
          form.cuts,
          "cuts and deliverables"
        )}. Work shall begin on ${v(formatDate(form.start_date), "start date")} and picture lock / final delivery shall be completed no later than ${v(
          formatDate(form.delivery_date),
          "picture lock / delivery deadline"
        )}.`,
      },
      {
        heading: "Facilities",
        body: `The editing services shall be performed at ${v(
          form.workspace,
          "workspace"
        )}, unless otherwise agreed in writing by the parties.`,
      },
      {
        heading: "Compensation",
        body: `Editor shall be compensated on a ${v(form.rate_type, "rate type")} basis in the amount of ${v(
          form.rate_amount,
          "rate (USD)"
        )}.${
          form.guaranteed_period.trim()
            ? ` The guaranteed period shall be ${form.guaranteed_period.trim()}.`
            : ""
        }${
          form.kit_rental.trim()
            ? ` Kit / system rental shall be ${form.kit_rental.trim()} per week.`
            : ""
        } Payment schedule: ${s(form.payment_schedule, "payment schedule")}.${
          form.overtime.trim()
            ? ` Overtime and additional weeks shall be handled as follows: ${form.overtime.trim()}.`
            : ""
        }`,
      },
      {
        heading: "Ownership",
        body: isWFH
          ? `All results and proceeds of Editor's services hereunder, including all edited versions, cuts, and materials, are created as works made for hire specially ordered and commissioned by Producer, and Producer shall be deemed the author and sole owner thereof throughout the universe in perpetuity, in all media now known or hereafter devised. To the extent any such material does not qualify as a work made for hire, Editor hereby irrevocably assigns to Producer all right, title, and interest therein, including all copyrights and renewals thereof.`
          : `Editor shall retain ownership of the copyright in the edited materials and hereby grants Producer an exclusive, perpetual, irrevocable, worldwide license to use, reproduce, modify, distribute, perform, and otherwise exploit the edited materials in and in connection with the Project and all versions, advertising, and ancillary exploitation thereof, in all media now known or hereafter devised.`,
      },
      {
        heading: "Credit",
        body: `Subject to Editor's full performance hereunder, Producer shall accord Editor credit substantially as follows: ${s(
          form.credit_text,
          "credit"
        )}. The credit shall be placed in ${v(
          form.credit_placement,
          "credit placement"
        )}. Casual or inadvertent failure to comply shall not constitute a breach of this Agreement.`,
      },
      {
        heading: "Representations & Warranties",
        body: `Editor represents and warrants that the editing work is and shall be original to Editor or properly licensed, that it does not and will not infringe upon the copyright or any other right of any third party, and that any third-party elements incorporated therein shall be fully cleared at Editor's expense prior to delivery.`,
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

    write("EDITOR AGREEMENT", 15, "bold", "center");
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
    write("EDITOR", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.editor_name, "editor")}`);
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
    const base = `${form.project_title || "Project"}_${form.editor_name || "Editor"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Editor_Agreement.pdf`);
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

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Editor Agreement</h1>
          <p className="text-muted-foreground">
            Engage a picture editor to cut your film — services, schedule, delivery, and credit.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers hiring a picture editor.</li>
                <li>Editors documenting scope, fee, and credit.</li>
                <li>Post supervisors formalizing an edit deal.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Defines the editing services and cut schedule.</li>
                <li>Sets fee, weekly/flat terms, and kit rental.</li>
                <li>Assigns ownership (work-for-hire) and credit.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Consult an entertainment attorney before signing.
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
                  <Label htmlFor="editor_name">Editor</Label>
                  <Input
                    id="editor_name"
                    value={form.editor_name}
                    onChange={(e) => set("editor_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Editor Entity Type</Label>
                  <Select
                    value={entityChoice}
                    onValueChange={(val) => {
                      setEntityChoice(val);
                      set("editor_entity_type", val === "Other" ? "" : val);
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
                      value={form.editor_entity_type}
                      onChange={(e) => set("editor_entity_type", e.target.value)}
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
                  <Label htmlFor="format_runtime">Format / Approx. Runtime (optional)</Label>
                  <Input
                    id="format_runtime"
                    placeholder="e.g., 90 minutes / 6 x 30 min episodes"
                    value={form.format_runtime}
                    onChange={(e) => set("format_runtime", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services & Schedule</CardTitle>
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
                  {aiButton("services", "editor agreement — scope of services")}
                </div>
                <div>
                  <Label htmlFor="cuts">Cuts & Deliverables</Label>
                  <Textarea
                    id="cuts"
                    rows={3}
                    value={form.cuts}
                    onChange={(e) => set("cuts", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="delivery_date">Picture Lock / Delivery Deadline</Label>
                    <Input
                      id="delivery_date"
                      type="date"
                      value={form.delivery_date}
                      onChange={(e) => set("delivery_date", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Workspace</Label>
                  <Select
                    value={workspaceChoice}
                    onValueChange={(val) => {
                      setWorkspaceChoice(val);
                      set("workspace", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select workspace" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKSPACE_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {workspaceChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="Describe workspace"
                      value={form.workspace}
                      onChange={(e) => set("workspace", e.target.value)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rate Type</Label>
                  <Select value={form.rate_type} onValueChange={(val) => set("rate_type", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rate type" />
                    </SelectTrigger>
                    <SelectContent>
                      {RATE_TYPES.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rate_amount">Rate (USD)</Label>
                  <Input
                    id="rate_amount"
                    placeholder="$2,500"
                    value={form.rate_amount}
                    onChange={(e) => set("rate_amount", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guaranteed_period">Guaranteed Period (optional)</Label>
                    <Input
                      id="guaranteed_period"
                      placeholder="e.g., 8 weeks"
                      value={form.guaranteed_period}
                      onChange={(e) => set("guaranteed_period", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="kit_rental">Kit / System Rental (optional)</Label>
                    <Input
                      id="kit_rental"
                      placeholder="e.g., $250 per week"
                      value={form.kit_rental}
                      onChange={(e) => set("kit_rental", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="payment_schedule">Payment Schedule</Label>
                  <Textarea
                    id="payment_schedule"
                    rows={3}
                    placeholder="e.g., 50% on start, 50% on picture lock"
                    value={form.payment_schedule}
                    onChange={(e) => set("payment_schedule", e.target.value)}
                  />
                  {aiButton("payment_schedule", "editor agreement — payment schedule")}
                </div>
                <div>
                  <Label htmlFor="overtime">Overtime / Additional Weeks (optional)</Label>
                  <Textarea
                    id="overtime"
                    rows={2}
                    value={form.overtime}
                    onChange={(e) => set("overtime", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rights & Credit</CardTitle>
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
                  <Label htmlFor="credit_text">Credit</Label>
                  <Textarea
                    id="credit_text"
                    rows={2}
                    value={form.credit_text}
                    onChange={(e) => set("credit_text", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Credit Placement</Label>
                  <Select
                    value={form.credit_placement}
                    onValueChange={(val) => set("credit_placement", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select credit placement" />
                    </SelectTrigger>
                    <SelectContent>
                      {CREDIT_PLACEMENT_OPTIONS.map((o) => (
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
                <CardTitle>Additional Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="additional_terms">Additional Terms</Label>
                <Textarea
                  id="additional_terms"
                  rows={4}
                  placeholder="Kill fee, revisions, sequels/re-use, NDA, travel…"
                  value={additionalTerms}
                  onChange={(e) => setAdditionalTerms(e.target.value)}
                />
                {aiButton("additional_terms", "editor agreement — additional terms")}
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
                  <h2 className="mb-4 text-center text-lg font-bold">EDITOR AGREEMENT</h2>
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
                      <p className="font-bold">EDITOR</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.editor_name, "editor")}</p>
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

export default EditorAgreement;
