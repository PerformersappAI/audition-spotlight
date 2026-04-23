import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText, Loader2, Presentation, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PitchDeckData } from "./PitchDeckMaker";
import { STYLE_TEMPLATES } from "@/components/pitchdeck/Step3CharactersVisuals";

// ---------- helpers ----------
const ACCENT = "#f5a623";
const BG = "#0a0a0f";
const SURFACE = "#12121a";
const CARD = "#1a1a26";
const WHITE = "#f0f0f0";
const MUTED = "#6b6b7a";

const projectTypeLabels: Record<string, string> = {
  feature: "Feature Film",
  tv_series: "TV Series",
  mini_series: "Mini-Series",
  short: "Short Film",
  documentary: "Documentary",
};

const SLIDE_W = 1280;
const SLIDE_H = 720;

// Slide wrapper with fixed 16:9 dimensions, scaled to fit container
function Slide({
  id,
  children,
  background,
}: {
  id: string;
  children: React.ReactNode;
  background?: string;
}) {
  return (
    <div className="flex justify-center">
      <div
        id={id}
        data-slide
        style={{
          width: `${SLIDE_W}px`,
          height: `${SLIDE_H}px`,
          background: background || BG,
          color: WHITE,
          position: "relative",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          overflow: "hidden",
          borderLeft: `3px solid ${ACCENT}`,
          transform: "scale(var(--slide-scale, 1))",
          transformOrigin: "top center",
        }}
      >
        <div style={{ padding: "60px", height: "100%", boxSizing: "border-box" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      color: ACCENT,
      fontSize: "13px",
      letterSpacing: "0.2em",
      fontWeight: 600,
      marginBottom: "16px",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    }}
  >
    {children}
  </div>
);

const Pill = ({ children, solid = true }: { children: React.ReactNode; solid?: boolean }) => (
  <span
    style={{
      display: "inline-block",
      padding: "6px 14px",
      borderRadius: "999px",
      backgroundColor: solid ? ACCENT : "transparent",
      border: solid ? "none" : `1px solid ${ACCENT}`,
      color: solid ? "#000" : ACCENT,
      fontSize: "13px",
      fontWeight: 600,
      marginRight: "8px",
      marginBottom: "8px",
    }}
  >
    {children}
  </span>
);

// ---------- main component ----------
const PitchDeckPreview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PitchDeckData | null>(null);
  const [storyImage, setStoryImage] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [exporting, setExporting] = useState<"pdf" | "pptx" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load draft data
  useEffect(() => {
    const saved = localStorage.getItem("pitchDeckDraft");
    if (!saved) {
      toast.error("No pitch deck data found");
      navigate("/pitch-deck");
      return;
    }
    try {
      setData(JSON.parse(saved));
    } catch {
      toast.error("Failed to load pitch deck");
      navigate("/pitch-deck");
    }
  }, [navigate]);

  const template = useMemo(() => {
    if (!data?.selectedTemplate) return STYLE_TEMPLATES[0];
    return STYLE_TEMPLATES.find((t) => t.id === data.selectedTemplate) || STYLE_TEMPLATES[0];
  }, [data]);

  // Generate AI scene image for Story slide
  useEffect(() => {
    if (!data || storyImage || generatingImage) return;
    const synopsis = (data.synopsis || "").slice(0, 80);
    if (!synopsis && !data.projectTitle) return;
    setGeneratingImage(true);
    const prompt = `Cinematic film still, ${data.genre?.join(", ") || "drama"}, ${data.toneMood || "dramatic"}, ${synopsis || data.projectTitle}, dramatic lighting, professional cinematography, no text`;
    supabase.functions
      .invoke("generate-pitch-poster", { body: { prompt, aspectRatio: "16:9" } })
      .then(({ data: res, error }) => {
        if (error) throw error;
        if (res?.imageUrl) setStoryImage(res.imageUrl);
      })
      .catch((e) => {
        console.error("Story image generation failed:", e);
      })
      .finally(() => setGeneratingImage(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Scale slides to viewport width
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const available = containerRef.current.clientWidth - 40;
      const scale = Math.min(1, available / SLIDE_W);
      containerRef.current.style.setProperty("--slide-scale", String(scale));
      // Adjust each slide's wrapper height to match scaled height
      containerRef.current.querySelectorAll<HTMLElement>("[data-slide]").forEach((el) => {
        el.parentElement!.style.height = `${SLIDE_H * scale + 24}px`;
      });
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [data]);

  // ---------- export: PDF ----------
  const exportPDF = async () => {
    if (!data) return;
    setExporting("pdf");
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const slides = Array.from(document.querySelectorAll<HTMLElement>("[data-slide]"));
      if (!slides.length) throw new Error("No slides to export");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [SLIDE_W, SLIDE_H] });
      for (let i = 0; i < slides.length; i++) {
        const el = slides[i];
        // Temporarily un-scale for full-res capture
        const prev = el.style.transform;
        el.style.transform = "scale(1)";
        const canvas = await html2canvas(el, {
          backgroundColor: BG,
          scale: 1,
          width: SLIDE_W,
          height: SLIDE_H,
          useCORS: true,
        });
        el.style.transform = prev;
        const img = canvas.toDataURL("image/jpeg", 0.92);
        if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], "landscape");
        pdf.addImage(img, "JPEG", 0, 0, SLIDE_W, SLIDE_H);
      }
      const name = `${data.projectTitle || "Pitch-Deck"}.pdf`.replace(/[^a-zA-Z0-9.-]/g, "_");
      pdf.save(name);
      toast.success("PDF downloaded");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "PDF export failed");
    } finally {
      setExporting(null);
    }
  };

  // ---------- export: PPTX ----------
  const exportPPTX = async () => {
    if (!data) return;
    setExporting("pptx");
    try {
      const PptxGenJS = (await import("pptxgenjs")).default;
      const pres = new PptxGenJS();
      pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
      pres.defineLayout({ name: "DECK", width: 13.33, height: 7.5 });
      pres.layout = "DECK";

      const accent = "F5A623";
      const white = "F0F0F0";
      const muted = "6B6B7A";
      const bg = "0A0A0F";

      const addBase = () => {
        const s = pres.addSlide();
        s.background = { color: bg };
        s.addShape("rect", { x: 0, y: 0, w: 0.04, h: 7.5, fill: { color: accent } });
        return s;
      };

      // 1. Cover
      const s1 = addBase();
      s1.addText(data.projectTitle || "Untitled", {
        x: 0.5, y: 2.8, w: 12.3, h: 1.2,
        fontSize: 54, bold: true, color: white, align: "center",
      });
      if (data.logline) {
        s1.addText(`"${data.logline}"`, {
          x: 1, y: 4.1, w: 11.3, h: 1, fontSize: 16, italic: true, color: accent, align: "center",
        });
      }
      s1.addText(
        [projectTypeLabels[data.projectType] || data.projectType, data.targetRating].filter(Boolean).join(" · "),
        { x: 0.5, y: 6.7, w: 6, h: 0.4, fontSize: 12, color: muted },
      );
      if (data.targetPlatforms?.length) {
        s1.addText(data.targetPlatforms.join(" · "), {
          x: 6.83, y: 6.7, w: 6, h: 0.4, fontSize: 12, color: accent, align: "right",
        });
      }

      // 2. Story
      if (data.synopsis) {
        const s = addBase();
        s.addText("THE STORY", { x: 0.5, y: 0.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: accent, charSpacing: 4 });
        s.addText(data.synopsis, { x: 0.5, y: 1.2, w: 6, h: 5.8, fontSize: 14, color: white });
        if (storyImage) {
          s.addImage({ data: storyImage, x: 7, y: 0.5, w: 5.83, h: 6.5 });
        }
      }

      // 3. Vision
      if (data.directorVision) {
        const s = addBase();
        s.addText("DIRECTOR'S VISION", { x: 0.5, y: 0.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: accent, charSpacing: 4 });
        s.addText(`"${data.directorVision}"`, {
          x: 1, y: 2.5, w: 11.3, h: 3, fontSize: 22, italic: true, color: white, align: "center",
        });
        if (data.toneMood) {
          s.addText(data.toneMood, { x: 1, y: 5.8, w: 11.3, h: 0.5, fontSize: 14, color: accent, align: "center" });
        }
      }

      // 4. Characters
      if (data.characters?.length) {
        const s = addBase();
        s.addText("CHARACTERS", { x: 0.5, y: 0.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: accent, charSpacing: 4 });
        const cols = 2;
        const cw = 5.9;
        const ch = 2.6;
        data.characters.slice(0, 4).forEach((c: any, i: number) => {
          const x = 0.5 + (i % cols) * (cw + 0.5);
          const y = 1.3 + Math.floor(i / cols) * (ch + 0.3);
          s.addShape("rect", { x, y, w: cw, h: ch, fill: { color: "1A1A26" }, line: { color: accent, width: 2 } });
          s.addText(c.name || "Unnamed", { x: x + 0.3, y: y + 0.2, w: cw - 0.6, h: 0.5, fontSize: 18, bold: true, color: white });
          s.addText(c.role || "", { x: x + 0.3, y: y + 0.75, w: cw - 0.6, h: 0.3, fontSize: 12, color: accent });
          s.addText(c.description || "", { x: x + 0.3, y: y + 1.15, w: cw - 0.6, h: ch - 1.3, fontSize: 11, color: white });
        });
      }

      // 5. Visual Style
      if (data.visualStyle || data.posterImage) {
        const s = addBase();
        s.addText("VISUAL STYLE", { x: 0.5, y: 0.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: accent, charSpacing: 4 });
        s.addText(template.label, { x: 0.5, y: 1.1, w: 6.5, h: 0.6, fontSize: 28, bold: true, color: white });
        if (data.visualStyle) {
          s.addText(data.visualStyle, { x: 0.5, y: 2, w: 6.5, h: 4.5, fontSize: 13, color: white });
        }
        if (data.posterImage) {
          s.addImage({ data: data.posterImage, x: 7.5, y: 0.5, w: 5.33, h: 6.5 });
        }
      }

      // 6. Comparables
      if (data.comparables?.length) {
        const s = addBase();
        s.addText("COMPARABLES", { x: 0.5, y: 0.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: accent, charSpacing: 4 });
        const cw = 4.0;
        data.comparables.slice(0, 3).forEach((c: any, i: number) => {
          const x = 0.5 + i * (cw + 0.4);
          s.addShape("rect", { x, y: 1.5, w: cw, h: 5, fill: { color: "1A1A26" } });
          s.addText(c.title || "—", { x: x + 0.3, y: 1.7, w: cw - 0.6, h: 0.6, fontSize: 18, bold: true, color: white });
          s.addText([c.year, c.revenue].filter(Boolean).join(" · "), {
            x: x + 0.3, y: 2.4, w: cw - 0.6, h: 0.4, fontSize: 12, color: accent,
          });
          s.addText(c.whySimilar || c.whyItCompares || "", {
            x: x + 0.3, y: 3, w: cw - 0.6, h: 3.4, fontSize: 11, color: white,
          });
        });
      }

      // 7. Market & Audience
      if (data.primaryDemographic || data.distributionPlan) {
        const s = addBase();
        s.addText("MARKET & AUDIENCE", { x: 0.5, y: 0.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: accent, charSpacing: 4 });
        s.addText("Primary Demographic", { x: 0.5, y: 1.3, w: 6, h: 0.4, fontSize: 12, color: muted });
        s.addText(data.primaryDemographic || "—", { x: 0.5, y: 1.7, w: 6, h: 1.2, fontSize: 16, color: white });
        s.addText("Target Platforms", { x: 0.5, y: 3, w: 6, h: 0.4, fontSize: 12, color: muted });
        s.addText((data.targetPlatforms || []).join("  ·  "), { x: 0.5, y: 3.4, w: 6, h: 1.5, fontSize: 14, color: accent });
        if (data.distributionPlan) {
          s.addText("Distribution Plan", { x: 7, y: 1.3, w: 6, h: 0.4, fontSize: 12, color: muted });
          s.addText(data.distributionPlan, { x: 7, y: 1.7, w: 5.83, h: 5.3, fontSize: 12, color: white });
        }
      }

      // 8. Team
      if (data.teamMembers?.length) {
        const s = addBase();
        s.addText("THE TEAM", { x: 0.5, y: 0.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: accent, charSpacing: 4 });
        data.teamMembers.slice(0, 5).forEach((m: any, i: number) => {
          const y = 1.4 + i * 1.05;
          s.addText(m.name || "—", { x: 0.5, y, w: 5, h: 0.6, fontSize: 22, bold: true, color: white });
          s.addText(m.role || "", { x: 5.6, y: y + 0.1, w: 7, h: 0.5, fontSize: 16, color: accent });
        });
      }

      // 9. Production
      if (data.budgetRange || data.shootingLocations || data.timeline) {
        const s = addBase();
        s.addText("PRODUCTION", { x: 0.5, y: 0.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: accent, charSpacing: 4 });
        const rows = [
          ["Budget", data.budgetRange],
          ["Location", data.shootingLocations],
          ["Union", data.unionStatus],
          ["Timeline", data.timeline],
        ].filter((r) => r[1]);
        rows.forEach((r, i) => {
          const y = 1.5 + i * 1.2;
          s.addText(String(r[0]), { x: 0.5, y, w: 3, h: 0.5, fontSize: 14, color: muted });
          s.addText(String(r[1]), { x: 3.8, y, w: 9, h: 0.6, fontSize: 20, bold: true, color: white });
        });
      }

      // 10. The Ask
      const sAsk = addBase();
      sAsk.addText("THE ASK", { x: 0.5, y: 0.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: accent, charSpacing: 4 });
      sAsk.addText(data.investmentAsk || "Seeking partners", {
        x: 1, y: 2.8, w: 11.3, h: 1.6, fontSize: 38, bold: true, color: accent, align: "center",
      });
      if (data.contactName || data.contactEmail) {
        sAsk.addText([data.contactName, data.contactEmail, data.website].filter(Boolean).join("  ·  "), {
          x: 1, y: 4.8, w: 11.3, h: 0.5, fontSize: 14, color: white, align: "center",
        });
      }
      sAsk.addText("Filmmaker Genius", { x: 8, y: 6.9, w: 5, h: 0.4, fontSize: 10, color: muted, align: "right" });

      const fileName = `${data.projectTitle || "Pitch-Deck"}.pptx`.replace(/[^a-zA-Z0-9.-]/g, "_");
      await pres.writeFile({ fileName });
      toast.success("PPTX downloaded");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "PPTX export failed");
    } finally {
      setExporting(null);
    }
  };

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: BG }}>
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: ACCENT }} />
      </div>
    );
  }

  const coverBg = `linear-gradient(135deg, ${template.from} 0%, ${template.to} 100%)`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b px-6 py-3 backdrop-blur-md"
        style={{ backgroundColor: "rgba(10,10,15,0.85)", borderColor: CARD }}
      >
        <Link
          to="/pitch-deck"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to editor
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={exportPDF}
            disabled={!!exporting}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-black transition disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {exporting === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Export PDF
          </button>
          <button
            onClick={exportPPTX}
            disabled={!!exporting}
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition disabled:opacity-50"
            style={{ borderColor: ACCENT, color: ACCENT, backgroundColor: "transparent" }}
          >
            {exporting === "pptx" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Presentation className="h-4 w-4" />}
            Export PPTX
          </button>
        </div>
      </header>

      <div ref={containerRef} className="mx-auto max-w-[1320px] space-y-6 px-4 py-6">
        {/* 1. Cover */}
        <Slide id="slide-cover" background={coverBg}>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "64px",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  textShadow: "0 4px 24px rgba(0,0,0,0.5)",
                  maxWidth: "1100px",
                }}
              >
                {data.projectTitle || "Untitled"}
              </div>
              {data.logline && (
                <div
                  style={{
                    marginTop: "24px",
                    fontSize: "18px",
                    fontStyle: "italic",
                    color: ACCENT,
                    maxWidth: "900px",
                  }}
                >
                  "{data.logline}"
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>
                {[projectTypeLabels[data.projectType] || data.projectType, data.targetRating].filter(Boolean).join(" · ")}
              </div>
              <div>
                {(data.targetPlatforms || []).slice(0, 4).map((p) => (
                  <Pill key={p}>{p}</Pill>
                ))}
              </div>
            </div>
          </div>
        </Slide>

        {/* 2. Story */}
        {data.synopsis && (
          <Slide id="slide-story">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", height: "100%" }}>
              <div>
                <SectionLabel>THE STORY</SectionLabel>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: WHITE }}>{data.synopsis}</p>
              </div>
              <div
                style={{
                  backgroundColor: CARD,
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {storyImage ? (
                  <img src={storyImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                ) : generatingImage ? (
                  <div style={{ color: MUTED, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: ACCENT }} />
                    <span style={{ fontSize: "12px" }}>Generating cinematic still…</span>
                  </div>
                ) : (
                  <Sparkles className="h-12 w-12" style={{ color: MUTED }} />
                )}
              </div>
            </div>
          </Slide>
        )}

        {/* 3. Director's Vision */}
        {data.directorVision && (
          <Slide id="slide-vision">
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center" }}>
              <div style={{ fontSize: "120px", color: ACCENT, opacity: 0.3, lineHeight: 0.8, fontFamily: "Georgia, serif" }}>"</div>
              <p style={{ fontSize: "22px", fontStyle: "italic", color: WHITE, maxWidth: "900px", lineHeight: 1.5, marginTop: "-20px" }}>
                {data.directorVision}
              </p>
              {data.toneMood && (
                <div style={{ marginTop: "32px" }}>
                  <Pill>{data.toneMood}</Pill>
                </div>
              )}
            </div>
          </Slide>
        )}

        {/* 4. Characters */}
        {data.characters && data.characters.length > 0 && (
          <Slide id="slide-characters">
            <SectionLabel>CHARACTERS</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
              {data.characters.slice(0, 4).map((c: any, i: number) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: CARD,
                    borderTop: `3px solid ${ACCENT}`,
                    padding: "24px",
                    borderRadius: "4px",
                    minHeight: "240px",
                  }}
                >
                  <div style={{ fontSize: "24px", fontWeight: 700, color: WHITE }}>{c.name || "Unnamed"}</div>
                  <div style={{ fontSize: "13px", color: ACCENT, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "6px" }}>
                    {c.role}
                  </div>
                  <p style={{ fontSize: "14px", color: WHITE, lineHeight: 1.6, marginTop: "16px", opacity: 0.85 }}>
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </Slide>
        )}

        {/* 5. Visual Style */}
        {(data.visualStyle || data.posterImage) && (
          <Slide id="slide-style">
            <div style={{ display: "grid", gridTemplateColumns: data.posterImage ? "1.2fr 1fr" : "1fr", gap: "40px", height: "100%" }}>
              <div>
                <SectionLabel>VISUAL STYLE</SectionLabel>
                <div style={{ fontSize: "36px", fontWeight: 700, color: WHITE, marginBottom: "20px" }}>{template.label}</div>
                <div
                  style={{
                    height: "8px",
                    width: "200px",
                    background: `linear-gradient(90deg, ${template.from}, ${template.to})`,
                    borderRadius: "4px",
                    marginBottom: "24px",
                  }}
                />
                {data.visualStyle && (
                  <p style={{ fontSize: "14px", color: WHITE, lineHeight: 1.7, opacity: 0.9 }}>{data.visualStyle}</p>
                )}
                {data.themes && data.themes.length > 0 && (
                  <div style={{ marginTop: "24px" }}>
                    {data.themes.map((t) => <Pill key={t}>{t}</Pill>)}
                  </div>
                )}
              </div>
              {data.posterImage && (
                <div style={{ overflow: "hidden", borderRadius: "8px", backgroundColor: CARD }}>
                  <img src={data.posterImage} alt="" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>
          </Slide>
        )}

        {/* 6. Comparables */}
        {data.comparables && data.comparables.length > 0 && (
          <Slide id="slide-comps">
            <SectionLabel>COMPARABLES</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "30px" }}>
              {data.comparables.slice(0, 3).map((c: any, i: number) => (
                <div key={i} style={{ backgroundColor: CARD, padding: "28px", borderRadius: "6px", minHeight: "380px" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: WHITE }}>{c.title || "—"}</div>
                  <div style={{ fontSize: "13px", color: ACCENT, marginTop: "8px", fontWeight: 600 }}>
                    {[c.year, c.revenue || c.boxOffice].filter(Boolean).join(" · ")}
                  </div>
                  <p style={{ fontSize: "13px", color: WHITE, opacity: 0.8, lineHeight: 1.6, marginTop: "20px" }}>
                    {c.whySimilar || c.whyItCompares || ""}
                  </p>
                </div>
              ))}
            </div>
          </Slide>
        )}

        {/* 7. Market & Audience */}
        {(data.primaryDemographic || data.distributionPlan) && (
          <Slide id="slide-market">
            <SectionLabel>MARKET & AUDIENCE</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "20px", height: "calc(100% - 60px)" }}>
              <div>
                <div style={{ fontSize: "12px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>Primary Demographic</div>
                <div style={{ fontSize: "20px", color: WHITE, marginTop: "12px", lineHeight: 1.5 }}>{data.primaryDemographic || "—"}</div>
                <div style={{ fontSize: "12px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "32px" }}>
                  Target Platforms
                </div>
                <div style={{ marginTop: "12px" }}>
                  {(data.targetPlatforms || []).map((p) => <Pill key={p}>{p}</Pill>)}
                </div>
              </div>
              {data.distributionPlan && (
                <div>
                  <div style={{ fontSize: "12px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>Distribution Plan</div>
                  <p style={{ fontSize: "14px", color: WHITE, lineHeight: 1.7, marginTop: "12px", opacity: 0.9 }}>
                    {data.distributionPlan}
                  </p>
                </div>
              )}
            </div>
          </Slide>
        )}

        {/* 8. Team */}
        {data.teamMembers && data.teamMembers.length > 0 && (
          <Slide id="slide-team">
            <SectionLabel>THE TEAM</SectionLabel>
            <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {data.teamMembers.slice(0, 5).map((m: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "24px", borderBottom: `1px solid ${CARD}`, paddingBottom: "16px" }}>
                  <div style={{ fontSize: "26px", fontWeight: 700, color: WHITE, minWidth: "300px" }}>{m.name || "—"}</div>
                  <div style={{ fontSize: "16px", color: ACCENT, fontWeight: 500 }}>{m.role}</div>
                </div>
              ))}
            </div>
          </Slide>
        )}

        {/* 9. Production */}
        {(data.budgetRange || data.shootingLocations || data.timeline || data.unionStatus) && (
          <Slide id="slide-production">
            <SectionLabel>PRODUCTION</SectionLabel>
            <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "28px" }}>
              {[
                ["Budget Range", data.budgetRange],
                ["Shoot Location", data.shootingLocations],
                ["Union Status", data.unionStatus],
                ["Timeline", data.timeline],
              ].filter((r) => r[1]).map((r) => (
                <div key={r[0]} style={{ display: "grid", gridTemplateColumns: "240px 1fr", alignItems: "center", gap: "24px" }}>
                  <div style={{ fontSize: "13px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em" }}>{r[0]}</div>
                  <div style={{ fontSize: "22px", fontWeight: 600, color: WHITE }}>
                    {r[0] === "Budget Range" ? <Pill>{r[1] as string}</Pill> : r[1]}
                  </div>
                </div>
              ))}
            </div>
          </Slide>
        )}

        {/* 10. The Ask */}
        <Slide id="slide-ask">
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center", position: "relative" }}>
            <SectionLabel>THE ASK</SectionLabel>
            <div style={{ fontSize: "48px", fontWeight: 800, color: ACCENT, maxWidth: "1000px", lineHeight: 1.2, marginTop: "20px" }}>
              {data.investmentAsk || "Seeking production financing"}
            </div>
            {(data.contactName || data.contactEmail || data.website) && (
              <div style={{ marginTop: "40px", fontSize: "15px", color: WHITE, opacity: 0.85 }}>
                {[data.contactName, data.contactEmail, data.website].filter(Boolean).join("  ·  ")}
              </div>
            )}
            <div style={{ position: "absolute", bottom: 0, right: 0, fontSize: "11px", color: MUTED, letterSpacing: "0.1em" }}>
              FILMMAKER GENIUS
            </div>
          </div>
        </Slide>
      </div>
    </div>
  );
};

export default PitchDeckPreview;
