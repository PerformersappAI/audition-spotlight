import Seo from "@/components/Seo";

export default function MovieInABox() {
  return (
    <>
      <Seo
        title="Movie in a Box | Filmmaker Genius"
        description="Coming soon — your guided path from idea to finished film."
        canonical="https://filmmakergenius.com/movie-in-a-box"
        type="website"
      />
      <section className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-background text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Movie in a Box
          </h1>
          <p className="text-lg text-white/60">
            Coming soon — your guided path from idea to finished film.
          </p>
        </div>
      </section>
    </>
  );
}
