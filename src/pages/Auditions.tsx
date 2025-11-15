import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  casting_director: string | null;
  audition_date: string | null;
}

export default function Auditions() {
  const [auditions, setAuditions] = useState<AuditionNotice[]>([]);
  const [filteredAuditions, setFilteredAuditions] = useState<AuditionNotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterUnion, setFilterUnion] = useState("all");
  const [filterGenre, setFilterGenre] = useState("all");
  const [showBackgroundOnly, setShowBackgroundOnly] = useState(false);
  const [showPayingOnly, setShowPayingOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchAuditions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [auditions, searchTerm, filterType, filterLocation, filterUnion, filterGenre, showBackgroundOnly, showPayingOnly]);

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
          a.role_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (a.casting_director && a.casting_director.toLowerCase().includes(searchTerm.toLowerCase()))
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

    if (filterUnion !== "all") {
      filtered = filtered.filter((a) => a.union_status === filterUnion);
    }

    if (filterGenre !== "all") {
      filtered = filtered.filter((a) => a.genre === filterGenre);
    }

    if (showBackgroundOnly) {
      filtered = filtered.filter((a) => 
        a.role_name.toLowerCase().includes("background") || 
        a.role_name.toLowerCase().includes("extra") ||
        a.role_description.toLowerCase().includes("background")
      );
    }

    if (showPayingOnly) {
      filtered = filtered.filter((a) => 
        a.rate_of_pay && 
        a.rate_of_pay !== "Unpaid" && 
        a.rate_of_pay !== "Deferred" &&
        !a.rate_of_pay.toLowerCase().includes("unpaid")
      );
    }

    setFilteredAuditions(filtered);
    setCurrentPage(1);
  };

  const uniqueTypes = Array.from(new Set(auditions.map((a) => a.project_type)));
  const uniqueLocations = Array.from(
    new Set(auditions.map((a) => a.location.split(",")[0].trim()))
  );
  const uniqueUnions = Array.from(
    new Set(auditions.map((a) => a.union_status).filter(Boolean))
  );
  const uniqueGenres = Array.from(
    new Set(auditions.map((a) => a.genre).filter(Boolean))
  );

  const totalPages = Math.ceil(filteredAuditions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAuditions = filteredAuditions.slice(startIndex, startIndex + itemsPerPage);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterLocation("all");
    setFilterUnion("all");
    setFilterGenre("all");
    setShowBackgroundOnly(false);
    setShowPayingOnly(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  };

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
          <h1 className="text-4xl font-bold mb-2">Audition Breakdowns</h1>
          <p className="text-muted-foreground">
            Find your next role from active casting calls
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="w-full">
                <Input
                  placeholder="Search by project title, role, or casting director..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Breakdowns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Breakdowns</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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

                <Select value={filterUnion} onValueChange={setFilterUnion}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Union Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Union Status</SelectItem>
                    {uniqueUnions.map((union) => (
                      <SelectItem key={union} value={union}>
                        {union}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterGenre} onValueChange={setFilterGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {uniqueGenres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Checkbox Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="background" 
                    checked={showBackgroundOnly}
                    onCheckedChange={(checked) => setShowBackgroundOnly(checked as boolean)}
                  />
                  <label htmlFor="background" className="text-sm cursor-pointer">
                    Show Background Roles Only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="paying" 
                    checked={showPayingOnly}
                    onCheckedChange={(checked) => setShowPayingOnly(checked as boolean)}
                  />
                  <label htmlFor="paying" className="text-sm cursor-pointer">
                    Show Paying Roles Only
                  </label>
                </div>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({filteredAuditions.length} total results)
          </p>
        </div>

        {/* Auditions Table */}
        {filteredAuditions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No auditions match your search criteria</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Casting Director</TableHead>
                    <TableHead className="w-24">Deadline</TableHead>
                    <TableHead className="w-32">Union</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAuditions.map((audition) => (
                    <TableRow key={audition.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="text-xs">
                        {formatDate(audition.audition_date || audition.created_at)}
                      </TableCell>
                      <TableCell>
                        <Link to={`/audition/${audition.id}`} className="text-primary hover:underline font-medium">
                          {audition.project_name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">{audition.role_name}</p>
                      </TableCell>
                      <TableCell className="text-sm">{audition.project_type}</TableCell>
                      <TableCell className="text-sm">{audition.casting_director || "N/A"}</TableCell>
                      <TableCell className="text-xs">
                        {formatDate(audition.submission_deadline)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {audition.union_status || "NON-UNION"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
