import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { panel, inputStyle } from "@/components/production/ProductionPicker";
import { formatMoney, round2 } from "@/lib/expenses/currency";
import { STATUSES, type Expense } from "@/lib/expenses/types";

const TEAL = "#00d4aa";

/** One money line per currency — amounts are never summed across currencies. */
const byCurrency = (rows: Expense[]) => {
  const map = new Map<string, number>();
  rows.forEach((r) => map.set(r.currency, round2((map.get(r.currency) || 0) + Number(r.amount || 0))));
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
};

const moneyLine = (rows: Expense[]) => {
  const list = byCurrency(rows);
  if (!list.length) return "—";
  return list.map(([code, total]) => formatMoney(total, code)).join(" · ");
};

interface Props {
  expenses: Expense[];
  defaultCurrency: string;
}

const cardStyle: React.CSSProperties = {
  ...panel, padding: 16, display: "flex", flexDirection: "column", gap: 6, minWidth: 0,
};

const ExpenseSummary = ({ expenses, defaultCurrency }: Props) => {
  const currencies = useMemo(() => {
    const set = new Set(expenses.map((e) => e.currency));
    set.add(defaultCurrency);
    return Array.from(set);
  }, [expenses, defaultCurrency]);

  const [chartCurrency, setChartCurrency] = useState(defaultCurrency);
  const activeCurrency = currencies.includes(chartCurrency) ? chartCurrency : currencies[0];

  const approved = expenses.filter((e) => e.status === "approved");
  const pending = expenses.filter((e) => e.status === "pending");
  const paid = expenses.filter((e) => e.status === "paid");
  const rejected = expenses.filter((e) => e.status === "rejected");

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    expenses
      .filter((e) => e.currency === activeCurrency && ["approved", "paid", "pending"].includes(e.status))
      .forEach((e) => map.set(e.department, round2((map.get(e.department) || 0) + Number(e.amount || 0))));
    return Array.from(map.entries())
      .map(([department, total]) => ({ department, total }))
      .sort((a, b) => b.total - a.total);
  }, [expenses, activeCurrency]);

  const cards = [
    { title: "Total submitted", value: moneyLine(expenses), sub: `${expenses.length} entr${expenses.length === 1 ? "y" : "ies"}`, color: "#fff" },
    { title: "Approved", value: moneyLine(approved), sub: `${approved.length}`, color: STATUSES[1].color },
    { title: "Pending", value: moneyLine(pending), sub: `${pending.length}`, color: STATUSES[0].color },
    { title: "Paid", value: moneyLine(paid), sub: `${paid.length}`, color: TEAL },
    { title: "Rejected", value: String(rejected.length), sub: rejected.length === 1 ? "entry" : "entries", color: STATUSES[2].color },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="ex-cards" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {cards.map((c) => (
          <div key={c.title} style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{c.title}</div>
            <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 17, fontWeight: 700, color: c.color, lineHeight: 1.35, wordBreak: "break-word" }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ ...panel, padding: 18, marginTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700 }}>Spend by department</div>
          <select
            aria-label="Chart currency"
            value={activeCurrency}
            onChange={(e) => setChartCurrency(e.target.value)}
            style={{ ...inputStyle, maxWidth: 140 }}
          >
            {currencies.map((c) => (
              <option key={c} value={c} style={{ background: "#10101b" }}>{c}</option>
            ))}
          </select>
        </div>
        {chartData.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Nothing logged in {activeCurrency} yet.</div>
        ) : (
          <div style={{ width: "100%", height: Math.max(160, chartData.length * 42 + 30) }}>
            <ResponsiveContainer>
              <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
                <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.07)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} tickFormatter={(v) => formatMoney(Number(v), activeCurrency)} />
                <YAxis type="category" dataKey="department" width={120} stroke="rgba(255,255,255,0.55)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "#10101b", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, color: "#fff" }}
                  formatter={(v) => formatMoney(Number(v), activeCurrency)}
                />
                <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                  {chartData.map((d) => <Cell key={d.department} fill={TEAL} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
          Approved, paid and pending amounts in {activeCurrency}.
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;
