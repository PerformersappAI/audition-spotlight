import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Seo from "@/components/Seo";
import BreakdownWorkspace from "@/components/breakdown/BreakdownWorkspace";
import { CREW_DEPARTMENTS, TEAL } from "@/components/breakdown/types";
import { CrewIdentity, CrewLinkError, createCrewAdapter, crewCall } from "@/lib/breakdown/adapter";

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

const storageKey = (token: string) => `fg_breakdown_crew_${token}`;

const readIdentity = (token: string): CrewIdentity | null => {
  try {
    const raw = localStorage.getItem(storageKey(token));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.crew_id && parsed?.crew_secret) return parsed as CrewIdentity;
  } catch { /* ignore */ }
  return null;
};

const CrewBreakdown = () => {
  const { token = "" } = useParams();
  const [project, setProject] = useState<{ title: string; company: string | null; status: string } | null>(null);
  const [dead, setDead] = useState(false);
  const [checking, setChecking] = useState(true);
  const [identity, setIdentity] = useState<CrewIdentity | null>(() => (token ? readIdentity(token) : null));
  const [showJoin, setShowJoin] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<string>(CREW_DEPARTMENTS[0]);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [sceneId, setSceneId] = useState<string>("");
  const [crewUrls, setCrewUrls] = useState<Record<string, string>>({});

  // Check the link once on load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await crewCall<{ project: { title: string; company: string | null; status: string } }>(token, "load");
        if (cancelled) return;
        setProject(data.project);
      } catch (err) {
        if (!cancelled) setDead(true);
        void (err as CrewLinkError);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    if (!checking && !dead && !identity) setShowJoin(true);
  }, [checking, dead, identity]);

  const onUrls = useCallback((urls: Record<string, string>) => {
    setCrewUrls((prev) => ({ ...prev, ...urls }));
  }, []);

  const adapter = useMemo(
    () => (identity ? createCrewAdapter({ token, identity, onUrls }) : null),
    [token, identity, onUrls],
  );
  void crewUrls;

  const join = async () => {
    const trimmed = name.trim();
    if (!trimmed) { setJoinError("Please enter your first name."); return; }
    setJoining(true);
    setJoinError("");
    try {
      const res = await crewCall<CrewIdentity>(token, identity ? "update_profile" : "join", {
        name: trimmed,
        department,
        crew_id: identity?.crew_id,
        crew_secret: identity?.crew_secret,
      });
      const next: CrewIdentity = {
        crew_id: res.crew_id || identity!.crew_id,
        crew_secret: res.crew_secret || identity!.crew_secret,
        name: trimmed,
        department,
      };
      localStorage.setItem(storageKey(token), JSON.stringify(next));
      setIdentity(next);
      setShowJoin(false);
    } catch (err: any) {
      setJoinError(err?.message || "Could not join. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const content = () => {
    if (checking) {
      return (
        <div style={{ ...panel, padding: 28, display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)" }}>
          <Loader2 size={16} className="animate-spin" /> Opening the breakdown…
        </div>
      );
    }
    if (dead) {
      return (
        <div style={{ ...panel, padding: 36, textAlign: "center" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700 }}>This link is no longer active.</div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 12, lineHeight: 1.6 }}>
            Ask your producer for a new one.
          </p>
        </div>
      );
    }
    if (!adapter) return null;
    return (
      <BreakdownWorkspace
        adapter={adapter}
        sceneId={sceneId}
        onSelectScene={(id) => setSceneId(id || "")}
      />
    );
  };

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "60vh" }}>
      <Seo
        title="Crew script breakdown | Filmmaker Genius"
        description="Private department checklist for the crew working on this production."
        noindex
      />
      <meta name="robots" content="noindex,nofollow" />
      <style>{`
        @media (max-width: 560px) {
          .cb-h1 { font-size: 30px !important; }
          .sb-row { flex-direction: column !important; align-items: stretch !important; }
          .sb-row > * { width: 100%; }
        }
        .sb-scroll-x { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
        .sb-scroll-x::-webkit-scrollbar { height: 6px; }
        .sb-scroll-x::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        .sb-tap { min-height: 44px; }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", overflowX: "hidden" }}>
        <div style={{ padding: "48px 0 28px" }}>
          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 12,
          }}>Script breakdown</div>
          <h1 className="cb-h1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 44, lineHeight: 1.05, margin: 0 }}>
            {project?.title || "Crew checklist"}
          </h1>
          {project?.company && (
            <div style={{ marginTop: 10, fontSize: 14, color: "rgba(255,255,255,0.45)" }}>{project.company}</div>
          )}
          {identity && (
            <div style={{ marginTop: 16, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
              You're {identity.name} · {identity.department}{" "}
              <button
                onClick={() => { setName(identity.name); setDepartment(identity.department); setShowJoin(true); }}
                style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", fontSize: 14, textDecoration: "underline", padding: "8px 4px" }}
              >
                (change)
              </button>
            </div>
          )}
        </div>

        {content()}
        <div style={{ height: 40 }} />
      </div>

      {showJoin && !dead && (
        <div style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ ...panel, background: "#10101b", width: "100%", maxWidth: 420, padding: 24 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, margin: 0 }}>Who are you?</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
              So the rest of the crew can see who ticked what.
            </p>
            <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "16px 0 6px" }}>First name</label>
            <input
              autoFocus
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") join(); }}
              placeholder="Sam"
              style={inputStyle}
            />
            <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "14px 0 6px" }}>Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} style={inputStyle}>
              {CREW_DEPARTMENTS.map((d) => (
                <option key={d} value={d} style={{ background: "#10101b" }}>{d}</option>
              ))}
            </select>
            {joinError && <div style={{ color: "#ff9d9d", fontSize: 14, marginTop: 12 }}>{joinError}</div>}
            <div className="sb-row" style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button onClick={join} disabled={joining || !name.trim()} style={{ ...primaryBtn, opacity: joining || !name.trim() ? 0.45 : 1 }}>
                {joining ? "Saving…" : "Start"}
              </button>
              {identity && (
                <button
                  onClick={() => setShowJoin(false)}
                  style={{ ...inputStyle, minHeight: 44, width: "auto", padding: "0 18px", cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrewBreakdown;
