import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Loader2, Plus, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { aiInvoke } from "@/lib/aiInvoke";
import { ghostBtn, inputStyle, panel, primaryBtn } from "@/components/production/ProductionPicker";
import { prepareImage, ImageError } from "@/lib/breakdown/imageDownscale";
import { CURRENCIES, formatMoney, parseAmount, round2 } from "@/lib/expenses/currency";
import {
  EXPENSE_DEPARTMENTS, EXPENSE_FIELDS, PAYMENT_METHODS, toExpense,
  type Expense, type ExpenseLine,
} from "@/lib/expenses/types";
import { MAX_PDF_BYTES, isPdf, removeExpenseFiles, uploadExpenseFile, fileToBase64, pathIsPdf } from "@/lib/expenses/files";

const TEAL = "#00d4aa";

export interface BreakdownItemOption {
  id: string;
  scene: string;
  department: string;
  text: string;
}

interface Props {
  projectId: string;
  company: string | null;
  defaultCurrency: string;
  actorName: string;
  itemOptions: BreakdownItemOption[];
  nextInvoiceNumber: string;
  existing: Expense | null;
  onClose: () => void;
  onSaved: (expense: Expense) => void;
}

interface Picked {
  blob: Blob;
  mime: string;
  preview: string;
}

const label: React.CSSProperties = {
  fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6, display: "block",
};

const today = () => new Date().toISOString().slice(0, 10);

const ExpenseDialog = ({
  projectId, company, defaultCurrency, actorName, itemOptions, nextInvoiceNumber,
  existing, onClose, onSaved,
}: Props) => {
  const [kind, setKind] = useState<"receipt" | "invoice">((existing?.kind as "receipt" | "invoice") || "receipt");
  const [submittedBy, setSubmittedBy] = useState(existing?.submitted_by_name || actorName);
  const [email, setEmail] = useState(existing?.submitted_by_email || "");
  const [department, setDepartment] = useState(existing?.department || EXPENSE_DEPARTMENTS[3]);
  const [payment, setPayment] = useState(existing?.payment_method || "");
  const [currency, setCurrency] = useState(existing?.currency || defaultCurrency);
  const [date, setDate] = useState(existing?.expense_date || today());
  const [notes, setNotes] = useState(existing?.notes || "");
  const [linkedItemId, setLinkedItemId] = useState(existing?.linked_item_id || "");

  const [vendor, setVendor] = useState(existing?.vendor || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [total, setTotal] = useState(existing ? String(existing.amount) : "");
  const [lines, setLines] = useState<ExpenseLine[]>(existing?.line_items || []);

  const [invoiceNumber, setInvoiceNumber] = useState(existing?.invoice_number || nextInvoiceNumber);
  const [billTo, setBillTo] = useState(existing?.bill_to || company || "");

  const [receipt, setReceipt] = useState<Picked | null>(null);
  const [itemPhoto, setItemPhoto] = useState<Picked | null>(null);
  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const receiptInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (receipt?.preview) URL.revokeObjectURL(receipt.preview);
    if (itemPhoto?.preview) URL.revokeObjectURL(itemPhoto.preview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const invoiceTotal = useMemo(
    () => round2(lines.reduce((sum, l) => sum + (Number(l.qty ?? 1) * Number(l.rate ?? 0) || 0), 0)),
    [lines],
  );
  const receiptLinesTotal = useMemo(
    () => round2(lines.reduce((sum, l) => sum + Number(l.amount || 0), 0)),
    [lines],
  );
  const amount = kind === "invoice"
    ? invoiceTotal
    : (parseAmount(total) || receiptLinesTotal);

  const pickFile = async (file: File | undefined, setter: (p: Picked | null) => void, allowPdf: boolean) => {
    if (!file) return;
    setError("");
    try {
      if (allowPdf && isPdf(file.type)) {
        if (file.size > MAX_PDF_BYTES) throw new ImageError("That PDF is larger than 10 MB. Please use a smaller file.");
        setter({ blob: file, mime: "application/pdf", preview: URL.createObjectURL(file) });
        return;
      }
      const blob = await prepareImage(file);
      setter({ blob, mime: "image/jpeg", preview: URL.createObjectURL(blob) });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "That file couldn't be used.";
      setError(msg);
      toast.error(msg);
    }
  };

  const readWithAi = async () => {
    if (!receipt) return;
    setReading(true);
    setError("");
    try {
      const base64 = await fileToBase64(receipt.blob);
      const res = await aiInvoke<{ vendor: string; date: string; currency: string; total: number; lines: ExpenseLine[] }>(
        "read-receipt",
        { body: { project_id: projectId, file_base64: base64, mime_type: receipt.mime } },
      );
      if (res.vendor) setVendor(res.vendor);
      if (res.date) setDate(res.date);
      if (res.currency && CURRENCIES.some((c) => c.code === res.currency)) setCurrency(res.currency);
      if (res.total) setTotal(String(res.total));
      setLines(Array.isArray(res.lines) ? res.lines.map((l) => ({ text: l.text || "", amount: Number(l.amount) || 0 })) : []);
      toast.success("Receipt read — check the details before saving.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not read that receipt.";
      if (!msg.includes("Insufficient credits")) { setError(msg); toast.error(msg); }
    } finally {
      setReading(false);
    }
  };

  const save = async () => {
    setError("");
    if (!submittedBy.trim()) return setError("Who submitted this?");
    if (!payment) return setError("Pick a payment method.");
    if (!(amount > 0)) return setError("Enter an amount greater than zero.");

    setSaving(true);
    const uploaded: string[] = [];
    try {
      const payload = {
        project_id: projectId,
        kind,
        department,
        vendor: kind === "receipt" ? (vendor.trim() || null) : (billTo.trim() || null),
        description: description.trim() || null,
        expense_date: date || today(),
        currency,
        amount,
        payment_method: payment,
        notes: notes.trim() || null,
        line_items: lines.filter((l) => l.text || l.amount || l.rate) as unknown as never,
        invoice_number: kind === "invoice" ? (invoiceNumber.trim() || null) : null,
        bill_to: kind === "invoice" ? (billTo.trim() || null) : null,
        linked_item_id: linkedItemId || null,
        submitted_by_name: submittedBy.trim(),
        submitted_by_email: email.trim() || null,
      };

      let expenseId = existing?.id || "";
      if (existing) {
        const { error: err } = await supabase.from("production_expenses").update(payload).eq("id", existing.id);
        if (err) throw new Error(err.message);
      } else {
        const { data, error: err } = await supabase
          .from("production_expenses")
          .insert(payload)
          .select("id")
          .single();
        if (err || !data) throw new Error(err?.message || "Could not save this expense.");
        expenseId = data.id;
      }

      const patch: Record<string, string> = {};
      if (receipt) {
        const path = await uploadExpenseFile(projectId, expenseId, receipt.blob, receipt.mime);
        uploaded.push(path);
        patch.receipt_path = path;
      }
      if (itemPhoto) {
        const path = await uploadExpenseFile(projectId, expenseId, itemPhoto.blob, itemPhoto.mime);
        uploaded.push(path);
        patch.item_photo_path = path;
      }
      if (Object.keys(patch).length) {
        const { error: err } = await supabase.from("production_expenses").update(patch).eq("id", expenseId);
        if (err) throw new Error(err.message);
        const stale = [
          receipt && existing?.receipt_path ? existing.receipt_path : null,
          itemPhoto && existing?.item_photo_path ? existing.item_photo_path : null,
        ];
        await removeExpenseFiles(stale);
      }

      const { data: fresh } = await supabase
        .from("production_expenses")
        .select(EXPENSE_FIELDS)
        .eq("id", expenseId)
        .single();

      toast.success(existing ? "Expense updated." : "Expense saved.");
      if (fresh) onSaved(toExpense(fresh as Record<string, unknown>));
      onClose();
    } catch (err) {
      await removeExpenseFiles(uploaded);
      const msg = err instanceof Error ? err.message : "Could not save this expense.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const tabBtn = (value: "receipt" | "invoice", text: string) => (
    <button
      key={value}
      onClick={() => setKind(value)}
      style={{
        flex: 1, minHeight: 44, borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15,
        border: `1px solid ${kind === value ? TEAL : "rgba(255,255,255,0.14)"}`,
        background: kind === value ? "rgba(0,212,170,0.14)" : "rgba(255,255,255,0.04)",
        color: kind === value ? TEAL : "#fff",
      }}
    >{text}</button>
  );

  const existingReceiptPath = existing?.receipt_path;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 16, overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ ...panel, background: "#10101b", width: "100%", maxWidth: 720, padding: 24, margin: "24px 0" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, margin: 0 }}>
            {existing ? "Edit expense" : "Add expense"}
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ ...ghostBtn, minWidth: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {tabBtn("receipt", "Receipt")}
          {tabBtn("invoice", "Invoice")}
        </div>

        <div className="ex-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label} htmlFor="ex-by">Submitted by</label>
            <input id="ex-by" value={submittedBy} onChange={(e) => setSubmittedBy(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={label} htmlFor="ex-email">Email (optional)</label>
            <input id="ex-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={label} htmlFor="ex-department">Department</label>
            <select id="ex-department" value={department} onChange={(e) => setDepartment(e.target.value)} style={inputStyle}>
              {EXPENSE_DEPARTMENTS.map((d) => <option key={d} value={d} style={{ background: "#10101b" }}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={label} htmlFor="ex-currency">Currency</label>
            <select id="ex-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} style={inputStyle}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.code} style={{ background: "#10101b" }}>{c.label}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <span style={label}>Payment</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PAYMENT_METHODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPayment(p.key)}
                  style={{
                    minHeight: 44, padding: "0 16px", borderRadius: 9999, cursor: "pointer", fontSize: 15, fontWeight: 600,
                    border: `1px solid ${payment === p.key ? TEAL : "rgba(255,255,255,0.14)"}`,
                    background: payment === p.key ? "rgba(0,212,170,0.14)" : "rgba(255,255,255,0.04)",
                    color: payment === p.key ? TEAL : "#fff",
                  }}
                >{p.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={label} htmlFor="ex-date">Date</label>
            <input id="ex-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={label} htmlFor="ex-link">Link to a breakdown item (optional)</label>
            <select id="ex-link" value={linkedItemId} onChange={(e) => setLinkedItemId(e.target.value)} style={inputStyle}>
              <option value="" style={{ background: "#10101b" }}>Not linked</option>
              {itemOptions.map((o) => (
                <option key={o.id} value={o.id} style={{ background: "#10101b" }}>
                  {o.scene} · {o.department} · {o.text}
                </option>
              ))}
            </select>
          </div>
        </div>

        {kind === "receipt" ? (
          <div style={{ marginTop: 18 }}>
            <input
              ref={receiptInput}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => { pickFile(e.target.files?.[0], setReceipt, true); e.target.value = ""; }}
              style={{ display: "none" }}
            />
            <button
              onClick={() => receiptInput.current?.click()}
              style={{
                width: "100%", minHeight: 110, borderRadius: 14, cursor: "pointer",
                border: "1px dashed rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.02)",
                color: "rgba(255,255,255,0.6)", fontSize: 15, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 10, padding: 16,
              }}
            >
              <Upload size={18} /> {receipt ? "Choose a different receipt" : "Photograph or upload the receipt (image or PDF)"}
            </button>

            {(receipt || existingReceiptPath) && (
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
                {receipt && !isPdf(receipt.mime) && (
                  <img src={receipt.preview} alt="Receipt preview" style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(255,255,255,0.14)" }} />
                )}
                {receipt && isPdf(receipt.mime) && (
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>PDF selected</span>
                )}
                {!receipt && existingReceiptPath && (
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                    {pathIsPdf(existingReceiptPath) ? "A PDF is already attached." : "A receipt image is already attached."}
                  </span>
                )}
                {receipt && (
                  <button onClick={readWithAi} disabled={reading} style={{ ...primaryBtn, display: "inline-flex", alignItems: "center", gap: 8, opacity: reading ? 0.7 : 1 }}>
                    {reading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {reading ? "Reading…" : "Read receipt with AI (1 credit)"}
                  </button>
                )}
              </div>
            )}

            <div className="ex-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <div>
                <label style={label} htmlFor="ex-vendor">Vendor</label>
                <input id="ex-vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={label} htmlFor="ex-total">Total</label>
                <input id="ex-total" value={total} onChange={(e) => setTotal(e.target.value)} inputMode="decimal" placeholder="12,50" style={inputStyle} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={label} htmlFor="ex-desc">Description (optional)</label>
                <input id="ex-desc" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <span style={label}>Lines</span>
              {lines.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input
                    value={l.text}
                    onChange={(e) => setLines((prev) => prev.map((p, idx) => (idx === i ? { ...p, text: e.target.value } : p)))}
                    placeholder="Item"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <input
                    value={String(l.amount ?? "")}
                    onChange={(e) => setLines((prev) => prev.map((p, idx) => (idx === i ? { ...p, amount: parseAmount(e.target.value) } : p)))}
                    inputMode="decimal"
                    style={{ ...inputStyle, maxWidth: 120 }}
                  />
                  <button
                    onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))}
                    aria-label="Remove line"
                    style={{ ...ghostBtn, minWidth: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  ><X size={16} /></button>
                </div>
              ))}
              <button onClick={() => setLines((prev) => [...prev, { text: "", amount: 0 }])} style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                <Plus size={15} /> Add line
              </button>
            </div>

            <div style={{ marginTop: 16 }}>
              <input
                ref={photoInput}
                type="file"
                accept="image/*"
                onChange={(e) => { pickFile(e.target.files?.[0], setItemPhoto, false); e.target.value = ""; }}
                style={{ display: "none" }}
              />
              <button onClick={() => photoInput.current?.click()} style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <Camera size={15} /> {itemPhoto ? "Change item photo" : "Attach item photo (optional)"}
              </button>
              {itemPhoto && (
                <img src={itemPhoto.preview} alt="Item preview" style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 10, marginLeft: 12, verticalAlign: "middle", border: "1px solid rgba(255,255,255,0.14)" }} />
              )}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 18 }}>
            <div className="ex-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={label} htmlFor="ex-invno">Invoice #</label>
                <input id="ex-invno" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={label} htmlFor="ex-billto">Bill to</label>
                <input id="ex-billto" value={billTo} onChange={(e) => setBillTo(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <span style={label}>Line items</span>
              {lines.map((l, i) => {
                const lineTotal = round2(Number(l.qty ?? 1) * Number(l.rate ?? 0));
                return (
                  <div key={i} className="ex-invline" style={{ display: "grid", gridTemplateColumns: "1fr 70px 100px 90px 44px", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <input
                      value={l.text}
                      onChange={(e) => setLines((prev) => prev.map((p, idx) => (idx === i ? { ...p, text: e.target.value } : p)))}
                      placeholder="Description"
                      style={inputStyle}
                    />
                    <input
                      value={String(l.qty ?? 1)}
                      onChange={(e) => setLines((prev) => prev.map((p, idx) => (idx === i ? { ...p, qty: parseAmount(e.target.value) || 0, amount: round2((parseAmount(e.target.value) || 0) * Number(p.rate ?? 0)) } : p)))}
                      inputMode="decimal"
                      aria-label="Quantity"
                      style={inputStyle}
                    />
                    <input
                      value={String(l.rate ?? "")}
                      onChange={(e) => setLines((prev) => prev.map((p, idx) => (idx === i ? { ...p, rate: parseAmount(e.target.value), amount: round2(Number(p.qty ?? 1) * parseAmount(e.target.value)) } : p)))}
                      inputMode="decimal"
                      aria-label="Rate"
                      style={inputStyle}
                    />
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", textAlign: "right" }}>{formatMoney(lineTotal, currency)}</div>
                    <button
                      onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))}
                      aria-label="Remove line"
                      style={{ ...ghostBtn, minWidth: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    ><X size={16} /></button>
                  </div>
                );
              })}
              <button onClick={() => setLines((prev) => [...prev, { text: "", amount: 0, qty: 1, rate: 0 }])} style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                <Plus size={15} /> Add line
              </button>
              <div style={{ marginTop: 12, textAlign: "right", fontSize: 16, fontWeight: 700 }}>
                Total {formatMoney(invoiceTotal, currency)}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <label style={label} htmlFor="ex-notes">Notes</label>
          <textarea id="ex-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
        </div>

        {error && (
          <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "rgba(245,84,78,0.12)", border: "1px solid rgba(245,84,78,0.4)", color: "#ffb3b0", fontSize: 14 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={save} disabled={saving} style={{ ...primaryBtn, display: "inline-flex", alignItems: "center", gap: 8, opacity: saving ? 0.7 : 1 }}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {existing ? "Save changes" : "Save expense"}
          </button>
          <button onClick={onClose} style={ghostBtn}>Cancel</button>
          <span style={{ marginLeft: "auto", fontSize: 15, fontWeight: 700 }}>{formatMoney(amount, currency)}</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDialog;
