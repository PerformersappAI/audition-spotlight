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
import { AlertTriangle, Download, Loader2, Printer, RotateCcw, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface CoProductionForm {
  effective_date: string;
  party1_name: string;
  party1_address: string;
  party2_name: string;
  party2_address: string;
  project_title: string;
  project_description: string;
  party1_contribution: string;
  party2_contribution: string;
  party1_share: string;
  party2_share: string;
  control: string;
  revenue_split: string;
  credit: string;
  governing_law: string;
}

const INITIAL_FORM: CoProductionForm = {
  effective_date: "",
  party1_name: "",
  party1_address: "",
  party2_name: "",
  party2_address: "",
  project_title: "",
  project_description: "",
  party1_contribution: "",
  party2_contribution: "",
  party1_share: "50%",
  party2_share: "50%",
  control:
    "Major creative and business decisions regarding the Project shall be made jointly by the Co-Producers, and neither Co-Producer shall act unilaterally on material matters without the other's written approval.",
  revenue_split: "in proportion to their respective ownership shares",
  credit:
    'Both companies shall receive a presentation or "Produced by" credit, in size and placement to be mutually agreed.',
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

type LegalizeField = "project_description" | "party1_contribution" | "party2_contribution";

const CoProductionAgreement = () => {
  const [form, setForm] = useState<CoProductionForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof CoProductionForm>(key: K, value: CoProductionForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<LegalizeField | null>(null);

  const legalize = async (field: LegalizeField, context: string) => {
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

  const intro = `This Co-Production Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.party1_name, "co-producer A name")}, located at ${v(
    form.party1_address,
    "co-producer A address"
  )} ("Co-Producer A"), and ${v(form.party2_name, "co-producer B name")}, located at ${v(
    form.party2_address,
    "co-producer B address"
  )} ("Co-Producer B") (each a "Co-Producer" and together the "Co-Producers").`;

  const clauses: Clause[] = [
    {
      heading: "1. THE PROJECT.",
      body: `The Co-Producers agree to jointly produce the motion picture tentatively titled "${v(
        form.project_title,
        "project title"
      )}" (the "Project"), described as: ${v(form.project_description, "project description")}.`,
    },
    {
      heading: "2. CONTRIBUTIONS.",
      body: `Co-Producer A shall contribute: ${v(
        form.party1_contribution,
        "co-producer A contribution"
      )}. Co-Producer B shall contribute: ${v(form.party2_contribution, "co-producer B contribution")}.`,
    },
    {
      heading: "3. OWNERSHIP.",
      body: `The Co-Producers shall jointly own all right, title, and interest in and to the Project in the following shares: Co-Producer A — ${v(
        form.party1_share,
        "co-producer A share"
      )}; Co-Producer B — ${v(form.party2_share, "co-producer B share")}.`,
    },
    {
      heading: "4. CONTROL AND DECISION-MAKING.",
      body: form.control.trim() || "[control and decision-making terms]",
    },
    {
      heading: "5. REVENUE AND EXPENSES.",
      body: `Net revenues and expenses of the Project shall be shared ${v(
        form.revenue_split,
        "revenue split"
      )}.`,
    },
    {
      heading: "6. CREDIT.",
      body: form.credit.trim() || "[credit terms]",
    },
    {
      heading: "7. WARRANTIES.",
      body: "Each Co-Producer warrants that it has the full right, power, and authority to enter into this Agreement.",
    },
    {
      heading: "8. ASSIGNMENT.",
      body: "Neither Co-Producer may assign its interest in the Project without the other's written consent, except to an affiliated entity.",
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

  const closing = "IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.";
  const party1Line = `CO-PRODUCER A: ______________________   ${v(form.party1_name, "co-producer A name")}`;
  const party2Line = `CO-PRODUCER B: ______________________   ${v(form.party2_name, "co-producer B name")}`;

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

    const write = (text: string, size = 11, style: "normal" | "bold" | "italic" = "normal", align: "left" | "center" = "left") => {
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

    write("CO-PRODUCTION AGREEMENT", 16, "bold", "center");
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
    write(party1Line);
    y += 8;
    write(party2Line);
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeTitle = (form.project_title || "CoProduction_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_CoProduction_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Co-Production Agreement</h1>
          <p className="text-muted-foreground">
            Partner two companies to produce a film together and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Production companies partnering to make a film together.</li>
                <li>Co-producers splitting financing, work, and ownership.</li>
                <li>Anyone structuring a two-company production.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Sets each company's contribution, ownership, and credit.</li>
                <li>Defines joint control and how revenue is split.</li>
                <li>Governs a two-company co-production.</li>
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
                  <Label htmlFor="party1_name">Co-Producer A — Company</Label>
                  <Input
                    id="party1_name"
                    value={form.party1_name}
                    onChange={(e) => set("party1_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="party1_address">Co-Producer A Address</Label>
                  <Input
                    id="party1_address"
                    value={form.party1_address}
                    onChange={(e) => set("party1_address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="party2_name">Co-Producer B — Company</Label>
                  <Input
                    id="party2_name"
                    value={form.party2_name}
                    onChange={(e) => set("party2_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="party2_address">Co-Producer B Address</Label>
                  <Input
                    id="party2_address"
                    value={form.party2_address}
                    onChange={(e) => set("party2_address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>The Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project_title">Project Title</Label>
                  <Input
                    id="project_title"
                    value={form.project_title}
                    onChange={(e) => set("project_title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="project_description">Project Description</Label>
                  <Textarea
                    id="project_description"
                    rows={3}
                    value={form.project_description}
                    onChange={(e) => set("project_description", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.project_description.trim() || legalizing === "project_description"}
                    onClick={() => legalize("project_description", "Project Description")}
                  >
                    {legalizing === "project_description" ? (
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
                <CardTitle>Contributions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="party1_contribution">Co-Producer A Contribution</Label>
                  <Textarea
                    id="party1_contribution"
                    rows={3}
                    placeholder="e.g., 60% of the financing and post-production services"
                    value={form.party1_contribution}
                    onChange={(e) => set("party1_contribution", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.party1_contribution.trim() || legalizing === "party1_contribution"}
                    onClick={() => legalize("party1_contribution", "Co-Producer A Contribution")}
                  >
                    {legalizing === "party1_contribution" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
                </div>
                <div>
                  <Label htmlFor="party2_contribution">Co-Producer B Contribution</Label>
                  <Textarea
                    id="party2_contribution"
                    rows={3}
                    placeholder="e.g., 40% of the financing, cast, and locations"
                    value={form.party2_contribution}
                    onChange={(e) => set("party2_contribution", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.party2_contribution.trim() || legalizing === "party2_contribution"}
                    onClick={() => legalize("party2_contribution", "Co-Producer B Contribution")}
                  >
                    {legalizing === "party2_contribution" ? (
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
                <CardTitle>Ownership</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="party1_share">Co-Producer A Share</Label>
                    <Input
                      id="party1_share"
                      value={form.party1_share}
                      onChange={(e) => set("party1_share", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="party2_share">Co-Producer B Share</Label>
                    <Input
                      id="party2_share"
                      value={form.party2_share}
                      onChange={(e) => set("party2_share", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="control">Control and Decision-Making</Label>
                  <Textarea
                    id="control"
                    rows={3}
                    value={form.control}
                    onChange={(e) => set("control", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="revenue_split">Revenue and Expenses</Label>
                  <Input
                    id="revenue_split"
                    value={form.revenue_split}
                    onChange={(e) => set("revenue_split", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="credit">Credit</Label>
                  <Textarea
                    id="credit"
                    rows={3}
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
                    CO-PRODUCTION AGREEMENT
                  </h2>
                  <p>{intro}</p>
                  {clauses.map((c) => (
                    <p key={c.heading}>
                      <span className="font-semibold">{c.heading}</span> {c.body}
                    </p>
                  ))}
                  <p>{closing}</p>
                  <p className="whitespace-pre-line pt-4">{party1Line}</p>
                  <p className="whitespace-pre-line">{party2Line}</p>
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

export default CoProductionAgreement;
