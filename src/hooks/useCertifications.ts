import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UserCertification } from '@/types/training';

export function useCertifications(userId?: string) {
  return useQuery({
    queryKey: ['user-certifications', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_certifications')
        .select(`
          *,
          academy_courses (
            title,
            category,
            thumbnail_url,
            duration_hours
          )
        `)
        .eq('user_id', userId)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
    enabled: !!userId,
  });
}

export function useCertification(certificationId: string) {
  return useQuery({
    queryKey: ['certification', certificationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_certifications')
        .select(`
          *,
          academy_courses (
            title,
            category,
            duration_hours
          )
        `)
        .eq('id', certificationId)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useCourseCertification(userId: string, courseId: string) {
  return useQuery({
    queryKey: ['course-certification', userId, courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_certifications')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;
      return data as UserCertification | null;
    },
    enabled: !!userId && !!courseId,
  });
}

export function useCertificationStats(userId: string) {
  return useQuery({
    queryKey: ['certification-stats', userId],
    queryFn: async () => {
      const { data: certifications, error } = await supabase
        .from('user_certifications')
        .select(`
          *,
          academy_courses (
            duration_hours
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const totalCertifications = certifications?.length || 0;
      const allSkills = certifications?.flatMap((cert: any) => cert.skills_earned || []) || [];
      const uniqueSkills = [...new Set(allSkills)];
      const totalHours = certifications?.reduce((sum: number, cert: any) => 
        sum + (cert.academy_courses?.duration_hours || 0), 0) || 0;

      return {
        totalCertifications,
        skillsAcquired: uniqueSkills.length,
        totalHours,
        skills: uniqueSkills,
      };
    },
    enabled: !!userId,
  });
}

export function useVerifyCertificate(certificateNumber: string) {
  return useQuery({
    queryKey: ['verify-certificate', certificateNumber],
    queryFn: async () => {
      const { data: cert, error } = await supabase
        .from('user_certifications')
        .select('*, academy_courses (title, category)')
        .eq('certificate_number', certificateNumber)
        .maybeSingle();

      if (error) throw error;
      if (!cert) return null;

      // Fetch profile separately
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', cert.user_id)
        .single();

      return {
        ...cert,
        profile,
      };
    },
    enabled: !!certificateNumber,
  });
}
