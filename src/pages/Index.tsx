import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Clock, Film, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import moviePosterBg from "@/assets/movie-poster-collage-bg.jpg";

const Index = () => {
  const [projects, setProjects] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicContent();
  }, []);

  const fetchPublicContent = async () => {
    try {
      // Fetch active projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*, profiles!inner(first_name, last_name, company_name)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      // Fetch active festivals
      const { data: festivalsData } = await supabase
        .from('film_festivals')
        .select('*, profiles!inner(first_name, last_name, company_name)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      setProjects(projectsData || []);
      setFestivals(festivalsData || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${moviePosterBg})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Cast
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Connect filmmakers, actors, and festival organizers in one powerful platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button size="lg" onClick={() => navigate('/dashboard')} className="text-lg px-8 py-3">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Sign Up / Sign In
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-black">
                  Join the Community
                </Button>
              </>
            )}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project: any) => (
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivals.slice(0, 6).map((festival: any) => (
              <Card key={festival.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{festival.name}</CardTitle>
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
            © 2024 Cast. Connecting the entertainment industry.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
