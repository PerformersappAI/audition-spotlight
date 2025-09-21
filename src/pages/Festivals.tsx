import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Trophy, MapPin, Calendar, Globe, DollarSign, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";

interface Festival {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  submissionDeadline?: string;
  website?: string;
  submissionFee?: string;
  categories: string[];
  status: string;
  organizer: {
    firstName: string;
    lastName: string;
    companyName?: string;
  };
}

const Festivals = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      const { data, error } = await supabase
        .from('film_festivals')
        .select(`
          *,
          profiles(first_name, last_name, company_name)
        `)
        .order('start_date', { ascending: true });

      if (error) throw error;

      const formattedFestivals = data?.map(festival => ({
        id: festival.id,
        name: festival.name,
        description: festival.description,
        location: festival.location,
        startDate: festival.start_date,
        endDate: festival.end_date,
        submissionDeadline: festival.submission_deadline,
        website: festival.website,
        submissionFee: festival.submission_fee,
        categories: festival.categories || [],
        status: festival.status,
        organizer: {
          firstName: (festival.profiles as any)?.first_name || "Unknown",
          lastName: (festival.profiles as any)?.last_name || "User", 
          companyName: (festival.profiles as any)?.company_name || undefined
        }
      })) || [];

      setFestivals(formattedFestivals);
    } catch (error) {
      console.error('Error fetching festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const isSubmissionOpen = (deadlineString?: string) => {
    if (!deadlineString) return true;
    return new Date(deadlineString) > new Date();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "closed": return "bg-red-500";
      case "draft": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const filteredFestivals = festivals.filter(festival => {
    const matchesSearch = 
      festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || 
      festival.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || festival.status === statusFilter;

    return matchesSearch && matchesLocation && matchesStatus;
  });

  const getUniqueLocations = () => {
    const locations = festivals.map(f => f.location.split(',')[1]?.trim() || f.location)
      .filter((location, index, self) => self.indexOf(location) === index)
      .sort();
    return locations;
  };

  if (loading) {
    return (
      <Layout userRole={userProfile?.role?.toUpperCase()}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading festivals...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={userProfile?.role?.toUpperCase()}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Film Festivals</h1>
            <p className="text-muted-foreground">Discover and submit to film festivals worldwide</p>
          </div>
          {userProfile?.role === 'film_festival' && (
            <Button onClick={() => navigate('/create-festival')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Festival
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{festivals.length}</div>
              <p className="text-sm text-muted-foreground">Total Festivals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {festivals.filter(f => f.status === 'active').length}
              </div>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {festivals.filter(f => isUpcoming(f.startDate)).length}
              </div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {festivals.filter(f => f.submissionDeadline && isSubmissionOpen(f.submissionDeadline)).length}
              </div>
              <p className="text-sm text-muted-foreground">Open for Submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search festivals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {getUniqueLocations().map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Festivals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFestivals.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Festivals Found</h3>
                  <p className="text-muted-foreground">
                    {festivals.length === 0 
                      ? "No festivals are currently listed. Check back soon!" 
                      : "No festivals match your current filters."
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredFestivals.map((festival) => (
              <Card key={festival.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{festival.name}</CardTitle>
                    <Badge className={getStatusColor(festival.status)}>
                      {festival.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {festival.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {festival.location}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(festival.startDate)}
                      {festival.endDate && ` - ${formatDate(festival.endDate)}`}
                    </div>

                    {festival.submissionDeadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Deadline: {formatDate(festival.submissionDeadline)}
                        {isSubmissionOpen(festival.submissionDeadline) && (
                          <Badge variant="secondary" className="text-xs">Open</Badge>
                        )}
                      </div>
                    )}

                    {festival.submissionFee && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {festival.submissionFee}
                      </div>
                    )}

                    {festival.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={festival.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                        >
                          Festival Website
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {festival.organizer.companyName || 
                       `${festival.organizer.firstName} ${festival.organizer.lastName}`}
                    </div>
                  </div>

                  {festival.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {festival.categories.slice(0, 3).map(category => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      {festival.categories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{festival.categories.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      View Details
                    </Button>
                    {festival.status === 'active' && 
                     (!festival.submissionDeadline || isSubmissionOpen(festival.submissionDeadline)) && (
                      <Button className="flex-1" size="sm">
                        Submit Film
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Festivals;