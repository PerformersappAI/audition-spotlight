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

interface LiteraryRightsForm {
  effective_date: string;
  owner_name: string;
  owner_address: string;
  producer_name: string;
  producer_address: string;
  work_title: string;
  author: string;
  publisher: string;
  publication_year: string;
  work_description: string;
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

const INITIAL_FORM: LiteraryRightsForm = {
  effective_date: "",
  owner_name: "",
  owner_address: "",
  producer_name: "",
  producer_address: "",
  work_title: "",
  author: "",
  publisher: "",
  publication_year: "",
  work_description: "",
  option_months: "12",
  option_fee: "",
  extension_months: "12",
  extension_fee: "",
  option_applies_to_purchase: true,
  purchase_price: "",
  contingent_comp: "",
  territory: "Worldwide",
  rights_granted:
    "the exclusive right to adapt, produce, distribute, and exploit the Work as one or more motion pictures and television/streaming productions, together with allied, ancillary, subsidiary, sequel, prequel, and remake rights",
  reserved_rights:
    "print publication rights, live stage rights, radio rights, and author-written sequel (publishing) rights are reserved to Owner",
  credit: "Based on the work by [author]",
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

const LiteraryRightsOption = () => {
  const [form, setForm] = useState<LiteraryRightsForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof LiteraryRightsForm>(key: K, value: LiteraryRightsForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<"work_description" | "contingent_comp" | null>(null);

  const legalize = async (field: "work_description" | "contingent_comp", context: string) => {
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

  const intro = `This Literary Rights Option Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.owner_name, "owner name")}, located at ${v(
    form.owner_address,
    "owner address"
  )} ("Owner"), and ${v(form.producer_name, "producer name")}, located at ${v(
    form.producer_address,
    "producer address"
  )} ("Producer").`;

  const publisherPart =
    form.publisher.trim() && form.publication_year.trim()
      ? `, published by ${form.publisher.trim()} (${form.publication_year.trim()})`
      : form.publisher.trim()
      ? `, published by ${form.publisher.trim()}`
      : "";

  const clauses: Clause[] = [
    {
      heading: "1. THE WORK.",
      body: `Owner represents that Owner is the sole owner of all right, title, and interest in and to the literary work titled "${v(
        form.work_title,
        "work title"
      )}" written by ${v(form.author, "author")}${publisherPart} (the "Work"), further described as: ${v(
        form.work_description,
        "work description"
      )}.`,
    },
    {
      heading: "2. GRANT OF OPTION.",
      body: `Owner hereby grants to Producer the exclusive and irrevocable option (the "Option") to acquire the motion picture, television, and allied adaptation rights in and to the Work, for an initial period of ${v(
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
      )} and in perpetuity, the following rights in and to the Work: ${v(
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
      body: "Owner warrants that Owner has the full right, power, and authority to enter into this Agreement and to grant the rights herein, and that the Work does not, to Owner's knowledge, infringe upon the rights of any third party.",
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

    write("LITERARY RIGHTS OPTION AGREEMENT", 16, "bold", "center");
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
    const safeTitle = (form.work_title || "Literary_Rights_Option_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Literary_Rights_Option_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Literary Rights Option Agreement</h1>
          <p className="text-muted-foreground">
            Option the rights to a published work and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers optioning a published book, novel, article, or play to adapt.</li>
                <li>Authors and publishers granting adaptation rights.</li>
                <li>Anyone turning existing literary material into a film or series.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Secures the screen rights to a literary work before you buy them.</li>
                <li>Reserves the right to adapt it, with the purchase price agreed up front.</li>
                <li>Grants the exclusive right to develop the adaptation and pitch it.</li>
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
                  <Label htmlFor="owner_name">Author / Rights Holder</Label>
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
                <CardTitle>The Work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="work_title">Work Title</Label>
                  <Input
                    id="work_title"
                    value={form.work_title}
                    onChange={(e) => set("work_title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" value={form.author} onChange={(e) => set("author", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="publisher">Publisher (optional)</Label>
                  <Input
                    id="publisher"
                    value={form.publisher}
                    onChange={(e) => set("publisher", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="publication_year">Publication Year (optional)</Label>
                  <Input
                    id="publication_year"
                    value={form.publication_year}
                    onChange={(e) => set("publication_year", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="work_description">Work Description</Label>
                  <Textarea
                    id="work_description"
                    rows={3}
                    value={form.work_description}
                    onChange={(e) => set("work_description", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.work_description.trim() || legalizing === "work_description"}
                    onClick={() => legalize("work_description", "Work Description")}
                  >
                    {legalizing === "work_description" ? (
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
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.contingent_comp.trim() || legalizing === "contingent_comp"}
                    onClick={() => legalize("contingent_comp", "Contingent Compensation")}
                  >
                    {legalizing === "contingent_comp" ? (
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
                    placeholder="Based on the work by [author]"
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
                    LITERARY RIGHTS OPTION AGREEMENT
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

export default LiteraryRightsOption;
