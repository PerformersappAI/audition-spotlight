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

interface DeferredCompensationForm {
  effective_date: string;
  company_name: string;
  company_address: string;
  recipient_name: string;
  recipient_address: string;
  role: string;
  project_title: string;
  deferred_amount: string;
  payment_trigger: string;
  priority_position: string;
  governing_law: string;
}

const INITIAL_FORM: DeferredCompensationForm = {
  effective_date: "",
  company_name: "",
  company_address: "",
  recipient_name: "",
  recipient_address: "",
  role: "",
  project_title: "",
  deferred_amount: "",
  payment_trigger:
    "from first available Net Proceeds of the Project, in the priority set forth in the Project's recoupment/waterfall schedule",
  priority_position: "after recoupment of financing and investor capital, and before net profit participation",
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

const DeferredCompensationAgreement = () => {
  const [form, setForm] = useState<DeferredCompensationForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof DeferredCompensationForm>(key: K, value: DeferredCompensationForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<"payment_trigger" | null>(null);

  const legalize = async (field: "payment_trigger", context: string) => {
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

  const intro = `This Deferred Compensation Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.company_name, "company name")}, located at ${v(
    form.company_address,
    "company address"
  )} ("Company"), and ${v(form.recipient_name, "recipient name")}, located at ${v(
    form.recipient_address,
    "recipient address"
  )} ("Recipient").`;

  const clauses: Clause[] = [
    {
      heading: "1. SERVICES.",
      body: `Recipient is rendering services as ${v(form.role, "role")} on the motion picture tentatively titled "${v(
        form.project_title,
        "project title"
      )}" (the "Project").`,
    },
    {
      heading: "2. DEFERRED COMPENSATION.",
      body: `Recipient agrees to defer compensation in the amount of ${v(
        form.deferred_amount,
        "deferred amount"
      )} (the "Deferred Compensation"), which shall become payable only as set forth below.`,
    },
    {
      heading: "3. PAYMENT.",
      body: `The Deferred Compensation shall be paid ${v(form.payment_trigger, "payment trigger")}.`,
    },
    {
      heading: "4. PRIORITY.",
      body: `The Deferred Compensation shall be paid ${v(form.priority_position, "priority position")}.`,
    },
    {
      heading: "5. NO GUARANTEE.",
      body: "Recipient acknowledges that the Deferred Compensation is payable solely from Net Proceeds, is not guaranteed, and may never be paid if the Project does not generate sufficient revenue.",
    },
    {
      heading: "6. NO INTEREST.",
      body: "The Deferred Compensation shall not accrue interest unless otherwise agreed in writing.",
    },
    {
      heading: "7. GOVERNING LAW.",
      body: `This Agreement shall be governed by and construed in accordance with the laws of ${v(
        form.governing_law,
        "governing law"
      )}.`,
    },
    {
      heading: "8. ENTIRE AGREEMENT.",
      body: "This Agreement constitutes the entire agreement between the parties and supersedes all prior understandings.",
    },
  ];

  const closing = "IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.";
  const companyLine = `COMPANY: ____________________________   ${v(form.company_name, "company name")}`;
  const recipientLine = `RECIPIENT: ___________________________   ${v(form.recipient_name, "recipient name")}`;

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 22;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const ensure = (h = 8) => {
      if (y + h > pageHeight - margin - 12) {
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

    write("DEFERRED COMPENSATION AGREEMENT", 16, "bold", "center");
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
    write(recipientLine);
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("times", "italic");
      doc.setTextColor(120, 120, 120);
      doc.text(
        "Filmmaker Genius — Document Library. Template only; not legal advice.",
        pageWidth / 2,
        pageHeight - margin + 6,
        { align: "center" }
      );
      doc.setTextColor(0, 0, 0);
    }

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeTitle = (form.project_title || "Deferred_Compensation_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Deferred_Compensation_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Deferred Compensation Agreement</h1>
          <p className="text-muted-foreground">
            Defer a cast or crew fee to be paid from revenue, and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It&apos;s For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers deferring cast or crew fees to help fund a film.</li>
                <li>Cast and crew agreeing to be paid later from revenue.</li>
                <li>Anyone documenting deferred pay on a project.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It&apos;s For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Records a fee that&apos;s deferred and paid from revenue.</li>
                <li>Sets when and in what priority it gets paid.</li>
                <li>Makes clear the deferral is not guaranteed.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Deferred compensation may implicate wage-and-hour, union, and tax
            rules. Consult a qualified entertainment or employment attorney before using this document.
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
                  <Label htmlFor="recipient_name">Recipient (cast/crew)</Label>
                  <Input
                    id="recipient_name"
                    value={form.recipient_name}
                    onChange={(e) => set("recipient_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recipient_address">Recipient Address</Label>
                  <Input
                    id="recipient_address"
                    value={form.recipient_address}
                    onChange={(e) => set("recipient_address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deferral Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="role">Role / Position</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Director of Photography"
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                  />
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
                  <Label htmlFor="deferred_amount">Deferred Amount</Label>
                  <Input
                    id="deferred_amount"
                    placeholder="$5,000"
                    value={form.deferred_amount}
                    onChange={(e) => set("deferred_amount", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_trigger">Payment Trigger</Label>
                  <Textarea
                    id="payment_trigger"
                    rows={3}
                    value={form.payment_trigger}
                    onChange={(e) => set("payment_trigger", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.payment_trigger.trim() || legalizing === "payment_trigger"}
                    onClick={() => legalize("payment_trigger", "Payment Trigger")}
                  >
                    {legalizing === "payment_trigger" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
                </div>
                <div>
                  <Label htmlFor="priority_position">Priority</Label>
                  <Input
                    id="priority_position"
                    value={form.priority_position}
                    onChange={(e) => set("priority_position", e.target.value)}
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

            <div className="flex gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="ghost" onClick={() => setForm(INITIAL_FORM)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* RIGHT: live preview */}
          <div className="space-y-6">
            <Card className="bg-muted/30 border-border">
              <CardHeader>
                <CardTitle className="text-center">DEFERRED COMPENSATION AGREEMENT</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 font-serif text-foreground leading-relaxed">
                <p>{intro}</p>
                {clauses.map((c, i) => (
                  <p key={i}>
                    <span className="font-semibold">{c.heading}</span> {c.body}
                  </p>
                ))}
                <div className="whitespace-pre-line">{`${closing}\n\n${companyLine}\n\n${recipientLine}`}</div>
                <p className="text-xs italic text-muted-foreground">{DISCLAIMER}</p>
                <p className="text-xs italic text-muted-foreground text-center">
                  Filmmaker Genius — Document Library. Template only; not legal advice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeferredCompensationAgreement;
