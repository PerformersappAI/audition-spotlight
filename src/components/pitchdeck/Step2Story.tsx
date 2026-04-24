import { useState, KeyboardEvent } from "react";
import { Sparkles, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PitchDeckData } from "@/pages/PitchDeckMaker";

export interface CharacterEntry {
  name: string;
  role: string;
}

interface Step2Props {
  data: PitchDeckData;
  update: <K extends keyof PitchDeckData>(key: K, value: PitchDeckData[K]) => void;
}

const MAX_THEMES = 6;
const MAX_CHARACTERS = 4;

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
      {hint && <span className="text-[10px] normal-case tracking-normal text-zinc-600">{hint}</span>}
    </label>
    {children}
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

const Step2Story = ({ data, update }: Step2Props) => {
  const [isExpandingSynopsis, setIsExpandingSynopsis] = useState(false);
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);
  const [isGeneratingNorthStar, setIsGeneratingNorthStar] = useState(false);
  const [isGeneratingWorld, setIsGeneratingWorld] = useState(false);
  const [isGeneratingEpisodes, setIsGeneratingEpisodes] = useState(false);
  const [themeInput, setThemeInput] = useState("");

  const themes = data.themes ?? [];
  const characters: CharacterEntry[] = (data.characters as CharacterEntry[]) ?? [];
  const episodes = data.episodes ?? [];
  const isSeries = data.projectType === "tv_series" || data.projectType === "mini_series";

  const callAI = async (
    field: string,
    setLoading: (b: boolean) => void,
    targetKey: keyof PitchDeckData,
    successMsg: string,
  ) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-pitch-content", {
        body: {
          field,
          context: {
            projectTitle: data.projectTitle,
            projectType: data.projectType,
            genre: data.genre,
            targetRating: data.targetRating,
            logline: data.logline,
            synopsis: data.synopsis,
            toneMood: data.toneMood,
            themes: data.themes,
            shootingLocations: data.shootingLocations,
          },
        },
      });
      if (error) throw error;
      if (result?.content !== undefined) {
        update(targetKey, result.content as any);
        toast.success(successMsg);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExpandSynopsis = () => {
    if (!data.logline?.trim()) {
      toast.error("Write a logline in Step 1 first");
      return;
    }
    callAI("synopsis", setIsExpandingSynopsis, "synopsis", "Synopsis expanded");
  };

  const handleGenerateVision = () => {
    if (!data.logline?.trim() && !data.synopsis?.trim()) {
      toast.error("Add a logline or synopsis first");
      return;
    }
    callAI("directorVision", setIsGeneratingVision, "directorVision", "Vision generated");
  };

  const handleGenerateNorthStar = () => {
    if (!data.logline?.trim() && !data.synopsis?.trim()) {
      toast.error("Add a logline or synopsis first");
      return;
    }
    callAI("northStar", setIsGeneratingNorthStar, "northStar", "North Star generated");
  };

  const handleGenerateWorld = () => {
    if (!data.synopsis?.trim() && !data.logline?.trim()) {
      toast.error("Add a synopsis or logline first");
      return;
    }
    callAI("worldSetting", setIsGeneratingWorld, "worldSetting", "World statement generated");
  };

  const handleGenerateEpisodes = async () => {
    if (!data.synopsis?.trim()) {
      toast.error("Write a synopsis first so episodes can build on it");
      return;
    }
    setIsGeneratingEpisodes(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-pitch-content", {
        body: {
          field: "episodes",
          context: {
            projectTitle: data.projectTitle,
            projectType: data.projectType,
            genre: data.genre,
            logline: data.logline,
            synopsis: data.synopsis,
            toneMood: data.toneMood,
            episodeCount: episodes.length || 6,
          },
        },
      });
      if (error) throw error;
      const arr = result?.episodes || result?.content;
      if (Array.isArray(arr)) {
        update("episodes", arr.map((e: any) => ({
          title: String(e.title || ""),
          logline: String(e.logline || e.summary || ""),
        })) as any);
        toast.success("Episodes generated");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to generate episodes");
    } finally {
      setIsGeneratingEpisodes(false);
    }
  };

  const addTheme = () => {
    const t = themeInput.trim();
    if (!t) return;
    if (themes.length >= MAX_THEMES) {
      toast.error(`Max ${MAX_THEMES} themes`);
      return;
    }
    if (themes.includes(t)) {
      setThemeInput("");
      return;
    }
    update("themes", [...themes, t]);
    setThemeInput("");
  };

  const removeTheme = (t: string) => {
    update(
      "themes",
      themes.filter((x) => x !== t),
    );
  };

  const onThemeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTheme();
    } else if (e.key === "Backspace" && !themeInput && themes.length) {
      update("themes", themes.slice(0, -1));
    }
  };

  const addCharacter = () => {
    if (characters.length >= MAX_CHARACTERS) {
      toast.error(`Max ${MAX_CHARACTERS} characters at this step`);
      return;
    }
    update("characters", [...characters, { name: "", role: "" }] as any);
  };

  const updateCharacter = (i: number, key: keyof CharacterEntry, value: string) => {
    const next = characters.map((c, idx) => (idx === i ? { ...c, [key]: value } : c));
    update("characters", next as any);
  };

  const removeCharacter = (i: number) => {
    update("characters", characters.filter((_, idx) => idx !== i) as any);
  };

  return (
    <>
      <div className="mb-6">
        <p className="font-mono text-xs tracking-widest text-[#f5a623]">02 — STORY</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Shape the narrative</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Synopsis, vision, and the people who carry your story.
        </p>
      </div>

      <div className="space-y-5">
        {/* Synopsis */}
        <Field label="Synopsis">
          <textarea
            value={data.synopsis ?? ""}
            onChange={(e) => update("synopsis", e.target.value)}
            placeholder="Tell your story in 300-500 words..."
            rows={6}
            className="w-full resize-none rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
            style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
          />
          <GhostAIButton
            onClick={handleExpandSynopsis}
            loading={isExpandingSynopsis}
            label="Expand from Logline"
          />
        </Field>

        {/* Director's Vision */}
        <Field label="Director's Vision">
          <textarea
            value={data.directorVision ?? ""}
            onChange={(e) => update("directorVision", e.target.value)}
            placeholder="Describe your creative vision..."
            rows={4}
            className="w-full resize-none rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
            style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
          />
          <GhostAIButton
            onClick={handleGenerateVision}
            loading={isGeneratingVision}
            label="Generate Vision"
          />
        </Field>

        {/* North Star — Why this story, why you, why now */}
        <Field label="North Star" hint="Why this story · Why you · Why now">
          <textarea
            value={data.northStar ?? ""}
            onChange={(e) => update("northStar", e.target.value)}
            placeholder="The single emotional truth at the heart of your project."
            rows={3}
            className="w-full resize-none rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
            style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
          />
          <GhostAIButton
            onClick={handleGenerateNorthStar}
            loading={isGeneratingNorthStar}
            label="Generate North Star"
          />
        </Field>

        {/* World / Setting */}
        <Field label="World & Setting" hint="The location is a character">
          <textarea
            value={data.worldSetting ?? ""}
            onChange={(e) => update("worldSetting", e.target.value)}
            placeholder="Why must this story be set HERE? What does the place do to your characters?"
            rows={3}
            className="w-full resize-none rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
            style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
          />
          <GhostAIButton
            onClick={handleGenerateWorld}
            loading={isGeneratingWorld}
            label="Generate World Statement"
          />
        </Field>

        {/* Tone & Mood */}
        <Field label="Tone & Mood">
          <input
            type="text"
            value={data.toneMood ?? ""}
            onChange={(e) => update("toneMood", e.target.value)}
            placeholder="e.g. Dark and haunting with moments of grace"
            className="w-full rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
            style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
          />
        </Field>

        {/* Episodes — TV / mini-series only */}
        {isSeries && (
          <Field label="Episode Breakdown" hint={`${episodes.length} episode${episodes.length === 1 ? "" : "s"}`}>
            <div className="space-y-2">
              {episodes.map((ep, i) => (
                <div key={i} className="rounded-md border p-2" style={{ backgroundColor: "#1a1a26", borderColor: "#22222e" }}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#f5a623]">EP {String(i + 1).padStart(2, "0")}</span>
                    <input
                      type="text"
                      value={ep.title}
                      onChange={(e) => update("episodes", episodes.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x) as any)}
                      placeholder="Episode title"
                      className="flex-1 rounded bg-[#12121a] px-2 py-1 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                    />
                    <button
                      type="button"
                      onClick={() => update("episodes", episodes.filter((_, idx) => idx !== i) as any)}
                      className="text-zinc-500 hover:text-red-400"
                      aria-label="Remove episode"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <textarea
                    value={ep.logline}
                    onChange={(e) => update("episodes", episodes.map((x, idx) => idx === i ? { ...x, logline: e.target.value } : x) as any)}
                    placeholder="Episode logline (2-3 sentences)"
                    rows={2}
                    className="mt-2 w-full resize-none rounded bg-[#12121a] px-2 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                  />
                </div>
              ))}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => update("episodes", [...episodes, { title: "", logline: "" }] as any)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-dashed py-2 text-xs font-medium text-zinc-400 transition hover:border-[#f5a623] hover:text-[#f5a623]"
                  style={{ borderColor: "#2a2a36" }}
                >
                  <Plus className="h-3.5 w-3.5" /> Add Episode
                </button>
                <GhostAIButton
                  onClick={handleGenerateEpisodes}
                  loading={isGeneratingEpisodes}
                  label="Generate Breakdown"
                />
              </div>
            </div>
          </Field>
        )}

        {/* Key Themes */}
        <Field label="Key Themes" hint={`${themes.length}/${MAX_THEMES}`}>
          <div
            className="flex flex-wrap items-center gap-2 rounded-md border p-2 focus-within:border-[#f5a623]"
            style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
          >
            {themes.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs"
                style={{
                  backgroundColor: "#f5a623",
                  color: "#000",
                  fontWeight: 600,
                  boxShadow: "0 0 12px rgba(245,166,35,0.35)",
                }}
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTheme(t)}
                  className="opacity-70 hover:opacity-100"
                  aria-label={`Remove ${t}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {themes.length < MAX_THEMES && (
              <input
                type="text"
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                onKeyDown={onThemeKeyDown}
                onBlur={addTheme}
                placeholder={themes.length ? "Add another…" : "Type a theme and press Enter"}
                className="min-w-[140px] flex-1 bg-transparent px-1 py-0.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
              />
            )}
          </div>
        </Field>

        {/* Main Characters */}
        <Field label="Main Characters" hint={`${characters.length}/${MAX_CHARACTERS}`}>
          <div className="space-y-2">
            {characters.map((c, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1.6fr_auto] gap-2 rounded-md border p-2"
                style={{ backgroundColor: "#1a1a26", borderColor: "#22222e" }}
              >
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => updateCharacter(i, "name", e.target.value)}
                  placeholder="Character name"
                  className="rounded border-none bg-[#12121a] px-2 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                />
                <input
                  type="text"
                  value={c.role}
                  onChange={(e) => updateCharacter(i, "role", e.target.value)}
                  placeholder="Role / one-line description"
                  className="rounded border-none bg-[#12121a] px-2 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
                />
                <button
                  type="button"
                  onClick={() => removeCharacter(i)}
                  className="flex h-8 w-8 items-center justify-center rounded text-zinc-500 hover:bg-[#12121a] hover:text-white"
                  aria-label="Remove character"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {characters.length < MAX_CHARACTERS && (
              <button
                type="button"
                onClick={addCharacter}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed py-2.5 text-xs font-medium text-zinc-400 transition hover:border-[#f5a623] hover:text-[#f5a623]"
                style={{ borderColor: "#2a2a36" }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Character
              </button>
            )}
          </div>
        </Field>
      </div>
    </>
  );
};

export default Step2Story;
