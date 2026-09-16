import { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import ProductionPicker, { inputStyle, type Production } from "@/components/production/ProductionPicker";
import ExpenseWorkspace from "@/components/expenses/ExpenseWorkspace";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CURRENCIES } from "@/lib/expenses/currency";

const SITE = "https://filmmakergenius.com";

const STEPS = [
  { n: 1, title: "Pick your production", text: "The same productions you use for script breakdowns." },
  { n: 2, title: "Crew submit receipts or invoices", text: "Snap a photo on set, or build an invoice." },
  { n: 3, title: "Approve, reject or mark paid", text: "You decide what gets reimbursed." },
  { n: 4, title: "Export for your accountant", text: "Clean reports by department and currency." },
];

const ReceiptsExpenses = () => {
  const { user, userProfile } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Production | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [notify, setNotify] = useState<boolean | null>(null);

  const actorName = useMemo(() => {
    const first = (userProfile?.first_name || userProfile?.full_name || "").toString().trim().split(/\s+/)[0];
    if (first) return first;
    const email = user?.email || "";
    return email.includes("@") ? email.split("@")[0] : "Producer";
  }, [userProfile, user]);

  const activeCurrency = currency ?? selectedProject?.default_currency ?? "USD";
  const notifyExpenses = notify ?? selectedProject?.notify_expenses ?? true;

  const changeCurrency = async (next: string) => {
    if (!selectedProject) return;
    setCurrency(next);
    await supabase.from("breakdown_projects").update({ default_currency: next }).eq("id", selectedProject.id);
  };

  const changeNotify = async (next: boolean) => {
    if (!selectedProject) return;
    setNotify(next);
    await supabase.from("breakdown_projects").update({ notify_expenses: next }).eq("id", selectedProject.id);
  };

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "60vh" }}>
      <Seo
        title="Film Production Expense Tracker — Receipts & Invoices | Filmmaker Genius"
        description="Crew snap receipts or create invoices; producers approve, track spend by department and currency, and export reports."
        canonical={`${SITE}/receipts-expenses`}
      />
      <style>{`
        @media (max-width: 900px) { .ex-cards { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 800px) { .re-steps { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 860px) {
          .ex-table { display: none !important; }
          .ex-cards-list { display: flex !important; }
          .ex-filters { grid-template-columns: 1fr 1fr !important; }
          .ex-filters > div:first-child { grid-column: span 2 !important; }
        }
        @media (max-width: 560px) {
          .re-steps { grid-template-columns: 1fr !important; }
          .re-h1 { font-size: 34px !important; }
          .ex-cards { grid-template-columns: 1fr !important; }
          .ex-filters { grid-template-columns: 1fr !important; }
          .ex-filters > div:first-child { grid-column: span 1 !important; }
          .ex-form { grid-template-columns: 1fr !important; }
          .ex-form > div { grid-column: span 1 !important; }
          .ex-invline { grid-template-columns: 1fr 1fr !important; }
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
          onSelect={(p) => { setSelectedProject(p); setCurrency(null); setNotify(null); }}
          extraControls={selectedProject ? (
            <>
              <select
                aria-label="Default currency"
                value={activeCurrency}
                onChange={(e) => changeCurrency(e.target.value)}
                style={{ ...inputStyle, maxWidth: 210 }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} style={{ background: "#10101b" }}>{c.label}</option>
                ))}
              </select>
              <label style={{
                display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, padding: "0 14px",
                borderRadius: 10, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)",
                fontSize: 14, color: "rgba(255,255,255,0.8)", cursor: "pointer", whiteSpace: "nowrap",
              }}>
                <input
                  type="checkbox"
                  checked={notifyExpenses}
                  onChange={(e) => changeNotify(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "#00d4aa" }}
                />
                Email me when crew submit
              </label>
            </>
          ) : undefined}
        />

        {selectedProject && (
          <ExpenseWorkspace
            key={selectedProject.id}
            projectId={selectedProject.id}
            productionTitle={selectedProject.title}
            company={selectedProject.company}
            defaultCurrency={activeCurrency}
            actorName={actorName}
          />
        )}
      </div>
    </div>
  );
};

export default ReceiptsExpenses;
