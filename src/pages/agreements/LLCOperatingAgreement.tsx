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

interface LLCOperatingAgreementForm {
  effective_date: string;
  company_name: string;
  principal_address: string;
  purpose: string;
  member1_name: string;
  member1_contribution: string;
  member1_share: string;
  member2_name: string;
  member2_contribution: string;
  member2_share: string;
  management: string;
  manager_name: string;
  distributions: string;
  governing_law: string;
}

const INITIAL_FORM: LLCOperatingAgreementForm = {
  effective_date: "",
  company_name: "",
  principal_address: "",
  purpose: "to develop, produce, finance, and exploit one or more motion picture and audiovisual productions",
  member1_name: "",
  member1_contribution: "",
  member1_share: "50%",
  member2_name: "",
  member2_contribution: "",
  member2_share: "50%",
  management: "Member-Managed",
  manager_name: "",
  distributions: "Net profits and losses shall be allocated and distributed to the Members in proportion to their respective ownership percentages.",
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

const MANAGEMENT_OPTIONS = ["Member-Managed", "Manager-Managed"];

const LLCOperatingAgreement = () => {
  const [form, setForm] = useState<LLCOperatingAgreementForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof LLCOperatingAgreementForm>(key: K, value: LLCOperatingAgreementForm[K]) =>
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

  const hasMember2 = form.member2_name.trim().length > 0;

  const intro = `This Operating Agreement ("Agreement") of ${v(
    form.company_name,
    "company name"
  )}, a limited liability company (the "Company"), is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by the Member(s) identified below.`;

  const managementClause =
    form.management === "Manager-Managed"
      ? `The Company shall be Manager-Managed. The business and affairs of the Company shall be managed by the Manager, ${v(
          form.manager_name,
          "manager name"
        )}.`
      : `The Company shall be Member-Managed. The Members shall manage the business and affairs of the Company, and major decisions shall require the approval of Members holding a majority of the ownership interests.`;

  const membersBody = `The Members and their initial capital contributions and ownership percentages are: ${v(
    form.member1_name,
    "Member 1 name"
  )} — contribution: ${v(form.member1_contribution, "Member 1 contribution")}, ownership: ${v(
    form.member1_share,
    "Member 1 ownership %"
  )}${
    hasMember2
      ? `; ${v(form.member2_name, "Member 2 name")} — contribution: ${v(
          form.member2_contribution,
          "Member 2 contribution"
        )}, ownership: ${v(form.member2_share, "Member 2 ownership %")}`
      : ""
  }.`;

  const clauses: Clause[] = [
    {
      heading: "1. FORMATION.",
      body: `The Company was formed as a limited liability company under the laws of ${v(
        form.governing_law,
        "governing law"
      )}. Its principal place of business is ${v(form.principal_address, "principal address")}.`,
    },
    {
      heading: "2. PURPOSE.",
      body: `The purpose of the Company is ${v(form.purpose, "company purpose")}.`,
    },
    {
      heading: "3. MEMBERS AND CAPITAL CONTRIBUTIONS.",
      body: membersBody,
    },
    {
      heading: "4. MANAGEMENT.",
      body: managementClause,
    },
    {
      heading: "5. DISTRIBUTIONS AND ALLOCATIONS.",
      body: v(form.distributions, "distribution terms"),
    },
    {
      heading: "6. LIABILITY.",
      body: "No Member shall be personally liable for the debts or obligations of the Company beyond their capital contribution, except as required by law.",
    },
    {
      heading: "7. TRANSFER OF INTERESTS.",
      body: "No Member may transfer their interest without the written consent of the other Member(s), except as permitted herein.",
    },
    {
      heading: "8. DISSOLUTION.",
      body: "The Company shall dissolve upon the written agreement of the Members or as required by law; upon dissolution, assets shall be distributed in accordance with the Members' ownership percentages after payment of the Company's liabilities.",
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
      body: "This Agreement constitutes the entire agreement among the Members and supersedes all prior understandings.",
    },
  ];

  const closing = "IN WITNESS WHEREOF, the Member(s) have executed this Agreement as of the Effective Date.";
  const member1Line = `MEMBER 1: ____________________________   ${v(form.member1_name, "Member 1 name")}`;
  const member2Line = hasMember2
    ? `MEMBER 2: ____________________________   ${v(form.member2_name, "Member 2 name")}`
    : "";

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

    write("OPERATING AGREEMENT", 16, "bold", "center");
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
    write(member1Line);
    if (hasMember2) {
      y += 8;
      write(member2Line);
    }
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeTitle = (form.company_name || "LLC_Operating_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_LLC_Operating_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">LLC Operating Agreement</h1>
          <p className="text-muted-foreground">
            Set up ownership and management of your production company and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Filmmakers forming an LLC to produce a film.</li>
                <li>Partners setting up a production company together.</li>
                <li>Anyone defining ownership and control of a film entity.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Sets up who owns and runs the production company.</li>
                <li>Defines contributions, ownership percentages, and profit splits.</li>
                <li>Limits members' personal liability.</li>
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
                <CardTitle>Company</CardTitle>
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
                  <Label htmlFor="company_name">Company Name (the LLC)</Label>
                  <Input
                    id="company_name"
                    value={form.company_name}
                    onChange={(e) => set("company_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="principal_address">Principal Address</Label>
                  <Input
                    id="principal_address"
                    value={form.principal_address}
                    onChange={(e) => set("principal_address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Company Purpose</Label>
                  <Textarea
                    id="purpose"
                    rows={3}
                    value={form.purpose}
                    onChange={(e) => set("purpose", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.purpose.trim() || legalizing === "purpose"}
                    onClick={() => legalize("purpose", "Company Purpose")}
                  >
                    {legalizing === "purpose" ? (
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
                <CardTitle>Members & Contributions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="member1_name">Member 1 — Name</Label>
                  <Input
                    id="member1_name"
                    value={form.member1_name}
                    onChange={(e) => set("member1_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="member1_contribution">Member 1 — Capital Contribution</Label>
                  <Input
                    id="member1_contribution"
                    placeholder="$10,000 / services"
                    value={form.member1_contribution}
                    onChange={(e) => set("member1_contribution", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="member1_share">Member 1 — Ownership %</Label>
                  <Input
                    id="member1_share"
                    value={form.member1_share}
                    onChange={(e) => set("member1_share", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="member2_name">Member 2 — Name (optional)</Label>
                  <Input
                    id="member2_name"
                    value={form.member2_name}
                    onChange={(e) => set("member2_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="member2_contribution">Member 2 — Capital Contribution</Label>
                  <Input
                    id="member2_contribution"
                    value={form.member2_contribution}
                    onChange={(e) => set("member2_contribution", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="member2_share">Member 2 — Ownership %</Label>
                  <Input
                    id="member2_share"
                    value={form.member2_share}
                    onChange={(e) => set("member2_share", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="management">Management Structure</Label>
                  <Select value={form.management} onValueChange={(val) => set("management", val)}>
                    <SelectTrigger id="management">
                      <SelectValue placeholder="Select management structure" />
                    </SelectTrigger>
                    <SelectContent>
                      {MANAGEMENT_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {form.management === "Manager-Managed" && (
                  <div>
                    <Label htmlFor="manager_name">Manager Name (if Manager-Managed)</Label>
                    <Input
                      id="manager_name"
                      value={form.manager_name}
                      onChange={(e) => set("manager_name", e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distributions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="distributions">Distributions and Allocations</Label>
                  <Textarea
                    id="distributions"
                    rows={3}
                    value={form.distributions}
                    onChange={(e) => set("distributions", e.target.value)}
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
                  <Label htmlFor="governing_law_select">State of Formation / Governing Law</Label>
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
                  <h2 className="text-center font-bold tracking-wide text-base">OPERATING AGREEMENT</h2>
                  <p>{intro}</p>
                  {clauses.map((c) => (
                    <p key={c.heading}>
                      <span className="font-semibold">{c.heading}</span> {c.body}
                    </p>
                  ))}
                  <p>{closing}</p>
                  <p className="whitespace-pre-line pt-4">{member1Line}</p>
                  {hasMember2 && <p className="whitespace-pre-line">{member2Line}</p>}
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

export default LLCOperatingAgreement;
