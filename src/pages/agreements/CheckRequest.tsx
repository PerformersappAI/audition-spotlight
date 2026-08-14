import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ToolTopBar from "@/components/ToolTopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer, RotateCcw } from "lucide-react";

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const v = (value: string, placeholder: string) => (value.trim() ? value.trim() : `[${placeholder}]`);

const ONES = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const SCALES = ["", "Thousand", "Million", "Billion"];

const threeDigitsToWords = (num: number): string => {
  const parts: string[] = [];
  const hundreds = Math.floor(num / 100);
  const rest = num % 100;
  if (hundreds > 0) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest > 0) {
    if (rest < 20) {
      parts.push(ONES[rest]);
    } else {
      const tens = Math.floor(rest / 10);
      const ones = rest % 10;
      parts.push(ones > 0 ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens]);
    }
  }
  return parts.join(" ");
};

const amountToWords = (amount: number): string => {
  const safe = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const whole = Math.floor(safe);
  const cents = Math.round((safe - whole) * 100);
  const centsText = String(Math.min(99, Math.max(0, cents))).padStart(2, "0");

  if (whole === 0) return `Zero and ${centsText}/100 Dollars`;

  const groups: number[] = [];
  let remaining = whole;
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  const words: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    const scale = SCALES[i] || "";
    words.push(`${threeDigitsToWords(groups[i])}${scale ? ` ${scale}` : ""}`);
  }

  return `${words.join(" ")} and ${centsText}/100 Dollars`;
};

const CheckRequest = () => {
  const [productionName, setProductionName] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [payee, setPayee] = useState("");
  const [payeeAddress, setPayeeAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Check");
  const [neededBy, setNeededBy] = useState("");

  const [purpose, setPurpose] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [poReference, setPoReference] = useState("");

  const [requestedBy, setRequestedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");

  const numericAmount = useMemo(() => parseFloat(amount) || 0, [amount]);
  const amountInWords = useMemo(() => amountToWords(numericAmount), [numericAmount]);

  const headerRows = [
    ["Production", productionName, "Production Name"],
    ["Date", requestDate, "Date"],
    ["Pay Method", payMethod, "Pay Method"],
    ["Needed By", neededBy, "Needed By"],
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

    const writeLine = (label: string, value: string, placeholder: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const labelText = `${label}: `;
      const labelWidth = doc.getTextWidth(labelText);
      doc.setFont("helvetica", "normal");
      const display = value.trim() || `[${placeholder}]`;
      const wrapped = doc.splitTextToSize(display, contentWidth - labelWidth) as string[];
      ensure(wrapped.length * 5 + 2);
      doc.setFont("helvetica", "bold");
      doc.text(labelText, margin, y);
      doc.setFont("helvetica", "normal");
      wrapped.forEach((line, i) => doc.text(line, margin + labelWidth, y + i * 5));
      y += wrapped.length * 5 + 2;
    };

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("CHECK REQUEST", pageWidth / 2, y, { align: "center" });
    y += 9;
    doc.setDrawColor(150, 150, 150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    headerRows.forEach(([label, value, placeholder]) => writeLine(label, value, placeholder));

    y += 4;
    ensure(24);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PAY TO THE ORDER OF", margin, y);
    y += 6;
    doc.setFontSize(12);
    doc.text(payee.trim() || "[Payee / Vendor]", margin, y);
    y += 6;
    if (payeeAddress.trim()) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const addr = doc.splitTextToSize(payeeAddress.trim(), contentWidth) as string[];
      ensure(addr.length * 5);
      addr.forEach((line, i) => doc.text(line, margin, y + i * 5));
      y += addr.length * 5;
    }

    y += 6;
    ensure(20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`AMOUNT: ${formatMoney(numericAmount)}`, margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const wordLines = doc.splitTextToSize(amountInWords, contentWidth) as string[];
    wordLines.forEach((line, i) => doc.text(line, margin, y + i * 5));
    y += wordLines.length * 5 + 6;
    doc.setFont("helvetica", "normal");

    ensure(16);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Purpose / Description", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const purposeLines = doc.splitTextToSize(purpose.trim() || "[Purpose / Description]", contentWidth) as string[];
    ensure(purposeLines.length * 5 + 4);
    purposeLines.forEach((line, i) => doc.text(line, margin, y + i * 5));
    y += purposeLines.length * 5 + 6;

    writeLine("Account / GL Code", accountCode, "Account / GL Code");
    writeLine("PO Reference", poReference, "PO Reference");

    y += 8;
    ensure(40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Requested By", margin, y);
    doc.text("Approved By", margin + contentWidth / 2, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Signature: _________________________________", margin, y);
    doc.text("Signature: _________________________________", margin + contentWidth / 2, y);
    y += 7;
    doc.text(`Print name: ${requestedBy.trim() || "—"}`, margin, y);
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
    doc.save(`${safe(productionName, "Production")}_${safe(payee, "Payee")}_${safe(requestDate, "Date")}_Check_Request.pdf`);
  };

  const handlePrint = () => {
    const doc = buildPDF();
    const url = URL.createObjectURL(doc.output("blob"));
    const win = window.open(url);
    if (win) win.onload = () => win.print();
  };

  const reset = () => {
    setProductionName("");
    setRequestDate("");
    setPayee("");
    setPayeeAddress("");
    setAmount("");
    setPayMethod("Check");
    setNeededBy("");
    setPurpose("");
    setAccountCode("");
    setPoReference("");
    setRequestedBy("");
    setApprovedBy("");
  };

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Check Request</h1>
          <p className="text-muted-foreground">Request a payment — payee, amount, purpose, and approvals.</p>
        </div>

        <section className="max-w-3xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 md:divide-x divide-border gap-8 md:gap-0">
            <div className="md:pr-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Who It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Coordinators requesting vendor payments.</li>
                <li>Accountants processing check runs.</li>
                <li>Anyone needing a payment authorized.</li>
              </ul>
            </div>
            <div className="md:pl-10 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">What It's For</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li>Names the payee and the amount due.</li>
                <li>States the purpose and account coding.</li>
                <li>Captures request and approval sign-off.</li>
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
                  <Label htmlFor="request_date">Date</Label>
                  <Input id="request_date" type="date" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="payee">Payee / Vendor</Label>
                  <Input id="payee" value={payee} onChange={(e) => setPayee(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="payee_address">Payee Address (optional)</Label>
                  <Textarea id="payee_address" rows={2} value={payeeAddress} onChange={(e) => setPayeeAddress(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div>
                    <Label>Pay Method</Label>
                    <Select value={payMethod} onValueChange={setPayMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="ACH / Wire">ACH / Wire</SelectItem>
                        <SelectItem value="Reimbursement">Reimbursement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="needed_by">Needed By (optional)</Label>
                  <Input id="needed_by" type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="purpose">Purpose / Description</Label>
                  <Textarea id="purpose" rows={3} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="account_code">Account / GL Code</Label>
                  <Input id="account_code" value={accountCode} onChange={(e) => setAccountCode(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="po_reference">PO Reference (optional)</Label>
                  <Input id="po_reference" value={poReference} onChange={(e) => setPoReference(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="requested_by">Requested By</Label>
                  <Input id="requested_by" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} />
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
                  <h2 className="text-center font-bold text-base mb-4 border-b border-gray-400 pb-2">CHECK REQUEST</h2>

                  <div className="space-y-1 mb-4">
                    {headerRows.map(([label, value, placeholder]) => (
                      <p key={label}>
                        <span className="font-semibold">{label}:</span> {v(value, placeholder)}
                      </p>
                    ))}
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold uppercase text-xs tracking-wide">Pay to the order of</p>
                    <p className="text-base font-bold">{v(payee, "Payee / Vendor")}</p>
                    {payeeAddress.trim() && (
                      <p className="whitespace-pre-wrap text-xs text-gray-700">{payeeAddress.trim()}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-xl font-bold">AMOUNT: {formatMoney(numericAmount)}</p>
                    <p className="italic text-xs">{amountInWords}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="font-semibold">Purpose</p>
                      <p className="whitespace-pre-wrap">{v(purpose, "Purpose / Description")}</p>
                    </div>
                    <p>
                      <span className="font-semibold">Account / GL Code:</span> {v(accountCode, "Account / GL Code")}
                    </p>
                    <p>
                      <span className="font-semibold">PO Reference:</span> {v(poReference, "PO Reference")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-300">
                    <div>
                      <p className="font-semibold mb-4">Requested By</p>
                      <p className="border-t border-gray-500 pt-1">Signature</p>
                      <p className="text-xs">{v(requestedBy, "Requested By")}</p>
                      <p className="border-t border-gray-500 pt-1 mt-4">Date</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-4">Approved By</p>
                      <p className="border-t border-gray-500 pt-1">Signature</p>
                      <p className="text-xs">{v(approvedBy, "Approved By")}</p>
                      <p className="border-t border-gray-500 pt-1 mt-4">Date</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">Filmmaker Genius — Document Library.</p>
      </div>
    </div>
  );
};

export default CheckRequest;
