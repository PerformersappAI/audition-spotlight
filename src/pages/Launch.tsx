import { useEffect } from "react";

const TEAL = "#00d4aa";

export default function Launch() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <section className="flex-1 flex items-center justify-center px-4 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <p
            className="text-sm font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: TEAL }}
          >
            Filmmaker Genius
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
            Launch
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
            Your film's launch command center — coming together.
          </p>
        </div>
      </section>
    </div>
  );
}
