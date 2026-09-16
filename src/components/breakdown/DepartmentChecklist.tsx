import { useRef, useState } from "react";
import { Camera, Check, Loader2, MapPin, Pencil, Plus, Trash2, X, AlertTriangle } from "lucide-react";
import { timeAgo } from "./timeAgo";
import ItemPhotos from "./ItemPhotos";
import { BreakdownItem, BreakdownPhoto, TEAL } from "./types";

interface Props {
  items: BreakdownItem[];
  department: string;
  onToggle: (item: BreakdownItem) => void;
  onEditText: (item: BreakdownItem, text: string) => void;
  onDelete: (item: BreakdownItem) => void;
  onAdd: (text: string) => void;
  photosByItem?: Record<string, BreakdownPhoto[]>;
  signedUrl?: (photo: BreakdownPhoto) => string | undefined;
  onAddPhotos?: (item: BreakdownItem, files: File[]) => void;
  onOpenPhoto?: (photo: BreakdownPhoto) => void;
  uploadingItemId?: string | null;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 44,
  fontSize: 16,
  padding: "10px 12px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#fff",
  fontFamily: "'Inter Tight', sans-serif",
  boxSizing: "border-box",
};

const iconBtn: React.CSSProperties = {
  minWidth: 44,
  minHeight: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.45)",
  cursor: "pointer",
  padding: 0,
  flex: "0 0 auto",
};

const DepartmentChecklist = ({
  items, department, onToggle, onEditText, onDelete, onAdd,
  photosByItem, signedUrl, onAddPhotos, onOpenPhoto, uploadingItemId,
}: Props) => {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const pendingItemRef = useRef<BreakdownItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addValue, setAddValue] = useState("");

  const startEdit = (item: BreakdownItem) => {
    setEditingId(item.id);
    setEditValue(item.text);
  };

  const commitEdit = (item: BreakdownItem) => {
    const next = editValue.trim();
    setEditingId(null);
    if (next && next !== item.text) onEditText(item, next);
  };

  const commitAdd = () => {
    const next = addValue.trim();
    setAddValue("");
    setAdding(false);
    if (next) onAdd(next);
  };

  return (
    <div style={{ marginTop: 20 }}>
      {items.length === 0 && !adding && (
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, paddingBottom: 8 }}>
          Nothing found for this department.
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item) => {
          const edited = !!item.original_text && item.original_text !== item.text;
          return (
            <li
              key={item.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "8px 6px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                borderLeft: item.flagged ? "3px solid #f5a524" : "3px solid transparent",
                background: item.checked ? "rgba(0,212,170,0.07)" : "transparent",
                borderRadius: 8,
              }}
            >
              <button
                onClick={() => onToggle(item)}
                aria-label={item.checked ? `Uncheck ${item.text}` : `Check off ${item.text}`}
                style={{ ...iconBtn, color: item.checked ? TEAL : "rgba(255,255,255,0.45)" }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 9999,
                    border: `2px solid ${item.checked ? TEAL : "rgba(255,255,255,0.3)"}`,
                    background: item.checked ? "rgba(0,212,170,0.18)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.checked && <Check size={14} />}
                </span>
              </button>

              <div style={{ flex: 1, minWidth: 0, paddingTop: 10 }}>
                {editingId === item.id ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit(item);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      style={inputStyle}
                    />
                    <button aria-label="Save item" onClick={() => commitEdit(item)} style={{ ...iconBtn, color: TEAL }}>
                      <Check size={18} />
                    </button>
                    <button aria-label="Cancel edit" onClick={() => setEditingId(null)} style={iconBtn}>
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 15, lineHeight: 1.5, color: "rgba(255,255,255,0.9)", wordBreak: "break-word" }}>
                      {item.flagged && (
                        <AlertTriangle size={14} style={{ color: "#f5a524", marginRight: 6, verticalAlign: "-2px" }} />
                      )}
                      {item.text}
                      {edited && (
                        <button
                          onClick={() => setShowOriginal((v) => (v === item.id ? null : item.id))}
                          style={{
                            marginLeft: 8,
                            fontSize: 11,
                            padding: "2px 6px",
                            borderRadius: 6,
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.14)",
                            color: "rgba(255,255,255,0.6)",
                            cursor: "pointer",
                          }}
                        >
                          edited
                        </button>
                      )}
                    </div>
                    {showOriginal === item.id && (
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                        AI original: {item.original_text}
                      </div>
                    )}
                    {item.checked && (
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                        ✓ {item.checked_by_name || "Someone"}
                        {item.checked_at ? ` · ${timeAgo(item.checked_at)}` : ""}
                      </div>
                    )}
                  </>
                )}
              </div>

              {editingId !== item.id && (
                <div style={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
                  {department === "locations" && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.text)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Find ${item.text} on Google Maps`}
                      style={{ ...iconBtn, color: TEAL, textDecoration: "none" }}
                    >
                      <MapPin size={17} />
                    </a>
                  )}
                  <button aria-label={`Edit ${item.text}`} onClick={() => startEdit(item)} style={iconBtn}>
                    <Pencil size={15} />
                  </button>
                  {confirmId === item.id ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                      Remove?
                      <button
                        onClick={() => { setConfirmId(null); onDelete(item); }}
                        style={{ ...iconBtn, minWidth: 34, color: "#ff8080", fontWeight: 700, fontSize: 13 }}
                      >
                        Yes
                      </button>
                      <button onClick={() => setConfirmId(null)} style={{ ...iconBtn, minWidth: 34, fontSize: 13 }}>
                        No
                      </button>
                    </span>
                  ) : (
                    <button aria-label={`Remove ${item.text}`} onClick={() => setConfirmId(item.id)} style={iconBtn}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {adding ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <input
            autoFocus
            value={addValue}
            onChange={(e) => setAddValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitAdd();
              if (e.key === "Escape") { setAdding(false); setAddValue(""); }
            }}
            placeholder="New item…"
            style={inputStyle}
          />
          <button aria-label="Save new item" onClick={commitAdd} style={{ ...iconBtn, color: TEAL }}>
            <Check size={18} />
          </button>
          <button aria-label="Cancel new item" onClick={() => { setAdding(false); setAddValue(""); }} style={iconBtn}>
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{
            marginTop: 14,
            minHeight: 44,
            padding: "0 16px",
            borderRadius: 10,
            background: "rgba(0,212,170,0.08)",
            border: "1px dashed rgba(0,212,170,0.4)",
            color: TEAL,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'Inter Tight', sans-serif",
          }}
        >
          <Plus size={16} /> Add item
        </button>
      )}
    </div>
  );
};

export default DepartmentChecklist;
