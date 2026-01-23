import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  DollarSign,
  FileText,
  Users,
  Target,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { exportFundingStrategyToPDF, type FundingStrategyData } from "@/utils/exportFundingStrategyToPDF";
import { FundingChatAssistant } from "@/components/funding/FundingChatAssistant";

const STEPS = [
  { id: 1, title: "Project Basics", icon: FileText },
  { id: 2, title: "Budget & Timeline", icon: DollarSign },
  { id: 3, title: "Team & Assets", icon: Users },
  { id: 4, title: "Funding Goals", icon: Target },
  { id: 5, title: "Review & Export", icon: Sparkles },
];

const BUDGET_RANGES = [
  { value: "micro", label: "Micro Budget", description: "Under $50,000", recommended: ["grants", "crowdfunding", "self"] },
  { value: "low", label: "Low Budget", description: "$50,000 - $250,000", recommended: ["grants", "crowdfunding", "investors"] },
  { value: "mid_low", label: "Mid-Low Budget", description: "$250,000 - $500,000", recommended: ["grants", "tax_incentives", "investors"] },
  { value: "mid", label: "Mid Budget", description: "$500,000 - $1,000,000", recommended: ["tax_incentives", "presales", "investors"] },
  { value: "mid_high", label: "Mid-High Budget", description: "$1M - $5M", recommended: ["tax_incentives", "presales", "gap_financing", "investors"] },
  { value: "high", label: "High Budget", description: "$5M+", recommended: ["studio", "presales", "gap_financing", "investors"] },
];

const PROJECT_TYPES = [
  { value: "feature", label: "Feature Film" },
  { value: "short", label: "Short Film" },
  { value: "documentary", label: "Documentary" },
  { value: "tv_series", label: "TV Series" },
  { value: "web_series", label: "Web Series" },
  { value: "pilot", label: "TV Pilot" },
];

const FUNDING_SOURCES = [
  { id: "grants", label: "Grants & Fellowships", description: "Non-repayable funding from foundations" },
  { id: "crowdfunding", label: "Crowdfunding", description: "Seed&Spark, Kickstarter, Indiegogo" },
  { id: "tax_incentives", label: "Tax Incentives", description: "State/country production rebates" },
  { id: "investors", label: "Private Investors", description: "Equity investment from individuals" },
  { id: "presales", label: "Pre-Sales", description: "Selling distribution rights upfront" },
  { id: "gap_financing", label: "Gap/Bridge Loans", description: "Loans against unsold territories" },
  { id: "studio", label: "Studio/Streamer Deal", description: "Major studio or platform financing" },
  { id: "self", label: "Self-Financed", description: "Personal or family funding" },
];

const TIMELINE_OPTIONS = [
  { value: "immediate", label: "Immediate", description: "Ready to shoot within 3 months" },
  { value: "short", label: "Short-term", description: "6-12 months to production" },
  { value: "medium", label: "Medium-term", description: "1-2 years to production" },
  { value: "development", label: "Development", description: "Still in early development" },
];

const initialData: FundingStrategyData = {
  // Project basics
  projectTitle: "",
  projectType: "",
  logline: "",
  genre: "",
  
  // Budget & timeline
  budgetRange: "",
  timeline: "",
  currentFunding: "",
  
  // Team & assets
  hasAttachedTalent: false,
  hasDirector: false,
  hasProducer: false,
  hasCompletedScript: false,
  hasPreviousCredits: false,
  teamNotes: "",
  
  // Funding goals
  selectedSources: [],
  targetAmount: "",
  askingFor: "",
  investorPitch: "",
};

export default function FundingStrategy() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<FundingStrategyData>(initialData);
  const [isExporting, setIsExporting] = useState(false);

  const updateData = (updates: Partial<FundingStrategyData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleExport = async () => {
    if (!data.projectTitle) {
      toast.error("Please enter a project title");
      return;
    }
    
    setIsExporting(true);
    try {
      await exportFundingStrategyToPDF(data);
      toast.success("Funding Strategy Brief exported!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const getRecommendedSources = () => {
    const budget = BUDGET_RANGES.find(b => b.value === data.budgetRange);
    return budget?.recommended || [];
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  Film Funding Strategy
                </h1>
                <p className="text-sm text-muted-foreground">Create a professional funding brief for investors</p>
              </div>
            </div>
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              Smart Tool
            </Badge>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isActive 
                        ? "bg-emerald-500 text-white" 
                        : isComplete 
                          ? "bg-emerald-500/20 text-emerald-600" 
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    <span className="hidden md:inline text-sm font-medium">{step.title}</span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 lg:w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-emerald-500" : "bg-muted"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* AI Chat Assistant */}
        <div className="mb-6">
          <FundingChatAssistant 
            context={{
              projectTitle: data.projectTitle,
              budgetRange: data.budgetRange,
              timeline: data.timeline,
              selectedSources: data.selectedSources,
              currentStep,
            }}
          />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your project"}
              {currentStep === 2 && "Define your budget range and timeline"}
              {currentStep === 3 && "What assets and team do you have?"}
              {currentStep === 4 && "Select your funding strategy"}
              {currentStep === 5 && "Review your strategy and export"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Project Basics */}
            {currentStep === 1 && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title *</Label>
                    <Input
                      id="projectTitle"
                      placeholder="Enter your project title"
                      value={data.projectTitle}
                      onChange={(e) => updateData({ projectTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      placeholder="e.g., Drama, Horror, Comedy"
                      value={data.genre}
                      onChange={(e) => updateData({ genre: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <RadioGroup
                    value={data.projectType}
                    onValueChange={(value) => updateData({ projectType: value })}
                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value} className="cursor-pointer">{type.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logline">Logline</Label>
                  <Textarea
                    id="logline"
                    placeholder="One sentence that captures your story"
                    value={data.logline}
                    onChange={(e) => updateData({ logline: e.target.value })}
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Step 2: Budget & Timeline */}
            {currentStep === 2 && (
              <>
                <div className="space-y-4">
                  <Label>Budget Range *</Label>
                  <RadioGroup
                    value={data.budgetRange}
                    onValueChange={(value) => updateData({ budgetRange: value })}
                    className="grid gap-3"
                  >
                    {BUDGET_RANGES.map((budget) => (
                      <div
                        key={budget.value}
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                          data.budgetRange === budget.value 
                            ? "border-emerald-500 bg-emerald-500/10" 
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={budget.value} id={budget.value} />
                          <div>
                            <Label htmlFor={budget.value} className="cursor-pointer font-medium">
                              {budget.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">{budget.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label>Production Timeline</Label>
                  <RadioGroup
                    value={data.timeline}
                    onValueChange={(value) => updateData({ timeline: value })}
                    className="grid md:grid-cols-2 gap-3"
                  >
                    {TIMELINE_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                          data.timeline === option.value 
                            ? "border-emerald-500 bg-emerald-500/10" 
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <RadioGroupItem value={option.value} id={`timeline-${option.value}`} className="mr-3" />
                        <div>
                          <Label htmlFor={`timeline-${option.value}`} className="cursor-pointer font-medium">
                            {option.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentFunding">Current Funding Secured</Label>
                  <Input
                    id="currentFunding"
                    placeholder="e.g., $25,000 or 20%"
                    value={data.currentFunding}
                    onChange={(e) => updateData({ currentFunding: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Step 3: Team & Assets */}
            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <Label>What do you have in place? (Check all that apply)</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { key: "hasCompletedScript", label: "Completed Script" },
                      { key: "hasDirector", label: "Attached Director" },
                      { key: "hasProducer", label: "Attached Producer" },
                      { key: "hasAttachedTalent", label: "Attached Talent/Cast" },
                      { key: "hasPreviousCredits", label: "Team Has Previous Credits" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                          data[item.key as keyof FundingStrategyData] 
                            ? "border-emerald-500 bg-emerald-500/10" 
                            : "border-border hover:border-muted-foreground"
                        }`}
                        onClick={() => updateData({ [item.key]: !data[item.key as keyof FundingStrategyData] })}
                      >
                        <Checkbox
                          checked={data[item.key as keyof FundingStrategyData] as boolean}
                          onCheckedChange={(checked) => updateData({ [item.key]: checked })}
                          className="mr-3"
                        />
                        <Label className="cursor-pointer">{item.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamNotes">Team Notes (Optional)</Label>
                  <Textarea
                    id="teamNotes"
                    placeholder="Any additional information about your team, previous work, or notable attachments..."
                    value={data.teamNotes}
                    onChange={(e) => updateData({ teamNotes: e.target.value })}
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* Step 4: Funding Goals */}
            {currentStep === 4 && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Select Funding Sources</Label>
                    {data.budgetRange && (
                      <Badge variant="outline" className="text-emerald-600">
                        Recommended sources highlighted
                      </Badge>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {FUNDING_SOURCES.map((source) => {
                      const isRecommended = getRecommendedSources().includes(source.id);
                      const isSelected = data.selectedSources.includes(source.id);
                      
                      return (
                        <div
                          key={source.id}
                          className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? "border-emerald-500 bg-emerald-500/10" 
                              : isRecommended
                                ? "border-emerald-500/50 bg-emerald-500/5"
                                : "border-border hover:border-muted-foreground"
                          }`}
                          onClick={() => {
                            const newSources = isSelected
                              ? data.selectedSources.filter(s => s !== source.id)
                              : [...data.selectedSources, source.id];
                            updateData({ selectedSources: newSources });
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const newSources = checked
                                ? [...data.selectedSources, source.id]
                                : data.selectedSources.filter(s => s !== source.id);
                              updateData({ selectedSources: newSources });
                            }}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Label className="cursor-pointer font-medium">{source.label}</Label>
                              {isRecommended && (
                                <Badge variant="secondary" className="text-xs">Recommended</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{source.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Target Amount to Raise</Label>
                    <Input
                      id="targetAmount"
                      placeholder="e.g., $150,000"
                      value={data.targetAmount}
                      onChange={(e) => updateData({ targetAmount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="askingFor">What You're Asking For</Label>
                    <Input
                      id="askingFor"
                      placeholder="e.g., Equity investment, Executive Producer credit"
                      value={data.askingFor}
                      onChange={(e) => updateData({ askingFor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investorPitch">Key Message for Investors (Optional)</Label>
                  <Textarea
                    id="investorPitch"
                    placeholder="What makes this project a good investment? Why now?"
                    value={data.investorPitch}
                    onChange={(e) => updateData({ investorPitch: e.target.value })}
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* Step 5: Review & Export */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Strategy Summary</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Project</p>
                      <p className="font-medium">{data.projectTitle || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">
                        {PROJECT_TYPES.find(t => t.value === data.projectType)?.label || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget Range</p>
                      <p className="font-medium">
                        {BUDGET_RANGES.find(b => b.value === data.budgetRange)?.label || "Not specified"}
                        {data.budgetRange && ` (${BUDGET_RANGES.find(b => b.value === data.budgetRange)?.description})`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timeline</p>
                      <p className="font-medium">
                        {TIMELINE_OPTIONS.find(t => t.value === data.timeline)?.label || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target Raise</p>
                      <p className="font-medium">{data.targetAmount || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Funding</p>
                      <p className="font-medium">{data.currentFunding || "None specified"}</p>
                    </div>
                  </div>

                  {data.selectedSources.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Selected Funding Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {data.selectedSources.map(sourceId => {
                          const source = FUNDING_SOURCES.find(s => s.id === sourceId);
                          return (
                            <Badge key={sourceId} variant="secondary">
                              {source?.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {data.logline && (
                    <div>
                      <p className="text-sm text-muted-foreground">Logline</p>
                      <p className="font-medium">{data.logline}</p>
                    </div>
                  )}
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6">
                  <h3 className="font-semibold text-emerald-600 mb-2 flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Your Funding Strategy Brief
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download a professional PDF document you can share with potential investors, 
                    donors, or grant applications. Includes your project overview, funding strategy, 
                    and recommended resources.
                  </p>
                  <Button 
                    onClick={handleExport} 
                    disabled={isExporting}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isExporting ? (
                      <>Generating PDF...</>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Funding Strategy Brief
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isExporting ? "Generating..." : "Download PDF"}
              <Download className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}