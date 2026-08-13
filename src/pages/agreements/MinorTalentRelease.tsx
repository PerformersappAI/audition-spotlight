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

interface MinorTalentReleaseForm {
  production_name: string;
  company: string;
  minor_name: string;
  minor_dob: string;
  guardian_name: string;
  relationship: string;
  effective_date: string;
  project_description: string;
  consideration: string;
  additional_provisions: string;
  governing_law: string;
}

const INITIAL_FORM: MinorTalentReleaseForm = {
  production_name: "",
  company: "",
  minor_name: "",
  minor_dob: "",
  guardian_name: "",
  relationship: "Legal Guardian",
  effective_date: "",
  project_description: "",
  consideration: "",
  additional_provisions: "",
  governing_law: "the State of California",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Consult a qualified entertainment attorney before executing this or any release.";

const GOV_OPTIONS = [
  "the State of California",
  "the State of New York",
  "the State of Delaware",
  "the State of Georgia",
];

const RELATIONSHIP_OPTIONS = ["Mother", "Father", "Legal Guardian"];

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
type AiField = "project_description" | "additional_provisions";

const MinorTalentRelease = () => {
  const [form, setForm] = useState<MinorTalentReleaseForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof MinorTalentReleaseForm>(key: K, value: MinorTalentReleaseForm[K]) =>
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

  const intro = `This Minor Talent Release ("Release") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.company, "producer / company")} and ${v(
    form.guardian_name,
    "parent / legal guardian"
  )}, as ${v(form.relationship, "relationship")} of ${v(form.minor_name, "minor performer")}.`;

  const clauses: Clause[] = [
    {
      heading: "Grant of Rights",
      body: `In connection with the production presently entitled ${v(
        form.production_name,
        "production name"
      )} (${v(form.project_description, "project description")}), ${v(
        form.guardian_name,
        "parent / legal guardian"
      )}, the ${v(form.relationship, "relationship")} of ${v(
        form.minor_name,
        "minor performer"
      )} ("Minor"), grants ${v(form.company, "producer / company")} ("Company") the irrevocable, perpetual right to photograph, film, record, and use the Minor's name, likeness, image, voice, and performance, and to reproduce, edit, exhibit, distribute, and otherwise exploit the same in any and all media now known or hereafter devised, throughout the universe, in perpetuity, including for advertising and promotion.`,
    },
    {
      heading: "Consideration",
      body: `In consideration of ${v(form.consideration, "consideration")}, the receipt and sufficiency of which are hereby acknowledged, the undersigned grants the rights set forth herein on the Minor's behalf.`,
    },
    {
      heading: "Ownership",
      body: "All footage, recordings, and materials embodying the Minor's performance shall be the sole and exclusive property of Company, which shall own all rights therein, including all copyrights, and neither the Minor nor the undersigned shall have any right, title, or interest therein.",
    },
    {
      heading: "Release & Waiver",
      body: "The undersigned, on behalf of the Minor, releases and discharges Company and its licensees, successors, and assigns from any and all claims arising out of the use of the materials described herein, including claims for invasion of privacy, right of publicity, defamation, or any similar claim, and waives any right to inspect or approve the finished materials, to the fullest extent permitted by law and subject to any court approval that may be required.",
    },
    {
      heading: "Representations & Warranties",
      body: `The undersigned represents and warrants that they are the parent or legal guardian of the Minor with full authority to grant this release, and that the Minor's date of birth (${v(
        formatDate(form.minor_dob),
        "minor's date of birth"
      )}) is accurate.`,
    },
    {
      heading: "Additional Provisions",
      body: v(form.additional_provisions, "additional provisions"),
    },
    {
      heading: "Governing Law",
      body: `This Release shall be governed by and construed under the laws of ${v(
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

    write("MINOR TALENT RELEASE (PARENTAL)", 16, "bold", "center");
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
    write("IN WITNESS WHEREOF, the parties have executed this Release as of the Effective Date.");
    y += 10;
    write("PARENT / LEGAL GUARDIAN (on behalf of Minor)", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.guardian_name, "parent / legal guardian")}`);
    write(`Relationship to Minor: ${v(form.relationship, "relationship")}`);
    write(`Minor's Name: ${v(form.minor_name, "minor performer")}`);
    write("Date: __________________________________");
    y += 8;
    write("COMPANY", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.company, "producer / company")}`);
    write("Date: __________________________________");
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = `${form.production_name || "Minor"}_${form.minor_name || "Release"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Minor_Talent_Release.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Minor Talent Release (Parental)</h1>
          <p className="text-muted-foreground">
            A parent or guardian's release of a minor performer's likeness and performance.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Productions filming a performer under 18.</li>
                <li>Parents or guardians releasing a minor's likeness.</li>
                <li>Coordinators clearing minor performers.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Grants rights to the minor's likeness and performance.</li>
                <li>Assigns ownership of the footage to the production.</li>
                <li>Releases claims on the minor's behalf.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Releases involving minors may require additional consents,
            permits, or court approval. Have an entertainment attorney review this before use.
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
                  <Label htmlFor="company">Producer / Company</Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="minor_name">Minor Performer</Label>
                  <Input
                    id="minor_name"
                    value={form.minor_name}
                    onChange={(e) => set("minor_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="minor_dob">Minor's Date of Birth</Label>
                  <Input
                    id="minor_dob"
                    type="date"
                    value={form.minor_dob}
                    onChange={(e) => set("minor_dob", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="guardian_name">Parent / Legal Guardian</Label>
                  <Input
                    id="guardian_name"
                    value={form.guardian_name}
                    onChange={(e) => set("guardian_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Select value={form.relationship} onValueChange={(val) => set("relationship", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project_description">Project Description</Label>
                  <Textarea
                    id="project_description"
                    rows={3}
                    placeholder="The production — title, format, brief description…"
                    value={form.project_description}
                    onChange={(e) => set("project_description", e.target.value)}
                  />
                  {aiButton("project_description", "minor talent release — production description")}
                </div>
                <div>
                  <Label htmlFor="consideration">Consideration</Label>
                  <Input
                    id="consideration"
                    placeholder="e.g., $200, or good and valuable consideration"
                    value={form.consideration}
                    onChange={(e) => set("consideration", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="additional_provisions">Additional Provisions</Label>
                  <Textarea
                    id="additional_provisions"
                    rows={4}
                    placeholder="Any limits on use, expiration, special terms…"
                    value={form.additional_provisions}
                    onChange={(e) => set("additional_provisions", e.target.value)}
                  />
                  {aiButton("additional_provisions", "minor talent release — additional provisions")}
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
                  <h2 className="mb-4 text-center text-lg font-bold">MINOR TALENT RELEASE (PARENTAL)</h2>
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
                    IN WITNESS WHEREOF, the parties have executed this Release as of the Effective Date.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-bold">PARENT / LEGAL GUARDIAN (on behalf of Minor)</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.guardian_name, "parent / legal guardian")}</p>
                      <p className="mt-2">Relationship to Minor: {v(form.relationship, "relationship")}</p>
                      <p className="mt-2">Minor's Name: {v(form.minor_name, "minor performer")}</p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                    <div>
                      <p className="font-bold">COMPANY</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.company, "producer / company")}</p>
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

export default MinorTalentRelease;
