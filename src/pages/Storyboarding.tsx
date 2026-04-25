import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Video, Upload, Loader2, Camera, Clock, Users, Edit2, Save, X, Download, RefreshCw, BookOpen, AlertCircle, ArrowLeft, Shield, Sparkles, Wand2, Trash2, Plus, FileText, Coins, Pencil, UserCircle2, Film } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOCRUpload } from "@/hooks/useOCRUpload";
import { useStoryboardProjects } from "@/hooks/useStoryboardProjects";
import { useCredits } from "@/hooks/useCredits";
import { useNavigate } from 'react-router-dom';
import { ToolPageRecommendations } from "@/components/training/ToolPageRecommendations";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFUploadProgress } from "@/components/PDFUploadProgress";
import { ArtStyleSelector, artStyles } from "@/components/ArtStyleSelector";
import { CharacterDefinitionManager, CharacterDefinition } from "@/components/CharacterDefinitionManager";
import { StyleReferenceInput } from "@/components/StyleReferenceInput";
import { StyleReferenceUpload } from "@/components/storyboard/StyleReferenceUpload";
import { SceneSelector, type Scene } from "@/components/storyboard/SceneSelector";
import { StepIndicator, type StoryboardStep } from "@/components/storyboard/StepIndicator";
import { exportShotListPDF } from "@/components/storyboard/ShotListPDF";
import { RecentProjectsGrid } from "@/components/storyboard/RecentProjectsGrid";
import { UpgradeBanner } from "@/components/storyboard/UpgradeBanner";
import { CastTab, type CastMember } from "@/components/storyboard/CastTab";
import { AnimaticTab } from "@/components/storyboard/AnimaticTab";

const CREDITS_PER_FRAME = 1;
const SHOT_TYPES = ["Wide Shot", "Medium Shot", "Close-Up", "Over-the-Shoulder", "POV", "Two-Shot", "Insert"];
const CAMERA_MOVEMENTS = ["Static", "Pan", "Tilt", "Dolly In", "Dolly Out", "Handheld", "Crane"];
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
  projectTitle?: string;
  cast?: CastMember[];
}

const Storyboarding = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { projects, loading, saveProject, updateProject, renameProject, deleteProject, refetch } = useStoryboardProjects();
  const [currentProject, setCurrentProject] = useState({
    scriptText: "",
    scriptFileName: "" as string,
    genre: "",
    tone: "",
    artStyle: "comic",
    customStylePrompt: "",
    aspectRatio: "16:9" as "16:9" | "9:16",
    characterDefinitions: [] as CharacterDefinition[],
    styleReferencePrompt: "",
    styleReferenceImage: "" // Actual base64 image URL for style reference
  });
  const [isProcessingScript, setIsProcessingScript] = useState(false);
  const [processingElapsedTime, setProcessingElapsedTime] = useState(0);
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
  const [generatingElapsedTime, setGeneratingElapsedTime] = useState(0);
  const [editingShot, setEditingShot] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Shot>>({});
  const [editingFrame, setEditingFrame] = useState<number | null>(null);
  const [frameEditValues, setFrameEditValues] = useState<Partial<StoryboardFrame>>({});
  const [regeneratingFrame, setRegeneratingFrame] = useState<number | null>(null);
  const [generatingFrames, setGeneratingFrames] = useState<Set<number>>(new Set());
  const [frameErrors, setFrameErrors] = useState<Map<number, string>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [isSavingCharacters, setIsSavingCharacters] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<Map<number, string>>(new Map());
  const [isParsingPrompt, setIsParsingPrompt] = useState<Map<number, boolean>>(new Map());
  const [frameStyles, setFrameStyles] = useState<Map<number, string>>(new Map());

  // Scene selection workflow state (Option A: cost-saving gate before shot breakdown)
  const [extractedScenes, setExtractedScenes] = useState<Scene[] | null>(null);
  const [extractedCast, setExtractedCast] = useState<CastMember[]>([]);
  const [isExtractingScenes, setIsExtractingScenes] = useState(false);

  // Cast review gate (Step 1.5) — shown after user confirms scenes, before analyze-shots
  const [pendingScenes, setPendingScenes] = useState<Scene[] | null>(null);
  const [castReviewActive, setCastReviewActive] = useState(false);
  const [generatingCastNames, setGeneratingCastNames] = useState<Set<string>>(new Set());
  const [isBulkCastGenerating, setIsBulkCastGenerating] = useState(false);

  // Editable project title state for the Step 3 viewer
  const [titleDraft, setTitleDraft] = useState<string>("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Credit gate dialog state (Step 3 confirmation)
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const { credits, deductCredits } = useCredits();

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

  // Track elapsed time during script processing
  useEffect(() => {
    if (!isProcessingScript) return;
    
    const interval = setInterval(() => {
      setProcessingElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isProcessingScript]);

  // Track elapsed time during storyboard generation
  useEffect(() => {
    if (!generatingStoryboard) return;
    
    const interval = setInterval(() => {
      setGeneratingElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [generatingStoryboard]);

  // Compute step for indicator (only shown when a Detailed Breakdown flow is in progress)
  const detailedFlowActive =
    isExtractingScenes || !!extractedScenes || castReviewActive ||
    (!!selectedProject && (selectedProject.shots?.length ?? 0) > 0);

  const currentStep: StoryboardStep = (() => {
    if (extractedScenes && !selectedProject && !castReviewActive) return 1;
    if (castReviewActive) return 1.5;
    if (selectedProject && (!selectedProject.storyboard || selectedProject.storyboard.every(f => !f.imageData))) return 2;
    return 3;
  })();

  // Auto-save shot edits (debounced) so navigating away preserves them
  useEffect(() => {
    if (!selectedProject?.id || !selectedProject.shots) return;
    if (selectedProject.id.startsWith('quick-')) return; // skip in-memory quick storyboards
    const handle = setTimeout(() => {
      updateProject(selectedProject.id, { shots: selectedProject.shots as any });
    }, 800);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedProject?.shots), selectedProject?.id]);

  const totalShotsForGen = selectedProject?.shots?.length ?? 0;
  const hasStyleRef = !!currentProject.styleReferenceImage;
  const creditsPerFrame = CREDITS_PER_FRAME + (hasStyleRef ? 1 : 0);
  const frameCreditsTotal = totalShotsForGen * creditsPerFrame;
  const projectCast: CastMember[] = selectedProject?.cast || extractedCast;
  const missingCastRefCount = projectCast.filter(c => !c.reference_image_url).length;
  // Cast refs are optional and generated separately, so we only show as info, not added to required total
  const estimatedCredits = frameCreditsTotal;
  const availableCredits = credits?.available_credits ?? 0;
  const remainingAfter = availableCredits - estimatedCredits;
  const insufficientCredits = remainingAfter < 0;
  const lowBalanceWarning = !insufficientCredits && remainingAfter < 5;
  const creditsShort = insufficientCredits ? Math.abs(remainingAfter) : 0;
  const selectedArtStyleName =
    artStyles.find(s => s.id === currentProject.artStyle)?.name || currentProject.artStyle;

  // Map of character name -> number of frames they appear in (for "Used in X frames" badge)
  const framesUsageByName: Record<string, number> = {};
  (selectedProject?.shots || []).forEach((s: any) => {
    (s.characters || []).forEach((n: string) => {
      framesUsageByName[n] = (framesUsageByName[n] || 0) + 1;
    });
  });

  const handleApproveAndGenerate = () => {
    setShowGenerateConfirm(false);
    if (!selectedProject?.storyboard || selectedProject.storyboard.length === 0) {
      // Initialize frames first, then generate all
      initializeStoryboard().then(() => {
        setTimeout(() => generateAllFrames(), 300);
      });
    } else {
      generateAllFrames();
    }
  };

  const handleBackToSceneSelector = async () => {
    if (!selectedProject) return;
    // Re-extract scenes from the original script so user can re-pick
    setIsExtractingScenes(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-scenes', {
        body: { scriptText: selectedProject.scriptText }
      });
      if (error) throw error;
      if (data?.scenes?.length) {
        setExtractedScenes(data.scenes as Scene[]);
        if (Array.isArray(data.cast)) setExtractedCast(data.cast as CastMember[]);
        setSelectedProject(null);
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Couldn't reload scenes", description: "Please try again." });
    } finally {
      setIsExtractingScenes(false);
    }
  };

  const handleDownloadShotListPDF = () => {
    if (!selectedProject?.shots?.length) return;
    const projectTitle =
      selectedProject.projectTitle ||
      currentProject.scriptFileName?.replace(/\.[^.]+$/, "") ||
      `${selectedProject.genre || 'Storyboard'} Shot List`;
    // Enrich shots with scene metadata pulled from extractedScenes when available
    const sceneByNum = new Map<number, Scene>();
    (extractedScenes || []).forEach(s => sceneByNum.set(s.sceneNumber, s));
    const enrichedShots = selectedProject.shots.map((s: any) => {
      const scene = s.sceneNumber ? sceneByNum.get(s.sceneNumber) : undefined;
      return {
        ...s,
        intExt: s.intExt || scene?.intExt,
        dayNight: s.dayNight || scene?.dayNight,
        location: s.location || scene?.location,
      };
    });
    exportShotListPDF(enrichedShots as any, {
      projectTitle,
      genre: selectedProject.genre,
      tone: selectedProject.tone,
      sceneCount: extractedScenes?.length,
    });
    toast({ title: "Shot list exported", description: "PDF downloaded." });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Capture filename so we can use it as default project title
    setCurrentProject(prev => ({ ...prev, scriptFileName: file.name }));

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

  // Step 1: Extract scenes from script (cheap, text-only). User then picks which to storyboard.
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

    setIsExtractingScenes(true);
    setExtractedScenes(null);

    try {
      toast({
        title: "Reading Script",
        description: "Identifying scenes so you can pick which ones to storyboard...",
      });

      const { data, error } = await supabase.functions.invoke('extract-scenes', {
        body: { scriptText: currentProject.scriptText }
      });

      if (error) {
        console.error('extract-scenes error:', error);
        toast({
          variant: "destructive",
          title: "Couldn't read scenes",
          description: error.message || "Try again or paste a longer script.",
        });
        return;
      }

      if (!data?.scenes || !Array.isArray(data.scenes) || data.scenes.length === 0) {
        toast({
          variant: "destructive",
          title: "No scenes found",
          description: "Couldn't detect scenes in this script. Try adding scene headings (INT./EXT.).",
        });
        return;
      }

      setExtractedScenes(data.scenes as Scene[]);
      if (Array.isArray(data.cast)) setExtractedCast(data.cast as CastMember[]);
      toast({
        title: `Found ${data.scenes.length} scene${data.scenes.length === 1 ? "" : "s"}`,
        description: "Pick which scenes to include in the storyboard.",
      });
    } catch (err) {
      console.error('Error extracting scenes:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to read scenes. Please try again.",
      });
    } finally {
      setIsExtractingScenes(false);
    }
  };

  // Step 2: After user selects scenes, build the shot list ONLY for those scenes (no images yet).
  const handleScenesConfirmed = (selectedScenes: Scene[]) => {
    if (!userProfile?.user_id) return;
    if (selectedScenes.length === 0) return;
    // Stash selection and route through optional Cast Review gate (Step 1.5).
    setPendingScenes(selectedScenes);
    setCastReviewActive(true);
  };

  const proceedToShotList = async () => {
    if (!userProfile?.user_id) return;
    const selectedScenes = pendingScenes;
    if (!selectedScenes || selectedScenes.length === 0) return;

    setIsProcessingScript(true);
    setProcessingElapsedTime(0);
    setCastReviewActive(false);

    try {
      const focusedScript = selectedScenes
        .map(s => `${s.heading}\n\n${s.text}`)
        .join("\n\n---\n\n");

      const targetShotCount = selectedScenes.reduce(
        (sum, s) => sum + (s.estimatedShots || 4),
        0
      );

      const { data, error } = await supabase.functions.invoke('analyze-shots', {
        body: {
          scriptText: focusedScript,
          genre: currentProject.genre,
          tone: currentProject.tone,
          shotCount: Math.max(2, Math.min(40, targetShotCount)),
        }
      });

      if (error) throw error;
      if (!data?.shots) throw new Error('Invalid response from analyze-shots');

      const shots = data.shots;

      const defaultTitle =
        currentProject.scriptFileName?.replace(/\.[^.]+$/, "") ||
        `${currentProject.genre || 'Storyboard'} – ${new Date().toLocaleDateString()}`;

      const savedProject = await saveProject(
        focusedScript,
        currentProject.genre,
        currentProject.tone,
        shots,
        currentProject.characterDefinitions,
        currentProject.styleReferencePrompt,
        {
          project_title: defaultTitle,
          art_style: currentProject.artStyle,
          aspect_ratio: currentProject.aspectRatio,
          scene_count: selectedScenes.length,
          cast_data: extractedCast,
        }
      );

      if (savedProject) {
        const localProject: StoryboardProjectLocal = {
          id: savedProject.id,
          scriptText: savedProject.script_text,
          genre: savedProject.genre || "",
          tone: savedProject.tone || "",
          characterCount: savedProject.character_count,
          shots: savedProject.shots || [],
          storyboard: savedProject.storyboard_frames || undefined,
          createdAt: new Date(savedProject.created_at),
          projectTitle: savedProject.project_title || defaultTitle,
          cast: savedProject.cast_data || extractedCast,
        };
        setSelectedProject(localProject);
        setTitleDraft(localProject.projectTitle || "");
        setExtractedScenes(null);
        setPendingScenes(null);
        toast({
          title: "Shot List Ready",
          description: `${shots.length} shots created from ${selectedScenes.length} scene${selectedScenes.length === 1 ? "" : "s"}. Review and edit before generating images.`,
        });
      }
    } catch (error) {
      console.error('Error building shot list:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to build shot list. Please try again.",
      });
    } finally {
      setIsProcessingScript(false);
      setProcessingElapsedTime(0);
    }
  };

  const skipCastReview = () => {
    proceedToShotList();
  };

  // Persist updated cast back to Supabase (Step 1.5 OR Cast tab on Step 3 project)
  const persistCast = async (nextCast: CastMember[]) => {
    setExtractedCast(nextCast);
    if (selectedProject?.id && !selectedProject.id.startsWith('quick-')) {
      await updateProject(selectedProject.id, { cast_data: nextCast as any });
      setSelectedProject(prev => prev ? { ...prev, cast: nextCast } : prev);
    }
  };

  const generateCastReferenceImage = async (name: string) => {
    const cast = selectedProject?.cast || extractedCast;
    const member = cast.find(c => c.name === name);
    if (!member) return;

    if (!credits || credits.available_credits < 1) {
      toast({
        variant: "destructive",
        title: "Not enough credits",
        description: "Reference images cost 1 credit each.",
      });
      return;
    }

    setGeneratingCastNames(prev => new Set(prev).add(name));
    try {
      const styleName =
        artStyles.find(s => s.id === currentProject.artStyle)?.name || currentProject.artStyle || 'cinematic';
      const styleModifier =
        artStyles.find(s => s.id === currentProject.artStyle)?.promptModifier || styleName;

      const prompt = `Three-quarter length character reference (mid-thigh to top of head), ${member.description || member.name}. Neutral confident pose, facing camera, simple atmospheric background, ${styleName} style, consistent with storyboard visual language. ${styleModifier}`;

      const { data, error } = await supabase.functions.invoke('generate-character-portrait', {
        body: {
          characterName: member.name,
          characterDescription: prompt,
          characterRole: 'storyboard cast member',
          styleDescription: styleModifier,
          genre: currentProject.genre ? [currentProject.genre] : undefined,
          projectTitle: selectedProject?.projectTitle || currentProject.scriptFileName,
        }
      });

      if (error) {
        // Try to surface the structured error from the edge function
        const ctx: any = (error as any).context;
        let parsed: any = null;
        try {
          if (ctx?.body) parsed = typeof ctx.body === 'string' ? JSON.parse(ctx.body) : ctx.body;
        } catch {}
        const msg = parsed?.error || (error as any)?.message || 'Image generation failed';
        throw new Error(msg);
      }
      if (!data?.imageUrl) throw new Error(data?.error || 'No image returned');

      const ok = await deductCredits(1, `Cast reference: ${member.name}`);
      if (!ok) {
        toast({ variant: "destructive", title: "Credit deduction failed" });
        return;
      }

      const nextCast = cast.map(c =>
        c.name === name ? { ...c, reference_image_url: data.imageUrl } : c
      );
      await persistCast(nextCast);

      toast({
        title: "Reference image ready",
        description: `${member.name}'s reference will now drive every frame they appear in.`,
      });
    } catch (err: any) {
      console.error('Cast reference error:', err);
      toast({
        variant: "destructive",
        title: "Couldn't generate reference",
        description: err?.message || "Please try again.",
      });
    } finally {
      setGeneratingCastNames(prev => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    }
  };

  const generateAllMissingCastReferences = async () => {
    const cast = selectedProject?.cast || extractedCast;
    const missing = cast.filter(c => !c.reference_image_url);
    if (missing.length === 0) return;
    if (!credits || credits.available_credits < missing.length) {
      toast({
        variant: "destructive",
        title: "Not enough credits",
        description: `You need ${missing.length} credits to generate ${missing.length} references.`,
      });
      return;
    }
    setIsBulkCastGenerating(true);
    for (const member of missing) {
      // eslint-disable-next-line no-await-in-loop
      await generateCastReferenceImage(member.name);
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, 500));
    }
    setIsBulkCastGenerating(false);
  };

  const cancelSceneSelection = () => {
    setExtractedScenes(null);
    setPendingScenes(null);
    setCastReviewActive(false);
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

    // Genre and tone are optional — fall back to sensible defaults so generation always proceeds
    if (!currentProject.genre) {
      setCurrentProject((p: any) => ({ ...p, genre: "Drama" }));
    }
    if (!currentProject.tone) {
      setCurrentProject((p: any) => ({ ...p, tone: "Cinematic" }));
    }

    setGeneratingStoryboard(true);
    setGeneratingElapsedTime(0);

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

      // Collect character images for reference
      const characterImages = currentProject.characterDefinitions
        .filter(c => c.imageUrl)
        .map(c => ({ name: c.name, imageUrl: c.imageUrl }));

      const { data, error } = await supabase.functions.invoke('generate-storyboard-simple', {
        body: {
          scene_text: currentProject.scriptText,
          style: stylePrompt,
          characterImages,
          styleReferenceImage: currentProject.styleReferenceImage
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
      setGeneratingElapsedTime(0);
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

  const parseAIPrompt = async (shotNumber: number, prompt: string) => {
    if (!selectedProject || !prompt.trim()) return;

    const currentShot = selectedProject.shots.find(s => s.shotNumber === shotNumber);
    if (!currentShot) return;

    setIsParsingPrompt(prev => new Map(prev).set(shotNumber, true));

    try {
      const { data, error } = await supabase.functions.invoke('ai-parse-shot-prompt', {
        body: { 
          prompt: prompt.trim(),
          existingShot: currentShot 
        }
      });

      if (error) {
        console.error('AI parsing error:', error);
        
        if (error.message?.includes('Rate limit') || error.message?.includes('429')) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait a moment and try again.",
            variant: "destructive"
          });
        } else if (error.message?.includes('credits') || error.message?.includes('402')) {
          toast({
            title: "AI credits depleted",
            description: "Please add credits in Settings → Workspace → Usage.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "AI parsing failed",
            description: "Failed to parse your prompt. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }

      if (data?.parsedShot) {
        // Update editValues with the parsed data
        setEditValues(data.parsedShot);
        
        // Count how many fields were updated
        const updatedFields = Object.keys(data.parsedShot).filter(
          key => data.parsedShot[key] !== currentShot[key as keyof Shot]
        ).length;

        // Clear the AI prompt
        setAiPrompt(prev => {
          const newMap = new Map(prev);
          newMap.delete(shotNumber);
          return newMap;
        });

        toast({
          title: "✓ Shot details auto-filled!",
          description: `Updated ${updatedFields} field${updatedFields !== 1 ? 's' : ''} from your prompt.`
        });
      }

    } catch (error) {
      console.error('Error calling AI parse function:', error);
      toast({
        title: "Failed to parse prompt",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsParsingPrompt(prev => new Map(prev).set(shotNumber, false));
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

  const handleSaveCharacters = async () => {
    if (!selectedProject) {
      toast({
        title: "No project selected",
        description: "Please select or create a project first",
        variant: "destructive",
      });
      return;
    }

    setIsSavingCharacters(true);

    try {
      const updatedProject = await updateProject(selectedProject.id, {
        character_definitions: currentProject.characterDefinitions
      });

      if (updatedProject) {
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
          title: "Characters Saved",
          description: "Character definitions saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving characters:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save character definitions",
        variant: "destructive",
      });
    } finally {
      setIsSavingCharacters(false);
    }
  };

  const addNewShot = async (insertAfterShotNumber?: number) => {
    if (!selectedProject) return;
    
    const shots = selectedProject.shots || [];
    
    // Create new shot with default values
    const newShot: Shot = {
      shotNumber: shots.length + 1,
      description: "",
      cameraAngle: "Medium Shot",
      characters: [],
      visualElements: "",
      duration: "3-5s",
      scriptSegment: "",
      dialogueLines: [],
      sceneAction: "",
      visualDescription: "",
      location: "",
      action: "",
      emotionalTone: "",
      shotType: "Medium Shot",
      lighting: "",
      keyProps: "",
      dialogue: ""
    };
    
    let updatedShots: Shot[];
    
    if (insertAfterShotNumber !== undefined) {
      // Insert after specific shot
      const insertIndex = shots.findIndex(s => s.shotNumber === insertAfterShotNumber);
      updatedShots = [
        ...shots.slice(0, insertIndex + 1),
        newShot,
        ...shots.slice(insertIndex + 1)
      ];
    } else {
      // Add at end
      updatedShots = [...shots, newShot];
    }
    
    // Renumber all shots sequentially
    updatedShots = updatedShots.map((shot, index) => ({
      ...shot,
      shotNumber: index + 1
    }));
    
    try {
      // Update project in database
      const updatedProject = await updateProject(selectedProject.id, {
        shots: updatedShots
      });
      
      if (updatedProject) {
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
        
        // Automatically start editing the new shot
        const newShotNumber = insertAfterShotNumber !== undefined 
          ? insertAfterShotNumber + 1 
          : updatedShots.length;
        setEditingShot(newShotNumber);
        
        toast({
          title: "Shot Added",
          description: `New shot ${newShotNumber} added successfully`,
        });
      }
    } catch (error) {
      console.error("Error adding shot:", error);
      toast({
        title: "Error",
        description: "Failed to add shot",
        variant: "destructive",
      });
    }
  };

  // This function is now replaced by generateSingleFrame - keeping for compatibility
  const regenerateFrame = async (shotNumber: number) => {
    return generateSingleFrame(shotNumber);
  };

  // Handle image upload for storyboard frame
  const handleImageUpload = async (shotNumber: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedProject) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (PNG, JPEG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setGeneratingFrames(prev => new Set([...prev, shotNumber]));

      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        
        const shot = selectedProject.shots.find(s => s.shotNumber === shotNumber);
        if (!shot) return;

        const newFrame = {
          ...shot,
          imageData: base64Data,
          generatedAt: new Date().toISOString()
        };

        const updatedStoryboard = [...(selectedProject.storyboard || [])];
        const existingIndex = updatedStoryboard.findIndex(f => f.shotNumber === shotNumber);
        
        if (existingIndex >= 0) {
          updatedStoryboard[existingIndex] = newFrame;
        } else {
          updatedStoryboard.push(newFrame);
        }

        // Save to database
        const updatedProject = await updateProject(selectedProject.id, {
          storyboard_frames: updatedStoryboard
        });

        if (updatedProject) {
          setSelectedProject({
            ...selectedProject,
            storyboard: updatedProject.storyboard_frames || undefined
          });
        }
        
        toast({
          title: "Image Uploaded",
          description: `Frame ${shotNumber} has been updated with your image.`,
        });

        setGeneratingFrames(prev => {
          const newSet = new Set(prev);
          newSet.delete(shotNumber);
          return newSet;
        });
      };

      reader.onerror = () => {
        toast({
          title: "Upload Failed",
          description: "Failed to read the image file.",
          variant: "destructive",
        });
        setGeneratingFrames(prev => {
          const newSet = new Set(prev);
          newSet.delete(shotNumber);
          return newSet;
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading the image.",
        variant: "destructive",
      });
      setGeneratingFrames(prev => {
        const newSet = new Set(prev);
        newSet.delete(shotNumber);
        return newSet;
      });
    }

    // Clear the input
    event.target.value = '';
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

      // Get the art style - use frame-specific style if set, otherwise use project default
      const frameSpecificStyle = frameStyles.get(shotNumber) || currentProject.artStyle;
      const selectedArtStyle = artStyles.find(s => s.id === frameSpecificStyle);
      const stylePrompt = frameSpecificStyle === 'custom' 
        ? currentProject.customStylePrompt 
        : (selectedArtStyle?.promptModifier || 'black and white storyboard frame, hand-drawn sketch');

      // Build character descriptions for this shot — merge author-defined characters AND extracted cast
      const projectCastForFrame: CastMember[] = selectedProject.cast || [];
      const characterDescriptions = shot.characters
        .map(charName => {
          const def = currentProject.characterDefinitions.find(
            c => c.name.toLowerCase() === charName.toLowerCase()
          );
          if (def) {
            let desc = `${def.name}: ${def.description}. ${def.traits}`;
            if (def.imageUrl) {
              desc += ` [REFERENCE IMAGE PROVIDED - Match this character's appearance exactly]`;
            }
            return desc;
          }
          // Fall back to extracted cast description for consistency
          const castMember = projectCastForFrame.find(
            c => c.name.toLowerCase() === charName.toLowerCase()
          );
          if (castMember) {
            let desc = `Character: ${castMember.name} — ${castMember.description}. Maintain consistent appearance with established character design.`;
            if (castMember.reference_image_url) {
              desc += ` [REFERENCE IMAGE PROVIDED - Match this character's appearance exactly]`;
            }
            return desc;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');

      // Collect character image URLs (manual character defs first, then extracted cast refs)
      const characterImagesMap = new Map<string, { name: string; imageUrl: string }>();
      shot.characters.forEach(charName => {
        const def = currentProject.characterDefinitions.find(
          c => c.name.toLowerCase() === charName.toLowerCase()
        );
        if (def?.imageUrl) {
          characterImagesMap.set(def.name.toLowerCase(), { name: def.name, imageUrl: def.imageUrl });
          return;
        }
        const castMember = projectCastForFrame.find(
          c => c.name.toLowerCase() === charName.toLowerCase()
        );
        if (castMember?.reference_image_url) {
          characterImagesMap.set(castMember.name.toLowerCase(), {
            name: castMember.name,
            imageUrl: castMember.reference_image_url,
          });
        }
      });
      const characterImages = Array.from(characterImagesMap.values());

      const { data: frameData, error } = await supabase.functions.invoke('generate-single-frame', {
        body: { 
          shot,
          artStyle: stylePrompt,
          aspectRatio: currentProject.aspectRatio || '16:9',
          characterDescriptions,
          characterImages,
          styleReference: currentProject.styleReferencePrompt,
          styleReferenceImage: currentProject.styleReferenceImage
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

      let updatedStoryboard: StoryboardFrame[];
      if (selectedProject.storyboard) {
        const existingIndex = selectedProject.storyboard.findIndex(f => f.shotNumber === shotNumber);
        if (existingIndex >= 0) {
          // Replace existing frame
          updatedStoryboard = selectedProject.storyboard.map(frame => 
            frame.shotNumber === shotNumber ? newFrame : frame
          );
        } else {
          // Add new frame
          updatedStoryboard = [...selectedProject.storyboard, newFrame];
        }
      } else {
        // Initialize storyboard
        updatedStoryboard = [newFrame];
      }

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
        // Persist completion metadata: thumbnail (first frame), counts, complete flag
        const frames = (refreshedProject.storyboard_frames || []) as StoryboardFrame[];
        const firstFrameImg = frames.find(f => f.imageData)?.imageData;
        const generatedCount = frames.filter(f => f.imageData).length;
        const allDone = generatedCount > 0 && generatedCount === (refreshedProject.shots?.length || 0);

        if (allDone) {
          await updateProject(selectedProject.id, {
            is_complete: true,
            thumbnail_url: firstFrameImg,
            frame_count: generatedCount,
          } as any);
        }

        setSelectedProject({
          id: refreshedProject.id,
          scriptText: refreshedProject.script_text,
          genre: refreshedProject.genre || "",
          tone: refreshedProject.tone || "",
          characterCount: refreshedProject.character_count,
          shots: refreshedProject.shots || [],
          storyboard: refreshedProject.storyboard_frames || undefined,
          createdAt: new Date(refreshedProject.created_at),
          projectTitle: refreshedProject.project_title || undefined,
          cast: refreshedProject.cast_data || [],
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

    // Use landscape orientation for grid layout
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 10;
    const shotsPerRow = 4;
    const shotsPerPage = 8; // 2 rows of 4
    
    // Calculate dimensions for each cell
    const cellWidth = (pageWidth - margin * (shotsPerRow + 1)) / shotsPerRow;
    const cellHeight = (pageHeight - margin * 3) / 2; // 2 rows
    const imageHeight = cellHeight * 0.65; // Image takes 65% of cell height
    const noteHeight = cellHeight * 0.35; // Notes take 35% of cell height
    
    let currentPage = 0;
    
    // Add title page
    pdf.setFontSize(24);
    pdf.setTextColor(40, 40, 40);
    const title = 'Storyboard';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, 20);
    
    // Add project info
    pdf.setFontSize(12);
    const projectInfo = `${selectedProject.genre ? selectedProject.genre : ''} ${selectedProject.tone ? '- ' + selectedProject.tone : ''}`.trim();
    if (projectInfo) {
      const infoWidth = pdf.getTextWidth(projectInfo);
      pdf.text(projectInfo, (pageWidth - infoWidth) / 2, 30);
    }
    
    // Process frames in groups
    const frames = selectedProject.storyboard;
    for (let i = 0; i < frames.length; i += shotsPerPage) {
      // Add new page for each set of 8 shots
      if (i > 0 || frames.length > 0) {
        pdf.addPage('landscape');
        currentPage++;
      }
      
      const pageFrames = frames.slice(i, i + shotsPerPage);
      
      // Draw each frame in the grid
      pageFrames.forEach((frame, index) => {
        const row = Math.floor(index / shotsPerRow);
        const col = index % shotsPerRow;
        
        const x = margin + col * (cellWidth + margin);
        const y = margin + row * (cellHeight + margin);
        
        // Draw border around cell
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.rect(x, y, cellWidth, cellHeight);
        
        // Add image if available
        if (frame.imageData) {
          try {
            const imgWidth = cellWidth - 4;
            const imgHeight = imageHeight - 4;
            pdf.addImage(frame.imageData, 'JPEG', x + 2, y + 2, imgWidth, imgHeight);
          } catch (error) {
            console.error('Error adding image to PDF:', error);
            // Draw placeholder if image fails
            pdf.setFillColor(240, 240, 240);
            pdf.rect(x + 2, y + 2, cellWidth - 4, imageHeight - 4, 'F');
          }
        } else {
          // Draw placeholder box for missing image
          pdf.setFillColor(240, 240, 240);
          pdf.rect(x + 2, y + 2, cellWidth - 4, imageHeight - 4, 'F');
        }
        
        // Add shot number
        const shotNumY = y + imageHeight + 4;
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Shot ${frame.shotNumber}`, x + 3, shotNumY);
        
        // Add notes/description
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(60, 60, 60);
        
        const noteY = shotNumY + 4;
        const noteWidth = cellWidth - 6;
        
        // Combine description with key details
        let noteText = `Note: ${frame.description}`;
        if (frame.cameraAngle) {
          noteText += ` (${frame.cameraAngle})`;
        }
        
        // Split text to fit in note area
        const lines = pdf.splitTextToSize(noteText, noteWidth);
        const maxLines = Math.floor((noteHeight - 8) / 3); // Limit lines to fit in note area
        const displayLines = lines.slice(0, maxLines);
        
        displayLines.forEach((line: string, lineIndex: number) => {
          pdf.text(line, x + 3, noteY + (lineIndex * 3));
        });
      });
    }

    // Save the PDF
    pdf.save(`storyboard-${selectedProject.genre || 'untitled'}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Storyboard exported in grid format"
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

                  {/* Privacy Statement */}
                  <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg border border-muted">
                    <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your privacy matters. We will never use your scripts, images, likeness, voiceover, or any creative work for training, marketing, or any other purpose. Your content remains yours.
                    </p>
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
                    {selectedProject && (
                      <Button 
                        onClick={async () => {
                          if (!selectedProject) return;
                          try {
                            const updatedProject = await updateProject(selectedProject.id, {
                              script_text: currentProject.scriptText
                            });
                            
                            if (updatedProject) {
                              const localProject = {
                                id: updatedProject.id,
                                scriptText: updatedProject.script_text,
                                genre: updatedProject.genre || "",
                                tone: updatedProject.tone || "",
                                characterCount: updatedProject.character_count || 0,
                                shots: updatedProject.shots ? (updatedProject.shots as Shot[]) : [],
                                storyboard: updatedProject.storyboard_frames ? (updatedProject.storyboard_frames as StoryboardFrame[]) : undefined,
                                createdAt: new Date(updatedProject.created_at)
                              };
                              setSelectedProject(localProject);
                              toast({
                                title: "Script saved",
                                description: "Your script changes have been saved successfully.",
                              });
                            }
                          } catch (error) {
                            console.error('Error saving script:', error);
                            toast({
                              title: "Error",
                              description: "Failed to save script changes. Please try again.",
                              variant: "destructive"
                            });
                          }
                        }}
                        className="w-full"
                        variant="default"
                        disabled={!selectedProject}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Script
                      </Button>
                    )}
                  </div>

                  {/* Art Style Selection */}
                  <ArtStyleSelector
                    selectedStyle={currentProject.artStyle}
                    customStylePrompt={currentProject.customStylePrompt}
                    onStyleChange={(styleId) => setCurrentProject(prev => ({ ...prev, artStyle: styleId }))}
                    onCustomPromptChange={(prompt) => setCurrentProject(prev => ({ ...prev, customStylePrompt: prompt }))}
                  />

                  {/* Style Reference Upload (Image) */}
                  <StyleReferenceUpload
                    styleImageUrl={currentProject.styleReferenceImage}
                    onStyleImageChange={(url) => setCurrentProject(prev => ({ ...prev, styleReferenceImage: url || "" }))}
                    onStyleDescriptionGenerated={(description) => {
                      if (description && !currentProject.styleReferencePrompt) {
                        setCurrentProject(prev => ({ ...prev, styleReferencePrompt: description }));
                      }
                    }}
                  />

                  {/* Style Reference Text Description */}
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

                  {/* Script Processing Progress */}
                  {isProcessingScript && (
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-shrink-0 p-2 rounded-lg bg-blue-500/10">
                              <Camera className="h-6 w-6 text-blue-500 animate-pulse" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">Processing your script...</p>
                              <p className="text-xs text-muted-foreground">This may take 30-60 seconds. Please standby.</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono">{processingElapsedTime}s</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          <span className="text-sm text-muted-foreground">Creating shot breakdown...</span>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Storyboard Generation Progress */}
                  {generatingStoryboard && (
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-shrink-0 p-2 rounded-lg bg-green-500/10">
                              <Video className="h-6 w-6 text-green-500 animate-pulse" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">Generating storyboard with AI...</p>
                              <p className="text-xs text-muted-foreground">This may take 30-60 seconds. Please standby.</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono">{generatingElapsedTime}s</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                          <span className="text-sm text-muted-foreground">Creating visual frames...</span>
                        </div>
                      </div>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={createStoryboard} 
                      disabled={isProcessingScript || isProcessingFile || generatingStoryboard || isExtractingScenes || !!extractedScenes}
                      size="lg"
                      variant="default"
                    >
                      {isExtractingScenes ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Reading Scenes...
                        </>
                      ) : isProcessingScript ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Building Shot List...
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
                      disabled={isProcessingScript || isProcessingFile || generatingStoryboard || isExtractingScenes || !!extractedScenes}
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
                    <p><strong>Detailed Breakdown:</strong> Pick scenes → review shot list → generate frames (recommended, lowest cost)</p>
                    <p><strong>Quick Storyboard:</strong> Skips scene selection — generates all frames immediately (higher cost)</p>
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
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recent Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentProjectsGrid
                    projects={projects}
                    totalCount={projects.length}
                    limit={6}
                    loading={loading}
                    selectedId={selectedProject?.id}
                    compact
                    onRename={(id, newTitle) => renameProject(id, newTitle)}
                    onViewAll={() => navigate('/dashboard?tab=storyboards')}
                    onOpen={(p) => {
                      setSelectedProject({
                        id: p.id,
                        scriptText: p.script_text,
                        genre: p.genre || "",
                        tone: p.tone || "",
                        characterCount: p.character_count,
                        shots: (p.shots as any) || [],
                        storyboard: (p.storyboard_frames as any) || undefined,
                        createdAt: new Date(p.created_at),
                        projectTitle: p.project_title || undefined,
                        cast: p.cast_data || [],
                      });
                      setTitleDraft(p.project_title || "");
                    }}
                    onDelete={(id) => {
                      deleteProject(id);
                      if (selectedProject?.id === id) setSelectedProject(null);
                    }}
                  />
                </CardContent>
              </Card>

              {/* Training Recommendations */}
              <ToolPageRecommendations 
                toolName="storyboarding"
                maxCourses={2}
              />
            </div>
          </div>

          {/* Step Indicator (Detailed Breakdown flow only) */}
          {detailedFlowActive && (
            <div className="mt-8">
              <UpgradeBanner
                message="Unlock unlimited projects, GIF export, character consistency, and shot list PDF on Creator — $19/mo."
                ctaLabel="See plans"
                className="mb-4"
              />
              <StepIndicator currentStep={currentStep} />
            </div>
          )}

          {/* Scene Selector — Option A: cost gate before shot breakdown */}
          {extractedScenes && extractedScenes.length > 0 && !castReviewActive && (
            <div className="mt-4">
              <SceneSelector
                scenes={extractedScenes}
                onConfirm={handleScenesConfirmed}
                onCancel={cancelSceneSelection}
                isProcessing={isProcessingScript || isExtractingScenes}
              />
            </div>
          )}

          {/* Step 1.5 — Optional Cast Review gate */}
          {castReviewActive && (
            <div className="mt-4">
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserCircle2 className="h-5 w-5 text-primary" />
                    Review Your Cast
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Generate reference images now to keep characters looking the same across every frame. Optional — you can always do this later.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <div>
                      <span className="font-medium text-foreground">{extractedCast.length}</span>{" "}
                      character{extractedCast.length === 1 ? "" : "s"} found ·{" "}
                      <span className="font-medium text-foreground">
                        {extractedCast.filter(c => !c.reference_image_url).length}
                      </span>{" "}
                      missing references
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Estimated total: {extractedCast.filter(c => !c.reference_image_url).length} credit
                      {extractedCast.filter(c => !c.reference_image_url).length === 1 ? "" : "s"}
                    </div>
                  </div>

                  <CastTab
                    cast={extractedCast}
                    onGenerateReference={generateCastReferenceImage}
                    onGenerateAllMissing={generateAllMissingCastReferences}
                    generatingNames={generatingCastNames}
                    isBulkGenerating={isBulkCastGenerating}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
                    <Button variant="ghost" size="sm" onClick={skipCastReview} disabled={isProcessingScript}>
                      Skip this step →
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={cancelSceneSelection} disabled={isProcessingScript}>
                        ← Back
                      </Button>
                      <Button size="sm" onClick={proceedToShotList} disabled={isProcessingScript}>
                        {isProcessingScript ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : null}
                        Continue to Shot List →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Shot Breakdown and Storyboard Section */}
          {selectedProject && !extractedScenes && (
            <div className="mt-4 space-y-6">
              {/* Editable Project Title (top of project viewer) */}
              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-center gap-3 flex-wrap">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  {isEditingTitle ? (
                    <Input
                      autoFocus
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      onBlur={async () => {
                        setIsEditingTitle(false);
                        const next = titleDraft.trim();
                        if (!selectedProject.id || selectedProject.id.startsWith('quick-')) return;
                        if (!next || next === (selectedProject.projectTitle || '')) return;
                        await renameProject(selectedProject.id, next);
                        setSelectedProject(prev => prev ? { ...prev, projectTitle: next } : prev);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                        if (e.key === 'Escape') {
                          setTitleDraft(selectedProject.projectTitle || '');
                          setIsEditingTitle(false);
                        }
                      }}
                      className="flex-1 min-w-[200px] text-lg font-semibold"
                      placeholder="Untitled storyboard"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTitleDraft(selectedProject.projectTitle || currentProject.scriptFileName?.replace(/\.[^.]+$/, '') || '');
                        setIsEditingTitle(true);
                      }}
                      className="flex-1 min-w-[200px] text-left text-lg font-semibold hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <span className="truncate">
                        {selectedProject.projectTitle || currentProject.scriptFileName?.replace(/\.[^.]+$/, '') || 'Untitled storyboard'}
                      </span>
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {selectedProject.shots?.length ?? 0} shot{(selectedProject.shots?.length ?? 0) === 1 ? '' : 's'}
                  </Badge>
                </CardContent>
              </Card>

              {/* Project tabs: Shot list / Cast */}
              <Tabs defaultValue="shots" className="w-full">
                <TabsList>
                  <TabsTrigger value="shots">
                    <Camera className="h-4 w-4 mr-1.5" />
                    Shot List
                  </TabsTrigger>
                  <TabsTrigger value="cast">
                    <UserCircle2 className="h-4 w-4 mr-1.5" />
                    Cast {selectedProject.cast?.length ? `(${selectedProject.cast.length})` : ''}
                  </TabsTrigger>
                  <TabsTrigger value="animatic">
                    <Film className="h-4 w-4 mr-1.5" />
                    Animatic
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="cast" className="mt-4">
                  <CastTab
                    cast={selectedProject.cast || []}
                    onGenerateReference={generateCastReferenceImage}
                    onGenerateAllMissing={generateAllMissingCastReferences}
                    generatingNames={generatingCastNames}
                    isBulkGenerating={isBulkCastGenerating}
                    framesUsageByName={framesUsageByName}
                  />
                </TabsContent>
                <TabsContent value="animatic" className="mt-4">
                  <AnimaticTab
                    frames={(selectedProject.storyboard || []).map((f: any) => ({
                      shotNumber: f.shotNumber,
                      imageData: f.imageData,
                      description: f.description,
                      sceneHeading: f.sceneHeading || f.location || f.description,
                    }))}
                    aspectRatio={(selectedProject as any).aspectRatio}
                    projectTitle={selectedProject.projectTitle || currentProject.scriptFileName?.replace(/\.[^.]+$/, '')}
                    projectId={selectedProject.id && !selectedProject.id.startsWith('quick-') ? selectedProject.id : undefined}
                    existingAnimaticUrl={(selectedProject as any).animaticUrl ?? null}
                    isPaidUser={(credits?.available_credits ?? 0) > 0}
                    onAnimaticSaved={async (url) => {
                      await deductCredits(2, 'Animatic GIF export');
                      setSelectedProject(prev => prev ? ({ ...prev, animaticUrl: url } as any) : prev);
                    }}
                  />
                </TabsContent>
                <TabsContent value="shots" className="mt-4 space-y-6">

              {/* Step 2 Banner: review shot list + live credit estimator */}
              {(!selectedProject.storyboard || selectedProject.storyboard.every(f => !f.imageData)) && (
                <Card
                  className={`border ${
                    insufficientCredits
                      ? 'border-destructive/50 bg-destructive/5'
                      : lowBalanceWarning
                      ? 'border-yellow-500/40 bg-yellow-500/5'
                      : 'border-primary/30 bg-primary/5'
                  }`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-[220px]">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                          <Camera className="h-4 w-4 text-primary" />
                          Step 2: Review Shot List
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Edit any shot below, then approve to generate frames.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={handleBackToSceneSelector} disabled={isExtractingScenes}>
                          {isExtractingScenes ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowLeft className="h-4 w-4 mr-2" />}
                          Back to Scenes
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownloadShotListPDF}>
                          <Download className="h-4 w-4 mr-2" />
                          Shot List PDF
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setShowGenerateConfirm(true)}
                          disabled={totalShotsForGen === 0 || isGenerating || insufficientCredits}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Approve & Generate →
                        </Button>
                      </div>
                    </div>

                    {/* Live credit estimator */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-border/50">
                      <div>
                        <div className="text-muted-foreground">Estimated</div>
                        <div className="font-semibold text-foreground text-sm">
                          {estimatedCredits} credit{estimatedCredits === 1 ? '' : 's'}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {totalShotsForGen} × {creditsPerFrame}/frame
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Your balance</div>
                        <div className="font-semibold text-foreground text-sm">{availableCredits}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">After generation</div>
                        <div
                          className={`font-semibold text-sm ${
                            insufficientCredits
                              ? 'text-destructive'
                              : lowBalanceWarning
                              ? 'text-yellow-500'
                              : 'text-foreground'
                          }`}
                        >
                          {remainingAfter}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Style</div>
                        <div className="font-semibold text-foreground text-sm truncate">{selectedArtStyleName}</div>
                        {hasStyleRef && (
                          <div className="text-[10px] text-primary">+1 cr/frame (ref image)</div>
                        )}
                      </div>
                    </div>

                    {hasStyleRef && (
                      <p className="text-[11px] text-muted-foreground italic">
                        Style reference adds 1 credit per frame for enhanced accuracy.
                      </p>
                    )}

                    {insufficientCredits && (
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/30">
                        <span className="text-xs text-destructive font-medium">
                          Insufficient credits. You need {creditsShort} more credit{creditsShort === 1 ? '' : 's'}.
                        </span>
                        <Button size="sm" variant="destructive" onClick={() => navigate('/membership')}>
                          Get Credits →
                        </Button>
                      </div>
                    )}

                    {lowBalanceWarning && !insufficientCredits && (
                      <p className="text-[11px] text-yellow-500">
                        Running low on credits — consider topping up after this generation.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}


              {/* Shot Breakdown */}
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Shot Breakdown
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleDownloadShotListPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Shot List PDF
                      </Button>
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
                             {/* Characters in this scene — read-only chips from extracted cast */}
                             {shot.characters && shot.characters.length > 0 && (
                               <div className="flex flex-wrap items-center gap-1.5 -mt-1">
                                 <span className="text-[10px] uppercase tracking-wide text-muted-foreground">In scene:</span>
                                 {shot.characters.map((c, i) => {
                                   const known = (selectedProject.cast || []).find(
                                     (m) => m.name.toLowerCase() === String(c).toLowerCase()
                                   );
                                   return (
                                     <Badge
                                       key={`${shot.shotNumber}-char-${i}`}
                                       variant={known ? "default" : "outline"}
                                       className="text-[10px] px-1.5 py-0"
                                       title={known?.description || undefined}
                                     >
                                       {c}
                                     </Badge>
                                   );
                                 })}
                               </div>
                             )}
                             {/* AI Prompt Section - Shows FIRST when editing */}
                             {editingShot === shot.shotNumber && (
                               <>
                                 <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                                   <div className="flex items-start gap-2 mb-2">
                                     <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                                     <div className="flex-1">
                                       <Label className="text-sm font-medium">
                                         AI Shot Assistant
                                       </Label>
                                       <p className="text-xs text-muted-foreground">
                                         Describe what you want and AI will fill the fields below
                                       </p>
                                     </div>
                                   </div>
                                   <Textarea
                                     placeholder="e.g., 'Close-up of Sarah looking worried in dimly lit kitchen, dramatic side lighting, 3-4 seconds'"
                                     value={aiPrompt.get(shot.shotNumber) || ''}
                                     onChange={(e) => setAiPrompt(new Map(aiPrompt).set(shot.shotNumber, e.target.value))}
                                     className="text-sm mb-2"
                                     rows={3}
                                   />
                                   <Button
                                     size="sm"
                                     onClick={() => parseAIPrompt(shot.shotNumber, aiPrompt.get(shot.shotNumber) || '')}
                                     disabled={!aiPrompt.get(shot.shotNumber)?.trim() || isParsingPrompt.get(shot.shotNumber)}
                                     className="w-full"
                                   >
                                     {isParsingPrompt.get(shot.shotNumber) ? (
                                       <>
                                         <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                         Parsing...
                                       </>
                                     ) : (
                                       <>
                                         <Wand2 className="h-3 w-3 mr-2" />
                                         Auto-Fill Fields
                                       </>
                                     )}
                                   </Button>
                                 </div>

                                 {/* Divider */}
                                 <div className="relative my-4">
                                   <div className="absolute inset-0 flex items-center">
                                     <span className="w-full border-t" />
                                   </div>
                                   <div className="relative flex justify-center text-xs uppercase">
                                     <span className="bg-background px-2 text-muted-foreground">
                                       Or edit manually
                                     </span>
                                   </div>
                                 </div>
                               </>
                             )}

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

                            {/* Shot Type & Camera Movement */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <h4 className="font-medium text-sm mb-1">Shot Type</h4>
                                {editingShot === shot.shotNumber ? (
                                  <Select
                                    value={editValues.shotType || shot.shotType || ""}
                                    onValueChange={(v) => setEditValues(prev => ({ ...prev, shotType: v }))}
                                  >
                                    <SelectTrigger className="text-sm h-9">
                                      <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {SHOT_TYPES.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <p className="text-sm text-muted-foreground">{shot.shotType || shot.cameraAngle}</p>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-sm mb-1">Camera Movement</h4>
                                {editingShot === shot.shotNumber ? (
                                  <Select
                                    value={(editValues as any).cameraMovement || (shot as any).cameraMovement || "Static"}
                                    onValueChange={(v) => setEditValues(prev => ({ ...(prev as any), cameraMovement: v }))}
                                  >
                                    <SelectTrigger className="text-sm h-9">
                                      <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {CAMERA_MOVEMENTS.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <p className="text-sm text-muted-foreground">{(shot as any).cameraMovement || "Static"}</p>
                                )}
                              </div>
                            </div>

                            {/* Camera Angle (free-text, secondary) */}
                            <div>
                              <h4 className="font-medium text-sm mb-1">Camera Angle</h4>
                              {editingShot === shot.shotNumber ? (
                                <Input
                                  value={editValues.cameraAngle || shot.cameraAngle}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, cameraAngle: e.target.value }))}
                                  className="text-sm"
                                  placeholder="e.g., Eye level, Low angle"
                                />
                              ) : (
                                <p className="text-sm text-muted-foreground">{shot.cameraAngle}</p>
                              )}
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
                      
                      <div className="pt-3 mt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addNewShot(shot.shotNumber)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Insert Shot Below
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                   </div>
                   
                   <div className="mt-4 flex justify-center">
                     <Button
                       variant="outline"
                       onClick={() => addNewShot()}
                       className="w-full max-w-md"
                     >
                       <Plus className="h-4 w-4 mr-2" />
                       Add Another Shot
                     </Button>
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
                                      <>
                                        <Select
                                          value={frameStyles.get(shot.shotNumber) || currentProject.artStyle}
                                          onValueChange={(value) => {
                                            setFrameStyles(prev => new Map(prev).set(shot.shotNumber, value));
                                          }}
                                        >
                                          <SelectTrigger className="h-6 w-[140px] text-xs">
                                            <SelectValue placeholder="Visual Style" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {artStyles.map((style) => (
                                              <SelectItem key={style.id} value={style.id} className="text-xs">
                                                {style.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <Button
                                          size="sm"
                                          onClick={() => generateSingleFrame(shot.shotNumber)}
                                          className="h-6 px-2 text-xs"
                                        >
                                          <Camera className="h-3 w-3 mr-1" />
                                          Generate
                                        </Button>
                                        <div className="relative">
                                          <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(shot.shotNumber, e)}
                                            className="hidden"
                                            id={`upload-frame-${shot.shotNumber}`}
                                          />
                                          <Label
                                            htmlFor={`upload-frame-${shot.shotNumber}`}
                                            className="cursor-pointer"
                                          >
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="outline"
                                              className="h-6 px-2 text-xs"
                                              asChild
                                            >
                                              <span>
                                                <Upload className="h-3 w-3 mr-1" />
                                                Upload
                                              </span>
                                            </Button>
                                          </Label>
                                        </div>
                                      </>
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
                             
              <div className="bg-muted rounded-lg overflow-hidden border border-border aspect-video">
                {frame?.imageData ? (
                  <img 
                    src={frame.imageData} 
                    alt={`Storyboard frame ${shot.shotNumber}: ${shot.description}`}
                    className="w-full h-full object-cover"
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
                    <div className="text-center px-4">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <p className="text-sm font-medium text-red-600 mb-1">Generation failed</p>
                      {error.includes('policy') && (
                        <p className="text-xs text-red-500 mb-2">
                          Content policy violation. Try adjusting the scene description.
                        </p>
                      )}
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
                                        <p className="text-sm text-muted-foreground mb-2">Click Generate to create frame</p>
                                        <p className="text-xs text-muted-foreground">or Upload your own image</p>
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
                                     <p className="text-xs text-muted-foreground">{Array.isArray(shot.visualElements) ? shot.visualElements.filter(Boolean).join(" · ") : shot.visualElements}</p>
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
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Step 3 — Credit confirmation gate before generation
          On mobile (<sm), renders as a bottom sheet via positional classes. */}
      <AlertDialog open={showGenerateConfirm} onOpenChange={setShowGenerateConfirm}>
        <AlertDialogContent
          className="sm:max-w-md max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-t-2xl max-sm:rounded-b-none max-sm:w-full max-sm:max-w-full"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to Generate?</AlertDialogTitle>
            <AlertDialogDescription>
              Review the details below before we use your credits.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
              <div>
                <div className="text-xs text-muted-foreground">Frames to generate</div>
                <div className="font-semibold text-foreground">{totalShotsForGen}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Frames cost</div>
                <div className="font-semibold text-foreground">
                  {frameCreditsTotal} credit{frameCreditsTotal === 1 ? '' : 's'}
                </div>
                {missingCastRefCount > 0 && (
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    + {missingCastRefCount} optional cast ref{missingCastRefCount === 1 ? '' : 's'}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Your balance</div>
                <div className="font-semibold text-foreground">{availableCredits}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Remaining after</div>
                <div
                  className={`font-semibold ${
                    insufficientCredits
                      ? 'text-destructive'
                      : lowBalanceWarning
                      ? 'text-yellow-500'
                      : 'text-foreground'
                  }`}
                >
                  {remainingAfter}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Style</div>
                <div className="font-semibold text-foreground truncate">{selectedArtStyleName}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Aspect ratio</div>
                <div className="font-semibold text-foreground">{currentProject.aspectRatio}</div>
              </div>
            </div>

            {hasStyleRef && (
              <p className="text-xs text-muted-foreground italic">
                Style reference image active — adds 1 credit per frame.
              </p>
            )}

            {insufficientCredits && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-destructive font-medium">
                  Need {creditsShort} more credit{creditsShort === 1 ? '' : 's'} to generate.
                </span>
                <Button size="sm" variant="destructive" onClick={() => { setShowGenerateConfirm(false); navigate('/membership'); }}>
                  Get Credits →
                </Button>
              </div>
            )}

            {lowBalanceWarning && !insufficientCredits && (
              <p className="text-xs text-yellow-500">Running low on credits.</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveAndGenerate} disabled={insufficientCredits}>
              Confirm & Generate →
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default Storyboarding;