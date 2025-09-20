import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Users, Calendar, Settings } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'ACTOR' | 'FILMMAKER';
}

export const Layout = ({ children, userRole = 'ACTOR' }: LayoutProps) => {
  const [currentUser] = useState({
    name: "Sarah Chen",
    role: userRole,
    email: "sarah@example.com"
  });

  const navigation = userRole === 'FILMMAKER' ? [
    { name: 'Dashboard', href: '/filmmaker', icon: Film },
    { name: 'My Roles', href: '/filmmaker/roles', icon: Users },
    { name: 'Calendar', href: '/filmmaker/calendar', icon: Calendar },
  ] : [
    { name: 'Find Auditions', href: '/', icon: Film },
    { name: 'My Applications', href: '/applications', icon: Users },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-2 rounded-lg shadow-glow">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CastPro</h1>
                <p className="text-sm text-muted-foreground">Professional Audition Platform</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Button key={item.name} variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-primary text-primary">
                {currentUser.role}
              </Badge>
              <Card className="p-3 bg-surface border-border">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface/50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 CastPro. Professional casting made simple.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};