import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

import imgSceneAnalysis from "@/assets/tool-script-analysis-new.webp";
import imgStoryboard from "@/assets/tool-storyboard.webp";
import imgPitchDeck from "@/assets/tool-pitch-deck-new.webp";
import imgCallSheet from "@/assets/tool-call-sheet.webp";
import imgAuditions from "@/assets/tool-auditions.webp";
import imgCrewHire from "@/assets/tool-crew-hire.webp";

const TEAL = "#00d4aa";

type Card = {
  title: string;
  to: string;
  cta: string;
  img: string;
};

const CtaPill = ({ label }: { label: string }) => (
  <span
    className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
    style={{ color: TEAL, borderColor: `${TEAL}66` }}
  >
    {label}
  </span>
);

const ToolCard = ({
  card,
  aspect,
  className = "",
}: {
  card: Card;
  aspect: "16/9" | "16/10" | "32/9" | "tall";
  className?: string;
}) => {
  const ratioStyle =
    aspect === "tall"
      ? { height: "100%", minHeight: 300 }
      : { aspectRatio: aspect === "32/9" ? "32 / 9" : aspect === "16/9" ? "16 / 9" : "16 / 10" };

  return (
    <Link
      to={card.to}
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-[#111] border transition-all duration-200 hover:-translate-y-1 ${className}`}
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = TEAL)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    >
      <div className="w-full overflow-hidden flex-1" style={ratioStyle}>
        <img
          src={card.img}
          alt={`${card.title} tool screenshot`}
          width={800}
          height={aspect === "tall" ? 1200 : 450}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderTopColor: "rgba(255,255,255,0.06)" }}>
        <h2
          className="text-white font-bold"
          style={{ fontFamily: "'Inter Tight', Inter, sans-serif", fontSize: 22 }}
        >
          {card.title}
        </h2>
        <CtaPill label={card.cta} />
      </div>
    </Link>
  );
};

const HomeMarketing = () => {
  const sceneAnalysis: Card = { title: "Scene Analysis", to: "/scene-analysis", cta: "Let's Go", img: imgSceneAnalysis };
  const storyboard: Card = { title: "Storyboard Generator", to: "/storyboarding", cta: "Visualize", img: imgStoryboard };
  const pitchDeck: Card = { title: "Pitch Deck Maker", to: "/pitch-deck", cta: "Create", img: imgPitchDeck };
  const callSheet: Card = { title: "Call Sheet Generator", to: "/call-sheet", cta: "Build", img: imgCallSheet };
  const auditions: Card = { title: "Auditions", to: "/upload-auditions", cta: "Post", img: imgAuditions };
  const crewHire: Card = { title: "Crew Hire", to: "/crew-hire", cta: "Hire", img: imgCrewHire };

  return (
    <div style={{ background: "#000" }} className="min-h-screen">
      <Seo
        title="Filmmaker Genius — AI Tools & Training for Indie Film"
        description="AI tools and step-by-step training for indie filmmakers — script and scene analysis, storyboards, pitch decks, funding, distribution, and a full academy."
        canonical="https://filmmakergenius.com/"
        type="website"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Filmmaker Genius",
            url: "https://filmmakergenius.com/",
            logo: "https://filmmakergenius.com/og-image.jpg",
            description:
              "AI tools and training for indie filmmakers — script analysis, storyboards, pitch decks, funding, distribution, and academy courses.",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Filmmaker Genius",
            url: "https://filmmakergenius.com/",
          },
        ]}
      />
      {/* HERO */}
      <section className="flex flex-col items-center" style={{ padding: "72px 24px 44px" }}>
        <h1
          className="text-center"
          style={{
            fontFamily: "'Archivo Black', 'Inter Tight', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            fontSize: "clamp(34px, 7vw, 76px)",
            lineHeight: 1.05,
            background: "linear-gradient(180deg, #ffffff 0%, #e6e8ec 38%, #9aa0a8 62%, #f2f4f7 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Production Company in a Box
        </h1>
        <p
          className="text-center"
          style={{
            fontFamily: "'Archivo Black', 'Inter Tight', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            fontSize: "clamp(28px, 4.4vw, 44px)",
            marginTop: 28,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          Shoot. <span style={{ color: "#d4a84c" }}>Fund.</span> Release.
        </p>
      </section>


      {/* TOOL GRID */}
      <section style={{ background: "#050505", padding: "44px 24px 72px" }}>
        <div className="mx-auto" style={{ maxWidth: 1040 }}>
          {/* Bento: left = two 16/9 stacked; right = three cards stretching to match left height */}
          <div className="grid grid-cols-1 min-[960px]:grid-cols-[1fr_337px] gap-[14px] items-stretch">
            <div className="flex flex-col gap-[14px]">
              <ToolCard card={sceneAnalysis} aspect="16/9" />
              <ToolCard card={storyboard} aspect="16/9" />
            </div>
            <div className="flex flex-col gap-[14px] h-full">
              <div className="flex-1 [&>a>div:first-child]:!min-h-0">
                <ToolCard card={callSheet} aspect="tall" className="h-full" />
              </div>
              <div className="flex-1 [&>a>div:first-child]:!min-h-0">
                <ToolCard card={auditions} aspect="tall" className="h-full" />
              </div>
              <div className="flex-1 [&>a>div:first-child]:!min-h-0">
                <ToolCard card={crewHire} aspect="tall" className="h-full" />
              </div>
            </div>
          </div>

          {/* Row 2: two rows of half-width 16/9 Pitch Deck boxes */}
          <div className="mt-[14px] flex flex-col gap-[14px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              <ToolCard card={pitchDeck} aspect="16/9" />
              <ToolCard card={pitchDeck} aspect="16/9" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              <ToolCard card={pitchDeck} aspect="16/9" />
              <ToolCard card={pitchDeck} aspect="16/9" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeMarketing;
