import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Search, MapPin, Calendar, DollarSign, ExternalLink, Star, TrendingUp, Target, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Festival {
  id: string;
  name: string;
  location: string;
  start_date: string;
  end_date?: string;
  submission_deadline?: string;
  early_deadline?: string;
  late_deadline?: string;
  website?: string;
  submission_url?: string;
  filmfreeway_url?: string;
  submission_fee?: string;
  entry_fees_range?: string;
  categories?: string[];
  genres?: string[];
  status: string;
  festival_tier?: string;
  description: string;
  organizer?: {
    name: string;
    email: string;
  };
}

export default function Festivals() {
  const { user } = useAuth();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('film_festivals')
        .select(`
          id,
          name,
          location,
          start_date,
          end_date,
          submission_deadline,
          early_deadline,
          late_deadline,
          website,
          submission_url,
          filmfreeway_url,
          submission_fee,
          entry_fees_range,
          categories,
          genres,
          status,
          festival_tier,
          description,
          contact_email
        `)
        .eq('status', 'active')
        .order('festival_tier', { ascending: true })
        .order('submission_deadline', { ascending: true });

      if (error) throw error;

      const formattedFestivals = data?.map(festival => ({
        ...festival,
        organizer: {
          name: 'Festival Organizer',
          email: festival.contact_email || ''
        }
      })) || [];

      setFestivals(formattedFestivals);
    } catch (error) {
      console.error('Error fetching festivals:', error);
      toast.error('Failed to load festivals');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const isSubmissionOpen = (deadlineString?: string) => {
    if (!deadlineString) return false;
    return new Date(deadlineString) > new Date();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 1': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
      case 'Tier 2': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-gray-900';
      case 'Regional': return 'bg-gradient-to-r from-green-400 to-green-600 text-green-900';
      case 'Genre': return 'bg-gradient-to-r from-purple-400 to-purple-600 text-purple-900';
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600 text-blue-900';
    }
  };

  const getStatusColor = (festival: Festival) => {
    if (!isSubmissionOpen(festival.submission_deadline)) return 'destructive';
    if (festival.early_deadline && isSubmissionOpen(festival.early_deadline)) return 'default';
    return 'secondary';
  };

  const filteredFestivals = festivals.filter(festival => {
    const matchesSearch = festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         festival.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         festival.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || festival.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesStatus = !statusFilter || 
      (statusFilter === 'open' && isSubmissionOpen(festival.submission_deadline)) ||
      (statusFilter === 'upcoming' && isUpcoming(festival.start_date)) ||
      (statusFilter === 'early' && festival.early_deadline && isSubmissionOpen(festival.early_deadline));
    
    const matchesTier = !tierFilter || festival.festival_tier === tierFilter;
    const matchesGenre = !genreFilter || (festival.genres && festival.genres.includes(genreFilter));

    return matchesSearch && matchesLocation && matchesStatus && matchesTier && matchesGenre;
  });

  const getUniqueLocations = () => {
    return [...new Set(festivals.map(f => f.location))].sort();
  };

  const getUniqueTiers = () => {
    return [...new Set(festivals.map(f => f.festival_tier).filter(Boolean))].sort();
  };

  const getUniqueGenres = () => {
    const allGenres = festivals.flatMap(f => f.genres || []);
    return [...new Set(allGenres)].sort();
  };

  const handleSubmit = (festival: Festival) => {
    const submissionUrl = festival.filmfreeway_url || festival.submission_url || festival.website;
    if (submissionUrl) {
      window.open(submissionUrl, '_blank');
      toast.success(`Opening submission page for ${festival.name}`);
    } else {
      toast.error('No submission URL available for this festival');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading festival database...</p>
        </div>
      </div>
    );
  }

  const statsData = {
    total: festivals.length,
    active: festivals.filter(f => f.status === 'active').length,
    upcoming: festivals.filter(f => isUpcoming(f.start_date)).length,
    submissionsOpen: festivals.filter(f => isSubmissionOpen(f.submission_deadline)).length,
    tier1: festivals.filter(f => f.festival_tier === 'Tier 1').length,
    tier2: festivals.filter(f => f.festival_tier === 'Tier 2').length
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Festival Browser & Submitter
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Discover 2,000+ film festivals worldwide with AI-powered matching and direct submission links
          </p>
          
          {user?.user_metadata?.role === 'film_festival' && (
            <Button asChild>
              <Link to="/create-festival">
                <Plus className="mr-2 h-4 w-4" />
                Create Festival
              </Link>
            </Button>
          )}
        </div>

        {/* AI Matching Banner */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              AI-Powered Festival Matching
            </CardTitle>
            <CardDescription>
              Get personalized festival recommendations based on your film's genre, budget, and goals. 
              Our intelligent system analyzes acceptance rates, prestige, and submission strategies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Success Rate Analysis
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Prestige Scoring
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Cost Optimization
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{statsData.total}</div>
              <p className="text-sm text-muted-foreground">Total Festivals</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{statsData.submissionsOpen}</div>
              <p className="text-sm text-muted-foreground">Open Now</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{statsData.upcoming}</div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{statsData.tier1}</div>
              <p className="text-sm text-muted-foreground">Tier 1</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-600">{statsData.tier2}</div>
              <p className="text-sm text-muted-foreground">Tier 2</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{festivals.filter(f => f.festival_tier === 'Regional').length}</div>
              <p className="text-sm text-muted-foreground">Regional</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter & Search Festivals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="xl:col-span-2">
                <Input
                  placeholder="Search festivals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Location</SelectItem>
                  {getUniqueLocations().map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Tier</SelectItem>
                  {getUniqueTiers().map(tier => (
                    <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Genre</SelectItem>
                  {getUniqueGenres().map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Status</SelectItem>
                  <SelectItem value="open">Submissions Open</SelectItem>
                  <SelectItem value="early">Early Bird</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Festivals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFestivals.map((festival) => (
            <Card key={festival.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">{festival.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {festival.location}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getTierColor(festival.festival_tier || 'Regional')}>
                      {festival.festival_tier || 'Regional'}
                    </Badge>
                    <Badge variant={getStatusColor(festival)}>
                      {isSubmissionOpen(festival.submission_deadline) ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                </div>
                
                <CardDescription className="line-clamp-3">
                  {festival.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Dates */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span className="font-medium">Festival:</span>
                      <span>{formatDate(festival.start_date)}</span>
                      {festival.end_date && <span>- {formatDate(festival.end_date)}</span>}
                    </div>
                    {festival.submission_deadline && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">Deadline:</span>
                        <span className={isSubmissionOpen(festival.submission_deadline) ? 'text-green-600' : 'text-red-600'}>
                          {formatDate(festival.submission_deadline)}
                        </span>
                      </div>
                    )}
                    {festival.early_deadline && isSubmissionOpen(festival.early_deadline) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">Early Bird:</span>
                        <span className="text-yellow-600">{formatDate(festival.early_deadline)}</span>
                      </div>
                    )}
                  </div>

                  {/* Fees */}
                  {festival.entry_fees_range && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-medium">Entry Fees:</span>
                      <span>{festival.entry_fees_range}</span>
                    </div>
                  )}

                  {/* Genres */}
                  {festival.genres && festival.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {festival.genres.slice(0, 3).map(genre => (
                        <Badge key={genre} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                      {festival.genres.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{festival.genres.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSubmit(festival)}
                      className="flex-1"
                      disabled={!isSubmissionOpen(festival.submission_deadline)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {festival.filmfreeway_url ? 'Submit via FilmFreeway' : 'Submit Direct'}
                    </Button>
                    {festival.website && (
                      <Button variant="outline" asChild>
                        <a href={festival.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFestivals.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Festivals Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find more festivals.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}