import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Pin, Lock, Eye, Plus } from "lucide-react";
import { useCourseDiscussions, Discussion } from "@/hooks/useCourseDiscussions";
import { formatDistanceToNow } from "date-fns";

interface DiscussionListProps {
  courseId: string;
  onSelectDiscussion: (discussion: Discussion) => void;
}

export const DiscussionList = ({ courseId, onSelectDiscussion }: DiscussionListProps) => {
  const { discussions, isLoading, createDiscussion } = useCourseDiscussions(courseId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDiscussion.mutateAsync(newDiscussion);
    setNewDiscussion({ title: "", content: "" });
    setIsDialogOpen(false);
  };

  const getUserDisplayName = (discussion: Discussion) => {
    if (discussion.profiles?.first_name && discussion.profiles?.last_name) {
      return `${discussion.profiles.first_name} ${discussion.profiles.last_name}`;
    }
    return discussion.profiles?.email || "Anonymous";
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading discussions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Course Discussions</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Discussion title"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="What would you like to discuss?"
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={createDiscussion.isPending}>
                {createDiscussion.isPending ? "Posting..." : "Post Discussion"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {discussions && discussions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No discussions yet. Be the first to start one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {discussions?.map((discussion) => (
            <Card
              key={discussion.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onSelectDiscussion(discussion)}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {discussion.is_pinned && (
                        <Badge variant="secondary">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      {discussion.is_locked && (
                        <Badge variant="outline">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold hover:text-primary transition-colors">
                      {discussion.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {discussion.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{getUserDisplayName(discussion)}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {discussion.reply_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {discussion.view_count}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
