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
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface AdjustmentRow {
  label: string;
  amount: number;
}

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const parseHM = (str: string): number | null => {
  if (!str || !str.includes(":")) return null;
  const [h, m] = str.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const formatHours = (hours: number): string => hours.toFixed(2);

const BackgroundVoucher = () => {
  const [productionName, setProductionName] = useState("");
  const [voucherDate, setVoucherDate] = useState("");
  const [voucherNo, setVoucherNo] = useState("");
  const [performerName, setPerformerName] = useState("");
  const [agency, setAgency] = useState("");
  const [role, setRole] = useState("");

  const [rate, setRate] = useState<string>("");
  const [rateBasis, setRateBasis] = useState<"Hourly" | "Daily" | "Flat">("Daily");
  const [timeIn, setTimeIn] = useState("");
  const [mealOut, setMealOut] = useState("");
  const [mealIn, setMealIn] = useState("");
  const [timeOut, setTimeOut] = useState("");

  const [adjustments, setAdjustments] = useState<AdjustmentRow[]>([{ label: "", amount: 0 }]);

  const [approver, setApprover] = useState("");

  const numericRate = parseFloat(rate) || 0;

  const hours = useMemo(() => {
    const inMins = parseHM(timeIn);
    const outMins = parseHM(timeOut);
    if (inMins === null || outMins === null) return 0;
    let work = outMins - inMins;
    const mealOutMins = parseHM(mealOut);
    const mealInMins = parseHM(mealIn);
    if (mealOutMins !== null && mealInMins !== null && mealInMins > mealOutMins) {
      work -= mealInMins - mealOutMins;
    }
    return Math.max(0, work) / 60;
  }, [timeIn, mealOut, mealIn, timeOut]);

  const basePay = useMemo(() => {
    if (rateBasis === "Hourly") return hours * numericRate;
    return numericRate;
  }, [rateBasis, hours, numericRate]);

  const adjustmentsTotal = useMemo(
    () => adjustments.reduce((sum, adj) => sum + (Number.isFinite(adj.amount) ? adj.amount : 0), 0),
    [adjustments]
  );

  const gross = useMemo(() => basePay + adjustmentsTotal, [basePay, adjustmentsTotal]);

  const updateAdjustment = (index: number, patch: Partial<AdjustmentRow>) => {
    setAdjustments((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  };

  const addAdjustment = () => setAdjustments((prev) => [...prev, { label: "", amount: 0 }]);

  const removeAdjustment = (index: number) => {
    if (adjustments.length <= 1) return;
    setAdjustments((prev) => prev.filter((_, i) => i !== index));
  };

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Date", voucherDate, "Date"],
    ["Voucher #", voucherNo, "Voucher #"],
    ["Background Performer", performerName, "Background Performer"],
    ["Agency", agency, "Agency"],
    ["Role / Description", role, "Role / Description"],
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
    doc.text("BACKGROUND VOUCHER", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, v(value, placeholder)));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("TIME", margin, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const timeLine = `In: ${timeIn.trim() || "—"}   Meal Out: ${mealOut.trim() || "—"}   Meal In: ${mealIn.trim() || "—"}   Out: ${timeOut.trim() || "—"}   Hours: ${hours > 0 ? formatHours(hours) : "—"}`;
    const timeLines = doc.splitTextToSize(timeLine, contentWidth) as string[];
    ensure(timeLines.length * 5 + 2);
    timeLines.forEach((line, i) => doc.text(line, margin, y + i * 5));
    y += timeLines.length * 5 + 4;

    doc.setFont("helvetica", "bold");
    doc.text(`Rate: ${numericRate > 0 ? formatMoney(numericRate) : "—"} (${rateBasis})`, margin, y);
    y += 6;

    if (adjustments.some((a) => a.label.trim() || a.amount !== 0)) {
      y += 2;
      ensure(10);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("ADJUSTMENTS", margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      adjustments.forEach((adj) => {
        if (!adj.label.trim() && adj.amount === 0) return;
        const line = `${adj.label.trim() || "—"}  ${formatMoney(adj.amount)}`;
        ensure(6);
        doc.text(line, margin, y);
        y += 5;
      });
    }

    y += 4;
    ensure(40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PAY SUMMARY", margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Base Pay: ${formatMoney(basePay)}`, margin, y);
    y += 6;
    doc.text(`Adjustments: ${formatMoney(adjustmentsTotal)}`, margin, y);
    y += 6;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y - 2, margin + 70, y - 2);
    doc.setFont("helvetica", "bold");
    doc.text(`GROSS: ${formatMoney(gross)}`, margin, y);
    y += 12;

    ensure(40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Performer", margin, y);
    doc.text("Approved By", margin + contentWidth / 2, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Signature: _________________________________", margin, y);
    doc.text("Signature: _________________________________", margin + contentWidth / 2, y);
    y += 7;
    doc.text(`Print name: ${performerName.trim() || "—"}`, margin, y);
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
    const safePerformer = (performerName || "Performer").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (voucherDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safePerformer}_${safeDate}_Background_Voucher.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setVoucherDate("");
    setVoucherNo("");
    setPerformerName("");
    setAgency("");
    setRole("");
    setRate("");
    setRateBasis("Daily");
    setTimeIn("");
    setMealOut("");
    setMealIn("");
    setTimeOut("");
    setAdjustments([{ label: "", amount: 0 }]);
    setApprover("");
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Background Voucher</h1>
          <p className="text-muted-foreground">
            The extras payroll voucher — times, rate, bumps, and computed pay.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Background performers and their agencies.</li>
                <li>2nd ADs and background coordinators.</li>
                <li>Payroll processing extras.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Records a background performer's day.</li>
                <li>Calculates hours, bumps, and gross pay.</li>
                <li>Captures sign-off for payroll.</li>
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
                    <Label htmlFor="voucher_date">Date</Label>
                    <Input
                      id="voucher_date"
                      type="date"
                      value={voucherDate}
                      onChange={(e) => setVoucherDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="voucher_no">Voucher #</Label>
                    <Input
                      id="voucher_no"
                      value={voucherNo}
                      onChange={(e) => setVoucherNo(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="performer_name">Background Performer</Label>
                  <Input
                    id="performer_name"
                    value={performerName}
                    onChange={(e) => setPerformerName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agency">Agency (optional)</Label>
                    <Input id="agency" value={agency} onChange={(e) => setAgency(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="role">Role / Description</Label>
                    <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rate">Rate</Label>
                    <Input
                      id="rate"
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate_basis">Rate Basis</Label>
                    <Select value={rateBasis} onValueChange={(value) => setRateBasis(value as "Hourly" | "Daily" | "Flat")}>
                      <SelectTrigger id="rate_basis">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Hourly", "Daily", "Flat"].map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="time_in">In</Label>
                    <Input
                      id="time_in"
                      type="time"
                      value={timeIn}
                      onChange={(e) => setTimeIn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meal_out">Meal Out</Label>
                    <Input
                      id="meal_out"
                      type="time"
                      value={mealOut}
                      onChange={(e) => setMealOut(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meal_in">Meal In</Label>
                    <Input
                      id="meal_in"
                      type="time"
                      value={mealIn}
                      onChange={(e) => setMealIn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time_out">Out</Label>
                    <Input
                      id="time_out"
                      type="time"
                      value={timeOut}
                      onChange={(e) => setTimeOut(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t border-border">
                  <div className="text-sm font-semibold">
                    Hours: <span className="tabular-nums text-primary">{formatHours(hours)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adjustments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {adjustments.map((adj, index) => (
                  <div key={index} className="flex flex-wrap gap-2 items-end">
                    <div className="flex-1 min-w-[140px]">
                      <Label className="text-xs">Label</Label>
                      <Input
                        placeholder="e.g., Wardrobe bump, Mileage"
                        value={adj.label}
                        onChange={(e) => updateAdjustment(index, { label: e.target.value })}
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Amount</Label>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        className="text-right"
                        value={adj.amount}
                        onChange={(e) => updateAdjustment(index, { amount: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAdjustment(index)}
                      disabled={adjustments.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addAdjustment}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Adjustment
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="approver">Approved By (AD / Coordinator)</Label>
                  <Input id="approver" value={approver} onChange={(e) => setApprover(e.target.value)} />
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Background Voucher</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div>
                    <span className="font-semibold">Production:</span> {v(productionName, "Production Name")}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span> {v(voucherDate, "Date")}
                  </div>
                  <div>
                    <span className="font-semibold">Voucher #:</span> {v(voucherNo, "Voucher #")}
                  </div>
                  <div>
                    <span className="font-semibold">Background Performer:</span> {v(performerName, "Background Performer")}
                  </div>
                  <div>
                    <span className="font-semibold">Agency:</span> {v(agency, "Agency")}
                  </div>
                  <div>
                    <span className="font-semibold">Role / Description:</span> {v(role, "Role / Description")}
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-sm font-semibold">Time</p>
                  <div className="grid grid-cols-5 gap-2 text-sm text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">In</p>
                      <p className="font-medium tabular-nums">{timeIn.trim() || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Meal Out</p>
                      <p className="font-medium tabular-nums">{mealOut.trim() || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Meal In</p>
                      <p className="font-medium tabular-nums">{mealIn.trim() || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Out</p>
                      <p className="font-medium tabular-nums">{timeOut.trim() || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hours</p>
                      <p className="font-medium tabular-nums">{formatHours(hours)}</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold">Rate:</span> {numericRate > 0 ? formatMoney(numericRate) : "—"} ({rateBasis})
                  </p>
                </div>

                {adjustments.some((a) => a.label.trim() || a.amount !== 0) && (
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-semibold mb-2">Adjustments</p>
                    <ul className="space-y-1 text-sm">
                      {adjustments.map(
                        (adj, index) =>
                          (adj.label.trim() || adj.amount !== 0) && (
                            <li key={index} className="flex justify-between">
                              <span>{adj.label.trim() || "—"}</span>
                              <span className="tabular-nums">{formatMoney(adj.amount)}</span>
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                )}

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Pay</span>
                    <span className="tabular-nums">{formatMoney(basePay)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Adjustments</span>
                    <span className="tabular-nums">{formatMoney(adjustmentsTotal)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                    <span>GROSS</span>
                    <span className="tabular-nums">{formatMoney(gross)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">Performer</p>
                    <p className="text-muted-foreground">{performerName.trim() || "—"}</p>
                    <p className="pt-4">Signature: ___________________</p>
                    <p>Date: _______________</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">Approved By</p>
                    <p className="text-muted-foreground">{approver.trim() || "—"}</p>
                    <p className="pt-4">Signature: ___________________</p>
                    <p>Date: _______________</p>
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

export default BackgroundVoucher;
