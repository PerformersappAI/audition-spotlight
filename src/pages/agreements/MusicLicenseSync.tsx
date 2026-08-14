import { useMemo, useState } from "react";
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

interface MusicLicenseForm {
  licensor_name: string;
  licensor_entity_type: string;
  licensee_name: string;
  effective_date: string;
  work_title: string;
  writers: string;
  publisher: string;
  master_owner: string;
  performer: string;
  project_title: string;
  project_type: string;
  duration_used: string;
  scene_use: string;
  rights_granted: string;
  exclusivity: string;
  media: string;
  territory: string;
  term_length: string;
  license_fee: string;
  payment_terms: string;
  credit_text: string;
  mfn: boolean;
}

const INITIAL_FORM: MusicLicenseForm = {
  licensor_name: "",
  licensor_entity_type: "Individual",
  licensee_name: "",
  effective_date: "",
  work_title: "",
  writers: "",
  publisher: "",
  master_owner: "",
  performer: "",
  project_title: "",
  project_type: "Feature Film",
  duration_used: "",
  scene_use: "",
  rights_granted: "Sync + Master (both)",
  exclusivity: "Non-Exclusive",
  media: "Festivals, theatrical, streaming, home video, promotional",
  territory: "Worldwide",
  term_length: "In perpetuity",
  license_fee: "",
  payment_terms: "",
  credit_text: "",
  mfn: false,
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. Sync licensing generally requires BOTH the composition (publishing) rights and the master recording rights. Consult a qualified entertainment attorney before executing this agreement.";

const ENTITY_OPTIONS = ["Individual", "Loan-out or Company", "Publisher", "Record Label"];
const PROJECT_TYPES = ["Feature Film", "Short Film", "Documentary", "Series", "Trailer"];
const RIGHTS_OPTIONS = ["Sync only (composition)", "Sync + Master (both)", "Master only"];
const EXCLUSIVITY_OPTIONS = ["Non-Exclusive", "Exclusive"];
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
type AiField = "scene_use" | "payment_terms" | "additional_terms";

const MusicLicenseSync = () => {
  const [form, setForm] = useState<MusicLicenseForm>(INITIAL_FORM);
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [entityChoice, setEntityChoice] = useState("Individual");
  const [projectChoice, setProjectChoice] = useState("Feature Film");
  const [territoryChoice, setTerritoryChoice] = useState("Worldwide");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof MusicLicenseForm>(key: K, value: MusicLicenseForm[K]) =>
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
    setProjectChoice("Feature Film");
    setTerritoryChoice("Worldwide");
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

  // Strips trailing sentence punctuation so template sentences never double up on periods.
  const s = (value: string, placeholder: string) => v(value, placeholder).replace(/[.;,]+$/, "");

  const intro = `This Music License / Synchronization Agreement ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.licensor_name, "licensor")} (${v(
    form.licensor_entity_type,
    "entity type"
  )}) ("Licensor") and ${v(form.licensee_name, "licensee")} ("Licensee").`;

  const clauses: Clause[] = useMemo(() => {
    const includesSync = form.rights_granted !== "Master only";
    const includesMaster = form.rights_granted !== "Sync only (composition)";

    const list: Clause[] = [
      {
        heading: "Grant of License",
        body: `Licensor hereby grants Licensee the ${form.exclusivity.toLowerCase()} right and license to record, dub, and synchronize the musical work titled "${v(
          form.work_title,
          "song / composition title"
        )}", written and composed by ${v(form.writers, "writer(s) / composer(s)")} and published by ${v(
          form.publisher,
          "publisher"
        )}, in timed relation with the audiovisual production presently entitled "${v(
          form.project_title,
          "project title"
        )}" (the "Project"). The rights granted hereunder consist of: ${v(
          form.rights_granted,
          "rights granted"
        )}.`,
      },
      {
        heading: "Term & Territory",
        body: `The term of this license shall be ${v(
          form.term_length,
          "term / duration of license"
        )}, throughout ${v(form.territory, "territory")}.`,
      },
      {
        heading: "Media & Platforms",
        body: `The license granted herein extends to the following media and platforms: ${v(
          form.media,
          "media / platforms"
        )}.`,
      },
      {
        heading: "Use in Project",
        body: `The Project is a ${v(form.project_type, "project type")}. The work shall be used as follows: ${s(
          form.scene_use,
          "how the music is used"
        )}. The approximate duration of use is ${v(form.duration_used, "duration used")}.`,
      },
      {
        heading: "Master Recording",
        body: includesMaster
          ? `The license granted herein includes the master recording of the work as performed by ${v(
              form.performer,
              "artist / performer"
            )}, the master rights to which are owned or controlled by ${v(
              form.master_owner,
              "master recording owner"
            )}. Licensor warrants that it is authorized to grant such master use rights.`
          : `This Agreement grants synchronization rights in the composition only. No rights in or to any master recording are granted hereunder, and Licensee shall be solely responsible for separately clearing master recording rights with the applicable master owner prior to any use.`,
      },
      {
        heading: "License Fee & Payment",
        body: `In consideration of the rights granted herein, Licensee shall pay Licensor a license fee of ${v(
          form.license_fee,
          "license fee (USD)"
        )}. Payment terms: ${s(form.payment_terms, "payment terms")}.${
          form.mfn
            ? " This license is granted on a Most-Favored-Nations (MFN) basis with all other music licenses granted for the Project."
            : ""
        }${
          includesSync && includesMaster
            ? " The fee stated above covers both the synchronization and master use rights granted hereunder."
            : ""
        }`,
      },
      {
        heading: "Credit",
        body: form.credit_text.trim()
          ? form.credit_text.trim()
          : "No specific credit is required, though Licensee may accord credit in the Project's end titles at its discretion.",
      },
      {
        heading: "Representations & Warranties",
        body: `Licensor represents and warrants that it owns or controls the rights granted hereunder and has full right, power, and authority to enter into this Agreement and to grant such rights, and that the exercise of the rights granted herein will not infringe upon the rights of any third party.`,
      },
      {
        heading: "Additional Terms",
        body: v(additionalTerms, "additional terms"),
      },
    ];

    return list;
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

    write("MUSIC LICENSE / SYNCHRONIZATION AGREEMENT", 15, "bold", "center");
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
    write(`Printed Name: ${v(form.licensor_name, "licensor")}`);
    write("Date: __________________________________");
    y += 8;
    ensure(30);
    write("LICENSEE", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.licensee_name, "licensee")}`);
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
    const base = `${form.project_title || "Project"}_${form.work_title || "Music"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Music_License.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Music License / Sync Agreement</h1>
          <p className="text-muted-foreground">
            License a song or composition to synchronize with your film — sync and (optionally) master rights.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Filmmakers licensing existing music for their project.</li>
                <li>Composers and rights holders granting sync rights.</li>
                <li>Music supervisors documenting a clearance.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Grants the right to synchronize a work with picture.</li>
                <li>Defines media, term, territory, and fee.</li>
                <li>Records whether master rights are included.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Consult an entertainment attorney before signing. Note that
            sync licensing often requires BOTH the composition (publishing) rights and the master recording
            rights — two separate clearances.
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
                  <Label htmlFor="licensor_name">Licensor (Rights Holder)</Label>
                  <Input
                    id="licensor_name"
                    value={form.licensor_name}
                    onChange={(e) => set("licensor_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Licensor Entity Type</Label>
                  <Select
                    value={entityChoice}
                    onValueChange={(val) => {
                      setEntityChoice(val);
                      set("licensor_entity_type", val === "Other" ? "" : val);
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
                      placeholder="e.g., Estate / Trust"
                      value={form.licensor_entity_type}
                      onChange={(e) => set("licensor_entity_type", e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="licensee_name">Licensee (Producer / Company)</Label>
                  <Input
                    id="licensee_name"
                    value={form.licensee_name}
                    onChange={(e) => set("licensee_name", e.target.value)}
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
                <CardTitle>The Work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="work_title">Song / Composition Title</Label>
                  <Input
                    id="work_title"
                    value={form.work_title}
                    onChange={(e) => set("work_title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="writers">Writer(s) / Composer(s)</Label>
                  <Input id="writers" value={form.writers} onChange={(e) => set("writers", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={form.publisher}
                    onChange={(e) => set("publisher", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="master_owner">Master Recording Owner (optional)</Label>
                  <Input
                    id="master_owner"
                    value={form.master_owner}
                    onChange={(e) => set("master_owner", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="performer">Artist / Performer (optional)</Label>
                  <Input
                    id="performer"
                    value={form.performer}
                    onChange={(e) => set("performer", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project</CardTitle>
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
                      {PROJECT_TYPES.map((o) => (
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
                      placeholder="e.g., Music Video"
                      value={form.project_type}
                      onChange={(e) => set("project_type", e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="duration_used">Duration Used (e.g. 0:45)</Label>
                  <Input
                    id="duration_used"
                    placeholder="0:45"
                    value={form.duration_used}
                    onChange={(e) => set("duration_used", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="scene_use">How the music is used (scene / context)</Label>
                  <Textarea
                    id="scene_use"
                    rows={3}
                    placeholder="e.g., Plays as source music in the diner scene, then over the end credits…"
                    value={form.scene_use}
                    onChange={(e) => set("scene_use", e.target.value)}
                  />
                  {aiButton("scene_use", "music sync license — description of the use in the project")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grant of Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rights Granted</Label>
                  <Select value={form.rights_granted} onValueChange={(val) => set("rights_granted", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rights granted" />
                    </SelectTrigger>
                    <SelectContent>
                      {RIGHTS_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="media">Media / Platforms</Label>
                  <Textarea
                    id="media"
                    rows={3}
                    placeholder="Festivals, theatrical, streaming, home video, promotional"
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
                  <Input
                    className="mt-2"
                    placeholder="Territory"
                    value={form.territory}
                    onChange={(e) => set("territory", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="term_length">Term / Duration of License</Label>
                  <Input
                    id="term_length"
                    placeholder="In perpetuity, or 5 years"
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
                  <Label htmlFor="license_fee">License Fee (USD)</Label>
                  <Input
                    id="license_fee"
                    placeholder="$2,500"
                    value={form.license_fee}
                    onChange={(e) => set("license_fee", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Textarea
                    id="payment_terms"
                    rows={3}
                    placeholder="e.g., 50% upon execution, balance upon delivery of the final cut…"
                    value={form.payment_terms}
                    onChange={(e) => set("payment_terms", e.target.value)}
                  />
                  {aiButton("payment_terms", "music sync license — payment terms")}
                </div>
                <div>
                  <Label htmlFor="credit_text">On-Screen / Credit Requirement (optional)</Label>
                  <Textarea
                    id="credit_text"
                    rows={3}
                    placeholder='e.g., "Song Title" written by …, performed by …, courtesy of …'
                    value={form.credit_text}
                    onChange={(e) => set("credit_text", e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mfn"
                    checked={form.mfn}
                    onCheckedChange={(checked) => set("mfn", checked === true)}
                  />
                  <Label htmlFor="mfn" className="cursor-pointer">
                    Most-Favored-Nations (MFN) applies
                  </Label>
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
                  placeholder="Options, re-use fees, festival-only limits, delivery of materials…"
                  value={additionalTerms}
                  onChange={(e) => setAdditionalTerms(e.target.value)}
                />
                {aiButton("additional_terms", "music sync license — additional terms")}
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
                  <h2 className="mb-4 text-center text-lg font-bold">
                    MUSIC LICENSE / SYNCHRONIZATION AGREEMENT
                  </h2>
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
                      <p className="mt-2">Printed Name: {v(form.licensor_name, "licensor")}</p>
                      <p className="mt-2">Date: ____________________</p>
                    </div>
                    <div>
                      <p className="font-bold">LICENSEE</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.licensee_name, "licensee")}</p>
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

export default MusicLicenseSync;
