import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  passing_score: number;
  time_limit_minutes: number | null;
  max_attempts: number;
  is_required_for_certification: boolean;
  order_index: number;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
  points: number;
  order_index: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  answers: Record<string, string>;
  passed: boolean;
  time_taken_seconds: number | null;
  attempt_number: number;
  completed_at: string;
}

export function useCourseQuizzes(courseId: string) {
  return useQuery({
    queryKey: ['course-quizzes', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_quizzes')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (error) throw error;
      return data as Quiz[];
    },
    enabled: !!courseId,
  });
}

export function useQuizQuestions(quizId: string) {
  return useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index');

      if (error) throw error;
      return data as QuizQuestion[];
    },
    enabled: !!quizId,
  });
}

export function useUserQuizAttempts(userId: string, quizId: string) {
  return useQuery({
    queryKey: ['user-quiz-attempts', userId, quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('quiz_id', quizId)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data as QuizAttempt[];
    },
    enabled: !!userId && !!quizId,
  });
}

export function useSubmitQuizAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      quizId,
      answers,
      questions,
      timeStarted,
    }: {
      userId: string;
      quizId: string;
      answers: Record<string, string>;
      questions: QuizQuestion[];
      timeStarted: number;
    }) => {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correct_answer) {
          correctAnswers++;
        }
      });

      const score = Math.round((correctAnswers / questions.length) * 100);
      const timeEnded = Date.now();
      const timeTaken = Math.round((timeEnded - timeStarted) / 1000);

      // Get quiz details for passing score
      const { data: quiz } = await supabase
        .from('course_quizzes')
        .select('passing_score, max_attempts')
        .eq('id', quizId)
        .single();

      const passed = score >= (quiz?.passing_score || 70);

      // Get attempt number
      const { data: attempts } = await supabase
        .from('user_quiz_attempts')
        .select('attempt_number')
        .eq('user_id', userId)
        .eq('quiz_id', quizId)
        .order('attempt_number', { ascending: false })
        .limit(1);

      const attemptNumber = (attempts?.[0]?.attempt_number || 0) + 1;

      // Save attempt
      const { data, error } = await supabase
        .from('user_quiz_attempts')
        .insert({
          user_id: userId,
          quiz_id: quizId,
          score,
          total_questions: questions.length,
          answers,
          passed,
          time_taken_seconds: timeTaken,
          attempt_number: attemptNumber,
        })
        .select()
        .single();

      if (error) throw error;
      return data as QuizAttempt;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-quiz-attempts', variables.userId, variables.quizId],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-course-progress', variables.userId],
      });
    },
  });
}
