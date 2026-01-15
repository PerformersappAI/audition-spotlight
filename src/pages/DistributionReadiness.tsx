import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Upload,
  Film,
  FileText,
  Scale,
  Settings,
  Target,
  Users,
  Image,
  Video,
  CircleCheck,
  Clock,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

// Platform options
const PLATFORMS = [
  { id: "netflix", label: "Netflix (SVOD)" },
  { id: "hulu", label: "Hulu (SVOD)" },
  { id: "apple_tv", label: "Apple TV / iTunes (TVOD)" },
  { id: "amazon_prime", label: "Amazon Prime Video (SVOD/TVOD)" },
  { id: "roku", label: "Roku Channel (AVOD/FAST)" },
  { id: "tubi", label: "Tubi (AVOD)" },
  { id: "pluto", label: "Pluto TV (FAST)" },
  { id: "peacock", label: "Peacock (SVOD/AVOD)" }
];

const WIZARD_STEPS = [
  { id: 1, title: "Project Setup", icon: Film },
  { id: 2, title: "Target Platforms", icon: Target },
  { id: 3, title: "Business Package", icon: FileText },
  { id: 4, title: "Key Credits", icon: Users },
  { id: 5, title: "Trailer Upload", icon: Video },
  { id: 6, title: "Marketing Assets", icon: Image },
  { id: 7, title: "Legal & Rights", icon: Scale },
  { id: 8, title: "Technical Deliverables", icon: Settings },
  { id: 9, title: "Platform Forms", icon: Target },
  { id: 10, title: "Review & Generate", icon: CheckCircle2 }
];

interface FormData {
  // Step 1 - Project Setup
  projectTitle: string;
  projectType: string;
  budgetTier: string;
  runtimeMinutes: string;
  languagePrimary: string;
  
  // Step 2 - Platform Targets
  platformsSelected: string[];
  distributionGoal: string;
  rightsOfferType: string;
  territories: string;
  termMonths: string;
  
  // Step 3 - Business Package
  logline: string;
  synopsisShort: string;
  synopsisLong: string;
  genres: string[];
  toneKeywords: string[];
  comps: { title: string; year: string; why: string }[];
  
  // Step 4 - Credits
  credits: { personName: string; role: string; characterName: string; notableCredits: string }[];
  
  // Step 5 - Trailer
  trailerFile: File | null;
  trailerLabel: string;
  trailerNotes: string;
  
  // Step 6 - Marketing Assets
  posterFile: File | null;
  keyArtFile: File | null;
  stillImages: File[];
  pressKitUrl: string;
  
  // Step 7 - Legal
  chainOfTitleStatus: string;
  musicClearanceStatus: string;
  releasesStatus: string;
  eAndOStatus: string;
  knownClearanceRisks: string[];
  
  // Step 8 - Technical
  masterAvailable: string;
  masterFormat: string;
  masterResolution: string;
  masterFrameRate: string;
  audioDeliverables: string[];
  captionsAvailable: string;
  subtitleLanguages: string[];
  textlessElements: string;
  mAndETrack: string;
  qcDone: string;
  knownTechIssues: string[];
  
  // Step 9 - Platform specific
  platformForms: Record<string, { intent: string; route: string; notes: string }>;
  
  // Step 10 - Review
  confirmAccuracy: boolean;
  generateOutputs: string[];
}

const initialFormData: FormData = {
  projectTitle: "",
  projectType: "",
  budgetTier: "",
  runtimeMinutes: "",
  languagePrimary: "",
  platformsSelected: [],
  distributionGoal: "",
  rightsOfferType: "",
  territories: "",
  termMonths: "",
  logline: "",
  synopsisShort: "",
  synopsisLong: "",
  genres: [],
  toneKeywords: [],
  comps: [],
  credits: [],
  trailerFile: null,
  trailerLabel: "Official Trailer",
  trailerNotes: "",
  posterFile: null,
  keyArtFile: null,
  stillImages: [],
  pressKitUrl: "",
  chainOfTitleStatus: "",
  musicClearanceStatus: "",
  releasesStatus: "",
  eAndOStatus: "",
  knownClearanceRisks: [],
  masterAvailable: "",
  masterFormat: "",
  masterResolution: "",
  masterFrameRate: "",
  audioDeliverables: [],
  captionsAvailable: "",
  subtitleLanguages: [],
  textlessElements: "",
  mAndETrack: "",
  qcDone: "",
  knownTechIssues: [],
  platformForms: {},
  confirmAccuracy: false,
  generateOutputs: ["readiness_score", "missing_items_list", "platform_checklists"]
};

// Score calculation functions
function calculateBusinessScore(data: FormData): number {
  let score = 0;
  if (data.logline) score += 10;
  if (data.synopsisShort) score += 10;
  if (data.genres.length > 0) score += 10;
  if (data.comps.length >= 3) score += 10;
  if (data.credits.some(c => (c.role === 'director' || c.role === 'cast') && c.notableCredits)) score += 15;
  if (data.trailerFile && (data.posterFile || data.keyArtFile)) score += 15;
  if (data.pressKitUrl) score += 10;
  if (data.rightsOfferType && data.rightsOfferType !== 'unknown') score += 20;
  return Math.min(100, score);
}

function calculateLegalScore(data: FormData): number {
  let score = 0;
  const statusMap: Record<string, number> = { complete: 25, partial: 12, missing: 0 };
  const clearanceMap: Record<string, number> = { complete: 20, partial: 10, missing: 0, unknown: 5 };
  const eoMap: Record<string, number> = { in_place: 20, planned: 10, missing: 0 };
  
  score += statusMap[data.chainOfTitleStatus] || 0;
  score += clearanceMap[data.musicClearanceStatus] || 0;
  score += clearanceMap[data.releasesStatus] || 0;
  score += eoMap[data.eAndOStatus] || 0;
  score += Math.max(0, 15 - (data.knownClearanceRisks.length * 5));
  
  return Math.min(100, score);
}

function calculateTechnicalScore(data: FormData): number {
  let score = 0;
  const masterMap: Record<string, number> = { yes: 20, no: 0, unknown: 10 };
  const captionMap: Record<string, number> = { yes: 20, in_progress: 10, no: 0 };
  const yesNoMap: Record<string, number> = { yes: 10, no: 0, unknown: 5 };
  
  score += masterMap[data.masterAvailable] || 0;
  
  if (data.masterFormat) {
    if (data.masterFormat.toLowerCase().includes('prores') || data.masterFormat.toLowerCase().includes('imf')) {
      score += 15;
    } else if (data.masterFormat.toLowerCase().includes('dnx')) {
      score += 10;
    } else {
      score += 5;
    }
  }
  
  if (data.audioDeliverables.includes('Stereo 2.0')) score += 15;
  score += captionMap[data.captionsAvailable] || 0;
  score += yesNoMap[data.textlessElements] || 0;
  score += yesNoMap[data.mAndETrack] || 0;
  score += yesNoMap[data.qcDone] || 0;
  
  return Math.min(100, score);
}

function getReadinessBand(score: number): { band: string; color: string; action: string } {
  if (score < 40) return { 
    band: "Not Ready", 
    color: "text-red-500", 
    action: "Fix deal-killers first (legal + captions + master availability)." 
  };
  if (score < 70) return { 
    band: "Developing", 
    color: "text-amber-500", 
    action: "Complete core deliverables and tighten business packaging." 
  };
  if (score < 85) return { 
    band: "Ready-ish", 
    color: "text-blue-500", 
    action: "Platform-specific deliverables + aggregator/distributor outreach." 
  };
  return { 
    band: "Delivery Ready", 
    color: "text-green-500", 
    action: "Proceed to aggregator/distributor intake or platform delivery path." 
  };
}

export default function DistributionReadiness() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showResults, setShowResults] = useState(false);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 10) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleGenerateReport = () => {
    if (!formData.confirmAccuracy) {
      toast.error("Please confirm the accuracy of your information");
      return;
    }
    setShowResults(true);
    toast.success("Distribution Readiness Report Generated!");
  };

  // Calculate scores
  const businessScore = calculateBusinessScore(formData);
  const legalScore = calculateLegalScore(formData);
  const technicalScore = calculateTechnicalScore(formData);
  
  // Get weights based on budget tier
  const weights = formData.budgetTier === 'small' 
    ? { business: 40, legal: 35, technical: 25 }
    : formData.budgetTier === 'high'
    ? { business: 30, legal: 35, technical: 35 }
    : { business: 35, legal: 35, technical: 30 };
  
  const overallScore = Math.round(
    (businessScore * weights.business + legalScore * weights.legal + technicalScore * weights.technical) / 100
  );
  
  // Check for hard stops
  const hardStops: string[] = [];
  if (parseInt(formData.runtimeMinutes) >= 40 && formData.captionsAvailable === 'no') {
    hardStops.push("Captions not available for long-form content. Most major services require captions/CC.");
  }
  if (formData.chainOfTitleStatus === 'missing') {
    hardStops.push("Chain of title missing. Legal clearance is a deal-killer for reputable distribution.");
  }
  
  const finalScore = hardStops.length > 0 ? Math.min(overallScore, 59) : overallScore;
  const readiness = getReadinessBand(finalScore);

  const progress = (currentStep / 10) * 100;

  // Results view
  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <Link to="/distribution-readiness" onClick={() => setShowResults(false)} className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment
          </Link>

          <div className="space-y-8">
            {/* Overall Score Card */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl text-white">Distribution Readiness Report</CardTitle>
                <CardDescription className="text-gray-400">{formData.projectTitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className={`text-7xl font-black ${readiness.color}`}>{finalScore}</div>
                  <Badge className={`mt-2 ${readiness.color === 'text-green-500' ? 'bg-green-500/20 text-green-400' : readiness.color === 'text-blue-500' ? 'bg-blue-500/20 text-blue-400' : readiness.color === 'text-amber-500' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                    {readiness.band}
                  </Badge>
                  <p className="text-gray-400 mt-3">{readiness.action}</p>
                </div>

                {/* Pillar Scores */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{businessScore}</div>
                    <div className="text-sm text-gray-400">Business</div>
                    <Progress value={businessScore} className="mt-2 h-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{legalScore}</div>
                    <div className="text-sm text-gray-400">Legal</div>
                    <Progress value={legalScore} className="mt-2 h-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-400">{technicalScore}</div>
                    <div className="text-sm text-gray-400">Technical</div>
                    <Progress value={technicalScore} className="mt-2 h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deal Killers */}
            {hardStops.length > 0 && (
              <Card className="border-red-500/50 bg-red-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    Deal Killers Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {hardStops.map((stop, i) => (
                      <li key={i} className="flex items-start gap-2 text-red-300">
                        <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {stop}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Platform Checklists */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Platform Readiness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {formData.platformsSelected.map(platformId => {
                    const platform = PLATFORMS.find(p => p.id === platformId);
                    return (
                      <div key={platformId} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-3">{platform?.label}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            {formData.trailerFile ? <CircleCheck className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-amber-500" />}
                            <span>Trailer</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {(formData.posterFile || formData.keyArtFile) ? <CircleCheck className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-amber-500" />}
                            <span>Artwork + Metadata</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {formData.captionsAvailable === 'yes' ? <CircleCheck className="h-4 w-4 text-green-500" /> : formData.captionsAvailable === 'in_progress' ? <Clock className="h-4 w-4 text-amber-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                            <span>Captions/CC</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {formData.chainOfTitleStatus === 'complete' ? <CircleCheck className="h-4 w-4 text-green-500" /> : formData.chainOfTitleStatus === 'partial' ? <Clock className="h-4 w-4 text-amber-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                            <span>Chain of Title</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {formData.eAndOStatus === 'in_place' ? <CircleCheck className="h-4 w-4 text-green-500" /> : formData.eAndOStatus === 'planned' ? <Clock className="h-4 w-4 text-amber-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                            <span>E&O Insurance</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                  {hardStops.length > 0 && (
                    <li>Address all deal-killers listed above before proceeding with platform outreach.</li>
                  )}
                  {formData.captionsAvailable !== 'yes' && (
                    <li>Complete captions/closed captions for your project. This is required by most platforms.</li>
                  )}
                  {formData.chainOfTitleStatus !== 'complete' && (
                    <li>Finalize your chain of title documentation with legal counsel.</li>
                  )}
                  {formData.eAndOStatus === 'missing' && (
                    <li>Obtain Errors & Omissions insurance - required for most distribution deals.</li>
                  )}
                  {!formData.trailerFile && (
                    <li>Create and upload a professional trailer for marketing purposes.</li>
                  )}
                  <li>Research aggregators and distributors that work with your target platforms.</li>
                </ol>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Edit Assessment
              </Button>
              <Button onClick={() => toast.success("PDF export coming soon!")}>
                Export PDF Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/toolbox/distribution" className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Distribution
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Distribution Readiness Assessment</h1>
              <p className="text-muted-foreground">
                Evaluate your project's readiness for distribution and generate deliverables checklists.
              </p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400">Smart Tool</Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of 10</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step indicators */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {WIZARD_STEPS.map(step => {
            const StepIcon = step.icon;
            const isActive = step.id === currentStep;
            const isComplete = step.id < currentStep;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 
                  isComplete ? 'bg-green-500/20 text-green-400' : 
                  'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <StepIcon className="h-4 w-4" />
                <span className="hidden md:inline">{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Live Score Panel */}
        <div className="grid lg:grid-cols-[1fr,300px] gap-6">
          {/* Main Form Area */}
          <Card>
            <CardContent className="pt-6">
              {/* Step 1: Project Setup */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Project Setup</h2>
                    <p className="text-muted-foreground mb-6">Tell us about your film project.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="projectTitle">Project Title *</Label>
                      <Input
                        id="projectTitle"
                        value={formData.projectTitle}
                        onChange={(e) => updateFormData({ projectTitle: e.target.value })}
                        placeholder="My Film Project"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Project Type *</Label>
                        <Select value={formData.projectType} onValueChange={(v) => updateFormData({ projectType: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="feature">Feature Film</SelectItem>
                            <SelectItem value="short">Short Film</SelectItem>
                            <SelectItem value="series">Series</SelectItem>
                            <SelectItem value="doc">Documentary</SelectItem>
                            <SelectItem value="special">Special</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Budget Tier *</Label>
                        <Select value={formData.budgetTier} onValueChange={(v) => updateFormData({ budgetTier: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small Budget (Indie/Low)</SelectItem>
                            <SelectItem value="medium">Medium Budget</SelectItem>
                            <SelectItem value="high">High Budget</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="runtime">Runtime (minutes) *</Label>
                        <Input
                          id="runtime"
                          type="number"
                          value={formData.runtimeMinutes}
                          onChange={(e) => updateFormData({ runtimeMinutes: e.target.value })}
                          placeholder="94"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="language">Primary Language *</Label>
                        <Input
                          id="language"
                          value={formData.languagePrimary}
                          onChange={(e) => updateFormData({ languagePrimary: e.target.value })}
                          placeholder="English"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Platform Targets */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Target Platforms</h2>
                    <p className="text-muted-foreground mb-6">Select the platforms you're targeting for distribution.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Select Target Platforms *</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {PLATFORMS.map(platform => (
                          <label key={platform.id} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                            <Checkbox
                              checked={formData.platformsSelected.includes(platform.id)}
                              onCheckedChange={(checked) => {
                                const newPlatforms = checked
                                  ? [...formData.platformsSelected, platform.id]
                                  : formData.platformsSelected.filter(p => p !== platform.id);
                                updateFormData({ platformsSelected: newPlatforms });
                              }}
                            />
                            <span className="text-sm">{platform.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Distribution Goal *</Label>
                        <Select value={formData.distributionGoal} onValueChange={(v) => updateFormData({ distributionGoal: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="svod">SVOD (Subscription)</SelectItem>
                            <SelectItem value="tvod">TVOD (Transactional)</SelectItem>
                            <SelectItem value="avod">AVOD (Ad-supported)</SelectItem>
                            <SelectItem value="fast">FAST (Free Streaming)</SelectItem>
                            <SelectItem value="theatrical">Theatrical</SelectItem>
                            <SelectItem value="festival">Festival Circuit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Rights Offer Type *</Label>
                        <Select value={formData.rightsOfferType} onValueChange={(v) => updateFormData({ rightsOfferType: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rights" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exclusive">Exclusive</SelectItem>
                            <SelectItem value="non_exclusive">Non-Exclusive</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="territories">Territories</Label>
                        <Input
                          id="territories"
                          value={formData.territories}
                          onChange={(e) => updateFormData({ territories: e.target.value })}
                          placeholder="US, CA, UK, WW..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="term">Term (months)</Label>
                        <Input
                          id="term"
                          type="number"
                          value={formData.termMonths}
                          onChange={(e) => updateFormData({ termMonths: e.target.value })}
                          placeholder="24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Business Package */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Business Package</h2>
                    <p className="text-muted-foreground mb-6">What sells your project? Tell us about your story.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logline">Logline * (max 280 chars)</Label>
                      <Textarea
                        id="logline"
                        value={formData.logline}
                        onChange={(e) => updateFormData({ logline: e.target.value.slice(0, 280) })}
                        placeholder="A compelling one-sentence summary of your story..."
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground mt-1">{formData.logline.length}/280</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="synopsisShort">Short Synopsis * (max 1200 chars)</Label>
                      <Textarea
                        id="synopsisShort"
                        value={formData.synopsisShort}
                        onChange={(e) => updateFormData({ synopsisShort: e.target.value.slice(0, 1200) })}
                        placeholder="A brief overview of your story..."
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground mt-1">{formData.synopsisShort.length}/1200</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="synopsisLong">Long Synopsis (optional)</Label>
                      <Textarea
                        id="synopsisLong"
                        value={formData.synopsisLong}
                        onChange={(e) => updateFormData({ synopsisLong: e.target.value })}
                        placeholder="A detailed synopsis of your story..."
                        rows={6}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="genres">Genres * (comma separated)</Label>
                      <Input
                        id="genres"
                        value={formData.genres.join(', ')}
                        onChange={(e) => updateFormData({ genres: e.target.value.split(',').map(g => g.trim()).filter(Boolean) })}
                        placeholder="Drama, Thriller, Mystery..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="toneKeywords">Tone Keywords (comma separated)</Label>
                      <Input
                        id="toneKeywords"
                        value={formData.toneKeywords.join(', ')}
                        onChange={(e) => updateFormData({ toneKeywords: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                        placeholder="gritty, darkly comic, suspenseful..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Credits */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Key Credits</h2>
                    <p className="text-muted-foreground mb-6">Who's involved in this project?</p>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.credits.map((credit, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Credit #{index + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newCredits = formData.credits.filter((_, i) => i !== index);
                              updateFormData({ credits: newCredits });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Person Name"
                            value={credit.personName}
                            onChange={(e) => {
                              const newCredits = [...formData.credits];
                              newCredits[index].personName = e.target.value;
                              updateFormData({ credits: newCredits });
                            }}
                          />
                          <Select
                            value={credit.role}
                            onValueChange={(v) => {
                              const newCredits = [...formData.credits];
                              newCredits[index].role = v;
                              updateFormData({ credits: newCredits });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="director">Director</SelectItem>
                              <SelectItem value="writer">Writer</SelectItem>
                              <SelectItem value="producer">Producer</SelectItem>
                              <SelectItem value="cast">Cast</SelectItem>
                              <SelectItem value="dp">DP</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="composer">Composer</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Character Name (if cast)"
                            value={credit.characterName}
                            onChange={(e) => {
                              const newCredits = [...formData.credits];
                              newCredits[index].characterName = e.target.value;
                              updateFormData({ credits: newCredits });
                            }}
                          />
                          <Input
                            placeholder="Notable Credits"
                            value={credit.notableCredits}
                            onChange={(e) => {
                              const newCredits = [...formData.credits];
                              newCredits[index].notableCredits = e.target.value;
                              updateFormData({ credits: newCredits });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        updateFormData({
                          credits: [...formData.credits, { personName: '', role: '', characterName: '', notableCredits: '' }]
                        });
                      }}
                    >
                      + Add Credit
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Trailer Upload */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Trailer Upload</h2>
                    <p className="text-muted-foreground mb-6">
                      Upload your trailer or teaser (max 5 minutes). Full film uploads are not supported.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                      <input
                        type="file"
                        accept=".mp4,.mov,.m4v"
                        className="hidden"
                        id="trailer-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateFormData({ trailerFile: file });
                            toast.success("Trailer uploaded!");
                          }
                        }}
                      />
                      <label htmlFor="trailer-upload" className="cursor-pointer">
                        <div className="text-lg font-medium mb-1">
                          {formData.trailerFile ? formData.trailerFile.name : "Drop your trailer here or click to browse"}
                        </div>
                        <p className="text-sm text-muted-foreground">MP4, MOV, or M4V (max 5 minutes)</p>
                      </label>
                    </div>
                    
                    <div>
                      <Label htmlFor="trailerLabel">Trailer Label</Label>
                      <Input
                        id="trailerLabel"
                        value={formData.trailerLabel}
                        onChange={(e) => updateFormData({ trailerLabel: e.target.value })}
                        placeholder="Official Trailer"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="trailerNotes">Notes</Label>
                      <Textarea
                        id="trailerNotes"
                        value={formData.trailerNotes}
                        onChange={(e) => updateFormData({ trailerNotes: e.target.value })}
                        placeholder="Any additional notes about the trailer..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Marketing Assets */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Marketing Assets</h2>
                    <p className="text-muted-foreground mb-6">Upload your marketing materials (strongly recommended).</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <Label className="mb-2 block">Poster</Label>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          className="hidden"
                          id="poster-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) updateFormData({ posterFile: file });
                          }}
                        />
                        <label htmlFor="poster-upload" className="cursor-pointer block text-center p-4 border-2 border-dashed rounded-lg hover:bg-muted/50">
                          {formData.posterFile ? (
                            <span className="text-sm text-green-500">{formData.posterFile.name}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Click to upload poster</span>
                          )}
                        </label>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <Label className="mb-2 block">Key Art</Label>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          className="hidden"
                          id="keyart-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) updateFormData({ keyArtFile: file });
                          }}
                        />
                        <label htmlFor="keyart-upload" className="cursor-pointer block text-center p-4 border-2 border-dashed rounded-lg hover:bg-muted/50">
                          {formData.keyArtFile ? (
                            <span className="text-sm text-green-500">{formData.keyArtFile.name}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Click to upload key art</span>
                          )}
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="pressKit">Press Kit URL</Label>
                      <Input
                        id="pressKit"
                        value={formData.pressKitUrl}
                        onChange={(e) => updateFormData({ pressKitUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Legal & Rights */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Legal & Rights</h2>
                    <p className="text-muted-foreground mb-6">Deal-killers live here. Be honest about your legal status.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Chain of Title Status *</Label>
                        <Select value={formData.chainOfTitleStatus} onValueChange={(v) => updateFormData({ chainOfTitleStatus: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="missing">Missing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Music Clearance Status *</Label>
                        <Select value={formData.musicClearanceStatus} onValueChange={(v) => updateFormData({ musicClearanceStatus: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="missing">Missing</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Releases Status *</Label>
                        <Select value={formData.releasesStatus} onValueChange={(v) => updateFormData({ releasesStatus: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="missing">Missing</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>E&O Insurance Status *</Label>
                        <Select value={formData.eAndOStatus} onValueChange={(v) => updateFormData({ eAndOStatus: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_place">In Place</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="missing">Missing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="clearanceRisks">Known Clearance Risks (comma separated)</Label>
                      <Input
                        id="clearanceRisks"
                        value={formData.knownClearanceRisks.join(', ')}
                        onChange={(e) => updateFormData({ knownClearanceRisks: e.target.value.split(',').map(r => r.trim()).filter(Boolean) })}
                        placeholder="unlicensed_song, brand_logos, artwork..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8: Technical Deliverables */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Technical Deliverables</h2>
                    <p className="text-muted-foreground mb-6">What's the technical status of your deliverables?</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Master Available *</Label>
                        <Select value={formData.masterAvailable} onValueChange={(v) => updateFormData({ masterAvailable: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="masterFormat">Master Format</Label>
                        <Input
                          id="masterFormat"
                          value={formData.masterFormat}
                          onChange={(e) => updateFormData({ masterFormat: e.target.value })}
                          placeholder="ProRes 422 HQ, DNxHR, IMF..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="masterResolution">Master Resolution</Label>
                        <Input
                          id="masterResolution"
                          value={formData.masterResolution}
                          onChange={(e) => updateFormData({ masterResolution: e.target.value })}
                          placeholder="1920x1080 or 3840x2160"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="frameRate">Frame Rate</Label>
                        <Input
                          id="frameRate"
                          value={formData.masterFrameRate}
                          onChange={(e) => updateFormData({ masterFrameRate: e.target.value })}
                          placeholder="23.976, 24, 25..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Audio Deliverables</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Stereo 2.0', '5.1', '7.1', 'Stems'].map(option => (
                          <label key={option} className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-muted/50">
                            <Checkbox
                              checked={formData.audioDeliverables.includes(option)}
                              onCheckedChange={(checked) => {
                                const newAudio = checked
                                  ? [...formData.audioDeliverables, option]
                                  : formData.audioDeliverables.filter(a => a !== option);
                                updateFormData({ audioDeliverables: newAudio });
                              }}
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Captions Available *</Label>
                        <Select value={formData.captionsAvailable} onValueChange={(v) => updateFormData({ captionsAvailable: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Textless Elements *</Label>
                        <Select value={formData.textlessElements} onValueChange={(v) => updateFormData({ textlessElements: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>M&E Track *</Label>
                        <Select value={formData.mAndETrack} onValueChange={(v) => updateFormData({ mAndETrack: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>QC Done *</Label>
                        <Select value={formData.qcDone} onValueChange={(v) => updateFormData({ qcDone: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 9: Platform Forms */}
              {currentStep === 9 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Platform-Specific Details</h2>
                    <p className="text-muted-foreground mb-6">
                      Provide details for each selected platform.
                    </p>
                  </div>
                  
                  {formData.platformsSelected.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No platforms selected. Go back to Step 2 to select platforms.</p>
                    </div>
                  ) : (
                    <Tabs defaultValue={formData.platformsSelected[0]}>
                      <TabsList className="flex flex-wrap h-auto gap-1">
                        {formData.platformsSelected.map(platformId => {
                          const platform = PLATFORMS.find(p => p.id === platformId);
                          return (
                            <TabsTrigger key={platformId} value={platformId} className="text-xs">
                              {platform?.label.split(' ')[0]}
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                      
                      {formData.platformsSelected.map(platformId => {
                        const platform = PLATFORMS.find(p => p.id === platformId);
                        const platformForm = formData.platformForms[platformId] || { intent: '', route: '', notes: '' };
                        
                        return (
                          <TabsContent key={platformId} value={platformId} className="space-y-4 mt-4">
                            <h3 className="font-medium">{platform?.label}</h3>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Your Intent</Label>
                                <Select
                                  value={platformForm.intent}
                                  onValueChange={(v) => {
                                    updateFormData({
                                      platformForms: {
                                        ...formData.platformForms,
                                        [platformId]: { ...platformForm, intent: v }
                                      }
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="exploring">Exploring</SelectItem>
                                    <SelectItem value="actively_pitching">Actively Pitching</SelectItem>
                                    <SelectItem value="ready_to_deliver">Ready to Deliver</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label>Route</Label>
                                <Select
                                  value={platformForm.route}
                                  onValueChange={(v) => {
                                    updateFormData({
                                      platformForms: {
                                        ...formData.platformForms,
                                        [platformId]: { ...platformForm, route: v }
                                      }
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="direct_if_available">Direct (if available)</SelectItem>
                                    <SelectItem value="aggregator">Aggregator</SelectItem>
                                    <SelectItem value="distributor">Distributor</SelectItem>
                                    <SelectItem value="sales_agent">Sales Agent</SelectItem>
                                    <SelectItem value="unknown">Unknown</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Notes</Label>
                              <Textarea
                                value={platformForm.notes}
                                onChange={(e) => {
                                  updateFormData({
                                    platformForms: {
                                      ...formData.platformForms,
                                      [platformId]: { ...platformForm, notes: e.target.value }
                                    }
                                  });
                                }}
                                placeholder="Any specific notes for this platform..."
                                rows={3}
                              />
                            </div>
                          </TabsContent>
                        );
                      })}
                    </Tabs>
                  )}
                </div>
              )}

              {/* Step 10: Review & Generate */}
              {currentStep === 10 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Review & Generate Report</h2>
                    <p className="text-muted-foreground mb-6">
                      Review your information and generate your distribution readiness report.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <h3 className="font-medium mb-3">Summary</h3>
                        <dl className="grid grid-cols-2 gap-2 text-sm">
                          <dt className="text-muted-foreground">Project:</dt>
                          <dd>{formData.projectTitle || "Not set"}</dd>
                          <dt className="text-muted-foreground">Type:</dt>
                          <dd className="capitalize">{formData.projectType || "Not set"}</dd>
                          <dt className="text-muted-foreground">Platforms:</dt>
                          <dd>{formData.platformsSelected.length} selected</dd>
                          <dt className="text-muted-foreground">Credits:</dt>
                          <dd>{formData.credits.length} added</dd>
                        </dl>
                      </CardContent>
                    </Card>
                    
                    <div>
                      <Label>Generate Outputs</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[
                          { id: 'readiness_score', label: 'Readiness Score' },
                          { id: 'missing_items_list', label: 'Missing Items List' },
                          { id: 'platform_checklists', label: 'Platform Checklists' },
                          { id: 'pitch_one_sheet_draft', label: 'Pitch One-Sheet Draft' }
                        ].map(output => (
                          <label key={output.id} className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-muted/50">
                            <Checkbox
                              checked={formData.generateOutputs.includes(output.id)}
                              onCheckedChange={(checked) => {
                                const newOutputs = checked
                                  ? [...formData.generateOutputs, output.id]
                                  : formData.generateOutputs.filter(o => o !== output.id);
                                updateFormData({ generateOutputs: newOutputs });
                              }}
                            />
                            <span className="text-sm">{output.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <Checkbox
                        checked={formData.confirmAccuracy}
                        onCheckedChange={(checked) => updateFormData({ confirmAccuracy: !!checked })}
                      />
                      <span className="text-sm">
                        I confirm the above information is accurate to the best of my knowledge.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < 10 ? (
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleGenerateReport} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live Score Panel */}
          <div className="space-y-4">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Live Readiness Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-5xl font-black ${readiness.color}`}>{finalScore}</div>
                  <Badge className="mt-2" variant="outline">{readiness.band}</Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Business</span>
                      <span className="text-blue-400">{businessScore}%</span>
                    </div>
                    <Progress value={businessScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Legal</span>
                      <span className="text-purple-400">{legalScore}%</span>
                    </div>
                    <Progress value={legalScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Technical</span>
                      <span className="text-teal-400">{technicalScore}%</span>
                    </div>
                    <Progress value={technicalScore} className="h-2" />
                  </div>
                </div>
                
                {hardStops.length > 0 && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      Deal Killers
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {hardStops.map((stop, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <XCircle className="h-3 w-3 mt-0.5 text-red-400 flex-shrink-0" />
                          {stop.slice(0, 60)}...
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
