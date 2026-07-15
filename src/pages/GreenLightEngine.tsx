import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

type Tier = {
  to: string;
  tint: string;
  label: string;
  title: string;
  desc: string;
  examples: string;
  examplesBold?: boolean;
  linkColor: string;
};

const TIERS: Tier[] = [
  {
    to: "/green-light-engine/tier-1",
    tint: "rgba(64,188,244,0.16)",
    label: "Tier 1",
    title: "Major Streamers",
    desc: "The big leagues. Highest bar — top-tier specs and a distributor required.",
    examples: "Netflix · Amazon Prime · Hulu · Apple TV · Disney+ · Max · Peacock · Paramount+",
    examplesBold: true,
    linkColor: "#40bcf4",
  },
  {
    to: "/green-light-engine/tier-2",
    tint: "rgba(139,92,246,0.16)",
    label: "Tier 2",
    title: "Prestige & Arthouse",
    desc: "Festival-quality, curated homes. The credibility platforms for strong indie work.",
    examples: "MUBI · Criterion · Sundance Now · Shudder · IFC · BFI · Kanopy",
    linkColor: "#8b5cf6",
  },
  {
    to: "/green-light-engine/tier-3",
    tint: "rgba(0,224,84,0.16)",
    label: "Tier 3",
    title: "Open & Accessible",
    desc: "Lowest barrier — start here. Free / AVOD / DIY, many direct submissions.",
    examples: "Hook Cinema · Tubi · Roku · Pluto · Plex · Vimeo · FilmRise",
    linkColor: "#00e054",
  },
  {
    to: "/green-light-engine/niche",
    tint: "rgba(255,128,0,0.16)",
    label: "Niche & Identity",
    title: "Matched to Your Film",
    desc: "Platforms matched to your film's subject and audience.",
    examples: "Black cinema · LGBTQ+ · Horror · Documentary · Shorts",
    linkColor: "#ff8000",
  },
];

export default function GreenLightEngine() {
  return (
    <div
      style={{
        background: "#14181c",
        minHeight: "100vh",
        color: "#fff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <Seo
        title="Green Light Engine — Where to Place Your Indie Film"
        description="Match your indie film to the right streaming home: Tier 1 majors, curated platforms, low-barrier AVOD/FAST, and identity-driven niche services."
        canonical="https://filmmakergenius.com/greenlight-engine"
      />

      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "18px 22px 0",
          fontSize: 13,
          color: "#678",
        }}
      >
        <Link to="/academy" style={{ color: "#9ab1c2", textDecoration: "none" }}>
          Academy
        </Link>
        <span style={{ color: "#456" }}> › </span>
        <span>Green Light Engine</span>
      </nav>

      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 22px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#00e054",
          }}
        >
          Green Light Engine
        </div>
        <h1 style={{ fontSize: 34, margin: "12px 0 10px" }}>
          Where can your film go?
        </h1>
        <p
          style={{
            color: "#9ab1c2",
            fontSize: 16,
            maxWidth: 620,
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          Pick a tier to see the platforms your film could reach — then we walk you
          through exactly how to get there.
        </p>

        <div
          className="gle-grid-square"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 260px)",
            justifyContent: "center",
            alignItems: "start",
            gap: 18,
            textAlign: "left",
          }}
        >
          {TIERS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="gle-tile"
              style={{
                background: "#1c2228",
                border: "1px solid #2c3440",
                borderRadius: 14,
                padding: "20px 18px",
                display: "block",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 11,
                  background: t.tint,
                  marginBottom: 12,
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#678",
                  marginBottom: 4,
                }}
              >
                {t.label}
              </div>
              <h2 style={{ fontSize: 16, margin: 0, marginBottom: 6 }}>{t.title}</h2>
              <p
                style={{
                  color: "#9ab1c2",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  margin: 0,
                  marginBottom: 10,
                }}
              >
                {t.desc}
              </p>
              <p
                style={{
                  color: "#678",
                  fontSize: 12,
                  lineHeight: 1.5,
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                Examples:{" "}
                <span style={{ color: "#9ab1c2", fontWeight: t.examplesBold ? 700 : 400 }}>
                  {t.examples}
                </span>
              </p>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: t.linkColor,
                }}
              >
                See options →
              </div>
            </Link>
          ))}
        </div>
      </main>

      <style>{`
        .gle-tile:hover { border-color: #678 !important; }
        @media (max-width: 620px) { .gle-grid-square { grid-template-columns: 1fr !important; justify-content: stretch !important; } }
      `}</style>
    </div>
  );
}
