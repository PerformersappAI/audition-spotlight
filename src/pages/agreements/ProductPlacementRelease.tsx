import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Download, Loader2, Printer, RotateCcw, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface ProductPlacementReleaseForm {
  brand_name: string;
  brand_contact: string;
  producer_name: string;
  effective_date: string;
  product_description: string;
  trademarks: string;
  project_title: string;
  project_type: string;
  use_description: string;
  portrayal: string;
  arrangement_type: string;
  consideration: string;
  disclosure: boolean;
  approval_rights: string;
  media: string;
  territory: string;
  term_length: string;
  credit_text: string;
}

const INITIAL_FORM: ProductPlacementReleaseForm = {
  brand_name: "",
  brand_contact: "",
  producer_name: "",
  effective_date: "",
  product_description: "",
  trademarks: "",
  project_title: "",
  project_type: "Feature Film",
  use_description: "",
  portrayal: "Neutral / Favorable only",
  arrangement_type: "No fee (clearance only)",
  consideration: "",
  disclosure: false,
  approval_rights: "No approval required",
  media: "Festivals, theatrical, streaming, home video, promotional",
  territory: "Worldwide",
  term_length: "In perpetuity",
  credit_text: "",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. This product placement release confirms permission to depict a branded product, logo, or trademark in a film or media project. Depicting a real brand can raise trademark, disparagement, and false endorsement issues, and paid placement may trigger sponsorship disclosure or other regulatory requirements. Consult a qualified entertainment attorney before executing this agreement.";

const PROJECT_OPTIONS = ["Feature Film", "Short Film", "Documentary", "Series", "Commercial", "Trailer"];
const PORTRAYAL_OPTIONS = ["Neutral / Favorable only", "No restriction on portrayal"];
const ARRANGEMENT_OPTIONS = [
  "No fee (clearance only)",
  "Paid placement",
  "Provided goods / free product",
  "Barter / promotional",
];
const APPROVAL_OPTIONS = ["No approval required", "Grantor may approve depiction before release"];
const TERRITORY_OPTIONS = ["Worldwide", "United States", "North America"];

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
type AiField = "product_description" | "use_description" | "consideration" | "additional_terms";

const ProductPlacementRelease = () => {
  const [form, setForm] = useState<ProductPlacementReleaseForm>(INITIAL_FORM);
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [projectChoice, setProjectChoice] = useState("Feature Film");
  const [territoryChoice, setTerritoryChoice] = useState("Worldwide");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof ProductPlacementReleaseForm>(key: K, value: ProductPlacementReleaseForm[K]) =>
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
    setProjectChoice("Feature Film");
    setTerritoryChoice("Worldwide");
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const s = (value: string, placeholder: string) => v(value, placeholder).replace(/[.;,]+$/, "");

  const intro = `This Product Placement Release ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.brand_name, "brand / company")} ("Grantor") and ${v(
    form.producer_name,
    "producer / company"
  )} ("Producer"), with reference to the motion picture or program presently entitled "${v(
    form.project_title,
    "project title"
  )}" (the "Project").`;

  const clauses: Clause[] = useMemo(() => {
    const projectType = projectChoice === "Other" ? form.project_type : projectChoice;
    const territory = territoryChoice === "Other" ? form.territory : territoryChoice;
    const isNeutral = form.portrayal === "Neutral / Favorable only";
    const isPaid = form.arrangement_type === "Paid placement";
    const needsApproval = form.approval_rights === "Grantor may approve depiction before release";

    return [
      {
        heading: "Grant of Rights",
        body: `Grantor grants Producer the non-exclusive, irrevocable right to depict, display, and reproduce the Product/Mark described below in the Project "${v(
          form.project_title,
          "project title"
        )}", a ${v(projectType, "project type")}, and in its advertising, promotion, and exploitation in all media now known or hereafter devised.`,
      },
      {
        heading: "The Product / Mark",
        body: `The Product / Mark consists of: ${s(form.product_description, "description of product / mark")}.${
          form.trademarks.trim() ? ` Trademarks and logos covered: ${form.trademarks.trim()}.` : ""
        }`,
      },
      {
        heading: "Use & Portrayal",
        body: `The Product / Mark shall appear in the Project as follows: ${s(
          form.use_description,
          "description of use"
        )}. ${
          isNeutral
            ? "The Product shall be depicted in a neutral or favorable manner and not in a defamatory, disparaging, or unlawful context."
            : "No restriction is placed on the manner of portrayal beyond compliance with applicable law."
        }`,
      },
      {
        heading: "Arrangement & Consideration",
        body: `The arrangement between the parties is: ${form.arrangement_type}. Consideration: ${s(
          form.consideration,
          "consideration / what is provided"
        )}.${
          form.disclosure
            ? " The parties acknowledge that the placement may be subject to applicable sponsorship, disclosure, or advertising requirements."
            : ""
        }`,
      },
      {
        heading: "Approval",
        body: needsApproval
          ? "Grantor shall have the right to approve the depiction of the Product prior to release of the Project, such approval not to be unreasonably withheld or delayed."
          : "Grantor waives any right of approval over the final Project and any excerpts or promotional materials, provided Producer's use remains consistent with the terms of this Agreement.",
      },
      {
        heading: "Media, Territory & Term",
        body: `The rights granted herein apply to the following media: ${s(
          form.media,
          "media / platforms"
        )}; territory: ${v(territory, "territory")}; and term: ${v(form.term_length, "term")}.`,
      },
      {
        heading: "Credit",
        body: form.credit_text.trim()
          ? `Producer shall accord Grantor credit substantially as follows: ${form.credit_text.trim()}. Casual or inadvertent failure to comply shall not constitute a breach of this Agreement.`
          : "No specific credit is required by this Agreement.",
      },
      {
        heading: "Representations & Warranties",
        body: `Grantor represents and warrants that Grantor owns or controls the Product, trademarks, and the rights granted herein, and that this grant does not infringe upon the right of any third party. Producer's depiction of the Product shall not imply Grantor's endorsement beyond the scope agreed in this Agreement. Grantor agrees to indemnify Producer for any breach of the foregoing representations and warranties.`,
      },
      {
        heading: "Additional Terms",
        body: v(additionalTerms, "additional terms"),
      },
    ];
  }, [form, additionalTerms, projectChoice, territoryChoice]);

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

    write("PRODUCT PLACEMENT RELEASE", 15, "bold", "center");
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
    write("BRAND / COMPANY (GRANTOR)", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.brand_contact, "signatory name & title")}`);
    write(`Company: ${v(form.brand_name, "brand / company")}`);
    write("Date: __________________________________");
    y += 8;
    ensure(30);
    write("PRODUCER", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.producer_name, "producer / company")}`);
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
    const base = `${form.project_title || "Project"}_${form.brand_name || "Brand"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Product_Placement_Release.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Product Placement Release</h1>
          <p className="text-muted-foreground">
            Get permission to feature a branded product, logo, or trademark on screen.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers featuring a real product or brand on screen.</li>
                <li>Brands/companies granting depiction rights.</li>
                <li>Prop and clearance teams documenting placements.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Grants the right to depict a product, logo, or trademark.</li>
                <li>Records whether it's paid, gratis, or provided goods.</li>
                <li>Sets approval, credit, and warranties.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Consult an entertainment attorney before signing. Depicting a
            brand can raise trademark and disparagement issues, and paid placement may trigger disclosure or
            sponsorship rules.
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
                  <Label htmlFor="brand_name">Brand / Company (Grantor)</Label>
                  <Input
                    id="brand_name"
                    value={form.brand_name}
                    onChange={(e) => set("brand_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="brand_contact">Signatory Name &amp; Title (optional)</Label>
                  <Input
                    id="brand_contact"
                    placeholder="e.g., Jane Doe, Brand Manager"
                    value={form.brand_contact}
                    onChange={(e) => set("brand_contact", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="producer_name">Producer / Company</Label>
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
                <CardTitle>The Product / Mark</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="product_description">Product / Brand / Mark Description</Label>
                  <Textarea
                    id="product_description"
                    rows={3}
                    placeholder='e.g., "Acme Cola 12oz can and Acme logo"'
                    value={form.product_description}
                    onChange={(e) => set("product_description", e.target.value)}
                  />
                  {aiButton("product_description", "product placement release — product / brand description")}
                </div>
                <div>
                  <Label htmlFor="trademarks">Trademarks / Logos Covered (optional)</Label>
                  <Input
                    id="trademarks"
                    value={form.trademarks}
                    onChange={(e) => set("trademarks", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use &amp; Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project_title">Film / Project Title</Label>
                  <Input
                    id="project_title"
                    value={form.project_title}
                    onChange={(e) => set("project_title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Project Type</Label>
                  <Select
                    value={projectChoice}
                    onValueChange={(val) => {
                      setProjectChoice(val);
                      set("project_type", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {projectChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., Web Series / Music Video"
                      value={form.project_type}
                      onChange={(e) => set("project_type", e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="use_description">How the product appears (scene / context)</Label>
                  <Textarea
                    id="use_description"
                    rows={3}
                    placeholder='e.g., "Hero holds the can during kitchen scene, logo clearly visible"'
                    value={form.use_description}
                    onChange={(e) => set("use_description", e.target.value)}
                  />
                  {aiButton("use_description", "product placement release — how the product appears")}
                </div>
                <div>
                  <Label>Portrayal</Label>
                  <Select value={form.portrayal} onValueChange={(val) => set("portrayal", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select portrayal" />
                    </SelectTrigger>
                    <SelectContent>
                      {PORTRAYAL_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Arrangement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Arrangement Type</Label>
                  <Select value={form.arrangement_type} onValueChange={(val) => set("arrangement_type", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select arrangement" />
                    </SelectTrigger>
                    <SelectContent>
                      {ARRANGEMENT_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="consideration">Consideration / What's Provided</Label>
                  <Textarea
                    id="consideration"
                    rows={3}
                    placeholder='e.g., "$5,000 fee" or "Product supplied at no charge"'
                    value={form.consideration}
                    onChange={(e) => set("consideration", e.target.value)}
                  />
                  {aiButton("consideration", "product placement release — consideration / what's provided")}
                </div>
                <div className="flex items-start space-x-3 rounded-md border p-3">
                  <Checkbox
                    id="disclosure"
                    checked={form.disclosure}
                    onCheckedChange={(checked) => set("disclosure", checked === true)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="disclosure">Paid/sponsored — disclosure may be required</Label>
                    <p className="text-xs text-muted-foreground">
                      Check if this is a paid or sponsored placement that may require disclosure.
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Approval Rights</Label>
                  <Select value={form.approval_rights} onValueChange={(val) => set("approval_rights", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select approval rights" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPROVAL_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grant of Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="media">Media / Platforms</Label>
                  <Textarea
                    id="media"
                    rows={2}
                    value={form.media}
                    onChange={(e) => set("media", e.target.value)}
                  />
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
                      {TERRITORY_OPTIONS.map((o) => (
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
                      placeholder="e.g., European Union"
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
                <CardTitle>Credit &amp; Additional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="credit_text">Credit / Acknowledgement (optional)</Label>
                  <Textarea
                    id="credit_text"
                    rows={2}
                    placeholder='e.g., "Product placement courtesy of [Brand]"'
                    value={form.credit_text}
                    onChange={(e) => set("credit_text", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="additional_terms">Additional Terms</Label>
                  <Textarea
                    id="additional_terms"
                    rows={4}
                    placeholder="Exclusivity, category exclusivity, sequels/re-use, removal obligations…"
                    value={additionalTerms}
                    onChange={(e) => setAdditionalTerms(e.target.value)}
                  />
                  {aiButton("additional_terms", "product placement release — additional terms")}
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
                  <h2 className="mb-4 text-center text-lg font-bold">PRODUCT PLACEMENT RELEASE</h2>
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
                      <p className="font-bold">BRAND / COMPANY (GRANTOR)</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.brand_contact, "signatory name & title")}</p>
                      <p className="mt-2">Company: {v(form.brand_name, "brand / company")}</p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                    <div>
                      <p className="font-bold">PRODUCER</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.producer_name, "producer / company")}</p>
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

export default ProductPlacementRelease;
