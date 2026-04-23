import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Film, MapPin, Users, ArrowRight, Sparkles } from "lucide-react";

// Simple stable hash for keying localStorage by script content
const hashScenes = (scenes: { sceneNumber: number; heading: string }[]) => {
  const seed = scenes.map(s => `${s.sceneNumber}:${s.heading}`).join("|");
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return `storyboard_scene_sel_${h}`;
};

export interface Scene {
  sceneNumber: number;
  heading: string;
  summary: string;
  location: string;
  intExt: string;
  dayNight: string;
  characters: string[];
  estimatedShots: number;
  text: string;
}

interface SceneSelectorProps {
  scenes: Scene[];
  onConfirm: (selected: Scene[]) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const SceneSelector = ({ scenes, onConfirm, onCancel, isProcessing }: SceneSelectorProps) => {
  const storageKey = useMemo(() => hashScenes(scenes), [scenes]);

  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const arr = JSON.parse(saved) as number[];
        const valid = arr.filter(n => scenes.some(s => s.sceneNumber === n));
        if (valid.length > 0) return new Set(valid);
      }
    } catch {}
    return new Set(scenes.map(s => s.sceneNumber));
  });
  const [shotOverrides, setShotOverrides] = useState<Map<number, number>>(new Map());

  // Persist selection on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(selectedNumbers)));
    } catch {}
  }, [selectedNumbers, storageKey]);

  const toggle = (n: number) => {
    setSelectedNumbers(prev => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const selectAll = () => setSelectedNumbers(new Set(scenes.map(s => s.sceneNumber)));
  const selectNone = () => setSelectedNumbers(new Set());

  const updateShots = (sceneNumber: number, value: string) => {
    const n = parseInt(value, 10);
    setShotOverrides(prev => {
      const next = new Map(prev);
      if (Number.isFinite(n) && n > 0) next.set(sceneNumber, Math.min(20, Math.max(1, n)));
      else next.delete(sceneNumber);
      return next;
    });
  };

  const selected = scenes.filter(s => selectedNumbers.has(s.sceneNumber));
  const totalShots = selected.reduce(
    (sum, s) => sum + (shotOverrides.get(s.sceneNumber) ?? s.estimatedShots),
    0
  );

  const handleConfirm = () => {
    const enriched = selected.map(s => ({
      ...s,
      estimatedShots: shotOverrides.get(s.sceneNumber) ?? s.estimatedShots,
    }));
    onConfirm(enriched);
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            Select Scenes to Storyboard
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={selectAll} disabled={isProcessing}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={selectNone} disabled={isProcessing}>
              Clear
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Pick the scenes that matter for your storyboard. Only selected scenes will be broken into shots — saves time and cost.
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-primary/80">
          <Sparkles className="h-3 w-3" />
          <span>Tip: Selecting fewer scenes = fewer credits used.</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scenes.map(scene => {
            const isSelected = selectedNumbers.has(scene.sceneNumber);
            const shotCount = shotOverrides.get(scene.sceneNumber) ?? scene.estimatedShots;

            return (
              <Card
                key={scene.sceneNumber}
                className={`border transition-colors cursor-pointer ${
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
                onClick={() => !isProcessing && toggle(scene.sceneNumber)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggle(scene.sceneNumber)}
                      disabled={isProcessing}
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="secondary" className="text-xs">
                          Scene {scene.sceneNumber}
                        </Badge>
                        {scene.intExt && scene.intExt !== "UNKNOWN" && (
                          <Badge variant="outline" className="text-xs">{scene.intExt}</Badge>
                        )}
                        {scene.dayNight && scene.dayNight !== "UNKNOWN" && (
                          <Badge variant="outline" className="text-xs">{scene.dayNight}</Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm leading-tight truncate">
                        {scene.heading}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {scene.summary}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {scene.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {scene.location}
                      </span>
                    )}
                    {scene.characters.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {scene.characters.slice(0, 3).join(", ")}
                        {scene.characters.length > 3 && ` +${scene.characters.length - 3}`}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div
                      className="flex items-center gap-2 pt-2 border-t border-border"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Camera className="h-3 w-3 text-muted-foreground" />
                      <Label htmlFor={`shots-${scene.sceneNumber}`} className="text-xs whitespace-nowrap">
                        Shots:
                      </Label>
                      <Input
                        id={`shots-${scene.sceneNumber}`}
                        type="number"
                        min={1}
                        max={20}
                        value={shotCount}
                        onChange={(e) => updateShots(scene.sceneNumber, e.target.value)}
                        className="h-7 w-16 text-xs"
                        disabled={isProcessing}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selected.length}</span> of {scenes.length} scenes selected
            {selected.length > 0 && (
              <> · approx <span className="font-medium text-foreground">{totalShots}</span> shots</>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
              Back
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selected.length === 0 || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Building Shot List...
                </>
              ) : (
                <>
                  Build Shot List
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Next step: review and edit the shot list before any images are generated.
        </p>
      </CardContent>
    </Card>
  );
};
