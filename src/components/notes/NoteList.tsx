import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ghostBtn, inputStyle, panel } from "@/components/production/ProductionPicker";
import NoteCard, { type NoteEdit } from "@/components/notes/NoteCard";
import {
  MAX_NOTE_CHARS,
  NOTE_FIELDS,
  NOTE_PRIORITIES,
  NOTE_TAGS,
  groupNotesByDay,
  prettyDay,
  sceneLabel,
  type NoteScene,
  type ProductionNote,
} from "@/lib/notes/types";

interface Props {
  /** Owner mode loads and edits through Supabase directly. */
  projectId?: string;
  scenes: NoteScene[];
  canTranslate: boolean;
  actingName?: string;
  refreshKey?: number;
  onRetranslate?: (note: ProductionNote) => void | Promise<void>;
  busyNoteId?: string | null;

  /** Crew mode: notes come from the edge function and are passed in. */
  mode?: "owner" | "crew";
  notes?: ProductionNote[];
  loading?: boolean;
  readLanguage?: string;
  crewId?: string;
  maxChars?: number;
  onPatchNote?: (note: ProductionNote, changes: Partial<ProductionNote>) => void | Promise<void>;
  onEditNote?: (note: ProductionNote, edit: NoteEdit) => void | Promise<void>;
  onDeleteNote?: (note: ProductionNote) => void | Promise<void>;
}

const label: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "rgba(255,255,255,0.5)",
  marginBottom: 6,
};

const NoteList = ({
  projectId,
  scenes,
  canTranslate,
  actingName = "",
  refreshKey = 0,
  onRetranslate,
  busyNoteId,
  mode = "owner",
  notes: externalNotes,
  loading: externalLoading,
  readLanguage,
  crewId,
  maxChars = MAX_NOTE_CHARS,
  onPatchNote,
  onEditNote,
  onDeleteNote,
}: Props) => {
  const isCrew = mode === "crew";
  const [searchParams, setSearchParams] = useSearchParams();
  const [ownerNotes, setOwnerNotes] = useState<ProductionNote[]>([]);
  const [ownerLoading, setOwnerLoading] = useState(true);

  // Crew keep their filters local — the share link stays clean.
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});

  const getParam = (key: string) => (isCrew ? localFilters[key] || "" : searchParams.get(key) || "");
  const setParam = useCallback((key: string, value: string | null) => {
    if (isCrew) {
      setLocalFilters((prev) => {
        const next = { ...prev };
        if (value) next[key] = value;
        else delete next[key];
        return next;
      });
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params, { replace: true });
  }, [isCrew, searchParams, setSearchParams]);

  const search = getParam("q");
  const tagFilter = getParam("tags").split(",").filter(Boolean);
  const priorityFilter = isCrew ? "" : getParam("priority");
  const fromDay = isCrew ? "" : getParam("from");
  const toDay = isCrew ? "" : getParam("to");
  const sceneFilter = isCrew ? "" : getParam("scene");
  const showResolved = getParam("resolved") === "1";

  const load = useCallback(async () => {
    if (!projectId) return;
    setOwnerLoading(true);
    const { data } = await supabase
      .from("production_notes")
      .select(NOTE_FIELDS)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setOwnerNotes((data || []) as ProductionNote[]);
    setOwnerLoading(false);
  }, [projectId]);

  useEffect(() => { if (!isCrew) load(); }, [isCrew, load, refreshKey]);

  // Live updates for this production (owner only — crew poll instead).
  useEffect(() => {
    if (isCrew || !projectId) return;
    const channel = supabase
      .channel(`production_notes:${projectId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "production_notes", filter: `project_id=eq.${projectId}` },
        () => { load(); },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isCrew, projectId, load]);

  const notes = isCrew ? (externalNotes || []) : ownerNotes;
  const loading = isCrew ? !!externalLoading : ownerLoading;

  const patch = async (note: ProductionNote, changes: Partial<ProductionNote>) => {
    if (onPatchNote) { await onPatchNote(note, changes); return; }
    const next: Record<string, unknown> = { ...changes };
    if (changes.resolved !== undefined) {
      next.resolved_by_name = changes.resolved ? actingName : null;
      next.resolved_at = changes.resolved ? new Date().toISOString() : null;
    }
    setOwnerNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, ...(next as Partial<ProductionNote>) } : n)));
    await supabase.from("production_notes").update(next).eq("id", note.id);
  };

  const edit = async (note: ProductionNote, e: NoteEdit) => {
    if (onEditNote) { await onEditNote(note, e); return; }
    const next: Record<string, unknown> = {
      tag: e.tag,
      priority: e.priority,
      shoot_day: e.shoot_day,
      scene_id: e.scene_id,
      body: e.body,
    };
    // Editing the text invalidates the existing translations.
    if (e.textChanged) next.translations = {};
    setOwnerNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, ...(next as Partial<ProductionNote>) } : n)));
    await supabase.from("production_notes").update(next).eq("id", note.id);
  };

  const remove = async (note: ProductionNote) => {
    if (!window.confirm("Delete this note?")) return;
    if (onDeleteNote) { await onDeleteNote(note); return; }
    setOwnerNotes((prev) => prev.filter((n) => n.id !== note.id));
    await supabase.from("production_notes").delete().eq("id", note.id);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes.filter((n) => {
      if (!showResolved && n.resolved) return false;
      if (tagFilter.length && !tagFilter.includes(n.tag)) return false;
      if (priorityFilter && n.priority !== priorityFilter) return false;
      if (sceneFilter && n.scene_id !== sceneFilter) return false;
      if (fromDay && (!n.shoot_day || n.shoot_day < fromDay)) return false;
      if (toDay && (!n.shoot_day || n.shoot_day > toDay)) return false;
      if (q && !n.body.toLowerCase().includes(q) && !n.created_by_name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [notes, search, tagFilter, priorityFilter, sceneFilter, fromDay, toDay, showResolved]);

  const groups = useMemo(() => groupNotesByDay(filtered), [filtered]);

  const toggleTag = (value: string) => {
    const next = tagFilter.includes(value)
      ? tagFilter.filter((t) => t !== value)
      : [...tagFilter, value];
    setParam("tags", next.length ? next.join(",") : null);
  };

  const clearFilters = () => {
    if (isCrew) {
      setLocalFilters((prev) => (prev.resolved ? { resolved: prev.resolved } : {}));
      return;
    }
    const params = new URLSearchParams(searchParams);
    ["q", "tags", "priority", "from", "to", "scene"].forEach((k) => params.delete(k));
    setSearchParams(params, { replace: true });
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ ...panel, padding: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700 }}>Filters</div>
        <div
          className="pn-grid"
          style={{ display: "grid", gridTemplateColumns: `repeat(${isCrew ? 2 : 3}, 1fr)`, gap: 12, marginTop: 14 }}
        >
          <div>
            <label style={label}>Search</label>
            <input value={search} onChange={(e) => setParam("q", e.target.value || null)} placeholder="Search notes" style={inputStyle} />
          </div>
          {!isCrew && (
            <>
              <div>
                <label style={label}>Priority</label>
                <select value={priorityFilter} onChange={(e) => setParam("priority", e.target.value || null)} style={inputStyle}>
                  <option value="" style={{ background: "#10101b" }}>Any priority</option>
                  {NOTE_PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value} style={{ background: "#10101b" }}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={label}>Scene</label>
                <select value={sceneFilter} onChange={(e) => setParam("scene", e.target.value || null)} style={inputStyle}>
                  <option value="" style={{ background: "#10101b" }}>All scenes</option>
                  {scenes.map((s) => (
                    <option key={s.id} value={s.id} style={{ background: "#10101b" }}>{sceneLabel(s)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={label}>From day</label>
                <input type="date" value={fromDay} onChange={(e) => setParam("from", e.target.value || null)} style={inputStyle} />
              </div>
              <div>
                <label style={label}>To day</label>
                <input type="date" value={toDay} onChange={(e) => setParam("to", e.target.value || null)} style={inputStyle} />
              </div>
            </>
          )}
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 44, cursor: "pointer", fontSize: 14 }}>
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setParam("resolved", e.target.checked ? "1" : null)}
                style={{ width: 18, height: 18 }}
              />
              Show resolved
            </label>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {NOTE_TAGS.map((t) => {
            const on = tagFilter.includes(t.value);
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => toggleTag(t.value)}
                aria-pressed={on}
                style={{
                  minHeight: 40, padding: "0 12px", borderRadius: 9999, cursor: "pointer",
                  border: `1px solid ${on ? t.color : "rgba(255,255,255,0.14)"}`,
                  background: on ? `${t.color}22` : "rgba(255,255,255,0.04)",
                  color: on ? t.color : "rgba(255,255,255,0.7)",
                  fontSize: 13, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif",
                }}
              >
                {t.label}
              </button>
            );
          })}
          {(tagFilter.length || search || priorityFilter || fromDay || toDay || sceneFilter) ? (
            <button onClick={clearFilters} style={{ ...ghostBtn, minHeight: 40, fontSize: 13 }}>
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div style={{ ...panel, padding: 24, display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)" }}>
          <Loader2 size={16} className="animate-spin" /> Loading notes…
        </div>
      ) : groups.length === 0 ? (
        <div style={{ ...panel, padding: 28, textAlign: "center", color: "rgba(255,255,255,0.55)" }}>
          No notes yet. Write the first one above.
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.day || "none"} style={{ marginBottom: 26 }}>
            <div style={{
              fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700,
              marginBottom: 12, color: "rgba(255,255,255,0.9)",
            }}>
              {prettyDay(g.day)}
              <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)", marginLeft: 10 }}>
                {g.notes.length} note{g.notes.length === 1 ? "" : "s"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {g.notes.map((n) => {
                const mine = !isCrew || (!!crewId && n.created_by_crew_id === crewId);
                return (
                  <NoteCard
                    key={n.id}
                    note={n}
                    scenes={scenes}
                    canTranslate={canTranslate}
                    busy={busyNoteId === n.id}
                    mode={mode}
                    readLanguage={readLanguage}
                    maxChars={maxChars}
                    canEdit={mine}
                    canDelete={mine}
                    allowPin={!isCrew}
                    onPatch={(p) => patch(n, p)}
                    onEdit={(e) => edit(n, e)}
                    onDelete={() => remove(n)}
                    onRetranslate={() => onRetranslate?.(n)}
                  />
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NoteList;
