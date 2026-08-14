import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface FileRow {
  file: string;
  scene: string;
  take: string;
  tracks: string;
  circled: boolean;
  notes: string;
}

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const SoundReport = () => {
  const [productionName, setProductionName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [soundRoll, setSoundRoll] = useState("");
  const [mixer, setMixer] = useState("");
  const [boom, setBoom] = useState("");
  const [recorder, setRecorder] = useState("");
  const [sampleRate, setSampleRate] = useState("");
  const [bitDepth, setBitDepth] = useState("");
  const [timecode, setTimecode] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");

  const [files, setFiles] = useState<FileRow[]>([
    { file: "", scene: "", take: "", tracks: "", circled: false, notes: "" },
  ]);

  const updateFile = (index: number, patch: Partial<FileRow>) =>
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));

  const addFile = () =>
    setFiles((prev) => [
      ...prev,
      { file: "", scene: "", take: "", tracks: "", circled: false, notes: "" },
    ]);

  const removeFile = (index: number) => {
    if (files.length <= 1) return;
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Date", reportDate, "Date"],
    ["Sound Roll / Media #", soundRoll, "Sound Roll / Media #"],
    ["Sound Mixer", mixer, "Sound Mixer"],
    ["Boom Op", boom, "Boom Op"],
    ["Recorder / Device", recorder, "Recorder / Device"],
    ["Sample Rate", sampleRate, "Sample Rate"],
    ["Bit Depth", bitDepth, "Bit Depth"],
    ["Timecode / Frame Rate", timecode, "Timecode / Frame Rate"],
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
    doc.text("SOUND REPORT", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, v(value, placeholder)));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("FILES", margin, y);
    y += 6;

    const colX = {
      file: margin,
      scene: margin + 24,
      take: margin + 46,
      tracks: margin + 66,
      circled: margin + 120,
      notes: margin + 134,
    };

    const drawTableHeader = () => {
      ensure(10);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("File #", colX.file, y);
      doc.text("Scene", colX.scene, y);
      doc.text("Take", colX.take, y);
      doc.text("Track Layout", colX.tracks, y);
      doc.text("Circ", colX.circled, y);
      doc.text("Notes", colX.notes, y);
      y += 5;
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
    };

    drawTableHeader();

    doc.setFont("helvetica", "normal");
    files.forEach((file) => {
      const tracksLines = doc.splitTextToSize(file.tracks.trim() || "—", colX.circled - colX.tracks - 4) as string[];
      const notesLines = doc.splitTextToSize(file.notes.trim() || "—", pageWidth - margin - colX.notes - 2) as string[];
      const rowHeight = Math.max(tracksLines.length * 5 + 2, notesLines.length * 5 + 2, 8);
      ensure(rowHeight + 6);

      doc.text(file.file.trim() || "—", colX.file, y);
      doc.text(file.scene.trim() || "—", colX.scene, y);
      doc.text(file.take.trim() || "—", colX.take, y);
      tracksLines.forEach((line, i) => doc.text(line, colX.tracks, y + i * 5));
      doc.text(file.circled ? "*" : "", colX.circled, y);
      notesLines.forEach((line, i) => doc.text(line, colX.notes, y + i * 5));
      y += rowHeight;
    });

    if (generalNotes.trim()) {
      y += 4;
      ensure(10);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("GENERAL NOTES", margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const noteLines = doc.splitTextToSize(generalNotes.trim(), contentWidth) as string[];
      ensure(noteLines.length * 5 + 2);
      noteLines.forEach((line, i) => doc.text(line, margin, y + i * 5));
      y += noteLines.length * 5 + 2;
    }

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (reportDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    const safeRoll = (soundRoll || "SoundRoll").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_${safeRoll}_Sound_Report.pdf`);
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
    setSoundRoll("");
    setMixer("");
    setBoom("");
    setRecorder("");
    setSampleRate("");
    setBitDepth("");
    setTimecode("");
    setGeneralNotes("");
    setFiles([{ file: "", scene: "", take: "", tracks: "", circled: false, notes: "" }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Sound Report</h1>
          <p className="text-muted-foreground">
            The daily audio log — sound roll, sample rate, timecode, and a file-by-file take log.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Sound mixers logging the day's media.</li>
                <li>Editorial and post syncing dailies.</li>
                <li>Anyone tracking audio files and takes.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Logs every sound file with scene and take.</li>
                <li>Notes track layout and circled takes.</li>
                <li>Records sample rate, bit depth, and timecode.</li>
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
                    <Label htmlFor="sound_roll">Sound Roll / Media #</Label>
                    <Input
                      id="sound_roll"
                      value={soundRoll}
                      onChange={(e) => setSoundRoll(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mixer">Sound Mixer</Label>
                    <Input id="mixer" value={mixer} onChange={(e) => setMixer(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="boom">Boom Op</Label>
                    <Input id="boom" value={boom} onChange={(e) => setBoom(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="recorder">Recorder / Device</Label>
                  <Input
                    id="recorder"
                    value={recorder}
                    onChange={(e) => setRecorder(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sample_rate">Sample Rate</Label>
                    <Input
                      id="sample_rate"
                      placeholder="48 kHz"
                      value={sampleRate}
                      onChange={(e) => setSampleRate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bit_depth">Bit Depth</Label>
                    <Input
                      id="bit_depth"
                      placeholder="24-bit"
                      value={bitDepth}
                      onChange={(e) => setBitDepth(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="timecode">Timecode / Frame Rate</Label>
                  <Input
                    id="timecode"
                    placeholder="24 fps NDF"
                    value={timecode}
                    onChange={(e) => setTimecode(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="general_notes">General Notes</Label>
                  <Textarea
                    id="general_notes"
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="flex flex-wrap gap-2 items-end border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div className="w-24">
                      <Label className="text-xs">File #</Label>
                      <Input
                        value={file.file}
                        onChange={(e) => updateFile(index, { file: e.target.value })}
                      />
                    </div>
                    <div className="w-20">
                      <Label className="text-xs">Scene</Label>
                      <Input
                        value={file.scene}
                        onChange={(e) => updateFile(index, { scene: e.target.value })}
                      />
                    </div>
                    <div className="w-16">
                      <Label className="text-xs">Take</Label>
                      <Input
                        value={file.take}
                        onChange={(e) => updateFile(index, { take: e.target.value })}
                      />
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <Label className="text-xs">Track Layout / Channels</Label>
                      <Input
                        value={file.tracks}
                        onChange={(e) => updateFile(index, { tracks: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2 pb-2">
                      <Checkbox
                        id={`circled-${index}`}
                        checked={file.circled}
                        onCheckedChange={(checked) => updateFile(index, { circled: checked === true })}
                      />
                      <Label htmlFor={`circled-${index}`} className="text-xs font-normal">
                        Circled
                      </Label>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <Label className="text-xs">Notes</Label>
                      <Input
                        value={file.notes}
                        onChange={(e) => updateFile(index, { notes: e.target.value })}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      disabled={files.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addFile}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add File
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="ghost" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">Filmmaker Genius — Document Library.</p>
          </div>

          {/* RIGHT: live preview */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card className="border-2 border-primary/20 shadow-sm print:shadow-none print:border-black">
              <CardContent className="p-6 space-y-6 print:text-black">
                <div className="text-center border-b border-border pb-4">
                  <h2 className="text-xl font-bold uppercase tracking-wide">Sound Report</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div>
                    <span className="font-semibold">Production:</span> {v(productionName, "Production Name")}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span> {v(reportDate, "Date")}
                  </div>
                  <div>
                    <span className="font-semibold">Sound Roll / Media #:</span> {v(soundRoll, "Sound Roll / Media #")}
                  </div>
                  <div>
                    <span className="font-semibold">Sound Mixer:</span> {v(mixer, "Sound Mixer")}
                  </div>
                  <div>
                    <span className="font-semibold">Boom Op:</span> {v(boom, "Boom Op")}
                  </div>
                  <div>
                    <span className="font-semibold">Recorder / Device:</span> {v(recorder, "Recorder / Device")}
                  </div>
                  <div>
                    <span className="font-semibold">Sample Rate:</span> {v(sampleRate, "Sample Rate")}
                  </div>
                  <div>
                    <span className="font-semibold">Bit Depth:</span> {v(bitDepth, "Bit Depth")}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold">Timecode / Frame Rate:</span> {v(timecode, "Timecode / Frame Rate")}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold">File #</th>
                        <th className="text-left py-2 font-semibold">Scene</th>
                        <th className="text-left py-2 font-semibold">Take</th>
                        <th className="text-left py-2 font-semibold">Track Layout</th>
                        <th className="text-center py-2 font-semibold">Circled</th>
                        <th className="text-left py-2 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="py-2">{file.file.trim() || "—"}</td>
                          <td className="py-2">{file.scene.trim() || "—"}</td>
                          <td className="py-2">{file.take.trim() || "—"}</td>
                          <td className="py-2">{file.tracks.trim() || "—"}</td>
                          <td className="py-2 text-center">{file.circled ? "●" : ""}</td>
                          <td className="py-2">{file.notes.trim() || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {generalNotes.trim() && (
                  <div>
                    <p className="font-semibold text-sm mb-1">General Notes</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{generalNotes.trim()}</p>
                  </div>
                )}

                <p className="text-center text-xs text-muted-foreground pt-4">
                  Filmmaker Genius — Document Library.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundReport;
