export type NoteTag =
  | "general" | "talent" | "location" | "props" | "wardrobe" | "makeup"
  | "camera" | "sound" | "safety" | "director" | "ad" | "production";

export type NotePriority = "normal" | "important" | "urgent";

export interface NoteTagInfo {
  value: NoteTag;
  label: string;
  color: string;
}

export const NOTE_TAGS: NoteTagInfo[] = [
  { value: "general", label: "General", color: "#9aa4b2" },
  { value: "talent", label: "Talent", color: "#f0a6ca" },
  { value: "location", label: "Location", color: "#4cc9f0" },
  { value: "props", label: "Props", color: "#00d4aa" },
  { value: "wardrobe", label: "Wardrobe", color: "#b892ff" },
  { value: "makeup", label: "Makeup", color: "#ff9f1c" },
  { value: "camera", label: "Camera", color: "#8ecae6" },
  { value: "sound", label: "Sound", color: "#c2e812" },
  { value: "safety", label: "Safety", color: "#ff4d4f" },
  { value: "director", label: "Director", color: "#ffd166" },
  { value: "ad", label: "AD", color: "#06d6a0" },
  { value: "production", label: "Production", color: "#a0c4ff" },
];

export const NOTE_TAG_MAP: Record<string, NoteTagInfo> = Object.fromEntries(
  NOTE_TAGS.map((t) => [t.value, t]),
);

export const tagLabel = (tag: string) => NOTE_TAG_MAP[tag]?.label || tag;
export const tagColor = (tag: string) => NOTE_TAG_MAP[tag]?.color || "#9aa4b2";

export const NOTE_PRIORITIES: Array<{ value: NotePriority; label: string; color: string }> = [
  { value: "normal", label: "Normal", color: "#9aa4b2" },
  { value: "important", label: "Important", color: "#ffb020" },
  { value: "urgent", label: "Urgent", color: "#ff4d4f" },
];

export const MAX_NOTE_CHARS = 5000;

export interface NoteScene {
  id: string;
  scene_number: string | null;
  label: string | null;
}

export const sceneLabel = (s?: NoteScene | null) => {
  if (!s) return "";
  const num = s.scene_number ? `Scene ${s.scene_number}` : "Scene";
  return s.label ? `${num} — ${s.label}` : num;
};

export interface ProductionNote {
  id: string;
  project_id: string;
  tag: string;
  body: string;
  source_language: string | null;
  translations: Record<string, unknown>;
  shoot_day: string | null;
  scene_id: string | null;
  priority: string;
  pinned: boolean;
  resolved: boolean;
  resolved_by_name: string | null;
  resolved_at: string | null;
  created_by_name: string;
  created_by_department: string | null;
  created_at: string;
  updated_at?: string;
}

export const NOTE_FIELDS =
  "id, project_id, tag, body, source_language, translations, shoot_day, scene_id, priority, pinned, resolved, resolved_by_name, resolved_at, created_by_name, created_by_department, created_at, updated_at";

/** Translations as an ordered list of { code, text }. */
export function noteTranslations(n: ProductionNote): Array<{ code: string; text: string }> {
  const t = (n.translations || {}) as Record<string, unknown>;
  return Object.entries(t)
    .filter(([, v]) => typeof v === "string" && (v as string).trim())
    .map(([code, v]) => ({ code, text: v as string }));
}

/** Today's date as yyyy-mm-dd in the viewer's own timezone. */
export function todayLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function prettyDay(day?: string | null): string {
  if (!day) return "No day";
  const d = new Date(`${day}T12:00:00`);
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

/** Safety first, then Urgent/Important before Normal, then newest first. */
const PRIORITY_RANK: Record<string, number> = { urgent: 0, important: 1, normal: 2 };

export function sortForReport(notes: ProductionNote[]): ProductionNote[] {
  return [...notes].sort((a, b) => {
    const p = (PRIORITY_RANK[a.priority] ?? 2) - (PRIORITY_RANK[b.priority] ?? 2);
    if (p !== 0) return p;
    return (a.created_at || "").localeCompare(b.created_at || "");
  });
}

/** Tag groups for the daily report: Safety first, then the standard order. */
export function groupByTag(notes: ProductionNote[]): Array<{ tag: string; notes: ProductionNote[] }> {
  const order = ["safety", ...NOTE_TAGS.map((t) => t.value).filter((t) => t !== "safety")];
  const seen = new Map<string, ProductionNote[]>();
  notes.forEach((n) => {
    const list = seen.get(n.tag) || [];
    list.push(n);
    seen.set(n.tag, list);
  });
  const known = order
    .filter((t) => seen.has(t))
    .map((tag) => ({ tag, notes: sortForReport(seen.get(tag)!) }));
  const extra = [...seen.keys()]
    .filter((t) => !order.includes(t))
    .map((tag) => ({ tag, notes: sortForReport(seen.get(tag)!) }));
  return [...known, ...extra];
}
