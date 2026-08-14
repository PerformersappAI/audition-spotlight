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

interface MaterialsArtworkReleaseForm {
  grantor_name: string;
  grantor_entity_type: string;
  producer_name: string;
  effective_date: string;
  material_type: string;
  material_description: string;
  creator_author: string;
  copyright_owner: string;
  project_title: string;
  project_type: string;
  use_description: string;
  media: string;
  territory: string;
  term_length: string;
  fee_amount: string;
  payment_terms: string;
  credit_text: string;
}

const INITIAL_FORM: MaterialsArtworkReleaseForm = {
  grantor_name: "",
  grantor_entity_type: "Individual",
  producer_name: "",
  effective_date: "",
  material_type: "Artwork",
  material_description: "",
  creator_author: "",
  copyright_owner: "",
  project_title: "",
  project_type: "Feature Film",
  use_description: "",
  media: "Festivals, theatrical, streaming, home video, promotional",
  territory: "Worldwide",
  term_length: "In perpetuity",
  fee_amount: "",
  payment_terms: "",
  credit_text: "",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. This materials / artwork release confirms permission to depict or reproduce specific artwork, photographs, documents, or other materials in a film or media project. Clearing a physical artwork may require BOTH the owner's permission AND the underlying copyright holder's permission if they differ. Consult a qualified entertainment attorney before executing this agreement.";

const ENTITY_OPTIONS = ["Individual", "Company", "Estate or Trust", "Archive or Library"];
const MATERIAL_OPTIONS = [
  "Artwork",
  "Photograph",
  "Illustration",
  "Archival Footage",
  "Document",
  "Poster",
  "Logo or Signage",
];
const PROJECT_OPTIONS = ["Feature Film", "Short Film", "Documentary", "Series", "Trailer"];
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
type AiField = "material_description" | "use_description" | "payment_terms" | "additional_terms";

const MaterialsArtworkRelease = () => {
  const [form, setForm] = useState<MaterialsArtworkReleaseForm>(INITIAL_FORM);
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [entityChoice, setEntityChoice] = useState("Individual");
  const [materialChoice, setMaterialChoice] = useState("Artwork");
  const [projectChoice, setProjectChoice] = useState("Feature Film");
  const [territoryChoice, setTerritoryChoice] = useState("Worldwide");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof MaterialsArtworkReleaseForm>(key: K, value: MaterialsArtworkReleaseForm[K]) =>
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
    setEntityChoice("Individual");
    setMaterialChoice("Artwork");
    setProjectChoice("Feature Film");
    setTerritoryChoice("Worldwide");
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const s = (value: string, placeholder: string) => v(value, placeholder).replace(/[.;,]+$/, "");

  const intro = `This Materials / Artwork Release ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.grantor_name, "owner / rights holder")} ("Owner") and ${v(
    form.producer_name,
    "producer / company"
  )} ("Producer"), with reference to the motion picture or program presently entitled "${v(
    form.project_title,
    "project title"
  )}" (the "Project").`;

  const clauses: Clause[] = useMemo(() => {
    const materialType = materialChoice === "Other" ? form.material_type : materialChoice;
    const projectType = projectChoice === "Other" ? form.project_type : projectChoice;
    const territory = territoryChoice === "Other" ? form.territory : territoryChoice;
    const hasFee = form.fee_amount.trim();
    const hasCreator = form.creator_author.trim();
    const hasCopyright = form.copyright_owner.trim();

    return [
      {
        heading: "Grant of License",
        body: `Owner grants Producer the non-exclusive, irrevocable right to photograph, reproduce, and display the Material described below in the Project "${v(
          form.project_title,
          "project title"
        )}", a ${v(projectType, "project type")}.`,
      },
      {
        heading: "The Material",
        body: `The Material consists of ${v(materialType, "material type")}: ${s(
          form.material_description,
          "description of material"
        )}.${hasCreator ? ` The Material was created by ${form.creator_author.trim()}.` : ""}${
          hasCopyright
            ? ` Copyright in the Material is owned by ${form.copyright_owner.trim()}.`
            : hasCreator
            ? " Copyright in the Material is owned by Owner."
            : ""
        }`,
      },
      {
        heading: "Use",
        body: `The Material shall appear in the Project as follows: ${s(form.use_description, "description of use")}.`,
      },
      {
        heading: "Media, Territory & Term",
        body: `The rights granted herein apply to the following media: ${s(
          form.media,
          "media / platforms"
        )}; territory: ${v(territory, "territory")}; and term: ${v(form.term_length, "term")}.`,
      },
      {
        heading: "Fee",
        body: hasFee
          ? `Producer shall pay Owner a fee of ${form.fee_amount.trim()}. ${s(
              form.payment_terms,
              "payment terms"
            )}.`
          : `The Material is cleared at no fee (gratis). ${s(
              form.payment_terms,
              "payment terms"
            )}`.trim(),
      },
      {
        heading: "Credit",
        body: form.credit_text.trim()
          ? `Producer shall accord Owner credit substantially as follows: ${form.credit_text.trim()}. Casual or inadvertent failure to comply shall not constitute a breach of this Agreement.`
          : "No specific credit is required by this Agreement, though Producer may accord courtesy credit at its discretion.",
      },
      {
        heading: "Representations & Warranties",
        body: `Owner represents and warrants that Owner owns or controls the Material and the rights granted herein, and that this grant does not infringe upon the copyright, trademark, or any other right of any third party. Where the underlying copyright or other rights are held by a party other than Owner, Owner's grant is limited to Owner's rights in the Material, and Producer is responsible for any separate copyright or rights clearance required for use of the Material in the Project. Owner agrees to indemnify Producer for any breach of the foregoing representations and warranties.`,
      },
      {
        heading: "Additional Terms",
        body: v(additionalTerms, "additional terms"),
      },
    ];
  }, [form, additionalTerms, materialChoice, projectChoice, territoryChoice]);

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

    write("MATERIALS / ARTWORK RELEASE", 15, "bold", "center");
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
    write("OWNER / RIGHTS HOLDER", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.grantor_name, "owner / rights holder")}`);
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
    const base = `${form.project_title || "Project"}_${form.grantor_name || "Owner"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Materials_Artwork_Release.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Materials / Artwork Release</h1>
          <p className="text-muted-foreground">
            Clear artwork, photos, or archival materials to appear on screen in your film.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers clearing artwork, photos, or footage shown on screen.</li>
                <li>Owners/rights holders granting permission to depict their material.</li>
                <li>Post/clearance teams building the clearance file.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Grants the right to reproduce specific material in the project.</li>
                <li>Describes the material and how it appears.</li>
                <li>Sets credit, fee, and warranties.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Consult an entertainment attorney before signing. Clearing a
            physical artwork may require BOTH the owner's permission AND the underlying copyright holder's permission
            if they differ.
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
                  <Label htmlFor="grantor_name">Owner / Rights Holder</Label>
                  <Input
                    id="grantor_name"
                    value={form.grantor_name}
                    onChange={(e) => set("grantor_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Entity Type</Label>
                  <Select
                    value={entityChoice}
                    onValueChange={(val) => {
                      setEntityChoice(val);
                      set("grantor_entity_type", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ENTITY_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {entityChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., Museum / Gallery"
                      value={form.grantor_entity_type}
                      onChange={(e) => set("grantor_entity_type", e.target.value)}
                    />
                  )}
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
                <CardTitle>The Material</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Material Type</Label>
                  <Select
                    value={materialChoice}
                    onValueChange={(val) => {
                      setMaterialChoice(val);
                      set("material_type", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIAL_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {materialChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., Sculpture / Mural"
                      value={form.material_type}
                      onChange={(e) => set("material_type", e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="material_description">Description of Material</Label>
                  <Textarea
                    id="material_description"
                    rows={3}
                    placeholder='e.g., "Oil painting Harbor at Dawn, 1962, 24x36in"'
                    value={form.material_description}
                    onChange={(e) => set("material_description", e.target.value)}
                  />
                  {aiButton("material_description", "materials/artwork release — description of material")}
                </div>
                <div>
                  <Label htmlFor="creator_author">Creator / Artist / Author (optional)</Label>
                  <Input
                    id="creator_author"
                    value={form.creator_author}
                    onChange={(e) => set("creator_author", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="copyright_owner">Copyright Owner (if different from Owner)</Label>
                  <Input
                    id="copyright_owner"
                    value={form.copyright_owner}
                    onChange={(e) => set("copyright_owner", e.target.value)}
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
                      placeholder="e.g., Commercial / Music Video"
                      value={form.project_type}
                      onChange={(e) => set("project_type", e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="use_description">How the Material appears (scene / context)</Label>
                  <Textarea
                    id="use_description"
                    rows={3}
                    placeholder='e.g., "Hanging in the protagonist apartment, visible in wide shots during scenes 12 and 15"'
                    value={form.use_description}
                    onChange={(e) => set("use_description", e.target.value)}
                  />
                  {aiButton("use_description", "materials/artwork release — how the material appears")}
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
                <CardTitle>Fee &amp; Credit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fee_amount">Fee (USD) — leave blank for gratis</Label>
                  <Input
                    id="fee_amount"
                    placeholder="No fee / gratis"
                    value={form.fee_amount}
                    onChange={(e) => set("fee_amount", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_terms">Payment Terms (optional)</Label>
                  <Textarea
                    id="payment_terms"
                    rows={3}
                    value={form.payment_terms}
                    onChange={(e) => set("payment_terms", e.target.value)}
                  />
                  {aiButton("payment_terms", "materials/artwork release — payment terms")}
                </div>
                <div>
                  <Label htmlFor="credit_text">Credit / Courtesy Line (optional)</Label>
                  <Textarea
                    id="credit_text"
                    rows={2}
                    placeholder="e.g., Artwork courtesy of [Owner]"
                    value={form.credit_text}
                    onChange={(e) => set("credit_text", e.target.value)}
                  />
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
                  placeholder="Attribution requirements, exclusivity, sequels/re-use, removal obligations…"
                  value={additionalTerms}
                  onChange={(e) => setAdditionalTerms(e.target.value)}
                />
                {aiButton("additional_terms", "materials/artwork release — additional terms")}
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
                  <h2 className="mb-4 text-center text-lg font-bold">MATERIALS / ARTWORK RELEASE</h2>
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
                      <p className="font-bold">OWNER / RIGHTS HOLDER</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.grantor_name, "owner / rights holder")}</p>
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

export default MaterialsArtworkRelease;
