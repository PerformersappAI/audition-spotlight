import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const GOLD = "#d4a017";

type Character = { name: string; role: string; desc: string; voice: string; photos: string[] };

const ROLES = ["Lead", "Supporting", "Extra"];
const VOICE_GROUPS: { label: string; opts: [string, string][] }[] = [
  { label: "★ ElevenLabs — best for continuity", opts: [
    ["marcus", "Marcus — deep, gravelly male"],
    ["silas", "Silas — aged, wise male"],
    ["rafe", "Rafe — young, bright male"],
    ["elena", "Elena — warm, mid female"],
    ["nadia", "Nadia — commanding female"],
    ["mika", "Mika — soft, youthful"],
  ] },
  { label: "Platform voices — cheaper", opts: [
    ["gemini", "Gemini TTS — expressive neutral"],
    ["inworld", "Inworld — natural, low cost"],
    ["minimax", "MiniMax — clone-ready"],
  ] },
  { label: "Special", opts: [
    ["clone", "🎤 Clone a real actor (upload a sample)"],
    ["real", "🎬 Use real recorded audio (filmed shots)"],
    ["native", "⚙️ Engine's built-in voice (draft only)"],
  ] },
];

const LS = "mib-cast";
const blank = (): Character => ({ name: "", role: "Lead", desc: "", voice: "", photos: [] });

function fileToThumb(file: File, cb: (url: string) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const max = 320;
      let w = img.width, h = img.height;
      if (w > h && w > max) { h = (h * max) / w; w = max; }
      else if (h > max) { w = (w * max) / h; h = max; }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0, w, h);
      cb(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = (e.target?.result as string) || "";
  };
  reader.readAsDataURL(file);
}

export default function CastBuilder({ structureKey }: { structureKey: string }) {
  const [cast, setCast] = useState<Character[]>([blank()]);
  const fileRef = useRef<HTMLInputElement>(null);
  const pending = useRef<{ i: number; slot: number } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) {
          setCast(arr.map((c: Partial<Character>) => ({ ...blank(), ...c, photos: Array.isArray(c.photos) ? c.photos : [] })));
        }
      }
    } catch { /* ignore */ }
  }, []);
  useEffect(() => { try { localStorage.setItem(LS, JSON.stringify(cast)); } catch { /* ignore */ } }, [cast]);

  const update = (i: number, patch: Partial<Character>) => setCast((c) => c.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const addChar = () => setCast((c) => [...c, blank()]);
  const rm = (i: number) => setCast((c) => (c.length > 1 ? c.filter((_, idx) => idx !== i) : c));

  const pickPhoto = (i: number, slot: number) => { pending.current = { i, slot }; fileRef.current?.click(); };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const t = pending.current;
    e.target.value = "";
    if (!file || !t) return;
    fileToThumb(file, (url) => {
      setCast((c) => c.map((x, idx) => {
        if (idx !== t.i) return x;
        const p = [...x.photos];
        p[t.slot] = url;
        return { ...x, photos: p };
      }));
    });
  };
  const removePhoto = (i: number, slot: number) => setCast((c) => c.map((x, idx) => {
    if (idx !== i) return x;
    const p = [...x.photos];
    p[slot] = "";
    return { ...x, photos: p };
  }));

  const voiced = cast.filter((c) => c.voice).length;

  return (
    <section className="bg-background px-4 py-10 pb-24">
      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
      <div className="container mx-auto max-w-[900px]">
        <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Your movie · cast</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">Cast</h1>
        <p className="text-[13.5px] text-foreground/55 mt-2 max-w-[640px]">Load your characters once. Lock each one's face and voice here — every shot in the whole movie points back to this page, so a character looks and sounds the same from the first scene to the last.</p>

        <div className="mt-5 rounded-xl px-4 py-3 text-[12.5px] text-foreground/70 leading-relaxed" style={{ border: `1px solid ${GOLD}44`, background: "#1a1710" }}>
          <b style={{ color: "#f0d089" }}>Two things lock a character:</b> the <b className="text-foreground">reference photos</b> keep their face the same in every shot (Soul ID), and the <b className="text-foreground">voice</b> you pick is reused every time they speak — across every shot and every AI engine. The description is optional; it only helps the AI when you have few photos.
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {cast.map((c, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex gap-5 flex-wrap">
              {/* face lock */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <div className="flex gap-2">
                  {[0, 1, 2].map((s) => {
                    const url = c.photos[s];
                    return (
                      <div key={s} className="relative w-[52px] h-[64px] rounded-[7px] overflow-hidden" style={{ border: url ? "1px solid #2c323b" : "1px dashed #2c323b", background: url ? "#000" : "#0c0e13" }}>
                        {url ? (
                          <>
                            <img src={url} alt="reference" className="w-full h-full object-cover" />
                            <button onClick={() => removePhoto(i, s)} className="absolute top-0 right-0 bg-black/70 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-bl" title="Remove">✕</button>
                          </>
                        ) : (
                          <button onClick={() => pickPhoto(i, s)} className="w-full h-full flex items-center justify-center text-[18px] text-foreground/40 hover:text-foreground" title="Upload a photo">+</button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="text-[9.5px] text-foreground/40 text-center max-w-[132px] leading-snug">reference photos → locks the face (Soul ID)</div>
              </div>

              {/* fields */}
              <div className="flex-1 min-w-[260px]">
                <div className="flex gap-2 flex-wrap mb-2.5">
                  <input value={c.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Character name"
                    className="flex-1 min-w-[150px] bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-3 py-2 text-[15px] font-bold" />
                  <select value={c.role} onChange={(e) => update(i, { role: e.target.value })}
                    className="bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-3 py-2 text-[12px]">
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <textarea value={c.desc} onChange={(e) => update(i, { desc: e.target.value })} placeholder="Look & vibe (optional) — e.g. 'weary starship captain, late 40s'"
                  className="w-full bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-3 py-2 text-[12.5px] resize-y" style={{ minHeight: 44, fontFamily: "inherit" }} />
                <div className="flex gap-2 items-center flex-wrap mt-2.5">
                  <select value={c.voice} onChange={(e) => update(i, { voice: e.target.value })}
                    className="flex-1 min-w-[240px] bg-[#0f1116] text-foreground border rounded-lg px-3 py-2 text-[12.5px]"
                    style={{ borderColor: c.voice ? `${GOLD}66` : "rgba(255,255,255,0.1)" }}>
                    <option value="">— choose a voice —</option>
                    {VOICE_GROUPS.map((g) => (
                      <optgroup key={g.label} label={g.label}>
                        {g.opts.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                      </optgroup>
                    ))}
                  </select>
                  <button className="w-9 h-9 rounded-full border border-white/10 bg-[#161a21] text-foreground text-[12px]" title="Preview voice">▶</button>
                  {c.voice && <span className="text-[10.5px] font-bold" style={{ color: "#57d38c" }}>✓ voice locked</span>}
                </div>
                <div className="text-[11px] text-foreground/40 mt-2 leading-relaxed">
                  This voice is used every time {c.name.trim() ? c.name.trim().split(" ")[0] : "this character"} speaks — across every shot and every engine.
                </div>
              </div>

              <button onClick={() => rm(i)} className="text-[12px] text-foreground/40 hover:text-rose-400 self-start" title="Remove">✕ remove</button>
            </div>
          ))}
        </div>

        <button onClick={addChar} className="mt-4 w-full rounded-[10px] border border-dashed border-white/15 text-[13px] font-bold text-foreground/60 hover:text-[#f0d089] hover:border-[#d4a017] py-3 transition-colors">
          ＋ Add a character
        </button>

        <div className="mt-8 pt-5 border-t border-white/10 flex items-center gap-4 flex-wrap">
          <div className="text-[12px] text-foreground/55">🎬 <b className="text-foreground">{cast.length}</b> cast · 🎙️ <b className="text-foreground">{voiced}</b> voiced</div>
          <Link to={`/movie-in-a-box/${structureKey}/beats`} className="ml-auto inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13.5px] font-bold" style={{ backgroundColor: GOLD, color: "#1a1300" }}>
            Save cast → Continue to Beats →
          </Link>
        </div>
      </div>
    </section>
  );
}
