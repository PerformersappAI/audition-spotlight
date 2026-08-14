import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Printer, RotateCcw, Trash2, Plus } from "lucide-react";

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

interface Trip {
  date: string;
  from: string;
  to: string;
  purpose: string;
  miles: number;
}

const emptyTrip = (): Trip => ({
  date: "",
  from: "",
  to: "",
  purpose: "",
  miles: 0,
});

const MileageLog = () => {
  const [productionName, setProductionName] = useState("");
  const [driver, setDriver] = useState("");
  const [department, setDepartment] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [rate, setRate] = useState<string>("0.67");
  const [driverNote, setDriverNote] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [trips, setTrips] = useState<Trip[]>([emptyTrip()]);

  const updateTrip = (index: number, patch: Partial<Trip>) =>
    setTrips((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addTrip = () => setTrips((rows) => [...rows, emptyTrip()]);
  const removeTrip = (index: number) =>
    setTrips((rows) => (rows.length > 1 ? rows.filter((_, i) => i !== index) : rows));

  const totalMiles = useMemo(
    () => trips.reduce((sum, row) => sum + (Number.isFinite(row.miles) ? row.miles : 0), 0),
    [trips]
  );

  const ratePerMile = useMemo(() => parseFloat(rate) || 0, [rate]);
  const reimbursement = useMemo(() => totalMiles * ratePerMile, [totalMiles, ratePerMile]);

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Driver", driver, "Driver"],
    ["Department", department, "Department"],
    ["Vehicle", vehicle, "Vehicle"],
    ["Rate per Mile", formatMoney(ratePerMile), "Rate per Mile"],
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
        return true;
      }
      return false;
    };

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("MILEAGE LOG", pageWidth / 2, y, { align: "center" });
    y += 9;
    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = `${label}: `;
      const labelWidth = doc.getTextWidth(labelText);
      doc.setFont("helvetica", "normal");
      const wrapped = doc.splitTextToSize(value.trim() || `[${placeholder}]`, contentWidth - labelWidth) as string[];
      ensure(wrapped.length * 5 + 2);
      doc.setFont("helvetica", "bold");
      doc.text(labelText, margin, y);
      doc.setFont("helvetica", "normal");
      wrapped.forEach((line, i) => doc.text(line, margin + labelWidth, y + i * 5));
      y += wrapped.length * 5 + 1;
    });

    y += 5;

    const colDate = margin;
    const colFrom = margin + 26;
    const colTo = margin + 56;
    const colPurpose = margin + 86;
    const colMilesRight = pageWidth - margin;
    const purposeWidth = colMilesRight - colPurpose - 4;

    const drawTableHeader = () => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Date", colDate, y);
      doc.text("From", colFrom, y);
      doc.text("To", colTo, y);
      doc.text("Purpose", colPurpose, y);
      doc.text("Miles", colMilesRight, y, { align: "right" });
      y += 2;
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
    };

    ensure(20);
    drawTableHeader();

    trips.forEach((row) => {
      const purposeLines = doc.splitTextToSize(row.purpose.trim() || "—", purposeWidth) as string[];
      const rowHeight = Math.max(purposeLines.length, 1) * 5 + 2;
      if (ensure(rowHeight + 6)) drawTableHeader();
      doc.setFontSize(9);
      doc.text(row.date.trim() || "—", colDate, y);
      doc.text(row.from.trim() || "—", colFrom, y);
      doc.text(row.to.trim() || "—", colTo, y);
      purposeLines.forEach((line, i) => doc.text(line, colPurpose, y + i * 5));
      doc.text(
        Number.isFinite(row.miles) ? row.miles.toFixed(1) : "0.0",
        colMilesRight,
        y,
        { align: "right" }
      );
      y += rowHeight;
    });

    y += 6;
    ensure(40);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Total Miles", colMilesRight - 40, y, { align: "right" });
    doc.text(totalMiles.toFixed(1), colMilesRight, y, { align: "right" });
    y += 6;
    doc.text("Rate", colMilesRight - 40, y, { align: "right" });
    doc.text(`${formatMoney(ratePerMile)}/mi`, colMilesRight, y, { align: "right" });
    y += 6;
    doc.line(colMilesRight - 60, y - 4, colMilesRight, y - 4);
    doc.setFont("helvetica", "bold");
    doc.text("Reimbursement", colMilesRight - 40, y, { align: "right" });
    doc.text(formatMoney(reimbursement), colMilesRight, y, { align: "right" });
    y += 10;

    if (driverNote.trim()) {
      ensure(15);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = "Notes: ";
      const labelWidth = doc.getTextWidth(labelText);
      doc.text(labelText, margin, y);
      doc.setFont("helvetica", "normal");
      const noteLines = doc.splitTextToSize(driverNote.trim(), contentWidth - labelWidth) as string[];
      noteLines.forEach((line, i) => doc.text(line, margin + labelWidth, y + i * 5));
      y += noteLines.length * 5 + 6;
    }

    ensure(40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Driver", margin, y);
    doc.text("Approved By", margin + contentWidth / 2, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Signature: _________________________________", margin, y);
    doc.text("Signature: _________________________________", margin + contentWidth / 2, y);
    y += 7;
    doc.text(`Print name: ${driver.trim() || "—"}`, margin, y);
    doc.text(`Print name: ${approvedBy.trim() || "—"}`, margin + contentWidth / 2, y);
    y += 7;
    doc.text("Date: _______________", margin, y);
    doc.text("Date: _______________", margin + contentWidth / 2, y);

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safe = (s: string, f: string) => (s || f).replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safe(productionName, "Production")}_${safe(driver, "Driver")}_Mileage_Log.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setDriver("");
    setDepartment("");
    setVehicle("");
    setRate("0.67");
    setDriverNote("");
    setApprovedBy("");
    setTrips([emptyTrip()]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Mileage Log</h1>
          <p className="text-muted-foreground">
            Track trips and miles — with reimbursement calculated at your set rate.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Crew logging reimbursable mileage.</li>
                <li>Coordinators and accountants approving it.</li>
                <li>Anyone tracking vehicle use for the shoot.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Logs each trip's route, purpose, and miles.</li>
                <li>Totals miles and applies a per-mile rate.</li>
                <li>Produces a reimbursement figure for sign-off.</li>
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
                  <Input id="production_name" value={productionName} onChange={(e) => setProductionName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="driver">Driver</Label>
                  <Input id="driver" value={driver} onChange={(e) => setDriver(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="vehicle">Vehicle (optional)</Label>
                  <Input id="vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="rate">Rate per Mile</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.001"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trips.map((row, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2">
                    <Input
                      type="date"
                      className="w-36"
                      value={row.date}
                      onChange={(e) => updateTrip(index, { date: e.target.value })}
                    />
                    <Input
                      className="w-32"
                      placeholder="From"
                      value={row.from}
                      onChange={(e) => updateTrip(index, { from: e.target.value })}
                    />
                    <Input
                      className="w-32"
                      placeholder="To"
                      value={row.to}
                      onChange={(e) => updateTrip(index, { to: e.target.value })}
                    />
                    <Input
                      className="flex-1 min-w-[10rem]"
                      placeholder="Purpose"
                      value={row.purpose}
                      onChange={(e) => updateTrip(index, { purpose: e.target.value })}
                    />
                    <Input
                      type="number"
                      className="w-24 text-right"
                      placeholder="0.0"
                      value={row.miles === 0 ? "" : row.miles}
                      onChange={(e) => updateTrip(index, { miles: parseFloat(e.target.value) || 0 })}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTrip(index)}
                      disabled={trips.length === 1}
                      aria-label="Remove trip"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addTrip}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Trip
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sign-Off</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="driver_note">Notes (optional)</Label>
                  <Input id="driver_note" value={driverNote} onChange={(e) => setDriverNote(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="approved_by">Approved By</Label>
                  <Input id="approved_by" value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} />
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
          </div>

          {/* RIGHT: preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white text-black rounded-md p-6 text-sm leading-relaxed max-h-[70vh] overflow-y-auto">
                  <h2 className="text-center font-bold text-base mb-4 border-b border-gray-400 pb-2">MILEAGE LOG</h2>

                  <div className="space-y-1 mb-4">
                    {headerRows.map(([label, value, placeholder]) => (
                      <p key={label}>
                        <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                      </p>
                    ))}
                  </div>

                  <table className="w-full text-xs mb-4">
                    <thead>
                      <tr className="border-b border-gray-500">
                        <th className="text-left py-1">Date</th>
                        <th className="text-left py-1">From</th>
                        <th className="text-left py-1">To</th>
                        <th className="text-left py-1">Purpose</th>
                        <th className="text-right py-1">Miles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trips.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-1">{row.date.trim() || "—"}</td>
                          <td className="py-1">{row.from.trim() || "—"}</td>
                          <td className="py-1">{row.to.trim() || "—"}</td>
                          <td className="py-1">{row.purpose.trim() || "—"}</td>
                          <td className="py-1 text-right">
                            {Number.isFinite(row.miles) ? row.miles.toFixed(1) : "0.0"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-right space-y-1 mb-4">
                    <p>Total Miles: {totalMiles.toFixed(1)}</p>
                    <p>Rate: {formatMoney(ratePerMile)}/mi</p>
                    <p className="font-bold border-t border-gray-400 inline-block pt-1 mt-1">
                      Reimbursement: {formatMoney(reimbursement)}
                    </p>
                  </div>

                  {driverNote.trim() && (
                    <p className="mb-4">
                      <span className="font-semibold">Notes:</span> {driverNote.trim()}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-8 text-xs">
                    <div>
                      <p className="font-semibold mb-1">Driver</p>
                      <p className="mb-4">Signature: _________________________________</p>
                      <p className="mb-1">Print name: {driver.trim() || "—"}</p>
                      <p>Date: _______________</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Approved By</p>
                      <p className="mb-4">Signature: _________________________________</p>
                      <p className="mb-1">Print name: {approvedBy.trim() || "—"}</p>
                      <p>Date: _______________</p>
                    </div>
                  </div>

                  <p className="text-center text-[10px] text-gray-500 mt-6">
                    Filmmaker Genius — Document Library.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MileageLog;
