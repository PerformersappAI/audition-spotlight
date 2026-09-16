import { useState } from "react";
import { Check } from "lucide-react";
import { BreakdownPhoto, TEAL } from "./types";

export interface ApprovalRow {
  photo: BreakdownPhoto;
  sceneTitle: string;
  departmentLabel: string;
  itemText: string;
}

interface Props {
  rows: ApprovalRow[];
  signedUrl: (photo: BreakdownPhoto) => string | undefined;
  onApprove: (photo: BreakdownPhoto) => void;
  onRequestChanges: (photo: BreakdownPhoto, feedback: string) => void;
  onOpen: (photo: BreakdownPhoto) => void;
}

const btn = (accent?: string): React.CSSProperties => ({
  minHeight: 44,
  padding: "0 14px",
  borderRadius: 10,
  background: accent || "rgba(255,255,255,0.06)",
  color: accent ? "#04231d" : "#fff",
  border: accent ? "none" : "1px solid rgba(255,255,255,0.16)",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "'Inter Tight', sans-serif",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
});

const ApprovalsView = ({ rows, signedUrl, onApprove, onRequestChanges, onOpen }: Props) => {
  const [askId, setAskId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  if (!rows.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 15 }}>
        Nothing waiting for approval.
      </div>
    );
  }

  const groups = new Map<string, ApprovalRow[]>();
  rows.forEach((r) => {
    const key = `${r.sceneTitle} › ${r.departmentLabel} › ${r.itemText}`;
    const list = groups.get(key) || [];
    list.push(r);
    groups.set(key, list);
  });

  return (
    <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 18 }}>
      {[...groups.entries()].map(([key, group]) => (
        <div key={key} style={{ padding: 14, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10, wordBreak: "break-word" }}>{key}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {group.map(({ photo }) => {
              const url = signedUrl(photo);
              return (
                <div key={photo.id} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    onClick={() => onOpen(photo)}
                    aria-label="Open photo"
                    style={{ width: 72, height: 72, padding: 0, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)", cursor: "pointer", flex: "0 0 auto" }}
                  >
                    {url ? <img src={url} alt="Awaiting photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                  </button>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => onApprove(photo)} style={btn(TEAL)}><Check size={15} /> Approve</button>
                    <button onClick={() => { setAskId(askId === photo.id ? null : photo.id); setFeedback(""); }} style={btn()}>Request changes</button>
                  </div>
                  {askId === photo.id && (
                    <div style={{ width: "100%" }}>
                      <textarea
                        autoFocus
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="What should change?"
                        style={{
                          width: "100%", minHeight: 80, fontSize: 16, padding: "10px 12px", borderRadius: 10,
                          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.16)",
                          color: "#fff", fontFamily: "'Inter Tight', sans-serif", boxSizing: "border-box", resize: "vertical",
                        }}
                      />
                      <button
                        onClick={() => { if (feedback.trim()) { onRequestChanges(photo, feedback.trim()); setAskId(null); setFeedback(""); } }}
                        disabled={!feedback.trim()}
                        style={{ ...btn("#f5a524"), marginTop: 8, opacity: feedback.trim() ? 1 : 0.45 }}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApprovalsView;
