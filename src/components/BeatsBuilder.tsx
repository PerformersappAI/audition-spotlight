import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  { L: "A", name: "The Hero — basics", qs: ["Who is your main character (name, age, gender)?", "What's their job or role in life right now?", "How would a stranger describe them in one sentence?", "How do they see themselves in one sentence?", "What are they exceptionally good at — their signature skill?", "What small habit or quirk makes them feel like a real person?"] },
  { L: "B", name: "Their inner world — flaw, wound, want vs. need", qs: ["What is their core flaw — the thing holding them back?", "What past wound created that flaw (their “ghost”)?", "What do they consciously WANT at the start?", "What do they actually NEED (the lesson they don't yet know)?", "What lie do they believe about themselves or the world?", "What are they most afraid of?", "What do they secretly long for but won't admit?", "What's the “hole” in their life the story will eventually fill?"] },
  { L: "C", name: "Their daily life — the routine", qs: ["Walk me through an ordinary day for them, start to finish.", "What does their home look and feel like?", "How do they spend their time / make their living?", "Their relationship to that work — love it, trapped by it, indifferent?", "What rituals or routines define their “normal”?", "What everyday problem do they deal with (before the big one hits)?"] },
  { L: "D", name: "The world — setting", qs: ["Where does the story begin (place)?", "What time period / era is it?", "What are the “rules” of this world — social, cultural, physical?", "What's the mood and atmosphere of this place?", "What's beautiful or appealing about their world?", "What's suffocating or limiting about it?", "How does this world shape who they are?"] },
  { L: "E", name: "Relationships", qs: ["Who are the most important people in their life right now?", "Who do they live with / who's their family?", "Who's their closest ally or friend?", "Is there a love interest in the ordinary world? Who?", "Who do they have tension or conflict with?", "Is a mentor present yet, or still to come?", "How do others treat them — respected, overlooked, feared, loved?"] },
  { L: "F", name: "The status quo — and what's missing", qs: ["What “normal” is about to be shattered?", "What are they avoiding, tolerating, or settling for?", "What would they call “fine” that actually isn't?", "If nothing ever changed, where would this life lead them?", "What's the one thing that could tempt them out of their comfort zone?"] },
  { L: "G", name: "Theme & meaning", qs: ["What is the movie really about underneath the plot?", "How is that theme quietly present in the ordinary world?", "What belief will the story challenge or prove?", "If someone stated the theme out loud early, what would they say?"] },
  { L: "H", name: "Tone, genre, style", qs: ["What genre is this?", "Emotional tone of the opening — warm, tense, melancholy, fun?", "What existing movies feel tonally similar to your goal?", "Is the opening realistic, stylized, epic, or intimate?"] },
  { L: "I", name: "Opening image — visual & sensory", qs: ["If the first shot introduced your hero, what would we see?", "What single image captures their “before” state?", "What sounds, colors, and textures define this world?", "What is your hero physically doing in that first scene?", "What contrast do you want between this opening and the film's ending?"] },
  { L: "J", name: "Seeds of what's coming", qs: ["What tiny hint of the coming adventure can we plant here?", "What's at stake if their world gets disrupted?", "What does your hero not yet know is about to happen?"] },
];
const OW_ITEMS: ({ kind: "group"; L: string; name: string } | { kind: "q"; text: string; qi: number })[] = (() => {
  const out: ({ kind: "group"; L: string; name: string } | { kind: "q"; text: string; qi: number })[] = [];
  let qi = 0;
  for (const g of OW_GROUPS) { out.push({ kind: "group", L: g.L, name: g.name }); for (const q of g.qs) { out.push({ kind: "q", text: q, qi }); qi++; } }
  return out;
})();
const OW_FLAT: string[] = OW_GROUPS.flatMap((g) => g.qs);
const OW_TOTAL = OW_FLAT.length;

const CHAR_COACH: string[] = [
  "What's their full name — and do they go by anything else (nickname, alias, title)?",
  "How old are they exactly, and how old do they feel inside?",
  "What's their nationality, and where specifically are they from (country, region, city, block)?",
  "What's their ethnic background, race, and cultural heritage?",
  "What's their religion or spiritual belief — devout, lapsed, atheist, searching?",
  "Do they speak with an accent or dialect? What does their voice actually sound like?",
  "What language(s) do they speak — and which do they think and dream in?",
  "What do they physically look like — height, build, distinguishing features?",
  "How do they dress, and what does that say about them?",
  "What's the first thing people notice about them?",
  "Who raised them, and what was their family like?",
  "Was their childhood happy, hard, chaotic, sheltered?",
  "What class did they grow up in — and what class are they now?",
  "What's their education or training — formal, street-smart, self-taught?",
  "What's the single event from their past that shaped them most?",
  "What's their relationship with their parents today?",
  "Do they have siblings, a spouse, kids? What are those bonds like?",
  "What place made them who they are?",
  "What did they want to be when they grew up — and did they become it?",
  "What's a secret from their past they've never told anyone?",
  "What is their greatest fear?",
  "What do they want more than anything (their conscious goal)?",
  "What do they actually need to learn or heal (their deeper need)?",
  "What's their core wound — the pain that still drives them?",
  "What lie do they believe about themselves or the world?",
  "What's their greatest flaw?",
  "What's their greatest strength?",
  "Do they see themselves accurately, or are they fooling themselves?",
  "What are they ashamed of?",
  "What are they most proud of?",
  "What would they never do, no matter what?",
  "What would they do that would shock everyone who knows them?",
  "Where's the moral line they won't cross?",
  "What do they do when no one is watching?",
  "How do they talk — fast, slow, blunt, careful, funny, formal?",
  "What's a word or phrase they always use?",
  "What's a nervous habit or physical tic?",
  "What makes them laugh? What makes them cry?",
  "What's their relationship with money, food, drink, or vice?",
  "What do they do to relax or escape?",
  "What's one small, specific detail that makes them feel real?",
  "Who do they love, and who loves them back?",
  "Who's their enemy or rival, and why?",
  "Who do they pretend to be in public vs. who they really are?",
  "How do strangers treat them — and how does that make them feel?",
  "Who would they call at 3 a.m. in a crisis?",
  "What's a contradiction inside them (tough but tender, generous but selfish)?",
  "What's something they believe that they also secretly doubt?",
  "If they got everything they wanted, would they actually be happy — why or why not?",
  "In one line: what makes them worth following for two hours — why them?",
];
const COACH_SETS: Record<number, string[]> = { 0: CHAR_COACH };

export default function BeatsBuilder(_props: { structureKey: string }) {
  const [sel, setSel] = useState<FwKey[]>([]);
  const [openIdx, setOpenIdx] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, Record<number, string>>>({});
  const [coach, setCoach] = useState<Record<string, Record<number, Record<number, string>>>>({});
  const [active, setActive] = useState<{ slug: string; qi: number } | null>(null);
  const [weaving, setWeaving] = useState(false);
  const [coachErr, setCoachErr] = useState("");

  useEffect(() => {
    try { const f = localStorage.getItem("mib-frameworks"); if (f) setSel(JSON.parse(f)); } catch { /* ignore */ }
    try { const a = localStorage.getItem("mib-beats"); if (a) setAnswers(JSON.parse(a)); } catch { /* ignore */ }
    try { const c = localStorage.getItem("mib-beats-coach"); if (c) setCoach(JSON.parse(c)); } catch { /* ignore */ }
  }, []);
  useEffect(() => { try { localStorage.setItem("mib-beats", JSON.stringify(answers)); } catch { /* ignore */ } }, [answers]);
  useEffect(() => { try { localStorage.setItem("mib-beats-coach", JSON.stringify(coach)); } catch { /* ignore */ } }, [coach]);

  const fws = sel.length ? sel : (["p", "g", "r", "t"] as FwKey[]);
  const visible = M.filter((b) => fws.some((k) => b.fw[k]));

  const setMain = (slug: string, qi: number, val: string) => setAnswers((a) => ({ ...a, [slug]: { ...(a[slug] || {}), [qi]: val } }));
  const setCoachAns = (slug: string, qi: number, ci: number, val: string) => setCoach((c) => ({ ...c, [slug]: { ...(c[slug] || {}), [qi]: { ...((c[slug] || {})[qi] || {}), [ci]: val } } }));

  const openCoach = (slug: string, qi: number) => {
    setActive({ slug, qi }); setCoachErr("");
    if (typeof window !== "undefined" && window.innerWidth < 1024) setTimeout(() => document.getElementById("mib-coach")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const weave = async () => {
    if (!active || weaving) return;
    const set = COACH_SETS[active.qi];
    if (!set) return;
    setCoachErr(""); setWeaving(true);
    try {
      const cAns = (coach[active.slug] || {})[active.qi] || {};
      const items = set.map((q, ci) => ({ q, a: cAns[ci] || "" }));
      const { data, error } = await supabase.functions.invoke("movie-brain", { body: { mainQuestion: OW_FLAT[active.qi] || "", items } });
      if (error) throw error;
      const p = data as { text?: string; error?: string } | null;
      if (p?.error) throw new Error(p.error);
      if (p?.text) setMain(active.slug, active.qi, p.text);
      else throw new Error("No text returned");
    } catch (e) {
      setCoachErr(e instanceof Error ? e.message : "Weave failed");
    } finally { setWeaving(false); }
  };

  const activeSet = active ? COACH_SETS[active.qi] : undefined;
  const activeCoachAns = active ? ((coach[active.slug] || {})[active.qi] || {}) : {};

  return (
    <section className="bg-background px-4 py-10 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Your movie · beats</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">The Beats</h1>
        <p className="text-[13.5px] text-foreground/55 mt-2 max-w-[640px]">Open a beat and answer its questions. Stuck on one? Hit ✨ and the AI Coach on the right walks you through it — your coaching answers weave back into your main answer.</p>

        <div className="mt-6 lg:flex lg:gap-6 lg:items-start">
          {/* LEFT — the beats */}
          <div className="lg:flex-1 min-w-0 flex flex-col gap-2.5">
            {visible.map((b, i) => {
              const isOpen = openIdx === i;
              const chips = fws.filter((k) => b.fw[k]);
              const isOW = b.slug === "the-ordinary-world";
              const mainAns = answers[b.slug] || {};
              const filled = Object.values(mainAns).filter((v) => v && v.trim()).length;
              return (
                <div key={b.slug} className="rounded-xl border bg-white/[0.02] overflow-hidden" style={{ borderColor: isOpen ? GOLD : "#2c323b" }}>
                  <button onClick={() => { setOpenIdx(isOpen ? -1 : i); }} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                    <span className="w-6 h-6 rounded-md bg-[#0c0e13] border border-white/10 flex items-center justify-center text-[11px] font-extrabold text-foreground/55 flex-shrink-0">{i + 1}</span>
                    <span className="text-[15px] font-extrabold text-foreground">{b.t}</span>
                    <span className="flex gap-1.5 flex-wrap">
                      {chips.map((k) => <span key={k} className="text-[9px] font-bold rounded-full px-2 py-[2px]" style={{ color: FWC[k], background: `${FWC[k]}1f`, border: `1px solid ${FWC[k]}55` }}>{b.fw[k]}</span>)}
                    </span>
                    <span className="ml-auto flex items-center gap-3 flex-shrink-0">
                      {isOW && <span className="text-[11px] text-foreground/40">{filled}/{OW_TOTAL}</span>}
                      <span className="text-[12px] text-foreground/50 inline-block" style={{ transform: isOpen ? "rotate(90deg)" : "none" }}>▸</span>
                    </span>
                  </button>
                  {isOpen && (isOW ? (
                    <div className="border-t border-white/10 px-4 pb-4">
                      {OW_ITEMS.map((it) => it.kind === "group" ? (
                        <div key={"g" + it.L} className="mt-5 mb-1 flex items-center gap-2.5">
                          <span className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[12px] font-extrabold" style={{ background: "#f0d089", color: "#1a1300" }}>{it.L}</span>
                          <span className="text-[13px] font-extrabold" style={{ color: "#f0d089" }}>{it.name}</span>
                          <span className="flex-1 h-px bg-white/10" />
                        </div>
                      ) : (
                        <div key={"q" + it.qi} className="flex gap-3 py-2.5 border-b border-white/[0.045] rounded-lg" style={active && active.slug === b.slug && active.qi === it.qi ? { background: "rgba(212,160,23,0.06)" } : {}}>
                          <span className="w-6 text-right text-[11px] font-extrabold text-foreground/35 pt-1">{it.qi + 1}</span>
                          <div className="flex-1">
                            <label className="block text-[13px] font-semibold text-foreground mb-1.5">{it.text}</label>
                            <textarea value={mainAns[it.qi] || ""} onChange={(e) => setMain(b.slug, it.qi, e.target.value)} placeholder="Type your answer…" className="w-full bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-2.5 py-2 text-[12.5px] resize-y" style={{ minHeight: 36, fontFamily: "inherit" }} />
                            <button onClick={() => openCoach(b.slug, it.qi)} className="mt-1.5 text-[10.5px] font-bold rounded-md px-2.5 py-1" style={{ color: "#f0d089", background: "#1a1710", border: `1px solid ${GOLD}66` }}>✨ Coach me on this →</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-[12.5px] text-foreground/40 italic border-t border-white/10">This beat opens into the same kind of question template as The Ordinary World — tailored to “{b.t}.” We'll build it next.</div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* RIGHT — the AI coach */}
          <aside id="mib-coach" className="mt-5 lg:mt-0 lg:w-[380px] lg:flex-shrink-0">
            <div className="lg:sticky lg:top-[92px] rounded-xl border border-white/12 bg-[#12141a] overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 110px)" }}>
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2" style={{ background: "linear-gradient(180deg,#1a1710,#12141a)" }}>
                <span className="text-[14px] font-extrabold" style={{ color: "#f0d089" }}>🧠 AI Coach</span>
                {active && <button onClick={() => setActive(null)} className="ml-auto text-foreground/40 hover:text-foreground text-[13px]">✕</button>}
              </div>
              {!active ? (
                <div className="p-5 text-[12.5px] text-foreground/45 leading-relaxed">Open a beat and hit <span style={{ color: "#f0d089" }} className="font-bold">✨ Coach me on this</span> next to any question. I'll ask you deeper questions here — and weave your answers back into your main answer.</div>
              ) : (
                <div className="flex flex-col min-h-0">
                  <div className="px-4 pt-3 pb-2 border-b border-white/8">
                    <div className="text-[10px] uppercase tracking-wide text-foreground/40 font-bold">Coaching</div>
                    <div className="text-[13px] font-bold text-foreground mt-0.5">{OW_FLAT[active.qi]}</div>
                  </div>
                  {activeSet ? (
                    <>
                      <div className="overflow-y-auto px-4 py-3" style={{ flex: "1 1 auto" }}>
                        <div className="text-[11.5px] text-foreground/50 mb-2">Answer any of these — the more, the richer. They weave into your answer.</div>
                        {activeSet.map((q, ci) => (
                          <div key={ci} className="mb-3">
                            <label className="block text-[12px] text-foreground/85 mb-1"><span className="text-foreground/35 font-bold mr-1">{ci + 1}.</span>{q}</label>
                            <textarea value={activeCoachAns[ci] || ""} onChange={(e) => setCoachAns(active.slug, active.qi, ci, e.target.value)} placeholder="…" className="w-full bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-2.5 py-1.5 text-[12px] resize-y" style={{ minHeight: 30, fontFamily: "inherit" }} />
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-white/10">
                        {coachErr && <div className="mb-2 text-[11px]" style={{ color: "#ff9a9a" }}>{coachErr}</div>}
                        <button onClick={weave} disabled={weaving} className="w-full text-[12.5px] font-extrabold rounded-lg py-2.5 disabled:opacity-50" style={{ background: GOLD, color: "#1a1300" }}>{weaving ? "✨ Weaving…" : "✨ Weave into my answer"}</button>
                        <div className="text-[10px] text-foreground/35 mt-1.5 text-center">The AI writes a polished answer into the left box using only what you gave it.</div>
                      </div>
                    </>
                  ) : (
                    <div className="p-5 text-[12.5px] text-foreground/45 italic">Deeper coaching questions for this one are coming next — for now, answer it directly on the left.</div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
