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

interface ParentalGuardianConsentForm {
  production_name: string;
  company: string;
  minor_name: string;
  minor_dob: string;
  guardian_name: string;
  relationship: string;
  role_character: string;
  effective_date: string;
  services: string;
  work_dates: string;
  compensation: string;
  trust_account: string;
  additional_provisions: string;
  governing_law: string;
}

const INITIAL_FORM: ParentalGuardianConsentForm = {
  production_name: "",
  company: "",
  minor_name: "",
  minor_dob: "",
  guardian_name: "",
  relationship: "Legal Guardian",
  role_character: "",
  effective_date: "",
  services: "",
  work_dates: "",
  compensation: "",
  trust_account: "Coogan / trust account required",
  additional_provisions: "",
  governing_law: "the State of California",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Employing minors is heavily regulated and often requires permits, a studio teacher, trust (Coogan) accounts, and sometimes court approval. Have an entertainment attorney review this before use.";

const GOV_OPTIONS = [
  "the State of California",
  "the State of New York",
  "the State of Delaware",
  "the State of Georgia",
];

const RELATIONSHIP_OPTIONS = ["Mother", "Father", "Legal Guardian"];

const TRUST_OPTIONS = ["Coogan / trust account required", "No trust account required"];

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
type AiField = "services" | "additional_provisions";

const ParentalGuardianConsentMinor = () => {
  const [form, setForm] = useState<ParentalGuardianConsentForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof ParentalGuardianConsentForm>(key: K, value: ParentalGuardianConsentForm[K]) =>
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

  const intro = `This Parental / Guardian Consent ("Consent") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.company, "company / production")} and ${v(
    form.guardian_name,
    "parent / legal guardian"
  )}, as ${form.relationship.toLowerCase()} of ${v(form.minor_name, "minor / performer")}.`;

  const trustBody = (() => {
    const base = `Company shall pay compensation of ${v(
      form.compensation,
      "compensation"
    )} for the Minor's services.`;
    if (form.trust_account === "Coogan / trust account required") {
      return `${base} The parties acknowledge that a portion of the Minor's earnings must be deposited into a blocked trust (Coogan) account as required by applicable law, and Company and Guardian shall cooperate to satisfy those requirements.`;
    }
    return `${base} The parties have determined that no trust account is required for this engagement; the parties remain responsible for confirming compliance with applicable law.`;
  })();

  const clauses: Clause[] = [
    {
      heading: "Consent & Authority",
      body: `${v(form.guardian_name, "parent / legal guardian")}, the ${form.relationship.toLowerCase()} of ${v(
        form.minor_name,
        "minor / performer"
      )} ("Minor"), hereby consents to the engagement of Minor by ${v(
        form.company,
        "company / production"
      )} ("Company") in the role of ${v(
        form.role_character,
        "role / character"
      )} in connection with the production presently entitled ${v(
        form.production_name,
        "production name"
      )}, and represents that they have the full legal authority to enter into this consent on the Minor's behalf.`,
    },
    {
      heading: "Services",
      body: `Minor shall render the following services: ${v(
        form.services,
        "description of services"
      )}. Work is scheduled for: ${v(form.work_dates, "work dates")}.`,
    },
    { heading: "Compensation & Trust Account", body: trustBody },
    {
      heading: "Work Hours, Education & Welfare",
      body: "Company shall comply with all applicable child-labor laws governing permitted work hours, rest and meal breaks, schooling and on-set tutoring, and the presence of a studio teacher or welfare worker where required. The Guardian or an authorized responsible adult shall be present as required by law.",
    },
    {
      heading: "Grant of Rights & Release",
      body: "Guardian, on behalf of the Minor, grants Company the right to photograph, record, and use the Minor's name, likeness, voice, and performance in connection with the production and its promotion in all media now known or hereafter devised. Guardian, on behalf of the Minor, releases Company from any claims arising out of such use, to the fullest extent permitted by law and subject to any court approval that may be required.",
    },
    {
      heading: "Work Made for Hire; Ownership",
      body: "All results and proceeds of the Minor's services hereunder shall be deemed a work made for hire for Company, and Company shall be the sole author and owner of all right, title, and interest therein, including all copyrights, throughout the universe in perpetuity. To the extent any such results and proceeds are not deemed a work made for hire, Guardian, on behalf of the Minor, hereby irrevocably assigns them in their entirety to Company.",
    },
    {
      heading: "Representations & Warranties",
      body: `Guardian represents and warrants that Guardian is the parent or legal guardian of the Minor with full authority to sign this Consent; that the information provided, including the Minor's date of birth (${v(
        formatDate(form.minor_dob),
        "minor's date of birth"
      )}), is accurate; and that the parties shall comply with all applicable laws and with Company's reasonable safety and on-set policies.`,
    },
    {
      heading: "Additional Provisions",
      body: v(form.additional_provisions, "additional provisions"),
    },
    {
      heading: "Governing Law",
      body: `This Consent shall be governed by and construed under the laws of ${v(
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

    write("PARENTAL / GUARDIAN CONSENT (MINOR)", 16, "bold", "center");
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
    write("IN WITNESS WHEREOF, the parties have executed this Consent as of the Effective Date.");
    y += 10;
    write("COMPANY", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.company, "company / production")}`);
    write("Date: __________________________________");
    y += 8;
    write("PARENT / LEGAL GUARDIAN (on behalf of Minor)", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.guardian_name, "parent / legal guardian")}`);
    write(`Relationship to Minor: ${v(form.relationship, "relationship")}`);
    write(`Minor's Name: ${v(form.minor_name, "minor / performer")}`);
    write("Date: __________________________________");
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = `${form.production_name || "MinorConsent"}_${form.minor_name || "Agreement"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Parental_Guardian_Consent.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Parental / Guardian Consent (Minor)</h1>
          <p className="text-muted-foreground">
            Consent and terms for engaging a minor performer — authority, welfare, and trust account.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Productions employing a performer under 18.</li>
                <li>Parents or guardians consenting on a minor's behalf.</li>
                <li>Coordinators documenting minor-performer compliance.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Records the guardian's consent and authority.</li>
                <li>Acknowledges work-hour, education, and welfare rules.</li>
                <li>Notes trust-account (Coogan) and rights terms.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Employing minors is heavily regulated and often
            requires permits, a studio teacher, trust (Coogan) accounts, and sometimes court approval.
            Have an entertainment attorney review this before use.
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
                  <Label htmlFor="minor_name">Minor / Performer</Label>
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
                  <Label htmlFor="role_character">Role / Character</Label>
                  <Input
                    id="role_character"
                    value={form.role_character}
                    onChange={(e) => set("role_character", e.target.value)}
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
                  <Label htmlFor="services">Description of Services</Label>
                  <Textarea
                    id="services"
                    rows={4}
                    placeholder="Description of the minor's performance / services…"
                    value={form.services}
                    onChange={(e) => set("services", e.target.value)}
                  />
                  {aiButton("services", "minor consent — description of services")}
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compensation & Trust Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="compensation">Compensation</Label>
                  <Input
                    id="compensation"
                    placeholder="$500 / day"
                    value={form.compensation}
                    onChange={(e) => set("compensation", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Trust Account</Label>
                  <Select value={form.trust_account} onValueChange={(val) => set("trust_account", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trust account requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRUST_OPTIONS.map((o) => (
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
                <CardTitle>Additional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="additional_provisions">Additional Provisions</Label>
                  <Textarea
                    id="additional_provisions"
                    rows={4}
                    placeholder="Permits, tutoring, chaperone, medical, restrictions…"
                    value={form.additional_provisions}
                    onChange={(e) => set("additional_provisions", e.target.value)}
                  />
                  {aiButton("additional_provisions", "minor consent — additional provisions")}
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
                  <h2 className="mb-4 text-center text-lg font-bold">
                    PARENTAL / GUARDIAN CONSENT (MINOR)
                  </h2>
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
                    IN WITNESS WHEREOF, the parties have executed this Consent as of the Effective Date.
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
                      <p className="font-bold">PARENT / LEGAL GUARDIAN (on behalf of Minor)</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">
                        Printed Name: {v(form.guardian_name, "parent / legal guardian")}
                      </p>
                      <p className="mt-2">
                        Relationship to Minor: {v(form.relationship, "relationship")}
                      </p>
                      <p className="mt-2">Minor's Name: {v(form.minor_name, "minor / performer")}</p>
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

export default ParentalGuardianConsentMinor;
