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

export interface DiscussionReply {
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
    queryKey: ["discussions", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_discussions")
        .select(`
          *,
          profiles!course_discussions_user_id_fkey (first_name, last_name, email)
        `)
        .eq("course_id", courseId)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get reply counts for each discussion
      const discussionsWithCounts = await Promise.all(
        (data || []).map(async (discussion) => {
          const { count } = await supabase
            .from("discussion_replies")
            .select("*", { count: "exact", head: true })
            .eq("discussion_id", discussion.id);

          return {
            ...discussion,
            reply_count: count || 0,
          };
        })
      );

      return discussionsWithCounts as any[];
    },
  });

  const createDiscussion = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("course_discussions").insert({
        course_id: courseId,
        user_id: user.id,
        title: data.title,
        content: data.content,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", courseId] });
      toast({
        title: "Discussion created",
        description: "Your discussion has been posted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create discussion.",
        variant: "destructive",
      });
    },
  });

  const incrementViewCount = useMutation({
    mutationFn: async (discussionId: string) => {
      const { data: discussion } = await supabase
        .from("course_discussions")
        .select("view_count")
        .eq("id", discussionId)
        .single();

      if (!discussion) return;

      const { error } = await supabase
        .from("course_discussions")
        .update({ view_count: discussion.view_count + 1 })
        .eq("id", discussionId);

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
          profiles!discussion_replies_user_id_fkey (first_name, last_name, email)
        `)
        .eq("discussion_id", discussionId)
        .order("is_solution", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as any[];
    },
  });

  const createReply = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("discussion_replies").insert({
        discussion_id: discussionId,
        user_id: user.id,
        content,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", discussionId] });
      toast({
        title: "Reply posted",
        description: "Your reply has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post reply.",
        variant: "destructive",
      });
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
        title: "Marked as solution",
        description: "This reply has been marked as the solution.",
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
