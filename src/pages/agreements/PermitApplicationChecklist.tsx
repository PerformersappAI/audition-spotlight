import { useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface ChecklistItem {
  label: string;
  checked: boolean;
  note: string;
}

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const PERMIT_TYPES = [
  "City / Municipal",
  "Park / Public Land",
  "State",
  "Federal",
  "Private + Public Mix",
  "Other",
];

const DEFAULT_ITEMS: ChecklistItem[] = [
  { label: "Completed permit application form", checked: false, note: "" },
  { label: "Certificate of Insurance (COI) naming the permitting authority as additional insured", checked: false, note: "" },
  { label: "General liability insurance ($1M / $2M typical)", checked: false, note: "" },
  { label: "Workers' compensation insurance (if crew are employees)", checked: false, note: "" },
  { label: "Permit / application fee paid", checked: false, note: "" },
  { label: "Shooting dates & hours confirmed", checked: false, note: "" },
  { label: "Location(s) and address(es) listed", checked: false, note: "" },
  { label: "Site map / plot plan attached", checked: false, note: "" },
  { label: "Parking & basecamp plan", checked: false, note: "" },
  { label: "Street / lane closure request (if needed)", checked: false, note: "" },
  { label: "Police / traffic control request (if needed)", checked: false, note: "" },
  { label: "Fire safety officer request (if effects / pyro)", checked: false, note: "" },
  { label: "Neighbor / merchant notification letters", checked: false, note: "" },
  { label: "Special effects, stunts, or firearms disclosed", checked: false, note: "" },
  { label: "Drone / UAV permit (if aerial)", checked: false, note: "" },
  { label: "Minors on set — work permits / studio teacher (if applicable)", checked: false, note: "" },
  { label: "Noise variance (if night or loud work)", checked: false, note: "" },
  { label: "Signed location agreements on file", checked: false, note: "" },
];

const PermitApplicationChecklist = () => {
  const [productionName, setProductionName] = useState("");
  const [permitAuthority, setPermitAuthority] = useState("");
  const [permitType, setPermitType] = useState("City / Municipal");
  const [shootDates, setShootDates] = useState("");
  const [applicant, setApplicant] = useState("");
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_ITEMS);

  const completed = items.filter((i) => i.checked).length;
  const total = items.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const updateItem = (index: number, patch: Partial<ChecklistItem>) =>
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  const addItem = () => setItems((prev) => [...prev, { label: "", checked: false, note: "" }]);

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

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
    doc.text("PERMIT APPLICATION CHECKLIST", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    writeLine("Production", v(productionName, "Production Name"));
    writeLine("Permitting Office", v(permitAuthority, "Permitting Office / Jurisdiction"));
    writeLine("Permit Type", permitType);
    writeLine("Shoot Dates", v(shootDates, "Shoot Dates"));
    writeLine("Applicant / Producer", v(applicant, "Applicant / Producer"));

    y += 4;
    ensure(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${completed} of ${total} complete`, margin, y);
    y += 5;

    const barWidth = contentWidth;
    const barHeight = 3;
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, barWidth, barHeight, "F");
    if (progress > 0) {
      doc.setFillColor(59, 130, 246);
      doc.rect(margin, y, (barWidth * progress) / 100, barHeight, "F");
    }
    y += 8;

    items.forEach((it) => {
      const marker = it.checked ? "[X]" : "[ ]";
      const note = it.note.trim() ? ` — ${it.note.trim()}` : "";
      const text = `${marker} ${it.label.trim() || "—"}${note}`;
      const lines = doc.splitTextToSize(text, contentWidth) as string[];
      ensure(lines.length * 5 + 2);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      lines.forEach((line, i) => doc.text(line, margin, y + i * 5));
      y += lines.length * 5 + 2;
    });

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_Permit_Application_Checklist.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setPermitAuthority("");
    setPermitType("City / Municipal");
    setShootDates("");
    setApplicant("");
    setItems(DEFAULT_ITEMS.map((i) => ({ ...i })));
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Permit Application Checklist</h1>
          <p className="text-muted-foreground">
            Everything you need to file a city, park, or federal film permit — tracked in one list.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Production managers and coordinators filing permits.</li>
                <li>Location managers assembling permit packages.</li>
                <li>Anyone tracking permit requirements.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists every item a permit office typically requires.</li>
                <li>Tracks what's done and what's outstanding.</li>
                <li>Adds notes and a completion count.</li>
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
                <div>
                  <Label htmlFor="permit_authority">Permitting Office / Jurisdiction</Label>
                  <Input
                    id="permit_authority"
                    placeholder="e.g., City of Banja Luka Film Office"
                    value={permitAuthority}
                    onChange={(e) => setPermitAuthority(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="permit_type">Permit Type</Label>
                  <Select value={permitType} onValueChange={setPermitType}>
                    <SelectTrigger id="permit_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PERMIT_TYPES.map((opt) => (
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
                  <Label htmlFor="applicant">Applicant / Producer</Label>
                  <Input
                    id="applicant"
                    value={applicant}
                    onChange={(e) => setApplicant(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Checklist</CardTitle>
                <Button type="button" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((it, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Checkbox
                      id={`item-check-${index}`}
                      checked={it.checked}
                      onCheckedChange={(checked) => updateItem(index, { checked: checked === true })}
                      aria-label="Toggle item"
                    />
                    <Input
                      className="flex-1"
                      placeholder="Requirement"
                      value={it.label}
                      onChange={(e) => updateItem(index, { label: e.target.value })}
                    />
                    <Input
                      className="w-56"
                      placeholder="Note / status"
                      value={it.note}
                      onChange={(e) => updateItem(index, { note: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      disabled={items.length <= 1}
                      onClick={() => removeItem(index)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
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
                      Permit Application Checklist
                    </h2>

                    <div className="text-sm space-y-1 mb-6">
                      <p>
                        <span className="font-semibold">Production:</span>{" "}
                        {productionName.trim() || (
                          <span className="italic text-gray-500">[Production Name]</span>
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">Permitting Office:</span>{" "}
                        {permitAuthority.trim() || (
                          <span className="italic text-gray-500">[Permitting Office / Jurisdiction]</span>
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">Permit Type:</span> {permitType}
                      </p>
                      <p>
                        <span className="font-semibold">Shoot Dates:</span>{" "}
                        {shootDates.trim() || <span className="italic text-gray-500">[Shoot Dates]</span>}
                      </p>
                      <p>
                        <span className="font-semibold">Applicant / Producer:</span>{" "}
                        {applicant.trim() || <span className="italic text-gray-500">[Applicant / Producer]</span>}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-1">
                        {completed} of {total} complete
                      </p>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {items.map((it, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <span className="font-mono text-base leading-none mt-0.5">
                            {it.checked ? "☑" : "☐"}
                          </span>
                          <div className="flex-1">
                            <span className={it.checked ? "line-through text-gray-500" : ""}>
                              {it.label.trim() || <span className="italic text-gray-500">—</span>}
                            </span>
                            {it.note.trim() && (
                              <span className="text-gray-500"> — {it.note.trim()}</span>
                            )}
                          </div>
                        </div>
                      ))}
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

export default PermitApplicationChecklist;
