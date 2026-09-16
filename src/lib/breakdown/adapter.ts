import { supabase } from "@/integrations/supabase/client";
import {
  BreakdownItem,
  BreakdownPhoto,
  BreakdownScene,
  BreakdownSignoff,
  ITEM_FIELDS,
  PHOTO_FIELDS,
  SCENE_FIELDS,
  SIGNOFF_FIELDS,
} from "@/components/breakdown/types";
import { prepareImage } from "./imageDownscale";

export const BUCKET = "breakdown-photos";

export interface SceneEdit {
  scene_number: string | null;
  label: string | null;
  script_text: string;
}

export interface SceneMergeResult {
  kept: number;
  removed: number;
  added: number;
}

export interface BreakdownData {
  scenes: BreakdownScene[];
  items: BreakdownItem[];
  signoffs: BreakdownSignoff[];
  photos: BreakdownPhoto[];
  urls?: Record<string, string>;
}

/**
 * One interface, two implementations: the owner talks to Supabase directly
 * (RLS protects the rows), crew members go through the breakdown-crew edge
 * function with their share token. The UI only ever sees this.
 */
export interface BreakdownAdapter {
  mode: "owner" | "crew";
  actorName: string;
  actorDepartment: string | null;
  /** Crew cannot add, delete or break down scenes. */
  canManageScenes: boolean;

  load(): Promise<BreakdownData>;
  signPaths(paths: string[]): Promise<Record<string, string>>;

  setChecked(item: BreakdownItem, checked: boolean): Promise<void>;
  editItem(item: BreakdownItem, text: string): Promise<void>;
  addItem(sceneId: string, department: string, text: string, asNote?: boolean): Promise<BreakdownItem>;
  canDeleteItem(item: BreakdownItem): boolean;
  deleteItem(item: BreakdownItem, itemPhotos: BreakdownPhoto[]): Promise<void>;

  setSignoff(sceneId: string, department: string, status: "good" | "need_help", note?: string): Promise<BreakdownSignoff>;
  clearSignoff(sceneId: string, department: string, existing: BreakdownSignoff): Promise<void>;

  uploadPhoto(item: BreakdownItem, file: File): Promise<{ photo: BreakdownPhoto; url?: string }>;
  replacePhoto(photo: BreakdownPhoto, file: File): Promise<{ photo: BreakdownPhoto; url?: string }>;
  canModifyPhoto(photo: BreakdownPhoto): boolean;
  deletePhoto(photo: BreakdownPhoto): Promise<void>;
  decidePhoto(photo: BreakdownPhoto, status: "approved" | "rejected", feedback?: string): Promise<void>;
  attachReference(itemId: string, url: string): Promise<BreakdownPhoto>;

  deleteScene?(scene: BreakdownScene, scenePhotos: BreakdownPhoto[]): Promise<void>;
  /** Owner only — save the scene's number, label and script text. */
  updateScene?(sceneId: string, patch: SceneEdit): Promise<void>;
  /** Owner only — re-run the AI breakdown on an existing scene (1 credit). */
  rerunScene?(sceneId: string, patch: SceneEdit): Promise<SceneMergeResult>;
  /** Live updates: realtime for the owner, polling for crew. Returns an unsubscribe. */
  watch(sceneId: string, onChange: () => void): () => void;
}

// ===========================================================================
// OWNER — authenticated Supabase client, RLS scoped to the owner/admin
// ===========================================================================
export function createOwnerAdapter(opts: {
  projectId: string;
  actorName: string;
  actorDepartment?: string | null;
}): BreakdownAdapter {
  const { projectId, actorName } = opts;

  const removeStorage = async (rows: BreakdownPhoto[]) => {
    const paths = rows.map((p) => p.storage_path).filter((p): p is string => !!p);
    if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
  };

  const uploadFile = async (itemId: string, file: File) => {
    const blob = await prepareImage(file);
    const path = `${projectId}/${itemId}/${crypto.randomUUID()}.jpg`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (error) throw new Error(error.message);
    return path;
  };

  const fail = (message?: string) => {
    throw new Error(message || "That change couldn't be saved.");
  };

  return {
    mode: "owner",
    actorName,
    actorDepartment: opts.actorDepartment ?? null,
    canManageScenes: true,

    async load() {
      const [{ data: scenes }, { data: items }, { data: signoffs }, { data: photos }] = await Promise.all([
        supabase.from("breakdown_scenes").select(SCENE_FIELDS).eq("project_id", projectId)
          .order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
        supabase.from("breakdown_items").select(ITEM_FIELDS).eq("project_id", projectId)
          .order("sort_order", { ascending: true }),
        supabase.from("breakdown_signoffs").select(SIGNOFF_FIELDS).eq("project_id", projectId),
        supabase.from("breakdown_photos").select(PHOTO_FIELDS).eq("project_id", projectId)
          .order("created_at", { ascending: true }),
      ]);
      return {
        scenes: (scenes || []) as BreakdownScene[],
        items: (items || []) as BreakdownItem[],
        signoffs: (signoffs || []) as BreakdownSignoff[],
        photos: (photos || []) as BreakdownPhoto[],
      };
    },

    async signPaths(paths) {
      const out: Record<string, string> = {};
      if (!paths.length) return out;
      const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 3600);
      if (error || !data) return out;
      data.forEach((row: any, i: number) => {
        const path = row.path || paths[i];
        if (row.signedUrl && path) out[path] = row.signedUrl;
      });
      return out;
    },

    async setChecked(item, checked) {
      const { error } = await supabase.from("breakdown_items").update({
        checked,
        checked_by_name: checked ? actorName : null,
        checked_at: checked ? new Date().toISOString() : null,
      }).eq("id", item.id);
      if (error) fail(error.message);
    },

    async editItem(item, text) {
      const { error } = await supabase.from("breakdown_items").update({ text }).eq("id", item.id);
      if (error) fail(error.message);
    },

    async addItem(sceneId, department, text, asNote) {
      const { data: existing } = await supabase.from("breakdown_items")
        .select("sort_order").eq("scene_id", sceneId).eq("department", department)
        .order("sort_order", { ascending: false }).limit(1);
      const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;
      const { data, error } = await supabase.from("breakdown_items").insert({
        scene_id: sceneId,
        project_id: projectId,
        department,
        text,
        source: asNote ? "note" : "manual",
        flagged: !!asNote,
        added_by_name: actorName,
        sort_order: nextOrder,
      }).select(ITEM_FIELDS).single();
      if (error || !data) fail(error?.message);
      return data as unknown as BreakdownItem;
    },

    canDeleteItem() { return true; },

    async deleteItem(item, itemPhotos) {
      await removeStorage(itemPhotos);
      const { error } = await supabase.from("breakdown_items").delete().eq("id", item.id);
      if (error) fail(error.message);
    },

    async setSignoff(sceneId, department, status, note) {
      const { data, error } = await supabase.from("breakdown_signoffs").upsert({
        scene_id: sceneId,
        project_id: projectId,
        department,
        status,
        note: note ?? null,
        by_name: actorName,
        by_department: opts.actorDepartment ?? null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "scene_id,department" }).select(SIGNOFF_FIELDS).single();
      if (error || !data) fail(error?.message);
      return data as unknown as BreakdownSignoff;
    },

    async clearSignoff(_sceneId, _department, existing) {
      const { error } = await supabase.from("breakdown_signoffs").delete().eq("id", existing.id);
      if (error) fail(error.message);
    },

    async uploadPhoto(item, file) {
      const path = await uploadFile(item.id, file);
      const { data, error } = await supabase.from("breakdown_photos").insert({
        item_id: item.id,
        project_id: projectId,
        storage_path: path,
        status: "awaiting",
        uploaded_by_name: actorName,
      }).select(PHOTO_FIELDS).single();
      if (error || !data) {
        await supabase.storage.from(BUCKET).remove([path]);
        fail(error?.message);
      }
      return { photo: data as unknown as BreakdownPhoto };
    },

    async replacePhoto(photo, file) {
      const path = await uploadFile(photo.item_id, file);
      const { data, error } = await supabase.from("breakdown_photos").update({
        storage_path: path,
        status: "awaiting",
        feedback: null,
        decided_by_name: null,
        decided_at: null,
        uploaded_by_name: actorName,
      }).eq("id", photo.id).select(PHOTO_FIELDS).single();
      if (error || !data) {
        await supabase.storage.from(BUCKET).remove([path]);
        fail(error?.message);
      }
      if (photo.storage_path) await supabase.storage.from(BUCKET).remove([photo.storage_path]);
      return { photo: data as unknown as BreakdownPhoto };
    },

    canModifyPhoto() { return true; },

    async deletePhoto(photo) {
      const { error } = await supabase.from("breakdown_photos").delete().eq("id", photo.id);
      if (error) fail(error.message);
      if (photo.storage_path) await supabase.storage.from(BUCKET).remove([photo.storage_path]);
    },

    async decidePhoto(photo, status, feedback) {
      const { error } = await supabase.from("breakdown_photos").update({
        status,
        feedback: status === "rejected" ? feedback ?? null : null,
        decided_by_name: actorName,
        decided_at: new Date().toISOString(),
      }).eq("id", photo.id);
      if (error) fail(error.message);
    },

    async attachReference(itemId, url) {
      const { data, error } = await supabase.from("breakdown_photos").insert({
        item_id: itemId,
        project_id: projectId,
        external_url: url,
        is_reference: true,
        status: "approved",
        uploaded_by_name: actorName,
      }).select(PHOTO_FIELDS).single();
      if (error || !data) fail(error?.message);
      return data as unknown as BreakdownPhoto;
    },

    async deleteScene(scene, scenePhotos) {
      await removeStorage(scenePhotos);
      const { error } = await supabase.from("breakdown_scenes").delete().eq("id", scene.id);
      if (error) fail(error.message);
    },

    watch(sceneId, onChange) {
      const channel = supabase
        .channel(`breakdown-scene-${sceneId}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "breakdown_items", filter: `scene_id=eq.${sceneId}` }, onChange)
        .on("postgres_changes", { event: "*", schema: "public", table: "breakdown_signoffs", filter: `scene_id=eq.${sceneId}` }, onChange)
        .on("postgres_changes", { event: "*", schema: "public", table: "breakdown_photos", filter: `project_id=eq.${projectId}` }, onChange)
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    },
  };
}

// ===========================================================================
// CREW — everything goes through the breakdown-crew edge function
// ===========================================================================
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/breakdown-crew`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export class CrewLinkError extends Error {}

export async function crewCall<T = any>(token: string, action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    body: JSON.stringify({ token, action, ...payload }),
  });
  let body: any = null;
  try { body = await res.json(); } catch { /* ignore */ }
  if (!res.ok) {
    const message = body?.error || "Something went wrong. Please try again.";
    if (res.status === 404) throw new CrewLinkError(message);
    throw new Error(message);
  }
  return body as T;
}

export interface CrewIdentity {
  crew_id: string;
  crew_secret: string;
  name: string;
  department: string;
}

async function fileToBase64(file: File): Promise<string> {
  const blob = await prepareImage(file);
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 8192) {
    bin += String.fromCharCode(...buf.subarray(i, i + 8192));
  }
  return btoa(bin);
}

export function createCrewAdapter(opts: {
  token: string;
  identity: CrewIdentity;
  onUrls: (urls: Record<string, string>) => void;
}): BreakdownAdapter {
  const { token, identity } = opts;
  const auth = { crew_id: identity.crew_id, crew_secret: identity.crew_secret };
  const call = <T = any>(action: string, payload: Record<string, unknown> = {}) =>
    crewCall<T>(token, action, { ...auth, ...payload });

  return {
    mode: "crew",
    actorName: identity.name,
    actorDepartment: identity.department,
    canManageScenes: false,

    async load() {
      const data = await crewCall<BreakdownData>(token, "load");
      if (data.urls) opts.onUrls(data.urls);
      return data;
    },

    async signPaths() { return {}; },

    async setChecked(item, checked) { await call("set_checked", { item_id: item.id, checked }); },
    async editItem(item, text) { await call("edit_item", { item_id: item.id, text }); },

    async addItem(sceneId, department, text, asNote) {
      const res = await call<{ item: BreakdownItem }>("add_item", {
        scene_id: sceneId, department, text, as_note: !!asNote,
      });
      return res.item;
    },

    canDeleteItem(item) { return item.added_by_crew_id === identity.crew_id; },
    async deleteItem(item) { await call("delete_item", { item_id: item.id }); },

    async setSignoff(sceneId, department, status, note) {
      const res = await call<{ signoff: BreakdownSignoff }>("set_signoff", {
        scene_id: sceneId, department, status, note: note ?? null,
      });
      return res.signoff;
    },

    async clearSignoff(sceneId, department) {
      await call("set_signoff", { scene_id: sceneId, department, status: null });
    },

    async uploadPhoto(item, file) {
      const image_base64 = await fileToBase64(file);
      const res = await call<{ photo: BreakdownPhoto; url?: string }>("upload_photo", {
        item_id: item.id, image_base64,
      });
      if (res.url && res.photo.storage_path) opts.onUrls({ [res.photo.storage_path]: res.url });
      return res;
    },

    async replacePhoto(photo, file) {
      const image_base64 = await fileToBase64(file);
      const res = await call<{ photo: BreakdownPhoto; url?: string }>("replace_photo", {
        photo_id: photo.id, image_base64,
      });
      if (res.url && res.photo.storage_path) opts.onUrls({ [res.photo.storage_path]: res.url });
      return res;
    },

    canModifyPhoto(photo) { return photo.uploaded_by_crew_id === identity.crew_id; },
    async deletePhoto(photo) { await call("delete_photo", { photo_id: photo.id }); },

    async decidePhoto(photo, status, feedback) {
      await call("decide_photo", { photo_id: photo.id, status, feedback: feedback ?? null });
    },

    async attachReference(itemId, url) {
      const res = await call<{ photo: BreakdownPhoto }>("attach_reference", { item_id: itemId, external_url: url });
      return res.photo;
    },

    // Poll while the tab is visible.
    watch(_sceneId, onChange) {
      let timer: number | undefined;
      const tick = () => {
        if (document.visibilityState === "visible") onChange();
      };
      timer = window.setInterval(tick, 10_000);
      const onVisible = () => { if (document.visibilityState === "visible") onChange(); };
      document.addEventListener("visibilitychange", onVisible);
      return () => {
        if (timer) window.clearInterval(timer);
        document.removeEventListener("visibilitychange", onVisible);
      };
    },
  };
}
