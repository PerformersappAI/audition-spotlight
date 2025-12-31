import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export type PitchTemplate = 
  | "western" 
  | "thriller" 
  | "scifi" 
  | "comedy" 
  | "drama" 
  | "documentary" 
  | "action" 
  | "horror";

interface TemplateOption {
  id: PitchTemplate;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
  icon: string;
  tags: string[];
}

const templates: TemplateOption[] = [
  {
    id: "western",
    name: "Western",
    description: "Rustic, earthy tones with vintage typography",
    colors: { primary: "#8B4513", secondary: "#D2691E", accent: "#DAA520", bg: "#F5E6D3" },
    icon: "🤠",
    tags: ["Frontier", "Period", "Adventure"]
  },
  {
    id: "thriller",
    name: "Thriller / Noir",
    description: "High contrast, red accents, suspenseful mood",
    colors: { primary: "#DC2626", secondary: "#1F2937", accent: "#FEF3C7", bg: "#111827" },
    icon: "🔪",
    tags: ["Suspense", "Crime", "Mystery"]
  },
  {
    id: "scifi",
    name: "Sci-Fi",
    description: "Futuristic, cyan & purple, tech-inspired",
    colors: { primary: "#06B6D4", secondary: "#8B5CF6", accent: "#22D3EE", bg: "#0F172A" },
    icon: "🚀",
    tags: ["Future", "Space", "Tech"]
  },
  {
    id: "comedy",
    name: "Comedy",
    description: "Bright, playful colors with fun typography",
    colors: { primary: "#F59E0B", secondary: "#10B981", accent: "#EC4899", bg: "#FFFBEB" },
    icon: "😂",
    tags: ["Fun", "Light", "Entertaining"]
  },
  {
    id: "drama",
    name: "Drama",
    description: "Elegant, muted tones with sophisticated feel",
    colors: { primary: "#6366F1", secondary: "#64748B", accent: "#C4B5FD", bg: "#F8FAFC" },
    icon: "🎭",
    tags: ["Emotional", "Intimate", "Character"]
  },
  {
    id: "documentary",
    name: "Documentary",
    description: "Clean, journalistic, minimal design",
    colors: { primary: "#0EA5E9", secondary: "#374151", accent: "#38BDF8", bg: "#FFFFFF" },
    icon: "📹",
    tags: ["Real", "Truth", "Story"]
  },
  {
    id: "action",
    name: "Action",
    description: "Bold, explosive, high-energy visuals",
    colors: { primary: "#EF4444", secondary: "#F97316", accent: "#FCD34D", bg: "#18181B" },
    icon: "💥",
    tags: ["Explosive", "Fast", "Intense"]
  },
  {
    id: "horror",
    name: "Horror",
    description: "Dark, eerie, unsettling atmosphere",
    colors: { primary: "#7C3AED", secondary: "#1F2937", accent: "#A78BFA", bg: "#0A0A0A" },
    icon: "👻",
    tags: ["Scary", "Dark", "Tension"]
  }
];

interface TemplateSelectorProps {
  selectedTemplate: PitchTemplate | "";
  onSelect: (template: PitchTemplate) => void;
}

const TemplateSelector = ({ selectedTemplate, onSelect }: TemplateSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Choose Your Template
        </h2>
        <p className="text-muted-foreground">
          Select a visual style that matches your project's genre and mood
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`relative cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden group ${
              selectedTemplate === template.id 
                ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-background" 
                : "hover:border-amber-500/50"
            }`}
          >
            {/* Color Preview Bar */}
            <div 
              className="h-20 relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)` 
              }}
            >
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                {template.icon}
              </div>
              
              {/* Accent stripe */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: template.colors.accent }}
              />
              
              {/* Selected checkmark */}
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-sm">{template.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-[10px] px-1.5 py-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Color palette preview */}
            <div className="flex h-2">
              <div className="flex-1" style={{ backgroundColor: template.colors.primary }} />
              <div className="flex-1" style={{ backgroundColor: template.colors.secondary }} />
              <div className="flex-1" style={{ backgroundColor: template.colors.accent }} />
            </div>
          </Card>
        ))}
      </div>

      {!selectedTemplate && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          👆 Click a template to continue
        </p>
      )}
    </div>
  );
};

export default TemplateSelector;
export { templates };
export type { TemplateOption };
