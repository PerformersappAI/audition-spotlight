import { useState } from "react";
import { timeAgo } from "./timeAgo";
import { BreakdownSignoff, TEAL } from "./types";

interface Props {
  signoff: BreakdownSignoff | null;
  onSetStatus: (status: "good" | "need_help", note?: string) => void;
  onClear: () => void;
  onAddNoteItem: (text: string) => void;
}

const SignOffBox = ({ signoff, onSetStatus, onClear, onAddNoteItem }: Props) => {
  const [note, setNote] = useState("");

  const btn = (active: boolean, accent: string): React.CSSProperties => ({
    minHeight: 44,
    padding: "0 18px",
    borderRadius: 10,
    background: active ? accent : "rgba(255,255,255,0.05)",
    color: active ? "#0a0a12" : "#fff",
    border: `1px solid ${active ? accent : "rgba(255,255,255,0.14)"}`,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "'Inter Tight', sans-serif",
  });

  const press = (status: "good" | "need_help") => {
    if (signoff?.status === status) onClear();
    else onSetStatus(status, status === "need_help" ? note.trim() || undefined : undefined);
  };

  return (
    <div
      style={{
        marginTop: 28,
        padding: 18,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700 }}>Department ready?</div>

      <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
        <button onClick={() => press("good")} style={btn(signoff?.status === "good", TEAL)}>✅ We're good</button>
        <button onClick={() => press("need_help")} style={btn(signoff?.status === "need_help", "#f5a524")}>⚠️ Need help</button>
      </div>

      {signoff && (
        <div style={{ marginTop: 12, fontSize: 13, color: signoff.status === "good" ? TEAL : "#f5a524" }}>
          {signoff.status === "good" ? "✅ Ready" : "⚠️ Needs help"} — {signoff.by_name || "Someone"}
          {signoff.updated_at ? ` · ${timeAgo(signoff.updated_at)}` : ""}
          {signoff.note && (
            <div style={{ color: "rgba(255,255,255,0.6)", marginTop: 6, lineHeight: 1.5 }}>{signoff.note}</div>
          )}
        </div>
      )}

      <label style={{ display: "block", marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
        Notes / additional needs
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Need a second bloody shirt for the stunt double"
        style={{
          width: "100%",
          minHeight: 90,
          fontSize: 16,
          padding: "10px 12px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.16)",
          color: "#fff",
          fontFamily: "'Inter Tight', sans-serif",
          boxSizing: "border-box",
          resize: "vertical",
        }}
      />
      <button
        onClick={() => {
          const text = note.trim();
          if (!text) return;
          onAddNoteItem(text);
          setNote("");
        }}
        disabled={!note.trim()}
        style={{
          marginTop: 12,
          minHeight: 44,
          padding: "0 18px",
          borderRadius: 10,
          background: "rgba(0,212,170,0.12)",
          border: "1px solid rgba(0,212,170,0.4)",
          color: TEAL,
          fontWeight: 700,
          fontSize: 15,
          cursor: note.trim() ? "pointer" : "not-allowed",
          opacity: note.trim() ? 1 : 0.45,
          fontFamily: "'Inter Tight', sans-serif",
        }}
      >
        Add to list
      </button>
    </div>
  );
};

export default SignOffBox;
