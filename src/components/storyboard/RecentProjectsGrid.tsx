import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Image as ImageIcon, ArrowUp, Film, Pencil, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { StoryboardProject } from "@/hooks/useStoryboardProjects";

interface RecentProjectsGridProps {
  projects: StoryboardProject[];
  selectedId?: string | null;
  onOpen: (project: StoryboardProject) => void;
  onDelete: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
  onViewAll?: () => void;
  totalCount?: number;
  limit?: number;
  loading?: boolean;
  emptyHint?: string;
  compact?: boolean;
}

const ART_STYLE_LABELS: Record<string, string> = {
  comic: "Comic Book",
  noir: "Film Noir",
  anime: "Anime",
  realistic: "Realistic",
  watercolor: "Watercolor",
  sketch: "Pencil Sketch",
  cinematic: "Cinematic",
};

export const RecentProjectsGrid = ({
  projects,
  selectedId,
  onOpen,
  onDelete,
  onRename,
  onViewAll,
  totalCount,
  limit = 6,
  loading = false,
  emptyHint = "No projects yet — upload a script above to get started!",
  compact = false,
}: RecentProjectsGridProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const gridClass = compact
    ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: compact ? 2 : 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-lg">
        <Film className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{emptyHint}</p>
        <div className="flex items-center justify-center gap-1 text-xs text-primary mt-2">
          <ArrowUp className="h-3 w-3" />
          <span>Upload a script above to begin</span>
        </div>
      </div>
    );
  }

  const visible = projects.slice(0, limit);
  const total = totalCount ?? projects.length;
  const hasMore = total > limit;

  const startEdit = (p: StoryboardProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(p.id);
    setDraftTitle(p.project_title || "");
  };

  const commitEdit = (id: string) => {
    const trimmed = draftTitle.trim();
    if (trimmed && onRename) onRename(id, trimmed);
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      <div className={gridClass}>
        {visible.map((p) => {
          const title =
            p.project_title ||
            (p.genre ? `${p.genre} project` : "Untitled storyboard");
          const sceneCount = p.scene_count ?? 0;
          const frameCount =
            p.frame_count ??
            (Array.isArray(p.storyboard_frames)
              ? p.storyboard_frames.filter((f) => f.imageData).length
              : 0);
          let relativeDate = "";
          try {
            relativeDate = formatDistanceToNow(new Date(p.created_at), { addSuffix: true });
          } catch {
            relativeDate = new Date(p.created_at).toLocaleDateString();
          }
          const isActive = selectedId === p.id;
          const styleLabel = p.art_style
            ? ART_STYLE_LABELS[p.art_style] || p.art_style
            : null;
          const isEditing = editingId === p.id;

          return (
            <Card
              key={p.id}
              className={`overflow-hidden border transition-colors ${
                isActive
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <button
                type="button"
                onClick={() => onOpen(p)}
                className="block w-full text-left"
              >
                <div className="aspect-video bg-muted/40 relative overflow-hidden">
                  {p.thumbnail_url ? (
                    <img
                      src={p.thumbnail_url}
                      alt={`${title} thumbnail`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  {p.is_complete && (
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      Complete
                    </Badge>
                  )}
                </div>
              </button>

              <CardContent className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit(p.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="h-7 text-sm"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          commitEdit(p.id);
                        }}
                        aria-label="Save title"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        aria-label="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3
                        className="font-semibold text-sm truncate flex-1"
                        title={title}
                      >
                        {title}
                      </h3>
                      {onRename && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 shrink-0"
                          onClick={(e) => startEdit(p, e)}
                          aria-label="Rename project"
                        >
                          <Pencil className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span>{relativeDate}</span>
                  <span>•</span>
                  <span>
                    {sceneCount} scene{sceneCount === 1 ? "" : "s"}
                  </span>
                  <span>•</span>
                  <span>
                    {frameCount} frame{frameCount === 1 ? "" : "s"}
                  </span>
                </div>

                {styleLabel && (
                  <div>
                    <Badge variant="outline" className="text-[10px] py-0 px-2">
                      {styleLabel}
                    </Badge>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1"
                    onClick={() => onOpen(p)}
                  >
                    Open
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete project"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                        <AlertDialogDescription>
                          "{title}" and all of its generated frames will be
                          permanently removed. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => onDelete(p.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {hasMore && onViewAll && (
        <div className="text-center">
          <Button variant="link" size="sm" onClick={onViewAll}>
            View all projects ({total}) →
          </Button>
        </div>
      )}
    </div>
  );
};
