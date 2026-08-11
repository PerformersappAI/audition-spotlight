import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Beat = { n: number; name: string; pos: string; job: string; hint: string };
type Act = { label: string; shade: "a1" | "a2" | "a3"; beats: Beat[] };
type Struct = { name: string; color: string; shades: { a1: string; a2: string; a3: string }; movie: string; acts: Act[] };

const BEATS: Record<string, Struct> = {
  "three-act": {
    name: "Three-Act", color: "#a855f7", movie: "The Godfather",
    shades: { a1: "rgba(221,190,255,0.14)", a2: "rgba(168,85,247,0.20)", a3: "rgba(88,28,135,0.38)" },
    acts: [
      { label: "Act I — Setup", shade: "a1", beats: [
        { n: 1, name: "Ordinary World", pos: "Opening", job: "Establish who your hero is and their normal world — and make us care.", hint: "Connie's wedding installs the whole family and its rules." },
        { n: 2, name: "Inciting Incident", pos: "~12%", job: "Disrupt the normal with something the hero can't ignore.", hint: "Don Vito is gunned down in the street." },
        { n: 3, name: "First Plot Point", pos: "~25%", job: "Force an irreversible choice that locks Act II.", hint: "Michael volunteers to kill Sollozzo and McCluskey." },
      ]},
      { label: "Act II — Confrontation", shade: "a2", beats: [
        { n: 4, name: "Rising Action", pos: "Act II", job: "Escalate the cost of the goal, scene by scene.", hint: "Exile in Sicily; Apollonia killed by a car bomb." },
        { n: 5, name: "Midpoint", pos: "~50%", job: "Flip the story so the second half isn't a rerun of the first.", hint: "Sonny is slaughtered; succession pivots to Michael." },
        { n: 6, name: "Crisis / Low", pos: "~75%", job: "Drop the hero to their lowest point; force the final choice.", hint: "Don Vito dies; Michael is alone at the top." },
      ]},
      { label: "Act III — Resolution", shade: "a3", beats: [
        { n: 7, name: "Climax", pos: "~90%", job: "Spend everything in one decisive act that answers the question.", hint: "The baptism massacre; Michael seizes absolute power." },
        { n: 8, name: "Resolution", pos: "~99%", job: "Show the new normal; mirror the opening image.", hint: "The office door closes on Kay." },
      ]},
    ],
  },
  "save-the-cat": {
    name: "Save the Cat", color: "#d4a017", movie: "The Silence of the Lambs",
    shades: { a1: "rgba(212,160,23,0.12)", a2: "rgba(212,160,23,0.22)", a3: "rgba(120,90,10,0.45)" },
    acts: [
      { label: "Act I — Setup", shade: "a1", beats: [
        { n: 1, name: "Opening Image", pos: "p.1", job: "Set the tone and your hero's “before” in one image.", hint: "Clarice alone on the FBI obstacle course." },
        { n: 2, name: "Theme Stated", pos: "p.5", job: "Plant the film's real argument early, before the hero gets it.", hint: "“Quid pro quo.”" },
        { n: 3, name: "Set-Up", pos: "pp.1–10", job: "Establish the hero's world and the flaw the story will fix.", hint: "Quantico; her ambition and outsider status." },
        { n: 4, name: "Catalyst", pos: "p.12", job: "Deliver the news that knocks the hero out of routine.", hint: "She's sent to interview Hannibal Lecter." },
        { n: 5, name: "Debate", pos: "pp.12–25", job: "Let the hero hesitate — the last doubt before committing.", hint: "The unnerving first meetings with Lecter." },
        { n: 6, name: "Break into Two", pos: "p.25", job: "Have the hero actively choose to enter the new world.", hint: "Bill abducts Catherine; the clock starts." },
      ]},
      { label: "Act II — Confrontation", shade: "a2", beats: [
        { n: 7, name: "B Story", pos: "p.30", job: "Start the relationship that carries the theme.", hint: "The duel with Lecter — “quid pro quo” lived." },
        { n: 8, name: "Fun and Games", pos: "pp.30–55", job: "Deliver the promise of the premise.", hint: "The profiling procedural; the death's-head moth." },
        { n: 9, name: "Midpoint", pos: "p.55", job: "A false victory or defeat that raises the stakes.", hint: "The lambs story; Lecter cracks it, then is transferred." },
        { n: 10, name: "Bad Guys Close In", pos: "pp.55–75", job: "Tighten the noose from every side.", hint: "Chilton exposes the deal; Clarice is sidelined." },
        { n: 11, name: "All Is Lost", pos: "p.75", job: "Rock bottom, with a “whiff of death.”", hint: "Lecter's bloody escape." },
        { n: 12, name: "Dark Night of the Soul", pos: "pp.75–85", job: "Let the hero sit in the loss before the last idea.", hint: "Alone with the files, doubting." },
        { n: 13, name: "Break into Three", pos: "p.85", job: "Fuse the lesson and the plot; charge the finale.", hint: "“He covets what he sees” → Gumb's door." },
      ]},
      { label: "Act III — Resolution", shade: "a3", beats: [
        { n: 14, name: "Finale", pos: "pp.85–110", job: "Apply everything learned in the final face-off.", hint: "Alone in the dark basement, she kills Bill." },
        { n: 15, name: "Final Image", pos: "p.110", job: "The “after” snapshot; mirror the opening.", hint: "She graduates; Lecter melts into the crowd." },
      ]},
    ],
  },
  "heros-journey": {
    name: "Hero's Journey", color: "#fb7185", movie: "Gladiator",
    shades: { a1: "rgba(251,113,133,0.12)", a2: "rgba(251,113,133,0.22)", a3: "rgba(159,18,57,0.42)" },
    acts: [
      { label: "Departure", shade: "a1", beats: [
        { n: 1, name: "Ordinary World", pos: "Stage 1", job: "Show the known world your hero will ache to return to.", hint: "Maximus longs for his farm and family." },
        { n: 2, name: "Call to Adventure", pos: "Stage 2", job: "Disrupt the known world with a challenge.", hint: "Marcus asks him to become Protector of Rome." },
        { n: 3, name: "Refusal of the Call", pos: "Stage 3", job: "Let the hero hesitate — show what it will cost.", hint: "He wants home, not power." },
        { n: 4, name: "Meeting the Mentor", pos: "Stage 4", job: "Give the wisdom or gift that readies the hero.", hint: "Proximo: “win the crowd.”" },
        { n: 5, name: "Crossing the Threshold", pos: "Stage 5", job: "Commit the hero into the special world, no way back.", hint: "Family murdered; enslaved as a gladiator." },
      ]},
      { label: "Initiation", shade: "a2", beats: [
        { n: 6, name: "Tests, Allies, Enemies", pos: "Stage 6", job: "Learn the new world's rules; gather allies.", hint: "Fights the provinces; gains Juba." },
        { n: 7, name: "Approach the Inmost Cave", pos: "Stage 7", job: "Close on the enemy's stronghold.", hint: "Brought to the Colosseum itself." },
        { n: 8, name: "The Ordeal", pos: "Stage 8", job: "Face the deepest fear — a death and rebirth.", hint: "“My name is Maximus…” — the avenger reborn." },
        { n: 9, name: "Reward", pos: "Stage 9", job: "Seize the prize the ordeal earned.", hint: "The crowd's love; a conspiracy to restore Rome." },
      ]},
      { label: "Return", shade: "a3", beats: [
        { n: 10, name: "The Road Back", pos: "Stage 10", job: "Turn toward home as one last danger looms.", hint: "The plan is betrayed; he's captured." },
        { n: 11, name: "Resurrection", pos: "Stage 11", job: "Prove the change is real in one final test.", hint: "Wounded, he still kills Commodus." },
        { n: 12, name: "Return with the Elixir", pos: "Stage 12", job: "Bring the boon home — for everyone, not just the hero.", hint: "A freer Rome; he goes home in death." },
      ]},
    ],
  },
  "story-circle": {
    name: "Story Circle", color: "#2bd1c0", movie: "Forrest Gump",
    shades: { a1: "rgba(43,209,192,0.12)", a2: "rgba(43,209,192,0.22)", a3: "rgba(13,110,102,0.42)" },
    acts: [
      { label: "Order", shade: "a1", beats: [
        { n: 1, name: "You", pos: "Step 1", job: "Establish your character in their comfort zone.", hint: "Young Forrest in Greenbow with Mama." },
        { n: 2, name: "Need", pos: "Step 2", job: "Name the want that will pull them out of comfort.", hint: "Love and belonging — which becomes Jenny." },
      ]},
      { label: "Chaos", shade: "a2", beats: [
        { n: 3, name: "Go", pos: "Step 3", job: "Push the hero across, into the unknown.", hint: "Braces shatter; football, the Army, Vietnam." },
        { n: 4, name: "Search", pos: "Step 4", job: "Adapt and struggle in the chaos.", hint: "Vietnam, ping-pong, shrimping, fame." },
        { n: 5, name: "Find", pos: "Step 5", job: "Get what they were after.", hint: "Success — and Jenny, briefly." },
        { n: 6, name: "Take", pos: "Step 6", job: "Pay a heavy price for it.", hint: "Bubba, Mama, Jenny — loss; he just runs." },
      ]},
      { label: "Return", shade: "a3", beats: [
        { n: 7, name: "Return", pos: "Step 7", job: "Come home to where they started — changed.", hint: "Home to Greenbow; Jenny and their son." },
        { n: 8, name: "Change", pos: "Step 8", job: "Show the transformation; mirror the opening.", hint: "He's a father now; the feather lifts again." },
      ]},
    ],
  },
};

export default function BeatsBuilder({ structureKey }: { structureKey: string }) {
  const data = BEATS[structureKey];
  const storageKey = `mib-beats-${structureKey}`;
  const [entries, setEntries] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setEntries(raw ? JSON.parse(raw) : {});
    } catch {
      setEntries({});
    }
  }, [storageKey]);

  const update = (key: string, val: string) => {
    setEntries((prev) => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  if (!data) return null;
  const c = data.color;
  const all = data.acts.flatMap((a) => a.beats);
  const total = all.length;
  const done = all.filter((b) => (entries[b.name] || "").trim().length > 0).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <section className="bg-background px-4 py-10">
      <div className="container mx-auto max-w-[860px]">
        <div className="text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: c }}>{data.name} · Beats</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">Write your film, one beat at a time</h1>
        <p className="mt-3 text-foreground/60 text-[15px] max-w-[620px] leading-relaxed">
          Each beat tells you its job and shows how <span style={{ color: c, fontWeight: 600 }}>{data.movie}</span> did it. You fill in your story's version.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: c }} />
          </div>
          <span className="text-[11.5px] font-semibold text-foreground/60 whitespace-nowrap">{done} of {total} beats written</span>
        </div>

        <div className="mt-6">
          {data.acts.map((act) => (
            <div key={act.label}>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] mt-6 mb-3" style={{ color: c, opacity: 0.9 }}>{act.label}</p>
              {act.beats.map((b) => {
                const filled = (entries[b.name] || "").trim().length > 0;
                return (
                  <div key={b.name} className="mb-3 rounded-r-xl px-[18px] py-4" style={{ borderLeft: `3px solid ${c}`, backgroundColor: data.shades[act.shade] }}>
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="font-serif font-bold text-[15px]" style={{ color: c, opacity: 0.8 }}>{b.n}</span>
                      <span className="font-serif font-bold text-[17px]" style={{ color: c }}>{b.name}</span>
                      <span className="text-[10.5px] text-foreground/55 border border-white/10 rounded-full px-2 py-0.5">{b.pos}</span>
                      {filled && <span className="ml-auto text-[11px] font-bold" style={{ color: "#37b87c" }}>✓ written</span>}
                    </div>
                    <p className="text-[13px] text-foreground/75 mt-2">{b.job}</p>
                    <p className="text-[12px] italic text-foreground/55 mt-1 mb-2.5">
                      <span style={{ color: c, fontStyle: "normal", fontWeight: 700 }}>{data.movie}:</span> {b.hint}
                    </p>
                    <textarea
                      value={entries[b.name] || ""}
                      onChange={(e) => update(b.name, e.target.value)}
                      placeholder="Write what happens in YOUR story here…"
                      className="w-full min-h-[58px] resize-y rounded-lg border border-white/10 bg-black/25 text-foreground text-[13.5px] px-3 py-2.5 leading-relaxed focus:outline-none focus:border-white/25"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3 pb-4">
          <span className="text-[12.5px] text-foreground/50">✓ Saved to this browser</span>
          <Link to={`/movie-in-a-box/${structureKey}/scene`} className="rounded-lg px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: c, color: "#0c0e13" }}>
            Continue to Scene →
          </Link>
        </div>
      </div>
    </section>
  );
}
