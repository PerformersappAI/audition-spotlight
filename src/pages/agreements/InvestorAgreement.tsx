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

interface InvestorAgreementForm {
  effective_date: string;
  company_name: string;
  company_address: string;
  investor_name: string;
  investor_address: string;
  project_title: string;
  investment_amount: string;
  use_of_funds: string;
  preferred_return: string;
  profit_share: string;
  recoupment: string;
  governing_law: string;
}

const INITIAL_FORM: InvestorAgreementForm = {
  effective_date: "",
  company_name: "",
  company_address: "",
  investor_name: "",
  investor_address: "",
  project_title: "",
  investment_amount: "",
  use_of_funds: "the development, production, and delivery of the Project",
  preferred_return: "20%",
  profit_share: "50%",
  recoupment:
    "The Investor shall recoup 100% of the Investment, plus the Preferred Return, from first available Net Proceeds, prior to any distribution of profits to the Company's principals.",
  governing_law: "the State of California",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Raising investment may be a regulated securities offering. Consult a securities or entertainment attorney before using this document.";

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

const InvestorAgreement = () => {
  const [form, setForm] = useState<InvestorAgreementForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof InvestorAgreementForm>(key: K, value: InvestorAgreementForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<"use_of_funds" | null>(null);

  const legalize = async (field: "use_of_funds", context: string) => {
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

  const intro = `This Investor Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.company_name, "company name")}, located at ${v(
    form.company_address,
    "company address"
  )} ("Company"), and ${v(form.investor_name, "investor name")}, located at ${v(
    form.investor_address,
    "investor address"
  )} ("Investor").`;

  const clauses: Clause[] = [
    {
      heading: "1. THE PROJECT.",
      body: `The Company is producing the motion picture tentatively titled "${v(
        form.project_title,
        "project title"
      )}" (the "Project").`,
    },
    {
      heading: "2. INVESTMENT.",
      body: `The Investor agrees to invest ${v(form.investment_amount, "investment amount")} (the "Investment") in the Project, to be used for ${v(
        form.use_of_funds,
        "use of funds"
      )}.`,
    },
    {
      heading: "3. RECOUPMENT AND RETURN.",
      body: `${v(form.recoupment, "recoupment terms")} The Investor shall be entitled to a preferred return of ${v(
        form.preferred_return,
        "preferred return %"
      )} on the Investment (the "Preferred Return").`,
    },
    {
      heading: "4. PROFIT PARTICIPATION.",
      body: `After recoupment of the Investment and payment of the Preferred Return, the Investor shall receive ${v(
        form.profit_share,
        "investor profit share %"
      )} of the Net Proceeds of the Project.`,
    },
    {
      heading: "5. NO CONTROL.",
      body: "The Investor's role is passive. The Investor shall have no right to control or participate in the creative, production, or business decisions of the Project or the Company.",
    },
    {
      heading: "6. RISK ACKNOWLEDGMENT.",
      body: "The Investor acknowledges that an investment in a motion picture is highly speculative and involves substantial risk, including the risk of losing the entire Investment. The Investor represents that they are able to bear such risk.",
    },
    {
      heading: "7. NO GUARANTEE.",
      body: "The Company makes no representation or guarantee regarding the completion, distribution, or profitability of the Project.",
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
  const companyLine = `COMPANY: ____________________________   ${v(form.company_name, "company name")}`;
  const investorLine = `INVESTOR: ____________________________   ${v(form.investor_name, "investor name")}`;

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

    write("INVESTOR AGREEMENT", 16, "bold", "center");
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
    write(investorLine);
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeTitle = (form.project_title || "Investor_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Investor_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Investor Agreement</h1>
          <p className="text-muted-foreground">
            Document a private film investment and its return, and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Filmmakers raising money from a private investor.</li>
                <li>Investors backing a specific film project.</li>
                <li>Anyone documenting a film investment and its return.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Records the investment amount and how funds are used.</li>
                <li>Sets recoupment, preferred return, and profit share.</li>
                <li>Confirms the investor is passive and understands the risk.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Raising money from investors is often regulated as a securities
            offering under federal and state law. You must consult a securities or entertainment attorney before
            offering or accepting any investment.
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
                  <Label htmlFor="company_address">Company Address</Label>
                  <Input
                    id="company_address"
                    value={form.company_address}
                    onChange={(e) => set("company_address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="investor_name">Investor Name</Label>
                  <Input
                    id="investor_name"
                    value={form.investor_name}
                    onChange={(e) => set("investor_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="investor_address">Investor Address</Label>
                  <Input
                    id="investor_address"
                    value={form.investor_address}
                    onChange={(e) => set("investor_address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment</CardTitle>
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
                  <Label htmlFor="investment_amount">Investment Amount</Label>
                  <Input
                    id="investment_amount"
                    placeholder="$50,000"
                    value={form.investment_amount}
                    onChange={(e) => set("investment_amount", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="use_of_funds">Use of Funds</Label>
                  <Textarea
                    id="use_of_funds"
                    rows={3}
                    value={form.use_of_funds}
                    onChange={(e) => set("use_of_funds", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.use_of_funds.trim() || legalizing === "use_of_funds"}
                    onClick={() => legalize("use_of_funds", "Use of Funds")}
                  >
                    {legalizing === "use_of_funds" ? (
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
                <CardTitle>Return Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferred_return">Preferred Return %</Label>
                  <Input
                    id="preferred_return"
                    value={form.preferred_return}
                    onChange={(e) => set("preferred_return", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="profit_share">Investor Profit Share %</Label>
                  <Input
                    id="profit_share"
                    value={form.profit_share}
                    onChange={(e) => set("profit_share", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recoupment">Recoupment Terms</Label>
                  <Textarea
                    id="recoupment"
                    rows={3}
                    value={form.recoupment}
                    onChange={(e) => set("recoupment", e.target.value)}
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
                  <h2 className="text-center font-bold tracking-wide text-base">INVESTOR AGREEMENT</h2>
                  <p>{intro}</p>
                  {clauses.map((c) => (
                    <p key={c.heading}>
                      <span className="font-semibold">{c.heading}</span> {c.body}
                    </p>
                  ))}
                  <p>{closing}</p>
                  <p className="whitespace-pre-line pt-4">{companyLine}</p>
                  <p className="whitespace-pre-line">{investorLine}</p>
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

export default InvestorAgreement;
