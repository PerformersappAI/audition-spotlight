import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";

type BeatContent = {
  name: string;
  sub: string;
  what: string;
  why: string;
  example: string;
};

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const STRUCTURES: Record<string, { name: string; color: string; beats: string[] }> = {
  "three-act": {
    name: "Three-Act",
    color: "#a855f7",
    beats: [
      "Ordinary World",
      "Inciting Incident",
      "First Plot Point",
      "Rising Action",
      "Midpoint",
      "Crisis / Low",
      "Climax",
      "Resolution",
    ],
  },
  "save-the-cat": {
    name: "Save the Cat",
    color: "#d4a017",
    beats: [
      "Opening",
      "Theme",
      "Setup",
      "Catalyst",
      "Debate",
      "Break 2",
      "B Story",
      "Fun & Games",
      "Midpoint",
      "Bad Guys",
      "All Is Lost",
      "Dark Night",
      "Break 3",
      "Finale",
      "Final Image",
    ],
  },
  "heros-journey": {
    name: "Hero's Journey",
    color: "#fb7185",
    beats: [
      "Ordinary",
      "Call",
      "Refusal",
      "Mentor",
      "Threshold",
      "Tests",
      "Inmost Cave",
      "Ordeal",
      "Reward",
      "Road Back",
      "Resurrection",
      "Return",
    ],
  },
  "story-circle": {
    name: "Story Circle",
    color: "#2bd1c0",
    beats: ["You", "Need", "Go", "Search", "Find", "Take", "Return", "Change"],
  },
};


const BEAT_CONTENT: Record<string, Record<string, BeatContent>> = {
  "three-act": {
    "ordinary-world": {
      name: "Ordinary World",
      sub: "Where we begin",
      what: "The hero's normal life before the story starts. We meet them as they are — their routine, their world, and the itch or lack they're quietly living with.",
      why: "You have to establish 'normal' so the audience feels it break. A strong Ordinary World makes everything that follows land harder.",
      example: "Up opens on Carl's entire married life, so we understand the grief that drives him.",
    },
    "inciting-incident": {
      name: "Inciting Incident",
      sub: "About 12% in",
      what: "The event that disrupts the balance and points the hero toward the story. Something from outside that they can't ignore.",
      why: "It's the story's starting gun — the reason there's a movie at all.",
      example: "Luke finds Leia's hidden message in R2-D2: 'Help me, Obi-Wan Kenobi.'",
    },
    "first-plot-point": {
      name: "First Plot Point",
      sub: "About 25% — the door into Act II",
      what: "The point of no return. The hero commits to the journey and the door closes behind them. The real story begins here.",
      why: "Everything before was setup. This is where the hero stops living their old life and steps into the new one.",
      example: "Luke's aunt and uncle are killed; he leaves Tatooine for good.",
    },
    "rising-action": {
      name: "Rising Action",
      sub: "The heart of Act II",
      what: "Escalating obstacles, new allies, and new enemies as the hero chases the goal. Small wins, bigger losses.",
      why: "This is where character is revealed — by how the hero handles mounting pressure.",
      example: "The cantina, hiring Han, learning the Force, and shooting out of Mos Eisley.",
    },
    midpoint: {
      name: "Midpoint",
      sub: "About 50% — the pivot",
      what: "A false victory or false defeat that raises the stakes and flips the hero from reacting to acting.",
      why: "It stops the middle from sagging. After the midpoint, the hero owns the fight.",
      example: "Rescuing Leia aboard the Death Star — a win that traps them deeper.",
    },
    "crisis-low": {
      name: "Crisis / Low Point",
      sub: "About 75%",
      what: "The big defeat. Everything the hero built collapses and the goal looks impossible.",
      why: "The deeper the fall, the more the climax means. No low point, no payoff.",
      example: "Obi-Wan is struck down; the heroes escape but are being tracked.",
    },
    climax: {
      name: "Climax",
      sub: "The final test",
      what: "The biggest confrontation — everything the hero has learned, spent in one decisive moment.",
      why: "It's the question the whole movie asked, finally answered.",
      example: "The trench run — Luke trusts the Force and destroys the Death Star.",
    },
    resolution: {
      name: "Resolution",
      sub: "The new normal",
      what: "The fallout and the new equilibrium. We see how the hero has changed — the mirror image of the opening.",
      why: "It gives the audience closure and shows the transformation was real.",
      example: "The medal ceremony — the farm boy is now a hero.",
    },
  },
  "save-the-cat": {},
  "heros-journey": {},
  "story-circle": {},
};

function titleCase(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function BeatPage() {
  const { structure = "", slug = "" } = useParams<{
    structure?: string;
    slug?: string;
  }>();

  const meta = STRUCTURES[structure] ?? { name: "Movie in a Box", color: "#d4a017", beats: [] };
  const content = BEAT_CONTENT[structure]?.[slug];
  const beatName = content?.name ?? titleCase(slug);
  const structureHref = STRUCTURES[structure]
    ? `/movie-in-a-box/${structure}/structure`
    : "/movie-in-a-box";

  return (
    <>
      <Seo
        title={`${beatName} — ${meta.name} | Movie in a Box | Filmmaker Genius`}
        description={content?.what ?? `${beatName} in the ${meta.name} structure.`}
        canonical={`https://filmmakergenius.com/movie-in-a-box/${structure}/beat/${slug}`}
        type="article"
      />

      <div className="border-b border-white/10 bg-[#0c0e13]/95">
        <div className="container mx-auto px-4 pt-3 text-sm whitespace-nowrap overflow-x-auto">
          <Link to="/movie-in-a-box" className="text-foreground/50 hover:text-foreground transition-colors">
            Movie in a Box
          </Link>
          <span className="text-foreground/30 px-2" aria-hidden="true">
            ›
          </span>
          <Link to={structureHref} className="text-foreground/50 hover:text-foreground transition-colors">
            {meta.name}
          </Link>
        </div>
      </div>

      <nav
        aria-label={`${meta.name} beats`}
        className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur"
      >
        <div className="container mx-auto px-4">
          <ul className="flex items-center overflow-x-auto py-2.5 text-sm whitespace-nowrap">
            {meta.beats.map((beat, i) => {
              const beatSlug = slugify(beat);
              const isCurrent = beatSlug === slug;
              return (
                <li key={beatSlug} className="flex items-center">
                  {i > 0 && (
                    <span className="text-foreground/25 px-1" aria-hidden="true">
                      ·
                    </span>
                  )}
                  <Link
                    to={`/movie-in-a-box/${structure}/beat/${beatSlug}`}
                    aria-current={isCurrent ? "page" : undefined}
                    className={
                      isCurrent
                        ? "inline-block rounded-md px-2.5 py-1.5 font-bold"
                        : "inline-block rounded-md px-2.5 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
                    }
                    style={isCurrent ? { color: meta.color } : undefined}
                  >
                    {beat}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      </nav>

      <section className="bg-background px-4 py-14">
        <div className="w-full max-w-[780px] mx-auto">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: meta.color }}
          >
            {beatName}
          </h1>

          {content ? (
            <>
              <p className="text-lg text-foreground/60 mt-3">{content.sub}</p>

              <div className="mt-10 space-y-8">
                <div>
                  <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/45 mb-2">
                    What it is
                  </h2>
                  <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
                    {content.what}
                  </p>
                </div>
                <div>
                  <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/45 mb-2">
                    Why it matters
                  </h2>
                  <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
                    {content.why}
                  </p>
                </div>
                <div>
                  <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/45 mb-2">
                    Example
                  </h2>
                  <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
                    {content.example}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-lg text-foreground/55 mt-4">
              We're still writing this one — check back soon.
            </p>
          )}

          <div className="mt-14">
            <Link
              to={structureHref}
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              ← Back to {meta.name}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
