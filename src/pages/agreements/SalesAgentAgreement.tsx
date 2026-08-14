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

interface SalesAgentForm {
  agent_name: string;
  producer_name: string;
  effective_date: string;
  film_title: string;
  film_type: string;
  runtime: string;
  delivery_status: string;
  appointment: string;
  rights_granted: string;
  territory: string;
  term_length: string;
  commission_rate: string;
  commission_basis: string;
  expense_cap: string;
  mg: string;
  payment_terms: string;
  deliverables: string;
  reversion: string;
}

const INITIAL_FORM: SalesAgentForm = {
  agent_name: "",
  producer_name: "",
  effective_date: "",
  film_title: "",
  film_type: "Feature Film",
  runtime: "",
  delivery_status: "",
  appointment: "Exclusive",
  rights_granted: "All theatrical, home video, television, and digital rights",
  territory: "Worldwide",
  term_length: "3 years from delivery",
  commission_rate: "",
  commission_basis: "Gross receipts",
  expense_cap: "",
  mg: "",
  payment_terms: "Agent accounts and remits within 30 days of each calendar quarter",
  deliverables: "Delivery materials per the standard delivery schedule and E&O policy",
  reversion: "Rights revert to Producer on expiration of the Term or uncured material breach",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Consult a qualified entertainment attorney before executing this agreement.";

const FILM_TYPES = ["Feature Film", "Documentary", "Short Film", "Series"];
const APPOINTMENT_OPTIONS = ["Exclusive", "Non-Exclusive"];
const COMMISSION_BASIS_OPTIONS = ["Gross receipts", "Net after distribution costs"];
const TERRITORY_PRESETS = ["Worldwide", "United States", "North America", "Excluding North America"];

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
type AiField = "rights_granted" | "payment_terms" | "reversion" | "additional_terms";

const SalesAgentAgreement = () => {
  const [form, setForm] = useState<SalesAgentForm>(INITIAL_FORM);
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [filmTypeChoice, setFilmTypeChoice] = useState("Feature Film");
  const [territoryChoice, setTerritoryChoice] = useState("Worldwide");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof SalesAgentForm>(key: K, value: SalesAgentForm[K]) =>
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
    setTerritoryChoice("Worldwide");
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const s = (value: string, placeholder: string) => v(value, placeholder).replace(/[.;,]+$/, "");

  const intro = `This Sales Agent Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.agent_name, "sales agent / company")} ("Agent") and ${v(
    form.producer_name,
    "producer / rights holder"
  )} ("Producer").`;

  const clauses: Clause[] = useMemo(() => {
    return [
      {
        heading: "Appointment",
        body: `Producer hereby appoints Agent as its ${v(
          form.appointment,
          "exclusive / non-exclusive"
        ).toLowerCase()} sales agent to license and exploit the motion picture presently entitled "${v(
          form.film_title,
          "film title"
        )}" (the "Film"), a ${v(form.film_type, "film type")}${
          form.runtime.trim() ? `, running approximately ${form.runtime.trim()}` : ""
        }${
          form.delivery_status.trim() ? ` (delivery status: ${form.delivery_status.trim()})` : ""
        }. Agent accepts such appointment and shall represent the Film in the markets and to buyers in the ordinary course of the international sales business.`,
      },
      {
        heading: "Rights & Territory",
        body: `Agent may solicit, negotiate, and (subject to Producer's approval of material terms) license ${s(
          form.rights_granted,
          "rights / media licensed"
        )} throughout ${s(form.territory, "territory")}. All rights not expressly granted are reserved to Producer.`,
      },
      {
        heading: "Term",
        body: `The term of this Agreement shall be ${s(
          form.term_length,
          "term"
        )}, unless earlier terminated in accordance with this Agreement.`,
      },
      {
        heading: "Commission",
        body: `As full consideration for its services, Agent shall be entitled to a sales commission of ${v(
          form.commission_rate,
          "commission (%)"
        )} of ${s(form.commission_basis, "commission basis").toLowerCase()} derived from Agent's licensing of the Film.${
          form.mg.trim()
            ? ` Agent shall pay Producer a minimum guarantee / advance of ${form.mg.trim()}, recoupable from Producer's share of receipts.`
            : ""
        }`,
      },
      {
        heading: "Expenses",
        body: `Agent may incur reasonable, recoupable marketing and market expenses (including market attendance, promotional materials, and screenings) in connection with the Film, capped at ${v(
          form.expense_cap,
          "expense cap (USD)"
        )} in the aggregate without Producer's prior written approval. Such expenses shall be deductible in accordance with the accounting terms below.`,
      },
      {
        heading: "Accounting & Payment",
        body: `${s(
          form.payment_terms,
          "accounting and payment terms"
        )}. Each statement shall itemize licenses, gross receipts, commissions, and recouped expenses. Producer shall have the right to audit Agent's books and records relating to the Film upon reasonable prior written notice, not more than once per calendar year.`,
      },
      {
        heading: "Deliverables",
        body: `Producer shall deliver, at Producer's cost, ${s(
          form.deliverables,
          "required deliverables"
        )}. Agent's obligations are conditioned upon Producer's timely delivery of such materials.`,
      },
      {
        heading: "Reversion & Termination",
        body: `${s(
          form.reversion,
          "reversion / termination"
        )}. Upon reversion or termination, Agent shall promptly return or transfer all delivery materials and provide Producer with a complete schedule of all licenses entered into during the Term, which licenses shall survive in accordance with their terms.`,
      },
      {
        heading: "Representations & Warranties",
        body: `Producer represents and warrants that it owns or controls the rights granted hereunder and has full authority to enter into this Agreement, free of any conflicting grant. Agent represents and warrants that it shall act in good faith and use commercially reasonable efforts to market and license the Film, and shall comply with all applicable laws in its performance hereunder.`,
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

    write("SALES AGENT AGREEMENT", 15, "bold", "center");
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
    write("SALES AGENT", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.agent_name, "sales agent / company")}`);
    write("Date: __________________________________");
    y += 8;
    ensure(30);
    write("PRODUCER", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.producer_name, "producer / rights holder")}`);
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
    const base = `${form.film_title || "Film"}_${form.agent_name || "Sales_Agent"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Sales_Agent_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Sales Agent Agreement</h1>
          <p className="text-muted-foreground">
            Appoint a sales agent to license and sell your film to distributors and markets.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers appointing a sales agent.</li>
                <li>Sales agents documenting their mandate.</li>
                <li>Anyone formalizing a sales representation deal.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Appoints the agent and sets exclusivity.</li>
                <li>Defines term, territory, commission, and expense cap.</li>
                <li>Sets deliverables, reporting, and reversion.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Consult an entertainment attorney before signing — sales
            agency terms (commission, expense caps, term, and reversion) materially affect recoupment.
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
                  <Label htmlFor="agent_name">Sales Agent / Company</Label>
                  <Input
                    id="agent_name"
                    value={form.agent_name}
                    onChange={(e) => set("agent_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="producer_name">Producer / Rights Holder</Label>
                  <Input
                    id="producer_name"
                    value={form.producer_name}
                    onChange={(e) => set("producer_name", e.target.value)}
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
                <div>
                  <Label htmlFor="delivery_status">Delivery Status (optional)</Label>
                  <Input
                    id="delivery_status"
                    placeholder="e.g., Delivered / In post"
                    value={form.delivery_status}
                    onChange={(e) => set("delivery_status", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment &amp; Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Appointment</Label>
                  <Select value={form.appointment} onValueChange={(val) => set("appointment", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPOINTMENT_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rights_granted">Rights / Media Licensed</Label>
                  <Textarea
                    id="rights_granted"
                    rows={3}
                    value={form.rights_granted}
                    onChange={(e) => set("rights_granted", e.target.value)}
                  />
                  {aiButton("rights_granted", "sales agent agreement — rights and media licensed")}
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
                  <Label htmlFor="term_length">Term</Label>
                  <Input
                    id="term_length"
                    value={form.term_length}
                    onChange={(e) => set("term_length", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission &amp; Expenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="commission_rate">Commission (%)</Label>
                  <Input
                    id="commission_rate"
                    placeholder="e.g., 20%"
                    value={form.commission_rate}
                    onChange={(e) => set("commission_rate", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Commission Basis</Label>
                  <Select value={form.commission_basis} onValueChange={(val) => set("commission_basis", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select basis" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMISSION_BASIS_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expense_cap">Marketing / Expense Cap (USD)</Label>
                  <Input
                    id="expense_cap"
                    placeholder="e.g., $50,000"
                    value={form.expense_cap}
                    onChange={(e) => set("expense_cap", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mg">Minimum Guarantee / Advance (if any)</Label>
                  <Input
                    id="mg"
                    placeholder="Optional"
                    value={form.mg}
                    onChange={(e) => set("mg", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_terms">Accounting &amp; Payment Terms</Label>
                  <Textarea
                    id="payment_terms"
                    rows={3}
                    value={form.payment_terms}
                    onChange={(e) => set("payment_terms", e.target.value)}
                  />
                  {aiButton("payment_terms", "sales agent agreement — accounting and payment terms")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deliverables &amp; Reversion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deliverables">Required Deliverables</Label>
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
                  {aiButton("reversion", "sales agent agreement — reversion and termination")}
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
                  placeholder="Approvals, holdbacks, market attendance, collection account, arbitration…"
                  value={additionalTerms}
                  onChange={(e) => setAdditionalTerms(e.target.value)}
                />
                {aiButton("additional_terms", "sales agent agreement — additional terms")}
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
                  <h2 className="mb-4 text-center text-lg font-bold">SALES AGENT AGREEMENT</h2>
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
                      <p className="font-bold">SALES AGENT</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.agent_name, "sales agent / company")}</p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                    <div>
                      <p className="font-bold">PRODUCER</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.producer_name, "producer / rights holder")}</p>
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

export default SalesAgentAgreement;
