import { Layout } from "@/components/Layout";
import { RoleCard } from "@/components/RoleCard";
import { FilterChips } from "@/components/FilterChips";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Zap, Play, Star, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import movieCollage from "@/assets/movie-poster-collage-bg.jpg";
import detectiveImg from "@/assets/detective-sarah.jpg";
import entrepreneurImg from "@/assets/entrepreneur.jpg";
import mysteriousImg from "@/assets/mysterious-stranger.jpg";

const mockRoles = [
  {
    id: "1",
    name: "Lead Detective Sarah",
    description: "Strong-willed detective with a mysterious past. Must be comfortable with action sequences and emotional depth. Previous experience in crime dramas preferred.",
    auditionDate: "2024-09-25T14:00:00Z",
    states: ["CA", "NV"],
    contactMethod: "Email",
    project: "Dark Waters - Pilot Episode",
    image: detectiveImg
  },
  {
    id: "2", 
    name: "Young Entrepreneur",
    description: "Charismatic tech startup founder, age 25-35. Looking for someone who can portray intelligence and ambition while maintaining likability.",
    auditionDate: "2024-09-28T10:30:00Z",
    states: ["CA"],
    contactMethod: "Phone",
    project: "Silicon Dreams",
    image: entrepreneurImg
  },
  {
    id: "3",
    name: "Mysterious Stranger",
    description: "Enigmatic character who appears throughout the series. Must have a commanding presence and ability to convey secrets without words.",
    auditionDate: "2024-09-30T16:00:00Z",
    states: ["NY", "NJ"],
    contactMethod: "Email",
    project: "The Midnight Series",
    image: mysteriousImg
  }
];

export const ActorDashboard = () => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleStateToggle = (state: string) => {
    setSelectedStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const handleClearAllStates = () => {
    setSelectedStates([]);
  };

  const handleSubmitToAll = () => {
    if (selectedStates.length === 0) {
      toast({
        title: "No states selected",
        description: "Please select at least one state to submit to all roles.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Mass submission successful!",
      description: `Applied to all open roles in ${selectedStates.join(', ')}. Check your applications page for updates.`,
    });
  };

  const filteredRoles = mockRoles.filter(role => {
    const matchesSearch = searchQuery === "" || 
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.project?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStates = selectedStates.length === 0 || 
      role.states.some(state => selectedStates.includes(state));
    
    return matchesSearch && matchesStates;
  });

  return (
    <Layout userRole="ACTOR">
      <div className="min-h-screen bg-background">
        {/* Hero Section with Film Background */}
        <div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${movieCollage})` }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-background/85 backdrop-blur-[1px]" />
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-16">
            {/* Large Title Section */}
            <div className="text-center mb-16 pt-16">
              <div className="mb-8">
                <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 drop-shadow-2xl tracking-wider">
                  CAST
                </h1>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 drop-shadow-lg">
                Find it! <span className="text-primary">Audition it!</span> Book it!
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed drop-shadow-sm">
                Transform your acting career with professional audition opportunities — from indie films to major productions — giving you the platform and connections to book your next role.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold px-8 py-4 text-lg shadow-dramatic hover:shadow-glow">
                <Search className="h-5 w-5 mr-2" />
                Browse Auditions
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 text-foreground font-bold px-8 py-4 text-lg bg-surface/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground">
                <Play className="h-5 w-5 mr-2" />
                Self Tape Tools
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 text-foreground font-bold px-8 py-4 text-lg bg-surface/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground">
                <Star className="h-5 w-5 mr-2" />
                Actor Resources
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <Card className="bg-surface/90 backdrop-blur-sm border-border/50 shadow-dramatic">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Connect with Filmmakers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Access exclusive casting calls from verified directors</p>
                  <p>• Direct communication with casting directors</p>
                  <p>• Build relationships within the industry</p>
                  <p>• Get personalized feedback on submissions</p>
                </CardContent>
              </Card>

              <Card className="bg-surface/90 backdrop-blur-sm border-border/50 shadow-dramatic">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Smart Audition Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Filter by location, genre, and role type</p>
                  <p>• Track application status in real-time</p>
                  <p>• Calendar integration for audition scheduling</p>
                  <p>• Never miss an opportunity with notifications</p>
                </CardContent>
              </Card>

              <Card className="bg-surface/90 backdrop-blur-sm border-border/50 shadow-dramatic">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Professional Growth
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Industry-standard submission materials</p>
                  <p>• Performance analytics and insights</p>
                  <p>• Career progression tracking</p>
                  <p>• Access to premium casting opportunities</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4">
            <Card className="bg-surface/80 backdrop-blur-sm border-border shadow-surface mb-8">
              <CardHeader>
                <CardTitle className="text-foreground">Search Auditions</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Use filters to find roles that match your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles, projects, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border focus:border-primary"
                  />
                </div>

                {/* State Filter */}
                <FilterChips
                  states={[]}
                  selectedStates={selectedStates}
                  onStateToggle={handleStateToggle}
                  onClearAll={handleClearAllStates}
                />

                {/* Mass Submit Button */}
                {selectedStates.length > 0 && (
                  <div className="flex justify-center pt-4 border-t border-border/50">
                    <Button
                      onClick={handleSubmitToAll}
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      size="lg"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Submit to All Roles in {selectedStates.length} State{selectedStates.length > 1 ? 's' : ''}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Available Auditions
                </h2>
                <p className="text-muted-foreground">
                  {filteredRoles.length} role{filteredRoles.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRoles.map((role) => (
                <RoleCard key={role.id} role={role} variant="actor" />
              ))}
            </div>

            {filteredRoles.length === 0 && (
              <Card className="bg-surface border-border text-center py-12">
                <CardContent>
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No auditions found</h3>
                    <p>Try adjusting your search criteria or selected states.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};