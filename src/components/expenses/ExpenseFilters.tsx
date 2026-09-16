import { Search, X } from "lucide-react";
import { inputStyle, ghostBtn } from "@/components/production/ProductionPicker";
import { EXPENSE_DEPARTMENTS, PAYMENT_METHODS, STATUSES } from "@/lib/expenses/types";

export interface ExpenseFilterState {
  q: string;
  status: string;
  department: string;
  payment: string;
  from: string;
  to: string;
}

export const EMPTY_FILTERS: ExpenseFilterState = {
  q: "", status: "", department: "", payment: "", from: "", to: "",
};

interface Props {
  value: ExpenseFilterState;
  onChange: (next: Partial<ExpenseFilterState>) => void;
  onReset: () => void;
}

const label: React.CSSProperties = {
  fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6, display: "block",
  fontFamily: "'Inter Tight', sans-serif",
};

const ExpenseFilters = ({ value, onChange, onReset }: Props) => {
  const active = Object.values(value).some(Boolean);
  return (
    <div style={{ marginBottom: 20 }}>
      <div className="ex-filters" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <div style={{ gridColumn: "span 3" }}>
          <label style={label} htmlFor="ex-q">Search</label>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: 14, color: "rgba(255,255,255,0.35)" }} />
            <input
              id="ex-q"
              value={value.q}
              onChange={(e) => onChange({ q: e.target.value })}
              placeholder="Vendor, description, notes or who submitted it"
              style={{ ...inputStyle, paddingLeft: 36 }}
            />
          </div>
        </div>
        <div>
          <label style={label} htmlFor="ex-status">Status</label>
          <select id="ex-status" value={value.status} onChange={(e) => onChange({ status: e.target.value })} style={inputStyle}>
            <option value="" style={{ background: "#10101b" }}>All statuses</option>
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key} style={{ background: "#10101b" }}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={label} htmlFor="ex-dept">Department</label>
          <select id="ex-dept" value={value.department} onChange={(e) => onChange({ department: e.target.value })} style={inputStyle}>
            <option value="" style={{ background: "#10101b" }}>All departments</option>
            {EXPENSE_DEPARTMENTS.map((d) => (
              <option key={d} value={d} style={{ background: "#10101b" }}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={label} htmlFor="ex-pay">Payment</label>
          <select id="ex-pay" value={value.payment} onChange={(e) => onChange({ payment: e.target.value })} style={inputStyle}>
            <option value="" style={{ background: "#10101b" }}>Any payment</option>
            {PAYMENT_METHODS.map((p) => (
              <option key={p.key} value={p.key} style={{ background: "#10101b" }}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={label} htmlFor="ex-from">From</label>
          <input id="ex-from" type="date" value={value.from} onChange={(e) => onChange({ from: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={label} htmlFor="ex-to">To</label>
          <input id="ex-to" type="date" value={value.to} onChange={(e) => onChange({ to: e.target.value })} style={inputStyle} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          {active && (
            <button onClick={onReset} style={{ ...ghostBtn, width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <X size={15} /> Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;
