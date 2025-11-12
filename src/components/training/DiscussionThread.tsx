import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, MessageSquare } from "lucide-react";
import { Discussion, useDiscussionReplies } from "@/hooks/useCourseDiscussions";
import { formatDistanceToNow } from "date-fns";

interface DiscussionThreadProps {
  discussion: Discussion;
  onBack: () => void;
}

export const DiscussionThread = ({ discussion, onBack }: DiscussionThreadProps) => {
  const { replies, isLoading, createReply, markAsSolution } = useDiscussionReplies(discussion.id);
  const [newReply, setNewReply] = useState("");

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    await createReply.mutateAsync(newReply);
    setNewReply("");
  };

  const getUserDisplayName = (profile: any) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.email || "Anonymous";
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Discussions
      </Button>

      <Card>
        <CardHeader>
          <div className="space-y-3">
            <CardTitle>{discussion.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Posted by {getUserDisplayName(discussion.profiles)} •{" "}
              {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground whitespace-pre-wrap">{discussion.content}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {replies?.length || 0} Replies
        </h3>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading replies...</div>
        ) : (
          <>
            {replies?.map((reply) => (
              <Card key={reply.id} className={reply.is_solution ? "border-green-500" : ""}>
                <CardContent className="py-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="text-sm text-muted-foreground">
                        {getUserDisplayName(reply.profiles)} •{" "}
                        {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                      </div>
                      {reply.is_solution && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Solution
                        </Badge>
                      )}
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{reply.content}</p>
                    {!reply.is_solution && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsSolution.mutate(reply.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Solution
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {!discussion.is_locked && (
          <Card>
            <CardContent className="py-4">
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <Textarea
                  placeholder="Write your reply..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  rows={4}
                  required
                />
                <Button type="submit" disabled={createReply.isPending || !newReply.trim()}>
                  {createReply.isPending ? "Posting..." : "Post Reply"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
