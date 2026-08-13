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

interface KitBoxRentalForm {
  production_name: string;
  company: string;
  owner_name: string;
  position: string;
  effective_date: string;
  equipment_list: string;
  replacement_value: string;
  rental_rate: string;
  rental_period: string;
  additional_provisions: string;
  governing_law: string;
}

const INITIAL_FORM: KitBoxRentalForm = {
  production_name: "",
  company: "",
  owner_name: "",
  position: "",
  effective_date: "",
  equipment_list: "",
  replacement_value: "",
  rental_rate: "",
  rental_period: "",
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
type AiField = "equipment_list" | "additional_provisions";

const KitBoxRentalAgreement = () => {
  const [form, setForm] = useState<KitBoxRentalForm>(INITIAL_FORM);
  const [govChoice, setGovChoice] = useState<string>("the State of California");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof KitBoxRentalForm>(key: K, value: KitBoxRentalForm[K]) =>
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

  const intro = `This Kit / Box Rental Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.company, "producer / company")} and ${v(form.owner_name, "equipment owner")}.`;

  const clauses: Clause[] = [
    {
      heading: "Rental of Equipment",
      body: `${v(form.company, "producer / company")} ("Company") hereby rents from ${v(
        form.owner_name,
        "equipment owner"
      )} ("Owner") the equipment listed below for use in connection with the production presently entitled ${v(
        form.production_name,
        "production name"
      )}: ${v(form.equipment_list, "equipment list")}.${
        form.replacement_value.trim()
          ? ` The parties agree the total estimated replacement value of the equipment is ${form.replacement_value.trim()}.`
          : ""
      }`,
    },
    {
      heading: "Rental Rate & Term",
      body: `Company shall pay Owner a rental rate of ${v(
        form.rental_rate,
        "rental rate"
      )} for the rental period of ${v(
        form.rental_period,
        "rental period"
      )}. Rental amounts shall be paid through Company's standard payroll or accounts-payable process.`,
    },
    {
      heading: "Loss & Damage",
      body: "Company shall be responsible for loss of or damage to the equipment (beyond ordinary wear and tear) occurring during the rental period while in Company's care, up to the equipment's replacement value. Owner shall deliver the equipment to Company in good working order. At the end of the rental period, Company shall return the equipment to Owner in substantially the same condition as received, ordinary wear and tear excepted.",
    },
    {
      heading: "Ownership",
      body: "The equipment remains the sole property of Owner at all times. Nothing herein transfers title to Company. The equipment is not a work made for hire and shall not be considered part of the results and proceeds of any services rendered by Owner to Company.",
    },
    {
      heading: "Representations & Warranties",
      body: "Owner represents and warrants that Owner owns or has the right to rent the equipment to Company and that the equipment is in good working condition at the time of delivery. The parties shall comply with all applicable laws and with Company's reasonable safety and on-set policies.",
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

    write("KIT / BOX RENTAL AGREEMENT", 16, "bold", "center");
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
    write("COMPANY", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.company, "producer / company")}`);
    write("Date: __________________________________");
    y += 8;
    write("EQUIPMENT OWNER", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.owner_name, "equipment owner")}`);
    write("Date: __________________________________");
    y += 12;
    doc.setTextColor(120, 120, 120);
    write(DISCLAIMER, 8, "italic");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = `${form.production_name || "KitRental"}_${form.owner_name || "Agreement"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Kit_Box_Rental_Agreement.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Kit / Box Rental Agreement</h1>
          <p className="text-muted-foreground">
            Rent a crew member's owned equipment — items, rate, and loss/damage terms.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Productions renting gear owned by crew.</li>
                <li>UPMs documenting kit and box rentals.</li>
                <li>Crew members renting their own equipment.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists the rented kit and its replacement value.</li>
                <li>Sets the rental rate and period.</li>
                <li>Fixes responsibility for loss and damage.</li>
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
                  <Label htmlFor="owner_name">Equipment Owner (Crew Member)</Label>
                  <Input
                    id="owner_name"
                    value={form.owner_name}
                    onChange={(e) => set("owner_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position (optional)</Label>
                  <Input
                    id="position"
                    placeholder="e.g., Gaffer"
                    value={form.position}
                    onChange={(e) => set("position", e.target.value)}
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
                <CardTitle>Rental</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="equipment_list">Equipment List</Label>
                  <Textarea
                    id="equipment_list"
                    rows={4}
                    placeholder="List each item and its estimated replacement value…"
                    value={form.equipment_list}
                    onChange={(e) => set("equipment_list", e.target.value)}
                  />
                  {aiButton("equipment_list", "kit rental agreement — equipment list")}
                </div>
                <div>
                  <Label htmlFor="replacement_value">Total Replacement Value (optional)</Label>
                  <Input
                    id="replacement_value"
                    placeholder="$8,000"
                    value={form.replacement_value}
                    onChange={(e) => set("replacement_value", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rental_rate">Rental Rate</Label>
                  <Input
                    id="rental_rate"
                    placeholder="$50 / day"
                    value={form.rental_rate}
                    onChange={(e) => set("rental_rate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rental_period">Rental Period</Label>
                  <Input
                    id="rental_period"
                    placeholder="Duration of principal photography, Aug 13–17, 2026"
                    value={form.rental_period}
                    onChange={(e) => set("rental_period", e.target.value)}
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
                    rows={4}
                    placeholder="Insurance, consumables, special handling…"
                    value={form.additional_provisions}
                    onChange={(e) => set("additional_provisions", e.target.value)}
                  />
                  {aiButton("additional_provisions", "kit rental agreement — additional provisions")}
                </div>
                <div>
                  <Label>Governing Law</Label>
                  <Select
                    value={govChoice}
                    onValueChange={(val) => {
                      setGovChoice(val);
                      if (val !== "Other") set("governing_law", val);
                      else set("governing_law", "");
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
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {govChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., the State of Texas"
                      value={form.governing_law}
                      onChange={(e) => set("governing_law", e.target.value)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
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
                  <h2 className="mb-4 text-center text-lg font-bold">KIT / BOX RENTAL AGREEMENT</h2>
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
                      <p className="font-bold">COMPANY</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">
                        Printed Name: {v(form.company, "producer / company")}
                      </p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                    <div>
                      <p className="font-bold">EQUIPMENT OWNER</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.owner_name, "equipment owner")}</p>
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

export default KitBoxRentalAgreement;
