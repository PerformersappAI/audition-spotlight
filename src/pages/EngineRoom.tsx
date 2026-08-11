import { useEffect, useState } from "react";
import Seo from "@/components/Seo";

type K = "b" | "s" | "p";
type Opt = { name: string; note: string; cost: number };
type Stage = { key: string; sn: string; sd: string; why: string; opts: Record<K, Opt> };

const GOLD = "#d4a017";

// Character Lock is NOT optional — every movie includes it. Fixed cost added to every tier.
const CONTINUITY = { name: "Soul ID", cost: 49 };

const STAGES: Stage[] = [
  {
    key: "video", sn: "🎥 Video engine", sd: "the AI that films your movie",
    why: "This is the engine that actually creates your moving footage — the actors, the sets, the action, all of it. When two characters argue across a diner table, when an X-wing chases a TIE fighter through a canyon, when a helicopter roars over a street — this is the tool drawing every single frame. It is the most important and most expensive choice on the page, because it decides how real your movie looks, how well it handles dialogue, and whether it can pull off big action. Every option here can do spoken dialogue and multiple characters; the tiers differ in realism, resolution, and how long each shot can run before it has to be stitched to the next.",
    opts: { b: { name: "Wan 2.7", note: "$0.10/s · dialogue + sound built in", cost: 180 }, s: { name: "Seedance 2.5", note: "30-second takes · best continuity", cost: 520 }, p: { name: "Veo 3.1 (4K) + Seedance", note: "top realism · true 4K", cost: 1900 } },
  },
  {
    key: "hero", sn: "🎬 Hero shots (4K)", sd: "your jaw-drop moments in max quality",
    why: "Some moments deserve to look absolutely stunning — the big reveal, the final battle, the shot you would put on the poster. This is an optional upgrade that renders your most important shots at the highest quality (true 4K, best-in-class realism) using the premium engine. Everyday shots do not need it, but your showcase moments do. On the Budget tier you skip this and everything renders at the standard quality of your main engine.",
    opts: { b: { name: "Standard shots only", note: "no separate 4K pass", cost: 0 }, s: { name: "Veo 3.1 Fast", note: "key moments upgraded", cost: 120 }, p: { name: "Veo 3.1 (4K)", note: "full 4K showcase", cost: 300 } },
  },
  {
    key: "keyframe", sn: "🖼️ Key-frames", sd: "the first picture each shot grows from",
    why: "Before the AI animates a shot, it needs a starting picture — the very first frame. Think of it as the storyboard drawing that the video grows out of. This is also where your locked character first appears in a given scene, wearing the right costume, in the right location. Better key-frames mean better shots: more accurate faces, readable text on signs and screens, and the right lighting and mood. Weak key-frames drag down even the best video engine.",
    opts: { b: { name: "Flux 1.1 Pro", note: "~$0.04 / image", cost: 20 }, s: { name: "Nano Banana 2", note: "$0.06 / image", cost: 35 }, p: { name: "Nano Banana Pro", note: "best faces + text", cost: 80 } },
  },
  {
    key: "previz", sn: "🎞️ Previz (rough draft)", sd: "a cheap sketch before the real render",
    why: "Previz is short for 'previsualization' — a fast, cheap, rough version of a shot, like a pencil sketch before the oil painting. You block out the whole movie inexpensively first, watch it, make sure each scene actually works, and only THEN spend real money rendering the final version on a premium engine. It is how you avoid paying top dollar for a shot you end up cutting. This runs on the cheapest engine in every tier — it is a workflow step, not a quality choice.",
    opts: { b: { name: "PixVerse V6", note: "cheapest per second", cost: 15 }, s: { name: "PixVerse V6", note: "cheapest per second", cost: 15 }, p: { name: "PixVerse V6", note: "cheapest per second", cost: 15 } },
  },
  {
    key: "voice", sn: "🎙️ Voices & dialogue", sd: "every line your characters speak",
    why: "Every word your characters say, plus any narration, is performed here. Modern voice AI does not just read text — it acts. It can whisper, shout, break down crying, land a joke, do accents, speak dozens of languages, and even clone one specific person's voice so a character always sounds the same. In a movie with many speaking characters, this is what turns silent footage into real performances. Higher tiers give you more control, more emotion, and voice cloning.",
    opts: { b: { name: "Inworld TTS", note: "great value", cost: 3 }, s: { name: "Gemini TTS", note: "very expressive", cost: 8 }, p: { name: "ElevenLabs v3", note: "voice cloning · 70+ languages", cost: 12 } },
  },
  {
    key: "music", sn: "🎵 Music score", sd: "the emotional soundtrack",
    why: "This is your score — the music playing under the film that tells the audience how to feel. The AI composes original music to fit each scene: tense strings for the standoff, soft piano for the goodbye, soaring brass when the hero wins. It writes full pieces with real-sounding instruments, matched to the length you need. Good music is one of the cheapest things on this page and one of the biggest upgrades to how professional your movie feels.",
    opts: { b: { name: "CassetteAI", note: "fast & cheap", cost: 4 }, s: { name: "Lyria 3 Pro", note: "full scored songs", cost: 10 }, p: { name: "Lyria 3 Pro", note: "full scored songs", cost: 10 } },
  },
  {
    key: "sfx", sn: "🔊 Sound effects", sd: "footsteps, blasters, explosions, rain",
    why: "Foley and ambience — the small sounds that make a scene feel real. Footsteps on gravel, a lightsaber igniting, helicopter rotors, a door slam, rain on a window, the murmur of a crowd. Without them a scene feels dead; with them it feels alive. The premium tools can even watch a finished shot and automatically generate the exact effects that match what is happening on screen.",
    opts: { b: { name: "Stable Audio", note: "solid & cheap", cost: 6 }, s: { name: "ElevenLabs SFX", note: "high quality", cost: 9 }, p: { name: "ElevenLabs SFX", note: "watches the shot", cost: 9 } },
  },
  {
    key: "lipsync", sn: "👄 Lip-sync", sd: "mouths that match the words",
    why: "When a character talks on camera, their mouth has to match the words coming out — otherwise it looks like a badly dubbed movie. This tool tightens the lip movement so on-camera dialogue looks natural and believable. It is only applied to your talking shots, not the whole film, so it is cheaper than it sounds. Higher tiers give sharper, more accurate sync.",
    opts: { b: { name: "VEED Lipsync", note: "cheapest", cost: 8 }, s: { name: "Sync 2.0", note: "reliable at scale", cost: 30 }, p: { name: "Sync 2.0 Pro", note: "sharpest sync", cost: 50 } },
  },
  {
    key: "finish", sn: "✨ Finishing", sd: "the final polish pass",
    why: "The last step. Finishing upscales your footage to crisp high resolution, steadies any shakiness, cleans up glitches and artifacts, and evens out the look so the whole movie feels like one film — not hundreds of separate AI clips stitched together. It is the difference between 'a bunch of AI shots' and 'a movie.' Budget skips this to save money; the paid tiers include it.",
    opts: { b: { name: "None (raw output)", note: "skip to save", cost: 0 }, s: { name: "Topaz Upscale", note: "sharpen + steady", cost: 25 }, p: { name: "Topaz + SeedVR2", note: "restore + 4K", cost: 60 } },
  },
];

const TIER_LABEL: Record<string, string> = { budget: "Budget", standard: "Standard", premium: "Premium" };
const tierToKey = (t: string): K => (t === "budget" ? "b" : t === "premium" ? "p" : "s");

export default function EngineRoom() {
  const [mode, setMode] = useState<"tier" | "alc">("tier");
  const [tier, setTier] = useState<string>("standard");
  const [sel, setSel] = useState<Record<string, K>>(() => Object.fromEntries(STAGES.map((s) => [s.key, "s"])));
  const [showGuide, setShowGuide] = useState(true);
  const [openWhy, setOpenWhy] = useState<Record<string, boolean>>({});
  const toggleWhy = (k: string) => setOpenWhy((o) => ({ ...o, [k]: !o[k] }));

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mib-engine");
      if (raw) { const j = JSON.parse(raw); if (j.sel) setSel(j.sel); if (j.tier) setTier(j.tier); }
    } catch { /* ignore */ }
  }, []);
  useEffect(() => { try { localStorage.setItem("mib-engine", JSON.stringify({ tier, sel })); } catch { /* ignore */ } }, [tier, sel]);

  const applyTier = (t: string) => { const k = tierToKey(t); setTier(t); setSel(Object.fromEntries(STAGES.map((s) => [s.key, k]))); };
  const pickOpt = (stageKey: string, k: K) => {
    const next = { ...sel, [stageKey]: k };
    setSel(next);
    const keys = STAGES.map((s) => next[s.key]);
    const allSame = keys.every((x) => x === keys[0]);
    setTier(allSame ? (keys[0] === "b" ? "budget" : keys[0] === "p" ? "premium" : "standard") : "custom");
  };

  const total = CONTINUITY.cost + STAGES.reduce((sum, st) => sum + st.opts[sel[st.key]].cost, 0);
  const costColor = total < 500 ? "#57d38c" : total < 1300 ? "#7fb0ff" : "#f0d089";
  const tierName = tier === "custom" ? "Custom" : TIER_LABEL[tier];

  const PRESETS = [
    { id: "budget", cap: "💸 Budget", tagline: "\"The Indie\" — real movie, lowest cost", cost: "~$250–450", accent: "#2e9e5b", chip: "#57d38c",
      items: ["🎥 Wan 2.7 video (dialogue + sound)", "👤 Soul ID character lock — included", "🎙️ Inworld voices", "🎵 CassetteAI score", "✨ no finishing pass"] },
    { id: "standard", cap: "⭐ Standard", tagline: "\"The Pro\" — the recommended movie", cost: "~$700–1,100", accent: "#4b8fd6", chip: "#7fb0ff", ribbon: "RECOMMENDED",
      items: ["🎥 Seedance 2.5 (long, consistent takes)", "👤 Soul ID character lock — included", "🎙️ Gemini voices", "🎵 Lyria 3 Pro score", "✨ Topaz finishing"] },
    { id: "premium", cap: "🎬 Premium", tagline: "\"The Ferrari\" — cinema quality", cost: "~$2,500+", accent: GOLD, chip: "#f0d089",
      items: ["🎥 Veo 3.1 4K + Seedance", "👤 Soul ID character lock — included", "🎙️ ElevenLabs voice cloning", "🎵 Lyria 3 Pro score", "✨ Topaz + restore finishing"] },
  ];

  return (
    <>
      <Seo title="The Engine Room | Movie in a Box" description="Choose the AI tools that build your movie. Every tier keeps your characters consistent — pick a budget or hand-pick each piece." canonical="https://filmmakergenius.com/movie-in-a-box/engine-room" type="website" />
      <section className="bg-background px-4 pt-10 pb-28">
        <div className="max-w-[980px] mx-auto text-foreground">
          <div className="text-[12px] text-foreground/40 mb-3"><span className="text-foreground/60">Movie in a Box</span> › The Engine Room</div>
          <div className="text-[11px] font-extrabold uppercase tracking-[2px] text-foreground/40">Set up your studio</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1.5">The <span style={{ color: GOLD }}>Engine Room</span></h1>
          <p className="text-[14px] text-foreground/60 max-w-[680px] mt-2 leading-relaxed">This is where you hire the AI crew that builds your movie. A film is not made by one tool — it is made by a team of specialists working together, one for the footage, one for the voices, one for the music, one to keep your characters looking the same. Pick a budget tier to hire the whole crew at once, or go à la carte and choose each specialist yourself.</p>

          {/* READ-FIRST GUIDE */}
          <div className="mt-5 rounded-xl border border-white/12 bg-white/[0.03] overflow-hidden">
            <button onClick={() => setShowGuide((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 text-left">
              <span className="text-[13.5px] font-extrabold text-foreground">📖 Read this first — how an AI movie actually gets made</span>
              <span className="text-foreground/50 text-[13px]">{showGuide ? "▲ hide" : "▼ show"}</span>
            </button>
            {showGuide && (
              <div className="px-4 pb-4 pt-1 space-y-3 text-[13px] text-foreground/70 leading-relaxed border-t border-white/8">
                <p><b className="text-foreground">This is a movie maker — not a monologue app.</b> It is built for real films: multiple characters, real dialogue, action, and effects. Think a diner scene that cuts between three people mid-argument, a dogfight between spaceships, or a helicopter strafing a street. Full movies, not talking-head clips or commercials.</p>
                <p><b className="text-foreground" style={{ color: GOLD }}>Continuity is the whole game.</b> The hardest part of an AI movie is keeping your hero the <i>same person</i> in shot 1 and in shot 400. AI has no memory — left alone, it reinvents the face, hair, and clothes every single time, and your lead quietly turns into a dozen different strangers. That is fatal. So <b className="text-foreground">every tier here includes Character Lock</b> (a system called Soul ID): you train it once on about 20 photos of each character, and from then on that exact person shows up in every shot, any angle, any costume, any scene. There is no version of this movie maker without it — a movie without continuity is just a slideshow of strangers.</p>
                <p><b className="text-foreground">How the money works.</b> The prices shown are rough <i>raw-generation</i> costs for a 30-minute film, before re-takes. In reality you re-render shots several times to get them right, so budget for more. That is exactly why the workflow renders a cheap rough draft first (previz) and only spends premium money on the shots you decide to keep.</p>
                <p><b className="text-foreground">Two providers, one crew.</b> The tools come from two AI companies — <b style={{ color: "#7fb0ff" }}>fal.ai</b> (which runs almost everything) and <b style={{ color: GOLD }}>Higgsfield</b> (which we use for the character lock). Think of them as the rental houses we get the cameras and crew from. You do not manage them — Movie in a Box does.</p>
              </div>
            )}
          </div>

          {/* MODE SWITCH */}
          <div className="text-[11px] font-extrabold uppercase tracking-[1.4px] text-foreground/40 mt-8 mb-3 flex items-center gap-2.5">How do you want to choose?<span className="flex-1 h-px bg-white/10" /></div>
          <div className="flex gap-2 flex-wrap">
            {([["tier", "🎚️ Pick a tier", "(fast)", "#f0d089", "One button hires the whole crew for that budget."], ["alc", "🧩 À la carte", "(full control)", "#7fb0ff", "Hand-pick the video, voices, music & every stage yourself."]] as const).map(([m, t, h, hc, d]) => {
              const on = mode === m;
              return (
                <button key={m} onClick={() => setMode(m)} className="flex-1 min-w-[200px] text-left rounded-[10px] px-3.5 py-3 transition-colors" style={{ border: `1px solid ${on ? GOLD : "#2c323b"}`, background: on ? "#1a1710" : "#14171d", boxShadow: on ? "0 0 0 2px rgba(212,160,23,0.25)" : "none" }}>
                  <div className="text-[14px] font-extrabold">{t} <span className="text-[10px]" style={{ color: hc }}>{h}</span></div>
                  <div className="text-[11.5px] text-foreground/60 mt-0.5">{d}</div>
                </button>
              );
            })}
          </div>

          {/* ALWAYS-ON CONTINUITY BANNER */}
          <div className="mt-5 rounded-xl px-4 py-3.5 flex items-start gap-3" style={{ border: `1px solid ${GOLD}66`, background: "#1a1710" }}>
            <div className="text-[20px] leading-none mt-0.5">👤</div>
            <div>
              <div className="text-[13.5px] font-extrabold" style={{ color: "#f0d089" }}>Character Lock — always on in every movie <span className="ml-1 text-[10px] px-2 py-[2px] rounded-full align-middle" style={{ background: GOLD, color: "#1a1300" }}>REQUIRED</span></div>
              <div className="text-[12.5px] text-foreground/70 mt-1 leading-relaxed">Keeps every character the same person across all your shots. Trained once on ~20 photos per character (this uses Higgsfield's <b className="text-foreground">Soul ID</b>). This is baked into every tier and cannot be turned off — without it, there is no movie. Included cost: about ${CONTINUITY.cost} of the total below.</div>
            </div>
          </div>

          {mode === "tier" ? (
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[1.4px] text-foreground/40 mt-8 mb-3 flex items-center gap-2.5">One-click tiers<span className="flex-1 h-px bg-white/10" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESETS.map((p) => {
                  const on = tier === p.id;
                  return (
                    <button key={p.id} onClick={() => applyTier(p.id)} className="relative text-left rounded-xl px-4 pt-4 pb-3.5 transition-transform hover:-translate-y-0.5" style={{ border: `1px solid ${on ? "rgba(255,255,255,0.28)" : "#2c323b"}`, borderTop: `4px solid ${p.accent}`, background: on ? "#181b21" : "#14171d", boxShadow: on ? "0 0 0 2px rgba(255,255,255,0.12)" : "none" }}>
                      {p.ribbon && <span className="absolute -top-2.5 right-3 text-[9.5px] font-extrabold tracking-wide px-2 py-[3px] rounded-full" style={{ background: p.accent, color: "#04101c" }}>{p.ribbon}</span>}
                      <div className="text-[16px] font-extrabold" style={{ color: p.chip }}>{p.cap}</div>
                      <div className="text-[11.5px] text-foreground/60 mt-0.5">{p.tagline}</div>
                      <div className="text-[18px] font-extrabold mt-3" style={{ color: p.chip }}>{p.cost}</div>
                      <div className="text-[10.5px] uppercase tracking-wide text-foreground/40">raw · 30-min film</div>
                      <ul className="mt-2.5 space-y-0.5">{p.items.map((it) => <li key={it} className="text-[11px] text-foreground/60">{it}</li>)}</ul>
                      <div className="mt-3 text-center text-[12px] font-extrabold py-2 rounded-lg" style={on ? { background: p.accent, color: "#04120b" } : { border: "1px solid #2c323b", color: "rgba(232,234,237,0.6)" }}>{on ? "✓ Using " + TIER_LABEL[p.id] : "Use " + TIER_LABEL[p.id]}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11.5px] text-foreground/40 mt-3">Want to change just one thing? Switch to <button onClick={() => setMode("alc")} className="underline" style={{ color: "#7fb0ff" }}>à la carte</button> — your tier is pre-filled and you can swap any single line.</p>
            </div>
          ) : (
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[1.4px] text-foreground/40 mt-8 mb-3 flex items-center gap-2.5">À la carte — pick each piece<span className="flex-1 h-px bg-white/10" /></div>
              <div className="space-y-2.5">
                {STAGES.map((st) => {
                  const open = !!openWhy[st.key];
                  return (
                    <div key={st.key} className="rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[13.5px] font-extrabold">{st.sn}</div>
                          <div className="text-[11px] text-foreground/50 mt-0.5">{st.sd}</div>
                        </div>
                        <button onClick={() => toggleWhy(st.key)} className="flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/15 text-foreground/70 hover:text-foreground">{open ? "✕ close" : "ⓘ what is this?"}</button>
                      </div>
                      {open && <div className="text-[12.5px] text-foreground/70 leading-relaxed mt-2.5 pt-2.5 border-t border-white/8">{st.why}</div>}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                        {(["b", "s", "p"] as K[]).map((k) => {
                          const o = st.opts[k]; const on = sel[st.key] === k;
                          const lab = k === "b" ? "💸 Budget" : k === "s" ? "⭐ Standard" : "🎬 Premium";
                          const lc = k === "b" ? "#57d38c" : k === "s" ? "#7fb0ff" : "#f0d089";
                          return (
                            <button key={k} onClick={() => pickOpt(st.key, k)} className="text-left rounded-[9px] px-2.5 py-2 transition-colors" style={{ border: `1px solid ${on ? GOLD : "#2c323b"}`, background: on ? "#211b0c" : "#14171d" }}>
                              <div className="text-[10px] font-extrabold uppercase tracking-wide flex items-center justify-between" style={{ color: lc }}>{lab}{on && <span style={{ color: GOLD }}>✓</span>}</div>
                              <div className="text-[12.5px] font-bold mt-0.5" style={{ color: on ? "#f0d089" : "#e8eaed" }}>{o.name}</div>
                              <div className="text-[10.5px] text-foreground/60 mt-0.5">{o.note}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-[11px] text-foreground/40 mt-6 text-center leading-relaxed">
            <span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1" style={{ background: "#4b8fd6" }} /> fal.ai (runs almost everything) &nbsp;·&nbsp;
            <span className="inline-block w-2.5 h-2.5 rounded-full align-middle mx-1" style={{ background: GOLD }} /> Higgsfield (the character lock) <br className="hidden sm:block" />Costs are rough raw-generation estimates before re-takes.
          </div>
        </div>
      </section>

      <div className="fixed left-0 right-0 bottom-0 border-t border-white/15 z-40" style={{ background: "rgba(20,23,29,0.97)", backdropFilter: "blur(6px)" }}>
        <div className="max-w-[980px] mx-auto px-5 py-3 flex items-center gap-4 flex-wrap">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-foreground/40">Estimated for a 30-min film</div>
            <div className="text-[23px] font-extrabold leading-none" style={{ color: costColor }}>~${total.toLocaleString()}</div>
            <div className="text-[10.5px] text-foreground/40">raw generation · before re-takes</div>
          </div>
          <div className="text-[12px] text-foreground/60">Mix: <b className="text-foreground">{tierName}</b></div>
          <button className="ml-auto font-extrabold text-[13.5px] px-5 py-2.5 rounded-[9px]" style={{ background: GOLD, color: "#1a1300" }}>Lock it in → Start the movie →</button>
        </div>
      </div>
    </>
  );
}
