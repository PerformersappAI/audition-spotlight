import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StyleReferenceUploadProps {
  styleImageUrl?: string;
  onStyleImageChange: (url: string | undefined) => void;
  onStyleDescriptionGenerated?: (description: string) => void;
}

export const StyleReferenceUpload = ({
  styleImageUrl,
  onStyleImageChange,
  onStyleDescriptionGenerated
}: StyleReferenceUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image under 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for analysis
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        onStyleImageChange(base64Data);

        // Analyze the style using AI
        setIsAnalyzing(true);
        try {
          const { data, error } = await supabase.functions.invoke('analyze-style-reference', {
            body: { imageData: base64Data }
          });

          if (!error && data?.styleDescription) {
            onStyleDescriptionGenerated?.(data.styleDescription);
            toast({
              title: "Style Analyzed",
              description: "We've extracted the visual style from your reference image."
            });
          }
        } catch (err) {
          console.warn('Style analysis failed, using image only:', err);
        } finally {
          setIsAnalyzing(false);
        }

        setIsUploading(false);
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to process the image",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    onStyleImageChange(undefined);
    onStyleDescriptionGenerated?.('');
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Style Reference Image</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Upload an image with the visual style you want to match. The AI will analyze and replicate this aesthetic.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {styleImageUrl ? (
          <div className="relative">
            <img
              src={styleImageUrl}
              alt="Style reference"
              className="w-full h-40 object-cover rounded-lg border border-border"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing style...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="style-reference-upload"
              onChange={handleUpload}
              disabled={isUploading}
            />
            <Label
              htmlFor="style-reference-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              {isUploading ? (
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="h-10 w-10 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isUploading ? 'Uploading...' : 'Upload reference image'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </Label>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-3">
          Examples: movie stills, artwork, illustrations, or any image with a visual style you love
        </p>
      </CardContent>
    </Card>
  );
};
