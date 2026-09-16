import { useCallback, useEffect, useState } from "react";
import { Copy, Loader2, MessageSquare, Mail, RefreshCw, Share2, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { timeAgo } from "./timeAgo";
import { TEAL } from "./types";

interface CrewRow {
  id: string;
  name: string;
  department: string | null;
  last_seen_at: string | null;
}

interface Props {
  projectId: string;
  projectTitle: string;
  shareToken: string;
  sharingEnabled: boolean;
  onChange: (patch: { share_token?: string; sharing_enabled?: boolean }) => void;
}

const panel: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const btn: React.CSSProperties = {
  minHeight: 44,
  padding: "0 14px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.14)",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "'Inter Tight', sans-serif",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  textDecoration: "none",
};

const randomToken = () => {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
};

const SharePanel = ({ projectId, projectTitle, shareToken, sharingEnabled, onChange }: Props) => {
  const [crew, setCrew] = useState<CrewRow[]>([]);
  const [loadingCrew, setLoadingCrew] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);

  const link = `https://filmmakergenius.com/b/${shareToken}`;
  const message = `You've been added to the ${projectTitle} script breakdown. Open this link to see your department checklist: ${link}`;

  const loadCrew = useCallback(async () => {
    setLoadingCrew(true);
    const { data } = await supabase
      .from("breakdown_crew")
      .select("id, name, department, last_seen_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    setCrew((data || []) as CrewRow[]);
    setLoadingCrew(false);
  }, [projectId]);

  useEffect(() => { loadCrew(); }, [loadCrew]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: "Link copied" });
    } catch {
      toast({ title: "Couldn't copy", description: link, variant: "destructive" });
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: `${projectTitle} — script breakdown`, text: message, url: link });
    } catch { /* dismissed */ }
  };

  const toggleSharing = async () => {
    setBusy(true);
    const next = !sharingEnabled;
    const { error } = await supabase.from("breakdown_projects").update({ sharing_enabled: next }).eq("id", projectId);
    setBusy(false);
    if (error) { toast({ title: "Couldn't change sharing", description: error.message, variant: "destructive" }); return; }
    onChange({ sharing_enabled: next });
  };

  const resetLink = async () => {
    setBusy(true);
    const token = randomToken();
    const { error } = await supabase.from("breakdown_projects").update({ share_token: token }).eq("id", projectId);
    setBusy(false);
    setConfirmReset(false);
    if (error) { toast({ title: "Couldn't reset the link", description: error.message, variant: "destructive" }); return; }
    onChange({ share_token: token });
    toast({ title: "New link created", description: "The old link stopped working straight away." });
  };

  return (
    <div style={{ ...panel, padding: 20, marginTop: 14 }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700 }}>Share with crew</div>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginTop: 8 }}>
        Anyone with this link can work through the checklists — no account needed.
      </p>

      <div style={{
        marginTop: 14, padding: "12px 14px", borderRadius: 10,
        background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.12)",
        fontSize: 14, color: sharingEnabled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
        wordBreak: "break-all", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}>{link}</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
        <button onClick={copy} style={{ ...btn, background: "rgba(0,212,170,0.12)", borderColor: "rgba(0,212,170,0.4)", color: TEAL }}>
          <Copy size={15} /> Copy link
        </button>
        <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" style={btn}>
          <MessageSquare size={15} /> WhatsApp
        </a>
        <a href={`sms:?&body=${encodeURIComponent(message)}`} style={btn}>
          <Smartphone size={15} /> SMS
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(`${projectTitle} — script breakdown`)}&body=${encodeURIComponent(message)}`}
          style={btn}
        >
          <Mail size={15} /> Email
        </a>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button onClick={nativeShare} style={btn}><Share2 size={15} /> Share…</button>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 18 }}>
        <button onClick={toggleSharing} disabled={busy} style={{ ...btn, opacity: busy ? 0.5 : 1 }}>
          {sharingEnabled ? "Link sharing is ON — turn off" : "Link sharing is OFF — turn on"}
        </button>
        {confirmReset ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
            Reset the link? The old one stops working.
            <button onClick={resetLink} disabled={busy} style={{ ...btn, background: "#ff5c5c", color: "#2a0505", border: "none", fontWeight: 700 }}>Yes</button>
            <button onClick={() => setConfirmReset(false)} style={btn}>No</button>
          </span>
        ) : (
          <button onClick={() => setConfirmReset(true)} style={btn}><RefreshCw size={15} /> Reset link</button>
        )}
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{
          fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)", marginBottom: 10,
        }}>Crew</div>
        {loadingCrew ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        ) : crew.length === 0 ? (
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>Nobody has opened the link yet.</div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {crew.map((c) => (
              <li key={c.id} style={{
                display: "flex", justifyContent: "space-between", gap: 12,
                padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14,
              }}>
                <span style={{ color: "rgba(255,255,255,0.85)" }}>
                  {c.name}
                  {c.department ? <span style={{ color: "rgba(255,255,255,0.45)" }}> · {c.department}</span> : null}
                </span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{timeAgo(c.last_seen_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SharePanel;
