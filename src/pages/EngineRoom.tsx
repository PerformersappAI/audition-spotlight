import { useEffect, useState } from "react";
import Seo from "@/components/Seo";

type K = "b" | "s" | "p";
type Opt = { name: string; note: string; cost: number };
type Stage = { key: string; sn: string; sd: string; opts: Record<K, Opt> };

const GOLD = "#d4a017";
const STAGES: Stage[] = [
  { key: "video", sn: "🎥 Video engine", sd: "the look of the film",
    opts: { b: { name: "Wan 2.7", note: "$0.10/s · audio in", cost: 180 }, s: { name: "Seedance 2.5", note: "30s takes · best consistency", cost: 520 }, p: { name: "Veo 3.1 4K + Seedance", note: "4K hero shots", cost: 1900 } } },
  { key: "hero", sn: "🎬 Hero / 4K shots", sd: "showcase moments",
    opts: { b: { name: "— none", note: "skip", cost: 0 }, s: { name: "Veo 3.1 Fast", note: "selective", cost: 120 }, p: { name: "Veo 3.1 (4K)", note: "full quality", cost: 300 } } },
  { key: "lock", sn: "👤 Character lock", sd: "same face every shot",
    opts: { b: { name: "— off", note: "no lock", cost: 0 }, s: { name: "Soul ID", note: "Higgsfield", cost: 49 }, p: { name: "Soul ID", note: "Higgsfield", cost: 49 } } },
  { key: "keyframe", sn: "🖼️ Key-frames", sd: "start images",
    opts: { b: { name: "Flux 1.1 Pro", note: "~$0.04/img", cost: 20 }, s: { name: "Nano Banana 2", note: "$0.06/img", cost: 35 }, p: { name: "Nano Banana Pro", note: "$0.15/img", cost: 80 } } },
  { key: "previz", sn: "🎞️ Previz / blocking", sd: "cheap rough pass",
    opts: { b: { name: "PixVerse V6", note: "cheapest/sec", cost: 15 }, s: { name: "PixVerse V6", note: "cheapest/sec", cost: 15 }, p: { name: "PixVerse V6", note: "cheapest/sec", cost: 15 } } },
  { key: "voice", sn: "🎙️ Voice", sd: "narration & dialogue",
    opts: { b: { name: "Inworld TTS", note: "$0.01/1k", cost: 3 }, s: { name: "Gemini TTS", note: "$0.15/1k", cost: 8 }, p: { name: "ElevenLabs v3", note: "cloning · 70 langs", cost: 12 } } },
  { key: "music", sn: "🎵 Music", sd: "the score",
    opts: { b: { name: "CassetteAI", note: "$0.02/min", cost: 4 }, s: { name: "Lyria 3 Pro", note: "$0.08/track", cost: 10 }, p: { name: "Lyria 3 Pro", note: "$0.08/track", cost: 10 } } },
  { key: "sfx", sn: "🔊 Sound FX", sd: "foley & ambience",
    opts: { b: { name: "Stable Audio", note: "$0.20/clip", cost: 6 }, s: { name: "ElevenLabs SFX", note: "$0.002/s", cost: 9 }, p: { name: "ElevenLabs SFX", note: "video-to-sound", cost: 9 } } },
  { key: "lipsync", sn: "👄 Lip-sync", sd: "talking shots only",
    opts: { b: { name: "VEED Lipsync", note: "$0.40/min", cost: 8 }, s: { name: "Sync 2.0", note: "$3/min", cost: 30 }, p: { name: "Sync 2.0 Pro", note: "$5/min", cost: 50 } } },
  { key: "finish", sn: "✨ Finishing", sd: "upscale & polish",
    opts: { b: { name: "— skip", note: "none", cost: 0 }, s: { name: "Topaz Upscale", note: "$0.06/clip", cost: 25 }, p: { name: "Topaz + SeedVR2", note: "restore + 4K", cost: 60 } } },
];

const TIER_LABEL: Record<string, string> = { budget: "Budget", standard: "Standard", premium: "Premium" };
const tierToKey = (t: string): K => (t === "budget" ? "b" : t === "premium" ? "p" : "s");

export default function EngineRoom() {
  const [mode, setMode] = useState<"tier" | "alc">("tier");
  const [tier, setTier] = useState<string>("standard");
  const [sel, setSel] = useState<Record<string, K>>(() => Object.fromEntries(STAGES.map((s) => [s.key, "s"])));

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

  const total = STAGES.reduce((sum, st) => sum + st.opts[sel[st.key]].cost, 0);
  const costColor = total < 400 ? "#57d38c" : total < 1200 ? "#7fb0ff" : "#f0d089";
  const tierName = tier === "custom" ? "Custom" : TIER_LABEL[tier];

  const PRESETS = [
    { id: "budget", cap: "💸 Budget", tagline: '"The Indie" — cheap & fast', cost: "~$100–250", accent: "#2e9e5b", chip: "#57d38c",
      items: ["🎥 Wan 2.7 video", "🎙️ Inworld voice", "🎵 CassetteAI music", "👤 no character lock"] },
    { id: "standard", cap: "⭐ Standard", tagline: '"The Pro" — the default', cost: "~$500–1,000", accent: "#4b8fd6", chip: "#7fb0ff", ribbon: "RECOMMENDED",
      items: ["🎥 Seedance 2.5 video", "🎙️ Gemini TTS voice", "🎵 Lyria 3 Pro music", "👤 Soul ID character lock"] },
    { id: "premium", cap: "🎬 Premium", tagline: '"The Ferrari" — top end', cost: "~$2,500+", accent: GOLD, chip: "#f0d089",
      items: ["🎥 Veo 3.1 4K + Seedance", "🎙️ ElevenLabs v3 voice", "🎵 Lyria 3 Pro music", "👤 Soul ID character lock"] },
  ];

  return (
    <>
      <Seo title="The Engine Room | Movie in a Box" description="Choose the AI tools that build your movie — pick a budget tier or hand-pick every piece." canonical="https://filmmakergenius.com/movie-in-a-box/engine-room" type="website" />
      <section className="bg-background px-4 pt-10 pb-28">
        <div className="max-w-[980px] mx-auto text-foreground">
          <div className="text-[12px] text-foreground/40 mb-3"><span className="text-foreground/60">Movie in a Box</span> › The Engine Room</div>
          <div className="text-[11px] font-extrabold uppercase tracking-[2px] text-foreground/40">Set up your studio</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1.5">The <span style={{ color: GOLD }}>Engine Room</span></h1>
          <p className="text-[14px] text-foreground/60 max-w-[640px] mt-1.5">Choose the AI tools that will build your movie. Press one tier to plug everything in at once — or go à la carte and hand-pick each piece. Your choices carry into the whole flow.</p>

          <div className="text-[11px] font-extrabold uppercase tracking-[1.4px] text-foreground/40 mt-8 mb-3 flex items-center gap-2.5">How do you want to choose?<span className="flex-1 h-px bg-white/10" /></div>
          <div className="flex gap-2 flex-wrap">
            {([["tier", "🎚️ Pick a tier", "(fast)", "#f0d089", "One button plugs in every tool for that budget."], ["alc", "🧩 À la carte", "(full control)", "#7fb0ff", "Hand-pick the video, audio & every stage yourself."]] as const).map(([m, t, h, hc, d]) => {
              const on = mode === m;
              return (
                <button key={m} onClick={() => setMode(m)} className="flex-1 min-w-[200px] text-left rounded-[10px] px-3.5 py-3 transition-colors" style={{ border: `1px solid ${on ? GOLD : "#2c323b"}`, background: on ? "#1a1710" : "#14171d", boxShadow: on ? "0 0 0 2px rgba(212,160,23,0.25)" : "none" }}>
                  <div className="text-[14px] font-extrabold">{t} <span className="text-[10px]" style={{ color: hc }}>{h}</span></div>
                  <div className="text-[11.5px] text-foreground/60 mt-0.5">{d}</div>
                </button>
              );
            })}
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
              <div className="rounded-xl overflow-hidden border border-white/10">
                {STAGES.map((st, idx) => (
                  <div key={st.key} className="grid grid-cols-1 sm:grid-cols-[180px_1fr]" style={{ borderBottom: idx < STAGES.length - 1 ? "1px solid #262b33" : "none" }}>
                    <div className="bg-[#181b21] px-3.5 py-3.5 sm:border-r border-white/10">
                      <div className="text-[13px] font-extrabold">{st.sn}</div>
                      <div className="text-[10.5px] text-foreground/40 mt-0.5">{st.sd}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-3 py-2.5">
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
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-foreground/40 mt-6 text-center">
            <span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1" style={{ background: "#4b8fd6" }} /> fal.ai (one account) &nbsp;·&nbsp;
            <span className="inline-block w-2.5 h-2.5 rounded-full align-middle mx-1" style={{ background: GOLD }} /> Higgsfield (Soul ID) &nbsp;— costs are raw generation before iteration & re-takes.
          </div>
        </div>
      </section>

      <div className="fixed left-0 right-0 bottom-0 border-t border-white/15 z-40" style={{ background: "rgba(20,23,29,0.97)", backdropFilter: "blur(6px)" }}>
        <div className="max-w-[980px] mx-auto px-5 py-3 flex items-center gap-4 flex-wrap">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-foreground/40">Estimated for a 30-min film</div>
            <div className="text-[23px] font-extrabold leading-none" style={{ color: costColor }}>~${total.toLocaleString()}</div>
            <div className="text-[10.5px] text-foreground/40">raw generation · before iteration</div>
          </div>
          <div className="text-[12px] text-foreground/60">Mix: <b className="text-foreground">{tierName}</b></div>
          <button className="ml-auto font-extrabold text-[13.5px] px-5 py-2.5 rounded-[9px]" style={{ background: GOLD, color: "#1a1300" }}>Lock it in → Start the movie →</button>
        </div>
      </div>
    </>
  );
}
