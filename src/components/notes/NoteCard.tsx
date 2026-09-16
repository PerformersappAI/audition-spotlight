import { useMemo, useState } from "react";
import { AlertTriangle, Check, Copy, Pencil, Pin, RotateCcw, Trash2 } from "lucide-react";
import { ghostBtn, inputStyle, panel, primaryBtn } from "@/components/production/ProductionPicker";
import { timeAgo } from "@/components/breakdown/timeAgo";
import { LANGUAGES } from "@/lib/languages";
import { RTL_LANGUAGES } from "@/lib/translator/types";
import {
  MAX_NOTE_CHARS,
  NOTE_PRIORITIES,
  NOTE_TAGS,
  noteTranslations,
  sceneLabel,
  tagColor,
  tagLabel,
  type NotePriority,
  type NoteScene,
  type NoteTag,
  type ProductionNote,
} from "@/lib/notes/types";

export interface NoteEdit {
  tag: NoteTag;
  priority: NotePriority;
  shoot_day: string | null;
  scene_id: string | null;
  body: string;
  textChanged: boolean;
}

interface Props {
  note: ProductionNote;
  scenes: NoteScene[];
  canTranslate: boolean;
  onPatch: (patch: Partial<ProductionNote>) => void;
  onEdit: (edit: NoteEdit) => void | Promise<void>;
  onDelete: () => void;
  onRetranslate: () => void | Promise<void>;
  busy?: boolean;
  /** Crew mode reads in one language and hides pinning. */
  mode?: "owner" | "crew";
  readLanguage?: string;
  maxChars?: number;
  canEdit?: boolean;
  canDelete?: boolean;
  allowPin?: boolean;
}

const smallBtn: React.CSSProperties = {
  ...ghostBtn,
  minHeight: 44,
  padding: "0 12px",
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const native = (code: string) => LANGUAGES[code]?.native || code;

const NoteCard = ({
  note,
  scenes,
  canTranslate,
  onPatch,
  onEdit,
  onDelete,
  onRetranslate,
  busy,
  mode = "owner",
  readLanguage,
  maxChars = MAX_NOTE_CHARS,
  canEdit = true,
  canDelete = true,
  allowPin = true,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [tag, setTag] = useState(note.tag as NoteTag);
  const [priority, setPriority] = useState(note.priority as NotePriority);
  const [shootDay, setShootDay] = useState(note.shoot_day || "");
  const [sceneId, setSceneId] = useState(note.scene_id || "");
  const [body, setBody] = useState(note.body);
  const [copied, setCopied] = useState(false);

  const scene = scenes.find((s) => s.id === note.scene_id) || null;
  const translations = noteTranslations(note);
  const isSafety = note.tag === "safety";
  const urgent = note.priority === "urgent";
  const staleTranslations = !!note.source_language && translations.length === 0;
  const viaCrew = mode === "owner" && !!note.created_by_crew_id;

  // Crew read the note in their own language when we have it.
  const shown = useMemo(() => {
    if (mode !== "crew" || !readLanguage || showOriginal) {
      return { text: note.body, code: note.source_language || "", fallback: false };
    }
    if (readLanguage === note.source_language) {
      return { text: note.body, code: readLanguage, fallback: false };
    }
    const hit = translations.find((t) => t.code === readLanguage);
    if (hit) return { text: hit.text, code: hit.code, fallback: false };
    return { text: note.body, code: note.source_language || "", fallback: true };
  }, [mode, readLanguage, showOriginal, note.body, note.source_language, translations]);

  const startEdit = () => {
    setTag(note.tag as NoteTag);
    setPriority(note.priority as NotePriority);
    setShootDay(note.shoot_day || "");
    setSceneId(note.scene_id || "");
    setBody(note.body);
    setEditing(true);
  };

  const saveEdit = async () => {
    await onEdit({
      tag,
      priority,
      shoot_day: shootDay || null,
      scene_id: sceneId || null,
      body: body.slice(0, maxChars),
      textChanged: body.trim() !== note.body.trim(),
    });
    setEditing(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shown.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div
      style={{
        ...panel,
        padding: 16,
        borderLeft: isSafety ? "4px solid #ff4d4f" : undefined,
        border: urgent ? "2px solid rgba(255,77,79,0.6)" : (panel.border as string),
        opacity: note.resolved ? 0.6 : 1,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {note.pinned && <Pin size={14} color="#00d4aa" />}
        <span style={{
          fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 9999,
          background: `${tagColor(note.tag)}22`, color: tagColor(note.tag),
          border: `1px solid ${tagColor(note.tag)}55`,
        }}>
          {isSafety ? "⚠ " : ""}{tagLabel(note.tag)}
        </span>
        {note.priority === "important" && (
          <span style={{ fontSize: 12, fontWeight: 700, color: "#ffb020" }}>Important</span>
        )}
        {urgent && (
          <span style={{ fontSize: 12, fontWeight: 800, color: "#ff4d4f" }}>URGENT</span>
        )}
        {scene && (
          <span style={{
            fontSize: 12, padding: "4px 10px", borderRadius: 9999,
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)",
          }}>
            {sceneLabel(scene)}
          </span>
        )}
        {viaCrew && (
          <span style={{
            fontSize: 11.5, padding: "4px 10px", borderRadius: 9999,
            background: "rgba(0,212,170,0.12)", color: "#00d4aa",
            border: "1px solid rgba(0,212,170,0.35)",
          }}>
            via crew link
          </span>
        )}
        {note.resolved && (
          <span style={{ fontSize: 12, color: "#06d6a0" }}>
            Resolved{note.resolved_by_name ? ` by ${note.resolved_by_name}` : ""}
          </span>
        )}
      </div>

      {editing ? (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <select value={tag} onChange={(e) => setTag(e.target.value as NoteTag)} style={inputStyle}>
            {NOTE_TAGS.map((t) => (
              <option key={t.value} value={t.value} style={{ background: "#10101b" }}>{t.label}</option>
            ))}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value as NotePriority)} style={inputStyle}>
            {NOTE_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value} style={{ background: "#10101b" }}>{p.label}</option>
            ))}
          </select>
          <input type="date" value={shootDay} onChange={(e) => setShootDay(e.target.value)} style={inputStyle} />
          <select value={sceneId} onChange={(e) => setSceneId(e.target.value)} style={inputStyle}>
            <option value="" style={{ background: "#10101b" }}>None</option>
            {scenes.map((s) => (
              <option key={s.id} value={s.id} style={{ background: "#10101b" }}>{sceneLabel(s)}</option>
            ))}
          </select>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, maxChars))}
            rows={Math.min(20, Math.max(3, body.split("\n").length + 1))}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={saveEdit} disabled={busy || body.trim().length < 2} style={{ ...primaryBtn, opacity: busy || body.trim().length < 2 ? 0.45 : 1 }}>
              {busy ? "Saving…" : "Save changes"}
            </button>
            <button onClick={() => setEditing(false)} style={ghostBtn}>Cancel</button>
          </div>
        </div>
      ) : (
        <div
          dir={shown.code && RTL_LANGUAGES.has(shown.code) ? "rtl" : "ltr"}
          style={{ marginTop: 12, fontSize: 15, lineHeight: 1.65, whiteSpace: "pre-wrap" }}
        >
          {shown.text}
        </div>
      )}

      {mode === "crew" && shown.fallback && (
        <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          Original{note.source_language ? ` (${native(note.source_language)})` : ""} — no translation yet
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
        {note.created_by_name}
        {note.created_by_department ? ` · ${note.created_by_department}` : ""} · {timeAgo(note.created_at)}
      </div>

      {translations.length > 0 && (
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {mode === "crew" && !shown.fallback && (
            <button onClick={() => setShowOriginal((v) => !v)} style={{ ...smallBtn, minHeight: 36 }}>
              {showOriginal ? "Show my language" : "Show original"}
            </button>
          )}
          <button
            onClick={() => setShowTranslations((v) => !v)}
            style={{ ...smallBtn, minHeight: 36 }}
          >
            {mode === "crew"
              ? (showTranslations ? "Hide languages" : "All languages")
              : `Translated: ${translations.map((t) => t.code.toUpperCase()).join(" · ")}`}
          </button>
        </div>
      )}

      {translations.length > 0 && showTranslations && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {translations.map(({ code, text }) => (
            <div key={code} style={{ borderLeft: "2px solid rgba(0,212,170,0.4)", paddingLeft: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00d4aa" }}>
                {native(code)}
              </div>
              <div
                dir={RTL_LANGUAGES.has(code) ? "rtl" : "ltr"}
                style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.8)", marginTop: 4 }}
              >
                {text}
              </div>
            </div>
          ))}
        </div>
      )}

      {staleTranslations && canTranslate && mode === "owner" && (
        <button onClick={onRetranslate} disabled={busy} style={{ ...smallBtn, marginTop: 10, opacity: busy ? 0.5 : 1 }}>
          Re-translate (1 credit)
        </button>
      )}

      {!editing && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {allowPin && (
            <button onClick={() => onPatch({ pinned: !note.pinned })} style={smallBtn}>
              <Pin size={14} /> {note.pinned ? "Unpin" : "Pin"}
            </button>
          )}
          <button
            onClick={() => onPatch({ resolved: !note.resolved })}
            style={smallBtn}
          >
            {note.resolved ? <><RotateCcw size={14} /> Reopen</> : <><Check size={14} /> Resolve</>}
          </button>
          {canEdit && <button onClick={startEdit} style={smallBtn}><Pencil size={14} /> Edit</button>}
          <button onClick={copy} style={smallBtn}><Copy size={14} /> {copied ? "Copied" : "Copy"}</button>
          {canDelete && (
            <button onClick={onDelete} style={{ ...smallBtn, color: "#ff9d9d" }}><Trash2 size={14} /> Delete</button>
          )}
          {isSafety && <AlertTriangle size={14} color="#ff4d4f" style={{ alignSelf: "center" }} />}
        </div>
      )}
    </div>
  );
};

export default NoteCard;
