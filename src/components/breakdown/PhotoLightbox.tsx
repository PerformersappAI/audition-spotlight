import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, RefreshCw, Trash2, X } from "lucide-react";
import { timeAgo } from "./timeAgo";
import { BreakdownPhoto, TEAL } from "./types";

interface Props {
  photos: BreakdownPhoto[];
  index: number;
  signedUrl: (photo: BreakdownPhoto) => string | undefined;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  onApprove: (photo: BreakdownPhoto) => void;
  onRequestChanges: (photo: BreakdownPhoto, feedback: string) => void;
  onReplace: (photo: BreakdownPhoto, file: File) => void;
  onDelete: (photo: BreakdownPhoto) => void;
}

const btn = (accent?: string): React.CSSProperties => ({
  minHeight: 44,
  padding: "0 16px",
  borderRadius: 10,
  background: accent || "rgba(255,255,255,0.08)",
  color: accent ? "#04231d" : "#fff",
  border: accent ? "none" : "1px solid rgba(255,255,255,0.18)",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'Inter Tight', sans-serif",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
});

const PhotoLightbox = ({
  photos, index, signedUrl, onIndexChange, onClose,
  onApprove, onRequestChanges, onReplace, onDelete,
}: Props) => {
  const photo = photos[index];
  const [askChanges, setAskChanges] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const replaceRef = useRef<HTMLInputElement | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    setAskChanges(false);
    setFeedback("");
    setConfirmDelete(false);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index < photos.length - 1) onIndexChange(index + 1);
      if (e.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onClose, onIndexChange]);

  if (!photo) return null;
  const url = signedUrl(photo);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.92)",
        display: "flex", flexDirection: "column", padding: 16, gap: 12, overflowY: "auto",
      }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx < -50 && index < photos.length - 1) onIndexChange(index + 1);
        if (dx > 50 && index > 0) onIndexChange(index - 1);
        touchX.current = null;
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          {index + 1} / {photos.length}
          {photo.is_reference ? " · Reference" : ""}
        </span>
        <button onClick={onClose} aria-label="Close photo" style={btn()}><X size={18} /></button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", flex: 1, minHeight: 240 }}>
        <button
          aria-label="Previous photo"
          onClick={() => index > 0 && onIndexChange(index - 1)}
          style={{ ...btn(), opacity: index > 0 ? 1 : 0.25, minWidth: 44, padding: 0, justifyContent: "center" }}
        >
          <ChevronLeft size={20} />
        </button>
        {url ? (
          <img src={url} alt="Photo" style={{ maxWidth: "100%", maxHeight: "62vh", borderRadius: 12, objectFit: "contain" }} />
        ) : (
          <div style={{ color: "rgba(255,255,255,0.5)" }}>Loading photo…</div>
        )}
        <button
          aria-label="Next photo"
          onClick={() => index < photos.length - 1 && onIndexChange(index + 1)}
          style={{ ...btn(), opacity: index < photos.length - 1 ? 1 : 0.25, minWidth: 44, padding: 0, justifyContent: "center" }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div style={{ maxWidth: 640, width: "100%", margin: "0 auto", color: "#fff" }}>
        {!photo.is_reference && (
          <>
            <div style={{ fontSize: 13, marginBottom: 12, color: photo.status === "approved" ? TEAL : photo.status === "rejected" ? "#ff9d9d" : "#f5a524" }}>
              {photo.status === "approved" && `✅ Approved — ${photo.decided_by_name || "Someone"}${photo.decided_at ? ` · ${timeAgo(photo.decided_at)}` : ""}`}
              {photo.status === "rejected" && `✕ Changes needed — ${photo.decided_by_name || "Someone"}${photo.decided_at ? ` · ${timeAgo(photo.decided_at)}` : ""}`}
              {photo.status === "awaiting" && "⏳ Awaiting approval"}
              {photo.feedback && (
                <div style={{ color: "rgba(255,255,255,0.7)", marginTop: 6, lineHeight: 1.5 }}>{photo.feedback}</div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => onApprove(photo)} style={btn(TEAL)}><Check size={16} /> Approve</button>
              <button onClick={() => setAskChanges((v) => !v)} style={btn()}>Request changes</button>
            </div>

            {askChanges && (
              <div style={{ marginTop: 12 }}>
                <textarea
                  autoFocus
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What should change?"
                  style={{
                    width: "100%", minHeight: 90, fontSize: 16, padding: "10px 12px", borderRadius: 10,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)",
                    color: "#fff", fontFamily: "'Inter Tight', sans-serif", boxSizing: "border-box", resize: "vertical",
                  }}
                />
                <button
                  onClick={() => { if (feedback.trim()) { onRequestChanges(photo, feedback.trim()); setAskChanges(false); } }}
                  disabled={!feedback.trim()}
                  style={{ ...btn("#f5a524"), marginTop: 10, opacity: feedback.trim() ? 1 : 0.45 }}
                >
                  Save
                </button>
              </div>
            )}
          </>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          {!photo.is_reference && (
            <button onClick={() => replaceRef.current?.click()} style={btn()}><RefreshCw size={16} /> Replace photo</button>
          )}
          {confirmDelete ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              Delete this photo?
              <button onClick={() => onDelete(photo)} style={{ ...btn("#ff5c5c"), color: "#2a0505" }}>Yes</button>
              <button onClick={() => setConfirmDelete(false)} style={btn()}>No</button>
            </span>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={btn()}><Trash2 size={16} /> Delete photo</button>
          )}
        </div>
        <input
          ref={replaceRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onReplace(photo, f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
};

export default PhotoLightbox;
