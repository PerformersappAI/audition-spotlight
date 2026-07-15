import { Link } from "react-router-dom";
import ToolTopBar from "@/components/ToolTopBar";
import Seo from "@/components/Seo";
import { toast } from "sonner";
import horizontalAsset from "@/assets/recut-horizontal.webp.asset.json";
import verticalAsset from "@/assets/recut-vertical.webp.asset.json";

const TEAL = "#00d4aa";

function FilmFrame() {
  const dots = Array.from({ length: 10 });
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          width: 240,
          height: 135,
          border: "1px solid rgba(0,212,170,0.35)",
          boxShadow: "0 0 40px -20px rgba(0,212,170,0.5)",
        }}
      >
        <img
          src={horizontalAsset.url}
          alt="Feature film frame"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover" }}
        />
      </div>
      <p className="text-xs uppercase tracking-widest text-neutral-400">
        Your feature · 16:9
      </p>
    </div>
  );
}

function PhoneFrame() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative"
        style={{
          width: 90,
          height: 180,
          borderRadius: 22,
          background:
            "linear-gradient(180deg, rgba(0,212,170,0.14) 0%, rgba(20,24,28,0.95) 60%, rgba(10,10,18,1) 100%)",
          border: "1.5px solid rgba(0,212,170,0.5)",
          boxShadow: "0 0 40px -15px rgba(0,212,170,0.6)",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 top-1.5 rounded-full bg-black"
          style={{ width: 32, height: 6 }}
        />
      </div>
      <p className="text-xs uppercase tracking-widest text-neutral-400">
        6 vertical shorts · 9:16
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center gap-2 px-2">
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: TEAL }}
      >
        AI Recut
      </span>
      <svg width="64" height="20" viewBox="0 0 64 20" fill="none">
        <path
          d="M2 10 H56 M50 4 L58 10 L50 16"
          stroke={TEAL}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function StepCard({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="text-center px-2">
      <div
        className="mx-auto mb-4 flex items-center justify-center rounded-full font-semibold"
        style={{
          width: 44,
          height: 44,
          background: "rgba(0,212,170,0.12)",
          border: `1px solid ${TEAL}`,
          color: TEAL,
          fontFamily: "'Fraunces', serif",
        }}
      >
        {n}
      </div>
      <h3
        className="text-lg font-semibold text-white mb-2"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {title}
      </h3>
      <p className="text-sm text-neutral-400 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function Recut() {
  const handleBrowse = () => {
    toast("Recut is coming soon — the AI upload flow will land here.");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a12" }}>
      <Seo
        title="Recut — Turn Your Film Into Vertical Shorts | Filmmaker Genius"
        description="Recut gives your movie a second life as vertical shorts. Upload your feature or short, let AI reframe and cut it into native 9:16 episodics, then publish to a brand-new audience."
        canonical="https://filmmakergenius.com/recut"
        type="website"
      />
      <ToolTopBar />

      <main className="mx-auto px-6 py-14" style={{ maxWidth: 900, fontFamily: "'Inter Tight', sans-serif" }}>
        {/* Hero */}
        <div className="text-center">
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
            style={{ background: TEAL, color: "#0a0a12" }}
          >
            New · AI
          </span>
          <h1
            className="mt-5 text-white"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 40,
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Recut
          </h1>
          <p className="mt-4 text-neutral-400" style={{ fontSize: 18 }}>
            Give your movie a second life as vertical shorts.
          </p>
        </div>

        {/* Diagram */}
        <div
          className="mt-12 rounded-2xl p-8"
          style={{
            background: "#14181c",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
            <FilmFrame />
            <Arrow />
            <PhoneFrame />
          </div>
        </div>

        {/* Steps */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            n={1}
            title="Upload your film"
            desc="Add a feature or a short you already made — the one that never quite found its audience."
          />
          <StepCard
            n={2}
            title="AI re-edits it"
            desc="Recut turns it into native vertical episodics — reframed, captioned, and cut into bite-size pieces."
          />
          <StepCard
            n={3}
            title="You approve & publish"
            desc="Review the cuts, tweak what you want, and release them to a brand-new vertical audience."
          />
        </div>

        {/* Upload zone */}
        <div className="mt-14 flex flex-col items-center">
          <div
            className="w-full rounded-2xl px-6 py-12 text-center"
            style={{
              maxWidth: 560,
              border: `2px dashed ${TEAL}`,
              background:
                "linear-gradient(180deg, rgba(0,212,170,0.06) 0%, rgba(0,212,170,0.02) 100%)",
            }}
          >
            <p
              className="text-white font-semibold"
              style={{ fontSize: 18, fontFamily: "'Fraunces', serif" }}
            >
              Drop your film here to start
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              MP4 or MOV · your feature or short · we handle the encoding
            </p>
            <button
              onClick={handleBrowse}
              className="mt-6 inline-flex items-center rounded-md px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: TEAL, color: "#0a0a12" }}
            >
              Browse files
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-neutral-400 max-w-xl">
            Free to try. Upload, run the AI, and preview your vertical shorts with no
            account. To download or post the finished shorts,{" "}
            <Link
              to="/membership"
              className="underline underline-offset-4"
              style={{ color: TEAL }}
            >
              upgrade your Filmmaker Genius membership
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
