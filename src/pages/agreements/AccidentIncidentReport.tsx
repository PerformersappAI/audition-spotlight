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

interface Witness {
  name: string;
  contact: string;
}

const INCIDENT_TYPES = ["Injury", "Near Miss", "Property Damage", "Illness", "Other"] as const;
const MEDICAL_OPTIONS = [
  "None",
  "On-site first aid",
  "Referred to clinic/hospital",
  "Hospitalized",
] as const;

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const AccidentIncidentReport = () => {
  const [productionName, setProductionName] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [location, setLocation] = useState("");
  const [incidentType, setIncidentType] = useState<(typeof INCIDENT_TYPES)[number]>("Injury");

  const [personInvolved, setPersonInvolved] = useState("");
  const [personRole, setPersonRole] = useState("");
  const [reportedBy, setReportedBy] = useState("");

  const [whatHappened, setWhatHappened] = useState("");
  const [injuryDamage, setInjuryDamage] = useState("");
  const [firstAid, setFirstAid] = useState("");
  const [medicalSought, setMedicalSought] = useState<(typeof MEDICAL_OPTIONS)[number]>("None");

  const [witnesses, setWitnesses] = useState<Witness[]>([{ name: "", contact: "" }]);

  const [reportedTo, setReportedTo] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");

  const [reporterName, setReporterName] = useState("");
  const [supervisorName, setSupervisorName] = useState("");

  const updateWitness = (index: number, patch: Partial<Witness>) =>
    setWitnesses((prev) => prev.map((w, i) => (i === index ? { ...w, ...patch } : w)));

  const addWitness = () => setWitnesses((prev) => [...prev, { name: "", contact: "" }]);

  const removeWitness = (index: number) => {
    if (witnesses.length <= 1) return;
    setWitnesses((prev) => prev.filter((_, i) => i !== index));
  };

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Date", incidentDate, "Date"],
    ["Time", incidentTime, "Time"],
    ["Location", location, "Location"],
    ["Incident Type", incidentType, "Incident Type"],
  ] as const;

  const peopleRows = [
    ["Person(s) Involved", personInvolved, "Person(s) Involved"],
    ["Role / Department", personRole, "Role / Department"],
    ["Reported By", reportedBy, "Reported By"],
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

    const writeLine = (label: string, value: string, placeholder?: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = `${label}: `;
      const labelWidth = doc.getTextWidth(labelText);
      doc.setFont("helvetica", "normal");
      const display = value.trim() || (placeholder ? `[${placeholder}]` : "—");
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

    const writeBlock = (heading: string, body: string) => {
      ensure(10);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(heading, margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(body.trim() || "—", contentWidth) as string[];
      ensure(lines.length * 5 + 2);
      lines.forEach((line, i) => doc.text(line, margin, y + i * 5));
      y += lines.length * 5 + 4;
    };

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("ACCIDENT / INCIDENT REPORT", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, value, placeholder));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PEOPLE", margin, y);
    y += 6;
    peopleRows.forEach(([label, value, placeholder]) => writeLine(label, value, placeholder));

    y += 2;
    writeBlock("What Happened", whatHappened);
    writeBlock("Injury / Damage Description", injuryDamage);
    writeBlock("First Aid / Medical Response", firstAid);

    ensure(8);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Medical Attention: ", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(medicalSought, margin + doc.getTextWidth("Medical Attention: "), y);
    y += 8;

    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("WITNESSES", margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const activeWitnesses = witnesses.filter((w) => w.name.trim() || w.contact.trim());
    if (activeWitnesses.length === 0) {
      doc.text("—", margin, y);
      y += 6;
    } else {
      activeWitnesses.forEach((w) => {
        ensure(6);
        const line = `${w.name.trim() || "[Name]"} — ${w.contact.trim() || "[Contact]"}`;
        doc.text(line, margin, y);
        y += 5;
      });
    }
    y += 4;

    writeBlock("Reported To (UPM / Safety Officer)", reportedTo);
    writeBlock("Corrective Action", correctiveAction);

    ensure(40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Reporter", margin, y);
    doc.text("Supervisor", margin + contentWidth / 2, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Signature: _________________________________", margin, y);
    doc.text("Signature: _________________________________", margin + contentWidth / 2, y);
    y += 7;
    doc.text(`Print name: ${reporterName.trim() || "—"}`, margin, y);
    doc.text(`Print name: ${supervisorName.trim() || "—"}`, margin + contentWidth / 2, y);
    y += 7;
    doc.text("Date: _______________", margin, y);
    doc.text("Date: _______________", margin + contentWidth / 2, y);
    y += 10;

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (incidentDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_Accident_Incident_Report.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setIncidentDate("");
    setIncidentTime("");
    setLocation("");
    setIncidentType("Injury");
    setPersonInvolved("");
    setPersonRole("");
    setReportedBy("");
    setWhatHappened("");
    setInjuryDamage("");
    setFirstAid("");
    setMedicalSought("None");
    setWitnesses([{ name: "", contact: "" }]);
    setReportedTo("");
    setCorrectiveAction("");
    setReporterName("");
    setSupervisorName("");
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Accident / Incident Report</h1>
          <p className="text-muted-foreground">
            Document any on-set injury, near miss, or property damage — the safety record.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>1st ADs, UPMs, and safety officers.</li>
                <li>Anyone who witnesses an on-set incident.</li>
                <li>Productions maintaining a safety record.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Records what happened, when, and to whom.</li>
                <li>Logs first aid, witnesses, and who was notified.</li>
                <li>Captures corrective action and sign-off.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Incident</CardTitle>
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
                    <Label htmlFor="incident_date">Date</Label>
                    <Input
                      id="incident_date"
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="incident_time">Time</Label>
                    <Input
                      id="incident_time"
                      type="time"
                      value={incidentTime}
                      onChange={(e) => setIncidentTime(e.target.value)}
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
                  <Label htmlFor="incident_type">Incident Type</Label>
                  <Select
                    value={incidentType}
                    onValueChange={(value) => setIncidentType(value as (typeof INCIDENT_TYPES)[number])}
                  >
                    <SelectTrigger id="incident_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INCIDENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>People</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="person_involved">Person(s) Involved</Label>
                  <Input
                    id="person_involved"
                    value={personInvolved}
                    onChange={(e) => setPersonInvolved(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="person_role">Role / Department</Label>
                  <Input
                    id="person_role"
                    value={personRole}
                    onChange={(e) => setPersonRole(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reported_by">Reported By</Label>
                  <Input
                    id="reported_by"
                    value={reportedBy}
                    onChange={(e) => setReportedBy(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="what_happened">What Happened</Label>
                  <Textarea
                    id="what_happened"
                    value={whatHappened}
                    onChange={(e) => setWhatHappened(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="injury_damage">Injury / Damage Description</Label>
                  <Textarea
                    id="injury_damage"
                    value={injuryDamage}
                    onChange={(e) => setInjuryDamage(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="first_aid">First Aid / Medical Response</Label>
                  <Textarea
                    id="first_aid"
                    value={firstAid}
                    onChange={(e) => setFirstAid(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="medical_sought">Medical Attention</Label>
                  <Select
                    value={medicalSought}
                    onValueChange={(value) => setMedicalSought(value as (typeof MEDICAL_OPTIONS)[number])}
                  >
                    <SelectTrigger id="medical_sought">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDICAL_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Witnesses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {witnesses.map((witness, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap gap-2 items-end">
                      <div className="flex-1 min-w-[140px]">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={witness.name}
                          onChange={(e) => updateWitness(index, { name: e.target.value })}
                        />
                      </div>
                      <div className="w-56">
                        <Label className="text-xs">Contact</Label>
                        <Input
                          value={witness.contact}
                          onChange={(e) => updateWitness(index, { contact: e.target.value })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWitness(index)}
                        disabled={witnesses.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Fragment>
                ))}
                <Button variant="outline" onClick={addWitness}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Witness
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow-Up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reported_to">Reported To (UPM / Safety Officer)</Label>
                  <Input
                    id="reported_to"
                    value={reportedTo}
                    onChange={(e) => setReportedTo(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="corrective_action">Corrective Action</Label>
                  <Textarea
                    id="corrective_action"
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sign-Off</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reporter_name">Reporter (print)</Label>
                  <Input
                    id="reporter_name"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supervisor_name">Supervisor (print)</Label>
                  <Input
                    id="supervisor_name"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                  />
                </div>
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Accident / Incident Report</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {headerRows.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-sm">
                  <h3 className="font-semibold uppercase tracking-wide text-sm">People</h3>
                  {peopleRows.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                    </div>
                  ))}
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold uppercase tracking-wide text-sm mb-1">What Happened</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {whatHappened.trim() || "[What Happened]"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold uppercase tracking-wide text-sm mb-1">Injury / Damage Description</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {injuryDamage.trim() || "[Injury / Damage Description]"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold uppercase tracking-wide text-sm mb-1">First Aid / Medical Response</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {firstAid.trim() || "[First Aid / Medical Response]"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Medical Attention:</span> {medicalSought}
                  </div>
                </div>

                <div className="text-sm">
                  <h3 className="font-semibold uppercase tracking-wide text-sm mb-2">Witnesses</h3>
                  {witnesses.filter((w) => w.name.trim() || w.contact.trim()).length === 0 ? (
                    <p className="text-muted-foreground">[Witnesses]</p>
                  ) : (
                    <ul className="space-y-1 text-muted-foreground">
                      {witnesses.map((witness, index) =>
                        witness.name.trim() || witness.contact.trim() ? (
                          <li key={index}>
                            {v(witness.name, "Name")} — {v(witness.contact, "Contact")}
                          </li>
                        ) : null
                      )}
                    </ul>
                  )}
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold uppercase tracking-wide text-sm mb-1">Reported To (UPM / Safety Officer)</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {reportedTo.trim() || "[Reported To (UPM / Safety Officer)]"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold uppercase tracking-wide text-sm mb-1">Corrective Action</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {correctiveAction.trim() || "[Corrective Action]"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border text-sm">
                  <div className="space-y-2">
                    <p className="font-semibold">Reporter</p>
                    <p className="text-muted-foreground">Signature: _______________________</p>
                    <p className="text-muted-foreground">Print: {v(reporterName, "Reporter (print)")}</p>
                    <p className="text-muted-foreground">Date: _______________</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Supervisor</p>
                    <p className="text-muted-foreground">Signature: _______________________</p>
                    <p className="text-muted-foreground">Print: {v(supervisorName, "Supervisor (print)")}</p>
                    <p className="text-muted-foreground">Date: _______________</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccidentIncidentReport;
