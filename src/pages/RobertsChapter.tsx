import { Link, useParams, useLocation } from "react-router-dom";
import Seo from "@/components/Seo";
import { robertsChapters } from "@/data/robertsChapters";

const RobertsChapter = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const location = useLocation();
  const canonical = `https://filmmakergenius.com${location.pathname.replace(/\/$/, "")}`;
  const chapter = chapterId ? robertsChapters[chapterId] : undefined;

  if (!chapter) {
    return (
      <div
        style={{
          background: "#0a0a12",
          color: "#fff",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          fontFamily: "'Inter Tight', sans-serif",
        }}
      >
        <p style={{ fontSize: 20, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
          This chapter is coming soon.
        </p>
        <Link
          to="/academy/roberts-filmmaking"
          style={{ color: "#00d4aa", textDecoration: "none", fontWeight: 700 }}
        >
          ← Back to all chapters
        </Link>
      </div>
    );
  }

  const { seoTitle, category, number, title, intro, bodyHtml, cta, prev, next } =
    chapter;

  return (
    <div
      style={{
        background: "#0a0a12",
        color: "#fff",
        fontFamily: "'Inter Tight', sans-serif",
      }}
    >
      <Seo
        title={seoTitle}
        description={intro.replace(/<[^>]+>/g, "").slice(0, 160)}
        canonical={canonical}
      />

      <style>{`
        .rc-body p { font-size: 16.5px; color: rgba(255,255,255,0.78); margin-bottom: 20px; line-height: 1.85; }
        .rc-body h2 { font-family: 'Fraunces', serif; font-size: 26px; margin: 46px 0 14px; color: #fff; }
        .rc-body h3 { font-family: 'Inter Tight', sans-serif; font-size: 17px; font-weight: 700; margin: 28px 0 8px; color: #fff; }
        .rc-body strong { color: #fff; font-weight: 700; }
        .rc-body em { font-style: italic; }
        .rc-body p.dropcap::first-letter { font-family: 'Fraunces', serif; float: left; font-size: 62px; line-height: 0.8; font-weight: 600; color: #00d4aa; padding: 6px 10px 0 0; }
        .rc-body p.pull { border-left: 3px solid #00d4aa; padding: 8px 0 8px 24px; margin: 34px 0; font-family: 'Fraunces', serif; font-size: 21px; font-style: italic; color: rgba(255,255,255,0.85); line-height: 1.5; }
        .rc-body .callout { background: #12121f; border: 1px solid #1e1e35; border-radius: 12px; padding: 24px 26px; margin: 32px 0; }
        .rc-body .callout .lbl { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #00d4aa; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
        .rc-body .callout .lbl .dot { width: 7px; height: 7px; border-radius: 50%; background: #00d4aa; display: inline-block; }
        .rc-body .callout p { color: rgba(255,255,255,0.72); font-size: 16px; margin: 0; }
        .rc-body .example { background: #10101c; border: 1px solid #1e1e35; border-radius: 12px; padding: 20px 24px; margin: 30px 0; }
        .rc-body .example .lbl { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #0099ff; margin-bottom: 12px; }
        .rc-body .example p { font-size: 15.5px; color: rgba(255,255,255,0.72); margin-bottom: 10px; }
        .rc-body .example .film { font-family: 'Fraunces', serif; font-style: italic; color: #fff; }
        .rc-body .action { border-top: 2px solid #1e1e35; margin-top: 48px; padding-top: 24px; }
        .rc-body .action h2 { margin-top: 0; font-size: 22px; margin-bottom: 14px; }
        .rc-body ul.checklist { list-style: none; padding: 0; margin: 0; }
        .rc-body ul.checklist li { position: relative; padding: 11px 0 11px 34px; border-bottom: 1px solid #1e1e35; font-size: 15.5px; color: rgba(255,255,255,0.75); }
        .rc-body ul.checklist li::before { content: ''; position: absolute; left: 0; top: 14px; width: 18px; height: 18px; border: 2px solid #00d4aa; border-radius: 5px; }
        .rc-cta-btn-teal:hover { background: #00f0c0 !important; }
        .rc-cta-btn-outline:hover { background: rgba(255,255,255,0.08) !important; }

        /* Data tables */
        .rc-body table.tbl { width: 100%; border-collapse: collapse; margin: 26px 0; font-size: 14.5px; }
        .rc-body table.tbl th { text-align: left; background: #10101c; border-bottom: 2px solid #1e1e35; padding: 10px 12px; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .rc-body table.tbl td { padding: 11px 12px; border-bottom: 1px solid #1e1e35; vertical-align: top; color: rgba(255,255,255,0.75); }
        .rc-body table.tbl td:first-child { font-weight: 700; color: #fff; }

        /* "Practice with this tool" card (appended inside the body) */
        .rc-body .tool-cta-card { margin: 40px 0 8px; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .rc-body .tool-cta-box { background: linear-gradient(135deg,#071820 0%,#0a2a30 100%); border: 1px solid rgba(0,212,170,0.25); border-radius: 14px; padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .rc-body .tool-cta-info { display: flex; flex-direction: column; gap: 4px; }
        .rc-body .tool-cta-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(0,212,170,0.65); }
        .rc-body .tool-cta-name { font-family: 'Fraunces', serif; font-size: 22px; color: #fff; }
        .rc-body .tool-cta-desc { font-size: 13px; color: rgba(255,255,255,0.5); max-width: 420px; margin: 0; }
        .rc-body a.tool-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: #00d4aa; color: #000; font-size: 13px; font-weight: 700; padding: 12px 22px; border-radius: 9999px; text-decoration: none; white-space: nowrap; transition: background 0.2s, transform 0.1s; }
        .rc-body a.tool-cta-btn:hover { background: #00f0c0; transform: translateY(-1px); }

        /* Closing box (final chapter) */
        .rc-body .closing { margin-top: 40px; padding: 28px; border: 1px solid #1e1e35; border-radius: 14px; background: #12121f; }
        .rc-body .closing h3 { margin-top: 0; color: #00d4aa; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Inter Tight', sans-serif; font-weight: 700; margin-bottom: 12px; }
        .rc-body .closing p { color: rgba(255,255,255,0.78); font-size: 16.5px; line-height: 1.85; }
      `}</style>

      {/* Breadcrumb */}
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "20px 24px 0",
          fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}
      >
        <Link to="/academy" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
          Academy
        </Link>
        {" › "}
        <Link
          to="/academy/roberts-filmmaking"
          style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
        >
          Filmmaking by Will Roberts
        </Link>
        {" › "}
        <span style={{ color: "rgba(255,255,255,0.55)" }}>{title}</span>
      </div>

      {/* Header */}
      <header style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 36px" }}>
        <div
          style={{
            display: "inline-flex",
            background: "rgba(0,212,170,0.1)",
            border: "1px solid rgba(0,212,170,0.25)",
            color: "#00d4aa",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: 9999,
            marginBottom: 18,
          }}
        >
          {category}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginBottom: 12,
          }}
        >
          Chapter {number}
        </div>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(36px, 6vw, 52px)",
            lineHeight: 1.06,
            marginBottom: 18,
            color: "#fff",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.65,
            borderTop: "1px solid #1e1e35",
            paddingTop: 20,
            margin: 0,
          }}
          dangerouslySetInnerHTML={{ __html: intro }}
        />
      </header>

      {/* Video slot */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 40px" }}>
        <div
          style={{
            aspectRatio: "16 / 9",
            background: "linear-gradient(135deg,#071820,#0a2a30)",
            border: "1px solid rgba(0,212,170,0.2)",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(0,212,170,0.12)",
              border: "1px solid rgba(0,212,170,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00d4aa",
              fontSize: 22,
              paddingLeft: 5,
            }}
          >
            ▶
          </div>
          <div
            style={{
              background: "rgba(0,212,170,0.1)",
              border: "1px solid rgba(0,212,170,0.3)",
              color: "#00d4aa",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: 9999,
            }}
          >
            Video Lesson — Coming Soon
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Taught by Will Roberts · Watch this space
          </div>
        </div>
      </div>

      {/* Body */}
      <article
        className="rc-body"
        style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 56px" }}
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />

      {/* Chapter nav */}
      <nav
        style={{
          maxWidth: 760,
          margin: "0 auto",
          borderTop: "1px solid #1e1e35",
          borderBottom: "1px solid #1e1e35",
          padding: 24,
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link to={prev.to} style={{ textDecoration: "none", textAlign: "left" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 4,
            }}
          >
            {prev.dir}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)" }}>{prev.label}</div>
        </Link>
        <Link to={next.to} style={{ textDecoration: "none", textAlign: "right" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 4,
            }}
          >
            {next.dir}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)" }}>{next.label}</div>
        </Link>
      </nav>

      {/* CTA */}
      <section
        style={{
          background: "#12121f",
          borderTop: "1px solid #1e1e35",
          padding: "56px 24px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, margin: 0, color: "#fff" }}>
          {cta.titleLead}
          <span style={{ color: "#00d4aa" }}>{cta.titleAccent}</span>
        </h2>
        <p
          style={{
            marginTop: 12,
            fontSize: 15,
            color: "rgba(255,255,255,0.5)",
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {cta.text}
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginTop: 24,
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/pricing"
            className="rc-cta-btn-teal"
            style={{
              height: 48,
              padding: "0 26px",
              borderRadius: 9999,
              fontWeight: 700,
              background: "#00d4aa",
              color: "#000",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "background 0.15s",
            }}
          >
            Start Free
          </Link>
          <Link
            to="/academy/roberts-filmmaking"
            className="rc-cta-btn-outline"
            style={{
              height: 48,
              padding: "0 26px",
              borderRadius: 9999,
              fontWeight: 700,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "background 0.15s",
            }}
          >
            Browse All Chapters
          </Link>
        </div>
      </section>
    </div>
  );
};

export default RobertsChapter;
