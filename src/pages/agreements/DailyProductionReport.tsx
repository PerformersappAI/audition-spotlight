import { Fragment, useState } from "react";
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
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface SceneRow {
  scene: string;
  description: string;
  pages: string;
  status: string;
}

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const STATUS_OPTIONS = ["Completed", "Partial", "Held", "Omitted"];

const DailyProductionReport = () => {
  const [productionName, setProductionName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [dayNumber, setDayNumber] = useState("");
  const [director, setDirector] = useState("");
  const [producer, setProducer] = useState("");
  const [upmAd, setUpmAd] = useState("");
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState("");

  const [crewCall, setCrewCall] = useState("");
  const [shootingCall, setShootingCall] = useState("");
  const [lunch, setLunch] = useState("");
  const [firstAfterLunch, setFirstAfterLunch] = useState("");
  const [lastShot, setLastShot] = useState("");
  const [cameraWrap, setCameraWrap] = useState("");
  const [wrap, setWrap] = useState("");

  const [scenesScheduled, setScenesScheduled] = useState("");
  const [scenesCompleted, setScenesCompleted] = useState("");
  const [pagesScheduled, setPagesScheduled] = useState("");
  const [pagesCompleted, setPagesCompleted] = useState("");
  const [setups, setSetups] = useState("");
  const [screenMinutes, setScreenMinutes] = useState("");
  const [castCount, setCastCount] = useState("");
  const [crewCount, setCrewCount] = useState("");
  const [bgCount, setBgCount] = useState("");
  const [mealsServed, setMealsServed] = useState("");

  const [scenes, setScenes] = useState<SceneRow[]>([
    { scene: "", description: "", pages: "", status: "Completed" },
  ]);

  const [productionNotes, setProductionNotes] = useState("");
  const [delaysNotes, setDelaysNotes] = useState("");
  const [preparedBy, setPreparedBy] = useState("");

  const updateScene = (index: number, patch: Partial<SceneRow>) =>
    setScenes((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  const addScene = () =>
    setScenes((prev) => [...prev, { scene: "", description: "", pages: "", status: "Completed" }]);

  const removeScene = (index: number) => {
    if (scenes.length <= 1) return;
    setScenes((prev) => prev.filter((_, i) => i !== index));
  };

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Date", reportDate, "Date"],
    ["Day", dayNumber, "Day"],
    ["Director", director, "Director"],
    ["Producer", producer, "Producer"],
    ["UPM / 1st AD", upmAd, "UPM / 1st AD"],
    ["Location", location, "Location"],
    ["Weather", weather, "Weather"],
  ] as const;

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
    doc.text("DAILY PRODUCTION REPORT", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, v(value, placeholder)));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("TIMES", margin, y);
    y += 6;

    const times = [
      ["Crew Call", crewCall],
      ["Shooting Call", shootingCall],
      ["Lunch", lunch],
      ["First After Lunch", firstAfterLunch],
      ["Last Shot", lastShot],
      ["Camera Wrap", cameraWrap],
      ["Wrap", wrap],
    ] as const;
    times.forEach(([label, value]) => writeLine(label, value));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DAY SUMMARY", margin, y);
    y += 6;

    const summaryLines = [
      `Scenes: ${scenesCompleted.trim() || "0"} / ${scenesScheduled.trim() || "0"}`,
      `Pages: ${pagesCompleted.trim() || "—"} / ${pagesScheduled.trim() || "—"}`,
      `Setups: ${setups.trim() || "—"}`,
      `Screen Time: ${screenMinutes.trim() || "—"} min`,
      `Cast: ${castCount.trim() || "—"}`,
      `Crew: ${crewCount.trim() || "—"}`,
      `Background: ${bgCount.trim() || "—"}`,
      `Meals Served: ${mealsServed.trim() || "—"}`,
    ];
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    summaryLines.forEach((line) => {
      ensure(6);
      doc.text(line, margin, y);
      y += 6;
    });

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SCENES SHOT", margin, y);
    y += 6;

    const colX = {
      scene: margin,
      description: margin + 28,
      pages: margin + contentWidth - 36,
      status: margin + contentWidth - 18,
    };

    ensure(10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Scene", colX.scene, y);
    doc.text("Description", colX.description, y);
    doc.text("Pages", colX.pages, y);
    doc.text("Status", colX.status, y);
    y += 5;
    doc.setDrawColor(180, 180, 180);
    doc.line(margin, y - 2, pageWidth - margin, y - 2);

    doc.setFont("helvetica", "normal");
    scenes.forEach((s) => {
      const descLines = doc.splitTextToSize(s.description.trim() || "—", colX.pages - colX.description - 4) as string[];
      const rowHeight = Math.max(descLines.length * 5 + 2, 8);
      ensure(rowHeight + 2);
      doc.text(s.scene.trim() || "—", colX.scene, y);
      descLines.forEach((line, i) => doc.text(line, colX.description, y + i * 5));
      doc.text(s.pages.trim() || "—", colX.pages, y);
      doc.text(s.status, colX.status, y);
      y += rowHeight;
    });

    y += 4;
    if (productionNotes.trim()) {
      ensure(10);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("NOTES", margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const noteLines = doc.splitTextToSize(productionNotes.trim(), contentWidth) as string[];
      ensure(noteLines.length * 5 + 2);
      noteLines.forEach((line, i) => doc.text(line, margin, y + i * 5));
      y += noteLines.length * 5 + 2;
    }

    if (delaysNotes.trim()) {
      ensure(10);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("DELAYS / LOST TIME", margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const delayLines = doc.splitTextToSize(delaysNotes.trim(), contentWidth) as string[];
      ensure(delayLines.length * 5 + 2);
      delayLines.forEach((line, i) => doc.text(line, margin, y + i * 5));
      y += delayLines.length * 5 + 2;
    }

    y += 6;
    ensure(20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Prepared by: ${preparedBy.trim() || "—"}`, margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text("Signature: _________________________________", margin, y);
    y += 10;

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (reportDate || "DPR").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_Daily_Production_Report.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setReportDate("");
    setDayNumber("");
    setDirector("");
    setProducer("");
    setUpmAd("");
    setLocation("");
    setWeather("");
    setCrewCall("");
    setShootingCall("");
    setLunch("");
    setFirstAfterLunch("");
    setLastShot("");
    setCameraWrap("");
    setWrap("");
    setScenesScheduled("");
    setScenesCompleted("");
    setPagesScheduled("");
    setPagesCompleted("");
    setSetups("");
    setScreenMinutes("");
    setCastCount("");
    setCrewCount("");
    setBgCount("");
    setMealsServed("");
    setScenes([{ scene: "", description: "", pages: "", status: "Completed" }]);
    setProductionNotes("");
    setDelaysNotes("");
    setPreparedBy("");
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Daily Production Report (DPR)</h1>
          <p className="text-muted-foreground">
            The end-of-day wrap report — scenes, pages, times, counts, and notes.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>1st ADs and UPMs closing out the day.</li>
                <li>Producers tracking progress vs. schedule.</li>
                <li>Anyone reporting the day's results.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Summarizes scenes and pages shot vs. scheduled.</li>
                <li>Logs call, meal, and wrap times and head counts.</li>
                <li>Records notes, delays, and lost time.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Production</CardTitle>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="report_date">Date</Label>
                    <Input
                      id="report_date"
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="day_number">Day</Label>
                    <Input
                      id="day_number"
                      placeholder="Day 4 of 7"
                      value={dayNumber}
                      onChange={(e) => setDayNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="director">Director</Label>
                    <Input id="director" value={director} onChange={(e) => setDirector(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="producer">Producer</Label>
                    <Input id="producer" value={producer} onChange={(e) => setProducer(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="upm_ad">UPM / 1st AD</Label>
                  <Input id="upm_ad" value={upmAd} onChange={(e) => setUpmAd(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="weather">Weather</Label>
                    <Input id="weather" value={weather} onChange={(e) => setWeather(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Times</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crew_call">Crew Call</Label>
                  <Input id="crew_call" value={crewCall} onChange={(e) => setCrewCall(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="shooting_call">Shooting Call / First Shot</Label>
                  <Input
                    id="shooting_call"
                    value={shootingCall}
                    onChange={(e) => setShootingCall(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lunch">Lunch (in–out)</Label>
                  <Input
                    id="lunch"
                    placeholder="13:00–14:00"
                    value={lunch}
                    onChange={(e) => setLunch(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="first_after_lunch">First Shot After Lunch</Label>
                  <Input
                    id="first_after_lunch"
                    value={firstAfterLunch}
                    onChange={(e) => setFirstAfterLunch(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="last_shot">Last Shot</Label>
                  <Input id="last_shot" value={lastShot} onChange={(e) => setLastShot(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="camera_wrap">Camera Wrap</Label>
                  <Input id="camera_wrap" value={cameraWrap} onChange={(e) => setCameraWrap(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="wrap">Wrap</Label>
                  <Input id="wrap" value={wrap} onChange={(e) => setWrap(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Day Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="scenes_scheduled">Scenes Scheduled</Label>
                  <Input
                    id="scenes_scheduled"
                    value={scenesScheduled}
                    onChange={(e) => setScenesScheduled(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="scenes_completed">Scenes Completed</Label>
                  <Input
                    id="scenes_completed"
                    value={scenesCompleted}
                    onChange={(e) => setScenesCompleted(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pages_scheduled">Pages Scheduled</Label>
                  <Input
                    id="pages_scheduled"
                    placeholder="3 1/8"
                    value={pagesScheduled}
                    onChange={(e) => setPagesScheduled(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pages_completed">Pages Completed</Label>
                  <Input
                    id="pages_completed"
                    value={pagesCompleted}
                    onChange={(e) => setPagesCompleted(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="setups">Setups</Label>
                  <Input id="setups" value={setups} onChange={(e) => setSetups(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="screen_minutes">Screen Time (min)</Label>
                  <Input
                    id="screen_minutes"
                    value={screenMinutes}
                    onChange={(e) => setScreenMinutes(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cast_count">Cast</Label>
                  <Input id="cast_count" value={castCount} onChange={(e) => setCastCount(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="crew_count">Crew</Label>
                  <Input id="crew_count" value={crewCount} onChange={(e) => setCrewCount(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="bg_count">Background</Label>
                  <Input id="bg_count" value={bgCount} onChange={(e) => setBgCount(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="meals_served">Meals Served</Label>
                  <Input
                    id="meals_served"
                    value={mealsServed}
                    onChange={(e) => setMealsServed(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Scenes Shot</CardTitle>
                <Button type="button" size="sm" onClick={addScene}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Scene
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {scenes.map((s, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2">
                    <Input
                      className="w-24"
                      placeholder="Scene"
                      value={s.scene}
                      onChange={(e) => updateScene(index, { scene: e.target.value })}
                    />
                    <Input
                      className="flex-1 min-w-[10rem]"
                      placeholder="Description"
                      value={s.description}
                      onChange={(e) => updateScene(index, { description: e.target.value })}
                    />
                    <Input
                      className="w-24"
                      placeholder="Pages"
                      value={s.pages}
                      onChange={(e) => updateScene(index, { pages: e.target.value })}
                    />
                    <div className="w-36">
                      <Select
                        value={s.status}
                        onValueChange={(val) => updateScene(index, { status: val })}
                      >
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
                      disabled={scenes.length <= 1}
                      onClick={() => removeScene(index)}
                      aria-label="Remove scene"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="production_notes">Production Notes</Label>
                  <Textarea
                    id="production_notes"
                    rows={3}
                    value={productionNotes}
                    onChange={(e) => setProductionNotes(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="delays_notes">Delays / Lost Time</Label>
                  <Textarea
                    id="delays_notes"
                    rows={3}
                    value={delaysNotes}
                    onChange={(e) => setDelaysNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prepared By</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="prepared_by">Prepared By (Name & Title)</Label>
                  <Input
                    id="prepared_by"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
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
                  <div className="bg-white text-black p-8 min-h-[600px]">
                    <h2 className="text-center text-2xl font-bold uppercase tracking-wide text-black mb-6">
                      Daily Production Report
                    </h2>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-6">
                      {headerRows.map(([label, value, placeholder], idx) => (
                        <Fragment key={idx}>
                          <p>
                            <span className="font-semibold">{label}:</span>{" "}
                            {value.trim() || <span className="italic text-gray-500">[{placeholder}]</span>}
                          </p>
                        </Fragment>
                      ))}
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Times</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {[
                          ["Crew Call", crewCall],
                          ["Shooting Call", shootingCall],
                          ["Lunch", lunch],
                          ["First After Lunch", firstAfterLunch],
                          ["Last Shot", lastShot],
                          ["Camera Wrap", cameraWrap],
                          ["Wrap", wrap],
                        ].map(([label, value], idx) => (
                          <div key={idx} className="border border-gray-200 p-2 rounded">
                            <p className="text-xs text-gray-500">{label}</p>
                            <p className="font-medium">{value.trim() || <span className="italic text-gray-400">—</span>}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Day Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {[
                          ["Scenes", `${scenesCompleted || "0"} / ${scenesScheduled || "0"}`],
                          ["Pages", `${pagesCompleted || "—"} / ${pagesScheduled || "—"}`],
                          ["Setups", setups],
                          ["Screen Time", `${screenMinutes ? `${screenMinutes} min` : "—"}`],
                          ["Cast", castCount],
                          ["Crew", crewCount],
                          ["Background", bgCount],
                          ["Meals Served", mealsServed],
                        ].map(([label, value], idx) => (
                          <div key={idx} className="border border-gray-200 p-2 rounded">
                            <p className="text-xs text-gray-500">{label}</p>
                            <p className="font-medium">{value.trim() || <span className="italic text-gray-400">—</span>}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Scenes Shot</h3>
                      <div className="border border-gray-200 rounded overflow-hidden">
                        <div className="grid grid-cols-12 gap-2 bg-gray-100 p-2 text-xs font-semibold">
                          <div className="col-span-2">Scene</div>
                          <div className="col-span-6">Description</div>
                          <div className="col-span-2">Pages</div>
                          <div className="col-span-2">Status</div>
                        </div>
                        {scenes.map((s, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 p-2 text-sm border-t border-gray-100"
                          >
                            <div className="col-span-2">{s.scene.trim() || <span className="italic text-gray-400">—</span>}</div>
                            <div className="col-span-6">{s.description.trim() || <span className="italic text-gray-400">—</span>}</div>
                            <div className="col-span-2">{s.pages.trim() || <span className="italic text-gray-400">—</span>}</div>
                            <div className="col-span-2">{s.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Notes</h3>
                        <p className="text-sm whitespace-pre-wrap">
                          {productionNotes.trim() || <span className="italic text-gray-400">[Production Notes]</span>}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Delays / Lost Time</h3>
                        <p className="text-sm whitespace-pre-wrap">
                          {delaysNotes.trim() || <span className="italic text-gray-400">[Delays / Lost Time]</span>}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <p className="text-sm font-semibold">Prepared by: {preparedBy.trim() || <span className="italic text-gray-500">[Name & Title]</span>}</p>
                      <p className="text-sm mt-4">Signature: _________________________________</p>
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

export default DailyProductionReport;
