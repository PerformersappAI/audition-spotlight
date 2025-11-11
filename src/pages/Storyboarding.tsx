import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Video, Upload, Loader2, Camera, Clock, Users, Edit2, Save, X, Download, RefreshCw, BookOpen, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOCRUpload } from "@/hooks/useOCRUpload";
import { useStoryboardProjects } from "@/hooks/useStoryboardProjects";
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFUploadProgress } from "@/components/PDFUploadProgress";
import { ArtStyleSelector, artStyles } from "@/components/ArtStyleSelector";
import { CharacterDefinitionManager, CharacterDefinition } from "@/components/CharacterDefinitionManager";
import { StyleReferenceInput } from "@/components/StyleReferenceInput";
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
  scriptSegment: string;
  dialogueLines: string[];
  sceneAction: string;
  // Enhanced fields from AI analysis
  visualDescription?: string;
  location?: string;
  action?: string;
  emotionalTone?: string;
  shotType?: string;
  lighting?: string;
  keyProps?: string;
  dialogue?: string;
}

interface StoryboardFrame {
  shotNumber: number;
  description: string;
  cameraAngle: string;
  characters: string[];
  visualElements: string;
  scriptSegment: string;
  dialogueLines: string[];
  sceneAction: string;
  imageData?: string;
  generatedAt?: string;
}

interface StoryboardProjectLocal {
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
  const navigate = useNavigate();
  const { projects, loading, saveProject, updateProject, deleteProject, refetch } = useStoryboardProjects();
  const [currentProject, setCurrentProject] = useState({
    scriptText: "",
    genre: "",
    tone: "",
    artStyle: "comic",
    customStylePrompt: "",
    aspectRatio: "16:9" as "16:9" | "9:16",
    characterDefinitions: [] as CharacterDefinition[],
    styleReferencePrompt: ""
  });
  const [isProcessingScript, setIsProcessingScript] = useState(false);
  const { 
    processFile, 
    isProcessing: isProcessingFile, 
    currentStage, 
    elapsedTime, 
    progress, 
    currentFileName, 
    currentFileSize 
  } = useOCRUpload();
  const [selectedProject, setSelectedProject] = useState<StoryboardProjectLocal | null>(null);
  const [selectedDirectors, setSelectedDirectors] = useState<string[]>([]);
  const [generatingStoryboard, setGeneratingStoryboard] = useState(false);
  const [editingShot, setEditingShot] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Shot>>({});
  const [editingFrame, setEditingFrame] = useState<number | null>(null);
  const [frameEditValues, setFrameEditValues] = useState<Partial<StoryboardFrame>>({});
  const [regeneratingFrame, setRegeneratingFrame] = useState<number | null>(null);
  const [generatingFrames, setGeneratingFrames] = useState<Set<number>>(new Set());
  const [frameErrors, setFrameErrors] = useState<Map<number, string>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

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
        setCurrentProject(prev => ({ ...prev, scriptText: result.text }));
      },
      (error) => {
        console.error('File processing error:', error);
      }
    );
  };

  const parseScript = (scriptText: string) => {
    // Extract character names (typically in ALL CAPS)
    const characterMatches = scriptText.match(/^[A-Z][A-Z\s]+(?=\n|\r)/gm) || [];
    const characters = [...new Set(characterMatches.map(name => name.trim()))];
    
    // Enhanced scene detection - look for common screenplay patterns
    const sceneHeaders = scriptText.match(/(INT\.|EXT\.|FADE IN:|FADE OUT:|CUT TO:|SCENE \d+)/gi) || [];
    
    // Split by natural breaks: scene headers, double line breaks, or major dialogue shifts
    let segments = scriptText.split(/\n\s*\n/).filter(seg => seg.trim());
    
    // Further split on scene headers if they exist
    if (sceneHeaders.length > 0) {
      const scenePattern = /(INT\.|EXT\.|FADE IN:|FADE OUT:|CUT TO:|SCENE \d+)/gi;
      segments = scriptText.split(scenePattern).filter(seg => seg.trim());
    }
    
    // Split large segments that might contain multiple scenes
    const processedSegments = [];
    for (const segment of segments) {
      if (segment.length > 800) {
        // Split long segments by character dialogue changes
        const dialogueBreaks = segment.split(/\n(?=[A-Z][A-Z\s]+\n)/);
        processedSegments.push(...dialogueBreaks.filter(seg => seg.trim()));
      } else {
        processedSegments.push(segment);
      }
    }
    
    // Extract dialogue and actions
    const dialoguePattern = /^([A-Z][A-Z\s]+)\s*\n(.+?)(?=\n[A-Z][A-Z\s]+|$)/gms;
    const actionPattern = /^\((.+?)\)|^([^A-Z\n].+?)$/gm;
    
    return { 
      characters, 
      segments: processedSegments.filter(seg => seg.trim()), 
      dialoguePattern, 
      actionPattern,
      sceneCount: sceneHeaders.length 
    };
  };

  const countCharacters = (text: string): number => {
    const { characters } = parseScript(text);
    return characters.length;
  };

  // Generate AI-enhanced shot breakdown from script
  const generateShotBreakdown = async (
    scriptText: string,
    genre: string,
    tone: string
  ): Promise<Shot[]> => {
    console.log("Starting AI-enhanced shot breakdown generation...");
    
    const lines = scriptText.split('\n');
    const sceneCount = lines.filter(line => 
      line.trim().match(/^(INT\.|EXT\.|SCENE|Scene)/i)
    ).length;
    
    // Calculate appropriate number of shots based on script length
    const wordCount = scriptText.split(/\s+/).length;
    let desiredShots = Math.ceil(wordCount / 150); // ~1 shot per 150 words
    desiredShots = Math.max(6, Math.min(desiredShots, 24)); // Between 6-24 shots
    
    try {
      toast({
        title: "Analyzing Script",
        description: `Using AI to generate ${desiredShots} detailed storyboard shots...`,
      });

      const { data, error } = await supabase.functions.invoke('analyze-shots', {
        body: {
          scriptText,
          genre,
          tone,
          shotCount: desiredShots
        }
      });

      if (error) {
        console.error('Error calling analyze-shots:', error);
        throw error;
      }

      if (!data || !data.shots) {
        throw new Error('Invalid response from analyze-shots function');
      }

      console.log(`AI generated ${data.shots.length} detailed shots`);
      
      toast({
        title: "Script Analysis Complete",
        description: `Generated ${data.shots.length} storyboard frames with detailed descriptions`,
      });

      return data.shots;
    } catch (error) {
      console.error('Error generating shot breakdown:', error);
      toast({
        title: "Error",
        description: "Failed to analyze script. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
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

    if (!userProfile?.user_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to create storyboards"
      });
      return;
    }

    setIsProcessingScript(true);

    try {
      const shots = await generateShotBreakdown(
        currentProject.scriptText,
        currentProject.genre,
        currentProject.tone
      );
      
      const savedProject = await saveProject(
        currentProject.scriptText,
        currentProject.genre,
        currentProject.tone,
        shots,
        currentProject.characterDefinitions,
        currentProject.styleReferencePrompt
      );

      if (savedProject) {
        // Map database project to local interface
        const localProject: StoryboardProjectLocal = {
          id: savedProject.id,
          scriptText: savedProject.script_text,
          genre: savedProject.genre || "",
          tone: savedProject.tone || "",
          characterCount: savedProject.character_count,
          shots: savedProject.shots || [],
          storyboard: savedProject.storyboard_frames || undefined,
          createdAt: new Date(savedProject.created_at)
        };
        setSelectedProject(localProject);
        toast({
          title: "Shot Breakdown Complete",
          description: "Your script has been broken down into shots and saved. Generate visual storyboard frames now!"
        });
      }
    } catch (error) {
      console.error('Error creating storyboard:', error);
    } finally {
      setIsProcessingScript(false);
    }
  };

  // Quick storyboard generation using simplified API
  const createQuickStoryboard = async () => {
    if (!currentProject.scriptText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter script text or upload a file"
      });
      return;
    }

    if (!currentProject.genre || !currentProject.tone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both genre and tone"
      });
      return;
    }

    setGeneratingStoryboard(true);

    try {
      toast({
        title: "Generating Quick Storyboard",
        description: "Creating storyboard panels with sketch-style visuals...",
      });

      // Get the art style prompt modifier
      const selectedArtStyle = artStyles.find(s => s.id === currentProject.artStyle);
      const stylePrompt = currentProject.artStyle === 'custom' 
        ? currentProject.customStylePrompt 
        : (selectedArtStyle?.promptModifier || '');

      const { data, error } = await supabase.functions.invoke('generate-storyboard-simple', {
        body: {
          scene_text: currentProject.scriptText,
          style: stylePrompt
        }
      });

      if (error) {
        console.error('Error calling generate-storyboard-simple:', error);
        throw error;
      }

      if (!data || !data.panels) {
        throw new Error('Invalid response from storyboard generation');
      }

      console.log(`Generated ${data.panels.length} panels`);
      
      // Convert panels to storyboard frames format
      const storyboardFrames = data.panels.map((panel: any) => ({
        shotNumber: panel.shot_id,
        description: panel.description,
        cameraAngle: "medium shot",
        characters: [],
        visualElements: "",
        scriptSegment: "",
        dialogueLines: [],
        sceneAction: panel.description,
        imageData: `data:image/png;base64,${panel.image_b64}`,
        generatedAt: new Date().toISOString()
      }));

      // Create a temporary project to display the results
      const tempProject: StoryboardProjectLocal = {
        id: 'quick-' + Date.now(),
        scriptText: currentProject.scriptText,
        genre: currentProject.genre,
        tone: currentProject.tone,
        characterCount: 0,
        shots: data.panels.map((panel: any, index: number) => ({
          shotNumber: panel.shot_id,
          description: panel.description,
          cameraAngle: "medium shot",
          characters: [],
          visualElements: "",
          duration: "5s",
          scriptSegment: "",
          dialogueLines: [],
          sceneAction: panel.description,
        })),
        storyboard: storyboardFrames,
        createdAt: new Date()
      };

      setSelectedProject(tempProject);

      toast({
        title: "Quick Storyboard Complete",
        description: `Generated ${data.panels.length} storyboard panels!`,
      });

    } catch (error) {
      console.error('Error creating quick storyboard:', error);
      toast({
        title: "Error",
        description: "Failed to generate storyboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingStoryboard(false);
    }
  };

  // Initialize empty storyboard frames for shot breakdown
  const initializeStoryboard = async () => {
    if (!selectedProject || !selectedProject.shots) return;

    // Create empty frames for each shot
    const emptyFrames = selectedProject.shots.map(shot => ({
      ...shot,
      imageData: undefined,
      generatedAt: undefined
    }));

    const updatedProject = await updateProject(selectedProject.id, {
      storyboard_frames: emptyFrames
    });

    if (updatedProject) {
      // Map database project to local interface
      const localProject: StoryboardProjectLocal = {
        id: updatedProject.id,
        scriptText: updatedProject.script_text,
        genre: updatedProject.genre || "",
        tone: updatedProject.tone || "",
        characterCount: updatedProject.character_count,
        shots: updatedProject.shots || [],
        storyboard: updatedProject.storyboard_frames || undefined,
        createdAt: new Date(updatedProject.created_at)
      };
      setSelectedProject(localProject);
      toast({
        title: "Storyboard Ready",
        description: "Click 'Generate Frame' on individual shots or 'Generate All Frames' to create visuals."
      });
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

  const saveEditedShot = async () => {
    if (!selectedProject || !editingShot) return;

    const updatedShots = selectedProject.shots?.map(shot => 
      shot.shotNumber === editingShot 
        ? { ...shot, ...editValues }
        : shot
    );

    if (updatedShots) {
      const updatedProject = await updateProject(selectedProject.id, {
        shots: updatedShots
      });

      if (updatedProject) {
        // Map database project to local interface
        const localProject: StoryboardProjectLocal = {
          id: updatedProject.id,
          scriptText: updatedProject.script_text,
          genre: updatedProject.genre || "",
          tone: updatedProject.tone || "",
          characterCount: updatedProject.character_count,
          shots: updatedProject.shots || [],
          storyboard: updatedProject.storyboard_frames || undefined,
          createdAt: new Date(updatedProject.created_at)
        };
        setSelectedProject(localProject);
        setEditingShot(null);
        setEditValues({});

        toast({
          title: "Shot Updated",
          description: "Shot has been updated successfully"
        });
      }
    }
  };

  const startEditingFrame = (frame: StoryboardFrame) => {
    setEditingFrame(frame.shotNumber);
    setFrameEditValues(frame);
  };

  const cancelEditingFrame = () => {
    setEditingFrame(null);
    setFrameEditValues({});
  };

  const saveEditedFrame = async () => {
    if (!selectedProject || !editingFrame || !selectedProject.storyboard) return;

    const updatedStoryboard = selectedProject.storyboard.map(frame => 
      frame.shotNumber === editingFrame 
        ? { ...frame, ...frameEditValues }
        : frame
    );

    const updatedProject = await updateProject(selectedProject.id, {
      storyboard_frames: updatedStoryboard
    });

    if (updatedProject) {
      // Map database project to local interface
      const localProject: StoryboardProjectLocal = {
        id: updatedProject.id,
        scriptText: updatedProject.script_text,
        genre: updatedProject.genre || "",
        tone: updatedProject.tone || "",
        characterCount: updatedProject.character_count,
        shots: updatedProject.shots || [],
        storyboard: updatedProject.storyboard_frames || undefined,
        createdAt: new Date(updatedProject.created_at)
      };
      setSelectedProject(localProject);
      setEditingFrame(null);
      setFrameEditValues({});

      toast({
        title: "Frame Updated",
        description: "Storyboard frame has been updated successfully"
      });
    }
  };

  // This function is now replaced by generateSingleFrame - keeping for compatibility
  const regenerateFrame = async (shotNumber: number) => {
    return generateSingleFrame(shotNumber);
  };

  // Generate individual frame
  const generateSingleFrame = async (shotNumber: number) => {
    if (!selectedProject || !selectedProject.shots) return;

    const shot = selectedProject.shots.find(s => s.shotNumber === shotNumber);
    if (!shot) return;

    try {
      setGeneratingFrames(prev => new Set([...prev, shotNumber]));
      setFrameErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.delete(shotNumber);
        return newErrors;
      });

      console.log(`Generating frame ${shotNumber}`);

      // Get the art style prompt modifier
      const selectedArtStyle = artStyles.find(s => s.id === currentProject.artStyle);
      const stylePrompt = currentProject.artStyle === 'custom' 
        ? currentProject.customStylePrompt 
        : (selectedArtStyle?.promptModifier || 'black and white storyboard frame, hand-drawn sketch');

      // Build character descriptions for this shot
      const characterDescriptions = shot.characters
        .map(charName => {
          const def = currentProject.characterDefinitions.find(
            c => c.name.toLowerCase() === charName.toLowerCase()
          );
          if (def) {
            return `${def.name}: ${def.description}. ${def.traits}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');

      const { data: frameData, error } = await supabase.functions.invoke('generate-single-frame', {
        body: { 
          shot,
          artStyle: stylePrompt,
          aspectRatio: currentProject.aspectRatio || '16:9',
          characterDescriptions,
          styleReference: currentProject.styleReferencePrompt
        }
      });

      if (error) {
        console.error(`Frame ${shotNumber} generation error:`, error);
        setFrameErrors(prev => new Map(prev.set(shotNumber, `Function error: ${error.message || 'Failed to invoke edge function'}`)));
        return;
      }

      if (!frameData || !frameData.imageData) {
        const errorMsg = 'Invalid response from frame generation service';
        console.error(errorMsg, { frameData });
        setFrameErrors(prev => new Map(prev.set(shotNumber, errorMsg)));
        return;
      }

      // Check if this is a fallback image with an error
      if (frameData.error) {
        console.warn(`Frame ${shotNumber} generated with fallback:`, frameData.error);
      }

      console.log(`Frame ${shotNumber} generated successfully`);

      // Update the specific frame in the storyboard
      const newFrame = {
        ...shot,
        imageData: frameData.imageData,
        generatedAt: frameData.generatedAt || new Date().toISOString()
      };

      const updatedStoryboard = selectedProject.storyboard ? 
        selectedProject.storyboard.map(frame => 
          frame.shotNumber === shotNumber ? newFrame : frame
        ) : 
        [newFrame];

      // If this is the first frame, initialize the storyboard array
      if (!selectedProject.storyboard) {
        const emptyFrames = selectedProject.shots.map(shot => ({
          ...shot,
          imageData: undefined,
          generatedAt: undefined
        }));
        updatedStoryboard.splice(0, 1, ...emptyFrames.map(frame => 
          frame.shotNumber === shotNumber ? newFrame : frame
        ));
      }

      const updatedProject = {
        ...selectedProject,
        storyboard: updatedStoryboard
      };

      // Update in database and refresh local state
      const dbUpdatedProject = await updateProject(selectedProject.id, {
        storyboard_frames: updatedStoryboard
      });

      // Update local state with the new frame data
      if (dbUpdatedProject) {
        setSelectedProject({
          ...selectedProject,
          storyboard: updatedStoryboard
        });
        console.log(`Frame ${shotNumber} generated and state updated`);
      }

      toast({
        title: "Frame generated!",
        description: `Frame ${shotNumber} created successfully.`,
      });

    } catch (error) {
      console.error(`Error generating frame ${shotNumber}:`, error);
      setFrameErrors(prev => new Map([...prev, [shotNumber, error instanceof Error ? error.message : "Generation failed"]]));
      
      toast({
        title: "Frame generation failed",
        description: `Failed to generate frame ${shotNumber}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setGeneratingFrames(prev => {
        const newSet = new Set(prev);
        newSet.delete(shotNumber);
        return newSet;
      });
    }
  };

  // Generate all remaining frames sequentially
  const generateAllFrames = async () => {
    if (!selectedProject || !selectedProject.shots) return;

    setIsGenerating(true);
    const ungenerated = selectedProject.shots.filter(shot => {
      const existingFrame = selectedProject.storyboard?.find(f => f.shotNumber === shot.shotNumber);
      return !existingFrame?.imageData;
    });

    toast({
      title: "Generating storyboard",
      description: `Processing ${ungenerated.length} frames sequentially...`,
    });

    for (const shot of ungenerated) {
      await generateSingleFrame(shot.shotNumber);
      // Small delay between frames to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Refresh the selected project from database to ensure UI is up to date
    if (selectedProject) {
      await refetch();
      const refreshedProject = projects.find(p => p.id === selectedProject.id);
      if (refreshedProject) {
        setSelectedProject({
          id: refreshedProject.id,
          scriptText: refreshedProject.script_text,
          genre: refreshedProject.genre || "",
          tone: refreshedProject.tone || "",
          characterCount: refreshedProject.character_count,
          shots: refreshedProject.shots || [],
          storyboard: refreshedProject.storyboard_frames || undefined,
          createdAt: new Date(refreshedProject.created_at)
        });
        console.log("All frames generated, state refreshed from database");
      }
    }

    setIsGenerating(false);
    toast({
      title: "Storyboard complete!",
      description: `All ${ungenerated.length} frames generated successfully.`,
    });
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

      // Add script context
      if (frame.scriptSegment) {
        const scriptLines = pdf.splitTextToSize(`Script Context: "${frame.scriptSegment}"`, pageWidth - 2 * margin);
        pdf.text(scriptLines, margin, yPosition);
        yPosition += scriptLines.length * 5;
      }

      // Add dialogue
      if (frame.dialogueLines && frame.dialogueLines.length > 0) {
        const dialogueText = `Dialogue: ${frame.dialogueLines.join(' ')}`;
        const dialogueLines = pdf.splitTextToSize(dialogueText, pageWidth - 2 * margin);
        pdf.text(dialogueLines, margin, yPosition);
        yPosition += dialogueLines.length * 5;
      }

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
                    </div>
                  </div>

                  {/* Upload Progress Card */}
                  {isProcessingFile && currentFileName && (
                    <PDFUploadProgress
                      fileName={currentFileName}
                      fileSize={currentFileSize}
                      stage={currentStage}
                      elapsedTime={elapsedTime}
                      progress={progress}
                    />
                  )}

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

                  {/* Art Style Selection */}
                  <ArtStyleSelector
                    selectedStyle={currentProject.artStyle}
                    customStylePrompt={currentProject.customStylePrompt}
                    onStyleChange={(styleId) => setCurrentProject(prev => ({ ...prev, artStyle: styleId }))}
                    onCustomPromptChange={(prompt) => setCurrentProject(prev => ({ ...prev, customStylePrompt: prompt }))}
                  />

                  {/* Character Definitions */}
                  <CharacterDefinitionManager
                    characters={currentProject.characterDefinitions}
                    onChange={(characters) => setCurrentProject(prev => ({ ...prev, characterDefinitions: characters }))}
                  />

                  {/* Style Reference */}
                  <StyleReferenceInput
                    value={currentProject.styleReferencePrompt}
                    onChange={(value) => setCurrentProject(prev => ({ ...prev, styleReferencePrompt: value }))}
                  />

                  {/* Aspect Ratio Selection */}
                  <div className="space-y-2">
                    <Label>Aspect Ratio</Label>
                    <Select value={currentProject.aspectRatio} onValueChange={(value: "16:9" | "9:16") => setCurrentProject(prev => ({ ...prev, aspectRatio: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:9">16:9 (Film/Commercial)</SelectItem>
                        <SelectItem value="9:16">9:16 (Vertical/Social)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={createStoryboard} 
                      disabled={isProcessingScript || isProcessingFile || generatingStoryboard}
                      size="lg"
                      variant="default"
                    >
                      {isProcessingScript ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Breakdown...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Detailed Breakdown
                        </>
                      )}
                    </Button>

                    <Button 
                      onClick={createQuickStoryboard} 
                      disabled={isProcessingScript || isProcessingFile || generatingStoryboard}
                      size="lg"
                      variant="secondary"
                    >
                      {generatingStoryboard ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-4 w-4" />
                          Quick Storyboard
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-center space-y-1">
                    <p><strong>Detailed Breakdown:</strong> Creates shot analysis first, then generate visuals individually</p>
                    <p><strong>Quick Storyboard:</strong> Generates complete storyboard with sketch-style frames instantly</p>
                  </div>
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
                          onClick={() => setSelectedProject({
                            id: project.id,
                            scriptText: project.script_text,
                            genre: project.genre || "",
                            tone: project.tone || "",
                            characterCount: project.character_count,
                            shots: project.shots || [],
                            storyboard: project.storyboard_frames || undefined,
                            createdAt: new Date(project.created_at)
                          })}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">
                                {project.genre || "No Genre"}
                              </span>
                              <Badge variant="outline">
                                {project.shots?.length || 0} shots
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {project.script_text.substring(0, 100)}...
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {project.character_count}
                              </span>
                              <span>{new Date(project.created_at).toLocaleDateString()}</span>
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
                    <div className="flex gap-2">
                      <Button 
                        onClick={initializeStoryboard}
                        disabled={selectedProject.storyboard && selectedProject.storyboard.length > 0}
                        variant="outline"
                        size="sm"
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Initialize Frames
                      </Button>
                      {selectedProject.storyboard && selectedProject.storyboard.length > 0 && (
                        <Button 
                          onClick={generateAllFrames}
                          disabled={isGenerating}
                          variant="default"
                          size="sm"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Camera className="mr-2 h-4 w-4" />
                              Generate All Frames
                            </>
                          )}
                        </Button>
                      )}
                    </div>
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
                            {/* Visual Description */}
                            {shot.visualDescription && (
                              <div>
                                <h4 className="font-medium text-sm mb-1">Visual Description</h4>
                                {editingShot === shot.shotNumber ? (
                                  <Textarea
                                    value={editValues.visualDescription || shot.visualDescription}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, visualDescription: e.target.value }))}
                                    className="text-sm min-h-[80px]"
                                  />
                                ) : (
                                  <p className="text-sm text-muted-foreground">{shot.visualDescription}</p>
                                )}
                              </div>
                            )}
                            
                            {/* Location */}
                            {shot.location && (
                              <div>
                                <h4 className="font-medium text-sm mb-1">Location</h4>
                                {editingShot === shot.shotNumber ? (
                                  <Input
                                    value={editValues.location || shot.location}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, location: e.target.value }))}
                                    className="text-sm"
                                  />
                                ) : (
                                  <p className="text-sm text-muted-foreground">{shot.location}</p>
                                )}
                              </div>
                            )}

                            {/* Action */}
                            {shot.action && (
                              <div>
                                <h4 className="font-medium text-sm mb-1">Action</h4>
                                {editingShot === shot.shotNumber ? (
                                  <Input
                                    value={editValues.action || shot.action}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, action: e.target.value }))}
                                    className="text-sm"
                                  />
                                ) : (
                                  <p className="text-sm text-muted-foreground">{shot.action}</p>
                                )}
                              </div>
                            )}

                            {/* Shot Type & Camera Angle */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <h4 className="font-medium text-sm mb-1">Shot Type</h4>
                                {editingShot === shot.shotNumber ? (
                                  <Input
                                    value={editValues.shotType || shot.shotType || shot.cameraAngle}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, shotType: e.target.value }))}
                                    className="text-sm"
                                  />
                                ) : (
                                  <p className="text-sm text-muted-foreground">{shot.shotType || shot.cameraAngle}</p>
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
                            </div>

                            {/* Lighting */}
                            {shot.lighting && (
                              <div>
                                <h4 className="font-medium text-sm mb-1">Lighting</h4>
                                {editingShot === shot.shotNumber ? (
                                  <Input
                                    value={editValues.lighting || shot.lighting}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, lighting: e.target.value }))}
                                    className="text-sm"
                                  />
                                ) : (
                                  <p className="text-sm text-muted-foreground">{shot.lighting}</p>
                                )}
                              </div>
                            )}

                            {/* Emotional Tone */}
                            {shot.emotionalTone && (
                              <div>
                                <h4 className="font-medium text-sm mb-1">Emotional Tone</h4>
                                {editingShot === shot.shotNumber ? (
                                  <Input
                                    value={editValues.emotionalTone || shot.emotionalTone}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, emotionalTone: e.target.value }))}
                                    className="text-sm"
                                  />
                                ) : (
                                  <p className="text-sm text-muted-foreground">{shot.emotionalTone}</p>
                                )}
                              </div>
                            )}

                            {/* Key Props */}
                            {shot.keyProps && (
                              <div>
                                <h4 className="font-medium text-sm mb-1">Key Props</h4>
                                {editingShot === shot.shotNumber ? (
                                  <Input
                                    value={editValues.keyProps || shot.keyProps}
                                    onChange={(e) => setEditValues(prev => ({ ...prev, keyProps: e.target.value }))}
                                    className="text-sm"
                                  />
                                ) : (
                                  <p className="text-sm text-muted-foreground">{shot.keyProps}</p>
                                )}
                              </div>
                            )}

                            {/* Characters */}
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

                            {/* Dialogue */}
                            {shot.dialogue && shot.dialogue !== "None" && (
                              <div className="border-t pt-3">
                                <h4 className="font-medium text-sm mb-1 text-primary">Dialogue</h4>
                                <p className="text-xs text-muted-foreground bg-primary/10 p-2 rounded">
                                  {shot.dialogue}
                                </p>
                              </div>
                            )}
                          </CardContent>
                       </Card>
                     ))}
                   </div>
                 </CardContent>
              </Card>

              {/* Visual Storyboard Frames */}
              {selectedProject.shots && selectedProject.shots.length > 0 && (
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
                       {selectedProject.shots.map((shot) => {
                         const frame = selectedProject.storyboard?.find(f => f.shotNumber === shot.shotNumber);
                         const isGenerating = generatingFrames.has(shot.shotNumber);
                         const error = frameErrors.get(shot.shotNumber);
                         
                         return (
                         <Card key={shot.shotNumber} className="border border-border">
                            <CardContent className="p-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary">Frame {shot.shotNumber}</Badge>
                                <div className="flex items-center gap-2">
                                  {!frame?.imageData && !isGenerating && !error && (
                                    <Button
                                      size="sm"
                                      onClick={() => generateSingleFrame(shot.shotNumber)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      Generate
                                    </Button>
                                  )}
                                  {editingFrame === shot.shotNumber ? (
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
                                      {frame?.imageData && (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => startEditingFrame({...shot, ...frame})}
                                            className="h-6 w-6 p-0"
                                          >
                                            <Edit2 className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => generateSingleFrame(shot.shotNumber)}
                                            disabled={isGenerating}
                                            className="h-6 w-6 p-0"
                                          >
                                            {isGenerating ? (
                                              <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                              <RefreshCw className="h-3 w-3" />
                                            )}
                                          </Button>
                                        </>
                                      )}
                                   </div>
                                 )}
                                  {frame?.generatedAt && (
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(frame.generatedAt).toLocaleTimeString()}
                                    </span>
                                  )}
                                  {isGenerating && (
                                    <span className="text-xs text-blue-600">
                                      Generating...
                                    </span>
                                  )}
                                  {error && (
                                    <span className="text-xs text-red-600">
                                      Failed
                                    </span>
                                  )}
                               </div>
                             </div>
                             
                                <div className="bg-muted rounded-lg overflow-hidden border border-border" style={{ aspectRatio: '16 / 9' }}>
                                  {frame?.imageData ? (
                                    <img 
                                      src={frame.imageData} 
                                      alt={`Storyboard frame ${shot.shotNumber}: ${shot.description}`}
                                      className="w-full h-full object-cover"
                                      style={{ aspectRatio: '16 / 9' }}
                                      onError={(e) => {
                                        console.error('Failed to load storyboard image:', frame.imageData);
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                  ) : isGenerating ? (
                                   <div className="w-full h-full flex items-center justify-center bg-muted">
                                     <div className="text-center">
                                       <Loader2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-spin" />
                                       <p className="text-sm text-muted-foreground">Generating frame {shot.shotNumber}...</p>
                                     </div>
                                   </div>
                                 ) : error ? (
                                   <div className="w-full h-full flex items-center justify-center bg-red-50">
                                     <div className="text-center">
                                       <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                                       <p className="text-sm text-red-600">Generation failed</p>
                                       <Button 
                                         size="sm" 
                                         variant="outline" 
                                         onClick={() => generateSingleFrame(shot.shotNumber)}
                                         className="mt-2"
                                       >
                                         Retry
                                       </Button>
                                     </div>
                                   </div>
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center bg-muted">
                                     <div className="text-center">
                                       <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                       <p className="text-sm text-muted-foreground">Click Generate to create frame</p>
                                     </div>
                                   </div>
                                 )}
                                 {/* Fallback content for image load errors */}
                                 <div className="hidden w-full h-full flex items-center justify-center bg-muted">
                                   <div className="text-center">
                                     <Camera className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                     <p className="text-xs text-muted-foreground">Frame preview unavailable</p>
                                   </div>
                                 </div>
                               </div>
                             
                             <div className="space-y-2">
                                <div>
                                  <h4 className="font-medium text-xs mb-1">Description</h4>
                                  {editingFrame === shot.shotNumber ? (
                                    <Textarea
                                      value={frameEditValues.description || shot.description}
                                      onChange={(e) => setFrameEditValues(prev => ({ ...prev, description: e.target.value }))}
                                      className="text-xs min-h-[50px]"
                                    />
                                  ) : (
                                    <p className="text-xs text-muted-foreground">{shot.description}</p>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-xs mb-1">Camera Angle</h4>
                                  {editingFrame === shot.shotNumber ? (
                                    <Input
                                      value={frameEditValues.cameraAngle || shot.cameraAngle}
                                      onChange={(e) => setFrameEditValues(prev => ({ ...prev, cameraAngle: e.target.value }))}
                                      className="text-xs"
                                    />
                                  ) : (
                                    <p className="text-xs text-muted-foreground">{shot.cameraAngle}</p>
                                  )}
                                </div>
                                 <div>
                                   <h4 className="font-medium text-xs mb-1">Visual Elements</h4>
                                   {editingFrame === shot.shotNumber ? (
                                     <Textarea
                                       value={frameEditValues.visualElements || shot.visualElements}
                                       onChange={(e) => setFrameEditValues(prev => ({ ...prev, visualElements: e.target.value }))}
                                       className="text-xs min-h-[40px]"
                                     />
                                   ) : (
                                     <p className="text-xs text-muted-foreground">{shot.visualElements}</p>
                                   )}
                                 </div>
                                 {shot.scriptSegment && (
                                   <div className="border-t pt-2">
                                     <h4 className="font-medium text-xs mb-1 text-primary">Script Context</h4>
                                     <p className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded italic">
                                       "{shot.scriptSegment}"
                                     </p>
                                   </div>
                                 )}
                                 {shot.dialogueLines && shot.dialogueLines.length > 0 && (
                                   <div>
                                     <h4 className="font-medium text-xs mb-1 text-primary">Dialogue</h4>
                                     <div className="space-y-1">
                                       {shot.dialogueLines.slice(0, 2).map((dialogue, index) => (
                                         <p key={index} className="text-xs text-muted-foreground bg-primary/10 p-1 rounded">
                                           {dialogue}
                                         </p>
                                       ))}
                                     </div>
                                   </div>
                                 )}
                                {editingFrame === shot.shotNumber && frame?.imageData && (
                                  <Button
                                    size="sm"
                                    onClick={() => generateSingleFrame(shot.shotNumber)}
                                    disabled={isGenerating}
                                    className="w-full mt-2"
                                  >
                                    {isGenerating ? (
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
                        );
                       })}
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