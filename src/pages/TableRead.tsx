import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Headphones, Upload, Users, Wand2, Edit3, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScriptUploader from "@/components/tableread/ScriptUploader";
import type { ParsedScreenplay } from "@/utils/screenplayParser";

const STEPS = [
  { id: 1, name: "Upload Script", icon: Upload },
  { id: 2, name: "Assign Voices", icon: Users },
  { id: 3, name: "Generate", icon: Wand2 },
  { id: 4, name: "Edit", icon: Edit3 },
  { id: 5, name: "Export", icon: Download },
];

export default function TableRead() {
  const [currentStep, setCurrentStep] = useState(1);
  const [parsedScript, setParsedScript] = useState<ParsedScreenplay | null>(null);

  const handleScriptParsed = (screenplay: ParsedScreenplay) => {
    setParsedScript(screenplay);
  };

  const handleContinue = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScriptUploader 
            onScriptParsed={handleScriptParsed} 
            onContinue={handleContinue}
            parsedScript={parsedScript}
          />
        );
      case 2:
      case 3:
      case 4:
      case 5:
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const StepIcon = STEPS[currentStep - 1].icon;
                  return <StepIcon className="w-8 h-8 text-pink-400" />;
                })()}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {STEPS[currentStep - 1].name}
              </h3>
              <p className="text-gray-400 mb-6">
                This step is coming soon. Complete the previous steps first.
              </p>
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Back to Upload
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/toolbox">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Table Read</h1>
                <p className="text-sm text-gray-400">Transform your screenplay into an audiobook</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? "bg-pink-500 text-white"
                          : isActive
                          ? "bg-pink-500/20 border-2 border-pink-500 text-pink-400"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isActive ? "text-pink-400" : isCompleted ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-12 sm:w-20 h-0.5 mx-2 ${
                        currentStep > step.id ? "bg-pink-500" : "bg-gray-800"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
