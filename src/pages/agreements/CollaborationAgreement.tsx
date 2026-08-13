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

interface CollaborationForm {
  effective_date: string;
  collab1_name: string;
  collab1_address: string;
  collab2_name: string;
  collab2_address: string;
  project_type: string;
  project_title: string;
  project_description: string;
  collab1_contribution: string;
  collab2_contribution: string;
  collab1_share: string;
  collab2_share: string;
  decision_making: string;
  credit: string;
  revenue_split: string;
  separation: string;
  governing_law: string;
}

const INITIAL_FORM: CollaborationForm = {
  effective_date: "",
  collab1_name: "",
  collab1_address: "",
  collab2_name: "",
  collab2_address: "",
  project_type: "Screenplay",
  project_title: "",
  project_description: "",
  collab1_contribution: "",
  collab2_contribution: "",
  collab1_share: "50%",
  collab2_share: "50%",
  decision_making:
    "All major creative and business decisions regarding the Project require the mutual written approval of both Collaborators.",
  credit:
    "The Collaborators shall receive shared credit, listed in alphabetical order by last name, unless otherwise agreed in writing.",
  revenue_split: "in proportion to their respective ownership shares",
  separation:
    "If a Collaborator withdraws before the Project is completed, the withdrawing Collaborator shall retain their ownership share in the material created to that point, and the remaining Collaborator may complete and exploit the Project; credit and compensation shall be equitably adjusted to reflect each Collaborator's contribution.",
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

const PROJECT_TYPES = ["Screenplay", "Treatment", "Story / Concept", "Series", "Stage Play"];

type LegalizeField = "project_description" | "collab1_contribution" | "collab2_contribution";

const CollaborationAgreement = () => {
  const [form, setForm] = useState<CollaborationForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof CollaborationForm>(key: K, value: CollaborationForm[K]) =>
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

  const intro = `This Collaboration Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.collab1_name, "collaborator A name")}, located at ${v(
    form.collab1_address,
    "collaborator A address"
  )} ("Collaborator A"), and ${v(form.collab2_name, "collaborator B name")}, located at ${v(
    form.collab2_address,
    "collaborator B address"
  )} ("Collaborator B") (each a "Collaborator" and together the "Collaborators").`;

  const clauses: Clause[] = [
    {
      heading: "1. THE PROJECT.",
      body: `The Collaborators agree to jointly create the ${v(
        form.project_type,
        "project type"
      )} tentatively titled "${v(form.project_title, "project title")}" (the "Project"), described as: ${v(
        form.project_description,
        "project description"
      )}.`,
    },
    {
      heading: "2. CONTRIBUTIONS.",
      body: `Collaborator A shall contribute: ${v(
        form.collab1_contribution,
        "collaborator A contribution"
      )}. Collaborator B shall contribute: ${v(form.collab2_contribution, "collaborator B contribution")}.`,
    },
    {
      heading: "3. OWNERSHIP.",
      body: `The Collaborators shall jointly own all right, title, and interest in and to the Project in the following shares: Collaborator A — ${v(
        form.collab1_share,
        "collaborator A share"
      )}; Collaborator B — ${v(form.collab2_share, "collaborator B share")}.`,
    },
    {
      heading: "4. DECISION-MAKING.",
      body: form.decision_making.trim() || "[decision-making terms]",
    },
    {
      heading: "5. CREDIT.",
      body: form.credit.trim() || "[credit terms]",
    },
    {
      heading: "6. REVENUE AND EXPENSES.",
      body: `Net revenues and expenses of the Project shall be shared ${v(
        form.revenue_split,
        "revenue split"
      )}.`,
    },
    {
      heading: "7. WITHDRAWAL AND SEPARATION.",
      body: form.separation.trim() || "[withdrawal and separation terms]",
    },
    {
      heading: "8. WARRANTIES.",
      body: "Each Collaborator warrants that their contributions are original, do not infringe upon the rights of any third party, and that they have the full right and authority to enter into this Agreement.",
    },
    {
      heading: "9. ASSIGNMENT.",
      body: "Neither Collaborator may assign their interest in the Project without the other's written consent, except to a jointly-owned production entity.",
    },
    {
      heading: "10. GOVERNING LAW.",
      body: `This Agreement shall be governed by and construed in accordance with the laws of ${v(
        form.governing_law,
        "governing law"
      )}.`,
    },
    {
      heading: "11. ENTIRE AGREEMENT.",
      body: "This Agreement constitutes the entire agreement between the parties and supersedes all prior understandings.",
    },
  ];

  const closing = "IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.";
  const collab1Line = `COLLABORATOR A: ______________________   ${v(form.collab1_name, "collaborator A name")}`;
  const collab2Line = `COLLABORATOR B: ______________________   ${v(form.collab2_name, "collaborator B name")}`;

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

    write("COLLABORATION AGREEMENT", 16, "bold", "center");
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
    write(collab1Line);
    y += 8;
    write(collab2Line);
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeTitle = (form.project_title || "Collaboration_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Collaboration_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Collaboration Agreement</h1>
          <p className="text-muted-foreground">
            Define ownership, roles, and credit between creative partners and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Co-writers or creative partners developing a project together.</li>
                <li>Directors, writers, and producers teaming up on a shared work.</li>
                <li>Anyone splitting ownership and credit on a joint project.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Sets each collaborator's ownership share, role, and credit.</li>
                <li>Defines how decisions are made and revenue is split.</li>
                <li>Spells out what happens if someone leaves.</li>
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
                  <Label htmlFor="collab1_name">Collaborator A — Name</Label>
                  <Input
                    id="collab1_name"
                    value={form.collab1_name}
                    onChange={(e) => set("collab1_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="collab1_address">Collaborator A Address</Label>
                  <Input
                    id="collab1_address"
                    value={form.collab1_address}
                    onChange={(e) => set("collab1_address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="collab2_name">Collaborator B — Name</Label>
                  <Input
                    id="collab2_name"
                    value={form.collab2_name}
                    onChange={(e) => set("collab2_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="collab2_address">Collaborator B Address</Label>
                  <Input
                    id="collab2_address"
                    value={form.collab2_address}
                    onChange={(e) => set("collab2_address", e.target.value)}
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
                  <Label htmlFor="project_type">Project Type</Label>
                  <Select
                    value={form.project_type}
                    onValueChange={(val) => set("project_type", val)}
                  >
                    <SelectTrigger id="project_type">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
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
                <CardTitle>Contributions &amp; Roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="collab1_contribution">Collaborator A Contribution</Label>
                  <Textarea
                    id="collab1_contribution"
                    rows={3}
                    value={form.collab1_contribution}
                    onChange={(e) => set("collab1_contribution", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.collab1_contribution.trim() || legalizing === "collab1_contribution"}
                    onClick={() => legalize("collab1_contribution", "Collaborator A Contribution")}
                  >
                    {legalizing === "collab1_contribution" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
                </div>
                <div>
                  <Label htmlFor="collab2_contribution">Collaborator B Contribution</Label>
                  <Textarea
                    id="collab2_contribution"
                    rows={3}
                    value={form.collab2_contribution}
                    onChange={(e) => set("collab2_contribution", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.collab2_contribution.trim() || legalizing === "collab2_contribution"}
                    onClick={() => legalize("collab2_contribution", "Collaborator B Contribution")}
                  >
                    {legalizing === "collab2_contribution" ? (
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
                    <Label htmlFor="collab1_share">Collaborator A Share</Label>
                    <Input
                      id="collab1_share"
                      value={form.collab1_share}
                      onChange={(e) => set("collab1_share", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="collab2_share">Collaborator B Share</Label>
                    <Input
                      id="collab2_share"
                      value={form.collab2_share}
                      onChange={(e) => set("collab2_share", e.target.value)}
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
                  <Label htmlFor="decision_making">Decision-Making</Label>
                  <Textarea
                    id="decision_making"
                    rows={3}
                    value={form.decision_making}
                    onChange={(e) => set("decision_making", e.target.value)}
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
                <div>
                  <Label htmlFor="revenue_split">Revenue and Expenses</Label>
                  <Input
                    id="revenue_split"
                    value={form.revenue_split}
                    onChange={(e) => set("revenue_split", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="separation">Withdrawal and Separation</Label>
                  <Textarea
                    id="separation"
                    rows={3}
                    value={form.separation}
                    onChange={(e) => set("separation", e.target.value)}
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
                    COLLABORATION AGREEMENT
                  </h2>
                  <p>{intro}</p>
                  {clauses.map((c) => (
                    <p key={c.heading}>
                      <span className="font-semibold">{c.heading}</span> {c.body}
                    </p>
                  ))}
                  <p>{closing}</p>
                  <p className="whitespace-pre-line pt-4">{collab1Line}</p>
                  <p className="whitespace-pre-line">{collab2Line}</p>
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

export default CollaborationAgreement;
