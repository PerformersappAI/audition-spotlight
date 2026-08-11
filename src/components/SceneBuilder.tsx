import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type FwKey = "p" | "g" | "r" | "t";
const FW: { key: FwKey; name: string; color: string }[] = [
  { key: "p", name: "Three-Act", color: "#a855f7" },
  { key: "g", name: "Save the Cat", color: "#d4a017" },
  { key: "r", name: "Hero's Journey", color: "#fb7185" },
  { key: "t", name: "Story Circle", color: "#2bd1c0" },
];
const COLOR: Record<FwKey, string> = { p: "#a855f7", g: "#d4a017", r: "#fb7185", t: "#2bd1c0" };
const FNAME: Record<FwKey, string> = { p: "Three-Act", g: "Save the Cat", r: "Hero's Journey", t: "Story Circle" };
const GRAD = "linear-gradient(90deg,#d7dce4,#c3cad6)";
const ACTS: Record<1 | 2 | 3, string> = { 1: "Act I — Setup", 2: "Act II — Confrontation", 3: "Act III — Resolution" };

type Ex = { slug: string; action: string };
type Beat = { t: string; fw: Partial<Record<FwKey, string>>; act: 1 | 2 | 3; ex: Ex };
const M: Beat[] = [
  { t: "The Ordinary World", act: 1, fw: { p: "Ordinary World", g: "Opening / Set-Up", r: "Ordinary World", t: "You" }, ex: { slug: "EXT. TATOOINE MOISTURE FARM — DAY", action: "Luke works the farm, gazing at the twin suns, restless for something more." } },
  { t: "The Theme", act: 1, fw: { g: "Theme Stated" }, ex: { slug: "INT. BEN KENOBI'S HUT — DAY", action: "Obi-Wan: the Force gives a Jedi his power — trust it, not just the machine." } },
  { t: "The Need", act: 1, fw: { t: "Need" }, ex: { slug: "EXT. TATOOINE RIDGE — DUSK", action: "Luke stares at the horizon, longing to leave the farm and find his purpose." } },
  { t: "The Call", act: 1, fw: { p: "Inciting Incident", g: "Catalyst", r: "Call to Adventure" }, ex: { slug: "INT. LARS GARAGE — DAY", action: "R2-D2 plays Leia's message: 'Help me, Obi-Wan Kenobi.'" } },
  { t: "The Refusal", act: 1, fw: { r: "Refusal of the Call", g: "Debate" }, ex: { slug: "INT. LARS HOMESTEAD — NIGHT", action: "Luke says he can't go — there is too much to do on the farm." } },
  { t: "The Mentor", act: 1, fw: { r: "Meeting the Mentor" }, ex: { slug: "INT. BEN KENOBI'S HUT — DAY", action: "Obi-Wan gives Luke his father's lightsaber and begins to teach him the Force." } },
  { t: "The Point of No Return", act: 1, fw: { p: "First Plot Point", g: "Break into Two", r: "Crossing the Threshold", t: "Go" }, ex: { slug: "EXT. LARS FARM — DAY", action: "Luke finds his aunt and uncle killed; nothing left, he leaves with Obi-Wan." } },
  { t: "The Bond", act: 2, fw: { g: "B Story" }, ex: { slug: "INT. MOS EISLEY CANTINA — DAY", action: "Luke and Obi-Wan hire Han Solo and Chewbacca — the crew forms." } },
  { t: "The Trials", act: 2, fw: { p: "Rising Action", g: "Fun & Games", r: "Tests, Allies, Enemies", t: "Search" }, ex: { slug: "INT. MILLENNIUM FALCON — SPACE", action: "Escaping Tatooine, training with the remote, dodging TIE fighters." } },
  { t: "The Midpoint Turn", act: 2, fw: { p: "Midpoint", g: "Midpoint", t: "Find" }, ex: { slug: "INT. DEATH STAR DETENTION — DAY", action: "They rescue Leia — but the escape turns into a firefight and a trash-compactor trap." } },
  { t: "The Walls Close In", act: 2, fw: { g: "Bad Guys Close In", r: "Approach the Inmost Cave" }, ex: { slug: "INT. DEATH STAR CORRIDORS — DAY", action: "Stormtroopers everywhere; Vader hunts Obi-Wan; time is running out." } },
  { t: "The Lowest Point", act: 2, fw: { p: "Crisis / Low", g: "All Is Lost", r: "The Ordeal", t: "Take" }, ex: { slug: "INT. DEATH STAR HANGAR — DAY", action: "Vader strikes down Obi-Wan; Luke watches his mentor vanish." } },
  { t: "The Dark Night", act: 2, fw: { g: "Dark Night of the Soul" }, ex: { slug: "INT. MILLENNIUM FALCON — SPACE", action: "Grieving Obi-Wan, Luke hears his voice — and steadies for what's ahead." } },
  { t: "The Turn to the End", act: 2, fw: { g: "Break into Three", r: "Reward / Road Back", t: "Return" }, ex: { slug: "INT. REBEL BASE, YAVIN 4 — DAY", action: "The stolen plans reveal a weakness; Luke joins the assault on the Death Star." } },
  { t: "The Final Test", act: 3, fw: { p: "Climax", g: "Finale", r: "Resurrection" }, ex: { slug: "EXT. DEATH STAR TRENCH — SPACE", action: "Luke switches off his targeting computer, trusts the Force, and fires the shot." } },
  { t: "The Elixir", act: 3, fw: { r: "Return with the Elixir" }, ex: { slug: "EXT. YAVIN 4 — DAY", action: "The Death Star destroyed; the Rebellion — and hope — is saved." } },
  { t: "The New World", act: 3, fw: { p: "Resolution", g: "Final Image", t: "Change" }, ex: { slug: "INT. REBEL THRONE ROOM — DAY", action: "The farm boy stands honored as a hero before the galaxy." } },
];

type Scene = { slug: string; action: string };

export default function SceneBuilder({ structureKey }: { structureKey: string }) {
  const [scenes, setScenes] = useState<Record<number, Scene[]>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [sel, setSel] = useState<FwKey[]>([]);

  useEffect(() => {
    try { const s = localStorage.getItem("mib-scenes"); setScenes(s ? JSON.parse(s) : {}); } catch { setScenes({}); }
    try { const a = localStorage.getItem("mib-master-beats"); setAnswers(a ? JSON.parse(a) : {}); } catch { setAnswers({}); }
    try { const f = localStorage.getItem("mib-frameworks"); if (f) setSel(JSON.parse(f)); } catch { /* ignore */ }
  }, []);
  useEffect(() => { try { localStorage.setItem("mib-frameworks", JSON.stringify(sel)); } catch { /* ignore */ } }, [sel]);

  const persist = (n: Record<number, Scene[]>) => { try { localStorage.setItem("mib-scenes", JSON.stringify(n)); } catch { /* ignore */ } };
  const add = (i: number) => setScenes((p) => { const n = { ...p, [i]: [...(p[i] || []), { slug: "", action: "" }] }; persist(n); return n; });
  const upd = (i: number, j: number, field: "slug" | "action", v: string) => setScenes((p) => { const arr = [...(p[i] || [])]; arr[j] = { ...arr[j], [field]: v }; const n = { ...p, [i]: arr }; persist(n); return n; });
  const rm = (i: number, j: number) => setScenes((p) => { const arr = [...(p[i] || [])]; arr.splice(j, 1); const n = { ...p, [i]: arr }; persist(n); return n; });
  const toggle = (k: FwKey) => setSel((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const showAll = sel.length === 0;
  const one = sel.length === 1 ? COLOR[sel[0]] : null;
  const visible = M.map((b, i) => ({ b, i })).filter(({ b }) => showAll || sel.some((k) => !!b.fw[k]));
  const totalScenes = Object.values(scenes).reduce((s, a) => s + (a?.length || 0), 0);
  const acts = ([1, 2, 3] as const).map((a) => ({ a, items: visible.filter((v) => v.b.act === a) })).filter((g) => g.items.length > 0);

  return (
    <section className="bg-background px-4 py-10">
      <div className="container mx-auto max-w-[880px]">
        <div className="text-[12px] font-bold uppercase tracking-[0.2em] bg-clip-text text-transparent w-fit" style={{ backgroundImage: GRAD }}>Your movie · scenes</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">Turn each beat into scenes</h1>
        <p className="mt-3 text-foreground/60 text-[15px] max-w-[640px] leading-relaxed">Every beat becomes one or more actual scenes — a place, a moment, something that happens. This is your film's outline, and the bridge to Shots.</p>

        <div className="mt-6">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-foreground/40 mb-3">
            {showAll ? <span>Showing all four frameworks — click to narrow</span> : (
              <span className="normal-case tracking-normal">Building scenes for {sel.map((k, i) => (<span key={k}><span style={{ color: COLOR[k] }} className="font-bold">{FNAME[k]}</span>{i < sel.length - 1 ? " + " : ""}</span>))} · <button onClick={() => setSel([])} className="underline font-semibold text-foreground/50 hover:text-foreground">show all</button></span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {FW.map((f) => { const on = sel.includes(f.key); const dim = !showAll && !on; return (
              <button key={f.key} onClick={() => toggle(f.key)} className="text-[12px] font-bold rounded-lg border px-3 py-2 transition-all" style={{ borderColor: on ? f.color : "rgba(255,255,255,0.10)", background: on ? `${f.color}18` : "rgba(255,255,255,0.03)", color: f.color, opacity: dim ? 0.45 : 1 }}>{on ? "✓ " : ""}{f.name}</button>
            ); })}
          </div>
          <div className="mt-3 text-[12px] text-foreground/50"><span style={{ color: one || "#f4f5f7", fontWeight: 700 }}>{totalScenes}</span> scene{totalScenes === 1 ? "" : "s"} written</div>
        </div>

        <div className="mt-6">
          {acts.map((g) => (
            <div key={g.a}>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] mt-6 mb-3 bg-clip-text text-transparent w-fit" style={{ backgroundImage: GRAD }}>{ACTS[g.a]}</p>
              {g.items.map(({ b, i }, idx) => {
                const keys = showAll ? (Object.keys(b.fw) as FwKey[]) : sel.filter((k) => !!b.fw[k]);
                const list = scenes[i] || [];
                const mine = (answers[i] || "").trim();
                return (
                  <div key={i} className="mb-3.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div className="font-serif font-bold text-[16px] text-foreground">{b.t}</div>
                    <div className="flex flex-wrap gap-1.5 my-2">
                      {keys.map((k) => (<span key={k} className="text-[10px] font-bold rounded-full px-2.5 py-[3px]" style={{ color: COLOR[k], backgroundColor: `${COLOR[k]}22`, border: `1px solid ${COLOR[k]}66` }}>{b.fw[k]}</span>))}
                    </div>
                    {mine ? (
                      <div className="text-[13px] text-foreground/85 mb-2"><span className="text-foreground/40 font-semibold">Your beat: </span>{mine}</div>
                    ) : (
                      <div className="text-[12px] text-foreground/40 italic mb-2">Not written on the Beat Sheet yet — you can still add scenes here.</div>
                    )}
                    <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 mb-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1 bg-clip-text text-transparent w-fit" style={{ backgroundImage: GRAD }}>Example · Star Wars</div>
                      <div className="font-mono text-[11px] font-bold uppercase text-foreground/80">{b.ex.slug}</div>
                      <div className="text-[12.5px] text-foreground/60 mt-0.5">{b.ex.action}</div>
                    </div>
                    {list.map((s, j) => (
                      <div key={j} className="mt-2.5 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9.5px] font-extrabold rounded px-1.5 py-0.5 text-[#0c0e13]" style={{ backgroundColor: one || "#9aa0aa" }}>SCENE {idx + 1}.{j + 1}</span>
                          <button onClick={() => rm(i, j)} className="ml-auto text-[11px] text-foreground/40 hover:text-foreground/80 transition-colors">Remove</button>
                        </div>
                        <input value={s.slug} onChange={(e) => upd(i, j, "slug", e.target.value)} placeholder="INT./EXT.  LOCATION  —  DAY/NIGHT" className="w-full font-mono text-[11.5px] uppercase tracking-wide rounded-md border border-white/10 bg-black/30 text-foreground px-2.5 py-1.5 mb-1.5 focus:outline-none focus:border-white/25" />
                        <textarea value={s.action} onChange={(e) => upd(i, j, "action", e.target.value)} placeholder="What happens in this scene…" className="w-full min-h-[46px] resize-y rounded-md border border-white/10 bg-black/25 text-foreground text-[13px] px-2.5 py-2 leading-relaxed focus:outline-none focus:border-white/25" />
                      </div>
                    ))}
                    <button onClick={() => add(i)} className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-bold rounded-lg border border-dashed px-3 py-1.5" style={one ? { color: one, borderColor: one } : { color: "#cbd0d8", borderColor: "rgba(255,255,255,0.25)" }}>＋ Add a scene</button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3 pb-4">
          <span className="text-[12.5px] text-foreground/50">✓ Saved automatically</span>
          <Link to={`/movie-in-a-box/${structureKey}/shots`} className="rounded-lg px-6 py-3 text-sm font-bold text-[#0c0e13]" style={one ? { backgroundColor: one } : { backgroundImage: GRAD }}>Continue to Shots →</Link>
        </div>
      </div>
    </section>
  );
}
