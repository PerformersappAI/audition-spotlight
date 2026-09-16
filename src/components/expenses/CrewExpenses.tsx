import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, Check, FileText, Loader2, Plus, Sparkles, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { crewCall, type CrewIdentity } from "@/lib/breakdown/adapter";
import { prepareImage, ImageError } from "@/lib/breakdown/imageDownscale";
import { CURRENCIES, formatMoney, parseAmount, round2 } from "@/lib/expenses/currency";
import { EXPENSE_DEPARTMENTS, PAYMENT_METHODS, paymentLabel, statusDef, type ExpenseLine } from "@/lib/expenses/types";
import { MAX_PDF_BYTES, isPdf, fileToBase64, pathIsPdf } from "@/lib/expenses/files";
import { crewExpenseApi, type CrewExpense } from "@/lib/expenses/crew";
import { DEPARTMENTS, type BreakdownItem, type BreakdownScene } from "@/components/breakdown/types";
import FileLightbox from "./FileLightbox";

const TEAL = "#00d4aa";

const panel: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 44,
  fontSize: 16,
  padding: "10px 12px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.14)",
  color: "#fff",
  fontFamily: "'Inter Tight', sans-serif",
  boxSizing: "border-box",
};

const primaryBtn: React.CSSProperties = {
  minHeight: 44,
  padding: "0 20px",
  borderRadius: 10,
  background: TEAL,
  color: "#04231d",
  border: "none",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'Inter Tight', sans-serif",
};

const ghostBtn: React.CSSProperties = {
  minHeight: 44,
  padding: "0 16px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.14)",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'Inter Tight', sans-serif",
};

const label: React.CSSProperties = { fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6, display: "block" };

const today = () => new Date().toISOString().slice(0, 10);
const emailKey = (token: string) => `fg_crew_expense_email_${token}`;

interface Picked {
  blob: Blob;
  mime: string;
  preview: string;
}

interface ItemOption {
  id: string;
  text: string;
}

interface Props {
  token: string;
  identity: CrewIdentity;
  defaultCurrency: string;
  onChangeIdentity: () => void;
}

const CrewExpenses = ({ token, identity, defaultCurrency, onChangeIdentity }: Props) => {
  const api = useMemo(() => crewExpenseApi(token, identity), [token, identity]);

  const startDepartment = EXPENSE_DEPARTMENTS.includes(identity.department as never)
    ? identity.department
    : "Other";

  const [kind, setKind] = useState<"receipt" | "invoice">("receipt");
  const [email, setEmail] = useState(() => localStorage.getItem(emailKey(token)) || "");
  const [department, setDepartment] = useState(startDepartment);
  const [payment, setPayment] = useState("");
  const [currency, setCurrency] = useState(defaultCurrency || "USD");
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [linkedItemId, setLinkedItemId] = useState("");
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState("");
  const [lines, setLines] = useState<ExpenseLine[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [billTo, setBillTo] = useState("");

  const [receipt, setReceipt] = useState<Picked | null>(null);
  const [itemPhoto, setItemPhoto] = useState<Picked | null>(null);
  const [reading, setReading] = useState(false);
  const [aiNote, setAiNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ amount: string; department: string } | null>(null);

  const [items, setItems] = useState<ItemOption[]>([]);
  const [mine, setMine] = useState<CrewExpense[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loadingMine, setLoadingMine] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{ url: string; isPdf: boolean; title: string } | null>(null);

  const receiptInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  useEffect(() => { setCurrency((c) => c || defaultCurrency || "USD"); }, [defaultCurrency]);

  const loadMine = useCallback(async () => {
    try {
      const res = await api.listMine();
      setMine(res.expenses);
      setUrls(res.urls);
    } catch {
      /* keep the last good list */
    } finally {
      setLoadingMine(false);
    }
  }, [api]);

  useEffect(() => { loadMine(); }, [loadMine]);

  // Refresh every 30s while the tab is visible.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadMine();
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [loadMine]);

  // Checklist items, for the optional link.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await crewCall<{ scenes: BreakdownScene[]; items: BreakdownItem[] }>(token, "load");
        if (cancelled) return;
        const sceneName = (id: string) => {
          const s = (data.scenes || []).find((x) => x.id === id);
          if (!s) return "Scene";
          return s.scene_number ? `Scene ${s.scene_number}` : s.label || "Untitled scene";
        };
        const deptName = (key: string) => DEPARTMENTS.find((d) => d.key === key)?.label || key;
        setItems((data.items || []).map((i) => ({
          id: i.id,
          text: `${sceneName(i.scene_id)} · ${deptName(i.department)} · ${i.text}`,
        })));
      } catch { /* the link check already reports dead links */ }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const invoiceTotal = useMemo(
    () => round2(lines.reduce((sum, l) => sum + (Number(l.qty ?? 1) * Number(l.rate ?? 0) || 0), 0)),
    [lines],
  );
  const receiptLinesTotal = useMemo(
    () => round2(lines.reduce((sum, l) => sum + Number(l.amount || 0), 0)),
    [lines],
  );
  const amount = kind === "invoice" ? invoiceTotal : (parseAmount(total) || receiptLinesTotal);

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
    setAiNote("");
    try {
      const base64 = await fileToBase64(receipt.blob);
      const res = await api.readReceipt(base64, receipt.mime);
      if (res?.ai_unavailable) {
        setAiNote("Automatic reading isn't available right now — please type the amount.");
        return;
      }
      if (res.vendor) setVendor(res.vendor);
      if (res.date) setDate(res.date);
      if (res.currency && CURRENCIES.some((c) => c.code === res.currency)) setCurrency(res.currency);
      if (res.total) setTotal(String(res.total));
      setLines(Array.isArray(res.lines) ? res.lines.map((l) => ({ text: l.text || "", amount: Number(l.amount) || 0 })) : []);
      toast.success("Receipt read — check the details before you send it.");
    } catch {
      setAiNote("Automatic reading isn't available right now — please type the amount.");
    } finally {
      setReading(false);
    }
  };

  const resetForm = () => {
    setKind("receipt");
    setPayment("");
    setDate(today());
    setNotes("");
    setLinkedItemId("");
    setVendor("");
    setDescription("");
    setTotal("");
    setLines([]);
    setInvoiceNumber("");
    setBillTo("");
    setReceipt(null);
    setItemPhoto(null);
    setAiNote("");
    setError("");
  };

  const submit = async () => {
    setError("");
    if (!payment) return setError("Pick how this was paid.");
    if (!(amount > 0)) return setError("Enter an amount greater than zero.");
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return setError("That email address doesn't look right.");
    }

    setSaving(true);
    try {
      localStorage.setItem(emailKey(token), email.trim());
      const payload: Record<string, unknown> = {
        kind,
        department,
        vendor: kind === "receipt" ? vendor.trim() : billTo.trim(),
        description: description.trim(),
        expense_date: date || today(),
        currency,
        amount,
        payment_method: payment,
        notes: notes.trim(),
        line_items: lines.filter((l) => l.text || l.amount || l.rate),
        invoice_number: kind === "invoice" ? invoiceNumber.trim() : "",
        bill_to: kind === "invoice" ? billTo.trim() : "",
        linked_item_id: linkedItemId,
        email: email.trim(),
      };
      if (receipt) {
        payload.receipt_base64 = await fileToBase64(receipt.blob);
        payload.receipt_mime = receipt.mime;
      }
      if (itemPhoto) {
        payload.item_photo_base64 = await fileToBase64(itemPhoto.blob);
      }
      await api.submit(payload);
      setDone({ amount: formatMoney(amount, currency), department });
      resetForm();
      loadMine();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "That couldn't be sent. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const removeMine = async (expense: CrewExpense) => {
    setBusyId(expense.id);
    try {
      await api.deleteMine(expense.id);
      setMine((prev) => prev.filter((e) => e.id !== expense.id));
      toast.success("Submission removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove that.");
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  const tabBtn = (value: "receipt" | "invoice", copy: string) => (
    <button
      key={value}
      onClick={() => setKind(value)}
      style={{
        flex: 1, minHeight: 44, borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15,
        border: `1px solid ${kind === value ? TEAL : "rgba(255,255,255,0.14)"}`,
        background: kind === value ? "rgba(0,212,170,0.14)" : "rgba(255,255,255,0.04)",
        color: kind === value ? TEAL : "#fff",
      }}
    >{copy}</button>
  );

  if (done) {
    return (
      <div style={{ ...panel, padding: 36, textAlign: "center" }}>
        <div style={{
          width: 62, height: 62, borderRadius: 9999, margin: "0 auto 18px",
          background: "rgba(62,207,110,0.16)", border: "1px solid rgba(62,207,110,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#3ecf6e",
        }}>
          <Check size={30} />
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>
          Submitted — {done.amount} · {done.department}
        </div>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
          The production office will review it. You can follow the status below.
        </p>
        <button style={{ ...primaryBtn, marginTop: 20 }} onClick={() => setDone(null)}>Submit another</button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 48 }}>
      <div style={{ ...panel, padding: 20 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, margin: 0 }}>
          Submit a receipt or invoice
        </h2>

        <div style={{ display: "flex", gap: 10, margin: "18px 0" }}>
          {tabBtn("receipt", "Receipt")}
          {tabBtn("invoice", "Invoice")}
        </div>

        <div className="ex-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <span style={label}>Submitted by</span>
            <div style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <span style={{ color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {identity.name}
              </span>
              <button
                onClick={onChangeIdentity}
                style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", fontSize: 14, textDecoration: "underline", padding: "4px 0" }}
              >change</button>
            </div>
          </div>
          <div>
            <label style={label} htmlFor="cx-email">Email (optional)</label>
            <input id="cx-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>We'll email you a confirmation.</div>
          </div>
          <div>
            <label style={label} htmlFor="cx-dept">Department</label>
            <select id="cx-dept" value={department} onChange={(e) => setDepartment(e.target.value)} style={inputStyle}>
              {EXPENSE_DEPARTMENTS.map((d) => <option key={d} value={d} style={{ background: "#10101b" }}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={label} htmlFor="cx-currency">Currency</label>
            <select id="cx-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} style={inputStyle}>
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
            <label style={label} htmlFor="cx-date">Date</label>
            <input id="cx-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={label} htmlFor="cx-link">Link to a checklist item (optional)</label>
            <select id="cx-link" value={linkedItemId} onChange={(e) => setLinkedItemId(e.target.value)} style={inputStyle}>
              <option value="" style={{ background: "#10101b" }}>Not linked</option>
              {items.map((o) => (
                <option key={o.id} value={o.id} style={{ background: "#10101b" }}>{o.text}</option>
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
              capture="environment"
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

            {receipt && (
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
                {isPdf(receipt.mime) ? (
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>PDF selected</span>
                ) : (
                  <img src={receipt.preview} alt="Receipt preview" style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(255,255,255,0.14)" }} />
                )}
                <button onClick={readWithAi} disabled={reading} style={{ ...primaryBtn, display: "inline-flex", alignItems: "center", gap: 8, opacity: reading ? 0.7 : 1 }}>
                  {reading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {reading ? "Reading…" : "Read receipt with AI"}
                </button>
              </div>
            )}

            {aiNote && (
              <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(245,165,36,0.12)", border: "1px solid rgba(245,165,36,0.4)", color: "#ffd79a", fontSize: 14 }}>
                {aiNote}
              </div>
            )}

            <div className="ex-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <div>
                <label style={label} htmlFor="cx-vendor">Vendor</label>
                <input id="cx-vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={label} htmlFor="cx-total">Total</label>
                <input id="cx-total" value={total} onChange={(e) => setTotal(e.target.value)} inputMode="decimal" placeholder="12.50" style={inputStyle} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={label} htmlFor="cx-desc">Description (optional)</label>
                <input id="cx-desc" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
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
                    aria-label="Line amount"
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
                capture="environment"
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
                <label style={label} htmlFor="cx-invno">Invoice # (optional)</label>
                <input id="cx-invno" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="We'll number it for you" style={inputStyle} />
              </div>
              <div>
                <label style={label} htmlFor="cx-billto">Bill to</label>
                <input id="cx-billto" value={billTo} onChange={(e) => setBillTo(e.target.value)} style={inputStyle} />
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
          <label style={label} htmlFor="cx-notes">Notes</label>
          <textarea id="cx-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
        </div>

        {error && (
          <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "rgba(245,84,78,0.12)", border: "1px solid rgba(245,84,78,0.4)", color: "#ffb3b0", fontSize: 14 }}>
            {error}
          </div>
        )}

        <div className="sb-row" style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={submit} disabled={saving} style={{ ...primaryBtn, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: saving ? 0.7 : 1 }}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Sending…" : "Submit"}
          </button>
          <span style={{ marginLeft: "auto", fontSize: 15, fontWeight: 700 }}>{formatMoney(amount, currency)}</span>
        </div>
      </div>

      {/* MY SUBMISSIONS */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, margin: "0 0 14px" }}>My submissions</h3>
        {loadingMine ? (
          <div style={{ ...panel, padding: 20, display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)" }}>
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : mine.length === 0 ? (
          <div style={{ ...panel, padding: 24, textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 15 }}>
            You haven't submitted anything yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mine.map((e) => {
              const def = statusDef(e.status);
              const path = e.receipt_path || e.item_photo_path;
              const url = path ? urls[path] : undefined;
              return (
                <div key={e.id} style={{ ...panel, padding: 14, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  {path && url && (pathIsPdf(path) ? (
                    <button
                      onClick={() => setViewer({ url, isPdf: true, title: "Receipt" })}
                      style={{ ...ghostBtn, minWidth: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                      aria-label="Open PDF"
                    ><FileText size={18} /></button>
                  ) : (
                    <button
                      onClick={() => setViewer({ url, isPdf: false, title: "Receipt" })}
                      aria-label="Open photo"
                      style={{ padding: 0, border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, background: "none", cursor: "pointer", lineHeight: 0, flex: "0 0 auto" }}
                    >
                      <img src={url} alt="Receipt" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 9 }} />
                    </button>
                  ))}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 16, fontWeight: 700 }}>{formatMoney(e.amount, e.currency)}</span>
                      <span style={{
                        display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 9999,
                        background: def.tint, color: def.color, fontSize: 12, fontWeight: 700,
                      }}>{def.label}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 5 }}>
                      {e.expense_date} · {e.department} · {e.kind === "invoice" ? `Invoice ${e.invoice_number || ""}`.trim() : "Receipt"} · {paymentLabel(e.payment_method)}
                    </div>
                    {e.status === "rejected" && e.status_note && (
                      <div style={{ fontSize: 13, color: "#ffb3b0", marginTop: 6 }}>Reason: {e.status_note}</div>
                    )}
                    {e.status === "pending" && (
                      confirmId === e.id ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 10 }}>
                          Remove this?
                          <button onClick={() => removeMine(e)} disabled={busyId === e.id} style={{ ...ghostBtn, borderColor: "rgba(245,84,78,0.5)", color: "#f5544e", fontSize: 14 }}>Yes</button>
                          <button onClick={() => setConfirmId(null)} style={{ ...ghostBtn, fontSize: 14 }}>No</button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmId(e.id)}
                          style={{ ...ghostBtn, fontSize: 14, marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6 }}
                        ><Trash2 size={14} /> Delete</button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {viewer && (
        <FileLightbox url={viewer.url} isPdf={viewer.isPdf} title={viewer.title} onClose={() => setViewer(null)} />
      )}
    </div>
  );
};

export default CrewExpenses;
