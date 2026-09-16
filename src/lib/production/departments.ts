/**
 * Single shared list of production departments.
 * Used by the crew "Who are you?" dialog (join / update profile) and by
 * Receipts & Expenses (dialog, filters). Stored values outside this list
 * remain valid and must still display and filter correctly.
 */
export const PRODUCTION_DEPARTMENTS = [
  "Director",
  "Producer",
  "Assistant Director",
  "Camera",
  "Lighting / Grip",
  "Sound",
  "Art Department",
  "Props",
  "Locations",
  "Wardrobe",
  "Makeup & SFX",
  "Special Effects",
  "Stunts",
  "Catering",
  "Transport / Vehicles",
  "Post Production",
  "Music",
  "Cast",
  "Vendor",
  "Other",
] as const;

export type ProductionDepartment = (typeof PRODUCTION_DEPARTMENTS)[number];
