import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Download, Loader2, Pencil, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DepartmentChecklist from "./DepartmentChecklist";
import SignOffBox from "./SignOffBox";
import ApprovalsView, { ApprovalRow } from "./ApprovalsView";
import PhotoLightbox from "./PhotoLightbox";
import ReferenceSearch from "./ReferenceSearch";
import {
  BreakdownItem,
  BreakdownPhoto,
  BreakdownScene,
  BreakdownSignoff,
  DEPARTMENTS,
  DeptKey,
  TEAL,
} from "./types";
import { BreakdownAdapter } from "@/lib/breakdown/adapter";
import { inputStyle } from "@/components/production/ProductionPicker";
import { ImageError } from "@/lib/breakdown/imageDownscale";
import { exportBreakdownToPDF } from "@/utils/exportBreakdownToPDF";


const panel: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
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

export const sceneTitle = (s: BreakdownScene) =>
  s.scene_number ? `Scene ${s.scene_number}` : s.label || "Untitled scene";

interface Props {
  adapter: BreakdownAdapter;
  sceneId: string;
  onSelectScene: (id: string | null) => void;
  /** Bump to force a reload (e.g. after the owner adds a scene). */
  reloadKey?: number;
  /** Owner only — opens the upload panel. */
  onRequestAddScene?: () => void;
  onLoaded?: (data: { scenes: BreakdownScene[]; items: BreakdownItem[] }) => void;
  hideSceneStrip?: boolean;
  /** Used in the PDF header. */
  projectTitle?: string;
  company?: string | null;
}


const BreakdownWorkspace = ({
  adapter, sceneId, onSelectScene, reloadKey = 0, onRequestAddScene, onLoaded, hideSceneStrip,
  projectTitle = "Production", company = null,
}: Props) => {
  const [scenes, setScenes] = useState<BreakdownScene[]>([]);
  const [items, setItems] = useState<BreakdownItem[]>([]);
  const [signoffs, setSignoffs] = useState<BreakdownSignoff[]>([]);
  const [photos, setPhotos] = useState<BreakdownPhoto[]>([]);
  const [urlMap, setUrlMap] = useState<Record<string, { url: string; exp: number }>>({});
  const [loading, setLoading] = useState(true);

  const [activeDept, setActiveDept] = useState<DeptKey>("props");
  const [view, setView] = useState<"checklist" | "approvals">("checklist");
  const [showScript, setShowScript] = useState(false);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ ids: string[]; index: number } | null>(null);
  const [deleteScene, setDeleteScene] = useState<BreakdownScene | null>(null);
  const [settingsScene, setSettingsScene] = useState<BreakdownScene | null>(null);
  const [formNumber, setFormNumber] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formScript, setFormScript] = useState("");
  const [savingScene, setSavingScene] = useState(false);
  const [rerunning, setRerunning] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [includeScript, setIncludeScript] = useState(false);


  const failed = (msg: string) => toast({ title: "Couldn't save", description: msg, variant: "destructive" });

  const mergeUrls = useCallback((urls: Record<string, string>) => {
    const exp = Date.now() + 3600 * 1000;
    setUrlMap((prev) => {
      const next = { ...prev };
      Object.entries(urls).forEach(([path, url]) => { next[path] = { url, exp }; });
      return next;
    });
  }, []);

  const reload = useCallback(async () => {
    const data = await adapter.load();
    setScenes(data.scenes);
    setItems(data.items);
    setSignoffs(data.signoffs);
    setPhotos(data.photos);
    if (data.urls) mergeUrls(data.urls);
    setLoading(false);
    onLoaded?.({ scenes: data.scenes, items: data.items });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adapter, mergeUrls]);

  useEffect(() => { setLoading(true); reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [reload, reloadKey]);

  // Sign private storage paths in batches (owner mode); crew URLs arrive with load()
  useEffect(() => {
    const now = Date.now();
    const needed = Array.from(new Set(
      photos
        .filter((p) => !!p.storage_path)
        .map((p) => p.storage_path as string)
        .filter((path) => !urlMap[path] || urlMap[path].exp < now + 60_000),
    ));
    if (!needed.length) return;
    let cancelled = false;
    (async () => {
      const urls = await adapter.signPaths(needed);
      if (!cancelled && Object.keys(urls).length) mergeUrls(urls);
    })();
    return () => { cancelled = true; };
  }, [photos, urlMap, adapter, mergeUrls]);

  const signedUrl = useCallback(
    (photo: BreakdownPhoto) => photo.external_url || (photo.storage_path ? urlMap[photo.storage_path]?.url : undefined),
    [urlMap],
  );

  // Live updates
  useEffect(() => {
    if (!sceneId && adapter.mode === "owner") return;
    return adapter.watch(sceneId, () => { reload(); });
  }, [sceneId, adapter, reload]);

  const selectedScene = useMemo(() => scenes.find((s) => s.id === sceneId) || null, [scenes, sceneId]);
  const sceneItems = useMemo(() => items.filter((i) => i.scene_id === sceneId), [items, sceneId]);
  const itemCount = useCallback((sid: string) => items.filter((i) => i.scene_id === sid).length, [items]);
  const deptCount = useCallback((d: string) => sceneItems.filter((i) => i.department === d).length, [sceneItems]);
  const deptCheckedCount = useCallback((d: string) => sceneItems.filter((i) => i.department === d && i.checked).length, [sceneItems]);
  const sceneSignoff = useCallback(
    (d: string) => signoffs.find((s) => s.scene_id === sceneId && s.department === d) || null,
    [signoffs, sceneId],
  );

  // ---- mutations (optimistic, rolled back on failure) ----------------------
  const toggleItem = async (item: BreakdownItem) => {
    const next = !item.checked;
    const patch = {
      checked: next,
      checked_by_name: next ? adapter.actorName : null,
      checked_at: next ? new Date().toISOString() : null,
    };
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));
    try {
      await adapter.setChecked(item, next);
    } catch (err: any) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      failed(err?.message || "Please try again.");
    }
  };

  const editItemText = async (item: BreakdownItem, text: string) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, text } : i)));
    try {
      await adapter.editItem(item, text);
    } catch (err: any) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      failed(err?.message || "Please try again.");
    }
  };

  const deleteItem = async (item: BreakdownItem) => {
    const itemPhotos = photos.filter((p) => p.item_id === item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    try {
      await adapter.deleteItem(item, itemPhotos);
      setPhotos((prev) => prev.filter((p) => p.item_id !== item.id));
    } catch (err: any) {
      setItems((prev) => [...prev, item]);
      failed(err?.message || "Please try again.");
    }
  };

  const addItem = async (department: string, text: string, asNote?: boolean) => {
    if (!sceneId) return;
    try {
      const created = await adapter.addItem(sceneId, department, text, asNote);
      setItems((prev) => [...prev, created]);
    } catch (err: any) {
      failed(err?.message || "The item wasn't added.");
    }
  };

  const setSignoff = async (department: string, status: "good" | "need_help", note?: string) => {
    if (!sceneId) return;
    try {
      const saved = await adapter.setSignoff(sceneId, department, status, note);
      setSignoffs((prev) => [
        ...prev.filter((s) => !(s.scene_id === sceneId && s.department === department)),
        saved,
      ]);
    } catch (err: any) {
      failed(err?.message || "The sign-off wasn't saved.");
    }
  };

  const clearSignoff = async (department: string) => {
    const existing = sceneSignoff(department);
    if (!existing || !sceneId) return;
    setSignoffs((prev) => prev.filter((s) => s.id !== existing.id));
    try {
      await adapter.clearSignoff(sceneId, department, existing);
    } catch (err: any) {
      setSignoffs((prev) => [...prev, existing]);
      failed(err?.message || "Please try again.");
    }
  };

  const addNoteItem = async (department: string, text: string) => {
    await addItem(department, text, true);
    const existing = sceneSignoff(department);
    if (existing?.status === "need_help") await setSignoff(department, "need_help", text);
  };

  const addPhotos = async (item: BreakdownItem, files: File[]) => {
    setUploadingItemId(item.id);
    try {
      for (const file of files) {
        try {
          const { photo } = await adapter.uploadPhoto(item, file);
          setPhotos((prev) => [...prev, photo]);
        } catch (err: any) {
          toast({
            title: err instanceof ImageError ? "Photo not added" : "Upload failed",
            description: err?.message || "That photo couldn't be uploaded.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setUploadingItemId(null);
    }
  };

  const decidePhoto = async (photo: BreakdownPhoto, status: "approved" | "rejected", feedback?: string) => {
    const patch = {
      status,
      feedback: status === "rejected" ? feedback ?? null : null,
      decided_by_name: adapter.actorName,
      decided_at: new Date().toISOString(),
    };
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, ...patch } : p)));
    try {
      await adapter.decidePhoto(photo, status, feedback);
    } catch (err: any) {
      setPhotos((prev) => prev.map((p) => (p.id === photo.id ? photo : p)));
      failed(err?.message || "Please try again.");
    }
  };

  const replacePhoto = async (photo: BreakdownPhoto, file: File) => {
    setUploadingItemId(photo.item_id);
    try {
      const { photo: updated } = await adapter.replacePhoto(photo, file);
      setPhotos((prev) => prev.map((p) => (p.id === photo.id ? updated : p)));
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
    try {
      await adapter.deletePhoto(photo);
    } catch (err: any) {
      failed(err?.message || "Please try again.");
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setLightbox((lb) => {
      if (!lb) return lb;
      const ids = lb.ids.filter((id) => id !== photo.id);
      if (!ids.length) return null;
      return { ids, index: Math.min(lb.index, ids.length - 1) };
    });
  };

  const attachReference = async (itemId: string, url: string) => {
    try {
      const created = await adapter.attachReference(itemId, url);
      setPhotos((prev) => [...prev, created]);
      toast({ title: "Reference image attached" });
    } catch (err: any) {
      failed(err?.message || "The reference image couldn't be attached.");
    }
  };

  const confirmDeleteScene = async () => {
    if (!deleteScene || !adapter.deleteScene) return;
    const sceneItemIds = items.filter((i) => i.scene_id === deleteScene.id).map((i) => i.id);
    try {
      await adapter.deleteScene(deleteScene, photos.filter((p) => sceneItemIds.includes(p.item_id)));
    } catch (err: any) {
      failed(err?.message || "Please try again.");
      return;
    }
    if (sceneId === deleteScene.id) onSelectScene(null);
    setDeleteScene(null);
    await reload();
  };

  const runExport = async (scope: "scene" | "all") => {
    setExportOpen(false);
    setExporting(true);
    try {
      const chosen = scope === "all" ? scenes : scenes.filter((s) => s.id === sceneId);
      await exportBreakdownToPDF({
        projectTitle,
        company,
        scenes: chosen,
        items,
        signoffs,
        photos,
        includeScript,
        scope,
      });
      toast({ title: "PDF ready", description: "Your breakdown has been downloaded." });
    } catch (err: any) {
      toast({
        title: "Export failed",
        description: err?.message || "The PDF couldn't be generated.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // ---- photo derivations ---------------------------------------------------

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
    return awaitingPhotos.map((photo) => {
      const item = items.find((i) => i.id === photo.item_id);
      const scene = item ? scenes.find((s) => s.id === item.scene_id) : undefined;
      if (!item || !scene) return null;
      return {
        photo,
        sceneTitle: sceneTitle(scene),
        departmentLabel: deptLabel(item.department),
        itemText: item.text,
      } as ApprovalRow;
    }).filter((r): r is ApprovalRow => !!r);
  }, [awaitingPhotos, items, scenes]);

  const openPhoto = (photo: BreakdownPhoto) => {
    const group = photosByItem[photo.item_id] || [photo];
    setLightbox({ ids: group.map((p) => p.id), index: Math.max(0, group.findIndex((p) => p.id === photo.id)) });
  };

  const lightboxPhotos = useMemo(
    () => (lightbox ? lightbox.ids.map((id) => photos.find((p) => p.id === id)).filter((p): p is BreakdownPhoto => !!p) : []),
    [lightbox, photos],
  );

  const deptItems = sceneItems.filter((i) => i.department === activeDept);

  const exportButton = (
    <button
      onClick={() => setExportOpen((v) => !v)}
      disabled={exporting}
      className="sb-tap"
      aria-label="Export PDF"
      style={{
        ...ghostBtn, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        opacity: exporting ? 0.6 : 1, width: "100%",
      }}
    >
      {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {exporting ? "Building PDF…" : "Export PDF"}
    </button>
  );

  const exportMenu = (
    <div
      style={{
        ...panel, position: "absolute", right: 0, bottom: "calc(100% + 8px)",
        background: "#10101b", padding: 10, minWidth: 250, zIndex: 40,
        boxShadow: "0 12px 32px rgba(0,0,0,0.55)",
      }}
    >
      {([["scene", "This scene"], ["all", "Whole production (all scenes)"]] as const).map(([scope, label]) => (
        <button
          key={scope}
          onClick={() => runExport(scope)}
          disabled={scope === "scene" ? !sceneId : scenes.length === 0}
          className="sb-tap"
          style={{
            display: "block", width: "100%", textAlign: "left", background: "none",
            border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
            padding: "0 10px", borderRadius: 8, fontFamily: "'Inter Tight', sans-serif",
          }}
        >
          {label}
        </button>
      ))}
      <label
        style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 6, paddingTop: 10,
          borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 13,
          color: "rgba(255,255,255,0.6)", cursor: "pointer", minHeight: 44,
        }}
      >
        <input type="checkbox" checked={includeScript} onChange={(e) => setIncludeScript(e.target.checked)} />
        Include scene script
      </label>
    </div>
  );


  if (loading) {
    return (
      <div style={{ ...panel, padding: 24, display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)" }}>
        <Loader2 size={16} className="animate-spin" /> Loading the breakdown…
      </div>
    );
  }

  return (
    <>
      <style>{`
        .bw-export-mobile { display: none; }
        @media (max-width: 700px) {
          .bw-export-desktop { display: none !important; }
          .bw-export-mobile {
            display: block; position: fixed; left: 0; right: 0; bottom: 0; z-index: 50;
            padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
            background: rgba(10,10,18,0.96);
            border-top: 1px solid rgba(255,255,255,0.1);
          }
        }
      `}</style>
      {/* SCENES */}

      {!hideSceneStrip && (
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
                    onClick={() => { onSelectScene(s.id); setActiveDept("props"); setShowScript(false); setView("checklist"); }}
                    style={{ background: "none", border: "none", color: "#fff", textAlign: "left", cursor: "pointer", padding: 0, flex: 1, minHeight: 44, fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{sceneTitle(s)}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                      {itemCount(s.id)} item{itemCount(s.id) === 1 ? "" : "s"}
                    </div>
                  </button>
                  {adapter.canManageScenes && (
                    <button
                      aria-label={`Delete ${sceneTitle(s)}`}
                      onClick={() => setDeleteScene(s)}
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 6 }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              );
            })}
            {adapter.canManageScenes && onRequestAddScene && (
              <button
                onClick={onRequestAddScene}
                style={{
                  ...panel, padding: 14, minWidth: 168, flex: "0 0 auto", cursor: "pointer",
                  border: "1px dashed rgba(0,212,170,0.4)", color: TEAL, background: "rgba(0,212,170,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700, minHeight: 76,
                }}
              >
                <Plus size={16} /> Add scene
              </button>
            )}
          </div>
        </div>
      )}

      {/* SCENE VIEW */}
      {selectedScene && (
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

          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
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
            <div className="bw-export-desktop" style={{ position: "relative", marginLeft: "auto" }}>
              {exportButton}
              {exportOpen && exportMenu}
            </div>
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
                items={deptItems}
                onToggle={toggleItem}
                onEditText={editItemText}
                onDelete={deleteItem}
                onAdd={(text) => addItem(activeDept, text)}
                canDelete={(item) => adapter.canDeleteItem(item)}
                photosByItem={photosByItem}
                signedUrl={signedUrl}
                onAddPhotos={addPhotos}
                onOpenPhoto={openPhoto}
                uploadingItemId={uploadingItemId}
              />

              <ReferenceSearch
                key={`ref-${sceneId}-${activeDept}`}
                items={deptItems}
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

      {!selectedScene && scenes.length === 0 && (
        <div style={{ ...panel, padding: 32, textAlign: "center", marginBottom: 64, color: "rgba(255,255,255,0.5)" }}>
          {adapter.canManageScenes
            ? "No scenes yet — tap “Add scene” to upload or paste your first one."
            : "No scenes have been added to this breakdown yet."}
        </div>
      )}

      {!selectedScene && scenes.length > 0 && (
        <div style={{ ...panel, padding: 24, textAlign: "center", marginBottom: 64, color: "rgba(255,255,255,0.55)" }}>
          Pick a scene above to see its checklists.
        </div>
      )}

      {/* MOBILE EXPORT BAR */}
      {selectedScene && (
        <div className="bw-export-mobile">
          <div style={{ position: "relative" }}>
            {exportOpen && exportMenu}
            {exportButton}
          </div>
        </div>
      )}

      {/* DELETE SCENE CONFIRM */}

      {deleteScene && (
        <div
          onClick={() => setDeleteScene(null)}
          style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ ...panel, background: "#10101b", width: "100%", maxWidth: 460, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, margin: 0 }}>Delete scene</h2>
              <button onClick={() => setDeleteScene(null)} aria-label="Close" style={{ ...ghostBtn, minWidth: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
              Delete {sceneTitle(deleteScene)} and its checklist?
            </p>
            <div className="sb-row" style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button
                onClick={confirmDeleteScene}
                style={{ ...ghostBtn, background: "#ff5c5c", color: "#2a0505", border: "none", fontWeight: 700 }}
              >
                Delete
              </button>
              <button onClick={() => setDeleteScene(null)} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO LIGHTBOX */}
      {lightbox && lightboxPhotos.length > 0 && (
        <PhotoLightbox
          photos={lightboxPhotos}
          index={Math.min(lightbox.index, lightboxPhotos.length - 1)}
          signedUrl={signedUrl}
          canModify={(p) => adapter.canModifyPhoto(p)}
          onIndexChange={(i) => setLightbox((lb) => (lb ? { ...lb, index: i } : lb))}
          onClose={() => setLightbox(null)}
          onApprove={(p) => decidePhoto(p, "approved")}
          onRequestChanges={(p, fb) => decidePhoto(p, "rejected", fb)}
          onReplace={replacePhoto}
          onDelete={deletePhoto}
        />
      )}
    </>
  );
};

export default BreakdownWorkspace;
