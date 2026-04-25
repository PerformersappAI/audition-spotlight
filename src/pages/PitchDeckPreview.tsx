import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText, Loader2, Presentation, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PitchDeckData } from "./PitchDeckMaker";
import { STYLE_TEMPLATES } from "@/components/pitchdeck/Step3CharactersVisuals";

// ---------- helpers ----------
const ACCENT = "#d4a24c";        // muted Hollywood gold
const ACCENT_BRIGHT = "#f1c878";  // highlight gold
const BG = "#0a0a0f";
const SURFACE = "#12121a";
const CARD = "#1a1a26";
const WHITE = "#f4ecd8";          // warm cream for editorial body
const PURE_WHITE = "#ffffff";
const MUTED = "#8a8a99";

// Editorial typography stacks
const SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, "Times New Roman", serif';
const SANS = '"Inter", -apple-system, "Segoe UI", Roboto, sans-serif';
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const projectTypeLabels: Record<string, string> = {
  feature: "Feature Film",
  tv_series: "TV Series",
  mini_series: "Mini-Series",
  short: "Short Film",
  documentary: "Documentary",
};

// Format primary demographic strings: "Adult 2554" -> "Adults 25–54"
function formatDemographic(input?: string): string {
  if (!input) return "—";
  let s = input.trim();
  // "Adult 2554" or "Adults 2554" -> "Adults 25–54"
  s = s.replace(/\b(Adult|Adults)\s+(\d{2})(\d{2})\b/gi, "Adults $2–$3");
  // "25-54" -> "25–54" (en dash)
  s = s.replace(/(\d{2})\s*-\s*(\d{2})/g, "$1–$2");
  return s;
}

// Word-boundary clamp for display only (does not mutate stored data)
function clampWords(s: string | undefined, n: number): string {
  if (!s) return "";
  const parts = s.trim().split(/\s+/);
  if (parts.length <= n) return s.trim();
  return parts.slice(0, n).join(" ").replace(/[,;:.!?-]+$/, "") + "…";
}

// Sentence-aware truncation by approximate word budget; never cuts mid-sentence
function truncateSentences(s: string | undefined, maxWords: number): string {
  if (!s) return "";
  const sentences = s.match(/[^.!?]+[.!?]+(\s|$)/g)?.map((x) => x.trim()) || [s.trim()];
  const out: string[] = [];
  let count = 0;
  for (const sent of sentences) {
    const w = sent.split(/\s+/).length;
    if (count + w > maxWords && out.length) break;
    out.push(sent);
    count += w;
    if (count >= maxWords) break;
  }
  const result = out.join(" ");
  return result.length < s.trim().length ? result + (result.endsWith(".") ? "" : "…") : result;
}

// Split a long string into 3-5 sentence paragraph chunks
function splitIntoParagraphs(text: string, sentencesPerChunk = 4): string[] {
  if (!text) return [];
  // Respect existing line breaks first
  const explicit = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (explicit.length > 1) return explicit;
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g)?.map((s) => s.trim()) || [text];
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
    out.push(sentences.slice(i, i + sentencesPerChunk).join(" "));
  }
  return out;
}

const SLIDE_W = 1280;
const SLIDE_H = 720;

// Slide wrapper with fixed 16:9 dimensions, scaled to fit container
function Slide({
  id,
  children,
  background,
  noPadding = false,
}: {
  id: string;
  children: React.ReactNode;
  background?: string;
  noPadding?: boolean;
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
          fontFamily: SANS,
          overflow: "hidden",
          transform: "scale(var(--slide-scale, 1))",
          transformOrigin: "top center",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
        }}
      >
        {noPadding ? children : (
          <div style={{ padding: "72px", height: "100%", boxSizing: "border-box" }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      color: ACCENT,
      fontSize: "12px",
      letterSpacing: "0.32em",
      fontWeight: 700,
      marginBottom: "20px",
      fontFamily: SANS,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

// Tiny caption used in lookbook image plates: "TITLE — DIRECTOR — YEAR"
const PlateCaption = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: "absolute",
      left: "40px",
      bottom: "32px",
      color: PURE_WHITE,
      fontSize: "11px",
      letterSpacing: "0.28em",
      fontFamily: SANS,
      fontWeight: 600,
      textTransform: "uppercase",
      textShadow: "0 2px 8px rgba(0,0,0,0.8)",
      opacity: 0.92,
    }}
  >
    {children}
  </div>
);

const Pill = ({ children, solid = true }: { children: React.ReactNode; solid?: boolean }) => (
  <span
    style={{
      display: "inline-block",
      padding: "7px 16px",
      borderRadius: "2px",
      backgroundColor: solid ? ACCENT : "transparent",
      border: solid ? "none" : `1px solid ${ACCENT}`,
      color: solid ? "#0a0a0f" : ACCENT,
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      marginRight: "8px",
      marginBottom: "8px",
      fontFamily: SANS,
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

  // Cover hero image priority: uploaded poster > AI-generated story still > template gradient fallback
  const heroImage = data.posterImage || data.synopsisImage || storyImage;
  const coverGradient = `linear-gradient(135deg, ${template.from} 0%, ${template.to} 100%)`;

  // Pull a compelling pull-quote from synopsis: longest single sentence, capped
  const pullQuote = (() => {
    const src = data.synopsis || "";
    const sentences = src.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) || [];
    if (!sentences.length) return null;
    const sorted = [...sentences].sort((a, b) => Math.abs(120 - a.length) - Math.abs(120 - b.length));
    const pick = sorted[0];
    if (pick.length < 40 || pick.length > 220) return null;
    return pick;
  })();

  // Genre-driven color treatment for comp cards without posters
  const compTone = (i: number) => {
    const tones = [
      `linear-gradient(160deg, #2a1a0e 0%, #0a0a0f 100%)`,
      `linear-gradient(160deg, #1a1820 0%, #0a0a0f 100%)`,
      `linear-gradient(160deg, #261a14 0%, #0a0a0f 100%)`,
    ];
    return tones[i % tones.length];
  };

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
        {/* ============ 1. COVER — one-sheet (poster right) or full-bleed (AI still) ============ */}
        {(() => {
          // Treat user-uploaded poster as portrait one-sheet; AI 16:9 still as full-bleed.
          const posterMode = !!data.posterImage;
          const bleedImage = !posterMode ? (data.synopsisImage || storyImage) : null;
          const displayLogline = clampWords(data.logline, 12);
          return (
            <Slide
              id="slide-cover"
              noPadding
              background={posterMode ? "#0a0a0f" : (bleedImage ? "#000" : coverGradient)}
            >
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                {bleedImage && (
                  <img
                    src={bleedImage}
                    alt=""
                    crossOrigin="anonymous"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "saturate(0.92) contrast(1.05)",
                    }}
                  />
                )}
                {/* Cinematic gradient overlay for legibility (only when full-bleed) */}
                {bleedImage && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.92) 100%)",
                    }}
                  />
                )}
                {/* Top label bar */}
                <div
                  style={{
                    position: "absolute",
                    top: "48px",
                    left: "72px",
                    right: "72px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: PURE_WHITE,
                    fontSize: "11px",
                    letterSpacing: "0.32em",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    zIndex: 2,
                  }}
                >
                  <span style={{ opacity: 0.85 }}>A {projectTypeLabels[data.projectType] || "Film"} Pitch</span>
                  {data.targetRating && <span style={{ color: ACCENT_BRIGHT }}>Rated {data.targetRating}</span>}
                </div>

                {posterMode ? (
                  // ---- One-sheet layout: text left, contained portrait poster right ----
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      gridTemplateColumns: "1.05fr 1fr",
                      gap: "56px",
                      padding: "120px 72px 72px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      {data.genre?.length > 0 && (
                        <div style={{ color: ACCENT_BRIGHT, fontSize: "12px", letterSpacing: "0.4em", fontWeight: 700, textTransform: "uppercase", marginBottom: "20px", fontFamily: SANS }}>
                          {data.genre.slice(0, 3).join(" · ")}
                        </div>
                      )}
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontSize: "84px",
                          fontWeight: 600,
                          color: PURE_WHITE,
                          letterSpacing: "-0.015em",
                          lineHeight: 1.0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {data.projectTitle || "Untitled"}
                      </div>
                      {displayLogline && (
                        <div
                          style={{
                            marginTop: "40px",
                            fontFamily: SERIF,
                            fontSize: "22px",
                            fontStyle: "italic",
                            color: WHITE,
                            lineHeight: 1.45,
                            opacity: 0.92,
                          }}
                        >
                          {displayLogline}
                        </div>
                      )}
                      {(data.targetPlatforms?.length ?? 0) > 0 && (
                        <div style={{ marginTop: "36px" }}>
                          {data.targetPlatforms!.slice(0, 4).map((p) => (
                            <Pill key={p} solid={false}>{p}</Pill>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                      <div
                        style={{
                          aspectRatio: "2 / 3",
                          maxHeight: "100%",
                          width: "auto",
                          background: "#000",
                          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={data.posterImage!}
                          alt=""
                          crossOrigin="anonymous"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // ---- Full-bleed layout for 16:9 AI stills (or no image) ----
                  <div
                    style={{
                      position: "absolute",
                      left: "72px",
                      right: "72px",
                      bottom: "72px",
                    }}
                  >
                    {data.genre?.length > 0 && (
                      <div
                        style={{
                          color: ACCENT_BRIGHT,
                          fontSize: "13px",
                          letterSpacing: "0.4em",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          marginBottom: "20px",
                          fontFamily: SANS,
                        }}
                      >
                        {data.genre.slice(0, 3).join(" · ")}
                      </div>
                    )}
                    <div
                      style={{
                        fontFamily: SERIF,
                        fontSize: "104px",
                        fontWeight: 600,
                        color: PURE_WHITE,
                        letterSpacing: "-0.015em",
                        lineHeight: 0.98,
                        textShadow: "0 4px 32px rgba(0,0,0,0.7)",
                        maxWidth: "1100px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {data.projectTitle || "Untitled"}
                    </div>
                    {displayLogline && (
                      <div
                        style={{
                          marginTop: "40px",
                          fontFamily: SERIF,
                          fontSize: "22px",
                          fontStyle: "italic",
                          color: WHITE,
                          maxWidth: "880px",
                          lineHeight: 1.45,
                          textShadow: "0 2px 16px rgba(0,0,0,0.7)",
                        }}
                      >
                        {displayLogline}
                      </div>
                    )}
                    {(data.targetPlatforms?.length ?? 0) > 0 && (
                      <div style={{ marginTop: "32px" }}>
                        {data.targetPlatforms!.slice(0, 4).map((p) => (
                          <Pill key={p} solid={false}>
                            {p}
                          </Pill>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Slide>
          );
        })()}

        {/* ============ 2. STORY — split spread, breathing chunks, pull quote ============ */}
        {data.synopsis && (
          <Slide id="slide-story">
            <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "56px", height: "100%", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <SectionLabel>The Story</SectionLabel>
                {/* Sentence-aware truncation: never cut mid-sentence */}
                {splitIntoParagraphs(truncateSentences(data.synopsis, 110), 3).slice(0, 3).map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: SERIF,
                      fontSize: "19px",
                      lineHeight: 1.65,
                      color: WHITE,
                      marginBottom: "20px",
                      opacity: 0.95,
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                {/* Instagram-style square frame */}
                <div
                  style={{
                    width: "min(100%, 520px)",
                    aspectRatio: "1 / 1",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: SURFACE,
                    boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7)",
                  }}
                >
                  {storyImage ? (
                    <>
                      <img
                        src={storyImage}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.9) contrast(1.05)" }}
                        crossOrigin="anonymous"
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.7) 100%)",
                        }}
                      />
                      <PlateCaption>
                        {data.projectTitle || "Untitled"} — Scene Reference
                      </PlateCaption>
                    </>
                  ) : generatingImage ? (
                    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: MUTED }}>
                      <Loader2 className="h-8 w-8 animate-spin" style={{ color: ACCENT }} />
                      <span style={{ fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Generating still…</span>
                    </div>
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles className="h-12 w-12" style={{ color: MUTED }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Slide>
        )}

        {/* ============ 2a. PULL QUOTE — full-bleed cinematic ============ */}
        {pullQuote && (
          <Slide id="slide-pullquote" background={`linear-gradient(135deg, #0e0a08 0%, #1a120a 60%, #0a0a0f 100%)`}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontFamily: SERIF, fontSize: "180px", color: ACCENT, opacity: 0.35, lineHeight: 0.6, marginBottom: "20px" }}>“</div>
              <p
                style={{
                  fontFamily: SERIF,
                  fontSize: "44px",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: PURE_WHITE,
                  lineHeight: 1.3,
                  letterSpacing: "-0.005em",
                }}
              >
                {pullQuote}
              </p>
              <div style={{ marginTop: "44px", height: "1px", width: "80px", margin: "44px auto 16px", backgroundColor: ACCENT }} />
              <div style={{ fontSize: "11px", letterSpacing: "0.32em", color: ACCENT, fontWeight: 700, textTransform: "uppercase" }}>
                From the Synopsis
              </div>
            </div>
          </Slide>
        )}

        {/* ============ 2b. NORTH STAR ============ */}
        {data.northStar && (
          <Slide id="slide-northstar">
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", maxWidth: "980px", margin: "0 auto" }}>
              <SectionLabel>North Star</SectionLabel>
              <div style={{ maxHeight: "520px", overflow: "hidden" }}>
                {splitIntoParagraphs(data.northStar, 3).slice(0, 3).map((p, i) => (
                  <p key={i} style={{ fontFamily: SERIF, fontSize: "22px", color: WHITE, lineHeight: 1.55, marginBottom: "20px" }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </Slide>
        )}

        {/* ============ 2c. THE WORLD ============ */}
        {data.worldSetting && (
          <Slide id="slide-world">
            <SectionLabel>The World</SectionLabel>
            <div style={{ marginTop: "20px", maxWidth: "1000px" }}>
              {splitIntoParagraphs(data.worldSetting, 3).slice(0, 3).map((p, i) => (
                <p key={i} style={{ fontFamily: SERIF, fontSize: "19px", color: WHITE, lineHeight: 1.65, marginBottom: "20px", opacity: 0.95 }}>{p}</p>
              ))}
              {data.shootingLocations && (
                <div style={{ marginTop: "28px" }}>
                  <Pill solid={false}>{data.shootingLocations}</Pill>
                </div>
              )}
            </div>
          </Slide>
        )}

        {/* ============ 3. DIRECTOR'S VISION — pull quote treatment ============ */}
        {data.directorVision && (
          <Slide id="slide-vision">
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center" }}>
              <div style={{ fontFamily: SERIF, fontSize: "160px", color: ACCENT, opacity: 0.3, lineHeight: 0.7, marginBottom: "8px" }}>“</div>
              <p style={{ fontFamily: SERIF, fontSize: "32px", fontStyle: "italic", color: PURE_WHITE, maxWidth: "920px", lineHeight: 1.4, fontWeight: 500 }}>
                {data.directorVision}
              </p>
              <div style={{ marginTop: "40px", height: "1px", width: "60px", backgroundColor: ACCENT }} />
              <div style={{ marginTop: "16px", fontSize: "11px", letterSpacing: "0.32em", color: ACCENT, fontWeight: 700, textTransform: "uppercase" }}>
                Director's Vision
              </div>
              {data.toneMood && (
                <div style={{ marginTop: "28px" }}>
                  <Pill solid={false}>{data.toneMood}</Pill>
                </div>
              )}
            </div>
          </Slide>
        )}

        {/* ============ 4. CHARACTERS — portrait card grid ============ */}
        {data.characters && data.characters.length > 0 && (
          <Slide id="slide-characters">
            <SectionLabel>The Characters</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: data.characters.length === 1 ? "1fr" : data.characters.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
                gap: "20px",
                marginTop: "24px",
              }}
            >
              {data.characters.slice(0, 4).map((c: any, i: number) => {
                const portraitSrc = c.portrait || c.aiPortrait || c.referencePhoto;
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: SURFACE,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", backgroundColor: CARD, overflow: "hidden" }}>
                      {portraitSrc ? (
                        <img
                          src={portraitSrc}
                          alt=""
                          crossOrigin="anonymous"
                          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.92) contrast(1.05)" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: `linear-gradient(160deg, ${CARD}, ${BG})`,
                            color: ACCENT,
                            fontFamily: SERIF,
                            fontSize: "64px",
                            fontWeight: 600,
                            opacity: 0.55,
                          }}
                        >
                          {(c.name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "18px 16px 20px" }}>
                      <div style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 600, color: PURE_WHITE, lineHeight: 1.15 }}>
                        {c.name || "Unnamed"}
                      </div>
                      {c.role && (
                        <div style={{ fontSize: "10px", color: ACCENT, textTransform: "uppercase", letterSpacing: "0.24em", marginTop: "6px", fontWeight: 700 }}>
                          {c.role}
                        </div>
                      )}
                      {c.description && (
                        <p style={{ fontFamily: SERIF, fontSize: "13px", color: WHITE, lineHeight: 1.5, marginTop: "10px", opacity: 0.88 }}>
                          {c.description.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Slide>
        )}

        {/* ============ 4b. EPISODE BREAKDOWN — TV / mini-series ============ */}
        {data.episodes && data.episodes.length > 0 && (
          <Slide id="slide-episodes">
            <SectionLabel>Episode Breakdown</SectionLabel>
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "540px", overflow: "hidden" }}>
              {data.episodes.slice(0, 8).map((ep, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 240px 1fr", gap: "24px", alignItems: "baseline", borderBottom: `1px solid ${CARD}`, paddingBottom: "12px" }}>
                  <div style={{ fontSize: "11px", color: ACCENT, fontFamily: MONO, letterSpacing: "0.2em", fontWeight: 700 }}>EP {String(i + 1).padStart(2, "0")}</div>
                  <div style={{ fontFamily: SERIF, fontSize: "20px", fontWeight: 600, color: PURE_WHITE }}>{ep.title || "—"}</div>
                  <div style={{ fontFamily: SERIF, fontSize: "15px", color: WHITE, opacity: 0.88, lineHeight: 1.55 }}>{ep.logline}</div>
                </div>
              ))}
            </div>
          </Slide>
        )}

        {/* ============ 5. VISUAL STYLE — full-bleed image with text panel ============ */}
        {(data.visualStyle || data.posterImage) && (
          <Slide id="slide-style" noPadding={!!data.posterImage}>
            {data.posterImage ? (
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img
                  src={data.posterImage}
                  alt=""
                  crossOrigin="anonymous"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.9) contrast(1.05)" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.78) 38%, rgba(10,10,15,0.1) 70%, transparent 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "72px",
                    top: "72px",
                    bottom: "72px",
                    width: "560px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <SectionLabel>Visual Language</SectionLabel>
                  <div style={{ fontFamily: SERIF, fontSize: "52px", fontWeight: 600, color: PURE_WHITE, marginBottom: "20px", lineHeight: 1.05 }}>
                    {template.label}
                  </div>
                  <div
                    style={{
                      height: "2px",
                      width: "80px",
                      background: ACCENT,
                      marginBottom: "28px",
                    }}
                  />
                  {data.visualStyle && (
                    <p style={{ fontFamily: SERIF, fontSize: "17px", color: WHITE, lineHeight: 1.7, opacity: 0.92 }}>{data.visualStyle}</p>
                  )}
                  {data.themes && data.themes.length > 0 && (
                    <div style={{ marginTop: "28px" }}>
                      {data.themes.map((t) => <Pill key={t} solid={false}>{t}</Pill>)}
                    </div>
                  )}
                </div>
                <PlateCaption>
                  {data.projectTitle || "Untitled"} — Key Art
                </PlateCaption>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", maxWidth: "900px" }}>
                <SectionLabel>Visual Language</SectionLabel>
                <div style={{ fontFamily: SERIF, fontSize: "52px", fontWeight: 600, color: PURE_WHITE, marginBottom: "20px" }}>{template.label}</div>
                <div style={{ height: "2px", width: "80px", background: ACCENT, marginBottom: "28px" }} />
                {data.visualStyle && (
                  <p style={{ fontFamily: SERIF, fontSize: "18px", color: WHITE, lineHeight: 1.7, opacity: 0.92 }}>{data.visualStyle}</p>
                )}
              </div>
            )}
          </Slide>
        )}

        {/* ============ 6. COMPARABLES — poster card row ============ */}
        {data.comparables && data.comparables.length > 0 && (
          <Slide id="slide-comps">
            <SectionLabel>Comparable Titles</SectionLabel>
            <div style={{ fontFamily: SERIF, fontSize: "16px", color: MUTED, marginTop: "-8px", marginBottom: "28px", fontStyle: "italic" }}>
              Films that share our audience, tone, and market.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
              {data.comparables.slice(0, 3).map((c: any, i: number) => {
                const poster = c.poster || c.posterImage || c.posterUrl;
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: SURFACE }}>
                    {/* Poster zone */}
                    <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 3", overflow: "hidden", background: poster ? "#000" : compTone(i) }}>
                      {poster ? (
                        <img src={poster} alt="" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontFamily: SERIF, fontSize: "30px", fontWeight: 600, color: PURE_WHITE, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                            {c.title || "Untitled"}
                          </div>
                          {c.year && (
                            <div style={{ marginTop: "12px", fontSize: "11px", letterSpacing: "0.32em", color: ACCENT, fontWeight: 700 }}>
                              {c.year}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Caption */}
                    <div style={{ padding: "16px 18px 20px" }}>
                      <div style={{ fontFamily: SERIF, fontSize: "20px", fontWeight: 600, color: PURE_WHITE, lineHeight: 1.2 }}>
                        {c.title || "—"}
                      </div>
                      <div style={{ fontSize: "10px", color: ACCENT, marginTop: "6px", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" }}>
                        {[c.year, c.revenue || c.boxOffice].filter(Boolean).join(" · ")}
                      </div>
                      {(c.whySimilar || c.whyItCompares) && (
                        <p style={{ fontFamily: SERIF, fontSize: "12.5px", color: WHITE, opacity: 0.85, lineHeight: 1.55, marginTop: "12px" }}>
                          {(c.whySimilar || c.whyItCompares).split(/(?<=[.!?])\s+/).slice(0, 2).join(" ")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Slide>
        )}

        {/* ============ 7. MARKET & AUDIENCE ============ */}
        {(data.primaryDemographic || data.distributionPlan) && (
          <Slide id="slide-market">
            <SectionLabel>Market & Audience</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", marginTop: "24px", height: "calc(100% - 80px)" }}>
              <div>
                <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.28em", fontWeight: 700 }}>Primary Demographic</div>
                <div style={{ fontFamily: SERIF, fontSize: "32px", color: PURE_WHITE, marginTop: "14px", lineHeight: 1.25, fontWeight: 600 }}>
                  {formatDemographic(data.primaryDemographic)}
                </div>
                {data.secondaryAudience && (
                  <>
                    <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.28em", fontWeight: 700, marginTop: "32px" }}>Secondary</div>
                    <div style={{ fontFamily: SERIF, fontSize: "20px", color: WHITE, marginTop: "10px", lineHeight: 1.4, opacity: 0.9 }}>{data.secondaryAudience}</div>
                  </>
                )}
                <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.28em", fontWeight: 700, marginTop: "36px" }}>Target Platforms</div>
                <div style={{ marginTop: "14px" }}>
                  {(data.targetPlatforms || []).map((p) => <Pill key={p}>{p}</Pill>)}
                </div>
              </div>
              {data.distributionPlan && (
                <div>
                  <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.28em", fontWeight: 700 }}>Distribution Plan</div>
                  <div style={{ marginTop: "14px", maxHeight: "440px", overflow: "hidden" }}>
                    {splitIntoParagraphs(data.distributionPlan, 3).slice(0, 3).map((p, i) => (
                      <p key={i} style={{ fontFamily: SERIF, fontSize: "16px", color: WHITE, lineHeight: 1.65, opacity: 0.92, marginBottom: "16px" }}>{p}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Slide>
        )}

        {/* ============ 8. TEAM ============ */}
        {data.teamMembers && data.teamMembers.length > 0 && (
          <Slide id="slide-team">
            <SectionLabel>The Team</SectionLabel>
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "22px" }}>
              {data.teamMembers.slice(0, 5).map((m: any, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr 240px", alignItems: "baseline", gap: "24px", borderBottom: `1px solid ${CARD}`, paddingBottom: "18px" }}>
                  <div style={{ fontFamily: MONO, fontSize: "11px", color: ACCENT, letterSpacing: "0.2em", fontWeight: 700 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: "30px", fontWeight: 600, color: PURE_WHITE, lineHeight: 1.15 }}>{m.name || "—"}</div>
                  <div style={{ fontSize: "12px", color: ACCENT, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "right" }}>{m.role}</div>
                </div>
              ))}
            </div>
          </Slide>
        )}

        {/* ============ 9. PRODUCTION ============ */}
        {(data.budgetRange || data.shootingLocations || data.timeline || data.unionStatus) && (
          <Slide id="slide-production">
            <SectionLabel>Production</SectionLabel>
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "26px" }}>
              {[
                ["Budget Range", data.budgetRange],
                ["Shoot Location", data.shootingLocations],
                ["Union Status", data.unionStatus],
                ["Timeline", data.timeline],
              ].filter((r) => r[1]).map((r) => (
                <div key={r[0]} style={{ display: "grid", gridTemplateColumns: "260px 1fr", alignItems: "center", gap: "24px", borderBottom: `1px solid ${CARD}`, paddingBottom: "20px" }}>
                  <div style={{ fontSize: "11px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.28em", fontWeight: 700 }}>{r[0]}</div>
                  <div style={{ fontFamily: SERIF, fontSize: "26px", fontWeight: 600, color: PURE_WHITE }}>
                    {r[1]}
                  </div>
                </div>
              ))}
            </div>
          </Slide>
        )}

        {/* ============ 10. THE ASK — context, not just a number ============ */}
        <Slide id="slide-ask">
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <SectionLabel>The Ask</SectionLabel>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: "64px",
                fontWeight: 600,
                color: ACCENT_BRIGHT,
                lineHeight: 1.1,
                marginTop: "12px",
                letterSpacing: "-0.01em",
                maxWidth: "1100px",
              }}
            >
              {data.investmentAsk || "Seeking production financing"}
            </div>
            <div
              style={{
                marginTop: "36px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "32px",
                paddingTop: "32px",
                borderTop: `1px solid ${CARD}`,
              }}
            >
              <div>
                <div style={{ fontSize: "10px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.28em", fontWeight: 700 }}>Budget Tier</div>
                <div style={{ fontFamily: SERIF, fontSize: "22px", color: PURE_WHITE, marginTop: "10px", fontWeight: 600 }}>
                  {data.budgetRange || "To be confirmed"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.28em", fontWeight: 700 }}>Audience</div>
                <div style={{ fontFamily: SERIF, fontSize: "22px", color: PURE_WHITE, marginTop: "10px", fontWeight: 600, lineHeight: 1.3 }}>
                  {formatDemographic(data.primaryDemographic) || "Wide release"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.28em", fontWeight: 700 }}>Distribution</div>
                <div style={{ fontFamily: SERIF, fontSize: "18px", color: PURE_WHITE, marginTop: "10px", fontWeight: 500, lineHeight: 1.35 }}>
                  {(data.targetPlatforms?.length ?? 0) > 0
                    ? data.targetPlatforms!.slice(0, 3).join(" · ")
                    : "Streaming + festival circuit"}
                </div>
              </div>
            </div>
            {data.marketingHighlights && (
              <p style={{ fontFamily: SERIF, fontSize: "15px", color: WHITE, opacity: 0.85, lineHeight: 1.6, marginTop: "32px", maxWidth: "980px", fontStyle: "italic" }}>
                {data.marketingHighlights.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ")}
              </p>
            )}
          </div>
        </Slide>

        {/* ============ 11. CLOSING / END SLATE — cinematic image with contact ============ */}
        <Slide id="slide-closing" noPadding background={heroImage ? "#000" : `linear-gradient(135deg, #0e0a08 0%, #0a0a0f 100%)`}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {heroImage && (
              <img
                src={heroImage}
                alt=""
                crossOrigin="anonymous"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) contrast(1.05) brightness(0.6)" }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.85) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "72px",
              }}
            >
              <div style={{ fontSize: "11px", letterSpacing: "0.4em", color: ACCENT, fontWeight: 700, textTransform: "uppercase", marginBottom: "28px" }}>
                Thank You
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: "72px",
                  fontWeight: 600,
                  color: PURE_WHITE,
                  letterSpacing: "-0.015em",
                  lineHeight: 1,
                  textShadow: "0 4px 24px rgba(0,0,0,0.7)",
                  maxWidth: "980px",
                }}
              >
                {data.projectTitle || "Untitled"}
              </div>
              <div style={{ marginTop: "32px", height: "1px", width: "60px", backgroundColor: ACCENT }} />
              {(data.contactName || data.contactEmail || data.contactPhone || data.website) && (
                <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                  {data.contactName && (
                    <div style={{ fontFamily: SERIF, fontSize: "20px", color: PURE_WHITE, fontWeight: 500 }}>{data.contactName}</div>
                  )}
                  <div style={{ fontSize: "13px", color: WHITE, opacity: 0.85, letterSpacing: "0.08em" }}>
                    {[data.contactEmail, data.contactPhone, data.website].filter(Boolean).join("  ·  ")}
                  </div>
                </div>
              )}
            </div>
            <div style={{ position: "absolute", bottom: "32px", right: "40px", fontSize: "10px", color: WHITE, opacity: 0.55, letterSpacing: "0.32em", fontWeight: 600 }}>
              FILMMAKER GENIUS
            </div>
          </div>
        </Slide>
      </div>
    </div>
  );
};

export default PitchDeckPreview;
