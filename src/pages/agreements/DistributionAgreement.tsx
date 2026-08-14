import { useMemo, useState } from "react";
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

interface DistributionForm {
  licensor_name: string;
  distributor_name: string;
  effective_date: string;
  film_title: string;
  film_type: string;
  runtime: string;
  rights_granted: string;
  exclusivity: string;
  territory: string;
  term_length: string;
  holdbacks: string;
  advance_mg: string;
  distributor_fee: string;
  royalty_split: string;
  expense_cap: string;
  payment_terms: string;
  deliverables: string;
  reversion: string;
}

const INITIAL_FORM: DistributionForm = {
  licensor_name: "",
  distributor_name: "",
  effective_date: "",
  film_title: "",
  film_type: "Feature Film",
  runtime: "",
  rights_granted: "Theatrical, home video, VOD/SVOD/AVOD, and free & pay television",
  exclusivity: "Exclusive",
  territory: "United States",
  term_length: "7 years from delivery or first release",
  holdbacks: "Standard windows; no SVOD during the theatrical/PVOD window",
  advance_mg: "",
  distributor_fee: "",
  royalty_split: "After recoupment of the Advance and approved distribution expenses, net receipts split 70% Licensor / 30% Distributor",
  expense_cap: "",
  payment_terms: "Distributor accounts quarterly and remits within 45 days, with Licensor audit rights",
  deliverables: "Delivery of materials per the delivery schedule and a valid E&O policy",
  reversion: "All rights revert to Licensor upon expiration of the Term or uncured material breach",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Consult a qualified entertainment attorney before executing this agreement.";

const FILM_TYPES = ["Feature Film", "Documentary", "Short Film", "Series"];
const EXCLUSIVITY_OPTIONS = ["Exclusive", "Non-Exclusive"];
const TERRITORY_PRESETS = ["Worldwide", "United States", "North America"];

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
type AiField = "rights_granted" | "holdbacks" | "royalty_split" | "payment_terms" | "reversion" | "additional_terms";

const DistributionAgreement = () => {
  const [form, setForm] = useState<DistributionForm>(INITIAL_FORM);
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [filmTypeChoice, setFilmTypeChoice] = useState("Feature Film");
  const [territoryChoice, setTerritoryChoice] = useState("United States");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof DistributionForm>(key: K, value: DistributionForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const getField = (field: AiField) => (field === "additional_terms" ? additionalTerms : form[field]);
  const setField = (field: AiField, value: string) =>
    field === "additional_terms" ? setAdditionalTerms(value) : set(field, value);

  const legalize = async (field: AiField, context: string) => {
    const value = getField(field).trim();
    if (!value) return;
    setLegalizing(field);
    try {
      const res = await aiInvoke<{ text?: string; error?: string }>("legalize-text", {
        body: { text: value, context },
      });
      if (res?.text) {
        setField(field, res.text);
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

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setAdditionalTerms("");
    setFilmTypeChoice("Feature Film");
    setTerritoryChoice("United States");
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const s = (value: string, placeholder: string) => v(value, placeholder).replace(/[.;,]+$/, "");

  const intro = `This Distribution Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.licensor_name, "licensor / producer")} ("Licensor") and ${v(
    form.distributor_name,
    "distributor"
  )} ("Distributor").`;

  const clauses: Clause[] = useMemo(() => {
    return [
      {
        heading: "Grant of Rights",
        body: `Licensor hereby grants Distributor the ${v(
          form.exclusivity,
          "exclusive / non-exclusive"
        ).toLowerCase()} right to distribute and exploit the motion picture presently entitled "${v(
          form.film_title,
          "film title"
        )}" (the "Film"), a ${v(form.film_type, "film type")}${
          form.runtime.trim() ? `, running approximately ${form.runtime.trim()}` : ""
        }, in the following media: ${s(form.rights_granted, "rights / media granted")}. All rights not expressly granted are reserved to Licensor.`,
      },
      {
        heading: "Territory & Term",
        body: `The rights granted hereunder apply throughout ${s(form.territory, "territory")} for ${s(
          form.term_length,
          "license term"
        )}, unless earlier terminated in accordance with this Agreement.`,
      },
      {
        heading: "Holdbacks & Windows",
        body: `${s(
          form.holdbacks,
          "holdbacks / windows"
        )}. Distributor shall comply with all agreed holdback periods and release windows, and shall not exploit the Film in any medium during a restricted window without Licensor's prior written consent.`,
      },
      {
        heading: "Advance & Fee",
        body: `Distributor shall be entitled to a distribution fee of ${v(form.distributor_fee, "distribution fee (%)")}.${
          form.advance_mg.trim()
            ? ` Distributor shall pay Licensor an advance / minimum guarantee of ${form.advance_mg.trim()}, recoupable from gross or net receipts as defined in this Agreement.`
            : ""
        }`,
      },
      {
        heading: "Revenue Split & Recoupment",
        body: `${s(form.royalty_split, "royalty / revenue split")}.${
          form.expense_cap.trim()
            ? ` Distributor's recoupable distribution expenses are capped at ${form.expense_cap.trim()} in the aggregate without Licensor's prior written approval.`
            : ""
        }`,
      },
      {
        heading: "Accounting & Payment",
        body: `${s(
          form.payment_terms,
          "accounting and payment terms"
        )}. Each statement shall itemize gross receipts, distribution fees, recouped expenses, and Licensor's share. Licensor shall have the right to audit Distributor's books and records relating to the Film upon reasonable prior written notice, not more than once per calendar year.`,
      },
      {
        heading: "Delivery",
        body: `Licensor shall deliver, at Licensor's cost, ${s(
          form.deliverables,
          "delivery requirements"
        )}. Distributor's obligations hereunder are conditioned upon Licensor's timely delivery of such materials in the required format.`,
      },
      {
        heading: "Reversion & Termination",
        body: `${s(
          form.reversion,
          "reversion / termination"
        )}. Upon reversion or termination, Distributor shall promptly return or transfer all delivery materials and provide Licensor with a complete schedule of all licenses entered into during the Term; licenses granted to sublicensees or platforms may survive in accordance with their terms.`,
      },
      {
        heading: "Representations & Warranties",
        body: `Licensor represents and warrants that it owns or controls the rights granted hereunder, that the Film does not infringe any third-party rights, and that it has full authority to enter into this Agreement. Distributor represents and warrants that it shall distribute the Film in compliance with all applicable laws and account accurately to Licensor.`,
      },
      {
        heading: "Additional Terms",
        body: v(additionalTerms, "additional terms"),
      },
    ];
  }, [form, additionalTerms]);

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

    write("DISTRIBUTION AGREEMENT", 15, "bold", "center");
    y += 6;
    write(intro);
    y += 4;

    clauses.forEach((c, i) => {
      ensure(14);
      write(`${i + 1}. ${c.heading.toUpperCase()}`, 11, "bold");
      y += 1;
      write(c.body);
      y += 4;
    });

    y += 4;
    write("IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.");
    y += 10;
    ensure(40);
    write("LICENSOR", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.licensor_name, "licensor / producer")}`);
    write("Date: __________________________________");
    y += 8;
    ensure(30);
    write("DISTRIBUTOR", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.distributor_name, "distributor")}`);
    write("Date: __________________________________");
    y += 12;
    ensure(16);
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    write("Filmmaker Genius — Document Library.", 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = `${form.film_title || "Film"}_${form.distributor_name || "Distributor"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Distribution_Agreement.pdf`);
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
      disabled={!getField(field).trim() || legalizing === field}
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
          <h1 className="text-3xl font-bold mb-2">Distribution Agreement</h1>
          <p className="text-muted-foreground">
            License your film to a distributor for a territory and platform — rights, term, splits, and delivery.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers licensing a film to a distributor.</li>
                <li>Distributors documenting the rights acquired.</li>
                <li>Anyone formalizing a distribution deal.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Grants distribution rights for a territory and media.</li>
                <li>Sets term, exclusivity, advance, and splits.</li>
                <li>Defines holdbacks, delivery, reporting, and reversion.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Consult an entertainment attorney before signing — distribution
            grants, holdbacks, and recoupment terms are highly negotiated and long-lasting.
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
                  <Label htmlFor="licensor_name">Licensor / Producer</Label>
                  <Input
                    id="licensor_name"
                    value={form.licensor_name}
                    onChange={(e) => set("licensor_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="distributor_name">Distributor</Label>
                  <Input
                    id="distributor_name"
                    value={form.distributor_name}
                    onChange={(e) => set("distributor_name", e.target.value)}
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
                <CardTitle>The Film</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="film_title">Film Title</Label>
                  <Input
                    id="film_title"
                    value={form.film_title}
                    onChange={(e) => set("film_title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Film Type</Label>
                  <Select
                    value={filmTypeChoice}
                    onValueChange={(val) => {
                      setFilmTypeChoice(val);
                      set("film_type", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select film type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FILM_TYPES.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {filmTypeChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., Anthology / Special"
                      value={form.film_type}
                      onChange={(e) => set("film_type", e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="runtime">Runtime (optional)</Label>
                  <Input
                    id="runtime"
                    placeholder="e.g., 98 minutes"
                    value={form.runtime}
                    onChange={(e) => set("runtime", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grant of Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rights_granted">Rights / Media Granted</Label>
                  <Textarea
                    id="rights_granted"
                    rows={3}
                    value={form.rights_granted}
                    onChange={(e) => set("rights_granted", e.target.value)}
                  />
                  {aiButton("rights_granted", "distribution agreement — rights and media granted")}
                </div>
                <div>
                  <Label>Exclusivity</Label>
                  <Select value={form.exclusivity} onValueChange={(val) => set("exclusivity", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exclusivity" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXCLUSIVITY_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Territory</Label>
                  <Select
                    value={territoryChoice}
                    onValueChange={(val) => {
                      setTerritoryChoice(val);
                      set("territory", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select territory" />
                    </SelectTrigger>
                    <SelectContent>
                      {TERRITORY_PRESETS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {territoryChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., Latin America (excluding Brazil)"
                      value={form.territory}
                      onChange={(e) => set("territory", e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="term_length">License Term</Label>
                  <Input
                    id="term_length"
                    value={form.term_length}
                    onChange={(e) => set("term_length", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="holdbacks">Holdbacks / Windows</Label>
                  <Textarea
                    id="holdbacks"
                    rows={3}
                    value={form.holdbacks}
                    onChange={(e) => set("holdbacks", e.target.value)}
                  />
                  {aiButton("holdbacks", "distribution agreement — holdbacks and windows")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Money</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="advance_mg">Advance / Minimum Guarantee (USD)</Label>
                  <Input
                    id="advance_mg"
                    placeholder="Optional"
                    value={form.advance_mg}
                    onChange={(e) => set("advance_mg", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="distributor_fee">Distribution Fee (%)</Label>
                  <Input
                    id="distributor_fee"
                    placeholder="e.g., 25%"
                    value={form.distributor_fee}
                    onChange={(e) => set("distributor_fee", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="royalty_split">Royalty / Revenue Split</Label>
                  <Textarea
                    id="royalty_split"
                    rows={3}
                    value={form.royalty_split}
                    onChange={(e) => set("royalty_split", e.target.value)}
                  />
                  {aiButton("royalty_split", "distribution agreement — royalty and revenue split")}
                </div>
                <div>
                  <Label htmlFor="expense_cap">Distribution Expense Cap (USD)</Label>
                  <Input
                    id="expense_cap"
                    placeholder="Optional"
                    value={form.expense_cap}
                    onChange={(e) => set("expense_cap", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_terms">Accounting &amp; Payment</Label>
                  <Textarea
                    id="payment_terms"
                    rows={3}
                    value={form.payment_terms}
                    onChange={(e) => set("payment_terms", e.target.value)}
                  />
                  {aiButton("payment_terms", "distribution agreement — accounting and payment terms")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery &amp; Reversion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deliverables">Delivery Requirements</Label>
                  <Textarea
                    id="deliverables"
                    rows={3}
                    value={form.deliverables}
                    onChange={(e) => set("deliverables", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reversion">Reversion / Termination</Label>
                  <Textarea
                    id="reversion"
                    rows={3}
                    value={form.reversion}
                    onChange={(e) => set("reversion", e.target.value)}
                  />
                  {aiButton("reversion", "distribution agreement — reversion and termination")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="additional_terms">Additional Terms</Label>
                <Textarea
                  id="additional_terms"
                  rows={4}
                  placeholder="Approvals, marketing obligations, collection account, arbitration, governing law…"
                  value={additionalTerms}
                  onChange={(e) => setAdditionalTerms(e.target.value)}
                />
                {aiButton("additional_terms", "distribution agreement — additional terms")}
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button variant="ghost" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          {/* RIGHT: preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[70vh] overflow-y-auto rounded-md bg-white p-6 text-[13px] leading-relaxed text-black">
                  <h2 className="mb-4 text-center text-lg font-bold">DISTRIBUTION AGREEMENT</h2>
                  <p className="mb-4 text-justify">{intro}</p>
                  <ol className="space-y-3">
                    {clauses.map((c, i) => (
                      <li key={c.heading}>
                        <p className="font-bold">
                          {i + 1}. {c.heading}
                        </p>
                        <p className="text-justify">{c.body}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5">
                    IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-bold">LICENSOR</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.licensor_name, "licensor / producer")}</p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                    <div>
                      <p className="font-bold">DISTRIBUTOR</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.distributor_name, "distributor")}</p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                  </div>
                  <p className="mt-6 text-[10px] italic text-gray-500">{DISCLAIMER}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Filmmaker Genius — Document Library. Template only; not legal advice.
        </p>
      </div>
    </div>
  );
};

export default DistributionAgreement;
