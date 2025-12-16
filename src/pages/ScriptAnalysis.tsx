import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, FileText, Upload, Film, Users, Heart, Star, Lightbulb, Target, Clock, Download, Loader2, ArrowLeft, AlertTriangle, CheckCircle, Shield, MessageSquare, X, Send, Pencil, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useOCRUpload } from '@/hooks/useOCRUpload';
import { useScriptAnalysis } from '@/hooks/useScriptAnalysis';
import { ToolPageRecommendations } from '@/components/training/ToolPageRecommendations';
import { PDFUploadProgress } from '@/components/PDFUploadProgress';
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

interface ScriptAnalysisLocal {
  id: string;
  scriptText: string;
  genre: string;
  tone: string;
  characterCount: number;
  selectedDirectors: string[];
  confidenceScore?: number;
  isAiGenerated?: boolean;
  createdAt: Date;
  analysisResult: {
    sceneSynopsis: string;
    castOfCharacters: Array<{
      name: string;
      description: string;
      role: string;
      objective?: string;
      fear?: string;
    }>;
    characterDescriptions: Array<{
      name: string;
      personality: string;
      motivation: string;
      arcTrajectory: string;
    }>;
    emotionalBeats: string[];
    visualSuggestions?: string[];
    soundAndPacing?: string[];
    stakesAndPurpose?: string[];
    characterMotivations: string[];
    directorNotes: string[];
    castingTips: string[];
    technicalRequirements: string[];
    estimatedDuration: string;
    difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
    keyMoments: string[];
    directorInsights?: string[];
  } | null;
}

const ScriptAnalysis = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { analyses, loading, saveAnalysis, deleteAnalysis } = useScriptAnalysis();
  const [currentScript, setCurrentScript] = useState({
    scriptText: "",
    genre: "",
    tone: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisElapsedTime, setAnalysisElapsedTime] = useState(0);
  const { 
    processFile, 
    isProcessing: isProcessingFile,
    currentStage,
    currentFileName,
    currentFileSize,
    elapsedTime,
    progress
  } = useOCRUpload();
  const [selectedAnalysis, setSelectedAnalysis] = useState<ScriptAnalysisLocal | null>(null);
  const [selectedDirectors, setSelectedDirectors] = useState<string[]>([]);
  const [quickQuestion, setQuickQuestion] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatInputRef = useRef<HTMLDivElement>(null);
  const [characterNotes, setCharacterNotes] = useState<Record<string, string>>({});
  const [editingCharacter, setEditingCharacter] = useState<{name: string, notes: string} | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);

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

  // Track elapsed time during AI analysis
  useEffect(() => {
    if (!isAnalyzing) return;
    
    const interval = setInterval(() => {
      setAnalysisElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processFile(
      file,
      (result) => {
        setCurrentScript(prev => ({ ...prev, scriptText: result.text }));
        toast.success(`Extracted ${result.text.length} characters from "${file.name}". Please review the text before analyzing.`);
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
    // Extract actual character names from the script
    const characterMatches = script.scriptText.match(/^[A-Z][A-Z\s]+$/gm) || [];
    const uniqueCharacters = Array.from(new Set(characterMatches.map(name => name.trim())));
    
    const castOfCharacters = uniqueCharacters.slice(0, 5).map((name, index) => ({
      name,
      description: index === 0 ? "Primary character in the scene" : "Character in the scene",
      role: index === 0 ? "protagonist" : "supporting"
    }));

    return {
      sceneSynopsis: `This ${script.genre.toLowerCase()} scene features ${uniqueCharacters.length} character${uniqueCharacters.length !== 1 ? 's' : ''} with a ${script.tone.toLowerCase()} tone.`,
      castOfCharacters: castOfCharacters.length > 0 ? castOfCharacters : [],
      characterDescriptions: uniqueCharacters.slice(0, 5).map((name, index) => ({
        name,
        personality: "Character analysis requires full AI processing",
        motivation: "Character analysis requires full AI processing",
        arcTrajectory: "Character analysis requires full AI processing"
      })),
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

    if (!userProfile?.user_id) {
      toast.error("Please log in to analyze scripts");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisElapsedTime(0);
    const startTime = Date.now();

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
        // Save to database
        const savedAnalysis = await saveAnalysis(
          currentScript.scriptText,
          currentScript.genre,
          currentScript.tone,
          selectedDirectors,
          data.analysis,
          data.confidenceScore || 0.5
        );

        if (savedAnalysis) {
          setSelectedAnalysis({
            id: savedAnalysis.id,
            scriptText: savedAnalysis.script_text,
            genre: savedAnalysis.genre || "",
            tone: savedAnalysis.tone || "",
            characterCount: savedAnalysis.character_count,
            selectedDirectors: savedAnalysis.selected_directors || [],
            analysisResult: savedAnalysis.analysis_result,
            confidenceScore: savedAnalysis.confidence_score,
            isAiGenerated: data.isAiGenerated,
            createdAt: new Date(savedAnalysis.created_at)
          });

          toast.success("Your script has been analyzed with AI insights and saved");
        }
      }
    } catch (error) {
      console.error('Error analyzing script:', error);
      toast.error("Failed to analyze script. Please try again.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisElapsedTime(0);
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

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.7) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
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

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-analysis', {
        body: {
          messages: newMessages,
          scriptText: currentScript.scriptText,
          genre: currentScript.genre,
          tone: currentScript.tone,
          selectedDirectors,
          analysisResult: selectedAnalysis?.analysisResult
        }
      });

      if (error) throw error;

      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };
      setChatMessages([...newMessages, assistantMessage]);
      
      // Scroll back to chat input after response
      setTimeout(() => {
        chatInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto relative">

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
                    </div>
                    
                    {/* File Upload Progress */}
                    {isProcessingFile && currentFileName && (
                      <PDFUploadProgress 
                        fileName={currentFileName}
                        fileSize={currentFileSize}
                        stage={currentStage}
                        elapsedTime={elapsedTime}
                        progress={progress}
                      />
                    )}
                  </div>

                  {/* Privacy Statement */}
                  <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg border border-muted">
                    <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your privacy matters. We will never use your scripts, images, likeness, voiceover, or any creative work for training, marketing, or any other purpose. Your content remains yours.
                    </p>
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

                  {/* AI Analysis Progress */}
                  {isAnalyzing && (
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-shrink-0 p-2 rounded-lg bg-purple-500/10">
                              <Brain className="h-6 w-6 text-purple-500 animate-pulse" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">Analyzing your script with AI...</p>
                              <p className="text-xs text-muted-foreground">This may take 30-60 seconds. Please standby.</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono">{analysisElapsedTime}s</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                          <span className="text-sm text-muted-foreground">Processing...</span>
                        </div>
                      </div>
                    </Card>
                  )}

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
                           onClick={() => {
                             setSelectedAnalysis({
                               id: analysis.id,
                               scriptText: analysis.script_text,
                               genre: analysis.genre || "",
                               tone: analysis.tone || "",
                               characterCount: analysis.character_count,
                               selectedDirectors: analysis.selected_directors || [],
                               analysisResult: analysis.analysis_result,
                               confidenceScore: analysis.confidence_score || 0.5,
                               isAiGenerated: true,
                               createdAt: new Date(analysis.created_at)
                             });
                             // Also populate input for editing
                             setCurrentScript({
                               scriptText: analysis.script_text,
                               genre: analysis.genre || "",
                               tone: analysis.tone || ""
                             });
                             setSelectedDirectors(analysis.selected_directors || []);
                           }}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">
                                {analysis.genre || "No Genre"}
                              </span>
                              <Badge className={getDifficultyColor(analysis.analysis_result?.difficultyLevel || "Beginner")}>
                                {analysis.analysis_result?.difficultyLevel || "Beginner"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {analysis.script_text.substring(0, 100)}...
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{analysis.character_count} characters</span>
                              <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Training Recommendations */}
              <ToolPageRecommendations 
                toolName="script-analysis"
                maxCourses={2}
              />
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
                  {/* Extracted Scene Text - Show what was analyzed */}
                  {selectedAnalysis.scriptText && (
                    <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="scene-text" className="border-none">
                          <AccordionTrigger className="hover:no-underline py-2">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                              <FileText className="h-4 w-4" />
                              Extracted Scene Text (OCR Result)
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <pre className="whitespace-pre-wrap text-sm text-foreground/80 max-h-[300px] overflow-y-auto p-3 bg-background rounded border mt-2">
                              {selectedAnalysis.scriptText}
                            </pre>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}

                  {/* Error State - AI couldn't analyze properly */}
                  {selectedAnalysis.analysisResult.sceneSynopsis?.toLowerCase().includes("don't have") && (
                    <div className="mb-6 p-5 bg-destructive/10 rounded-lg border-2 border-destructive/30">
                      <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Analysis Issue
                      </h3>
                      <p className="text-sm mb-4">
                        The AI couldn't properly analyze this scene. This usually happens when:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1 mb-4 text-muted-foreground">
                        <li>The OCR extraction didn't capture the text correctly</li>
                        <li>The uploaded file was an image/scan with poor quality</li>
                        <li>The script format wasn't recognized</li>
                      </ul>
                      <p className="text-sm font-medium">
                        Check the "Extracted Scene Text" section above to verify what was captured, 
                        then edit it in the input area and re-analyze.
                      </p>
                    </div>
                  )}

                  {/* Scene Summary - Now at Top (only show if analysis succeeded) */}
                  {selectedAnalysis.analysisResult.sceneSynopsis && 
                   !selectedAnalysis.analysisResult.sceneSynopsis.toLowerCase().includes("don't have") && (
                    <div className="mb-6 p-5 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-foreground">
                        📖 Scene Summary
                      </h3>
                      <p className="text-base leading-relaxed">{selectedAnalysis.analysisResult.sceneSynopsis}</p>
                    </div>
                  )}

                  {/* Characters in Scene */}
                  {selectedAnalysis.analysisResult.castOfCharacters && selectedAnalysis.analysisResult.castOfCharacters.length > 0 && (
                    <div className="mb-6 p-4 bg-accent/30 rounded-lg border border-accent">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-foreground">
                        <Users className="h-4 w-4" />
                        Characters in This Scene
                      </h3>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {selectedAnalysis.analysisResult.castOfCharacters.map((character, index) => (
                          <div 
                            key={index}
                            className="flex-shrink-0 px-4 py-3 bg-background rounded-md border border-border/50 min-w-[240px] space-y-1"
                          >
                            <div className="font-semibold text-base mb-1">{character.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {character.objective || character.role}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Director Questions - Only show if analysis succeeded */}
                  {selectedAnalysis.analysisResult.sceneSynopsis && 
                   !selectedAnalysis.analysisResult.sceneSynopsis.toLowerCase().includes("don't have") &&
                   !selectedAnalysis.analysisResult.sceneSynopsis.toLowerCase().includes("please paste") && (
                    <div className="mb-6">
                      <Card className="bg-accent/30 border-accent">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Quick Director Questions
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Click any question to explore this aspect of your scene
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {[
                            "What is the primary dramatic purpose of this scene?",
                            "How do power dynamics shift between characters?",
                            "What visual language best serves the emotional truth?",
                            "Where should the camera be to maximize impact?",
                            "What key moments anchor this scene's arc?"
                          ].map((question, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setChatInput(question);
                              }}
                              className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
                            >
                              {question}
                            </button>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Inline Chat Interface */}
                  <div className="mb-6">
                    <Card className="bg-card border-border">
                      <CardHeader className="bg-primary/10 border-b border-border">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Ask About Your Scene</CardTitle>
                        </div>
                        <CardDescription className="text-sm">
                          Ask me anything about your scene, characters, or directorial approach!
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[300px] p-4">
                          {chatMessages.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">Type a question below or click one of the quick questions above</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {chatMessages.map((msg, idx) => (
                                <div
                                  key={idx}
                                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                      msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-foreground'
                                    }`}
                                  >
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                  </div>
                                </div>
                              ))}
                              {chatLoading && (
                                <div className="flex justify-start">
                                  <div className="bg-muted rounded-lg px-4 py-2">
                                    <div className="flex gap-1">
                                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </ScrollArea>
                        <div ref={chatInputRef} className="border-t border-border p-4">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              sendChatMessage();
                            }}
                            className="flex gap-2"
                          >
                            <Input
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Ask about characters, pacing, visuals..."
                              disabled={chatLoading}
                              className="flex-1"
                            />
                            <Button type="submit" disabled={chatLoading || !chatInput.trim()} size="icon">
                              <Send className="w-4 h-4" />
                            </Button>
                          </form>
                        </div>
                      </CardContent>
                    </Card>
                  </div>



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
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {character.role}
                                  </Badge>
                                  <Dialog open={noteDialogOpen && editingCharacter?.name === character.name} onOpenChange={(open) => {
                                    setNoteDialogOpen(open);
                                    if (!open) setEditingCharacter(null);
                                  }}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 w-7 p-0"
                                        onClick={() => {
                                          setEditingCharacter({
                                            name: character.name,
                                            notes: characterNotes[character.name] || ''
                                          });
                                          setNoteDialogOpen(true);
                                        }}
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Director Notes: {character.name}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <Textarea
                                          placeholder="Add your director notes for this character..."
                                          value={editingCharacter?.notes || ''}
                                          onChange={(e) => setEditingCharacter(prev => prev ? {...prev, notes: e.target.value} : null)}
                                          rows={6}
                                        />
                                        <Button 
                                          onClick={() => {
                                            if (editingCharacter) {
                                              setCharacterNotes(prev => ({
                                                ...prev,
                                                [editingCharacter.name]: editingCharacter.notes
                                              }));
                                              toast.success('Director notes saved');
                                            }
                                            setNoteDialogOpen(false);
                                            setEditingCharacter(null);
                                          }}
                                          className="w-full"
                                        >
                                          Save Notes
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{character.description}</p>
                              {characterNotes[character.name] && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <p className="text-xs font-medium mb-1">Director Notes:</p>
                                  <p className="text-xs text-muted-foreground whitespace-pre-wrap">{characterNotes[character.name]}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accordion Sections */}
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="space-y-4">
                      {/* Emotional Beats */}
                      {selectedAnalysis.analysisResult.emotionalBeats && selectedAnalysis.analysisResult.emotionalBeats.length > 0 && (
                        <AccordionItem value="emotional-beats" className="border rounded-lg bg-card">
                          <AccordionTrigger className="px-6 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                                <span className="text-xl">🎭</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold">Emotional Beats</h3>
                                <p className="text-sm text-muted-foreground">Opening establishes character and world</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-4 pt-2">
                              {selectedAnalysis.analysisResult.emotionalBeats.map((beat, index) => (
                                <div key={index} className="flex gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <p className="text-sm pt-1">{beat}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {/* Director Notes */}
                      {selectedAnalysis.analysisResult.directorNotes && selectedAnalysis.analysisResult.directorNotes.length > 0 && (
                        <AccordionItem value="director-notes" className="border rounded-lg bg-card">
                          <AccordionTrigger className="px-6 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <span className="text-xl">🎬</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold">Director's Notes</h3>
                                <p className="text-sm text-muted-foreground">Focus on visual storytelling over exposition</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-3 pt-2">
                              {selectedAnalysis.analysisResult.directorNotes.map((note, index) => (
                                <div key={index} className="flex gap-3">
                                  <span className="text-primary mt-1">•</span>
                                  <p className="text-sm">{note}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {/* Character Motivations */}
                      {selectedAnalysis.analysisResult.characterMotivations && selectedAnalysis.analysisResult.characterMotivations.length > 0 && (
                        <AccordionItem value="character-motivations" className="border rounded-lg bg-card">
                          <AccordionTrigger className="px-6 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <span className="text-xl">🎯</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold">Character Motivations</h3>
                                <p className="text-sm text-muted-foreground">Protagonist driven by clear goal or need</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-3 pt-2">
                              {selectedAnalysis.analysisResult.characterMotivations.map((motivation, index) => (
                                <div key={index} className="flex gap-3">
                                  <span className="text-primary mt-1">•</span>
                                  <p className="text-sm">{motivation}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {/* Casting Tips */}
                      {selectedAnalysis.analysisResult.castingTips && selectedAnalysis.analysisResult.castingTips.length > 0 && (
                        <AccordionItem value="casting-tips" className="border rounded-lg bg-card">
                          <AccordionTrigger className="px-6 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <span className="text-xl">👥</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold">Casting Tips</h3>
                                <p className="text-sm text-muted-foreground">Look for actors who can convey subtext</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-3 pt-2">
                              {selectedAnalysis.analysisResult.castingTips.map((tip, index) => (
                                <div key={index} className="flex gap-3">
                                  <span className="text-primary mt-1">•</span>
                                  <p className="text-sm">{tip}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {/* Technical Requirements */}
                      {selectedAnalysis.analysisResult.technicalRequirements && selectedAnalysis.analysisResult.technicalRequirements.length > 0 && (
                        <AccordionItem value="technical-requirements" className="border rounded-lg bg-card">
                          <AccordionTrigger className="px-6 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <span className="text-xl">⚙️</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold">Technical Requirements</h3>
                                <p className="text-sm text-muted-foreground">Standard lighting and camera equipment</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-3 pt-2">
                              {selectedAnalysis.analysisResult.technicalRequirements.map((req, index) => (
                                <div key={index} className="flex gap-3">
                                  <span className="text-primary mt-1">•</span>
                                  <p className="text-sm">{req}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {/* Key Moments */}
                      {selectedAnalysis.analysisResult.keyMoments && selectedAnalysis.analysisResult.keyMoments.length > 0 && (
                        <AccordionItem value="key-moments" className="border rounded-lg bg-card">
                          <AccordionTrigger className="px-6 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <span className="text-xl">⭐</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold">Key Moments</h3>
                                <p className="text-sm text-muted-foreground">Opening hook</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-3 pt-2">
                              {selectedAnalysis.analysisResult.keyMoments.map((moment, index) => (
                                <div key={index} className="flex gap-3">
                                  <span className="text-primary mt-1">•</span>
                                  <p className="text-sm">{moment}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
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