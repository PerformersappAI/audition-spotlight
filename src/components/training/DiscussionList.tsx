import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Pin, Lock, Plus } from "lucide-react";
import { useCourseDiscussions, Discussion } from "@/hooks/useCourseDiscussions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscussionListProps {
  courseId: string;
  onSelectDiscussion: (discussion: Discussion) => void;
}

export const DiscussionList = ({
  courseId,
  onSelectDiscussion,
}: DiscussionListProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const { discussions, isLoading, createDiscussion } = useCourseDiscussions(courseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createDiscussion.mutate({ title, content });
    setTitle("");
    setContent("");
    setIsDialogOpen(false);
  };

  const getUserName = (discussion: Discussion) => {
    const profile = discussion.profiles;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.email || "Anonymous";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Discussions</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your question or topic?"
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe your question or start the discussion..."
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Post Discussion
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!discussions || discussions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No discussions yet. Be the first to start one!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {discussions.map((discussion) => (
            <Card
              key={discussion.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onSelectDiscussion(discussion)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {discussion.is_pinned && (
                        <Badge variant="secondary" className="h-5">
                          <Pin className="w-3 h-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      {discussion.is_locked && (
                        <Badge variant="outline" className="h-5">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {discussion.title}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {discussion.reply_count || 0}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {discussion.content}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>by {getUserName(discussion)}</span>
                  <span>
                    {formatDistanceToNow(new Date(discussion.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
