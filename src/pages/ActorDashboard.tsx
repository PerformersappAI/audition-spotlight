import { Layout } from "@/components/Layout";
import { RoleCard } from "@/components/RoleCard";
import { FilterChips } from "@/components/FilterChips";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockRoles = [
  {
    id: "1",
    name: "Lead Detective Sarah",
    description: "Strong-willed detective with a mysterious past. Must be comfortable with action sequences and emotional depth. Previous experience in crime dramas preferred.",
    auditionDate: "2024-09-25T14:00:00Z",
    states: ["CA", "NV"],
    contactMethod: "Email",
    project: "Dark Waters - Pilot Episode"
  },
  {
    id: "2", 
    name: "Young Entrepreneur",
    description: "Charismatic tech startup founder, age 25-35. Looking for someone who can portray intelligence and ambition while maintaining likability.",
    auditionDate: "2024-09-28T10:30:00Z",
    states: ["CA"],
    contactMethod: "Phone",
    project: "Silicon Dreams"
  },
  {
    id: "3",
    name: "Mysterious Stranger",
    description: "Enigmatic character who appears throughout the series. Must have a commanding presence and ability to convey secrets without words.",
    auditionDate: "2024-09-30T16:00:00Z",
    states: ["NY", "NJ"],
    contactMethod: "Email",
    project: "The Midnight Series"
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
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find Your Next <span className="bg-gradient-primary bg-clip-text text-transparent">Audition</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover exciting roles from top filmmakers and take your acting career to the next level.
            </p>
          </div>

          {/* Search and Filters */}
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
    </Layout>
  );
};