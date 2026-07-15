import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

type Theme = "edu" | "money" | "greenlight" | "roberts";

const THEMES: Record<Theme, { grad: string; accent: string; badgeBg: string; badgeBorder: string }> = {
  edu: {
    grad: "linear-gradient(135deg, #120a25 0%, #1e1040 100%)",
    accent: "#a78bfa",
    badgeBg: "rgba(139,92,246,0.12)",
    badgeBorder: "rgba(139,92,246,0.25)",
  },
  money: {
    grad: "linear-gradient(135deg, #1a1200 0%, #2d2000 100%)",
    accent: "#fbbf24",
    badgeBg: "rgba(251,191,36,0.12)",
    badgeBorder: "rgba(251,191,36,0.25)",
  },
  greenlight: {
    grad: "linear-gradient(135deg, #06200f 0%, #0a3318 100%)",
    accent: "#00e054",
    badgeBg: "rgba(0,224,84,0.14)",
    badgeBorder: "rgba(0,224,84,0.3)",
  },
  roberts: {
    grad: "linear-gradient(135deg, #200707 0%, #3a0d0d 100%)",
    accent: "#f87171",
    badgeBg: "rgba(239,68,68,0.14)",
    badgeBorder: "rgba(239,68,68,0.3)",
  },
};

const OVERLAY = "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)";

type Tile = { title: string; to: string; theme: Theme; badge?: string; sub?: string; featured?: boolean };

type Group = {
  key: string;
  label: string;
  tabs: string[]; // which tabs include this group
  cols: 1 | 3;
  tiles: Tile[];
};

const GROUPS: Group[] = [
  {
    key: "education",
    label: "Education",
    tabs: ["All", "Education"],
    cols: 1,
    tiles: [{
      title: "Education Modules",
      to: "/academy/education",
      theme: "edu",
      badge: "Modules",
      sub: "62 courses · Every stage of production",
      featured: true,
    }],
  },
  {
    key: "monetization",
    label: "Monetization",
    tabs: ["All", "Monetization"],
    cols: 3,
    tiles: [
      { title: "Aggregators", to: "/academy/aggregators", theme: "money", badge: "Distribution" },
      { title: "Distributors", to: "/academy/distributors", theme: "money", badge: "Distribution" },
      { title: "Video On Demand", to: "/academy/vod", theme: "money", badge: "Distribution" },
    ],
  },
  {
    key: "greenlight",
    label: "Distribution Engine",
    tabs: ["All"],
    cols: 1,
    tiles: [{
      title: "Green Light Engine",
      to: "/green-light-engine",
      theme: "greenlight",
      badge: "Distribution",
      sub: "See exactly where your film can go — and how to get there",
      featured: true,
    }],
  },
  {
    key: "roberts",
    label: "Roberts' Filmmaking",
    tabs: ["All", "Roberts' Filmmaking"],
    cols: 1,
    tiles: [{
      title: "Filmmaking by Will Roberts",
      to: "/academy/roberts-filmmaking",
      theme: "roberts",
      badge: "Free Ebook",
      sub: "17 chapters · Idea to distribution",
      featured: true,
    }],
  },
];

const TABS = ["All", "Roberts' Filmmaking", "Monetization", "Education"];

function TileCard({ tile }: { tile: Tile }) {
  const [hover, setHover] = useState(false);
  const t = THEMES[tile.theme];
  const featured = !!tile.featured;

  return (
    <Link
      to={tile.to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        minHeight: featured ? 260 : 200,
        border: `1px solid ${hover ? t.accent : "rgba(255,255,255,0.08)"}`,
        background: t.grad,
        cursor: "pointer",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.25s, border-color 0.25s",
        textDecoration: "none",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: OVERLAY, pointerEvents: "none" }} />
      {tile.badge && (
        <span style={{
          position: "absolute", top: 18, left: 20,
          fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
          padding: "4px 10px", borderRadius: 9999, color: t.accent,
          background: t.badgeBg, border: `1px solid ${t.badgeBorder}`,
        }}>{tile.badge}</span>
      )}
      {tile.sub && (
        <div style={{
          position: "absolute",
          left: featured ? 32 : 24,
          bottom: featured ? 68 : 48,
          fontSize: featured ? 14 : 13,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "'Inter Tight', sans-serif",
        }}>{tile.sub}</div>
      )}
      <div style={{
        position: "absolute",
        left: featured ? 32 : 24,
        bottom: featured ? 32 : 22,
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: featured ? 28 : 20,
        fontWeight: 700,
        color: "#fff",
        textShadow: "0 2px 20px rgba(0,0,0,0.9)",
      }}>{tile.title}</div>
      <div style={{
        position: "absolute", bottom: 20, right: 22,
        fontSize: 18, color: t.accent,
        opacity: hover ? 1 : 0, transition: "opacity 0.2s",
      }}>→</div>
    </Link>
  );
}

export default function Academy() {
  const [active, setActive] = useState("All");
  const visibleGroups = GROUPS.filter((g) => g.tabs.includes(active));
  const showLabels = active === "All";

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', sans-serif" }}>
      <Seo
        title="Academy — 62 Free Courses for Indie Filmmakers | Filmmaker Genius"
        description="Filmmaker Genius Academy: 62 free courses covering screenwriting, directing, producing, cinematography, editing, sound, distribution, and monetization."
        canonical="https://filmmakergenius.com/academy"
      />
      <style>{`
        .ac-h1 { font-size: 52px; }
        @media (min-width: 768px) { .ac-h1 { font-size: 68px; } }
        .ac-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .ac-grid-1 { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (max-width: 900px) { .ac-grid-3 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .ac-grid-3 { grid-template-columns: 1fr; } }
        .ac-tab:hover { border-color: rgba(0,212,170,0.4) !important; color: #fff !important; }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        {/* HERO */}
        <div style={{ textAlign: "center", padding: "72px 0 48px" }}>
          <h1 className="ac-h1" style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 700, lineHeight: 1.05, margin: 0,
          }}>Academy</h1>
          <p style={{
            marginTop: 16, fontSize: 17, color: "rgba(255,255,255,0.55)",
          }}>Ebooks, distribution guides, and education modules for independent filmmakers</p>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40, justifyContent: "center" }}>
          {TABS.map((tab) => {
            const isActive = tab === active;
            return (
              <button
                key={tab}
                className={isActive ? "" : "ac-tab"}
                onClick={() => setActive(tab)}
                style={{
                  background: isActive ? "rgba(0,212,170,0.12)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(0,212,170,0.5)" : "rgba(255,255,255,0.18)"}`,
                  color: isActive ? "#00d4aa" : "rgba(255,255,255,0.6)",
                  padding: "8px 20px",
                  borderRadius: 9999,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >{tab}</button>
            );
          })}
        </div>

        {/* GROUPS */}
        <div style={{ paddingBottom: 80 }}>
          {visibleGroups.map((g) => (
            <div key={g.key} style={{ marginBottom: 48 }}>
              {showLabels && (
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}>{g.label}</span>
                  <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                </div>
              )}
              <div className={g.cols === 3 ? "ac-grid-3" : "ac-grid-1"}>
                {g.tiles.map((t) => <TileCard key={t.title} tile={t} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
