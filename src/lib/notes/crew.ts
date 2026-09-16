import { crewCall, type CrewIdentity } from "@/lib/breakdown/adapter";
import type { ProductionNote } from "@/lib/notes/types";

export interface CrewNotesResult {
  notes: ProductionNote[];
  languages: string[];
  preferred_language: string | null;
}

export interface CrewNoteDraft {
  tag: string;
  priority: string;
  shoot_day: string | null;
  scene_id: string | null;
  body: string;
}

/** Crew-side notes API — everything goes through the breakdown-crew function. */
export const crewNoteApi = (token: string, identity: CrewIdentity) => {
  const auth = { crew_id: identity.crew_id, crew_secret: identity.crew_secret };

  return {
    async list(): Promise<CrewNotesResult> {
      const res = await crewCall<CrewNotesResult>(token, "notes_list", {
        ...auth,
        include_resolved: true,
      });
      return {
        notes: (res.notes || []) as ProductionNote[],
        languages: res.languages || [],
        preferred_language: res.preferred_language ?? null,
      };
    },

    async post(draft: CrewNoteDraft): Promise<{ note: ProductionNote; translated: boolean }> {
      return crewCall<{ note: ProductionNote; translated: boolean }>(token, "note_post", {
        ...auth,
        ...draft,
      });
    },

    async resolve(noteId: string, resolved: boolean): Promise<void> {
      await crewCall(token, "note_resolve", { ...auth, note_id: noteId, resolved });
    },

    async edit(noteId: string, patch: Partial<CrewNoteDraft>): Promise<void> {
      await crewCall(token, "note_edit", { ...auth, note_id: noteId, ...patch });
    },

    async remove(noteId: string): Promise<void> {
      await crewCall(token, "note_delete", { ...auth, note_id: noteId });
    },
  };
};

export type CrewNoteApi = ReturnType<typeof crewNoteApi>;
