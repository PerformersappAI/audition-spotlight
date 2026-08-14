import { Fragment, useMemo, useState } from "react";
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

interface CreditRow {
  section: string;
  titleCard: string;
  name: string;
  notes: string;
}

const SECTION_OPTIONS = [
  "Main Titles",
  "Opening Credits",
  "End Titles (Card)",
  "End Crawl",
  "Logos",
  "Special Thanks",
];
const OTHER = "Other";

const emptyCredit = (): CreditRow => ({
  section: "Main Titles",
  titleCard: "",
  name: "",
  notes: "",
});

const v = (value: string, placeholder: string) =>
  value.trim() ? value.trim() : `[${placeholder}]`;

const CreditsTitleList = () => {
  const [productionTitle, setProductionTitle] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [version, setVersion] = useState("");
  const [creditsDate, setCreditsDate] = useState("");

  const [rows, setRows] = useState<CreditRow[]>([emptyCredit()]);

  const updateRow = (index: number, patch: Partial<CreditRow>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addRow = () => setRows((prev) => [...prev, emptyCredit()]);

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const creditCount = useMemo(() => rows.length, [rows]);

  const groupedRows = useMemo(() => {
    const map = new Map<string, CreditRow[]>();
    rows.forEach((row) => {
      const section = row.section.trim() || "Other";
      if (!map.has(section)) map.set(section, []);
      map.get(section)!.push(row);
    });

    const ordered: [string, CreditRow[]][] = [];
    SECTION_OPTIONS.forEach((section) => {
      if (map.has(section)) {
        ordered.push([section, map.get(section)!]);
        map.delete(section);
      }
    });
    map.forEach((items, section) => ordered.push([section, items]));
    return ordered;
  }, [rows]);

  const headerRows = [
    ["Production", productionTitle, "Production Title"],
    ["Prepared By", preparedBy, "Prepared By"],
    ["Version / Draft", version, "Version / Draft"],
    ["Date", creditsDate, "Date"],
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
    doc.text("CREDITS / TITLE LIST", pageWidth / 2, y, { align: "center" });
    y += 9;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    const colWidth = contentWidth / 2;
    doc.setFontSize(10);
    for (let i = 0; i < headerRows.length; i += 2) {
      ensure(7);
      const pair = [headerRows[i], headerRows[i + 1]].filter(Boolean) as ReadonlyArray<
        readonly [string, string, string]
      >;
      pair.forEach((entry, col) => {
        const [label, value, placeholder] = entry;
        const x = margin + col * colWidth;
        doc.setFont("helvetica", "bold");
        const labelText = `${label}: `;
        doc.text(labelText, x, y);
        const labelWidth = doc.getTextWidth(labelText);
        doc.setFont("helvetica", "normal");
        const display = value.trim() || `[${placeholder}]`;
        const lines = doc.splitTextToSize(display, colWidth - labelWidth - 6) as string[];
        doc.text(lines[0] ?? "", x + labelWidth, y);
      });
      y += 6;
    }

    y += 4;
    ensure(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Credits: ${creditCount}`, margin, y);
    y += 10;

    const titleCardWidth = 70;
    const nameWidth = contentWidth - titleCardWidth - 10;

    let currentSection = "";

    groupedRows.forEach(([section, credits]) => {
      const drawSectionHeading = (cont = false) => {
        ensure(10);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${section}${cont ? " (cont.)" : ""}`, margin, y);
        y += 6;
        doc.setDrawColor(180, 180, 180);
        doc.line(margin, y - 2, pageWidth - margin, y - 2);
        y += 4;
        doc.setFont("helvetica", "normal");
      };

      drawSectionHeading();
      currentSection = section;

      credits.forEach((credit) => {
        const titleCard = credit.titleCard.trim();
        const name = credit.name.trim() || "—";
        const notes = credit.notes.trim();
        const displayName = notes ? `${name} (${notes})` : name;

        const titleLines = titleCard
          ? (doc.splitTextToSize(titleCard, titleCardWidth - 4) as string[])
          : [""];
        const nameLines = doc.splitTextToSize(displayName, nameWidth - 4) as string[];
        const lineCount = Math.max(titleLines.length, nameLines.length, 1);
        const rowHeight = Math.max(lineCount * 5 + 4, 10);

        if (ensure(rowHeight + 4)) {
          drawSectionHeading(true);
        }

        if (titleCard) {
          doc.setFont("helvetica", "bold");
          titleLines.forEach((line, i) => doc.text(line, margin, y + 4 + i * 5));
          doc.setFont("helvetica", "normal");
          nameLines.forEach((line, i) =>
            doc.text(line, margin + titleCardWidth + 4, y + 4 + i * 5)
          );
        } else {
          doc.setFont("helvetica", "normal");
          nameLines.forEach((line, i) => doc.text(line, margin, y + 4 + i * 5));
        }

        y += rowHeight;
      });

      y += 4;
    });

    footer();
    return doc;
  };

  const handleDownload = () => {
    const doc = buildPDF();
    const safeProduction = (productionTitle || "Production").replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = (creditsDate || "Date").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`${safeProduction}_${safeDate}_Credits_Title_List.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionTitle("");
    setPreparedBy("");
    setVersion("");
    setCreditsDate("");
    setRows([emptyCredit()]);
  };

  const renderChoice = (
    label: string,
    options: string[],
    value: string,
    onChange: (next: string) => void,
    width: string
  ) => {
    const isKnown = options.includes(value);
    return (
      <div className={width}>
        <Label className="text-xs">{label}</Label>
        <Select
          value={isKnown ? value : OTHER}
          onValueChange={(next) => onChange(next === OTHER ? "" : next)}
        >
          <SelectTrigger>
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
            <SelectItem value={OTHER}>{OTHER}</SelectItem>
          </SelectContent>
        </Select>
        {!isKnown && (
          <Input
            className="mt-1"
            placeholder={`Other ${label}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Credits / Title List</h1>
          <p className="text-muted-foreground">
            Lay out your final on-screen credits — main titles and end crawl — in order, by
            section.
          </p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Producers and post teams building the credit order.</li>
                <li>Editors and title designers laying out cards and the crawl.</li>
                <li>Anyone confirming credit obligations before final.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Lists every credit in order, grouped by section.</li>
                <li>Captures role/title card and the name(s) credited.</li>
                <li>Produces a clean credit list for the title house.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Production Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="production_title">Production Title</Label>
                    <Input
                      id="production_title"
                      value={productionTitle}
                      onChange={(e) => setProductionTitle(e.target.value)}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="version">Version / Draft (optional)</Label>
                    <Input
                      id="version"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="Final v3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="credits_date">Date</Label>
                    <Input
                      id="credits_date"
                      type="date"
                      value={creditsDate}
                      onChange={(e) => setCreditsDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rows.map((row, index) => (
                  <Fragment key={index}>
                    <div className="flex flex-wrap gap-2 items-end">
                      {renderChoice(
                        "Section",
                        SECTION_OPTIONS,
                        row.section,
                        (next) => updateRow(index, { section: next }),
                        "w-44"
                      )}
                      <div className="w-52">
                        <Label className="text-xs">Role / Title Card</Label>
                        <Input
                          placeholder="Directed by"
                          value={row.titleCard}
                          onChange={(e) => updateRow(index, { titleCard: e.target.value })}
                        />
                      </div>
                      <div className="flex-1 min-w-[10rem]">
                        <Label className="text-xs">Name(s)</Label>
                        <Input
                          placeholder="Name(s)"
                          value={row.name}
                          onChange={(e) => updateRow(index, { name: e.target.value })}
                        />
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Notes</Label>
                        <Input
                          placeholder="single card"
                          value={row.notes}
                          onChange={(e) => updateRow(index, { notes: e.target.value })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(index)}
                        disabled={rows.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Fragment>
                ))}
                <Button variant="outline" onClick={addRow}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Credit
                </Button>
                <p className="text-xs text-muted-foreground">Credits: {creditCount}</p>
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
                  <h2 className="text-xl font-bold uppercase tracking-wide">Credits / Title List</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {headerRows.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                    </div>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">Credits: {creditCount}</div>

                <div className="space-y-4">
                  {groupedRows.map(([section, credits]) => (
                    <div key={section}>
                      <h3 className="font-bold text-sm border-b border-border pb-1 mb-2">{section}</h3>
                      <div className="space-y-1">
                        {credits.map((credit, i) => (
                          <div key={i} className="flex gap-2 text-sm">
                            {credit.titleCard.trim() ? (
                              <>
                                <span className="font-semibold w-40 shrink-0">{credit.titleCard}</span>
                                <span className="text-muted-foreground">
                                  {credit.name.trim() || "[Name(s)]"}
                                  {credit.notes.trim() && (
                                    <span className="text-muted-foreground/70"> ({credit.notes})</span>
                                  )}
                                </span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">
                                {credit.name.trim() || "[Name(s)]"}
                                {credit.notes.trim() && (
                                  <span className="text-muted-foreground/70"> ({credit.notes})</span>
                                )}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground italic border-t border-border pt-3">
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

export default CreditsTitleList;
