import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Seo from "@/components/Seo";

export default function CompareStructures() {
  return (
    <>
      <Seo
        title="Compare All Four | Movie in a Box | Filmmaker Genius"
        description="The same story through every lens."
        canonical="https://filmmakergenius.com/movie-in-a-box/compare"
        type="website"
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
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Movie in a Box</span>
              </Link>
            </li>
            <li className="text-foreground/30" aria-hidden="true">
              ›
            </li>
            <li>
              <span className="inline-block rounded-md px-3 py-1.5 font-semibold text-foreground">
                Compare
              </span>
            </li>
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

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Compare all four
          </h1>
          <p className="text-lg text-foreground/60 mt-4">
            The same story through every lens.
          </p>

          <div className="mt-10 rounded-xl bg-[#161a21] border border-white/15 p-12 text-foreground/40 text-sm">
            The side-by-side comparison will live here.
          </div>
        </div>
      </section>
    </>
  );
}
