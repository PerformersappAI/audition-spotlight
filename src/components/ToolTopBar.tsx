import { Link } from "react-router-dom";

export default function ToolTopBar() {
  return (
    <div
      style={{
        width: "100%",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "transparent",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 24px",
          height: 48,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          to="/toolbox"
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
            transition: "color 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4aa")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
          }
        >
          <span style={{ fontSize: 13 }}>←</span>
          Back to Toolbox
        </Link>
      </div>
    </div>
  );
}
