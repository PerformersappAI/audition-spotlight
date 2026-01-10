import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import filmmakerGeniusLogo from "@/assets/filmmaker-genius-logo.png";
import { 
  Video, 
  Users, 
  MapPin, 
  Trophy, 
  FileText, 
  MessageCircle, 
  Sparkles,
  ChevronRight,
  GraduationCap,
  Scale,
  ExternalLink,
  Presentation,
  Clapperboard,
  Film,
  Calendar,
  Megaphone,
  UserPlus
} from "lucide-react";

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: string;
  badge: string;
  route?: string;
  externalUrl?: string;
  priority?: boolean;
  size?: "large" | "tall" | "small";
}

export default function ToolboxHome() {
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchYoutubeUrl = async () => {
      const { data } = await supabase
        .from('homepage_settings')
        .select('setting_value')
        .eq('setting_key', 'homepage_youtube_url')
        .maybeSingle();
      
      if (data?.setting_value) {
        setYoutubeUrl(data.setting_value);
      }
    };
    fetchYoutubeUrl();
  }, []);

  // Extract YouTube embed URL
  const getYoutubeEmbedUrl = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([^&?\s]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  const embedUrl = youtubeUrl ? getYoutubeEmbedUrl(youtubeUrl) : null;

  // Priority tools - displayed as large cards
  const priorityModules: Module[] = [
    {
      id: "script_analysis",
      name: "Script Analysis",
      description: "Smart script analysis for character development and emotional beats",
      icon: Sparkles,
      status: "active",
      badge: "Smart Tool",
      route: "/script-analysis",
      priority: true,
      size: "large"
    },
    {
      id: "pitch_deck_maker",
      name: "Pitch Deck Maker",
      description: "Create professional Film & TV pitch decks with smart content generation",
      icon: Presentation,
      status: "active",
      badge: "Smart Tool",
      route: "/pitch-deck",
      priority: true,
      size: "large"
    },
    {
      id: "storyboarding",
      name: "Storyboarding",
      description: "Create visual storyboards with automated shot breakdowns and frames",
      icon: Film,
      status: "active",
      badge: "Visual",
      route: "/storyboarding",
      priority: true,
      size: "tall"
    },
    {
      id: "call_sheet",
      name: "Call Sheet Generator",
      description: "Create professional production call sheets with OCR upload support",
      icon: Clapperboard,
      status: "active",
      badge: "Smart Tool",
      route: "/call-sheet",
      priority: true,
      size: "large"
    },
    {
      id: "create_auditions",
      name: "Create Auditions",
      description: "Create and manage audition opportunities for your projects",
      icon: Megaphone,
      status: "active",
      badge: "Core Tool",
      route: "/create-audition",
      priority: true,
      size: "large"
    },
    {
      id: "crew_hire",
      name: "Crew Hire",
      description: "Post crew calls to find talented crew members for your production",
      icon: UserPlus,
      status: "active",
      badge: "Hire Crew",
      route: "/crew-hire",
      priority: true,
      size: "large"
    }
  ];

  // Secondary tools - displayed as smaller cards
  const secondaryModules: Module[] = [
    {
      id: "festival_finder",
      name: "Film Festivals",
      description: "Find festivals in your area by ZIP code",
      icon: MapPin,
      status: "active",
      badge: "Location",
      route: "/festival-finder",
      size: "small"
    },
    {
      id: "docs_library",
      name: "Docs Library",
      description: "Forms, templates, and checklists",
      icon: FileText,
      status: "protected",
      badge: "Premium",
      route: "/library",
      size: "small"
    },
    {
      id: "concierge",
      name: "Concierge",
      description: "Direct producer desk access",
      icon: MessageCircle,
      status: "active",
      badge: "Support",
      route: "/consulting",
      size: "small"
    },
    {
      id: "calendar",
      name: "Production Calendar",
      description: "Schedule shoots and milestones",
      icon: Calendar,
      status: "active",
      badge: "Productivity",
      route: "/calendar",
      size: "small"
    },
    {
      id: "training_academy",
      name: "Feifer Film Academy",
      description: "Professional courses",
      icon: GraduationCap,
      status: "active",
      badge: "External",
      externalUrl: "https://feiferfilmacademy.com",
      size: "small"
    },
    {
      id: "contract_assistant",
      name: "Contract Assistant",
      description: "SAG-AFTRA guidance",
      icon: Scale,
      status: "active",
      badge: "Smart Tool",
      route: "/contract-assistant",
      size: "small"
    }
  ];

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "Smart Tool": return "default";
      case "Oprime.Vetted": return "secondary";
      case "Premium": return "outline";
      case "Community": return "secondary";
      case "Human Support": return "outline";
      case "Core Tool": return "default";
      case "Productivity": return "secondary";
      case "Visual": return "default";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen">
      {/* DARK HERO SECTION */}
      <div className="bg-[#0E0F12]">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            {/* Logo bookends with title */}
            <div className="flex items-center justify-center gap-3 md:gap-6 mb-4">
              {/* Left logo - flat side faces right toward text */}
              <img 
                src={filmmakerGeniusLogo} 
                alt="" 
                className="h-12 md:h-20 w-auto -rotate-90"
              />
              
              {/* Title */}
              <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Filmmaker Genius
              </h1>
              
              {/* Right logo - flat side faces left toward text */}
              <img 
                src={filmmakerGeniusLogo} 
                alt="Filmmaker Genius Logo" 
                className="h-12 md:h-20 w-auto rotate-90"
              />
            </div>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-8 italic">
              Where Genius Meets the Silver Screen
            </p>
          </div>

          {/* Asymmetric Layout: CTA Text Left, Video Right (Adobe-style) */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12">
            {/* Left side - CTA Text */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Need help with the process of filmmaking?
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-6">
                From start to distribution, click the boxes below to guide you through every step of your filmmaking journey.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2 text-sm">
                  Pre-Production
                </Badge>
                <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 px-4 py-2 text-sm">
                  Production
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2 text-sm">
                  Post-Production
                </Badge>
              </div>
            </div>

            {/* Right side - Smaller Video */}
            {embedUrl && (
              <div className="flex-shrink-0 w-full lg:w-auto">
                <div className="w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-gray-700 bg-gray-900 shadow-2xl">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Filmmaker Genius Introduction"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Filmmaking Journey Phases - UNCHANGED */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pb-12">
            <Link to="/toolbox/pre-production">
              <Card className="h-48 bg-gradient-to-br from-blue-400 to-blue-500 border-none hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden">
                <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3">Pre Production</h3>
                  <p className="text-white/90 text-base">Screenwriting, Storyboarding, etc.</p>
                </CardContent>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="text-[180px] font-bold text-white">1</span>
                </div>
              </Card>
            </Link>
            <Link to="/toolbox/production">
              <Card className="h-48 bg-gradient-to-br from-teal-500 to-teal-600 border-none hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden">
                <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3">Production</h3>
                  <p className="text-white/90 text-base">iPhone or Cannon, Hollywood Cinematography</p>
                </CardContent>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="text-[180px] font-bold text-white">2</span>
                </div>
              </Card>
            </Link>
            <Link to="/toolbox/post-production">
              <Card className="h-48 bg-gradient-to-br from-purple-500 to-purple-600 border-none hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden">
                <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3">Post Production</h3>
                  <p className="text-white/90 text-base">Editing</p>
                </CardContent>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="text-[180px] font-bold text-white">3</span>
                </div>
              </Card>
            </Link>
            <Link to="/toolbox/film-release">
              <Card className="h-48 bg-gradient-to-br from-blue-600 to-blue-700 border-none hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden">
                <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3">Film Release</h3>
                  <p className="text-white/90 text-base">Marketing, Film Festival</p>
                </CardContent>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="text-[180px] font-bold text-white">4</span>
                </div>
              </Card>
            </Link>
            <Link to="/toolbox/distribution">
              <Card className="h-48 bg-gradient-to-br from-blue-700 to-blue-900 border-none hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden">
                <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3">Distribution</h3>
                  <p className="text-white/90 text-base">Monetization</p>
                </CardContent>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="text-[180px] font-bold text-white">5</span>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* WHITE SECTION - Tools and Features */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-16">
          {/* Divider Text */}
          <div className="text-center mb-12">
            <p className="text-xl md:text-2xl font-medium text-gray-600 max-w-2xl mx-auto mb-4">
              Or just click on the tool that you need to help you with your filmmaking
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Filmmaker Toolbox
            </h2>
          </div>

          {/* Bento Grid - Adobe Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[140px]">
            {/* Script Analysis - Large */}
            <Link to="/script-analysis" className="col-span-2 row-span-2">
              <div className="h-full bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col">
                <Badge className="w-fit mb-3 bg-primary/10 text-primary border-0">Smart Tool</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Script Analysis</h3>
                <p className="text-gray-600 text-sm mb-4">Smart script analysis for character development and emotional beats</p>
                <div className="flex-1 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex items-center justify-center group-hover:from-primary/10 group-hover:to-primary/20 transition-all">
                  <Sparkles className="h-16 w-16 text-primary/50 group-hover:text-primary/70 transition-colors" />
                </div>
              </div>
            </Link>

            {/* Pitch Deck - Large */}
            <Link to="/pitch-deck" className="col-span-2 row-span-2">
              <div className="h-full bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-blue-100 group cursor-pointer flex flex-col">
                <Badge className="w-fit mb-3 bg-blue-500/10 text-blue-600 border-0">Smart Tool</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pitch Deck Maker</h3>
                <p className="text-gray-600 text-sm mb-4">Create professional Film & TV pitch decks with smart content generation</p>
                <div className="flex-1 bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl flex items-center justify-center group-hover:from-blue-500/10 group-hover:to-blue-500/20 transition-all">
                  <Presentation className="h-16 w-16 text-blue-500/50 group-hover:text-blue-500/70 transition-colors" />
                </div>
              </div>
            </Link>

            {/* Storyboarding - Tall */}
            <Link to="/storyboarding" className="col-span-2 row-span-3">
              <div className="h-full bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-purple-100 group cursor-pointer flex flex-col">
                <Badge className="w-fit mb-3 bg-purple-500/10 text-purple-600 border-0">Visual</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Storyboarding</h3>
                <p className="text-gray-600 text-sm mb-4">Create visual storyboards with automated shot breakdowns and frames</p>
                <div className="flex-1 bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-xl flex items-center justify-center group-hover:from-purple-500/10 group-hover:to-purple-500/20 transition-all">
                  <Film className="h-20 w-20 text-purple-500/50 group-hover:text-purple-500/70 transition-colors" />
                </div>
              </div>
            </Link>

            {/* Call Sheet Generator */}
            <Link to="/call-sheet" className="col-span-2 row-span-2">
              <div className="h-full bg-gradient-to-br from-teal-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-teal-100 group cursor-pointer flex flex-col">
                <Badge className="w-fit mb-3 bg-teal-500/10 text-teal-600 border-0">Smart Tool</Badge>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Call Sheet Generator</h3>
                <p className="text-gray-600 text-sm mb-3">Professional production call sheets with OCR support</p>
                <div className="flex-1 bg-gradient-to-br from-teal-500/5 to-teal-500/10 rounded-xl flex items-center justify-center group-hover:from-teal-500/10 group-hover:to-teal-500/20 transition-all">
                  <Clapperboard className="h-12 w-12 text-teal-500/50 group-hover:text-teal-500/70 transition-colors" />
                </div>
              </div>
            </Link>

            {/* Create Auditions */}
            <Link to="/create-audition" className="col-span-2 row-span-2">
              <div className="h-full bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-orange-100 group cursor-pointer flex flex-col">
                <Badge className="w-fit mb-3 bg-orange-500/10 text-orange-600 border-0">Core Tool</Badge>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create Auditions</h3>
                <p className="text-gray-600 text-sm mb-3">Create and manage audition opportunities</p>
                <div className="flex-1 bg-gradient-to-br from-orange-500/5 to-orange-500/10 rounded-xl flex items-center justify-center group-hover:from-orange-500/10 group-hover:to-orange-500/20 transition-all">
                  <Megaphone className="h-12 w-12 text-orange-500/50 group-hover:text-orange-500/70 transition-colors" />
                </div>
              </div>
            </Link>

            {/* Crew Hire */}
            <Link to="/crew-hire" className="col-span-2 row-span-1">
              <div className="h-full bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-4 hover:shadow-xl transition-all duration-300 border border-indigo-100 group cursor-pointer flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/10 to-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-indigo-500/20 group-hover:to-indigo-500/30 transition-all">
                  <UserPlus className="h-7 w-7 text-indigo-500/70 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900">Crew Hire</h3>
                  <p className="text-gray-600 text-sm truncate">Find talented crew members</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
              </div>
            </Link>

            {/* Secondary tools - compact cards */}
            {secondaryModules.map((module) => {
              const Icon = module.icon;
              const content = (
                <div className="h-full bg-white/80 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-all">
                    <Icon className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{module.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{module.description}</p>
                  </div>
                  {module.externalUrl ? (
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                  )}
                </div>
              );

              return module.externalUrl ? (
                <a 
                  key={module.id}
                  href={module.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 md:col-span-2 lg:col-span-2"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={module.id}
                  to={module.route || "#"}
                  className="col-span-2 md:col-span-2 lg:col-span-2"
                >
                  {content}
                </Link>
              );
            })}
          </div>

          {/* Features Overview - Light Theme */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Analysis</h3>
              <p className="text-gray-600">
                Get insights on scenes, characters, and distribution strategies using advanced technology
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Curated Resources</h3>
              <p className="text-gray-600">
                Access vetted festivals, essential documents, and industry connections
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Expert Guidance</h3>
              <p className="text-gray-600">
                Direct access to our producer desk for personalized consulting and support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
