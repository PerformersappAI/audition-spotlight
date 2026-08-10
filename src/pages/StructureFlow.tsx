import { Link } from "react-router-dom";
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

export default function StructureFlow({
  structureKey,
}: {
  structureKey: StructureKey;
}) {
  const { title, accent, subtitle } = CONFIG[structureKey];

  return (
    <>
      <Seo
        title={`${title} | Movie in a Box | Filmmaker Genius`}
        description={subtitle}
        canonical={`https://filmmakergenius.com/movie-in-a-box/${structureKey}`}
        type="website"
      />
      <section className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-background px-4 py-16">
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
            {title}
          </h1>
          <p className="text-lg text-foreground/60 mt-4">{subtitle}</p>

          <div
            className="mt-10 rounded-xl bg-[#161a21] p-12 text-foreground/40 text-sm"
            style={{ border: `1px solid ${accent}40` }}
          >
            Your step-by-step assembly line will live here.
          </div>
        </div>
      </section>
    </>
  );
}
