import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import ProductionPicker, { ghostBtn, type Production } from "@/components/production/ProductionPicker";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import NoteComposer, { type NoteDraft } from "@/components/notes/NoteComposer";
import NoteList from "@/components/notes/NoteList";
import DailyReportDialog from "@/components/notes/DailyReportDialog";
import type { NoteScene, ProductionNote } from "@/lib/notes/types";

const STEPS = [
  { n: 1, title: "Pick your production", text: "Every note hangs off it." },
  { n: 2, title: "Tag it and date it", text: "Safety, talent, props, camera…" },
  { n: 3, title: "Translate for the crew", text: "So nobody misses it." },
  { n: 4, title: "Print the daily report", text: "One PDF per shoot day." },
];

const ProductionNotes = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Production | null>(null);
  const [scenes, setScenes] = useState<NoteScene[]>([]);
  const [actingName, setActingName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [busyNoteId, setBusyNoteId] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  const languages = selectedProject?.languages?.length ? selectedProject.languages : ["en"];
  const canTranslate = languages.length >= 2;

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("user_id", user.id)
        .maybeSingle();
      setActingName((data?.first_name || "").trim() || (user.email ? user.email.split("@")[0] : "Someone"));
    })();
  }, [user]);

  useEffect(() => {
    if (!selectedProject) { setScenes([]); return; }
    (async () => {
      const { data } = await supabase
        .from("breakdown_scenes")
        .select("id, scene_number, label")
        .eq("project_id", selectedProject.id)
        .order("sort_order", { ascending: true });
      setScenes((data || []) as NoteScene[]);
    })();
    setError("");
  }, [selectedProject]);

  const saveNote = async (draft: NoteDraft) => {
    if (!selectedProject) return;
    setSaving(true);
    setError("");
    try {
      if (draft.translate && canTranslate) {
        const data = await aiInvoke<{ note: ProductionNote }>("translate-note", {
          body: {
            project_id: selectedProject.id,
            tag: draft.tag,
            priority: draft.priority,
            shoot_day: draft.shootDay || null,
            scene_id: draft.sceneId || null,
            body: draft.body,
          },
        });
        if (!data?.note) throw new Error("The note could not be saved.");
      } else {
        const { error: err } = await supabase.from("production_notes").insert({
          project_id: selectedProject.id,
          tag: draft.tag,
          priority: draft.priority,
          shoot_day: draft.shootDay || null,
          scene_id: draft.sceneId || null,
          body: draft.body,
          source_language: null,
          translations: {},
          created_by_name: actingName || "Someone",
          created_by_department: "Production",
          created_by_user_id: user?.id || null,
        });
        if (err) throw err;
      }
      setRefreshKey((k) => k + 1);
    } catch (e) {
      if (!(e instanceof InsufficientCreditsError)) {
        setError(e instanceof Error ? e.message : "Could not save the note.");
      }
    } finally {
      setSaving(false);
    }
  };

  const retranslate = async (note: ProductionNote) => {
    if (!selectedProject) return;
    setBusyNoteId(note.id);
    setError("");
    try {
      await aiInvoke<{ note: ProductionNote }>("translate-note", {
        body: {
          project_id: selectedProject.id,
          note_id: note.id,
          tag: note.tag,
          priority: note.priority,
          shoot_day: note.shoot_day,
          scene_id: note.scene_id,
          body: note.body,
        },
      });
      setRefreshKey((k) => k + 1);
    } catch (e) {
      if (!(e instanceof InsufficientCreditsError)) {
        setError(e instanceof Error ? e.message : "Could not translate the note.");
      }
    } finally {
      setBusyNoteId(null);
    }
  };

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "60vh" }}>
      <style>{`
        @media (max-width: 800px) { .pn-steps { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 700px) { .pn-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) {
          .pn-steps { grid-template-columns: 1fr !important; }
          .pn-h1 { font-size: 34px !important; }
        }
        .pn-step-num {
          width: 28px; height: 28px; border-radius: 9999px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,212,170,0.12); color: #00d4aa;
          border: 1px solid rgba(0,212,170,0.4);
          font-size: 13px; font-weight: 700; flex: 0 0 auto;
        }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", overflowX: "hidden" }}>
        <div style={{ padding: "64px 0 36px", textAlign: "center" }}>
          <h1 className="pn-h1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 52, lineHeight: 1.05, margin: 0 }}>
            Production Notes
          </h1>
          <p style={{ marginTop: 16, fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 720, margin: "16px auto 0", lineHeight: 1.65 }}>
            One place for every note from set — tagged, dated, and translated for the whole crew.
          </p>
        </div>

        <div style={{ paddingBottom: 40 }}>
          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", marginBottom: 20,
          }}>How it works</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="pn-steps">
            {STEPS.map((s) => (
              <div key={s.n} style={{
                borderRadius: 16, padding: 20,
                background: "linear-gradient(135deg, #071820 0%, #0a2a30 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <span className="pn-step-num">{s.n}</span>
                <div>
                  <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 6, lineHeight: 1.5 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ProductionPicker
          emptyText="Give it a name, then every note from set lands here."
          onSelect={(p) => setSelectedProject(p)}
          extraControls={
            <button
              onClick={() => setShowReport(true)}
              style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <FileText size={16} /> Daily report
            </button>
          }
        />

        {selectedProject && (
          <>
            <NoteComposer
              scenes={scenes}
              languageCount={languages.length}
              saving={saving}
              error={error}
              onSave={saveNote}
            />

            <NoteList
              projectId={selectedProject.id}
              scenes={scenes}
              canTranslate={canTranslate}
              actingName={actingName || "Someone"}
              refreshKey={refreshKey}
              onRetranslate={retranslate}
              busyNoteId={busyNoteId}
            />

            {showReport && (
              <DailyReportDialog
                projectId={selectedProject.id}
                productionTitle={selectedProject.title}
                shootLocation={selectedProject.shoot_location}
                scenes={scenes}
                onClose={() => setShowReport(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductionNotes;
