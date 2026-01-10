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
import toolCallSheet from "@/assets/tool-call-sheet.jpg";
import toolAuditions from "@/assets/tool-auditions.jpg";
import toolCrewHire from "@/assets/tool-crew-hire.jpg";
import toolboxHeaderBg from "@/assets/toolbox-header-bg.jpg";
import heroBannerBg from "@/assets/hero-banner-bg.png";
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
      {/* UNIFIED DARK SECTION with extended banner background */}
      <div className="relative bg-[#0E0F12]">
        {/* Banner background with film reels - fades out earlier as you scroll down */}
        <div 
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ 
            height: '800px'
          }}
        >
          <div 
            className="w-full h-full bg-contain bg-top bg-no-repeat opacity-40"
            style={{ 
              backgroundImage: `url(${heroBannerBg})`,
              backgroundSize: '100% auto',
              maskImage: 'linear-gradient(to bottom, black 0%, black 15%, rgba(0,0,0,0.3) 40%, transparent 65%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 15%, rgba(0,0,0,0.3) 40%, transparent 65%)'
            }}
          />
        </div>
        {/* Dark overlay for center focus - fades with the banner */}
        <div 
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ 
            height: '800px',
            background: 'linear-gradient(to right, rgba(14,15,18,0.5) 0%, rgba(14,15,18,0.75) 30%, rgba(14,15,18,0.75) 70%, rgba(14,15,18,0.5) 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 15%, rgba(0,0,0,0.3) 40%, transparent 65%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 15%, rgba(0,0,0,0.3) 40%, transparent 65%)'
          }}
        />


        {/* TOP BANNER HEADER */}
        <div className="container mx-auto px-6 py-10 relative z-10">
          {/* Header - Stylized title */}
          <div className="text-center">
            <h1 
              className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.7) 50%, hsl(var(--primary)) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 80px hsl(var(--primary)/0.3)',
                letterSpacing: '-0.02em'
              }}
            >
              Filmmaker Genius
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 italic">
              Where Genius Meets the Silver Screen
            </p>
          </div>
        </div>

        {/* HERO CONTENT SECTION - content flows over fading background */}
        <div className="container mx-auto px-6 py-10 relative z-10">
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

          {/* Filmmaking Journey Phases - Colored Numbers with text overlay */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 pb-12">
            <Link to="/toolbox/pre-production" className="group relative flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200">
              <span className="text-[120px] md:text-[160px] font-black text-blue-500/50 leading-none select-none group-hover:text-blue-400/70 transition-colors">1</span>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-white transition-colors">Pre Production</h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1 group-hover:text-gray-300 transition-colors">Screenwriting, Storyboarding</p>
              </div>
            </Link>
            
            <Link to="/toolbox/production" className="group relative flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200">
              <span className="text-[120px] md:text-[160px] font-black text-teal-500/50 leading-none select-none group-hover:text-teal-400/70 transition-colors">2</span>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-white transition-colors">Production</h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1 group-hover:text-gray-300 transition-colors">Cinematography</p>
              </div>
            </Link>
            
            <Link to="/toolbox/post-production" className="group relative flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200">
              <span className="text-[120px] md:text-[160px] font-black text-purple-500/50 leading-none select-none group-hover:text-purple-400/70 transition-colors">3</span>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-white transition-colors">Post Production</h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1 group-hover:text-gray-300 transition-colors">Editing</p>
              </div>
            </Link>
            
            <Link to="/toolbox/film-release" className="group relative flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200">
              <span className="text-[120px] md:text-[160px] font-black text-amber-500/50 leading-none select-none group-hover:text-amber-400/70 transition-colors">4</span>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-white transition-colors">Film Release</h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1 group-hover:text-gray-300 transition-colors">Marketing, Festivals</p>
              </div>
            </Link>
            
            <Link to="/toolbox/distribution" className="col-span-2 md:col-span-1 group relative flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200">
              <span className="text-[120px] md:text-[160px] font-black text-rose-500/50 leading-none select-none group-hover:text-rose-400/70 transition-colors">5</span>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-white transition-colors">Distribution</h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1 group-hover:text-gray-300 transition-colors">Monetization</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* BLACK SECTION - Adobe Style Tools */}
      <div className="bg-black">
        <div className="container mx-auto px-6 py-16">
          {/* Toolbox Header Card - with dramatic image */}
          <div className="relative rounded-2xl overflow-hidden mb-10">
            <img 
              src={toolboxHeaderBg} 
              alt="" 
              className="w-full h-48 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent flex items-center">
              <div className="p-8 md:p-12">
                <p className="text-lg md:text-xl font-medium text-gray-300 mb-2">
                  Or just click on the tool that you need
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  Filmmaker Toolbox
                </h2>
              </div>
            </div>
          </div>

          {/* Adobe-Style Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Script Analysis - Large card with black top, colorful bottom */}
            <Link to="/script-analysis" className="lg:col-span-2 group">
              <div className="h-full bg-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col">
                {/* Black text section */}
                <div className="p-6 pb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Script Analysis</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Analyze your screenplay.
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Character development, emotional beats, and scene breakdowns.
                  </p>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-full text-sm font-medium text-primary transition-all group-hover:scale-105">
                    <Sparkles className="h-4 w-4" />
                    Let's Go
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                {/* Colorful image section */}
                <div className="flex-1 min-h-[200px] relative overflow-hidden">
                  <img 
                    src={toolScriptAnalysis} 
                    alt="Script Analysis Tool" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>

            {/* Pitch Deck - Tall card with black top, colorful bottom */}
            <Link to="/pitch-deck" className="row-span-2 group">
              <div className="h-full bg-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col">
                {/* Black text section */}
                <div className="p-6 pb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pitch Deck Maker</p>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Create professional pitch decks.
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Smart content generation and poster creation.
                  </p>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-full text-sm font-medium text-purple-400 transition-all group-hover:scale-105">
                    <Presentation className="h-4 w-4" />
                    Create
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
                {/* Colorful image section */}
                <div className="flex-1 min-h-[300px] relative overflow-hidden">
                  <img 
                    src={toolPitchDeck} 
                    alt="Pitch Deck Maker" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>

            {/* Storyboarding - Card with black top, colorful bottom */}
            <Link to="/storyboarding" className="lg:col-span-2 group">
              <div className="h-full bg-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col">
                {/* Black text section */}
                <div className="p-6 pb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Storyboarding</p>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Visual shot breakdowns.
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Create storyboards with automated frames and export options.
                  </p>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 rounded-full text-sm font-medium text-orange-400 transition-all group-hover:scale-105">
                    <Film className="h-4 w-4" />
                    Visualize
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
                {/* Colorful image section */}
                <div className="flex-1 min-h-[180px] relative overflow-hidden">
                  <img 
                    src={toolStoryboard} 
                    alt="Storyboarding Tool" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>

            {/* Row: Call Sheet + Auditions side by side */}
            <Link to="/call-sheet" className="lg:col-span-1 group">
              <div className="h-full bg-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col">
                <div className="p-5 pb-3">
                  <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">Call Sheet Generator</p>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Professional call sheets.
                  </h3>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 rounded-full text-xs font-medium text-teal-400 transition-all group-hover:scale-105">
                    <Clapperboard className="h-3 w-3" />
                    Build
                  </span>
                </div>
                <div className="flex-1 min-h-[140px] relative overflow-hidden">
                  <img 
                    src={toolCallSheet} 
                    alt="Call Sheet Tool" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>

            <Link to="/create-audition" className="lg:col-span-1 group">
              <div className="h-full bg-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col">
                <div className="p-5 pb-3">
                  <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-2">Create Auditions</p>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Post casting calls.
                  </h3>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 rounded-full text-xs font-medium text-orange-400 transition-all group-hover:scale-105">
                    <Megaphone className="h-3 w-3" />
                    Post
                  </span>
                </div>
                <div className="flex-1 min-h-[140px] relative overflow-hidden">
                  <img 
                    src={toolAuditions} 
                    alt="Auditions Tool" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>

            {/* Crew Hire - spans width */}
            <Link to="/crew-hire" className="lg:col-span-1 group">
              <div className="h-full bg-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col">
                <div className="p-5 pb-3">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-2">Crew Hire</p>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Find your crew.
                  </h3>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 rounded-full text-xs font-medium text-indigo-400 transition-all group-hover:scale-105">
                    <UserPlus className="h-3 w-3" />
                    Hire
                  </span>
                </div>
                <div className="flex-1 min-h-[140px] relative overflow-hidden">
                  <img 
                    src={toolCrewHire} 
                    alt="Crew Hire Tool" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* More Tools - Horizontal Bar */}
          <div className="mt-8 bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <h3 className="text-xl font-bold text-white whitespace-nowrap">More Tools</h3>
              <div className="flex flex-wrap items-center gap-4 md:gap-8">
                <Link to="/festival-finder" className="flex items-center gap-3 text-gray-200 hover:text-teal-400 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-teal-400" />
                  </div>
                  <span className="text-base font-medium">Festivals</span>
                </Link>
                <Link to="/library" className="flex items-center gap-3 text-gray-200 hover:text-purple-400 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="text-base font-medium">Docs</span>
                </Link>
                <Link to="/consulting" className="flex items-center gap-3 text-gray-200 hover:text-blue-400 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-base font-medium">Concierge</span>
                </Link>
                <Link to="/calendar" className="flex items-center gap-3 text-gray-200 hover:text-amber-400 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-base font-medium">Calendar</span>
                </Link>
                <a href="https://feiferfilmacademy.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-200 hover:text-rose-400 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-rose-400" />
                  </div>
                  <span className="text-base font-medium">Academy</span>
                </a>
                <Link to="/contract-assistant" className="flex items-center gap-3 text-gray-200 hover:text-emerald-400 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span className="text-base font-medium">Contracts</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}