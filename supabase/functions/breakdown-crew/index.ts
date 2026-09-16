import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { serviceClient } from "../_shared/credits.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "breakdown-photos";
const MAX_BODY = 4 * 1024 * 1024; // 4 MB
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // decoded
const RATE_LIMIT = 120; // requests per minute per token
const DEPARTMENTS = ["props", "locations", "makeup_sfx", "wardrobe", "vehicles"];
const CREW_DEPARTMENTS = [
  "Director", "Producer", "Assistant Director", "Props", "Locations",
  "Makeup & SFX", "Wardrobe", "Transport / Vehicles", "Camera", "Art Department", "Other",
];
const REF_HOSTS = [
  "openverse.org", "api.openverse.org",
  "upload.wikimedia.org", "commons.wikimedia.org", "wikimedia.org",
  "flickr.com", "live.staticflickr.com", "staticflickr.com",
];

const PHOTO_FIELDS =
  "id, item_id, project_id, storage_path, external_url, is_reference, status, feedback, uploaded_by_name, uploaded_by_crew_id, decided_by_name, decided_at, created_at";
const ITEM_FIELDS =
  "id, scene_id, department, text, original_text, source, flagged, checked, checked_by_name, checked_at, added_by_name, added_by_crew_id, sort_order";
const SIGNOFF_FIELDS = "id, scene_id, department, status, note, by_name, by_department, updated_at";

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

function safeReferenceUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return REF_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_BODY) return json({ error: "Request too large" }, 413);

  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return BAD("Invalid request.");
  }

  const token = text(body.token, 200);
  const action = text(body.action, 40);
  if (!token || !action) return BAD("Missing token or action.");
  if (rateLimited(token)) return json({ error: "Too many requests. Slow down a moment." }, 429);

  const admin = serviceClient();

  // ---- resolve project by share token -------------------------------------
  const { data: project } = await admin
    .from("breakdown_projects")
    .select("id, title, company, status, sharing_enabled")
    .eq("share_token", token)
    .maybeSingle();
  if (!project || !project.sharing_enabled) return NOT_FOUND();
  const projectId = project.id as string;

  // ---- crew identity ------------------------------------------------------
  let crew: { id: string; name: string; department: string | null } | null = null;
  if (action !== "load" && action !== "join") {
    const crewId = text(body.crew_id, 64);
    const secret = text(body.crew_secret, 200);
    if (!crewId || !secret) return FORBIDDEN("Please tell us who you are first.");
    const { data: row } = await admin
      .from("breakdown_crew")
      .select("id, name, department, crew_secret_hash, project_id")
      .eq("id", crewId)
      .maybeSingle();
    if (!row || row.project_id !== projectId) return FORBIDDEN("Please tell us who you are first.");
    if (!row.crew_secret_hash || row.crew_secret_hash !== (await sha256(secret))) {
      return FORBIDDEN("Please tell us who you are first.");
    }
    crew = { id: row.id as string, name: row.name as string, department: (row.department as string) ?? null };
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
          project: { title: project.title, company: project.company, status: project.status },
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
        const name = text(body.name, 40);
        const department = text(body.department, 60);
        if (!name) return BAD("Please enter your first name.");
        if (!CREW_DEPARTMENTS.includes(department)) return BAD("Please pick your department.");
        await admin.from("breakdown_crew").update({ name, department }).eq("id", crew!.id);
        return json({ ok: true, name, department });
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

      default:
        return BAD("Unknown action.");
    }
  } catch (err) {
    console.error("breakdown-crew failed:", (err as Error)?.message);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
