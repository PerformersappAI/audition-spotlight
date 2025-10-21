import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VideoUploadFormProps {
  onVideoUploaded?: (videoUrl: string, duration: number, fileSize: number) => void;
  onAnalysisComplete?: (analysis: any) => void;
  evaluationType?: 'standalone' | 'script_based';
  scriptId?: string;
  scriptText?: string;
  characterName?: string;
  sceneDescription?: string;
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  onVideoUploaded,
  onAnalysisComplete,
  evaluationType = 'standalone',
  scriptId,
  scriptText = '',
  characterName = '',
  sceneDescription = ''
}) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [fileSize, setFileSize] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Audition');
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Audition", "Performance", "Demo Reel", "Self-Tape", "Monologue", "Scene Study"
  ];

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
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive"
      });
      return;
    }

    // Check file size (300MB limit)
    const maxSize = 300 * 1024 * 1024; // 300MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a video file smaller than 300MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setFileSize(file.size);
    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    toast({
      title: "Video selected",
      description: `${file.name} is ready for upload`
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const uploadVideo = async () => {
    if (!selectedFile || !userProfile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get video duration
      const videoDuration = await getVideoDuration(selectedFile);
      setDuration(videoDuration);

      // Calculate credit cost (1 credit for first minute, +0.5 credits per additional minute)
      const creditCost = Math.ceil(videoDuration / 60) + Math.max(0, Math.ceil((videoDuration - 60) / 60) * 0.5);

      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userProfile.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      setVideoUrl(urlData.publicUrl);
      setUploadProgress(100);

      toast({
        title: "Upload successful",
        description: `Video uploaded successfully. Credit cost: ${creditCost} credits`
      });

      if (onVideoUploaded) {
        onVideoUploaded(urlData.publicUrl, videoDuration, selectedFile.size);
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: `Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeVideo = async () => {
    if (!videoUrl || !userProfile) return;

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-video', {
        body: {
          videoUrl,
          evaluationType,
          userId: userProfile.id,
          scriptId,
          scriptText,
          characterName,
          sceneDescription,
          title,
          description,
          category
        }
      });

      if (error) {
        console.error('Video analysis error:', error);
        const errorMessage = error.message || error.toString();
        
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
        toast({
          title: "Analysis complete",
          description: "Your video has been analyzed successfully"
        });

        if (onAnalysisComplete) {
          onAnalysisComplete(data.analysis);
        }
      }
    } catch (error) {
      console.error('Error analyzing video:', error);
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Video
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
            <p className="text-lg font-medium mb-2">Drop your video here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files (max 300MB)
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

          {selectedFile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>File:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {formatFileSize(fileSize)}</p>
                </div>
                <div>
                  <p><strong>Duration:</strong> {duration > 0 ? formatDuration(duration) : 'Calculating...'}</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              </div>

              {!videoUrl.includes('supabase') && (
                <Button 
                  onClick={uploadVideo} 
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload to Cloud
                    </>
                  )}
                </Button>
              )}

              {isUploading && (
                <Progress value={uploadProgress} className="w-full" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Details */}
      {videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Video Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the video content..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {evaluationType === 'script_based' && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Script Context
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="characterName">Character Name</Label>
                    <Input
                      id="characterName"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      placeholder="Enter character name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sceneDescription">Scene Description</Label>
                    <Input
                      id="sceneDescription"
                      value={sceneDescription}
                      onChange={(e) => setSceneDescription(e.target.value)}
                      placeholder="Brief scene description"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="scriptText">Script Text</Label>
                  <Textarea
                    id="scriptText"
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    placeholder="Paste the script text for context..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={analyzeVideo} 
              disabled={isAnalyzing || !title.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Video Preview */}
      {videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Video Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
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
                <p><strong>Title:</strong> {title || 'Untitled'}</p>
                <p><strong>Category:</strong> {category}</p>
                <p><strong>Duration:</strong> {duration > 0 ? formatDuration(duration) : 'Unknown'}</p>
                <p><strong>Size:</strong> {formatFileSize(fileSize)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
