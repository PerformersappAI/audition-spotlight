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
      {/* Home */}
      <Link
        to="/"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          location.pathname === '/' 
            ? 'bg-gold/10 text-gold' 
            : 'text-foreground hover:text-gold'
        }`}
      >
        Home
      </Link>

      {/* Membership */}
      <Link
        to="/membership"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          location.pathname === '/membership' 
            ? 'bg-gold/10 text-gold' 
            : 'text-foreground hover:text-gold'
        }`}
      >
        Membership
      </Link>

      {/* Contact */}
      <Link
        to="/consulting"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          location.pathname === '/consulting' 
            ? 'bg-gold/10 text-gold' 
            : 'text-foreground hover:text-gold'
        }`}
      >
        Contact
      </Link>

      {/* About Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium hover:text-gold">
            About
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 bg-background border shadow-lg z-50">
          <DropdownMenuItem asChild>
            <Link to="/festivals" className="flex items-center gap-3 w-full cursor-pointer p-3">
              <Trophy className="h-4 w-4" />
              <span>Film Festivals</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/library" className="flex items-center gap-3 w-full cursor-pointer p-3">
              <FileText className="h-4 w-4" />
              <span>Document Library</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/training" className="flex items-center gap-3 w-full cursor-pointer p-3">
              <GraduationCap className="h-4 w-4" />
              <span>Training Academy</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Toolbox */}
      <Link
        to="/toolbox"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          location.pathname === '/toolbox' 
            ? 'bg-gold/10 text-gold' 
            : 'text-foreground hover:text-gold'
        }`}
      >
        Toolbox
      </Link>

      {/* Admin Dropdown (only for admins) */}
      {userProfile?.role === 'ADMIN' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium hover:text-gold">
              Admin
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-background border shadow-lg z-50">
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center gap-3 w-full cursor-pointer p-3">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/users" className="flex items-center gap-3 w-full cursor-pointer p-3">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/projects" className="flex items-center gap-3 w-full cursor-pointer p-3">
                <Film className="h-4 w-4" />
                <span>Projects</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/festivals" className="flex items-center gap-3 w-full cursor-pointer p-3">
                <Trophy className="h-4 w-4" />
                <span>Festivals</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Help */}
      <Button variant="ghost" className="text-sm font-medium hover:text-gold" asChild>
        <Link to="/consulting">Help</Link>
      </Button>

      {/* User Profile (only show if logged in) */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg z-50">
            <div className="px-3 py-2 border-b">
              <div className="text-sm font-medium">{userProfile?.full_name || 'User'}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <DropdownMenuItem asChild>
              <Link to="/dashboard" className="flex items-center gap-3 w-full cursor-pointer p-3">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/training/my-learning" className="flex items-center gap-3 w-full cursor-pointer p-3">
                <GraduationCap className="h-4 w-4" />
                <span>My Learning</span>
              </Link>
            </DropdownMenuItem>
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
        <Button asChild className="bg-gold text-foreground hover:bg-gold/90">
          <Link to="/auth">Sign In</Link>
        </Button>
      )}
    </nav>
  );
};