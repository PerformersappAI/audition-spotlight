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

      <nav
        aria-label="Movie in a Box breadcrumb"
        className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur"
      >
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-2.5 text-sm whitespace-nowrap">
            <li>
              <Link
                to="/movie-in-a-box"
                className="inline-flex items-center rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                Movie in a Box
              </Link>
            </li>
            <li className="text-foreground/30" aria-hidden="true">›</li>
            <li>
              <Link
                to="/movie-in-a-box/compare"
                className="inline-flex items-center rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                Compare
              </Link>
            </li>
            <li className="text-foreground/30" aria-hidden="true">›</li>
            <li>
              <span className="inline-block rounded-md px-3 py-1.5 font-semibold text-foreground">
                {movie.title}
              </span>
            </li>
          </ul>
        </div>
      </nav>

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
