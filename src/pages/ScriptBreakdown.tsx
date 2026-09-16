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
import { DEPARTMENTS, DeptKey, BreakdownItem, BreakdownSignoff } from "@/components/breakdown/types";

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

interface Item {
  id: string;
  scene_id: string;
  department: string;
  text: string;
  sort_order: number;
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
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get("project") || "";
  const sceneId = searchParams.get("scene") || "";

  const [projects, setProjects] = useState<Project[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [items, setItems] = useState<Item[]>([]);
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

  // Load scenes + items for the selected project
  const loadScenes = useCallback(async () => {
    if (!projectId) { setScenes([]); setItems([]); return; }
    const [{ data: sceneRows }, { data: itemRows }] = await Promise.all([
      supabase
        .from("breakdown_scenes")
        .select("id, scene_number, label, script_text, sort_order, created_at")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("breakdown_items")
        .select("id, scene_id, department, text, sort_order")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true }),
    ]);
    setScenes((sceneRows || []) as Scene[]);
    setItems((itemRows || []) as Item[]);
  }, [projectId]);

  useEffect(() => { loadScenes(); }, [loadScenes]);

  const itemCount = useCallback((sid: string) => items.filter((i) => i.scene_id === sid).length, [items]);

  const sceneItems = useMemo(
    () => items.filter((i) => i.scene_id === sceneId),
    [items, sceneId],
  );

  const deptCount = useCallback(
    (dept: string) => sceneItems.filter((i) => i.department === dept).length,
    [sceneItems],
  );

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
    await supabase.from("breakdown_scenes").delete().eq("id", deleteScene.id);
    if (sceneId === deleteScene.id) setParams({ scene: null });
    setDeleteScene(null);
    await loadScenes();
  };

  const sceneTitle = (s: Scene) =>
    s.scene_number ? `Scene ${s.scene_number}` : s.label || "Untitled scene";

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

            <div className="sb-scroll-x" style={{ display: "flex", gap: 8, marginTop: 18, paddingBottom: 6 }}>
              {DEPARTMENTS.map((d) => {
                const active = d.key === activeDept;
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
                    }}
                  >
                    {d.label} · {deptCount(d.key)}
                  </button>
                );
              })}
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0" }}>
              {sceneItems.filter((i) => i.department === activeDept).length === 0 ? (
                <li style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Nothing found for this department.</li>
              ) : (
                sceneItems
                  .filter((i) => i.department === activeDept)
                  .map((i) => (
                    <li key={i.id} style={{
                      padding: "13px 4px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                      fontSize: 15, color: "rgba(255,255,255,0.88)", lineHeight: 1.5,
                    }}>{i.text}</li>
                  ))
              )}
            </ul>

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
    </div>
  );
};

export default ScriptBreakdown;
