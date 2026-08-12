import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Seo from "@/components/Seo";

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

export default function SceneBeatPage() {
  const { structure = "three-act", beat = "" } = useParams<{ structure: string; beat: string }>();
  const accent = ACCENT[structure] || "#a855f7";
  const [fwSel, setFwSel] = useState<FwKey[]>([]);
  const [scenes, setScenes] = useState<Record<number, Ex[]>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  useEffect(() => {
    const readFw = () => { try { const f = localStorage.getItem("mib-frameworks"); setFwSel(f ? JSON.parse(f) : []); } catch { /* ignore */ } };
    readFw();
    try { const s = localStorage.getItem("mib-scenes"); setScenes(s ? JSON.parse(s) : {}); } catch { /* ignore */ }
    try { const a = localStorage.getItem("mib-master-beats"); setAnswers(a ? JSON.parse(a) : {}); } catch { /* ignore */ }
    window.addEventListener("mib-fw", readFw);
    window.addEventListener("storage", readFw);
    return () => { window.removeEventListener("mib-fw", readFw); window.removeEventListener("storage", readFw); };
  }, []);

  const fws = fwSel.length ? fwSel : (["p", "g", "r", "t"] as FwKey[]);
  const flowBeats = M.filter((b) => fws.some((k) => !!b.fw[k]));
  const idx = M.findIndex((b) => slugify(b.t) === beat);
  if (idx < 0) return <Navigate to={`/movie-in-a-box/${structure}/scene`} replace />;
  const current = M[idx];

  const persist = (n: Record<number, Ex[]>) => { try { localStorage.setItem("mib-scenes", JSON.stringify(n)); } catch { /* ignore */ } try { window.dispatchEvent(new CustomEvent("mib-scenes-change")); } catch { /* ignore */ } };
  const list = scenes[idx] || [];
  const add = () => setScenes((p) => { const n = { ...p, [idx]: [...(p[idx] || []), { slug: "", action: "" }] }; persist(n); return n; });
  const upd = (j: number, field: "slug" | "action", v: string) => setScenes((p) => { const arr = [...(p[idx] || [])]; arr[j] = { ...arr[j], [field]: v }; const n = { ...p, [idx]: arr }; persist(n); return n; });
  const rm = (j: number) => setScenes((p) => { const arr = [...(p[idx] || [])]; arr.splice(j, 1); const n = { ...p, [idx]: arr }; persist(n); return n; });

  const chips = fws.filter((k) => current.fw[k]);
  const mine = (answers[idx] || "").trim();

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

      <section className="bg-background px-4 py-10 min-h-[calc(100vh-300px)]">
        <div className="container mx-auto max-w-[820px]">
          <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Scene workspace</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{current.t}</h1>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {chips.map((k) => (<span key={k} className="text-[10px] font-bold rounded-full px-2.5 py-[3px]" style={{ color: COLOR[k], backgroundColor: `${COLOR[k]}22`, border: `1px solid ${COLOR[k]}66` }}>{current.fw[k]}</span>))}
          </div>

          {mine ? (
            <div className="text-[13px] text-foreground/85 mt-4"><span className="text-foreground/40 font-semibold">Your beat: </span>{mine}</div>
          ) : (
            <div className="text-[12px] text-foreground/40 italic mt-4">Not written on the Beat Sheet yet — you can still add scenes here.</div>
          )}

          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 mt-3 mb-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1 bg-clip-text text-transparent w-fit" style={{ backgroundImage: GRAD }}>Example · Star Wars</div>
            <div className="font-mono text-[11px] font-bold uppercase text-foreground/80">{current.ex.slug}</div>
            <div className="text-[12.5px] text-foreground/60 mt-0.5">{current.ex.action}</div>
          </div>

          {list.map((s, j) => (
            <div key={j} className="mt-2.5 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9.5px] font-extrabold rounded px-1.5 py-0.5 text-[#0c0e13]" style={{ backgroundColor: accent }}>SCENE {j + 1}</span>
                <button onClick={() => rm(j)} className="ml-auto text-[11px] text-foreground/40 hover:text-foreground/80 transition-colors">Remove</button>
              </div>
              <input value={s.slug} onChange={(e) => upd(j, "slug", e.target.value)} placeholder="INT./EXT.  LOCATION  —  DAY/NIGHT" className="w-full font-mono text-[11.5px] uppercase tracking-wide rounded-md border border-white/10 bg-black/30 text-foreground px-2.5 py-1.5 mb-1.5 focus:outline-none focus:border-white/25" />
              <textarea value={s.action} onChange={(e) => upd(j, "action", e.target.value)} placeholder="What happens in this scene…" className="w-full min-h-[46px] resize-y rounded-md border border-white/10 bg-black/25 text-foreground text-[13px] px-2.5 py-2 leading-relaxed focus:outline-none focus:border-white/25" />
            </div>
          ))}

          <button onClick={add} className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-bold rounded-lg border border-dashed px-3 py-1.5" style={{ color: accent, borderColor: accent }}>＋ Add a scene</button>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
            <span className="text-[12.5px] text-foreground/50">✓ Saved automatically</span>
            <Link to={`/movie-in-a-box/${structure}/shots/${beat}`} className="rounded-lg px-6 py-3 text-sm font-bold text-[#0c0e13]" style={{ backgroundColor: accent }}>Continue to Shots →</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-foreground/40">Movie in a Box · Scenes · {current.t}</footer>
    </>
  );
}
