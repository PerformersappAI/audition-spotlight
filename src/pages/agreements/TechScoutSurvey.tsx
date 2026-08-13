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

interface ActionItem {
  item: string;
  owner: string;
  status: string;
}

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const SIGNAL_OPTIONS = ["Strong", "Adequate", "Weak", "None"];
const STATUS_OPTIONS = ["Open", "In progress", "Resolved"];

const TechScoutSurvey = () => {
  const [productionName, setProductionName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [surveyDate, setSurveyDate] = useState("");
  const [attendees, setAttendees] = useState("");

  const [powerElectric, setPowerElectric] = useState("");
  const [cameraGrip, setCameraGrip] = useState("");
  const [lighting, setLighting] = useState("");
  const [sound, setSound] = useState("");
  const [artSet, setArtSet] = useState("");
  const [accessLogistics, setAccessLogistics] = useState("");
  const [safety, setSafety] = useState("");
  const [cellSignal, setCellSignal] = useState("Adequate");
  const [comms, setComms] = useState("");

  const [items, setItems] = useState<ActionItem[]>([{ item: "", owner: "", status: "Open" }]);
  const [photos, setPhotos] = useState<Photo[]>([{ image: "", caption: "" }]);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  const updateItem = (index: number, patch: Partial<ActionItem>) =>
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  const addItem = () => setItems((prev) => [...prev, { item: "", owner: "", status: "Open" }]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const updatePhoto = (index: number, patch: Partial<Photo>) =>
    setPhotos((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
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

  const findingRows: Array<[string, string]> = [
    ["Power / Electric", powerElectric],
    ["Camera / Grip", cameraGrip],
    ["Lighting", lighting],
    ["Sound", sound],
    ["Art / Set Dressing", artSet],
    ["Access / Logistics", accessLogistics],
    ["Cell Signal", cellSignal],
    ["Comms / Internet", comms],
    ["Safety", safety],
  ];

  const filledItems = items.filter((it) => it.item.trim() || it.owner.trim());

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
    doc.text("TECH SCOUT / LOCATION SURVEY", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    writeLine("Production", v(productionName, "Production Name"));
    writeLine("Location", v(locationName, "Location Name"));
    writeLine("Address", v(address, "Address"));
    writeLine("Tech Scout Date", v(surveyDate, "Tech Scout Date"));
    writeLine("Attendees", v(attendees, "Attendees / Depts Present"));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DEPARTMENT SURVEY", margin, y);
    y += 6;

    findingRows.forEach(([label, value]) => writeLine(label, value));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("ACTION ITEMS", margin, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (filledItems.length) {
      filledItems.forEach((it) => {
        const text = `• ${it.item.trim() || "—"} — ${it.owner.trim() || "—"} — [${it.status}]`;
        const lines = doc.splitTextToSize(text, contentWidth) as string[];
        ensure(lines.length * 5 + 1);
        lines.forEach((line, i) => doc.text(line, margin, y + i * 5));
        y += lines.length * 5 + 1;
      });
    } else {
      ensure(6);
      doc.text("—", margin, y);
      y += 6;
    }
    y += 4;

    const withImages = photos.filter((p) => p.image || p.caption.trim());
    if (withImages.length) {
      ensure(10);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("REFERENCE PHOTOS", margin, y);
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
    doc.save(`${safeProduction}_${safeLocation}_Tech_Scout_Survey.pdf`);
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
    setSurveyDate("");
    setAttendees("");
    setPowerElectric("");
    setCameraGrip("");
    setLighting("");
    setSound("");
    setArtSet("");
    setAccessLogistics("");
    setSafety("");
    setCellSignal("Adequate");
    setComms("");
    setItems([{ item: "", owner: "", status: "Open" }]);
    setPhotos([{ image: "", caption: "" }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Tech Scout / Location Survey</h1>
          <p className="text-muted-foreground">
            The technical, department-by-department survey of a locked location before the shoot.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Department heads on the tech scout.</li>
                <li>1st ADs and production managers.</li>
                <li>Anyone finalizing a location's logistics.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Records each department's technical findings.</li>
                <li>Captures power, sound, access, and safety.</li>
                <li>Tracks open action items before the shoot.</li>
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
                  <Label htmlFor="survey_date">Tech Scout Date</Label>
                  <Input id="survey_date" type="date" value={surveyDate} onChange={(e) => setSurveyDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="attendees">Attendees / Depts Present</Label>
                  <Input
                    id="attendees"
                    placeholder="Director, DP, gaffer, sound, 1st AD, LM…"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Survey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="power_electric">Power / Electric</Label>
                  <Textarea
                    id="power_electric"
                    rows={3}
                    placeholder="Available power, tie-in / distro, circuits, generator needs"
                    value={powerElectric}
                    onChange={(e) => setPowerElectric(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="camera_grip">Camera / Grip</Label>
                  <Textarea
                    id="camera_grip"
                    rows={3}
                    placeholder="Camera positions, rigging points, dolly / crane space"
                    value={cameraGrip}
                    onChange={(e) => setCameraGrip(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lighting">Lighting</Label>
                  <Textarea
                    id="lighting"
                    rows={3}
                    placeholder="Ambient light, practicals, window control, day / night"
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sound">Sound</Label>
                  <Textarea
                    id="sound"
                    rows={3}
                    placeholder="Noise sources, HVAC control, quiet windows"
                    value={sound}
                    onChange={(e) => setSound(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="art_set">Art / Set Dressing</Label>
                  <Textarea
                    id="art_set"
                    rows={3}
                    placeholder="What stays / goes, dressing needs, clearances"
                    value={artSet}
                    onChange={(e) => setArtSet(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="access_logistics">Access / Logistics</Label>
                  <Textarea
                    id="access_logistics"
                    rows={3}
                    placeholder="Load-in path, parking, staging / holding, restrooms"
                    value={accessLogistics}
                    onChange={(e) => setAccessLogistics(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="safety">Safety</Label>
                  <Textarea
                    id="safety"
                    rows={3}
                    placeholder="Hazards, fire exits, power shut-off, nearest hospital"
                    value={safety}
                    onChange={(e) => setSafety(e.target.value)}
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
                  <Label htmlFor="comms">Comms / Internet</Label>
                  <Input
                    id="comms"
                    placeholder="Wi-Fi, radio dead zones"
                    value={comms}
                    onChange={(e) => setComms(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Action Items</CardTitle>
                <Button type="button" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((it, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2">
                    <Input
                      className="flex-1 min-w-[10rem]"
                      placeholder="Action item"
                      value={it.item}
                      onChange={(e) => updateItem(index, { item: e.target.value })}
                    />
                    <Input
                      className="w-40"
                      placeholder="Owner"
                      value={it.owner}
                      onChange={(e) => updateItem(index, { owner: e.target.value })}
                    />
                    <div className="w-40">
                      <Select value={it.status} onValueChange={(val) => updateItem(index, { status: val })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      disabled={items.length <= 1}
                      onClick={() => removeItem(index)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Reference Photos</CardTitle>
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
                                alt={`Reference photo ${index + 1}`}
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
                  <h2 className="text-center font-bold tracking-wide text-base">TECH SCOUT / LOCATION SURVEY</h2>

                  <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs border-t border-b border-border py-3">
                    <span className="font-bold">Production:</span>
                    <span>{v(productionName, "Production Name")}</span>
                    <span className="font-bold">Location:</span>
                    <span>{v(locationName, "Location Name")}</span>
                    <span className="font-bold">Address:</span>
                    <span>{v(address, "Address")}</span>
                    <span className="font-bold">Tech Scout Date:</span>
                    <span>{v(surveyDate, "Tech Scout Date")}</span>
                    <span className="font-bold">Attendees:</span>
                    <span>{v(attendees, "Attendees / Depts Present")}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-widest mb-2">Department Survey</h3>
                    <div className="space-y-1 text-xs">
                      {findingRows.map(([label, value]) => (
                        <p key={label}>
                          <span className="font-bold">{label}: </span>
                          {v(value, label)}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-widest">Action Items</h3>
                    <table className="w-full text-xs border border-border">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-1 font-bold">Item</th>
                          <th className="text-left p-1 font-bold w-28">Owner</th>
                          <th className="text-left p-1 font-bold w-24">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filledItems.length ? (
                          filledItems.map((it, i) => (
                            <tr key={i} className="border-b border-border/60">
                              <td className="p-1 align-top">{it.item.trim() || "—"}</td>
                              <td className="p-1 align-top">{it.owner.trim() || "—"}</td>
                              <td className="p-1 align-top">{it.status}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="p-1" colSpan={3}>
                              [Action Items]
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {photos.some((p) => p.image || p.caption.trim()) ? (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-widest">Reference Photos</h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        {photos.map((photo, index) =>
                          photo.image || photo.caption.trim() ? (
                            <div key={index} className="space-y-1">
                              <div className="w-full aspect-video border border-border rounded-sm overflow-hidden bg-muted/30">
                                {photo.image ? (
                                  <img
                                    src={photo.image}
                                    alt={photo.caption.trim() || `Reference photo ${index + 1}`}
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

export default TechScoutSurvey;
