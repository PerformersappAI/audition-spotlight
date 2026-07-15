import { Link, useLocation } from "react-router-dom";
import Seo from "@/components/Seo";
import { monetizationHubs } from "@/data/monetizationHubs";

interface Props {
  hubKey: "aggregators" | "distributors" | "vod";
}

export default function MonetizationHub({ hubKey }: Props) {
  const hub = monetizationHubs[hubKey];
  const location = useLocation();
  const canonical = `https://filmmakergenius.com${location.pathname.replace(/\/$/, "")}`;
  if (!hub) return null;
  const { accent, accentRgb, keyBg, keyBg2, title, sub, stats, whatIsHeading, whatIsBody, keyFactsHeading, keyFacts, sectionLabel, tiles } = hub;

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Seo
        title={`${title} — Filmmaker Genius Academy`}
        description={sub}
        canonical={canonical}
      />

      <style>{`
        .mh-crumb-link:hover { color: ${accent} !important; }
        .mh-tile { transition: border-color .18s ease, transform .18s ease; }
        .mh-tile:hover { border-color: rgba(${accentRgb},0.5) !important; transform: translateY(-3px); }
        .mh-tile:hover .mh-arrow { opacity: 1 !important; }
        @media (max-width: 860px) {
          .mh-intro-grid { grid-template-columns: 1fr !important; }
          .mh-sub-grid { grid-template-columns: 1fr !important; }
          .mh-h1 { font-size: 40px !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 20px 0", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
        <Link to="/academy" className="mh-crumb-link" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color .15s" }}>Academy</Link>
        <span> › </span>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>{title}</span>
      </div>

      {/* Hero */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 20px", borderBottom: "1px solid #1e1e35", marginBottom: 48 }}>
        <div style={{ display: "inline-flex", background: `rgba(${accentRgb},0.1)`, border: `1px solid rgba(${accentRgb},0.25)`, color: accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 999, marginBottom: 20 }}>Monetization</div>
        <h1 className="mh-h1" style={{ fontFamily: "'Fraunces', serif", fontSize: 56, lineHeight: 1.02, marginBottom: 16, color: "#fff" }}>{title}</h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 680, marginBottom: 28 }}>{sub}</p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                {s.hi && <span style={{ color: accent, fontWeight: 600 }}>{s.hi} </span>}
                {s.text}
              </div>
              {i < stats.length - 1 && <span style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(255,255,255,0.2)" }} />}
            </div>
          ))}
        </div>
      </section>

      {/* Intro grid */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "0 20px" }}>
        <div className="mh-intro-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, marginBottom: 48 }}>
          <div style={{ background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 16, padding: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>{whatIsHeading}</div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{whatIsBody}</p>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${keyBg} 0%, ${keyBg2} 100%)`, border: `1px solid rgba(${accentRgb},0.2)`, borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>{keyFactsHeading}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {keyFacts.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10 }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: accent, marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: f }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>{sectionLabel}</div>

        <div className="mh-sub-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 96 }}>
          {tiles.map((t, i) => (
            <Link key={i} to={t.to} className="mh-tile" style={{ display: "flex", flexDirection: "column", background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28, minHeight: 280, position: "relative", overflow: "hidden", textDecoration: "none", color: "#fff" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 52, fontWeight: 700, color: `rgba(${accentRgb},0.12)`, lineHeight: 1, marginBottom: 16 }}>{t.num}</div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: `rgba(${accentRgb},0.5)`, marginBottom: 8 }}>{t.cat}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{t.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, flex: 1, marginBottom: 20 }}>{t.desc}</div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: `rgba(${accentRgb},0.5)`, marginBottom: 10 }}>{t.count}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {t.tags.map((tag, j) => (
                  <span key={j} style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: 999 }}>{tag}</span>
                ))}
              </div>
              <span className="mh-arrow" style={{ position: "absolute", bottom: 22, right: 24, fontSize: 18, color: accent, opacity: 0, transition: "opacity .18s ease" }}>→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
