import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PitchDeckForm from "@/components/pitchdeck/PitchDeckForm";
import PitchDeckPreview from "@/components/pitchdeck/PitchDeckPreview";
import { exportPitchDeckToPDF } from "@/utils/exportPitchDeckToPDF";

export interface PitchDeckData {
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                  Create professional pitch decks with AI-powered content generation
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
