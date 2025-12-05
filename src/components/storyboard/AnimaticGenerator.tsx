import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Video, Loader2, Play, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnimaticGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageData: string;
  shotDescription?: string;
}

export const AnimaticGenerator = ({
  open,
  onOpenChange,
  imageData,
  shotDescription
}: AnimaticGeneratorProps) => {
  const { toast } = useToast();
  const [motionType, setMotionType] = useState<string>('subtle');
  const [prompt, setPrompt] = useState(shotDescription || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setVideoResult(null);
    setPreviewImage(null);
    setNeedsSetup(false);

    try {
      const { data, error } = await supabase.functions.invoke('generate-animatic', {
        body: {
          imageData,
          prompt,
          motionType,
          duration: 4
        }
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast({
            title: "Rate Limit",
            description: "Please wait and try again.",
            variant: "destructive"
          });
          return;
        }
        if (error.message?.includes('402')) {
          toast({
            title: "Credits Required",
            description: "Please add credits to continue.",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      if (data?.setupRequired) {
        setNeedsSetup(true);
        return;
      }

      if (data?.videoUrl) {
        setVideoResult(data.videoUrl);
        toast({
          title: "Video Generated",
          description: "Your animatic clip is ready!"
        });
      } else if (data?.motionPreview) {
        setPreviewImage(data.motionPreview);
        toast({
          title: "Motion Preview Ready",
          description: data.message || "Preview generated. Full video requires Replicate API."
        });
      }

    } catch (error) {
      console.error('Animatic generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate animatic. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Generate Animatic Clip
          </DialogTitle>
          <DialogDescription>
            Convert this storyboard frame into a short animated video clip
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Source image preview */}
          <div className="rounded-lg overflow-hidden border border-border">
            <img
              src={imageData}
              alt="Source frame"
              className="w-full h-40 object-contain bg-muted"
            />
          </div>

          {needsSetup && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Full video generation requires a Replicate API key. 
                Add <code className="text-xs bg-muted px-1 rounded">REPLICATE_API_KEY</code> to your Supabase secrets.
                <a 
                  href="https://replicate.com/account/api-tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline ml-1"
                >
                  Get API key
                </a>
              </AlertDescription>
            </Alert>
          )}

          {/* Motion type */}
          <div className="space-y-2">
            <Label>Camera Motion</Label>
            <Select value={motionType} onValueChange={setMotionType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subtle">Subtle Movement</SelectItem>
                <SelectItem value="pan">Pan (Left/Right)</SelectItem>
                <SelectItem value="zoom">Zoom In/Out</SelectItem>
                <SelectItem value="dynamic">Dynamic Motion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Motion prompt */}
          <div className="space-y-2">
            <Label>Motion Description (optional)</Label>
            <Textarea
              placeholder="Describe the motion you want, e.g., 'character slowly turns head to look at camera'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
            />
          </div>

          {/* Result */}
          {videoResult && (
            <div className="rounded-lg overflow-hidden border border-border">
              <video
                src={videoResult}
                controls
                autoPlay
                loop
                className="w-full"
              />
            </div>
          )}

          {previewImage && !videoResult && (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img
                src={previewImage}
                alt="Motion preview"
                className="w-full h-40 object-contain bg-muted"
              />
              <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                Motion Preview (not video)
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Generate Video
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
