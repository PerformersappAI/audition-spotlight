import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import willRobertsPhoto from "@/assets/will-roberts.webp";
import salFramondiPhoto from "@/assets/sal-framondi.webp";

const TEAL = "#00d4aa";
const TEAL_HOVER = "#00f0c0";

type Member = {
  photo: string;
  alt: string;
  name: string;
  title: string;
  role: string;
  tagline: string;
  bio: React.ReactNode[];
  links: { label: string; href: string; variant: "teal" | "outline"; external?: boolean }[];
  reversed?: boolean;
  isLast?: boolean;
  sameAs: string[];
};

const MEMBERS: Member[] = [
  {
    photo: willRobertsPhoto,
    alt: "Will Roberts, Co-Founder of Filmmaker Genius",
    sameAs: ["https://www.imdb.com/name/nm5659247/"],
    name: "Will Roberts",
    title: "Co-Founder",
    role: "CO-FOUNDER",
    tagline: "Actor • Business Coach • Keynote Speaker",
    bio: [
      <>For over 35 years, I've lived and breathed the art of performance. From the stages of Cirque du Soleil to the film set of <em style={{ fontStyle: "italic" }}>Oppenheimer</em>, from musical theater to dramatic television, my journey has taken me through every corner of the entertainment industry.</>,
      <>As a <strong style={{ color: "#fff", fontWeight: 600 }}>SAG Award Winner</strong> and <strong style={{ color: "#fff", fontWeight: 600 }}>People's Choice Award Winner</strong> with 60+ film and television credits, I understand what it takes to succeed in this business — not just as an artist, but as a professional navigating an ever-changing industry.</>,
      <>Today, I combine my decades of on-set experience with cutting-edge technology to help actors, filmmakers, and industry professionals not just survive, but thrive. As the creator of <strong style={{ color: "#fff", fontWeight: 600 }}>The Actors Toolbox</strong>, I'm bringing professional tools and coaching to artists around the world.</>,
    ],
    links: [
      { label: "View on IMDb ↗", href: "https://www.imdb.com/name/nm5659247/", variant: "teal", external: true },
    ],
  },
  {
    photo: salFramondiPhoto,
    alt: "Sal Framondi, Co-Founder of Filmmaker Genius",
    sameAs: ["https://www.linkedin.com/in/salframondi/"],
    name: "Sal Framondi",
    title: "Co-Founder",
    role: "CO-FOUNDER",
    tagline: "Producer • Entrepreneur",
    reversed: true,
    isLast: true,
    bio: [
      <>Sal spent years as an actor working the LA, New York, and Boston markets. He knows firsthand what it costs — in time, money, and resilience — to chase a career that doesn't break your way. That experience never left him, and it shaped everything he built after.</>,
      <>Before returning to the entertainment industry, Sal built and led <strong style={{ color: "#fff", fontWeight: 600 }}>Strategic Tax Resolutions</strong> — a 40-person tax resolution firm in a 7,000 sq. ft. facility in Carlsbad, California — generating more than $1 million in quarterly revenue while overseeing all sales, marketing, and operations. He previously built and operated a successful business in financial services as well.</>,
      <>Sal founded <strong style={{ color: "#fff", fontWeight: 600 }}>OPPRIME.tv</strong>, an independent video-on-demand platform with over 1,200 films in its library, and spent the next decade working directly with more than 1,500 independent filmmakers on marketing, distribution, and monetization strategies. Those years gave him firsthand insight into the obstacles filmmakers face at every stage — from production and distribution to audience growth and revenue generation.</>,
      <>The lessons from OPPRIME.tv became the foundation for Post Hollywood and its family of companies, all focused on helping actors and filmmakers build sustainable careers through practical tools, education, and opportunity.</>,
    ],
    links: [],
  },
];

function PhotoCard({ photo, alt, name, title }: { photo: string; alt: string; name: string; title: string }) {
  return (
    <div style={{
      borderRadius: 20,
      overflow: "hidden",
      background: "#0d0d1a",
      border: "1px solid #1e1e35",
      aspectRatio: "3 / 4",
      maxWidth: 420,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      padding: 24,
    }}>
      <img
        src={photo}
        alt={alt}
        width={220}
        height={220}
        loading="lazy"
        decoding="async"
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid rgba(0,212,170,0.3)",
          boxShadow: "0 0 40px rgba(0,212,170,0.15)",
          background: "rgba(0,212,170,0.1)",
        }}
      />
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{name}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{title}</div>
    </div>
  );
}

function MemberBlock({ m }: { m: Member }) {
  const photo = <div style={{ display: "flex", justifyContent: "center" }}><PhotoCard photo={m.photo} alt={m.alt} name={m.name} title={m.title} /></div>;
  const info = (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 10 }}>{m.role}</div>
      <h2 className="about-name" style={{ fontFamily: "'Fraunces', serif", fontSize: 36, lineHeight: 1.1, margin: 0, fontWeight: 700 }}>{m.name}</h2>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 8, fontWeight: 500 }}>{m.tagline}</div>
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16, fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
        {m.bio.map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
        {m.links.map((l, i) => {
          const teal = l.variant === "teal";
          const style: React.CSSProperties = {
            height: 44,
            padding: "0 24px",
            borderRadius: 9999,
            fontSize: 14,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            border: teal ? "none" : "1px solid rgba(255,255,255,0.15)",
            background: teal ? TEAL : "rgba(255,255,255,0.05)",
            color: teal ? "#000" : "#fff",
            transition: "background 0.2s",
            fontFamily: "inherit",
          };
          return (
            <a
              key={i}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              style={style}
              className={teal ? "about-btn-teal" : "about-btn-outline"}
            >{l.label}</a>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{
      paddingBottom: m.isLast ? 0 : 80,
      marginBottom: m.isLast ? 0 : 80,
      borderBottom: m.isLast ? "none" : "1px solid #1e1e35",
    }}>
      <div className="about-member-grid">
        {m.reversed ? <>{info}{photo}</> : <>{photo}{info}</>}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh" }}>
      <Seo
        title="About Filmmaker Genius — Built by Working Filmmakers"
        description="Meet the team behind Filmmaker Genius: SAG Award winner Will Roberts and OPPRIME.tv founder Sal Framondi."
        canonical="https://filmmakergenius.com/about"
        jsonLd={MEMBERS.map((m) => ({
          "@context": "https://schema.org",
          "@type": "Person",
          name: m.name,
          jobTitle: "Co-Founder",
          image: `https://filmmakergenius.com${m.photo}`,
          worksFor: { "@type": "Organization", name: "Filmmaker Genius" },
          sameAs: m.sameAs,
        }))}
      />
      <style>{`
        .about-h1 { font-size: 52px; }
        @media (min-width: 640px) { .about-h1 { font-size: 68px; } }
        .about-member-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
        @media (min-width: 720px) {
          .about-member-grid { grid-template-columns: 1fr 1fr; gap: 72px; }
        }
        @media (min-width: 900px) {
          .about-name { font-size: 44px !important; }
        }
        .about-btn-teal:hover { background: ${TEAL_HOVER} !important; }
        .about-btn-outline:hover { background: rgba(255,255,255,0.1) !important; }
      `}</style>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "72px 24px 56px", borderBottom: "1px solid #1e1e35", textAlign: "center" }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 500,
          filter: "blur(80px)",
          opacity: 0.13,
          background: "radial-gradient(ellipse at center, rgba(0,212,170,0.6) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative" }}>
          <h1 className="about-h1" style={{ fontFamily: "'Fraunces', serif", lineHeight: 1.1, margin: 0, fontWeight: 700 }}>
            Meet the <span style={{ color: TEAL }}>Team</span>
          </h1>
          <p style={{ marginTop: 16, fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
            Professional actors and creators dedicated to helping you succeed in the entertainment industry.
          </p>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px 96px" }}>
        {MEMBERS.map((m) => <MemberBlock key={m.name} m={m} />)}
      </section>
    </div>
  );
}
