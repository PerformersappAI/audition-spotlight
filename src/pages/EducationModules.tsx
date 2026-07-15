import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { categories, courses } from "@/data/academyCourses";

export default function EducationModules() {
  const [active, setActive] = useState<string>("all");

  const visibleCategories = useMemo(
    () => (active === "all" ? categories : categories.filter((c) => c.key === active)),
    [active]
  );

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Seo
        title="Education Modules — Filmmaker Genius Academy"
        description="Browse 60+ free education modules for indie filmmakers: screenwriting, directing, producing, cinematography, editing, sound, distribution, and marketing."
        canonical="https://filmmakergenius.com/academy/education"
      />

      <style>{`
        .em-tile { transition: transform .2s ease, border-color .2s ease; }
        .em-tile:hover { transform: translateY(-3px); }
        .em-arrow { opacity: 0; transition: opacity .2s ease; }
        .em-tile:hover .em-arrow { opacity: 1; }
        .em-crumb-link:hover { color: #00d4aa !important; }
        .em-pill:hover { border-color: rgba(0,212,170,0.4) !important; color: #fff !important; }
        .em-h1 { font-family: 'Fraunces', Georgia, serif; font-size: 52px; margin: 0; line-height: 1.05; }
        @media (min-width: 768px) { .em-h1 { font-size: 64px; } }
        .em-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 900px) { .em-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .em-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 24px 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
        <Link to="/academy" className="em-crumb-link" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
          Academy
        </Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "rgba(255,255,255,0.6)" }}>Education Modules</span>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px 48px", textAlign: "center" }}>
        <h1 className="em-h1">Education Modules</h1>
        <p style={{ marginTop: 16, fontSize: 17, color: "rgba(255,255,255,0.55)" }}>
          Expert-led courses for every stage of your filmmaking journey
        </p>
        <div
          style={{
            display: "inline-block",
            marginTop: 12,
            background: "rgba(0,212,170,0.1)",
            border: "1px solid rgba(0,212,170,0.25)",
            color: "#00d4aa",
            fontSize: 13,
            fontWeight: 600,
            padding: "4px 14px",
            borderRadius: 999,
          }}
        >
          {courses.length} Courses
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px 80px" }}>
        {/* Filter tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
          {[{ key: "all", label: "All" }, ...categories.map((c) => ({ key: c.key, label: c.label }))].map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className="em-pill"
                style={{
                  background: isActive ? "rgba(0,212,170,0.12)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(0,212,170,0.5)" : "rgba(255,255,255,0.18)"}`,
                  color: isActive ? "#00d4aa" : "rgba(255,255,255,0.6)",
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all .2s ease",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Groups */}
        {visibleCategories.map((cat) => {
          const list = courses.filter((c) => c.category === cat.key);
          if (list.length === 0) return null;
          return (
            <section key={cat.key} style={{ marginBottom: 48 }}>
              {active === "all" && (
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <span
                    style={{
                      textTransform: "uppercase",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cat.label}
                  </span>
                  <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                </div>
              )}
              <div className="em-grid">
                {list.map((course) => (
                  <Link
                    key={course.slug}
                    to={`/academy/${course.slug}`}
                    className="em-tile"
                    style={{
                      position: "relative",
                      display: "block",
                      minHeight: 150,
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      overflow: "hidden",
                      background: cat.gradient,
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = cat.color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
                      }}
                    />
                    {course.pairsWith && (
                      <div
                        style={{
                          position: "absolute",
                          top: 14,
                          left: 16,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          padding: "3px 10px",
                          borderRadius: 999,
                          color: cat.color,
                          background: `${cat.color}1f`,
                          border: `1px solid ${cat.color}40`,
                          zIndex: 2,
                        }}
                      >
                        Pairs with: {course.pairsWith}
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 18,
                        left: 20,
                        right: 40,
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#fff",
                        textShadow: "0 2px 12px rgba(0,0,0,0.9)",
                        zIndex: 2,
                      }}
                    >
                      {course.title}
                    </div>
                    <div
                      className="em-arrow"
                      style={{
                        position: "absolute",
                        bottom: 16,
                        right: 18,
                        color: cat.color,
                        fontSize: 18,
                        fontWeight: 700,
                        zIndex: 2,
                      }}
                    >
                      →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
