import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PitchDeckForm from "@/components/pitchdeck/PitchDeckForm";
import PitchDeckPreview from "@/components/pitchdeck/PitchDeckPreview";
import TemplateSelector, { type PitchTemplate } from "@/components/pitchdeck/TemplateSelector";
import { exportPitchDeckToPDF } from "@/utils/exportPitchDeckToPDF";

export interface PitchDeckData {
  // Template Selection
  selectedTemplate: PitchTemplate | "";
  
  // AI Generated Poster
  posterImage: string;
  posterPrompt: string;
  
  // Project Basics
  projectTitle: string;
  projectType: "feature" | "short" | "tv_series" | "documentary" | "web_series" | "";
  logline: string;
  genre: string[];
  targetRating: string;
  
  // Story & Synopsis
  synopsis: string;
  directorVision: string;
  toneMood: string;
  themes: string[];
  
  // Characters
  characters: {
    name: string;
    role: "lead" | "supporting" | "recurring";
    description: string;
  }[];
  
  // Visual Style
  visualStyle: string;
  moodboardImages: string[];
  moodboardUploads: string[];
  
  // Comps
  comparables: {
    title: string;
    year: string;
    whySimilar: string;
  }[];
  
  // Target Audience
  primaryDemographic: string;
  secondaryAudience: string;
  marketAnalysis: string;
  
  // Production Details
  budgetRange: string;
  shootingLocations: string;
  timeline: string;
  unionStatus: string;
  
  // Team
  teamMembers: {
    name: string;
    role: string;
    credits: string;
  }[];
  
  // Distribution
  targetPlatforms: string[];
  marketingHighlights: string;
  distributionPlan: string;
  
  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  investmentAsk: string;
}

const initialData: PitchDeckData = {
  selectedTemplate: "",
  posterImage: "",
  posterPrompt: "",
  projectTitle: "",
  projectType: "",
  logline: "",
  genre: [],
  targetRating: "",
  synopsis: "",
  directorVision: "",
  toneMood: "",
  themes: [],
  characters: [],
  visualStyle: "",
  moodboardImages: [],
  moodboardUploads: [],
  comparables: [],
  primaryDemographic: "",
  secondaryAudience: "",
  marketAnalysis: "",
  budgetRange: "",
  shootingLocations: "",
  timeline: "",
  unionStatus: "",
  teamMembers: [],
  targetPlatforms: [],
  marketingHighlights: "",
  distributionPlan: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
  investmentAsk: "",
};

const PitchDeckMaker = () => {
  const [pitchData, setPitchData] = useState<PitchDeckData>(initialData);
  const [currentStep, setCurrentStep] = useState(-1); // -1 = template selection
  const [isExporting, setIsExporting] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("pitchDeckDraft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setPitchData(parsed);
        // If template was selected, skip to form
        if (parsed.selectedTemplate) {
          setCurrentStep(0);
        }
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, []);

  const handleTemplateSelect = (template: PitchTemplate) => {
    setPitchData({ ...pitchData, selectedTemplate: template });
  };

  const handleContinueFromTemplate = () => {
    if (pitchData.selectedTemplate) {
      setCurrentStep(0);
    }
  };

  const handleExportPDF = async () => {
    if (!pitchData.projectTitle) {
      toast.error("Please add a project title before exporting");
      return;
    }
    
    setIsExporting(true);
    try {
      await exportPitchDeckToPDF(pitchData);
      toast.success("Pitch deck exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export pitch deck");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("pitchDeckDraft", JSON.stringify(pitchData));
    toast.success("Draft saved locally");
  };

  const handleComplete = () => {
    // Save draft first
    localStorage.setItem("pitchDeckDraft", JSON.stringify(pitchData));
    
    // Show success with options
    toast.success(
      <div className="space-y-2">
        <p className="font-semibold">Pitch Deck Complete! 🎬</p>
        <p className="text-sm">Your deck is ready. Export to PDF or continue editing.</p>
      </div>,
      {
        duration: 5000,
        action: {
          label: "Export PDF",
          onClick: handleExportPDF,
        },
      }
    );
  };

  // Template selection screen
  if (currentStep === -1) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/toolbox">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  AI Film & TV Pitch Deck Maker
                </h1>
                <p className="text-sm text-muted-foreground">
                  Start by choosing a visual template for your pitch deck
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <TemplateSelector 
            selectedTemplate={pitchData.selectedTemplate}
            onSelect={handleTemplateSelect}
          />
          
          {pitchData.selectedTemplate && (
            <div className="mt-8 text-center">
              <Button
                size="lg"
                onClick={handleContinueFromTemplate}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                Continue with {pitchData.selectedTemplate.charAt(0).toUpperCase() + pitchData.selectedTemplate.slice(1)} Template
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setCurrentStep(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  AI Film & TV Pitch Deck Maker
                </h1>
                <p className="text-sm text-muted-foreground">
                  Template: {pitchData.selectedTemplate.charAt(0).toUpperCase() + pitchData.selectedTemplate.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={handleExportPDF} 
                disabled={isExporting}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Wizard */}
          <div className="space-y-4">
            <Card className="p-6 border-amber-500/20">
              <PitchDeckForm
                data={pitchData}
                onChange={setPitchData}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onComplete={handleComplete}
              />
            </Card>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <Card className="h-full overflow-hidden border-amber-500/20">
              <div className="p-4 border-b border-border bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                <h2 className="font-semibold text-foreground">Live Preview</h2>
                <p className="text-xs text-muted-foreground">See your pitch deck as you build it</p>
              </div>
              <div className="h-[calc(100%-60px)] overflow-y-auto">
                <PitchDeckPreview data={pitchData} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckMaker;
