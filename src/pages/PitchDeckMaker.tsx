import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Sparkles, ChevronRight, ChevronLeft, Loader2, Film, BookOpen, Users, Briefcase, Check, Clapperboard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Step2Story, { type CharacterEntry } from "@/components/pitchdeck/Step2Story";
import Step3CharactersVisuals, { STYLE_TEMPLATES, type VisualCharacter } from "@/components/pitchdeck/Step3CharactersVisuals";
import Step4MarketTeam, { type TeamMember } from "@/components/pitchdeck/Step4MarketTeam";

// ============================================================================
// Types
// ============================================================================

export type ProjectType =
  | ""
  | "feature"
  | "tv_series"
  | "mini_series"
  | "short"
  | "documentary";

export interface PitchDeckData {
  // Step 1 — The Pitch
  projectTitle: string;
  projectType: ProjectType;
  logline: string;
  genre: string[];
  targetRating: string;
  targetPlatforms: string[];

  // Reserved for future steps (kept so existing draft data does not break)
  posterImage?: string;
  posterPrompt?: string;
  synopsis?: string;
  synopsisImage?: string;
  directorVision?: string;
  toneMood?: string;
  themes?: string[];
  characters?: any[];
  visualStyle?: string;
  moodboardImages?: string[];
  moodboardUploads?: string[];
  comparables?: any[];
  primaryDemographic?: string;
  secondaryAudience?: string;
  marketAnalysis?: string;
  budgetRange?: string;
  shootingLocations?: string;
  timeline?: string;
  unionStatus?: string;
  teamMembers?: any[];
  marketingHighlights?: string;
  distributionPlan?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  investmentAsk?: string;
  selectedTemplate?: string;
  meetingUrl?: string;

  // Editorial craft fields (SBS / Haley framework)
  northStar?: string;        // Why this story, why you, why now
  worldSetting?: string;     // Why this story must be set here
  episodes?: { title: string; logline: string }[]; // TV/mini-series only
}

const initialData: PitchDeckData = {
  projectTitle: "",
  projectType: "",
  logline: "",
  genre: [],
  targetRating: "",
  targetPlatforms: [],
};

// ============================================================================
// Constants — Step 1 options
// ============================================================================

const PROJECT_TYPES: { value: Exclude<ProjectType, "">; label: string }[] = [
  { value: "feature", label: "Feature Film" },
  { value: "tv_series", label: "TV Series" },
  { value: "mini_series", label: "Mini-Series" },
  { value: "short", label: "Short Film" },
  { value: "documentary", label: "Documentary" },
];

const GENRES = [
  "Action",
  "Drama",
  "Thriller",
  "Horror",
  "Sci-Fi",
  "Comedy",
  "Faith/Inspirational",
  "Western",
  "Documentary",
  "Animation",
];

const RATINGS = ["G", "PG", "PG-13", "R", "NR"];

const PLATFORMS = [
  "TBN",
  "Netflix",
  "Amazon",
  "Hulu",
  "HBO Max",
  "Apple TV+",
  "Shudder",
  "Theatrical",
  "Film Festival",
];

const STEPS = [
  { num: "01", label: "The Pitch", icon: Film, hint: "Foundation" },
  { num: "02", label: "Story", icon: BookOpen, hint: "Heart of it" },
  { num: "03", label: "Characters & Visuals", icon: Users, hint: "Look & feel" },
  { num: "04", label: "Market & Team", icon: Briefcase, hint: "The business" },
];

// ============================================================================
// Component
// ============================================================================

const PitchDeckMaker = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PitchDeckData>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingLogline, setIsGeneratingLogline] = useState(false);
  const [exportFormats, setExportFormats] = useState<string[]>(["pdf"]);
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);

  // Load draft
  useEffect(() => {
    const saved = localStorage.getItem("pitchDeckDraft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ ...initialData, ...parsed });
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, []);

  const update = <K extends keyof PitchDeckData>(key: K, value: PitchDeckData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const toggleInArray = (key: "genre" | "targetPlatforms", value: string) => {
    setData((d) => {
      const current = (d[key] as string[]) || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...d, [key]: next };
    });
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem("pitchDeckDraft", JSON.stringify(data));
      toast.success("Draft saved");
    } catch (error) {
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        toast.error("Draft too large to save locally");
      } else {
        toast.error("Failed to save draft");
      }
    }
  };

  const handleGenerateLogline = async () => {
    if (!data.projectTitle && !data.genre.length) {
      toast.error("Add a project title or genre first");
      return;
    }
    setIsGeneratingLogline(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-pitch-content", {
        body: {
          field: "logline",
          context: {
            projectTitle: data.projectTitle,
            projectType: data.projectType,
            genre: data.genre,
            targetRating: data.targetRating,
          },
        },
      });
      if (error) throw error;
      if (result?.content) {
        update("logline", result.content);
        toast.success("Logline generated");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to generate logline");
    } finally {
      setIsGeneratingLogline(false);
    }
  };

  const canAdvance = data.projectTitle.trim().length > 0 && data.projectType !== "";

  const handleNext = () => {
    if (currentStep === 0 && !canAdvance) {
      toast.error("Add a project title and project type to continue");
      return;
    }
    if (currentStep < STEPS.length - 1) {
      handleSaveDraft();
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.info("Step " + (currentStep + 2) + " coming soon");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGenerateDeck = async () => {
    if (exportFormats.length === 0) {
      toast.error("Pick at least one export format");
      return;
    }
    setIsGeneratingDeck(true);
    try {
      handleSaveDraft();
      toast.success("Opening your pitch deck preview…");
      navigate("/pitch-deck/preview");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to generate deck");
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  const progressPct = ((currentStep + 1) / STEPS.length) * 100;
  const projectTypeLabel =
    PROJECT_TYPES.find((p) => p.value === data.projectType)?.label || "";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-md"
        style={{ backgroundColor: "rgba(10,10,15,0.85)", borderColor: "#1a1a26" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/toolbox"
              className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 transition hover:bg-[#1a1a26] hover:text-white"
              aria-label="Back to toolbox"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Pitch Deck Maker
              </h1>
              <p className="text-xs text-zinc-500">
                Step {currentStep + 1} of {STEPS.length} · {STEPS[currentStep].label}
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-zinc-300 transition hover:border-[#f5a623] hover:text-white"
            style={{ borderColor: "#1a1a26", backgroundColor: "#12121a" }}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full" style={{ height: "3px", backgroundColor: "#12121a" }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              backgroundColor: "#f5a623",
              boxShadow: "0 0 12px rgba(245,166,35,0.6)",
            }}
          />
        </div>

        {/* Step tabs */}
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-3 overflow-x-auto">
          {STEPS.map((s, i) => {
            const active = i === currentStep;
            return (
              <div
                key={s.num}
                className="flex items-center gap-2 text-xs whitespace-nowrap transition"
                style={{
                  color: active ? "#f5a623" : "#52525b",
                }}
              >
                <span className="font-mono font-semibold">{s.num}</span>
                <span className={active ? "font-medium" : ""}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left — Form (40%) */}
          <section className="lg:col-span-2">
            <div
              className="rounded-xl border p-6"
              style={{ backgroundColor: "#12121a", borderColor: "#1a1a26" }}
            >
              {currentStep === 0 && (
                <div className="mb-6">
                  <p className="font-mono text-xs tracking-widest text-[#f5a623]">
                    01 — THE PITCH
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Set the foundation
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    These core details shape every page of your deck.
                  </p>
                </div>
              )}

              {currentStep === 0 && (

              <div className="space-y-5">
                {/* Project Title */}
                <Field label="Project Title" required>
                  <input
                    type="text"
                    value={data.projectTitle}
                    onChange={(e) => update("projectTitle", e.target.value)}
                    placeholder="The working title of your project"
                    className="w-full rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                    style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
                  />
                </Field>

                {/* Project Type */}
                <Field label="Project Type" required>
                  <select
                    value={data.projectType}
                    onChange={(e) =>
                      update("projectType", e.target.value as ProjectType)
                    }
                    className="w-full rounded-md border px-3 py-2.5 text-sm text-white focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                    style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
                  >
                    <option value="" disabled>
                      Select project type
                    </option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Logline */}
                <Field label="Logline">
                  <textarea
                    value={data.logline}
                    onChange={(e) => update("logline", e.target.value)}
                    placeholder="A one or two sentence summary of your story."
                    rows={3}
                    className="w-full resize-none rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                    style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateLogline}
                    disabled={isGeneratingLogline}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-md border bg-transparent px-2.5 text-xs font-medium text-[#f5a623] transition hover:bg-[#f5a623]/10 disabled:opacity-50"
                    style={{ borderColor: "#f5a623", height: "28px" }}
                  >
                    {isGeneratingLogline ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    ✦ Generate
                  </button>
                </Field>

                {/* Genre */}
                <Field label="Genre">
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((g) => {
                      const on = data.genre.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleInArray("genre", g)}
                          className="rounded-full border px-3 py-1 text-xs transition"
                          style={{
                            backgroundColor: on ? "#f5a623" : "#1a1a26",
                            borderColor: on ? "#f5a623" : "#2a2a36",
                            color: on ? "#000000" : "#a1a1aa",
                            fontWeight: on ? 600 : 400,
                            boxShadow: on ? "0 0 12px rgba(245,166,35,0.35)" : "none",
                          }}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {/* Rating */}
                <Field label="Target Rating">
                  <select
                    value={data.targetRating}
                    onChange={(e) => update("targetRating", e.target.value)}
                    className="w-full rounded-md border px-3 py-2.5 text-sm text-white focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                    style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
                  >
                    <option value="" disabled>
                      Select rating
                    </option>
                    {RATINGS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Platforms */}
                <Field label="Target Platforms">
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => {
                      const on = data.targetPlatforms.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => toggleInArray("targetPlatforms", p)}
                          className="rounded-full border px-3 py-1 text-xs transition"
                          style={{
                            backgroundColor: on ? "#f5a623" : "#1a1a26",
                            borderColor: on ? "#f5a623" : "#2a2a36",
                            color: on ? "#000000" : "#a1a1aa",
                            fontWeight: on ? 600 : 400,
                            boxShadow: on ? "0 0 12px rgba(245,166,35,0.35)" : "none",
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>
              )}

              {currentStep === 1 && (
                <Step2Story data={data} update={update} />
              )}

              {currentStep === 2 && (
                <Step3CharactersVisuals data={data} update={update} />
              )}

              {currentStep === 3 && (
                <Step4MarketTeam
                  data={data}
                  update={update}
                  exportFormats={exportFormats}
                  setExportFormats={setExportFormats}
                  onGenerateDeck={handleGenerateDeck}
                  isGeneratingDeck={isGeneratingDeck}
                />
              )}

              {/* Nav buttons */}
              <div className="mt-8 flex items-center gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-[#f5a623] hover:text-white"
                    style={{ borderColor: "#22222e", backgroundColor: "#1a1a26" }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={currentStep === 0 && !canAdvance}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    backgroundColor: "#f5a623",
                    color: "#0a0a0f",
                    boxShadow:
                      currentStep === 0 && !canAdvance
                        ? "none"
                        : "0 0 24px rgba(245,166,35,0.3)",
                  }}
                >
                  {currentStep < STEPS.length - 1
                    ? `Next: ${STEPS[currentStep + 1].label}`
                    : "Finish"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Right — Live preview (60%) */}
          <section className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Live Preview
                </p>
                <span className="text-xs text-zinc-600">Updates as you type</span>
              </div>

              <div
                className="relative flex flex-col rounded-xl border overflow-hidden"
                style={{
                  backgroundColor: "#0d0d18",
                  borderColor: "#22222e",
                  minHeight: "calc(100vh - 220px)",
                }}
              >
                {/* Film grain overlay */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
                  style={{
                    opacity: 0.12,
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                    backgroundSize: "200px 200px",
                  }}
                  aria-hidden="true"
                />

                {/* Poster area */}
                <div
                  className="relative aspect-[16/10] w-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a1a26 0%, #0a0a0f 60%, #1a1a26 100%)",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    {projectTypeLabel && (
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#f5a623]">
                        {projectTypeLabel}
                        {data.targetRating && (
                          <span className="ml-3 text-zinc-500">
                            · Rated {data.targetRating}
                          </span>
                        )}
                      </p>
                    )}
                    <h3 className="mt-3 text-4xl font-bold leading-tight text-white">
                      {data.projectTitle || (
                        <span className="text-zinc-700">Your project title</span>
                      )}
                    </h3>
                    {data.genre.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {data.genre.map((g) => (
                          <span
                            key={g}
                            className="rounded-full border px-2.5 py-0.5 text-xs text-zinc-300"
                            style={{
                              borderColor: "rgba(245,166,35,0.4)",
                              backgroundColor: "rgba(245,166,35,0.08)",
                            }}
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Body — Step 1 */}
                {currentStep === 0 && (
                  <div className="flex-1 p-8">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Logline
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-zinc-200">
                      {data.logline || (
                        <span className="text-zinc-700">
                          Your one-line story hook will appear here as you write it.
                        </span>
                      )}
                    </p>

                    {data.targetPlatforms.length > 0 && (
                      <div className="mt-6 border-t pt-6" style={{ borderColor: "#1a1a26" }}>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Target Platforms
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {data.targetPlatforms.map((p) => (
                            <span
                              key={p}
                              className="rounded-md px-2.5 py-1 text-xs text-zinc-300"
                              style={{ backgroundColor: "#1a1a26" }}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Body — Step 2 */}
                {currentStep === 1 && (
                  <div className="flex-1 p-8 space-y-6">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Synopsis
                      </p>
                      <p className="mt-2 italic text-base leading-relaxed text-zinc-300 relative">
                        {data.synopsis ? (
                          <>
                            <span>
                              {data.synopsis.length > 150
                                ? data.synopsis.slice(0, 150)
                                : data.synopsis}
                            </span>
                            {data.synopsis.length > 150 && (
                              <span
                                style={{
                                  background:
                                    "linear-gradient(to right, transparent, #0d0d18)",
                                }}
                                className="ml-0 inline-block w-12 h-5 align-middle"
                              >
                                …
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="not-italic text-zinc-700">
                            Your synopsis preview will appear here.
                          </span>
                        )}
                      </p>
                    </div>

                    {data.toneMood && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Tone & Mood
                        </p>
                        <span
                          className="mt-2 inline-block rounded-full px-3 py-1 text-xs"
                          style={{
                            backgroundColor: "#f5a623",
                            color: "#000",
                            fontWeight: 600,
                            boxShadow: "0 0 12px rgba(245,166,35,0.35)",
                          }}
                        >
                          {data.toneMood}
                        </span>
                      </div>
                    )}

                    {(data.themes ?? []).length > 0 && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Themes
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(data.themes ?? []).map((t) => (
                            <span
                              key={t}
                              className="rounded-md px-2.5 py-1 text-xs text-zinc-300"
                              style={{ backgroundColor: "#1a1a26" }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(data.characters as CharacterEntry[] | undefined)?.length ? (
                      <div className="border-t pt-6" style={{ borderColor: "#1a1a26" }}>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Main Characters
                        </p>
                        <ul className="mt-3 space-y-2">
                          {(data.characters as CharacterEntry[]).map((c, i) => (
                            <li
                              key={i}
                              className="flex items-baseline gap-3 border-l-2 pl-3"
                              style={{ borderColor: "#f5a623" }}
                            >
                              <span className="text-sm font-semibold text-white">
                                {c.name || (
                                  <span className="text-zinc-700 font-normal">
                                    Unnamed
                                  </span>
                                )}
                              </span>
                              {c.role && (
                                <span className="text-xs text-zinc-400">— {c.role}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Body — Step 3 */}
                {currentStep === 2 && (
                  <div className="flex-1 p-8 space-y-6">
                    {(() => {
                      const tpl = STYLE_TEMPLATES.find((t) => t.id === data.selectedTemplate);
                      return tpl ? (
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                            Visual Template
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <div
                              className="h-3 w-32 rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${tpl.from} 0%, ${tpl.to} 100%)`,
                                boxShadow: `0 0 18px ${tpl.to}55`,
                              }}
                            />
                            <span className="text-xs font-medium text-zinc-300">
                              {tpl.label}
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {data.visualStyle && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Visual Style
                        </p>
                        <p className="mt-2 text-sm italic leading-relaxed text-zinc-300 line-clamp-4">
                          {data.visualStyle}
                        </p>
                      </div>
                    )}

                    {(data.characters as VisualCharacter[] | undefined)?.length ? (
                      <div className="border-t pt-6" style={{ borderColor: "#1a1a26" }}>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Characters
                        </p>
                        <ul className="mt-3 space-y-2">
                          {(data.characters as VisualCharacter[]).map((c, i) => (
                            <li
                              key={i}
                              className="border-l-2 pl-3"
                              style={{ borderColor: "#f5a623" }}
                            >
                              <div className="flex items-baseline gap-2">
                                <span className="text-sm font-semibold text-white">
                                  {c.name || (
                                    <span className="text-zinc-700 font-normal">Unnamed</span>
                                  )}
                                </span>
                                {c.role && (
                                  <span className="text-xs text-zinc-400">— {c.role}</span>
                                )}
                              </div>
                              {c.description && (
                                <p className="mt-0.5 text-xs text-zinc-500">{c.description}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {data.posterImage && (
                      <div className="border-t pt-6" style={{ borderColor: "#1a1a26" }}>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Poster
                        </p>
                        <img
                          src={data.posterImage}
                          alt="Poster preview"
                          className="mt-2 max-h-64 rounded-md border"
                          style={{ borderColor: "#22222e" }}
                        />
                      </div>
                    )}

                    {!data.selectedTemplate && !data.visualStyle && !data.posterImage && !((data.characters as any[])?.length) && (
                      <p className="text-sm text-zinc-600">
                        Pick a template or add a character to see your visual identity here.
                      </p>
                    )}
                  </div>
                )}

                {/* Body — Step 4 */}
                {currentStep === 3 && (
                  <div className="flex-1 p-8 space-y-6">
                    {data.logline && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Logline</p>
                        <p className="mt-1 text-sm text-zinc-300">{data.logline}</p>
                      </div>
                    )}

                    {data.synopsis && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Synopsis</p>
                        <p className="mt-1 italic text-sm text-zinc-400 line-clamp-3">{data.synopsis}</p>
                      </div>
                    )}

                    {((data.comparables as any[]) ?? []).length > 0 && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Comparables</p>
                        <ul className="mt-2 space-y-1">
                          {((data.comparables as any[]) ?? []).map((c, i) => (
                            <li key={i} className="text-sm text-zinc-300">
                              <span className="font-semibold text-white">{c.title || "—"}</span>
                              {c.year && <span className="text-zinc-500"> ({c.year})</span>}
                              {c.revenue && <span className="text-zinc-500"> · {c.revenue}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {((data.teamMembers as TeamMember[]) ?? []).length > 0 && (
                      <div className="border-t pt-6" style={{ borderColor: "#1a1a26" }}>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Team</p>
                        <ul className="mt-2 space-y-1">
                          {((data.teamMembers as TeamMember[]) ?? []).map((m, i) => (
                            <li key={i} className="flex items-baseline gap-2 text-sm">
                              <span className="font-semibold text-white">{m.name || "—"}</span>
                              {m.role && <span className="text-xs text-zinc-400">— {m.role}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      {data.budgetRange && (
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-xs"
                          style={{
                            backgroundColor: "#1a1a26",
                            color: "#e4e4e7",
                            border: "1px solid #2a2a36",
                          }}
                        >
                          Budget · {data.budgetRange}
                        </span>
                      )}
                      {data.unionStatus && (
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-xs"
                          style={{
                            backgroundColor: "#1a1a26",
                            color: "#e4e4e7",
                            border: "1px solid #2a2a36",
                          }}
                        >
                          {data.unionStatus}
                        </span>
                      )}
                      {data.timeline && (
                        <span className="text-xs text-zinc-500">{data.timeline}</span>
                      )}
                    </div>

                    {data.targetPlatforms.length > 0 && (
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Distribution</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {data.targetPlatforms.map((p) => (
                            <span
                              key={p}
                              className="rounded-md px-2.5 py-1 text-xs text-zinc-300"
                              style={{ backgroundColor: "#1a1a26" }}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.investmentAsk && (
                      <div className="mt-4 border-t pt-6" style={{ borderColor: "#1a1a26" }}>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                          Investment Ask
                        </p>
                        <p
                          className="mt-2 text-2xl font-bold leading-tight"
                          style={{
                            color: "#f5a623",
                            textShadow: "0 0 18px rgba(245,166,35,0.45)",
                          }}
                        >
                          {data.investmentAsk}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// ============================================================================
// Field
// ============================================================================

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="mb-1.5 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
      {label}
      {required && <span className="text-[#f5a623]">*</span>}
    </label>
    {children}
  </div>
);

export default PitchDeckMaker;
