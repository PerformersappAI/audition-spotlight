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

interface FinancingTermSheetForm {
  effective_date: string;
  company_name: string;
  financier_name: string;
  project_title: string;
  financing_amount: string;
  financing_type: string;
  return_terms: string;
  recoupment_position: string;
  security: string;
  term: string;
  conditions: string;
  binding: boolean;
  governing_law: string;
}

const INITIAL_FORM: FinancingTermSheetForm = {
  effective_date: "",
  company_name: "",
  financier_name: "",
  project_title: "",
  financing_amount: "",
  financing_type: "Equity Investment",
  return_terms: "",
  recoupment_position: "First position, senior to all other financing",
  security: "Secured by a lien on the copyright, physical elements, and receivables of the Project",
  term: "Repayable from first Net Proceeds, no later than 24 months following delivery",
  conditions:
    "Subject to E&O insurance, a completion guarantee, executed chain of title, and definitive financing documents.",
  binding: false,
  governing_law: "the State of California",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Consult a securities or entertainment attorney before using this document.";

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

const FINANCING_TYPES = [
  "Equity Investment",
  "Loan / Debt",
  "Gap Financing",
  "Pre-Sale / Minimum Guarantee",
  "Grant",
];

const FinancingTermSheet = () => {
  const [form, setForm] = useState<FinancingTermSheetForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof FinancingTermSheetForm>(key: K, value: FinancingTermSheetForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<"return_terms" | "conditions" | null>(null);

  const legalize = async (field: "return_terms" | "conditions", context: string) => {
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

  const intro = `This Financing Term Sheet ("Term Sheet") summarizes the proposed terms of financing as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} between ${v(form.company_name, "company name")} (the "Company") and ${v(
    form.financier_name,
    "financier name"
  )} (the "Financier"), for the motion picture tentatively titled "${v(
    form.project_title,
    "project title"
  )}" (the "Project").`;

  const bindingClause = form.binding
    ? "This Term Sheet is binding upon the parties."
    : "This Term Sheet is a non-binding summary of the proposed terms and does not constitute a commitment to fund. It is intended solely as a basis for negotiating definitive agreements, except that any provisions regarding confidentiality and exclusivity shall be binding.";

  const clauses: Clause[] = [
    {
      heading: "1. FINANCING AMOUNT.",
      body: v(form.financing_amount, "financing amount"),
    },
    {
      heading: "2. FINANCING TYPE.",
      body: v(form.financing_type, "financing type"),
    },
    {
      heading: "3. RETURN / INTEREST.",
      body: v(form.return_terms, "return / interest terms"),
    },
    {
      heading: "4. RECOUPMENT POSITION.",
      body: v(form.recoupment_position, "recoupment position"),
    },
    {
      heading: "5. SECURITY.",
      body: v(form.security, "security description"),
    },
    {
      heading: "6. TERM / REPAYMENT.",
      body: v(form.term, "term / repayment"),
    },
    {
      heading: "7. CONDITIONS PRECEDENT.",
      body: v(form.conditions, "conditions precedent"),
    },
    {
      heading: "8. BINDING EFFECT.",
      body: bindingClause,
    },
    {
      heading: "9. GOVERNING LAW.",
      body: `This Term Sheet shall be governed by and construed in accordance with the laws of ${v(
        form.governing_law,
        "governing law"
      )}.`,
    },
  ];

  const closing = "ACKNOWLEDGED AND AGREED as of the Effective Date.";
  const companyLine = `COMPANY: ____________________________   ${v(form.company_name, "company name")}`;
  const financierLine = `FINANCIER: ___________________________   ${v(form.financier_name, "financier name")}`;

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

    write("FINANCING TERM SHEET", 16, "bold", "center");
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
    write(companyLine);
    y += 8;
    write(financierLine);
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeTitle = (form.project_title || "Financing_Term_Sheet").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Financing_Term_Sheet.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Financing Term Sheet</h1>
          <p className="text-muted-foreground">
            Summarize the key terms of a film financing deal and generate a ready-to-review term sheet.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Filmmakers negotiating financing with an investor or lender.</li>
                <li>Financiers outlining proposed deal terms.</li>
                <li>Anyone summarizing a film financing deal before full contracts.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Summarizes the key financing terms on one page.</li>
                <li>Sets amount, type, return, recoupment, and security.</li>
                <li>Serves as the basis for the definitive agreements (usually non-binding).</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Financing term sheets may lead to regulated securities offerings or
            binding commitments. Consult a securities or entertainment attorney before using this document.
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
                  <Label htmlFor="company_name">Production Company</Label>
                  <Input
                    id="company_name"
                    value={form.company_name}
                    onChange={(e) => set("company_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="financier_name">Financier / Investor</Label>
                  <Input
                    id="financier_name"
                    value={form.financier_name}
                    onChange={(e) => set("financier_name", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project & Amount</CardTitle>
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
                  <Label htmlFor="financing_amount">Financing Amount</Label>
                  <Input
                    id="financing_amount"
                    placeholder="$250,000"
                    value={form.financing_amount}
                    onChange={(e) => set("financing_amount", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="financing_type">Financing Type</Label>
                  <Select value={form.financing_type} onValueChange={(val) => set("financing_type", val)}>
                    <SelectTrigger id="financing_type">
                      <SelectValue placeholder="Select financing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FINANCING_TYPES.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="return_terms">Return / Interest Terms</Label>
                  <Textarea
                    id="return_terms"
                    rows={3}
                    placeholder="e.g., 20% preferred return, or 8% interest per annum"
                    value={form.return_terms}
                    onChange={(e) => set("return_terms", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.return_terms.trim() || legalizing === "return_terms"}
                    onClick={() => legalize("return_terms", "Return / Interest Terms")}
                  >
                    {legalizing === "return_terms" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
                </div>
                <div>
                  <Label htmlFor="recoupment_position">Recoupment Position</Label>
                  <Input
                    id="recoupment_position"
                    value={form.recoupment_position}
                    onChange={(e) => set("recoupment_position", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="security">Security</Label>
                  <Input
                    id="security"
                    value={form.security}
                    onChange={(e) => set("security", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="term">Term / Repayment</Label>
                  <Input
                    id="term"
                    value={form.term}
                    onChange={(e) => set("term", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="conditions">Conditions Precedent</Label>
                  <Textarea
                    id="conditions"
                    rows={3}
                    value={form.conditions}
                    onChange={(e) => set("conditions", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.conditions.trim() || legalizing === "conditions"}
                    onClick={() => legalize("conditions", "Conditions Precedent")}
                  >
                    {legalizing === "conditions" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="binding"
                    checked={form.binding}
                    onCheckedChange={(checked) => set("binding", checked === true)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="binding">Make this Term Sheet binding</Label>
                    <p className="text-xs text-muted-foreground">
                      Leave unchecked for a standard non-binding term sheet.
                    </p>
                  </div>
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
                  <h2 className="text-center font-bold tracking-wide text-base">FINANCING TERM SHEET</h2>
                  <p>{intro}</p>
                  {clauses.map((c) => (
                    <p key={c.heading}>
                      <span className="font-semibold">{c.heading}</span> {c.body}
                    </p>
                  ))}
                  <p>{closing}</p>
                  <p className="whitespace-pre-line pt-4">{companyLine}</p>
                  <p className="whitespace-pre-line">{financierLine}</p>
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

export default FinancingTermSheet;
