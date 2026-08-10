import { Link, useParams, Navigate } from "react-router-dom";
import { Home } from "lucide-react";
import Seo from "@/components/Seo";

export type StructureKey =
  | "save-the-cat"
  | "three-act"
  | "heros-journey"
  | "story-circle";

const CONFIG: Record<
  StructureKey,
  { title: string; accent: string; subtitle: string }
> = {
  "save-the-cat": {
    title: "Save the Cat",
    accent: "#d4a017",
    subtitle: "Fifteen beats, one at a time.",
  },
  "three-act": {
    title: "Three-Act",
    accent: "#a855f7",
    subtitle: "Beginning, middle, end.",
  },
  "heros-journey": {
    title: "Hero's Journey",
    accent: "#fb7185",
    subtitle: "The mythic path, stage by stage.",
  },
  "story-circle": {
    title: "Story Circle",
    accent: "#00d4aa",
    subtitle: "Eight steps around the circle.",
  },
};

const STOPS = [
  { key: "structure", label: "Structure" },
  { key: "beats", label: "Beats" },
  { key: "scene", label: "Scene" },
  { key: "shots", label: "Shots" },
  { key: "movie", label: "Movie" },
] as const;

type StopKey = (typeof STOPS)[number]["key"];

export default function StructureFlow({
  structureKey,
}: {
  structureKey: StructureKey;
}) {
  const { title, accent, subtitle } = CONFIG[structureKey];
  const { stop } = useParams<{ stop?: string }>();

  if (!stop || !STOPS.some((s) => s.key === stop)) {
    return <Navigate to={`/movie-in-a-box/${structureKey}/structure`} replace />;
  }

  const activeStop = stop as StopKey;
  const stopLabel = STOPS.find((s) => s.key === activeStop)!.label;

  return (
    <>
      <Seo
        title={`${title} — ${stopLabel} | Movie in a Box | Filmmaker Genius`}
        description={subtitle}
        canonical={`https://filmmakergenius.com/movie-in-a-box/${structureKey}/${activeStop}`}
        type="website"
      />

      <nav
        aria-label={`${title} flow`}
        className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur"
      >
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-2.5 text-sm whitespace-nowrap">
            {STOPS.map((s) => {
              const isActive = s.key === activeStop;
              const label =
                s.key === "beats" ? `Beats (${title})` : s.label;
              return (
                <li key={s.key}>
                  <Link
                    to={`/movie-in-a-box/${structureKey}/${s.key}`}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      isActive
                        ? "inline-block rounded-md px-3 py-1.5 font-semibold"
                        : "inline-block rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
                    }
                    style={isActive ? { color: accent } : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <section className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-[780px] mx-auto text-center">
          <Link
            to="/movie-in-a-box"
            className="inline-block text-sm text-foreground/50 hover:text-foreground transition-colors mb-8"
          >
            ← Back to Movie in a Box
          </Link>

          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: accent }}
          >
            {title} — {stopLabel}
          </h1>
          <p className="text-lg text-foreground/60 mt-4">
            This stop will hold your {stopLabel.toLowerCase()} — coming next.
          </p>
        </div>
      </section>
    </>
  );
}
