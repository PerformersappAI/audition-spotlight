import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
// Per-course dynamic loader — see src/pages/CourseChapter.tsx for the SSR /
// client cache contract that keeps this synchronous on first render.
import { getCourse, loadCourse } from "@/data/courses/loader";


const MOSAIC_STYLES: React.CSSProperties[] = [
  { gridColumn: "1", gridRow: "1 / span 2", background: "linear-gradient(160deg,#071c20 0%,#0b2d35 100%)" },
  { gridColumn: "2", gridRow: "1",          background: "linear-gradient(135deg,#050510 0%,#0a1030 100%)" },
  { gridColumn: "3", gridRow: "1",          background: "linear-gradient(135deg,#080816 0%,#001a14 100%)" },
  { gridColumn: "4", gridRow: "1 / span 2", background: "linear-gradient(200deg,#0a0818 0%,#141035 100%)" },
  { gridColumn: "2", gridRow: "2",          background: "linear-gradient(135deg,#040e18 0%,#0d2030 100%)" },
  { gridColumn: "3", gridRow: "2",          background: "linear-gradient(135deg,#060a10 0%,#00180e 100%)" },
];

export default function CoursePage() {
  const { courseSlug = "" } = useParams();
  const [course, setCourse] = useState(() => getCourse(courseSlug));
  useEffect(() => {
    const cached = getCourse(courseSlug);
    if (cached) {
      if (cached !== course) setCourse(cached);
      return;
    }
    let cancelled = false;
    loadCourse(courseSlug).then((c) => {
      if (!cancelled) setCourse(c);
    });
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);
  const [activeModule, setActiveModule] = useState<string>("all");


  const visibleModules = useMemo(() => {
    if (!course) return [];
    return activeModule === "all" ? course.modules : course.modules.filter((m) => m.key === activeModule);
  }, [course, activeModule]);

  if (!course) {
    return (
      <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", padding: "80px 24px", textAlign: "center", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, marginBottom: 12 }}>Course coming soon</h1>
        <p style={{ color: "rgba(255,255,255,.55)" }}>We're still putting this one together. Check back soon.</p>
        <Link to="/academy/education" style={{ color: "#00d4aa", marginTop: 24, display: "inline-block" }}>← Back to Education Modules</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Seo
        title={course.seoTitle}
        description={course.seoDesc}
        canonical={`https://filmmakergenius.com/academy/${course.slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.title,
            description: course.seoDesc,
            url: `https://filmmakergenius.com/academy/${course.slug}`,
            provider: {
              "@type": "Organization",
              name: "Filmmaker Genius",
              sameAs: "https://filmmakergenius.com",
            },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "online",
              courseWorkload: course.readTime,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
              { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
              { "@type": "ListItem", position: 3, name: course.title, item: `https://filmmakergenius.com/academy/${course.slug}` },
            ],
          },
        ]}
      />

      <style>{`
        .cp-a:hover { color:#00d4aa !important; }
        .cp-tile:hover { border-color: rgba(0,212,170,.45) !important; transform: translateY(-3px); }
        .cp-tile:hover .cp-roman { color: rgba(0,212,170,.4) !important; }
        .cp-tile:hover .cp-arrow { opacity: 1 !important; }
        .cp-tile { transition: transform .2s ease, border-color .2s ease; }
        .cp-h1 { font-family: 'Fraunces', Georgia, serif; font-size: 52px; line-height: 1.02; margin: 0; }
        .cp-hero { display: grid; grid-template-columns: 1fr 480px; gap: 40px; align-items: center; }
        @media (max-width: 900px) { .cp-hero { grid-template-columns: 1fr; } .cp-mosaic { max-width: 100%; } }
        .cp-info { display: grid; grid-template-columns: 1fr 340px; gap: 32px; margin-bottom: 56px; }
        @media (max-width: 900px) { .cp-info { grid-template-columns: 1fr; } }
        .cp-learn-list { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; }
        @media (max-width: 600px) { .cp-learn-list { grid-template-columns: 1fr; } }
        .cp-chapter-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 860px) { .cp-chapter-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .cp-chapter-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 24px 0", fontSize: 13, color: "rgba(255,255,255,.35)" }}>
        <Link to="/academy" className="cp-a" style={{ color: "rgba(255,255,255,.35)", textDecoration: "none" }}>Academy</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link to="/academy/education" className="cp-a" style={{ color: "rgba(255,255,255,.35)", textDecoration: "none" }}>Education Modules</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "rgba(255,255,255,.6)" }}>{course.title}</span>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px 48px" }}>
        <div className="cp-hero">
          <div>
            <span style={{ display: "inline-block", background: "rgba(0,212,170,.1)", border: "1px solid rgba(0,212,170,.25)", color: "#00d4aa", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999, marginBottom: 20 }}>
              {course.categoryLabel}
            </span>
            <h1 className="cp-h1">{course.title}</h1>
            <p style={{ marginTop: 18, fontSize: 17, color: "rgba(255,255,255,.55)", lineHeight: 1.55, maxWidth: 560 }}>{course.subtitle}</p>
            <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,.5)" }}>
              <span>{course.level}</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.3)" }} />
              <span>{course.chapterCount}</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.3)" }} />
              <span>{course.readTime}</span>
              {course.pairsWithName && course.pairsWithUrl && (
                <>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.3)" }} />
                  <a href={course.pairsWithUrl} target="_blank" rel="noreferrer" style={{ background: "rgba(0,212,170,.1)", border: "1px solid rgba(0,212,170,.25)", color: "#00d4aa", padding: "4px 12px", borderRadius: 999, textDecoration: "none", fontWeight: 600 }}>
                    Pairs with: {course.pairsWithName}
                  </a>
                </>
              )}
            </div>
          </div>
          <div
            className="cp-mosaic"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "140px 100px",
              gap: 5,
              borderRadius: 16,
              overflow: "hidden",
              maxWidth: 480,
            }}
          >
            {course.mosaic.map((text, i) => (
              <div key={i} style={{ position: "relative", ...MOSAIC_STYLES[i] }}>
                <div
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: 12,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 11,
                    color: "rgba(255,255,255,.18)",
                    lineHeight: 1.4,
                  }}
                  dangerouslySetInnerHTML={{ __html: text }}
                />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: i === 0 ? "rgba(0,212,170,.2)" : "rgba(0,212,170,.08)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video slot */}
      <div style={{ maxWidth: 860, margin: "0 auto 56px", padding: "0 24px" }}>
        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)", border: "1px solid rgba(0,212,170,.2)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,212,170,.15)", border: "1px solid rgba(0,212,170,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#00d4aa"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span style={{ background: "rgba(0,212,170,.12)", border: "1px solid rgba(0,212,170,.3)", color: "#00d4aa", padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
              Course Video — Coming Soon
            </span>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>Taught by a working filmmaker · Watch this space</div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <div className="cp-info">
          <div style={{ background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 16, padding: 32 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.3)", margin: "0 0 20px" }}>What you'll learn</h2>
            <div className="cp-learn-list">
              {course.learn.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,212,170,.15)", border: "1px solid rgba(0,212,170,.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00d4aa", fontSize: 11, fontWeight: 700, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,.78)", lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {course.pairsWithName && course.pairsWithUrl && (
            <div style={{ background: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)", border: "1px solid rgba(0,212,170,.2)", borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#00d4aa", marginBottom: 8 }}>Pairs with this tool</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, marginBottom: 12 }}>{course.pairsWithName}</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.7)", lineHeight: 1.6, margin: "0 0 18px" }}>{course.pairsWithDesc}</p>
              <a href={course.pairsWithUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "#00d4aa", color: "#031418", padding: "10px 18px", borderRadius: 999, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                Open {course.pairsWithName} →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Chapters */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.3)", margin: "0 0 18px" }}>Course chapters</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
          {[{ key: "all", label: `All Chapters (${course.chapters.length})` }, ...course.modules.map((m) => ({ key: m.key, label: `${m.label} (${course.chapters.filter((c) => c.moduleKey === m.key).length})` }))].map((t) => {
            const isActive = activeModule === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveModule(t.key)}
                style={{
                  background: isActive ? "rgba(0,212,170,.12)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(0,212,170,.5)" : "rgba(255,255,255,.18)"}`,
                  color: isActive ? "#00d4aa" : "rgba(255,255,255,.6)",
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {visibleModules.map((mod) => {
          const list = course.chapters.filter((c) => c.moduleKey === mod.key);
          if (list.length === 0) return null;
          return (
            <section key={mod.key} style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
                <span style={{ textTransform: "uppercase", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: "rgba(255,255,255,.28)", whiteSpace: "nowrap" }}>{mod.label}</span>
                <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
              </div>
              <div className="cp-chapter-grid">
                {list.map((ch) => (
                  <Link
                    key={ch.slug}
                    to={`/academy/${course.slug}/${ch.slug}`}
                    className="cp-tile"
                    style={{
                      position: "relative",
                      display: "block",
                      minHeight: 168,
                      border: "1px solid rgba(255,255,255,.08)",
                      borderRadius: 14,
                      background: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)",
                      padding: "18px 20px",
                      textDecoration: "none",
                      color: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span className="cp-roman" style={{ fontFamily: "'Fraunces', serif", fontSize: 36, lineHeight: 1, color: "rgba(0,212,170,.2)", transition: "color .2s" }}>{ch.roman}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,.25)" }}>{ch.time}</span>
                    </div>
                    <div style={{ position: "absolute", left: 20, right: 20, bottom: 18 }}>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", lineHeight: 1.4, marginBottom: 6 }}>{ch.desc}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{ch.title}</div>
                    </div>
                    <span className="cp-arrow" style={{ position: "absolute", bottom: 16, right: 18, color: "#00d4aa", fontSize: 16, fontWeight: 700, opacity: 0, transition: "opacity .2s" }}>→</span>
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
