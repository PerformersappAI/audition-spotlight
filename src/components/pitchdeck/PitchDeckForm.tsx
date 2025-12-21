import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PitchDeckData } from "@/pages/PitchDeckMaker";

interface PitchDeckFormProps {
  data: PitchDeckData;
  onChange: (data: PitchDeckData) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
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

const PitchDeckForm = ({ data, onChange, currentStep, onStepChange }: PitchDeckFormProps) => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

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
      { name: "", role: "supporting", description: "" }
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
                Generate with AI
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
              <Label>Main Characters</Label>
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
              <div key={index} className="border border-border rounded-lg p-4 space-y-3">
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
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Visual Style Description</Label>
              <Textarea
                value={data.visualStyle}
                onChange={(e) => updateField("visualStyle", e.target.value)}
                placeholder="Describe the visual aesthetic, cinematography style, color palette..."
                rows={6}
              />
            </div>

            <div>
              <Label>Moodboard Images (URLs)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Add up to 6 reference image URLs for your moodboard
              </p>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Input
                  key={i}
                  value={data.moodboardImages[i] || ""}
                  onChange={(e) => {
                    const newImages = [...data.moodboardImages];
                    newImages[i] = e.target.value;
                    updateField("moodboardImages", newImages.filter(Boolean));
                  }}
                  placeholder={`Image URL ${i + 1}`}
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
              <div>
                <Label>Comparable Projects</Label>
                <p className="text-xs text-muted-foreground">Films/shows similar to your project</p>
              </div>
              <Button variant="outline" size="sm" onClick={addComparable}>
                <Plus className="h-4 w-4 mr-1" /> Add Comp
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => generateWithAI("comps", { 
                title: data.projectTitle,
                logline: data.logline,
                genre: data.genre,
                type: data.projectType 
              })}
              disabled={isGenerating === "comps" || !data.logline}
            >
              {isGenerating === "comps" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Suggest Comps with AI
            </Button>

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
                    placeholder="Title"
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
                    className="w-24"
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
                  placeholder="Why is this project similar?"
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
                placeholder="e.g., Adults 25-45, fans of psychological thrillers"
              />
            </div>

            <div>
              <Label>Secondary Audience</Label>
              <Input
                value={data.secondaryAudience}
                onChange={(e) => updateField("secondaryAudience", e.target.value)}
                placeholder="e.g., Young adults 18-24, true crime enthusiasts"
              />
            </div>

            <div>
              <Label>Market Analysis</Label>
              <Textarea
                value={data.marketAnalysis}
                onChange={(e) => updateField("marketAnalysis", e.target.value)}
                placeholder="Describe the market opportunity and audience trends..."
                rows={6}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => generateWithAI("audience", { 
                  title: data.projectTitle,
                  logline: data.logline,
                  genre: data.genre,
                  type: data.projectType,
                  comparables: data.comparables
                })}
                disabled={isGenerating === "audience" || !data.logline}
              >
                {isGenerating === "audience" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate Analysis
              </Button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <Label>Estimated Budget Range</Label>
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
                placeholder="e.g., Los Angeles, New York, Vancouver"
              />
            </div>

            <div>
              <Label>Timeline</Label>
              <Textarea
                value={data.timeline}
                onChange={(e) => updateField("timeline", e.target.value)}
                placeholder="Pre-production: Q1 2025&#10;Principal Photography: Q2 2025&#10;Post-Production: Q3 2025&#10;Target Release: Q4 2025"
                rows={4}
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
                  <SelectItem value="tbd">To Be Determined</SelectItem>
                </SelectContent>
              </Select>
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
                No team members added yet. Click "Add Team Member" to get started.
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
                    placeholder="Role"
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
              <Label>Target Platforms (select multiple)</Label>
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
                rows={4}
              />
            </div>

            <div>
              <Label>Distribution Strategy</Label>
              <Textarea
                value={data.distributionPlan}
                onChange={(e) => updateField("distributionPlan", e.target.value)}
                placeholder="Describe your distribution plan..."
                rows={6}
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
        <Button
          onClick={() => onStepChange(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="bg-gradient-to-r from-amber-500 to-orange-600"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PitchDeckForm;
