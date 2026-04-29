import { useCallback, useState } from "react";
import { Upload, FileText, Clipboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { parseAnyFile, parsePastedOrText, type ParsedTableRead } from "@/lib/tableread/parseScript";

const ACCEPTED = [".fountain", ".txt", ".fdx", ".docx"];

interface Props {
  onParsed: (parsed: ParsedTableRead) => void;
}

export default function ScriptUploader({ onParsed }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
    if (!ACCEPTED.includes(ext)) {
      toast({ title: "Unsupported file", description: `Use ${ACCEPTED.join(", ")}.`, variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setFileName(file.name);
    try {
      const parsed = await parseAnyFile(file);
      if (parsed.lines.length === 0) {
        toast({ title: "No dialogue found", description: "We couldn't detect any character dialogue in this file.", variant: "destructive" });
      } else {
        toast({ title: "Script parsed", description: `${parsed.characters.length} characters · ${parsed.lines.length} lines` });
        onParsed(parsed);
      }
    } catch (e) {
      toast({ title: "Parse failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaste = () => {
    if (!pasted.trim()) return;
    const parsed = parsePastedOrText(pasted, "Pasted Script");
    if (parsed.lines.length === 0) {
      toast({ title: "No dialogue found", description: "Make sure character names are in ALL CAPS.", variant: "destructive" });
      return;
    }
    toast({ title: "Script parsed", description: `${parsed.characters.length} characters · ${parsed.lines.length} lines` });
    onParsed(parsed);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-pink-400" />
          Upload or paste your screenplay
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="upload" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
              <Upload className="w-4 h-4 mr-2" /> Upload
            </TabsTrigger>
            <TabsTrigger value="paste" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
              <Clipboard className="w-4 h-4 mr-2" /> Paste text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging ? "border-pink-500 bg-pink-500/10" : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <input
                type="file"
                accept=".fountain,.txt,.fdx,.docx"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDragging ? "bg-pink-500/20" : "bg-gray-800"}`}>
                  <Upload className={`w-8 h-8 ${isDragging ? "text-pink-400" : "text-gray-400"}`} />
                </div>
                {isProcessing ? (
                  <div className="space-y-2">
                    <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400">Processing {fileName}…</p>
                  </div>
                ) : (
                  <>
                    <p className="text-white font-medium">Drag and drop your screenplay</p>
                    <p className="text-gray-400 text-sm">or click to browse</p>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {ACCEPTED.map((t) => (
                        <Badge key={t} variant="secondary" className="bg-gray-800 text-gray-300">{t}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">PDFs: please copy the text and use the Paste tab.</p>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="paste" className="mt-4">
            <div className="space-y-3">
              <Textarea
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
                placeholder={"INT. KITCHEN - DAY\n\nJANE\nWhere did you put the keys?\n\nJOHN\nThey're on the counter.\n"}
                className="bg-gray-950 border-gray-700 text-gray-100 min-h-[260px] font-mono text-sm"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">Tip: character names must be in ALL CAPS on their own line.</p>
                <div className="flex gap-2">
                  {pasted && (
                    <Button variant="ghost" size="sm" onClick={() => setPasted("")} className="text-gray-400">
                      <X className="w-4 h-4 mr-1" /> Clear
                    </Button>
                  )}
                  <Button onClick={handlePaste} disabled={!pasted.trim()} className="bg-pink-500 hover:bg-pink-600 text-white">
                    Parse script
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
