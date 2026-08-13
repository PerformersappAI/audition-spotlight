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
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Download, Loader2, Printer, RotateCcw, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface NonDisclosureForm {
  effective_date: string;
  party1_name: string;
  party1_address: string;
  party2_name: string;
  party2_address: string;
  mutual: boolean;
  purpose: string;
  term_years: string;
  governing_law: string;
}

const INITIAL_FORM: NonDisclosureForm = {
  effective_date: "",
  party1_name: "",
  party1_address: "",
  party2_name: "",
  party2_address: "",
  mutual: true,
  purpose: "",
  term_years: "3",
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

const NonDisclosureAgreement = () => {
  const [form, setForm] = useState<NonDisclosureForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof NonDisclosureForm>(key: K, value: NonDisclosureForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<"purpose" | null>(null);

  const legalize = async (field: "purpose", context: string) => {
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

  const intro = `This Non-Disclosure Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.party1_name, "party A / disclosing party")}, located at ${v(
    form.party1_address,
    "party A address"
  )} ("Disclosing Party"), and ${v(form.party2_name, "party B / receiving party")}, located at ${v(
    form.party2_address,
    "party B address"
  )} ("Receiving Party").${
    form.mutual
      ? " Each party may act as a Disclosing Party or a Receiving Party, and the obligations herein apply mutually."
      : ""
  }`;

  const clauses: Clause[] = [
    {
      heading: "1. PURPOSE.",
      body: `The parties wish to explore ${v(form.purpose, "purpose")} (the "Purpose"), in connection with which Confidential Information may be disclosed.`,
    },
    {
      heading: "2. CONFIDENTIAL INFORMATION.",
      body: '"Confidential Information" means any non-public information disclosed by one party to the other, including scripts, treatments, story ideas, budgets, business plans, financial information, and any other information marked or reasonably understood to be confidential.',
    },
    {
      heading: "3. OBLIGATIONS.",
      body: "The Receiving Party shall (a) keep the Confidential Information strictly confidential, (b) use it solely for the Purpose, and (c) not disclose it to any third party without the Disclosing Party's prior written consent.",
    },
    {
      heading: "4. EXCLUSIONS.",
      body: "Confidential Information does not include information that is or becomes publicly available through no fault of the Receiving Party, was already known to the Receiving Party, is independently developed, or is rightfully obtained from a third party.",
    },
    {
      heading: "5. TERM.",
      body: `The obligations of confidentiality shall survive for ${v(
        form.term_years,
        "term years"
      )} years from the date of disclosure.`,
    },
    {
      heading: "6. NO LICENSE.",
      body: "Nothing in this Agreement grants the Receiving Party any rights in the Confidential Information other than as expressly set forth herein.",
    },
    {
      heading: "7. RETURN OF MATERIALS.",
      body: "Upon written request, the Receiving Party shall promptly return or destroy all Confidential Information in its possession.",
    },
    {
      heading: "8. GOVERNING LAW.",
      body: `This Agreement shall be governed by and construed in accordance with the laws of ${v(
        form.governing_law,
        "governing law"
      )}.`,
    },
    {
      heading: "9. ENTIRE AGREEMENT.",
      body: "This Agreement constitutes the entire agreement between the parties and supersedes all prior understandings.",
    },
  ];

  const closing = "IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.";
  const party1Line = `DISCLOSING PARTY: ___________________   ${v(form.party1_name, "party A / disclosing party")}`;
  const party2Line = `RECEIVING PARTY: ____________________   ${v(form.party2_name, "party B / receiving party")}`;

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

    write("NON-DISCLOSURE AGREEMENT", 16, "bold", "center");
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
    const safeTitle = (form.party1_name || "NDA").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Non_Disclosure_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Non-Disclosure Agreement</h1>
          <p className="text-muted-foreground">
            Protect confidential project information and generate a ready-to-review NDA.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers sharing a script, budget, or plan in confidence.</li>
                <li>Writers protecting an idea before pitching it.</li>
                <li>Anyone exchanging sensitive project information.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Keeps shared project information confidential.</li>
                <li>Limits use to the agreed purpose only.</li>
                <li>Sets how long the confidentiality lasts.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. It is a starting point only. Have an entertainment attorney review
            any agreement before signing.
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
                  <Label htmlFor="party1_name">Party A / Disclosing Party</Label>
                  <Input
                    id="party1_name"
                    value={form.party1_name}
                    onChange={(e) => set("party1_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="party1_address">Party A Address</Label>
                  <Input
                    id="party1_address"
                    value={form.party1_address}
                    onChange={(e) => set("party1_address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="party2_name">Party B / Receiving Party</Label>
                  <Input
                    id="party2_name"
                    value={form.party2_name}
                    onChange={(e) => set("party2_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="party2_address">Party B Address</Label>
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
                <CardTitle>Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="mutual"
                    checked={form.mutual}
                    onCheckedChange={(checked) => set("mutual", checked === true)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="mutual">Mutual NDA (both parties disclose)</Label>
                    <p className="text-xs text-muted-foreground">
                      When checked, both parties are bound to protect each other's information.
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    rows={3}
                    placeholder="e.g., discussing a potential collaboration on the film 'Title'"
                    value={form.purpose}
                    onChange={(e) => set("purpose", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.purpose.trim() || legalizing === "purpose"}
                    onClick={() => legalize("purpose", "Purpose")}
                  >
                    {legalizing === "purpose" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
                </div>
                <div>
                  <Label htmlFor="term_years">Confidentiality Term (years)</Label>
                  <Input
                    id="term_years"
                    value={form.term_years}
                    onChange={(e) => set("term_years", e.target.value)}
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
                  The jurisdiction whose laws govern this agreement — usually where your company is formed (e.g.,
                  California, New York, Delaware). Not where you film.
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
                  <h2 className="text-center font-bold tracking-wide text-base">NON-DISCLOSURE AGREEMENT</h2>
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

export default NonDisclosureAgreement;
