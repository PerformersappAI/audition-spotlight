import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Loader2, Pencil, Trash2 } from "lucide-react";
import { panel, ghostBtn, inputStyle } from "@/components/production/ProductionPicker";
import { formatMoney } from "@/lib/expenses/currency";
import { paymentLabel, statusDef, type Expense } from "@/lib/expenses/types";
import { pathIsPdf } from "@/lib/expenses/files";

export interface LinkedItemInfo {
  scene: string;
  department: string;
  text: string;
}

interface Props {
  expenses: Expense[];
  signedUrls: Record<string, string>;
  linkedItems: Record<string, LinkedItemInfo>;
  busyId: string | null;
  onSetStatus: (expense: Expense, status: string, note?: string | null) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onOpenFile: (url: string, isPdf: boolean, title: string) => void;
}

const shortDate = (value: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
};

const StatusBadge = ({ status }: { status: string }) => {
  const def = statusDef(status);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 9999,
      background: def.tint, color: def.color, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
    }}>{def.label}</span>
  );
};

const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 12px", fontSize: 12, letterSpacing: "0.05em",
  textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 600, whiteSpace: "nowrap",
};
const td: React.CSSProperties = { padding: "12px", fontSize: 14, verticalAlign: "top", color: "rgba(255,255,255,0.85)" };

const Thumb = ({ path, url, label, onOpen }: { path: string; url?: string; label: string; onOpen: (url: string, isPdf: boolean, title: string) => void }) => {
  const isPdf = pathIsPdf(path);
  if (!url) {
    return <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "inline-flex", alignItems: "center", gap: 6 }}><Loader2 size={13} className="animate-spin" /> {label}</div>;
  }
  if (isPdf) {
    return (
      <button onClick={() => onOpen(url, true, label)} style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13 }}>
        <FileText size={15} /> Open PDF
      </button>
    );
  }
  return (
    <button
      onClick={() => onOpen(url, false, label)}
      aria-label={`Open ${label}`}
      style={{ padding: 0, border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, background: "none", cursor: "pointer", lineHeight: 0 }}
    >
      <img src={url} alt={label} style={{ width: 92, height: 92, objectFit: "cover", borderRadius: 9 }} />
    </button>
  );
};

const ExpenseList = ({ expenses, signedUrls, linkedItems, busyId, onSetStatus, onEdit, onDelete, onOpenFile }: Props) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const actions = (e: Expense) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
      {e.status !== "approved" && e.status !== "paid" && (
        <button onClick={() => onSetStatus(e, "approved", null)} disabled={busyId === e.id}
          style={{ ...ghostBtn, borderColor: "rgba(62,207,110,0.5)", color: "#3ecf6e", fontSize: 14 }}>Approve</button>
      )}
      {e.status !== "rejected" && (
        <button onClick={() => { setRejectId(e.id); setRejectNote(""); }} disabled={busyId === e.id}
          style={{ ...ghostBtn, borderColor: "rgba(245,84,78,0.5)", color: "#f5544e", fontSize: 14 }}>Reject</button>
      )}
      {e.status === "approved" && (
        <button onClick={() => onSetStatus(e, "paid", e.status_note)} disabled={busyId === e.id}
          style={{ ...ghostBtn, borderColor: "rgba(0,212,170,0.5)", color: "#00d4aa", fontSize: 14 }}>Mark paid</button>
      )}
      {e.status !== "pending" && (
        <button onClick={() => onSetStatus(e, "pending", null)} disabled={busyId === e.id} style={{ ...ghostBtn, fontSize: 14 }}>Back to pending</button>
      )}
      <button onClick={() => onEdit(e)} style={{ ...ghostBtn, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
        <Pencil size={14} /> Edit
      </button>
      {confirmDeleteId === e.id ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
          Delete this?
          <button onClick={() => { setConfirmDeleteId(null); onDelete(e); }} style={{ ...ghostBtn, borderColor: "rgba(245,84,78,0.5)", color: "#f5544e", fontSize: 14 }}>Yes</button>
          <button onClick={() => setConfirmDeleteId(null)} style={{ ...ghostBtn, fontSize: 14 }}>No</button>
        </span>
      ) : (
        <button onClick={() => setConfirmDeleteId(e.id)} style={{ ...ghostBtn, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Trash2 size={14} /> Delete
        </button>
      )}
      {busyId === e.id && <Loader2 size={16} className="animate-spin" style={{ alignSelf: "center", color: "rgba(255,255,255,0.5)" }} />}
    </div>
  );

  const details = (e: Expense) => {
    const linked = e.linked_item_id ? linkedItems[e.linked_item_id] : undefined;
    return (
      <div style={{ padding: "4px 12px 18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {e.line_items.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Line items</div>
            {e.line_items.map((l, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  {l.text || "—"}
                  {l.qty !== undefined && l.rate !== undefined && (
                    <span style={{ color: "rgba(255,255,255,0.4)" }}> · {l.qty} × {formatMoney(l.rate, e.currency)}</span>
                  )}
                </span>
                <span style={{ whiteSpace: "nowrap" }}>{formatMoney(l.amount, e.currency)}</span>
              </div>
            ))}
          </div>
        )}

        {(e.receipt_path || e.item_photo_path) && (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
            {e.receipt_path && (
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Receipt</div>
                <Thumb path={e.receipt_path} url={signedUrls[e.receipt_path]} label="Receipt" onOpen={onOpenFile} />
              </div>
            )}
            {e.item_photo_path && (
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Item photo</div>
                <Thumb path={e.item_photo_path} url={signedUrls[e.item_photo_path]} label="Item photo" onOpen={onOpenFile} />
              </div>
            )}
          </div>
        )}

        {e.notes && (
          <div style={{ marginTop: 16, fontSize: 14, color: "rgba(255,255,255,0.7)", whiteSpace: "pre-wrap" }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Notes: </span>{e.notes}
          </div>
        )}

        {e.status_note && (
          <div style={{ marginTop: 12, fontSize: 14, color: statusDef(e.status).color }}>
            {statusDef(e.status).label}: {e.status_note}
            {e.decided_by_name && (
              <span style={{ color: "rgba(255,255,255,0.4)" }}> — {e.decided_by_name}{e.decided_at ? ` · ${shortDate(e.decided_at)}` : ""}</span>
            )}
          </div>
        )}
        {!e.status_note && e.decided_by_name && (
          <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            {statusDef(e.status).label} by {e.decided_by_name}{e.decided_at ? ` · ${shortDate(e.decided_at)}` : ""}
          </div>
        )}

        {linked && (
          <div style={{ marginTop: 14, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Breakdown item: </span>
            {linked.scene} · {linked.department} · {linked.text}
          </div>
        )}

        {rejectId === e.id ? (
          <div style={{ marginTop: 14 }}>
            <input
              autoFocus
              value={rejectNote}
              onChange={(ev) => setRejectNote(ev.target.value)}
              placeholder="Why is this rejected?"
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                disabled={!rejectNote.trim()}
                onClick={() => { onSetStatus(e, "rejected", rejectNote.trim()); setRejectId(null); }}
                style={{ ...ghostBtn, borderColor: "rgba(245,84,78,0.5)", color: "#f5544e", opacity: rejectNote.trim() ? 1 : 0.5 }}
              >Save rejection</button>
              <button onClick={() => setRejectId(null)} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        ) : actions(e)}
      </div>
    );
  };

  if (!expenses.length) {
    return (
      <div style={{ ...panel, padding: 32, textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 15 }}>
        Nothing here yet. Add your first receipt or invoice.
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="ex-table" style={{ ...panel, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              <th style={{ ...th, width: 34 }} aria-label="Expand" />
              <th style={th}>Date</th>
              <th style={th}>Submitted by</th>
              <th style={th}>Department</th>
              <th style={th}>Type</th>
              <th style={th}>Vendor / Description</th>
              <th style={{ ...th, textAlign: "right" }}>Amount</th>
              <th style={th}>Payment</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <>
                <tr
                  key={e.id}
                  onClick={() => toggle(e.id)}
                  style={{ cursor: "pointer", borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <td style={{ ...td, color: "rgba(255,255,255,0.4)" }}>
                    {openId === e.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </td>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>{shortDate(e.expense_date)}</td>
                  <td style={td}>{e.submitted_by_name}</td>
                  <td style={td}>{e.department}</td>
                  <td style={td}>{e.kind === "invoice" ? `Invoice ${e.invoice_number || ""}`.trim() : "Receipt"}</td>
                  <td style={td}>{e.vendor || e.description || "—"}</td>
                  <td style={{ ...td, textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" }}>{formatMoney(Number(e.amount), e.currency)}</td>
                  <td style={td}>{paymentLabel(e.payment_method)}</td>
                  <td style={td}><StatusBadge status={e.status} /></td>
                </tr>
                {openId === e.id && (
                  <tr key={`${e.id}-details`}>
                    <td colSpan={9} style={{ padding: 0, background: "rgba(255,255,255,0.02)" }}>{details(e)}</td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="ex-cards-list" style={{ display: "none", flexDirection: "column", gap: 12 }}>
        {expenses.map((e) => (
          <div key={e.id} style={{ ...panel, overflow: "hidden" }}>
            <button
              onClick={() => toggle(e.id)}
              style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: "#fff", padding: 16, cursor: "pointer", minHeight: 44 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, wordBreak: "break-word" }}>{e.vendor || e.description || "—"}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                    {shortDate(e.expense_date)} · {e.department} · {e.kind === "invoice" ? `Invoice ${e.invoice_number || ""}`.trim() : "Receipt"}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                    {e.submitted_by_name} · {paymentLabel(e.payment_method)}
                  </div>
                </div>
                <div style={{ textAlign: "right", flex: "0 0 auto" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, whiteSpace: "nowrap" }}>{formatMoney(Number(e.amount), e.currency)}</div>
                  <div style={{ marginTop: 6 }}><StatusBadge status={e.status} /></div>
                </div>
              </div>
            </button>
            {openId === e.id && details(e)}
          </div>
        ))}
      </div>
    </>
  );
};

export default ExpenseList;
