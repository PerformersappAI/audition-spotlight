import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Seo from "@/components/Seo";

type FwKey = "p" | "g" | "r" | "t";
const ACCENT: Record<string, string> = {
  "three-act": "#a855f7",
  "save-the-cat": "#d4a017",
  "heros-journey": "#fb7185",
  "story-circle": "#00d4aa",
};
const STOPS: [string, string][] = [
  ["structure", "Structure"],
  ["beats", "Beats"],
  ["scene", "Scene"],
  ["shots", "Shots"],
  ["movie", "Movie"],
];
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
function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function ShotBeatPage() {
  const { structure = "three-act", beat = "" } = useParams<{ structure: string; beat: string }>();
  const accent = ACCENT[structure] || "#a855f7";
  const [fwSel, setFwSel] = useState<FwKey[]>([]);
  useEffect(() => {
    try { const f = localStorage.getItem("mib-frameworks"); if (f) setFwSel(JSON.parse(f)); } catch { /* ignore */ }
  }, []);
  const fws = fwSel.length ? fwSel : (["p", "g", "r", "t"] as FwKey[]);
  const beats = MASTER_BEATS.filter((b) => b.fw.some((k) => fws.includes(k)));
  const current = MASTER_BEATS.find((b) => slugify(b.t) === beat);
  if (!current) return <Navigate to={`/movie-in-a-box/${structure}/shots`} replace />;

  return (
    <>
      <Seo
        title={`${current.t} — Shots | Movie in a Box | Filmmaker Genius`}
        description={`Build the shots for ${current.t}.`}
        canonical={`https://filmmakergenius.com/movie-in-a-box/${structure}/shots/${beat}`}
        type="website"
      />

      <nav aria-label="Shots flow" className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto mib-noscroll py-2.5 text-sm whitespace-nowrap">
            <li>
              <Link to="/movie-in-a-box" className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors">Movie in a Box</Link>
            </li>
            <li className="text-foreground/30" aria-hidden="true">›</li>
            {STOPS.map(([key, label]) => {
              const isActive = key === "shots";
              return (
                <li key={key}>
                  <Link
                    to={`/movie-in-a-box/${structure}/${key}`}
                    aria-current={isActive ? "page" : undefined}
                    className={isActive ? "inline-block rounded-md px-3 py-1.5 font-semibold" : "inline-block rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"}
                    style={isActive ? { color: accent } : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="flex flex-wrap items-center gap-y-1 pb-3 pt-1.5 text-sm border-t border-white/5">
            <li>
              <span className="inline-flex items-center rounded-md px-3 py-1.5 font-semibold" style={{ color: accent }}>Shot Flow</span>
            </li>
            {beats.map((b) => {
              const isCur = slugify(b.t) === beat;
              return (
                <li key={b.t} className="flex items-center">
                  <span className="text-foreground/25 px-0.5" aria-hidden="true">·</span>
                  <Link
                    to={`/movie-in-a-box/${structure}/shots/${slugify(b.t)}`}
                    className="inline-block rounded-md px-2 py-1.5 text-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors"
                    style={isCur ? { color: accent, fontWeight: 700 } : undefined}
                  >
                    {b.t}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <section className="min-h-[calc(100vh-300px)] flex items-center justify-center bg-background px-4 py-20">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: accent }}>Shot workspace</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: accent }}>{current.t}</h1>
          <p className="text-foreground/50 mt-4">This page is blank for now — the shots for this beat will be built here.</p>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-foreground/40">
        Movie in a Box · Shots · {current.t}
      </footer>
    </>
  );
}
