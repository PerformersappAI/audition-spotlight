import { Link, useParams, useLocation } from "react-router-dom";
import Seo from "@/components/Seo";
import { monetizationSub, SubPage, SubCard } from "@/data/monetizationSub";

interface Props {
  group: "aggregators" | "distributors" | "vod";
}

const groupHub: Record<string, { title: string; path: string }> = {
  aggregators: { title: "Aggregators", path: "/academy/aggregators" },
  distributors: { title: "Distributors", path: "/academy/distributors" },
  vod: { title: "VOD Platforms", path: "/academy/vod" },
};

function Card({ card, variant, statLayout }: { card: SubCard; variant: SubPage["variant"]; statLayout?: "grid" | "column" }) {
  return (
    <div className={variant === "platform" ? "msub-card platform" : "msub-card"}>
      {card.badge && <div className="msub-badge">{card.badge}</div>}
      <h2 className="msub-name">{card.name}</h2>
      <div className="msub-type">{card.type}</div>
      {card.model && <div className="msub-model">{card.model}</div>}
      {card.stats && card.stats.length > 0 && (
        <div className={statLayout === "grid" ? "msub-statrow grid" : "msub-statrow"}>
          {card.stats.map((s, i) => (
            <div className="msub-stat" key={i}>
              <div className="msub-stat-label">{s.label}</div>
              <div className="msub-stat-value">{s.value}</div>
            </div>
          ))}
        </div>
      )}
      {card.bestFor && <div className="msub-bestfor">{card.bestFor}</div>}
      <p className="msub-desc">{card.desc}</p>
      {card.tags && card.tags.length > 0 && (
        <>
          {card.tagsLabel && <div className="msub-taglabel">{card.tagsLabel}</div>}
          <div className="msub-tags">
            {card.tags.map((t, i) => (
              <span className="msub-tag" key={i}>{t}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function MonetizationSubPage({ group }: Props) {
  const { slug } = useParams();
  const hub = groupHub[group];
  const entry: SubPage | undefined = slug ? monetizationSub[`${group}/${slug}`] : undefined;

  if (!entry) {
    return (
      <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px" }}>
        <Seo title={`Coming Soon — ${hub.title} | Filmmaker Genius`} description={`This ${hub.title} profile list is coming soon on Filmmaker Genius Academy.`} canonical={`https://filmmakergenius.com${hub.path}`} />
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 44, marginBottom: 16 }}>Coming soon</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>This profile list isn't published yet.</p>
        <Link to={hub.path} style={{ color: "#00d4aa", fontWeight: 600, textDecoration: "none" }}>← Back to {hub.title}</Link>
      </div>
    );
  }

  const ac = entry.accent;
  const ar = entry.accentRgb;

  return (
    <div className="msub-root" style={{ ["--ac" as any]: ac, ["--ar" as any]: ar, background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Seo
        title={`${entry.title} — ${entry.groupTitle} | Filmmaker Genius Academy`}
        description={`${entry.groupTitle} for indie film: ${entry.title.toLowerCase()}. ${entry.intro}`.slice(0, 300)}
        canonical={entry.canonical}
      />

      <style>{`
        .msub-root h1, .msub-root h2 { font-family: 'Fraunces', serif; letter-spacing: -0.02em; font-weight: 700; margin: 0; }
        .msub-crumb a { color: rgba(255,255,255,0.3); transition: color .2s; text-decoration: none; }
        .msub-crumb a:hover { color: var(--ac); }
        .msub-grid { display: grid; gap: 20px; margin-bottom: 96px; }
        .msub-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px; position: relative; overflow: hidden; transition: border-color .25s, transform .25s; display: flex; flex-direction: column; height: 100%; }
        .msub-card:hover { border-color: rgba(var(--ar),0.4); transform: translateY(-2px); }
        .msub-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--ac), transparent); }
        .msub-card.platform .msub-name { font-size: 20px; }
        .msub-card.platform .msub-desc { font-size: 12px; color: rgba(255,255,255,0.45); }
        .msub-badge { display: inline-flex; align-items: center; gap: 5px; align-self: flex-start; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.25); color: rgba(251,191,36,0.85); font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 3px 10px; border-radius: 9999px; margin-bottom: 12px; }
        .msub-name { font-size: 24px; margin-bottom: 5px; }
        .msub-type { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(var(--ar),0.6); margin-bottom: 16px; }
        .msub-model { display: inline-flex; align-self: flex-start; align-items: center; background: rgba(var(--ar),0.08); border: 1px solid rgba(var(--ar),0.2); color: rgba(var(--ar),0.8); font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 3px 10px; border-radius: 9999px; margin-bottom: 14px; }
        .msub-statrow { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .msub-statrow.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .msub-stat { background: rgba(var(--ar),0.06); border: 1px solid rgba(var(--ar),0.15); border-radius: 10px; padding: 10px 14px; }
        .msub-stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(var(--ar),0.5); margin-bottom: 3px; }
        .msub-stat-value { font-size: 13px; font-weight: 700; color: #fff; }
        .msub-bestfor { display: inline-flex; align-self: flex-start; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.45); font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px; }
        .msub-desc { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.65; margin-bottom: 16px; flex: 1; }
        .msub-taglabel { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,0.3); margin-bottom: 8px; }
        .msub-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }
        .msub-tag { font-size: 11px; color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 9999px; }
        .msub-grid[data-cols="2"] { grid-template-columns: repeat(2,1fr); }
        .msub-grid[data-cols="3"] { grid-template-columns: repeat(3,1fr); }
        .msub-grid[data-cols="4"] { grid-template-columns: repeat(4,1fr); }
        @media (max-width: 1000px) { .msub-grid[data-cols="4"] { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 860px) { .msub-grid[data-cols="3"] { grid-template-columns: 1fr; } }
        @media (max-width: 720px) { .msub-grid[data-cols="2"] { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .msub-grid { grid-template-columns: 1fr !important; } .msub-h1 { font-size: 36px !important; } }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <div className="msub-crumb" style={{ padding: "20px 0 0", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          <Link to="/academy">Academy</Link>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>›</span>
          <Link to={entry.groupPath}>{entry.groupTitle}</Link>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>{entry.breadcrumbLabel}</span>
        </div>

        <div style={{ padding: "48px 0", borderBottom: "1px solid #1e1e35", marginBottom: entry.warning ? 32 : 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", background: `rgba(${ar},0.1)`, border: `1px solid rgba(${ar},0.25)`, color: ac, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 9999, marginBottom: 20 }}>{entry.catPill}</div>
          <h1 className="msub-h1" style={{ fontFamily: "'Fraunces', serif", fontSize: 48, lineHeight: 1.05, marginBottom: 16 }}>{entry.title}</h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 660, marginBottom: 24 }}>{entry.intro}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            {entry.stats.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                  {s.hi && <span style={{ color: ac, fontWeight: 600 }}>{s.hi} </span>}
                  {s.text}
                </span>
                {i < entry.stats.length - 1 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />}
              </div>
            ))}
          </div>
        </div>

        {entry.warning && (
          <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 12, padding: "16px 20px", marginBottom: 40, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>⚠️</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: entry.warning }} />
          </div>
        )}

        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: 24 }}>{entry.itemsLabel}</div>

        <div className="msub-grid" data-cols={entry.gridCols}>
          {entry.cards.map((card, i) => (
            <Card key={i} card={card} variant={entry.variant} statLayout={entry.statLayout} />
          ))}
        </div>
      </div>
    </div>
  );
}
