import { BreakdownPhoto, TEAL } from "./types";

interface Props {
  photos: BreakdownPhoto[];
  signedUrl: (photo: BreakdownPhoto) => string | undefined;
  onOpen: (photo: BreakdownPhoto) => void;
}

export const statusBadge = (photo: BreakdownPhoto) => {
  if (photo.is_reference) return { label: "REF", color: "#8ab4ff" };
  if (photo.status === "approved") return { label: "✅", color: TEAL };
  if (photo.status === "rejected") return { label: "✕", color: "#ff8080" };
  return { label: "⏳", color: "#f5a524" };
};

const ItemPhotos = ({ photos, signedUrl, onOpen }: Props) => {
  if (!photos.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
      {photos.map((p) => {
        const url = signedUrl(p);
        const badge = statusBadge(p);
        return (
          <button
            key={p.id}
            onClick={() => onOpen(p)}
            aria-label="Open photo"
            style={{
              position: "relative",
              width: 64,
              height: 64,
              padding: 0,
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.05)",
              cursor: "pointer",
              flex: "0 0 auto",
            }}
          >
            {url ? (
              <img src={url} alt="Item photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>…</span>
            )}
            <span
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                fontSize: 9,
                fontWeight: 700,
                padding: "1px 4px",
                borderRadius: 5,
                background: "rgba(0,0,0,0.7)",
                color: badge.color,
              }}
            >
              {badge.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ItemPhotos;
