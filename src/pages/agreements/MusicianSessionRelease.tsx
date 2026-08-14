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

interface MusicianSessionReleaseForm {
  musician_name: string;
  musician_role: string;
  producer_name: string;
  effective_date: string;
  project_title: string;
  session_date: string;
  studio_location: string;
  instrument_part: string;
  union_status: string;
  rights_granted: string;
  fee_amount: string;
  payment_terms: string;
  reuse: string;
  credit_text: string;
}

const INITIAL_FORM: MusicianSessionReleaseForm = {
  musician_name: "",
  musician_role: "Instrumentalist",
  producer_name: "",
  effective_date: "",
  project_title: "",
  session_date: "",
  studio_location: "",
  instrument_part: "",
  union_status: "Non-Union",
  rights_granted: "Work-Made-For-Hire (Producer owns recording)",
  fee_amount: "",
  payment_terms: "50% on session date, 50% on delivery of final tracks",
  reuse: "",
  credit_text: "",
};

const DISCLAIMER =
  "TEMPLATE ONLY — NOT LEGAL ADVICE. This musician/session release confirms a performer's recorded contribution and rights grant for a score or soundtrack. If the musician is a union member (e.g., AFM), applicable union agreements, scale, pension, and health contributions may apply and control to the extent required by law. Consult a qualified entertainment attorney before executing this agreement.";

const ROLE_OPTIONS = ["Instrumentalist", "Vocalist", "Both"];
const UNION_OPTIONS = ["Non-Union", "AFM Member"];
const RIGHTS_OPTIONS = [
  "Work-Made-For-Hire (Producer owns recording)",
  "Performer retains, grants exclusive license",
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
type AiField = "instrument_part" | "payment_terms" | "additional_terms";

const MusicianSessionRelease = () => {
  const [form, setForm] = useState<MusicianSessionReleaseForm>(INITIAL_FORM);
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [roleChoice, setRoleChoice] = useState("Instrumentalist");
  const [unionChoice, setUnionChoice] = useState("Non-Union");
  const [legalizing, setLegalizing] = useState<AiField | null>(null);

  const set = <K extends keyof MusicianSessionReleaseForm>(key: K, value: MusicianSessionReleaseForm[K]) =>
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
    setRoleChoice("Instrumentalist");
    setUnionChoice("Non-Union");
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);
  const s = (value: string, placeholder: string) => v(value, placeholder).replace(/[.;,]+$/, "");

  const intro = `This Musician / Session Release ("Agreement") is entered into as of ${v(
    formatDate(form.effective_date),
    "effective date"
  )} by and between ${v(form.musician_name, "musician / vocalist")} ("Musician") and ${v(
    form.producer_name,
    "producer / company"
  )} ("Producer"), with reference to the motion picture or program presently entitled "${v(
    form.project_title,
    "project title"
  )}" (the "Project").`;

  const clauses: Clause[] = useMemo(() => {
    const isWFH = form.rights_granted === "Work-Made-For-Hire (Producer owns recording)";
    const isAFM = form.union_status === "AFM Member";

    return [
      {
        heading: "Engagement & Performance",
        body: `Musician engaged as ${v(form.musician_role, "musician role")} performed the following on the recording sessions for the Project "${v(
          form.project_title,
          "project title"
        )}": ${s(form.instrument_part, "instrument(s) / part performed")}. Session date: ${v(
          formatDate(form.session_date),
          "session date"
        )}${form.studio_location.trim() ? `, at ${form.studio_location.trim()}` : ""}.`,
      },
      {
        heading: "Grant of Rights",
        body: isWFH
          ? `The performance and resulting recordings are created as works made for hire specially ordered and commissioned by Producer, and Producer shall be deemed the author and sole owner of the recorded performance throughout the universe in perpetuity, in all media now known or hereafter devised. To the extent any such material does not qualify as a work made for hire, Musician hereby irrevocably assigns to Producer all right, title, and interest therein, including all copyrights and renewals thereof.`
          : `Musician retains ownership of the recorded performance and hereby grants Producer an exclusive, perpetual, irrevocable, worldwide license to use, reproduce, distribute, perform, synchronize, and otherwise exploit the recorded performance in and in connection with the Project and all versions, advertising, and ancillary exploitation thereof, in all media now known or hereafter devised.`,
      },
      {
        heading: "Compensation",
        body: `Producer shall pay Musician a session fee of ${v(form.fee_amount, "fee (USD)")}. ${s(
          form.payment_terms,
          "payment terms"
        )}.`,
      },
      {
        heading: "Re-use / New Use",
        body: form.reuse.trim()
          ? form.reuse.trim()
          : "The fee above covers all uses of the performance in the Project and its advertising and exploitation, with no further payment due, except as required by any applicable union agreement.",
      },
      {
        heading: "Union",
        body: `Musician's union status is ${v(form.union_status, "union status")}.${
          isAFM
            ? ` Musician acknowledges that applicable AFM scale, pension, and health contributions may apply and control to the extent required by any applicable union agreement or law.`
            : ""
        }`,
      },
      {
        heading: "Credit",
        body: form.credit_text.trim()
          ? `Producer shall accord Musician credit substantially as follows: ${form.credit_text.trim()}. Casual or inadvertent failure to comply shall not constitute a breach of this Agreement.`
          : "No specific credit is required by this Agreement.",
      },
      {
        heading: "Representations & Warranties",
        body: `Musician represents and warrants that the performance is original to Musician, that Musician is free to grant the rights herein, and that the performance does not infringe upon the copyright, right of publicity, or any other right of any third party. Musician agrees to indemnify Producer for any breach of the foregoing representations and warranties.`,
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

    write("MUSICIAN / SESSION RELEASE", 15, "bold", "center");
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
    write("MUSICIAN / VOCALIST", 11, "bold");
    y += 2;
    write("Signature: ______________________________");
    write(`Printed Name: ${v(form.musician_name, "musician / vocalist")}`);
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
    const base = `${form.project_title || "Project"}_${form.musician_name || "Musician"}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    buildPDF().save(`${base}_Musician_Session_Release.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Musician / Session Release</h1>
          <p className="text-muted-foreground">
            Clear a session musician's or vocalist's recorded performance for your score or soundtrack.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Composers/producers hiring session players or vocalists.</li>
                <li>Recording sessions for a score or soundtrack.</li>
                <li>Anyone clearing a performer's recorded contribution.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Confirms the musician's performance is work-for-hire.</li>
                <li>Grants rights to use the recording in the project.</li>
                <li>Sets the session fee and warranties.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Consult an entertainment attorney before signing. If the
            musician is a union member (e.g., AFM), union agreements and scale may apply and control to the extent
            required.
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
                  <Label htmlFor="musician_name">Musician / Vocalist</Label>
                  <Input
                    id="musician_name"
                    value={form.musician_name}
                    onChange={(e) => set("musician_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Musician Role</Label>
                  <Select
                    value={roleChoice}
                    onValueChange={(val) => {
                      setRoleChoice(val);
                      set("musician_role", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {roleChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., Percussionist / Choir Director"
                      value={form.musician_role}
                      onChange={(e) => set("musician_role", e.target.value)}
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
                <CardTitle>Session</CardTitle>
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
                  <Label htmlFor="session_date">Session Date</Label>
                  <Input
                    id="session_date"
                    type="date"
                    value={form.session_date}
                    onChange={(e) => set("session_date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="studio_location">Studio / Location (optional)</Label>
                  <Input
                    id="studio_location"
                    value={form.studio_location}
                    onChange={(e) => set("studio_location", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="instrument_part">Instrument(s) / Part Performed</Label>
                  <Textarea
                    id="instrument_part"
                    rows={3}
                    placeholder='e.g., "Cello on cues 3, 7, and 12"'
                    value={form.instrument_part}
                    onChange={(e) => set("instrument_part", e.target.value)}
                  />
                  {aiButton("instrument_part", "musician/session release — instrument or part performed")}
                </div>
                <div>
                  <Label>Union Status</Label>
                  <Select
                    value={unionChoice}
                    onValueChange={(val) => {
                      setUnionChoice(val);
                      set("union_status", val === "Other" ? "" : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select union status" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNION_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {unionChoice === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="e.g., SAG-AFTRA / AGMA"
                      value={form.union_status}
                      onChange={(e) => set("union_status", e.target.value)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grant &amp; Compensation</CardTitle>
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
                  <Label htmlFor="fee_amount">Session Fee (USD)</Label>
                  <Input
                    id="fee_amount"
                    placeholder="$500"
                    value={form.fee_amount}
                    onChange={(e) => set("fee_amount", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Textarea
                    id="payment_terms"
                    rows={3}
                    value={form.payment_terms}
                    onChange={(e) => set("payment_terms", e.target.value)}
                  />
                  {aiButton("payment_terms", "musician/session release — payment terms")}
                </div>
                <div>
                  <Label htmlFor="reuse">Re-use / New-Use Terms (optional)</Label>
                  <Textarea
                    id="reuse"
                    rows={2}
                    placeholder="e.g., No additional payment for use in the Project and its exploitation"
                    value={form.reuse}
                    onChange={(e) => set("reuse", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="credit_text">Credit (optional)</Label>
                  <Input
                    id="credit_text"
                    placeholder="e.g., Musicians as listed in end credits"
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
                  placeholder="Travel buyout, exclusivity, sequels/re-use, kill fee…"
                  value={additionalTerms}
                  onChange={(e) => setAdditionalTerms(e.target.value)}
                />
                {aiButton("additional_terms", "musician/session release — additional terms")}
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
                  <h2 className="mb-4 text-center text-lg font-bold">MUSICIAN / SESSION RELEASE</h2>
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
                      <p className="font-bold">MUSICIAN / VOCALIST</p>
                      <p className="mt-3">Signature: ____________________</p>
                      <p className="mt-2">Printed Name: {v(form.musician_name, "musician / vocalist")}</p>
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

export default MusicianSessionRelease;
