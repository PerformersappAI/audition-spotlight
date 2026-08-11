import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Ex = { slug: string; action: string };
type Beat = { n: number; name: string; pos: string; job: string; ex: Ex };
type Act = { label: string; shade: "a1" | "a2" | "a3"; beats: Beat[] };
type Struct = { name: string; color: string; shades: { a1: string; a2: string; a3: string }; movie: string; acts: Act[] };
type Scene = { slug: string; action: string };

const SCENES: Record<string, Struct> = {
  "three-act": { name: "Three-Act", color: "#a855f7", movie: "The Godfather", shades: { a1: "rgba(221,190,255,0.14)", a2: "rgba(168,85,247,0.20)", a3: "rgba(88,28,135,0.38)" }, acts: [
    { label: "Act I — Setup", shade: "a1", beats: [
      { n: 1, name: "Ordinary World", pos: "Opening", job: "Establish the world and make us care.", ex: { slug: "EXT. CORLEONE ESTATE — DAY", action: "Connie's wedding. Petitioners kiss the Don's hand; the family and its code are on full display." } },
      { n: 2, name: "Inciting Incident", pos: "~12%", job: "Break the normal.", ex: { slug: "EXT. CITY STREET — DAY", action: "Don Vito is gunned down buying fruit; the family's world shatters." } },
      { n: 3, name: "First Plot Point", pos: "~25%", job: "Lock Act II with a choice.", ex: { slug: "INT. LOUIS' RESTAURANT — NIGHT", action: "Michael retrieves the hidden gun and shoots Sollozzo and McCluskey. No way back." } },
    ]},
    { label: "Act II — Confrontation", shade: "a2", beats: [
      { n: 4, name: "Rising Action", pos: "Act II", job: "Escalate the cost.", ex: { slug: "EXT. SICILIAN HILLSIDE — DAY", action: "In exile Michael marries Apollonia — until a car bomb meant for him kills her." } },
      { n: 5, name: "Midpoint", pos: "~50%", job: "Flip the story.", ex: { slug: "EXT. CAUSEWAY TOLLBOOTH — DAY", action: "Sonny is ambushed and gunned down; succession falls to Michael." } },
      { n: 6, name: "Crisis / Low", pos: "~75%", job: "Lowest point.", ex: { slug: "EXT. CORLEONE GARDEN — DAY", action: "Don Vito collapses among the tomato plants; Michael is alone at the top." } },
    ]},
    { label: "Act III — Resolution", shade: "a3", beats: [
      { n: 7, name: "Climax", pos: "~90%", job: "Answer the question.", ex: { slug: "INT. CHURCH / INTERCUT — DAY", action: "As Michael renounces Satan at the baptism, his men murder the heads of the Five Families." } },
      { n: 8, name: "Resolution", pos: "~99%", job: "Mirror the open.", ex: { slug: "INT. MICHAEL'S OFFICE — DAY", action: "Michael lies to Kay about Carlo's death; the door closes on her face." } },
    ]},
  ]},
  "save-the-cat": { name: "Save the Cat", color: "#d4a017", movie: "The Silence of the Lambs", shades: { a1: "rgba(212,160,23,0.12)", a2: "rgba(212,160,23,0.22)", a3: "rgba(120,90,10,0.45)" }, acts: [
    { label: "Act I — Setup", shade: "a1", beats: [
      { n: 1, name: "Opening Image", pos: "p.1", job: "Tone in one image.", ex: { slug: "EXT. FBI ACADEMY WOODS — DAY", action: "Clarice runs the obstacle course alone, driven and out of breath." } },
      { n: 2, name: "Theme Stated", pos: "p.5", job: "State the argument.", ex: { slug: "INT. ASYLUM — DAY", action: "“Quid pro quo” — to catch the monster she must give pieces of herself." } },
      { n: 3, name: "Set-Up", pos: "pp.1–10", job: "World and flaw.", ex: { slug: "INT. QUANTICO HALLS — DAY", action: "Clarice among the men who underestimate her; Crawford singles her out." } },
      { n: 4, name: "Catalyst", pos: "p.12", job: "Life-changing news.", ex: { slug: "INT. CRAWFORD'S OFFICE — DAY", action: "Crawford sends her to interview Hannibal Lecter." } },
      { n: 5, name: "Debate", pos: "pp.12–25", job: "Last doubt.", ex: { slug: "INT. ASYLUM CORRIDOR — DAY", action: "The unnerving first meetings; Miggs; is she out of her depth?" } },
      { n: 6, name: "Break into Two", pos: "p.25", job: "Choose the quest.", ex: { slug: "INT. SENATOR'S HOME / NEWS — NIGHT", action: "Catherine is abducted — a living victim, a ticking clock. Clarice commits." } },
    ]},
    { label: "Act II — Confrontation", shade: "a2", beats: [
      { n: 7, name: "B Story", pos: "p.30", job: "Theme carrier.", ex: { slug: "INT. LECTER'S CELL — DAY", action: "The duel begins: her worst memories traded for his insight." } },
      { n: 8, name: "Fun and Games", pos: "pp.30–55", job: "Promise of the premise.", ex: { slug: "INT. STORAGE UNIT — NIGHT", action: "The hunt: Raspail's head, the death's-head moth, the profile takes shape." } },
      { n: 9, name: "Midpoint", pos: "p.55", job: "False victory.", ex: { slug: "INT. LECTER'S CELL — DAY", action: "The lambs story unlocks “he covets” — then Chilton has Lecter transferred." } },
      { n: 10, name: "Bad Guys Close In", pos: "pp.55–75", job: "Pressure everywhere.", ex: { slug: "INT. MEMPHIS COURTHOUSE — DAY", action: "Clarice is sidelined; the clock runs down on Catherine." } },
      { n: 11, name: "All Is Lost", pos: "p.75", job: "Whiff of death.", ex: { slug: "INT. MEMPHIS CAGE — NIGHT", action: "Lecter's savage escape; guards slaughtered; her source is gone." } },
      { n: 12, name: "Dark Night of the Soul", pos: "pp.75–85", job: "Emotional low.", ex: { slug: "INT. CLARICE'S ROOM — NIGHT", action: "Alone with the files, doubting — then Lecter's clue returns: he's local." } },
      { n: 13, name: "Break into Three", pos: "p.85", job: "Fuse and charge.", ex: { slug: "INT. BIMMEL HOUSE — DAY", action: "The thread lands: Bill knew Fredrica; a tailor of skin. She follows it." } },
    ]},
    { label: "Act III — Resolution", shade: "a3", beats: [
      { n: 14, name: "Finale", pos: "pp.85–110", job: "Spend it all.", ex: { slug: "INT. GUMB'S BASEMENT — NIGHT", action: "Alone in the dark, hunted through night-vision, she kills Buffalo Bill and saves Catherine." } },
      { n: 15, name: "Final Image", pos: "p.110", job: "After-snapshot.", ex: { slug: "INT. GRADUATION HALL — DAY", action: "Clarice is an agent at last; Lecter phones from freedom and melts into the crowd." } },
    ]},
  ]},
  "heros-journey": { name: "Hero's Journey", color: "#fb7185", movie: "Gladiator", shades: { a1: "rgba(251,113,133,0.12)", a2: "rgba(251,113,133,0.22)", a3: "rgba(159,18,57,0.42)" }, acts: [
    { label: "Departure", shade: "a1", beats: [
      { n: 1, name: "Ordinary World", pos: "Stage 1", job: "The known world.", ex: { slug: "EXT. GERMANIA FIELD / WHEAT — DAWN", action: "Victorious Maximus longs for home; his hand brushes the wheat." } },
      { n: 2, name: "Call to Adventure", pos: "Stage 2", job: "The summons.", ex: { slug: "INT. IMPERIAL TENT — NIGHT", action: "Dying Marcus asks him to give Rome back to the Senate." } },
      { n: 3, name: "Refusal", pos: "Stage 3", job: "Hesitation.", ex: { slug: "INT. IMPERIAL TENT — NIGHT", action: "Maximus hesitates; he wants his farm, not power." } },
      { n: 4, name: "Meeting the Mentor", pos: "Stage 4", job: "The gift.", ex: { slug: "EXT. GLADIATOR CAMP — DAY", action: "Proximo teaches him to “win the crowd.”" } },
      { n: 5, name: "Crossing the Threshold", pos: "Stage 5", job: "No way back.", ex: { slug: "EXT. MAXIMUS'S FARM — DAY", action: "He finds his family murdered; captured and sold into slavery." } },
    ]},
    { label: "Initiation", shade: "a2", beats: [
      { n: 6, name: "Tests, Allies, Enemies", pos: "Stage 6", job: "Learn the world.", ex: { slug: "EXT. PROVINCIAL ARENA — DAY", action: "He fights, wins, survives, and gains Juba." } },
      { n: 7, name: "Approach the Inmost Cave", pos: "Stage 7", job: "Near the enemy.", ex: { slug: "EXT. COLOSSEUM — DAY", action: "The troupe enters Rome's great arena — the heart of Commodus's power." } },
      { n: 8, name: "The Ordeal", pos: "Stage 8", job: "Death and rebirth.", ex: { slug: "INT. COLOSSEUM FLOOR — DAY", action: "Meant to die, he wins and unmasks: “My name is Maximus…”" } },
      { n: 9, name: "Reward", pos: "Stage 9", job: "Seize the sword.", ex: { slug: "EXT. COLOSSEUM — DAY", action: "The crowd's love makes him untouchable; a conspiracy forms." } },
    ]},
    { label: "Return", shade: "a3", beats: [
      { n: 10, name: "The Road Back", pos: "Stage 10", job: "Last danger.", ex: { slug: "INT. ROME ALLEY — NIGHT", action: "The escape plan is betrayed; Cicero killed; Maximus captured." } },
      { n: 11, name: "Resurrection", pos: "Stage 11", job: "Final test.", ex: { slug: "INT. COLOSSEUM — DAY", action: "Stabbed in secret before the duel, he still kills Commodus." } },
      { n: 12, name: "Return with the Elixir", pos: "Stage 12", job: "Bring the boon.", ex: { slug: "INT. COLOSSEUM / WHEAT — DAY", action: "He frees Rome with his last breath and walks into the wheat, home at last." } },
    ]},
  ]},
  "story-circle": { name: "Story Circle", color: "#2bd1c0", movie: "Forrest Gump", shades: { a1: "rgba(43,209,192,0.12)", a2: "rgba(43,209,192,0.22)", a3: "rgba(13,110,102,0.42)" }, acts: [
    { label: "Order", shade: "a1", beats: [
      { n: 1, name: "You", pos: "Step 1", job: "Comfort zone.", ex: { slug: "EXT. GREENBOW ROAD — DAY", action: "Young Forrest in leg braces; Mama's belief that he's no different." } },
      { n: 2, name: "Need", pos: "Step 2", job: "The want.", ex: { slug: "INT. SCHOOL BUS — DAY", action: "“You can sit here.” Jenny — belonging — enters his life." } },
    ]},
    { label: "Chaos", shade: "a2", beats: [
      { n: 3, name: "Go", pos: "Step 3", job: "Cross over.", ex: { slug: "EXT. COUNTRY ROAD — DAY", action: "His braces shatter and he runs — into football, the Army, Vietnam." } },
      { n: 4, name: "Search", pos: "Step 4", job: "Adapt and struggle.", ex: { slug: "EXT. VIETNAM / PING-PONG — VARIOUS", action: "He endures war, fame, and history, drifting through the chaos." } },
      { n: 5, name: "Find", pos: "Step 5", job: "Get it.", ex: { slug: "EXT. GULF WATERS — DAY", action: "A shrimping fortune, medals, fame — and Jenny returns, briefly." } },
      { n: 6, name: "Take", pos: "Step 6", job: "Pay the price.", ex: { slug: "INT. GREENBOW HOUSE — DAY", action: "Bubba, Mama, and Jenny slip away; overwhelmed, he just runs." } },
    ]},
    { label: "Return", shade: "a3", beats: [
      { n: 7, name: "Return", pos: "Step 7", job: "Home, changed.", ex: { slug: "EXT. GREENBOW — DAY", action: "Home again; Jenny reappears with their son." } },
      { n: 8, name: "Change", pos: "Step 8", job: "Transformed.", ex: { slug: "EXT. BUS STOP — DAY", action: "Now a father, he sends his son to school; the feather lifts again." } },
    ]},
  ]},
};

export default function SceneBuilder({ structureKey }: { structureKey: string }) {
  const data = SCENES[structureKey];
  const storageKey = `mib-scenes-${structureKey}`;
  const [scenes, setScenes] = useState<Record<string, Scene[]>>({});

  useEffect(() => {
    try { const raw = localStorage.getItem(storageKey); setScenes(raw ? JSON.parse(raw) : {}); }
    catch { setScenes({}); }
  }, [storageKey]);

  const persist = (next: Record<string, Scene[]>) => { try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ } };
  const add = (beat: string) => setScenes((p) => { const next = { ...p, [beat]: [...(p[beat] || []), { slug: "", action: "" }] }; persist(next); return next; });
  const upd = (beat: string, i: number, field: "slug" | "action", val: string) => setScenes((p) => { const arr = [...(p[beat] || [])]; arr[i] = { ...arr[i], [field]: val }; const next = { ...p, [beat]: arr }; persist(next); return next; });
  const rm = (beat: string, i: number) => setScenes((p) => { const arr = [...(p[beat] || [])]; arr.splice(i, 1); const next = { ...p, [beat]: arr }; persist(next); return next; });

  if (!data) return null;
  const c = data.color;
  const totalScenes = Object.values(scenes).reduce((s, a) => s + (a?.length || 0), 0);

  return (
    <section className="bg-background px-4 py-10">
      <div className="container mx-auto max-w-[880px]">
        <div className="text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: c }}>{data.name} · Scene</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">Turn each beat into scenes</h1>
        <p className="mt-3 text-foreground/60 text-[15px] max-w-[640px] leading-relaxed">Every beat becomes one or more actual scenes — a place, a moment, something that happens. This is your film's outline, and the bridge to Shots. Each beat shows how <span style={{ color: c, fontWeight: 600 }}>{data.movie}</span> did it.</p>
        <div className="mt-4 text-[12px] text-foreground/50"><span style={{ color: c, fontWeight: 700 }}>{totalScenes}</span> scene{totalScenes === 1 ? "" : "s"} written</div>

        <div className="mt-6">
          {data.acts.map((act) => (
            <div key={act.label}>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] mt-6 mb-3" style={{ color: c, opacity: 0.9 }}>{act.label}</p>
              {act.beats.map((b) => {
                const list = scenes[b.name] || [];
                return (
                  <div key={b.name} className="mb-3.5 rounded-r-xl px-4 py-4" style={{ borderLeft: `3px solid ${c}`, backgroundColor: data.shades[act.shade] }}>
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="font-serif font-bold text-[14px]" style={{ color: c, opacity: 0.8 }}>{b.n}</span>
                      <span className="font-serif font-bold text-[16px]" style={{ color: c }}>{b.name}</span>
                      <span className="text-[10px] text-foreground/55 border border-white/10 rounded-full px-2 py-0.5">{b.pos}</span>
                    </div>
                    <p className="text-[12.5px] text-foreground/60 mt-1.5">{b.job}</p>

                    <div className="mt-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: c, opacity: 0.75 }}>Example · {data.movie}</div>
                      <div className="font-mono text-[11px] font-bold uppercase" style={{ color: c }}>{b.ex.slug}</div>
                      <div className="text-[12.5px] text-foreground/70 mt-0.5">{b.ex.action}</div>
                    </div>

                    {list.map((s, i) => (
                      <div key={i} className="mt-2.5 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9.5px] font-extrabold rounded px-1.5 py-0.5" style={{ backgroundColor: c, color: "#0c0e13" }}>SCENE {b.n}.{i + 1}</span>
                          <button onClick={() => rm(b.name, i)} className="ml-auto text-[11px] text-foreground/40 hover:text-foreground/80 transition-colors">Remove</button>
                        </div>
                        <input value={s.slug} onChange={(e) => upd(b.name, i, "slug", e.target.value)} placeholder="INT./EXT.  LOCATION  —  DAY/NIGHT" className="w-full font-mono text-[11.5px] uppercase tracking-wide rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 mb-1.5 focus:outline-none focus:border-white/25" style={{ color: c }} />
                        <textarea value={s.action} onChange={(e) => upd(b.name, i, "action", e.target.value)} placeholder="What happens in this scene…" className="w-full min-h-[48px] resize-y rounded-md border border-white/10 bg-black/25 text-foreground text-[13px] px-2.5 py-2 leading-relaxed focus:outline-none focus:border-white/25" />
                      </div>
                    ))}

                    <button onClick={() => add(b.name)} className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-bold rounded-lg border border-dashed px-3 py-1.5 transition-opacity hover:opacity-100" style={{ color: c, borderColor: c, opacity: 0.8 }}>＋ Add a scene</button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3 pb-4">
          <span className="text-[12.5px] text-foreground/50">✓ Saved to this browser</span>
          <Link to={`/movie-in-a-box/${structureKey}/shots`} className="rounded-lg px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: c, color: "#0c0e13" }}>Continue to Shots →</Link>
        </div>
      </div>
    </section>
  );
}
