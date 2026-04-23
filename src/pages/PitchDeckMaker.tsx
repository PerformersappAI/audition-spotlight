import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  { num: "01", label: "The Pitch" },
  { num: "02", label: "Story" },
  { num: "03", label: "Characters & Visuals" },
  { num: "04", label: "Market & Team" },
];

// ============================================================================
// Component
// ============================================================================

const PitchDeckMaker = () => {
  const [data, setData] = useState<PitchDeckData>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingLogline, setIsGeneratingLogline] = useState(false);

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
    if (!canAdvance) {
      toast.error("Add a project title and project type to continue");
      return;
    }
    handleSaveDraft();
    toast.info("Step 2 coming soon");
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
        <div className="h-1 w-full" style={{ backgroundColor: "#12121a" }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              backgroundColor: "#f5a623",
              boxShadow: "0 0 12px rgba(245,166,35,0.5)",
            }}
          />
        </div>

        {/* Step pips */}
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3 overflow-x-auto">
          {STEPS.map((s, i) => {
            const active = i === currentStep;
            const done = i < currentStep;
            return (
              <div
                key={s.num}
                className="flex items-center gap-2 text-xs whitespace-nowrap"
                style={{
                  color: active ? "#f5a623" : done ? "#a1a1aa" : "#52525b",
                }}
              >
                <span className="font-mono">{s.num}</span>
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
                    className="mt-2 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium text-[#f5a623] transition hover:bg-[#f5a623]/10 disabled:opacity-50"
                    style={{ borderColor: "rgba(245,166,35,0.3)" }}
                  >
                    {isGeneratingLogline ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    Generate
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
                            borderColor: on ? "#f5a623" : "#1a1a26",
                            color: on ? "#0a0a0f" : "#a1a1aa",
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
                            borderColor: on ? "#f5a623" : "#1a1a26",
                            color: on ? "#0a0a0f" : "#a1a1aa",
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                disabled={!canAdvance}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  backgroundColor: "#f5a623",
                  color: "#0a0a0f",
                  boxShadow: canAdvance
                    ? "0 0 24px rgba(245,166,35,0.3)"
                    : "none",
                }}
              >
                Next: Story
                <ChevronRight className="h-4 w-4" />
              </button>
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
                className="rounded-xl border overflow-hidden"
                style={{ backgroundColor: "#12121a", borderColor: "#1a1a26" }}
              >
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

                {/* Body */}
                <div className="p-8">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Logline
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-zinc-200">
                    {data.logline || (
                      <span className="text-zinc-700">
                        Your one-line story hook will appear here as you write
                        it.
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
              </div>

              <p className="mt-4 text-center text-xs text-zinc-600">
                Page 1 of your pitch deck
              </p>
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
