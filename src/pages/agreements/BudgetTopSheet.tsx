import { Fragment, useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";

interface Line {
  label: string;
  amount: number;
}

interface Section {
  name: string;
  lines: Line[];
}

const INITIAL_SECTIONS: Section[] = [
  {
    name: "Above-the-Line",
    lines: [
      { label: "Story & Script Rights", amount: 5000 },
      { label: "Producer(s)", amount: 10000 },
      { label: "Director", amount: 8000 },
      { label: "Principal Cast", amount: 15000 },
    ],
  },
  {
    name: "Production (Below-the-Line)",
    lines: [
      { label: "Production Staff / AD", amount: 12000 },
      { label: "Camera Department", amount: 9000 },
      { label: "Grip & Electric", amount: 8000 },
      { label: "Art Dept / Set Dressing", amount: 6000 },
      { label: "Wardrobe / Hair / Makeup", amount: 4000 },
      { label: "Sound Department", amount: 3500 },
      { label: "Locations", amount: 7000 },
      { label: "Transportation", amount: 3000 },
      { label: "Craft Services / Catering", amount: 4000 },
    ],
  },
  {
    name: "Post-Production",
    lines: [
      { label: "Picture Editorial", amount: 9000 },
      { label: "Music / Score", amount: 4000 },
      { label: "Sound Post / Mix", amount: 5000 },
      { label: "Color / Finishing", amount: 3500 },
      { label: "VFX", amount: 2500 },
    ],
  },
  {
    name: "Other / Wrap",
    lines: [
      { label: "Insurance", amount: 4000 },
      { label: "Legal & Accounting", amount: 3000 },
      { label: "Publicity / Festival", amount: 2500 },
      { label: "Office / Admin", amount: 2000 },
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

const clone = (sections: Section[]): Section[] =>
  sections.map((s) => ({ name: s.name, lines: s.lines.map((l) => ({ ...l })) }));

const BudgetTopSheet = () => {
  const [productionName, setProductionName] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [budgetDate, setBudgetDate] = useState("");
  const [contingencyPct, setContingencyPct] = useState(10);
  const [sections, setSections] = useState<Section[]>(() => clone(INITIAL_SECTIONS));

  const updateLine = (si: number, li: number, patch: Partial<Line>) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, lines: s.lines.map((l, j) => (j === li ? { ...l, ...patch } : l)) } : s
      )
    );
  };

  const addLine = (si: number) => {
    setSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, lines: [...s.lines, { label: "", amount: 0 }] } : s))
    );
  };

  const removeLine = (si: number, li: number) => {
    setSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, lines: s.lines.filter((_, j) => j !== li) } : s))
    );
  };

  const subtotals = useMemo(
    () => sections.map((s) => s.lines.reduce((sum, l) => sum + num(l.amount), 0)),
    [sections]
  );
  const directTotal = useMemo(() => subtotals.reduce((a, b) => a + b, 0), [subtotals]);
  const contingencyAmount = useMemo(
    () => directTotal * (num(contingencyPct) / 100),
    [directTotal, contingencyPct]
  );
  const grandTotal = directTotal + contingencyAmount;

  const buildPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    const rightX = margin + contentWidth;
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

    const row = (
      label: string,
      amount: string,
      opts: { bold?: boolean; indent?: number; size?: number } = {}
    ) => {
      const size = opts.size ?? 10;
      ensure(size * 0.7);
      doc.setFontSize(size);
      doc.setFont("times", opts.bold ? "bold" : "normal");
      doc.text(label, margin + (opts.indent ?? 0), y);
      doc.text(amount, rightX, y, { align: "right" });
      y += size * 0.62;
    };

    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("BUDGET TOP SHEET", pageWidth / 2, y, { align: "center" });
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

    sections.forEach((section, si) => {
      row(section.name, money(subtotals[si]), { bold: true, size: 11 });
      section.lines.forEach((line) => {
        row(line.label.trim() || "—", money(num(line.amount)), { indent: 6, size: 9.5 });
      });
      y += 3;
    });

    y += 2;
    doc.setDrawColor(120, 120, 120);
    ensure(10);
    doc.line(margin, y - 3, rightX, y - 3);
    row("TOTAL DIRECT COSTS", money(directTotal), { bold: true, size: 11 });
    row(`Contingency (${num(contingencyPct)}%)`, money(contingencyAmount), { size: 10 });

    y += 3;
    ensure(12);
    doc.setLineWidth(0.5);
    doc.line(margin, y - 3, rightX, y - 3);
    doc.setLineWidth(0.2);
    row("GRAND TOTAL", money(grandTotal), { bold: true, size: 13 });

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safe = (productionName || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safe}_Budget_Top_Sheet.pdf`);
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
    setSections(clone(INITIAL_SECTIONS));
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Budget Top Sheet</h1>
          <p className="text-muted-foreground">
            The one-page summary of your budget — categories, subtotals, contingency, and grand total.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers and line producers pitching a number.</li>
                <li>Filmmakers applying for grants or investors.</li>
                <li>Anyone who needs the top-line budget at a glance.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Summarizes the budget by major category.</li>
                <li>Auto-totals each section and the whole film.</li>
                <li>Adds a contingency percentage on top.</li>
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
                    value={contingencyPct}
                    onChange={(e) => setContingencyPct(parseFloat(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {sections.map((section, si) => (
              <Card key={section.name}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{section.name}</CardTitle>
                  <span className="text-sm font-semibold tabular-nums">{money(subtotals[si])}</span>
                </CardHeader>
                <CardContent className="space-y-3">
                  {section.lines.map((line, li) => (
                    <div key={li} className="flex items-center gap-2">
                      <Input
                        className="flex-1"
                        placeholder="Category"
                        value={line.label}
                        onChange={(e) => updateLine(si, li, { label: e.target.value })}
                        aria-label={`${section.name} line ${li + 1} label`}
                      />
                      <Input
                        type="number"
                        className="w-32 text-right"
                        value={Number.isFinite(line.amount) ? line.amount : ""}
                        onChange={(e) => updateLine(si, li, { amount: parseFloat(e.target.value) })}
                        aria-label={`${section.name} line ${li + 1} amount`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        disabled={section.lines.length <= 1}
                        onClick={() => removeLine(si, li)}
                        aria-label="Remove line"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="outline" onClick={() => addLine(si)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Line
                  </Button>
                </CardContent>
              </Card>
            ))}
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
                  <h2 className="text-center font-bold tracking-wide text-base">BUDGET TOP SHEET</h2>
                  <p className="text-center italic text-xs text-muted-foreground">
                    Production: {v(productionName, "Production Name")} · Prepared by:{" "}
                    {v(preparedBy, "Prepared By")} · Date: {v(budgetDate, "Date")}
                  </p>

                  <table className="w-full text-xs border-collapse mt-2">
                    <tbody>
                      {sections.map((section, si) => (
                        <Fragment key={`s-${si}`}>
                          <tr className="bg-muted/60">
                            <td className="px-2 py-1 font-bold">{section.name}</td>
                            <td className="px-2 py-1 font-bold text-right tabular-nums">
                              {money(subtotals[si])}
                            </td>
                          </tr>
                          {section.lines.map((line, li) => (
                            <tr key={`s-${si}-l-${li}`} className="border-b border-border/50">
                              <td className="px-2 py-1 pl-6">{line.label.trim() || "—"}</td>
                              <td className="px-2 py-1 text-right tabular-nums">
                                {money(num(line.amount))}
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
                        <td className="px-2 py-1 text-right tabular-nums">{money(contingencyAmount)}</td>
                      </tr>
                      <tr className="border-t-2 border-border">
                        <td className="px-2 py-2 font-bold text-base">GRAND TOTAL</td>
                        <td className="px-2 py-2 font-bold text-base text-right tabular-nums">
                          {money(grandTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="text-xs italic text-muted-foreground pt-2">
                    Filmmaker Genius — Document Library.
                  </p>
                </article>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Filmmaker Genius — Document Library.
        </p>
      </div>
    </div>
  );
};

export default BudgetTopSheet;
