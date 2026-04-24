import { useState } from "react";
import { Plus, X, Sparkles, Loader2, Image as ImageIcon, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PitchDeckData } from "@/pages/PitchDeckMaker";

export interface VisualCharacter {
  name: string;
  role: string;
  description: string;
  portrait?: string;
}

export interface StyleTemplate {
  id: string;
  label: string;
  from: string;
  to: string;
}

export const STYLE_TEMPLATES: StyleTemplate[] = [
  { id: "epic", label: "Epic/Cinematic", from: "#000000", to: "#d4af37" },
  { id: "faith", label: "Faith/Inspirational", from: "#0a1f44", to: "#e0a458" },
  { id: "noir", label: "Thriller/Noir", from: "#000000", to: "#8b0000" },
  { id: "scifi", label: "Sci-Fi", from: "#0a1f44", to: "#00d4ff" },
  { id: "western", label: "Western", from: "#3b1f0a", to: "#f5a623" },
  { id: "drama", label: "Drama", from: "#1a1a1a", to: "#9ca3af" },
  { id: "horror", label: "Horror", from: "#000000", to: "#990000" },
  { id: "comedy", label: "Comedy", from: "#1a1a1a", to: "#fde047" },
  { id: "documentary", label: "Documentary", from: "#1e293b", to: "#f1f5f9" },
  { id: "action", label: "Action", from: "#000000", to: "#ff6a00" },
];

interface Props {
  data: PitchDeckData;
  update: <K extends keyof PitchDeckData>(key: K, value: PitchDeckData[K]) => void;
}

const Step3CharactersVisuals = ({ data, update }: Props) => {
  const characters: VisualCharacter[] = (data.characters as VisualCharacter[]) || [];
  const [generatingStyle, setGeneratingStyle] = useState(false);
  const [generatingPoster, setGeneratingPoster] = useState(false);
  const [generatingPortraitIdx, setGeneratingPortraitIdx] = useState<number | null>(null);

  const setCharacters = (next: VisualCharacter[]) =>
    update("characters", next as any);

  const addCharacter = () => {
    if (characters.length >= 4) {
      toast.error("Maximum 4 characters");
      return;
    }
    setCharacters([...characters, { name: "", role: "", description: "" }]);
  };

  const updateChar = (i: number, key: keyof VisualCharacter, value: string) => {
    const next = [...characters];
    next[i] = { ...next[i], [key]: value };
    setCharacters(next);
  };

  const removeChar = (i: number) => {
    setCharacters(characters.filter((_, idx) => idx !== i));
  };

  const handleGeneratePortrait = async (i: number) => {
    const c = characters[i];
    if (!c?.name?.trim()) {
      toast.error("Add a character name first");
      return;
    }
    setGeneratingPortraitIdx(i);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        "generate-character-portrait",
        {
          body: {
            characterName: c.name,
            characterRole: c.role,
            characterDescription: c.description,
            styleDescription: data.visualStyle,
            genre: data.genre,
            projectTitle: data.projectTitle,
          },
        },
      );
      if (error) throw error;
      const url = result?.imageUrl;
      if (url) {
        const next = [...characters];
        next[i] = { ...next[i], portrait: url };
        setCharacters(next);
        toast.success(`Portrait generated for ${c.name}`);
      } else {
        toast.error("No portrait returned");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to generate portrait");
    } finally {
      setGeneratingPortraitIdx(null);
    }
  };

  const handleGenerateStyle = async () => {
    if (!data.genre.length && !data.selectedTemplate) {
      toast.error("Pick a genre or template first");
      return;
    }
    setGeneratingStyle(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        "generate-pitch-content",
        {
          body: {
            field: "visualStyle",
            context: {
              projectTitle: data.projectTitle,
              genre: data.genre,
              logline: data.logline,
              toneMood: data.toneMood,
              template: data.selectedTemplate,
            },
          },
        },
      );
      if (error) throw error;
      if (result?.content) {
        update("visualStyle", result.content);
        toast.success("Style description generated");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to generate style");
    } finally {
      setGeneratingStyle(false);
    }
  };

  const handleGeneratePoster = async () => {
    if (!data.projectTitle) {
      toast.error("Add a project title first");
      return;
    }
    setGeneratingPoster(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        "generate-pitch-poster",
        {
          body: {
            projectTitle: data.projectTitle,
            genre: data.genre,
            logline: data.logline,
            visualStyle: data.visualStyle,
            template: data.selectedTemplate,
          },
        },
      );
      if (error) throw error;
      const url = result?.imageUrl || result?.posterUrl || result?.url;
      if (url) {
        update("posterImage", url);
        toast.success("Poster generated");
      } else {
        toast.error("No poster returned");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to generate poster");
    } finally {
      setGeneratingPoster(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="font-mono text-xs tracking-widest text-[#f5a623]">
          03 — CHARACTERS &amp; VISUALS
        </p>
        <h2 className="mt-1 text-xl font-semibold text-white">
          Define the look &amp; the cast
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Set the visual identity of your deck and introduce key roles.
        </p>
      </div>

      <div className="space-y-8">
        {/* CHARACTERS */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Characters
            </label>
            <span className="text-xs text-zinc-600">{characters.length}/4</span>
          </div>

          <div className="space-y-3">
            {characters.map((c, i) => (
              <div
                key={i}
                className="rounded-lg border p-3"
                style={{ backgroundColor: "#1a1a26", borderColor: "#22222e" }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => updateChar(i, "name", e.target.value)}
                        placeholder="Character Name"
                        className="rounded-md border px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none"
                        style={{ backgroundColor: "#0d0d18", borderColor: "#22222e" }}
                      />
                      <input
                        type="text"
                        value={c.role}
                        onChange={(e) => updateChar(i, "role", e.target.value)}
                        placeholder="Role (e.g. Protagonist)"
                        className="rounded-md border px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none"
                        style={{ backgroundColor: "#0d0d18", borderColor: "#22222e" }}
                      />
                    </div>
                    <input
                      type="text"
                      value={c.description}
                      onChange={(e) => updateChar(i, "description", e.target.value)}
                      placeholder="One-line description"
                      className="w-full rounded-md border px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none"
                      style={{ backgroundColor: "#0d0d18", borderColor: "#22222e" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChar(i)}
                    aria-label="Remove character"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-[#22222e] hover:text-red-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {characters.length < 4 && (
            <button
              type="button"
              onClick={addCharacter}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-dashed px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-[#f5a623] hover:text-[#f5a623]"
              style={{ borderColor: "#2a2a36" }}
            >
              <Plus className="h-3.5 w-3.5" /> Add Character
            </button>
          )}
        </section>

        {/* VISUAL STYLE */}
        <section>
          <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Visual Style Template
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {STYLE_TEMPLATES.map((t) => {
              const selected = data.selectedTemplate === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update("selectedTemplate", t.id)}
                  className="group shrink-0 overflow-hidden rounded-lg border-2 text-left transition"
                  style={{
                    width: "120px",
                    borderColor: selected ? "#f5a623" : "#22222e",
                    boxShadow: selected
                      ? "0 0 16px rgba(245,166,35,0.4)"
                      : "none",
                  }}
                >
                  <div
                    className="h-20 w-full"
                    style={{
                      background: `linear-gradient(135deg, ${t.from} 0%, ${t.to} 100%)`,
                    }}
                  />
                  <div
                    className="px-2 py-2 text-xs font-medium"
                    style={{
                      backgroundColor: "#0d0d18",
                      color: selected ? "#f5a623" : "#a1a1aa",
                    }}
                  >
                    {t.label}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* STYLE DESCRIPTION */}
        <section>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Visual Style Description
          </label>
          <textarea
            value={data.visualStyle || ""}
            onChange={(e) => update("visualStyle", e.target.value)}
            placeholder="Describe the look, palette, lighting and visual references for your project..."
            rows={4}
            className="w-full resize-none rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
            style={{ backgroundColor: "#1a1a26", borderColor: "#1a1a26" }}
          />
          <button
            type="button"
            onClick={handleGenerateStyle}
            disabled={generatingStyle}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md border bg-transparent px-2.5 text-xs font-medium text-[#f5a623] transition hover:bg-[#f5a623]/10 disabled:opacity-50"
            style={{ borderColor: "#f5a623", height: "28px" }}
          >
            {generatingStyle ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            ✦ Generate Style Description
          </button>
        </section>

        {/* MOVIE POSTER */}
        <section>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Movie Poster
          </label>
          {data.posterImage ? (
            <div
              className="relative overflow-hidden rounded-lg border"
              style={{ borderColor: "#22222e" }}
            >
              <img
                src={data.posterImage}
                alt="Generated poster"
                className="h-auto w-full"
              />
            </div>
          ) : (
            <div
              className="flex aspect-[2/3] max-w-[200px] flex-col items-center justify-center rounded-lg border border-dashed text-zinc-600"
              style={{ backgroundColor: "#1a1a26", borderColor: "#2a2a36" }}
            >
              <ImageIcon className="h-8 w-8" />
              <p className="mt-2 text-xs">No poster yet</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleGeneratePoster}
            disabled={generatingPoster}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border bg-transparent px-2.5 text-xs font-medium text-[#f5a623] transition hover:bg-[#f5a623]/10 disabled:opacity-50"
            style={{ borderColor: "#f5a623", height: "28px" }}
          >
            {generatingPoster ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            ✦ Generate Poster
          </button>
        </section>
      </div>
    </div>
  );
};

export default Step3CharactersVisuals;
