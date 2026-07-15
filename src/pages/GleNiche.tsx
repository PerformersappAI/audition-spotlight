import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

const ORANGE = "#ff8000";

const tiles = [
  { title: "Black Cinema", desc: "Platforms built for Black film and the African diaspora.", examples: "KweliTV · ALLBLK · Brown Sugar · AfroLandTV · Maverick Black Cinema…", to: "/green-light-engine/niche/black-cinema" },
  { title: "LGBTQ+", desc: "Queer-focused streaming homes for LGBTQ+ stories.", examples: "Revry · Dekkoo · OUTtv · GagaOOLala · Here TV · Lesflicks…", to: "/green-light-engine/niche/lgbtq" },
  { title: "Horror & Cult", desc: "Genre, horror, and cult specialists with built-in fanbases.", examples: "Shudder · Screambox · Midnight Pulp · Arrow Player · Full Moon…", to: "/green-light-engine/niche/horror-cult" },
  { title: "Documentary", desc: "Platforms dedicated to nonfiction and factual film.", examples: "CuriosityStream · MagellanTV · DocuBay · Documentary+ · Docsville…", to: "/green-light-engine/niche/documentary" },
  { title: "International", desc: "Regional and world-cinema platforms by country and culture.", examples: "FilmDoo · Takflix · Shasha · AsianCrush · Hoichoi · Klassiki…", to: "/green-light-engine/niche/international" },
  { title: "Shorts & Experimental", desc: "Homes for short films and experimental / art work.", examples: "Short of the Week · Omeleto · Film Shortage · Nowness · ShortVerse…", to: "/green-light-engine/niche/shorts-experimental" },
];

export default function GleNiche() {
  return (
    <div style={{ background: "#14181c", color: "#fff", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", minHeight: "100vh" }}>
      <Seo
        title="Niche & Identity Streaming Platforms — Green Light Engine"
        description="Find the right identity- and genre-driven streaming home for your indie film: Black cinema, LGBTQ+, horror, documentary, international, and shorts platforms."
        canonical="https://filmmakergenius.com/green-light-engine/niche"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
            { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
            { "@type": "ListItem", position: 3, name: "Green Light Engine", item: "https://filmmakergenius.com/green-light-engine" },
            { "@type": "ListItem", position: 4, name: "Niche & Identity", item: "https://filmmakergenius.com/green-light-engine/niche" },
          ],
        }}
      />

      <style>{`
        .gle-back:hover { border-color: ${ORANGE} !important; color: ${ORANGE} !important; }
        .niche-tile { transition: border-color .15s ease; }
        .niche-tile:hover { border-color: #678 !important; }
        @media (max-width: 760px) { .niche-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 22px 60px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap", alignItems: "center" }}>
          <Link to="/green-light-engine" className="gle-back" style={{ background: "#20272e", border: "1px solid #2c3440", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 9, padding: "10px 16px", textDecoration: "none" }}>← Back to Green Light Engine</Link>
          <div style={{ fontSize: 13, color: "#678" }}>
            <Link to="/green-light-engine" style={{ color: "#9ab1c2", textDecoration: "none" }}>Green Light Engine</Link>
            <span style={{ color: "#456" }}> › </span>
            <span>Niche & Identity</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 34 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE }}>Niche & Identity</div>
          <h1 style={{ fontSize: 30, margin: "8px 0 10px" }}>Matched to your film</h1>
          <p style={{ color: "#9ab1c2", fontSize: 15, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>Some platforms are matched by your film's subject and audience — not just its specs. Pick the category that fits your film, then we'll show you the platforms inside it.</p>
        </div>

        <div className="niche-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18, textAlign: "left" }}>
          {tiles.map((t) => (
            <Link key={t.to} to={t.to} className="niche-tile" style={{ background: "#1c2228", border: "1px solid #2c3440", borderRadius: 14, padding: "26px 24px", display: "block", textDecoration: "none", color: "#fff" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 16, background: "rgba(255,128,0,0.16)" }} />
              <h2 style={{ fontSize: 19, marginBottom: 9 }}>{t.title}</h2>
              <p style={{ color: "#9ab1c2", fontSize: 13.5, lineHeight: 1.6, marginBottom: 14 }}>{t.desc}</p>
              <div style={{ color: "#678", fontSize: 12.5, lineHeight: 1.5, marginBottom: 16 }}>{t.examples}</div>
              <span style={{ fontWeight: 800, fontSize: 13.5, color: ORANGE }}>See platforms →</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
