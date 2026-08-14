import { Link, useParams, useLocation } from "react-router-dom";
import Seo from "@/components/Seo";
import { AcademyByline, academyJsonLd } from "@/lib/academyAuthor";
import { glePlatforms } from "@/data/glePlatforms";

function SectionHead({ children }: { children: React.ReactNode }) {
  return <h2 className="glp-h2">{children}</h2>;
}

export default function GlePlatformPage() {
  const { tier, platform } = useParams<{ tier: string; platform: string }>();
  const location = useLocation();
  const canonical = `https://filmmakergenius.com${location.pathname.replace(/\/$/, "")}`;
  const entry = platform ? glePlatforms[platform] : undefined;
  const tierPath = `/green-light-engine/${tier || "tier-1"}`;

  if (!entry) {
    return (
      <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px" }}>
        <Seo title="Coming Soon — Major Streamers | Filmmaker Genius" description="This platform breakdown is coming soon on the Filmmaker Genius Green Light Engine." canonical="https://filmmakergenius.com/green-light-engine/tier-1" />
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 44, marginBottom: 16 }}>Coming soon</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>This platform breakdown isn't published yet.</p>
        <Link to="/green-light-engine/tier-1" style={{ color: "#40bcf4", fontWeight: 600, textDecoration: "none" }}>← Back to Major Streamers</Link>
      </div>
    );
  }

  const ac = entry.accent;
  const ar = entry.accentRgb;

  return (
    <div className="glp-root" style={{ ["--ac" as any]: ac, ["--ar" as any]: ar, background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Seo
        title={entry.seoTitle}
        description={entry.seoDescription}
        canonical={canonical}
        jsonLd={[
          academyJsonLd({
            type: "Article",
            headline: entry.h1,
            description: entry.seoDescription,
            url: canonical,
            isPartOf: { type: "Article", name: "Green Light Engine", url: "https://filmmakergenius.com/green-light-engine" },
          }),
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Green Light Engine", item: "https://filmmakergenius.com/green-light-engine" },
              { "@type": "ListItem", position: 2, name: "Major Streamers", item: `https://filmmakergenius.com${tierPath}` },
              { "@type": "ListItem", position: 3, name: entry.name, item: canonical },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: entry.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <style>{`
        .glp-root h1, .glp-root h2, .glp-root h3 { font-family: 'Fraunces', serif; letter-spacing: -0.02em; font-weight: 700; margin: 0; }
        .glp-root h3 { font-family: 'Inter Tight', system-ui, sans-serif; letter-spacing: 0; }
        .glp-crumb a { color: rgba(255,255,255,0.3); text-decoration: none; transition: color .2s; }
        .glp-crumb a:hover { color: var(--ac); }
        .glp-h2 { font-size: 30px; margin: 0 0 22px !important; }
        .glp-section { padding: 40px 0; border-top: 1px solid #1e1e35; }
        .glp-p { font-size: 15px; color: rgba(255,255,255,0.55); line-height: 1.7; }
        .glp-callout { background: rgba(var(--ar),0.07); border: 1px solid rgba(var(--ar),0.25); border-radius: 14px; padding: 20px 24px; }
        .glp-warn { background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.25); border-radius: 12px; padding: 16px 20px; display: flex; gap: 12px; align-items: flex-start; }
        .glp-note { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px 20px; }
        .glp-grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .glp-grid2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 18px; }
        .glp-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; position: relative; overflow: hidden; transition: border-color .25s, transform .25s; display: flex; flex-direction: column; }
        .glp-card:hover { border-color: rgba(var(--ar),0.4); transform: translateY(-2px); }
        .glp-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--ac), transparent); }
        .glp-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(var(--ar),0.7); margin-bottom: 10px; }
        .glp-cardtitle { font-size: 19px; margin-bottom: 10px !important; }
        .glp-verdict { margin-top: 14px; align-self: flex-start; font-size: 11px; font-weight: 700; color: rgba(var(--ar),0.9); background: rgba(var(--ar),0.09); border: 1px solid rgba(var(--ar),0.22); padding: 4px 12px; border-radius: 9999px; }
        .glp-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .glp-chip { font-size: 12px; color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 5px 13px; border-radius: 9999px; }
        .glp-rows { border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; overflow: hidden; }
        .glp-row { display: grid; grid-template-columns: 240px 1fr; gap: 18px; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .glp-row:last-child { border-bottom: none; }
        .glp-row-l { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: rgba(var(--ar),0.75); }
        .glp-row-v { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.6; }
        .glp-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .glp-table th { text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,0.35); padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .glp-table td { padding: 14px 16px; color: rgba(255,255,255,0.6); border-bottom: 1px solid rgba(255,255,255,0.06); vertical-align: top; line-height: 1.6; }
        .glp-table td:first-child { color: #fff; font-weight: 600; white-space: nowrap; }
        .glp-money { border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; overflow: hidden; }
        .glp-mrow { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; }
        .glp-mrow:last-child { border-bottom: none; }
        .glp-mrow .lbl { color: rgba(255,255,255,0.6); }
        .glp-mrow .val { font-weight: 700; font-variant-numeric: tabular-nums; }
        .glp-mrow[data-k="minus"] .val { color: #ff6b6b; }
        .glp-mrow[data-k="plus"] .val { color: rgba(var(--ar),0.95); }
        .glp-mrow[data-k="net"] { background: rgba(var(--ar),0.08); }
        .glp-mrow[data-k="net"] .lbl { color: #fff; font-weight: 700; }
        .glp-mrow[data-k="net"] .val { color: var(--ac); font-size: 18px; }
        .glp-flow { display: grid; grid-template-columns: repeat(5,1fr); gap: 10px; align-items: stretch; }
        .glp-flowstep { background: #0d0d1a; border: 1px solid rgba(var(--ar),0.2); border-radius: 14px; padding: 18px 16px; }
        .glp-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; counter-reset: s; }
        .glp-steps li { counter-increment: s; display: grid; grid-template-columns: 40px 1fr; gap: 16px; background: #0d0d1a; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px 20px; }
        .glp-steps li::before { content: counter(s); font-weight: 800; font-size: 15px; color: var(--ac); background: rgba(var(--ar),0.1); border: 1px solid rgba(var(--ar),0.25); border-radius: 10px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; }
        .glp-faq details { background: #0d0d1a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 0; margin-bottom: 10px; }
        .glp-faq summary { cursor: pointer; list-style: none; padding: 16px 20px; font-size: 15px; font-weight: 600; display: flex; justify-content: space-between; gap: 14px; }
        .glp-faq summary::-webkit-details-marker { display: none; }
        .glp-faq summary::after { content: '+'; color: var(--ac); font-weight: 800; }
        .glp-faq details[open] summary::after { content: '−'; }
        .glp-faq p { padding: 0 20px 18px; font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.7; margin: 0; }
        @media (max-width: 900px) {
          .glp-grid3, .glp-grid2 { grid-template-columns: 1fr; }
          .glp-flow { grid-template-columns: 1fr; }
          .glp-row { grid-template-columns: 1fr; gap: 6px; }
          .glp-h1 { font-size: 34px !important; }
          .glp-h2 { font-size: 25px; }
          .glp-tablewrap { overflow-x: auto; }
        }
      `}</style>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 90px" }}>
        <div className="glp-crumb" style={{ padding: "20px 0 0", display: "flex", alignItems: "center", gap: 8, fontSize: 13, flexWrap: "wrap", color: "rgba(255,255,255,0.3)" }}>
          <Link to="/green-light-engine">Green Light Engine</Link>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>›</span>
          <Link to={tierPath}>Major Streamers</Link>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>{entry.name}</span>
        </div>

        {/* HERO */}
        <div style={{ padding: "44px 0 36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", background: `rgba(${ar},0.1)`, border: `1px solid rgba(${ar},0.25)`, color: ac, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 9999, marginBottom: 20 }}>{entry.catPill}</div>
          <h1 className="glp-h1" style={{ fontSize: 46, lineHeight: 1.06, marginBottom: 16 }}>{entry.h1}</h1>
          <p className="glp-p" style={{ fontSize: 17, maxWidth: 700, marginBottom: 10 }}>{entry.intro}</p>
          <AcademyByline style={{ margin: "0 0 20px" }} />
          <div className="glp-chips">
            {entry.stats.map((s, i) => (
              <span className="glp-chip" key={i}>
                {s.hi && <strong style={{ color: ac }}>{s.hi} </strong>}
                {s.text}
              </span>
            ))}
          </div>
        </div>

        <div className="glp-callout" style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: ac, marginBottom: 8 }}>Important</div>
          <p className="glp-p" style={{ margin: 0 }}>{entry.introCallout}</p>
        </div>

        {/* DOORS */}
        <section className="glp-section">
          <SectionHead>{entry.doors.heading}</SectionHead>
          <div className="glp-grid3">
            {entry.doors.cards.map((c, i) => (
              <div className="glp-card" key={i}>
                <div className="glp-label">{c.label}</div>
                <h3 className="glp-cardtitle">{c.title}</h3>
                <p className="glp-p" style={{ fontSize: 13.5, flex: 1, margin: 0 }}>{c.desc}</p>
                <span className="glp-verdict">{c.verdict}</span>
              </div>
            ))}
          </div>
          {entry.doors.note && (
            <div className="glp-note" style={{ marginTop: 18 }}>
              <p className="glp-p" style={{ margin: 0, fontSize: 14 }}>{entry.doors.note}</p>
            </div>
          )}
        </section>

        {/* WANTS */}
        <section className="glp-section">
          <SectionHead>{entry.wants.heading}</SectionHead>
          {entry.wants.cards && (
            <div className="glp-grid3">
              {entry.wants.cards.map((c, i) => (
                <div className="glp-card" key={i}>
                  <div className="glp-label">{c.label}</div>
                  <h3 className="glp-cardtitle">{c.title}</h3>
                  <p className="glp-p" style={{ fontSize: 13.5, flex: 1, margin: 0 }}>{c.desc}</p>
                  <span className="glp-verdict">{c.verdict}</span>
                </div>
              ))}
            </div>
          )}
          {entry.wants.genres && (
            <div style={{ marginBottom: 20 }}>
              <div className="glp-label">{entry.wants.genresLabel}</div>
              <div className="glp-chips">
                {entry.wants.genres.map((g, i) => (
                  <span className="glp-chip" key={i}>{g}</span>
                ))}
              </div>
            </div>
          )}
          {entry.wants.hardest && (
            <div className="glp-warn" style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
              <p className="glp-p" style={{ margin: 0, fontSize: 14 }}>{entry.wants.hardest}</p>
            </div>
          )}
          {entry.wants.levers && (
            <>
              <div className="glp-label">{entry.wants.leversLabel}</div>
              <div className="glp-grid2">
                {entry.wants.levers.map((l, i) => (
                  <div className="glp-card" key={i}>
                    <h3 className="glp-cardtitle">{l.title}</h3>
                    <p className="glp-p" style={{ fontSize: 13.5, margin: 0 }}>{l.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {(entry.wants.test || entry.wants.note) && (
            <div className="glp-callout" style={{ marginTop: 20 }}>
              <p className="glp-p" style={{ margin: 0 }}>{entry.wants.test || entry.wants.note}</p>
            </div>
          )}
          {entry.wants.test && entry.wants.note && (
            <div className="glp-note" style={{ marginTop: 14 }}>
              <p className="glp-p" style={{ margin: 0, fontSize: 14 }}>{entry.wants.note}</p>
            </div>
          )}
        </section>

        {/* PARTNERS */}
        {entry.partners && (
          <section className="glp-section">
            <SectionHead>{entry.partners.heading}</SectionHead>
            <div className="glp-grid2">
              {entry.partners.blocks.map((b, i) => (
                <div className="glp-card" key={i}>
                  <h3 className="glp-cardtitle">{b.title}</h3>
                  <p className="glp-p" style={{ fontSize: 13.5, margin: 0 }}>{b.desc}</p>
                </div>
              ))}
            </div>
            {entry.partners.remember && (
              <div className="glp-callout" style={{ marginTop: 18 }}>
                <p className="glp-p" style={{ margin: 0 }}>{entry.partners.remember}</p>
              </div>
            )}
            {entry.partners.tableRows && (
              <div className="glp-tablewrap" style={{ marginTop: 24, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
                <table className="glp-table">
                  <thead>
                    <tr>{entry.partners.tableHead?.map((h, i) => <th key={i}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {entry.partners.tableRows.map((r, i) => (
                      <tr key={i}>{r.cells.map((c, j) => <td key={j}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {entry.partners.footnote && (
              <div className="glp-note" style={{ marginTop: 18 }}>
                <p className="glp-p" style={{ margin: 0, fontSize: 14 }}>{entry.partners.footnote}</p>
              </div>
            )}
          </section>
        )}

        {/* FLOW */}
        {entry.flow && (
          <section className="glp-section">
            <SectionHead>{entry.flow.heading}</SectionHead>
            <div className="glp-flow">
              {entry.flow.steps.map((s, i) => (
                <div className="glp-flowstep" key={i}>
                  <div className="glp-label">Step {i + 1}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>{s.desc}</div>
                </div>
              ))}
            </div>
            {entry.flow.note && (
              <div className="glp-note" style={{ marginTop: 18 }}>
                <p className="glp-p" style={{ margin: 0, fontSize: 14 }}>{entry.flow.note}</p>
              </div>
            )}
          </section>
        )}

        {/* MONEY */}
        <section className="glp-section">
          <SectionHead>{entry.money.heading}</SectionHead>
          {entry.money.subhead && <p className="glp-p" style={{ marginBottom: 18 }}>{entry.money.subhead}</p>}
          <div className="glp-money">
            {entry.money.rows.map((r, i) => (
              <div className="glp-mrow" data-k={r.kind || "gross"} key={i}>
                <span className="lbl">{r.label}</span>
                <span className="val">{r.value}</span>
              </div>
            ))}
          </div>
          {entry.money.note && (
            <div className="glp-note" style={{ marginTop: 18 }}>
              <p className="glp-p" style={{ margin: 0, fontSize: 14 }}>{entry.money.note}</p>
            </div>
          )}
          {entry.money.warning && (
            <div className="glp-warn" style={{ marginTop: 14 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
              <p className="glp-p" style={{ margin: 0, fontSize: 14 }}>{entry.money.warning}</p>
            </div>
          )}
        </section>

        {/* TECHNICAL */}
        <section className="glp-section">
          <SectionHead>{entry.technical.heading}</SectionHead>
          {entry.technical.golden && (
            <div className="glp-callout" style={{ marginBottom: 24 }}>
              <p className="glp-p" style={{ margin: 0 }}>{entry.technical.golden}</p>
            </div>
          )}
          {entry.technical.groups.map((g, i) => (
            <div key={i} style={{ marginBottom: 22 }}>
              <div className="glp-label">{g.title}</div>
              {g.rows && (
                <div className="glp-rows">
                  {g.rows.map((r, j) => (
                    <div className="glp-row" key={j}>
                      <div className="glp-row-l">{r.label}</div>
                      <div className="glp-row-v">{r.value}</div>
                    </div>
                  ))}
                </div>
              )}
              {g.bullets && (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {g.bullets.map((b, j) => (
                    <li className="glp-p" style={{ fontSize: 14, marginBottom: 10 }} key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {entry.technical.qc && (
            <div className="glp-warn">
              <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
              <p className="glp-p" style={{ margin: 0, fontSize: 14 }}>{entry.technical.qc}</p>
            </div>
          )}
        </section>

        {/* CONTRACT */}
        <section className="glp-section">
          <SectionHead>{entry.contract.heading}</SectionHead>
          {entry.contract.intro && <p className="glp-p" style={{ marginBottom: 14 }}>{entry.contract.intro}</p>}
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {entry.contract.bullets.map((b, i) => (
              <li className="glp-p" style={{ fontSize: 14, marginBottom: 9 }} key={i}>{b}</li>
            ))}
          </ul>
          {entry.contract.kicker && (
            <div className="glp-warn" style={{ marginTop: 18 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
              <p className="glp-p" style={{ margin: 0, fontSize: 14 }}>{entry.contract.kicker}</p>
            </div>
          )}
        </section>

        {/* STEPS */}
        <section className="glp-section">
          <SectionHead>{entry.steps.heading}</SectionHead>
          <ol className="glp-steps">
            {entry.steps.items.map((s, i) => (
              <li key={i}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5 }}>{s.title}</div>
                  <div className="glp-p" style={{ fontSize: 13.5 }}>{s.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="glp-section">
          <SectionHead>Frequently asked questions</SectionHead>
          <div className="glp-faq">
            {entry.faq.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div style={{ paddingTop: 24 }}>
          <Link to={tierPath} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 10, padding: "11px 18px", textDecoration: "none" }}>← Back to Major Streamers</Link>
        </div>
      </div>
    </div>
  );
}
