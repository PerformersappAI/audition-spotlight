import { useEffect } from "react";
import { ToolSeo, ToolLead } from "@/components/ToolSeo";

export default function Marketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        background: "#0a0a12",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "'Inter Tight', sans-serif",
      }}
    >
      <ToolSeo path="/marketing" />
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "96px 24px 80px",
        }}
      >
        <h1
          className="text-center"
          style={{
            fontFamily: "'Anton', 'Archivo Black', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            fontSize: "clamp(34px, 7vw, 76px)",
            lineHeight: 1.05,
            color: "#00d4aa",
          }}
        >
          Marketing in a Box
        </h1>
        <ToolLead path="/marketing" />
      </div>
    </div>
  );
}
