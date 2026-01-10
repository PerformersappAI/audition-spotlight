import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import filmmakerGeniusLogo from "@/assets/filmmaker-genius-logo.png";
import toolScriptAnalysis from "@/assets/tool-script-analysis.jpg";
import toolPitchDeck from "@/assets/tool-pitch-deck.jpg";
import toolStoryboard from "@/assets/tool-storyboard.jpg";
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
  UserPlus,
  ArrowRight
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

      {/* BLACK SECTION - Adobe Style Tools */}
      <div className="bg-black">
        <div className="container mx-auto px-6 py-16">
          {/* Divider Text */}
          <div className="text-center mb-12">
            <p className="text-xl md:text-2xl font-medium text-gray-400 max-w-2xl mx-auto mb-4">
              Or just click on the tool that you need
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Filmmaker Toolbox
            </h2>
          </div>

          {/* Adobe-Style Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Script Analysis - Large white card with product image */}
            <Link to="/script-analysis" className="lg:col-span-2 group">
              <div className="h-full bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Script Analysis</p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Analyze your screenplay.
                </h3>
                <p className="text-gray-600 mb-4">
                  Character development, emotional beats, and scene breakdowns in one place.
                </p>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 border border-gray-900 rounded-full px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors mb-6">
                  Learn more
                </button>
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={toolScriptAnalysis} 
                    alt="Script Analysis Tool" 
                    className="w-full h-auto object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>

            {/* Pitch Deck - Tall white card with image */}
            <Link to="/pitch-deck" className="row-span-2 group">
              <div className="h-full bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pitch Deck Maker</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Professional pitch decks.
                </h3>
                <p className="text-gray-600 mb-4">
                  Create with smart content generation and poster creation.
                </p>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 border border-gray-900 rounded-full px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors mb-6 w-fit">
                  Learn more
                </button>
                <div className="flex-1 relative rounded-xl overflow-hidden min-h-[300px]">
                  <img 
                    src={toolPitchDeck} 
                    alt="Pitch Deck Maker" 
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>

            {/* Storyboarding - White card with storyboard image */}
            <Link to="/storyboarding" className="lg:col-span-2 group">
              <div className="h-full bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-3">Storyboarding</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Visual shot breakdowns.
                </h3>
                <p className="text-gray-600 mb-4">
                  Create storyboards with automated frames and export options.
                </p>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 border border-gray-900 rounded-full px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors mb-4">
                  Learn more
                </button>
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={toolStoryboard} 
                    alt="Storyboarding Tool" 
                    className="w-full h-auto object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>

            {/* Call Sheet - Dark card */}
            <Link to="/call-sheet" className="group">
              <div className="h-full bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-3">Call Sheet Generator</p>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Professional call sheets.
                </h3>
                <p className="text-gray-400 mb-6">
                  Create production call sheets with OCR upload support for quick setup.
                </p>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-teal-400 transition-colors">
                  Get started <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Link>

            {/* Create Auditions - Dark card */}
            <Link to="/create-audition" className="group">
              <div className="h-full bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-3">Create Auditions</p>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Post casting calls.
                </h3>
                <p className="text-gray-400 mb-6">
                  Create and manage audition opportunities for your projects.
                </p>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-orange-400 transition-colors">
                  Get started <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Link>

            {/* Crew Hire - Dark card */}
            <Link to="/crew-hire" className="group">
              <div className="h-full bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-3">Crew Hire</p>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Find your crew.
                </h3>
                <p className="text-gray-400 mb-6">
                  Post crew calls to find talented crew members for your production.
                </p>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-indigo-400 transition-colors">
                  Get started <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Link>

            {/* Light gray card with links - like Adobe's Creative Cloud card */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">More Tools</h3>
              <div className="space-y-3">
                <Link to="/festival-finder" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Film Festivals in Your Area</span>
                </Link>
                <Link to="/library" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Docs Library</span>
                </Link>
                <Link to="/consulting" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">Concierge / Consulting</span>
                </Link>
                <Link to="/calendar" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Production Calendar</span>
                </Link>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Resources</h3>
              <div className="space-y-3">
                <a href="https://feiferfilmacademy.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-sm">Feifer Film Academy</span>
                </a>
                <Link to="/contract-assistant" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                  <Scale className="h-4 w-4" />
                  <span className="text-sm">SAG-AFTRA Contract Assistant</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
