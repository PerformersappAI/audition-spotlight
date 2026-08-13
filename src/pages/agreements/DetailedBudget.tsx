import { Fragment, useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface Line {
  description: string;
  qty: number;
  units: string;
  rate: number;
}

interface Account {
  name: string;
  lines: Line[];
}

const INITIAL_ACCOUNTS: Account[] = [
  {
    name: "Camera",
    lines: [
      { description: "Director of Photography", qty: 5, units: "days", rate: 600 },
      { description: "Camera Operator", qty: 5, units: "days", rate: 450 },
      { description: "1st AC", qty: 5, units: "days", rate: 350 },
      { description: "Camera Package Rental", qty: 5, units: "days", rate: 500 },
    ],
  },
  {
    name: "Grip & Electric",
    lines: [
      { description: "Gaffer", qty: 5, units: "days", rate: 400 },
      { description: "Key Grip", qty: 5, units: "days", rate: 400 },
      { description: "G&E Package", qty: 5, units: "days", rate: 650 },
      { description: "Expendables", qty: 1, units: "allow", rate: 1200 },
    ],
  },
  {
    name: "Locations",
    lines: [
      { description: "Location Fees", qty: 4, units: "days", rate: 800 },
      { description: "Permits", qty: 1, units: "flat", rate: 900 },
      { description: "Site Rep / Security", qty: 4, units: "days", rate: 250 },
    ],
  },
];

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const money = (n: number) => usd.format(Number.isFinite(n) ? n : 0);
const num = (n: number) => (Number.isFinite(n) ? n : 0);
const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const clone = (accounts: Account[]): Account[] =>
  accounts.map((a) => ({ name: a.name, lines: a.lines.map((l) => ({ ...l })) }));

const DetailedBudget = () => {
  const [productionName, setProductionName] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [budgetDate, setBudgetDate] = useState("");
  const [contingencyPct, setContingencyPct] = useState(10);
  const [accounts, setAccounts] = useState<Account[]>(() => clone(INITIAL_ACCOUNTS));

  const updateAccount = (ai: number, patch: Partial<Account>) =>
    setAccounts((prev) => prev.map((a, i) => (i === ai ? { ...a, ...patch } : a)));

  const updateLine = (ai: number, li: number, patch: Partial<Line>) =>
    setAccounts((prev) =>
      prev.map((a, i) =>
        i === ai ? { ...a, lines: a.lines.map((l, j) => (j === li ? { ...l, ...patch } : l)) } : a
      )
    );

  const addLine = (ai: number) =>
    setAccounts((prev) =>
      prev.map((a, i) =>
        i === ai
          ? { ...a, lines: [...a.lines, { description: "", qty: 1, units: "days", rate: 0 }] }
          : a
      )
    );

  const removeLine = (ai: number, li: number) =>
    setAccounts((prev) =>
      prev.map((a, i) => (i === ai ? { ...a, lines: a.lines.filter((_, j) => j !== li) } : a))
    );

  const addAccount = () =>
    setAccounts((prev) => [
      ...prev,
      { name: "New Account", lines: [{ description: "", qty: 1, units: "days", rate: 0 }] },
    ]);

  const removeAccount = (ai: number) => setAccounts((prev) => prev.filter((_, i) => i !== ai));

  const lineAmount = (l: Line) => num(l.qty) * num(l.rate);

  const subtotals = useMemo(
    () => accounts.map((a) => a.lines.reduce((sum, l) => sum + num(l.qty) * num(l.rate), 0)),
    [accounts]
  );
  const directTotal = useMemo(() => subtotals.reduce((a, b) => a + b, 0), [subtotals]);
  const contingencyAmount = useMemo(
    () => directTotal * (num(contingencyPct) / 100),
    [directTotal, contingencyPct]
  );
  const grandTotal = directTotal + contingencyAmount;

  const lineNote = (l: Line) =>
    `${num(l.qty)} ${l.units.trim() || "ea"} × ${money(num(l.rate))}`;

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    const rightX = margin + contentWidth;
    const noteX = rightX - 40;
    let y = margin;

    const footer = () => {
      doc.setFontSize(8);
      doc.setFont("times", "italic");
      doc.setTextColor(120, 120, 120);
      doc.text("Filmmaker Genius — Document Library.", margin, pageHeight - 10);
      doc.setTextColor(0, 0, 0);
    };

    const ensure = (h = 8) => {
      if (y + h > pageHeight - 18) {
        footer();
        doc.addPage();
        y = margin;
      }
    };

    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("DETAILED BUDGET", pageWidth / 2, y, { align: "center" });
    y += 7;

    doc.setFontSize(9);
    doc.setFont("times", "italic");
    doc.text(
      `Production: ${v(productionName, "Production Name")}   ·   Prepared by: ${v(preparedBy, "Prepared By")}   ·   Date: ${v(budgetDate, "Date")}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );
    y += 9;

    accounts.forEach((account, ai) => {
      ensure(10);
      doc.setFontSize(11);
      doc.setFont("times", "bold");
      doc.text(account.name.trim() || "—", margin, y);
      doc.text(money(subtotals[ai]), rightX, y, { align: "right" });
      y += 6;

      account.lines.forEach((line) => {
        doc.setFontSize(9.5);
        doc.setFont("times", "normal");
        const parts = doc.splitTextToSize(
          line.description.trim() || "—",
          noteX - (margin + 6) - 4
        ) as string[];
        ensure(parts.length * 4.5 + 2);
        parts.forEach((part, pi) => {
          doc.text(part, margin + 6, y + pi * 4.5);
        });
        doc.text(lineNote(line), noteX, y, { align: "left" });
        doc.text(money(lineAmount(line)), rightX, y, { align: "right" });
        y += Math.max(parts.length, 1) * 4.5 + 0.8;
      });
      y += 3;
    });

    y += 2;
    ensure(14);
    doc.setDrawColor(120, 120, 120);
    doc.line(margin, y - 3, rightX, y - 3);
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("TOTAL DIRECT COSTS", margin, y);
    doc.text(money(directTotal), rightX, y, { align: "right" });
    y += 6.5;

    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text(`Contingency (${num(contingencyPct)}%)`, margin, y);
    doc.text(money(contingencyAmount), rightX, y, { align: "right" });
    y += 7;

    ensure(12);
    doc.setLineWidth(0.5);
    doc.line(margin, y - 3, rightX, y - 3);
    doc.setLineWidth(0.2);
    doc.setFontSize(13);
    doc.setFont("times", "bold");
    doc.text("GRAND TOTAL", margin, y + 2);
    doc.text(money(grandTotal), rightX, y + 2, { align: "right" });

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safe = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safe}_Detailed_Budget.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setPreparedBy("");
    setBudgetDate("");
    setContingencyPct(10);
    setAccounts(clone(INITIAL_ACCOUNTS));
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Detailed Budget</h1>
          <p className="text-muted-foreground">
            Line-item budgeting — quantity, units, and rate roll up to account subtotals and a grand
            total.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Who It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Line producers and UPMs building the real number.</li>
                <li>Producers who need defensible, itemized costs.</li>
                <li>Anyone turning a top sheet into a working budget.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                What It's For
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Breaks each account into detailed line items.</li>
                <li>Multiplies quantity × units × rate automatically.</li>
                <li>Rolls line items into account and film totals.</li>
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
                    <Label htmlFor="prepared_by">Prepared By</Label>
                    <Input
                      id="prepared_by"
                      value={preparedBy}
                      onChange={(e) => setPreparedBy(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget_date">Date</Label>
                    <Input
                      id="budget_date"
                      type="date"
                      value={budgetDate}
                      onChange={(e) => setBudgetDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contingency_pct">Contingency (%)</Label>
                  <Input
                    id="contingency_pct"
                    type="number"
                    className="w-32"
                    value={Number.isFinite(contingencyPct) ? contingencyPct : ""}
                    onChange={(e) => setContingencyPct(parseFloat(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {accounts.map((account, ai) => (
              <Card key={`a-${ai}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <Input
                    className="max-w-[60%] font-semibold"
                    value={account.name}
                    onChange={(e) => updateAccount(ai, { name: e.target.value })}
                    aria-label={`Account ${ai + 1} name`}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums">{money(subtotals[ai])}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={accounts.length <= 1}
                      onClick={() => removeAccount(ai)}
                      aria-label="Remove account"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="flex-1">Description</span>
                    <span className="w-20">Qty</span>
                    <span className="w-20">Units</span>
                    <span className="w-28">Rate</span>
                    <span className="w-28 text-right">Amount</span>
                    <span className="w-10" />
                  </div>

                  {account.lines.map((line, li) => (
                    <div key={`a-${ai}-l-${li}`} className="flex items-center gap-2">
                      <Input
                        className="flex-1"
                        placeholder="Line item"
                        value={line.description}
                        onChange={(e) => updateLine(ai, li, { description: e.target.value })}
                        aria-label={`Line ${li + 1} description`}
                      />
                      <Input
                        type="number"
                        className="w-20"
                        value={Number.isFinite(line.qty) ? line.qty : ""}
                        onChange={(e) => updateLine(ai, li, { qty: parseFloat(e.target.value) })}
                        aria-label={`Line ${li + 1} quantity`}
                      />
                      <Input
                        className="w-20"
                        value={line.units}
                        onChange={(e) => updateLine(ai, li, { units: e.target.value })}
                        aria-label={`Line ${li + 1} units`}
                      />
                      <Input
                        type="number"
                        className="w-28"
                        value={Number.isFinite(line.rate) ? line.rate : ""}
                        onChange={(e) => updateLine(ai, li, { rate: parseFloat(e.target.value) })}
                        aria-label={`Line ${li + 1} rate`}
                      />
                      <div className="w-28 text-right text-sm tabular-nums">
                        {money(lineAmount(line))}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        disabled={account.lines.length <= 1}
                        onClick={() => removeLine(ai, li)}
                        aria-label="Remove line"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="outline" onClick={() => addLine(ai)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Line
                  </Button>
                </CardContent>
              </Card>
            ))}

            <Button type="button" variant="secondary" onClick={addAccount}>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
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
                  <h2 className="text-center font-bold tracking-wide text-base">DETAILED BUDGET</h2>
                  <p className="text-center italic text-xs text-muted-foreground">
                    Production: {v(productionName, "Production Name")} · Prepared by:{" "}
                    {v(preparedBy, "Prepared By")} · Date: {v(budgetDate, "Date")}
                  </p>

                  <table className="w-full text-xs border-collapse mt-2">
                    <tbody>
                      {accounts.map((account, ai) => (
                        <Fragment key={`p-a-${ai}`}>
                          <tr className="bg-muted/60">
                            <td className="px-2 py-1 font-bold">{account.name.trim() || "—"}</td>
                            <td className="px-2 py-1 font-bold text-right tabular-nums">
                              {money(subtotals[ai])}
                            </td>
                          </tr>
                          {account.lines.map((line, li) => (
                            <tr key={`p-a-${ai}-l-${li}`} className="border-b border-border/50">
                              <td className="px-2 py-1 pl-6">
                                {line.description.trim() || "—"}
                                <span className="text-muted-foreground"> — {lineNote(line)}</span>
                              </td>
                              <td className="px-2 py-1 text-right tabular-nums">
                                {money(lineAmount(line))}
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      ))}

                      <tr className="border-t-2 border-border">
                        <td className="px-2 py-1 font-bold">TOTAL DIRECT COSTS</td>
                        <td className="px-2 py-1 font-bold text-right tabular-nums">
                          {money(directTotal)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1">Contingency ({num(contingencyPct)}%)</td>
                        <td className="px-2 py-1 text-right tabular-nums">
                          {money(contingencyAmount)}
                        </td>
                      </tr>
                      <tr className="border-t-2 border-border">
                        <td className="px-2 py-2 font-bold text-base">GRAND TOTAL</td>
                        <td className="px-2 py-2 font-bold text-base text-right tabular-nums">
                          {money(grandTotal)}
                        </td>
                      </tr>
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

export default DetailedBudget;
