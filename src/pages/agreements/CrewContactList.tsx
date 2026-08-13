import { Fragment, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface Member {
  role: string;
  name: string;
  phone: string;
  email: string;
}

interface Department {
  name: string;
  members: Member[];
}

const PROJECT_TYPES = [
  "Feature",
  "Short",
  "Series",
  "Commercial",
  "Music Video",
  "Documentary",
  "Movie",
];

const blank = (role = ""): Member => ({ role, name: "", phone: "", email: "" });

const INITIAL_DEPARTMENTS: Department[] = [
  {
    name: "Production",
    members: [blank("Producer"), blank("Director"), blank("1st AD"), blank("Production Coordinator")],
  },
  { name: "Camera", members: [blank("DP"), blank("Camera Operator"), blank("1st AC")] },
  { name: "Grip & Electric", members: [blank("Gaffer"), blank("Key Grip")] },
];

const clone = (departments: Department[]): Department[] =>
  departments.map((d) => ({ name: d.name, members: d.members.map((m) => ({ ...m })) }));

const cell = (value: string) => (value.trim() ? value.trim() : "—");
const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const CrewContactList = () => {
  const [productionName, setProductionName] = useState("");
  const [projectType, setProjectType] = useState("Short");
  const [prepDate, setPrepDate] = useState("");
  const [departments, setDepartments] = useState<Department[]>(() => clone(INITIAL_DEPARTMENTS));

  const updateDepartment = (di: number, patch: Partial<Department>) =>
    setDepartments((prev) => prev.map((d, i) => (i === di ? { ...d, ...patch } : d)));

  const updateMember = (di: number, mi: number, patch: Partial<Member>) =>
    setDepartments((prev) =>
      prev.map((d, i) =>
        i === di
          ? { ...d, members: d.members.map((m, j) => (j === mi ? { ...m, ...patch } : m)) }
          : d
      )
    );

  const addMember = (di: number) =>
    setDepartments((prev) =>
      prev.map((d, i) => (i === di ? { ...d, members: [...d.members, blank()] } : d))
    );

  const removeMember = (di: number, mi: number) =>
    setDepartments((prev) =>
      prev.map((d, i) => (i === di ? { ...d, members: d.members.filter((_, j) => j !== mi) } : d))
    );

  const addDepartment = () =>
    setDepartments((prev) => [...prev, { name: "New Department", members: [blank()] }]);

  const removeDepartment = (di: number) =>
    setDepartments((prev) => prev.filter((_, i) => i !== di));

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    const cols = [
      margin,
      margin + contentWidth * 0.22,
      margin + contentWidth * 0.48,
      margin + contentWidth * 0.68,
    ];
    let y = margin;

    const footer = () => {
      doc.setFontSize(8);
      doc.setFont("times", "italic");
      doc.setTextColor(120, 120, 120);
      doc.text("Filmmaker Genius — Document Library.", margin, pageHeight - 10);
      doc.setTextColor(0, 0, 0);
    };

    const colHeaders = () => {
      doc.setFontSize(8);
      doc.setFont("times", "bold");
      doc.text("ROLE", cols[0] + 2, y);
      doc.text("NAME", cols[1], y);
      doc.text("PHONE", cols[2], y);
      doc.text("EMAIL", cols[3], y);
      y += 4.5;
    };

    const ensure = (h: number, withHeaders = false) => {
      if (y + h > pageHeight - 18) {
        footer();
        doc.addPage();
        y = margin;
        if (withHeaders) colHeaders();
      }
    };

    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("CREW LIST / CONTACT SHEET", pageWidth / 2, y, { align: "center" });
    y += 7;

    doc.setFontSize(9);
    doc.setFont("times", "italic");
    doc.text(
      `Production: ${v(productionName, "Production Name")}   ·   Type: ${projectType}   ·   Date: ${v(prepDate, "Date")}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );
    y += 9;

    departments.forEach((dept) => {
      ensure(16);
      doc.setFillColor(235, 235, 235);
      doc.rect(margin, y - 4, contentWidth, 6.5, "F");
      doc.setFontSize(10.5);
      doc.setFont("times", "bold");
      doc.text(dept.name.trim() || "—", margin + 2, y);
      y += 8;

      colHeaders();

      dept.members.forEach((m) => {
        ensure(6, true);
        doc.setFontSize(9);
        doc.setFont("times", "normal");
        doc.text(cell(m.role), cols[0] + 2, y);
        doc.text(cell(m.name), cols[1], y);
        doc.text(cell(m.phone), cols[2], y);
        doc.text(cell(m.email), cols[3], y);
        y += 5;
        doc.setDrawColor(215, 215, 215);
        doc.line(margin, y - 3.4, margin + contentWidth, y - 3.4);
      });

      y += 5;
    });

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safe = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safe}_Crew_Contact_Sheet.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setProjectType("Short");
    setPrepDate("");
    setDepartments(clone(INITIAL_DEPARTMENTS));
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Crew List / Contact Sheet</h1>
          <p className="text-muted-foreground">
            One master roster of everyone on the production — grouped by department, ready to print or
            share.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Production coordinators building the contact backbone.</li>
                <li>1st ADs pulling names onto the call sheet.</li>
                <li>Anyone who needs to reach the right person fast.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists every crew member by department.</li>
                <li>Captures role, name, phone, and email.</li>
                <li>Prints a clean contact sheet for the whole team.</li>
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
                <div className="grid gap-4 sm:grid-cols-2">
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
                    <Label htmlFor="prep_date">Date</Label>
                    <Input
                      id="prep_date"
                      type="date"
                      value={prepDate}
                      onChange={(e) => setPrepDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {departments.map((dept, di) => (
              <Card key={`d-${di}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <Input
                    className="max-w-[70%] font-semibold"
                    value={dept.name}
                    onChange={(e) => updateDepartment(di, { name: e.target.value })}
                    aria-label={`Department ${di + 1} name`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={departments.length <= 1}
                    onClick={() => removeDepartment(di)}
                    aria-label="Remove department"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground overflow-x-auto">
                    <span className="w-40 shrink-0">Role</span>
                    <span className="flex-1 min-w-[8rem]">Name</span>
                    <span className="w-36 shrink-0">Phone</span>
                    <span className="w-52 shrink-0">Email</span>
                    <span className="w-10 shrink-0" />
                  </div>

                  {dept.members.map((m, mi) => (
                    <div key={`d-${di}-m-${mi}`} className="flex items-center gap-2 overflow-x-auto">
                      <Input
                        className="w-40 shrink-0"
                        placeholder="Role"
                        value={m.role}
                        onChange={(e) => updateMember(di, mi, { role: e.target.value })}
                        aria-label={`Member ${mi + 1} role`}
                      />
                      <Input
                        className="flex-1 min-w-[8rem]"
                        placeholder="Name"
                        value={m.name}
                        onChange={(e) => updateMember(di, mi, { name: e.target.value })}
                        aria-label={`Member ${mi + 1} name`}
                      />
                      <Input
                        type="tel"
                        className="w-36 shrink-0"
                        placeholder="Phone"
                        value={m.phone}
                        onChange={(e) => updateMember(di, mi, { phone: e.target.value })}
                        aria-label={`Member ${mi + 1} phone`}
                      />
                      <Input
                        type="email"
                        className="w-52 shrink-0"
                        placeholder="Email"
                        value={m.email}
                        onChange={(e) => updateMember(di, mi, { email: e.target.value })}
                        aria-label={`Member ${mi + 1} email`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        disabled={dept.members.length <= 1}
                        onClick={() => removeMember(di, mi)}
                        aria-label="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="outline" onClick={() => addMember(di)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </CardContent>
              </Card>
            ))}

            <Button type="button" variant="secondary" onClick={addDepartment}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
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
                <article className="font-serif text-sm leading-relaxed space-y-3">
                  <h2 className="text-center font-bold tracking-wide text-base">
                    CREW LIST / CONTACT SHEET
                  </h2>
                  <p className="text-center italic text-xs text-muted-foreground">
                    Production: {v(productionName, "Production Name")} · Type: {projectType} · Date:{" "}
                    {v(prepDate, "Date")}
                  </p>

                  <table className="w-full text-xs border-collapse mt-2">
                    <tbody>
                      {departments.map((dept, di) => (
                        <Fragment key={`p-d-${di}`}>
                          <tr className="bg-muted/60">
                            <td className="px-2 py-1 font-bold" colSpan={4}>
                              {dept.name.trim() || "—"}
                            </td>
                          </tr>
                          <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            <td className="px-2 py-1">Role</td>
                            <td className="px-2 py-1">Name</td>
                            <td className="px-2 py-1">Phone</td>
                            <td className="px-2 py-1">Email</td>
                          </tr>
                          {dept.members.map((m, mi) => (
                            <tr key={`p-d-${di}-m-${mi}`} className="border-b border-border/50">
                              <td className="px-2 py-1">{cell(m.role)}</td>
                              <td className="px-2 py-1">{cell(m.name)}</td>
                              <td className="px-2 py-1">{cell(m.phone)}</td>
                              <td className="px-2 py-1 break-all">{cell(m.email)}</td>
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </article>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground text-center">
              Filmmaker Genius — Document Library.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrewContactList;
