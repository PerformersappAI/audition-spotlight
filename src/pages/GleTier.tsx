import { Link, useParams, useLocation } from "react-router-dom";
import Seo from "@/components/Seo";
import { gleTiers } from "@/data/gleTiers";

export default function GleTier() {
  const { tier } = useParams<{ tier: string }>();
  const location = useLocation();
  const canonical = `https://filmmakergenius.com${location.pathname.replace(/\/$/, "")}`;
  const data = tier ? gleTiers[tier] : undefined;

  if (!data) {
    return (
      <div style={{ background: "#14181c", minHeight: "60vh", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif", padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 14 }}>Coming soon</h1>
        <p style={{ color: "#9ab1c2", marginBottom: 22 }}>This tier detail is on the way.</p>
        <Link to="/green-light-engine" style={{ background: "#20272e", border: "1px solid #2c3440", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 9, padding: "10px 16px", textDecoration: "none" }}>← Back to Green Light Engine</Link>
      </div>
    );
  }

  const { accent, canonical, label, title, sub, platforms } = data;

  return (
    <div style={{ background: "#14181c", color: "#fff", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", minHeight: "100vh" }}>
      <Seo
        title={`${title} — Green Light Engine | Filmmaker Genius`}
        description={sub}
        canonical={canonical}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
            { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
            { "@type": "ListItem", position: 3, name: "Green Light Engine", item: "https://filmmakergenius.com/green-light-engine" },
            { "@type": "ListItem", position: 4, name: title, item: canonical },
          ],
        }}
      />

      <style>{`
        .gle-back:hover { border-color: ${accent} !important; color: ${accent} !important; }
        .gle-card { transition: border-color .15s ease, transform .15s ease; }
        .gle-card:hover { border-color: #678 !important; }
        @media (max-width: 900px) { .gle-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 520px) { .gle-grid { grid-template-columns: 1fr !important; } .gle-card-desc { min-height: 0 !important; } }
      `}</style>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 22px 60px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap", alignItems: "center" }}>
          <Link to="/green-light-engine" className="gle-back" style={{ background: "#20272e", border: "1px solid #2c3440", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 9, padding: "10px 16px", textDecoration: "none" }}>← Back to Green Light Engine</Link>
          <div style={{ fontSize: 13, color: "#678" }}>
            <Link to="/green-light-engine" style={{ color: "#9ab1c2", textDecoration: "none" }}>Green Light Engine</Link>
            <span style={{ color: "#456" }}> › </span>
            <span>{title}</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 34 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: accent }}>{label}</div>
          <h1 style={{ fontSize: 30, margin: "8px 0 10px" }}>{title}</h1>
          <p style={{ color: "#9ab1c2", fontSize: 15, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>{sub}</p>
        </div>

        <div className="gle-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {platforms.map((p, i) => (
            <a key={i} href="#" className="gle-card" style={{ background: "#1c2228", border: "1px solid #2c3440", borderRadius: 14, padding: "20px 18px", display: "block", textDecoration: "none", color: "#fff" }}>
              {p.pill && (
                <div style={{ display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", background: "rgba(0,224,84,0.16)", color: "#00e054", padding: "3px 8px", borderRadius: 6, marginBottom: 8 }}>{p.pill}</div>
              )}
              <div style={{ width: 46, height: 46, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, marginBottom: 14, background: p.logoBg, color: p.logoColor || "#fff", border: p.logoBorder ? `1px solid ${p.logoBorder}` : undefined }}>{p.logoText}</div>
              <h2 style={{ fontSize: 16, marginBottom: 7 }}>{p.name}</h2>
              <p className="gle-card-desc" style={{ color: "#9ab1c2", fontSize: 12.5, lineHeight: 1.55, marginBottom: 14, minHeight: 54 }}>{p.desc}</p>
              <span style={{ fontWeight: 800, fontSize: 13, color: accent }}>Start →</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
