import { Fragment, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface Attendee {
  name: string;
  role: string;
}

const ACKNOWLEDGEMENT =
  "By signing below, each attendee acknowledges that they attended this safety meeting, understood the topics covered, and agree to follow all safety instructions on set.";

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const SafetyMeetingAcknowledgement = () => {
  const [productionName, setProductionName] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [location, setLocation] = useState("");
  const [conductedBy, setConductedBy] = useState("");

  const [topicsCovered, setTopicsCovered] = useState("");

  const [attendees, setAttendees] = useState<Attendee[]>([
    { name: "", role: "" },
    { name: "", role: "" },
    { name: "", role: "" },
  ]);

  const updateAttendee = (index: number, patch: Partial<Attendee>) =>
    setAttendees((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));

  const addAttendee = () => setAttendees((prev) => [...prev, { name: "", role: "" }]);

  const removeAttendee = (index: number) => {
    if (attendees.length <= 1) return;
    setAttendees((prev) => prev.filter((_, i) => i !== index));
  };

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Date", meetingDate, "Date"],
    ["Time", meetingTime, "Time"],
    ["Location", location, "Location"],
    ["Conducted By", conductedBy, "Conducted By"],
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

    const writeLine = (label: string, value: string, placeholder: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = `${label}: `;
      const labelWidth = doc.getTextWidth(labelText);
      doc.setFont("helvetica", "normal");
      const display = value.trim() || `[${placeholder}]`;
      const lines = doc.splitTextToSize(display, contentWidth - labelWidth) as string[];
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
    doc.text("SAFETY MEETING ACKNOWLEDGEMENT", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, value, placeholder));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("TOPICS COVERED / HAZARDS REVIEWED", margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const topicLines = doc.splitTextToSize(topicsCovered.trim() || "—", contentWidth) as string[];
    ensure(topicLines.length * 5 + 2);
    topicLines.forEach((line, i) => doc.text(line, margin, y + i * 5));
    y += topicLines.length * 5 + 6;

    ensure(20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const ackLines = doc.splitTextToSize(ACKNOWLEDGEMENT, contentWidth) as string[];
    ensure(ackLines.length * 5 + 4);
    ackLines.forEach((line, i) => doc.text(line, margin, y + i * 5));
    y += ackLines.length * 5 + 8;

    const colX = {
      num: margin,
      name: margin + 14,
      role: margin + 78,
      signature: margin + 128,
    };

    const rowHeight = 10;

    const drawTableHeader = () => {
      ensure(rowHeight + 4);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("#", colX.num + 2, y + 6);
      doc.text("Name", colX.name + 2, y + 6);
      doc.text("Role", colX.role + 2, y + 6);
      doc.text("Signature", colX.signature + 2, y + 6);
      y += rowHeight;
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
    };

    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("ATTENDEE ROSTER", margin, y);
    y += 6;
    drawTableHeader();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    attendees.forEach((attendee, index) => {
      ensure(rowHeight + 4);
      const rowY = y + 6;
      doc.text(String(index + 1), colX.num + 2, rowY);

      const name = attendee.name.trim();
      const role = attendee.role.trim();

      if (name) {
        doc.text(name, colX.name + 2, rowY);
      } else {
        doc.setDrawColor(200, 200, 200);
        doc.line(colX.name + 2, rowY, colX.role - 4, rowY);
        doc.setDrawColor(180, 180, 180);
      }

      if (role) {
        doc.text(role, colX.role + 2, rowY);
      } else {
        doc.setDrawColor(200, 200, 200);
        doc.line(colX.role + 2, rowY, colX.signature - 4, rowY);
        doc.setDrawColor(180, 180, 180);
      }

      doc.setDrawColor(200, 200, 200);
      doc.line(colX.signature + 2, rowY, pageWidth - margin - 2, rowY);
      doc.setDrawColor(180, 180, 180);

      y += rowHeight;
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
    });

    y += 6;
    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (meetingDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_Safety_Meeting_Acknowledgement.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setMeetingDate("");
    setMeetingTime("");
    setLocation("");
    setConductedBy("");
    setTopicsCovered("");
    setAttendees([
      { name: "", role: "" },
      { name: "", role: "" },
      { name: "", role: "" },
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Safety Meeting Acknowledgement</h1>
          <p className="text-muted-foreground">
            The sign-in sheet confirming the crew attended the safety briefing.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>1st ADs and safety officers running the briefing.</li>
                <li>Productions documenting safety compliance.</li>
                <li>Anyone collecting crew acknowledgement.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Records the topics and hazards reviewed.</li>
                <li>Collects each attendee's name and role.</li>
                <li>Provides a signature line for acknowledgement.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting</CardTitle>
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
                    <Label htmlFor="meeting_date">Date</Label>
                    <Input
                      id="meeting_date"
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meeting_time">Time</Label>
                    <Input
                      id="meeting_time"
                      type="time"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="conducted_by">Conducted By</Label>
                  <Input
                    id="conducted_by"
                    value={conductedBy}
                    onChange={(e) => setConductedBy(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topics_covered">Topics Covered / Hazards Reviewed</Label>
                  <Textarea
                    id="topics_covered"
                    placeholder="Stunts, firearms, vehicles, weather, trip hazards, emergency exits…"
                    value={topicsCovered}
                    onChange={(e) => setTopicsCovered(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {attendees.map((attendee, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap gap-2 items-end">
                      <div className="flex-1 min-w-[140px]">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={attendee.name}
                          onChange={(e) => updateAttendee(index, { name: e.target.value })}
                        />
                      </div>
                      <div className="w-56">
                        <Label className="text-xs">Role / Department</Label>
                        <Input
                          value={attendee.role}
                          onChange={(e) => updateAttendee(index, { role: e.target.value })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttendee(index)}
                        disabled={attendees.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Fragment>
                ))}
                <Button variant="outline" onClick={addAttendee}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Attendee
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Safety Meeting Acknowledgement</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {headerRows.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                    </div>
                  ))}
                </div>

                <div className="text-sm">
                  <h3 className="font-semibold uppercase tracking-wide text-sm mb-1">Topics Covered / Hazards Reviewed</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {topicsCovered.trim() || "[Topics Covered / Hazards Reviewed]"}
                  </p>
                </div>

                <p className="text-sm italic text-muted-foreground">{ACKNOWLEDGEMENT}</p>

                <div className="text-sm">
                  <h3 className="font-semibold uppercase tracking-wide text-sm mb-2">Attendee Roster</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-2 w-10 font-semibold">#</th>
                        <th className="py-2 font-semibold">Name</th>
                        <th className="py-2 w-56 font-semibold">Role</th>
                        <th className="py-2 font-semibold">Signature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((attendee, index) => (
                        <tr key={index} className="border-b border-border/60">
                          <td className="py-3 text-muted-foreground">{index + 1}</td>
                          <td className="py-3">
                            {attendee.name.trim() ? (
                              <span className="text-muted-foreground">{attendee.name}</span>
                            ) : (
                              <span className="block border-b border-border w-full" />
                            )}
                          </td>
                          <td className="py-3">
                            {attendee.role.trim() ? (
                              <span className="text-muted-foreground">{attendee.role}</span>
                            ) : (
                              <span className="block border-b border-border w-full" />
                            )}
                          </td>
                          <td className="py-3">
                            <span className="block border-b border-border w-full min-w-[120px]" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyMeetingAcknowledgement;
