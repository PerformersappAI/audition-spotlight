import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PitchDeckData } from "@/pages/PitchDeckMaker";
import { templates, type PitchTemplate } from "./TemplateSelector";
import { Mail, Phone, Globe, Users, Target, Film, Clapperboard } from "lucide-react";

interface PitchDeckPreviewProps {
  data: PitchDeckData;
}

const projectTypeLabels: Record<string, string> = {
  feature: "Feature Film",
  short: "Short Film",
  tv_series: "TV Series",
  documentary: "Documentary",
  web_series: "Web Series",
};

const getTemplateColors = (templateId: PitchTemplate | "") => {
  const defaultColors = {
    primary: "#F59E0B",
    secondary: "#EA580C",
    accent: "#FCD34D",
    bg: "#18181B",
    text: "#FFFFFF",
    muted: "#A1A1AA"
  };
  if (!templateId) return defaultColors;
  const template = templates.find(t => t.id === templateId);
  if (!template) return defaultColors;
  const isDark = template.colors.bg.startsWith("#0") || template.colors.bg.startsWith("#1") || template.colors.bg === "#0A0A0A";
  return { ...template.colors, text: isDark ? "#FFFFFF" : "#1F2937", muted: isDark ? "#A1A1AA" : "#6B7280" };
};

const PitchDeckPreview = ({ data }: PitchDeckPreviewProps) => {
  const colors = getTemplateColors(data.selectedTemplate);
  const hasContent = data.projectTitle || data.logline || data.synopsis || data.characters.length > 0 || data.posterImage;

  if (!hasContent) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center">
            <Clapperboard className="w-10 h-10 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Your Pitch Deck Preview</h3>
            <p className="text-sm text-muted-foreground mt-1">Start filling in the form to see your pitch deck come to life</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Cover Page */}
      <div className="relative min-h-[500px] overflow-hidden" style={{ backgroundColor: colors.bg }}>
        {data.posterImage ? (
          <div className="absolute inset-0">
            <img src={data.posterImage} alt="Movie poster" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 0%, ${colors.bg}ee 60%, ${colors.bg} 100%)` }} />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.primary}33 0%, ${colors.secondary}33 50%, ${colors.bg} 100%)` }} />
        )}
        <div className="relative z-10 p-8 flex flex-col justify-end min-h-[500px]">
          {data.projectType && (
            <Badge className="w-fit mb-4 text-xs font-medium" style={{ backgroundColor: colors.primary, color: "#FFFFFF" }}>
              {projectTypeLabels[data.projectType] || data.projectType}
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: colors.text }}>
            {data.projectTitle || "Untitled Project"}
          </h1>
          {data.genre.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {data.genre.map((g) => (
                <Badge key={g} variant="outline" className="text-xs" style={{ borderColor: colors.accent, color: colors.accent }}>{g}</Badge>
              ))}
            </div>
          )}
          {data.logline && <p className="text-lg italic max-w-xl leading-relaxed" style={{ color: colors.muted }}>"{data.logline}"</p>}
          {data.targetRating && (
            <div className="mt-6 inline-flex items-center gap-2 text-sm" style={{ color: colors.muted }}>
              <span className="px-2 py-1 border rounded text-xs font-bold" style={{ borderColor: colors.muted }}>{data.targetRating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Synopsis */}
      {(data.synopsis || data.directorVision) && (
        <div className="p-8 space-y-6" style={{ backgroundColor: colors.bg }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: colors.primary }} />
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>The Story</h2>
          </div>
          {data.synopsis && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>Synopsis</h3>
              <p className="text-base leading-relaxed" style={{ color: colors.muted }}>{data.synopsis}</p>
            </div>
          )}
          {data.directorVision && (
            <div className="p-6 rounded-lg border-l-4" style={{ backgroundColor: `${colors.primary}11`, borderColor: colors.primary }}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: colors.accent }}>Director's Vision</h3>
              <p className="text-base italic leading-relaxed" style={{ color: colors.text }}>"{data.directorVision}"</p>
            </div>
          )}
        </div>
      )}

      <Separator style={{ backgroundColor: `${colors.primary}33` }} />

      {/* Characters */}
      {data.characters.length > 0 && (
        <div className="p-8" style={{ backgroundColor: colors.bg }}>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6" style={{ color: colors.primary }} />
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>Characters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.characters.map((char, i) => (
              <Card key={i} className="overflow-hidden border-0" style={{ backgroundColor: `${colors.primary}11` }}>
                <div className="h-2" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }} />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold" style={{ color: colors.text }}>{char.name || "Unnamed"}</h4>
                    <Badge variant="secondary" className="text-xs capitalize" style={{ backgroundColor: `${colors.accent}22`, color: colors.accent }}>{char.role}</Badge>
                  </div>
                  {char.description && <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>{char.description}</p>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Visual Style */}
      {data.visualStyle && (
        <div className="p-8" style={{ backgroundColor: colors.bg }}>
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-6 h-6" style={{ color: colors.primary }} />
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>Visual Style</h2>
          </div>
          <p className="text-base leading-relaxed" style={{ color: colors.muted }}>{data.visualStyle}</p>
        </div>
      )}

      {/* Comparables */}
      {data.comparables.length > 0 && (
        <div className="p-8" style={{ backgroundColor: colors.bg }}>
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6" style={{ color: colors.primary }} />
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>Comparable Projects</h2>
          </div>
          <div className="space-y-4">
            {data.comparables.map((comp, i) => (
              <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.secondary}11` }}>
                <div className="flex items-baseline gap-2 mb-2">
                  <h4 className="font-bold" style={{ color: colors.text }}>{comp.title}</h4>
                  {comp.year && <span className="text-sm" style={{ color: colors.muted }}>({comp.year})</span>}
                </div>
                {comp.whySimilar && <p className="text-sm" style={{ color: colors.muted }}>{comp.whySimilar}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      {(data.contactName || data.contactEmail || data.investmentAsk) && (
        <div className="p-8" style={{ background: `linear-gradient(135deg, ${colors.primary}22 0%, ${colors.secondary}22 100%)`, backgroundColor: colors.bg }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>Let's Connect</h2>
          {data.investmentAsk && (
            <Card className="p-6 mb-6 border-2" style={{ borderColor: colors.accent, backgroundColor: `${colors.bg}dd` }}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: colors.accent }}>What We're Seeking</h3>
              <p style={{ color: colors.text }}>{data.investmentAsk}</p>
            </Card>
          )}
          {data.contactName && <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>{data.contactName}</h3>}
          <div className="space-y-2">
            {data.contactEmail && <div className="flex items-center gap-3" style={{ color: colors.muted }}><Mail className="w-4 h-4" style={{ color: colors.accent }} /><span>{data.contactEmail}</span></div>}
            {data.contactPhone && <div className="flex items-center gap-3" style={{ color: colors.muted }}><Phone className="w-4 h-4" style={{ color: colors.accent }} /><span>{data.contactPhone}</span></div>}
            {data.website && <div className="flex items-center gap-3" style={{ color: colors.muted }}><Globe className="w-4 h-4" style={{ color: colors.accent }} /><span>{data.website}</span></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchDeckPreview;
