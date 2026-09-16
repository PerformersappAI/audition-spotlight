import { X } from "lucide-react";

interface Props {
  url: string;
  isPdf?: boolean;
  title?: string;
  onClose: () => void;
}

const FileLightbox = ({ url, isPdf, title, onClose }: Props) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column", padding: 12,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingBottom: 10 }}>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {title || "Attachment"}
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          minWidth: 44, minHeight: 44, borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.06)", color: "#fff", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", flex: "0 0 auto",
        }}
      >
        <X size={18} />
      </button>
    </div>
    <div onClick={(e) => e.stopPropagation()} style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {isPdf ? (
        <iframe title={title || "PDF"} src={url} style={{ width: "100%", height: "100%", border: "none", borderRadius: 10, background: "#fff" }} />
      ) : (
        <img src={url} alt={title || "Attachment"} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 10 }} />
      )}
    </div>
  </div>
);

export default FileLightbox;
