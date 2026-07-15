import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import fgLogo from "@/assets/filmmaker-genius-logo.png";
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
  aspect: "16/9" | "16/10" | "tall";
  className?: string;
}) => {
  const ratioStyle =
    aspect === "tall"
      ? { height: "100%", minHeight: 300 }
      : { aspectRatio: aspect === "16/9" ? "16 / 9" : "16 / 10" };

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
        <h3
          className="text-white font-bold"
          style={{ fontFamily: "'Inter Tight', Inter, sans-serif", fontSize: 22 }}
        >
          {card.title}
        </h3>
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
      <section className="flex flex-col items-center" style={{ padding: "0 24px 44px" }}>
        <img
          src={fgLogo}
          alt="Filmmaker Genius logo"
          width={1151}
          height={320}
          decoding="async"
          {...({ fetchpriority: "high" } as any)}
          className="h-auto"
          style={{ width: "88%", maxWidth: 580, marginTop: 40 }}
        />
        <h1
          className="text-white text-center"
          style={{
            textTransform: "uppercase",
            fontWeight: 300,
            letterSpacing: "0.14em",
            fontSize: 42,
            marginTop: 60,
            lineHeight: 1.15,
          }}
        >
          Every Tool You Need — One Place.
        </h1>
      </section>

      {/* TOOL GRID */}
      <section style={{ background: "#050505", padding: "44px 24px 72px" }}>
        <div className="mx-auto" style={{ maxWidth: 1040 }}>
          {/* Bento: left = two 16:9 stacked; right = tall Pitch Deck */}
          <div className="grid grid-cols-1 min-[960px]:grid-cols-[1fr_337px] gap-[14px]">
            <div className="flex flex-col gap-[14px]">
              <ToolCard card={sceneAnalysis} aspect="16/9" />
              <ToolCard card={storyboard} aspect="16/9" />
            </div>
            <ToolCard card={pitchDeck} aspect="tall" className="h-full" />
          </div>

          {/* Row 2: 3-column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px] mt-[14px]">
            <ToolCard card={callSheet} aspect="16/10" />
            <ToolCard card={auditions} aspect="16/10" />
            <ToolCard card={crewHire} aspect="16/10" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeMarketing;
