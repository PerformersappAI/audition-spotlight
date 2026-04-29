import { useState } from "react";
import { Download, Share2, Lock, Globe, Edit3, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  id: string;
  audioUrl: string;
  mp3Blob: Blob;
  initialTitle: string;
  onStartOver: () => void;
}

export default function AudioPlayer({ id, audioUrl, mp3Blob, initialTitle, onStartOver }: Props) {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialTitle);
  const [editingTitle, setEditingTitle] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveTitle = async () => {
    setSaving(true);
    const { error } = await supabase.from("table_reads").update({ title }).eq("id", id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      setEditingTitle(false);
      toast({ title: "Title updated" });
    }
  };

  const togglePublic = async () => {
    const next = !isPublic;
    const { error } = await supabase.from("table_reads").update({ is_public: next }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setIsPublic(next);
    toast({ title: next ? "Now public" : "Now private" });
  };

  const download = () => {
    const url = URL.createObjectURL(mp3Blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9-_ ]/gi, "_")}.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyShareLink = async () => {
    const link = `${window.location.origin}/table-read/shared/${id}`;
    await navigator.clipboard.writeText(link);
    toast({ title: "Link copied", description: isPublic ? "Anyone with the link can listen." : "Heads up: this read is private — toggle public so others can listen." });
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between gap-2">
          {editingTitle ? (
            <div className="flex items-center gap-2 w-full">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-gray-950 border-gray-700 text-white" />
              <Button size="sm" onClick={saveTitle} disabled={saving} className="bg-pink-500 hover:bg-pink-600 text-white">
                <Check className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <span className="flex items-center gap-2">
              {title}
              <Button variant="ghost" size="icon" onClick={() => setEditingTitle(true)} className="text-gray-400 hover:text-white">
                <Edit3 className="w-4 h-4" />
              </Button>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <audio controls src={audioUrl} className="w-full" />

        <div className="flex flex-wrap gap-3">
          <Button onClick={download} className="bg-pink-500 hover:bg-pink-600 text-white">
            <Download className="w-4 h-4 mr-2" /> Download MP3
          </Button>
          <Button onClick={copyShareLink} variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800">
            <Share2 className="w-4 h-4 mr-2" /> Copy share link
          </Button>
          <Button onClick={togglePublic} variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800">
            {isPublic ? <Globe className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
            {isPublic ? "Public" : "Private"}
          </Button>
          <Button onClick={onStartOver} variant="ghost" className="text-gray-300 hover:text-white">
            Start over
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Saved to your library. Generated 100% in your browser with kokoro-js — no third-party APIs were used.
        </p>
      </CardContent>
    </Card>
  );
}
