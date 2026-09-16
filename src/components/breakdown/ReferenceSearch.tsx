import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { ImageResult, searchReferenceImages } from "@/lib/breakdown/imageSearch";
import { BreakdownItem, TEAL } from "./types";

interface Props {
  items: BreakdownItem[];
  onAttach: (itemId: string, url: string) => void;
}

const ReferenceSearch = ({ items, onAttach }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<ImageResult[]>([]);
  const [picking, setPicking] = useState<ImageResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = async () => {
    const q = query.trim();
    if (!q) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const found = await searchReferenceImages(q, controller.signal);
      if (controller.signal.aborted) return;
      setResults(found);
      if (!found.length) setError("No reference images found. Try different words.");
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setError("Image search isn't responding right now. Please try again.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 18, borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", minHeight: 48, display: "flex", alignItems: "center", gap: 8,
          padding: "0 16px", background: "none", border: "none", color: TEAL,
          fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}
      >
        <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        Find reference image
      </button>

      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") run(); }}
              placeholder="e.g. 1968 Mustang, 9mm pistol, vintage lighter"
              style={{
                flex: "1 1 200px", minHeight: 44, fontSize: 16, padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.16)",
                color: "#fff", fontFamily: "'Inter Tight', sans-serif", boxSizing: "border-box",
              }}
            />
            <button
              onClick={run}
              disabled={loading || !query.trim()}
              style={{
                minHeight: 44, padding: "0 18px", borderRadius: 10, background: TEAL, color: "#04231d",
                border: "none", fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer",
                opacity: !query.trim() ? 0.45 : 1, display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "'Inter Tight', sans-serif",
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Search
            </button>
          </div>

          {error && <div style={{ marginTop: 12, fontSize: 13, color: "#ff9d9d" }}>{error}</div>}

          {results.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8, marginTop: 14 }}>
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setPicking(r)}
                  style={{
                    padding: 0, borderRadius: 10, overflow: "hidden", cursor: "pointer",
                    border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)", aspectRatio: "1 / 1",
                  }}
                >
                  <img src={r.thumb} alt={r.title || "Reference"} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {picking && (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 12, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(0,0,0,0.35)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Attach to which item?</div>
              {items.length === 0 ? (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Add an item to this department first.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {items.map((it) => (
                    <button
                      key={it.id}
                      onClick={() => { onAttach(it.id, picking.full); setPicking(null); }}
                      style={{
                        textAlign: "left", minHeight: 44, padding: "0 12px", borderRadius: 10,
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)",
                        color: "#fff", fontSize: 15, cursor: "pointer", fontFamily: "'Inter Tight', sans-serif",
                      }}
                    >
                      {it.text}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => setPicking(null)}
                style={{
                  marginTop: 10, minHeight: 44, padding: "0 14px", borderRadius: 10, background: "none",
                  border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.7)", cursor: "pointer",
                  fontFamily: "'Inter Tight', sans-serif", fontSize: 14,
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferenceSearch;
