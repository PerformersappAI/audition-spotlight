import { useState } from "react";
import { Search, BookOpen, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Distribution Models
  { term: "VOD", definition: "Video on Demand - Content available for viewers to watch whenever they choose, rather than at a scheduled broadcast time.", category: "Distribution Models" },
  { term: "SVOD", definition: "Subscription Video on Demand - Viewers pay a recurring fee for unlimited access to a library of content (e.g., Netflix, Hulu, Disney+).", category: "Distribution Models" },
  { term: "TVOD", definition: "Transactional Video on Demand - Viewers pay per title to rent or buy content (e.g., iTunes, Amazon Prime Video rentals).", category: "Distribution Models" },
  { term: "AVOD", definition: "Advertising Video on Demand - Free content supported by advertisements (e.g., Tubi, Pluto TV free tiers).", category: "Distribution Models" },
  { term: "FAST", definition: "Free Ad-Supported Streaming TV - Linear streaming channels with scheduled programming, supported by ads (e.g., Pluto TV channels, Roku Channel).", category: "Distribution Models" },
  { term: "Theatrical", definition: "Traditional cinema/movie theater distribution where films are shown on the big screen before other release windows.", category: "Distribution Models" },
  
  // Technical Terms
  { term: "ProRes", definition: "Apple's professional video codec known for high quality and efficient editing. Common formats include ProRes 422, ProRes 422 HQ, and ProRes 4444.", category: "Technical" },
  { term: "DNxHR", definition: "Avid's professional video codec, similar to ProRes. Used widely in post-production for high-quality intermediate files.", category: "Technical" },
  { term: "IMF", definition: "Interoperable Master Format - A standardized file format for delivering master content to multiple platforms. Preferred by Netflix and other major streamers.", category: "Technical" },
  { term: "M&E Track", definition: "Music & Effects Track - An audio mix containing only music and sound effects, without dialogue. Essential for international dubbing.", category: "Technical" },
  { term: "Textless Elements", definition: "Clean versions of shots containing on-screen text (titles, credits, graphics) without the text. Needed for foreign language versions.", category: "Technical" },
  { term: "QC", definition: "Quality Control - Technical review process to ensure video and audio meet platform specifications. Checks for issues like audio sync, color, and encoding errors.", category: "Technical" },
  { term: "Captions/CC", definition: "Closed Captions - Text overlay of dialogue and sound descriptions that can be turned on/off. Required for accessibility compliance.", category: "Technical" },
  { term: "SDH", definition: "Subtitles for the Deaf and Hard of Hearing - Similar to closed captions but formatted as subtitles. Includes speaker identification and sound descriptions.", category: "Technical" },
  { term: "Master", definition: "The final, highest-quality version of your film from which all distribution copies are made. Also called the 'delivery master.'", category: "Technical" },
  { term: "Mezzanine", definition: "A high-quality intermediate file format used for transcoding to various delivery formats. Lower than master quality but still broadcast-grade.", category: "Technical" },
  { term: "Frame Rate", definition: "The number of individual frames displayed per second. Common rates: 23.976fps (film), 24fps, 25fps (PAL), 29.97fps (NTSC), 30fps.", category: "Technical" },
  { term: "Resolution", definition: "The dimensions of the video image. HD (1920x1080), 4K/UHD (3840x2160), 2K (2048x1080).", category: "Technical" },
  { term: "Stereo 2.0", definition: "Standard two-channel audio (left and right). The minimum audio format required by most platforms.", category: "Technical" },
  { term: "5.1 Surround", definition: "Six-channel surround sound: front left, center, front right, rear left, rear right, and subwoofer (LFE). Standard for theatrical and premium streaming.", category: "Technical" },
  { term: "7.1 Surround", definition: "Eight-channel surround sound adding two additional side channels. Used for premium theatrical and home theater experiences.", category: "Technical" },
  { term: "Audio Stems", definition: "Separate audio tracks for dialogue, music, and effects that can be mixed independently. Useful for re-versioning and international releases.", category: "Technical" },
  
  // Legal Terms
  { term: "Chain of Title", definition: "Legal documentation proving ownership of all rights in a film, from original creation through current ownership. A deal-killer if incomplete.", category: "Legal" },
  { term: "E&O Insurance", definition: "Errors & Omissions Insurance - Protects against claims of copyright infringement, defamation, or rights violations. Required by most distributors.", category: "Legal" },
  { term: "Music Clearances", definition: "Legal permissions to use copyrighted music in your film. Includes sync rights (to use with picture) and master rights (to use specific recording).", category: "Legal" },
  { term: "Cue Sheet", definition: "A detailed log of all music used in a film, including title, composer, publisher, timing, and usage type. Required for royalty payments.", category: "Legal" },
  { term: "Talent Releases", definition: "Legal agreements granting permission to use a person's likeness in your film. Essential for all on-screen performers.", category: "Legal" },
  { term: "Location Releases", definition: "Legal agreements granting permission to film at and depict a specific location in your finished film.", category: "Legal" },
  { term: "Exclusive Rights", definition: "Granting a single distributor/platform the sole right to distribute your film in specified territories for a set period.", category: "Legal" },
  { term: "Non-Exclusive Rights", definition: "Allowing multiple distributors/platforms to distribute your film simultaneously. Offers flexibility but often lower advances.", category: "Legal" },
  
  // Business Terms
  { term: "Logline", definition: "A one or two-sentence summary of your film that captures the central conflict and hooks the reader. Essential for pitching.", category: "Business" },
  { term: "Synopsis", definition: "A summary of your film's plot. Short synopsis (1-2 paragraphs) for marketing; long synopsis (1-3 pages) for buyers.", category: "Business" },
  { term: "Comps", definition: "Comparable Titles - Successful films similar to yours in genre, tone, or audience. Used to demonstrate market potential (e.g., 'Jaws meets Alien').", category: "Business" },
  { term: "Key Art", definition: "The primary marketing image for your film, typically the poster design. Used across all promotional materials and platforms.", category: "Business" },
  { term: "Press Kit", definition: "A collection of promotional materials including synopsis, bios, stills, poster, trailer link, and press coverage. Also called EPK (Electronic Press Kit).", category: "Business" },
  { term: "Aggregator", definition: "A company that delivers content to multiple platforms on behalf of filmmakers. They handle encoding, metadata, and platform relationships for a fee.", category: "Business" },
  { term: "Distributor", definition: "A company that acquires rights to your film and handles marketing, sales, and delivery to platforms/theaters. May pay advances or work on revenue share.", category: "Business" },
  { term: "Sales Agent", definition: "Represents your film to distributors and buyers worldwide. Takes a commission on sales. Often works festivals and markets.", category: "Business" },
  { term: "Territories", definition: "Geographic regions where distribution rights are granted (e.g., North America, UK, Worldwide). Rights are often sold territory by territory.", category: "Business" },
  { term: "Term", definition: "The length of time a distribution agreement is in effect, typically measured in years (e.g., 7-year term, 10-year term).", category: "Business" },
  { term: "MG / Advance", definition: "Minimum Guarantee - An upfront payment from a distributor against future earnings. Recouped before you see additional revenue.", category: "Business" },
  { term: "Revenue Share", definition: "A distribution model where earnings are split between filmmaker and distributor/platform, often after expenses are recouped.", category: "Business" },
  
  // Roles
  { term: "DP", definition: "Director of Photography (also Cinematographer) - The head of the camera and lighting departments, responsible for the visual look of the film.", category: "Roles" },
];

export function DistributionGlossary() {
  const [isOpen, setIsOpen] = useState(true); // Start expanded for visibility
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = GLOSSARY_TERMS.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term));

  const groupedTerms = filteredTerms.reduce((acc, term) => {
    if (!acc[term.category]) {
      acc[term.category] = [];
    }
    acc[term.category].push(term);
    return acc;
  }, {} as Record<string, GlossaryTerm[]>);

  const categoryOrder = ["Distribution Models", "Technical", "Legal", "Business", "Roles"];

  return (
    <div className="bg-amber-500/5 border-2 border-amber-500/30 rounded-lg overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-amber-500/10 transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-foreground block">Distribution Terms</span>
              <span className="text-xs text-muted-foreground">40+ definitions</span>
            </div>
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`} 
          />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>
          
          <ScrollArea className="h-[400px] px-4 pb-4">
            {filteredTerms.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No matching terms found
              </p>
            ) : (
              <div className="space-y-4">
                {categoryOrder.map((category) => {
                  const terms = groupedTerms[category];
                  if (!terms || terms.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {category}
                      </h4>
                      <div className="space-y-3">
                        {terms.map((item) => (
                          <div 
                            key={item.term} 
                            className="bg-background/50 rounded-md p-3 border border-border/50"
                          >
                            <dt className="font-semibold text-primary text-sm">
                              {item.term}
                            </dt>
                            <dd className="text-muted-foreground text-sm mt-1 leading-relaxed">
                              {item.definition}
                            </dd>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
