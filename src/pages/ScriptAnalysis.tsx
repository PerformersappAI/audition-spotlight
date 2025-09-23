import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, FileText, Upload, Film, Users, Heart, Star, Lightbulb, Target, Clock, Download, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useOCRUpload } from '@/hooks/useOCRUpload';
import jsPDF from 'jspdf';
// Document parsing functionality
const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // Simple text extraction - this would need a proper PDF library like PDF.js
    // For now, we'll throw an error to force using the edge function
    throw new Error("PDF parsing requires server-side processing");
  } catch (error) {
    console.error('PDF extraction error:', error);
    return "";
  }
};

interface ScriptAnalysis {
  id: string;
  scriptText: string;
  genre: string;
  tone: string;
  characterCount: number;
  selectedDirectors: string[];
  analysisResult: {
    sceneSynopsis: string;
    castOfCharacters: Array<{
      name: string;
      description: string;
      role: string;
    }>;
    characterDescriptions: Array<{
      name: string;
      personality: string;
      motivation: string;
      arcTrajectory: string;
    }>;
    emotionalBeats: string[];
    characterMotivations: string[];
    directorNotes: string[];
    castingTips: string[];
    technicalRequirements: string[];
    estimatedDuration: string;
    difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
    keyMoments: string[];
    directorInsights?: string[];
  } | null;
  createdAt: Date;
}

const ScriptAnalysis = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<ScriptAnalysis[]>([]);
  const [currentScript, setCurrentScript] = useState({
    scriptText: "",
    genre: "",
    tone: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { processFile, isProcessing: isProcessingFile } = useOCRUpload();
  const [selectedAnalysis, setSelectedAnalysis] = useState<ScriptAnalysis | null>(null);
  const [selectedDirectors, setSelectedDirectors] = useState<string[]>([]);

  const genres = [
    "Drama", "Comedy", "Action", "Thriller", "Horror", "Romance", 
    "Sci-Fi", "Fantasy", "Mystery", "Documentary", "Musical"
  ];

  const tones = [
    "Serious", "Light-hearted", "Dark", "Uplifting", "Suspenseful", 
    "Melancholic", "Energetic", "Intimate", "Epic", "Mysterious"
  ];

  const directors = [
    "Christopher Nolan", "Steven Spielberg", "Quentin Tarantino", 
    "Denis Villeneuve", "Greta Gerwig", "Jordan Peele"
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processFile(
      file,
      (result) => {
        setCurrentScript(prev => ({ ...prev, scriptText: result.text }));
      },
      (error) => {
        console.error('File processing error:', error);
      }
    );
  };

  const countCharacters = (text: string): number => {
    const characterNames = text.match(/^[A-Z][A-Z\s]+$/gm) || [];
    return new Set(characterNames.map(name => name.trim())).size;
  };

  const generateMockAnalysis = (script: typeof currentScript) => {
    return {
      sceneSynopsis: `A compelling ${script.genre.toLowerCase()} scene that explores ${script.tone.toLowerCase()} themes through character interaction and conflict.`,
      castOfCharacters: [
        {
          name: "Main Character",
          description: "The central figure driving the scene's narrative",
          role: "protagonist"
        },
        {
          name: "Supporting Character",
          description: "Provides counterpoint and conflict to the main character",
          role: "supporting"
        }
      ],
      characterDescriptions: [
        {
          name: "Main Character",
          personality: "Complex and driven with internal contradictions",
          motivation: "Seeks resolution to their central conflict",
          arcTrajectory: "Moves from uncertainty toward decisive action"
        },
        {
          name: "Supporting Character",
          personality: "Acts as catalyst for main character's development",
          motivation: "Challenges protagonist's assumptions",
          arcTrajectory: "Reveals hidden depths as scene progresses"
        }
      ],
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
      toast.error("Please enter script text or upload a file to analyze");
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-script', {
        body: {
          scriptText: currentScript.scriptText,
          genre: currentScript.genre,
          tone: currentScript.tone,
          selectedDirectors
        }
      });

      if (error) {
        console.error('Script analysis error:', error);
        const errorMessage = error.message || error.toString();
        
        // Check if this is a retryable error
        if (errorMessage.includes('temporarily overloaded') || errorMessage.includes('try again') || errorMessage.includes('Rate limit')) {
          toast.error("AI service is temporarily busy. Please try analyzing again in a few moments.");
        } else {
          toast.error(`Failed to analyze script: ${errorMessage}`);
        }
        return;
      }

      if (data?.analysis) {
        const newAnalysis: ScriptAnalysis = {
          id: Date.now().toString(),
          scriptText: currentScript.scriptText,
          genre: currentScript.genre,
          tone: currentScript.tone,
          characterCount: countCharacters(currentScript.scriptText),
          selectedDirectors,
          analysisResult: data.analysis,
          createdAt: new Date()
        };

        setAnalyses(prev => [newAnalysis, ...prev]);
        setSelectedAnalysis(newAnalysis);

        toast.success("Your script has been analyzed with AI insights");
      }
    } catch (error) {
      console.error('Error analyzing script:', error);
      toast.error("Failed to analyze script. Please try again.");
    } finally {
      setIsAnalyzing(false);
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

  const exportAnalysisToPDF = () => {
    if (!selectedAnalysis?.analysisResult) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Script Analysis Report', margin, yPosition);
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

    // Scene Synopsis
    if (selectedAnalysis.analysisResult.sceneSynopsis) {
      pdf.setFontSize(14);
      pdf.text('Scene Synopsis', margin, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      const synopsisLines = pdf.splitTextToSize(selectedAnalysis.analysisResult.sceneSynopsis, pageWidth - 2 * margin);
      pdf.text(synopsisLines, margin, yPosition);
      yPosition += synopsisLines.length * 5 + 10;
    }

    // Cast of Characters
    if (selectedAnalysis.analysisResult.castOfCharacters?.length > 0) {
      pdf.setFontSize(14);
      pdf.text('Cast of Characters', margin, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      selectedAnalysis.analysisResult.castOfCharacters.forEach((character) => {
        const characterText = `${character.name} (${character.role}): ${character.description}`;
        const lines = pdf.splitTextToSize(characterText, pageWidth - 2 * margin);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 5 + 3;
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = margin;
        }
      });
      yPosition += 10;
    }

    // Character Descriptions
    if (selectedAnalysis.analysisResult.characterDescriptions?.length > 0) {
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.setFontSize(14);
      pdf.text('Character Analysis', margin, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      selectedAnalysis.analysisResult.characterDescriptions.forEach((character) => {
        pdf.setFontSize(12);
        pdf.text(character.name, margin, yPosition);
        yPosition += 7;
        pdf.setFontSize(10);
        
        const personalityLines = pdf.splitTextToSize(`• Personality: ${character.personality}`, pageWidth - 2 * margin);
        pdf.text(personalityLines, margin, yPosition);
        yPosition += personalityLines.length * 5;
        
        const motivationLines = pdf.splitTextToSize(`• Motivation: ${character.motivation}`, pageWidth - 2 * margin);
        pdf.text(motivationLines, margin, yPosition);
        yPosition += motivationLines.length * 5;
        
        const arcLines = pdf.splitTextToSize(`• Arc Trajectory: ${character.arcTrajectory}`, pageWidth - 2 * margin);
        pdf.text(arcLines, margin, yPosition);
        yPosition += arcLines.length * 5 + 8;
        
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = margin;
        }
      });
      yPosition += 10;
    }

    // Emotional Beats
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.setFontSize(14);
    pdf.text('Emotional Beats', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(10);
    selectedAnalysis.analysisResult.emotionalBeats.forEach((beat, index) => {
      const lines = pdf.splitTextToSize(`${index + 1}. ${beat}`, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5;
    });
    yPosition += 10;

    // Character Motivations
    pdf.setFontSize(14);
    pdf.text('Character Motivations', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(10);
    selectedAnalysis.analysisResult.characterMotivations.forEach((motivation, index) => {
      const lines = pdf.splitTextToSize(`• ${motivation}`, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5;
    });
    yPosition += 10;

    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }

    // Director Notes
    pdf.setFontSize(14);
    pdf.text('Director Notes', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(10);
    selectedAnalysis.analysisResult.directorNotes.forEach((note, index) => {
      const lines = pdf.splitTextToSize(`• ${note}`, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5;
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = margin;
      }
    });

    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }

    // Casting Tips
    pdf.setFontSize(14);
    pdf.text('Casting Tips', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(10);
    selectedAnalysis.analysisResult.castingTips.forEach((tip, index) => {
      const lines = pdf.splitTextToSize(`• ${tip}`, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5;
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = margin;
      }
    });

    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }

    // Technical Requirements
    pdf.setFontSize(14);
    pdf.text('Technical Requirements', margin, yPosition);
    yPosition += 10;
    pdf.setFontSize(10);
    selectedAnalysis.analysisResult.technicalRequirements.forEach((req, index) => {
      const lines = pdf.splitTextToSize(`• ${req}`, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 5;
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = margin;
      }
    });

    // Save the PDF
    pdf.save(`script-analysis-${selectedAnalysis.genre || 'untitled'}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success("Script analysis has been exported successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={() => navigate('/toolbox')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Toolbox
              </Button>
              
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">Script Analysis</h1>
              </div>
              
              <div></div> {/* Spacer for flexbox alignment */}
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your script or paste text to get AI-powered analysis for character development, 
              emotional beats, and director's insights.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              We only allow scene by scene analyzing and not full scripts.
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

                  {/* Director Selection */}
                  <div className="space-y-2">
                    <Label>Director Inspiration (Optional)</Label>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Select directors whose styles should inspire the analysis
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {directors.map((director) => (
                          <Badge
                            key={director}
                            variant={selectedDirectors.includes(director) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => {
                              setSelectedDirectors(prev => 
                                prev.includes(director) 
                                  ? prev.filter(d => d !== director)
                                  : [...prev, director]
                              );
                            }}
                          >
                            {director}
                          </Badge>
                        ))}
                      </div>
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Analysis Results
                    </CardTitle>
                    <Button onClick={exportAnalysisToPDF} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Scene Synopsis */}
                  {selectedAnalysis.analysisResult.sceneSynopsis && (
                    <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                        📖 Scene Synopsis
                      </h3>
                      <p className="text-sm leading-relaxed">{selectedAnalysis.analysisResult.sceneSynopsis}</p>
                    </div>
                  )}

                  {/* Cast of Characters */}
                  {selectedAnalysis.analysisResult.castOfCharacters && selectedAnalysis.analysisResult.castOfCharacters.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        🎭 Cast of Characters
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedAnalysis.analysisResult.castOfCharacters.map((character, index) => (
                          <Card key={index} className="border border-border/50">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-sm">{character.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {character.role}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{character.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Character Descriptions */}
                  {selectedAnalysis.analysisResult.characterDescriptions && selectedAnalysis.analysisResult.characterDescriptions.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        👤 Character Analysis
                      </h3>
                      <div className="space-y-4">
                        {selectedAnalysis.analysisResult.characterDescriptions.map((character, index) => (
                          <Card key={index} className="border border-border/50">
                            <CardContent className="p-4">
                              <h4 className="font-medium text-sm mb-3">{character.name}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                <div>
                                  <span className="font-medium text-primary">Personality:</span>
                                  <p className="mt-1 text-muted-foreground">{character.personality}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-primary">Motivation:</span>
                                  <p className="mt-1 text-muted-foreground">{character.motivation}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-primary">Arc Trajectory:</span>
                                  <p className="mt-1 text-muted-foreground">{character.arcTrajectory}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

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
                    {/* Director Insights */}
                    {selectedAnalysis.analysisResult.directorInsights && selectedAnalysis.analysisResult.directorInsights.length > 0 && (
                      <div className="space-y-4 col-span-1 md:col-span-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          🎬 Director Insights
                        </h3>
                        <div className="grid gap-3">
                          {selectedAnalysis.analysisResult.directorInsights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                              <span className="text-primary font-semibold min-w-[2rem] text-center">
                                {index + 1}
                              </span>
                              <p className="text-sm text-muted-foreground flex-1">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Directors Display */}
                  {selectedAnalysis.selectedDirectors && selectedAnalysis.selectedDirectors.length > 0 && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Analysis inspired by:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalysis.selectedDirectors.map((director) => (
                          <Badge key={director} variant="secondary">
                            {director}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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