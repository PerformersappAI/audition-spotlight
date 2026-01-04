import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Trash2, ChevronLeft, ChevronRight, Loader2, Upload, X, CheckCircle, Image, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PitchDeckData } from "@/pages/PitchDeckMaker";
import PosterGenerator from "./PosterGenerator";

interface PitchDeckFormProps {
  data: PitchDeckData;
  onChange: (data: PitchDeckData) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete?: () => void;
}

const steps = [
  { id: 0, title: "Project Basics", icon: "🎬" },
  { id: 1, title: "Story & Synopsis", icon: "📖" },
  { id: 2, title: "Characters", icon: "👥" },
  { id: 3, title: "Visual Style", icon: "🎨" },
  { id: 4, title: "Comparables", icon: "🎯" },
  { id: 5, title: "Target Audience", icon: "👁️" },
  { id: 6, title: "Production", icon: "🎥" },
  { id: 7, title: "Team", icon: "🎭" },
  { id: 8, title: "Distribution", icon: "📺" },
  { id: 9, title: "Contact", icon: "📞" },
];

const genres = [
  "Action", "Comedy", "Drama", "Horror", "Thriller", "Sci-Fi", 
  "Romance", "Documentary", "Animation", "Fantasy", "Crime", "Mystery"
];

const ratings = ["G", "PG", "PG-13", "R", "NC-17", "TV-Y", "TV-PG", "TV-14", "TV-MA"];

const platforms = [
  "Netflix", "Amazon Prime", "Hulu", "Disney+", "HBO Max", 
  "Apple TV+", "Theatrical", "Film Festivals", "Self-Distribution"
];

const PitchDeckForm = ({ data, onChange, currentStep, onStepChange, onComplete }: PitchDeckFormProps) => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [generatingPortrait, setGeneratingPortrait] = useState<number | null>(null);
  const [generatingScene, setGeneratingScene] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const characterPhotoRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentUploads = data.moodboardUploads || [];
    if (currentUploads.length + files.length > 6) {
      toast.error("Maximum 6 moodboard images allowed");
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB per image.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onChange({
          ...data,
          moodboardUploads: [...(data.moodboardUploads || []), base64]
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeUploadedImage = (index: number) => {
    const newUploads = [...(data.moodboardUploads || [])];
    newUploads.splice(index, 1);
    onChange({ ...data, moodboardUploads: newUploads });
  };

  const handleCharacterPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, charIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Max 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newChars = [...data.characters];
      newChars[charIndex] = { ...newChars[charIndex], referencePhoto: base64 };
      onChange({ ...data, characters: newChars });
    };
    reader.readAsDataURL(file);
  };

  const generateCharacterPortrait = async (charIndex: number) => {
    const char = data.characters[charIndex];
    if (!char.name) {
      toast.error("Please add a character name first");
      return;
    }

    setGeneratingPortrait(charIndex);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-character-portrait", {
        body: {
          characterName: char.name,
          characterDescription: char.description,
          characterRole: char.role,
          referencePhotoUrl: char.referencePhoto || null,
          styleDescription: data.visualStyle,
          genre: data.genre,
          projectTitle: data.projectTitle
        }
      });

      if (error) throw error;

      if (result?.imageUrl) {
        const newChars = [...data.characters];
        newChars[charIndex] = { ...newChars[charIndex], aiPortrait: result.imageUrl };
        onChange({ ...data, characters: newChars });
        toast.success(`Portrait generated for ${char.name}!`);
      }
    } catch (error) {
      console.error("Portrait generation error:", error);
      toast.error("Failed to generate portrait. Please try again.");
    } finally {
      setGeneratingPortrait(null);
    }
  };

  const generateSceneImage = async (sceneType: string) => {
    setGeneratingScene(sceneType);
    try {
      const moodboardImages = [
        ...(data.moodboardUploads || []),
        ...data.moodboardImages.filter(Boolean)
      ].slice(0, 2);

      const { data: result, error } = await supabase.functions.invoke("generate-scene-image", {
        body: {
          sceneType,
          synopsis: data.synopsis,
          visualStyle: data.visualStyle,
          genre: data.genre,
          projectTitle: data.projectTitle,
          moodboardImages: moodboardImages.length > 0 ? moodboardImages : null
        }
      });

      if (error) throw error;

      if (result?.imageUrl) {
        if (sceneType === "synopsis") {
          onChange({ ...data, synopsisImage: result.imageUrl });
        }
        toast.success("Scene image generated!");
      }
    } catch (error) {
      console.error("Scene generation error:", error);
      toast.error("Failed to generate scene. Please try again.");
    } finally {
      setGeneratingScene(null);
    }
  };

  const updateField = <K extends keyof PitchDeckData>(field: K, value: PitchDeckData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const generateWithAI = async (type: string, context: Record<string, unknown>) => {
    setIsGenerating(type);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-pitch-content", {
        body: { type, context }
      });

      if (error) throw error;

      if (result?.content) {
        switch (type) {
          case "logline":
            updateField("logline", result.content);
            break;
          case "synopsis":
            updateField("synopsis", result.content);
            break;
          case "vision":
            updateField("directorVision", result.content);
            break;
          case "character":
            if (context.characterIndex !== undefined) {
              const newChars = [...data.characters];
              newChars[context.characterIndex as number] = {
                ...newChars[context.characterIndex as number],
                description: result.content
              };
              updateField("characters", newChars);
            }
            break;
          case "comps":
            if (result.comparables) {
              updateField("comparables", result.comparables);
            }
            break;
          case "audience":
            updateField("marketAnalysis", result.content);
            break;
          case "distribution":
            updateField("distributionPlan", result.content);
            break;
        }
        toast.success("Content generated successfully!");
      }
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(null);
    }
  };

  const addCharacter = () => {
    updateField("characters", [
      ...data.characters,
      { name: "", role: "supporting", description: "", referencePhoto: "", aiPortrait: "" }
    ]);
  };

  const removeCharacter = (index: number) => {
    updateField("characters", data.characters.filter((_, i) => i !== index));
  };

  const addComparable = () => {
    updateField("comparables", [
      ...data.comparables,
      { title: "", year: "", whySimilar: "" }
    ]);
  };

  const removeComparable = (index: number) => {
    updateField("comparables", data.comparables.filter((_, i) => i !== index));
  };

  const addTeamMember = () => {
    updateField("teamMembers", [
      ...data.teamMembers,
      { name: "", role: "", credits: "" }
    ]);
  };

  const removeTeamMember = (index: number) => {
    updateField("teamMembers", data.teamMembers.filter((_, i) => i !== index));
  };

  const toggleGenre = (genre: string) => {
    if (data.genre.includes(genre)) {
      updateField("genre", data.genre.filter(g => g !== genre));
    } else {
      updateField("genre", [...data.genre, genre]);
    }
  };

  const togglePlatform = (platform: string) => {
    if (data.targetPlatforms.includes(platform)) {
      updateField("targetPlatforms", data.targetPlatforms.filter(p => p !== platform));
    } else {
      updateField("targetPlatforms", [...data.targetPlatforms, platform]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectTitle">Project Title *</Label>
              <Input
                id="projectTitle"
                value={data.projectTitle}
                onChange={(e) => updateField("projectTitle", e.target.value)}
                placeholder="Enter your project title"
              />
            </div>

            <div>
              <Label htmlFor="projectType">Project Type *</Label>
              <Select
                value={data.projectType}
                onValueChange={(value) => updateField("projectType", value as PitchDeckData["projectType"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature Film</SelectItem>
                  <SelectItem value="short">Short Film</SelectItem>
                  <SelectItem value="tv_series">TV Series</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                  <SelectItem value="web_series">Web Series</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Logline</Label>
              <div className="flex gap-2">
                <Textarea
                  value={data.logline}
                  onChange={(e) => updateField("logline", e.target.value)}
                  placeholder="A compelling one or two sentence hook for your project"
                  rows={3}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => generateWithAI("logline", { 
                  title: data.projectTitle, 
                  genre: data.genre, 
                  type: data.projectType 
                })}
                disabled={isGenerating === "logline" || !data.projectTitle}
              >
                {isGenerating === "logline" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            </div>

            <div>
              <Label>Genre (select multiple)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant={data.genre.includes(genre) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="targetRating">Target Rating</Label>
              <Select
                value={data.targetRating}
                onValueChange={(value) => updateField("targetRating", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {ratings.map((rating) => (
                    <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>Synopsis (300-500 words)</Label>
              <Textarea
                value={data.synopsis}
                onChange={(e) => updateField("synopsis", e.target.value)}
                placeholder="Tell your story in detail..."
                rows={8}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => generateWithAI("synopsis", { 
                  title: data.projectTitle, 
                  logline: data.logline,
                  genre: data.genre,
                  type: data.projectType 
                })}
                disabled={isGenerating === "synopsis" || !data.logline}
              >
                {isGenerating === "synopsis" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Expand from Logline
              </Button>
            </div>

            {/* Synopsis Scene Image */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Image className="h-4 w-4 text-purple-500" />
                Synopsis Scene Image
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Generate a dramatic scene that visualizes your story
              </p>
              
              {data.synopsisImage ? (
                <div className="space-y-3">
                  <div className="aspect-video rounded-lg overflow-hidden border border-border">
                    <img src={data.synopsisImage} alt="Synopsis scene" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateSceneImage("synopsis")}
                      disabled={generatingScene === "synopsis" || !data.synopsis}
                    >
                      {generatingScene === "synopsis" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Regenerate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateField("synopsisImage", "")}
                    >
                      <X className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSceneImage("synopsis")}
                  disabled={generatingScene === "synopsis" || !data.synopsis}
                  className="w-full"
                >
                  {generatingScene === "synopsis" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate Scene Image
                </Button>
              )}
            </div>

            <div>
              <Label>Director's Vision</Label>
              <Textarea
                value={data.directorVision}
                onChange={(e) => updateField("directorVision", e.target.value)}
                placeholder="Describe your creative vision for this project..."
                rows={4}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => generateWithAI("vision", { 
                  title: data.projectTitle, 
                  synopsis: data.synopsis,
                  genre: data.genre 
                })}
                disabled={isGenerating === "vision" || !data.synopsis}
              >
                {isGenerating === "vision" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate Vision Statement
              </Button>
            </div>

            <div>
              <Label>Tone & Mood</Label>
              <Input
                value={data.toneMood}
                onChange={(e) => updateField("toneMood", e.target.value)}
                placeholder="e.g., Dark and suspenseful with moments of dark humor"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label>Main Characters</Label>
                <p className="text-xs text-muted-foreground">Upload actor photos and generate character portraits</p>
              </div>
              <Button variant="outline" size="sm" onClick={addCharacter}>
                <Plus className="h-4 w-4 mr-1" /> Add Character
              </Button>
            </div>

            {data.characters.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No characters added yet. Click "Add Character" to get started.
              </p>
            )}

            {data.characters.map((char, index) => (
              <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <Input
                    value={char.name}
                    onChange={(e) => {
                      const newChars = [...data.characters];
                      newChars[index] = { ...char, name: e.target.value };
                      updateField("characters", newChars);
                    }}
                    placeholder="Character Name"
                    className="flex-1 mr-2"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCharacter(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <Select
                  value={char.role}
                  onValueChange={(value) => {
                    const newChars = [...data.characters];
                    newChars[index] = { ...char, role: value as "lead" | "supporting" | "recurring" };
                    updateField("characters", newChars);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="supporting">Supporting</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  value={char.description}
                  onChange={(e) => {
                    const newChars = [...data.characters];
                    newChars[index] = { ...char, description: e.target.value };
                    updateField("characters", newChars);
                  }}
                  placeholder="Character description and arc..."
                  rows={3}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateWithAI("character", { 
                    characterName: char.name,
                    characterRole: char.role,
                    synopsis: data.synopsis,
                    characterIndex: index
                  })}
                  disabled={isGenerating === "character" || !char.name}
                >
                  {isGenerating === "character" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate Description
                </Button>

                {/* Character Images Section */}
                <div className="pt-3 border-t border-border">
                  <Label className="text-xs text-muted-foreground mb-2 block">Character Imagery</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Reference Photo */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Actor Reference</p>
                      {char.referencePhoto ? (
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border">
                          <img src={char.referencePhoto} alt="Actor reference" className="w-full h-full object-cover" />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => {
                              const newChars = [...data.characters];
                              newChars[index] = { ...char, referencePhoto: "" };
                              updateField("characters", newChars);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="aspect-[3/4] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors"
                          onClick={() => characterPhotoRefs.current[index]?.click()}
                        >
                          <User className="h-6 w-6 text-muted-foreground mb-1" />
                          <span className="text-xs text-muted-foreground">Upload Photo</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => { characterPhotoRefs.current[index] = el; }}
                        onChange={(e) => handleCharacterPhotoUpload(e, index)}
                      />
                    </div>

                    {/* AI Portrait */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium">AI Portrait</p>
                      {char.aiPortrait ? (
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-amber-500/50">
                          <img src={char.aiPortrait} alt="AI portrait" className="w-full h-full object-cover" />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => {
                              const newChars = [...data.characters];
                              newChars[index] = { ...char, aiPortrait: "" };
                              updateField("characters", newChars);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="aspect-[3/4] rounded-lg border-2 border-dashed border-amber-500/30 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/60 transition-colors bg-gradient-to-br from-amber-500/5 to-orange-500/5"
                          onClick={() => char.name && generateCharacterPortrait(index)}
                        >
                          {generatingPortrait === index ? (
                            <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="h-6 w-6 text-amber-500 mb-1" />
                              <span className="text-xs text-amber-500">Generate</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {char.name && !char.aiPortrait && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => generateCharacterPortrait(index)}
                      disabled={generatingPortrait === index}
                    >
                      {generatingPortrait === index ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Generate Character Portrait
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Poster Generator */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Movie Poster
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                Generate a cinematic poster for your project's cover page
              </p>
              <PosterGenerator
                projectTitle={data.projectTitle}
                logline={data.logline}
                genre={data.genre}
                visualStyle={data.visualStyle}
                template={data.selectedTemplate}
                posterImage={data.posterImage}
                posterPrompt={data.posterPrompt}
                onPosterGenerated={(imageUrl, prompt) => {
                  onChange({
                    ...data,
                    posterImage: imageUrl,
                    posterPrompt: prompt
                  });
                }}
              />
            </div>

            <div>
              <Label>Visual Style Description</Label>
              <Textarea
                value={data.visualStyle}
                onChange={(e) => updateField("visualStyle", e.target.value)}
                placeholder="Describe the visual aesthetic, cinematography style, color palette, lighting mood..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This description will guide AI image generation throughout your pitch deck
              </p>
            </div>

            {/* Image Upload Section */}
            <div>
              <Label className="flex items-center gap-2">
                Style Reference Images
                <Badge variant="outline" className="text-xs">Optional</Badge>
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Upload images that represent your film's visual style. These will guide AI generation.
              </p>
              
              {/* Uploaded Images Grid */}
              {(data.moodboardUploads?.length || 0) > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {data.moodboardUploads?.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-border">
                      <img src={img} alt={`Style ref ${i + 1}`} className="w-full h-full object-cover" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeUploadedImage(i)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={(data.moodboardUploads?.length || 0) >= 6}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
                <span className="text-xs text-muted-foreground self-center">
                  {data.moodboardUploads?.length || 0}/6 images
                </span>
              </div>
            </div>

            {/* URL References */}
            <div>
              <Label>Image URLs (optional)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Or paste URLs to reference images
              </p>
              {[0, 1, 2].map((i) => (
                <Input
                  key={i}
                  value={data.moodboardImages[i] || ""}
                  onChange={(e) => {
                    const newImages = [...data.moodboardImages];
                    newImages[i] = e.target.value;
                    updateField("moodboardImages", newImages);
                  }}
                  placeholder={`Reference image URL ${i + 1}`}
                  className="mb-2"
                />
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Comparable Projects</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateWithAI("comps", { 
                    title: data.projectTitle,
                    genre: data.genre,
                    logline: data.logline,
                    type: data.projectType
                  })}
                  disabled={isGenerating === "comps" || !data.logline}
                >
                  {isGenerating === "comps" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Suggest Comps
                </Button>
                <Button variant="outline" size="sm" onClick={addComparable}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>

            {data.comparables.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Add films/shows that are similar to your project to help investors understand your vision.
              </p>
            )}

            {data.comparables.map((comp, index) => (
              <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={comp.title}
                    onChange={(e) => {
                      const newComps = [...data.comparables];
                      newComps[index] = { ...comp, title: e.target.value };
                      updateField("comparables", newComps);
                    }}
                    placeholder="Film/Show Title"
                    className="flex-1"
                  />
                  <Input
                    value={comp.year}
                    onChange={(e) => {
                      const newComps = [...data.comparables];
                      newComps[index] = { ...comp, year: e.target.value };
                      updateField("comparables", newComps);
                    }}
                    placeholder="Year"
                    className="w-20"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeComparable(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Textarea
                  value={comp.whySimilar}
                  onChange={(e) => {
                    const newComps = [...data.comparables];
                    newComps[index] = { ...comp, whySimilar: e.target.value };
                    updateField("comparables", newComps);
                  }}
                  placeholder="Why is this project similar? (tone, story, audience appeal...)"
                  rows={2}
                />
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label>Primary Demographic</Label>
              <Input
                value={data.primaryDemographic}
                onChange={(e) => updateField("primaryDemographic", e.target.value)}
                placeholder="e.g., Adults 18-34, fans of psychological thrillers"
              />
            </div>

            <div>
              <Label>Secondary Audience</Label>
              <Input
                value={data.secondaryAudience}
                onChange={(e) => updateField("secondaryAudience", e.target.value)}
                placeholder="e.g., True crime enthusiasts, book club members"
              />
            </div>

            <div>
              <Label>Market Analysis</Label>
              <Textarea
                value={data.marketAnalysis}
                onChange={(e) => updateField("marketAnalysis", e.target.value)}
                placeholder="Explain why this project will resonate with audiences..."
                rows={4}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => generateWithAI("audience", { 
                  title: data.projectTitle,
                  genre: data.genre,
                  logline: data.logline,
                  comparables: data.comparables.map(c => c.title)
                })}
                disabled={isGenerating === "audience" || !data.logline}
              >
                {isGenerating === "audience" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Analyze Market Fit
              </Button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <Label>Budget Range</Label>
              <Select
                value={data.budgetRange}
                onValueChange={(value) => updateField("budgetRange", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro Budget (&lt;$50K)</SelectItem>
                  <SelectItem value="low">Low Budget ($50K - $500K)</SelectItem>
                  <SelectItem value="mid">Mid Budget ($500K - $5M)</SelectItem>
                  <SelectItem value="high">High Budget ($5M+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Shooting Locations</Label>
              <Input
                value={data.shootingLocations}
                onChange={(e) => updateField("shootingLocations", e.target.value)}
                placeholder="e.g., Los Angeles, CA; New York, NY"
              />
            </div>

            <div>
              <Label>Union Status</Label>
              <Select
                value={data.unionStatus}
                onValueChange={(value) => updateField("unionStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select union status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sag">SAG-AFTRA</SelectItem>
                  <SelectItem value="non_union">Non-Union</SelectItem>
                  <SelectItem value="tbd">TBD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Timeline</Label>
              <Textarea
                value={data.timeline}
                onChange={(e) => updateField("timeline", e.target.value)}
                placeholder="Outline key production milestones and target dates..."
                rows={4}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Key Team Members</Label>
              <Button variant="outline" size="sm" onClick={addTeamMember}>
                <Plus className="h-4 w-4 mr-1" /> Add Team Member
              </Button>
            </div>

            {data.teamMembers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Add director, producers, writers, and other key creative talent.
              </p>
            )}

            {data.teamMembers.map((member, index) => (
              <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={member.name}
                    onChange={(e) => {
                      const newMembers = [...data.teamMembers];
                      newMembers[index] = { ...member, name: e.target.value };
                      updateField("teamMembers", newMembers);
                    }}
                    placeholder="Name"
                    className="flex-1"
                  />
                  <Input
                    value={member.role}
                    onChange={(e) => {
                      const newMembers = [...data.teamMembers];
                      newMembers[index] = { ...member, role: e.target.value };
                      updateField("teamMembers", newMembers);
                    }}
                    placeholder="Role (Director, Producer...)"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTeamMember(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Textarea
                  value={member.credits}
                  onChange={(e) => {
                    const newMembers = [...data.teamMembers];
                    newMembers[index] = { ...member, credits: e.target.value };
                    updateField("teamMembers", newMembers);
                  }}
                  placeholder="Notable credits and experience..."
                  rows={2}
                />
              </div>
            ))}
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div>
              <Label>Target Platforms</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {platforms.map((platform) => (
                  <Badge
                    key={platform}
                    variant={data.targetPlatforms.includes(platform) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Marketing Highlights</Label>
              <Textarea
                value={data.marketingHighlights}
                onChange={(e) => updateField("marketingHighlights", e.target.value)}
                placeholder="Key selling points and marketing angles..."
                rows={3}
              />
            </div>

            <div>
              <Label>Distribution Plan</Label>
              <Textarea
                value={data.distributionPlan}
                onChange={(e) => updateField("distributionPlan", e.target.value)}
                placeholder="Outline your distribution strategy..."
                rows={4}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => generateWithAI("distribution", { 
                  title: data.projectTitle,
                  type: data.projectType,
                  genre: data.genre,
                  budgetRange: data.budgetRange,
                  targetPlatforms: data.targetPlatforms
                })}
                disabled={isGenerating === "distribution"}
              >
                {isGenerating === "distribution" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate Strategy
              </Button>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <div>
              <Label>Contact Name *</Label>
              <Input
                value={data.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={data.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label>Phone (optional)</Label>
              <Input
                value={data.contactPhone}
                onChange={(e) => updateField("contactPhone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label>Website / Social Links</Label>
              <Input
                value={data.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <Label>Investment Ask / What You're Seeking</Label>
              <Textarea
                value={data.investmentAsk}
                onChange={(e) => updateField("investmentAsk", e.target.value)}
                placeholder="e.g., Seeking $500K production financing, distribution partnership..."
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Navigation */}
      <div className="flex overflow-x-auto pb-2 gap-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => onStepChange(step.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              currentStep === step.id
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <span>{step.icon}</span>
            <span>{step.title}</span>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Current Step Content */}
      <div className="min-h-[400px]">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>{steps[currentStep].icon}</span>
          {steps[currentStep].title}
        </h3>
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Pitch Deck
          </Button>
        ) : (
          <Button
            onClick={() => onStepChange(currentStep + 1)}
            className="bg-gradient-to-r from-amber-500 to-orange-600"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PitchDeckForm;
