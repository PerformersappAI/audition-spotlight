import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Paintbrush, Eraser, Loader2, Undo } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InpaintEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageData: string;
  artStyle?: string;
  onSave: (newImageData: string) => void;
}

export const InpaintEditor = ({
  open,
  onOpenChange,
  imageData,
  artStyle,
  onSave
}: InpaintEditorProps) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    if (open && canvasRef.current && imageData) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Save initial state
        setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      };
      img.src = imageData;
    }
  }, [open, imageData]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Save state for undo
        setHistory(prev => [...prev, ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height)]);
      }
    }
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getMousePos(e);

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    
    if (tool === 'brush') {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red mask overlay
      ctx.fill();
    } else {
      // Eraser - restore original image in that area
      const img = new Image();
      img.src = imageData;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.restore();
    }
  };

  const undo = () => {
    if (history.length > 1 && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const newHistory = [...history];
        newHistory.pop();
        const previousState = newHistory[newHistory.length - 1];
        ctx.putImageData(previousState, 0, 0);
        setHistory(newHistory);
      }
    }
  };

  const handleInpaint = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe what you want to change in the selected area.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get current canvas state (with mask)
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');
      
      const maskedImageData = canvas.toDataURL('image/png');

      const { data, error } = await supabase.functions.invoke('inpaint-frame', {
        body: {
          imageData: maskedImageData,
          prompt: prompt.trim(),
          artStyle
        }
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast({
            title: "Rate Limit",
            description: "Please wait a moment and try again.",
            variant: "destructive"
          });
          return;
        }
        if (error.message?.includes('402')) {
          toast({
            title: "Credits Required",
            description: "Please add credits in Settings → Workspace → Usage.",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      if (data?.imageData) {
        onSave(data.imageData);
        toast({
          title: "Edit Applied",
          description: "Your changes have been applied to the frame."
        });
        onOpenChange(false);
      }

    } catch (error) {
      console.error('Inpaint error:', error);
      toast({
        title: "Edit Failed",
        description: "Failed to apply edits. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Edit Frame Region
          </DialogTitle>
          <DialogDescription>
            Paint over the area you want to change, then describe what you want
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tools */}
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex gap-2">
              <Button
                variant={tool === 'brush' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('brush')}
              >
                <Paintbrush className="h-4 w-4 mr-1" />
                Brush
              </Button>
              <Button
                variant={tool === 'eraser' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('eraser')}
              >
                <Eraser className="h-4 w-4 mr-1" />
                Eraser
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={history.length <= 1}
              >
                <Undo className="h-4 w-4 mr-1" />
                Undo
              </Button>
            </div>
            
            <div className="flex-1 flex items-center gap-3">
              <Label className="text-sm whitespace-nowrap">Brush Size:</Label>
              <Slider
                value={[brushSize]}
                onValueChange={(v) => setBrushSize(v[0])}
                min={5}
                max={100}
                step={5}
                className="w-32"
              />
              <span className="text-sm text-muted-foreground w-8">{brushSize}</span>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative border border-border rounded-lg overflow-hidden bg-muted/20">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={draw}
              className="max-w-full h-auto cursor-crosshair"
              style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
            />
            <p className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Paint red mask over areas to edit
            </p>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <Label htmlFor="edit-prompt">What do you want to change?</Label>
            <Textarea
              id="edit-prompt"
              placeholder="e.g., 'Change the character's expression to surprised' or 'Add a window in the background'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInpaint} disabled={isProcessing || !prompt.trim()}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Apply Changes'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
