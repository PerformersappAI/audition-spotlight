import { useEffect, useState } from "react";
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
import { Download, Loader2, Printer, RotateCcw, Sparkles } from "lucide-react";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import { toast } from "sonner";

const PROJECT_TYPES = [
  "Feature",
  "Short",
  "Series",
  "Commercial",
  "Music Video",
  "Documentary",
  "Movie",
];

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const formatDate = (value: string) => {
  if (!value.trim()) return "[Date]";
  const [year, month, day] = value.split("-").map((n) => parseInt(n, 10));
  if (!year || !month || !day) return value;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const FilmOfficeCoverLetter = () => {
  const [company, setCompany] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderContact, setSenderContact] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [filmOffice, setFilmOffice] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [productionName, setProductionName] = useState("");
  const [projectType, setProjectType] = useState("Short");
  const [shootDates, setShootDates] = useState("");
  const [locations, setLocations] = useState("");
  const [scope, setScope] = useState("");
  const [closingName, setClosingName] = useState("");
  const [legalizing, setLegalizing] = useState(false);

  useEffect(() => {
    document.title = "Film Office Cover Letter | Filmmaker Genius";
  }, []);

  const legalize = async () => {
    const text = scope.trim();
    if (!text) return;
    setLegalizing(true);
    try {
      const res = await aiInvoke<{ text?: string; error?: string }>("legalize-text", {
        body: {
          text,
          context: "film office cover letter — scope of the production and request",
        },
      });
      if (res?.text) {
        setScope(res.text);
        toast.success("Paragraph rewritten");
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

  const salutationTarget = recipientName.trim()
    ? recipientName.trim()
    : filmOffice.trim()
      ? filmOffice.trim()
      : "Film Office";
  const salutation = `Dear ${salutationTarget},`;

  const para1 = `My name is ${v(senderName, "From (Name & Title)")}, and I am writing on behalf of ${v(
    company,
    "Production Company",
  )} regarding our ${projectType.toLowerCase()} production, "${v(
    productionName,
    "Production Name",
  )}." We are seeking permission and any required permits to film at the following location(s): ${v(
    locations,
    "Requested Location(s)",
  )}.`;

  const para2 = v(scope, "Scope of the production and request");

  const para3 = `We anticipate filming on the following date(s): ${v(
    shootDates,
    "Shoot Dates",
  )}. We are fully prepared to provide a certificate of insurance, comply with all local regulations, and coordinate with your office on parking, public notifications, and safety.`;

  const para4 = `Thank you for your time and consideration. Please let me know what additional information or documentation you require. I can be reached at ${v(
    senderContact,
    "Contact (email / phone)",
  )}.`;

  const signatureName = closingName.trim()
    ? closingName.trim()
    : v(senderName, "Signature Name & Title");

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

    // Sender block
    writeBlock(v(company, "Production Company"), 0);
    writeBlock(v(senderName, "From (Name & Title)"), 0);
    writeBlock(v(senderContact, "Contact (email / phone)"), lineHeight);

    // Date
    writeBlock(formatDate(letterDate), lineHeight);

    // Recipient block
    writeBlock(v(filmOffice, "Film Office / Agency"), 0);
    if (recipientName.trim()) writeBlock(`Attn: ${recipientName.trim()}`, 0);
    if (recipientAddress.trim()) writeBlock(recipientAddress.trim(), 0);
    y += lineHeight;

    writeBlock(salutation, lineHeight);

    [para1, para2, para3, para4].forEach((p) => writeBlock(p, lineHeight));

    writeBlock("Sincerely,", lineHeight * 3);
    writeBlock(signatureName, 0);
    writeBlock(v(company, "Production Company"), 0);

    footer();
    return doc;
  };

  const fileBase = () => {
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeOffice = (filmOffice || "Film_Office").replace(/[^a-zA-Z0-9]/g, "_");
    return `${safeProduction}_${safeOffice}_Cover_Letter`;
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
    setCompany("");
    setSenderName("");
    setSenderContact("");
    setLetterDate("");
    setFilmOffice("");
    setRecipientName("");
    setRecipientAddress("");
    setProductionName("");
    setProjectType("Short");
    setShootDates("");
    setLocations("");
    setScope("");
    setClosingName("");
  };

  const ph = (text: string) => <span className="italic text-gray-500">{text}</span>;

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Film Office Cover Letter</h1>
          <p className="text-muted-foreground">
            A polished introduction letter to a film office or permitting agency requesting permission to shoot.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers introducing a project to a film office.</li>
                <li>Location managers requesting permits.</li>
                <li>Anyone opening a conversation with an agency.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Introduces the production and the company.</li>
                <li>States the dates, locations, and request.</li>
                <li>Offers insurance and compliance up front.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sender</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company">Production Company</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="sender_name">From (Name &amp; Title)</Label>
                  <Input
                    id="sender_name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sender_contact">Contact (email / phone)</Label>
                  <Input
                    id="sender_contact"
                    value={senderContact}
                    onChange={(e) => setSenderContact(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="letter_date">Date</Label>
                  <Input
                    id="letter_date"
                    type="date"
                    value={letterDate}
                    onChange={(e) => setLetterDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recipient</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="film_office">Film Office / Agency</Label>
                  <Input
                    id="film_office"
                    value={filmOffice}
                    onChange={(e) => setFilmOffice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recipient_name">Attn / Contact (optional)</Label>
                  <Input
                    id="recipient_name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recipient_address">Agency Address (optional)</Label>
                  <Input
                    id="recipient_address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="production_name">Production Name</Label>
                  <Input
                    id="production_name"
                    value={productionName}
                    onChange={(e) => setProductionName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="project_type">Project Type</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger id="project_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shoot_dates">Shoot Dates</Label>
                  <Input
                    id="shoot_dates"
                    placeholder="Aug 13–15, 2026"
                    value={shootDates}
                    onChange={(e) => setShootDates(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="locations">Requested Location(s)</Label>
                  <Input
                    id="locations"
                    placeholder="Vase Glusca 25 & surrounding street, Banja Luka"
                    value={locations}
                    onChange={(e) => setLocations(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="scope">Scope of Request</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={legalizing || !scope.trim()}
                      onClick={legalize}
                    >
                      {legalizing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Make Professional
                    </Button>
                  </div>
                  <Textarea
                    id="scope"
                    rows={5}
                    placeholder="Brief scope — what you're shooting, crew size, footprint, any street use or effects"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="closing_name">Signature Name &amp; Title</Label>
                  <Input
                    id="closing_name"
                    placeholder="Sal Framondi, Producer"
                    value={closingName}
                    onChange={(e) => setClosingName(e.target.value)}
                  />
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
                      <p>{company.trim() || ph("[Production Company]")}</p>
                      <p>{senderName.trim() || ph("[From (Name & Title)]")}</p>
                      <p>{senderContact.trim() || ph("[Contact (email / phone)]")}</p>
                    </div>

                    <p className="mt-6">
                      {letterDate.trim() ? formatDate(letterDate) : ph("[Date]")}
                    </p>

                    <div className="mt-6 space-y-0.5">
                      <p>{filmOffice.trim() || ph("[Film Office / Agency]")}</p>
                      {recipientName.trim() && <p>Attn: {recipientName.trim()}</p>}
                      {recipientAddress.trim() && <p>{recipientAddress.trim()}</p>}
                    </div>

                    <p className="mt-6">{salutation}</p>

                    <div className="mt-4 space-y-4 text-justify">
                      <p>{para1}</p>
                      <p>{para2}</p>
                      <p>{para3}</p>
                      <p>{para4}</p>
                    </div>

                    <div className="mt-8">
                      <p>Sincerely,</p>
                      <div className="h-12" />
                      <p>{signatureName}</p>
                      <p>{company.trim() || ph("[Production Company]")}</p>
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

export default FilmOfficeCoverLetter;
