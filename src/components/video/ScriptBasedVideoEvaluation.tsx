import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Brain,
  FileText,
  User,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ScriptBasedVideoAnalysis {
  id: string;
  videoFile: File | null;
  videoUrl: string;
  scriptText: string;
  characterName: string;
  sceneDescription: string;
  scriptId?: string;
  analysisResult: {
    performance: {
      score: number;
      strengths: string[];
      improvements: string[];
    };
    technical: {
      audio: number;
      video: number;
      lighting: number;
      framing: number;
    };
    emotional: {
      engagement: number;
      authenticity: number;
      charisma: number;
    };
    feedback: string;
    recommendations: string[];
  };
  createdAt: Date;
  status: "pending" | "analyzing" | "completed" | "error";
}

interface ScriptBasedVideoEvaluationProps {
  scriptId?: string;
  scriptText?: string;
  characterName?: string;
  sceneDescription?: string;
  onAnalysisComplete?: (analysis: ScriptBasedVideoAnalysis) => void;
}

export const ScriptBasedVideoEvaluation: React.FC<ScriptBasedVideoEvaluationProps> = ({
  scriptId,
  scriptText: initialScriptText = '',
  characterName: initialCharacterName = '',
  sceneDescription: initialSceneDescription = '',
  onAnalysisComplete
}) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<ScriptBasedVideoAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ScriptBasedVideoAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<ScriptBasedVideoAnalysis | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [scriptText, setScriptText] = useState(initialScriptText);
  const [characterName, setCharacterName] = useState(initialCharacterName);
  const [sceneDescription, setSceneDescription] = useState(initialSceneDescription);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type.startsWith('video/')) {
        const newAnalysis: ScriptBasedVideoAnalysis = {
          id: Date.now().toString(),
          videoFile: file,
          videoUrl: URL.createObjectURL(file),
          scriptText,
          characterName,
          sceneDescription,
          scriptId,
          analysisResult: {
            performance: { score: 0, strengths: [], improvements: [] },
            technical: { audio: 0, video: 0, lighting: 0, framing: 0 },
            emotional: { engagement: 0, authenticity: 0, charisma: 0 },
            feedback: "",
            recommendations: []
          },
          createdAt: new Date(),
          status: "pending"
        };

        setAnalyses(prev => [newAnalysis, ...prev]);
        setSelectedAnalysis(newAnalysis);
        setCurrentVideo(newAnalysis);

        toast({
          title: "Video uploaded",
          description: `${file.name} is ready for script-based analysis`
        });
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const analyzeVideo = async () => {
    if (!selectedAnalysis || !selectedAnalysis.videoFile) {
      toast({
        title: "No video selected",
        description: "Please upload a video file to analyze",
        variant: "destructive"
      });
      return;
    }

    if (!scriptText.trim()) {
      toast({
        title: "Script text required",
        description: "Please provide the script text for context",
        variant: "destructive"
      });
      return;
    }

    if (!characterName.trim()) {
      toast({
        title: "Character name required",
        description: "Please provide the character name you're playing",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setSelectedAnalysis(prev => prev ? { ...prev, status: "analyzing" } : null);

    try {
      // Call the analyze-video edge function with script context
      const { data, error } = await supabase.functions.invoke('analyze-video', {
        body: {
          videoUrl: selectedAnalysis.videoUrl,
          evaluationType: 'script_based',
          userId: userProfile?.id,
          scriptId: scriptId,
          scriptText: scriptText,
          characterName: characterName,
          sceneDescription: sceneDescription
        }
      });

      if (error) {
        console.error('Script-based video analysis error:', error);
        const errorMessage = error.message || error.toString();
        
        // Check if this is a retryable error
        if (errorMessage.includes('temporarily overloaded') || errorMessage.includes('try again') || errorMessage.includes('Rate limit')) {
          toast({
            title: "AI service is temporarily busy",
            description: "Please try analyzing again in a few moments.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Analysis failed",
            description: `Failed to analyze video: ${errorMessage}`,
            variant: "destructive"
          });
        }
        return;
      }

      if (data?.analysis) {
        const updatedAnalysis = {
          ...selectedAnalysis,
          analysisResult: data.analysis,
          status: "completed" as const
        };

        setAnalyses(prev => 
          prev.map(analysis => 
            analysis.id === selectedAnalysis.id ? updatedAnalysis : analysis
          )
        );
        setSelectedAnalysis(updatedAnalysis);

        // Call the completion callback if provided
        if (onAnalysisComplete) {
          onAnalysisComplete(updatedAnalysis);
        }

        toast({
          title: "Script-based analysis complete",
          description: "Your video has been analyzed with script context"
        });
      }
    } catch (error) {
      console.error('Error analyzing video:', error);
      setSelectedAnalysis(prev => prev ? { ...prev, status: "error" } : null);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-blue-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      {/* Script Context Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Script Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="scriptText">Script Text</Label>
            <Textarea
              id="scriptText"
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder="Paste the script text for the scene you're performing..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="characterName">Character Name</Label>
              <Input
                id="characterName"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Enter the character name you're playing"
              />
            </div>

            <div>
              <Label htmlFor="sceneDescription">Scene Description</Label>
              <Input
                id="sceneDescription"
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                placeholder="Brief description of the scene"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Performance Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Drop your performance video here</p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                Choose Video File
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {selectedAnalysis && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p><strong>Character:</strong> {characterName || 'Not specified'}</p>
                  <p><strong>Scene:</strong> {sceneDescription || 'Not specified'}</p>
                </div>

                <Button 
                  onClick={analyzeVideo} 
                  disabled={isAnalyzing || !scriptText.trim() || !characterName.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing with Script Context...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze Performance
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Player */}
        {currentVideo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Video Player
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    src={currentVideo.videoUrl}
                    className="w-full h-64 object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="rounded-full w-16 h-16"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => {
                        const newVolume = parseFloat(e.target.value);
                        setVolume(newVolume);
                        if (videoRef.current) {
                          videoRef.current.volume = newVolume;
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p><strong>Character:</strong> {currentVideo.characterName}</p>
                  <p><strong>Status:</strong> 
                    <Badge 
                      variant={currentVideo.status === "completed" ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {currentVideo.status}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analysis Results */}
      {selectedAnalysis && selectedAnalysis.status === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Script-Based Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Performance Analysis */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Performance Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Overall Score</h5>
                    <div className={`p-4 rounded-lg ${getScoreBgColor(selectedAnalysis.analysisResult.performance.score)}`}>
                      <div className="text-3xl font-bold text-center">
                        <span className={getScoreColor(selectedAnalysis.analysisResult.performance.score)}>
                          {selectedAnalysis.analysisResult.performance.score}
                        </span>
                        <span className="text-muted-foreground">/100</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Strengths</h5>
                    <ul className="space-y-1">
                      {selectedAnalysis.analysisResult.performance.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Areas for Improvement</h5>
                  <ul className="space-y-1">
                    {selectedAnalysis.analysisResult.performance.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Analysis */}
              <div>
                <h4 className="font-medium mb-4">Technical Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedAnalysis.analysisResult.technical).map(([key, score]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="capitalize font-medium">{key}</span>
                        <span className={getScoreColor(score)}>{score}/100</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Emotional Impact */}
              <div>
                <h4 className="font-medium mb-4">Emotional Impact</h4>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(selectedAnalysis.analysisResult.emotional).map(([key, score]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="capitalize font-medium">{key}</span>
                        <span className={getScoreColor(score)}>{score}/100</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Feedback */}
              <div>
                <h4 className="font-medium mb-2">Detailed Feedback</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedAnalysis.analysisResult.feedback}
                </p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {selectedAnalysis.analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis History */}
      {analyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Analysis History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setSelectedAnalysis(analysis);
                    setCurrentVideo(analysis);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Video className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{analysis.characterName}</p>
                      <p className="text-sm text-muted-foreground">
                        {analysis.sceneDescription} • {analysis.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={analysis.status === "completed" ? "default" : "secondary"}>
                      {analysis.status}
                    </Badge>
                    {analysis.status === "completed" && (
                      <span className="text-sm font-medium">
                        {analysis.analysisResult.performance.score}/100
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
