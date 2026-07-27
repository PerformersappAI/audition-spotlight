import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, Sparkles, X } from "lucide-react";

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
}

const BlogImageStudio = ({ value, onChange }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(null);
  }, [value]);

  const doUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `uploads/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("blog-images")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
      onChange(data.publicUrl);
      toast({ title: "Image uploaded" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const doGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setPreview(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-image", {
        body: { prompt },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setPreview((data as any).url);
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label>Cover image</Label>

      {value && (
        <div className="relative inline-block">
          <img src={value} alt="cover" className="max-h-40 rounded border border-border" />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={() => onChange(null)}
            type="button"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload"><Upload className="w-4 h-4 mr-2" />Upload</TabsTrigger>
          <TabsTrigger value="ai"><Sparkles className="w-4 h-4 mr-2" />Generate with AI</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-2 pt-2">
          <Input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && doUpload(e.target.files[0])}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
            </p>
          )}
        </TabsContent>

        <TabsContent value="ai" className="space-y-2 pt-2">
          <Textarea
            placeholder="Describe the cover image (e.g. 'A cinematic film set at golden hour, dramatic lighting')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
          <Button onClick={doGenerate} disabled={generating || !prompt.trim()} type="button">
            {generating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Generate</>
            )}
          </Button>
          {preview && (
            <div className="space-y-2">
              <img src={preview} alt="preview" className="max-h-48 rounded border border-border" />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { onChange(preview); setPreview(null); }} type="button">
                  Use this image
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPreview(null)} type="button">
                  Discard
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogImageStudio;
