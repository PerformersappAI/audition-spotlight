import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Video, 
  Users, 
  MapPin, 
  Trophy, 
  FileText, 
  MessageCircle, 
  Sparkles,
  ChevronRight 
} from "lucide-react";

export default function ToolboxHome() {
  const [modules] = useState([
    {
      id: "scene_analyzer",
      name: "Scene Analyzer",
      description: "AI-powered scene analysis for beats, stakes, and tone philosophy",
      icon: Video,
      status: "active",
      badge: "AI Enhanced"
    },
    {
      id: "character_breakdown",
      name: "Character & Cast Breakdown", 
      description: "Generate casting types, archetypes, and audition materials",
      icon: Users,
      status: "active",
      badge: "AI Enhanced"
    },
    {
      id: "distribution_navigator",
      name: "Distribution Navigator",
      description: "Find the best distribution path for your project",
      icon: MapPin,
      status: "active", 
      badge: "AI Enhanced"
    },
    {
      id: "festival_submitter",
      name: "Festival Submitter",
      description: "Curated festival shortlists and submission strategy",
      icon: Trophy,
      status: "active",
      badge: "Oprime.Vetted"
    },
    {
      id: "docs_library",
      name: "Docs Library",
      description: "Essential forms, templates, and deliverables checklists",
      icon: FileText,
      status: "protected",
      badge: "Premium"
    },
    {
      id: "crew_cast_board",
      name: "Crew & Casting Board",
      description: "Post opportunities and connect with talent",
      icon: Users,
      status: "active",
      badge: "Community"
    },
    {
      id: "concierge",
      name: "Concierge / Consulting",
      description: "Direct access to our producer desk for guidance",
      icon: MessageCircle,
      status: "active",
      badge: "Human Support"
    }
  ]);

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "AI Enhanced": return "default";
      case "Oprime.Vetted": return "secondary";
      case "Premium": return "outline";
      case "Community": return "secondary";
      case "Human Support": return "outline";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Filmmaker Toolbox
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete your film journey with AI-powered tools, curated resources, and expert guidance
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Get personalized recommendations for your project in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/submit">
                  Complete Project Intake <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <Badge variant={getBadgeVariant(module.badge)}>
                      {module.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground"
                    asChild
                  >
                    <Link to={module.status === "protected" ? "/library" : "/submit"}>
                      {module.status === "protected" ? "Access Library" : "Get Started"}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-muted-foreground">
              Get insights on scenes, characters, and distribution strategies powered by advanced AI
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Curated Resources</h3>
            <p className="text-muted-foreground">
              Access vetted festivals, essential documents, and industry connections
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
            <p className="text-muted-foreground">
              Direct access to our producer desk for personalized consulting and support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}