export const DEPARTMENTS = [
  { key: "props", label: "Props" },
  { key: "locations", label: "Locations" },
  { key: "makeup_sfx", label: "Makeup & SFX" },
  { key: "wardrobe", label: "Wardrobe" },
  { key: "vehicles", label: "Vehicles" },
] as const;

export type DeptKey = (typeof DEPARTMENTS)[number]["key"];

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

export const TEAL = "#00d4aa";
