import { useEffect, useMemo, useState } from "react";
import { ghostBtn, inputStyle, panel, primaryBtn } from "@/components/production/ProductionPicker";
import {
  MAX_NOTE_CHARS,
  NOTE_PRIORITIES,
  NOTE_TAGS,
  sceneLabel,
  todayLocal,
  type NotePriority,
  type NoteScene,
  type NoteTag,
} from "@/lib/notes/types";

export interface NoteDraft {
  tag: NoteTag;
  priority: NotePriority;
  shootDay: string;
  sceneId: string;
  body: string;
  translate: boolean;
}

interface Props {
  scenes: NoteScene[];
  languageCount: number;
  saving: boolean;
  error?: string;
  onSave: (draft: NoteDraft) => void | Promise<void>;
  /** Crew members get a shorter note and automatic translation (no toggle). */
  maxChars?: number;
  showTranslateToggle?: boolean;
  heading?: string;
  hint?: string;
}

const label: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "rgba(255,255,255,0.5)",
  marginBottom: 6,
};

const NoteComposer = ({
  scenes,
  languageCount,
  saving,
  error,
  onSave,
  maxChars = MAX_NOTE_CHARS,
  showTranslateToggle = true,
  heading = "New note",
  hint,
}: Props) => {
  const [tag, setTag] = useState<NoteTag>("general");
  const [priority, setPriority] = useState<NotePriority>("normal");
  const [shootDay, setShootDay] = useState(todayLocal());
  const [sceneId, setSceneId] = useState("");
  const [body, setBody] = useState("");
  const [translate, setTranslate] = useState(false);
  const [translateTouched, setTranslateTouched] = useState(false);

  const canTranslate = languageCount >= 2;
  const shouldDefaultOn = tag === "safety" || priority === "urgent";

  // Safety and Urgent notes default to translated; the user can still override.
  useEffect(() => {
    if (!canTranslate) {
      setTranslate(false);
      return;
    }
    if (!translateTouched) setTranslate(shouldDefaultOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag, priority, canTranslate]);

  const rows = useMemo(() => Math.min(24, Math.max(4, body.split("\n").length + 1)), [body]);

  const save = async () => {
    if (body.trim().length < 2) return;
    await onSave({ tag, priority, shootDay, sceneId, body: body.slice(0, MAX_NOTE_CHARS), translate });
    setBody("");
    setTranslateTouched(false);
  };

  return (
    <div style={{ ...panel, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700 }}>New note</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
        {NOTE_TAGS.map((t) => {
          const on = tag === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTag(t.value)}
              aria-pressed={on}
              style={{
                minHeight: 44, padding: "0 14px", borderRadius: 9999, cursor: "pointer",
                border: `1px solid ${on ? t.color : "rgba(255,255,255,0.14)"}`,
                background: on ? `${t.color}22` : "rgba(255,255,255,0.04)",
                color: on ? t.color : "rgba(255,255,255,0.75)",
                fontSize: 14, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 9999, background: t.color, display: "inline-block" }} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="pn-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
        <div>
          <label style={label}>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as NotePriority)} style={inputStyle}>
            {NOTE_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value} style={{ background: "#10101b" }}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={label}>Shoot day</label>
          <input type="date" value={shootDay} onChange={(e) => setShootDay(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={label}>Scene (optional)</label>
          <select value={sceneId} onChange={(e) => setSceneId(e.target.value)} style={inputStyle}>
            <option value="" style={{ background: "#10101b" }}>None</option>
            {scenes.map((s) => (
              <option key={s.id} value={s.id} style={{ background: "#10101b" }}>{sceneLabel(s)}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={label}>Note</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, MAX_NOTE_CHARS))}
          rows={rows}
          placeholder="Stunt rehearsal moved to 14:00 — everyone on set 15 minutes early."
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, maxHeight: "60vh" }}
        />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6, textAlign: "right" }}>
          {body.length} / {MAX_NOTE_CHARS}
        </div>
      </div>

      {canTranslate && (
        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, minHeight: 44, cursor: "pointer", fontSize: 14 }}>
          <input
            type="checkbox"
            checked={translate}
            onChange={(e) => { setTranslate(e.target.checked); setTranslateTouched(true); }}
            style={{ width: 18, height: 18 }}
          />
          Translate for the crew (1 credit)
        </label>
      )}

      {error && <div style={{ color: "#ff9d9d", fontSize: 14, marginTop: 10 }}>{error}</div>}

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button
          onClick={save}
          disabled={saving || body.trim().length < 2}
          style={{ ...primaryBtn, opacity: saving || body.trim().length < 2 ? 0.45 : 1 }}
        >
          {saving ? "Saving…" : "Save note"}
        </button>
        {body && (
          <button onClick={() => setBody("")} style={ghostBtn}>Clear</button>
        )}
      </div>
    </div>
  );
};

export default NoteComposer;
