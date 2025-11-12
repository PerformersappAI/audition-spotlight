import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Home, Film, Calendar, Users, Settings, ChevronDown, Upload, Brain, Plus, BarChart3, Briefcase, Trophy, FileText, MessageCircle, MapPin, Video, LogOut, Coins } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'ACTOR' | 'FILMMAKER' | 'FILM_FESTIVAL' | 'ADMIN' | 'CREW';
}

export const Layout = ({ children, userRole = 'ACTOR' }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const { credits } = useCredits();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const displayName = userProfile?.first_name && userProfile?.last_name 
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : userProfile?.email?.split('@')[0] || 'User';
  
  const displayRole = userProfile?.role?.toUpperCase() || userRole;

  const navigation = userRole === 'FILMMAKER' ? [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Toolbox', href: '/toolbox', icon: Briefcase },
    { name: 'Projects', href: '/filmmaker', icon: Film },
    { name: 'Applications', href: '/applications', icon: Users },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Festivals', href: '/festivals', icon: Trophy },
  ] : userRole === 'FILM_FESTIVAL' ? [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Festivals', href: '/festivals', icon: Calendar },
    { name: 'Submissions', href: '/submissions', icon: Users },
  ] : userRole === 'ADMIN' ? [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'All Projects', href: '/admin/projects', icon: Film },
  ] : userRole === 'CREW' ? [
    { name: 'Crew Hub', href: '/crew', icon: Briefcase },
    { name: 'Find Jobs', href: '/crew/jobs', icon: Film },
    { name: 'My Applications', href: '/applications', icon: Users },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ] : [
    { name: 'Find Auditions', href: '/', icon: Film },
    { name: 'My Applications', href: '/applications', icon: Users },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-lg">
                  <Film className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">MyFilmmakerAI</h1>
                  <p className="text-sm text-muted-foreground">AI-Powered Film Production Tools</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
                
                {/* Tools Dropdown for Filmmakers */}
                {userRole === 'FILMMAKER' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Tools
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg">
                      <DropdownMenuItem asChild>
                        <Link to="/upload-auditions" className="flex items-center gap-2 w-full cursor-pointer">
                          <Upload className="h-4 w-4" />
                          Upload Auditions
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/scene-analysis" className="flex items-center gap-2 w-full cursor-pointer">
                          <Brain className="h-4 w-4" />
                          AI Scene Analysis
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/create-project" className="flex items-center gap-2 w-full cursor-pointer">
                          <Plus className="h-4 w-4" />
                          Create Project
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/create-festival" className="flex items-center gap-2 w-full cursor-pointer">
                          <Trophy className="h-4 w-4" />
                          Create Festival
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/library" className="flex items-center gap-2 w-full cursor-pointer">
                          <FileText className="h-4 w-4" />
                          Docs Library
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/consulting" className="flex items-center gap-2 w-full cursor-pointer">
                          <MessageCircle className="h-4 w-4" />
                          Consulting
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Resources Dropdown for All Users */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Resources
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg">
                    <DropdownMenuItem asChild>
                      <Link to="/festivals" className="flex items-center gap-2 w-full cursor-pointer">
                        <Trophy className="h-4 w-4" />
                        Film Festivals
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/library" className="flex items-center gap-2 w-full cursor-pointer">
                        <FileText className="h-4 w-4" />
                        Document Library
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/consulting" className="flex items-center gap-2 w-full cursor-pointer">
                        <MessageCircle className="h-4 w-4" />
                        Consulting Services
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>

              {credits && (
                <Badge variant="outline" className="border-gold text-gold flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  {credits.available_credits} Credits
                </Badge>
              )}

              <Badge variant="outline" className="border-primary text-primary">
                {displayRole}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 bg-accent/50 p-2 rounded-lg hover:bg-accent">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-foreground">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{userProfile?.email || user?.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/membership" className="flex items-center gap-2 w-full cursor-pointer">
                      <Coins className="h-4 w-4" />
                      Manage Credits
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 MyFilmmakerAI. AI-Powered Film Production Tools.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};