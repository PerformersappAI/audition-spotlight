import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, MessageSquare } from "lucide-react";
import { Discussion, useDiscussionReplies } from "@/hooks/useCourseDiscussions";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface DiscussionThreadProps {
  discussion: Discussion;
  onBack: () => void;
}

export const DiscussionThread = ({
  discussion,
  onBack,
}: DiscussionThreadProps) => {
  const [replyContent, setReplyContent] = useState("");
  const { user } = useAuth();
  const { replies, isLoading, createReply, markAsSolution } = useDiscussionReplies(discussion.id);

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    createReply.mutate(replyContent);
    setReplyContent("");
  };

  const getUserName = (profile?: { first_name: string | null; last_name: string | null; email: string }) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.email || "Anonymous";
  };

  const isDiscussionOwner = user?.id === discussion.user_id;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Discussions
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{discussion.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>by {getUserName(discussion.profiles)}</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(discussion.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{discussion.content}</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <h4 className="font-semibold">
            {replies?.length || 0} {replies?.length === 1 ? "Reply" : "Replies"}
          </h4>
        </div>

        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : replies && replies.length > 0 ? (
          replies.map((reply) => (
            <Card key={reply.id} className={reply.is_solution ? "border-green-500" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {getUserName(reply.profiles)}
                    </span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(reply.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {reply.is_solution && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Solution
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap mb-3">{reply.content}</p>
                {isDiscussionOwner && !reply.is_solution && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsSolution.mutate(reply.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Solution
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No replies yet. Be the first to respond!
            </CardContent>
          </Card>
        )}
      </div>

      {!discussion.is_locked && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Your Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts or help answer the question..."
                rows={4}
                required
              />
              <Button type="submit" disabled={!user}>
                {!user ? "Sign in to Reply" : "Post Reply"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
