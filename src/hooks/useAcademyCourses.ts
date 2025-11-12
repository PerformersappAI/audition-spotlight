import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AcademyCourse, CourseFilters } from '@/types/training';

export function useAcademyCourses(filters?: CourseFilters) {
  return useQuery({
    queryKey: ['academy-courses', filters],
    queryFn: async () => {
      let query = supabase
        .from('academy_courses')
        .select('*')
        .order('order_index', { ascending: true });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.level) {
        query = query.eq('level', filters.level);
      }

      if (filters?.relatedTool) {
        query = query.eq('related_tool', filters.relatedTool);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AcademyCourse[];
    },
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academy_courses')
        .select('*')
        .eq('is_featured', true)
        .order('order_index', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data as AcademyCourse[];
    },
  });
}
