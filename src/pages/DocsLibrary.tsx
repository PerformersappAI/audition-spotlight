import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToolTopBar from "@/components/ToolTopBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Search, 
  Lock, 
  DollarSign, 
  Calendar, 
  Users, 
  UserCheck, 
  MapPin, 
  ClipboardList, 
  Calculator, 
  Music, 
  Film, 
  Truck, 
  Megaphone 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  size: string;
  premium: boolean;
  route?: string;
}

const documentBundles = [
  {
    id: "development_rights",
    name: "Development & Rights",
    shortLabel: "Development",
    icon: FileText,
    description: "Contracts for acquiring, developing, and protecting intellectual property",
    documents: [
      { id: "1", title: "Option / Purchase Agreement", description: "Acquire rights to a screenplay, book, or life story", category: "development_rights", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/option-purchase-agreement" },
      { id: "2", title: "Literary Rights Option Agreement", description: "Option literary material for a set period and price", category: "development_rights", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/literary-rights-option-agreement" },
      { id: "3", title: "Writer Agreement (Work-for-Hire)", description: "Hire a writer to create original material for the project", category: "development_rights", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/writer-agreement-work-for-hire" },
      { id: "4", title: "Life Rights Agreement", description: "Secure permission to portray a person's life story", category: "development_rights", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/life-rights-agreement" },
      { id: "5", title: "Collaboration Agreement", description: "Define ownership and duties between creative partners", category: "development_rights", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/collaboration-agreement" },
      { id: "6", title: "Certificate of Authorship", description: "Confirm chain of title and original authorship", category: "development_rights", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/certificate-of-authorship" },
      { id: "7", title: "Rights Assignment Agreement", description: "Transfer intellectual property rights to the production entity", category: "development_rights", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/rights-assignment-agreement" },
      { id: "8", title: "Shopping Agreement", description: "Allow a producer to shop a project to financiers or studios", category: "development_rights", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/shopping-agreement" },
      { id: "9", title: "Non-Disclosure Agreement (NDA)", description: "Protect confidential project information during development", category: "development_rights", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/non-disclosure-agreement" },
    ]
  },
  {
    id: "financing_business",
    name: "Financing & Business",
    shortLabel: "Financing",
    icon: DollarSign,
    description: "Entity formation, investment, and financial structure documents",
    documents: [
      { id: "10", title: "LLC Operating Agreement", description: "Govern the production company's ownership and operations", category: "financing_business", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/llc-operating-agreement" },
      { id: "11", title: "Investor Agreement (template)", description: "Outline investment terms, equity, and repayment expectations", category: "financing_business", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/investor-agreement" },
      { id: "12", title: "Financing Term Sheet", description: "Summarize key investment terms before drafting final documents", category: "financing_business", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/financing-term-sheet" },
      { id: "13", title: "Recoupment / Waterfall Schedule", description: "Map the order and priority of revenue distribution", category: "financing_business", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/recoupment-waterfall-schedule" },
      { id: "14", title: "Deferred Compensation Agreement", description: "Defer talent and crew payments until the project earns revenue", category: "financing_business", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/deferred-compensation-agreement" },
      { id: "15", title: "Executive Producer Agreement", description: "Define the role, credit, and compensation of an executive producer", category: "financing_business", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/executive-producer-agreement" },
      { id: "16", title: "Co-Production Agreement", description: "Set terms between two or more production companies", category: "financing_business", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/co-production-agreement" },
    ]
  },
  {
    id: "preproduction_scheduling",
    name: "Pre-Production & Scheduling",
    shortLabel: "Pre-Pro",
    icon: Calendar,
    description: "Breakdown, boards, schedules, and crew paperwork for prep",
    documents: [
      { id: "17", title: "Script Breakdown Sheet", description: "Identify every element required for each scene", category: "preproduction_scheduling", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/script-breakdown-sheet" },
      { id: "18", title: "Stripboard / Production Board", description: "Organize scenes into shooting strips by location and time", category: "preproduction_scheduling", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/stripboard-production-board" },
      { id: "19", title: "One-Line Schedule", description: "High-level overview of each shooting day and scene", category: "preproduction_scheduling", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/one-line-schedule" },
      { id: "20", title: "Shooting Schedule", description: "Detailed day-by-day shooting plan for the production", category: "preproduction_scheduling", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/shooting-schedule" },
      { id: "21", title: "Day Out of Days (DOOD)", description: "Track cast availability and work days across the schedule", category: "preproduction_scheduling", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/day-out-of-days" },
      { id: "22", title: "Shot List", description: "List every camera shot planned for each scene", category: "preproduction_scheduling", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/shot-list" },
      { id: "23", title: "Storyboard Template", description: "Frame-by-frame visual planning template with notes", category: "preproduction_scheduling", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/storyboard-template" },
      { id: "24", title: "Budget Top Sheet", description: "Summary of the production budget by category", category: "preproduction_scheduling", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/budget-top-sheet" },
      { id: "25", title: "Detailed Budget Template", description: "Line-item budget with account codes and fringes", category: "preproduction_scheduling", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/detailed-budget" },
      { id: "26", title: "Crew List / Contact Sheet", description: "Contact information and roles for all crew members", category: "preproduction_scheduling", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/crew-contact-list" },
    ]
  },
  {
    id: "cast_crew_deals",
    name: "Cast & Crew Deals",
    shortLabel: "Cast & Crew",
    icon: Users,
    description: "Engagement memos and agreements for key above- and below-the-line talent",
    documents: [
      { id: "27", title: "Cast Deal Memo", description: "Summarize terms for a cast member's engagement", category: "cast_crew_deals", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/cast-deal-memo" },
      { id: "28", title: "Crew Deal Memo", description: "Summarize terms for a crew member's engagement", category: "cast_crew_deals", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/crew-deal-memo" },
      { id: "29", title: "Director Agreement", description: "Define the director's services, compensation, and final cut", category: "cast_crew_deals", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/director-agreement" },
      { id: "30", title: "Producer Agreement", description: "Define the producer's duties, fees, and credit", category: "cast_crew_deals", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/producer-agreement" },
      { id: "31", title: "Cinematographer (DP) Agreement", description: "Engage the director of photography and specify camera package", category: "cast_crew_deals", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/cinematographer-agreement" },

      { id: "32", title: "Independent Contractor Agreement", description: "Classify a hire as an independent contractor for services", category: "cast_crew_deals", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/independent-contractor-agreement" },

      { id: "33", title: "Loan-Out Agreement (template)", description: "Engage a talent loaned out through a personal service company", category: "cast_crew_deals", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/loan-out-agreement" },

      { id: "34", title: "Kit / Box Rental Agreement", description: "Rent specialized equipment owned by a crew member", category: "cast_crew_deals", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/kit-box-rental-agreement" },
      { id: "35", title: "Intern / Volunteer Agreement", description: "Outline unpaid or low-paid intern duties and expectations", category: "cast_crew_deals", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/intern-volunteer-agreement" },
      { id: "36", title: "Parental / Guardian Consent (Minor)", description: "Consent and terms for employing a minor performer", category: "cast_crew_deals", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/parental-guardian-consent-minor" },
    ]
  },
  {
    id: "talent_releases",
    name: "Talent & Releases",
    shortLabel: "Talent",
    icon: UserCheck,
    description: "Appearance, depiction, and performance release forms for all participants",
    documents: [
      { id: "37", title: "Adult Talent Release", description: "Release of likeness, voice, and performance from an adult", category: "talent_releases", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/adult-talent-release" },
      { id: "38", title: "Background / Extra Release", description: "Release for background performers appearing on camera", category: "talent_releases", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/background-extra-release" },
      { id: "39", title: "Minor Talent Release (Parental)", description: "Parental release for a minor's likeness and performance", category: "talent_releases", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/minor-talent-release" },
      { id: "40", title: "Depiction / Appearance Release", description: "Release for recognizable individuals appearing on camera", category: "talent_releases", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/depiction-appearance-release" },
      { id: "41", title: "Personal Release", description: "General release for friends, family, or private individuals", category: "talent_releases", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/personal-release" },
      { id: "42", title: "Interview / Subject Release", description: "Release for documentary interviews and real subjects", category: "talent_releases", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/interview-subject-release" },
      { id: "43", title: "Crowd Notice / Signage", description: "On-set notice advising the public of filming and release", category: "talent_releases", format: "PDF + Word", size: "Fillable", premium: true, route: "/library/crowd-notice-signage" },
    ]
  },
  {
    id: "locations",
    name: "Locations",
    shortLabel: "Locations",
    icon: MapPin,
    description: "Location agreements, scouting forms, and permit paperwork",
    documents: [
      { id: "44", title: "Location Agreement / Release", description: "Permission to film on private property", category: "locations", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "45", title: "Property Release Form", description: "Release for filming specific props, buildings, or artwork", category: "locations", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "46", title: "Location Scout Report", description: "Record scouting notes, photos, and logistical considerations", category: "locations", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "47", title: "Tech Scout / Location Survey", description: "Technical checklist for power, access, and sound at a location", category: "locations", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "48", title: "Permit Application Checklist", description: "Checklist for preparing city, park, or federal permits", category: "locations", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "49", title: "Film Office Cover Letter", description: "Introductory letter to a film office or permitting agency", category: "locations", format: "PDF + Word", size: "Fillable", premium: true },
    ]
  },
  {
    id: "production_reports",
    name: "Production Reports",
    shortLabel: "Reports",
    icon: ClipboardList,
    description: "Daily paperwork, timecards, camera logs, and safety forms",
    documents: [
      { id: "50", title: "Daily Production Report (DPR)", description: "Summary of scenes shot, crew, and daily notes", category: "production_reports", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "51", title: "Crew Timecard / Time Report", description: "Record crew hours, meals, and overtime", category: "production_reports", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "52", title: "Camera Report", description: "Log roll numbers, footage, and technical notes for each day", category: "production_reports", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "53", title: "Sound Report", description: "Log sound files, takes, and audio notes for each day", category: "production_reports", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "54", title: "Continuity / Script Supervisor Report", description: "Track scene continuity, action, and dialogue notes", category: "production_reports", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "55", title: "Background Voucher", description: "Payroll voucher for background and extra performers", category: "production_reports", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "56", title: "Equipment Checkout / Inventory", description: "Log rented or owned equipment checked in and out", category: "production_reports", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "57", title: "Accident / Incident Report", description: "Document any on-set injury or safety incident", category: "production_reports", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "58", title: "Safety Meeting Acknowledgement", description: "Confirm crew attendance at a safety briefing", category: "production_reports", format: "PDF + Word", size: "Fillable", premium: true },
    ]
  },
  {
    id: "accounting",
    name: "Accounting",
    shortLabel: "Accounting",
    icon: Calculator,
    description: "Purchase orders, expenses, invoices, and cost tracking",
    documents: [
      { id: "59", title: "Purchase Order", description: "Authorize a purchase for the production", category: "accounting", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "60", title: "Purchase Order Log", description: "Track all purchase orders and their status", category: "accounting", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "61", title: "Check Request", description: "Request a check payment for a vendor or crew member", category: "accounting", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "62", title: "Petty Cash Envelope / Reconciliation", description: "Log and reconcile small cash expenditures", category: "accounting", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "63", title: "Expense Report", description: "Reimburse production-related expenses", category: "accounting", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "64", title: "Mileage Log", description: "Track vehicle mileage for reimbursement or tax records", category: "accounting", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "65", title: "Credit Card Log", description: "Log production credit card charges and receipts", category: "accounting", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "66", title: "Invoice Template", description: "Bill the production for services or equipment", category: "accounting", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "67", title: "Cost Report / Actuals", description: "Compare actual spending against the approved budget", category: "accounting", format: "PDF + Word", size: "Fillable", premium: true },
    ]
  },
  {
    id: "music_clearances",
    name: "Music & Clearances",
    shortLabel: "Music",
    icon: Music,
    description: "Music licenses, composer deals, cue sheets, and clearance logs",
    documents: [
      { id: "68", title: "Music License (template)", description: "License a song or master recording for the project", category: "music_clearances", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "69", title: "Composer Agreement", description: "Engage a composer to write original score", category: "music_clearances", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "70", title: "Music Cue Sheet", description: "List every music cue with timing and rights holder", category: "music_clearances", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "71", title: "Musician / Session Release", description: "Release for recording session musicians and vocalists", category: "music_clearances", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "72", title: "Materials / Artwork Release", description: "Clear artwork, photos, or archival materials used on screen", category: "music_clearances", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "73", title: "Product Placement Release", description: "Permission to feature a branded product or logo", category: "music_clearances", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "74", title: "Clearance Log", description: "Track all clearance items and their status", category: "music_clearances", format: "PDF + Word", size: "Fillable", premium: true },
    ]
  },
  {
    id: "post_production",
    name: "Post-Production",
    shortLabel: "Post",
    icon: Film,
    description: "Editing, VFX, deliverables, and final quality-control paperwork",
    documents: [
      { id: "75", title: "Post Schedule", description: "Schedule editing, sound, VFX, and color milestones", category: "post_production", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "76", title: "Editor Agreement", description: "Engage an editor and define cut delivery terms", category: "post_production", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "77", title: "VFX Shot List / Turnover", description: "List and describe every visual effects shot needed", category: "post_production", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "78", title: "Deliverables Checklist", description: "List of final deliverables for festivals and distributors", category: "post_production", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "79", title: "QC Checklist", description: "Quality-control checklist for picture, sound, and captions", category: "post_production", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "80", title: "Combined Continuity & Spotting List (CCSL)", description: "Detailed dialogue, continuity, and spotting document", category: "post_production", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "81", title: "Credits / Title List", description: "Final list of on-screen credits and titles", category: "post_production", format: "PDF + Word", size: "Fillable", premium: true },
    ]
  },
  {
    id: "delivery_distribution",
    name: "Delivery & Distribution",
    shortLabel: "Delivery",
    icon: Truck,
    description: "Sales, distribution, and delivery paperwork for release",
    documents: [
      { id: "82", title: "Distribution Package Checklist", description: "Complete checklist of required sales and distribution materials", category: "delivery_distribution", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "83", title: "Delivery Schedule", description: "Timeline for delivering all required elements", category: "delivery_distribution", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "84", title: "Sales Agent Agreement (template)", description: "Engage a sales agent to represent the film", category: "delivery_distribution", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "85", title: "Distribution Agreement (template)", description: "License the film to a distributor for a territory or platform", category: "delivery_distribution", format: "PDF + Word", size: "Fillable", premium: true },
    ]
  },
  {
    id: "marketing_epk_festival",
    name: "Marketing, EPK & Festival",
    shortLabel: "Marketing",
    icon: Megaphone,
    description: "Press kits, posters, festival submissions, and promotional materials",
    documents: [
      { id: "86", title: "EPK Template — Feature", description: "Complete electronic press kit for a feature film", category: "marketing_epk_festival", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "87", title: "EPK Template — Short", description: "Electronic press kit tailored for a short film", category: "marketing_epk_festival", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "88", title: "One-Sheet / Poster Template", description: "Marketing poster layout with key art and credits", category: "marketing_epk_festival", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "89", title: "Press Release Template", description: "Announcement template for festival, press, or release", category: "marketing_epk_festival", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "90", title: "Director's Statement", description: "Template for the director's festival or press statement", category: "marketing_epk_festival", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "91", title: "Synopsis (Short & Long)", description: "Short and long-form synopsis templates for marketing", category: "marketing_epk_festival", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "92", title: "Cast / Crew Bio Template", description: "Bio template for key cast and crew members", category: "marketing_epk_festival", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "93", title: "Festival Cover Letter", description: "Professional cover letter for festival submissions", category: "marketing_epk_festival", format: "PDF + Word", size: "Fillable", premium: true },
      { id: "94", title: "Festival Q&A Template", description: "Frequently asked festival questions and sample answers", category: "marketing_epk_festival", format: "PDF + Word", size: "Fillable", premium: true },
    ]
  }
];

export default function DocsLibrary() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Library is open to everyone; per-document actions can still gate themselves if needed.
  const hasAccess = true;

  const allDocuments: Document[] = documentBundles.flatMap(bundle => bundle.documents);

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDocClick = (doc: Document) => {
    if (doc.route) {
      navigate(doc.route);
      return;
    }
    handleDownload(doc);
  };

  const handleDownload = (document: Document) => {
    if (!hasAccess) {
      alert("Please create an account to access premium documents.");
      return;
    }
    // In a real app, this would trigger the actual download
    console.log("Downloading:", document.title);
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <ToolTopBar />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <Lock className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Premium Document Library</h1>
            <p className="text-muted-foreground mb-8">
              Access essential filmmaking documents, templates, and checklists. 
              Create an account through our project intake form to unlock the complete library.
            </p>
            <Button asChild size="lg">
              <a href="/submit">Complete Project Intake</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ToolTopBar />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Document Library</h1>
          <p className="text-muted-foreground">
            Essential forms, templates, and checklists for your filmmaking journey
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex flex-wrap justify-start gap-2 mb-8 h-auto p-2">
            <TabsTrigger value="all">All</TabsTrigger>
            {documentBundles.map((bundle) => (
              <TabsTrigger key={bundle.id} value={bundle.id} className="text-xs">
                {bundle.shortLabel}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentBundles.map((bundle) => {
                const Icon = bundle.icon;
                return (
                  <Card key={bundle.id} className="group hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{bundle.name}</CardTitle>
                          <Badge variant="secondary">{bundle.documents.length} docs</Badge>
                        </div>
                      </div>
                      <CardDescription>{bundle.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedCategory(bundle.id)}
                      >
                        View Documents
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {documentBundles.map((bundle) => (
            <TabsContent key={bundle.id} value={bundle.id}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <bundle.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{bundle.name}</h2>
                    <p className="text-muted-foreground">{bundle.description}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {bundle.documents.map((doc) => (
                    <Card key={doc.id} onClick={doc.route ? () => navigate(doc.route!) : undefined} className={doc.route ? "cursor-pointer hover:border-primary/50 transition-colors" : undefined}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">{doc.title}</h3>
                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{doc.format}</Badge>
                              <span className="text-xs text-muted-foreground">{doc.size}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={(e) => { e.stopPropagation(); handleDocClick(doc); }}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {doc.route ? "Open" : "Download"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}

          {/* Search Results */}
          {searchTerm && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Search Results ({filteredDocuments.length})
              </h3>
              <div className="grid gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} onClick={doc.route ? () => navigate(doc.route!) : undefined} className={doc.route ? "cursor-pointer hover:border-primary/50 transition-colors" : undefined}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{doc.format}</Badge>
                            <span className="text-xs text-muted-foreground">{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={(e) => { e.stopPropagation(); handleDocClick(doc); }}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {doc.route ? "Open" : "Download"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
