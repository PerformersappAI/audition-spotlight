export const DEPARTMENTS = [
  { key: "props", label: "Props" },
  { key: "locations", label: "Locations" },
  { key: "makeup_sfx", label: "Makeup & SFX" },
  { key: "wardrobe", label: "Wardrobe" },
  { key: "vehicles", label: "Vehicles" },
] as const;

export type DeptKey = (typeof DEPARTMENTS)[number]["key"];

/** Departments a crew member can pick when joining via the private link. */
export const CREW_DEPARTMENTS = [
  "Director",
  "Producer",
  "Assistant Director",
  "Props",
  "Locations",
  "Makeup & SFX",
  "Wardrobe",
  "Transport / Vehicles",
  "Camera",
  "Art Department",
  "Other",
] as const;

export interface BreakdownScene {
  id: string;
  scene_number: string | null;
  label: string | null;
  script_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface BreakdownItem {
  id: string;
  scene_id: string;
  department: string;
  text: string;
  original_text: string | null;
  source: string;
  flagged: boolean;
  checked: boolean;
  checked_by_name: string | null;
  checked_at: string | null;
  added_by_name: string | null;
  added_by_crew_id: string | null;
  sort_order: number;
}

export interface BreakdownSignoff {
  id: string;
  scene_id: string;
  department: string;
  status: string;
  note: string | null;
  by_name: string | null;
  by_department: string | null;
  updated_at: string | null;
}

export interface BreakdownPhoto {
  id: string;
  item_id: string;
  project_id: string;
  storage_path: string | null;
  external_url: string | null;
  is_reference: boolean;
  status: string;
  feedback: string | null;
  uploaded_by_name: string | null;
  uploaded_by_crew_id: string | null;
  decided_by_name: string | null;
  decided_at: string | null;
  created_at: string;
}

export const SCENE_FIELDS = "id, scene_number, label, script_text, sort_order, created_at";

export const ITEM_FIELDS =
  "id, scene_id, department, text, original_text, source, flagged, checked, checked_by_name, checked_at, added_by_name, added_by_crew_id, sort_order";

export const SIGNOFF_FIELDS =
  "id, scene_id, department, status, note, by_name, by_department, updated_at";

export const PHOTO_FIELDS =
  "id, item_id, project_id, storage_path, external_url, is_reference, status, feedback, uploaded_by_name, uploaded_by_crew_id, decided_by_name, decided_at, created_at";

export const TEAL = "#00d4aa";
