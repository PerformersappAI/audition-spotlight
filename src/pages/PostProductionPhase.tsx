import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, ChevronRight, MessageCircle } from "lucide-react";

export default function PostProductionPhase() {
  const tools = [
    {
      name: "Concierge / Consulting",
      description: "Get expert guidance on editing and post-production workflows",
      icon: MessageCircle,
      badge: "Human Support",
      route: "/consulting"
    },
    {
      name: "Storyboarding",
      description: "Review and refine your visual story structure",
      icon: Video,
      badge: "Visual AI",
      route: "/storyboarding"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Link to="/toolbox" className="text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Toolbox
          </Link>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Post Production</h1>
            <p className="text-white/90 text-lg">Editing and Final Polish</p>
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
