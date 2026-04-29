import { useEffect, useState } from "react";
import { ArrowRight, Users, Volume2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VOICES, suggestVoice, resetVoiceSuggestions } from "@/lib/tableread/voices";
import type { ParsedTableRead } from "@/lib/tableread/parseScript";

interface Props {
  parsed: ParsedTableRead;
  assignments: Record<string, string>;
  onAssignmentsChange: (next: Record<string, string>) => void;
  onContinue: () => void;
}

export default function CastVoiceAssigner({ parsed, assignments, onAssignmentsChange, onContinue }: Props) {
  const [previewing, setPreviewing] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill any missing assignments
    const missing = parsed.characters.filter((c) => !assignments[c]);
    if (missing.length > 0) {
      resetVoiceSuggestions();
      const next = { ...assignments };
      parsed.characters.forEach((c) => {
        if (!next[c]) next[c] = suggestVoice(c);
      });
      onAssignmentsChange(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed]);

  const reshuffle = () => {
    resetVoiceSuggestions();
    const next: Record<string, string> = {};
    parsed.characters.forEach((c) => { next[c] = suggestVoice(c); });
    onAssignmentsChange(next);
  };

  const linesByChar = parsed.lines.reduce<Record<string, number>>((acc, l) => {
    acc[l.character] = (acc[l.character] ?? 0) + 1;
    return acc;
  }, {});

  const previewVoice = async (character: string) => {
    const voiceId = assignments[character];
    if (!voiceId) return;
    setPreviewing(character);
    try {
      const { previewLine } = await import("@/lib/tableread/ttsClient");
      await previewLine(`Hello, I'm ${character}.`, voiceId);
    } catch (e) {
      console.error("preview failed", e);
    } finally {
      setPreviewing(null);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-pink-400" />
          Assign voices ({parsed.characters.length})
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={reshuffle} className="text-gray-300 hover:text-white">
          <RefreshCw className="w-4 h-4 mr-1" /> Auto-assign
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {parsed.characters.map((c) => (
            <div key={c} className="p-4 rounded-lg bg-gray-800 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-semibold truncate">{c}</p>
                  <p className="text-xs text-gray-400">{linesByChar[c] ?? 0} lines</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => previewVoice(c)}
                  disabled={previewing === c}
                  className="text-pink-400 hover:text-pink-300"
                  title="Preview voice"
                >
                  <Volume2 className={`w-4 h-4 ${previewing === c ? "animate-pulse" : ""}`} />
                </Button>
              </div>
              <Select
                value={assignments[c] ?? ""}
                onValueChange={(v) => onAssignmentsChange({ ...assignments, [c]: v })}
              >
                <SelectTrigger className="bg-gray-950 border-gray-700 text-gray-100">
                  <SelectValue placeholder="Choose a voice" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-gray-100 max-h-72">
                  {(["American","British"] as const).map((accent) => (
                    <div key={accent}>
                      <div className="px-2 py-1 text-xs text-gray-500 uppercase">{accent}</div>
                      {VOICES.filter((v) => v.accent === accent).map((v) => (
                        <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
            {parsed.lines.length} dialogue lines total
          </Badge>
          <Button onClick={onContinue} className="bg-pink-500 hover:bg-pink-600 text-white">
            Generate audiobook <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
