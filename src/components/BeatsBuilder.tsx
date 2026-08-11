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

type Beat = { t: string; fw: Partial<Record<FwKey, string>>; q: string; ex: string };
const M: Beat[] = [
  { t: "The Ordinary World", fw: { p: "Ordinary World", g: "Opening / Set-Up", r: "Ordinary World", t: "You" }, q: "Who is your hero, and what is their normal life before the story begins?", ex: "Luke, a restless farm boy on Tatooine." },
  { t: "The Theme", fw: { g: "Theme Stated" }, q: "What deeper truth is your story really about? (Often said out loud, early.)", ex: "Trust the Force, not just the machine." },
  { t: "The Need", fw: { t: "Need" }, q: "What does your hero secretly need or long for?", ex: "Luke longs for purpose beyond the farm." },
  { t: "The Call", fw: { p: "Inciting Incident", g: "Catalyst", r: "Call to Adventure" }, q: "What outside event breaks the normal world and calls your hero to the story?", ex: "Leia's hidden message in R2-D2." },
  { t: "The Refusal", fw: { r: "Refusal of the Call", g: "Debate" }, q: "How does your hero resist or hesitate before committing?", ex: "Luke says he can't leave the farm." },
  { t: "The Mentor", fw: { r: "Meeting the Mentor" }, q: "Who guides your hero — and what do they teach or give them?", ex: "Obi-Wan trains Luke and gives him the lightsaber." },
  { t: "The Point of No Return", fw: { p: "First Plot Point", g: "Break into Two", r: "Crossing the Threshold", t: "Go" }, q: "What forces your hero to commit fully, with no way back?", ex: "His aunt and uncle killed; Luke leaves with Obi-Wan." },
  { t: "The Bond", fw: { g: "B Story" }, q: "What relationship helps your hero grow and carries the theme?", ex: "Han Solo and the crew." },
  { t: "The Trials", fw: { p: "Rising Action", g: "Fun & Games", r: "Tests, Allies, Enemies", t: "Search" }, q: "What does your hero do and learn in the new world? (The big set-pieces.)", ex: "The cantina, the Falcon, into the Death Star." },
  { t: "The Midpoint Turn", fw: { p: "Midpoint", g: "Midpoint", t: "Find" }, q: "What midway turn — a win that sours or a loss that opens a path — raises the stakes?", ex: "They rescue Leia, but the escape turns desperate." },
  { t: "The Walls Close In", fw: { g: "Bad Guys Close In", r: "Approach the Inmost Cave" }, q: "How does the pressure tighten as your hero nears the biggest test?", ex: "Vader and the TIE fighters close in." },
  { t: "The Lowest Point", fw: { p: "Crisis / Low", g: "All Is Lost", r: "The Ordeal", t: "Take" }, q: "What is the lowest point — the loss or the price your hero pays?", ex: "Obi-Wan is struck down." },
  { t: "The Dark Night", fw: { g: "Dark Night of the Soul" }, q: "How does your hero sit with the loss before finding the resolve to go on?", ex: "Grief over Obi-Wan before the assault." },
  { t: "The Turn to the End", fw: { g: "Break into Three", r: "Reward / Road Back", t: "Return" }, q: "What insight or resolve launches your hero into the finale?", ex: "Joining the Rebel attack on the Death Star." },
  { t: "The Final Test", fw: { p: "Climax", g: "Finale", r: "Resurrection" }, q: "What is the final confrontation where your hero spends everything they've learned?", ex: "The trench run; Luke trusts the Force." },
  { t: "The Elixir", fw: { r: "Return with the Elixir" }, q: "What does your hero bring back that helps their world — not just themselves?", ex: "The Death Star destroyed; hope restored." },
  { t: "The New World", fw: { p: "Resolution", g: "Final Image", t: "Change" }, q: "What is the final image — how have your hero and their world changed?", ex: "The farm boy honored as a hero." },
];

export default function BeatsBuilder({ structureKey }: { structureKey: string }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [genMsg, setGenMsg] = useState(false);
  const [sel, setSel] = useState<FwKey[]>([]);

  useEffect(() => {
    try { const raw = localStorage.getItem("mib-master-beats"); setAnswers(raw ? JSON.parse(raw) : {}); } catch { setAnswers({}); }
    try { const f = localStorage.getItem("mib-frameworks"); if (f) setSel(JSON.parse(f)); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("mib-frameworks", JSON.stringify(sel)); } catch { /* ignore */ }
  }, [sel]);

  const set = (i: number, v: string) =>
    setAnswers((p) => { const n = { ...p, [i]: v }; try { localStorage.setItem("mib-master-beats", JSON.stringify(n)); } catch { /* ignore */ } return n; });

  const toggle = (k: FwKey) => setSel((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const cov = (k: FwKey) => {
    let tot = 0, fill = 0;
    M.forEach((b, i) => { if (b.fw[k]) { tot++; if ((answers[i] || "").trim()) fill++; } });
    return { tot, fill, pct: tot ? Math.round((fill / tot) * 100) : 0 };
  };

  const showAll = sel.length === 0;
  const visible = M.map((b, i) => ({ b, i })).filter(({ b }) => showAll || sel.some((k) => !!b.fw[k]));
  const count = showAll ? 4 : sel.length;
  const one = sel.length === 1 ? COLOR[sel[0]] : null;

  const Badge = ({ k }: { k: FwKey }) => {
    const f = FW.find((x) => x.key === k)!;
    const c = cov(k);
    const on = sel.includes(k);
    const dim = !showAll && !on;
    return (
      <button
        onClick={() => toggle(k)}
        className="text-left rounded-lg border px-3 py-2.5 transition-all"
        style={{ borderColor: on ? f.color : "rgba(255,255,255,0.10)", background: on ? `${f.color}18` : "rgba(255,255,255,0.03)", opacity: dim ? 0.45 : 1 }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-extrabold" style={{ color: f.color }}>{f.name}</div>
          {on && <span className="text-[11px] font-extrabold" style={{ color: f.color }}>✓</span>}
        </div>
        <div className="text-[9.5px] text-foreground/30 mb-1.5">{c.tot} beats</div>
        <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${c.pct}%`, backgroundColor: f.color }} />
        </div>
        <div className="text-[10px] text-foreground/50 mt-1.5">{c.fill} of {c.tot} · {c.pct}%</div>
      </button>
    );
  };

  return (
    <section className="bg-background px-4 py-10">
      <div className="container mx-auto max-w-[860px]">
        <div className="text-[12px] font-bold uppercase tracking-[0.2em] bg-clip-text text-transparent w-fit" style={{ backgroundImage: GRAD }}>
          Your movie · one sheet, four frameworks
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">Your Beat Sheet</h1>
        <p className="mt-3 text-foreground/60 text-[15px] max-w-[620px] leading-relaxed">
          Answer each beat <span className="text-foreground font-semibold">once</span>. Every answer maps into all four frameworks — or select the ones you want and the sheet narrows to just those.
        </p>

        {/* coverage / multi-select filter */}
        <div className="mt-7">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-foreground/40 mb-3 flex items-center gap-2 flex-wrap">
            {showAll ? (
              <span>Click any frameworks to focus — pick one, two, three, or all</span>
            ) : (
              <span className="flex items-center gap-2 flex-wrap">
                <span className="normal-case tracking-normal">Building in&nbsp;
                  {sel.map((k, i) => (<span key={k}><span style={{ color: COLOR[k] }} className="font-bold">{FNAME[k]}</span>{i < sel.length - 1 ? " + " : ""}</span>))}
                </span>
                <button onClick={() => setSel([])} className="normal-case tracking-normal font-semibold text-foreground/50 hover:text-foreground underline">show all four</button>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {FW.map((f) => <Badge key={f.key} k={f.key} />)}
          </div>

          <div className="mt-4 flex items-center justify-end flex-wrap gap-3">
            <button onClick={() => setGenMsg(true)} className="text-[13px] font-extrabold rounded-lg px-5 py-2.5" style={one ? { backgroundColor: one, color: "#0c0e13" } : { backgroundImage: GRAD, color: "#0c0e13" }}>
              ✨ Generate my {count} outline{count > 1 ? "s" : ""}
            </button>
          </div>
          {genMsg && <div className="mt-2 text-right text-[12px] text-foreground/55">Outline generation is coming next — your answers are saved.</div>}
        </div>

        {/* beats */}
        <div className="mt-6">
          {visible.map(({ b, i }, idx) => {
            const keys = showAll ? (Object.keys(b.fw) as FwKey[]) : sel.filter((k) => !!b.fw[k]);
            const filled = (answers[i] || "").trim().length > 0;
            return (
              <div key={i} className="mb-3 rounded-xl border bg-white/[0.03] px-[17px] py-4" style={{ borderColor: filled ? "rgba(55,184,124,0.4)" : "rgba(255,255,255,0.10)" }}>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-serif font-bold text-[13px] text-foreground/30">{idx + 1}</span>
                  <span className="font-serif font-bold text-[18px] text-foreground">{b.t}</span>
                  {filled && <span className="ml-auto text-[11px] font-bold" style={{ color: "#37b87c" }}>✓ written</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 my-2.5">
                  {keys.map((k) => (
                    <span key={k} className="text-[10px] font-bold rounded-full px-2.5 py-[3px] whitespace-nowrap" style={{ color: COLOR[k], backgroundColor: `${COLOR[k]}22`, border: `1px solid ${COLOR[k]}66` }}>
                      {b.fw[k]}
                    </span>
                  ))}
                </div>
                <div className="text-[14px] text-foreground/90 font-medium mb-1">{b.q}</div>
                <div className="text-[12px] text-foreground/55 italic mb-2.5"><span className="not-italic font-bold text-foreground/55">e.g. Star Wars:</span> {b.ex}</div>
                <textarea
                  value={answers[i] || ""}
                  onChange={(e) => set(i, e.target.value)}
                  placeholder="Write this beat for YOUR movie…"
                  className="w-full min-h-[54px] resize-y rounded-lg border border-white/10 bg-black/25 text-foreground text-[13.5px] px-3 py-2.5 leading-relaxed focus:outline-none focus:border-white/25"
                />
                {showAll && (Object.keys(b.fw) as FwKey[]).length === 1 && (
                  <div className="text-[10px] text-foreground/30 mt-2">
                    Only <span className="font-bold" style={{ color: COLOR[(Object.keys(b.fw) as FwKey[])[0]] }}>{FNAME[(Object.keys(b.fw) as FwKey[])[0]]}</span> asks for this beat — a moment the others let you skip.
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3 pb-4">
          <span className="text-[12.5px] text-foreground/50">✓ Saved automatically</span>
          <Link to={`/movie-in-a-box/${structureKey}/scene`} className="rounded-lg px-6 py-3 text-sm font-bold text-[#0c0e13]" style={one ? { backgroundColor: one } : { backgroundImage: GRAD }}>
            Continue to Scene →
          </Link>
        </div>
      </div>
    </section>
  );
}
