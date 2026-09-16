import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Loader2, Pencil, Share2, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import SharePanel from "@/components/breakdown/SharePanel";
import { deleteProduction } from "@/lib/production/deleteProduction";

export interface Production {
  id: string;
  title: string;
  company: string | null;
  status: string;
  start_date: string | null;
  share_token: string;
  sharing_enabled: boolean;
  default_currency: string;
  notify_expenses: boolean;
  languages: string[];
  shoot_location: string | null;
  created_at: string;
}

export const PRODUCTION_FIELDS =
  "id, title, company, status, start_date, share_token, sharing_enabled, default_currency, notify_expenses, languages, shoot_location, created_at";

const TEAL = "#00d4aa";

export const panel: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

export const inputStyle: React.CSSProperties = {
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

export const primaryBtn: React.CSSProperties = {
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

export const ghostBtn: React.CSSProperties = {
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

export const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}
  >
    <div onClick={(e) => e.stopPropagation()} style={{ ...panel, background: "#10101b", width: "100%", maxWidth: 460, padding: 24 }}>
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

interface Props {
  /** Show the "Share with crew" button and panel (Script Breakdown only). */
  enableShare?: boolean;
  /** URL params to clear whenever the selected production changes. */
  clearParamsOnChange?: string[];
  /** Empty-state copy. */
  emptyTitle?: string;
  emptyText?: string;
  /** Called whenever the selected production (or its details) change. */
  onSelect?: (production: Production | null) => void;
  /** Called with the full list after each load. */
  onProjectsLoaded?: (list: Production[]) => void;
  /** Extra controls rendered in the picker's button row (e.g. a currency select). */
  extraControls?: React.ReactNode;
}

const ProductionPicker = ({
  enableShare = false,
  clearParamsOnChange = [],
  emptyTitle = "Create your first production",
  emptyText = "Give it a name, then everything else hangs off it.",
  onSelect,
  onProjectsLoaded,
  extraControls,
}: Props) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get("project") || "";

  const [projects, setProjects] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);

  const [showNewProject, setShowNewProject] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newStatus, setNewStatus] = useState("in_production");
  const [newStart, setNewStart] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editStatus, setEditStatus] = useState("in_production");
  const [editStart, setEditStart] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [showShare, setShowShare] = useState(false);

  const selected = useMemo(
    () => projects.find((p) => p.id === projectId) || null,
    [projects, projectId],
  );

  const setParams = useCallback((next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const selectProject = (id: string) => {
    const cleared: Record<string, string | null> = { project: id };
    clearParamsOnChange.forEach((k) => { cleared[k] = null; });
    setParams(cleared);
    setShowShare(false);
  };

  const loadProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("breakdown_projects")
      .select(PRODUCTION_FIELDS)
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    const list = (data || []) as Production[];
    setProjects(list);
    setLoading(false);
    onProjectsLoaded?.(list);
    if (list.length && !list.some((p) => p.id === projectId)) {
      const cleared: Record<string, string | null> = { project: list[0].id };
      clearParamsOnChange.forEach((k) => { cleared[k] = null; });
      setParams(cleared);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, projectId, setParams]);

  useEffect(() => { loadProjects(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user]);

  useEffect(() => { onSelect?.(selected); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [selected]);

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
      .select(PRODUCTION_FIELDS)
      .single();
    setCreating(false);
    if (err || !data) { setError(err?.message || "Could not create the production."); return; }
    setProjects((prev) => [data as Production, ...prev]);
    setShowNewProject(false);
    setNewTitle(""); setNewCompany(""); setNewStatus("in_production"); setNewStart("");
    selectProject((data as Production).id);
  };

  const openSettings = () => {
    if (!selected) return;
    setEditTitle(selected.title);
    setEditCompany(selected.company || "");
    setEditStatus(selected.status || "in_production");
    setEditStart(selected.start_date || "");
    setSettingsError("");
    setConfirmDelete(false);
    setDeleteText("");
    setDeleteError("");
    setSettingsOpen(true);
  };

  const saveSettings = async () => {
    if (!selected || !editTitle.trim()) return;
    setSavingSettings(true);
    setSettingsError("");
    const patch = {
      title: editTitle.trim(),
      company: editCompany.trim() || null,
      status: editStatus,
      start_date: editStart || null,
    };
    const { error: err } = await supabase.from("breakdown_projects").update(patch).eq("id", selected.id);
    setSavingSettings(false);
    if (err) { setSettingsError(err.message); return; }
    setProjects((prev) => prev.map((p) => (p.id === selected.id ? { ...p, ...patch } : p)));
    setSettingsOpen(false);
    toast({ title: "Production updated" });
  };

  const runDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteProduction(selected.id);
    } catch (err: any) {
      setDeleting(false);
      setDeleteError(err?.message || "The production couldn't be deleted.");
      return;
    }
    const remaining = projects.filter((p) => p.id !== selected.id);
    setProjects(remaining);
    setDeleting(false);
    setConfirmDelete(false);
    setSettingsOpen(false);
    setShowShare(false);
    onProjectsLoaded?.(remaining);
    const cleared: Record<string, string | null> = { project: remaining[0]?.id || null };
    clearParamsOnChange.forEach((k) => { cleared[k] = null; });
    setParams(cleared);
    toast({ title: "Production deleted", description: `“${selected.title}” and everything in it has been removed.` });
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      {loading ? (
        <div style={{ ...panel, padding: 24, display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)" }}>
          <Loader2 size={16} className="animate-spin" /> Loading your productions…
        </div>
      ) : projects.length === 0 ? (
        <div style={{ ...panel, padding: 32, textAlign: "center" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>{emptyTitle}</div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>{emptyText}</p>
          <button style={{ ...primaryBtn, marginTop: 18 }} onClick={() => setShowNewProject(true)}>+ New Project</button>
        </div>
      ) : (
        <div style={{ ...panel, padding: 16 }}>
          <div className="sb-row" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "1 1 240px", minWidth: 0 }}>
              <select
                aria-label="Select production"
                value={projectId}
                onChange={(e) => selectProject(e.target.value)}
                style={{ ...inputStyle, maxWidth: 320 }}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} style={{ background: "#10101b" }}>{p.title}</option>
                ))}
              </select>
              {selected && (
                <button
                  aria-label="Production settings"
                  onClick={openSettings}
                  style={{ ...ghostBtn, minWidth: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
            <div className="sb-row" style={{ display: "flex", gap: 10, flex: "0 0 auto", alignItems: "center" }}>
              {extraControls}
              {enableShare && selected && (
                <button onClick={() => setShowShare((v) => !v)} style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Share2 size={16} /> Share with crew
                </button>
              )}
              <button style={primaryBtn} onClick={() => setShowNewProject(true)}>+ New Project</button>
            </div>
          </div>
          {selected?.company && (
            <div style={{ marginTop: 10, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{selected.company}</div>
          )}
          {enableShare && selected && showShare && (
            <SharePanel
              projectId={selected.id}
              projectTitle={selected.title}
              shareToken={selected.share_token}
              sharingEnabled={selected.sharing_enabled}
              onChange={(patch) => setProjects((prev) => prev.map((p) => (p.id === selected.id ? { ...p, ...patch } : p)))}
            />
          )}
        </div>
      )}

      {showNewProject && (
        <Modal title="New production" onClose={() => setShowNewProject(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Title</label>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. The Long Way Home" style={inputStyle} />
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

      {settingsOpen && selected && (
        <Modal title="Production settings" onClose={() => { if (!savingSettings) setSettingsOpen(false); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Title</label>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Production company (optional)</label>
              <input value={editCompany} onChange={(e) => setEditCompany(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Status</label>
              <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={inputStyle}>
                <option value="upcoming" style={{ background: "#10101b" }}>Upcoming</option>
                <option value="in_production" style={{ background: "#10101b" }}>In production</option>
                <option value="wrapped" style={{ background: "#10101b" }}>Wrapped</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Start date (optional)</label>
              <input type="date" value={editStart} onChange={(e) => setEditStart(e.target.value)} style={inputStyle} />
            </div>
            {settingsError && <div style={{ color: "#ff9d9d", fontSize: 14 }}>{settingsError}</div>}
            <button
              onClick={saveSettings}
              disabled={savingSettings || !editTitle.trim()}
              style={{
                ...primaryBtn, marginTop: 4, opacity: savingSettings || !editTitle.trim() ? 0.45 : 1,
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {savingSettings ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Check size={16} /> Save changes</>}
            </button>

            <div style={{ marginTop: 8, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
                Danger zone
              </div>
              <button
                onClick={() => { setConfirmDelete(true); setDeleteText(""); setDeleteError(""); }}
                style={{
                  ...ghostBtn, width: "100%", color: "#ff8f8f",
                  border: "1px solid rgba(255,92,92,0.45)", background: "transparent",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <Trash2 size={16} /> Delete this production
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmDelete && selected && (
        <Modal title="Delete production" onClose={() => { if (!deleting) setConfirmDelete(false); }}>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Delete {selected.title}? This permanently removes its scenes, checklists, photos, receipts, expenses,
            messages, notes and crew link. Your cast &amp; crew contacts are kept.
          </p>
          <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "18px 0 6px" }}>
            Type the production title to confirm
          </label>
          <input
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder={selected.title}
            style={inputStyle}
          />
          {deleteError && <div style={{ color: "#ff9d9d", fontSize: 14, marginTop: 12 }}>{deleteError}</div>}
          <div className="sb-row" style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button
              onClick={runDelete}
              disabled={deleting || deleteText.trim().toLowerCase() !== selected.title.trim().toLowerCase()}
              style={{
                ...ghostBtn, background: "#ff5c5c", color: "#2a0505", border: "none", fontWeight: 700,
                opacity: deleting || deleteText.trim().toLowerCase() !== selected.title.trim().toLowerCase() ? 0.4 : 1,
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {deleting ? <><Loader2 size={16} className="animate-spin" /> Deleting…</> : "Delete permanently"}
            </button>
            <button onClick={() => setConfirmDelete(false)} disabled={deleting} style={ghostBtn}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProductionPicker;
