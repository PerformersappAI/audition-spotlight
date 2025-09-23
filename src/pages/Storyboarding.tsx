import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Video, Upload, Loader2, Camera, Clock, Users, Edit2, Save, X, Download, RefreshCw, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  const [editingShot, setEditingShot] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Shot>>({});
  const [editingFrame, setEditingFrame] = useState<number | null>(null);
  const [frameEditValues, setFrameEditValues] = useState<Partial<StoryboardFrame>>({});
  const [regeneratingFrame, setRegeneratingFrame] = useState<number | null>(null);
  const [showGlossary, setShowGlossary] = useState(false);

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
        try {
          toast({
            title: "Processing PDF",
            description: "Extracting text from PDF file..."
          });
          
          // Convert file to base64 for document parsing
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const base64Data = e.target?.result as string;
              const base64Content = base64Data.split(',')[1];
              
              // Use document parsing API
              const { data, error } = await supabase.functions.invoke('parse-document', {
                body: { 
                  fileData: base64Content,
                  fileName: file.name,
                  mimeType: file.type
                }
              });
              
              if (error) {
                console.error('Document parsing error:', error);
                throw new Error("Failed to parse PDF. Please ensure the file contains readable text.");
              }
              
              if (data?.text && data.text.trim()) {
                setCurrentProject(prev => ({ ...prev, scriptText: data.text }));
                toast({
                  title: "Success", 
                  description: "PDF text extracted successfully!"
                });
              } else {
                throw new Error("No readable text found in PDF. Please check if the file contains text or try a different format.");
              }
            } catch (parseError) {
              console.error('Error in PDF processing:', parseError);
              toast({
                variant: "destructive",
                title: "PDF Processing Failed", 
                description: parseError instanceof Error ? parseError.message : "Failed to extract text from PDF"
              });
            }
          };
          
          reader.onerror = () => {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to read PDF file"
            });
          };
          
          reader.readAsDataURL(file);
          
        } catch (error) {
          console.error('Error processing PDF:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to process PDF file"
          });
        }
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

  const startEditingShot = (shot: Shot) => {
    setEditingShot(shot.shotNumber);
    setEditValues(shot);
  };

  const cancelEditingShot = () => {
    setEditingShot(null);
    setEditValues({});
  };

  const saveEditedShot = () => {
    if (!selectedProject || !editingShot) return;

    const updatedShots = selectedProject.shots.map(shot => 
      shot.shotNumber === editingShot 
        ? { ...shot, ...editValues }
        : shot
    );

    const updatedProject = {
      ...selectedProject,
      shots: updatedShots
    };

    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    setEditingShot(null);
    setEditValues({});

    toast({
      title: "Shot Updated",
      description: "Shot has been updated successfully"
    });
  };

  const startEditingFrame = (frame: StoryboardFrame) => {
    setEditingFrame(frame.shotNumber);
    setFrameEditValues(frame);
  };

  const cancelEditingFrame = () => {
    setEditingFrame(null);
    setFrameEditValues({});
  };

  const saveEditedFrame = () => {
    if (!selectedProject || !editingFrame || !selectedProject.storyboard) return;

    const updatedStoryboard = selectedProject.storyboard.map(frame => 
      frame.shotNumber === editingFrame 
        ? { ...frame, ...frameEditValues }
        : frame
    );

    const updatedProject = {
      ...selectedProject,
      storyboard: updatedStoryboard
    };

    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    setEditingFrame(null);
    setFrameEditValues({});

    toast({
      title: "Frame Updated",
      description: "Storyboard frame has been updated successfully"
    });
  };

  const regenerateFrame = async (shotNumber: number) => {
    if (!selectedProject?.storyboard) return;

    setRegeneratingFrame(shotNumber);

    try {
      const frameToRegenerate = selectedProject.storyboard.find(f => f.shotNumber === shotNumber);
      if (!frameToRegenerate) return;

      const { data, error } = await supabase.functions.invoke('generate-storyboard', {
        body: {
          shots: [frameToRegenerate],
          genre: selectedProject.genre,
          tone: selectedProject.tone
        }
      });

      if (error) throw error;

      if (data?.storyboard && data.storyboard[0]) {
        const updatedStoryboard = selectedProject.storyboard.map(frame => 
          frame.shotNumber === shotNumber 
            ? { ...frame, imageData: data.storyboard[0].imageData, generatedAt: new Date().toISOString() }
            : frame
        );

        const updatedProject = {
          ...selectedProject,
          storyboard: updatedStoryboard
        };
        
        setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
        setSelectedProject(updatedProject);

        toast({
          title: "Frame Regenerated!",
          description: "Storyboard frame has been regenerated successfully"
        });
      }
    } catch (error) {
      console.error('Error regenerating frame:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to regenerate frame. Please try again."
      });
    } finally {
      setRegeneratingFrame(null);
    }
  };

  const glossaryTerms = {
    "Shot Types": [
      { term: "Wide Shot (WS)", description: "Shows the full subject and surroundings, establishing location and context" },
      { term: "Medium Shot (MS)", description: "Shows subject from waist up, balancing character and environment" },
      { term: "Close-up (CU)", description: "Tight shot focusing on subject's face or important details" },
      { term: "Extreme Close-up (ECU)", description: "Very tight shot on specific detail like eyes or hands" },
      { term: "Long Shot (LS)", description: "Subject appears small in frame, emphasizes environment" },
      { term: "Medium Close-up (MCU)", description: "Shows subject from chest up, more intimate than medium shot" }
    ],
    "Camera Angles": [
      { term: "Eye Level", description: "Camera at subject's eye level, neutral and natural perspective" },
      { term: "High Angle", description: "Camera above subject, makes subject appear vulnerable or small" },
      { term: "Low Angle", description: "Camera below subject, makes subject appear powerful or imposing" },
      { term: "Dutch Angle", description: "Tilted camera creating unease or disorientation" },
      { term: "Bird's Eye", description: "Directly overhead view, shows full spatial relationships" },
      { term: "Worm's Eye", description: "Extreme low angle from ground level looking up" }
    ],
    "Camera Movement": [
      { term: "Pan", description: "Horizontal camera movement, following action or revealing space" },
      { term: "Tilt", description: "Vertical camera movement up or down" },
      { term: "Zoom", description: "Lens adjustment to move closer or further from subject" },
      { term: "Dolly/Track", description: "Physical camera movement toward or away from subject" },
      { term: "Steadicam", description: "Smooth handheld movement following subject" },
      { term: "Crane/Jib", description: "Elevated camera movement, often sweeping motions" }
    ]
  };

  const exportStoryboardToPDF = async () => {
    if (!selectedProject?.storyboard) return;

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
    pdf.text(`Genre: ${selectedProject.genre}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Tone: ${selectedProject.tone}`, margin, yPosition);
    yPosition += 15;

    // Storyboard Frames
    for (const frame of selectedProject.storyboard) {
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
    pdf.save(`storyboard-${selectedProject.genre || 'untitled'}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Storyboard has been exported successfully"
    });
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Filmmaker's Glossary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Filmmaker's Glossary
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowGlossary(!showGlossary)}
                    >
                      {showGlossary ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                </CardHeader>
                {showGlossary && (
                  <CardContent className="max-h-80 overflow-y-auto">
                    <div className="space-y-4">
                      {Object.entries(glossaryTerms).map(([category, terms]) => (
                        <div key={category}>
                          <h4 className="font-semibold text-sm mb-2 text-primary">{category}</h4>
                          <div className="space-y-2">
                            {terms.map((item, index) => (
                              <div key={index} className="text-xs">
                                <div className="font-medium text-foreground">{item.term}</div>
                                <div className="text-muted-foreground">{item.description}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Recent Projects */}
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
                             <div className="flex items-center gap-2">
                               {editingShot === shot.shotNumber ? (
                                 <div className="flex items-center gap-1">
                                   <Button
                                     size="sm"
                                     variant="ghost"
                                     onClick={saveEditedShot}
                                     className="h-6 w-6 p-0"
                                   >
                                     <Save className="h-3 w-3" />
                                   </Button>
                                   <Button
                                     size="sm"
                                     variant="ghost"
                                     onClick={cancelEditingShot}
                                     className="h-6 w-6 p-0"
                                   >
                                     <X className="h-3 w-3" />
                                   </Button>
                                 </div>
                               ) : (
                                 <Button
                                   size="sm"
                                   variant="ghost"
                                   onClick={() => startEditingShot(shot)}
                                   className="h-6 w-6 p-0"
                                 >
                                   <Edit2 className="h-3 w-3" />
                                 </Button>
                               )}
                               <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                 <Clock className="h-3 w-3" />
                                 {editingShot === shot.shotNumber ? (
                                   <Input
                                     value={editValues.duration || shot.duration}
                                     onChange={(e) => setEditValues(prev => ({ ...prev, duration: e.target.value }))}
                                     className="h-5 w-16 text-xs"
                                   />
                                 ) : (
                                   shot.duration
                                 )}
                               </div>
                             </div>
                           </div>
                         </CardHeader>
                         <CardContent className="space-y-3">
                           <div>
                             <h4 className="font-medium text-sm mb-1">Description</h4>
                             {editingShot === shot.shotNumber ? (
                               <Textarea
                                 value={editValues.description || shot.description}
                                 onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                                 className="text-sm min-h-[60px]"
                               />
                             ) : (
                               <p className="text-sm text-muted-foreground">{shot.description}</p>
                             )}
                           </div>
                           <div>
                             <h4 className="font-medium text-sm mb-1">Camera Angle</h4>
                             {editingShot === shot.shotNumber ? (
                               <Input
                                 value={editValues.cameraAngle || shot.cameraAngle}
                                 onChange={(e) => setEditValues(prev => ({ ...prev, cameraAngle: e.target.value }))}
                                 className="text-sm"
                               />
                             ) : (
                               <p className="text-sm text-muted-foreground">{shot.cameraAngle}</p>
                             )}
                           </div>
                           <div>
                             <h4 className="font-medium text-sm mb-1">Visual Elements</h4>
                             {editingShot === shot.shotNumber ? (
                               <Textarea
                                 value={editValues.visualElements || shot.visualElements}
                                 onChange={(e) => setEditValues(prev => ({ ...prev, visualElements: e.target.value }))}
                                 className="text-sm min-h-[60px]"
                               />
                             ) : (
                               <p className="text-sm text-muted-foreground">{shot.visualElements}</p>
                             )}
                           </div>
                           <div>
                             <h4 className="font-medium text-sm mb-1">Characters</h4>
                             {editingShot === shot.shotNumber ? (
                               <Input
                                 value={editValues.characters?.join(', ') || shot.characters.join(', ')}
                                 onChange={(e) => setEditValues(prev => ({ 
                                   ...prev, 
                                   characters: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                                 }))}
                                 className="text-sm"
                                 placeholder="Enter characters separated by commas"
                               />
                             ) : (
                               <div className="flex flex-wrap gap-1">
                                 {shot.characters.map((character, index) => (
                                   <Badge key={index} variant="outline" className="text-xs">
                                     {character}
                                   </Badge>
                                 ))}
                               </div>
                             )}
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
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Visual Storyboard
                      </CardTitle>
                      <Button onClick={exportStoryboardToPDF} size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {selectedProject.storyboard.map((frame) => (
                         <Card key={frame.shotNumber} className="border border-border">
                           <CardContent className="p-4 space-y-4">
                             <div className="flex items-center justify-between">
                               <Badge variant="secondary">Frame {frame.shotNumber}</Badge>
                               <div className="flex items-center gap-2">
                                 {editingFrame === frame.shotNumber ? (
                                   <div className="flex items-center gap-1">
                                     <Button
                                       size="sm"
                                       variant="ghost"
                                       onClick={saveEditedFrame}
                                       className="h-6 w-6 p-0"
                                     >
                                       <Save className="h-3 w-3" />
                                     </Button>
                                     <Button
                                       size="sm"
                                       variant="ghost"
                                       onClick={cancelEditingFrame}
                                       className="h-6 w-6 p-0"
                                     >
                                       <X className="h-3 w-3" />
                                     </Button>
                                   </div>
                                 ) : (
                                   <div className="flex items-center gap-1">
                                     <Button
                                       size="sm"
                                       variant="ghost"
                                       onClick={() => startEditingFrame(frame)}
                                       className="h-6 w-6 p-0"
                                     >
                                       <Edit2 className="h-3 w-3" />
                                     </Button>
                                     <Button
                                       size="sm"
                                       variant="ghost"
                                       onClick={() => regenerateFrame(frame.shotNumber)}
                                       disabled={regeneratingFrame === frame.shotNumber}
                                       className="h-6 w-6 p-0"
                                     >
                                       {regeneratingFrame === frame.shotNumber ? (
                                         <Loader2 className="h-3 w-3 animate-spin" />
                                       ) : (
                                         <RefreshCw className="h-3 w-3" />
                                       )}
                                     </Button>
                                   </div>
                                 )}
                                 {frame.generatedAt && (
                                   <span className="text-xs text-muted-foreground">
                                     {new Date(frame.generatedAt).toLocaleTimeString()}
                                   </span>
                                 )}
                               </div>
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
                               <div>
                                 <h4 className="font-medium text-xs mb-1">Description</h4>
                                 {editingFrame === frame.shotNumber ? (
                                   <Textarea
                                     value={frameEditValues.description || frame.description}
                                     onChange={(e) => setFrameEditValues(prev => ({ ...prev, description: e.target.value }))}
                                     className="text-xs min-h-[50px]"
                                   />
                                 ) : (
                                   <p className="text-xs text-muted-foreground">{frame.description}</p>
                                 )}
                               </div>
                               <div>
                                 <h4 className="font-medium text-xs mb-1">Camera Angle</h4>
                                 {editingFrame === frame.shotNumber ? (
                                   <Input
                                     value={frameEditValues.cameraAngle || frame.cameraAngle}
                                     onChange={(e) => setFrameEditValues(prev => ({ ...prev, cameraAngle: e.target.value }))}
                                     className="text-xs"
                                   />
                                 ) : (
                                   <p className="text-xs text-muted-foreground">{frame.cameraAngle}</p>
                                 )}
                               </div>
                               <div>
                                 <h4 className="font-medium text-xs mb-1">Visual Elements</h4>
                                 {editingFrame === frame.shotNumber ? (
                                   <Textarea
                                     value={frameEditValues.visualElements || frame.visualElements}
                                     onChange={(e) => setFrameEditValues(prev => ({ ...prev, visualElements: e.target.value }))}
                                     className="text-xs min-h-[40px]"
                                   />
                                 ) : (
                                   <p className="text-xs text-muted-foreground">{frame.visualElements}</p>
                                 )}
                               </div>
                               {editingFrame === frame.shotNumber && (
                                 <Button
                                   size="sm"
                                   onClick={() => regenerateFrame(frame.shotNumber)}
                                   disabled={regeneratingFrame === frame.shotNumber}
                                   className="w-full mt-2"
                                 >
                                   {regeneratingFrame === frame.shotNumber ? (
                                     <>
                                       <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                       Regenerating...
                                     </>
                                   ) : (
                                     <>
                                       <RefreshCw className="mr-2 h-3 w-3" />
                                       Regenerate Frame
                                     </>
                                   )}
                                 </Button>
                               )}
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