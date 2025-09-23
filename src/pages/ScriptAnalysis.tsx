import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Brain, FileText, Upload, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
// Document parsing will be handled differently - removed import

interface ScriptAnalysis {
  id: string;
  scriptText: string;
  genre: string;
  tone: string;
  characterCount: number;
  analysisResult: {
    emotionalBeats: string[];
    characterMotivations: string[];
    directorNotes: string[];
    castingTips: string[];
    technicalRequirements: string[];
    estimatedDuration: string;
    difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
    keyMoments: string[];
  } | null;
  createdAt: Date;
}

const ScriptAnalysis = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<ScriptAnalysis[]>([]);
  const [currentScript, setCurrentScript] = useState({
    scriptText: "",
    genre: "",
    tone: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ScriptAnalysis | null>(null);

  const genres = [
    "Drama", "Comedy", "Action", "Thriller", "Horror", "Romance", 
    "Sci-Fi", "Fantasy", "Mystery", "Documentary", "Musical"
  ];

  const tones = [
    "Serious", "Light-hearted", "Dark", "Uplifting", "Suspenseful", 
    "Melancholic", "Energetic", "Intimate", "Epic", "Mysterious"
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    
    try {
      if (file.type === "text/plain") {
        // Handle text files directly
        const text = await file.text();
        setCurrentScript(prev => ({ ...prev, scriptText: text }));
        toast({
          title: "Success",
          description: "Text file loaded successfully"
        });
      } else if (file.type === "application/pdf") {
        // Handle PDF files with OCR
        const formData = new FormData();
        formData.append('file', file);
        
        // Create a temporary file path for processing
        const tempFilePath = `user-uploads://${file.name}`;
        
        // For now, show a message about PDF support
        toast({
          title: "PDF Upload",
          description: "PDF OCR support will be implemented soon. Please use text files for now."
        });
        return;
      } else {
        throw new Error("Unsupported file type. Please upload PDF or text files.");
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file"
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  const countCharacters = (text: string): number => {
    const characterNames = text.match(/^[A-Z][A-Z\s]+$/gm) || [];
    return new Set(characterNames.map(name => name.trim())).size;
  };

  const generateMockAnalysis = (script: typeof currentScript) => {
    return {
      emotionalBeats: [
        "Opening tension builds as protagonist faces internal conflict",
        "Mid-point revelation changes character perspective",
        "Climactic confrontation tests character growth",
        "Resolution brings emotional catharsis"
      ],
      characterMotivations: [
        "Protagonist seeks redemption for past mistakes",
        "Antagonist driven by fear of losing control",
        "Supporting character provides moral compass"
      ],
      directorNotes: [
        "Focus on close-ups during emotional beats",
        "Use lighting to reflect character's internal state",
        "Consider handheld camera for intimate moments",
        "Establish clear geography in opening shots"
      ],
      castingTips: [
        "Protagonist needs strong emotional range",
        "Look for natural chemistry between leads",
        "Supporting cast should complement lead energy",
        "Consider age-appropriate casting for believability"
      ],
      technicalRequirements: [
        "Intimate lighting setup for dramatic scenes",
        "Multiple camera angles for dialogue scenes",
        "Sound design crucial for atmosphere",
        "Practical locations preferred over studio"
      ],
      estimatedDuration: script.genre === "Comedy" ? "3-5 minutes" : "5-8 minutes",
      difficultyLevel: (script.tone === "Epic" || script.genre === "Action") ? "Advanced" as const : 
                     (script.genre === "Drama" || script.tone === "Suspenseful") ? "Intermediate" as const : 
                     "Beginner" as const,
      keyMoments: [
        "Character introduction and setup",
        "Inciting incident",
        "Point of no return",
        "Climax and resolution"
      ]
    };
  };

  const analyzeScript = async () => {
    if (!currentScript.scriptText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter script text or upload a file to analyze"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const newAnalysis: ScriptAnalysis = {
        id: Date.now().toString(),
        scriptText: currentScript.scriptText,
        genre: currentScript.genre,
        tone: currentScript.tone,
        characterCount: countCharacters(currentScript.scriptText),
        analysisResult: generateMockAnalysis(currentScript),
        createdAt: new Date()
      };

      setAnalyses(prev => [newAnalysis, ...prev]);
      setSelectedAnalysis(newAnalysis);
      setIsAnalyzing(false);

      toast({
        title: "Analysis Complete",
        description: "Your script has been analyzed successfully"
      });
    }, 3000);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Script Analysis</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your script or paste text to get AI-powered analysis for character development, 
              emotional beats, and director's insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Script Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="script-file">Upload Script File (PDF or Text)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="script-file"
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileUpload}
                        disabled={isProcessingFile}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      {isProcessingFile && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  </div>

                  {/* Manual Text Input */}
                  <div className="space-y-2">
                    <Label htmlFor="script-text">Or paste your script text here</Label>
                    <Textarea
                      id="script-text"
                      placeholder="Enter your script text here..."
                      value={currentScript.scriptText}
                      onChange={(e) => setCurrentScript(prev => ({ ...prev, scriptText: e.target.value }))}
                      className="min-h-[300px] resize-none"
                    />
                  </div>

                  {/* Genre and Tone Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Genre</Label>
                      <Select value={currentScript.genre} onValueChange={(value) => setCurrentScript(prev => ({ ...prev, genre: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tone</Label>
                      <Select value={currentScript.tone} onValueChange={(value) => setCurrentScript(prev => ({ ...prev, tone: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((tone) => (
                            <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={analyzeScript} 
                    disabled={isAnalyzing || isProcessingFile}
                    className="w-full"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Script...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Analyze Script
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Analyses Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Analyses</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No analyses yet. Upload a script to get started!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {analyses.slice(0, 5).map((analysis) => (
                        <div
                          key={analysis.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedAnalysis?.id === analysis.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedAnalysis(analysis)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">
                                {analysis.genre || "No Genre"}
                              </span>
                              <Badge className={getDifficultyColor(analysis.analysisResult?.difficultyLevel || "Beginner")}>
                                {analysis.analysisResult?.difficultyLevel || "Beginner"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {analysis.scriptText.substring(0, 100)}...
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{analysis.characterCount} characters</span>
                              <span>{analysis.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results Section */}
          {selectedAnalysis?.analysisResult && (
            <div className="mt-8">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Emotional Beats */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        🎭 Emotional Beats
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.analysisResult.emotionalBeats.map((beat, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-sm">{beat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Character Motivations */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        🎯 Character Motivations
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.analysisResult.characterMotivations.map((motivation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{motivation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Director Notes */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        🎬 Director's Notes
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.analysisResult.directorNotes.map((note, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Casting Tips */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        👥 Casting Tips
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.analysisResult.castingTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Requirements */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        ⚙️ Technical Requirements
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.analysisResult.technicalRequirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Moments */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        ⭐ Key Moments
                      </h3>
                      <ul className="space-y-2">
                        {selectedAnalysis.analysisResult.keyMoments.map((moment, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{moment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{selectedAnalysis.characterCount}</div>
                        <div className="text-sm text-muted-foreground">Characters</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{selectedAnalysis.analysisResult.estimatedDuration}</div>
                        <div className="text-sm text-muted-foreground">Est. Duration</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Badge className={getDifficultyColor(selectedAnalysis.analysisResult.difficultyLevel)}>
                          {selectedAnalysis.analysisResult.difficultyLevel}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">Difficulty</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptAnalysis;