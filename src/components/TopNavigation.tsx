import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { 
  Home, 
  Film, 
  Calendar, 
  Users, 
  Settings, 
  ChevronDown, 
  Upload, 
  Brain, 
  Plus, 
  BarChart3, 
  Briefcase, 
  Trophy, 
  FileText, 
  MessageCircle, 
  MapPin,
  Video,
  Sparkles,
  LogOut,
  User,
  GraduationCap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const TopNavigation = () => {
  const location = useLocation();
  const { user, userProfile, signOut } = useAuth();
  
  // Main navigation items based on user role
  const getMainNavigation = () => {
    if (!user) {
      return [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Festivals', href: '/festivals', icon: Trophy },
      ];
    }

    const role = userProfile?.role;
    
    if (role === 'FILMMAKER') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { name: 'Toolbox', href: '/toolbox', icon: Briefcase },
        { name: 'Projects', href: '/filmmaker', icon: Film },
        { name: 'Applications', href: '/applications', icon: Users },
        { name: 'Calendar', href: '/calendar', icon: Calendar },
        { name: 'Festivals', href: '/festivals', icon: Trophy },
      ];
    } else if (role === 'FILM_FESTIVAL') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { name: 'Festivals', href: '/festivals', icon: Calendar },
        { name: 'Submissions', href: '/submissions', icon: Users },
      ];
    } else if (role === 'ADMIN') {
      return [
        { name: 'Dashboard', href: '/admin', icon: BarChart3 },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Projects', href: '/admin/projects', icon: Film },
        { name: 'Festivals', href: '/admin/festivals', icon: Trophy },
      ];
    } else {
      // ACTOR or default
      return [];
    }
  };

  const navigation = getMainNavigation();
  const isFilmmaker = userProfile?.role === 'FILMMAKER';

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {/* Main Navigation */}
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            location.pathname === item.href 
              ? 'bg-gold/10 text-gold border border-gold/20' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.name}
        </Link>
      ))}
      
      {/* Filmmaker Tools Dropdown */}
      {isFilmmaker && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Tools
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-background border shadow-lg">
            <DropdownMenuItem asChild>
              <Link to="/upload-auditions" className="flex items-center gap-3 w-full cursor-pointer p-3">
                <Upload className="h-4 w-4 text-primary" />
                <div>
                  <div className="font-medium">Upload Auditions</div>
                  <div className="text-xs text-muted-foreground">Manage audition materials</div>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/scene-analysis" className="flex items-center gap-3 w-full cursor-pointer p-3">
                <Brain className="h-4 w-4 text-primary" />
                <div>
                  <div className="font-medium">AI Scene Analysis</div>
                  <div className="text-xs text-muted-foreground">Analyze beats and tone</div>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/create-project" className="flex items-center gap-3 w-full cursor-pointer p-3">
                <Plus className="h-4 w-4 text-primary" />
                <div>
                  <div className="font-medium">Create Project</div>
                  <div className="text-xs text-muted-foreground">Start new casting call</div>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/create-festival" className="flex items-center gap-3 w-full cursor-pointer p-3">
                <Trophy className="h-4 w-4 text-primary" />
                <div>
                  <div className="font-medium">Create Festival</div>
                  <div className="text-xs text-muted-foreground">Set up festival listing</div>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Resources Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            Resources
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-background border shadow-lg">
          <DropdownMenuItem asChild>
            <Link to="/festivals" className="flex items-center gap-3 w-full cursor-pointer p-3">
              <Trophy className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">Film Festivals</div>
                <div className="text-xs text-muted-foreground">Find and submit to festivals</div>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/library" className="flex items-center gap-3 w-full cursor-pointer p-3">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">Document Library</div>
                <div className="text-xs text-muted-foreground">Templates and forms</div>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/consulting" className="flex items-center gap-3 w-full cursor-pointer p-3">
              <MessageCircle className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">Consulting</div>
                <div className="text-xs text-muted-foreground">Expert guidance</div>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/training" className="flex items-center gap-3 w-full cursor-pointer p-3">
              <GraduationCap className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">Training Academy</div>
                <div className="text-xs text-muted-foreground">Courses & certifications</div>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Profile Dropdown (only show if logged in) */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              Profile
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg">
            <div className="px-3 py-2 border-b">
              <div className="text-sm font-medium">{userProfile?.full_name || 'User'}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="flex items-center gap-3 w-full cursor-pointer p-3 text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Auth Button (only show if not logged in) */}
      {!user && (
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/auth">
            Create your account<span className="mx-2">|</span>Sign up
          </Link>
        </Button>
      )}
    </nav>
  );
};