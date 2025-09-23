import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Video, FileText, Users, Target, Lightbulb, Clock, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

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
      setCurrentScene({ sceneText: "", genre: "", tone: "" });
      setIsAnalyzing(false);

      toast({
        title: "Analysis Complete",
        description: "Scene has been analyzed successfully"
      });
    }, 3000);
  };

  const countCharacters = (text: string): number => {
    const lines = text.split('\n');
    const characters = new Set<string>();
    
    lines.forEach(line => {
      const match = line.match(/^([A-Z][A-Z\s]+):/);
      if (match) {
        characters.add(match[1].trim());
      }
    });
    
    return characters.size;
  };

  const generateMockAnalysis = (scene: any) => {
    const difficultyMap: { [key: string]: "Beginner" | "Intermediate" | "Advanced" } = {
      "Dark": "Advanced",
      "Suspenseful": "Advanced", 
      "Light-hearted": "Beginner",
      "Uplifting": "Beginner"
    };

    // Generate shot breakdown
    const shots: Shot[] = [
      {
        shotNumber: 1,
        description: "Establishing shot of the location",
        cameraAngle: "Wide shot",
        characters: [],
        visualElements: "Setting, environment, mood establishment",
        duration: "5-8 seconds"
      },
      {
        shotNumber: 2,
        description: "Character introduction or entrance",
        cameraAngle: "Medium shot",
        characters: ["Main character"],
        visualElements: "Character costume, posture, facial expression",
        duration: "3-5 seconds"
      },
      {
        shotNumber: 3,
        description: "Dialogue or action sequence",
        cameraAngle: "Close-up",
        characters: ["Main character", "Secondary character"],
        visualElements: "Facial expressions, emotions, props",
        duration: "10-15 seconds"
      },
      {
        shotNumber: 4,
        description: "Reaction shot",
        cameraAngle: "Medium close-up",
        characters: ["Secondary character"],
        visualElements: "Emotional response, body language",
        duration: "3-5 seconds"
      },
      {
        shotNumber: 5,
        description: "Resolution or transition shot",
        cameraAngle: "Wide shot or Medium shot",
        characters: ["All present characters"],
        visualElements: "Final positioning, scene conclusion",
        duration: "5-8 seconds"
      }
    ];
    
    return {
      emotionalBeats: [
        "Opening tension builds as characters enter",
        "Conflict escalates through dialogue",
        "Emotional peak during confrontation",
        "Resolution and character growth moment"
      ],
      characterMotivations: [
        "Protagonist seeks validation from authority figure",
        "Antagonist driven by fear of abandonment",
        "Supporting character provides comic relief and wisdom"
      ],
      directorNotes: [
        "Use close-ups during emotional reveals",
        "Consider lighting changes to reflect mood shifts",
        "Allow for natural pauses in dialogue",
        "Block characters to show power dynamics"
      ],
      castingTips: [
        "Look for actors with strong emotional range",
        "Chemistry reading essential for all characters",
        "Consider age dynamics for authenticity",
        "Improvisational skills beneficial for this scene"
      ],
      technicalRequirements: [
        "Intimate lighting setup required",
        "Multiple camera angles for coverage",
        "Sound design for emotional emphasis",
        "Minimal props but effective use of space"
      ],
      estimatedDuration: "3-5 minutes",
      difficultyLevel: difficultyMap[scene.tone] || "Intermediate",
      keyMoments: [
        "Character revelation at line 15",
        "Physical action sequence",
        "Emotional climax dialogue",
        "Silent moment of realization"
      ],
      shots
    };
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const generateStoryboard = async () => {
    if (!selectedAnalysis) return;

    setGeneratingStoryboard(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-storyboard', {
        body: {
          shots: selectedAnalysis.analysisResult?.shots,
          genre: selectedAnalysis.genre,
          tone: selectedAnalysis.tone
        }
      });

      if (error) throw error;

      if (data?.success && data?.storyboard) {
        // Update the selected analysis with storyboard data
        const updatedAnalysis = {
          ...selectedAnalysis,
          storyboard: data.storyboard
        };
        
        setSelectedAnalysis(updatedAnalysis);
        
        // Update the analyses array
        setAnalyses(prev => prev.map(analysis => 
          analysis.id === selectedAnalysis.id ? updatedAnalysis : analysis
        ));

        toast({
          title: "Storyboard Generated",
          description: `Successfully generated ${data.storyboard.length} storyboard frames`
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

  return (
    <Layout userRole={userProfile?.role?.toUpperCase()}>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Scene Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="scene-text">Scene Script</Label>
                  <Textarea
                    id="scene-text"
                    placeholder={`Enter your scene here...

Example:
JOHN: (nervously) I never meant for this to happen.
SARAH: (angry) But it did happen, John! And now we have to deal with it.
JOHN: (pleading) Please, just give me another chance.
SARAH: (softening) I... I don't know if I can.`}
                    value={currentScene.sceneText}
                    onChange={(e) => setCurrentScene(prev => ({ ...prev, sceneText: e.target.value }))}
                    className="min-h-[200px] font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Select value={currentScene.genre} onValueChange={(value) => 
                      setCurrentScene(prev => ({ ...prev, genre: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map(genre => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={currentScene.tone} onValueChange={(value) => 
                      setCurrentScene(prev => ({ ...prev, tone: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map(tone => (
                          <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={analyzeScene} 
                  disabled={isAnalyzing || !currentScene.sceneText.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Scene...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze Scene
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Previous Analyses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Analyses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No analyses yet. Analyze your first scene above.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {analyses.slice(0, 5).map((analysis) => (
                      <div
                        key={analysis.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedAnalysis?.id === analysis.id 
                            ? "bg-primary/10 border border-primary" 
                            : "bg-muted hover:bg-muted/80"
                        }`}
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{analysis.genre} Scene</p>
                            <p className="text-sm text-muted-foreground">
                              {analysis.characterCount} characters • {analysis.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getDifficultyColor(analysis.analysisResult?.difficultyLevel || "")}>
                            {analysis.analysisResult?.difficultyLevel}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {selectedAnalysis ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Analysis Results
                  </CardTitle>
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

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Duration Estimate</Label>
                          <p className="text-lg font-semibold">{selectedAnalysis.analysisResult?.estimatedDuration}</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Difficulty Level</Label>
                          <Badge className={getDifficultyColor(selectedAnalysis.analysisResult?.difficultyLevel || "")}>
                            {selectedAnalysis.analysisResult?.difficultyLevel}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label>Emotional Beats</Label>
                        <ul className="mt-2 space-y-1">
                          {selectedAnalysis.analysisResult?.emotionalBeats.map((beat, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-sm text-muted-foreground">{index + 1}.</span>
                              <span className="text-sm">{beat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <Label>Key Moments</Label>
                        <ul className="mt-2 space-y-1">
                          {selectedAnalysis.analysisResult?.keyMoments.map((moment, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Star className="h-4 w-4 mt-0.5 text-yellow-500" />
                              <span className="text-sm">{moment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="directing" className="space-y-4">
                      <div>
                        <Label>Director Notes</Label>
                        <ul className="mt-2 space-y-2">
                          {selectedAnalysis.analysisResult?.directorNotes.map((note, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
                              <span className="text-sm">{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <Label>Character Motivations</Label>
                        <ul className="mt-2 space-y-2">
                          {selectedAnalysis.analysisResult?.characterMotivations.map((motivation, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Users className="h-4 w-4 mt-0.5 text-blue-500" />
                              <span className="text-sm">{motivation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="casting" className="space-y-4">
                      <div>
                        <Label>Casting Tips</Label>
                        <ul className="mt-2 space-y-2">
                          {selectedAnalysis.analysisResult?.castingTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Target className="h-4 w-4 mt-0.5 text-green-500" />
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="technical" className="space-y-4">
                      <div>
                        <Label>Technical Requirements</Label>
                        <ul className="mt-2 space-y-2">
                          {selectedAnalysis.analysisResult?.technicalRequirements.map((requirement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Video className="h-4 w-4 mt-0.5 text-purple-500" />
                              <span className="text-sm">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="storyboard" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Shot Breakdown</h4>
                          {!selectedAnalysis.storyboard && (
                            <Button 
                              onClick={generateStoryboard}
                              disabled={generatingStoryboard}
                              className="bg-primary hover:bg-primary/90"
                            >
                              {generatingStoryboard ? 'Generating...' : 'Generate Storyboard'}
                            </Button>
                          )}
                        </div>

                        {/* Shot Breakdown Table */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-muted/50 px-4 py-2 font-medium text-sm border-b">
                            Scene Shots ({selectedAnalysis.analysisResult?.shots?.length || 0} total)
                          </div>
                          <div className="divide-y">
                            {selectedAnalysis.analysisResult?.shots?.map((shot, index) => (
                              <div key={index} className="p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">Shot {shot.shotNumber}</Badge>
                                  <span className="text-sm font-medium">{shot.cameraAngle}</span>
                                  <span className="text-xs text-muted-foreground">({shot.duration})</span>
                                </div>
                                <p className="text-sm">{shot.description}</p>
                                {shot.characters.length > 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    Characters: {shot.characters.join(', ')}
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  Visual: {shot.visualElements}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Storyboard Frames */}
                        {selectedAnalysis.storyboard && (
                          <div className="space-y-4">
                            <h4 className="font-semibold">Visual Storyboard</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {selectedAnalysis.storyboard.map((frame, index) => (
                                <div key={index} className="border rounded-lg overflow-hidden">
                                  <div className="aspect-square bg-muted/50 relative">
                                    {frame.imageData ? (
                                      <img 
                                        src={frame.imageData} 
                                        alt={`Shot ${frame.shotNumber}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        Generating...
                                      </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                      <Badge variant="secondary">Shot {frame.shotNumber}</Badge>
                                    </div>
                                  </div>
                                  <div className="p-3 space-y-2">
                                    <div className="text-sm font-medium">{frame.cameraAngle}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-2">
                                      {frame.description}
                                    </div>
                                    {frame.characters.length > 0 && (
                                      <div className="text-xs text-muted-foreground">
                                        {frame.characters.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {generatingStoryboard && (
                          <div className="text-center py-8">
                            <div className="text-sm text-muted-foreground">
                              Generating storyboard frames... This may take a few moments.
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
    </Layout>
  );
};

export default SceneAnalysis;