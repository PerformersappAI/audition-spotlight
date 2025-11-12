import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Clock } from 'lucide-react';
import type { UserCourseProgress } from '@/types/training';

interface ProgressTrackerProps {
  userProgress: UserCourseProgress | null;
  courseId: string;
  userId: string;
  currentVideoProgress?: number;
}

export function ProgressTracker({ 
  userProgress, 
  courseId, 
  userId,
  currentVideoProgress = 0 
}: ProgressTrackerProps) {
  // Update progress as user watches video
  useEffect(() => {
    if (!userProgress || currentVideoProgress === 0) return;

    const updateProgress = async () => {
      const { error } = await supabase
        .from('user_course_progress')
        .update({
          progress_percentage: Math.max(userProgress.progress_percentage, currentVideoProgress),
          last_accessed_at: new Date().toISOString(),
          ...(currentVideoProgress >= 95 && {
            status: 'completed',
            completed_at: new Date().toISOString(),
          }),
        })
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error updating progress:', error);
      }
    };

    // Debounce updates - only update every 10% progress
    if (currentVideoProgress % 10 === 0) {
      updateProgress();
    }
  }, [currentVideoProgress, userProgress, courseId, userId]);

  if (!userProgress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Enroll in this course to track your progress</p>
        </CardContent>
      </Card>
    );
  }

  const isCompleted = userProgress.status === 'completed';
  const percentage = userProgress.progress_percentage;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Your Progress
          {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Last accessed: {new Date(userProgress.last_accessed_at).toLocaleDateString()}
          </span>
        </div>

        {isCompleted && userProgress.completed_at && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm font-medium text-green-600">
              Completed on {new Date(userProgress.completed_at).toLocaleDateString()}
            </p>
            <a href="/training/certifications" className="text-xs text-primary hover:underline mt-1 block">
              View your certificate in the Certifications gallery →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
