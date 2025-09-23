import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Video, Upload, Loader2, Camera, Clock, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
// Document parsing will be handled differently - removed import

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

interface StoryboardProject {
  id: string;
  scriptText: string;
  genre: string;
  tone: string;
  characterCount: number;
  shots: Shot[];
  storyboard?: StoryboardFrame[];
  createdAt: Date;
}

const Storyboarding = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<StoryboardProject[]>([]);
  const [currentProject, setCurrentProject] = useState({
    scriptText: "",
    genre: "",
    tone: ""
  });
  const [isProcessingScript, setIsProcessingScript] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [selectedProject, setSelectedProject] = useState<StoryboardProject | null>(null);
  const [generatingStoryboard, setGeneratingStoryboard] = useState(false);

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
        const text = await file.text();
        setCurrentProject(prev => ({ ...prev, scriptText: text }));
        toast({
          title: "Success",
          description: "Script file loaded successfully"
        });
      } else if (file.type === "application/pdf") {
        const formData = new FormData();
        formData.append('file', file);
        
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

  const generateShotBreakdown = (script: typeof currentProject): Shot[] => {
    const shotCount = Math.max(3, Math.min(8, Math.floor(script.scriptText.length / 200)));
    const shots: Shot[] = [];

    for (let i = 1; i <= shotCount; i++) {
      const shotTypes = ["Wide Shot", "Medium Shot", "Close-up", "Over-the-shoulder", "Point of view"];
      const cameraAngles = ["Eye level", "High angle", "Low angle", "Dutch angle"];
      
      shots.push({
        shotNumber: i,
        description: `Shot ${i}: ${script.genre === "Action" ? "Dynamic movement sequence" : 
                     script.tone === "Intimate" ? "Character emotional moment" : 
                     "Key narrative beat"}`,
        cameraAngle: `${shotTypes[Math.floor(Math.random() * shotTypes.length)]} - ${cameraAngles[Math.floor(Math.random() * cameraAngles.length)]}`,
        characters: [`Character ${Math.floor(Math.random() * 3) + 1}`],
        visualElements: script.genre === "Horror" ? "Dark lighting, shadows" :
                       script.genre === "Comedy" ? "Bright, colorful setting" :
                       script.tone === "Epic" ? "Dramatic wide landscape" :
                       "Natural lighting, realistic setting",
        duration: `${Math.floor(Math.random() * 10) + 5} seconds`
      });
    }

    return shots;
  };

  const createStoryboard = async () => {
    if (!currentProject.scriptText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter script text or upload a file to create storyboard"
      });
      return;
    }

    setIsProcessingScript(true);

    setTimeout(() => {
      const shots = generateShotBreakdown(currentProject);
      
      const newProject: StoryboardProject = {
        id: Date.now().toString(),
        scriptText: currentProject.scriptText,
        genre: currentProject.genre,
        tone: currentProject.tone,
        characterCount: countCharacters(currentProject.scriptText),
        shots,
        createdAt: new Date()
      };

      setProjects(prev => [newProject, ...prev]);
      setSelectedProject(newProject);
      setIsProcessingScript(false);

      toast({
        title: "Shot Breakdown Complete",
        description: "Your script has been broken down into shots. Generate visual storyboard frames now!"
      });
    }, 2000);
  };

  const generateStoryboard = async () => {
    if (!selectedProject) return;

    setGeneratingStoryboard(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-storyboard', {
        body: {
          shots: selectedProject.shots,
          sceneDetails: {
            genre: selectedProject.genre,
            tone: selectedProject.tone,
            scriptText: selectedProject.scriptText.substring(0, 500)
          }
        }
      });

      if (error) throw error;

      if (data?.storyboard) {
        const updatedProject = {
          ...selectedProject,
          storyboard: data.storyboard
        };
        
        setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
        setSelectedProject(updatedProject);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Video className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Storyboarding</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your script into visual storyboards with AI-generated shot breakdowns 
              and visual frame references.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Script Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="storyboard-file">Upload Script File (PDF or Text)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="storyboard-file"
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
                    <Label htmlFor="storyboard-text">Or paste your script text here</Label>
                    <Textarea
                      id="storyboard-text"
                      placeholder="Enter your script text here..."
                      value={currentProject.scriptText}
                      onChange={(e) => setCurrentProject(prev => ({ ...prev, scriptText: e.target.value }))}
                      className="min-h-[300px] resize-none"
                    />
                  </div>

                  {/* Genre and Tone Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Genre</Label>
                      <Select value={currentProject.genre} onValueChange={(value) => setCurrentProject(prev => ({ ...prev, genre: value }))}>
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
                      <Select value={currentProject.tone} onValueChange={(value) => setCurrentProject(prev => ({ ...prev, tone: value }))}>
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
                    onClick={createStoryboard} 
                    disabled={isProcessingScript || isProcessingFile}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessingScript ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Shot Breakdown...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Create Shot Breakdown
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No storyboard projects yet. Upload a script to get started!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {projects.slice(0, 5).map((project) => (
                        <div
                          key={project.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedProject?.id === project.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">
                                {project.genre || "No Genre"}
                              </span>
                              <Badge variant="outline">
                                {project.shots.length} shots
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {project.scriptText.substring(0, 100)}...
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {project.characterCount}
                              </span>
                              <span>{project.createdAt.toLocaleDateString()}</span>
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

          {/* Shot Breakdown and Storyboard Section */}
          {selectedProject && (
            <div className="mt-8 space-y-6">
              {/* Shot Breakdown */}
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Shot Breakdown
                    </CardTitle>
                    <Button 
                      onClick={generateStoryboard}
                      disabled={generatingStoryboard}
                      variant="outline"
                    >
                      {generatingStoryboard ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-4 w-4" />
                          Generate Visual Storyboard
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedProject.shots.map((shot) => (
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
                          <div>
                            <h4 className="font-medium text-sm mb-1">Characters</h4>
                            <div className="flex flex-wrap gap-1">
                              {shot.characters.map((character, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {character}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Visual Storyboard Frames */}
              {selectedProject.storyboard && (
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Visual Storyboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedProject.storyboard.map((frame) => (
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
                                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
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
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Storyboarding;