export const JOB_OPTIONS = [
  "Director",
  "Producer",
  "Executive Producer",
  "1st Assistant Director",
  "2nd Assistant Director",
  "Director of Photography",
  "Camera Operator",
  "1st AC",
  "Gaffer",
  "Key Grip",
  "Sound Mixer",
  "Boom Operator",
  "Production Designer",
  "Art Director",
  "Makeup Artist",
  "Hair Stylist",
  "Costume / Wardrobe",
  "Actor",
  "Background / Extra",
  "Production Assistant",
  "Other",
] as const;

export const ACTOR_TYPES = ["Principal", "Background / Extra"] as const;

export interface CastCrewForm {
  id: string;
  slug: string;
  production_name: string | null;
  notify_email: string;
  project_id: string | null;
  auto_confirm: boolean;
}

export interface CastCrewContact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  instagram_handle: string | null;
  job_position: string | null;
  other_role: string | null;
  character_name: string | null;
  actor_type: string | null;
  notes: string | null;
  notes_internal: string | null;
  confirmation_sent_at: string | null;
  created_at: string;
}

export interface CastCrewReminder {
  id: string;
  email: string;
  name: string | null;
  sent_at: string;
}

export const CONTACT_FIELDS =
  "id, first_name, last_name, phone, email, instagram_handle, job_position, other_role, character_name, actor_type, notes, notes_internal, confirmation_sent_at, created_at";

export const FORM_FIELDS = "id, slug, production_name, notify_email, project_id, auto_confirm";

export const contactName = (c: CastCrewContact) =>
  [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || "Unnamed";

export const contactRole = (c: CastCrewContact) =>
  c.job_position === "Other" && c.other_role
    ? `Other — ${c.other_role}`
    : c.job_position || "—";

/** Cast = Actor / Background / anyone with a character or actor type. Everyone else is crew. */
export const isCastMember = (c: CastCrewContact) => {
  const role = (c.job_position || "").toLowerCase();
  return (
    Boolean(c.character_name) ||
    Boolean(c.actor_type) ||
    role.includes("actor") ||
    role.includes("cast") ||
    role.includes("background") ||
    role.includes("extra")
  );
};

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const shareLinkFor = (slug: string) => `https://filmmakergenius.com/f/${slug}`;
