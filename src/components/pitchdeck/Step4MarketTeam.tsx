import { useState } from "react";
import { Sparkles, Loader2, Plus, X, FileText, FileImage, Link2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PitchDeckData } from "@/pages/PitchDeckMaker";

export interface Comparable {
  title: string;
  year: string;
  revenue: string;
  why: string;
  posterUrl?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  imdbUrl?: string;
  credits?: string;
}

interface Step4Props {
  data: PitchDeckData;
  update: <K extends keyof PitchDeckData>(key: K, value: PitchDeckData[K]) => void;
  exportFormats: string[];
  setExportFormats: (f: string[]) => void;
  onGenerateDeck: () => void;
  isGeneratingDeck: boolean;
}

const MAX_COMPS = 3;
const MAX_TEAM = 5;

const BUDGET_RANGES = [
  "Under $100K",
  "$100K–$500K",
  "$500K–$5M",
  "$5M–$20M",
  "$20M+",
];

const UNION_OPTIONS = ["SAG-AFTRA", "Non-Union", "Mixed", "TBD"];

const EXPORT_OPTIONS = [
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "pptx", label: "PPTX", icon: FileImage },
  { id: "link", label: "Shareable Link", icon: Link2 },
];

const Field = ({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div>
    <label className="mb-1.5 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-400">
      <span>{label}</span>
      {hint && (
        <span className="text-[10px] normal-case tracking-normal text-zinc-600">
          {hint}
        </span>
      )}
    </label>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-3 mt-2">
    <p className="font-mono text-[10px] uppercase tracking-widest text-[#f5a623]">
      {title}
    </p>
    {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
  </div>
);

const GhostAIButton = ({
  onClick,
  loading,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="mt-2 inline-flex items-center gap-1.5 rounded-md border bg-transparent px-2.5 text-xs font-medium text-[#f5a623] transition hover:bg-[#f5a623]/10 disabled:opacity-50"
    style={{ borderColor: "#f5a623", height: "28px" }}
  >
    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
    ✦ {label}
  </button>
);

const inputStyle = { backgroundColor: "#1a1a26", borderColor: "#1a1a26" };
const inputClass =
  "w-full rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]";

const Step4MarketTeam = ({
  data,
  update,
  exportFormats,
  setExportFormats,
  onGenerateDeck,
  isGeneratingDeck,
}: Step4Props) => {
  const [isSuggestingComps, setIsSuggestingComps] = useState(false);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);

  const comparables: Comparable[] = (data.comparables as Comparable[]) ?? [];
  const team: TeamMember[] = (data.teamMembers as TeamMember[]) ?? [];

  // Comparables
  const addComp = () => {
    if (comparables.length >= MAX_COMPS) {
      toast.error(`Max ${MAX_COMPS} comparables`);
      return;
    }
    update("comparables", [
      ...comparables,
      { title: "", year: "", revenue: "", why: "" },
    ] as any);
  };
  const updateComp = (i: number, key: keyof Comparable, value: string) => {
    update(
      "comparables",
      comparables.map((c, idx) => (idx === i ? { ...c, [key]: value } : c)) as any,
    );
  };
  const removeComp = (i: number) => {
    update("comparables", comparables.filter((_, idx) => idx !== i) as any);
  };

  const handleSuggestComps = async () => {
    if (!data.logline?.trim() && !data.synopsis?.trim()) {
      toast.error("Add a logline or synopsis first");
      return;
    }
    setIsSuggestingComps(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        "generate-pitch-content",
        {
          body: {
            field: "comparables",
            context: {
              projectTitle: data.projectTitle,
              projectType: data.projectType,
              genre: data.genre,
              logline: data.logline,
              synopsis: data.synopsis,
              toneMood: data.toneMood,
            },
          },
        },
      );
      if (error) throw error;
      // Try to parse comps if returned as array, otherwise fall back to dropping into 'why' of a new entry
      const content = result?.content;
      if (Array.isArray(content)) {
        update(
          "comparables",
          content.slice(0, MAX_COMPS).map((c: any) => ({
            title: c.title || "",
            year: String(c.year || ""),
            revenue: c.revenue || c.boxOffice || "",
            why: c.why || c.reason || "",
          })) as any,
        );
        toast.success("Comparables suggested");
      } else if (typeof content === "string" && content.trim()) {
        // Drop the suggestion into the first empty "why" field, or append a new entry
        const empty = comparables.findIndex((c) => !c.title && !c.why);
        if (empty >= 0) {
          updateComp(empty, "why", content);
        } else if (comparables.length < MAX_COMPS) {
          update("comparables", [
            ...comparables,
            { title: "", year: "", revenue: "", why: content },
          ] as any);
        }
        toast.success("Suggestion added");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to suggest comparables");
    } finally {
      setIsSuggestingComps(false);
    }
  };

  // Team
  const addTeam = () => {
    if (team.length >= MAX_TEAM) {
      toast.error(`Max ${MAX_TEAM} team members`);
      return;
    }
    update("teamMembers", [...team, { name: "", role: "" }] as any);
  };
  const updateTeam = (i: number, key: keyof TeamMember, value: string) => {
    update(
      "teamMembers",
      team.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)) as any,
    );
  };
  const removeTeam = (i: number) => {
    update("teamMembers", team.filter((_, idx) => idx !== i) as any);
  };

  // Distribution strategy
  const handleGenerateStrategy = async () => {
    setIsGeneratingStrategy(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        "generate-pitch-content",
        {
          body: {
            field: "distributionPlan",
            context: {
              projectTitle: data.projectTitle,
              projectType: data.projectType,
              genre: data.genre,
              targetRating: data.targetRating,
              targetPlatforms: data.targetPlatforms,
              logline: data.logline,
              synopsis: data.synopsis,
              budgetRange: data.budgetRange,
              primaryDemographic: data.primaryDemographic,
            },
          },
        },
      );
      if (error) throw error;
      if (result?.content) {
        update("distributionPlan", String(result.content));
        toast.success("Strategy generated");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to generate strategy");
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  const toggleExport = (id: string) => {
    if (exportFormats.includes(id)) {
      setExportFormats(exportFormats.filter((f) => f !== id));
    } else {
      setExportFormats([...exportFormats, id]);
    }
  };

  return (
    <>
      <div className="mb-6">
        <p className="font-mono text-xs tracking-widest text-[#f5a623]">
          04 — MARKET & TEAM
        </p>
        <h2 className="mt-1 text-xl font-semibold text-white">
          Position the project
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Comparables, the people behind it, the budget, and how it gets to
          audiences.
        </p>
      </div>

      <div className="space-y-6">
        {/* COMPARABLES */}
        <div>
          <SectionHeader
            title="Comparables"
            subtitle="Up to 3 films or shows that prove your market"
          />
          <div className="space-y-2">
            {comparables.map((c, i) => (
              <div
                key={i}
                className="rounded-md border p-3"
                style={{ backgroundColor: "#1a1a26", borderColor: "#22222e" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-[2fr_70px_1fr]">
                    <input
                      type="text"
                      value={c.title}
                      onChange={(e) => updateComp(i, "title", e.target.value)}
                      placeholder="Title"
                      className="rounded bg-[#12121a] px-2 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                    />
                    <input
                      type="text"
                      value={c.year}
                      onChange={(e) => updateComp(i, "year", e.target.value)}
                      placeholder="Year"
                      className="rounded bg-[#12121a] px-2 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                    />
                    <input
                      type="text"
                      value={c.revenue}
                      onChange={(e) => updateComp(i, "revenue", e.target.value)}
                      placeholder="Box Office / Revenue"
                      className="rounded bg-[#12121a] px-2 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeComp(i)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-zinc-500 hover:bg-[#12121a] hover:text-white"
                    aria-label="Remove comparable"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={c.why}
                  onChange={(e) => updateComp(i, "why", e.target.value)}
                  placeholder="Why it compares (one line)"
                  className="mt-2 w-full rounded bg-[#12121a] px-2 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                />
              </div>
            ))}
            {comparables.length < MAX_COMPS && (
              <button
                type="button"
                onClick={addComp}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed py-2.5 text-xs font-medium text-zinc-400 transition hover:border-[#f5a623] hover:text-[#f5a623]"
                style={{ borderColor: "#2a2a36" }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Comparable
              </button>
            )}
          </div>
          <GhostAIButton
            onClick={handleSuggestComps}
            loading={isSuggestingComps}
            label="Suggest Comps"
          />
        </div>

        {/* TEAM */}
        <div>
          <SectionHeader title="Team" subtitle="Up to 5 key people" />
          <div className="space-y-2">
            {team.map((m, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_auto] gap-2 rounded-md border p-2"
                style={{ backgroundColor: "#1a1a26", borderColor: "#22222e" }}
              >
                <input
                  type="text"
                  value={m.name}
                  onChange={(e) => updateTeam(i, "name", e.target.value)}
                  placeholder="Name"
                  className="rounded bg-[#12121a] px-2 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                />
                <input
                  type="text"
                  value={m.role}
                  onChange={(e) => updateTeam(i, "role", e.target.value)}
                  placeholder="Role / Title"
                  className="rounded bg-[#12121a] px-2 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                />
                <button
                  type="button"
                  onClick={() => removeTeam(i)}
                  className="flex h-8 w-8 items-center justify-center rounded text-zinc-500 hover:bg-[#12121a] hover:text-white"
                  aria-label="Remove team member"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {team.length < MAX_TEAM && (
              <button
                type="button"
                onClick={addTeam}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed py-2.5 text-xs font-medium text-zinc-400 transition hover:border-[#f5a623] hover:text-[#f5a623]"
                style={{ borderColor: "#2a2a36" }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Team Member
              </button>
            )}
          </div>
        </div>

        {/* BUDGET & PRODUCTION */}
        <div>
          <SectionHeader title="Budget & Production" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Budget Range">
              <select
                value={data.budgetRange ?? ""}
                onChange={(e) => update("budgetRange", e.target.value)}
                className={inputClass}
                style={inputStyle}
              >
                <option value="" disabled>
                  Select range
                </option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Union Status">
              <select
                value={data.unionStatus ?? ""}
                onChange={(e) => update("unionStatus", e.target.value)}
                className={inputClass}
                style={inputStyle}
              >
                <option value="" disabled>
                  Select status
                </option>
                {UNION_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Shoot Location">
              <input
                type="text"
                value={data.shootingLocations ?? ""}
                onChange={(e) => update("shootingLocations", e.target.value)}
                placeholder="e.g. Atlanta, GA"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Production Timeline">
              <input
                type="text"
                value={data.timeline ?? ""}
                onChange={(e) => update("timeline", e.target.value)}
                placeholder="e.g. Shoot Oct 2025, Release Spring 2026"
                className={inputClass}
                style={inputStyle}
              />
            </Field>
          </div>
        </div>

        {/* DISTRIBUTION */}
        <div>
          <SectionHeader title="Distribution" />

          <Field label="Target Platforms" hint="From Step 1">
            <div
              className="flex min-h-[44px] flex-wrap gap-2 rounded-md border px-3 py-2"
              style={{ backgroundColor: "#1a1a26", borderColor: "#22222e" }}
            >
              {data.targetPlatforms.length ? (
                data.targetPlatforms.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs"
                    style={{
                      backgroundColor: "#f5a623",
                      color: "#000",
                      fontWeight: 600,
                      boxShadow: "0 0 12px rgba(245,166,35,0.35)",
                    }}
                  >
                    {p}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-600">
                  No platforms selected — go back to Step 1 to add them.
                </span>
              )}
            </div>
          </Field>

          <div className="mt-4">
            <Field label="Distribution Plan">
              <textarea
                value={data.distributionPlan ?? ""}
                onChange={(e) => update("distributionPlan", e.target.value)}
                placeholder="How will this project reach its audience? Festival circuit, streaming partners, theatrical, marketing approach…"
                rows={4}
                className="w-full resize-none rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                style={inputStyle}
              />
              <GhostAIButton
                onClick={handleGenerateStrategy}
                loading={isGeneratingStrategy}
                label="Generate Strategy"
              />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Primary Demographic">
              <input
                type="text"
                value={data.primaryDemographic ?? ""}
                onChange={(e) => update("primaryDemographic", e.target.value)}
                placeholder="e.g. Adults 35-65, faith-based audiences"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Investment Ask">
              <input
                type="text"
                value={data.investmentAsk ?? ""}
                onChange={(e) => update("investmentAsk", e.target.value)}
                placeholder="e.g. Seeking $2M production financing"
                className={inputClass}
                style={inputStyle}
              />
            </Field>
          </div>
        </div>

        {/* EXPORT */}
        <div className="rounded-lg border p-4" style={{ borderColor: "#22222e", backgroundColor: "#0d0d18" }}>
          <SectionHeader title="Export Format" />
          <div className="mb-4 grid grid-cols-3 gap-2">
            {EXPORT_OPTIONS.map((opt) => {
              const on = exportFormats.includes(opt.id);
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleExport(opt.id)}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-md border py-3 text-xs font-medium transition"
                  style={{
                    backgroundColor: on ? "#f5a623" : "#1a1a26",
                    borderColor: on ? "#f5a623" : "#2a2a36",
                    color: on ? "#000" : "#a1a1aa",
                    fontWeight: on ? 600 : 500,
                    boxShadow: on ? "0 0 12px rgba(245,166,35,0.35)" : "none",
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onGenerateDeck}
            disabled={isGeneratingDeck || exportFormats.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-md text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              backgroundColor: "#f5a623",
              color: "#000",
              height: "56px",
              boxShadow: "0 0 32px rgba(245,166,35,0.35)",
            }}
          >
            {isGeneratingDeck ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            ✦ Generate Pitch Deck
          </button>
          <p className="mt-2 text-center text-[11px] text-zinc-500">
            Uses 5 credits
          </p>
        </div>
      </div>
    </>
  );
};

export default Step4MarketTeam;
