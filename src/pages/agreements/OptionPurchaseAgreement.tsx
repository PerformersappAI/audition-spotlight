import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Download, Loader2, Printer, RotateCcw, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface OptionAgreementForm {
  effective_date: string;
  owner_name: string;
  owner_address: string;
  producer_name: string;
  producer_address: string;
  property_type: string;
  property_title: string;
  author: string;
  property_description: string;
  option_months: string;
  option_fee: string;
  extension_months: string;
  extension_fee: string;
  option_applies_to_purchase: boolean;
  purchase_price: string;
  contingent_comp: string;
  territory: string;
  rights_granted: string;
  reserved_rights: string;
  credit: string;
  governing_law: string;
}

const INITIAL_FORM: OptionAgreementForm = {
  effective_date: "",
  owner_name: "",
  owner_address: "",
  producer_name: "",
  producer_address: "",
  property_type: "Screenplay",
  property_title: "",
  author: "",
  property_description: "",
  option_months: "12",
  option_fee: "",
  extension_months: "12",
  extension_fee: "",
  option_applies_to_purchase: true,
  purchase_price: "",
  contingent_comp: "",
  territory: "Worldwide",
  rights_granted:
    "all motion picture, television, streaming/VOD, and allied, ancillary, and subsidiary rights",
  reserved_rights:
    "publication (print) rights, live stage rights, and radio rights are reserved to Owner",
  credit: "",
  governing_law: "",
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

const OptionPurchaseAgreement = () => {
  const [form, setForm] = useState<OptionAgreementForm>(INITIAL_FORM);

  const set = <K extends keyof OptionAgreementForm>(key: K, value: OptionAgreementForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<"property_description" | "contingent_comp" | null>(null);

  const legalize = async (field: "property_description" | "contingent_comp", context: string) => {
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

  const intro = `This Option and Purchase Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.owner_name, "owner name")}, located at ${v(
    form.owner_address,
    "owner address"
  )} ("Owner"), and ${v(form.producer_name, "producer name")}, located at ${v(
    form.producer_address,
    "producer address"
  )} ("Producer").`;

  const authorPart = form.author.trim() ? `, written by ${form.author.trim()},` : "";

  const clauses: Clause[] = [
    {
      heading: "1. PROPERTY.",
      body: `Owner represents that Owner is the sole owner of all right, title, and interest in and to the ${
        form.property_type
      } titled "${v(form.property_title, "property title")}"${authorPart} (the "Property"), further described as: ${v(
        form.property_description,
        "property description"
      )}.`,
    },
    {
      heading: "2. GRANT OF OPTION.",
      body: `Owner hereby grants to Producer the exclusive and irrevocable option (the "Option") to acquire the motion picture and allied rights in and to the Property, for an initial period of ${v(
        form.option_months,
        "number"
      )} months commencing on the Effective Date (the "Option Period").`,
    },
    {
      heading: "3. OPTION FEE.",
      body: `In consideration of the Option, Producer shall pay Owner ${v(
        form.option_fee,
        "option fee"
      )} upon execution of this Agreement.${
        form.option_applies_to_purchase
          ? " Such sum shall be applied against the Purchase Price upon exercise."
          : ""
      }`,
    },
    {
      heading: "4. EXTENSION.",
      body: `Producer may extend the Option Period for one additional period of ${v(
        form.extension_months,
        "number"
      )} months by paying Owner ${v(
        form.extension_fee,
        "extension fee"
      )} prior to the expiration of the initial Option Period.`,
    },
    {
      heading: "5. EXERCISE OF OPTION.",
      body: "Producer may exercise the Option at any time during the Option Period (as extended) by written notice to Owner.",
    },
    {
      heading: "6. PURCHASE PRICE.",
      body: `Upon exercise of the Option, Producer shall pay Owner a purchase price of ${v(
        form.purchase_price,
        "purchase price"
      )} (the "Purchase Price").${
        form.contingent_comp.trim()
          ? ` In addition, Producer shall pay Owner contingent compensation as follows: ${form.contingent_comp.trim()}.`
          : ""
      }`,
    },
    {
      heading: "7. RIGHTS GRANTED.",
      body: `Upon exercise, Owner grants and assigns to Producer, throughout ${v(
        form.territory,
        "territory"
      )} and in perpetuity, the following rights in and to the Property: ${v(
        form.rights_granted,
        "rights granted"
      )}.`,
    },
    {
      heading: "8. RESERVED RIGHTS.",
      body: `Owner reserves the following rights: ${v(form.reserved_rights, "reserved rights")}.`,
    },
    {
      heading: "9. CREDIT.",
      body: `Producer shall accord Owner the following credit: ${v(form.credit, "credit")}.`,
    },
    {
      heading: "10. WARRANTIES.",
      body: "Owner warrants that Owner has the full right, power, and authority to enter into this Agreement and to grant the rights herein, and that the Property does not, to Owner's knowledge, infringe upon the rights of any third party.",
    },
    {
      heading: "11. ASSIGNMENT.",
      body: "Producer may freely assign this Agreement to a production entity, financier, or distributor, provided such assignee assumes Producer's obligations.",
    },
    {
      heading: "12. GOVERNING LAW.",
      body: `This Agreement shall be governed by and construed in accordance with the laws of ${v(
        form.governing_law,
        "governing law"
      )}.`,
    },
    {
      heading: "13. ENTIRE AGREEMENT.",
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

    write("OPTION AND PURCHASE AGREEMENT", 16, "bold", "center");
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
    const safeTitle = (form.property_title || "Option_Purchase_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Option_Purchase_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Option / Purchase Agreement</h1>
          <p className="text-muted-foreground">
            Fill in the details and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers optioning a script, book, article, or true story.</li>
                <li>Writers, authors, and rights-holders granting those rights.</li>
                <li>Anyone adapting material they don't yet own.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Secures the rights to a story before you commit to buying them.</li>
                <li>Reserves it now, with the purchase price agreed up front.</li>
                <li>Grants the exclusive right to develop and pitch the project.</li>
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
                  <Label htmlFor="owner_name">Owner Name</Label>
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
                  <Label htmlFor="producer_name">Producer Name</Label>
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
                <CardTitle>Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Property Type</Label>
                  <Select value={form.property_type} onValueChange={(val) => set("property_type", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Screenplay", "Completed Film", "Book/Novel", "Article", "Life Story"].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
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
                  <Label htmlFor="author">Author (optional)</Label>
                  <Input id="author" value={form.author} onChange={(e) => set("author", e.target.value)} />
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
                <CardTitle>Option Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="option_months">Option Period (months)</Label>
                    <Input
                      id="option_months"
                      value={form.option_months}
                      onChange={(e) => set("option_months", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="option_fee">Option Fee</Label>
                    <Input
                      id="option_fee"
                      placeholder="$1,000"
                      value={form.option_fee}
                      onChange={(e) => set("option_fee", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="extension_months">Extension (months)</Label>
                    <Input
                      id="extension_months"
                      value={form.extension_months}
                      onChange={(e) => set("extension_months", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="extension_fee">Extension Fee</Label>
                    <Input
                      id="extension_fee"
                      value={form.extension_fee}
                      onChange={(e) => set("extension_fee", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="option_applies_to_purchase"
                    checked={form.option_applies_to_purchase}
                    onCheckedChange={(checked) => set("option_applies_to_purchase", checked === true)}
                  />
                  <Label htmlFor="option_applies_to_purchase" className="font-normal">
                    Option fee applies against the Purchase Price
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="purchase_price">Purchase Price</Label>
                  <Input
                    id="purchase_price"
                    value={form.purchase_price}
                    onChange={(e) => set("purchase_price", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contingent_comp">Contingent Compensation (optional)</Label>
                  <Textarea
                    id="contingent_comp"
                    rows={2}
                    placeholder="5% of final budget"
                    value={form.contingent_comp}
                    onChange={(e) => set("contingent_comp", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rights &amp; Credit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="territory">Territory</Label>
                  <Input
                    id="territory"
                    value={form.territory}
                    onChange={(e) => set("territory", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rights_granted">Rights Granted</Label>
                  <Textarea
                    id="rights_granted"
                    rows={3}
                    value={form.rights_granted}
                    onChange={(e) => set("rights_granted", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reserved_rights">Reserved Rights</Label>
                  <Textarea
                    id="reserved_rights"
                    rows={3}
                    value={form.reserved_rights}
                    onChange={(e) => set("reserved_rights", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="credit">Credit</Label>
                  <Input
                    id="credit"
                    placeholder="Based on the work by [name]"
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
              <CardContent>
                <Label htmlFor="governing_law">Governing Law</Label>
                <Input
                  id="governing_law"
                  placeholder="the State of California"
                  value={form.governing_law}
                  onChange={(e) => set("governing_law", e.target.value)}
                />
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
                    OPTION AND PURCHASE AGREEMENT
                  </h2>
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

export default OptionPurchaseAgreement;
