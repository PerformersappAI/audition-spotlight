import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#d4a017";

type Character = { name: string; role: string; desc: string; voice: string; photos: string[] };
type Voice = { id: string; name: string; category: string };

const ROLES = ["Lead", "Supporting", "Extra"];
const LS = "mib-cast";
const blank = (): Character => ({ name: "", role: "Lead", desc: "", voice: "", photos: [] });

const CAT_ORDER = ["professional", "cloned", "generated", "premade"];
const CAT_LABEL: Record<string, string> = {
  professional: "★ Your professional voices",
  cloned: "Your cloned voices",
  generated: "Your generated voices",
  premade: "ElevenLabs library",
};

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
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [voicesErr, setVoicesErr] = useState("");
  const [playing, setPlaying] = useState<number | null>(null);

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

  useEffect(() => {
    (async () => {
      setVoicesLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("elevenlabs-voice", { body: { action: "list" } });
        if (error) throw error;
        const payload = data as { voices?: Voice[]; error?: string } | null;
        if (payload?.error) throw new Error(payload.error);
        const vs = payload?.voices;
        if (Array.isArray(vs)) setVoices(vs);
        else throw new Error("No voices. Raw: " + JSON.stringify(payload).slice(0, 300));
      } catch (e) {
        setVoicesErr(e instanceof Error ? e.message : "Could not load voices");
      } finally {
        setVoicesLoading(false);
      }
    })();
  }, []);

  const update = (i: number, patch: Partial<Character>) => setCast((c) => c.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const addChar = () => setCast((c) => [...c, blank()]);
  const rm = (i: number) => setCast((c) => (c.length > 1 ? c.filter((_, idx) => idx !== i) : c));

  const pickPhoto = (i: number, slot: number) => { pending.current = { i, slot }; fileRef.current?.click(); };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const t = pending.current;
    e.target.value = "";
    if (!file || !t) return;
    fileToThumb(file, (url) => setCast((c) => c.map((x, idx) => {
      if (idx !== t.i) return x;
      const p = [...x.photos]; p[t.slot] = url; return { ...x, photos: p };
    })));
  };
  const removePhoto = (i: number, slot: number) => setCast((c) => c.map((x, idx) => {
    if (idx !== i) return x;
    const p = [...x.photos]; p[slot] = ""; return { ...x, photos: p };
  }));

  const playPreview = async (i: number) => {
    const v = cast[i].voice;
    if (!v || playing !== null) return;
    setPlaying(i);
    try {
      const first = cast[i].name.trim() ? cast[i].name.trim().split(" ")[0] : "";
      const line = first ? `Hi, I'm ${first}. This is how I'll sound in your movie.` : "Hello. This is how I'll sound in your movie.";
      const { data, error } = await supabase.functions.invoke("elevenlabs-voice", { body: { action: "tts", voiceId: v, text: line } });
      if (error) throw error;
      const payload = data as { audio?: string; error?: string } | null;
      if (payload?.error) throw new Error(payload.error);
      const url = payload?.audio;
      if (url) { const audio = new Audio(url); await audio.play(); }
    } catch (e) {
      setVoicesErr(e instanceof Error ? e.message : "Preview failed");
    } finally {
      setPlaying(null);
    }
  };

  const grouped: Record<string, Voice[]> = {};
  voices.forEach((v) => { (grouped[v.category] ||= []).push(v); });
  const orderedCats = [...CAT_ORDER.filter((c) => grouped[c]), ...Object.keys(grouped).filter((c) => !CAT_ORDER.includes(c))];
  const voiceName = (id: string) => voices.find((v) => v.id === id)?.name || "";

  const voiced = cast.filter((c) => c.voice).length;

  return (
    <section className="bg-background px-4 py-10 pb-24">
      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
      <div className="container mx-auto max-w-[900px]">
        <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Your movie · cast</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">Cast</h1>
        <p className="text-[13.5px] text-foreground/55 mt-2 max-w-[640px]">Load your characters once. Lock each one's face and voice here — every shot in the whole movie points back to this page, so a character looks and sounds the same from the first scene to the last.</p>

        <div className="mt-5 rounded-xl px-4 py-3 text-[12.5px] text-foreground/70 leading-relaxed" style={{ border: `1px solid ${GOLD}44`, background: "#1a1710" }}>
          <b style={{ color: "#f0d089" }}>Two things lock a character:</b> the <b className="text-foreground">reference photos</b> keep their face the same in every shot (Soul ID), and the <b className="text-foreground">voice</b> you pick is reused every time they speak. Voices are live from your ElevenLabs account — hit ▶ to hear one.
        </div>

        {voicesErr && (
          <div className="mt-3 rounded-lg px-3 py-2 text-[11.5px]" style={{ border: "1px solid #7a2b2b", background: "#2a1414", color: "#ff9a9a" }}>Voice error: {voicesErr}</div>
        )}

        <div className="mt-6 flex flex-col gap-4">
          {cast.map((c, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex gap-5 flex-wrap">
              <div className="flex flex-col gap-2 flex-shrink-0">
                <div className="flex gap-2.5 flex-wrap">
                  {[0, 1, 2].map((s) => {
                    const url = c.photos[s];
                    return (
                      <div
                        key={s}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (!file || !file.type.startsWith("image/")) return;
                          fileToThumb(file, (u) => setCast((cs) => cs.map((x, idx) => {
                            if (idx !== i) return x;
                            const p = [...x.photos]; p[s] = u; return { ...x, photos: p };
                          })));
                        }}
                        className="relative w-[112px] h-[188px] rounded-[10px] overflow-hidden"
                        style={{ border: url ? "1px solid #2c323b" : "1px dashed #3a414c", background: url ? "#000" : "#0c0e13" }}
                      >
                        {url ? (
                          <>
                            <img src={url} alt="reference" className="w-full h-full object-cover" />
                            <button onClick={() => removePhoto(i, s)} className="absolute top-1 right-1 bg-black/70 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-md" title="Remove">✕</button>
                          </>
                        ) : (
                          <button onClick={() => pickPhoto(i, s)} className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-foreground/45 hover:text-foreground" title="Upload a photo">
                            <span className="text-[30px] leading-none">＋</span>
                            <span className="text-[10.5px] font-semibold">Upload</span>
                            <span className="text-[9px] text-foreground/30">or drag a photo</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="text-[10px] text-foreground/40 max-w-[360px] leading-snug">Reference photos → these lock the character's face (Soul ID). Add a front, 3/4, and side angle for the strongest match.</div>
              </div>

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
                  <select value={c.voice} onChange={(e) => update(i, { voice: e.target.value })} disabled={voicesLoading}
                    className="flex-1 min-w-[240px] bg-[#0f1116] text-foreground border rounded-lg px-3 py-2 text-[12.5px]"
                    style={{ borderColor: c.voice ? `${GOLD}66` : "rgba(255,255,255,0.1)" }}>
                    <option value="">{voicesLoading ? "Loading your voices…" : "— choose a voice —"}</option>
                    {orderedCats.map((cat) => (
                      <optgroup key={cat} label={CAT_LABEL[cat] || cat}>
                        {grouped[cat].map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </optgroup>
                    ))}
                  </select>
                  <button onClick={() => playPreview(i)} disabled={!c.voice || playing !== null} className="w-9 h-9 rounded-full border border-white/10 bg-[#161a21] text-foreground text-[12px] disabled:opacity-40" title="Preview voice">{playing === i ? "…" : "▶"}</button>
                  {c.voice && <span className="text-[10.5px] font-bold" style={{ color: "#57d38c" }}>✓ {voiceName(c.voice) || "voice locked"}</span>}
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
