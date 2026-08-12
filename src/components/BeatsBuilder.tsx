import { useEffect, useState } from "react";

type FwKey = "p" | "g" | "r" | "t";
const FWC: Record<FwKey, string> = { p: "#a855f7", g: "#d4a017", r: "#fb7185", t: "#2bd1c0" };
const GOLD = "#d4a017";

type Beat = { t: string; slug: string; fw: Partial<Record<FwKey, string>> };
function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

const RAW: { t: string; fw: Partial<Record<FwKey, string>> }[] = [
  { t: "The Ordinary World", fw: { p: "Ordinary World", g: "Opening / Set-Up", r: "Ordinary World", t: "You" } },
  { t: "The Theme", fw: { g: "Theme Stated" } },
  { t: "The Need", fw: { t: "Need" } },
  { t: "The Call", fw: { p: "Inciting Incident", g: "Catalyst", r: "Call to Adventure" } },
  { t: "The Refusal", fw: { g: "Debate", r: "Refusal of the Call" } },
  { t: "The Mentor", fw: { r: "Meeting the Mentor" } },
  { t: "The Point of No Return", fw: { p: "First Plot Point", g: "Break into Two", r: "Crossing the Threshold", t: "Go" } },
  { t: "The Bond", fw: { g: "B Story" } },
  { t: "The Trials", fw: { p: "Rising Action", g: "Fun & Games", r: "Tests, Allies, Enemies", t: "Search" } },
  { t: "The Midpoint Turn", fw: { p: "Midpoint", g: "Midpoint", t: "Find" } },
  { t: "The Walls Close In", fw: { g: "Bad Guys Close In", r: "Approach the Inmost Cave" } },
  { t: "The Lowest Point", fw: { p: "Crisis / Low Point", g: "All Is Lost", r: "The Ordeal", t: "Take" } },
  { t: "The Dark Night", fw: { g: "Dark Night of the Soul" } },
  { t: "The Turn to the End", fw: { g: "Break into Three", r: "Reward / Road Back", t: "Return" } },
  { t: "The Final Test", fw: { p: "Climax", g: "Finale", r: "Resurrection" } },
  { t: "The Elixir", fw: { r: "Return with the Elixir" } },
  { t: "The New World", fw: { p: "Resolution", g: "Final Image", t: "Change" } },
];
const M: Beat[] = RAW.map((b) => ({ ...b, slug: slugify(b.t) }));

const OW_GROUPS: { L: string; name: string; qs: string[] }[] = [
  { L: "A", name: "The Hero — basics", qs: [
    "Who is your main character (name, age, gender)?",
    "What's their job or role in life right now?",
    "How would a stranger describe them in one sentence?",
    "How do they see themselves in one sentence?",
    "What are they exceptionally good at — their signature skill?",
    "What small habit or quirk makes them feel like a real person?",
  ] },
  { L: "B", name: "Their inner world — flaw, wound, want vs. need", qs: [
    "What is their core flaw — the thing holding them back?",
    "What past wound created that flaw (their “ghost”)?",
    "What do they consciously WANT at the start?",
    "What do they actually NEED (the lesson they don't yet know)?",
    "What lie do they believe about themselves or the world?",
    "What are they most afraid of?",
    "What do they secretly long for but won't admit?",
    "What's the “hole” in their life the story will eventually fill?",
  ] },
  { L: "C", name: "Their daily life — the routine", qs: [
    "Walk me through an ordinary day for them, start to finish.",
    "What does their home look and feel like?",
    "How do they spend their time / make their living?",
    "Their relationship to that work — love it, trapped by it, indifferent?",
    "What rituals or routines define their “normal”?",
    "What everyday problem do they deal with (before the big one hits)?",
  ] },
  { L: "D", name: "The world — setting", qs: [
    "Where does the story begin (place)?",
    "What time period / era is it?",
    "What are the “rules” of this world — social, cultural, physical?",
    "What's the mood and atmosphere of this place?",
    "What's beautiful or appealing about their world?",
    "What's suffocating or limiting about it?",
    "How does this world shape who they are?",
  ] },
  { L: "E", name: "Relationships", qs: [
    "Who are the most important people in their life right now?",
    "Who do they live with / who's their family?",
    "Who's their closest ally or friend?",
    "Is there a love interest in the ordinary world? Who?",
    "Who do they have tension or conflict with?",
    "Is a mentor present yet, or still to come?",
    "How do others treat them — respected, overlooked, feared, loved?",
  ] },
  { L: "F", name: "The status quo — and what's missing", qs: [
    "What “normal” is about to be shattered?",
    "What are they avoiding, tolerating, or settling for?",
    "What would they call “fine” that actually isn't?",
    "If nothing ever changed, where would this life lead them?",
    "What's the one thing that could tempt them out of their comfort zone?",
  ] },
  { L: "G", name: "Theme & meaning", qs: [
    "What is the movie really about underneath the plot?",
    "How is that theme quietly present in the ordinary world?",
    "What belief will the story challenge or prove?",
    "If someone stated the theme out loud early, what would they say?",
  ] },
  { L: "H", name: "Tone, genre, style", qs: [
    "What genre is this?",
    "Emotional tone of the opening — warm, tense, melancholy, fun?",
    "What existing movies feel tonally similar to your goal?",
    "Is the opening realistic, stylized, epic, or intimate?",
  ] },
  { L: "I", name: "Opening image — visual & sensory", qs: [
    "If the first shot introduced your hero, what would we see?",
    "What single image captures their “before” state?",
    "What sounds, colors, and textures define this world?",
    "What is your hero physically doing in that first scene?",
    "What contrast do you want between this opening and the film's ending?",
  ] },
  { L: "J", name: "Seeds of what's coming", qs: [
    "What tiny hint of the coming adventure can we plant here?",
    "What's at stake if their world gets disrupted?",
    "What does your hero not yet know is about to happen?",
  ] },
];
const OW_TOTAL = OW_GROUPS.reduce((n, g) => n + g.qs.length, 0);

function OWForm({ ans, setAns, filled, onClose, hint, setHint }: {
  ans: Record<number, string>; setAns: (qi: number, v: string) => void; filled: number; onClose: () => void; hint: string; setHint: (s: string) => void;
}) {
  const pct = Math.round((filled / OW_TOTAL) * 100);
  let n = 0;
  return (
    <div className="border-t border-white/10">
      <div className="px-4 pt-3 pb-2 border-b border-white/[0.08]">
        <div className="h-1.5 rounded-full bg-[#0c0e13] overflow-hidden"><div className="h-full" style={{ width: pct + "%", background: `linear-gradient(90deg,${GOLD},#f0d089)` }} /></div>
        <div className="text-[11px] text-foreground/50 mt-1.5 flex justify-between"><span>{filled} of {OW_TOTAL} answered</span><span>the more you answer, the richer the movie</span></div>
      </div>
      {hint && <div className="mx-4 mt-3 rounded-lg px-3 py-2 text-[11.5px]" style={{ border: `1px solid ${GOLD}55`, background: "#1a1710", color: "#f0d089" }}>{hint}</div>}
      <div className="px-4 pb-4">
        {OW_GROUPS.map((g) => (
          <div key={g.L}>
            <div className="mt-5 mb-1 flex items-center gap-2.5">
              <span className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[12px] font-extrabold" style={{ background: "#f0d089", color: "#1a1300" }}>{g.L}</span>
              <span className="text-[13px] font-extrabold" style={{ color: "#f0d089" }}>{g.name}</span>
              <span className="flex-1 h-px bg-white/10" />
            </div>
            {g.qs.map((q) => {
              const qi = n++; const cur = ans[qi] || "";
              return (
                <div key={qi} className="flex gap-3 py-2.5 border-b border-white/[0.045]">
                  <span className="w-6 text-right text-[11px] font-extrabold text-foreground/35 pt-1">{qi + 1}</span>
                  <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-foreground mb-1.5">{q}</label>
                    <textarea value={cur} onChange={(e) => setAns(qi, e.target.value)} placeholder="Type your answer…" className="w-full bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-2.5 py-2 text-[12.5px] resize-y" style={{ minHeight: 36, fontFamily: "inherit" }} />
                    <button onClick={() => setHint("🧠 The filmmaking brain is our next step — this button will draft your answer here.")} className="mt-1.5 text-[10.5px] font-bold rounded-md px-2.5 py-1" style={{ color: "#f0d089", background: "#1a1710", border: `1px solid ${GOLD}66` }}>✨ AI help with this</button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mx-4 mb-4 rounded-xl p-4" style={{ border: `1px solid ${GOLD}55`, background: "linear-gradient(180deg,#1a1710,#141109)" }}>
        <div className="text-[14px] font-extrabold" style={{ color: "#f0d089" }}>🧠 The Filmmaking Brain</div>
        <div className="text-[12px] text-foreground/55 mt-1 mb-3">Give a one-line premise and it drafts all {OW_TOTAL} — or polishes your answers, or writes the finished Ordinary World section. (Wiring the brain is our next step.)</div>
        <input placeholder="e.g. 'A retired hitman in Naples pulled back for one last job to save his daughter'" className="w-full bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-3 py-2.5 text-[12.5px]" />
        <div className="flex gap-2 flex-wrap mt-2.5">
          <button onClick={() => setHint("🧠 Coming next — 'Draft all' fills every answer from your premise.")} className="text-[12px] font-bold rounded-lg px-3 py-2" style={{ background: GOLD, color: "#1a1300" }}>✨ Draft all answers</button>
          <button onClick={() => setHint("🧠 Coming next — 'Polish' upgrades the answers you wrote.")} className="text-[12px] font-bold rounded-lg px-3 py-2 border border-white/10 text-foreground">✧ Polish my answers</button>
          <button onClick={() => setHint("🧠 Coming next — this turns your answers into the finished Ordinary World.")} className="text-[12px] font-bold rounded-lg px-3 py-2 border border-white/10 text-foreground">📝 Write the Ordinary World section</button>
        </div>
      </div>
      <div className="flex justify-end px-4 pb-4">
        <button onClick={onClose} className="text-[13px] font-extrabold rounded-lg px-5 py-2.5" style={{ background: "#37b87c", color: "#04120b" }}>✓ Done — collapse &amp; go to next</button>
      </div>
    </div>
  );
}

export default function BeatsBuilder(_props: { structureKey: string }) {
  const [sel, setSel] = useState<FwKey[]>([]);
  const [open, setOpen] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, Record<number, string>>>({});
  const [hint, setHint] = useState("");

  useEffect(() => {
    try { const f = localStorage.getItem("mib-frameworks"); if (f) setSel(JSON.parse(f)); } catch { /* ignore */ }
    try { const a = localStorage.getItem("mib-beats"); if (a) setAnswers(JSON.parse(a)); } catch { /* ignore */ }
  }, []);
  useEffect(() => { try { localStorage.setItem("mib-beats", JSON.stringify(answers)); } catch { /* ignore */ } }, [answers]);

  const fws = sel.length ? sel : (["p", "g", "r", "t"] as FwKey[]);
  const visible = M.filter((b) => fws.some((k) => b.fw[k]));

  const setAns = (slug: string, qi: number, val: string) =>
    setAnswers((a) => ({ ...a, [slug]: { ...(a[slug] || {}), [qi]: val } }));

  const owAns = answers["the-ordinary-world"] || {};
  const owFilled = Object.values(owAns).filter((v) => v && v.trim()).length;

  return (
    <section className="bg-background px-4 py-10 pb-24">
      <div className="container mx-auto max-w-[900px]">
        <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Your movie · beats</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">The Beats</h1>
        <p className="text-[13.5px] text-foreground/55 mt-2 max-w-[640px]">Open a beat, answer its questions — the more you answer, the richer the movie — then hit Done and it collapses. One open at a time.</p>

        <div className="mt-6 flex flex-col gap-2.5">
          {visible.map((b, i) => {
            const isOpen = open === i;
            const chips = fws.filter((k) => b.fw[k]);
            const isOW = b.slug === "the-ordinary-world";
            return (
              <div key={b.slug} className="rounded-xl border bg-white/[0.02] overflow-hidden" style={{ borderColor: isOpen ? GOLD : "#2c323b" }}>
                <button onClick={() => { setOpen(isOpen ? -1 : i); setHint(""); }} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                  <span className="w-6 h-6 rounded-md bg-[#0c0e13] border border-white/10 flex items-center justify-center text-[11px] font-extrabold text-foreground/55 flex-shrink-0">{i + 1}</span>
                  <span className="text-[15px] font-extrabold text-foreground">{b.t}</span>
                  <span className="flex gap-1.5 flex-wrap">
                    {chips.map((k) => <span key={k} className="text-[9px] font-bold rounded-full px-2 py-[2px]" style={{ color: FWC[k], background: `${FWC[k]}1f`, border: `1px solid ${FWC[k]}55` }}>{b.fw[k]}</span>)}
                  </span>
                  <span className="ml-auto flex items-center gap-3 flex-shrink-0">
                    {isOW && <span className="text-[11px] text-foreground/40">{owFilled}/{OW_TOTAL}</span>}
                    <span className="text-[12px] text-foreground/50 inline-block" style={{ transform: isOpen ? "rotate(90deg)" : "none" }}>▸</span>
                  </span>
                </button>
                {isOpen && (isOW
                  ? <OWForm ans={owAns} setAns={(qi, v) => setAns(b.slug, qi, v)} filled={owFilled} onClose={() => setOpen(-1)} hint={hint} setHint={setHint} />
                  : <div className="px-4 py-6 text-[12.5px] text-foreground/40 italic border-t border-white/10">This beat opens into the same kind of question template as The Ordinary World — tailored to “{b.t}.” We'll build it next.</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
