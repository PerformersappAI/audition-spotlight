import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

const TEAL = "#00d4aa";
const BG = "#0a0a12";
const SURFACE = "#12121f";
const SURFACE2 = "#16162a";
const BORDER = "#1e1e35";

type Chapter = {
  n: number;
  stage: string;
  title: string;
  desc: string;
  to: string;
};

const CHAPTERS: Chapter[] = [
  { n: 1, stage: "Development", title: "The Idea", desc: "How to develop a film idea worth making — loglines, the 5 elements of film, and the reality filter that turns a concept into a movie you can finish.", to: "/academy/roberts-filmmaking/ch1" },
  { n: 2, stage: "Development", title: "Development", desc: "Turn your idea into a script: treatment, outline, beat sheet, three-act and Save the Cat structure, screenwriting software, and the rewrite.", to: "/academy/roberts-filmmaking/ch2" },
  { n: 3, stage: "Producing", title: "Producing Your Own Film", desc: "What a producer really does — starting a production company, the business plan, raising money, and protecting your film with contracts and insurance.", to: "/academy/roberts-filmmaking/ch3" },
  { n: 4, stage: "Producing", title: "Budgeting", desc: "Build a real film budget: the top sheet, above- and below-the-line, every category, a sample breakdown, and why contingency saves your movie.", to: "/academy/roberts-filmmaking/ch4" },
  { n: 5, stage: "Pre-Production", title: "Assembling Your Crew", desc: "How to hire a film crew: the key roles, where to find people, chemistry over credits, and fair deals when the money is short.", to: "/academy/roberts-filmmaking/ch5" },
  { n: 6, stage: "Pre-Production", title: "Pre-Production", desc: "The script breakdown, shooting schedule, shot lists, storyboards, location scouting, and call sheets — where the movie is really won.", to: "/academy/roberts-filmmaking/ch6" },
  { n: 7, stage: "Production", title: "Directing", desc: "The director's real job: vision, preparation, the language of camera shots, getting coverage, and leading the set with calm authority.", to: "/academy/roberts-filmmaking/ch7" },
  { n: 8, stage: "Production", title: "Working With Actors", desc: "From an actor who's lived it: casting, auditions, rehearsal, and directing performances with actions and intentions instead of adjectives.", to: "/academy/roberts-filmmaking/ch8" },
  { n: 9, stage: "Production", title: "Cinematography & Visual Language", desc: "Make your film look like more than it cost — light, lenses, composition, camera shots and angles, and motion with meaning.", to: "/academy/roberts-filmmaking/ch9" },
  { n: 10, stage: "Production", title: "Production", desc: "Surviving the shoot: the rhythm of a day, making your day, solving problems fast, protecting sound and continuity, and keeping the set human.", to: "/academy/roberts-filmmaking/ch10" },
  { n: 11, stage: "Post-Production", title: "Post-Production", desc: "Where the film is really made: editing, color grading, sound design and the mix, music licensing, titles, and final delivery.", to: "/academy/roberts-filmmaking/ch11" },
  { n: 12, stage: "Distribution", title: "Film Festivals", desc: "A smart festival strategy: the tiers, FilmFreeway, submission fees, premiere status, and how to get into film festivals without going broke.", to: "/academy/roberts-filmmaking/ch12" },
  { n: 13, stage: "Distribution", title: "Aggregators & Distributors", desc: "The two doors to streaming — what aggregators and distributors cost, how recoupment works, and how to keep control of your film.", to: "/academy/roberts-filmmaking/ch13" },
  { n: 14, stage: "Distribution", title: "VOD & Streaming", desc: "SVOD, TVOD, AVOD, FAST and DIY explained, the global platform landscape, and a release windowing strategy that actually pays.", to: "/academy/roberts-filmmaking/ch14" },
  { n: 15, stage: "Marketing", title: "Marketing Your Film", desc: "How to market an indie film: building an audience early, your marketing plan, killer key art and trailer, press, and grassroots reach.", to: "/academy/roberts-filmmaking/ch15" },
  { n: 16, stage: "The Business", title: "Building a Career", desc: "From one film to a body of work: relationships, reputation, grants and funding, your next project, and finding your voice.", to: "/academy/roberts-filmmaking/ch16" },
  { n: 17, stage: "The Business", title: "The Long Game", desc: "How to sustain a filmmaking life: resilience through rejection, protecting your finances and creativity, and defining success on your terms.", to: "/academy/roberts-filmmaking/ch17" },
];

const STATS = [
  { num: "17", label: "Free Chapters" },
  { num: "35+", label: "Years of Experience" },
  { num: "60+", label: "Film & TV Credits" },
  { num: "Idea→Screen", label: "Every Stage Covered" },
];

function ChapterCard({ ch }: { ch: Chapter }) {
  return (
    <Link to={ch.to} className="rf-card" style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 14,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      textDecoration: "none",
      color: "inherit",
      position: "relative",
      transition: "all 0.2s",
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, opacity: 0.8 }}>{ch.stage}</div>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Chapter {ch.n}</div>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, margin: 0, color: "#fff" }}>{ch.title}</h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{ch.desc}</p>
      <span className="rf-arrow" style={{ position: "absolute", bottom: 16, right: 20, color: "rgba(255,255,255,0.25)", transition: "color 0.2s" }}>→</span>
    </Link>
  );
}

export default function RobertsFilmmaking() {
  return (
    <div style={{ background: BG, color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', sans-serif" }}>
      <Seo
        title="Filmmaking by Will Roberts: The Complete Indie Filmmaker's Guide"
        description="A free 17-chapter guide to making an independent film — from idea and script through crew, production, editing, distribution, and release. By Will Roberts."
        canonical="https://filmmakergenius.com/academy/how-to-make-a-movie"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
            { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
            { "@type": "ListItem", position: 3, name: "The Roberts Filmmaking Method", item: "https://filmmakergenius.com/academy/how-to-make-a-movie" },
          ],
        }}
      />

      <style>{`
        .rf-card:hover { border-color: rgba(0,212,170,0.4) !important; background: ${SURFACE2} !important; transform: translateY(-2px); }
        .rf-card:hover .rf-arrow { color: ${TEAL} !important; }
        .rf-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 640px) { .rf-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 980px) { .rf-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      {/* BREADCRUMB */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 24px 0", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
        <Link to="/academy" style={{ color: "inherit", textDecoration: "none" }}>Academy</Link>
        <span> › </span>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>Filmmaking by Will Roberts</span>
      </div>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "56px 0 48px", borderBottom: `1px solid ${BORDER}`, textAlign: "center" }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 480, filter: "blur(90px)", opacity: 0.16, pointerEvents: "none",
          background: `radial-gradient(ellipse at center, ${TEAL} 0%, transparent 70%)`,
        }} />
        <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>Filmmaker Genius Academy</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(40px,7vw,64px)", lineHeight: 1.04, margin: 0, maxWidth: 760, marginLeft: "auto", marginRight: "auto", fontWeight: 700 }}>
            Filmmaking by <span style={{ color: TEAL }}>Will Roberts</span>
          </h1>
          <p style={{ marginTop: 22, fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 600, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            The complete indie filmmaker's guide — 17 free chapters that take you from the first idea all the way to getting your film distributed and seen.
          </p>
          <div style={{ marginTop: 26, display: "inline-flex", gap: 10, alignItems: "center" }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              border: `2px solid ${TEAL}`, background: "rgba(0,212,170,0.12)",
              color: TEAL, fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>WR</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Written by</div>
              <div style={{ fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>Will Roberts · SAG Award Winner</div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 0" }}>
        <blockquote style={{
          fontFamily: "'Fraunces', serif", fontStyle: "italic",
          fontSize: 21, color: "rgba(255,255,255,0.78)", lineHeight: 1.6,
          borderLeft: `3px solid ${TEAL}`, paddingLeft: 24, margin: 0,
        }}>
          "I've spent thirty-five years and sixty-plus credits learning how this is really done. This is everything I'd tell you if we sat down together — from the spark of an idea to the day strangers finally watch your film."
        </blockquote>
        <p style={{ marginTop: 20, fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
          This free guide walks through every stage of making an independent film: development, producing, budgeting, crew, pre-production, directing, working with actors, cinematography, the shoot, post-production, festivals, distribution, streaming, marketing, and building a lasting career. Practical, specific, no fluff. Read it in order, or jump to the chapter you need right now.
        </p>
      </section>

      {/* GUIDE GRID */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 24px 80px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL, marginBottom: 8 }}>The Complete Guide</div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, margin: "0 0 36px", fontWeight: 700 }}>All 17 Chapters</h2>
        <div className="rf-grid">
          {CHAPTERS.map((ch) => <ChapterCard key={ch.n} ch={ch} />)}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: SURFACE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "32px 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 56, justifyContent: "center" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 700, color: TEAL }}>{s.num}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FREE PDF */}
      <section style={{ background: SURFACE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", gap: 48, flexWrap: "wrap", alignItems: "center" }}>
          {/* COVER */}
          <div style={{
            width: 150, height: 208, borderRadius: 12, overflow: "hidden",
            background: "linear-gradient(to bottom, #0b0d10 0%, #05070a 100%)",
            position: "relative", display: "flex", flexDirection: "column",
            justifyContent: "flex-end", padding: "0 12px 18px", textAlign: "center",
            border: `1px solid ${BORDER}`,
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: TEAL }} />
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>
              The Indie Filmmaker's <span style={{ color: TEAL }}>Complete Guide</span>
            </div>
            <div style={{ width: 32, height: 1, background: TEAL, margin: "10px auto" }} />
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)" }}>By Will Roberts</div>
          </div>
          {/* RIGHT */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL, marginBottom: 12 }}>Free Download</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, margin: "0 0 16px", fontWeight: 700 }}>
              Take the whole guide with you — <span style={{ color: TEAL }}>free PDF</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 28px" }}>
              All 17 chapters in a single PDF — every stage of making an independent film, from the first idea to distribution, distilled and ready to reference. No sign-up.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <a href="#" style={{
                height: 50, padding: "0 28px", borderRadius: 9999,
                background: TEAL, color: "#000", fontWeight: 700,
                display: "inline-flex", alignItems: "center", textDecoration: "none",
              }}>↓ Download Free PDF</a>
              <Link to="/academy/roberts-filmmaking/ch1" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
                Or read it online →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section style={{ padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, margin: 0, fontWeight: 700 }}>
          Stop reading about it. <span style={{ color: TEAL }}>Start making it.</span>
        </h2>
        <p style={{ marginTop: 12, fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
          Filmmaker Genius takes your film from script to screen — storyboarding, casting, scheduling, contracts, and distribution strategy in one platform.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
          <Link to="/pricing" style={{
            height: 50, padding: "0 28px", borderRadius: 9999,
            background: TEAL, color: "#000", fontWeight: 700,
            display: "inline-flex", alignItems: "center", textDecoration: "none",
          }}>Start Free</Link>
          <Link to="/toolbox" style={{
            height: 50, padding: "0 28px", borderRadius: 9999,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", fontWeight: 700,
            display: "inline-flex", alignItems: "center", textDecoration: "none",
          }}>Explore the Toolbox</Link>
        </div>
      </section>
    </div>
  );
}
