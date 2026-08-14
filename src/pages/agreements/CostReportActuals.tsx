import { Fragment, useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface AccountRow {
  account: string;
  description: string;
  budget: number;
  actual: number;
}

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const formatPct = (value: number): string =>
  `${value.toFixed(1)}%`;

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const emptyAccount = (): AccountRow => ({ account: "", description: "", budget: 0, actual: 0 });

const CostReportActuals = () => {
  const [productionName, setProductionName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [periodCovered, setPeriodCovered] = useState("");

  const [accounts, setAccounts] = useState<AccountRow[]>([emptyAccount()]);

  const updateAccount = (index: number, patch: Partial<AccountRow>) =>
    setAccounts((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addAccount = () => setAccounts((prev) => [...prev, emptyAccount()]);

  const removeAccount = (index: number) => {
    if (accounts.length <= 1) return;
    setAccounts((prev) => prev.filter((_, i) => i !== index));
  };

  const computed = useMemo(() => {
    const rows = accounts.map((row) => {
      const budget = Number.isFinite(row.budget) ? row.budget : 0;
      const actual = Number.isFinite(row.actual) ? row.actual : 0;
      const variance = budget - actual;
      const variancePct = budget > 0 ? (variance / budget) * 100 : 0;
      return { ...row, budget, actual, variance, variancePct };
    });

    const totalBudget = rows.reduce((sum, r) => sum + r.budget, 0);
    const totalActual = rows.reduce((sum, r) => sum + r.actual, 0);
    const totalVariance = totalBudget - totalActual;
    const totalVariancePct = totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0;
    const overUnder = totalVariance >= 0 ? "UNDER BUDGET" : "OVER BUDGET";

    return { rows, totalBudget, totalActual, totalVariance, totalVariancePct, overUnder };
  }, [accounts]);

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Report Date", reportDate, "Report Date"],
    ["Prepared By", preparedBy, "Prepared By"],
    ["Period Covered", periodCovered, "Period Covered"],
  ] as const;

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
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
    doc.text("COST REPORT / ACTUALS", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, value, placeholder));

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("ACCOUNTS", margin, y);
    y += 6;

    const colX = {
      account: margin,
      description: margin + 30,
      budget: margin + contentWidth * 0.58,
      actual: margin + contentWidth * 0.69,
      variance: margin + contentWidth * 0.80,
      variancePct: margin + contentWidth * 0.91,
    };

    const drawTableHeader = () => {
      ensure(10);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Acct", colX.account + 2, y);
      doc.text("Description", colX.description + 2, y);
      doc.text("Budget", colX.budget + 2, y, { align: "right" });
      doc.text("Actual", colX.actual + 2, y, { align: "right" });
      doc.text("Variance", colX.variance + 2, y, { align: "right" });
      doc.text("Var %", colX.variancePct + 2, y, { align: "right" });
      y += 5;
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
    };

    drawTableHeader();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    computed.rows.forEach((row) => {
      const descLines = doc.splitTextToSize(
        row.description.trim() || "—",
        colX.budget - colX.description - 6
      ) as string[];
      const rowHeight = Math.max(descLines.length * 5 + 4, 10);
      ensure(rowHeight + 4);

      doc.setTextColor(0, 0, 0);
      doc.text(row.account.trim() || "—", colX.account + 2, y + 4);
      descLines.forEach((line, i) => doc.text(line, colX.description + 2, y + 4 + i * 5));
      doc.text(formatMoney(row.budget), colX.budget + 2, y + 4, { align: "right" });
      doc.text(formatMoney(row.actual), colX.actual + 2, y + 4, { align: "right" });

      const isFavorable = row.variance >= 0;
      doc.setTextColor(isFavorable ? 0 : 220, isFavorable ? 140 : 38, isFavorable ? 0 : 38);
      doc.text(formatMoney(row.variance), colX.variance + 2, y + 4, { align: "right" });
      doc.text(formatPct(row.variancePct), colX.variancePct + 2, y + 4, { align: "right" });
      doc.setTextColor(0, 0, 0);

      y += rowHeight;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
      doc.setDrawColor(180, 180, 180);
    });

    y += 6;
    ensure(24);

    const totalsX = pageWidth - margin;
    const labelX = margin + contentWidth * 0.46;

    doc.setDrawColor(80, 80, 80);
    doc.line(labelX - 2, y - 4, totalsX, y - 4);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL BUDGET", labelX, y);
    doc.text(formatMoney(computed.totalBudget), totalsX, y, { align: "right" });
    y += 6;

    doc.text("TOTAL ACTUAL", labelX, y);
    doc.text(formatMoney(computed.totalActual), totalsX, y, { align: "right" });
    y += 6;

    const isFavorable = computed.totalVariance >= 0;
    doc.setTextColor(isFavorable ? 0 : 220, isFavorable ? 140 : 38, isFavorable ? 0 : 38);
    doc.text(`TOTAL VARIANCE (${isFavorable ? "UNDER" : "OVER"})`, labelX, y);
    doc.text(formatMoney(computed.totalVariance), totalsX, y, { align: "right" });
    doc.setTextColor(0, 0, 0);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.text(`Variance %: ${formatPct(computed.totalVariancePct)}`, labelX, y);
    y += 10;

    ensure(14);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(isFavorable ? 0 : 220, isFavorable ? 140 : 38, isFavorable ? 0 : 38);
    const statusText = isFavorable
      ? `UNDER BUDGET by ${formatMoney(Math.abs(computed.totalVariance))} (${formatPct(computed.totalVariancePct)})`
      : `OVER BUDGET by ${formatMoney(Math.abs(computed.totalVariance))} (${formatPct(computed.totalVariancePct)})`;
    doc.text(statusText, margin, y);
    doc.setTextColor(0, 0, 0);

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safe = (s: string, f: string) => (s || f).replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safe(productionName, "Production")}_Cost_Report_Actuals_${safe(reportDate, "Date")}.pdf`);
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
    setPreparedBy("");
    setPeriodCovered("");
    setAccounts([emptyAccount()]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Cost Report / Actuals</h1>
          <p className="text-muted-foreground">
            Track budget vs. actual by account — see variance and where you stand.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It&apos;s For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Line producers and UPMs tracking spend against budget.</li>
                <li>Accountants preparing cost reports for financiers.</li>
                <li>Anyone reconciling estimated vs. actual costs.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It&apos;s For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Compares budget to actuals for each account.</li>
                <li>Computes variance in dollars and percent.</li>
                <li>Flags whether the production is over or under budget.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
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
                    <Label htmlFor="report_date">Report Date</Label>
                    <Input
                      id="report_date"
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prepared_by">Prepared By</Label>
                    <Input
                      id="prepared_by"
                      value={preparedBy}
                      onChange={(e) => setPreparedBy(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="period_covered">Period Covered (optional)</Label>
                  <Input
                    id="period_covered"
                    value={periodCovered}
                    onChange={(e) => setPeriodCovered(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {computed.rows.map((row, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap items-end gap-2">
                      <div className="w-24">
                        <Label className="text-xs">Acct #</Label>
                        <Input
                          placeholder="Acct #"
                          value={row.account}
                          onChange={(e) => updateAccount(index, { account: e.target.value })}
                        />
                      </div>
                      <div className="flex-1 min-w-[10rem]">
                        <Label className="text-xs">Description</Label>
                        <Input
                          placeholder="Description"
                          value={row.description}
                          onChange={(e) => updateAccount(index, { description: e.target.value })}
                        />
                      </div>
                      <div className="w-28">
                        <Label className="text-xs">Budget</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          className="text-right"
                          placeholder="Budget"
                          value={row.budget === 0 ? "" : row.budget}
                          onChange={(e) => updateAccount(index, { budget: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="w-28">
                        <Label className="text-xs">Actual</Label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          className="text-right"
                          placeholder="Actual"
                          value={row.actual === 0 ? "" : row.actual}
                          onChange={(e) => updateAccount(index, { actual: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="w-28 text-right">
                        <Label className="text-xs">Variance</Label>
                        <div
                          className={`text-sm font-medium tabular-nums py-2 ${
                            row.variance >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatMoney(row.variance)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAccount(index)}
                        disabled={accounts.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Fragment>
                ))}
                <Button variant="outline" onClick={addAccount}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Account
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Cost Report / Actuals</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {headerRows.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold">Acct</th>
                        <th className="text-left py-2 font-semibold">Description</th>
                        <th className="text-right py-2 font-semibold w-28">Budget</th>
                        <th className="text-right py-2 font-semibold w-28">Actual</th>
                        <th className="text-right py-2 font-semibold w-28">Variance</th>
                        <th className="text-right py-2 font-semibold w-20">Var %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {computed.rows.map((row, index) => (
                        <tr key={index} className="border-b border-border/60">
                          <td className="py-2 text-muted-foreground">{row.account.trim() || "[Acct #]"}</td>
                          <td className="py-2 text-muted-foreground">
                            {row.description.trim() || "[Description]"}
                          </td>
                          <td className="py-2 text-right tabular-nums font-medium">
                            {formatMoney(row.budget)}
                          </td>
                          <td className="py-2 text-right tabular-nums font-medium">
                            {formatMoney(row.actual)}
                          </td>
                          <td
                            className={`py-2 text-right tabular-nums font-bold ${
                              row.variance >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatMoney(row.variance)}
                          </td>
                          <td
                            className={`py-2 text-right tabular-nums font-medium ${
                              row.variance >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatPct(row.variancePct)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="text-right space-y-1 text-sm">
                    <div className="tabular-nums text-muted-foreground">
                      Total Budget: {formatMoney(computed.totalBudget)}
                    </div>
                    <div className="tabular-nums text-muted-foreground">
                      Total Actual: {formatMoney(computed.totalActual)}
                    </div>
                    <div className="text-base font-bold tabular-nums pt-1 border-t border-border">
                      Total Variance: {formatMoney(computed.totalVariance)} ({formatPct(computed.totalVariancePct)})
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold ${
                      computed.overUnder === "UNDER BUDGET"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {computed.overUnder === "UNDER BUDGET"
                      ? `UNDER BUDGET by ${formatMoney(Math.abs(computed.totalVariance))} (${formatPct(
                          computed.totalVariancePct
                        )})`
                      : `OVER BUDGET by ${formatMoney(Math.abs(computed.totalVariance))} (${formatPct(
                          computed.totalVariancePct
                        )})`}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostReportActuals;
