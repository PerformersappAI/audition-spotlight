import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import fgLogo from "@/assets/filmmaker-genius-logo.png";

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const TEAL = '#00d4aa';
const TEAL_HOVER = '#00f0c0';
const VIOLET = '#a855f7';
const VIOLET_HOVER = '#c084fc';

export const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const { credits } = useCredits();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show layout on auth pages, homepage, or toolbox (these have their own nav)
  const hideLayout =
    location.pathname === '/auth' ||
    location.pathname === '/admin-login' ||
    location.pathname === '/toolbox';

  if (hideLayout) {
    return <>{children}</>;
  }

  const navLinkClass =
    "text-[15px] font-medium text-white/65 hover:text-white transition-colors";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header
        className="sticky top-0 backdrop-blur-[12px] border-b"
        style={{
          zIndex: 100,
          height: 96,
          background: 'rgba(0,0,0,0.85)',
          borderBottomColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="container mx-auto px-4 h-full grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center shrink-0 justify-self-start">
            <img src={fgLogo} alt="Filmmaker Genius" className="h-20 w-auto rounded-md" />
          </Link>

          {/* CENTER: Nav (desktop) */}
          <nav className="hidden min-[600px]:flex items-center gap-8 justify-self-center">
            <Link to="/toolbox" className={navLinkClass}>Toolbox</Link>
            <Link to="/academy" className={navLinkClass}>Academy</Link>
            <Link to="/pricing" className={navLinkClass}>Pricing</Link>
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3 justify-self-end">
            {user ? (
              <>
                <Link to="/membership" className="hidden sm:block">
                  <Badge
                    variant="outline"
                    className="border-[#00d4aa]/40 text-[#00d4aa] hover:bg-[#00d4aa]/10 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    {credits?.available_credits || 0} Credits
                  </Badge>
                </Link>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-lg">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${TEAL}, ${VIOLET})` }}
                  >
                    <span className="text-sm font-semibold text-black">
                      {userProfile?.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block leading-tight">
                    <p className="text-sm font-medium text-white">
                      {userProfile?.first_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-white/50">{user.email}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden min-[600px]:flex items-center gap-5">
                <Link
                  to="/crew"
                  className="px-4 py-2 rounded-md text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: VIOLET }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = VIOLET_HOVER)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = VIOLET)}
                >
                  Crew Jobs
                </Link>
                <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.12)' }} />
                <Link to="/auth" className="text-sm font-medium text-white/75 hover:text-white transition-colors">
                  Sign In
                </Link>
                <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.12)' }} />
                <Link
                  to="/membership"
                  className="px-4 py-2 rounded-md text-sm font-semibold text-black transition-colors"
                  style={{ backgroundColor: TEAL }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = TEAL_HOVER)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="min-[600px]:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="min-[600px]:hidden border-t"
            style={{ background: 'rgba(0,0,0,0.95)', borderTopColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              <Link
                to="/toolbox"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-white/75 hover:text-white hover:bg-white/5"
              >
                Toolbox
              </Link>
              <Link
                to="/academy"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-white/75 hover:text-white hover:bg-white/5"
              >
                Academy
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-white/75 hover:text-white hover:bg-white/5"
              >
                Pricing
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white/75 hover:text-white hover:bg-white/5"
                >
                  Dashboard
                </Link>
              )}
              {!user && (
                <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
                  <Link
                    to="/crew"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-md text-sm font-semibold text-white text-center"
                    style={{ backgroundColor: VIOLET }}
                  >
                    Crew Jobs
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-md text-sm font-medium text-white/80 text-center border border-white/15"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/membership"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-md text-sm font-semibold text-black text-center"
                    style={{ backgroundColor: TEAL }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className="border-t mt-auto"
        style={{ background: '#080808', borderTopColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="container mx-auto px-4 py-10 flex flex-col items-center text-center">
          {/* Top: logo + wordmark, tagline below */}
          <div className="flex items-center gap-3">
            <img src={fgLogo} alt="Filmmaker Genius" className="h-12 w-auto rounded-md" />
            <div className="text-lg font-semibold text-white">Filmmaker Genius</div>
          </div>
          <div className="text-sm text-white/60 mt-1">Where Genius Meets the Silver Screen.</div>

          {/* Middle: centered links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
            {[
              { label: 'About', to: '/about' },
              { label: 'Contact', to: '/contact' },
              { label: 'Membership', to: '/membership' },
              { label: 'Academy', to: '/academy' },
              { label: 'FAQ', to: '/faq' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-white/65 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="my-6 h-px w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
            <div className="flex gap-6">
              <Link to="/privacy" className="text-xs text-white/55 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-white/55 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
            <div className="text-xs text-white/50">© 2026 Filmmaker Genius</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
