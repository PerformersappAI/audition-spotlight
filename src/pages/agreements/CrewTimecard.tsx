import { useMemo, useState } from "react";
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
import { Download, Printer, RotateCcw } from "lucide-react";

interface DayRow {
  day: string;
  date: string;
  timeIn: string;
  mealOut: string;
  mealIn: string;
  timeOut: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const parseHM = (str: string): number | null => {
  if (!str || !str.includes(":")) return null;
  const [h, m] = str.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const computeDayHours = (row: DayRow): number => {
  const inMins = parseHM(row.timeIn);
  const outMins = parseHM(row.timeOut);
  if (inMins === null || outMins === null) return 0;
  if (outMins < inMins) return 0;
  let work = outMins - inMins;
  const mealOutMins = parseHM(row.mealOut);
  const mealInMins = parseHM(row.mealIn);
  if (mealOutMins !== null && mealInMins !== null && mealInMins > mealOutMins) {
    work -= mealInMins - mealOutMins;
  }
  return Math.max(0, work) / 60;
};

const formatHours = (hours: number): string => hours.toFixed(2);

const CrewTimecard = () => {
  const [productionName, setProductionName] = useState("");
  const [crewName, setCrewName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [weekEnding, setWeekEnding] = useState("");
  const [rate, setRate] = useState("");
  const [rateBasis, setRateBasis] = useState("Per Day");
  const [mealPenalties, setMealPenalties] = useState(0);

  const [rows, setRows] = useState<DayRow[]>(
    DAYS.map((day) => ({ day, date: "", timeIn: "", mealOut: "", mealIn: "", timeOut: "" }))
  );

  const [employeeName, setEmployeeName] = useState("");
  const [approver, setApprover] = useState("");

  const dayHours = useMemo(() => rows.map((row) => computeDayHours(row)), [rows]);
  const weekTotalHours = useMemo(() => dayHours.reduce((sum, h) => sum + h, 0), [dayHours]);

  const updateRow = (index: number, patch: Partial<DayRow>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
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
    doc.text("CREW TIMECARD", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    writeLine("Production", productionName);
    writeLine("Crew Member", crewName);
    writeLine("Position", position);
    writeLine("Department", department);
    writeLine("Week Ending", weekEnding);
    writeLine("Rate", rate);
    writeLine("Rate Basis", rateBasis);
    writeLine("Meal Penalties", mealPenalties.toString());

    y += 4;
    ensure(12);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DAILY TIME", margin, y);
    y += 6;

    const colCount = 7;
    const colWidth = contentWidth / colCount;
    const headers = ["Day", "Date", "In", "Meal Out", "Meal In", "Out", "Hours"];

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    headers.forEach((header, i) => {
      doc.text(header, margin + i * colWidth, y);
    });
    y += 5;
    doc.setDrawColor(180, 180, 180);
    doc.line(margin, y - 2, pageWidth - margin, y - 2);

    doc.setFont("helvetica", "normal");
    rows.forEach((row, index) => {
      const hours = dayHours[index];
      const values = [
        row.day,
        row.date.trim() || "—",
        row.timeIn.trim() || "—",
        row.mealOut.trim() || "—",
        row.mealIn.trim() || "—",
        row.timeOut.trim() || "—",
        hours > 0 ? formatHours(hours) : "—",
      ];
      ensure(8);
      values.forEach((value, i) => {
        doc.text(value, margin + i * colWidth, y);
      });
      y += 7;
    });

    ensure(10);
    doc.setFont("helvetica", "bold");
    doc.line(margin, y - 2, pageWidth - margin, y - 2);
    doc.text("TOTAL", margin, y);
    doc.text(formatHours(weekTotalHours), margin + 6 * colWidth, y);
    y += 10;

    ensure(30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Employee", margin, y);
    doc.text("Approved By", margin + contentWidth / 2, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Signature: _________________________________", margin, y);
    doc.text("Signature: _________________________________", margin + contentWidth / 2, y);
    y += 7;
    doc.text(`Print name: ${employeeName.trim() || "—"}`, margin, y);
    doc.text(`Print name: ${approver.trim() || "—"}`, margin + contentWidth / 2, y);
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
    const safeCrew = (crewName || "Crew").replace(/[^a-zA-Z0-9]/g, "_");
    const safeWeek = (weekEnding || "Week").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeCrew}_${safeWeek}_Crew_Timecard.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setCrewName("");
    setPosition("");
    setDepartment("");
    setWeekEnding("");
    setRate("");
    setRateBasis("Per Day");
    setMealPenalties(0);
    setRows(DAYS.map((day) => ({ day, date: "", timeIn: "", mealOut: "", mealIn: "", timeOut: "" })));
    setEmployeeName("");
    setApprover("");
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Crew Timecard / Time Report</h1>
          <p className="text-muted-foreground">
            A weekly timesheet — daily in/out and meals, with hours calculated automatically.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Crew logging their weekly hours.</li>
                <li>UPMs and accountants approving time.</li>
                <li>Payroll prep for cast and crew.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Records daily call, meal, and wrap times.</li>
                <li>Auto-calculates hours worked each day.</li>
                <li>Totals the week for payroll and approval.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
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
                    <Label htmlFor="crew_name">Crew Member</Label>
                    <Input
                      id="crew_name"
                      value={crewName}
                      onChange={(e) => setCrewName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position / Role</Label>
                    <Input
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="week_ending">Week Ending</Label>
                    <Input
                      id="week_ending"
                      type="date"
                      value={weekEnding}
                      onChange={(e) => setWeekEnding(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rate">Rate</Label>
                    <Input
                      id="rate"
                      placeholder="$450 / day"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate_basis">Rate Basis</Label>
                    <Select value={rateBasis} onValueChange={setRateBasis}>
                      <SelectTrigger id="rate_basis">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Per Day", "Per Week", "Hourly"].map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="meal_penalties">Meal Penalties</Label>
                  <Input
                    id="meal_penalties"
                    type="number"
                    min={0}
                    value={mealPenalties}
                    onChange={(e) => setMealPenalties(Math.max(0, parseInt(e.target.value || "0", 10)))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rows.map((row, index) => (
                  <div key={row.day} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 text-sm font-medium text-muted-foreground">{row.day}</div>
                    <div className="col-span-2">
                      <Input
                        type="date"
                        value={row.date}
                        onChange={(e) => updateRow(index, { date: e.target.value })}
                        className="px-1 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="time"
                        value={row.timeIn}
                        onChange={(e) => updateRow(index, { timeIn: e.target.value })}
                        className="px-1 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="time"
                        value={row.mealOut}
                        onChange={(e) => updateRow(index, { mealOut: e.target.value })}
                        className="px-1 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="time"
                        value={row.mealIn}
                        onChange={(e) => updateRow(index, { mealIn: e.target.value })}
                        className="px-1 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="time"
                        value={row.timeOut}
                        onChange={(e) => updateRow(index, { timeOut: e.target.value })}
                        className="px-1 text-sm"
                      />
                    </div>
                    <div className="col-span-1 text-right text-sm tabular-nums font-medium">
                      {dayHours[index] > 0 ? formatHours(dayHours[index]) : "—"}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-2 border-t border-border">
                  <div className="text-sm font-semibold">
                    Week Total: <span className="tabular-nums text-primary">{formatHours(weekTotalHours)} hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="employee_name">Employee (print)</Label>
                  <Input
                    id="employee_name"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="approver">Approved By (UPM / Accountant)</Label>
                  <Input
                    id="approver"
                    value={approver}
                    onChange={(e) => setApprover(e.target.value)}
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Crew Timecard</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div>
                    <span className="font-semibold">Production:</span> {v(productionName, "Production Name")}
                  </div>
                  <div>
                    <span className="font-semibold">Crew Member:</span> {v(crewName, "Crew Member")}
                  </div>
                  <div>
                    <span className="font-semibold">Position:</span> {v(position, "Position / Role")}
                  </div>
                  <div>
                    <span className="font-semibold">Department:</span> {v(department, "Department")}
                  </div>
                  <div>
                    <span className="font-semibold">Week Ending:</span> {v(weekEnding, "Week Ending")}
                  </div>
                  <div>
                    <span className="font-semibold">Rate:</span> {v(rate, "Rate")} ({rateBasis})
                  </div>
                  <div>
                    <span className="font-semibold">Meal Penalties:</span> {mealPenalties}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold">Day</th>
                        <th className="text-left py-2 font-semibold">Date</th>
                        <th className="text-left py-2 font-semibold">In</th>
                        <th className="text-left py-2 font-semibold">Meal Out</th>
                        <th className="text-left py-2 font-semibold">Meal In</th>
                        <th className="text-left py-2 font-semibold">Out</th>
                        <th className="text-right py-2 font-semibold tabular-nums">Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={row.day} className="border-b border-border/50">
                          <td className="py-2">{row.day}</td>
                          <td className="py-2">{row.date.trim() || "—"}</td>
                          <td className="py-2">{row.timeIn.trim() || "—"}</td>
                          <td className="py-2">{row.mealOut.trim() || "—"}</td>
                          <td className="py-2">{row.mealIn.trim() || "—"}</td>
                          <td className="py-2">{row.timeOut.trim() || "—"}</td>
                          <td className="py-2 text-right tabular-nums">
                            {dayHours[index] > 0 ? formatHours(dayHours[index]) : "—"}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold border-t-2 border-border">
                        <td className="py-2" colSpan={6}>
                          TOTAL
                        </td>
                        <td className="py-2 text-right tabular-nums">{formatHours(weekTotalHours)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Employee</p>
                    <p className="text-sm text-muted-foreground">Signature: ____________________</p>
                    <p className="text-sm">{employeeName.trim() || "—"}</p>
                    <p className="text-sm text-muted-foreground">Date: ____________________</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Approved By</p>
                    <p className="text-sm text-muted-foreground">Signature: ____________________</p>
                    <p className="text-sm">{approver.trim() || "—"}</p>
                    <p className="text-sm text-muted-foreground">Date: ____________________</p>
                  </div>
                </div>

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

export default CrewTimecard;
