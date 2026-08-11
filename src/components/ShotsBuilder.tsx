import { useEffect, useState } from "react";

type FwKey = "p" | "g" | "r" | "t";
const COLOR: Record<FwKey, string> = { p: "#a855f7", g: "#d4a017", r: "#fb7185", t: "#2bd1c0" };
const FNAME: Record<FwKey, string> = { p: "Three-Act", g: "Save the Cat", r: "Hero's Journey", t: "Story Circle" };
const ACCENT = "#eceef2";
const ACTS = ["Act I — Setup", "Act II — Confrontation", "Act III — Resolution"];
const SHOTS = 12, PERACT = 4;

const framing = ["Extreme Wide", "Wide / Establishing", "Full Shot", "Cowboy", "Medium", "Medium Close-Up", "Close-Up", "Extreme Close-Up"];
const angle = ["Eye Level", "Low Angle", "High Angle", "Overhead / Bird's-Eye", "Dutch Angle", "Over-the-Shoulder", "POV"];
const movement = ["Pan", "Tilt", "Push-In", "Tracking", "Crane / Jib", "Handheld", "Zoom", "Static"];
const transitions = ["Cut", "Fade", "Dissolve", "Wipe", "Smash Cut", "Whip Pan", "🤖 AI decides"];

const FR = '<rect x="1.5" y="1.5" width="45" height="27" rx="3.5" fill="none" stroke="rgba(255,255,255,.22)"/>';
const F = (i: string) => '<svg viewBox="0 0 48 30" width="46" height="29" style="overflow:hidden;display:block">' + FR + i + "</svg>";
const P = (i: string) => '<svg viewBox="0 0 48 30" width="46" height="29" style="overflow:hidden;display:block">' + i + "</svg>";
const ICONS: Record<string, string> = {
  "Extreme Wide": F('<line x1="6" y1="23" x2="42" y2="23" stroke="rgba(255,255,255,.16)"/><circle cx="24" cy="18.5" r="1.6" fill="currentColor"/><path d="M22.9 20.2h2.2l.5 3h-3.2z" fill="currentColor"/>'),
  "Wide / Establishing": F('<circle cx="24" cy="11.5" r="2.4" fill="currentColor"/><path d="M21.6 14.2h4.8l.9 10h-6.6z" fill="currentColor"/>'),
  "Full Shot": F('<circle cx="24" cy="7" r="3" fill="currentColor"/><path d="M20.5 10.5h7l1.2 15h-9.4z" fill="currentColor"/>'),
  "Cowboy": F('<circle cx="24" cy="7.5" r="3.6" fill="currentColor"/><path d="M18.6 12h10.8l1.6 19h-14z" fill="currentColor"/>'),
  "Medium": F('<circle cx="24" cy="9" r="4.6" fill="currentColor"/><path d="M15.5 14.5h17l2.2 17h-21.4z" fill="currentColor"/>'),
  "Medium Close-Up": F('<circle cx="24" cy="11" r="6.4" fill="currentColor"/><path d="M12.5 19h23l3 13h-29z" fill="currentColor"/>'),
  "Close-Up": F('<circle cx="24" cy="16" r="10.5" fill="currentColor"/>'),
  "Extreme Close-Up": F('<circle cx="24" cy="15" r="16" fill="currentColor" opacity=".22"/><ellipse cx="17.5" cy="15" rx="3.2" ry="2.2" fill="currentColor"/><ellipse cx="30.5" cy="15" rx="3.2" ry="2.2" fill="currentColor"/>'),
  "Eye Level": F('<circle cx="31" cy="10" r="2.6" fill="currentColor"/><path d="M28.4 13h5.2l1 12h-7.2z" fill="currentColor"/><path d="M7 16h11" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M16 13.5l3 2.5-3 2.5" fill="currentColor"/>'),
  "Low Angle": F('<circle cx="31" cy="10" r="2.6" fill="currentColor"/><path d="M28.4 13h5.2l1 12h-7.2z" fill="currentColor"/><path d="M8 25l10-8" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M18 17l-3 .5 1.7 2.5z" fill="currentColor"/>'),
  "High Angle": F('<circle cx="31" cy="12" r="2.6" fill="currentColor"/><path d="M28.4 15h5.2l1 10h-7.2z" fill="currentColor"/><path d="M8 6l10 8" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M18 14l-3-.5 1.7-2.5z" fill="currentColor"/>'),
  "Overhead / Bird's-Eye": F('<path d="M24 4v13" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M21.6 14l2.4 4 2.4-4z" fill="currentColor"/><ellipse cx="24" cy="24" rx="6" ry="3.2" fill="none" stroke="currentColor"/><circle cx="24" cy="24" r="1.6" fill="currentColor"/>'),
  "Dutch Angle": F('<g transform="rotate(-16 24 16)"><circle cx="24" cy="10" r="3" fill="currentColor"/><path d="M20.5 13.5h7l1 12h-9z" fill="currentColor"/><line x1="8" y1="22" x2="40" y2="22" stroke="currentColor" opacity=".5"/></g>'),
  "Over-the-Shoulder": F('<path d="M3 30c0-9 7-13 13-13v13z" fill="currentColor" opacity=".5"/><circle cx="33" cy="11" r="3" fill="currentColor"/><path d="M29.5 14.5h7l1 10h-9z" fill="currentColor"/>'),
  "POV": F('<path d="M7 7h6M7 7v6M41 7h-6M41 7v6M7 23h6M7 23v-6M41 23h-6M41 23v-6" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="24" cy="15" r="3.4" fill="none" stroke="currentColor"/><circle cx="24" cy="15" r="1.3" fill="currentColor"/>'),
  "Pan": F('<path d="M11 15h26" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M14 11.5l-4 3.5 4 3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M34 11.5l4 3.5-4 3.5" fill="none" stroke="currentColor" stroke-width="1.6"/>'),
  "Tilt": F('<path d="M24 7v16" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M20.5 10l3.5-4 3.5 4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M20.5 20l3.5 4 3.5-4" fill="none" stroke="currentColor" stroke-width="1.6"/>'),
  "Push-In": F('<rect x="15" y="9" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-dasharray="3 2"/><path d="M6 15h6" stroke="currentColor" stroke-width="1.4"/><path d="M12 12l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M42 15h-6" stroke="currentColor" stroke-width="1.4"/><path d="M36 12l-3 3 3 3" fill="none" stroke="currentColor" stroke-width="1.4"/>'),
  "Tracking": F('<line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" stroke-dasharray="3 3"/><rect x="9" y="11" width="10" height="8" rx="1.5" fill="none" stroke="currentColor"/><path d="M24 15h12" stroke="currentColor" stroke-width="1.4"/><path d="M33 12l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4"/>'),
  "Crane / Jib": F('<circle cx="11" cy="25" r="2" fill="currentColor"/><path d="M11 25v-13h6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M17 12a13 13 0 0 1 20 5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M37 17l1-4M37 17l-4-1" stroke="currentColor" stroke-width="1.4" fill="none"/>'),
  "Handheld": F('<path d="M8 10q4 -4 8 0t8 0 8 0" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 15q4 -4 8 0t8 0 8 0" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 20q4 -4 8 0t8 0 8 0" fill="none" stroke="currentColor" stroke-width="1.3"/>'),
  "Zoom": F('<circle cx="21" cy="14" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M26 19l6 6" stroke="currentColor" stroke-width="1.8"/><path d="M21 11v6M18 14h6" stroke="currentColor" stroke-width="1.3"/>'),
  "Static": F('<circle cx="24" cy="7" r="2.4" fill="none" stroke="currentColor"/><path d="M24 9v7M24 16l-7 9M24 16l7 9M18 22h12" fill="none" stroke="currentColor" stroke-width="1.4"/>'),
  "Cut": P('<rect x="4" y="7" width="18" height="16" rx="2" fill="none" stroke="currentColor"/><rect x="26" y="7" width="18" height="16" rx="2" fill="none" stroke="currentColor"/><line x1="24" y1="4" x2="24" y2="26" stroke="currentColor" stroke-width="2"/>'),
  "Fade": P('<rect x="8" y="8" width="8" height="14" fill="currentColor"/><rect x="16" y="8" width="8" height="14" fill="currentColor" opacity=".6"/><rect x="24" y="8" width="8" height="14" fill="currentColor" opacity=".3"/><rect x="32" y="8" width="8" height="14" fill="currentColor" opacity=".12"/>'),
  "Dissolve": P('<rect x="7" y="8" width="20" height="15" rx="2" fill="currentColor" opacity=".38"/><rect x="21" y="8" width="20" height="15" rx="2" fill="currentColor" opacity=".38"/>'),
  "Wipe": P('<rect x="4" y="7" width="40" height="16" rx="2" fill="none" stroke="currentColor"/><path d="M19 7l-6 16" stroke="currentColor" stroke-width="2"/><path d="M23 15h8" stroke="currentColor" stroke-width="1.4"/><path d="M28 12l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4"/>'),
  "Smash Cut": P('<rect x="4" y="7" width="18" height="16" rx="2" fill="none" stroke="currentColor"/><rect x="26" y="7" width="18" height="16" rx="2" fill="none" stroke="currentColor"/><path d="M25 4l-3 7 3 2-3 7 3 2" stroke="currentColor" stroke-width="2" fill="none"/>'),
  "Whip Pan": P('<path d="M8 10h32M6 15h34M8 20h32" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".8"/><path d="M32 15h6" stroke="currentColor" stroke-width="1.5"/><path d="M35 12l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5"/>'),
  "🤖 AI decides": P('<path d="M24 6l2.2 5.8L32 14l-5.8 2.2L24 22l-2.2-5.8L16 14l5.8-2.2z" fill="currentColor"/><circle cx="35" cy="9" r="1.4" fill="currentColor"/><circle cx="13" cy="21" r="1.4" fill="currentColor"/>'),
};

type Shot = { framing?: number; angle?: number; movement?: number; transition?: number; dur?: string; approved?: boolean };

function Opts({ list, sel, onPick }: { list: string[]; sel?: number; onPick: (i: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((o, i) => {
        const on = sel === i;
        return (
          <button key={o} onClick={() => onPick(i)} className="flex flex-col items-center gap-1.5 w-[90px] rounded-[10px] border px-1 pt-2.5 pb-1.5 transition-colors"
            style={{ borderColor: on ? ACCENT : "rgba(255,255,255,0.10)", background: on ? "rgba(236,238,242,0.12)" : "#12141a", color: on ? "#f4f5f7" : "rgba(244,245,247,0.55)" }}>
            <span dangerouslySetInnerHTML={{ __html: ICONS[o] || "" }} />
            <span className="text-[10px] font-semibold leading-tight text-center">{o}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function ShotsBuilder(_props: { structureKey: string }) {
  const [shots, setShots] = useState<Shot[]>(() => Array.from({ length: SHOTS }, () => ({ dur: "5s" })));
  const [active, setActive] = useState(0);
  const [aspect, setAspect] = useState<"v" | "h" | "b">("h");
  const [sel, setSel] = useState<FwKey[]>([]);

  useEffect(() => {
    try { const s = localStorage.getItem("mib-shots"); if (s) { const arr = JSON.parse(s); if (Array.isArray(arr) && arr.length) setShots(arr); } } catch { /* ignore */ }
    try { const f = localStorage.getItem("mib-frameworks"); if (f) setSel(JSON.parse(f)); } catch { /* ignore */ }
  }, []);

  const save = (n: Shot[]) => { setShots(n); try { localStorage.setItem("mib-shots", JSON.stringify(n)); } catch { /* ignore */ } };
  const setField = (field: keyof Shot, val: number | string | boolean) => save(shots.map((s, i) => (i === active ? { ...s, [field]: val } : s)));

  const cur = shots[active] || {};
  const approvedCount = shots.filter((s) => s.approved).length;
  const acts = [0, 1, 2].map((a) => ({ label: ACTS[a], start: a * PERACT, items: shots.map((s, i) => ({ s, i })).slice(a * PERACT, a * PERACT + PERACT) }));
  const shownFw = (sel.length ? sel : (["p", "g", "r", "t"] as FwKey[]));

  return (
    <section className="bg-background px-4 py-10">
      <div className="container mx-auto max-w-[960px]">
        <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Your movie · shots</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">Build your film, shot by shot</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-[11.5px] text-foreground/55">
          <span className="rounded-full border border-white/10 px-3 py-1"><b className="text-foreground">{shots.length}</b> shots</span>
          <span className="rounded-full border border-white/10 px-3 py-1"><b className="text-foreground">{approvedCount}</b> approved</span>
          <span className="rounded-full border border-white/10 px-3 py-1">🔒 Locked to render engine</span>
        </div>
        <div className="mt-3 text-[12px] text-foreground/55 flex items-center gap-1.5 flex-wrap">
          Building shots for:
          {shownFw.map((k) => (<span key={k} className="text-[10.5px] font-bold rounded-full px-2 py-[3px]" style={{ color: COLOR[k], backgroundColor: `${COLOR[k]}22`, border: `1px solid ${COLOR[k]}66` }}>{FNAME[k]}</span>))}
          <span className="text-foreground/30 italic">— carried over from your Beats selection</span>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-foreground/30 mb-3">① Your shots — pick one to work on</div>
          <div className="flex items-start overflow-x-auto pb-1">
            {shots.map((s, i) => (
              <div key={i} className="flex items-start">
                <button onClick={() => setActive(i)} className="relative w-[96px] h-[56px] rounded-[7px] flex items-center justify-center text-[10px] shrink-0"
                  style={{ border: i === active ? `1px solid ${ACCENT}` : "1px dashed rgba(255,255,255,0.10)", background: "#0c0e13", color: i === active ? "#f4f5f7" : "rgba(244,245,247,0.32)", boxShadow: i === active ? "0 0 0 2px rgba(236,238,242,0.25)" : "none" }}>
                  <span className="absolute top-[3px] left-[5px] text-[9px] font-extrabold text-foreground/55">{i + 1}</span>
                  {s.approved ? "✓" : "empty"}
                </button>
                {i < shots.length - 1 && <div className="w-9 h-[56px] flex items-center justify-center"><span className="w-6 h-6 rounded-full border border-white/10 bg-[#12141a] text-foreground/80 text-[12px] flex items-center justify-center">⇄</span></div>}
              </div>
            ))}
          </div>
          <input type="range" min={1} max={shots.length} value={active + 1} onChange={(e) => setActive(Number(e.target.value) - 1)} className="w-full mt-3.5" style={{ accentColor: ACCENT }} />
        </div>

        <div className="mt-2 border-t border-white/10 pt-5">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-foreground/30 mb-3">② Preview</div>
          <div className="flex gap-2 mb-3.5">
            {(["v", "h", "b"] as const).map((k) => (
              <button key={k} onClick={() => setAspect(k)} className="text-[12px] font-bold rounded-lg border px-3.5 py-2" style={{ borderColor: aspect === k ? ACCENT : "rgba(255,255,255,0.10)", background: aspect === k ? ACCENT : "#12141a", color: aspect === k ? "#0c0e13" : "rgba(244,245,247,0.55)" }}>{k === "v" ? "▯ Vertical" : k === "h" ? "▭ Horizontal" : "▯▭ Both"}</button>
            ))}
          </div>
          <div className="relative w-full max-w-[560px] mx-auto rounded-xl border border-white/10 bg-[#050609] flex flex-col items-center justify-center gap-2.5" style={{ aspectRatio: aspect === "v" ? "9/16" : aspect === "b" ? "1/1" : "16/9" }}>
            <span className="absolute top-2.5 left-3 text-[10px] font-extrabold text-foreground/55">SHOT {active + 1}</span>
            <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-[20px] pl-1" style={{ borderColor: ACCENT, color: ACCENT }}>▶</div>
            <div className="text-[12px] text-foreground/30">Your shot plays here at full size.</div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-[12px] text-foreground/55">
            <button onClick={() => setActive(Math.max(0, active - 1))} className="hover:text-foreground">‹ Prev</button>
            <span>Shot {active + 1} of {shots.length}</span>
            <span className="flex gap-1.5">
              {["Auto", "5s", "10s"].map((d) => (
                <button key={d} onClick={() => setField("dur", d)} className="rounded-md border px-2.5 py-[3px] text-[11px]" style={{ borderColor: (cur.dur || "5s") === d ? ACCENT : "rgba(255,255,255,0.10)", background: (cur.dur || "5s") === d ? ACCENT : "transparent", color: (cur.dur || "5s") === d ? "#0c0e13" : "rgba(244,245,247,0.55)", fontWeight: (cur.dur || "5s") === d ? 700 : 400 }}>{d}</button>
              ))}
            </span>
            <button onClick={() => setActive(Math.min(shots.length - 1, active + 1))} className="hover:text-foreground">Next ›</button>
          </div>
        </div>

        <div className="mt-2 border-t border-white/10 pt-5">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-foreground/30 mb-3">③ Shape shot {active + 1}</div>
          <div className="mb-4"><div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-foreground/55 mb-2">Framing</div><Opts list={framing} sel={cur.framing} onPick={(i) => setField("framing", i)} /></div>
          <div className="mb-4"><div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-foreground/55 mb-2">Angle</div><Opts list={angle} sel={cur.angle} onPick={(i) => setField("angle", i)} /></div>
          <div className="mb-4"><div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-foreground/55 mb-2">Movement</div><Opts list={movement} sel={cur.movement} onPick={(i) => setField("movement", i)} /></div>
          <div className="mb-4"><div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-foreground/55 mb-2">Transition → next shot</div><Opts list={transitions} sel={cur.transition} onPick={(i) => setField("transition", i)} /></div>
          <button onClick={() => setField("approved", !cur.approved)} className="text-[13px] font-bold rounded-lg px-5 py-2.5" style={cur.approved ? { backgroundColor: "#37b87c", color: "#04120b" } : { backgroundColor: ACCENT, color: "#0c0e13" }}>{cur.approved ? "✓ Approved — click to unapprove" : "✓ Approve this shot"}</button>
        </div>

        <div className="mt-2 border-t border-white/10 pt-5 pb-4">
          <h2 className="font-serif text-[22px] font-bold text-foreground">Big Picture — Storyboard</h2>
          <p className="text-[12px] text-foreground/55 mt-1 mb-4">Click a shot to edit it. (Reordering & per-act counts coming next.)</p>
          {acts.map((g, ai) => (
            <div key={ai} className="rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-3 mb-3">
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="font-serif font-bold text-[15px] text-foreground">{g.label}</span>
                <span className="text-[11px] text-foreground/55">{g.items.length} shots ({g.start + 1}–{g.start + g.items.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map(({ s, i }) => (
                  <button key={i} onClick={() => setActive(i)} className="relative w-[70px] h-[42px] rounded-[6px] flex items-center justify-center text-[9px]" style={{ border: i === active ? `1px solid ${ACCENT}` : "1px dashed rgba(255,255,255,0.10)", background: "#0c0e13", color: s.approved ? "#37b87c" : "rgba(244,245,247,0.32)" }}>
                    <span className="absolute top-[2px] left-1 text-[8px] font-extrabold text-foreground/55">{i + 1}</span>{s.approved ? "✓" : "empty"}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-4 flex-wrap text-[12px] text-foreground/55 mt-1"><span>Approved &amp; ready: <b className="text-foreground">{approvedCount} / {shots.length}</b></span></div>
          <div className="flex gap-3 flex-wrap mt-4">
            <button className="text-[13px] font-bold rounded-lg px-5 py-3" style={{ backgroundColor: ACCENT, color: "#0c0e13" }}>🎬 Assemble the finished film</button>
            <button className="text-[13px] font-bold rounded-lg px-5 py-3 border border-white/10 text-foreground">🎨 Continue to Thumbnails →</button>
          </div>
          <div className="text-[11.5px] text-foreground/30 italic mt-3">Only approved shots render — empty frames are skipped, so the engine never invents filler.</div>
        </div>
      </div>
    </section>
  );
}
