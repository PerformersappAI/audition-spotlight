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

interface ExecutiveProducerForm {
  effective_date: string;
  company_name: string;
  company_address: string;
  ep_name: string;
  ep_address: string;
  project_title: string;
  services: string;
  fee: string;
  backend: string;
  credit: string;
  exclusive: boolean;
  governing_law: string;
}

const INITIAL_FORM: ExecutiveProducerForm = {
  effective_date: "",
  company_name: "",
  company_address: "",
  ep_name: "",
  ep_address: "",
  project_title: "",
  services: "securing financing, strategic guidance, and industry introductions for the Project",
  fee: "",
  backend: "",
  credit: "Executive Producer",
  exclusive: false,
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

const ExecutiveProducerAgreement = () => {
  const [form, setForm] = useState<ExecutiveProducerForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof ExecutiveProducerForm>(key: K, value: ExecutiveProducerForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<"services" | null>(null);

  const legalize = async (field: "services", context: string) => {
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

  const intro = `This Executive Producer Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.company_name, "company name")}, located at ${v(
    form.company_address,
    "company address"
  )} ("Company"), and ${v(form.ep_name, "executive producer name")}, located at ${v(
    form.ep_address,
    "executive producer address"
  )} ("Executive Producer").`;

  const compensationBody = form.backend.trim()
    ? `Company shall pay the Executive Producer ${v(form.fee, "fee")}. In addition, the Executive Producer shall receive ${v(
        form.backend,
        "backend participation"
      )}.`
    : `Company shall pay the Executive Producer ${v(form.fee, "fee")}.`;

  const exclusivityBody = form.exclusive
    ? "The Executive Producer's services shall be exclusive to the Project."
    : "The Executive Producer's services are non-exclusive, and the Executive Producer may render services on other projects.";

  const clauses: Clause[] = [
    {
      heading: "1. ENGAGEMENT.",
      body: `Company engages the Executive Producer to render executive producing services in connection with the motion picture tentatively titled "${v(
        form.project_title,
        "project title"
      )}" (the "Project").`,
    },
    {
      heading: "2. SERVICES.",
      body: `The Executive Producer shall provide ${v(form.services, "services")}.`,
    },
    {
      heading: "3. COMPENSATION.",
      body: compensationBody,
    },
    {
      heading: "4. CREDIT.",
      body: `The Executive Producer shall receive the following credit: ${v(form.credit, "credit")}.`,
    },
    {
      heading: "5. EXCLUSIVITY.",
      body: exclusivityBody,
    },
    {
      heading: "6. NO AUTHORITY.",
      body: "The Executive Producer shall have no authority to bind the Company or incur obligations on its behalf without the Company's prior written approval.",
    },
    {
      heading: "7. INDEPENDENT CONTRACTOR.",
      body: "The Executive Producer is engaged as an independent contractor, and nothing herein creates a partnership or employment relationship.",
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
  const epLine = `EXECUTIVE PRODUCER: __________________   ${v(form.ep_name, "executive producer name")}`;

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

    write("EXECUTIVE PRODUCER AGREEMENT", 16, "bold", "center");
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
    write(epLine);
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
    const safeTitle = (form.project_title || "Executive_Producer_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Executive_Producer_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Executive Producer Agreement</h1>
          <p className="text-muted-foreground">
            Attach an executive producer and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It&apos;s For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers bringing on an executive producer.</li>
                <li>Executive producers formalizing their role and fee.</li>
                <li>Anyone attaching an EP for financing or packaging.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It&apos;s For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Defines the EP&apos;s services, fee, and credit.</li>
                <li>Sets backend participation and exclusivity.</li>
                <li>Clarifies the EP has no authority to bind the company.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. It is a starting point only. Have an entertainment attorney review any
            agreement before signing.
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
                  <Label htmlFor="ep_name">Executive Producer</Label>
                  <Input
                    id="ep_name"
                    value={form.ep_name}
                    onChange={(e) => set("ep_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ep_address">Executive Producer Address</Label>
                  <Input
                    id="ep_address"
                    value={form.ep_address}
                    onChange={(e) => set("ep_address", e.target.value)}
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
                  <Label htmlFor="project_title">Project Title</Label>
                  <Input
                    id="project_title"
                    value={form.project_title}
                    onChange={(e) => set("project_title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="services">EP Services</Label>
                  <Textarea
                    id="services"
                    rows={3}
                    value={form.services}
                    onChange={(e) => set("services", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.services.trim() || legalizing === "services"}
                    onClick={() => legalize("services", "EP Services")}
                  >
                    {legalizing === "services" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
                </div>
                <div>
                  <Label htmlFor="fee">Fee</Label>
                  <Input
                    id="fee"
                    placeholder="$25,000"
                    value={form.fee}
                    onChange={(e) => set("fee", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="backend">Backend Participation (optional)</Label>
                  <Input
                    id="backend"
                    placeholder="5% of net profits"
                    value={form.backend}
                    onChange={(e) => set("backend", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="credit">Credit</Label>
                  <Input
                    id="credit"
                    value={form.credit}
                    onChange={(e) => set("credit", e.target.value)}
                  />
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="exclusive"
                    checked={form.exclusive}
                    onCheckedChange={(checked) => set("exclusive", checked === true)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="exclusive">Exclusive engagement</Label>
                    <p className="text-xs text-muted-foreground">
                      Leave unchecked if the EP may work on other projects.
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
                  <h2 className="text-center font-bold tracking-wide text-base">EXECUTIVE PRODUCER AGREEMENT</h2>
                  <p>{intro}</p>
                  {clauses.map((c) => (
                    <p key={c.heading}>
                      <span className="font-semibold">{c.heading}</span> {c.body}
                    </p>
                  ))}
                  <p>{closing}</p>
                  <p className="whitespace-pre-line pt-4">{companyLine}</p>
                  <p className="whitespace-pre-line">{epLine}</p>
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

export default ExecutiveProducerAgreement;
