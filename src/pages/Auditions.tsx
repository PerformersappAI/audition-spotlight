import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Briefcase, DollarSign, Users, Filter } from "lucide-react";
import { format } from "date-fns";

interface AuditionNotice {
  id: string;
  project_name: string;
  project_type: string;
  union_status: string | null;
  role_name: string;
  role_description: string;
  age_range: string | null;
  gender_preference: string | null;
  ethnicity_requirement: string | null;
  work_type: string;
  rate_of_pay: string;
  location: string;
  submission_deadline: string;
  created_at: string;
  genre: string | null;
}

export default function Auditions() {
  const [auditions, setAuditions] = useState<AuditionNotice[]>([]);
  const [filteredAuditions, setFilteredAuditions] = useState<AuditionNotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  useEffect(() => {
    fetchAuditions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [auditions, searchTerm, filterType, filterLocation]);

  const fetchAuditions = async () => {
    try {
      const { data, error } = await supabase
        .from("audition_notices")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAuditions(data || []);
    } catch (error) {
      console.error("Error fetching auditions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...auditions];

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.role_description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((a) => a.project_type === filterType);
    }

    if (filterLocation !== "all") {
      filtered = filtered.filter((a) =>
        a.location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    setFilteredAuditions(filtered);
  };

  const uniqueTypes = Array.from(new Set(auditions.map((a) => a.project_type)));
  const uniqueLocations = Array.from(
    new Set(auditions.map((a) => a.location.split(",")[0].trim()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading auditions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Auditions</h1>
          <p className="text-muted-foreground">
            Browse and apply to current casting opportunities
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Auditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Search by project or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Project Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Project Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auditions List */}
        {filteredAuditions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No auditions found matching your criteria
              </p>
              <Button onClick={() => { setSearchTerm(""); setFilterType("all"); setFilterLocation("all"); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAuditions.map((audition) => (
              <Card key={audition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        {audition.role_name}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {audition.project_name}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant="secondary">{audition.project_type}</Badge>
                      {audition.union_status && (
                        <Badge variant="outline">{audition.union_status}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {audition.role_description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{audition.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{audition.work_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{audition.rate_of_pay}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Deadline: {format(new Date(audition.submission_deadline), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {audition.age_range && (
                      <Badge variant="outline">Age: {audition.age_range}</Badge>
                    )}
                    {audition.gender_preference && (
                      <Badge variant="outline">{audition.gender_preference}</Badge>
                    )}
                    {audition.ethnicity_requirement && (
                      <Badge variant="outline">{audition.ethnicity_requirement}</Badge>
                    )}
                    {audition.genre && (
                      <Badge variant="outline">{audition.genre}</Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Posted {format(new Date(audition.created_at), "MMM d, yyyy")}
                    </span>
                    <Link to={`/audition/${audition.id}`}>
                      <Button>View Full Breakdown</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
