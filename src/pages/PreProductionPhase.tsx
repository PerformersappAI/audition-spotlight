import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Video, ChevronRight, FileText, Presentation, Scale } from "lucide-react";

export default function PreProductionPhase() {
  const tools = [
    {
      name: "Script Analysis",
      description: "Smart script analysis for character development and emotional beats",
      icon: Sparkles,
      badge: "Smart Tool",
      route: "/script-analysis"
    },
    {
      name: "Storyboarding",
      description: "Create visual storyboards with automated shot breakdowns and frames",
      icon: Video,
      badge: "Visual",
      route: "/storyboarding"
    },
    {
      name: "Pitch Deck Maker",
      description: "Create professional Film & TV pitch decks with smart content generation",
      icon: Presentation,
      badge: "Smart Tool",
      route: "/pitch-deck"
    },
    {
      name: "Contract Assistant",
      description: "SAG-AFTRA contract guidance and union information",
      icon: Scale,
      badge: "Smart Tool",
      route: "/contract-assistant"
    },
    {
      name: "Docs Library",
      description: "Essential forms, templates, and deliverables checklists",
      icon: FileText,
      badge: "Premium",
      route: "/library"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Link to="/toolbox" className="text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Toolbox
          </Link>
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Pre Production</h1>
            <p className="text-white/90 text-lg">Screenwriting, Storyboarding, and Planning Tools</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.name} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <Badge>{tool.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground"
                    asChild
                  >
                    <Link to={tool.route}>
                      Open Tool
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
