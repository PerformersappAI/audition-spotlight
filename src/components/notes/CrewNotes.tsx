import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { inputStyle, panel } from "@/components/production/ProductionPicker";
import NoteComposer, { type NoteDraft } from "@/components/notes/NoteComposer";
import NoteList from "@/components/notes/NoteList";
import type { NoteEdit } from "@/components/notes/NoteCard";
import { LANGUAGES } from "@/lib/languages";
import { crewNoteApi } from "@/lib/notes/crew";
import { crewMessageApi } from "@/lib/translator/crew";
import { readStoredLanguage, storeLanguage } from "@/lib/translator/readLanguage";
import { MAX_CREW_NOTE_CHARS, type NoteScene, type ProductionNote } from "@/lib/notes/types";
import type { CrewIdentity } from "@/lib/breakdown/adapter";

interface Props {
  token: string;
  identity: CrewIdentity;
  languages: string[];
  scenes: NoteScene[];
  notes: ProductionNote[];
  loading: boolean;
  preferredLanguage: string | null;
  onChanged: () => void;
}

const native = (code: string) => LANGUAGES[code]?.native || code;

const CrewNotes = ({
  token,
  identity,
  languages,
  scenes,
  notes,
  loading,
  preferredLanguage,
  onChanged,
}: Props) => {
  const api = useMemo(() => crewNoteApi(token, identity), [token, identity]);
  const messageApi = useMemo(() => crewMessageApi(token, identity), [token, identity]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const initialLanguage = useMemo(() => {
    const stored = readStoredLanguage(token);
    if (stored && languages.includes(stored)) return stored;
    if (preferredLanguage && languages.includes(preferredLanguage)) return preferredLanguage;
    const browser = (navigator.language || "").slice(0, 2).toLowerCase();
    if (browser && languages.includes(browser)) return browser;
    return languages[0] || "en";
  }, [token, languages, preferredLanguage]);

  const [readLanguage, setReadLanguage] = useState(initialLanguage);

  useEffect(() => {
    setReadLanguage((current) => (languages.includes(current) ? current : initialLanguage));
  }, [initialLanguage, languages]);

  const changeLanguage = async (code: string) => {
    setReadLanguage(code);
    storeLanguage(token, code);
    try {
      await messageApi.setLanguage(code);
    } catch { /* the local choice still applies */ }
  };

  const save = async (draft: NoteDraft) => {
    setSaving(true);
    setError("");
    try {
      const res = await api.post({
        tag: draft.tag,
        priority: draft.priority,
        shoot_day: draft.shootDay || null,
        scene_id: draft.sceneId || null,
        body: draft.body,
      });
      onChanged();
      toast.success(
        res.translated
          ? "Note added and translated for the crew"
          : "Note added",
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : "The note couldn't be saved.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const patch = async (note: ProductionNote, changes: Partial<ProductionNote>) => {
    if (changes.resolved === undefined) return;
    try {
      await api.resolve(note.id, changes.resolved);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save that.");
    }
  };

  const edit = async (note: ProductionNote, e: NoteEdit) => {
    try {
      await api.edit(note.id, {
        tag: e.tag,
        priority: e.priority,
        shoot_day: e.shoot_day,
        scene_id: e.scene_id,
        body: e.body,
      });
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save that.");
    }
  };

  const remove = async (note: ProductionNote) => {
    try {
      await api.remove(note.id);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove that note.");
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      {languages.length > 1 && (
        <div style={{ ...panel, padding: 18, marginBottom: 18 }}>
          <label htmlFor="crew-notes-lang" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6 }}>
            Read in
          </label>
          <select
            id="crew-notes-lang"
            value={readLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ ...inputStyle, maxWidth: 260 }}
          >
            {languages.map((code) => (
              <option key={code} value={code} style={{ background: "#10101b" }}>{native(code)}</option>
            ))}
          </select>
        </div>
      )}

      <NoteComposer
        scenes={scenes}
        languageCount={languages.length}
        saving={saving}
        error={error}
        onSave={save}
        maxChars={MAX_CREW_NOTE_CHARS}
        showTranslateToggle={false}
        heading="Add a note"
        hint={
          languages.length > 1
            ? "Everyone on this link sees it in their own language."
            : "Everyone on this link sees it."
        }
      />

      <NoteList
        mode="crew"
        scenes={scenes}
        canTranslate={false}
        notes={notes}
        loading={loading}
        readLanguage={readLanguage}
        crewId={identity.crew_id}
        maxChars={MAX_CREW_NOTE_CHARS}
        onPatchNote={patch}
        onEditNote={edit}
        onDeleteNote={remove}
      />
    </div>
  );
};

export default CrewNotes;
