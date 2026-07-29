import { useState, useEffect } from "react";

const TEAL = "#00d4aa";

const OVERLAY = "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)";

const THEME = {
  grad: "linear-gradient(135deg, #120a25 0%, #1e1040 100%)",
  accent: "#a78bfa",
  badgeBg: "rgba(139,92,246,0.12)",
  badgeBorder: "rgba(139,92,246,0.25)",
};

function SuperstarDestroyerCard() {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        minHeight: 260,
        border: `1px solid ${hover ? THEME.accent : "rgba(255,255,255,0.08)"}`,
        background: THEME.grad,
        cursor: "default",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.25s, border-color 0.25s",
        textDecoration: "none",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: OVERLAY, pointerEvents: "none" }} />
      <span style={{
        position: "absolute", top: 18, left: 20,
        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
        padding: "4px 10px", borderRadius: 9999, color: THEME.accent,
        background: THEME.badgeBg, border: `1px solid ${THEME.badgeBorder}`,
      }}>Modules</span>
      <div style={{
        position: "absolute",
        left: 32,
        bottom: 68,
        fontSize: 14,
        color: "rgba(255,255,255,0.5)",
        fontFamily: "'Inter Tight', sans-serif",
      }}>62 courses · Every stage of production</div>
      <div style={{
        position: "absolute",
        left: 32,
        bottom: 32,
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: 28,
        fontWeight: 700,
        color: "#fff",
        textShadow: "0 2px 20px rgba(0,0,0,0.9)",
      }}>Superstar Destroyer</div>
    </div>
  );
}

export default function Launch() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto mb-12">
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

        <div className="w-full max-w-3xl mx-auto">
          <SuperstarDestroyerCard />
        </div>
      </section>
    </div>
  );
}
