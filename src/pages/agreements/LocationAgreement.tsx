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
import { AlertTriangle, Download, Loader2, Printer, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface LocationAgreementForm {
  production_name: string;
  company: string;
  owner_name: string;
  property_address: string;
  effective_date: string;
  premises: string;
  use_dates: string;
  fee: string;
  additional_provisions: string;
  governing_law: string;
}

const INITIAL_FORM: LocationAgreementForm = {
  production_name: "",
  company: "",
  owner_name: "",
  property_address: "",
  effective_date: "",
  premises: "",
  use_dates: "",
  fee: "",
  additional_provisions: "",
  governing_law: "the State of California",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Consult a qualified entertainment attorney before executing this or any agreement.";

const GOV_OPTIONS = [
  "the State of California",
  "the State of New York",
  "the State of Delaware",
  "the State of Georgia",
];

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
type AiField = "premises" | "additional_provisions";

const LocationAgreement = () => {
  const [form, setForm] = useState<LocationAgreementForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof LocationAgreementForm>(key: K, value: LocationAgreementForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const legalize = async (field: AiField, context: string) => {
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

  const intro = `This Location Agreement / Release ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.company, "producer / production company")} and ${v(
    form.owner_name,
    "property owner / manager"
  )}.`;

  const clauses: Clause[] = [
    {
      heading: "Grant of Permission",
      body: `${v(form.owner_name, "property owner / manager")} ("Owner") grants ${v(
        form.company,
        "producer / production company"
      )} ("Company") permission to enter and use the property located at ${v(
        form.property_address,
        "property address"
      )} (the "Property") in connection with the production presently entitled ${v(
        form.production_name,
        "production name"
      )}, including the following areas: ${v(
        form.premises,
        "premises and areas"
      )}. Company's access is scheduled as follows: ${v(
        form.use_dates,
        "filming dates and access"
      )}, including reasonable time for preparation, filming, and strike.`,
    },
    {
      heading: "Location Fee",
      body: `Company shall pay Owner a location fee of ${v(form.fee, "location fee")}.`,
    },
    {
      heading: "Condition & Restoration",
      body: "Company shall leave the Property in substantially the same condition as found, reasonable wear and tear excepted, and shall promptly repair or pay for any damage to the Property caused by Company's use.",
    },
    {
      heading: "Alterations",
      body: "Company may make temporary changes or decoration to the Property as reasonably necessary for filming and shall remove the same and restore the Property upon completion.",
    },
    {
      heading: "Rights in Footage",
      body: "All footage photographed at the Property is the sole and exclusive property of Company, which owns all rights therein. Owner grants Company the irrevocable right to photograph and depict the Property, including its name, likeness, and appearance, in the production and its promotion in all media, in perpetuity, and Owner shall have no right, title, or interest in the footage.",
    },
    {
      heading: "Insurance & Indemnity",
      body: "Company shall maintain commercial general liability insurance covering its use of the Property and shall indemnify and hold Owner harmless from third-party claims arising out of Company's use of the Property, except to the extent caused by Owner's own negligence or willful misconduct.",
    },
    {
      heading: "Representations & Warranties",
      body: "Owner represents and warrants that Owner owns or controls the Property and has full authority to grant this permission.",
    },
    {
      heading: "Additional Provisions",
      body: v(form.additional_provisions, "additional provisions"),
    },
    {
      heading: "Governing Law",
      body: `This Agreement shall be governed by and construed under the laws of ${v(
        form.governing_law,
        "governing law"
      )}, without regard to its conflict-of-laws principles.`,
    },
  ];

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

    write("LOCATION AGREEMENT / RELEASE", 16, "bold", "center");
    y += 6;
    write(intro);
    y += 4;

    clauses.forEach((c, i) => {
      write(`${i + 1}. ${c.heading.toUpperCase()}`, 11, "bold");
      y += 1;
      write(c.body);
      y += 4;
    });

    y += 4;
    write("IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.");
    y += 10;
    write("PROPERTY OWNER / MANAGER", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.owner_name, "property owner / manager")}`);
    write("Date: __________________________________");
    y += 8;
    write("COMPANY", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.company, "producer / production company")}`);
    write("Date: __________________________________");
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = `${form.production_name || "Location"}_${form.owner_name || "Agreement"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Location_Agreement.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const aiButton = (field: AiField, context: string) => (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="mt-2"
      disabled={!form[field].trim() || legalizing === field}
      onClick={() => legalize(field, context)}
    >
      {legalizing === field ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Make Professional
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Location Agreement / Release</h1>
          <p className="text-muted-foreground">
            Secure permission to film on private property — access, fee, condition, and liability.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Productions filming on private property.</li>
                <li>Location managers papering location deals.</li>
                <li>Property owners granting filming access.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Grants access to the property for filming.</li>
                <li>Sets the fee, dates, and restoration terms.</li>
                <li>Covers insurance, indemnity, and footage rights.</li>
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
                  <Label htmlFor="production_name">Production Name</Label>
                  <Input
                    id="production_name"
                    value={form.production_name}
                    onChange={(e) => set("production_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Producer / Company</Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="owner_name">Property Owner / Manager</Label>
                  <Input
                    id="owner_name"
                    value={form.owner_name}
                    onChange={(e) => set("owner_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="property_address">Property Address</Label>
                  <Input
                    id="property_address"
                    value={form.property_address}
                    onChange={(e) => set("property_address", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="effective_date">Effective Date</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    value={form.effective_date}
                    onChange={(e) => set("effective_date", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use & Fee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="premises">Premises and Areas</Label>
                  <Textarea
                    id="premises"
                    rows={3}
                    placeholder="Describe the areas of the property to be used…"
                    value={form.premises}
                    onChange={(e) => set("premises", e.target.value)}
                  />
                  {aiButton("premises", "location agreement — premises and areas")}
                </div>
                <div>
                  <Label htmlFor="use_dates">Filming Dates & Access</Label>
                  <Input
                    id="use_dates"
                    placeholder="Prep Aug 12; shoot Aug 13–14; strike Aug 15, 2026"
                    value={form.use_dates}
                    onChange={(e) => set("use_dates", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fee">Location Fee</Label>
                  <Input
                    id="fee"
                    placeholder="$1,500 / day"
                    value={form.fee}
                    onChange={(e) => set("fee", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="additional_provisions">Additional Provisions</Label>
                  <Textarea
                    id="additional_provisions"
                    rows={3}
                    placeholder="Parking, restrooms, noise, restrictions, cancellation…"
                    value={form.additional_provisions}
                    onChange={(e) => set("additional_provisions", e.target.value)}
                  />
                  {aiButton("additional_provisions", "location agreement — additional provisions")}
                </div>
                <div>
                  <Label>Governing Law</Label>
                  <Select
                    value={govChoice}
                    onValueChange={(val) => {
                      setGovChoice(val);
                      set("governing_law", val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select governing law" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOV_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {govChoice === "other" && (
                    <Input
                      className="mt-2"
                      placeholder="Specify jurisdiction"
                      value={form.governing_law}
                      onChange={(e) => set("governing_law", e.target.value)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: preview */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Preview</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="default" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white text-black p-8 rounded-sm shadow-inner min-h-[600px] font-serif text-sm leading-relaxed">
                  <h2 className="text-center text-lg font-bold uppercase mb-6">Location Agreement / Release</h2>
                  <p className="mb-6">{intro}</p>
                  <ol className="list-decimal list-outside ml-5 space-y-4">
                    {clauses.map((c, i) => (
                      <li key={i}>
                        <span className="font-bold uppercase block mb-1">{c.heading}</span>
                        <span>{c.body}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-6">
                    IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.
                  </p>
                  <div className="grid md:grid-cols-2 gap-8 mt-10">
                    <div>
                      <p className="font-bold uppercase mb-2">Property Owner / Manager</p>
                      <p>Signature: ______________________________</p>
                      <p>Printed Name: {v(form.owner_name, "property owner / manager")}</p>
                      <p>Date: __________________________________</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase mb-2">Company</p>
                      <p>Signature: ______________________________</p>
                      <p>Printed Name: {v(form.company, "producer / production company")}</p>
                      <p>Date: __________________________________</p>
                    </div>
                  </div>
                  <p className="mt-10 text-xs text-gray-500 italic">{DISCLAIMER}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          Filmmaker Genius — Document Library.
        </footer>
      </div>
    </div>
  );
};

export default LocationAgreement;
