import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Download, Loader2, Printer, RotateCcw, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

interface CrowdNoticeForm {
  company: string;
  production_name: string;
  notice_dates: string;
  location: string;
  contact: string;
  custom_message: string;
}

const INITIAL_FORM: CrowdNoticeForm = {
  company: "",
  production_name: "",
  notice_dates: "",
  location: "",
  contact: "",
  custom_message: "",
};

const DISCLAIMER =
  "This notice is a template and is not a substitute for required permits or legal advice.";

const CrowdNoticeSignage = () => {
  const [form, setForm] = useState<CrowdNoticeForm>(INITIAL_FORM);
  const [legalizing, setLegalizing] = useState(false);

  const set = <K extends keyof CrowdNoticeForm>(key: K, value: CrowdNoticeForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const legalize = async () => {
    const value = form.custom_message.trim();
    if (!value) return;
    setLegalizing(true);
    try {
      const res = await aiInvoke<{ text?: string; error?: string }>("legalize-text", {
        body: { text: value, context: "crowd notice — custom message" },
      });
      if (res?.text) {
        set("custom_message", res.text);
        toast.success("Message rewritten");
      } else {
        toast.error(res?.error || "No text returned");
      }
    } catch (err) {
      if (!(err instanceof InsufficientCreditsError)) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setLegalizing(false);
    }
  };

  const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

  const productionLine = form.production_name.trim()
    ? ` in connection with "${form.production_name.trim()}"`
    : "";

  const body = `Filming is being conducted at this location by ${v(
    form.company,
    "producer / company"
  )}${productionLine}. By entering this area, you consent to being photographed, filmed, and recorded, and to the use of your appearance, likeness, and voice in the production and its promotion in all media, worldwide, without compensation. If you do not wish to be recorded, please do not enter the marked area, or notify a member of the production crew.`;

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 22;
    const contentWidth = pageWidth - margin * 2;

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    let y = 45;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(180, 0, 0);
    const headline = "FILMING IN PROGRESS";
    const headlineLines = doc.splitTextToSize(headline, contentWidth) as string[];
    headlineLines.forEach((line) => {
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += 14;
    });

    y += 8;
    doc.setDrawColor(180, 0, 0);
    doc.setLineWidth(1.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(17);
    doc.setTextColor(0, 0, 0);
    const bodyLines = doc.splitTextToSize(body, contentWidth) as string[];
    bodyLines.forEach((line) => {
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += 10;
    });

    if (form.custom_message.trim()) {
      y += 10;
      doc.setFont("helvetica", "italic");
      const customLines = doc.splitTextToSize(form.custom_message.trim(), contentWidth) as string[];
      customLines.forEach((line) => {
        doc.text(line, pageWidth / 2, y, { align: "center" });
        y += 9;
      });
    }

    y = Math.max(y + 20, pageHeight - 80);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const footerLines = [
      `Date(s): ${v(form.notice_dates, "date(s)")}`,
      ...(form.location.trim() ? [`Location: ${v(form.location, "location")}`] : []),
      `Questions? Contact: ${v(form.contact, "contact for questions")}`,
    ];
    footerLines.forEach((line) => {
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += 10;
    });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(DISCLAIMER, pageWidth / 2, pageHeight - margin, { align: "center" });

    return doc;
  };

  const handleDownload = () => {
    const base = `${form.company || "CrowdNotice"}_${form.notice_dates || "Dates"}`.replace(/[^a-zA-Z0-9]/g, "_");
    buildPDF().save(`${base}_Crowd_Notice.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const handleReset = () => setForm(INITIAL_FORM);

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Crowd Notice / Signage</h1>
          <p className="text-muted-foreground">
            A printable sign that notifies the public that filming is underway and entry implies consent.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Productions filming in public or semi-public spaces.</li>
                <li>ADs and coordinators posting location notices.</li>
                <li>Anyone who needs a visible filming notice.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Posts a clear notice that filming is in progress.</li>
                <li>Explains that entering the area implies consent.</li>
                <li>Points the public to a contact for questions.</li>
              </ul>
            </div>
          </div>
        </section>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            This is a template, not legal advice. Check local permit and posting requirements before use.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company">Producer / Company</Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="production_name">Production (optional)</Label>
                  <Input
                    id="production_name"
                    value={form.production_name}
                    onChange={(e) => set("production_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notice_dates">Date(s)</Label>
                  <Input
                    id="notice_dates"
                    placeholder="August 13–15, 2026"
                    value={form.notice_dates}
                    onChange={(e) => set("notice_dates", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    placeholder="123 Main St. — front lobby"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Contact for Questions</Label>
                  <Input
                    id="contact"
                    placeholder="Jane Doe, 1st AD — (555) 123-4567"
                    value={form.contact}
                    onChange={(e) => set("contact", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="custom_message">Custom Message (optional)</Label>
                  <Textarea
                    id="custom_message"
                    rows={3}
                    placeholder="Optional extra line — e.g., specific area, hours, or instructions…"
                    value={form.custom_message}
                    onChange={(e) => set("custom_message", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={!form.custom_message.trim() || legalizing}
                    onClick={legalize}
                  >
                    {legalizing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Make Professional
                  </Button>
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

          {/* RIGHT: poster preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Poster Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[80vh] overflow-y-auto rounded-md bg-white p-8 text-black text-center">
                  <h2 className="text-4xl font-extrabold tracking-tight text-red-700 uppercase mb-4">
                    Filming in Progress
                  </h2>
                  <div className="border-b-2 border-red-700 mb-6" />
                  <p className="text-lg leading-relaxed mb-6">{body}</p>
                  {form.custom_message.trim() && (
                    <p className="text-base italic text-gray-700 mb-6">{form.custom_message.trim()}</p>
                  )}
                  <div className="mt-8 space-y-2 text-sm font-semibold text-gray-900">
                    <p>Date(s): {v(form.notice_dates, "date(s)")}</p>
                    {form.location.trim() && <p>Location: {v(form.location, "location")}</p>}
                    <p>Questions? Contact: {v(form.contact, "contact for questions")}</p>
                  </div>
                  <p className="mt-8 text-[10px] italic text-gray-500">{DISCLAIMER}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Filmmaker Genius — Document Library.
        </p>
      </div>
    </div>
  );
};

export default CrowdNoticeSignage;
