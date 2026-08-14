import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface PressReleaseForm {
  release_timing: "FOR IMMEDIATE RELEASE" | "EMBARGOED UNTIL";
  embargo_date: string;
  headline: string;
  subhead: string;
  city: string;
  state_country: string;
  dateline_date: string;
  lead: string;
  body: string;
  quote: string;
  quote_attribution: string;
  about_heading: string;
  boilerplate: string;
  contact_name: string;
  contact_title: string;
  contact_email: string;
  contact_phone: string;
  website: string;
}

const INITIAL_FORM: PressReleaseForm = {
  release_timing: "FOR IMMEDIATE RELEASE",
  embargo_date: "",
  headline: "",
  subhead: "",
  city: "",
  state_country: "",
  dateline_date: "",
  lead: "",
  body: "",
  quote: "",
  quote_attribution: "",
  about_heading: "About [Company/Film]",
  boilerplate: "",
  contact_name: "",
  contact_title: "",
  contact_email: "",
  contact_phone: "",
  website: "",
};

const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value + "T00:00:00");
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PressRelease = () => {
  const [form, setForm] = useState<PressReleaseForm>(INITIAL_FORM);

  const set = <K extends keyof PressReleaseForm>(key: K, value: PressReleaseForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    setForm(INITIAL_FORM);
    toast.success("Form reset");
  };

  const v = (value: string, placeholder: string) =>
    value.trim() ? value.trim() : `[${placeholder}]`;
  const has = (value: string) => value.trim().length > 0;

  const releaseLine =
    form.release_timing === "EMBARGOED UNTIL" && has(form.embargo_date)
      ? `${form.release_timing} ${form.embargo_date}`
      : form.release_timing;

  const dateline = [form.city, form.state_country].filter(Boolean).join(", ");
  const datelineDate = formatDate(form.dateline_date);

  const bodyParagraphs = form.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const contactItems = [
    { value: form.contact_name },
    { value: form.contact_title },
    { value: form.contact_email },
    { value: form.contact_phone },
    { value: form.website },
  ].filter((item) => has(item.value));

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 22;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const ensure = (h = 8) => {
      if (y + h > pageHeight - margin - 10) {
        doc.addPage();
        y = margin;
      }
    };

    const write = (
      text: string,
      size = 11,
      style: "normal" | "bold" | "italic" = "normal",
      align: "left" | "center" | "right" = "left",
      indent = 0
    ) => {
      doc.setFontSize(size);
      doc.setFont("times", style);
      const lines = doc.splitTextToSize(text, contentWidth - indent) as string[];
      lines.forEach((line) => {
        ensure(6);
        const x = align === "center" ? pageWidth / 2 : align === "right" ? pageWidth - margin : margin + indent;
        doc.text(line, x, y, { align });
        y += size * 0.55;
      });
    };

    write(releaseLine, 11, "bold");
    y += 8;

    write(v(form.headline, "Headline"), 16, "bold", "center");
    if (has(form.subhead)) {
      y += 2;
      write(form.subhead, 12, "italic", "center");
    }
    y += 8;

    const datelineText = dateline ? `${dateline}${datelineDate ? ` — ${datelineDate}` : ""}` : `[City] — [Date]`;
    write(`${datelineText} — ${v(form.lead, "lead paragraph")}`);
    y += 4;

    bodyParagraphs.forEach((paragraph) => {
      write(paragraph);
      y += 3;
    });
    y += 3;

    ensure(20);
    write(`"${v(form.quote, "pull quote")}"`, 11, "italic", "left", 6);
    if (has(form.quote_attribution)) {
      write(`— ${form.quote_attribution}`, 11, "italic", "left", 6);
    } else {
      write(`— [Attribution]`, 11, "italic", "left", 6);
    }
    y += 6;

    write(v(form.about_heading, "About Heading"), 11, "bold");
    write(v(form.boilerplate, "boilerplate"));
    y += 6;

    write("###", 12, "bold", "center");
    y += 8;

    write("MEDIA CONTACT:", 11, "bold");
    if (contactItems.length > 0) {
      contactItems.forEach((item) => write(item.value));
    } else {
      write(v(form.contact_name, "Contact Name"));
      write(v(form.contact_email, "Email"));
    }
    y += 6;

    ensure(12);
    doc.setTextColor(120, 120, 120);
    write("Filmmaker Genius — Document Library.", 8, "italic", "center");
    doc.setTextColor(0, 0, 0);

    return doc;
  };

  const handleDownload = () => {
    const base = (form.headline || "Press_Release").replace(/[^a-zA-Z0-9]/g, "_");
    buildPDF().save(`${base}_Press_Release.pdf`);
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
          <h1 className="text-3xl font-bold mb-2">Press Release Template</h1>
          <p className="text-muted-foreground">
            Announce your film, festival selection, or release in a clean, standard press-release format.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers and publicists announcing news.</li>
                <li>Filmmakers sharing a festival selection or release.</li>
                <li>Anyone sending a professional press release.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Formats a headline, dateline, and body.</li>
                <li>Adds a pull quote and boilerplate.</li>
                <li>Gives press your media contact.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Release Basics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="release_timing">Release Timing</Label>
                  <Select
                    value={form.release_timing}
                    onValueChange={(value) =>
                      set("release_timing", value as PressReleaseForm["release_timing"])
                    }
                  >
                    <SelectTrigger id="release_timing">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOR IMMEDIATE RELEASE">FOR IMMEDIATE RELEASE</SelectItem>
                      <SelectItem value="EMBARGOED UNTIL">EMBARGOED UNTIL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.release_timing === "EMBARGOED UNTIL" && (
                  <div>
                    <Label htmlFor="embargo_date">Embargo Date/Time</Label>
                    <Input
                      id="embargo_date"
                      value={form.embargo_date}
                      onChange={(e) => set("embargo_date", e.target.value)}
                      placeholder="e.g., August 14, 2026 at 9:00 AM ET"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={form.headline}
                    onChange={(e) => set("headline", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="subhead">Subheadline</Label>
                  <Input
                    id="subhead"
                    value={form.subhead}
                    onChange={(e) => set("subhead", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dateline &amp; Lead</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="state_country">State / Country</Label>
                    <Input
                      id="state_country"
                      value={form.state_country}
                      onChange={(e) => set("state_country", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dateline_date">Dateline Date</Label>
                  <Input
                    id="dateline_date"
                    type="date"
                    value={form.dateline_date}
                    onChange={(e) => set("dateline_date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lead">Lead Paragraph</Label>
                  <Textarea
                    id="lead"
                    rows={3}
                    placeholder="The who/what/when/where/why"
                    value={form.lead}
                    onChange={(e) => set("lead", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Body</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="body"
                  rows={8}
                  placeholder="Main body paragraphs — separate paragraphs with a blank line"
                  value={form.body}
                  onChange={(e) => set("body", e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quote</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quote">Pull Quote</Label>
                  <Textarea
                    id="quote"
                    rows={3}
                    value={form.quote}
                    onChange={(e) => set("quote", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quote_attribution">Attribution</Label>
                  <Input
                    id="quote_attribution"
                    placeholder="Name, Title"
                    value={form.quote_attribution}
                    onChange={(e) => set("quote_attribution", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Boilerplate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about_heading">About Heading</Label>
                  <Input
                    id="about_heading"
                    value={form.about_heading}
                    onChange={(e) => set("about_heading", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="boilerplate">Boilerplate</Label>
                  <Textarea
                    id="boilerplate"
                    rows={4}
                    placeholder="Company/film boilerplate"
                    value={form.boilerplate}
                    onChange={(e) => set("boilerplate", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_name">Name</Label>
                    <Input
                      id="contact_name"
                      value={form.contact_name}
                      onChange={(e) => set("contact_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_title">Title / Role</Label>
                    <Input
                      id="contact_title"
                      value={form.contact_title}
                      onChange={(e) => set("contact_title", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      value={form.contact_email}
                      onChange={(e) => set("contact_email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Phone</Label>
                    <Input
                      id="contact_phone"
                      value={form.contact_phone}
                      onChange={(e) => set("contact_phone", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                  />
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
                  <p className="font-bold uppercase tracking-wide">{releaseLine}</p>
                  <h2 className="my-4 text-center text-xl font-bold">
                    {v(form.headline, "Headline")}
                  </h2>
                  {has(form.subhead) && (
                    <p className="mb-4 text-center italic text-gray-600">{form.subhead}</p>
                  )}
                  <p className="mb-4 text-justify">
                    {dateline ? dateline : "[City]"}
                    {datelineDate ? ` — ${datelineDate}` : " — [Date]"}
                    {" — "}
                    {v(form.lead, "lead paragraph")}
                  </p>
                  {bodyParagraphs.map((paragraph, i) => (
                    <p key={i} className="mb-4 text-justify">
                      {paragraph}
                    </p>
                  ))}
                  <blockquote className="my-4 border-l-4 border-gray-300 pl-4 italic text-gray-700">
                    &ldquo;{v(form.quote, "pull quote")}&rdquo;
                    <br />— {v(form.quote_attribution, "Attribution")}
                  </blockquote>
                  <p className="mb-1 font-bold">{v(form.about_heading, "About Heading")}</p>
                  <p className="mb-4 text-justify">{v(form.boilerplate, "boilerplate")}</p>
                  <p className="my-6 text-center font-bold">###</p>
                  <p className="font-bold uppercase tracking-wide">Media Contact</p>
                  {contactItems.length > 0 ? (
                    contactItems.map((item, i) => <p key={i}>{item.value}</p>)
                  ) : (
                    <>
                      <p>{v(form.contact_name, "Contact Name")}</p>
                      <p>{v(form.contact_email, "Email")}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressRelease;
