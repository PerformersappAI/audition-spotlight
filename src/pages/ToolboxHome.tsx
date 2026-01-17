import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import filmmakerGeniusLogo from "@/assets/filmmaker-genius-logo.png";
import toolScriptAnalysis from "@/assets/tool-script-analysis-new.jpg";
import toolPitchDeck from "@/assets/tool-pitch-deck-new.png";
import toolStoryboard from "@/assets/tool-storyboard.jpg";
import toolCallSheet from "@/assets/tool-call-sheet-new.png";
import toolAuditions from "@/assets/tool-auditions.jpg";
import toolCrewHire from "@/assets/tool-crew-hire.jpg";
import toolboxHeaderBg from "@/assets/toolbox-header-bg.jpg";
import heroBannerBg from "@/assets/hero-banner-bg.png";
import { 
  Video, 
  Users, 
  User,
  MapPin, 
  Trophy, 
  FileText, 
  MessageCircle, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Scale,
  ExternalLink,
  Presentation,
  Clapperboard,
  Film,
  Calendar,
  Megaphone,
  UserPlus,
  ArrowRight,
  Zap,
  DollarSign,
  ClipboardCheck
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
  const { user, userProfile, signOut } = useAuth();
  const { credits } = useCredits();
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


        {/* TOP NAVIGATION BAR */}
        <div className="container mx-auto px-6 pt-6 relative z-10">
          <nav className="flex items-center justify-center py-4 gap-8 flex-wrap">
            <Link
              to="/"
              className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/membership"
              className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              Membership
            </Link>
            <Link
              to="/consulting"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Contact
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-gray-300 hover:text-white font-medium transition-colors">
                About
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-gray-900 border-gray-700">
                <DropdownMenuItem asChild>
                  <Link to="/festivals" className="flex items-center gap-2 cursor-pointer text-gray-200 hover:text-white">
                    <Trophy className="h-4 w-4" />
                    Film Festivals
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/library" className="flex items-center gap-2 cursor-pointer text-gray-200 hover:text-white">
                    <FileText className="h-4 w-4" />
                    Document Library
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/toolbox"
              className="text-amber-500 hover:text-amber-400 font-bold transition-colors"
            >
              Filmmaker Toolbox
            </Link>
            {userProfile?.role === 'admin' && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-gray-300 hover:text-white font-medium transition-colors">
                  Admin
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-gray-900 border-gray-700">
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer text-gray-200 hover:text-white">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/users" className="cursor-pointer text-gray-200 hover:text-white">Users</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/auditions" className="cursor-pointer text-gray-200 hover:text-white">Auditions</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Login/User section */}
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                {/* Credits Display */}
                <Link to="/membership" className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400 transition-colors">
                  <Zap className="h-4 w-4" />
                  <span className="font-medium">{credits?.available_credits || 0} Credits</span>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-amber-500 flex items-center justify-center overflow-hidden">
                      <User className="h-5 w-5 text-gray-300" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                    <div className="px-3 py-2 border-b border-gray-700">
                      <div className="text-sm font-medium text-white">{userProfile?.first_name || 'User'}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer text-gray-200 hover:text-white">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/training/my-learning" className="cursor-pointer text-gray-200 hover:text-white">My Learning</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-400 hover:text-red-300">
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold ml-4">
                  Sign In / Sign Up
                </Button>
              </Link>
            )}
          </nav>
        </div>

        {/* TITLE SECTION - with space below nav */}
        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Header - Stylized title */}
          <div className="text-center">
            <h1 
              className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: 'linear-gradient(180deg, #9CA3AF 0%, #D1D5DB 10%, #F9FAFB 25%, #E5E7EB 35%, #9CA3AF 50%, #A8956E 65%, #C9A962 75%, #D4AF37 85%, #B8860B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
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
        
        <div className="container mx-auto px-6 pb-16">
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
                <div className="flex-1 min-h-[140px] relative overflow-hidden">
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
                <div className="flex-1 min-h-[479px] relative overflow-hidden bg-gray-900">
                  <img 
                    src={toolPitchDeck} 
                    alt="Pitch Deck Maker" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: '45% 15%' }}
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
                <div className="flex-1 min-h-[100px] relative overflow-hidden">
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
                <div className="flex-1 min-h-[100px] relative overflow-hidden">
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
                <Link to="/funding-strategy" className="flex items-center gap-3 text-gray-200 hover:text-green-400 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-base font-medium">Funding</span>
                </Link>
                <Link to="/distribution-readiness" className="flex items-center gap-3 text-gray-200 hover:text-cyan-400 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <ClipboardCheck className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span className="text-base font-medium">Distribution</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}