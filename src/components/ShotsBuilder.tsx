type FwKey = "p" | "g" | "r" | "t";
const COLOR: Record<FwKey, string> = { p: "#a855f7", g: "#d4a017", r: "#fb7185", t: "#2bd1c0" };
const FW: { key: FwKey; name: string }[] = [
  { key: "p", name: "Three-Act" },
  { key: "g", name: "Save the Cat" },
  { key: "r", name: "Hero's Journey" },
  { key: "t", name: "Story Circle" },
];

type Beat = { t: string; act: 1 | 2 | 3; fw: Partial<Record<FwKey, string>> };
const ACTS: Record<1 | 2 | 3, string> = { 1: "Act I — Setup", 2: "Act II — Confrontation", 3: "Act III — Resolution" };

const M: Beat[] = [
  { t: "The Ordinary World", act: 1, fw: { p: "Ordinary World", g: "Opening / Set-Up", r: "Ordinary World", t: "You" } },
  { t: "The Theme", act: 1, fw: { g: "Theme Stated" } },
  { t: "The Need", act: 1, fw: { t: "Need" } },
  { t: "The Call", act: 1, fw: { p: "Inciting Incident", g: "Catalyst", r: "Call to Adventure" } },
  { t: "The Refusal", act: 1, fw: { g: "Debate", r: "Refusal of the Call" } },
  { t: "The Mentor", act: 1, fw: { r: "Meeting the Mentor" } },
  { t: "The Point of No Return", act: 1, fw: { p: "First Plot Point", g: "Break into Two", r: "Crossing the Threshold", t: "Go" } },
  { t: "The Bond", act: 2, fw: { g: "B Story" } },
  { t: "The Trials", act: 2, fw: { p: "Rising Action", g: "Fun & Games", r: "Tests, Allies, Enemies", t: "Search" } },
  { t: "The Midpoint Turn", act: 2, fw: { p: "Midpoint", g: "Midpoint", t: "Find" } },
  { t: "The Walls Close In", act: 2, fw: { g: "Bad Guys Close In", r: "Approach the Inmost Cave" } },
  { t: "The Lowest Point", act: 2, fw: { p: "Crisis / Low Point", g: "All Is Lost", r: "The Ordeal", t: "Take" } },
  { t: "The Dark Night", act: 2, fw: { g: "Dark Night of the Soul" } },
  { t: "The Turn to the End", act: 2, fw: { g: "Break into Three", r: "Reward / Road Back", t: "Return" } },
  { t: "The Final Test", act: 3, fw: { p: "Climax", g: "Finale", r: "Resurrection" } },
  { t: "The Elixir", act: 3, fw: { r: "Return with the Elixir" } },
  { t: "The New World", act: 3, fw: { p: "Resolution", g: "Final Image", t: "Change" } },
];

export default function ShotsBuilder({ sel, onToggle }: { structureKey: string; sel: FwKey[]; onToggle: (k: FwKey) => void }) {
  const fws = sel.length ? sel : (["p", "g", "r", "t"] as FwKey[]);
  const visible = M.filter((b) => fws.some((k) => b.fw[k]));
  const acts = ([1, 2, 3] as const).map((a) => ({ a, items: visible.filter((v) => v.act === a) })).filter((g) => g.items.length > 0);

  return (
    <section className="bg-background px-4 py-10">
      <div className="container mx-auto max-w-[900px]">
        <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Your movie · shots</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">Shots</h1>
        <p className="text-[13.5px] text-foreground/55 mt-2 max-w-[620px]">Pick the framework(s) you are building with. The beats you will create shots for appear below — and they drive the Shot Flow bar up top.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {FW.map((f) => {
            const on = fws.includes(f.key);
            const c = COLOR[f.key];
            return (
              <button
                key={f.key}
                onClick={() => onToggle(f.key)}
                className="rounded-full px-4 py-2 text-[13px] font-bold border flex items-center gap-2 transition-colors"
                style={{ borderColor: on ? c : "rgba(255,255,255,0.12)", background: on ? `${c}1e` : "transparent", color: on ? "#f4f5f7" : "rgba(244,245,247,0.55)" }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                {f.name}
              </button>
            );
          })}
        </div>
        <div className="mt-2 text-[11.5px] text-foreground/40">{sel.length ? `${sel.length} selected` : "Showing all four combined"}</div>

        <div className="mt-4">
          {acts.map((g) => (
            <div key={g.a} className="mt-7">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-serif text-[20px] sm:text-[24px] font-bold text-foreground whitespace-nowrap">{ACTS[g.a]}</h2>
                <span className="flex-1 h-px bg-white/12" />
              </div>
              <div className="flex flex-col gap-2">
                {g.items.map((b, i) => {
                  const chips = fws.filter((k) => b.fw[k]);
                  return (
                    <div key={b.t + i} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                      <div className="text-[14px] font-bold text-foreground">{b.t}</div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {chips.map((k) => (
                          <span key={k} className="text-[10px] font-bold rounded-full px-2 py-[3px]" style={{ color: COLOR[k], backgroundColor: `${COLOR[k]}1f`, border: `1px solid ${COLOR[k]}55` }}>{b.fw[k]}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
