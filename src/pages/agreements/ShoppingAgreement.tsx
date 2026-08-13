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

interface ShoppingAgreementForm {
  effective_date: string;
  owner_name: string;
  owner_address: string;
  producer_name: string;
  producer_address: string;
  property_type: string;
  property_title: string;
  property_description: string;
  shopping_period: string;
  exclusivity: boolean;
  approved_buyers: string;
  producer_attachment: string;
  governing_law: string;
}

const INITIAL_FORM: ShoppingAgreementForm = {
  effective_date: "",
  owner_name: "",
  owner_address: "",
  producer_name: "",
  producer_address: "",
  property_type: "Screenplay",
  property_title: "",
  property_description: "",
  shopping_period: "12",
  exclusivity: true,
  approved_buyers: "any studio, network, streamer, financier, or distributor",
  producer_attachment:
    "If Producer sets up the Project with a buyer, Producer shall be attached as a producer of the resulting production and shall negotiate in good faith a customary producing fee and credit.",
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

const PROPERTY_TYPES = ["Screenplay", "Treatment", "Story / Concept", "Book/Novel", "Article", "Format/Concept"];

const ShoppingAgreement = () => {
  const [form, setForm] = useState<ShoppingAgreementForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof ShoppingAgreementForm>(key: K, value: ShoppingAgreementForm[K]) =>
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

  const intro = `This Shopping Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.owner_name, "owner name")}, located at ${v(
    form.owner_address,
    "owner address"
  )} ("Owner"), and ${v(form.producer_name, "producer name")}, located at ${v(
    form.producer_address,
    "producer address"
  )} ("Producer").`;

  const clauses: Clause[] = [
    {
      heading: "1. THE PROJECT.",
      body: `Owner owns the ${v(form.property_type, "property type")} titled "${v(
        form.property_title,
        "property title"
      )}" (the "Project"), described as: ${v(form.property_description, "property description")}.`,
    },
    {
      heading: "2. GRANT OF SHOPPING RIGHTS.",
      body: `Owner grants Producer the ${form.exclusivity ? "exclusive" : "non-exclusive"} right to submit, pitch, and shop the Project to potential buyers for a period of ${v(
        form.shopping_period,
        "shopping period"
      )} months from the Effective Date (the "Shopping Period"). Producer may approach the following buyers: ${v(
        form.approved_buyers,
        "approved buyers"
      )}.`,
    },
    {
      heading: "3. NO TRANSFER OF RIGHTS.",
      body: "This Agreement does not grant Producer any ownership, option, or other rights in the Project. Owner retains all right, title, and interest in and to the Project, and no compensation is payable to Owner for the Shopping Period.",
    },
    {
      heading: "4. PRODUCER ATTACHMENT.",
      body: v(form.producer_attachment, "producer attachment terms"),
    },
    {
      heading: "5. SET-UP.",
      body: "If a buyer wishes to acquire or develop the Project, Owner and Producer shall negotiate the terms in good faith, and Producer's attachment shall be subject to the buyer's customary terms.",
    },
    {
      heading: "6. WARRANTIES.",
      body: "Owner warrants that Owner is the sole owner of the Project and has the full right and authority to enter into this Agreement.",
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
  const ownerLine = `OWNER: ______________________________   ${v(form.owner_name, "owner name")}`;
  const producerLine = `PRODUCER: ___________________________   ${v(form.producer_name, "producer name")}`;

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

    write("SHOPPING AGREEMENT", 16, "bold", "center");
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
    write(ownerLine);
    y += 8;
    write(producerLine);
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeTitle = (form.property_title || "Shopping_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Shopping_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Shopping Agreement</h1>
          <p className="text-muted-foreground">
            Let a producer pitch a project to buyers without an option, and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers who want to pitch a project without buying it.</li>
                <li>Writers and owners letting a producer attach and shop their project.</li>
                <li>Anyone testing a project with buyers before optioning.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Gives a producer the exclusive right to pitch a project for a set time.</li>
                <li>Keeps all ownership with the owner — no rights transfer.</li>
                <li>Attaches the producer and sets fee and credit if a buyer bites.</li>
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
                  <Label htmlFor="owner_name">Owner (rights holder)</Label>
                  <Input
                    id="owner_name"
                    value={form.owner_name}
                    onChange={(e) => set("owner_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="owner_address">Owner Address</Label>
                  <Input
                    id="owner_address"
                    value={form.owner_address}
                    onChange={(e) => set("owner_address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="producer_name">Producer (shopping the project)</Label>
                  <Input
                    id="producer_name"
                    value={form.producer_name}
                    onChange={(e) => set("producer_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="producer_address">Producer Address</Label>
                  <Input
                    id="producer_address"
                    value={form.producer_address}
                    onChange={(e) => set("producer_address", e.target.value)}
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
                  <Label htmlFor="property_type">Property Type</Label>
                  <Select value={form.property_type} onValueChange={(val) => set("property_type", val)}>
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
                    onClick={() => legalize("property_description", "Project Description")}
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
                <CardTitle>Shopping Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shopping_period">Shopping Period (months)</Label>
                  <Input
                    id="shopping_period"
                    value={form.shopping_period}
                    onChange={(e) => set("shopping_period", e.target.value)}
                  />
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="exclusivity"
                    checked={form.exclusivity}
                    onCheckedChange={(checked) => set("exclusivity", checked === true)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="exclusivity">Exclusive shopping rights</Label>
                    <p className="text-xs text-muted-foreground">
                      When checked, Owner may not shop the Project with anyone else during the Shopping Period.
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="approved_buyers">Approved Buyers</Label>
                  <Textarea
                    id="approved_buyers"
                    rows={3}
                    value={form.approved_buyers}
                    onChange={(e) => set("approved_buyers", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="producer_attachment">Producer Attachment</Label>
                  <Textarea
                    id="producer_attachment"
                    rows={3}
                    value={form.producer_attachment}
                    onChange={(e) => set("producer_attachment", e.target.value)}
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
                  <h2 className="text-center font-bold tracking-wide text-base">SHOPPING AGREEMENT</h2>
                  <p>{intro}</p>
                  {clauses.map((c) => (
                    <p key={c.heading}>
                      <span className="font-semibold">{c.heading}</span> {c.body}
                    </p>
                  ))}
                  <p>{closing}</p>
                  <p className="whitespace-pre-line pt-4">{ownerLine}</p>
                  <p className="whitespace-pre-line">{producerLine}</p>
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

export default ShoppingAgreement;
