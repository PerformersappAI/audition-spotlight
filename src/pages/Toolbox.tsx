import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

type Theme = "teal" | "gold" | "violet" | "rose" | "emerald" | "red";

const THEMES: Record<Theme, { grad: string; accent: string }> = {
  teal: { grad: "linear-gradient(135deg, #071820 0%, #0a2a30 100%)", accent: "#00d4aa" },
  gold: { grad: "linear-gradient(135deg, #1a1200 0%, #2d2000 100%)", accent: "#fbbf24" },
  violet: { grad: "linear-gradient(135deg, #120a25 0%, #1e1040 100%)", accent: "#a78bfa" },
  rose: { grad: "linear-gradient(135deg, #1a0808 0%, #2d1212 100%)", accent: "#fda4af" },
  emerald: { grad: "linear-gradient(135deg, #071a10 0%, #0a2d1a 100%)", accent: "#6ee7b7" },
  red: { grad: "linear-gradient(135deg, #2a0709 0%, #4a0d12 100%)", accent: "#ff4954" },
};

const OVERLAY = "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)";

type Tool = { title: string; to: string; theme: Theme; badge?: string; special?: boolean };

type Group = {
  key: string;
  label: string;
  rows: { cols: number; tools: Tool[] }[];
};

const GROUPS: Group[] = [
  {
    key: "Script & Story",
    label: "Script & Story",
    rows: [{ cols: 3, tools: [
      { title: "Scene Analysis", to: "/scene-analysis", theme: "teal" },
      { title: "Storyboard Generator", to: "/storyboarding", theme: "teal" },
      { title: "Table Read", to: "/table-read", theme: "teal" },
    ]}],
  },
  {
    key: "Funding & Pitch",
    label: "Funding & Pitch",
    rows: [{ cols: 2, tools: [
      { title: "Funding Strategy", to: "/funding-strategy", theme: "gold" },
      { title: "Pitch Deck Maker", to: "/pitch-deck", theme: "gold" },
    ]}],
  },
  {
    key: "Production Office",
    label: "Production Office",
    rows: [
      { cols: 3, tools: [
        { title: "Calendar", to: "/calendar", theme: "violet" },
        { title: "Call Sheet Generator", to: "/call-sheet", theme: "violet" },
        { title: "Project Intake Form", to: "/submit", theme: "violet" },
      ]},
      { cols: 2, tools: [
        { title: "Contract Assistant", to: "/contract-assistant", theme: "violet" },
        { title: "Document Library", to: "/library", theme: "violet" },
      ]},
    ],
  },
  {
    key: "Cast & Crew",
    label: "Cast & Crew",
    rows: [{ cols: 2, tools: [
      { title: "Auditions", to: "/upload-auditions", theme: "rose" },
      { title: "Crew Hire", to: "/crew-hire", theme: "rose" },
    ]}],
  },
  {
    key: "Distribution",
    label: "Distribution",
    rows: [{ cols: 2, tools: [
      { title: "Distribution Readiness Assessment", to: "/distribution-readiness", theme: "emerald" },
      { title: "Recut", to: "#", theme: "red", badge: "New · AI", special: true },
    ]}],
  },
];

const TABS = ["All Tools", "Script & Story", "Production Office", "Cast & Crew", "Distribution", "Funding & Pitch"];

function ToolCard({ tool }: { tool: Tool }) {
  const [hover, setHover] = useState(false);
  const t = THEMES[tool.theme];
  const isRed = tool.special;

  const borderColor = hover
    ? t.accent
    : isRed
    ? "rgba(239,68,68,0.55)"
    : "rgba(255,255,255,0.08)";

  const boxShadow = isRed
    ? hover
      ? "0 0 0 1px rgba(255,73,84,0.5), 0 12px 44px rgba(225,29,42,0.6)"
      : undefined
    : undefined;

  const inner = (
    <>
      <div style={{ position: "absolute", inset: 0, background: OVERLAY, pointerEvents: "none" }} />
      {tool.badge && (
        <span style={{
          position: "absolute", top: 18, left: 20,
          fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
          padding: "4px 10px", borderRadius: 9999, color: "#fff",
          background: "#e11d2a", boxShadow: "0 0 20px rgba(225,29,42,0.7)",
        }}>{tool.badge}</span>
      )}
      <div style={{
        position: "absolute", bottom: 22, left: 24,
        fontFamily: "'Inter Tight', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff",
        textShadow: "0 2px 20px rgba(0,0,0,0.9)",
      }}>{tool.title}</div>
      <div style={{
        position: "absolute", bottom: 20, right: 22,
        fontSize: 18, color: isRed ? "#ff4954" : t.accent,
        opacity: hover ? 1 : 0, transition: "opacity 0.2s",
      }}>→</div>
    </>
  );

  const style: React.CSSProperties = {
    display: "block",
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    minHeight: 200,
    border: `1px solid ${borderColor}`,
    background: t.grad,
    cursor: "pointer",
    transform: hover ? "translateY(-4px)" : "translateY(0)",
    transition: "transform 0.25s, border-color 0.25s, box-shadow 0.4s",
    boxShadow,
    textDecoration: "none",
    ...(isRed ? { animation: "recutPulse 3s ease-in-out infinite" } : {}),
  };

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  if (tool.to === "#") {
    return <a href="#" style={style} {...handlers}>{inner}</a>;
  }
  if (/^https?:\/\//.test(tool.to)) {
    return <a href={tool.to} target="_blank" rel="noopener noreferrer" style={style} {...handlers}>{inner}</a>;
  }
  return <Link to={tool.to} style={style} {...handlers}>{inner}</Link>;
}


export default function Toolbox() {
  const [active, setActive] = useState("All Tools");
  const visibleGroups = active === "All Tools" ? GROUPS : GROUPS.filter((g) => g.key === active);
  const showLabels = active === "All Tools";

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh" }}>
      <Seo
        title="Toolbox — Every Indie Film Tool in One Place | Filmmaker Genius"
        description="The Filmmaker Genius Toolbox: script analysis, storyboards, pitch decks, call sheets, casting, breakdowns, and distribution tools — grouped by production phase."
        canonical="https://filmmakergenius.com/toolbox"
      />
      <style>{`
        @keyframes recutPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(239,68,68,0.55), 0 0 24px rgba(225,29,42,0.25); }
          50% { box-shadow: 0 0 0 1px rgba(239,68,68,0.75), 0 0 44px rgba(225,29,42,0.55); }
        }
        .tb-h1 { font-size: 52px; }
        @media (min-width: 768px) { .tb-h1 { font-size: 68px; } }
        .tb-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .tb-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 900px) { .tb-grid-3 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) {
          .tb-grid-3, .tb-grid-2 { grid-template-columns: 1fr; }
        }
        .tb-tab:hover { border-color: rgba(0,212,170,0.4) !important; color: #fff !important; }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        {/* HERO */}
        <div style={{ textAlign: "center", padding: "72px 0 48px" }}>
          <h1 className="tb-h1" style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 700, lineHeight: 1.05, margin: 0,
          }}>Filmmaker Tools</h1>
          <p style={{
            marginTop: 16, fontSize: 17, color: "rgba(255,255,255,0.55)",
          }}>AI-powered tools for every stage of your production</p>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40, justifyContent: "center" }}>
          {TABS.map((tab) => {
            const isActive = tab === active;
            return (
              <button
                key={tab}
                className={isActive ? "" : "tb-tab"}
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
                    fontFamily: "'Fraunces', serif",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}>{g.label}</span>
                  <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                </div>
              )}
              {g.rows.map((row, i) => (
                <div key={i} className={row.cols === 3 ? "tb-grid-3" : "tb-grid-2"} style={{ marginTop: i > 0 ? 16 : 0 }}>
                  {row.tools.map((t) => <ToolCard key={t.title} tool={t} />)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
