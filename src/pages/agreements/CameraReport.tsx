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

interface TakeRow {
  scene: string;
  take: string;
  lens: string;
  tstop: string;
  filter: string;
  fps: string;
  circled: boolean;
  remarks: string;
}

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const CameraReport = () => {
  const [productionName, setProductionName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [rollCard, setRollCard] = useState("");
  const [cameraBody, setCameraBody] = useState("");
  const [dp, setDp] = useState("");
  const [ac, setAc] = useState("");
  const [formatRes, setFormatRes] = useState("");
  const [fps, setFps] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");

  const [takes, setTakes] = useState<TakeRow[]>([
    { scene: "", take: "", lens: "", tstop: "", filter: "", fps: "", circled: false, remarks: "" },
  ]);

  const updateTake = (index: number, patch: Partial<TakeRow>) =>
    setTakes((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));

  const addTake = () =>
    setTakes((prev) => [
      ...prev,
      { scene: "", take: "", lens: "", tstop: "", filter: "", fps: "", circled: false, remarks: "" },
    ]);

  const removeTake = (index: number) => {
    if (takes.length <= 1) return;
    setTakes((prev) => prev.filter((_, i) => i !== index));
  };

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Date", reportDate, "Date"],
    ["Roll / Card #", rollCard, "Roll / Card #"],
    ["Camera / Body", cameraBody, "Camera / Body"],
    ["DP", dp, "DP"],
    ["1st AC", ac, "1st AC"],
    ["Format / Resolution", formatRes, "Format / Resolution"],
    ["Frame Rate", fps, "Frame Rate"],
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
    doc.text("CAMERA REPORT", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, v(value, placeholder)));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("TAKES", margin, y);
    y += 6;

    const colX = {
      scene: margin,
      take: margin + 26,
      lens: margin + 44,
      tstop: margin + 72,
      filter: margin + 94,
      fps: margin + 120,
      print: margin + 140,
      remarks: margin + 152,
    };

    const drawTableHeader = () => {
      ensure(10);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Scene", colX.scene, y);
      doc.text("Take", colX.take, y);
      doc.text("Lens", colX.lens, y);
      doc.text("T-Stop", colX.tstop, y);
      doc.text("Filter", colX.filter, y);
      doc.text("FPS", colX.fps, y);
      doc.text("Print", colX.print, y);
      doc.text("Remarks", colX.remarks, y);
      y += 5;
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
    };

    drawTableHeader();

    doc.setFont("helvetica", "normal");
    takes.forEach((take) => {
      const remarksLines = doc.splitTextToSize(take.remarks.trim() || "—", pageWidth - margin - colX.remarks - 2) as string[];
      const rowHeight = Math.max(remarksLines.length * 5 + 2, 8);
      ensure(rowHeight + 6);

      doc.text(take.scene.trim() || "—", colX.scene, y);
      doc.text(take.take.trim() || "—", colX.take, y);
      doc.text(take.lens.trim() || "—", colX.lens, y);
      doc.text(take.tstop.trim() || "—", colX.tstop, y);
      doc.text(take.filter.trim() || "—", colX.filter, y);
      doc.text(take.fps.trim() || "—", colX.fps, y);
      doc.text(take.circled ? "*" : "", colX.print, y);
      remarksLines.forEach((line, i) => doc.text(line, colX.remarks, y + i * 5));
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
    const safeRoll = (rollCard || "Roll").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_${safeRoll}_Camera_Report.pdf`);
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
    setRollCard("");
    setCameraBody("");
    setDp("");
    setAc("");
    setFormatRes("");
    setFps("");
    setGeneralNotes("");
    setTakes([{ scene: "", take: "", lens: "", tstop: "", filter: "", fps: "", circled: false, remarks: "" }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Camera Report</h1>
          <p className="text-muted-foreground">
            The daily camera log — roll/card, lens, stop, filter, frame rate, and circled takes.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Camera assistants logging each take.</li>
                <li>DITs and editorial tracking media.</li>
                <li>DPs reviewing the day's coverage.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Logs every take with lens and exposure.</li>
                <li>Marks circled (print) takes for editorial.</li>
                <li>Records roll/card and technical settings.</li>
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
                    <Label htmlFor="roll_card">Roll / Card #</Label>
                    <Input
                      id="roll_card"
                      value={rollCard}
                      onChange={(e) => setRollCard(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="camera_body">Camera / Body</Label>
                    <Input
                      id="camera_body"
                      value={cameraBody}
                      onChange={(e) => setCameraBody(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dp">DP</Label>
                    <Input id="dp" value={dp} onChange={(e) => setDp(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ac">1st AC</Label>
                    <Input id="ac" value={ac} onChange={(e) => setAc(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="fps">Frame Rate</Label>
                    <Input
                      id="fps"
                      placeholder="24"
                      value={fps}
                      onChange={(e) => setFps(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="format_res">Format / Resolution</Label>
                  <Input
                    id="format_res"
                    placeholder="4K ProRes 4444"
                    value={formatRes}
                    onChange={(e) => setFormatRes(e.target.value)}
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
                <CardTitle>Takes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {takes.map((take, index) => (
                  <div key={index} className="flex flex-wrap gap-2 items-end border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div className="w-20">
                      <Label className="text-xs">Scene</Label>
                      <Input
                        value={take.scene}
                        onChange={(e) => updateTake(index, { scene: e.target.value })}
                      />
                    </div>
                    <div className="w-16">
                      <Label className="text-xs">Take</Label>
                      <Input
                        value={take.take}
                        onChange={(e) => updateTake(index, { take: e.target.value })}
                      />
                    </div>
                    <div className="w-24">
                      <Label className="text-xs">Lens</Label>
                      <Input
                        value={take.lens}
                        onChange={(e) => updateTake(index, { lens: e.target.value })}
                      />
                    </div>
                    <div className="w-20">
                      <Label className="text-xs">T-stop</Label>
                      <Input
                        value={take.tstop}
                        placeholder="T-stop"
                        onChange={(e) => updateTake(index, { tstop: e.target.value })}
                      />
                    </div>
                    <div className="w-24">
                      <Label className="text-xs">Filter</Label>
                      <Input
                        value={take.filter}
                        onChange={(e) => updateTake(index, { filter: e.target.value })}
                      />
                    </div>
                    <div className="w-16">
                      <Label className="text-xs">FPS</Label>
                      <Input
                        value={take.fps}
                        onChange={(e) => updateTake(index, { fps: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2 pb-2">
                      <Checkbox
                        id={`circled-${index}`}
                        checked={take.circled}
                        onCheckedChange={(checked) => updateTake(index, { circled: checked === true })}
                      />
                      <Label htmlFor={`circled-${index}`} className="text-xs font-normal">
                        Print
                      </Label>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <Label className="text-xs">Remarks</Label>
                      <Input
                        value={take.remarks}
                        onChange={(e) => updateTake(index, { remarks: e.target.value })}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTake(index)}
                      disabled={takes.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addTake}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Take
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Camera Report</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div>
                    <span className="font-semibold">Production:</span> {v(productionName, "Production Name")}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span> {v(reportDate, "Date")}
                  </div>
                  <div>
                    <span className="font-semibold">Roll / Card #:</span> {v(rollCard, "Roll / Card #")}
                  </div>
                  <div>
                    <span className="font-semibold">Camera / Body:</span> {v(cameraBody, "Camera / Body")}
                  </div>
                  <div>
                    <span className="font-semibold">DP:</span> {v(dp, "DP")}
                  </div>
                  <div>
                    <span className="font-semibold">1st AC:</span> {v(ac, "1st AC")}
                  </div>
                  <div>
                    <span className="font-semibold">Format / Resolution:</span> {v(formatRes, "Format / Resolution")}
                  </div>
                  <div>
                    <span className="font-semibold">Frame Rate:</span> {v(fps, "Frame Rate")}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold">Scene</th>
                        <th className="text-left py-2 font-semibold">Take</th>
                        <th className="text-left py-2 font-semibold">Lens</th>
                        <th className="text-left py-2 font-semibold">T-Stop</th>
                        <th className="text-left py-2 font-semibold">Filter</th>
                        <th className="text-left py-2 font-semibold">FPS</th>
                        <th className="text-center py-2 font-semibold">Print</th>
                        <th className="text-left py-2 font-semibold">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {takes.map((take, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="py-2">{take.scene.trim() || "—"}</td>
                          <td className="py-2">{take.take.trim() || "—"}</td>
                          <td className="py-2">{take.lens.trim() || "—"}</td>
                          <td className="py-2">{take.tstop.trim() || "—"}</td>
                          <td className="py-2">{take.filter.trim() || "—"}</td>
                          <td className="py-2">{take.fps.trim() || "—"}</td>
                          <td className="py-2 text-center">{take.circled ? "●" : ""}</td>
                          <td className="py-2">{take.remarks.trim() || "—"}</td>
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

export default CameraReport;
