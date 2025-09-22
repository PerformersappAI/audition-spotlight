import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Clock, Film, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import filmStudioBg from "@/assets/film-studio-bg.jpg";
import astoriaLogo from "@/assets/astoria-film-festival-logo.jpeg";
import opprimeLogo from "@/assets/opprime-tv-logo.png";

const Index = () => {
  const [projects, setProjects] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicContent();
  }, []);

  const fetchPublicContent = async () => {
    // Create mock casting calls
    const mockProjects = [
      {
        id: 'mock-1',
        title: 'Indie Drama "Crossroads"',
        description: 'Seeking passionate actors for an emotional drama about family and redemption. Lead and supporting roles available.',
        project_type: 'Feature Film',
        location: 'Portland, OR',
        audition_date: '2024-10-15T10:00:00Z',
        profiles: { company_name: 'Northwest Productions' }
      },
      {
        id: 'mock-2',
        title: 'Comedy Short "Coffee Shop Chronicles"',
        description: 'Looking for comedic actors for a lighthearted short film about quirky coffee shop encounters.',
        project_type: 'Short Film',
        location: 'Seattle, WA',
        audition_date: '2024-10-20T14:00:00Z',
        profiles: { first_name: 'Sarah', last_name: 'Johnson' }
      }
    ];

    // Create mock festival with Astoria Film Festival
    const mockFestivals = [
      {
        id: 'astoria-festival',
        name: 'Astoria Film Festival',
        description: 'A celebration of independent cinema showcasing emerging filmmakers and groundbreaking stories.',
        location: 'Astoria, OR',
        start_date: '2024-11-15',
        end_date: '2024-11-17',
        submission_deadline: '2024-10-30',
        logo: astoriaLogo
      }
    ];

    setProjects(mockProjects);
    setFestivals(mockFestivals);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[85vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${filmStudioBg})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            FILMMAKERS
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Connect Filmmakers, Crew, Festivals, and Actors In One Powerful Platform
          </p>
          <div className="flex flex-col gap-6 justify-center items-center">
            {user && (
              <Button size="lg" onClick={() => navigate('/dashboard')} className="text-lg px-8 py-3 mb-4">
                Filmmakers
              </Button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <div className="flex flex-col items-center gap-2">
                <Button 
                  variant="burgundy" 
                  size="lg" 
                  onClick={() => navigate('/auth')} 
                  className="text-lg px-8 py-4 w-full"
                >
                  ACTORS
                </Button>
                <p className="text-white text-sm font-medium">GET YOUR AUDITIONS</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button 
                  variant="burgundy" 
                  size="lg" 
                  onClick={() => navigate('/auth')} 
                  className="text-lg px-8 py-4 w-full"
                >
                  CREW
                </Button>
                <p className="text-white text-sm font-medium">CREW JOBS</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button 
                  variant="burgundy" 
                  size="lg" 
                  onClick={() => navigate('/auth')} 
                  className="text-lg px-8 py-4 w-full"
                >
                  FILM FESTIVALS
                </Button>
                <p className="text-white text-sm font-medium">ATTACH YOUR FILM</p>
              </div>
            </div>
            
            {/* Opprime TV Logo */}
            <div className="mt-12 flex justify-center">
              <img 
                src={opprimeLogo} 
                alt="Opprime TV - Of the artist, by the artist, for the artist"
                className="h-16 md:h-20 object-contain opacity-90"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="relative -mt-32 pt-20 pb-16 bg-surface border-y border-border z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Our Mission</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="text-lg md:text-xl leading-relaxed mb-6">
                Cast is a <strong className="text-foreground">grassroots resource toolbox</strong> designed specifically for independent filmmakers, 
                content creators, and film festivals who are building their projects on passion, not massive budgets.
              </p>
              <p className="text-base md:text-lg leading-relaxed mb-6">
                We believe in empowering the <strong className="text-foreground">independent creative community</strong> — the storytellers who craft 
                compelling narratives in their spare time, the festival organizers who champion emerging voices, and the actors 
                who audition in coffee shops and community centers.
              </p>
              <div className="bg-background/50 p-6 rounded-lg border-l-4 border-primary">
                <p className="text-base leading-relaxed font-medium text-foreground">
                  <strong>This platform is NOT for:</strong> Large production companies, corporate commercials, or big-budget studios. 
                  This is for creators who need <em>real tools</em> to manage their day-to-day creating, building, and promoting 
                  of authentic, independent projects.
                </p>
              </div>
              <p className="text-base md:text-lg leading-relaxed mt-6">
                Whether you&apos;re organizing a local film festival, casting for your passion project, or building a portfolio 
                one audition at a time — Cast provides the tools and community to help you succeed without the corporate overhead.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">{projects.length}+</h3>
              <p className="text-muted-foreground">Active Projects</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">{festivals.length}+</h3>
              <p className="text-muted-foreground">Film Festivals</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">1000+</h3>
              <p className="text-muted-foreground">Community Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Casting Calls</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover exciting opportunities in film, television, and digital media
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {projects.slice(0, 2).map((project: any) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant="secondary">
                      <Film className="h-3 w-3 mr-1" />
                      {project.project_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  <div className="space-y-2 text-sm">
                    {project.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {project.location}
                      </div>
                    )}
                    {project.audition_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Audition: {formatDate(project.audition_date)}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      By {project.profiles?.company_name || `${project.profiles?.first_name} ${project.profiles?.last_name}`}
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active projects at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Featured Festivals */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Film Festivals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Submit your work to prestigious festivals and competitions
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            {festivals.slice(0, 1).map((festival: any) => (
              <Card key={festival.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={festival.logo} 
                        alt={`${festival.name} logo`}
                        className="w-12 h-12 object-contain rounded-full"
                      />
                      <CardTitle className="text-lg">{festival.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">
                      <Trophy className="h-3 w-3 mr-1" />
                      Festival
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{festival.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {festival.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(festival.start_date)}
                      {festival.end_date && ` - ${formatDate(festival.end_date)}`}
                    </div>
                    {festival.submission_deadline && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Deadline: {formatDate(festival.submission_deadline)}
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {festivals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active festivals at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of creators, filmmakers, and festival organizers building the future of entertainment
          </p>
          {!user && (
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Create Your Account Today
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-muted">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 Cast. Connecting the entertainment industry.{' '}
            <Link 
              to="/admin-login" 
              className="text-muted-foreground/70 hover:text-muted-foreground transition-colors text-sm"
              title="Admin Access"
            >
              Admin
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
