import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Video, FileText, Users, Target, Lightbulb, Clock, Star, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Shot {
  shotNumber: number;
  description: string;
  cameraAngle: string;
  characters: string[];
  visualElements: string;
  duration: string;
}

interface StoryboardFrame {
  shotNumber: number;
  description: string;
  cameraAngle: string;
  characters: string[];
  visualElements: string;
  imageData?: string;
  generatedAt?: string;
}

interface SceneAnalysis {
  id: string;
  sceneText: string;
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
    shots: Shot[];
  } | null;
  storyboard?: StoryboardFrame[];
  createdAt: Date;
}

const SceneAnalysis = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<SceneAnalysis[]>([]);
  const [currentScene, setCurrentScene] = useState({
    sceneText: "",
    genre: "",
    tone: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SceneAnalysis | null>(null);
  const [generatingStoryboard, setGeneratingStoryboard] = useState(false);

  const genres = [
    "Drama", "Comedy", "Action", "Thriller", "Horror", "Romance", 
    "Sci-Fi", "Fantasy", "Mystery", "Documentary", "Musical"
  ];

  const tones = [
    "Serious", "Light-hearted", "Dark", "Uplifting", "Suspenseful", 
    "Melancholic", "Energetic", "Intimate", "Epic", "Mysterious"
  ];

  const analyzeScene = async () => {
    if (!currentScene.sceneText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter scene text to analyze"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const newAnalysis: SceneAnalysis = {
        id: Date.now().toString(),
        sceneText: currentScene.sceneText,
        genre: currentScene.genre,
        tone: currentScene.tone,
        characterCount: countCharacters(currentScene.sceneText),
        analysisResult: generateMockAnalysis(currentScene),
        createdAt: new Date()
      };

      setAnalyses(prev => [newAnalysis, ...prev]);
      setSelectedAnalysis(newAnalysis);
      setIsAnalyzing(false);

      toast({
        title: "Analysis Complete",
        description: "Your scene has been analyzed successfully"
      });
    }, 3000);
  };

  const countCharacters = (text: string): number => {
    const characterNames = text.match(/^[A-Z][A-Z\s]+$/gm) || [];
    return new Set(characterNames.map(name => name.trim())).size;
  };

  const generateMockAnalysis = (scene: typeof currentScene) => {
    const shotCount = Math.max(3, Math.min(8, Math.floor(scene.sceneText.length / 200)));
    const shots: Shot[] = [];

    for (let i = 1; i <= shotCount; i++) {
      const shotTypes = ["Wide Shot", "Medium Shot", "Close-up", "Over-the-shoulder", "Point of view"];
      const cameraAngles = ["Eye level", "High angle", "Low angle", "Dutch angle"];
      
      shots.push({
        shotNumber: i,
        description: `Shot ${i}: ${scene.genre === "Action" ? "Dynamic movement sequence" : 
                     scene.tone === "Intimate" ? "Character emotional moment" : 
                     "Key narrative beat"}`,
        cameraAngle: `${shotTypes[Math.floor(Math.random() * shotTypes.length)]} - ${cameraAngles[Math.floor(Math.random() * cameraAngles.length)]}`,
        characters: [`Character ${Math.floor(Math.random() * 3) + 1}`],
        visualElements: scene.genre === "Horror" ? "Dark lighting, shadows" :
                       scene.genre === "Comedy" ? "Bright, colorful setting" :
                       scene.tone === "Epic" ? "Dramatic wide landscape" :
                       "Natural lighting, realistic setting",
        duration: `${Math.floor(Math.random() * 10) + 5} seconds`
      });
    }

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
      estimatedDuration: scene.genre === "Comedy" ? "3-5 minutes" : "5-8 minutes",
      difficultyLevel: (scene.tone === "Epic" || scene.genre === "Action") ? "Advanced" as const : 
                     (scene.genre === "Drama" || scene.tone === "Suspenseful") ? "Intermediate" as const : 
                     "Beginner" as const,
      keyMoments: [
        "Character introduction and setup",
        "Inciting incident",
        "Point of no return",
        "Climax and resolution"
      ],
      shots
    };
  };

  const generateStoryboard = async () => {
    if (!selectedAnalysis?.analysisResult?.shots) return;

    setGeneratingStoryboard(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-storyboard', {
        body: {
          shots: selectedAnalysis.analysisResult.shots,
          sceneDetails: {
            genre: selectedAnalysis.genre,
            tone: selectedAnalysis.tone,
            sceneText: selectedAnalysis.sceneText.substring(0, 500)
          }
        }
      });

      if (error) throw error;

      if (data?.storyboard) {
        const updatedAnalysis = {
          ...selectedAnalysis,
          storyboard: data.storyboard
        };
        
        setAnalyses(prev => prev.map(a => a.id === selectedAnalysis.id ? updatedAnalysis : a));
        setSelectedAnalysis(updatedAnalysis);

        toast({
          title: "Storyboard Generated!",
          description: "Visual storyboard frames have been created successfully"
        });
      }
    } catch (error) {
      console.error('Error generating storyboard:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate storyboard. Please try again."
      });
    } finally {
      setGeneratingStoryboard(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const exportSceneAnalysisToPDF = async () => {
    if (!selectedAnalysis?.analysisResult) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Scene Analysis Report', margin, yPosition);
    yPosition += 15;

    // Basic Info
    pdf.setFontSize(12);
    pdf.text(`Genre: ${selectedAnalysis.genre}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Tone: ${selectedAnalysis.tone}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Characters: ${selectedAnalysis.characterCount}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Difficulty: ${selectedAnalysis.analysisResult.difficultyLevel}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Estimated Duration: ${selectedAnalysis.analysisResult.estimatedDuration}`, margin, yPosition);
    yPosition += 15;

    // Scene Text Preview
    pdf.setFontSize(14);
    pdf.text('Scene Text Preview', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(9);
    const scenePreview = selectedAnalysis.sceneText.substring(0, 500) + (selectedAnalysis.sceneText.length > 500 ? '...' : '');
    const sceneLines = pdf.splitTextToSize(scenePreview, pageWidth - 2 * margin);
    pdf.text(sceneLines, margin, yPosition);
    yPosition += sceneLines.length * 4 + 10;

    // Emotional Beats
    pdf.setFontSize(14);
    pdf.text('Emotional Beats', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(10);
    selectedAnalysis.analysisResult.emotionalBeats.forEach((beat, index) => {
      const lines = pdf.splitTextToSize(`${index + 1}. ${beat}`, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5;
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = margin;
      }
    });
    yPosition += 10;

    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }

    // Character Motivations
    pdf.setFontSize(14);
    pdf.text('Character Motivations', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(10);
    selectedAnalysis.analysisResult.characterMotivations.forEach((motivation) => {
      const lines = pdf.splitTextToSize(`• ${motivation}`, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5;
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = margin;
      }
    });
    yPosition += 10;

    // Director Notes
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.setFontSize(14);
    pdf.text('Director Notes', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(10);
    selectedAnalysis.analysisResult.directorNotes.forEach((note) => {
      const lines = pdf.splitTextToSize(`• ${note}`, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5;
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = margin;
      }
    });

    // Save the PDF
    pdf.save(`scene-analysis-${selectedAnalysis.genre || 'untitled'}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Scene analysis has been exported successfully"
    });
  };

  const exportStoryboardToPDF = async () => {
    if (!selectedAnalysis?.storyboard) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Storyboard Report', margin, yPosition);
    yPosition += 15;

    // Basic Info
    pdf.setFontSize(12);
    pdf.text(`Genre: ${selectedAnalysis.genre}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Tone: ${selectedAnalysis.tone}`, margin, yPosition);
    yPosition += 15;

    // Storyboard Frames
    for (const frame of selectedAnalysis.storyboard) {
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.text(`Shot ${frame.shotNumber}`, margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.text(`Camera: ${frame.cameraAngle}`, margin, yPosition);
      yPosition += 7;
      pdf.text(`Characters: ${frame.characters.join(', ')}`, margin, yPosition);
      yPosition += 7;

      const descLines = pdf.splitTextToSize(`Description: ${frame.description}`, pageWidth - 2 * margin);
      pdf.text(descLines, margin, yPosition);
      yPosition += descLines.length * 5;

      const visualLines = pdf.splitTextToSize(`Visual Elements: ${frame.visualElements}`, pageWidth - 2 * margin);
      pdf.text(visualLines, margin, yPosition);
      yPosition += visualLines.length * 5 + 10;

      // Add image if available
      if (frame.imageData) {
        try {
          pdf.addImage(frame.imageData, 'JPEG', margin, yPosition, 80, 60);
          yPosition += 70;
        } catch (error) {
          console.error('Error adding image to PDF:', error);
        }
      }

      yPosition += 10;
    }

    // Save the PDF
    pdf.save(`storyboard-${selectedAnalysis.genre || 'untitled'}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Storyboard has been exported successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Brain className="h-8 w-8" />
                AI Scene Analysis
              </h1>
              <p className="text-muted-foreground">Analyze scripts for casting, direction, and production insights</p>
            </div>
          </div>

          {/* Input and Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Scene Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="scene-text">Scene Text</Label>
                    <Textarea
                      id="scene-text"
                      placeholder="Paste your scene text here..."
                      value={currentScene.sceneText}
                      onChange={(e) => setCurrentScene(prev => ({ ...prev, sceneText: e.target.value }))}
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Genre</Label>
                      <Select value={currentScene.genre} onValueChange={(value) => setCurrentScene(prev => ({ ...prev, genre: value }))}>
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
                    
                    <div>
                      <Label>Tone</Label>
                      <Select value={currentScene.tone} onValueChange={(value) => setCurrentScene(prev => ({ ...prev, tone: value }))}>
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
                    onClick={analyzeScene} 
                    disabled={isAnalyzing}
                    className="w-full"
                    size="lg"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Scene"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Analyses Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Analyses</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No analyses yet. Start by analyzing a scene!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {analyses.slice(0, 5).map((analysis) => (
                        <div
                          key={analysis.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
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
                              {analysis.sceneText.substring(0, 80)}...
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
          {selectedAnalysis?.analysisResult ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Analysis Results</CardTitle>
                    <Button onClick={exportSceneAnalysisToPDF} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Analysis PDF
                    </Button>
                  </div>
                </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="directing">Directing</TabsTrigger>
                    <TabsTrigger value="casting">Casting</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="storyboard">Storyboard</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Emotional Beats
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

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Character Motivations
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
                    </div>

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
                          <div className="text-sm text-muted-foreground">Duration</div>
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
                  </TabsContent>

                  <TabsContent value="directing" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Video className="h-5 w-5" />
                          Director's Notes
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

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          Key Moments
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
                  </TabsContent>

                  <TabsContent value="casting" className="mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Casting Tips
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
                  </TabsContent>

                  <TabsContent value="technical" className="mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Technical Requirements
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
                  </TabsContent>

                  <TabsContent value="storyboard" className="mt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Video className="h-5 w-5" />
                          Shot Breakdown
                        </h3>
                         <div className="flex gap-2">
                           <Button 
                             onClick={generateStoryboard}
                             disabled={generatingStoryboard}
                             size="sm"
                           >
                             {generatingStoryboard ? "Generating..." : "Generate Visual Storyboard"}
                           </Button>
                           {selectedAnalysis?.storyboard && (
                             <Button onClick={exportStoryboardToPDF} size="sm" variant="outline">
                               <Download className="h-4 w-4 mr-2" />
                               Export Storyboard PDF
                             </Button>
                           )}
                         </div>
                       </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedAnalysis.analysisResult.shots.map((shot) => (
                          <Card key={shot.shotNumber} className="border border-border">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary">Shot {shot.shotNumber}</Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {shot.duration}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <h4 className="font-medium text-sm mb-1">Description</h4>
                                <p className="text-sm text-muted-foreground">{shot.description}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm mb-1">Camera Angle</h4>
                                <p className="text-sm text-muted-foreground">{shot.cameraAngle}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm mb-1">Visual Elements</h4>
                                <p className="text-sm text-muted-foreground">{shot.visualElements}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {selectedAnalysis.storyboard && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Visual Storyboard
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedAnalysis.storyboard.map((frame) => (
                              <Card key={frame.shotNumber} className="border border-border">
                                <CardContent className="p-4 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Badge variant="secondary">Frame {frame.shotNumber}</Badge>
                                    {frame.generatedAt && (
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(frame.generatedAt).toLocaleTimeString()}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {frame.imageData ? (
                                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                      <img 
                                        src={frame.imageData} 
                                        alt={`Storyboard frame ${frame.shotNumber}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                      <div className="text-center">
                                        <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Frame generating...</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">{frame.description}</p>
                                    <p className="text-xs text-muted-foreground">{frame.cameraAngle}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Selected</h3>
                <p className="text-muted-foreground">
                  Analyze a scene or select from your recent analyses to see detailed results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneAnalysis;