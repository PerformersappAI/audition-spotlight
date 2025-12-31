import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, RefreshCw, Loader2, ImageIcon, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PitchTemplate } from "./TemplateSelector";

interface PosterGeneratorProps {
  projectTitle: string;
  logline: string;
  genre: string[];
  visualStyle: string;
  template: PitchTemplate | "";
  posterImage: string;
  posterPrompt: string;
  onPosterGenerated: (imageData: string, prompt: string) => void;
}

const templateStyles: Record<PitchTemplate, string> = {
  western: "dusty western frontier, sepia tones, desert landscape, cowboy silhouettes, vintage wanted poster aesthetic",
  thriller: "noir thriller, high contrast shadows, red and black palette, suspenseful mood, urban night scene",
  scifi: "futuristic sci-fi, neon cyan and purple glow, space station, holographic elements, tech interfaces",
  comedy: "bright colorful comedy, fun playful mood, vibrant colors, cartoon-like energy, sunshine",
  drama: "elegant drama, muted sophisticated tones, intimate lighting, emotional depth, artistic composition",
  documentary: "documentary style, journalistic, clean composition, real world setting, authentic feel",
  action: "explosive action, fire and explosions, dynamic motion blur, intense orange and red, dramatic pose",
  horror: "dark horror, eerie shadows, purple mist, unsettling atmosphere, gothic elements, moonlight"
};

const PosterGenerator = ({
  projectTitle,
  logline,
  genre,
  visualStyle,
  template,
  posterImage,
  posterPrompt,
  onPosterGenerated
}: PosterGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(posterPrompt);

  const generatePoster = async (useCustom: boolean = false) => {
    if (!projectTitle) {
      toast.error("Please add a project title first");
      return;
    }

    setIsGenerating(true);
    
    const templateStyle = template ? templateStyles[template] : "";
    
    const basePrompt = useCustom && customPrompt 
      ? customPrompt 
      : `Professional cinematic movie poster for "${projectTitle}". ${logline ? `Story: ${logline}.` : ""} ${genre.length > 0 ? `Genre: ${genre.join(", ")}.` : ""} ${visualStyle ? `Visual style: ${visualStyle}.` : ""} ${templateStyle ? `Aesthetic: ${templateStyle}.` : ""} Ultra high quality, dramatic lighting, theatrical movie poster composition, title text at bottom, 2:3 portrait aspect ratio.`;

    try {
      const { data, error } = await supabase.functions.invoke("generate-pitch-poster", {
        body: { prompt: basePrompt }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        onPosterGenerated(data.imageUrl, basePrompt);
        toast.success("Poster generated successfully!");
        setShowCustomPrompt(false);
      } else {
        throw new Error("No image returned");
      }
    } catch (error) {
      console.error("Poster generation error:", error);
      toast.error("Failed to generate poster. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">AI Movie Poster</Label>
          <p className="text-sm text-muted-foreground">
            Generate a cinematic poster for your pitch deck cover
          </p>
        </div>
        {!posterImage && (
          <Button
            onClick={() => generatePoster(false)}
            disabled={isGenerating || !projectTitle}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate Poster
          </Button>
        )}
      </div>

      {posterImage ? (
        <Card className="overflow-hidden border-amber-500/30">
          <div className="relative aspect-[2/3] max-h-[400px] overflow-hidden bg-black/50">
            <img 
              src={posterImage} 
              alt="Generated movie poster"
              className="w-full h-full object-contain"
            />
            
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => generatePoster(false)}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCustomPrompt(!showCustomPrompt)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>

          {showCustomPrompt && (
            <div className="p-4 border-t border-border space-y-3">
              <Label>Custom Prompt</Label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe your ideal poster..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => generatePoster(true)}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-amber-500 to-orange-600"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate with Custom Prompt
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCustomPrompt(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <p className="font-medium">No poster generated yet</p>
              <p className="text-sm text-muted-foreground">
                Click "Generate Poster" to create an AI movie poster
              </p>
            </div>
            {!projectTitle && (
              <p className="text-xs text-amber-500">
                ⚠️ Add a project title first to enable poster generation
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PosterGenerator;
