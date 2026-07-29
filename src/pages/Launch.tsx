import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const OVERLAY = "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)";

const THEME = {
  grad: "linear-gradient(135deg, #120a25 0%, #1e1040 100%)",
  accent: "#a78bfa",
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
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: OVERLAY, pointerEvents: "none" }} />
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

function GreenLightEngineCard() {
  const [hover, setHover] = useState(false);
  const theme = {
    grad: "linear-gradient(135deg, #06200f 0%, #0a3318 100%)",
    accent: "#00e054",
    badgeBg: "rgba(0,224,84,0.14)",
    badgeBorder: "rgba(0,224,84,0.3)",
  };

  return (
    <Link
      to="/green-light-engine"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        minHeight: 260,
        border: `1px solid ${hover ? theme.accent : "rgba(255,255,255,0.08)"}`,
        background: theme.grad,
        cursor: "pointer",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.25s, border-color 0.25s",
        textDecoration: "none",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: OVERLAY, pointerEvents: "none" }} />
      <span style={{
        position: "absolute", top: 18, left: 20,
        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
        padding: "4px 10px", borderRadius: 9999, color: theme.accent,
        background: theme.badgeBg, border: `1px solid ${theme.badgeBorder}`,
      }}>Distribution</span>
      <div style={{
        position: "absolute",
        left: 32,
        bottom: 68,
        fontSize: 14,
        color: "rgba(255,255,255,0.5)",
        fontFamily: "'Inter Tight', sans-serif",
      }}>See exactly where your film can go — and how to get there</div>
      <div style={{
        position: "absolute",
        left: 32,
        bottom: 32,
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: 28,
        fontWeight: 700,
        color: "#fff",
        textShadow: "0 2px 20px rgba(0,0,0,0.9)",
      }}>Green Light Engine</div>
      <div style={{
        position: "absolute", bottom: 20, right: 22,
        fontSize: 18, color: theme.accent,
        opacity: hover ? 1 : 0, transition: "opacity 0.2s",
      }}>→</div>
    </Link>
  );
}

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', sans-serif" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px 80px" }}>
        <SuperstarDestroyerCard />
      </div>
    </div>
  );
}
