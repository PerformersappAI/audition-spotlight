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

interface LifeRightsForm {
  effective_date: string;
  subject_name: string;
  subject_address: string;
  producer_name: string;
  producer_address: string;
  life_story_description: string;
  option_months: string;
  option_fee: string;
  extension_months: string;
  extension_fee: string;
  option_applies_to_purchase: boolean;
  purchase_price: string;
  contingent_comp: string;
  cooperation: boolean;
  territory: string;
  rights_granted: string;
  reserved_rights: string;
  credit: string;
  governing_law: string;
}

const INITIAL_FORM: LifeRightsForm = {
  effective_date: "",
  subject_name: "",
  subject_address: "",
  producer_name: "",
  producer_address: "",
  life_story_description: "",
  option_months: "12",
  option_fee: "",
  extension_months: "12",
  extension_fee: "",
  option_applies_to_purchase: true,
  purchase_price: "",
  contingent_comp: "",
  cooperation: true,
  territory: "Worldwide",
  rights_granted:
    "the exclusive right to develop, produce, distribute, and exploit one or more motion pictures, television, and streaming productions based on the Life Story, together with the right to use Subject's name, likeness, and voice, and to portray, adapt, fictionalize, and dramatize the Subject and the Life Story",
  reserved_rights:
    "the right to write and publish Subject's own memoir or autobiography is reserved to Subject",
  credit: "Based on the life of [subject]",
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

const LifeRightsAgreement = () => {
  const [form, setForm] = useState<LifeRightsForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");

  const set = <K extends keyof LifeRightsForm>(key: K, value: LifeRightsForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [legalizing, setLegalizing] = useState<"life_story_description" | "contingent_comp" | null>(null);

  const legalize = async (field: "life_story_description" | "contingent_comp", context: string) => {
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

  const intro = `This Life Rights Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.subject_name, "subject name")}, located at ${v(
    form.subject_address,
    "subject address"
  )} ("Subject"), and ${v(form.producer_name, "producer name")}, located at ${v(
    form.producer_address,
    "producer address"
  )} ("Producer").`;

  const clauses: Clause[] = [
    {
      heading: "1. LIFE STORY.",
      body: `Subject grants Producer rights in and to the Subject's life story, name, likeness, voice, and biographical material, in particular the following events and periods (the "Life Story"): ${v(
        form.life_story_description,
        "life story description"
      )}.`,
    },
    {
      heading: "2. GRANT OF OPTION.",
      body: `Subject hereby grants to Producer the exclusive and irrevocable option (the "Option") to acquire the motion picture, television, and allied rights in and to the Life Story, for an initial period of ${v(
        form.option_months,
        "number"
      )} months commencing on the Effective Date (the "Option Period").`,
    },
    {
      heading: "3. OPTION FEE.",
      body: `In consideration of the Option, Producer shall pay Subject ${v(
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
      )} months by paying Subject ${v(
        form.extension_fee,
        "extension fee"
      )} prior to the expiration of the initial Option Period.`,
    },
    {
      heading: "5. EXERCISE OF OPTION.",
      body: "Producer may exercise the Option at any time during the Option Period (as extended) by written notice to Subject.",
    },
    {
      heading: "6. PURCHASE PRICE.",
      body: `Upon exercise of the Option, Producer shall pay Subject a purchase price of ${v(
        form.purchase_price,
        "purchase price"
      )} (the "Purchase Price").${
        form.contingent_comp.trim()
          ? ` In addition, Producer shall pay Subject contingent compensation as follows: ${form.contingent_comp.trim()}.`
          : ""
      }`,
    },
    {
      heading: "7. RIGHTS GRANTED.",
      body: `Upon exercise, Subject grants and assigns to Producer, throughout ${v(
        form.territory,
        "territory"
      )} and in perpetuity, the following rights: ${v(form.rights_granted, "rights granted")}.`,
    },
    {
      heading: "8. RELEASE AND WAIVER.",
      body: "Subject hereby releases and waives, and agrees not to assert, any and all claims against Producer and its assignees and licensees arising from the depiction of the Subject or the Life Story, including without limitation claims for defamation, libel, slander, invasion of privacy, violation of rights of publicity, false light, and infliction of emotional distress. Subject acknowledges and agrees that the depiction may be fictionalized or dramatized for creative purposes.",
    },
    {
      heading: "9. CREATIVE CONTROL.",
      body: "Subject acknowledges that Producer shall have complete creative control over the production and that Subject shall have no right of approval over the script, content, or final production.",
    },
    {
      heading: "10. COOPERATION.",
      body: form.cooperation
        ? "Subject agrees to provide reasonable cooperation, including interviews and access to personal materials such as letters, photographs, and records, as reasonably requested by Producer."
        : "Subject shall be under no obligation to provide additional cooperation or materials.",
    },
    {
      heading: "11. RESERVED RIGHTS.",
      body: `Subject reserves the following rights: ${v(form.reserved_rights, "reserved rights")}.`,
    },
    {
      heading: "12. CREDIT.",
      body: `Producer shall accord Subject the following credit: ${v(form.credit, "credit")}.`,
    },
    {
      heading: "13. WARRANTIES.",
      body: "Subject warrants that Subject has the full right, power, and authority to grant the rights herein and to enter into this Agreement.",
    },
    {
      heading: "14. ASSIGNMENT.",
      body: "Producer may freely assign this Agreement to a production entity, financier, or distributor.",
    },
    {
      heading: "15. GOVERNING LAW.",
      body: `This Agreement shall be governed by and construed in accordance with the laws of ${v(
        form.governing_law,
        "governing law"
      )}.`,
    },
    {
      heading: "16. ENTIRE AGREEMENT.",
      body: "This Agreement constitutes the entire agreement between the parties and supersedes all prior understandings.",
    },
  ];

  const closing = "IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.";
  const subjectLine = `SUBJECT: _____________________________   ${v(form.subject_name, "subject name")}`;
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

    write("LIFE RIGHTS AGREEMENT", 16, "bold", "center");
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
    write(subjectLine);
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
    const safeTitle = (form.subject_name || "Life_Rights_Agreement").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeTitle}_Life_Rights_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Life Rights Agreement</h1>
          <p className="text-muted-foreground">
            Secure the rights to depict a real person's life story and generate a ready-to-review agreement.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers making a film or series based on a real person's life.</li>
                <li>The person (or their estate) granting their life-story rights.</li>
                <li>Anyone dramatizing a true story about a living individual.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Secures the right to depict a real person's life on screen.</li>
                <li>Waives privacy, likeness, and defamation claims over the portrayal.</li>
                <li>Sets the fee, cooperation, and creative-control terms.</li>
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
                  <Label htmlFor="subject_name">Subject (the real person)</Label>
                  <Input
                    id="subject_name"
                    value={form.subject_name}
                    onChange={(e) => set("subject_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="subject_address">Subject Address</Label>
                  <Input
                    id="subject_address"
                    value={form.subject_address}
                    onChange={(e) => set("subject_address", e.target.value)}
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
                <CardTitle>The Life Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="life_story_description">Life Story Description</Label>
                  <Textarea
                    id="life_story_description"
                    rows={3}
                    value={form.life_story_description}
                    onChange={(e) => set("life_story_description", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.life_story_description.trim() || legalizing === "life_story_description"}
                    onClick={() => legalize("life_story_description", "Life Story")}
                  >
                    {legalizing === "life_story_description" ? (
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
                <CardTitle>Cooperation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="cooperation"
                    checked={form.cooperation}
                    onCheckedChange={(checked) => set("cooperation", checked === true)}
                  />
                  <Label htmlFor="cooperation" className="font-normal">
                    Subject will provide cooperation, interviews, and access to materials
                  </Label>
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
                    placeholder="Based on the life of [subject]"
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
                    LIFE RIGHTS AGREEMENT
                  </h2>
                  <p>{intro}</p>
                  {clauses.map((c) => (
                    <p key={c.heading}>
                      <span className="font-semibold">{c.heading}</span> {c.body}
                    </p>
                  ))}
                  <p>{closing}</p>
                  <p className="whitespace-pre-line pt-4">{subjectLine}</p>
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

export default LifeRightsAgreement;
