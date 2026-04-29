import { useEffect, useRef, useState } from "react";
import { Wand2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { ParsedTableRead } from "@/lib/tableread/parseScript";
import { initTTS, generateLine, terminateTTS } from "@/lib/tableread/ttsClient";
import { concatPcmWithGaps, encodePcmToMp3 } from "@/lib/tableread/mp3Encoder";

interface Props {
  parsed: ParsedTableRead;
  assignments: Record<string, string>;
  onComplete: (result: { id: string; audioUrl: string; mp3Blob: Blob }) => void;
  onCancel: () => void;
}

export default function GenerationProgress({ parsed, assignments, onComplete, onCancel }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const cancelledRef = useRef(false);
  const [status, setStatus] = useState<string>("Loading voice model…");
  const [currentLine, setCurrentLine] = useState(0);
  const [currentPreview, setCurrentPreview] = useState<{ char: string; text: string } | null>(null);
  const [phase, setPhase] = useState<"loading" | "generating" | "encoding" | "uploading" | "done" | "error">("loading");

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        await initTTS((m) => setStatus(m));
        if (aborted || cancelledRef.current) return;

        setPhase("generating");
        setStatus("Generating dialogue audio…");

        const segments: { pcm: Float32Array; gapAfterSec: number }[] = [];
        let lastSceneIndex = parsed.lines[0]?.sceneIndex ?? 0;

        for (let i = 0; i < parsed.lines.length; i++) {
          if (cancelledRef.current) throw new Error("cancelled");
          const line = parsed.lines[i];
          const voice = assignments[line.character];
          if (!voice) continue;
          setCurrentLine(i + 1);
          setCurrentPreview({ char: line.character, text: line.text.slice(0, 120) });

          const sceneChanged = line.sceneIndex !== lastSceneIndex;
          lastSceneIndex = line.sceneIndex;

          // Add scene gap before this line if scene changed (apply to previous segment)
          if (sceneChanged && segments.length > 0) {
            segments[segments.length - 1].gapAfterSec = 0.6;
          }

          const { pcm } = await generateLine(line.text, voice);
          segments.push({ pcm, gapAfterSec: 0.3 });
        }

        if (cancelledRef.current) throw new Error("cancelled");

        setPhase("encoding");
        setStatus("Mixing and encoding MP3…");
        const merged = concatPcmWithGaps(segments, 24000);
        const mp3 = encodePcmToMp3(merged, 24000, 96);

        if (!user) throw new Error("You must be signed in to save a table read.");

        setPhase("uploading");
        setStatus("Uploading to your library…");
        const id = crypto.randomUUID();
        const path = `${user.id}/${id}.mp3`;
        const { error: upErr } = await supabase.storage.from("table-reads").upload(path, mp3, {
          contentType: "audio/mpeg",
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("table-reads").getPublicUrl(path);

        const { data: row, error: insErr } = await supabase
          .from("table_reads")
          .insert({
            id,
            user_id: user.id,
            title: parsed.title,
            audio_url: pub.publicUrl,
            character_count: parsed.characters.length,
            line_count: parsed.lines.length,
            is_public: false,
          })
          .select()
          .single();
        if (insErr) throw insErr;

        setPhase("done");
        onComplete({ id: row.id, audioUrl: pub.publicUrl, mp3Blob: mp3 });
      } catch (e) {
        if (cancelledRef.current) return;
        console.error(e);
        setPhase("error");
        setStatus(e instanceof Error ? e.message : "Generation failed");
        toast({
          title: "Generation failed",
          description: e instanceof Error ? e.message : "Unknown error",
          variant: "destructive",
        });
      }
    })();
    return () => { aborted = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = parsed.lines.length;
  const pct = phase === "generating" ? Math.round((currentLine / total) * 100)
    : phase === "encoding" ? 95
    : phase === "uploading" ? 98
    : phase === "done" ? 100
    : 5;

  const handleCancel = () => {
    cancelledRef.current = true;
    terminateTTS();
    onCancel();
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-pink-400" />
          Generating your table read
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-gray-300 flex items-center gap-2">
              {phase !== "done" && phase !== "error" && <Loader2 className="w-4 h-4 animate-spin text-pink-400" />}
              {status}
            </span>
            <span className="text-gray-400">
              {phase === "generating" ? `Line ${currentLine} of ${total}` : `${pct}%`}
            </span>
          </div>
          <Progress value={pct} className="bg-gray-800" />
        </div>

        {currentPreview && phase === "generating" && (
          <div className="p-4 rounded-lg bg-gray-800 border border-gray-700">
            <p className="text-pink-400 text-xs uppercase tracking-wide mb-1">{currentPreview.char}</p>
            <p className="text-gray-200 text-sm italic">"{currentPreview.text}"</p>
          </div>
        )}

        {phase !== "done" && phase !== "error" && (
          <Button variant="outline" onClick={handleCancel} className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
