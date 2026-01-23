import { useState, useCallback } from "react";
import { Upload, FileText, Users, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { readScreenplayFile, type ParsedScreenplay } from "@/utils/screenplayParser";

interface ScriptUploaderProps {
  onScriptParsed: (screenplay: ParsedScreenplay) => void;
  onContinue: () => void;
  parsedScript: ParsedScreenplay | null;
}

const ACCEPTED_TYPES = [".fdx", ".fountain", ".pdf"];

export default function ScriptUploader({ onScriptParsed, onContinue, parsedScript }: ScriptUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(extension)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a .fdx, .fountain, or .pdf file`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsProcessing(true);
    setFileName(file.name);

    try {
      const screenplay = await readScreenplayFile(file);
      onScriptParsed(screenplay);
      toast({
        title: "Script parsed successfully",
        description: `Found ${screenplay.characters.length} characters in "${screenplay.title || file.name}"`,
      });
    } catch (error) {
      console.error("Error parsing screenplay:", error);
      toast({
        title: "Error parsing script",
        description: "There was an issue reading your screenplay file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearScript = () => {
    setFileName(null);
    onScriptParsed(null as unknown as ParsedScreenplay);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-400" />
            Upload Your Screenplay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? "border-pink-500 bg-pink-500/10"
                : "border-gray-700 hover:border-gray-600"
            }`}
          >
            <input
              type="file"
              accept=".fdx,.fountain,.pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDragging ? "bg-pink-500/20" : "bg-gray-800"
              }`}>
                <Upload className={`w-8 h-8 ${isDragging ? "text-pink-400" : "text-gray-400"}`} />
              </div>
              
              {isProcessing ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-gray-400">Processing {fileName}...</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-white font-medium">
                      Drag and drop your screenplay here
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      or click to browse
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {ACCEPTED_TYPES.map((type) => (
                      <Badge key={type} variant="secondary" className="bg-gray-800 text-gray-300">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parsed Script Preview */}
      {parsedScript && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-400" />
              Extracted Characters ({parsedScript.characters.length})
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearScript}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Script Info */}
              <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-white font-medium">{parsedScript.title || fileName}</p>
                  {parsedScript.author && (
                    <p className="text-gray-400 text-sm">by {parsedScript.author}</p>
                  )}
                </div>
                <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                  {parsedScript.scenes.length} scenes
                </Badge>
              </div>

              {/* Characters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {parsedScript.characters.map((character, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <p className="text-white font-medium text-sm truncate">
                      {character}
                    </p>
                  </div>
                ))}
              </div>

              {/* Continue Button */}
              <Button
                onClick={onContinue}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              >
                Continue to Voice Assignment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
