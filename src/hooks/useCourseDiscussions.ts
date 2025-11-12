import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Discussion {
  id: string;
  course_id: string;
  user_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  reply_count?: number;
}

export interface Reply {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  is_solution: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

export const useCourseDiscussions = (courseId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: discussions, isLoading } = useQuery({
    queryKey: ["course-discussions", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_discussions")
        .select(`
          *,
          profiles (first_name, last_name, email)
        `)
        .eq("course_id", courseId)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      const discussionsWithCounts = await Promise.all(
        (data || []).map(async (discussion) => {
          const { count } = await supabase
            .from("discussion_replies")
            .select("*", { count: "exact", head: true })
            .eq("discussion_id", discussion.id);

          return { ...discussion, reply_count: count || 0 };
        })
      );

      return discussionsWithCounts as Discussion[];
    },
  });

  const createDiscussion = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: discussion, error } = await supabase
        .from("course_discussions")
        .insert({
          course_id: courseId,
          user_id: user.id,
          title: data.title,
          content: data.content,
        })
        .select()
        .single();

      if (error) throw error;
      return discussion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-discussions", courseId] });
      toast({
        title: "Discussion created",
        description: "Your discussion has been posted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create discussion. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating discussion:", error);
    },
  });

  const incrementViewCount = useMutation({
    mutationFn: async (discussionId: string) => {
      const { error } = await supabase.rpc('increment_discussion_views', {
        discussion_id: discussionId
      });
      if (error) throw error;
    },
  });

  return {
    discussions,
    isLoading,
    createDiscussion,
    incrementViewCount,
  };
};

export const useDiscussionReplies = (discussionId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: replies, isLoading } = useQuery({
    queryKey: ["discussion-replies", discussionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussion_replies")
        .select(`
          *,
          profiles (first_name, last_name, email)
        `)
        .eq("discussion_id", discussionId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Reply[];
    },
    enabled: !!discussionId,
  });

  const createReply = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: reply, error } = await supabase
        .from("discussion_replies")
        .insert({
          discussion_id: discussionId,
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return reply;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", discussionId] });
      toast({
        title: "Reply posted",
        description: "Your reply has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating reply:", error);
    },
  });

  const markAsSolution = useMutation({
    mutationFn: async (replyId: string) => {
      const { error } = await supabase
        .from("discussion_replies")
        .update({ is_solution: true })
        .eq("id", replyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", discussionId] });
      toast({
        title: "Solution marked",
        description: "Reply has been marked as the solution.",
      });
    },
  });

  return {
    replies,
    isLoading,
    createReply,
    markAsSolution,
  };
};
