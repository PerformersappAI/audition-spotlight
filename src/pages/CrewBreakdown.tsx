import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import BreakdownWorkspace from "@/components/breakdown/BreakdownWorkspace";
import CrewExpenses from "@/components/expenses/CrewExpenses";
import CrewMessages from "@/components/translator/CrewMessages";
import { CREW_DEPARTMENTS, TEAL } from "@/components/breakdown/types";
import { CrewIdentity, CrewLinkError, createCrewAdapter, crewCall } from "@/lib/breakdown/adapter";
import { crewMessageApi } from "@/lib/translator/crew";
import CrewNotes from "@/components/notes/CrewNotes";
import { crewNoteApi } from "@/lib/notes/crew";
import type { NoteScene, ProductionNote } from "@/lib/notes/types";
import type { ProductionMessage } from "@/lib/translator/types";

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
const tabKey = (token: string) => `fg_crew_tab_${token}`;
const seenKey = (token: string) => `fg_crew_msgseen_${token}`;
const notesSeenKey = (token: string) => `fg_crew_noteseen_${token}`;

const MESSAGE_PAGE = 30;

type CrewTab = "breakdown" | "receipts" | "messages" | "notes";

interface CrewProject {
  title: string;
  company: string | null;
  status: string;
  default_currency?: string;
  languages?: string[];
  shoot_location?: string | null;
}

const readTab = (token: string): CrewTab => {
  try {
    const stored = localStorage.getItem(tabKey(token));
    if (stored === "receipts" || stored === "messages" || stored === "notes") return stored;
  } catch { /* ignore */ }
  return "breakdown";
};

const readSeen = (token: string, key: (t: string) => string): string => {
  try {
    return localStorage.getItem(key(token)) || "";
  } catch {
    return "";
  }
};

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
  const [project, setProject] = useState<CrewProject | null>(null);
  const [tab, setTab] = useState<CrewTab>(() => readTab(token));
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

  const [messages, setMessages] = useState<ProductionMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesHasMore, setMessagesHasMore] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<string | null>(null);
  const [seenAt, setSeenAt] = useState<string>(() => (token ? readSeen(token, seenKey) : ""));

  const [scenes, setScenes] = useState<NoteScene[]>([]);
  const [notes, setNotes] = useState<ProductionNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesSeenAt, setNotesSeenAt] = useState<string>(() => (token ? readSeen(token, notesSeenKey) : ""));

  // Check the link once on load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await crewCall<{ project: CrewProject; scenes?: NoteScene[] }>(token, "load");
        if (cancelled) return;
        setProject(data.project);
        setScenes((data.scenes || []) as NoteScene[]);
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

  const messageApi = useMemo(
    () => (identity ? crewMessageApi(token, identity) : null),
    [token, identity],
  );

  const loadMessages = useCallback(async () => {
    if (!messageApi) return;
    try {
      const res = await messageApi.list();
      setMessages(res.messages);
      setMessagesHasMore(res.messages.length >= MESSAGE_PAGE);
      setPreferredLanguage(res.preferred_language);
    } catch { /* keep whatever we already have */ } finally {
      setMessagesLoading(false);
    }
  }, [messageApi]);

  const loadOlderMessages = useCallback(async () => {
    if (!messageApi || messages.length === 0) return;
    const before = messages[messages.length - 1].created_at;
    try {
      const res = await messageApi.list(before);
      setMessagesHasMore(res.messages.length >= MESSAGE_PAGE);
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        return [...prev, ...res.messages.filter((m) => !seen.has(m.id))];
      });
    } catch { /* ignore */ }
  }, [messageApi, messages]);

  // Poll for new messages every 20s while the page is visible.
  useEffect(() => {
    if (!messageApi || dead) return;
    loadMessages();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadMessages();
    }, 20_000);
    return () => window.clearInterval(timer);
  }, [messageApi, dead, loadMessages]);

  const markMessagesSeen = useCallback(() => {
    const now = new Date().toISOString();
    setSeenAt(now);
    try {
      localStorage.setItem(seenKey(token), now);
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => {
    if (tab === "messages" && messages.length) markMessagesSeen();
  }, [tab, messages, markMessagesSeen]);

  const unread = tab === "messages"
    ? 0
    : messages.filter((m) => !seenAt || m.created_at > seenAt).length;

  // ---- notes ---------------------------------------------------------------
  const noteApi = useMemo(
    () => (identity ? crewNoteApi(token, identity) : null),
    [token, identity],
  );

  const loadNotes = useCallback(async () => {
    if (!noteApi) return;
    try {
      const res = await noteApi.list();
      setNotes(res.notes);
      setPreferredLanguage((prev) => prev ?? res.preferred_language);
    } catch { /* keep whatever we already have */ } finally {
      setNotesLoading(false);
    }
  }, [noteApi]);

  // Poll for new notes every 20s while the page is visible.
  useEffect(() => {
    if (!noteApi || dead) return;
    loadNotes();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadNotes();
    }, 20_000);
    return () => window.clearInterval(timer);
  }, [noteApi, dead, loadNotes]);

  const markNotesSeen = useCallback(() => {
    const now = new Date().toISOString();
    setNotesSeenAt(now);
    try {
      localStorage.setItem(notesSeenKey(token), now);
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => {
    if (tab === "notes" && notes.length) markNotesSeen();
  }, [tab, notes, markNotesSeen]);

  const unreadNotes = tab === "notes"
    ? 0
    : notes.filter((n) => !notesSeenAt || n.created_at > notesSeenAt).length;



  const productionLanguages = project?.languages?.length ? project.languages : ["en"];

  const changeIdentity = () => {
    if (!identity) return;
    setName(identity.name);
    setDepartment(identity.department);
    setShowJoin(true);
  };

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
    if (!adapter || !identity) return null;
    if (tab === "messages") {
      return (
        <CrewMessages
          token={token}
          identity={identity}
          languages={productionLanguages}
          shootLocation={project?.shoot_location ?? null}
          messages={messages}
          loading={messagesLoading}
          hasMore={messagesHasMore}
          preferredLanguage={preferredLanguage}
          onLoadMore={loadOlderMessages}
          onPosted={loadMessages}
        />
      );
    }
    if (tab === "receipts") {
      return (
        <CrewExpenses
          token={token}
          identity={identity}
          defaultCurrency={project?.default_currency || "USD"}
          onChangeIdentity={changeIdentity}
        />
      );
    }
    return (
      <BreakdownWorkspace
        adapter={adapter}
        sceneId={sceneId}
        onSelectScene={(id) => setSceneId(id || "")}
        projectTitle={project?.title || "Production"}
        company={project?.company ?? null}
      />

    );
  };

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "60vh" }}>
      <Helmet>
        <title>Crew script breakdown | Filmmaker Genius</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Private department checklist for the crew working on this production." />
      </Helmet>
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
                onClick={changeIdentity}
                style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", fontSize: 14, textDecoration: "underline", padding: "8px 4px" }}
              >
                (change)
              </button>
            </div>
          )}
        </div>

        {!checking && !dead && identity && (
          <div className="sb-scroll-x" style={{ display: "flex", gap: 8, marginBottom: 22 }}>
            {([["breakdown", "Breakdown"], ["receipts", "Receipts"], ["messages", "Messages"]] as [CrewTab, string][]).map(([key, copy]) => (
              <button
                key={key}
                onClick={() => {
                  setTab(key);
                  try { localStorage.setItem(tabKey(token), key); } catch { /* ignore */ }
                  if (key === "messages") markMessagesSeen();
                }}
                style={{
                  minHeight: 44, padding: "0 20px", borderRadius: 9999, cursor: "pointer",
                  fontSize: 15, fontWeight: 700, whiteSpace: "nowrap",
                  border: `1px solid ${tab === key ? TEAL : "rgba(255,255,255,0.14)"}`,
                  background: tab === key ? "rgba(0,212,170,0.14)" : "rgba(255,255,255,0.04)",
                  color: tab === key ? TEAL : "#fff",
                  fontFamily: "'Inter Tight', sans-serif",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}
              >
                {copy}
                {key === "messages" && unread > 0 && (
                  <span style={{
                    minWidth: 20, height: 20, borderRadius: 9999, padding: "0 6px",
                    background: TEAL, color: "#04231d", fontSize: 12, fontWeight: 700,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>{unread}</span>
                )}
              </button>
            ))}
          </div>
        )}

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
