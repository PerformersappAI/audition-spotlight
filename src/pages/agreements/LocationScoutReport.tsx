import { useRef, useState } from "react";
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
import { Download, ImagePlus, Plus, Printer, RotateCcw, Trash2, X } from "lucide-react";

interface Photo {
  image: string;
  caption: string;
}

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const SIGNAL_OPTIONS = ["Strong", "Adequate", "Weak", "None"];
const REC_OPTIONS = ["Recommended", "Backup option", "Not suitable"];

const LocationScoutReport = () => {
  const [productionName, setProductionName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [scoutDate, setScoutDate] = useState("");
  const [scoutedBy, setScoutedBy] = useState("");

  const [power, setPower] = useState("");
  const [parking, setParking] = useState("");
  const [accessLoadIn, setAccessLoadIn] = useState("");
  const [restrooms, setRestrooms] = useState("");
  const [cellSignal, setCellSignal] = useState("Adequate");
  const [noise, setNoise] = useState("");
  const [permitsNotes, setPermitsNotes] = useState("");

  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [recommendation, setRecommendation] = useState("Recommended");

  const [photos, setPhotos] = useState<Photo[]>([{ image: "", caption: "" }]);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  const updatePhoto = (index: number, patch: Partial<Photo>) => {
    setPhotos((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const addPhoto = () => setPhotos((prev) => [...prev, { image: "", caption: "" }]);
  const removePhoto = (index: number) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const handleFile = (index: number, file: File | null | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updatePhoto(index, { image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const assessmentRows: Array<[string, string]> = [
    ["Power", power],
    ["Parking", parking],
    ["Access / Load-In", accessLoadIn],
    ["Restrooms", restrooms],
    ["Cell Signal", cellSignal],
    ["Noise / Sound Concerns", noise],
    ["Permits / Restrictions", permitsNotes],
  ];

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    const footer = () => {
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(120, 120, 120);
      doc.text("Filmmaker Genius — Document Library.", margin, pageHeight - 10);
      doc.setTextColor(0, 0, 0);
    };

    let y = margin;

    const ensure = (needed: number) => {
      if (y + needed > pageHeight - 18) {
        footer();
        doc.addPage();
        y = margin;
      }
    };

    const writeLine = (label: string, value: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = `${label}: `;
      const labelWidth = doc.getTextWidth(labelText);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(value.trim() || "—", contentWidth - labelWidth) as string[];
      ensure(lines.length * 5 + 2);
      doc.setFont("helvetica", "bold");
      doc.text(labelText, margin, y);
      doc.setFont("helvetica", "normal");
      lines.forEach((line, i) => {
        doc.text(line, margin + labelWidth, y + i * 5);
      });
      y += lines.length * 5 + 2;
    };

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("LOCATION SCOUT REPORT", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    writeLine("Production", v(productionName, "Production Name"));
    writeLine("Location", v(locationName, "Location Name"));
    writeLine("Address", v(address, "Address"));
    writeLine("Scout Date", v(scoutDate, "Scout Date"));
    writeLine("Scouted By", v(scoutedBy, "Scouted By"));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("ASSESSMENT", margin, y);
    y += 6;

    assessmentRows.forEach(([label, value]) => writeLine(label, value));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("RECOMMENDATION", margin, y);
    y += 6;

    writeLine("Pros", pros);
    writeLine("Cons", cons);

    ensure(8);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Recommendation: ${recommendation}`, margin, y);
    y += 8;

    const withImages = photos.filter((p) => p.image || p.caption.trim());
    if (withImages.length) {
      ensure(10);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("SCOUT PHOTOS", margin, y);
      y += 6;

      const imgW = contentWidth;
      const imgH = (imgW * 3) / 4;

      withImages.forEach((photo, index) => {
        ensure(imgH + 14);
        if (photo.image) {
          try {
            const format = photo.image.startsWith("data:image/png") ? "PNG" : "JPEG";
            doc.addImage(photo.image, format, margin, y, imgW, imgH);
          } catch {
            /* bad image — skip */
          }
          doc.setDrawColor(180, 180, 180);
          doc.rect(margin, y, imgW, imgH, "S");
          y += imgH + 5;
        }
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        const caption = doc.splitTextToSize(
          photo.caption.trim() || `Photo ${index + 1}`,
          contentWidth
        ) as string[];
        caption.forEach((line) => {
          doc.text(line, margin, y);
          y += 4.5;
        });
        y += 5;
      });
    }

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeLocation = (locationName || "Location").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeLocation}_Scout_Report.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setLocationName("");
    setAddress("");
    setScoutDate("");
    setScoutedBy("");
    setPower("");
    setParking("");
    setAccessLoadIn("");
    setRestrooms("");
    setCellSignal("Adequate");
    setNoise("");
    setPermitsNotes("");
    setPros("");
    setCons("");
    setRecommendation("Recommended");
    setPhotos([{ image: "", caption: "" }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Location Scout Report</h1>
          <p className="text-muted-foreground">
            Capture everything about a location — logistics, notes, pros and cons, and photos.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Location scouts and managers.</li>
                <li>Directors and producers evaluating options.</li>
                <li>Anyone comparing potential locations.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Records the key logistics of a location.</li>
                <li>Flags power, parking, access, and sound issues.</li>
                <li>Collects scout photos and a recommendation.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Header</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="production_name">Production Name</Label>
                  <Input id="production_name" value={productionName} onChange={(e) => setProductionName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="location_name">Location Name</Label>
                  <Input id="location_name" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="scout_date">Scout Date</Label>
                  <Input id="scout_date" type="date" value={scoutDate} onChange={(e) => setScoutDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="scouted_by">Scouted By</Label>
                  <Input id="scouted_by" value={scoutedBy} onChange={(e) => setScoutedBy(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="power">Power</Label>
                  <Input
                    id="power"
                    placeholder="Available outlets, amperage, generator needs…"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="parking">Parking</Label>
                  <Input
                    id="parking"
                    placeholder="Crew + truck parking situation"
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="access_load_in">Access / Load-In</Label>
                  <Input
                    id="access_load_in"
                    placeholder="Doors, elevators, stairs, distance from parking"
                    value={accessLoadIn}
                    onChange={(e) => setAccessLoadIn(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="restrooms">Restrooms</Label>
                  <Input
                    id="restrooms"
                    placeholder="On-site? Nearby?"
                    value={restrooms}
                    onChange={(e) => setRestrooms(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cell_signal">Cell Signal</Label>
                  <Select value={cellSignal} onValueChange={setCellSignal}>
                    <SelectTrigger id="cell_signal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SIGNAL_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="noise">Noise / Sound Concerns</Label>
                  <Input
                    id="noise"
                    placeholder="Traffic, HVAC, flight paths…"
                    value={noise}
                    onChange={(e) => setNoise(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="permits_notes">Permits / Restrictions</Label>
                  <Input
                    id="permits_notes"
                    placeholder="Permit needs, hours, owner rules"
                    value={permitsNotes}
                    onChange={(e) => setPermitsNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pros">Pros</Label>
                  <Textarea
                    id="pros"
                    rows={3}
                    placeholder="What works about this location"
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cons">Cons</Label>
                  <Textarea
                    id="cons"
                    rows={3}
                    placeholder="What's challenging"
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Select value={recommendation} onValueChange={setRecommendation}>
                    <SelectTrigger id="recommendation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REC_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Photos</CardTitle>
                <Button type="button" size="sm" onClick={addPhoto}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {photos.map((photo, index) => (
                    <Card key={index} className="border-border/50">
                      <CardContent className="p-3 space-y-3">
                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                          {photo.image ? (
                            <>
                              <img
                                src={photo.image}
                                alt={`Scout photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="secondary"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => updatePhoto(index, { image: "" })}
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <div className="w-full h-full border-2 border-dashed border-border rounded-md flex items-center justify-center">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => fileInputs.current[index]?.click()}
                              >
                                <ImagePlus className="h-4 w-4 mr-2" />
                                Upload photo
                              </Button>
                            </div>
                          )}
                          <input
                            ref={(el) => {
                              fileInputs.current[index] = el;
                            }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFile(index, e.target.files?.[0])}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                            Photo {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={photos.length <= 1}
                            onClick={() => removePhoto(index)}
                            aria-label="Remove photo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div>
                          <Label htmlFor={`caption-${index}`}>Caption</Label>
                          <Input
                            id={`caption-${index}`}
                            placeholder="What this shows"
                            value={photo.caption}
                            onChange={(e) => updatePhoto(index, { caption: e.target.value })}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: preview */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={reset} variant="ghost">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <Card>
              <CardContent className="p-6 max-h-[75vh] overflow-y-auto">
                <article className="font-serif text-sm leading-relaxed space-y-4">
                  <h2 className="text-center font-bold tracking-wide text-base">LOCATION SCOUT REPORT</h2>

                  <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs border-t border-b border-border py-3">
                    <span className="font-bold">Production:</span>
                    <span>{v(productionName, "Production Name")}</span>
                    <span className="font-bold">Location:</span>
                    <span>{v(locationName, "Location Name")}</span>
                    <span className="font-bold">Address:</span>
                    <span>{v(address, "Address")}</span>
                    <span className="font-bold">Scout Date:</span>
                    <span>{v(scoutDate, "Scout Date")}</span>
                    <span className="font-bold">Scouted By:</span>
                    <span>{v(scoutedBy, "Scouted By")}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-widest mb-2">Assessment</h3>
                    <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs">
                      {assessmentRows.map(([label, value]) => (
                        <div key={label} className="contents">
                          <span className="font-bold">{label}:</span>
                          <span>{v(value, label)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-widest">Recommendation</h3>
                    <p className="text-xs">
                      <span className="font-bold">Pros: </span>
                      {v(pros, "Pros")}
                    </p>
                    <p className="text-xs">
                      <span className="font-bold">Cons: </span>
                      {v(cons, "Cons")}
                    </p>
                    <p className="text-xs font-bold">Recommendation: {recommendation}</p>
                  </div>

                  {photos.some((p) => p.image || p.caption.trim()) ? (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-widest">Scout Photos</h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {photos.map((photo, index) =>
                          photo.image || photo.caption.trim() ? (
                            <div key={index} className="space-y-1">
                              <div className="w-full aspect-video border border-border rounded-sm overflow-hidden bg-muted/30">
                                {photo.image ? (
                                  <img
                                    src={photo.image}
                                    alt={photo.caption.trim() || `Scout photo ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : null}
                              </div>
                              <p className="text-xs italic">{photo.caption.trim() || `Photo ${index + 1}`}</p>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  ) : null}

                  <p className="text-xs italic text-muted-foreground pt-2">Filmmaker Genius — Document Library.</p>
                </article>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">Filmmaker Genius — Document Library.</p>
      </div>
    </div>
  );
};

export default LocationScoutReport;
