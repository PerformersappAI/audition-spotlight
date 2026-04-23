import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sparkles, UserCircle2, Loader2, RefreshCw, Coins, Wand2 } from "lucide-react";
import { useState } from "react";

export interface CastMember {
  name: string;
  description: string;
  appears_in_scenes: number[];
  reference_image_url?: string;
}

interface CastTabProps {
  cast: CastMember[];
  onGenerateReference?: (name: string) => Promise<void> | void;
  onGenerateAllMissing?: () => Promise<void> | void;
  generatingNames?: Set<string>;
  isBulkGenerating?: boolean;
  framesUsageByName?: Record<string, number>;
}

export const CastTab = ({
  cast,
  onGenerateReference,
  onGenerateAllMissing,
  generatingNames,
  isBulkGenerating,
  framesUsageByName,
}: CastTabProps) => {
  const [confirmRegenName, setConfirmRegenName] = useState<string | null>(null);

  if (!cast || cast.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed border-border rounded-lg">
        <UserCircle2 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No cast extracted for this project yet.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Process a script through the Detailed Breakdown flow to populate the cast.
        </p>
      </div>
    );
  }

  const initials = (name: string) =>
    name
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const missingCount = cast.filter((c) => !c.reference_image_url).length;
  const isGenerating = (name: string) => generatingNames?.has(name) ?? false;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-semibold text-base flex items-center gap-2">
          <UserCircle2 className="h-5 w-5 text-primary" />
          Cast ({cast.length})
        </h3>
        {onGenerateAllMissing && missingCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onGenerateAllMissing()}
            disabled={isBulkGenerating}
          >
            {isBulkGenerating ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Wand2 className="h-3.5 w-3.5 mr-1.5" />
            )}
            Generate All Missing ({missingCount} <Coins className="h-3 w-3 mx-1" />)
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Reference images keep characters consistent across every generated frame. 1 credit per character.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cast.map((member) => {
          const busy = isGenerating(member.name);
          const hasRef = !!member.reference_image_url;
          const usedInFrames = framesUsageByName?.[member.name] ?? 0;
          return (
            <Card key={member.name} className="border-border">
              <CardContent className="p-4 flex gap-3">
                <Avatar className="h-16 w-16 border border-border rounded-md">
                  {hasRef && (
                    <AvatarImage
                      src={member.reference_image_url}
                      alt={`${member.name} reference`}
                      className="object-cover"
                      loading="lazy"
                    />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-md">
                    {initials(member.name) || "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm truncate">{member.name}</h4>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-[10px]">
                        {member.appears_in_scenes.length} scene
                        {member.appears_in_scenes.length === 1 ? "" : "s"}
                      </Badge>
                      {usedInFrames > 0 && (
                        <Badge variant="secondary" className="text-[10px]">
                          Used in {usedInFrames} frame{usedInFrames === 1 ? "" : "s"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {member.description && (
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-3">
                      {member.description}
                    </p>
                  )}

                  {member.appears_in_scenes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {member.appears_in_scenes.slice(0, 8).map((n) => (
                        <Badge
                          key={n}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          S{n}
                        </Badge>
                      ))}
                      {member.appears_in_scenes.length > 8 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          +{member.appears_in_scenes.length - 8}
                        </Badge>
                      )}
                    </div>
                  )}

                  {onGenerateReference && (
                    hasRef ? (
                      <AlertDialog
                        open={confirmRegenName === member.name}
                        onOpenChange={(open) =>
                          setConfirmRegenName(open ? member.name : null)
                        }
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            className="w-full mt-1"
                          >
                            {busy ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3 mr-1" />
                            )}
                            Regenerate (1 credit)
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Regenerate {member.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will replace the existing reference image and cost 1 credit.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                setConfirmRegenName(null);
                                await onGenerateReference(member.name);
                              }}
                            >
                              Regenerate
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        size="sm"
                        variant="default"
                        disabled={busy}
                        onClick={() => onGenerateReference(member.name)}
                        className="w-full mt-1"
                      >
                        {busy ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3 mr-1" />
                        )}
                        Generate Reference Image (1 credit)
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
