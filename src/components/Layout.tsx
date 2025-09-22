import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Home, Film, Calendar, Users, Settings, ChevronDown, Upload, Brain, Plus, BarChart3, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'ACTOR' | 'FILMMAKER' | 'FILM_FESTIVAL' | 'ADMIN';
}

export const Layout = ({ children, userRole = 'ACTOR' }: LayoutProps) => {
  const location = useLocation();
  const [currentUser] = useState({
    name: "Sarah Chen",
    role: userRole,
    email: "sarah@example.com"
  });

  const navigation = userRole === 'FILMMAKER' ? [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Toolbox', href: '/toolbox', icon: Briefcase },
    { name: 'Projects', href: '/filmmaker', icon: Film },
    { name: 'Applications', href: '/applications', icon: Users },
  ] : userRole === 'FILM_FESTIVAL' ? [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Festivals', href: '/festivals', icon: Calendar },
    { name: 'Submissions', href: '/submissions', icon: Users },
  ] : userRole === 'ADMIN' ? [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'All Projects', href: '/admin/projects', icon: Film },
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
                  <h1 className="text-xl font-bold text-foreground">Cast</h1>
                  <p className="text-sm text-muted-foreground">Professional Casting Platform</p>
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="flex items-center gap-2 w-full cursor-pointer">
                          <BarChart3 className="h-4 w-4" />
                          Analytics
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/create-project" className="flex items-center gap-2 w-full cursor-pointer">
                          <Plus className="h-4 w-4" />
                          Create Project
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </nav>

              <Badge variant="outline" className="border-primary text-primary">
                {currentUser.role}
              </Badge>
              
              <div className="flex items-center space-x-3 bg-accent/50 p-2 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
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
            <p>&copy; 2024 Cast. Professional casting made simple.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};