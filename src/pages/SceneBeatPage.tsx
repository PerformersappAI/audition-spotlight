import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";

type FwKey = "p" | "g" | "r" | "t";
const ACCENT: Record<string, string> = {
  "three-act": "#a855f7",
  "save-the-cat": "#d4a017",
  "heros-journey": "#fb7185",
  "story-circle": "#00d4aa",
};
const COLOR: Record<FwKey, string> = { p: "#a855f7", g: "#d4a017", r: "#fb7185", t: "#2bd1c0" };
const GRAD = "linear-gradient(90deg,#d7dce4,#c3cad6)";
const STOPS: [string, string][] = [
  ["structure", "Structure"],
  ["cast", "Cast"],
  ["beats", "Beats"],
  ["scene", "Scene"],
  ["shots", "Shots"],
  ["movie", "Movie"],
];
type Ex = { slug: string; action: string };
type Beat = { t: string; fw: Partial<Record<FwKey, string>>; ex: Ex };
const M: Beat[] = [
  { t: "The Ordinary World", fw: { p: "Ordinary World", g: "Opening / Set-Up", r: "Ordinary World", t: "You" }, ex: { slug: "EXT. TATOOINE MOISTURE FARM — DAY", action: "Luke works the farm, gazing at the twin suns, restless for something more." } },
  { t: "The Theme", fw: { g: "Theme Stated" }, ex: { slug: "INT. BEN KENOBI'S HUT — DAY", action: "Obi-Wan: the Force gives a Jedi his power — trust it, not just the machine." } },
  { t: "The Need", fw: { t: "Need" }, ex: { slug: "EXT. TATOOINE RIDGE — DUSK", action: "Luke stares at the horizon, longing to leave the farm and find his purpose." } },
  { t: "The Call", fw: { p: "Inciting Incident", g: "Catalyst", r: "Call to Adventure" }, ex: { slug: "INT. LARS GARAGE — DAY", action: "R2-D2 plays Leia's message: 'Help me, Obi-Wan Kenobi.'" } },
  { t: "The Refusal", fw: { g: "Debate", r: "Refusal of the Call" }, ex: { slug: "INT. LARS HOMESTEAD — NIGHT", action: "Luke says he can't go — there is too much to do on the farm." } },
  { t: "The Mentor", fw: { r: "Meeting the Mentor" }, ex: { slug: "INT. BEN KENOBI'S HUT — DAY", action: "Obi-Wan gives Luke his father's lightsaber and begins to teach him the Force." } },
  { t: "The Point of No Return", fw: { p: "First Plot Point", g: "Break into Two", r: "Crossing the Threshold", t: "Go" }, ex: { slug: "EXT. LARS FARM — DAY", action: "Luke finds his aunt and uncle killed; nothing left, he leaves with Obi-Wan." } },
  { t: "The Bond", fw: { g: "B Story" }, ex: { slug: "INT. MOS EISLEY CANTINA — DAY", action: "Luke and Obi-Wan hire Han Solo and Chewbacca — the crew forms." } },
  { t: "The Trials", fw: { p: "Rising Action", g: "Fun & Games", r: "Tests, Allies, Enemies", t: "Search" }, ex: { slug: "INT. MILLENNIUM FALCON — SPACE", action: "Escaping Tatooine, training with the remote, dodging TIE fighters." } },
  { t: "The Midpoint Turn", fw: { p: "Midpoint", g: "Midpoint", t: "Find" }, ex: { slug: "INT. DEATH STAR DETENTION — DAY", action: "They rescue Leia — but the escape turns into a firefight and a trash-compactor trap." } },
  { t: "The Walls Close In", fw: { g: "Bad Guys Close In", r: "Approach the Inmost Cave" }, ex: { slug: "INT. DEATH STAR CORRIDORS — DAY", action: "Stormtroopers everywhere; Vader hunts Obi-Wan; time is running out." } },
  { t: "The Lowest Point", fw: { p: "Crisis / Low Point", g: "All Is Lost", r: "The Ordeal", t: "Take" }, ex: { slug: "INT. DEATH STAR HANGAR — DAY", action: "Vader strikes down Obi-Wan; Luke watches his mentor vanish." } },
  { t: "The Dark Night", fw: { g: "Dark Night of the Soul" }, ex: { slug: "INT. MILLENNIUM FALCON — SPACE", action: "Grieving Obi-Wan, Luke hears his voice — and steadies for what's ahead." } },
  { t: "The Turn to the End", fw: { g: "Break into Three", r: "Reward / Road Back", t: "Return" }, ex: { slug: "INT. REBEL BASE, YAVIN 4 — DAY", action: "The stolen plans reveal a weakness; Luke joins the assault on the Death Star." } },
  { t: "The Final Test", fw: { p: "Climax", g: "Finale", r: "Resurrection" }, ex: { slug: "EXT. DEATH STAR TRENCH — SPACE", action: "Luke switches off his targeting computer, trusts the Force, and fires the shot." } },
  { t: "The Elixir", fw: { r: "Return with the Elixir" }, ex: { slug: "EXT. YAVIN 4 — DAY", action: "The Death Star destroyed; the Rebellion — and hope — is saved." } },
  { t: "The New World", fw: { p: "Resolution", g: "Final Image", t: "Change" }, ex: { slug: "INT. REBEL THRONE ROOM — DAY", action: "The farm boy stands honored as a hero before the galaxy." } },
];
function slugify(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

type Group = { L: string; name: string; qs: string[] };
const SCENE_GROUPS: Group[] = [
  { L: "A", name: "The essentials", qs: ["Where does this scene take place — the exact location (INT./EXT.)?", "What time of day is it, and why does that matter?", "Who is in the scene when it begins?", "In one sentence, what happens in this scene?", "Which beat does this scene belong to, and what part of it is it showing?"] },
  { L: "B", name: "Why this scene exists", qs: ["What is this scene's one job — why can't you cut it?", "What does the audience learn or feel here that they didn't before?", "How does the story move forward because of this scene?", "What would break in the movie if this scene disappeared?", "What's the one thing you want people to remember from it?"] },
  { L: "C", name: "Who's in it", qs: ["Whose scene is this — who's the point-of-view character?", "Who else is present, and what's their relationship to the lead?", "Who has the power here, and does it shift?", "Is anyone hiding something, and from whom?", "Who's absent but still hanging over the scene?"] },
  { L: "D", name: "What everyone wants", qs: ["What does your main character want in this exact moment?", "What are they willing to do to get it?", "What does the other character want, and how does it clash?", "What's the obstacle standing in the way?", "What does your character actually need here, even if they don't know it?"] },
  { L: "E", name: "The dramatic turn", qs: ["What's different at the end of the scene than at the start?", "What's the turning point — the moment it pivots?", "What decision, discovery, or reversal happens?", "Does your character win, lose, or get something worse than they feared?", "What new problem or question does it leave open?"] },
  { L: "F", name: "Conflict & stakes", qs: ["What's the central conflict — who or what is your character up against?", "What's at stake for them in this scene specifically?", "How does the tension build from the first line to the last?", "What's the worst thing that could happen here?", "Where's the surprise the audience doesn't see coming?"] },
  { L: "G", name: "Emotion & tone", qs: ["What do you want the audience to feel during this scene?", "What's your main character feeling — and what are they hiding?", "What's the mood: tense, funny, tender, dread, chaotic?", "Where's the emotional high point?", "What feeling do you want to leave people with as it ends?"] },
  { L: "H", name: "The world & atmosphere", qs: ["What does this place look like — the details that make it real?", "What do we hear, smell, or feel in this space?", "What's the light, weather, or texture of the moment?", "What object or detail in the setting matters to the scene?", "How does the location itself add pressure or meaning?"] },
  { L: "I", name: "Craft & staging", qs: ["What's the first image or line — how does it open?", "What's the last image or line — how does it end?", "Whose eyes are we watching this through?", "What's said out loud vs. left unspoken (the subtext)?", "Should it feel quick and sharp, or slow and building?"] },
  { L: "J", name: "Connection & flow", qs: ["What just happened in the scene right before this one?", "How does this scene hand off to the next?", "What earlier setup does it pay off, or plant for later?", "How does this scene serve the beat it lives under?", "How does it push your hero one step along their overall arc?"] },
];
type Item = { kind: "group"; L: string; name: string } | { kind: "q"; text: string; qi: number };
function flatten(groups: Group[]): Item[] {
  const out: Item[] = []; let qi = 0;
  for (const g of groups) { out.push({ kind: "group", L: g.L, name: g.name }); for (const q of g.qs) { out.push({ kind: "q", text: q, qi }); qi++; } }
  return out;
}
const SCENE_ITEMS = flatten(SCENE_GROUPS);
const SCENE_FLAT = SCENE_GROUPS.flatMap((g) => g.qs);
const SCENE_TOTAL = SCENE_FLAT.length;
const COACH: string[] = [
  "Give me the concrete, specific details behind your answer — the raw material.",
  "What's the most important part of this, and why does it matter to the scene?",
  "What do you want the audience to feel or take from this moment?",
];

type SceneData = { a: Record<number, string>; c: Record<number, Record<number, string>> };

export default function SceneBeatPage() {
  const { structure = "three-act", beat = "" } = useParams<{ structure: string; beat: string }>();
  const accent = ACCENT[structure] || "#a855f7";
  const [fwSel, setFwSel] = useState<FwKey[]>([]);
  const [full, setFull] = useState<Record<string, SceneData[]>>({});
  const [answersBeat, setAnswersBeat] = useState<Record<number, string>>({});
  const [beatAns, setBeatAns] = useState<Record<string, Record<number, string>>>({});
  const [openScene, setOpenScene] = useState(-1);
  const [active, setActive] = useState<{ si: number; qi: number } | null>(null);
  const [weaving, setWeaving] = useState(false);
  const [coachErr, setCoachErr] = useState("");

  useEffect(() => {
    const readFw = () => { try { const f = localStorage.getItem("mib-frameworks"); setFwSel(f ? JSON.parse(f) : []); } catch { /* ignore */ } };
    readFw();
    try { const s = localStorage.getItem("mib-scene-dev"); setFull(s ? JSON.parse(s) : {}); } catch { /* ignore */ }
    try { const a = localStorage.getItem("mib-master-beats"); setAnswersBeat(a ? JSON.parse(a) : {}); } catch { /* ignore */ }
    try { const b = localStorage.getItem("mib-beats"); setBeatAns(b ? JSON.parse(b) : {}); } catch { /* ignore */ }
    window.addEventListener("mib-fw", readFw);
    window.addEventListener("storage", readFw);
    return () => { window.removeEventListener("mib-fw", readFw); window.removeEventListener("storage", readFw); };
  }, []);

  const fws = fwSel.length ? fwSel : (["p", "g", "r", "t"] as FwKey[]);
  const flowBeats = M.filter((b) => fws.some((k) => !!b.fw[k]));
  const idx = M.findIndex((b) => slugify(b.t) === beat);
  if (idx < 0) return <Navigate to={`/movie-in-a-box/${structure}/scene`} replace />;
  const current = M[idx];
  const scenes = full[beat] || [];

  const persist = (next: Record<string, SceneData[]>) => {
    setFull(next);
    try { localStorage.setItem("mib-scene-dev", JSON.stringify(next)); } catch { /* ignore */ }
    try { window.dispatchEvent(new CustomEvent("mib-scenes-change")); } catch { /* ignore */ }
  };
  const updateScenes = (fn: (arr: SceneData[]) => SceneData[]) => { persist({ ...full, [beat]: fn([...(full[beat] || [])]) }); };
  const addScene = () => updateScenes((arr) => [...arr, { a: { 4: current.t }, c: {} }]);
  const removeScene = (si: number) => { updateScenes((arr) => { const n = [...arr]; n.splice(si, 1); return n; }); if (openScene === si) setOpenScene(-1); setActive(null); };
  const setAnswer = (si: number, qi: number, val: string) => updateScenes((arr) => { const n = [...arr]; n[si] = { ...n[si], a: { ...n[si].a, [qi]: val } }; return n; });
  const setCoachAns = (si: number, qi: number, ci: number, val: string) => updateScenes((arr) => { const n = [...arr]; const sc = n[si]; n[si] = { ...sc, c: { ...sc.c, [qi]: { ...(sc.c[qi] || {}), [ci]: val } } }; return n; });

  const openCoach = (si: number, qi: number) => { setActive({ si, qi }); setCoachErr(""); if (typeof window !== "undefined" && window.innerWidth < 1024) setTimeout(() => document.getElementById("mib-scene-coach")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60); };

  const weave = async () => {
    if (!active || weaving) return;
    setCoachErr(""); setWeaving(true);
    try {
      const sc = (full[beat] || [])[active.si];
      const cAns = (sc?.c || {})[active.qi] || {};
      const items = COACH.map((q, ci) => ({ q, a: cAns[ci] || "" }));
      if (storyContext) items.unshift({ q: "Background on the hero and world, from the writer's Ordinary World beat (use as context, do not contradict)", a: storyContext });
      const { data, error } = await supabase.functions.invoke("movie-brain", { body: { mainQuestion: SCENE_FLAT[active.qi] || "", items } });
      if (error) throw error;
      const p = data as { text?: string; error?: string } | null;
      if (p?.error) throw new Error(p.error);
      if (p?.text) setAnswer(active.si, active.qi, p.text);
      else throw new Error("No text returned");
    } catch (e) { setCoachErr(e instanceof Error ? e.message : "Weave failed"); }
    finally { setWeaving(false); }
  };

  const chips = fws.filter((k) => current.fw[k]);
  const mine = (answersBeat[idx] || "").trim();
  const activeCoachAns = active ? (((full[beat] || [])[active.si]?.c || {})[active.qi] || {}) : {};
  const ow = beatAns["the-ordinary-world"] || {};
  const storyFacts = ([["Hero", 0], ["Flaw", 6], ["Wants", 8], ["Needs", 9], ["World", 20], ["People", 27]] as [string, number][]).map(([k, i]) => [k, (ow[i] || "").trim()] as [string, string]).filter(([, v]) => v);
  const storyContext = storyFacts.map(([k, v]) => `${k}: ${v}`).join(" · ");

  return (
    <>
      <Seo title={`${current.t} — Scenes | Movie in a Box | Filmmaker Genius`} description={`Build the scenes for ${current.t}.`} canonical={`https://filmmakergenius.com/movie-in-a-box/${structure}/scene/${beat}`} type="website" />

      <nav aria-label="Scenes flow" className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto mib-noscroll py-2.5 text-sm whitespace-nowrap">
            <li><Link to="/movie-in-a-box" className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors">Movie in a Box</Link></li>
            <li className="text-foreground/30" aria-hidden="true">›</li>
            {STOPS.map(([key, label]) => { const isActive = key === "scene"; return (
              <li key={key}><Link to={`/movie-in-a-box/${structure}/${key}`} aria-current={isActive ? "page" : undefined} className={isActive ? "inline-block rounded-md px-3 py-1.5 font-semibold" : "inline-block rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"} style={isActive ? { color: accent } : undefined}>{label}</Link></li>
            ); })}
          </ul>
          <ul className="flex flex-wrap items-center gap-y-1 pb-3 pt-1.5 text-sm border-t border-white/5">
            <li><span className="inline-flex items-center rounded-md px-3 py-1.5 font-semibold" style={{ color: accent }}>Scene Flow</span></li>
            {flowBeats.map((b) => { const isCur = slugify(b.t) === beat; return (
              <li key={b.t} className="flex items-center">
                <span className="text-foreground/25 px-0.5" aria-hidden="true">·</span>
                <Link to={`/movie-in-a-box/${structure}/scene/${slugify(b.t)}`} className="inline-block rounded-md px-2 py-1.5 text-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors" style={isCur ? { color: accent, fontWeight: 700 } : undefined}>{b.t}</Link>
              </li>
            ); })}
          </ul>
        </div>
      </nav>

      <section className="bg-background px-4 py-10 pb-24 min-h-[calc(100vh-260px)]">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Scene workspace</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{current.t}</h1>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {chips.map((k) => (<span key={k} className="text-[10px] font-bold rounded-full px-2.5 py-[3px]" style={{ color: COLOR[k], backgroundColor: `${COLOR[k]}22`, border: `1px solid ${COLOR[k]}66` }}>{current.fw[k]}</span>))}
          </div>
          {mine ? (
            <div className="text-[13px] text-foreground/85 mt-4"><span className="text-foreground/40 font-semibold">Your beat: </span>{mine}</div>
          ) : (
            <div className="text-[12px] text-foreground/40 italic mt-4">Not written on the Beat Sheet yet — you can still build scenes here.</div>
          )}
          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 mt-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1 bg-clip-text text-transparent w-fit" style={{ backgroundImage: GRAD }}>Example · Star Wars</div>
            <div className="font-mono text-[11px] font-bold uppercase text-foreground/80">{current.ex.slug}</div>
            <div className="text-[12.5px] text-foreground/60 mt-0.5">{current.ex.action}</div>
          </div>
          <p className="text-[13px] text-foreground/55 mt-4 max-w-[660px]">Each scene is one place and one moment — leave the room or jump in time and it's a new scene. Add a scene, then answer its 50 questions; the questions are the same every time, the answers change with the place. Stuck on one? Hit ✨ and the AI Coach on the right helps you flesh it out.</p>

          <div className="mt-6 lg:flex lg:gap-6 lg:items-start">
            <div className="lg:flex-1 min-w-0 flex flex-col gap-2.5">
              {scenes.map((s, si) => {
                const isOpen = openScene === si;
                const loc = (s.a[0] || "").trim();
                const filled = Object.values(s.a).filter((v) => v && v.trim()).length;
                return (
                  <div key={si} className="rounded-xl border bg-white/[0.02] overflow-hidden" style={{ borderColor: isOpen ? accent : "#2c323b" }}>
                    <div className="w-full flex items-center gap-3 px-4 py-3.5">
                      <button onClick={() => setOpenScene(isOpen ? -1 : si)} className="flex items-center gap-3 text-left flex-1 min-w-0">
                        <span className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-extrabold flex-shrink-0" style={{ background: accent, color: "#0c0e13" }}>{si + 1}</span>
                        <span className="text-[14.5px] font-extrabold text-foreground truncate">{loc || `Scene ${si + 1}`}</span>
                      </button>
                      <span className="text-[11px] text-foreground/40 flex-shrink-0">{filled}/{SCENE_TOTAL}</span>
                      <button onClick={() => removeScene(si)} className="text-[11px] text-foreground/35 hover:text-foreground/80 flex-shrink-0">Remove</button>
                      <button onClick={() => setOpenScene(isOpen ? -1 : si)} className="text-[12px] text-foreground/50 flex-shrink-0" style={{ transform: isOpen ? "rotate(90deg)" : "none" }}>▸</button>
                    </div>
                    {isOpen && (
                      <div className="border-t border-white/10 px-4 pb-4">
                        {SCENE_ITEMS.map((it) => it.kind === "group" ? (
                          <div key={"g" + it.L} className="mt-5 mb-1 flex items-center gap-2.5">
                            <span className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[12px] font-extrabold" style={{ background: "#f0d089", color: "#1a1300" }}>{it.L}</span>
                            <span className="text-[13px] font-extrabold" style={{ color: "#f0d089" }}>{it.name}</span>
                            <span className="flex-1 h-px bg-white/10" />
                          </div>
                        ) : (
                          <div key={"q" + it.qi} className="flex gap-3 py-2.5 border-b border-white/[0.045] rounded-lg" style={active && active.si === si && active.qi === it.qi ? { background: "rgba(212,160,23,0.06)" } : {}}>
                            <span className="w-6 text-right text-[11px] font-extrabold text-foreground/35 pt-1">{it.qi + 1}</span>
                            <div className="flex-1">
                              <label className="block text-[13px] font-semibold text-foreground mb-1.5">{it.text}</label>
                              <textarea value={s.a[it.qi] || ""} onChange={(e) => setAnswer(si, it.qi, e.target.value)} placeholder="Type your answer…" className="w-full bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-2.5 py-2 text-[12.5px] resize-y" style={{ minHeight: 36, fontFamily: "inherit" }} />
                              <button onClick={() => openCoach(si, it.qi)} className="mt-1.5 text-[10.5px] font-bold rounded-md px-2.5 py-1" style={{ color: "#f0d089", background: "#1a1710", border: `1px solid ${accent}66` }}>✨ Coach me on this →</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <button onClick={addScene} className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold rounded-lg border border-dashed px-4 py-2.5 self-start" style={{ color: accent, borderColor: accent }}>＋ Add a scene</button>
            </div>

            <aside id="mib-scene-coach" className="mt-5 lg:mt-0 lg:w-[380px] lg:flex-shrink-0">
              <div className="lg:sticky lg:top-[92px] rounded-xl border border-white/12 bg-[#12141a] overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 110px)" }}>
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2" style={{ background: "linear-gradient(180deg,#1a1710,#12141a)" }}>
                  <span className="text-[14px] font-extrabold" style={{ color: "#f0d089" }}>🧠 AI Coach</span>
                  {active && <button onClick={() => setActive(null)} className="ml-auto text-foreground/40 hover:text-foreground text-[13px]">✕</button>}
                </div>
                {!active ? (
                  <div className="p-4 overflow-y-auto" style={{ flex: "1 1 auto" }}>
                    <div className="text-[10px] uppercase tracking-wide text-foreground/40 font-bold mb-2">Carried over · from your beat</div>
                    {storyFacts.length ? (
                      <>
                        <div className="rounded-lg border px-3 py-1.5" style={{ borderColor: "rgba(240,208,137,0.3)", background: "rgba(240,208,137,0.05)" }}>
                          {storyFacts.map(([k, v]) => (
                            <div key={k} className="grid grid-cols-[58px_1fr] gap-2 py-1.5 border-b border-white/[0.05] last:border-0">
                              <span className="text-[9.5px] font-bold uppercase tracking-wide text-foreground/40 pt-0.5">{k}</span>
                              <span className="text-[12px] text-foreground/85 leading-snug">{v}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[11px] text-foreground/50 leading-relaxed mt-3"><span style={{ color: "#f0d089" }} className="font-bold">✨ Same brain as your beat.</span> The coach uses these facts when you weave a scene answer. Hit <span style={{ color: "#f0d089" }} className="font-bold">✨ Coach me on this</span> on any question to start.</div>
                      </>
                    ) : (
                      <div className="text-[12.5px] text-foreground/45 leading-relaxed">Answer your <span className="font-bold" style={{ color: "#f0d089" }}>Ordinary World</span> beat and the hero, flaw, and world you wrote will show up here — and feed the scene coach. For now, add a scene and hit ✨ on any question.</div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col min-h-0">
                    <div className="px-4 pt-3 pb-2 border-b border-white/8">
                      <div className="text-[10px] uppercase tracking-wide text-foreground/40 font-bold">Coaching · Scene {active.si + 1}</div>
                      <div className="text-[13px] font-bold text-foreground mt-0.5">{SCENE_FLAT[active.qi]}</div>
                    </div>
                    <div className="overflow-y-auto px-4 py-3" style={{ flex: "1 1 auto" }}>
                      <div className="text-[11.5px] text-foreground/50 mb-2">Answer any of these — the more, the richer. They weave into your answer.</div>
                      {COACH.map((q, ci) => (
                        <div key={ci} className="mb-3">
                          <label className="block text-[12px] text-foreground/85 mb-1"><span className="text-foreground/35 font-bold mr-1">{ci + 1}.</span>{q}</label>
                          <textarea value={activeCoachAns[ci] || ""} onChange={(e) => setCoachAns(active.si, active.qi, ci, e.target.value)} placeholder="…" className="w-full bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-2.5 py-1.5 text-[12px] resize-y" style={{ minHeight: 30, fontFamily: "inherit" }} />
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-white/10">
                      {coachErr && <div className="mb-2 text-[11px]" style={{ color: "#ff9a9a" }}>{coachErr}</div>}
                      <button onClick={weave} disabled={weaving} className="w-full text-[12.5px] font-extrabold rounded-lg py-2.5 disabled:opacity-50" style={{ background: accent, color: "#0c0e13" }}>{weaving ? "✨ Weaving…" : "✨ Weave into my answer"}</button>
                      <div className="text-[10px] text-foreground/35 mt-1.5 text-center">The AI writes a polished answer into the left box using only what you gave it.</div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-foreground/40">Movie in a Box · Scenes · {current.t}</footer>
    </>
  );
}
