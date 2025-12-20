import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, ExternalLink, Calendar, Trophy, Loader2 } from "lucide-react";

interface Festival {
  id: string;
  name: string;
  location: string;
  dates: string;
  deadline: string;
  website: string;
  categories: string[];
  distance: string;
}

export default function FestivalFinder() {
  const [zipCode, setZipCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!zipCode.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulated search - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock festival data based on ZIP code
    const mockFestivals: Festival[] = [
      {
        id: "1",
        name: "Sundance Film Festival",
        location: "Park City, Utah",
        dates: "January 18-28, 2025",
        deadline: "September 15, 2024",
        website: "https://www.sundance.org",
        categories: ["Feature", "Documentary", "Short"],
        distance: "45 miles"
      },
      {
        id: "2",
        name: "Tribeca Film Festival",
        location: "New York, NY",
        dates: "June 4-15, 2025",
        deadline: "December 1, 2024",
        website: "https://www.tribecafilm.com",
        categories: ["Feature", "Documentary", "Short", "Episodic"],
        distance: "12 miles"
      },
      {
        id: "3",
        name: "South by Southwest (SXSW)",
        location: "Austin, Texas",
        dates: "March 7-15, 2025",
        deadline: "October 15, 2024",
        website: "https://www.sxsw.com",
        categories: ["Feature", "Documentary", "Short", "Music Video"],
        distance: "78 miles"
      },
      {
        id: "4",
        name: "Los Angeles Film Festival",
        location: "Los Angeles, CA",
        dates: "September 20-28, 2025",
        deadline: "June 1, 2025",
        website: "https://www.lafilmfestival.com",
        categories: ["Feature", "Short", "Documentary"],
        distance: "25 miles"
      },
      {
        id: "5",
        name: "Toronto International Film Festival",
        location: "Toronto, Canada",
        dates: "September 4-14, 2025",
        deadline: "May 15, 2025",
        website: "https://www.tiff.net",
        categories: ["Feature", "Documentary"],
        distance: "120 miles"
      }
    ];
    
    setFestivals(mockFestivals);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Film Festivals in Your Area
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find Film Festivals in and around your area to attend or submit your Film. 
            Enter your ZIP code and we'll give you a list.
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search by ZIP Code
            </CardTitle>
            <CardDescription>
              Enter your ZIP code to find festivals near you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="zipCode" className="sr-only">ZIP Code</Label>
                <Input
                  id="zipCode"
                  type="text"
                  placeholder="Enter your ZIP code (e.g., 90210)"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  maxLength={10}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching || !zipCode.trim()}>
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              {festivals.length > 0 
                ? `Found ${festivals.length} Festivals Near ZIP ${zipCode}`
                : "No Festivals Found"
              }
            </h2>

            {festivals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {festivals.map((festival) => (
                  <Card key={festival.id} className="group hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Trophy className="h-8 w-8 text-primary" />
                        <Badge variant="secondary">{festival.distance}</Badge>
                      </div>
                      <CardTitle className="text-xl">{festival.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {festival.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{festival.dates}</span>
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium text-foreground">Deadline:</span> {festival.deadline}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {festival.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>

                      <a
                        href={festival.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button 
                          variant="default" 
                          className="w-full justify-between"
                        >
                          Visit Website
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No festivals found for ZIP code {zipCode}. Try a different location.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
