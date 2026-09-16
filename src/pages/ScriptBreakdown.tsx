import Seo from "@/components/Seo";

const SITE = "https://filmmakergenius.com";

const STEPS = [
  { n: 1, title: "Upload your scene", text: "PDF or paste text." },
  { n: 2, title: "AI breaks it down by department", text: "Props, locations, wardrobe, makeup & SFX, vehicles." },
  { n: 3, title: "Share a private link with your crew", text: "One link per scene — no accounts needed." },
  { n: 4, title: "Check items off, add photos, sign off", text: "Everyone works from the same checklist." },
];

const ScriptBreakdown = () => {
  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "60vh" }}>
      <Seo
        title="Script Breakdown Tool for Indie Films | Filmmaker Genius"
        description="Turn any scene into department checklists for props, locations, wardrobe, makeup and vehicles, and share them with your crew."
        canonical={`${SITE}/script-breakdown`}
      />
      <style>{`
        @media (max-width: 800px) { .sb-steps { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .sb-steps { grid-template-columns: 1fr !important; } }
        .sb-step-num {
          width: 28px; height: 28px; border-radius: 9999px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,212,170,0.12); color: #00d4aa;
          border: 1px solid rgba(0,212,170,0.4);
          font-size: 13px; font-weight: 700; flex: 0 0 auto;
        }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        {/* HERO */}
        <div style={{ padding: "72px 0 40px", textAlign: "center" }}>
          <span style={{
            display: "inline-block", fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", padding: "4px 12px", borderRadius: 9999,
            color: "#00d4aa", background: "rgba(0,212,170,0.08)",
            border: "1px solid rgba(0,212,170,0.3)",
          }}>Coming Soon</span>
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 52,
            lineHeight: 1.05, margin: "20px 0 0",
          }}>Script Breakdown</h1>
          <p style={{
            marginTop: 16, fontSize: 16, color: "rgba(255,255,255,0.6)",
            maxWidth: 720, margin: "16px auto 0", lineHeight: 1.65,
          }}>Upload a scene and get a department-by-department checklist — props, locations, wardrobe, makeup &amp; SFX, and vehicles — that your whole crew can work from on set.</p>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ paddingBottom: 56 }}>
          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", marginBottom: 20,
          }}>How it works</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}
            className="sb-steps">
            {STEPS.map((s) => (
              <div key={s.n} style={{
                borderRadius: 16, padding: 20,
                background: "linear-gradient(135deg, #071820 0%, #0a2a30 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <span className="sb-step-num">{s.n}</span>
                <div>
                  <div style={{
                    fontFamily: "'Inter Tight', sans-serif", fontSize: 15,
                    fontWeight: 700, color: "#fff", lineHeight: 1.3,
                  }}>{s.title}</div>
                  <div style={{
                    fontSize: 13, color: "rgba(255,255,255,0.55)",
                    marginTop: 6, lineHeight: 1.5,
                  }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UPLOAD PANEL — placeholder */}
        <div style={{ paddingBottom: 96 }}>
          <div style={{
            borderRadius: 16, border: "2px dashed rgba(255,255,255,0.14)",
            padding: "64px 24px", textAlign: "center",
            background: "rgba(255,255,255,0.02)",
          }}>
            <div style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 16,
              fontWeight: 600, color: "rgba(255,255,255,0.45)",
            }}>Scene upload coming soon</div>
            <div style={{
              fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 8,
            }}>You'll be able to drop in a PDF or paste scene text here.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptBreakdown;
