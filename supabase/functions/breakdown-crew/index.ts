import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { charge, ensureBalance, estimateUsd, logUsage, serviceClient } from "../_shared/credits.ts";
import { callReceiptAi, parseReceipt, MAX_RECEIPT_BYTES, RECEIPT_MIME_TYPES } from "../_shared/receipt.ts";
import {
  MAX_TARGETS,
  MAX_SUBJECT,
  buildTranslationsColumn,
  productionLanguages,
  translateWithRetry,
} from "../_shared/translate.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "breakdown-photos";
const EXPENSE_BUCKET = "expense-receipts";
const MAX_BODY = 4 * 1024 * 1024; // 4 MB for ordinary actions
const MAX_UPLOAD_BODY = 12 * 1024 * 1024; // 12 MB for the two file-carrying actions
const UPLOAD_ACTIONS = ["expense_read_receipt", "expense_submit"];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // decoded
const RATE_LIMIT = 120; // requests per minute per token
const DEPARTMENTS = ["props", "locations", "makeup_sfx", "wardrobe", "vehicles"];
const CREW_DEPARTMENTS = [
  "Director", "Producer", "Assistant Director", "Camera", "Lighting / Grip",
  "Sound", "Art Department", "Props", "Locations", "Wardrobe", "Makeup & SFX",
  "Special Effects", "Stunts", "Catering", "Transport / Vehicles",
  "Post Production", "Music", "Cast", "Vendor", "Other",
];
const PAYMENT_METHODS = ["reimburse", "per_diem", "company_card"];
const REF_HOSTS = [
  "openverse.org", "api.openverse.org",
  "upload.wikimedia.org", "commons.wikimedia.org", "wikimedia.org",
  "flickr.com", "live.staticflickr.com", "staticflickr.com",
];

// AI receipt reading is billed to the production owner, so cap the abuse surface.
const AI_READS_PER_CREW_24H = 25;
const AI_READS_PER_PROJECT_24H = 150;
const AI_LOG_NAME = "read-receipt-crew";

// Crew-posted messages are translated on the owner's credits, so cap them too.
const TRANSLATE_LOG_NAME = "translate-message-crew";
const POSTS_PER_CREW_24H = 30;
const POSTS_PER_PROJECT_24H = 200;
const MAX_CREW_MESSAGE = 5000;
const MESSAGE_FIELDS =
  "id, subject, source_language, source_text, translations, created_by_name, created_at";

// Crew-written production notes are translated on the owner's credits too.
const TRANSLATE_NOTE_LOG_NAME = "translate-note-crew";
const NOTES_PER_CREW_24H = 40;
const NOTES_PER_PROJECT_24H = 300;
const MAX_CREW_NOTE = 2000;
const NOTE_TAGS = [
  "general", "talent", "location", "props", "wardrobe", "makeup",
  "camera", "sound", "safety", "director", "ad", "production",
];
const NOTE_PRIORITIES = ["normal", "important", "urgent"];
// created_by_user_id is deliberately never returned to the crew.
const NOTE_CREW_FIELDS =
  "id, tag, body, source_language, translations, shoot_day, scene_id, priority, pinned, resolved, resolved_by_name, resolved_at, created_by_name, created_by_department, created_by_crew_id, created_at";
const isDay = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

const PHOTO_FIELDS =
  "id, item_id, project_id, storage_path, external_url, is_reference, status, feedback, uploaded_by_name, uploaded_by_crew_id, decided_by_name, decided_at, created_at";
const ITEM_FIELDS =
  "id, scene_id, department, text, original_text, source, flagged, checked, checked_by_name, checked_at, added_by_name, added_by_crew_id, sort_order";
const SIGNOFF_FIELDS = "id, scene_id, department, status, note, by_name, by_department, updated_at";
const EXPENSE_SAFE_FIELDS =
  "id, project_id, kind, department, vendor, description, expense_date, currency, amount, payment_method, status, status_note, notes, line_items, invoice_number, bill_to, receipt_path, item_photo_path, linked_item_id, submitted_by_name, submitted_by_email, created_at";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const NOT_FOUND = () => json({ error: "This link is no longer active." }, 404);
const FORBIDDEN = (msg = "Not allowed.") => json({ error: msg }, 403);
const BAD = (msg: string) => json({ error: msg }, 400);

// ---- rate limiting (per instance, per token) -------------------------------
const hits = new Map<string, number[]>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > RATE_LIMIT;
}

async function sha256(value: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function decodeBase64(value: string): Uint8Array {
  const clean = value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
  const bin = atob(clean);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** JPEG / PNG / WebP magic bytes */
function isImage(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true;
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  return riff === "RIFF" && webp === "WEBP";
}

function isPdfBytes(bytes: Uint8Array): boolean {
  return bytes.length > 4 && String.fromCharCode(...bytes.slice(0, 4)) === "%PDF";
}

/** Validates a base64 receipt/invoice file against its declared mime type. */
function checkReceiptFile(base64: string, mime: string): { bytes: Uint8Array } | Response {
  if (!RECEIPT_MIME_TYPES.includes(mime)) return BAD("Please use a JPG, PNG, WEBP or PDF.");
  let bytes: Uint8Array;
  try {
    bytes = decodeBase64(base64);
  } catch {
    return BAD("That file couldn't be read.");
  }
  if (bytes.byteLength > MAX_RECEIPT_BYTES) return BAD("That file is too large. Please use one under 8 MB.");
  const okBytes = mime === "application/pdf" ? isPdfBytes(bytes) : isImage(bytes);
  if (!okBytes) return BAD("That file doesn't look like a JPG, PNG, WEBP or PDF.");
  return { bytes };
}

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeReferenceUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return REF_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
const round2 = (n: number) => Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
const today = () => new Date().toISOString().slice(0, 10);

/** Fire-and-report a Resend email. Never throws. */
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    console.error("RESEND_API_KEY is not configured — skipping email");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Filmmaker Genius <noreply@filmmakergenius.com>",
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", res.status, (await res.text()).slice(0, 500));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend request failed:", (err as Error)?.message);
    return false;
  }
}

function expenseEmailRows(rows: [string, string][]): string {
  return rows
    .filter(([, value]) => !!value)
    .map(([label, value]) => `
      <tr>
        <td style="padding:6px 12px 6px 0;color:#666;font-size:13px;">${escapeHtml(label)}</td>
        <td style="padding:6px 0;color:#121220;font-size:14px;">${escapeHtml(value)}</td>
      </tr>`)
    .join("");
}

const emailShell = (heading: string, inner: string) => `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#121220;">
    <h1 style="font-size:20px;margin:0 0 8px;">${heading}</h1>
    <p style="color:#00b08c;font-weight:700;letter-spacing:.06em;font-size:12px;margin:0 0 20px;">RECEIPTS &amp; EXPENSES</p>
    ${inner}
    <p style="margin-top:28px;font-size:12px;color:#999;">Filmmaker Genius · Where Genius Meets the Silver Screen</p>
  </div>`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_UPLOAD_BODY) return json({ error: "Request too large" }, 413);

  let body: Record<string, any>;
  let rawLength = 0;
  try {
    const raw = await req.text();
    rawLength = raw.length;
    body = JSON.parse(raw);
  } catch {
    return BAD("Invalid request.");
  }

  const token = text(body.token, 200);
  const action = text(body.action, 40);
  if (!token || !action) return BAD("Missing token or action.");
  if (!UPLOAD_ACTIONS.includes(action) && rawLength > MAX_BODY) {
    return json({ error: "Request too large" }, 413);
  }
  if (rateLimited(token)) return json({ error: "Too many requests. Slow down a moment." }, 429);

  const admin = serviceClient();

  // ---- resolve project by share token -------------------------------------
  const { data: project } = await admin
    .from("breakdown_projects")
    .select("id, title, company, status, sharing_enabled, default_currency, notify_expenses, owner_id, languages, shoot_location")
    .eq("share_token", token)
    .maybeSingle();
  if (!project || !project.sharing_enabled) return NOT_FOUND();
  const projectId = project.id as string;
  const ownerId = project.owner_id as string;

  // ---- crew identity ------------------------------------------------------
  let crew: { id: string; name: string; department: string | null; preferred_language: string | null } | null = null;
  if (action !== "load" && action !== "join") {
    const crewId = text(body.crew_id, 64);
    const secret = text(body.crew_secret, 200);
    if (!crewId || !secret) return FORBIDDEN("Please tell us who you are first.");
    const { data: row } = await admin
      .from("breakdown_crew")
      .select("id, name, department, preferred_language, crew_secret_hash, project_id")
      .eq("id", crewId)
      .maybeSingle();
    if (!row || row.project_id !== projectId) return FORBIDDEN("Please tell us who you are first.");
    if (!row.crew_secret_hash || row.crew_secret_hash !== (await sha256(secret))) {
      return FORBIDDEN("Please tell us who you are first.");
    }
    crew = {
      id: row.id as string,
      name: row.name as string,
      department: (row.department as string) ?? null,
      preferred_language: (row.preferred_language as string) ?? null,
    };
    await admin.from("breakdown_crew").update({ last_seen_at: new Date().toISOString() }).eq("id", crew.id);
  }

  // ---- ownership guards ---------------------------------------------------
  const sceneInProject = async (sceneId: string) => {
    if (!sceneId) return false;
    const { data } = await admin.from("breakdown_scenes").select("id").eq("id", sceneId).eq("project_id", projectId).maybeSingle();
    return !!data;
  };
  const getItem = async (itemId: string) => {
    if (!itemId) return null;
    const { data } = await admin.from("breakdown_items").select(`${ITEM_FIELDS}, project_id`).eq("id", itemId).eq("project_id", projectId).maybeSingle();
    return data as any;
  };
  const getPhoto = async (photoId: string) => {
    if (!photoId) return null;
    const { data } = await admin.from("breakdown_photos").select(PHOTO_FIELDS).eq("id", photoId).eq("project_id", projectId).maybeSingle();
    return data as any;
  };

  const storePhoto = async (itemId: string, image: unknown): Promise<{ path: string } | Response> => {
    if (typeof image !== "string" || !image) return BAD("No image supplied.");
    let bytes: Uint8Array;
    try {
      bytes = decodeBase64(image);
    } catch {
      return BAD("That image couldn't be read.");
    }
    if (bytes.byteLength > MAX_IMAGE_BYTES) return BAD("That photo is too large. Please try a smaller one.");
    if (!isImage(bytes)) return BAD("Only JPEG, PNG or WebP photos are accepted.");
    const path = `${projectId}/${itemId}/${crypto.randomUUID()}.jpg`;
    const { error } = await admin.storage.from(BUCKET).upload(path, bytes, { contentType: "image/jpeg", upsert: false });
    if (error) return json({ error: "The photo couldn't be stored." }, 500);
    return { path };
  };

  /** Sign private expense files for the crew member's own submissions. */
  const signExpensePaths = async (paths: string[]): Promise<Record<string, string>> => {
    const unique = Array.from(new Set(paths.filter(Boolean)));
    const out: Record<string, string> = {};
    if (!unique.length) return out;
    const { data } = await admin.storage.from(EXPENSE_BUCKET).createSignedUrls(unique, 3600);
    (data || []).forEach((row: any, i: number) => {
      const path = row.path || unique[i];
      if (row.signedUrl && path) out[path] = row.signedUrl;
    });
    return out;
  };

  /** A production note the crew member is allowed to see. */
  const getNote = async (noteId: string) => {
    if (!noteId) return null;
    const { data } = await admin
      .from("production_notes")
      .select(`${NOTE_CREW_FIELDS}, project_id`)
      .eq("id", noteId)
      .eq("project_id", projectId)
      .maybeSingle();
    return data as any;
  };

  /**
   * Translates a crew note on the OWNER's credits, under the same 24h caps as
   * crew messages. Never throws — when translation isn't possible the caller
   * simply stores the note untranslated.
   */
  const translateNoteBody = async (
    value: string,
  ): Promise<{ source: string | null; translations: Record<string, unknown>; commit: () => Promise<void> } | null> => {
    const languages = productionLanguages(project.languages);
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    const targets = languages.slice(0, MAX_TARGETS);
    if (!apiKey || languages.length < 2 || !targets.length) return null;

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const [{ count: crewCount }, { count: projectCount }] = await Promise.all([
      admin.from("api_usage_logs").select("id", { count: "exact", head: true })
        .eq("function_name", TRANSLATE_NOTE_LOG_NAME).gte("created_at", since)
        .filter("metadata->>crew_id", "eq", crew!.id),
      admin.from("api_usage_logs").select("id", { count: "exact", head: true })
        .eq("function_name", TRANSLATE_NOTE_LOG_NAME).gte("created_at", since)
        .filter("metadata->>project_id", "eq", projectId),
    ]);
    if ((crewCount ?? 0) >= NOTES_PER_CREW_24H || (projectCount ?? 0) >= NOTES_PER_PROJECT_24H) return null;

    const balance = await ensureBalance(ownerId, 1);
    if (!balance.ok) return null;

    const startedAt = Date.now();
    const { result } = await translateWithRetry(apiKey, targets, null, value, "auto");
    if (!result) return null;

    const fallback = crew!.preferred_language && languages.includes(crew!.preferred_language)
      ? crew!.preferred_language
      : languages[0] || "en";
    const storedSource = result.detected || fallback;
    const translations = buildTranslationsColumn(result, storedSource);
    if (!Object.keys(translations).length) return null;

    return {
      source: storedSource,
      translations,
      // Only bill once the row is safely written.
      commit: async () => {
        await charge(ownerId, 1, TRANSLATE_NOTE_LOG_NAME, { project_id: projectId, crew_id: crew!.id });
        await logUsage({
          userId: ownerId,
          functionName: TRANSLATE_NOTE_LOG_NAME,
          provider: "lovable-gateway",
          operation: "text",
          tokensInput: result.usage?.prompt_tokens,
          tokensOutput: result.usage?.completion_tokens,
          estimatedCostUsd: estimateUsd(result.usage?.prompt_tokens, result.usage?.completion_tokens),
          status: "success",
          latencyMs: Date.now() - startedAt,
          metadata: { project_id: projectId, crew_id: crew!.id },
        });
      },
    };
  };



  try {
    switch (action) {
      // ---------------------------------------------------------------- load
      case "load": {
        const [{ data: scenes }, { data: items }, { data: signoffs }, { data: photos }] = await Promise.all([
          admin.from("breakdown_scenes").select("id, scene_number, label, script_text, sort_order, created_at")
            .eq("project_id", projectId).order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
          admin.from("breakdown_items").select(ITEM_FIELDS).eq("project_id", projectId).order("sort_order", { ascending: true }),
          admin.from("breakdown_signoffs").select(SIGNOFF_FIELDS).eq("project_id", projectId),
          admin.from("breakdown_photos").select(PHOTO_FIELDS).eq("project_id", projectId).order("created_at", { ascending: true }),
        ]);

        const paths = (photos || []).map((p: any) => p.storage_path).filter((p: string | null): p is string => !!p);
        const urls: Record<string, string> = {};
        if (paths.length) {
          const { data: signed } = await admin.storage.from(BUCKET).createSignedUrls(paths, 3600);
          (signed || []).forEach((row: any, i: number) => {
            const path = row.path || paths[i];
            if (row.signedUrl && path) urls[path] = row.signedUrl;
          });
        }
        return json({
          project: {
            title: project.title,
            company: project.company,
            status: project.status,
            default_currency: project.default_currency || "USD",
            languages: productionLanguages(project.languages),
            shoot_location: project.shoot_location || null,
          },
          scenes: scenes || [],
          items: items || [],
          signoffs: signoffs || [],
          photos: photos || [],
          urls,
        });
      }

      // ---------------------------------------------------------------- join
      case "join": {
        const name = text(body.name, 40);
        const department = text(body.department, 60);
        if (name.length < 1) return BAD("Please enter your first name.");
        if (!CREW_DEPARTMENTS.includes(department)) return BAD("Please pick your department.");
        const secret = crypto.randomUUID() + crypto.randomUUID();
        const { data, error } = await admin
          .from("breakdown_crew")
          .insert({ project_id: projectId, name, department, crew_secret_hash: await sha256(secret) })
          .select("id")
          .single();
        if (error || !data) return json({ error: "Could not join this breakdown." }, 500);
        return json({ crew_id: data.id, crew_secret: secret, name, department });
      }

      // -------------------------------------------------------- update_profile
      case "update_profile": {
        const patch: Record<string, unknown> = {};
        const hasLanguage = Object.prototype.hasOwnProperty.call(body, "preferred_language");
        const name = text(body.name, 40);
        const department = text(body.department, 60);

        // Name + department stay required unless this is a language-only update.
        if (!hasLanguage || name || department) {
          if (!name) return BAD("Please enter your first name.");
          if (!CREW_DEPARTMENTS.includes(department)) return BAD("Please pick your department.");
          patch.name = name;
          patch.department = department;
        }

        let preferred: string | null = null;
        if (hasLanguage) {
          const raw = text(body.preferred_language, 10).toLowerCase();
          if (raw) {
            if (!productionLanguages(project.languages).includes(raw)) {
              return BAD("That isn't one of this production's languages.");
            }
            preferred = raw;
          }
          patch.preferred_language = preferred;
        }

        await admin.from("breakdown_crew").update(patch).eq("id", crew!.id);
        return json({
          ok: true,
          name: (patch.name as string) ?? crew!.name,
          department: (patch.department as string) ?? crew!.department,
          preferred_language: hasLanguage ? preferred : undefined,
        });
      }

      // ----------------------------------------------------------- set_checked
      case "set_checked": {
        const item = await getItem(text(body.item_id, 64));
        if (!item) return NOT_FOUND();
        const checked = body.checked === true;
        const patch = {
          checked,
          checked_by_name: checked ? crew!.name : null,
          checked_at: checked ? new Date().toISOString() : null,
        };
        const { data, error } = await admin.from("breakdown_items").update(patch).eq("id", item.id).select(ITEM_FIELDS).single();
        if (error) return json({ error: "Couldn't save that." }, 500);
        return json({ item: data });
      }

      // ------------------------------------------------------------- edit_item
      case "edit_item": {
        const item = await getItem(text(body.item_id, 64));
        if (!item) return NOT_FOUND();
        const value = text(body.text, 300);
        if (!value) return BAD("Please enter some text.");
        const { data, error } = await admin.from("breakdown_items").update({ text: value }).eq("id", item.id).select(ITEM_FIELDS).single();
        if (error) return json({ error: "Couldn't save that." }, 500);
        return json({ item: data });
      }

      // -------------------------------------------------------------- add_item
      case "add_item": {
        const sceneId = text(body.scene_id, 64);
        if (!(await sceneInProject(sceneId))) return NOT_FOUND();
        const department = text(body.department, 40);
        if (!DEPARTMENTS.includes(department)) return BAD("Unknown department.");
        const asNote = body.as_note === true;
        const value = text(body.text, asNote ? 1000 : 300);
        if (!value) return BAD("Please enter some text.");
        const { data: existing } = await admin.from("breakdown_items")
          .select("sort_order").eq("scene_id", sceneId).eq("department", department)
          .order("sort_order", { ascending: false }).limit(1);
        const nextOrder = ((existing?.[0]?.sort_order as number | undefined) ?? -1) + 1;
        const { data, error } = await admin.from("breakdown_items").insert({
          scene_id: sceneId,
          project_id: projectId,
          department,
          text: value,
          source: asNote ? "note" : "manual",
          flagged: asNote,
          added_by_name: crew!.name,
          added_by_crew_id: crew!.id,
          sort_order: nextOrder,
        }).select(ITEM_FIELDS).single();
        if (error || !data) return json({ error: "The item wasn't added." }, 500);
        return json({ item: data });
      }

      // ----------------------------------------------------------- delete_item
      case "delete_item": {
        const item = await getItem(text(body.item_id, 64));
        if (!item) return NOT_FOUND();
        if (item.added_by_crew_id !== crew!.id) return FORBIDDEN("You can only remove items you added.");
        const { data: itemPhotos } = await admin.from("breakdown_photos").select("storage_path").eq("item_id", item.id);
        const paths = (itemPhotos || []).map((p: any) => p.storage_path).filter((p: string | null): p is string => !!p);
        if (paths.length) await admin.storage.from(BUCKET).remove(paths);
        const { error } = await admin.from("breakdown_items").delete().eq("id", item.id);
        if (error) return json({ error: "Couldn't remove that." }, 500);
        return json({ ok: true });
      }

      // ---------------------------------------------------------- set_signoff
      case "set_signoff": {
        const sceneId = text(body.scene_id, 64);
        if (!(await sceneInProject(sceneId))) return NOT_FOUND();
        const department = text(body.department, 40);
        if (!DEPARTMENTS.includes(department)) return BAD("Unknown department.");
        const status = body.status === null || body.status === undefined ? null : text(body.status, 20);
        if (status === null) {
          await admin.from("breakdown_signoffs").delete().eq("scene_id", sceneId).eq("department", department);
          return json({ signoff: null });
        }
        if (status !== "good" && status !== "need_help") return BAD("Unknown status.");
        const note = text(body.note, 1000) || null;
        const { data, error } = await admin.from("breakdown_signoffs").upsert({
          scene_id: sceneId,
          project_id: projectId,
          department,
          status,
          note,
          by_name: crew!.name,
          by_department: crew!.department,
          updated_at: new Date().toISOString(),
        }, { onConflict: "scene_id,department" }).select(SIGNOFF_FIELDS).single();
        if (error || !data) return json({ error: "The sign-off wasn't saved." }, 500);
        return json({ signoff: data });
      }

      // ---------------------------------------------------------- upload_photo
      case "upload_photo": {
        const item = await getItem(text(body.item_id, 64));
        if (!item) return NOT_FOUND();
        const stored = await storePhoto(item.id, body.image_base64);
        if (stored instanceof Response) return stored;
        const { data, error } = await admin.from("breakdown_photos").insert({
          item_id: item.id,
          project_id: projectId,
          storage_path: stored.path,
          status: "awaiting",
          uploaded_by_name: crew!.name,
          uploaded_by_crew_id: crew!.id,
        }).select(PHOTO_FIELDS).single();
        if (error || !data) {
          await admin.storage.from(BUCKET).remove([stored.path]);
          return json({ error: "The photo couldn't be saved." }, 500);
        }
        const { data: signed } = await admin.storage.from(BUCKET).createSignedUrl(stored.path, 3600);
        return json({ photo: data, url: signed?.signedUrl });
      }

      // --------------------------------------------------------- replace_photo
      case "replace_photo": {
        const photo = await getPhoto(text(body.photo_id, 64));
        if (!photo) return NOT_FOUND();
        if (photo.uploaded_by_crew_id !== crew!.id) return FORBIDDEN("You can only replace photos you uploaded.");
        const stored = await storePhoto(photo.item_id, body.image_base64);
        if (stored instanceof Response) return stored;
        const { data, error } = await admin.from("breakdown_photos").update({
          storage_path: stored.path,
          status: "awaiting",
          feedback: null,
          decided_by_name: null,
          decided_at: null,
          uploaded_by_name: crew!.name,
        }).eq("id", photo.id).select(PHOTO_FIELDS).single();
        if (error || !data) {
          await admin.storage.from(BUCKET).remove([stored.path]);
          return json({ error: "The photo couldn't be replaced." }, 500);
        }
        if (photo.storage_path) await admin.storage.from(BUCKET).remove([photo.storage_path]);
        const { data: signed } = await admin.storage.from(BUCKET).createSignedUrl(stored.path, 3600);
        return json({ photo: data, url: signed?.signedUrl });
      }

      // ---------------------------------------------------------- delete_photo
      case "delete_photo": {
        const photo = await getPhoto(text(body.photo_id, 64));
        if (!photo) return NOT_FOUND();
        if (photo.uploaded_by_crew_id !== crew!.id) return FORBIDDEN("You can only delete photos you uploaded.");
        const { error } = await admin.from("breakdown_photos").delete().eq("id", photo.id);
        if (error) return json({ error: "Couldn't remove that photo." }, 500);
        if (photo.storage_path) await admin.storage.from(BUCKET).remove([photo.storage_path]);
        return json({ ok: true });
      }

      // ---------------------------------------------------------- decide_photo
      case "decide_photo": {
        const photo = await getPhoto(text(body.photo_id, 64));
        if (!photo) return NOT_FOUND();
        const status = text(body.status, 20);
        if (status !== "approved" && status !== "rejected") return BAD("Unknown status.");
        const { data, error } = await admin.from("breakdown_photos").update({
          status,
          feedback: status === "rejected" ? text(body.feedback, 1000) || null : null,
          decided_by_name: crew!.name,
          decided_at: new Date().toISOString(),
        }).eq("id", photo.id).select(PHOTO_FIELDS).single();
        if (error || !data) return json({ error: "Couldn't save that decision." }, 500);
        return json({ photo: data });
      }

      // ------------------------------------------------------- attach_reference
      case "attach_reference": {
        const item = await getItem(text(body.item_id, 64));
        if (!item) return NOT_FOUND();
        const url = text(body.external_url, 1000);
        if (!safeReferenceUrl(url)) return BAD("That image source isn't allowed.");
        const { data, error } = await admin.from("breakdown_photos").insert({
          item_id: item.id,
          project_id: projectId,
          external_url: url,
          is_reference: true,
          status: "approved",
          uploaded_by_name: crew!.name,
          uploaded_by_crew_id: crew!.id,
        }).select(PHOTO_FIELDS).single();
        if (error || !data) return json({ error: "The reference image couldn't be attached." }, 500);
        return json({ photo: data });
      }

      // ------------------------------------------------- expense_read_receipt
      case "expense_read_receipt": {
        const apiKey = Deno.env.get("LOVABLE_API_KEY");
        if (!apiKey) return json({ ai_unavailable: true });

        const fileBase64 = typeof body.file_base64 === "string" ? body.file_base64 : "";
        const mime = text(body.mime_type, 60).toLowerCase();
        if (!fileBase64) return BAD("No file supplied.");
        const checked = checkReceiptFile(fileBase64, mime);
        if (checked instanceof Response) return checked;

        // Abuse caps (24h), counted from the usage log.
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const [{ count: crewCount }, { count: projectCount }] = await Promise.all([
          admin.from("api_usage_logs").select("id", { count: "exact", head: true })
            .eq("function_name", AI_LOG_NAME).gte("created_at", since)
            .filter("metadata->>crew_id", "eq", crew!.id),
          admin.from("api_usage_logs").select("id", { count: "exact", head: true })
            .eq("function_name", AI_LOG_NAME).gte("created_at", since)
            .filter("metadata->>project_id", "eq", projectId),
        ]);
        if ((crewCount ?? 0) >= AI_READS_PER_CREW_24H || (projectCount ?? 0) >= AI_READS_PER_PROJECT_24H) {
          return json({ ai_unavailable: true });
        }

        // The production owner pays for the read — never reveal their balance.
        const balance = await ensureBalance(ownerId, 1);
        if (!balance.ok) return json({ ai_unavailable: true });

        const started = Date.now();
        const ai = await callReceiptAi(apiKey, fileBase64, mime);
        if (!ai.ok) {
          console.error("crew receipt AI error:", ai.status, ai.body.slice(0, 300));
          return json({ ai_unavailable: true });
        }
        const parsed = parseReceipt(ai.content);
        if (!parsed) {
          console.error("crew receipt parse error. Head:", ai.content.slice(0, 200));
          return json({ ai_unavailable: true });
        }

        await charge(ownerId, 1, AI_LOG_NAME, { project_id: projectId, crew_id: crew!.id });
        await logUsage({
          userId: ownerId,
          functionName: AI_LOG_NAME,
          provider: "lovable-gateway",
          operation: "text",
          tokensInput: ai.usage?.prompt_tokens,
          tokensOutput: ai.usage?.completion_tokens,
          estimatedCostUsd: estimateUsd(ai.usage?.prompt_tokens, ai.usage?.completion_tokens),
          status: "success",
          latencyMs: Date.now() - started,
          metadata: { project_id: projectId, crew_id: crew!.id },
        });

        return json(parsed);
      }

      // -------------------------------------------------------- expense_submit
      case "expense_submit": {
        const kind = text(body.kind, 20);
        if (kind !== "receipt" && kind !== "invoice") return BAD("Pick a receipt or an invoice.");
        const department = text(body.department, 60);
        if (!CREW_DEPARTMENTS.includes(department)) return BAD("Please pick your department.");
        const paymentMethod = text(body.payment_method, 30);
        if (!PAYMENT_METHODS.includes(paymentMethod)) return BAD("Please pick how this was paid.");
        const currency = text(body.currency, 3).toUpperCase();
        if (!/^[A-Z]{3}$/.test(currency)) return BAD("Please pick a currency.");
        const amount = round2(Number(body.amount));
        if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000) {
          return BAD("Enter an amount between 0 and 1,000,000.");
        }
        const rawDate = text(body.expense_date, 10);
        const expenseDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : today();
        const notes = text(body.notes, 1000) || null;
        const vendor = text(body.vendor, 200) || null;
        const description = text(body.description, 300) || null;
        const billTo = text(body.bill_to, 200) || null;
        const email = text(body.email, 200);
        if (email && !isEmail(email)) return BAD("That email address doesn't look right.");

        const lineItems = Array.isArray(body.line_items)
          ? body.line_items
              .map((entry: unknown) => {
                if (!entry || typeof entry !== "object") return null;
                const e = entry as Record<string, unknown>;
                const lineText = text(e.text, 200);
                const lineAmount = round2(Number(e.amount));
                const line: Record<string, unknown> = {
                  text: lineText,
                  amount: Number.isFinite(lineAmount) ? lineAmount : 0,
                };
                const qty = Number(e.qty);
                const rate = Number(e.rate);
                if (Number.isFinite(qty)) line.qty = round2(qty);
                if (Number.isFinite(rate)) line.rate = round2(rate);
                if (!lineText && !line.amount) return null;
                return line;
              })
              .filter(Boolean)
              .slice(0, 50)
          : [];

        const linkedItemId = text(body.linked_item_id, 64);
        if (linkedItemId && !(await getItem(linkedItemId))) return BAD("That checklist item isn't in this production.");

        // Invoice numbering per production.
        let invoiceNumber = text(body.invoice_number, 60) || null;
        if (kind === "invoice" && !invoiceNumber) {
          const { data: existing } = await admin
            .from("production_expenses")
            .select("invoice_number")
            .eq("project_id", projectId)
            .not("invoice_number", "is", null);
          let max = 0;
          (existing || []).forEach((row: any) => {
            const match = /(\d+)\s*$/.exec(row.invoice_number || "");
            if (match) max = Math.max(max, Number(match[1]));
          });
          invoiceNumber = `INV-${String(max + 1).padStart(3, "0")}`;
        }

        // Validate files up front so nothing is written on a bad upload.
        const receiptBase64 = typeof body.receipt_base64 === "string" ? body.receipt_base64 : "";
        const receiptMime = text(body.receipt_mime, 60).toLowerCase();
        let receiptBytes: Uint8Array | null = null;
        if (receiptBase64) {
          const okReceipt = checkReceiptFile(receiptBase64, receiptMime);
          if (okReceipt instanceof Response) return okReceipt;
          receiptBytes = okReceipt.bytes;
        }

        const itemPhotoBase64 = typeof body.item_photo_base64 === "string" ? body.item_photo_base64 : "";
        let itemPhotoBytes: Uint8Array | null = null;
        if (itemPhotoBase64) {
          try {
            itemPhotoBytes = decodeBase64(itemPhotoBase64);
          } catch {
            return BAD("That item photo couldn't be read.");
          }
          if (itemPhotoBytes.byteLength > MAX_IMAGE_BYTES) return BAD("That item photo is too large. Please use one under 3 MB.");
          if (!isImage(itemPhotoBytes)) return BAD("Only JPEG, PNG or WebP item photos are accepted.");
        }

        const { data: inserted, error: insertError } = await admin
          .from("production_expenses")
          .insert({
            project_id: projectId,
            kind,
            department,
            vendor,
            description,
            expense_date: expenseDate,
            currency,
            amount,
            payment_method: paymentMethod,
            status: "pending",
            notes,
            line_items: lineItems,
            invoice_number: invoiceNumber,
            bill_to: billTo,
            linked_item_id: linkedItemId || null,
            submitted_by_name: crew!.name,
            submitted_by_email: email || null,
            submitted_by_crew_id: crew!.id,
          })
          .select(EXPENSE_SAFE_FIELDS)
          .single();

        if (insertError || !inserted) {
          console.error("crew expense insert failed:", insertError?.message);
          return json({ error: "That submission couldn't be saved." }, 500);
        }

        const expenseId = inserted.id as string;
        const uploaded: string[] = [];
        const cleanUp = async () => {
          if (uploaded.length) await admin.storage.from(EXPENSE_BUCKET).remove(uploaded);
          await admin.from("production_expenses").delete().eq("id", expenseId);
        };

        const patch: Record<string, string> = {};
        try {
          if (receiptBytes) {
            const path = `${projectId}/${expenseId}/${crypto.randomUUID()}.${EXT_BY_MIME[receiptMime] || "bin"}`;
            const { error } = await admin.storage.from(EXPENSE_BUCKET)
              .upload(path, receiptBytes, { contentType: receiptMime, upsert: false });
            if (error) throw new Error(error.message);
            uploaded.push(path);
            patch.receipt_path = path;
          }
          if (itemPhotoBytes) {
            const path = `${projectId}/${expenseId}/${crypto.randomUUID()}.jpg`;
            const { error } = await admin.storage.from(EXPENSE_BUCKET)
              .upload(path, itemPhotoBytes, { contentType: "image/jpeg", upsert: false });
            if (error) throw new Error(error.message);
            uploaded.push(path);
            patch.item_photo_path = path;
          }
        } catch (err) {
          console.error("crew expense upload failed:", (err as Error)?.message);
          await cleanUp();
          return json({ error: "The attachment couldn't be stored. Please try again." }, 500);
        }

        let expense: Record<string, unknown> = inserted as Record<string, unknown>;
        if (Object.keys(patch).length) {
          const { data: updated, error: updateError } = await admin
            .from("production_expenses")
            .update(patch)
            .eq("id", expenseId)
            .select(EXPENSE_SAFE_FIELDS)
            .single();
          if (updateError || !updated) {
            console.error("crew expense patch failed:", updateError?.message);
            await cleanUp();
            return json({ error: "That submission couldn't be saved." }, 500);
          }
          expense = updated as Record<string, unknown>;
        }

        // ---- emails (never fail the submission) ----------------------------
        const productionTitle = String(project.title || "Production");
        const typeLabel = kind === "invoice" ? "invoice" : "receipt";
        const money = `${currency} ${amount.toFixed(2)}`;
        const rows = expenseEmailRows([
          ["Submitted by", crew!.name],
          ["Department", department],
          ["Date", expenseDate],
          ["Type", kind === "invoice" ? `Invoice ${invoiceNumber || ""}`.trim() : "Receipt"],
          ["Amount", money],
          ["Payment", paymentMethod.replace(/_/g, " ")],
          ["Vendor", vendor || ""],
          ["Notes", notes || ""],
        ]);

        const emailSent = { crew: false, owner: false };

        if (email) {
          emailSent.crew = await sendEmail(
            email,
            `Receipt received — ${productionTitle}`,
            emailShell(escapeHtml(productionTitle), `
              <table style="border-collapse:collapse;">${rows}</table>
              <p style="line-height:1.7;color:#333;margin-top:20px;">Thanks — your ${escapeHtml(typeLabel)} is with the production office. You'll see the status on your link.</p>
            `),
          );
        }

        if (project.notify_expenses) {
          const { data: ownerData } = await admin.auth.admin.getUserById(ownerId);
          const ownerEmail = ownerData?.user?.email;
          if (ownerEmail) {
            emailSent.owner = await sendEmail(
              ownerEmail,
              `New ${typeLabel} from ${crew!.name} — ${money}`,
              emailShell(escapeHtml(productionTitle), `
                <table style="border-collapse:collapse;">${rows}</table>
                <p style="line-height:1.7;color:#333;margin-top:20px;">
                  <a href="https://filmmakergenius.com/receipts-expenses?project=${escapeHtml(projectId)}" style="color:#00b08c;font-weight:700;">Review it in Receipts &amp; Expenses</a>
                </p>
              `),
            );
          }
        }

        return json({ expense, email_sent: emailSent });
      }

      // ----------------------------------------------------- expense_list_mine
      case "expense_list_mine": {
        const { data, error } = await admin
          .from("production_expenses")
          .select(EXPENSE_SAFE_FIELDS)
          .eq("project_id", projectId)
          .eq("submitted_by_crew_id", crew!.id)
          .order("created_at", { ascending: false })
          .limit(200);
        if (error) return json({ error: "Couldn't load your submissions." }, 500);
        const rows = data || [];
        const urls = await signExpensePaths(
          rows.flatMap((r: any) => [r.receipt_path, r.item_photo_path]).filter((p: string | null): p is string => !!p),
        );
        return json({ expenses: rows, urls });
      }

      // --------------------------------------------------- expense_delete_mine
      case "expense_delete_mine": {
        const expenseId = text(body.expense_id, 64);
        if (!expenseId) return BAD("Which submission?");
        const { data: row } = await admin
          .from("production_expenses")
          .select("id, status, submitted_by_crew_id, receipt_path, item_photo_path")
          .eq("id", expenseId)
          .eq("project_id", projectId)
          .maybeSingle();
        if (!row) return NOT_FOUND();
        if (row.submitted_by_crew_id !== crew!.id) return FORBIDDEN("You can only remove your own submissions.");
        if (row.status !== "pending") return FORBIDDEN("This has already been reviewed — ask the production office.");
        const paths = [row.receipt_path, row.item_photo_path].filter((p): p is string => !!p);
        if (paths.length) await admin.storage.from(EXPENSE_BUCKET).remove(paths);
        const { error } = await admin.from("production_expenses").delete().eq("id", row.id);
        if (error) return json({ error: "Couldn't remove that submission." }, 500);
        return json({ ok: true });
      }

      // --------------------------------------------------------- messages_list
      case "messages_list": {
        const before = text(body.before, 40);
        let query = admin
          .from("production_messages")
          .select(MESSAGE_FIELDS)
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })
          .limit(30);
        if (before && !Number.isNaN(Date.parse(before))) query = query.lt("created_at", before);
        const { data, error } = await query;
        if (error) {
          console.error("crew messages_list failed:", error.message);
          return json({ error: "Couldn't load the messages." }, 500);
        }
        return json({
          messages: data || [],
          languages: productionLanguages(project.languages),
          preferred_language: crew!.preferred_language,
        });
      }

      // ---------------------------------------------------------- message_post
      case "message_post": {
        const subject = text(body.subject, MAX_SUBJECT) || null;
        const value = text(body.text, MAX_CREW_MESSAGE);
        if (value.length < 2) return BAD("Please write a message first.");

        const languages = productionLanguages(project.languages);
        const apiKey = Deno.env.get("LOVABLE_API_KEY");

        /** Saves the message with whatever translations we managed to get. */
        const save = async (
          sourceLanguage: string,
          translations: Record<string, unknown>,
        ) => {
          const { data, error } = await admin
            .from("production_messages")
            .insert({
              project_id: projectId,
              subject,
              source_language: sourceLanguage,
              source_text: value,
              translations,
              source_kind: "text",
              created_by_name: crew!.name,
              created_by_crew_id: crew!.id,
            })
            .select(MESSAGE_FIELDS)
            .single();
          if (error || !data) {
            console.error("crew message insert failed:", error?.message);
            return null;
          }
          return data;
        };

        const fallbackSource = crew!.preferred_language && languages.includes(crew!.preferred_language)
          ? crew!.preferred_language
          : languages[0] || "en";

        const untranslated = async () => {
          const saved = await save(fallbackSource, {});
          if (!saved) return json({ error: "That message couldn't be posted." }, 500);
          return json({ message: saved, translated: false });
        };

        const targets = languages.slice(0, MAX_TARGETS);
        if (!apiKey || !targets.length) return await untranslated();

        // 24h abuse caps, counted from the usage log.
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const [{ count: crewCount }, { count: projectCount }] = await Promise.all([
          admin.from("api_usage_logs").select("id", { count: "exact", head: true })
            .eq("function_name", TRANSLATE_LOG_NAME).gte("created_at", since)
            .filter("metadata->>crew_id", "eq", crew!.id),
          admin.from("api_usage_logs").select("id", { count: "exact", head: true })
            .eq("function_name", TRANSLATE_LOG_NAME).gte("created_at", since)
            .filter("metadata->>project_id", "eq", projectId),
        ]);
        if ((crewCount ?? 0) >= POSTS_PER_CREW_24H || (projectCount ?? 0) >= POSTS_PER_PROJECT_24H) {
          return await untranslated();
        }

        // The production owner pays for the translation — never reveal their balance.
        const balance = await ensureBalance(ownerId, 1);
        if (!balance.ok) return await untranslated();

        const startedAt = Date.now();
        const { result } = await translateWithRetry(apiKey, targets, subject, value, "auto");
        if (!result) return await untranslated();

        const detected = result.detected || fallbackSource;
        const storedSource = languages.includes(detected) ? detected : detected || fallbackSource;
        const translations = buildTranslationsColumn(result, storedSource);

        const saved = await save(storedSource, translations);
        if (!saved) return json({ error: "That message couldn't be posted." }, 500);

        await charge(ownerId, 1, TRANSLATE_LOG_NAME, { project_id: projectId, crew_id: crew!.id });
        await logUsage({
          userId: ownerId,
          functionName: TRANSLATE_LOG_NAME,
          provider: "lovable-gateway",
          operation: "text",
          tokensInput: result.usage?.prompt_tokens,
          tokensOutput: result.usage?.completion_tokens,
          estimatedCostUsd: estimateUsd(result.usage?.prompt_tokens, result.usage?.completion_tokens),
          status: "success",
          latencyMs: Date.now() - startedAt,
          metadata: { project_id: projectId, crew_id: crew!.id },
        });

        return json({ message: saved, translated: true });
      }

      // ------------------------------------------------------------ notes_list
      case "notes_list": {
        let query = admin
          .from("production_notes")
          .select(NOTE_CREW_FIELDS)
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })
          .limit(200);
        if (body.include_resolved !== true) query = query.eq("resolved", false);
        const { data, error } = await query;
        if (error) {
          console.error("crew notes_list failed:", error.message);
          return json({ error: "Couldn't load the notes." }, 500);
        }
        return json({
          notes: data || [],
          languages: productionLanguages(project.languages),
          preferred_language: crew!.preferred_language,
        });
      }

      // ------------------------------------------------------------- note_post
      case "note_post": {
        const tag = text(body.tag, 20);
        if (!NOTE_TAGS.includes(tag)) return BAD("Please pick a tag for this note.");
        const priority = text(body.priority, 20) || "normal";
        if (!NOTE_PRIORITIES.includes(priority)) return BAD("Unknown priority.");
        const shootDay = text(body.shoot_day, 10);
        if (shootDay && !isDay(shootDay)) return BAD("That shoot day isn't a valid date.");
        const sceneId = text(body.scene_id, 64);
        if (sceneId && !(await sceneInProject(sceneId))) return NOT_FOUND();
        const value = text(body.body, MAX_CREW_NOTE);
        if (value.length < 2) return BAD("Please write the note first.");

        const translated = await translateNoteBody(value);
        const { data, error } = await admin
          .from("production_notes")
          .insert({
            project_id: projectId,
            tag,
            priority,
            body: value,
            shoot_day: shootDay || null,
            scene_id: sceneId || null,
            source_language: translated?.source ?? null,
            translations: translated?.translations ?? {},
            created_by_name: crew!.name,
            created_by_department: crew!.department,
            created_by_crew_id: crew!.id,
          })
          .select(NOTE_CREW_FIELDS)
          .single();
        if (error || !data) {
          console.error("crew note insert failed:", error?.message);
          return json({ error: "That note couldn't be saved." }, 500);
        }
        if (translated) await translated.commit();
        return json({ note: data, translated: !!translated });
      }

      // ---------------------------------------------------------- note_resolve
      case "note_resolve": {
        const note = await getNote(text(body.note_id, 64));
        if (!note) return NOT_FOUND();
        const resolved = body.resolved === true;
        const { data, error } = await admin
          .from("production_notes")
          .update({
            resolved,
            resolved_by_name: resolved ? crew!.name : null,
            resolved_at: resolved ? new Date().toISOString() : null,
          })
          .eq("id", note.id)
          .select(NOTE_CREW_FIELDS)
          .single();
        if (error || !data) return json({ error: "Couldn't save that." }, 500);
        return json({ note: data });
      }

      // ------------------------------------------------------------- note_edit
      case "note_edit": {
        const note = await getNote(text(body.note_id, 64));
        if (!note) return NOT_FOUND();
        if (note.created_by_crew_id !== crew!.id) return FORBIDDEN("You can only change notes you wrote.");

        const patch: Record<string, unknown> = {};
        if (body.tag !== undefined) {
          const tag = text(body.tag, 20);
          if (!NOTE_TAGS.includes(tag)) return BAD("Please pick a tag for this note.");
          patch.tag = tag;
        }
        if (body.priority !== undefined) {
          const priority = text(body.priority, 20);
          if (!NOTE_PRIORITIES.includes(priority)) return BAD("Unknown priority.");
          patch.priority = priority;
        }
        if (body.shoot_day !== undefined) {
          const shootDay = text(body.shoot_day, 10);
          if (shootDay && !isDay(shootDay)) return BAD("That shoot day isn't a valid date.");
          patch.shoot_day = shootDay || null;
        }
        if (body.scene_id !== undefined) {
          const sceneId = text(body.scene_id, 64);
          if (sceneId && !(await sceneInProject(sceneId))) return NOT_FOUND();
          patch.scene_id = sceneId || null;
        }

        let translated: Awaited<ReturnType<typeof translateNoteBody>> = null;
        if (body.body !== undefined) {
          const value = text(body.body, MAX_CREW_NOTE);
          if (value.length < 2) return BAD("Please write the note first.");
          patch.body = value;
          if (value !== note.body) {
            // New wording invalidates the old translations.
            translated = await translateNoteBody(value);
            patch.source_language = translated?.source ?? null;
            patch.translations = translated?.translations ?? {};
          }
        }
        if (!Object.keys(patch).length) return BAD("Nothing to change.");

        const { data, error } = await admin
          .from("production_notes")
          .update(patch)
          .eq("id", note.id)
          .select(NOTE_CREW_FIELDS)
          .single();
        if (error || !data) return json({ error: "Couldn't save that." }, 500);
        if (translated) await translated.commit();
        return json({ note: data, translated: !!translated });
      }

      // ----------------------------------------------------------- note_delete
      case "note_delete": {
        const note = await getNote(text(body.note_id, 64));
        if (!note) return NOT_FOUND();
        if (note.created_by_crew_id !== crew!.id) return FORBIDDEN("You can only remove notes you wrote.");
        const { error } = await admin.from("production_notes").delete().eq("id", note.id);
        if (error) return json({ error: "Couldn't remove that note." }, 500);
        return json({ ok: true });
      }


      default:
        return BAD("Unknown action.");
    }
  } catch (err) {
    console.error("breakdown-crew failed:", (err as Error)?.message);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
