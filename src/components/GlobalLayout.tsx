import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Menu, X, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { TopNavigation } from './TopNavigation';
import { useState } from 'react';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const { credits } = useCredits();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show layout on auth pages or homepage for non-logged-in users
  const hideLayout = location.pathname === '/auth' || location.pathname === '/admin-login' || (!user && location.pathname === '/');

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link to={user ? '/toolbox' : '/'} className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-gold to-gold-light p-2 rounded-lg">
                  <Film className="h-6 w-6 text-gold-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">MyFilmmakerAi</h1>
                  <p className="text-sm text-muted-foreground">Filmmaker Platform</p>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="flex items-center space-x-4">
              <TopNavigation />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* User Profile */}
              {user && (
                <div className="flex items-center space-x-3">
                  {/* Credits Display */}
                  <Link to="/membership">
                    <Badge 
                      variant="outline" 
                      className="border-gold text-gold hover:bg-gold/10 transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      {credits?.available_credits || 0} Credits
                    </Badge>
                  </Link>

                  <Badge variant="outline" className="border-gold text-gold hidden sm:flex">
                    {userProfile?.role || 'USER'}
                  </Badge>
                  
                  <div className="flex items-center space-x-3 bg-accent/50 p-2 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gold to-gold-light flex items-center justify-center">
                      <span className="text-sm font-medium text-gold-foreground">
                        {userProfile?.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-foreground">
                        {userProfile?.first_name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Auth Buttons for Non-logged-in Users */}
              {!user && (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button variant="gold" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/toolbox"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Toolbox
                </Link>
                <Link
                  to="/applications"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Applications
                </Link>
                <Link
                  to="/festivals"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Festivals
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 MyFilmmakerAi. Connecting the entertainment industry.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};