import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ghostBtn, panel } from "@/components/production/ProductionPicker";
import { timeAgo } from "@/components/breakdown/timeAgo";
import { LANGUAGES } from "@/lib/languages";
import { messageTranslations, type ProductionMessage } from "@/lib/translator/types";

const PAGE = 20;

const MESSAGE_FIELDS =
  "id, project_id, subject, source_language, source_text, translations, source_kind, created_by_name, created_at";

interface Props {
  projectId: string;
  /** Bumped by the page whenever a new message is saved. */
  refreshKey: number;
  onOpen: (message: ProductionMessage) => void;
}

const MessageHistory = ({ projectId, refreshKey, onOpen }: Props) => {
  const [rows, setRows] = useState<ProductionMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async (limit: number) => {
    setLoading(true);
    const { data } = await supabase
      .from("production_messages")
      .select(MESSAGE_FIELDS)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(limit + 1);
    const list = (data || []) as unknown as ProductionMessage[];
    setHasMore(list.length > limit);
    setRows(list.slice(0, limit));
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    load(PAGE);
  }, [projectId, refreshKey, load]);

  const remove = async (id: string) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    await supabase.from("production_messages").delete().eq("id", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div style={{ ...panel, padding: 20, marginBottom: 48 }}>
      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700 }}>Message history</div>

      {loading && rows.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.55)", marginTop: 14, fontSize: 14 }}>
          <Loader2 size={15} className="animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginTop: 10 }}>
          Nothing yet. Your translated messages will be listed here.
        </p>
      ) : (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((row) => {
            const count = messageTranslations(row).length;
            const title = row.subject?.trim() || `${row.source_text.slice(0, 60)}${row.source_text.length > 60 ? "…" : ""}`;
            return (
              <div
                key={row.id}
                style={{
                  display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => onOpen(row)}
                  style={{
                    flex: "1 1 220px", minWidth: 0, textAlign: "left", minHeight: 44,
                    background: "none", border: "none", color: "#fff", cursor: "pointer",
                    fontFamily: "'Inter Tight', sans-serif", padding: 0,
                  }}
                >
                  <div style={{ fontSize: 14.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                    {timeAgo(row.created_at)} · {LANGUAGES[row.source_language]?.native || row.source_language} → {count} language{count === 1 ? "" : "s"} · {row.created_by_name}
                  </div>
                </button>
                <button
                  onClick={() => remove(row.id)}
                  aria-label="Delete message"
                  style={{ ...ghostBtn, minWidth: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
          {hasMore && (
            <button onClick={() => load(rows.length + PAGE)} style={{ ...ghostBtn, marginTop: 4 }}>
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageHistory;
