import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Seo from "@/components/Seo";

type FwKey = "p" | "g" | "r" | "t";
const ACCENT: Record<string, string> = { "three-act": "#a855f7", "save-the-cat": "#d4a017", "heros-journey": "#fb7185", "story-circle": "#00d4aa" };
const STOPS: [string, string][] = [["structure", "Structure"], ["cast", "Cast"], ["beats", "Beats"], ["scene", "Scene"], ["shots", "Shots"], ["movie", "Movie"]];
const MASTER_BEATS: { t: string; fw: FwKey[] }[] = [
  { t: "The Ordinary World", fw: ["p", "g", "r", "t"] },
  { t: "The Theme", fw: ["g"] },
  { t: "The Need", fw: ["t"] },
  { t: "The Call", fw: ["p", "g", "r"] },
  { t: "The Refusal", fw: ["g", "r"] },
  { t: "The Mentor", fw: ["r"] },
  { t: "The Point of No Return", fw: ["p", "g", "r", "t"] },
  { t: "The Bond", fw: ["g"] },
  { t: "The Trials", fw: ["p", "g", "r", "t"] },
  { t: "The Midpoint Turn", fw: ["p", "g", "t"] },
  { t: "The Walls Close In", fw: ["g", "r"] },
  { t: "The Lowest Point", fw: ["p", "g", "r", "t"] },
  { t: "The Dark Night", fw: ["g"] },
  { t: "The Turn to the End", fw: ["g", "r", "t"] },
  { t: "The Final Test", fw: ["p", "g", "r"] },
  { t: "The Elixir", fw: ["r"] },
  { t: "The New World", fw: ["p", "g", "t"] },
];
function slugify(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

const FRAMING = ["Extreme Wide", "Wide / Establishing", "Full Shot", "Cowboy", "Medium", "Medium Close-Up", "Close-Up", "Extreme Close-Up"];
const ANGLE = ["Eye Level", "Low Angle", "High Angle", "Overhead / Bird's-Eye", "Dutch Angle", "Over-the-Shoulder", "POV"];
const MOVEMENT = ["Pan", "Tilt", "Push-In", "Tracking", "Crane / Jib", "Handheld", "Zoom", "Static"];
const TRANSITIONS = ["Cut", "Fade", "Dissolve", "Wipe", "Smash Cut", "Whip Pan", "🤖 AI decides"];

const FR = `<rect x="1.5" y="1.5" width="45" height="27" rx="3.5" fill="none" stroke="rgba(255,255,255,.22)"/>`;
const F = (i: string) => `<svg viewBox="0 0 48 30" width="46" height="29" style="overflow:hidden">${FR}${i}</svg>`;
const P = (i: string) => `<svg viewBox="0 0 48 30" width="46" height="29" style="overflow:hidden">${i}</svg>`;
const ICONS: Record<string, string> = {
  "Extreme Wide": F(`<line x1="6" y1="23" x2="42" y2="23" stroke="rgba(255,255,255,.16)"/><circle cx="24" cy="18.5" r="1.6" fill="currentColor"/><path d="M22.9 20.2h2.2l.5 3h-3.2z" fill="currentColor"/>`),
  "Wide / Establishing": F(`<circle cx="24" cy="11.5" r="2.4" fill="currentColor"/><path d="M21.6 14.2h4.8l.9 10h-6.6z" fill="currentColor"/>`),
  "Full Shot": F(`<circle cx="24" cy="7" r="3" fill="currentColor"/><path d="M20.5 10.5h7l1.2 15h-9.4z" fill="currentColor"/>`),
  "Cowboy": F(`<circle cx="24" cy="7.5" r="3.6" fill="currentColor"/><path d="M18.6 12h10.8l1.6 19h-14z" fill="currentColor"/>`),
  "Medium": F(`<circle cx="24" cy="9" r="4.6" fill="currentColor"/><path d="M15.5 14.5h17l2.2 17h-21.4z" fill="currentColor"/>`),
  "Medium Close-Up": F(`<circle cx="24" cy="11" r="6.4" fill="currentColor"/><path d="M12.5 19h23l3 13h-29z" fill="currentColor"/>`),
  "Close-Up": F(`<circle cx="24" cy="16" r="10.5" fill="currentColor"/>`),
  "Extreme Close-Up": F(`<circle cx="24" cy="15" r="16" fill="currentColor" opacity=".22"/><ellipse cx="17.5" cy="15" rx="3.2" ry="2.2" fill="currentColor"/><ellipse cx="30.5" cy="15" rx="3.2" ry="2.2" fill="currentColor"/>`),
  "Eye Level": F(`<circle cx="31" cy="10" r="2.6" fill="currentColor"/><path d="M28.4 13h5.2l1 12h-7.2z" fill="currentColor"/><path d="M7 16h11" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M16 13.5l3 2.5-3 2.5" fill="currentColor"/>`),
  "Low Angle": F(`<circle cx="31" cy="10" r="2.6" fill="currentColor"/><path d="M28.4 13h5.2l1 12h-7.2z" fill="currentColor"/><path d="M8 25l10-8" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M18 17l-3 .5 1.7 2.5z" fill="currentColor"/>`),
  "High Angle": F(`<circle cx="31" cy="12" r="2.6" fill="currentColor"/><path d="M28.4 15h5.2l1 10h-7.2z" fill="currentColor"/><path d="M8 6l10 8" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M18 14l-3-.5 1.7-2.5z" fill="currentColor"/>`),
  "Overhead / Bird's-Eye": F(`<path d="M24 4v13" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M21.6 14l2.4 4 2.4-4z" fill="currentColor"/><ellipse cx="24" cy="24" rx="6" ry="3.2" fill="none" stroke="currentColor"/><circle cx="24" cy="24" r="1.6" fill="currentColor"/>`),
  "Dutch Angle": F(`<g transform="rotate(-16 24 16)"><circle cx="24" cy="10" r="3" fill="currentColor"/><path d="M20.5 13.5h7l1 12h-9z" fill="currentColor"/><line x1="8" y1="22" x2="40" y2="22" stroke="currentColor" opacity=".5"/></g>`),
  "Over-the-Shoulder": F(`<path d="M3 30c0-9 7-13 13-13v13z" fill="currentColor" opacity=".5"/><circle cx="33" cy="11" r="3" fill="currentColor"/><path d="M29.5 14.5h7l1 10h-9z" fill="currentColor"/>`),
  "POV": F(`<path d="M7 7h6M7 7v6M41 7h-6M41 7v6M7 23h6M7 23v-6M41 23h-6M41 23v-6" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="24" cy="15" r="3.4" fill="none" stroke="currentColor"/><circle cx="24" cy="15" r="1.3" fill="currentColor"/>`),
  "Pan": F(`<path d="M11 15h26" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M14 11.5l-4 3.5 4 3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M34 11.5l4 3.5-4 3.5" fill="none" stroke="currentColor" stroke-width="1.6"/>`),
  "Tilt": F(`<path d="M24 7v16" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M20.5 10l3.5-4 3.5 4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M20.5 20l3.5 4 3.5-4" fill="none" stroke="currentColor" stroke-width="1.6"/>`),
  "Push-In": F(`<rect x="15" y="9" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-dasharray="3 2"/><path d="M6 15h6" stroke="currentColor" stroke-width="1.4"/><path d="M12 12l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M42 15h-6" stroke="currentColor" stroke-width="1.4"/><path d="M36 12l-3 3 3 3" fill="none" stroke="currentColor" stroke-width="1.4"/>`),
  "Tracking": F(`<line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" stroke-dasharray="3 3"/><rect x="9" y="11" width="10" height="8" rx="1.5" fill="none" stroke="currentColor"/><path d="M24 15h12" stroke="currentColor" stroke-width="1.4"/><path d="M33 12l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4"/>`),
  "Crane / Jib": F(`<circle cx="11" cy="25" r="2" fill="currentColor"/><path d="M11 25v-13h6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M17 12a13 13 0 0 1 20 5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M37 17l1-4M37 17l-4-1" stroke="currentColor" stroke-width="1.4" fill="none"/>`),
  "Handheld": F(`<path d="M8 10q4 -4 8 0t8 0 8 0" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 15q4 -4 8 0t8 0 8 0" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 20q4 -4 8 0t8 0 8 0" fill="none" stroke="currentColor" stroke-width="1.3"/>`),
  "Zoom": F(`<circle cx="21" cy="14" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M26 19l6 6" stroke="currentColor" stroke-width="1.8"/><path d="M21 11v6M18 14h6" stroke="currentColor" stroke-width="1.3"/>`),
  "Static": F(`<circle cx="24" cy="7" r="2.4" fill="none" stroke="currentColor"/><path d="M24 9v7M24 16l-7 9M24 16l7 9M18 22h12" fill="none" stroke="currentColor" stroke-width="1.4"/>`),
  "Cut": P(`<rect x="4" y="7" width="18" height="16" rx="2" fill="none" stroke="currentColor"/><rect x="26" y="7" width="18" height="16" rx="2" fill="none" stroke="currentColor"/><line x1="24" y1="4" x2="24" y2="26" stroke="currentColor" stroke-width="2"/>`),
  "Fade": P(`<rect x="8" y="8" width="8" height="14" fill="currentColor"/><rect x="16" y="8" width="8" height="14" fill="currentColor" opacity=".6"/><rect x="24" y="8" width="8" height="14" fill="currentColor" opacity=".3"/><rect x="32" y="8" width="8" height="14" fill="currentColor" opacity=".12"/>`),
  "Dissolve": P(`<rect x="7" y="8" width="20" height="15" rx="2" fill="currentColor" opacity=".38"/><rect x="21" y="8" width="20" height="15" rx="2" fill="currentColor" opacity=".38"/>`),
  "Wipe": P(`<rect x="4" y="7" width="40" height="16" rx="2" fill="none" stroke="currentColor"/><path d="M19 7l-6 16" stroke="currentColor" stroke-width="2"/><path d="M23 15h8" stroke="currentColor" stroke-width="1.4"/><path d="M28 12l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4"/>`),
  "Smash Cut": P(`<rect x="4" y="7" width="18" height="16" rx="2" fill="none" stroke="currentColor"/><rect x="26" y="7" width="18" height="16" rx="2" fill="none" stroke="currentColor"/><path d="M25 4l-3 7 3 2-3 7 3 2" stroke="currentColor" stroke-width="2" fill="none"/>`),
  "Whip Pan": P(`<path d="M8 10h32M6 15h34M8 20h32" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".8"/><path d="M32 15h6" stroke="currentColor" stroke-width="1.5"/><path d="M35 12l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5"/>`),
  "🤖 AI decides": P(`<path d="M24 6l2.2 5.8L32 14l-5.8 2.2L24 22l-2.2-5.8L16 14l5.8-2.2z" fill="currentColor"/><circle cx="35" cy="9" r="1.4" fill="currentColor"/><circle cx="13" cy="21" r="1.4" fill="currentColor"/>`),
};

type Shot = { framing: number; angle: number; movement: number; transition: number };
const DEFAULT_SHOT: Shot = { framing: 4, angle: 0, movement: 7, transition: 0 };
const initialShots = () => Array.from({ length: 4 }, () => ({ ...DEFAULT_SHOT }));

function Picker({ list, sel, onPick, accent }: { list: string[]; sel: number; onPick: (i: number) => void; accent: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((o, i) => {
        const on = i === sel;
        return (
          <button key={o} onClick={() => onPick(i)} className="flex flex-col items-center gap-1.5 w-[90px] px-1 py-2.5 rounded-[10px] border transition-colors" style={on ? { background: "rgba(255,255,255,0.10)", borderColor: accent, color: "#f4f5f7" } : { background: "#12141a", borderColor: "rgba(255,255,255,0.10)", color: "rgba(244,245,247,0.55)" }}>
            <span className="block h-[29px]" dangerouslySetInnerHTML={{ __html: ICONS[o] || "" }} />
            <span className="text-[10px] font-semibold leading-tight text-center">{o}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function ShotBeatPage() {
  const { structure = "three-act", beat = "" } = useParams<{ structure: string; beat: string }>();
  const accent = ACCENT[structure] || "#a855f7";
  const [fwSel, setFwSel] = useState<FwKey[]>([]);
  const [full, setFull] = useState<Record<string, Shot[]>>({});
  const [active, setActive] = useState(0);
  const [aspect, setAspect] = useState<"V" | "H" | "B">("H");
  const [dur, setDur] = useState("5s");

  useEffect(() => {
    try { const f = localStorage.getItem("mib-frameworks"); setFwSel(f ? JSON.parse(f) : []); } catch { /* ignore */ }
    try { const s = localStorage.getItem("mib-shots"); setFull(s ? JSON.parse(s) : {}); } catch { /* ignore */ }
  }, []);

  const fws = fwSel.length ? fwSel : (["p", "g", "r", "t"] as FwKey[]);
  const flowBeats = MASTER_BEATS.filter((b) => b.fw.some((k) => fws.includes(k)));
  const current = MASTER_BEATS.find((b) => slugify(b.t) === beat);
  if (!current) return <Navigate to={`/movie-in-a-box/${structure}/shots`} replace />;

  const shots = full[beat] || initialShots();
  const a = Math.min(active, shots.length - 1);
  const shot = shots[a] || DEFAULT_SHOT;
  const persist = (arr: Shot[]) => { const next = { ...full, [beat]: arr }; setFull(next); try { localStorage.setItem("mib-shots", JSON.stringify(next)); } catch { /* ignore */ } };
  const setField = (field: keyof Shot, val: number) => { const arr = shots.map((s, i) => (i === a ? { ...s, [field]: val } : s)); persist(arr); };
  const addShot = () => { persist([...shots, { ...DEFAULT_SHOT }]); setActive(shots.length); };
  const removeShot = (i: number) => { if (shots.length <= 1) return; const arr = shots.filter((_, j) => j !== i); persist(arr); setActive(Math.max(0, Math.min(a, arr.length - 1))); };

  return (
    <>
      <Seo title={`${current.t} — Shots | Movie in a Box | Filmmaker Genius`} description={`Build the shots for ${current.t}.`} canonical={`https://filmmakergenius.com/movie-in-a-box/${structure}/shots/${beat}`} type="website" />

      <nav aria-label="Shots flow" className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto mib-noscroll py-2.5 text-sm whitespace-nowrap">
            <li><Link to="/movie-in-a-box" className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors">Movie in a Box</Link></li>
            <li className="text-foreground/30" aria-hidden="true">›</li>
            {STOPS.map(([key, label]) => { const isActive = key === "shots"; return (
              <li key={key}><Link to={`/movie-in-a-box/${structure}/${key}`} aria-current={isActive ? "page" : undefined} className={isActive ? "inline-block rounded-md px-3 py-1.5 font-semibold" : "inline-block rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"} style={isActive ? { color: accent } : undefined}>{label}</Link></li>
            ); })}
          </ul>
          <ul className="flex flex-wrap items-center gap-y-1 pb-3 pt-1.5 text-sm border-t border-white/5">
            <li><span className="inline-flex items-center rounded-md px-3 py-1.5 font-semibold" style={{ color: accent }}>Shot Flow</span></li>
            {flowBeats.map((b) => { const isCur = slugify(b.t) === beat; return (
              <li key={b.t} className="flex items-center">
                <span className="text-foreground/25 px-0.5" aria-hidden="true">·</span>
                <Link to={`/movie-in-a-box/${structure}/shots/${slugify(b.t)}`} className="inline-block rounded-md px-2 py-1.5 text-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors" style={isCur ? { color: accent, fontWeight: 700 } : undefined}>{b.t}</Link>
              </li>
            ); })}
          </ul>
        </div>
      </nav>

      <section className="bg-background px-4 py-8 pb-24">
        <div className="container mx-auto max-w-[960px]">
          <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Your movie · shots</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-1.5 text-foreground">{current.t}</h1>
          <div className="flex gap-2.5 flex-wrap text-[11.5px] text-foreground/55 mt-3">
            <span className="rounded-full border border-white/10 px-2.5 py-1"><b className="text-foreground">{shots.length}</b> shots in this scene</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1">clip length <b className="text-foreground">{dur}</b></span>
          </div>

          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="text-[10.5px] font-extrabold tracking-[0.16em] uppercase text-foreground/35 mb-3">① Your shots — pick one to work on</div>
            <div className="flex items-start gap-0 overflow-x-auto pb-1">
              {shots.map((s, i) => (
                <div key={i} className="flex items-center">
                  <button onClick={() => setActive(i)} className="relative w-[96px] h-[56px] rounded-[7px] flex items-center justify-center text-[10px] flex-none" style={i === a ? { border: `1px solid ${accent}`, boxShadow: `0 0 0 2px ${accent}44`, background: "#0c0e13", color: "#f4f5f7" } : { border: "1px dashed rgba(255,255,255,0.14)", background: "#0c0e13", color: "rgba(244,245,247,0.34)" }}>
                    <span className="absolute top-[3px] left-[5px] text-[9px] font-extrabold text-foreground/55">{i + 1}</span>
                    {FRAMING[s.framing].split(" ")[0]}
                  </button>
                  {i < shots.length - 1 && <div className="w-9 h-[56px] flex items-center justify-center flex-none"><span className="w-6 h-6 rounded-full border border-white/10 bg-[#12141a] text-foreground text-[12px] flex items-center justify-center" dangerouslySetInnerHTML={{ __html: ICONS[TRANSITIONS[s.transition]] ? "⇄" : "⇄" }} /></div>}
                </div>
              ))}
              <div className="flex items-center"><button onClick={addShot} className="ml-3 w-[96px] h-[56px] rounded-[7px] border border-dashed flex items-center justify-center text-[12px] font-bold flex-none" style={{ borderColor: accent, color: accent }}>＋ Add</button></div>
            </div>
          </div>

          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="text-[10.5px] font-extrabold tracking-[0.16em] uppercase text-foreground/35 mb-3">② Preview</div>
            <div className="flex gap-2 mb-3.5">
              {([["V", "▯ Vertical"], ["H", "▭ Horizontal"], ["B", "▯▭ Both"]] as [typeof aspect, string][]).map(([k, l]) => (
                <button key={k} onClick={() => setAspect(k)} className="text-[12px] font-bold px-3.5 py-2 rounded-lg border" style={aspect === k ? { background: accent, color: "#0c0e13", borderColor: accent } : { background: "#12141a", color: "rgba(244,245,247,0.55)", borderColor: "rgba(255,255,255,0.10)" }}>{l}</button>
              ))}
            </div>
            <div className="w-full max-w-[560px] mx-auto rounded-xl border border-white/10 bg-[#050609] flex flex-col items-center justify-center gap-2.5 relative" style={{ aspectRatio: aspect === "V" ? "9/16" : "16/9", maxHeight: aspect === "V" ? 420 : undefined }}>
              <span className="absolute top-2.5 left-3 text-[10px] font-extrabold text-foreground/55">SHOT {a + 1} · {aspect === "V" ? "9:16" : aspect === "B" ? "16:9 + 9:16" : "16:9"}</span>
              <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-[20px] pl-1" style={{ borderColor: accent, color: accent }}>▶</div>
              <div className="text-foreground/35 text-[12px]">{FRAMING[shot.framing]} · {ANGLE[shot.angle]} · {MOVEMENT[shot.movement]}</div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-[12px] text-foreground/55">
              <button onClick={() => setActive(Math.max(0, a - 1))} className="hover:text-foreground">‹ Prev</button>
              <span>Shot {a + 1} of {shots.length}</span>
              <span className="flex gap-1.5">{["Auto", "5s", "10s"].map((d) => (<button key={d} onClick={() => setDur(d)} className="border rounded-md px-2.5 py-[3px] text-[11px]" style={dur === d ? { background: accent, color: "#0c0e13", borderColor: accent, fontWeight: 700 } : { borderColor: "rgba(255,255,255,0.10)" }}>{d}</button>))}</span>
              <button onClick={() => setActive(Math.min(shots.length - 1, a + 1))} className="hover:text-foreground">Next ›</button>
            </div>
          </div>

          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="text-[10.5px] font-extrabold tracking-[0.16em] uppercase text-foreground/35 mb-3">③ Shape the shot</div>
            <div className="mb-4"><div className="text-[11px] font-extrabold tracking-wide uppercase text-foreground/55 mb-2">Framing</div><Picker list={FRAMING} sel={shot.framing} onPick={(i) => setField("framing", i)} accent={accent} /></div>
            <div className="mb-4"><div className="text-[11px] font-extrabold tracking-wide uppercase text-foreground/55 mb-2">Angle</div><Picker list={ANGLE} sel={shot.angle} onPick={(i) => setField("angle", i)} accent={accent} /></div>
            <div className="mb-4"><div className="text-[11px] font-extrabold tracking-wide uppercase text-foreground/55 mb-2">Movement</div><Picker list={MOVEMENT} sel={shot.movement} onPick={(i) => setField("movement", i)} accent={accent} /></div>
            <div className="mb-2"><div className="text-[11px] font-extrabold tracking-wide uppercase text-foreground/55 mb-2">Transition → next shot</div><Picker list={TRANSITIONS} sel={shot.transition} onPick={(i) => setField("transition", i)} accent={accent} /></div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <h2 className="font-serif text-[22px] font-bold text-foreground">This scene's storyboard</h2>
            <p className="text-[12px] text-foreground/55 mt-1 mb-3">Every shot in {current.t}, in order. Click one to edit it above.</p>
            <div className="flex flex-wrap gap-2">
              {shots.map((s, i) => (
                <button key={i} onClick={() => setActive(i)} className="relative w-[80px] h-[48px] rounded-md flex items-center justify-center text-[9px] text-foreground/40" style={i === a ? { border: `1px solid ${accent}`, background: "#0c0e13" } : { border: "1px dashed rgba(255,255,255,0.12)", background: "#0c0e13" }}>
                  <span className="absolute top-[2px] left-[4px] text-[8px] font-extrabold text-foreground/55">{i + 1}</span>
                  {FRAMING[s.framing].split(" ")[0]}
                  <span onClick={(e) => { e.stopPropagation(); removeShot(i); }} className="absolute top-[1px] right-[3px] text-foreground/30 hover:text-foreground/80 text-[10px]">✕</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap mt-5">
              <button className="text-[13px] font-bold rounded-lg px-5 py-3 text-[#0c0e13]" style={{ background: accent }}>🎬 Assemble the finished film</button>
              <Link to={`/movie-in-a-box/${structure}/scene/${beat}`} className="text-[13px] font-bold rounded-lg px-5 py-3 border border-white/15 text-foreground">← Back to this scene</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-foreground/40">Movie in a Box · Shots · {current.t}</footer>
    </>
  );
}
