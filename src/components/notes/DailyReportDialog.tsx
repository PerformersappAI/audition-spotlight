import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Modal, inputStyle, primaryBtn } from "@/components/production/ProductionPicker";
import { downloadNotesPDF } from "@/lib/notes/exportNotes";
import { NOTE_FIELDS, todayLocal, type NoteScene, type ProductionNote } from "@/lib/notes/types";

interface Props {
  projectId: string;
  productionTitle: string;
  shootLocation?: string | null;
  scenes: NoteScene[];
  onClose: () => void;
}

const DailyReportDialog = ({ projectId, productionTitle, shootLocation, scenes, onClose }: Props) => {
  const [day, setDay] = useState(todayLocal());
  const [includeResolved, setIncludeResolved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setBusy(true);
    setError("");
    try {
      let query = supabase
        .from("production_notes")
        .select(NOTE_FIELDS)
        .eq("project_id", projectId)
        .eq("shoot_day", day);
      if (!includeResolved) query = query.eq("resolved", false);
      const { data, error: err } = await query.order("created_at", { ascending: true });
      if (err) throw err;
      await downloadNotesPDF({
        notes: (data || []) as ProductionNote[],
        productionTitle,
        day,
        shootLocation,
        scenes,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build the report.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Daily report" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Shoot day</label>
          <input type="date" value={day} onChange={(e) => setDay(e.target.value)} style={inputStyle} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 44, cursor: "pointer", fontSize: 14 }}>
          <input
            type="checkbox"
            checked={includeResolved}
            onChange={(e) => setIncludeResolved(e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          Include resolved notes
        </label>
        {error && <div style={{ color: "#ff9d9d", fontSize: 14 }}>{error}</div>}
        <button onClick={generate} disabled={busy || !day} style={{ ...primaryBtn, opacity: busy || !day ? 0.45 : 1 }}>
          {busy ? "Building PDF…" : "Download PDF"}
        </button>
      </div>
    </Modal>
  );
};

export default DailyReportDialog;
