import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProcessingStage } from "@/hooks/useOCRUpload";

interface PDFUploadProgressProps {
  fileName: string;
  fileSize: number;
  stage: ProcessingStage;
  elapsedTime: number;
  progress: number;
}

const stageConfig = {
  reading: { icon: FileText, text: "Reading PDF file...", color: "text-blue-500" },
  uploading: { icon: Upload, text: "Uploading to server...", color: "text-blue-500" },
  processing: { icon: Loader2, text: "Processing document...", color: "text-purple-500" },
  extracting: { icon: FileText, text: "Extracting text content...", color: "text-orange-500" },
  complete: { icon: CheckCircle, text: "Complete! Loading script...", color: "text-green-500" }
};

export const PDFUploadProgress = ({ 
  fileName, 
  fileSize, 
  stage, 
  elapsedTime, 
  progress 
}: PDFUploadProgressProps) => {
  const StageIcon = stageConfig[stage].icon;
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="p-6 space-y-4">
        {/* Header with file info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={cn(
              "flex-shrink-0 p-2 rounded-lg bg-primary/10",
              stage === 'complete' && "bg-green-500/10"
            )}>
              <StageIcon className={cn(
                "h-6 w-6",
                stageConfig[stage].color,
                (stage === 'processing' || stage === 'uploading') && "animate-spin"
              )} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{elapsedTime}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-2 bg-secondary"
          />
          <div className="flex items-center justify-between text-sm">
            <span className={cn("font-medium", stageConfig[stage].color)}>
              {stageConfig[stage].text}
            </span>
            <span className="text-muted-foreground font-mono">{progress}%</span>
          </div>
        </div>

        {/* Timeout warning for long operations */}
        {elapsedTime > 30 && stage !== 'complete' && (
          <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-500/10 px-3 py-2 rounded-md">
            <Clock className="h-3 w-3" />
            <span>Large file processing in progress. This may take a minute...</span>
          </div>
        )}
      </div>
    </Card>
  );
};
