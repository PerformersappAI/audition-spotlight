import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UserCourseProgress } from '@/types/training';

export function useUserProgress(userId?: string) {
  return useQuery({
    queryKey: ['user-course-progress', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as UserCourseProgress[];
    },
    enabled: !!userId,
  });
}
