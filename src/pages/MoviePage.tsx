import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";

function Oscar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size * 2} viewBox="0 0 12 24" aria-hidden="true" style={{ display: "block" }}>
      <g fill="#e7c04a">
        <circle cx="6" cy="3" r="2" />
        <path d="M4.6 5.2h2.8l1 6.6a6 6 0 0 1-4.8 0z" />
        <rect x="4.4" y="12.2" width="3.2" height="6.4" rx="0.6" />
        <rect x="2.6" y="18.6" width="6.8" height="1.8" rx="0.5" />
        <rect x="1.8" y="20.4" width="8.4" height="2.4" rx="0.6" />
      </g>
    </svg>
  );
}

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
    beats: ["Ordinary", "Call", "Refusal", "Mentor", "Threshold", "Tests", "Inmost Cave", "Ordeal", "Reward", "Road Back", "Resurrection", "Return"],
  },
  "story-circle": {
    name: "Story Circle",
    color: "#2bd1c0",
    beats: ["You", "Need", "Go", "Search", "Find", "Take", "Return", "Change"],
  },
};

const MOVIE_TO_STRUCTURE: Record<string, string> = {
  "the-godfather": "three-act",
  "the-silence-of-the-lambs": "save-the-cat",
  gladiator: "heros-journey",
  "forrest-gump": "story-circle",
};

const MOVIES: Record<
  string,
  { title: string; structureName: string; color: string; oscars: number; oscarLabel: string }
> = {
  "the-godfather": {
    title: "The Godfather",
    structureName: "Three-Act",
    color: "#a855f7",
    oscars: 2,
    oscarLabel: "Best Screenplay · Best Picture",
  },
  "the-silence-of-the-lambs": {
    title: "The Silence of the Lambs",
    structureName: "Save the Cat",
    color: "#d4a017",
    oscars: 2,
    oscarLabel: "Best Screenplay · Best Picture",
  },
  gladiator: {
    title: "Gladiator",
    structureName: "Hero's Journey",
    color: "#fb7185",
    oscars: 1,
    oscarLabel: "Best Picture",
  },
  "forrest-gump": {
    title: "Forrest Gump",
    structureName: "Story Circle",
    color: "#2bd1c0",
    oscars: 2,
    oscarLabel: "Best Screenplay · Best Picture",
  },
};

export default function MoviePage() {
  const { slug = "" } = useParams();
  const movie = MOVIES[slug];
  const structureKey = MOVIE_TO_STRUCTURE[slug];
  const structure = STRUCTURES[structureKey];

  if (!movie) {
    return (
      <section className="bg-background px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Movie not found</h1>
        <Link to="/movie-in-a-box/compare" className="mt-4 inline-block text-sm text-foreground/60 hover:text-foreground">
          Back to Compare
        </Link>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={`${movie.title} | Movie in a Box`}
        description={`How ${movie.title} maps to the ${movie.structureName} structure, beat by beat.`}
        canonical={`https://filmmakergenius.com/movie-in-a-box/movie/${slug}`}
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
          <Link
            to={structure ? `/movie-in-a-box/${structureKey}/structure` : "/movie-in-a-box"}
            className="text-foreground/50 hover:text-foreground transition-colors"
          >
            {structure?.name ?? movie.structureName}
          </Link>
          <span className="text-foreground/30 px-2" aria-hidden="true">
            ›
          </span>
          <span className="font-semibold text-foreground">{movie.title}</span>
        </div>
      </div>

      {structure && (
        <nav
          aria-label={`${structure.name} beats`}
          className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur"
        >
          <div className="container mx-auto px-4">
            <ul className="flex items-center overflow-x-auto py-2.5 text-sm whitespace-nowrap">
              {structure.beats.map((beat, i) => {
                const beatSlug = slugify(beat);
                return (
                  <li key={beatSlug} className="flex items-center">
                    {i > 0 && (
                      <span className="text-foreground/25 px-1" aria-hidden="true">
                        ·
                      </span>
                    )}
                    <Link
                      to={`/movie-in-a-box/${structureKey}/beat/${beatSlug}`}
                      className="inline-block rounded-md px-2.5 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
                    >
                      {beat}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}


      <section className="bg-background px-4 py-20">
        <div className="container mx-auto flex flex-col items-center text-center">
          <div
            className="rounded-lg border border-dashed border-white/25 bg-black/40"
            style={{ width: 120, height: 176 }}
          />

          <h1 className="mt-8 text-4xl font-bold tracking-tight" style={{ color: movie.color }}>
            {movie.title}
          </h1>

          <span
            className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]"
            style={{
              color: movie.color,
              backgroundColor: `${movie.color}1e`,
              border: `1px solid ${movie.color}59`,
            }}
          >
            Represents: {movie.structureName}
          </span>

          <div className="mt-6 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: movie.oscars }).map((_, i) => (
                <Oscar key={i} />
              ))}
            </div>
            <span className="text-xs text-foreground/50">{movie.oscarLabel}</span>
          </div>

          <p className="mt-10 max-w-[620px] text-sm text-foreground/50 leading-relaxed">
            A full film-class breakdown — overview, characters, and how it maps to {movie.structureName},
            beat by beat — is coming soon.
          </p>
        </div>
      </section>
    </>
  );
}
