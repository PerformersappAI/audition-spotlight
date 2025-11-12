import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, PlayCircle } from 'lucide-react';
import type { UserCourseProgress } from '@/types/training';

interface CourseEnrollButtonProps {
  courseId: string;
  userProgress?: UserCourseProgress | null;
  onEnrolled?: () => void;
}

export function CourseEnrollButton({ courseId, userProgress, onEnrolled }: CourseEnrollButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please sign in to enroll in courses');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_course_progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: 'in_progress',
          progress_percentage: 0,
          started_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Successfully enrolled in course!');
      onEnrolled?.();
    } catch (error: any) {
      console.error('Error enrolling:', error);
      toast.error(error.message || 'Failed to enroll in course');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Button size="lg" disabled>
        Sign in to enroll
      </Button>
    );
  }

  if (userProgress?.status === 'completed') {
    return (
      <Button size="lg" variant="outline" className="cursor-default">
        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
        Completed
      </Button>
    );
  }

  if (userProgress?.status === 'in_progress') {
    return (
      <Button size="lg" variant="default">
        <PlayCircle className="mr-2 h-5 w-5" />
        Continue Learning ({userProgress.progress_percentage}%)
      </Button>
    );
  }

  return (
    <Button size="lg" onClick={handleEnroll} disabled={isLoading}>
      {isLoading ? 'Enrolling...' : 'Enroll Now'}
    </Button>
  );
}
