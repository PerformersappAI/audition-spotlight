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

interface RightsAssignmentForm {
  effective_date: string;
  assignor_name: string;
  assignor_address: string;
  assignee_name: string;
  assignee_address: string;
  property_type: string;
  property_title: string;
  property_description: string;
  consideration: string;
  rights_assigned: string;
  governing_law: string;
}

const INITIAL_FORM: RightsAssignmentForm = {
  effective_date: "",
  assignor_name: "",
  assignor_address: "",
  assignee_name: "",
  assignee_address: "",
  property_type: "Screenplay",
  property_title: "",
  property_description: "",
  consideration: "$1.00 and other good and valuable consideration",
  rights_assigned:
    "all right, title, and interest, including all copyright and all motion picture, television, streaming, and allied, ancillary, and subsidiary rights",
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

const PROPERTY_TYPES = ["Screenplay", "Treatment", "Story", "Book/Novel", "Article", "Format/Concept"];

const RightsAssignmentAgreement = () => {
  const [form, setForm] = useState<RightsAssignmentForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof RightsAssignmentForm>(key: K, value: RightsAssignmentForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<"property_description" | null>(null);

  const legalize = async (field: "property_description", context: string) => {
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

  const intro = `This Rights Assignment Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.assignor_name, "assignor name")}, located at ${v(
    form.assignor_address,
    "assignor address"
  )} ("Assignor"), and ${v(form.assignee_name, "assignee name")}, located at ${v(
    form.assignee_address,
    "assignee address"
  )} ("Assignee").`;

  const clauses: Clause[] = [
    {
      heading: "1. THE PROPERTY.",
      body: `Assignor is the owner of the ${v(
        form.property_type,
        "property type"
      )} titled "${v(form.property_title, "property title")}" (the "Property"), described as: ${v(
        form.property_description,
        "property description"
      )}.`,
    },
    {
      heading: "2. ASSIGNMENT.",
      body: `In consideration of ${v(
        form.consideration,
        "consideration"
      )}, the receipt and sufficiency of which is hereby acknowledged, Assignor irrevocably assigns and transfers to Assignee, throughout the universe and in perpetuity, ${v(
        form.rights_assigned,
        "rights assigned"
      )} in and to the Property.`,
    },
    {
      heading: "3. FURTHER ASSURANCES.",
      body: "Assignor agrees to execute any further documents reasonably necessary to effectuate and confirm this assignment.",
    },
    {
      heading: "4. WARRANTIES.",
      body: "Assignor warrants that Assignor is the sole owner of the Property, has the full right and authority to assign it, and that the Property does not infringe upon the rights of any third party.",
    },
    {
      heading: "5. GOVERNING LAW.",
      body: `This Agreement shall be governed by and construed in accordance with the laws of ${v(
        form.governing_law,
        "governing law"
      )}.`,
    },
    {
      heading: "6. ENTIRE AGREEMENT.",
      body: "This Agreement constitutes the entire agreement between the parties and supersedes all prior understandings.",
    },
  ];

  const closing = "IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.";
  const assignorLine = `ASSIGNOR: ____________________________   ${v(form.assignor_name, "assignor name")}`;
  const assigneeLine = `ASSIGNEE: ____________________________   ${v(form.assignee_name, "assignee name")}`;

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

    write("RIGHTS ASSIGNMENT AGREEMENT", 16, "bold", "center");
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
    write(assignorLine);
    y += 8;
    write(assigneeLine);
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeTitle = (form.property_title || "Rights_Assignment_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Rights_Assignment_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Rights Assignment Agreement</h1>
          <p className="text-muted-foreground">
            Transfer ownership of a work from one party to another and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Owners transferring their rights in a work to a company.</li>
                <li>Producers consolidating rights into their production entity.</li>
                <li>Anyone finalizing a transfer of copyright or screen rights.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Transfers full ownership of a work from one party to another.</li>
                <li>Confirms consideration and clean title.</li>
                <li>Strengthens your chain of title for financing and distribution.</li>
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
                  <Label htmlFor="assignor_name">Assignor (current owner)</Label>
                  <Input
                    id="assignor_name"
                    value={form.assignor_name}
                    onChange={(e) => set("assignor_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="assignor_address">Assignor Address</Label>
                  <Input
                    id="assignor_address"
                    value={form.assignor_address}
                    onChange={(e) => set("assignor_address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="assignee_name">Assignee (receiving party)</Label>
                  <Input
                    id="assignee_name"
                    value={form.assignee_name}
                    onChange={(e) => set("assignee_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="assignee_address">Assignee Address</Label>
                  <Input
                    id="assignee_address"
                    value={form.assignee_address}
                    onChange={(e) => set("assignee_address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>The Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="property_type">Property Type</Label>
                  <Select
                    value={form.property_type}
                    onValueChange={(val) => set("property_type", val)}
                  >
                    <SelectTrigger id="property_type">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="property_title">Property Title</Label>
                  <Input
                    id="property_title"
                    value={form.property_title}
                    onChange={(e) => set("property_title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="property_description">Property Description</Label>
                  <Textarea
                    id="property_description"
                    rows={3}
                    value={form.property_description}
                    onChange={(e) => set("property_description", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.property_description.trim() || legalizing === "property_description"}
                    onClick={() => legalize("property_description", "Property Description")}
                  >
                    {legalizing === "property_description" ? (
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
                <CardTitle>Assignment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="consideration">Consideration</Label>
                  <Input
                    id="consideration"
                    value={form.consideration}
                    onChange={(e) => set("consideration", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rights_assigned">Rights Assigned</Label>
                  <Textarea
                    id="rights_assigned"
                    rows={3}
                    value={form.rights_assigned}
                    onChange={(e) => set("rights_assigned", e.target.value)}
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
                    RIGHTS ASSIGNMENT AGREEMENT
                  </h2>
                  <p>{intro}</p>
                  {clauses.map((c) => (
                    <p key={c.heading}>
                      <span className="font-semibold">{c.heading}</span> {c.body}
                    </p>
                  ))}
                  <p>{closing}</p>
                  <p className="whitespace-pre-line pt-4">{assignorLine}</p>
                  <p className="whitespace-pre-line">{assigneeLine}</p>
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

export default RightsAssignmentAgreement;
