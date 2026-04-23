import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Film, Play, Pause, Download, Loader2, GripVertical, Image as ImageIcon, Share2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// gif.js ships with a worker file we point to via a CDN URL — keeps bundling simple.
// gif.js has no types — silence the missing-module error.
// @ts-ignore
import GIF from "gif.js";
const GIF_WORKER_URL = "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js";

export interface AnimaticFrameInput {
  shotNumber: number;
  imageData?: string;
  description?: string;
  sceneHeading?: string;
}

interface AnimaticTabProps {
  frames: AnimaticFrameInput[];
  aspectRatio?: string; // e.g. "16:9", "9:16", "1:1"
  projectTitle?: string;
  projectId?: string;
  existingAnimaticUrl?: string | null;
  isPaidUser?: boolean;
  onAnimaticSaved?: (url: string) => void;
}

interface TimelineFrame extends AnimaticFrameInput {
  id: string;
  duration: number; // seconds
}

type Transition = "none" | "dissolve" | "fade";

const DEFAULT_DURATION = 3;
const MIN_DURATION = 0.5;
const MAX_DURATION = 10;

const parseAspect = (ratio?: string): { w: number; h: number } => {
  switch (ratio) {
    case "9:16":
      return { w: 540, h: 960 };
    case "1:1":
      return { w: 720, h: 720 };
    case "4:3":
      return { w: 800, h: 600 };
    case "16:9":
    default:
      return { w: 960, h: 540 };
  }
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

export const AnimaticTab = ({ frames, aspectRatio, projectTitle, projectId, existingAnimaticUrl, isPaidUser = false, onAnimaticSaved }: AnimaticTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRafRef = useRef<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const usableFrames = useMemo(() => frames.filter(f => !!f.imageData), [frames]);

  const [timeline, setTimeline] = useState<TimelineFrame[]>([]);
  const [transition, setTransition] = useState<Transition>("none");
  const [showHeadings, setShowHeadings] = useState(false);
  const [bulkDuration, setBulkDuration] = useState(DEFAULT_DURATION);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeOpacity, setActiveOpacity] = useState(1);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [animaticUrl, setAnimaticUrl] = useState<string | null>(existingAnimaticUrl ?? null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setAnimaticUrl(existingAnimaticUrl ?? null);
  }, [existingAnimaticUrl]);

  // Initialize timeline whenever the source frames change.
  useEffect(() => {
    setTimeline(
      usableFrames.map((f, idx) => ({
        ...f,
        id: `${f.shotNumber}-${idx}`,
        duration: DEFAULT_DURATION,
      }))
    );
    setActiveIndex(0);
  }, [usableFrames]);

  const totalDuration = useMemo(
    () => timeline.reduce((sum, f) => sum + f.duration, 0),
    [timeline]
  );

  const dims = useMemo(() => parseAspect(aspectRatio), [aspectRatio]);

  // ─── Timeline edits ──────────────────────────────────────────────────────
  const updateDuration = (id: string, value: number) => {
    setTimeline(prev =>
      prev.map(f => (f.id === id ? { ...f, duration: Math.max(MIN_DURATION, Math.min(MAX_DURATION, value)) } : f))
    );
  };

  const applyToAll = () => {
    setTimeline(prev => prev.map(f => ({ ...f, duration: bulkDuration })));
  };

  const handleDragStart = (idx: number) => {
    dragIndexRef.current = idx;
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (idx: number) => {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from === null || from === idx) return;
    setTimeline(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(idx, 0, moved);
      return next;
    });
  };

  // ─── Preview player ──────────────────────────────────────────────────────
  const stopPreview = useCallback(() => {
    if (previewRafRef.current) {
      cancelAnimationFrame(previewRafRef.current);
      previewRafRef.current = null;
    }
    setIsPlaying(false);
    setActiveOpacity(1);
  }, []);

  useEffect(() => () => stopPreview(), [stopPreview]);

  const startPreview = useCallback(() => {
    if (timeline.length === 0) return;
    setIsPlaying(true);
    setActiveIndex(0);

    let frameIdx = 0;
    let frameStart = performance.now();

    const tick = (now: number) => {
      const current = timeline[frameIdx];
      if (!current) {
        stopPreview();
        return;
      }
      const elapsed = (now - frameStart) / 1000;

      // Apply transition opacity in last 0.3s of frame (dissolve / fade).
      if (transition !== "none" && elapsed > current.duration - 0.3) {
        const t = Math.max(0, Math.min(1, (current.duration - elapsed) / 0.3));
        setActiveOpacity(transition === "fade" ? t : t);
      } else {
        setActiveOpacity(1);
      }

      if (elapsed >= current.duration) {
        frameIdx += 1;
        if (frameIdx >= timeline.length) {
          stopPreview();
          return;
        }
        setActiveIndex(frameIdx);
        frameStart = now;
      }

      previewRafRef.current = requestAnimationFrame(tick);
    };

    previewRafRef.current = requestAnimationFrame(tick);
  }, [timeline, transition, stopPreview]);

  // ─── GIF export ──────────────────────────────────────────────────────────
  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load frame image`));
      img.src = src;
    });

  const drawFrame = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    heading: string | undefined,
    opacity: number
  ) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, dims.w, dims.h);

    // Cover-fit
    const scale = Math.max(dims.w / img.width, dims.h / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (dims.w - w) / 2;
    const y = (dims.h - h) / 2;

    ctx.globalAlpha = opacity;
    ctx.drawImage(img, x, y, w, h);
    ctx.globalAlpha = 1;

    if (showHeadings && heading) {
      const barH = Math.round(dims.h * 0.09);
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(0, dims.h - barH, dims.w, barH);
      ctx.fillStyle = "#fff";
      ctx.font = `${Math.round(barH * 0.45)}px sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillText(heading, 24, dims.h - barH / 2, dims.w - 48);
    }
  };

  const handleExportGIF = async () => {
    if (timeline.length === 0) return;
    setIsExporting(true);
    setExportProgress(0);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = dims.w;
      canvas.height = dims.h;
      const ctx = canvas.getContext("2d")!;

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: dims.w,
        height: dims.h,
        workerScript: GIF_WORKER_URL,
      });

      const stepMs = 100; // 10fps for GIF — keeps file size sane
      let totalSec = 0;

      for (let i = 0; i < timeline.length; i++) {
        const tf = timeline[i];
        if (totalSec >= 15) break; // 15s GIF cap
        const img = await loadImage(tf.imageData!);

        const fullSteps = Math.max(1, Math.round((tf.duration * 1000) / stepMs));
        const transitionSteps = transition !== "none" ? 3 : 0; // ~0.3s
        const holdSteps = Math.max(1, fullSteps - transitionSteps);

        // Hold
        for (let s = 0; s < holdSteps; s++) {
          if (totalSec >= 15) break;
          drawFrame(ctx, img, tf.sceneHeading, 1);
          gif.addFrame(ctx, { copy: true, delay: stepMs });
          totalSec += stepMs / 1000;
        }

        // Transition out (dissolve = crossfade approximation; here we fade the current)
        if (transitionSteps > 0 && i < timeline.length - 1) {
          for (let s = transitionSteps; s > 0 && totalSec < 15; s--) {
            const opacity = s / transitionSteps;
            drawFrame(ctx, img, tf.sceneHeading, opacity);
            gif.addFrame(ctx, { copy: true, delay: stepMs });
            totalSec += stepMs / 1000;
          }
        }

        setExportProgress(Math.round(((i + 1) / timeline.length) * 70));
      }

      gif.on("progress", (p: number) => {
        setExportProgress(70 + Math.round(p * 30));
      });

      gif.on("finished", async (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const safeTitle = (projectTitle || "animatic").replace(/[^a-z0-9]+/gi, "_").toLowerCase();
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeTitle}_animatic.gif`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Upload to Supabase storage so it can power the public share link.
        if (user?.id && projectId) {
          try {
            const path = `${user.id}/${projectId}-${Date.now()}.gif`;
            const { error: upErr } = await supabase.storage
              .from("storyboard-animatics")
              .upload(path, blob, { contentType: "image/gif", upsert: true });
            if (upErr) throw upErr;
            const { data: pub } = supabase.storage.from("storyboard-animatics").getPublicUrl(path);
            const publicUrl = pub.publicUrl;
            await supabase
              .from("storyboard_projects")
              .update({ animatic_url: publicUrl } as any)
              .eq("id", projectId);
            setAnimaticUrl(publicUrl);
            onAnimaticSaved?.(publicUrl);
          } catch (e) {
            console.warn("Animatic upload failed (download still succeeded)", e);
          }
        }

        setIsExporting(false);
        setExportProgress(0);
        toast({ title: "GIF ready", description: "Your animatic was downloaded." });
      });

      gif.on("abort", () => {
        setIsExporting(false);
        setExportProgress(0);
      });

      gif.render();
    } catch (err) {
      console.error("GIF export failed", err);
      setIsExporting(false);
      setExportProgress(0);
      toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    }
  };

  // ─── Empty state ─────────────────────────────────────────────────────────
  if (usableFrames.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-3">
          <Film className="h-10 w-10 mx-auto text-muted-foreground" />
          <h3 className="font-semibold">No frames available</h3>
          <p className="text-sm text-muted-foreground">
            Generate storyboard frames first, then come back here to assemble an animatic.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activeFrame = timeline[activeIndex];

  return (
    <div className="space-y-6">
      {/* Preview player */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Film className="h-4 w-4 text-primary" />
                Animatic Preview
              </h3>
              <p className="text-xs text-muted-foreground">
                In-browser preview · Total {formatDuration(totalDuration)} · {timeline.length} frame
                {timeline.length === 1 ? "" : "s"}
              </p>
            </div>
            <Button onClick={isPlaying ? stopPreview : startPreview} size="sm" variant="secondary">
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
          </div>

          <div
            className="relative w-full bg-black rounded-lg overflow-hidden mx-auto"
            style={{ aspectRatio: `${dims.w} / ${dims.h}`, maxWidth: 720 }}
          >
            {activeFrame?.imageData ? (
              <img
                src={activeFrame.imageData}
                alt={`Frame ${activeIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity"
                style={{ opacity: activeOpacity }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
            {showHeadings && activeFrame?.sceneHeading && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/65 text-white px-4 py-2 text-sm">
                {activeFrame.sceneHeading}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Transition</Label>
              <Select value={transition} onValueChange={(v) => setTransition(v as Transition)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (hard cut)</SelectItem>
                  <SelectItem value="dissolve">Dissolve (0.3s)</SelectItem>
                  <SelectItem value="fade">Fade to black</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                <span>Show scene headings</span>
                <Switch checked={showHeadings} onCheckedChange={setShowHeadings} />
              </Label>
              <p className="text-xs text-muted-foreground">
                Overlays each frame's scene heading as a lower-third caption.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Apply duration to all: {bulkDuration.toFixed(1)}s</Label>
              <Button size="sm" variant="outline" onClick={applyToAll}>
                Apply to all
              </Button>
            </div>
            <Slider
              value={[bulkDuration]}
              min={MIN_DURATION}
              max={MAX_DURATION}
              step={0.5}
              onValueChange={(v) => setBulkDuration(v[0])}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Timeline</h3>
            <Badge variant="outline" className="text-xs">
              Total: {formatDuration(totalDuration)}
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-2 min-w-max">
              {timeline.map((f, idx) => (
                <div
                  key={f.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx)}
                  className={`w-36 shrink-0 border rounded-md bg-card cursor-move ${
                    idx === activeIndex ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    stopPreview();
                    setActiveIndex(idx);
                  }}
                >
                  <div className="aspect-video bg-muted rounded-t-md overflow-hidden relative">
                    {f.imageData ? (
                      <img src={f.imageData} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                      <GripVertical className="h-3 w-3" />#{idx + 1}
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Duration (s)</Label>
                    <input
                      type="number"
                      min={MIN_DURATION}
                      max={MAX_DURATION}
                      step={0.5}
                      value={f.duration}
                      onChange={(e) => updateDuration(f.id, parseFloat(e.target.value) || DEFAULT_DURATION)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-background border border-input rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                Export Animatic
              </h3>
              <p className="text-xs text-muted-foreground">
                GIF export runs in your browser · max 15s · 10fps · MP4 coming soon.
              </p>
            </div>
            <Button onClick={handleExportGIF} disabled={isExporting || timeline.length === 0}>
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting… {exportProgress}%
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export as GIF
                </>
              )}
            </Button>
          </div>
          {isExporting && (
            <div className="w-full h-1.5 bg-muted rounded overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
