import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Printer, RotateCcw } from "lucide-react";

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const formatDate = (value: string) => {
  if (!value.trim()) return "[Date]";
  const [year, month, day] = value.split("-").map((n) => parseInt(n, 10));
  if (!year || !month || !day) return value;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const defaultBody = `Thank you for considering our submission. We believe this film is a strong fit for your festival's programming and audience, and we would be honored to share it with your community.

A little about the project: it was made by a dedicated team passionate about authentic, visually-driven storytelling. We admire the curatorial voice of your festival and feel the themes of the film align with the work you have championed in recent years.

Please don't hesitate to reach out if you need any additional materials — including a screener, stills, EPK, or director's statement. We look forward to the possibility of being part of this year's lineup.`;

const FestivalCoverLetter = () => {
  const [senderName, setSenderName] = useState("");
  const [senderTitle, setSenderTitle] = useState("");
  const [senderCompany, setSenderCompany] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [festivalName, setFestivalName] = useState("");
  const [programmerName, setProgrammerName] = useState("");
  const [programmerTitle, setProgrammerTitle] = useState("");
  const [festivalAddress, setFestivalAddress] = useState("");
  const [filmTitle, setFilmTitle] = useState("");
  const [filmType, setFilmType] = useState("");
  const [category, setCategory] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [premiereStatus, setPremiereStatus] = useState("");
  const [salutation, setSalutation] = useState("Dear Programming Team,");
  const [body, setBody] = useState(defaultBody);
  const [closing, setClosing] = useState("Sincerely,");

  useEffect(() => {
    document.title = "Festival Cover Letter | Filmmaker Genius";
  }, []);

  const reLine = () => {
    const parts: string[] = [];
    if (filmType.trim()) parts.push(filmType.trim());
    if (category.trim()) parts.push(category.trim());
    if (submissionId.trim()) parts.push(`ID: ${submissionId.trim()}`);
    if (premiereStatus.trim()) parts.push(premiereStatus.trim());
    const suffix = parts.length ? ` — ${parts.join(" · ")}` : "";
    return `RE: Submission — ${v(filmTitle, "Film Title")}${suffix}`;
  };

  const bodyParagraphs = body.split(/\n\s*\n/).filter((p) => p.trim());

  const senderBlock = () => {
    const lines: string[] = [];
    if (senderName.trim()) lines.push(senderName.trim());
    if (senderTitle.trim()) lines.push(senderTitle.trim());
    if (senderCompany.trim()) lines.push(senderCompany.trim());
    if (senderEmail.trim()) lines.push(senderEmail.trim());
    if (senderPhone.trim()) lines.push(senderPhone.trim());
    return lines;
  };

  const recipientBlock = () => {
    const lines: string[] = [];
    if (programmerName.trim()) {
      const title = programmerTitle.trim() ? `, ${programmerTitle.trim()}` : "";
      lines.push(`${programmerName.trim()}${title}`);
    }
    if (festivalName.trim()) lines.push(festivalName.trim());
    if (festivalAddress.trim()) lines.push(...festivalAddress.trim().split("\n"));
    return lines;
  };

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 22;
    const contentWidth = pageWidth - margin * 2;
    const lineHeight = 6;

    const footer = () => {
      doc.setFontSize(8);
      doc.setFont("times", "italic");
      doc.setTextColor(120, 120, 120);
      doc.text("Filmmaker Genius — Document Library.", margin, pageHeight - 10);
      doc.setTextColor(0, 0, 0);
    };

    let y = margin;

    const ensure = (needed: number) => {
      if (y + needed > pageHeight - 20) {
        footer();
        doc.addPage();
        y = margin;
      }
    };

    const writeLine = (text: string, opts: { bold?: boolean; italic?: boolean; gapAfter?: number } = {}) => {
      doc.setFontSize(12);
      doc.setFont("times", opts.bold ? "bold" : opts.italic ? "italic" : "normal");
      ensure(lineHeight);
      doc.text(text, margin, y);
      y += lineHeight;
      if (opts.gapAfter) y += opts.gapAfter;
    };

    const writeBlock = (text: string, gapAfter = lineHeight) => {
      doc.setFontSize(12);
      doc.setFont("times", "normal");
      const lines = doc.splitTextToSize(text, contentWidth) as string[];
      lines.forEach((line) => {
        ensure(lineHeight);
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += gapAfter;
    };

    senderBlock().forEach((line) => writeLine(line, { gapAfter: 0 }));
    if (senderBlock().length === 0) writeLine(v(senderName, "Sender Name"), { gapAfter: 0 });
    y += lineHeight;

    writeLine(formatDate(letterDate), { gapAfter: lineHeight });

    recipientBlock().forEach((line) => writeLine(line, { gapAfter: 0 }));
    if (recipientBlock().length === 0) writeLine(v(festivalName, "Festival Name"), { gapAfter: 0 });
    y += lineHeight;

    writeLine(reLine(), { bold: true, gapAfter: lineHeight });
    writeLine(salutation.trim() || "Dear Programming Team,", { gapAfter: lineHeight });

    bodyParagraphs.forEach((para) => writeBlock(para, lineHeight));

    writeLine(closing.trim() || "Sincerely,", { gapAfter: lineHeight * 3 });
    writeLine(senderName.trim() || v(senderName, "Sender Name"), { gapAfter: 0 });
    if (senderTitle.trim()) writeLine(senderTitle.trim(), { gapAfter: 0 });
    if (senderCompany.trim()) writeLine(senderCompany.trim(), { gapAfter: 0 });

    footer();
    return doc;
  };

  const fileBase = () => {
    const safeFestival = (festivalName || "Festival").replace(/[^a-zA-Z0-9]/g, "_");
    const safeFilm = (filmTitle || "Film").replace(/[^a-zA-Z0-9]/g, "_");
    return `${safeFestival}_${safeFilm}_Cover_Letter`;
  };

  const handleDownload = () => {
    buildPDF().save(`${fileBase()}.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setSenderName("");
    setSenderTitle("");
    setSenderCompany("");
    setSenderEmail("");
    setSenderPhone("");
    setLetterDate("");
    setFestivalName("");
    setProgrammerName("");
    setProgrammerTitle("");
    setFestivalAddress("");
    setFilmTitle("");
    setFilmType("");
    setCategory("");
    setSubmissionId("");
    setPremiereStatus("");
    setSalutation("Dear Programming Team,");
    setBody(defaultBody);
    setClosing("Sincerely,");
  };

  const ph = (text: string) => <span className="italic text-gray-500">{text}</span>;

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Festival Cover Letter</h1>
          <p className="text-muted-foreground">
            A polished cover letter to accompany your festival submission.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Filmmakers submitting to festivals.</li>
                <li>Producers introducing a film to programmers.</li>
                <li>Anyone sending a professional submission letter.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Formats a clean business cover letter.</li>
                <li>Introduces the film and submission details.</li>
                <li>Signs off with your contact information.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>From (Sender)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sender_name">Name</Label>
                  <Input id="sender_name" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="sender_title">Title / Role</Label>
                  <Input id="sender_title" value={senderTitle} onChange={(e) => setSenderTitle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="sender_company">Company / Production</Label>
                  <Input id="sender_company" value={senderCompany} onChange={(e) => setSenderCompany(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="sender_email">Email</Label>
                  <Input id="sender_email" type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="sender_phone">Phone</Label>
                  <Input id="sender_phone" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="letter_date">Date</Label>
                  <Input id="letter_date" type="date" value={letterDate} onChange={(e) => setLetterDate(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>To (Festival)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="festival_name">Festival Name</Label>
                  <Input id="festival_name" value={festivalName} onChange={(e) => setFestivalName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="programmer_name">Programmer / Contact Name</Label>
                  <Input id="programmer_name" value={programmerName} onChange={(e) => setProgrammerName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="programmer_title">Programmer Title</Label>
                  <Input id="programmer_title" value={programmerTitle} onChange={(e) => setProgrammerTitle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="festival_address">Festival Address</Label>
                  <Textarea
                    id="festival_address"
                    rows={3}
                    value={festivalAddress}
                    onChange={(e) => setFestivalAddress(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="film_title">Film Title</Label>
                  <Input id="film_title" value={filmTitle} onChange={(e) => setFilmTitle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="film_type">Type / Runtime</Label>
                  <Input
                    id="film_type"
                    placeholder="Short Film · 14 min"
                    value={filmType}
                    onChange={(e) => setFilmType(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Submission Category</Label>
                  <Input
                    id="category"
                    placeholder="Narrative Short"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="submission_id">Submission / FilmFreeway ID</Label>
                  <Input id="submission_id" value={submissionId} onChange={(e) => setSubmissionId(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="premiere_status">Premiere Status</Label>
                  <Input
                    id="premiere_status"
                    placeholder="World Premiere"
                    value={premiereStatus}
                    onChange={(e) => setPremiereStatus(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Letter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="salutation">Salutation</Label>
                  <Input id="salutation" value={salutation} onChange={(e) => setSalutation(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="body">Body</Label>
                  <Textarea
                    id="body"
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="closing">Closing</Label>
                  <Input id="closing" value={closing} onChange={(e) => setClosing(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="ghost" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* RIGHT: preview */}
          <div className="space-y-6">
            <div className="sticky top-6 space-y-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-white text-black p-8 min-h-[600px] font-serif text-sm leading-relaxed">
                    <div className="space-y-0.5">
                      {senderName.trim() ? <p>{senderName.trim()}</p> : <p>{ph("[Sender Name]")}</p>}
                      {senderTitle.trim() && <p>{senderTitle.trim()}</p>}
                      {senderCompany.trim() && <p>{senderCompany.trim()}</p>}
                      {senderEmail.trim() && <p>{senderEmail.trim()}</p>}
                      {senderPhone.trim() && <p>{senderPhone.trim()}</p>}
                    </div>

                    <p className="mt-6">
                      {letterDate.trim() ? formatDate(letterDate) : ph("[Date]")}
                    </p>

                    <div className="mt-6 space-y-0.5">
                      {programmerName.trim() && (
                        <p>
                          {programmerName.trim()}
                          {programmerTitle.trim() && `, ${programmerTitle.trim()}`}
                        </p>
                      )}
                      {festivalName.trim() ? <p>{festivalName.trim()}</p> : <p>{ph("[Festival Name]")}</p>}
                      {festivalAddress.trim() && festivalAddress.split("\n").map((line, i) => <p key={i}>{line}</p>)}
                    </div>

                    <p className="mt-6 font-bold">{reLine()}</p>

                    <p className="mt-6">{salutation.trim() || ph("[Salutation]")}</p>

                    <div className="mt-4 space-y-4 text-justify">
                      {bodyParagraphs.length ? (
                        bodyParagraphs.map((para, i) => <p key={i}>{para}</p>)
                      ) : (
                        <p>{ph("[Letter body]")}</p>
                      )}
                    </div>

                    <div className="mt-8">
                      <p>{closing.trim() || "Sincerely,"}</p>
                      <div className="h-12" />
                      <p>{senderName.trim() || ph("[Sender Name]")}</p>
                      {senderTitle.trim() && <p>{senderTitle.trim()}</p>}
                      {senderCompany.trim() && <p>{senderCompany.trim()}</p>}
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-12">
                      Filmmaker Genius — Document Library.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalCoverLetter;
