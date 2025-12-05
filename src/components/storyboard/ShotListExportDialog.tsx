import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, FileText, Table2 } from "lucide-react";
import { exportShotListToPDF, exportDetailedShotListToPDF } from "@/utils/shotListExport";

interface Shot {
  shotNumber: number;
  description?: string;
  cameraAngle?: string;
  characters?: string[];
  visualDescription?: string;
  location?: string;
  action?: string;
  shotType?: string;
  lighting?: string;
  keyProps?: string;
  dialogue?: string;
  duration?: string;
}

interface StoryboardFrame {
  shotNumber: number;
  imageData?: string;
}

interface ShotListExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shots: Shot[];
  frames?: StoryboardFrame[];
  projectName?: string;
  genre?: string;
  tone?: string;
}

export const ShotListExportDialog = ({
  open,
  onOpenChange,
  shots,
  frames,
  projectName,
  genre,
  tone
}: ShotListExportDialogProps) => {
  const [exportType, setExportType] = useState<'table' | 'detailed'>('table');
  const [includeImages, setIncludeImages] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const options = {
        projectName: projectName || 'Untitled Project',
        genre,
        tone,
        includeImages
      };

      if (exportType === 'table') {
        await exportShotListToPDF(shots, frames, options);
      } else {
        await exportDetailedShotListToPDF(shots, frames, options);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Shot List
          </DialogTitle>
          <DialogDescription>
            Download your shot list as a professional PDF document
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={exportType} onValueChange={(v) => setExportType(v as 'table' | 'detailed')}>
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="table" id="table" />
                <div className="flex-1">
                  <Label htmlFor="table" className="flex items-center gap-2 cursor-pointer">
                    <Table2 className="h-4 w-4" />
                    Table Format
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Compact table view, great for quick reference on set
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="detailed" id="detailed" />
                <div className="flex-1">
                  <Label htmlFor="detailed" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Detailed Format
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Full shot details with thumbnails, ideal for planning
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {exportType === 'detailed' && frames && frames.some(f => f.imageData) && (
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <Label htmlFor="include-images">Include Thumbnails</Label>
                <p className="text-xs text-muted-foreground">
                  Add frame images to the PDF
                </p>
              </div>
              <Switch
                id="include-images"
                checked={includeImages}
                onCheckedChange={setIncludeImages}
              />
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium">{shots.length} shots will be exported</p>
            {frames && frames.filter(f => f.imageData).length > 0 && (
              <p className="text-muted-foreground">
                {frames.filter(f => f.imageData).length} frames with images
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
