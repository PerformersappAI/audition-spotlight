import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Trash2, Image as ImageIcon, ArrowUp, Film } from "lucide-react";
import type { StoryboardProject } from "@/hooks/useStoryboardProjects";

interface RecentProjectsGridProps {
  projects: StoryboardProject[];
  selectedId?: string | null;
  onOpen: (project: StoryboardProject) => void;
  onDelete: (id: string) => void;
  emptyHint?: string;
  compact?: boolean;
}

export const RecentProjectsGrid = ({
  projects,
  selectedId,
  onOpen,
  onDelete,
  emptyHint = "No projects yet — upload a script to get started!",
  compact = false,
}: RecentProjectsGridProps) => {
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

  return (
    <div
      className={
        compact
          ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      }
    >
      {projects.map((p) => {
        const title =
          p.project_title ||
          (p.genre ? `${p.genre} project` : "Untitled storyboard");
        const sceneCount = p.scene_count ?? 0;
        const frameCount =
          p.frame_count ??
          (Array.isArray(p.storyboard_frames)
            ? p.storyboard_frames.filter((f) => f.imageData).length
            : 0);
        const date = new Date(p.created_at).toLocaleDateString();
        const isActive = selectedId === p.id;

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
                <h3 className="font-semibold text-sm truncate flex-1" title={title}>
                  {title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span>{date}</span>
                <span>•</span>
                <span>{sceneCount} scene{sceneCount === 1 ? "" : "s"}</span>
                <span>•</span>
                <span>{frameCount} frame{frameCount === 1 ? "" : "s"}</span>
              </div>
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
                    <Button size="icon" variant="ghost" aria-label="Delete project">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this storyboard?</AlertDialogTitle>
                      <AlertDialogDescription>
                        "{title}" and all of its generated frames will be permanently
                        removed. This cannot be undone.
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
  );
};
