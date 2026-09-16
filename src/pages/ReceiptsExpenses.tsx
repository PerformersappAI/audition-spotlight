import { useState } from "react";
import Seo from "@/components/Seo";
import ProductionPicker, { panel, type Production } from "@/components/production/ProductionPicker";

const SITE = "https://filmmakergenius.com";

const STEPS = [
  { n: 1, title: "Pick your production", text: "The same productions you use for script breakdowns." },
  { n: 2, title: "Crew submit receipts or invoices", text: "Snap a photo on set, or build an invoice." },
  { n: 3, title: "Approve, reject or mark paid", text: "You decide what gets reimbursed." },
  { n: 4, title: "Export for your accountant", text: "Clean reports by department and currency." },
];

const ReceiptsExpenses = () => {
  const [selectedProject, setSelectedProject] = useState<Production | null>(null);

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "60vh" }}>
      <Seo
        title="Film Production Expense Tracker — Receipts & Invoices | Filmmaker Genius"
        description="Crew snap receipts or create invoices; producers approve, track spend by department and currency, and export reports."
        canonical={`${SITE}/receipts-expenses`}
      />
      <style>{`
        @media (max-width: 800px) { .re-steps { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) {
          .re-steps { grid-template-columns: 1fr !important; }
          .re-h1 { font-size: 34px !important; }
          .sb-row { flex-direction: column !important; align-items: stretch !important; }
          .sb-row > * { width: 100%; }
        }
        .re-step-num {
          width: 28px; height: 28px; border-radius: 9999px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,212,170,0.12); color: #00d4aa;
          border: 1px solid rgba(0,212,170,0.4);
          font-size: 13px; font-weight: 700; flex: 0 0 auto;
        }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", overflowX: "hidden" }}>
        {/* HERO */}
        <div style={{ padding: "64px 0 36px", textAlign: "center" }}>
          <h1 className="re-h1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 52, lineHeight: 1.05, margin: 0 }}>
            Receipts &amp; Expenses
          </h1>
          <p style={{ marginTop: 16, fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 720, margin: "16px auto 0", lineHeight: 1.65 }}>
            Crew snap receipts or build invoices from set. You approve them, track spending by department, and export clean reports.
          </p>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ paddingBottom: 40 }}>
          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", marginBottom: 20,
          }}>How it works</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="re-steps">
            {STEPS.map((s) => (
              <div key={s.n} style={{
                borderRadius: 16, padding: 20,
                background: "linear-gradient(135deg, #071820 0%, #0a2a30 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <span className="re-step-num">{s.n}</span>
                <div>
                  <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 6, lineHeight: 1.5 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTIONS */}
        <ProductionPicker
          emptyText="Give it a name, then log every receipt and invoice against it."
          onSelect={setSelectedProject}
        />

        {/* PLACEHOLDER */}
        {selectedProject && (
          <div style={{ ...panel, padding: 32, textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700 }}>Expense tracking is coming next.</div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 10, lineHeight: 1.6 }}>
              Receipts, invoices and approvals for {selectedProject.title} will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptsExpenses;
