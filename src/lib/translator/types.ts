export type SourceKind = "text" | "pdf" | "image" | "spreadsheet";

export interface ProductionMessage {
  id: string;
  project_id: string;
  subject: string | null;
  source_language: string;
  source_text: string;
  /** { "<code>": "<text>", "_subjects": { "<code>": "<subject>" } } */
  translations: Record<string, unknown>;
  source_kind: string;
  created_by_name: string;
  created_at: string;
}

/** Translations without the internal `_subjects` bucket. */
export function messageTranslations(m: ProductionMessage): Array<{ code: string; text: string }> {
  const t = (m.translations || {}) as Record<string, unknown>;
  return Object.entries(t)
    .filter(([code, value]) => code !== "_subjects" && typeof value === "string" && (value as string).trim())
    .map(([code, value]) => ({ code, text: value as string }));
}

export function messageSubjects(m: ProductionMessage): Record<string, string> {
  const subs = (m.translations as Record<string, unknown>)?._subjects;
  if (!subs || typeof subs !== "object") return {};
  const out: Record<string, string> = {};
  Object.entries(subs as Record<string, unknown>).forEach(([code, value]) => {
    if (typeof value === "string" && value.trim()) out[code] = value;
  });
  return out;
}

/** Right-to-left scripts. */
export const RTL_LANGUAGES = new Set(["ar", "he"]);

/** Scripts the embedded PDF fonts (Latin / Cyrillic / Greek) cannot render. */
export const PDF_UNSUPPORTED_LANGUAGES = new Set(["ar", "he", "hi", "zh", "ja", "ko"]);
