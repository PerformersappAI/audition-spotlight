import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pencil, Plus, Trash2, Loader2, Check, X, ChevronDown } from "lucide-react";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { aiInvoke } from "@/lib/aiInvoke";
import { useOCRUpload } from "@/hooks/useOCRUpload";
import { PDFUploadProgress } from "@/components/PDFUploadProgress";
import { toast } from "@/hooks/use-toast";
import DepartmentChecklist from "@/components/breakdown/DepartmentChecklist";
import SignOffBox from "@/components/breakdown/SignOffBox";
import ApprovalsView, { ApprovalRow } from "@/components/breakdown/ApprovalsView";
import PhotoLightbox from "@/components/breakdown/PhotoLightbox";
import ReferenceSearch from "@/components/breakdown/ReferenceSearch";
import { DEPARTMENTS, DeptKey, BreakdownItem, BreakdownSignoff, BreakdownPhoto, PHOTO_FIELDS } from "@/components/breakdown/types";
import { ImageError, prepareImage } from "@/lib/breakdown/imageDownscale";

const BUCKET = "breakdown-photos";

const SITE = "https://filmmakergenius.com";
const TEAL = "#00d4aa";

const STEPS = [
  { n: 1, title: "Upload your scene", text: "PDF or paste text." },
  { n: 2, title: "AI breaks it down by department", text: "Props, locations, wardrobe, makeup & SFX, vehicles." },
  { n: 3, title: "Share a private link with your crew", text: "One link per scene — no accounts needed." },
  { n: 4, title: "Check items off, add photos, sign off", text: "Everyone works from the same checklist." },
];


interface Project {
  id: string;
  title: string;
  company: string | null;
  status: string;
  start_date: string | null;
  created_at: string;
}

interface Scene {
  id: string;
  scene_number: string | null;
  label: string | null;
  script_text: string | null;
  sort_order: number;
  created_at: string;
}


const panel: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 44,
  fontSize: 16,
  padding: "10px 12px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.14)",
  color: "#fff",
  fontFamily: "'Inter Tight', sans-serif",
  boxSizing: "border-box",
};

const primaryBtn: React.CSSProperties = {
  minHeight: 44,
  padding: "0 20px",
  borderRadius: 10,
  background: TEAL,
  color: "#04231d",
  border: "none",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'Inter Tight', sans-serif",
};

const ghostBtn: React.CSSProperties = {
  minHeight: 44,
  padding: "0 16px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.14)",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'Inter Tight', sans-serif",
};

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        ...panel, background: "#10101b", width: "100%", maxWidth: 460, padding: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h2>
        <button onClick={onClose} aria-label="Close" style={{ ...ghostBtn, minWidth: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ScriptBreakdown = () => {
  const { user, userProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get("project") || "";
  const sceneId = searchParams.get("scene") || "";

  const [projects, setProjects] = useState<Project[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [items, setItems] = useState<BreakdownItem[]>([]);
  const [signoffs, setSignoffs] = useState<BreakdownSignoff[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [showNewProject, setShowNewProject] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newStatus, setNewStatus] = useState("in_production");
  const [newStart, setNewStart] = useState("");
  const [creating, setCreating] = useState(false);

  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [scriptText, setScriptText] = useState("");
  const [sceneNumber, setSceneNumber] = useState("");
  const [label, setLabel] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const [activeDept, setActiveDept] = useState<DeptKey>("props");
  const [showScript, setShowScript] = useState(false);
  const [deleteScene, setDeleteScene] = useState<Scene | null>(null);

  const [photos, setPhotos] = useState<BreakdownPhoto[]>([]);
  const [urlMap, setUrlMap] = useState<Record<string, { url: string; exp: number }>>({});
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [view, setView] = useState<"checklist" | "approvals">("checklist");
  const [lightbox, setLightbox] = useState<{ ids: string[]; index: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { processFile, isProcessing, currentStage, elapsedTime, progress, currentFileName, currentFileSize } = useOCRUpload();

  const selectedProject = useMemo(() => projects.find((p) => p.id === projectId) || null, [projects, projectId]);
  const selectedScene = useMemo(() => scenes.find((s) => s.id === sceneId) || null, [scenes, sceneId]);

  const setParams = useCallback((next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  // Load projects
  const loadProjects = useCallback(async () => {
    if (!user) return;
    setLoadingProjects(true);
    const { data } = await supabase
      .from("breakdown_projects")
      .select("id, title, company, status, start_date, created_at")
      .order("created_at", { ascending: false });
    const list = (data || []) as Project[];
    setProjects(list);
    setLoadingProjects(false);
    if (list.length && !list.some((p) => p.id === projectId)) {
      setParams({ project: list[0].id, scene: null });
    }
  }, [user, projectId, setParams]);

  useEffect(() => { loadProjects(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user]);

  // Load scenes + items + signoffs for the selected project
  const loadScenes = useCallback(async () => {
    if (!projectId) { setScenes([]); setItems([]); setSignoffs([]); setPhotos([]); return; }
    const [{ data: sceneRows }, { data: itemRows }, { data: signoffRows }] = await Promise.all([
      supabase
        .from("breakdown_scenes")
        .select("id, scene_number, label, script_text, sort_order, created_at")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("breakdown_items")
        .select("id, scene_id, department, text, original_text, source, flagged, checked, checked_by_name, checked_at, added_by_name, sort_order")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true }),
      supabase
        .from("breakdown_signoffs")
        .select("id, scene_id, department, status, note, by_name, by_department, updated_at")
        .eq("project_id", projectId),
    ]);
    setScenes((sceneRows || []) as Scene[]);
    setItems((itemRows || []) as BreakdownItem[]);
    setSignoffs((signoffRows || []) as BreakdownSignoff[]);
  }, [projectId]);

  useEffect(() => { loadScenes(); }, [loadScenes]);

  // Reload the current scene's items + signoffs (used by realtime)
  const refreshScene = useCallback(async () => {
    if (!sceneId || !projectId) return;
    const [{ data: itemRows }, { data: signoffRows }] = await Promise.all([
      supabase
        .from("breakdown_items")
        .select("id, scene_id, department, text, original_text, source, flagged, checked, checked_by_name, checked_at, added_by_name, sort_order")
        .eq("scene_id", sceneId)
        .order("sort_order", { ascending: true }),
      supabase
        .from("breakdown_signoffs")
        .select("id, scene_id, department, status, note, by_name, by_department, updated_at")
        .eq("scene_id", sceneId),
    ]);
    setItems((prev) => [...prev.filter((i) => i.scene_id !== sceneId), ...((itemRows || []) as BreakdownItem[])]);
    setSignoffs((prev) => [...prev.filter((s) => s.scene_id !== sceneId), ...((signoffRows || []) as BreakdownSignoff[])]);
  }, [sceneId, projectId]);

  // ---- photos ---------------------------------------------------------------
  const loadPhotos = useCallback(async () => {
    if (!projectId) { setPhotos([]); return; }
    const { data } = await supabase
      .from("breakdown_photos")
      .select(PHOTO_FIELDS)
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    setPhotos((data || []) as BreakdownPhoto[]);
  }, [projectId]);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  // Sign the private storage paths in batches, refreshing when they expire
  useEffect(() => {
    const now = Date.now();
    const needed = Array.from(
      new Set(
        photos
          .filter((p) => !!p.storage_path)
          .map((p) => p.storage_path as string)
          .filter((path) => !urlMap[path] || urlMap[path].exp < now + 60_000),
      ),
    );
    if (!needed.length) return;
    let cancelled = false;
    (async () => {
      const { data, error: err } = await supabase.storage.from(BUCKET).createSignedUrls(needed, 3600);
      if (cancelled || err || !data) return;
      const exp = Date.now() + 3600 * 1000;
      setUrlMap((prev) => {
        const next = { ...prev };
        data.forEach((row: any, i: number) => {
          const path = row.path || needed[i];
          if (row.signedUrl && path) next[path] = { url: row.signedUrl, exp };
        });
        return next;
      });
    })();
    return () => { cancelled = true; };
  }, [photos, urlMap]);

  const signedUrl = useCallback(
    (photo: BreakdownPhoto) =>
      photo.external_url || (photo.storage_path ? urlMap[photo.storage_path]?.url : undefined),
    [urlMap],
  );

  // Live updates for the selected scene + the project's photos
  useEffect(() => {
    if (!sceneId) return;
    const channel = supabase
      .channel(`breakdown-scene-${sceneId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "breakdown_items", filter: `scene_id=eq.${sceneId}` }, () => { refreshScene(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "breakdown_signoffs", filter: `scene_id=eq.${sceneId}` }, () => { refreshScene(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "breakdown_photos", filter: `project_id=eq.${projectId}` }, () => { loadPhotos(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [sceneId, projectId, refreshScene, loadPhotos]);

  const itemCount = useCallback((sid: string) => items.filter((i) => i.scene_id === sid).length, [items]);

  const sceneItems = useMemo(
    () => items.filter((i) => i.scene_id === sceneId),
    [items, sceneId],
  );

  const deptCount = useCallback(
    (dept: string) => sceneItems.filter((i) => i.department === dept).length,
    [sceneItems],
  );

  const deptCheckedCount = useCallback(
    (dept: string) => sceneItems.filter((i) => i.department === dept && i.checked).length,
    [sceneItems],
  );

  const sceneSignoff = useCallback(
    (dept: string) => signoffs.find((s) => s.scene_id === sceneId && s.department === dept) || null,
    [signoffs, sceneId],
  );

  // The person acting right now. Crew names arrive in a later step — pass them in instead.
  const actorName =
    (userProfile?.first_name as string | undefined)?.trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "Someone";
  const actorDepartment: string | null = null;

  // ---- checklist mutations -------------------------------------------------
  const failed = (msg: string) => toast({ title: "Couldn't save", description: msg, variant: "destructive" });

  const toggleItem = async (item: BreakdownItem) => {
    const next = !item.checked;
    const patch = {
      checked: next,
      checked_by_name: next ? actorName : null,
      checked_at: next ? new Date().toISOString() : null,
    };
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));
    const { error: err } = await supabase.from("breakdown_items").update(patch).eq("id", item.id);
    if (err) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      failed(err.message);
    }
  };

  const editItemText = async (item: BreakdownItem, text: string) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, text } : i)));
    const { error: err } = await supabase.from("breakdown_items").update({ text }).eq("id", item.id);
    if (err) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      failed(err.message);
    }
  };

  // Remove the stored files for a set of photo rows before their rows go away
  const removeStorageFor = async (rows: BreakdownPhoto[]) => {
    const paths = rows.map((p) => p.storage_path).filter((p): p is string => !!p);
    if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
  };

  const deleteItem = async (item: BreakdownItem) => {
    const itemPhotos = photos.filter((p) => p.item_id === item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await removeStorageFor(itemPhotos);
    const { error: err } = await supabase.from("breakdown_items").delete().eq("id", item.id);
    if (err) {
      setItems((prev) => [...prev, item]);
      failed(err.message);
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.item_id !== item.id));
  };

  const addItem = async (department: string, text: string, opts?: { flagged?: boolean; source?: string }) => {
    if (!sceneId || !projectId) return;
    const maxOrder = sceneItems
      .filter((i) => i.department === department)
      .reduce((m, i) => Math.max(m, i.sort_order), -1);
    const { data, error: err } = await supabase
      .from("breakdown_items")
      .insert({
        scene_id: sceneId,
        project_id: projectId,
        department,
        text,
        source: opts?.source || "manual",
        flagged: opts?.flagged || false,
        added_by_name: actorName,
        sort_order: maxOrder + 1,
      })
      .select("id, scene_id, department, text, original_text, source, flagged, checked, checked_by_name, checked_at, added_by_name, sort_order")
      .single();
    if (err || !data) { failed(err?.message || "The item wasn't added."); return; }
    setItems((prev) => [...prev, data as BreakdownItem]);
  };

  const setSignoff = async (department: string, status: "good" | "need_help", note?: string) => {
    if (!sceneId || !projectId) return;
    const { data, error: err } = await supabase
      .from("breakdown_signoffs")
      .upsert(
        {
          scene_id: sceneId,
          project_id: projectId,
          department,
          status,
          note: note ?? null,
          by_name: actorName,
          by_department: actorDepartment,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "scene_id,department" },
      )
      .select("id, scene_id, department, status, note, by_name, by_department, updated_at")
      .single();
    if (err || !data) { failed(err?.message || "The sign-off wasn't saved."); return; }
    setSignoffs((prev) => [
      ...prev.filter((s) => !(s.scene_id === sceneId && s.department === department)),
      data as BreakdownSignoff,
    ]);
  };

  const clearSignoff = async (department: string) => {
    const existing = sceneSignoff(department);
    if (!existing) return;
    setSignoffs((prev) => prev.filter((s) => s.id !== existing.id));
    const { error: err } = await supabase.from("breakdown_signoffs").delete().eq("id", existing.id);
    if (err) {
      setSignoffs((prev) => [...prev, existing]);
      failed(err.message);
    }
  };

  const addNoteItem = async (department: string, text: string) => {
    await addItem(department, text, { flagged: true, source: "note" });
    const existing = sceneSignoff(department);
    if (existing?.status === "need_help") {
      await setSignoff(department, "need_help", text);
    }
  };

  // ---- photo mutations ------------------------------------------------------
  const uploadOne = async (item: BreakdownItem, file: File): Promise<string> => {
    const blob = await prepareImage(file);
    const path = `${projectId}/${item.id}/${crypto.randomUUID()}.jpg`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: "image/jpeg", upsert: false });
    if (upErr) throw new Error(upErr.message);
    return path;
  };

  const addPhotos = async (item: BreakdownItem, files: File[]) => {
    if (!projectId) return;
    setUploadingItemId(item.id);
    try {
      for (const file of files) {
        let path = "";
        try {
          path = await uploadOne(item, file);
        } catch (err: any) {
          toast({
            title: err instanceof ImageError ? "Photo not added" : "Upload failed",
            description: err?.message || "That photo couldn't be uploaded.",
            variant: "destructive",
          });
          continue;
        }
        const { data, error: err } = await supabase
          .from("breakdown_photos")
          .insert({
            item_id: item.id,
            project_id: projectId,
            storage_path: path,
            status: "awaiting",
            uploaded_by_name: actorName,
          })
          .select(PHOTO_FIELDS)
          .single();
        if (err || !data) {
          await supabase.storage.from(BUCKET).remove([path]);
          failed(err?.message || "The photo couldn't be saved.");
          continue;
        }
        setPhotos((prev) => [...prev, data as BreakdownPhoto]);
      }
    } finally {
      setUploadingItemId(null);
    }
  };

  const decidePhoto = async (photo: BreakdownPhoto, status: "approved" | "rejected", feedback?: string) => {
    const patch = {
      status,
      feedback: status === "rejected" ? feedback ?? null : null,
      decided_by_name: actorName,
      decided_at: new Date().toISOString(),
    };
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, ...patch } : p)));
    const { error: err } = await supabase.from("breakdown_photos").update(patch).eq("id", photo.id);
    if (err) {
      setPhotos((prev) => prev.map((p) => (p.id === photo.id ? photo : p)));
      failed(err.message);
    }
  };

  const replacePhoto = async (photo: BreakdownPhoto, file: File) => {
    const item = items.find((i) => i.id === photo.item_id);
    if (!item) return;
    setUploadingItemId(item.id);
    try {
      const path = await uploadOne(item, file);
      const patch = {
        storage_path: path,
        status: "awaiting",
        feedback: null,
        decided_by_name: null,
        decided_at: null,
        uploaded_by_name: actorName,
      };
      const { error: err } = await supabase.from("breakdown_photos").update(patch).eq("id", photo.id);
      if (err) {
        await supabase.storage.from(BUCKET).remove([path]);
        failed(err.message);
        return;
      }
      setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, ...patch } : p)));
      if (photo.storage_path) await supabase.storage.from(BUCKET).remove([photo.storage_path]);
    } catch (err: any) {
      toast({
        title: err instanceof ImageError ? "Photo not replaced" : "Upload failed",
        description: err?.message || "That photo couldn't be uploaded.",
        variant: "destructive",
      });
    } finally {
      setUploadingItemId(null);
    }
  };

  const deletePhoto = async (photo: BreakdownPhoto) => {
    const { error: err } = await supabase.from("breakdown_photos").delete().eq("id", photo.id);
    if (err) { failed(err.message); return; }
    if (photo.storage_path) await supabase.storage.from(BUCKET).remove([photo.storage_path]);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setLightbox((lb) => {
      if (!lb) return lb;
      const ids = lb.ids.filter((id) => id !== photo.id);
      if (!ids.length) return null;
      return { ids, index: Math.min(lb.index, ids.length - 1) };
    });
  };

  const attachReference = async (itemId: string, url: string) => {
    if (!projectId) return;
    const { data, error: err } = await supabase
      .from("breakdown_photos")
      .insert({
        item_id: itemId,
        project_id: projectId,
        external_url: url,
        is_reference: true,
        status: "approved",
        uploaded_by_name: actorName,
      })
      .select(PHOTO_FIELDS)
      .single();
    if (err || !data) { failed(err?.message || "The reference image couldn't be attached."); return; }
    setPhotos((prev) => [...prev, data as BreakdownPhoto]);
    toast({ title: "Reference image attached" });
  };


  // ---- actions -------------------------------------------------------------
  const createProject = async () => {
    if (!user || !newTitle.trim()) return;
    setCreating(true);
    setError("");
    const { data, error: err } = await supabase
      .from("breakdown_projects")
      .insert({
        owner_id: user.id,
        title: newTitle.trim(),
        company: newCompany.trim() || null,
        status: newStatus,
        start_date: newStart || null,
      })
      .select("id, title, company, status, start_date, created_at")
      .single();
    setCreating(false);
    if (err || !data) { setError(err?.message || "Could not create the production."); return; }
    setProjects((prev) => [data as Project, ...prev]);
    setShowNewProject(false);
    setNewTitle(""); setNewCompany(""); setNewStatus("in_production"); setNewStart("");
    setParams({ project: (data as Project).id, scene: null });
  };

  const saveRename = async () => {
    if (!selectedProject || !renameValue.trim()) { setRenaming(false); return; }
    const title = renameValue.trim();
    await supabase.from("breakdown_projects").update({ title }).eq("id", selectedProject.id);
    setProjects((prev) => prev.map((p) => (p.id === selectedProject.id ? { ...p, title } : p)));
    setRenaming(false);
  };

  const handleFile = (file: File) => {
    setError("");
    if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
      file.text().then((t) => setScriptText(t));
      return;
    }
    processFile(
      file,
      (result: any) => { if (result?.text) setScriptText(result.text); },
      (msg: string) => setError(msg),
    );
  };

  const runBreakdown = async () => {
    if (!projectId || scriptText.trim().length < 20) return;
    setAnalyzing(true);
    setError("");
    try {
      const res = await aiInvoke<any>("breakdown-scene", {
        body: {
          project_id: projectId,
          script_text: scriptText,
          scene_number: sceneNumber.trim() || undefined,
          label: label.trim() || undefined,
        },
      });
      await loadScenes();
      setShowUpload(false);
      setScriptText(""); setSceneNumber(""); setLabel("");
      setActiveDept("props");
      if (res?.scene_id) setParams({ scene: res.scene_id });
    } catch (err: any) {
      if (err?.name !== "InsufficientCreditsError") {
        setError(err?.message || "We couldn't break down that scene. Please try again.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const confirmDeleteScene = async () => {
    if (!deleteScene) return;
    const sceneItemIds = items.filter((i) => i.scene_id === deleteScene.id).map((i) => i.id);
    await removeStorageFor(photos.filter((p) => sceneItemIds.includes(p.item_id)));
    await supabase.from("breakdown_scenes").delete().eq("id", deleteScene.id);
    if (sceneId === deleteScene.id) setParams({ scene: null });
    setDeleteScene(null);
    await loadScenes();
    await loadPhotos();
  };

  const sceneTitle = (s: Scene) =>
    s.scene_number ? `Scene ${s.scene_number}` : s.label || "Untitled scene";

  // ---- photo derivations ----------------------------------------------------
  const photosByItem = useMemo(() => {
    const map: Record<string, BreakdownPhoto[]> = {};
    photos.forEach((p) => {
      map[p.item_id] = map[p.item_id] || [];
      map[p.item_id].push(p);
    });
    return map;
  }, [photos]);

  const awaitingPhotos = useMemo(
    () => photos.filter((p) => !p.is_reference && p.status === "awaiting"),
    [photos],
  );

  const sceneAwaitingCount = useMemo(() => {
    const ids = new Set(sceneItems.map((i) => i.id));
    return awaitingPhotos.filter((p) => ids.has(p.item_id)).length;
  }, [awaitingPhotos, sceneItems]);

  const approvalRows: ApprovalRow[] = useMemo(() => {
    const deptLabel = (key: string) => DEPARTMENTS.find((d) => d.key === key)?.label || key;
    return awaitingPhotos
      .map((photo) => {
        const item = items.find((i) => i.id === photo.item_id);
        const scene = item ? scenes.find((s) => s.id === item.scene_id) : undefined;
        if (!item || !scene) return null;
        return {
          photo,
          sceneTitle: sceneTitle(scene),
          departmentLabel: deptLabel(item.department),
          itemText: item.text,
        } as ApprovalRow;
      })
      .filter((r): r is ApprovalRow => !!r);
  }, [awaitingPhotos, items, scenes]);

  const openPhoto = (photo: BreakdownPhoto) => {
    const group = photosByItem[photo.item_id] || [photo];
    setLightbox({ ids: group.map((p) => p.id), index: Math.max(0, group.findIndex((p) => p.id === photo.id)) });
  };

  const lightboxPhotos = useMemo(
    () => (lightbox ? lightbox.ids.map((id) => photos.find((p) => p.id === id)).filter((p): p is BreakdownPhoto => !!p) : []),
    [lightbox, photos],
  );

  // ---- render --------------------------------------------------------------
  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "60vh" }}>
      <Seo
        title="Script Breakdown Tool for Indie Films | Filmmaker Genius"
        description="Turn any scene into department checklists for props, locations, wardrobe, makeup and vehicles, and share them with your crew."
        canonical={`${SITE}/script-breakdown`}
      />
      <style>{`
        @media (max-width: 800px) { .sb-steps { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) {
          .sb-steps { grid-template-columns: 1fr !important; }
          .sb-h1 { font-size: 34px !important; }
          .sb-row { flex-direction: column !important; align-items: stretch !important; }
          .sb-row > * { width: 100%; }
        }
        .sb-step-num {
          width: 28px; height: 28px; border-radius: 9999px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,212,170,0.12); color: #00d4aa;
          border: 1px solid rgba(0,212,170,0.4);
          font-size: 13px; font-weight: 700; flex: 0 0 auto;
        }
        .sb-scroll-x { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
        .sb-scroll-x::-webkit-scrollbar { height: 6px; }
        .sb-scroll-x::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        .sb-tap { min-height: 44px; }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", overflowX: "hidden" }}>
        {/* HERO */}
        <div style={{ padding: "64px 0 36px", textAlign: "center" }}>
          <h1 className="sb-h1" style={{
            fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 52,
            lineHeight: 1.05, margin: 0,
          }}>Script Breakdown</h1>
          <p style={{
            marginTop: 16, fontSize: 16, color: "rgba(255,255,255,0.6)",
            maxWidth: 720, margin: "16px auto 0", lineHeight: 1.65,
          }}>Upload a scene and get a department-by-department checklist — props, locations, wardrobe, makeup &amp; SFX, and vehicles — that your whole crew can work from on set.</p>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ paddingBottom: 40 }}>
          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", marginBottom: 20,
          }}>How it works</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="sb-steps">
            {STEPS.map((s) => (
              <div key={s.n} style={{
                borderRadius: 16, padding: 20,
                background: "linear-gradient(135deg, #071820 0%, #0a2a30 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <span className="sb-step-num">{s.n}</span>
                <div>
                  <div style={{
                    fontFamily: "'Inter Tight', sans-serif", fontSize: 15,
                    fontWeight: 700, color: "#fff", lineHeight: 1.3,
                  }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 6, lineHeight: 1.5 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROJECTS */}
        <div style={{ paddingBottom: 24 }}>
          {loadingProjects ? (
            <div style={{ ...panel, padding: 24, display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)" }}>
              <Loader2 size={16} className="animate-spin" /> Loading your productions…
            </div>
          ) : projects.length === 0 ? (
            <div style={{ ...panel, padding: 32, textAlign: "center" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>Create your first production</div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
                Give it a name, then add scenes and let the breakdown do the rest.
              </p>
              <button style={{ ...primaryBtn, marginTop: 18 }} onClick={() => setShowNewProject(true)}>
                + New Project
              </button>
            </div>
          ) : (
            <div style={{ ...panel, padding: 16 }}>
              <div className="sb-row" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "1 1 240px", minWidth: 0 }}>
                  <select
                    aria-label="Select production"
                    value={projectId}
                    onChange={(e) => setParams({ project: e.target.value, scene: null })}
                    style={{ ...inputStyle, maxWidth: 320 }}
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} style={{ background: "#10101b" }}>{p.title}</option>
                    ))}
                  </select>
                  {selectedProject && (
                    <button
                      aria-label="Rename production"
                      onClick={() => { setRenameValue(selectedProject.title); setRenaming(true); }}
                      style={{ ...ghostBtn, minWidth: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </div>
                <button style={{ ...primaryBtn, flex: "0 0 auto" }} onClick={() => setShowNewProject(true)}>
                  + New Project
                </button>
              </div>
              {selectedProject?.company && (
                <div style={{ marginTop: 10, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{selectedProject.company}</div>
              )}
            </div>
          )}
        </div>

        {/* SCENES */}
        {selectedProject && (
          <div style={{ paddingBottom: 24 }}>
            <div style={{
              fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)", marginBottom: 14,
            }}>Scenes</div>
            <div className="sb-scroll-x" style={{ display: "flex", gap: 12, paddingBottom: 8 }}>
              {scenes.map((s) => {
                const active = s.id === sceneId;
                return (
                  <div key={s.id} style={{
                    ...panel, padding: 14, minWidth: 168, flex: "0 0 auto",
                    borderColor: active ? "rgba(0,212,170,0.5)" : "rgba(255,255,255,0.08)",
                    background: active ? "rgba(0,212,170,0.08)" : "rgba(255,255,255,0.03)",
                    display: "flex", alignItems: "flex-start", gap: 8,
                  }}>
                    <button
                      onClick={() => { setParams({ scene: s.id }); setActiveDept("props"); setShowScript(false); }}
                      style={{ background: "none", border: "none", color: "#fff", textAlign: "left", cursor: "pointer", padding: 0, flex: 1, minHeight: 44, fontFamily: "'Inter Tight', sans-serif" }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{sceneTitle(s)}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                        {itemCount(s.id)} item{itemCount(s.id) === 1 ? "" : "s"}
                      </div>
                    </button>
                    <button
                      aria-label={`Delete ${sceneTitle(s)}`}
                      onClick={() => setDeleteScene(s)}
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 6 }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => { setShowUpload(true); setError(""); }}
                style={{
                  ...panel, padding: 14, minWidth: 168, flex: "0 0 auto", cursor: "pointer",
                  border: "1px dashed rgba(0,212,170,0.4)", color: TEAL, background: "rgba(0,212,170,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700, minHeight: 76,
                }}
              >
                <Plus size={16} /> Add scene
              </button>
            </div>
          </div>
        )}

        {/* UPLOAD PANEL */}
        {selectedProject && showUpload && (
          <div style={{ ...panel, padding: 20, marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700 }}>New scene</div>
              <button onClick={() => setShowUpload(false)} aria-label="Close upload panel" style={{ ...ghostBtn, minWidth: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={18} />
              </button>
            </div>

            {isProcessing ? (
              <PDFUploadProgress
                fileName={currentFileName}
                fileSize={currentFileSize}
                stage={currentStage === "idle" ? "reading" : currentStage}
                elapsedTime={elapsedTime}
                progress={progress}
              />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                style={{
                  borderRadius: 16, border: "2px dashed rgba(255,255,255,0.16)",
                  padding: "40px 20px", textAlign: "center", cursor: "pointer",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                  Drop a PDF or image of your scene, or tap to browse
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>PDF, PNG, JPG or TXT</div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />

            <label style={{ display: "block", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
              Or paste the scene text
            </label>
            <textarea
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder="INT. BAR — NIGHT&#10;&#10;Paste your scene here…"
              style={{ ...inputStyle, minHeight: 240, lineHeight: 1.6, resize: "vertical", whiteSpace: "pre-wrap" }}
            />

            <div className="sb-row" style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Scene number (optional)</label>
                <input value={sceneNumber} onChange={(e) => setSceneNumber(e.target.value)} placeholder="e.g. 47A" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Label (optional)</label>
                <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Bar showdown" style={inputStyle} />
              </div>
            </div>

            {error && (
              <div style={{
                marginTop: 16, padding: "12px 14px", borderRadius: 10,
                background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.35)",
                color: "#ff9d9d", fontSize: 14,
              }}>{error}</div>
            )}

            <div className="sb-row" style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20 }}>
              <button
                onClick={runBreakdown}
                disabled={analyzing || scriptText.trim().length < 20}
                style={{
                  ...primaryBtn,
                  opacity: analyzing || scriptText.trim().length < 20 ? 0.45 : 1,
                  cursor: analyzing || scriptText.trim().length < 20 ? "not-allowed" : "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {analyzing ? (<><Loader2 size={16} className="animate-spin" /> Breaking down your scene…</>) : "Break Down Scene"}
              </button>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Uses 1 credit</span>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {selectedScene && !showUpload && (
          <div style={{ ...panel, padding: 20, marginBottom: 64 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700 }}>
              {sceneTitle(selectedScene)}
            </div>
            {selectedScene.label && selectedScene.scene_number && (
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{selectedScene.label}</div>
            )}

            {(() => {
              const total = sceneItems.length;
              const checked = sceneItems.filter((i) => i.checked).length;
              const signed = DEPARTMENTS.filter((d) => !!sceneSignoff(d.key)).length;
              const pct = total ? Math.round((checked / total) * 100) : 0;
              return (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                    {checked}/{total} items ready · {signed}/5 departments signed off
                    {sceneAwaitingCount > 0 ? ` · ${sceneAwaitingCount} photo${sceneAwaitingCount === 1 ? "" : "s"} awaiting approval` : ""}
                  </div>
                  <div style={{ marginTop: 8, height: 4, borderRadius: 9999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: TEAL, transition: "width .3s" }} />
                  </div>
                </div>
              );
            })()}

            <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
              {([["checklist", "Checklist"], ["approvals", `Approvals (${approvalRows.length})`]] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className="sb-tap"
                  style={{
                    padding: "0 18px", borderRadius: 10,
                    background: view === key ? "rgba(0,212,170,0.14)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${view === key ? "rgba(0,212,170,0.45)" : "rgba(255,255,255,0.12)"}`,
                    color: view === key ? TEAL : "rgba(255,255,255,0.7)",
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    fontFamily: "'Inter Tight', sans-serif",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {view === "approvals" ? (
              <ApprovalsView
                rows={approvalRows}
                signedUrl={signedUrl}
                onApprove={(p) => decidePhoto(p, "approved")}
                onRequestChanges={(p, fb) => decidePhoto(p, "rejected", fb)}
                onOpen={openPhoto}
              />
            ) : (
            <>
            <div className="sb-scroll-x" style={{ display: "flex", gap: 8, marginTop: 18, paddingBottom: 6 }}>
              {DEPARTMENTS.map((d) => {
                const active = d.key === activeDept;
                const so = sceneSignoff(d.key);
                return (
                  <button
                    key={d.key}
                    onClick={() => setActiveDept(d.key)}
                    className="sb-tap"
                    style={{
                      flex: "0 0 auto", padding: "0 16px", borderRadius: 9999,
                      background: active ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? "rgba(0,212,170,0.45)" : "rgba(255,255,255,0.12)"}`,
                      color: active ? TEAL : "rgba(255,255,255,0.7)",
                      fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                      fontFamily: "'Inter Tight', sans-serif",
                      display: "inline-flex", alignItems: "center", gap: 8,
                    }}
                  >
                    {d.label} {deptCheckedCount(d.key)}/{deptCount(d.key)}
                    {so && (
                      <span style={{
                        width: 8, height: 8, borderRadius: 9999,
                        background: so.status === "good" ? TEAL : "#f5a524",
                      }} />
                    )}
                  </button>
                );
              })}
            </div>

            <DepartmentChecklist
              key={`${sceneId}-${activeDept}`}
              department={activeDept}
              items={sceneItems.filter((i) => i.department === activeDept)}
              onToggle={toggleItem}
              onEditText={editItemText}
              onDelete={deleteItem}
              onAdd={(text) => addItem(activeDept, text)}
              photosByItem={photosByItem}
              signedUrl={signedUrl}
              onAddPhotos={addPhotos}
              onOpenPhoto={openPhoto}
              uploadingItemId={uploadingItemId}
            />

            <ReferenceSearch
              key={`ref-${sceneId}-${activeDept}`}
              items={sceneItems.filter((i) => i.department === activeDept)}
              onAttach={attachReference}
            />

            <SignOffBox
              key={`signoff-${sceneId}-${activeDept}`}
              signoff={sceneSignoff(activeDept)}
              onSetStatus={(status, note) => setSignoff(activeDept, status, note)}
              onClear={() => clearSignoff(activeDept)}
              onAddNoteItem={(text) => addNoteItem(activeDept, text)}
            />
            </>
            )}




            <button
              onClick={() => setShowScript((v) => !v)}
              style={{ ...ghostBtn, marginTop: 22, display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <ChevronDown size={16} style={{ transform: showScript ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              View scene script
            </button>
            {showScript && (
              <pre style={{
                marginTop: 14, maxHeight: 420, overflow: "auto", padding: 16,
                borderRadius: 12, background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.75)",
              }}>{selectedScene.script_text || "No script text saved."}</pre>
            )}
          </div>
        )}

        {selectedProject && !selectedScene && !showUpload && scenes.length === 0 && (
          <div style={{ ...panel, padding: 32, textAlign: "center", marginBottom: 64, color: "rgba(255,255,255,0.5)" }}>
            No scenes yet — tap “Add scene” to upload or paste your first one.
          </div>
        )}
        {!selectedProject && !loadingProjects && projects.length > 0 && <div style={{ height: 48 }} />}
        {(selectedProject && (selectedScene || showUpload)) ? null : <div style={{ height: 24 }} />}
      </div>

      {/* NEW PROJECT MODAL */}
      {showNewProject && (
        <Modal title="New production" onClose={() => setShowNewProject(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Title</label>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Knock at 8" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Production company (optional)</label>
              <input value={newCompany} onChange={(e) => setNewCompany(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={inputStyle}>
                <option value="upcoming" style={{ background: "#10101b" }}>Upcoming</option>
                <option value="in_production" style={{ background: "#10101b" }}>In production</option>
                <option value="wrapped" style={{ background: "#10101b" }}>Wrapped</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Start date (optional)</label>
              <input type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)} style={inputStyle} />
            </div>
            {error && <div style={{ color: "#ff9d9d", fontSize: 14 }}>{error}</div>}
            <button
              onClick={createProject}
              disabled={creating || !newTitle.trim()}
              style={{ ...primaryBtn, opacity: creating || !newTitle.trim() ? 0.45 : 1, marginTop: 4 }}
            >
              {creating ? "Creating…" : "Create production"}
            </button>
          </div>
        </Modal>
      )}

      {/* RENAME MODAL */}
      {renaming && selectedProject && (
        <Modal title="Rename production" onClose={() => setRenaming(false)}>
          <input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} style={inputStyle} />
          <button onClick={saveRename} style={{ ...primaryBtn, marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Check size={16} /> Save
          </button>
        </Modal>
      )}

      {/* DELETE SCENE CONFIRM */}
      {deleteScene && (
        <Modal title="Delete scene" onClose={() => setDeleteScene(null)}>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Delete {sceneTitle(deleteScene)} and its checklist?
          </p>
          <div className="sb-row" style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button onClick={confirmDeleteScene} style={{ ...primaryBtn, background: "#ff5c5c", color: "#2a0505" }}>Delete</button>
            <button onClick={() => setDeleteScene(null)} style={ghostBtn}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* PHOTO LIGHTBOX */}
      {lightbox && lightboxPhotos.length > 0 && (
        <PhotoLightbox
          photos={lightboxPhotos}
          index={Math.min(lightbox.index, lightboxPhotos.length - 1)}
          signedUrl={signedUrl}
          onIndexChange={(i) => setLightbox((lb) => (lb ? { ...lb, index: i } : lb))}
          onClose={() => setLightbox(null)}
          onApprove={(p) => decidePhoto(p, "approved")}
          onRequestChanges={(p, fb) => decidePhoto(p, "rejected", fb)}
          onReplace={replacePhoto}
          onDelete={deletePhoto}
        />
      )}
    </div>
  );
};

export default ScriptBreakdown;
