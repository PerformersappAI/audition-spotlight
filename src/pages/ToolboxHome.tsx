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
  ChevronRight,
  GraduationCap
} from "lucide-react";

export default function ToolboxHome() {
  const [modules] = useState([
    {
      id: "script_analysis",
      name: "Script Analysis",
      description: "AI-powered script analysis for character development and emotional beats",
      icon: Sparkles,
      status: "active",
      badge: "AI Enhanced",
      route: "/script-analysis"
    },
    {
      id: "storyboarding",
      name: "Storyboarding",
      description: "Create visual storyboards with AI-generated shot breakdowns and frames",
      icon: Video,
      status: "active",
      badge: "Visual AI",
      route: "/storyboarding"
    },
    {
      id: "create_auditions",
      name: "Create Auditions",
      description: "Create and manage audition opportunities for your projects",
      icon: Users,
      status: "active",
      badge: "Core Tool",
      route: "/create-audition"
    },
    {
      id: "cast_crew_board",
      name: "Cast and Crew Board",
      description: "Find and connect with talented cast and crew members",
      icon: Users,
      status: "active",
      badge: "Community",
      route: "/cast-crew-board"
    },
    {
      id: "festival_submitter",
      name: "Festival Submitter",
      description: "Submit your projects to film festivals with AI-powered recommendations",
      icon: Trophy,
      status: "active",
      badge: "AI Enhanced",
      route: "/festival-submitter"
    },
    {
      id: "docs_library",
      name: "Docs Library",
      description: "Essential forms, templates, and deliverables checklists",
      icon: FileText,
      status: "protected",
      badge: "Premium",
      route: "/library"
    },
    {
      id: "concierge",
      name: "Concierge / Consulting",
      description: "Direct access to our producer desk for guidance",
      icon: MessageCircle,
      status: "active",
      badge: "Human Support",
      route: "/consulting"
    },
    {
      id: "calendar",
      name: "Production Calendar",
      description: "Schedule shoots, meetings, and production milestones",
      icon: MapPin,
      status: "active",
      badge: "Productivity",
      route: "/calendar"
    },
    {
      id: "browse_festivals",
      name: "Browse Festivals and Submit",
      description: "Browse 2,000+ festivals worldwide and submit directly",
      icon: Trophy,
      status: "active",
      badge: "AI Enhanced",
      route: "/festivals"
    },
    {
      id: "training_academy",
      name: "Training Academy",
      description: "Learn from Feifer Film Academy with courses and certifications",
      icon: GraduationCap,
      status: "active",
      badge: "Learn & Grow",
      route: "/training"
    }
  ]);

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "AI Enhanced": return "default";
      case "Oprime.Vetted": return "secondary";
      case "Premium": return "outline";
      case "Community": return "secondary";
      case "Human Support": return "outline";
      case "Core Tool": return "default";
      case "Productivity": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Filmmaker Toolbox
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Complete your film journey with AI-powered tools, curated resources, and expert guidance
          </p>
          <p className="text-lg text-foreground max-w-2xl mx-auto">
            Need help with the process of filmmaking from start to distribution, click these boxes.
          </p>
        </div>

        {/* Filmmaking Journey Phases */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          <Link to="/toolbox/pre-production">
            <Card className="h-48 bg-gradient-to-br from-blue-400 to-blue-500 border-none hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden">
              <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Pre Production</h3>
                <p className="text-white/90 text-sm">Screenwriting, Storyboarding, etc.</p>
              </CardContent>
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <svg viewBox="0 0 200 200" className="w-32 h-32">
                  <path d="M20,100 L50,50 L50,150 Z M80,50 L80,150 M110,150 L110,50 L140,50" stroke="white" strokeWidth="8" fill="none"/>
                </svg>
              </div>
            </Card>
          </Link>
          <Link to="/toolbox/production">
            <Card className="h-48 bg-gradient-to-br from-teal-500 to-teal-600 border-none hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden">
              <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Production</h3>
                <p className="text-white/90 text-sm">iPhone or Cannon, Hollywood Cinematography</p>
              </CardContent>
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <svg viewBox="0 0 200 200" className="w-32 h-32">
                  <circle cx="70" cy="100" r="40" stroke="white" strokeWidth="8" fill="none"/>
                  <circle cx="130" cy="100" r="40" stroke="white" strokeWidth="8" fill="none"/>
                </svg>
              </div>
            </Card>
          </Link>
          <Link to="/toolbox/post-production">
            <Card className="h-48 bg-gradient-to-br from-purple-500 to-purple-600 border-none hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden">
              <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Post Production</h3>
                <p className="text-white/90 text-sm">Editing</p>
              </CardContent>
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <svg viewBox="0 0 200 200" className="w-32 h-32">
                  <path d="M60,60 Q100,80 140,60 Q100,100 140,140 Q100,120 60,140 Q100,100 60,60 Z" stroke="white" strokeWidth="8" fill="none"/>
                </svg>
              </div>
            </Card>
          </Link>
          <Link to="/toolbox/film-release">
            <Card className="h-48 bg-gradient-to-br from-blue-600 to-blue-700 border-none hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden">
              <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Film Release</h3>
                <p className="text-white/90 text-sm">Marketing, Film Festival</p>
              </CardContent>
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <svg viewBox="0 0 200 200" className="w-32 h-32">
                  <polygon points="60,50 140,50 160,100 140,150 60,150 40,100" stroke="white" strokeWidth="8" fill="none"/>
                  <circle cx="100" cy="70" r="8" fill="white"/>
                  <circle cx="100" cy="130" r="8" fill="white"/>
                </svg>
              </div>
            </Card>
          </Link>
          <Link to="/toolbox/distribution">
            <Card className="h-48 bg-gradient-to-br from-blue-700 to-blue-900 border-none hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden">
              <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Distribution</h3>
                <p className="text-white/90 text-sm">Monetization</p>
              </CardContent>
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <svg viewBox="0 0 200 200" className="w-32 h-32">
                  <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="8" fill="none"/>
                  <path d="M100,50 L100,150 M50,100 L150,100" stroke="white" strokeWidth="8"/>
                </svg>
              </div>
            </Card>
          </Link>
        </div>

        {/* Divider Text */}
        <div className="text-center my-12 py-8">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Or just click on the tool that you need to help you with your filmmaking
          </p>
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
                    <Link to={module.route}>
                      {module.status === "protected" ? "Access Library" : "Open Tool"}
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