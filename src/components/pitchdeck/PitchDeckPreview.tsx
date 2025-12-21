import { Badge } from "@/components/ui/badge";
import { Film, Users, Eye, DollarSign, Calendar, MapPin, Mail, Phone, Globe } from "lucide-react";
import type { PitchDeckData } from "@/pages/PitchDeckMaker";

interface PitchDeckPreviewProps {
  data: PitchDeckData;
}

const projectTypeLabels: Record<string, string> = {
  feature: "Feature Film",
  short: "Short Film",
  tv_series: "TV Series",
  documentary: "Documentary",
  web_series: "Web Series",
};

const budgetLabels: Record<string, string> = {
  micro: "Micro Budget (<$50K)",
  low: "Low Budget ($50K - $500K)",
  mid: "Mid Budget ($500K - $5M)",
  high: "High Budget ($5M+)",
};

const PitchDeckPreview = ({ data }: PitchDeckPreviewProps) => {
  return (
    <div className="p-6 space-y-8 bg-gradient-to-b from-background to-muted/20">
      {/* Cover Page */}
      <div className="text-center py-12 border-b border-amber-500/20">
        <div className="inline-flex items-center gap-2 mb-4">
          <Film className="h-8 w-8 text-amber-500" />
          <span className="text-amber-500 text-sm font-medium uppercase tracking-wider">
            Pitch Deck
          </span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          {data.projectTitle || "Your Project Title"}
        </h1>
        
        {data.projectType && (
          <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-400">
            {projectTypeLabels[data.projectType]}
          </Badge>
        )}

        {data.genre.length > 0 && (
          <div className="flex justify-center gap-2 flex-wrap mb-6">
            {data.genre.map((g) => (
              <Badge key={g} className="bg-amber-500/20 text-amber-300">
                {g}
              </Badge>
            ))}
          </div>
        )}

        {data.logline && (
          <p className="text-xl italic text-muted-foreground max-w-2xl mx-auto">
            "{data.logline}"
          </p>
        )}

        {data.targetRating && (
          <div className="mt-4">
            <Badge variant="secondary">Rated {data.targetRating}</Badge>
          </div>
        )}
      </div>

      {/* Synopsis Section */}
      {(data.synopsis || data.directorVision) && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
            <Film className="h-6 w-6" />
            The Story
          </h2>
          
          {data.synopsis && (
            <div className="bg-card/50 rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-2">Synopsis</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{data.synopsis}</p>
            </div>
          )}

          {data.directorVision && (
            <div className="bg-card/50 rounded-lg p-4 border border-amber-500/20">
              <h3 className="font-semibold mb-2">Director's Vision</h3>
              <p className="text-muted-foreground italic">{data.directorVision}</p>
            </div>
          )}

          {data.toneMood && (
            <div>
              <span className="font-semibold">Tone: </span>
              <span className="text-muted-foreground">{data.toneMood}</span>
            </div>
          )}
        </section>
      )}

      {/* Characters Section */}
      {data.characters.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
            <Users className="h-6 w-6" />
            Characters
          </h2>
          
          <div className="grid gap-4">
            {data.characters.map((char, index) => (
              <div key={index} className="bg-card/50 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{char.name || "Unnamed Character"}</h3>
                  <Badge variant="outline" className="capitalize">
                    {char.role}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{char.description || "No description yet"}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Visual Style / Moodboard */}
      {(data.visualStyle || data.moodboardImages.length > 0) && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
            🎨 Visual Style
          </h2>
          
          {data.visualStyle && (
            <p className="text-muted-foreground">{data.visualStyle}</p>
          )}

          {data.moodboardImages.filter(Boolean).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.moodboardImages.filter(Boolean).map((img, index) => (
                <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`Moodboard ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Comparables */}
      {data.comparables.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
            🎯 Comparable Projects
          </h2>
          
          <div className="grid gap-3">
            {data.comparables.map((comp, index) => (
              <div key={index} className="bg-card/50 rounded-lg p-4 border border-border flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{comp.title}</h3>
                    {comp.year && <span className="text-muted-foreground">({comp.year})</span>}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{comp.whySimilar}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Target Audience */}
      {(data.primaryDemographic || data.marketAnalysis) && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
            <Eye className="h-6 w-6" />
            Target Audience
          </h2>
          
          {data.primaryDemographic && (
            <div>
              <span className="font-semibold">Primary: </span>
              <span className="text-muted-foreground">{data.primaryDemographic}</span>
            </div>
          )}

          {data.secondaryAudience && (
            <div>
              <span className="font-semibold">Secondary: </span>
              <span className="text-muted-foreground">{data.secondaryAudience}</span>
            </div>
          )}

          {data.marketAnalysis && (
            <div className="bg-card/50 rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-2">Market Analysis</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{data.marketAnalysis}</p>
            </div>
          )}
        </section>
      )}

      {/* Production Details */}
      {(data.budgetRange || data.shootingLocations || data.timeline) && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
            <DollarSign className="h-6 w-6" />
            Production
          </h2>
          
          <div className="grid gap-3 md:grid-cols-2">
            {data.budgetRange && (
              <div className="bg-card/50 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Budget</span>
                </div>
                <p className="font-semibold">{budgetLabels[data.budgetRange]}</p>
              </div>
            )}

            {data.shootingLocations && (
              <div className="bg-card/50 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Locations</span>
                </div>
                <p className="font-semibold">{data.shootingLocations}</p>
              </div>
            )}
          </div>

          {data.timeline && (
            <div className="bg-card/50 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Timeline</span>
              </div>
              <p className="whitespace-pre-wrap">{data.timeline}</p>
            </div>
          )}

          {data.unionStatus && (
            <Badge variant="outline">
              {data.unionStatus === "sag" ? "SAG-AFTRA" : data.unionStatus === "non_union" ? "Non-Union" : "TBD"}
            </Badge>
          )}
        </section>
      )}

      {/* Team */}
      {data.teamMembers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
            🎭 Key Team
          </h2>
          
          <div className="grid gap-3">
            {data.teamMembers.map((member, index) => (
              <div key={index} className="bg-card/50 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{member.name}</h3>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-amber-400">{member.role}</span>
                </div>
                <p className="text-muted-foreground text-sm">{member.credits}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Distribution */}
      {(data.targetPlatforms.length > 0 || data.distributionPlan) && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
            📺 Distribution
          </h2>
          
          {data.targetPlatforms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.targetPlatforms.map((platform) => (
                <Badge key={platform} variant="outline" className="border-amber-500/50">
                  {platform}
                </Badge>
              ))}
            </div>
          )}

          {data.marketingHighlights && (
            <div className="bg-card/50 rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-2">Marketing Highlights</h3>
              <p className="text-muted-foreground">{data.marketingHighlights}</p>
            </div>
          )}

          {data.distributionPlan && (
            <div className="bg-card/50 rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-2">Distribution Strategy</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{data.distributionPlan}</p>
            </div>
          )}
        </section>
      )}

      {/* Contact / CTA */}
      {(data.contactName || data.contactEmail || data.investmentAsk) && (
        <section className="space-y-4 border-t border-amber-500/20 pt-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-400">
            📞 Contact
          </h2>
          
          {data.investmentAsk && (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-6 border border-amber-500/20">
              <h3 className="font-semibold mb-2 text-lg">What We're Seeking</h3>
              <p className="text-muted-foreground">{data.investmentAsk}</p>
            </div>
          )}

          <div className="bg-card/50 rounded-lg p-6 border border-border">
            {data.contactName && (
              <p className="font-bold text-xl mb-4">{data.contactName}</p>
            )}
            
            <div className="space-y-2">
              {data.contactEmail && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{data.contactEmail}</span>
                </div>
              )}
              
              {data.contactPhone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{data.contactPhone}</span>
                </div>
              )}
              
              {data.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{data.website}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!data.projectTitle && !data.logline && !data.synopsis && data.characters.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Film className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p>Start filling out your pitch deck to see the preview here</p>
        </div>
      )}
    </div>
  );
};

export default PitchDeckPreview;
