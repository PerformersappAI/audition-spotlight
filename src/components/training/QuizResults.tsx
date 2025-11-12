import { CheckCircle, XCircle, Trophy, RotateCcw, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuizQuestions, type QuizAttempt, type Quiz } from '@/hooks/useCourseQuizzes';

interface QuizResultsProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRetake: () => void;
  onClose: () => void;
}

export function QuizResults({ quiz, attempt, onRetake, onClose }: QuizResultsProps) {
  const { data: questions } = useQuizQuestions(quiz.id);

  const canRetake = attempt.attempt_number < quiz.max_attempts && !attempt.passed;
  const percentageScore = attempt.score;

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card className={attempt.passed ? 'border-green-500/50' : 'border-destructive/50'}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {attempt.passed ? (
              <div className="rounded-full bg-green-500/10 p-4 inline-block">
                <Trophy className="h-12 w-12 text-green-600" />
              </div>
            ) : (
              <div className="rounded-full bg-destructive/10 p-4 inline-block">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {attempt.passed ? 'Congratulations!' : 'Not Passed'}
          </CardTitle>
          <p className="text-muted-foreground">
            {attempt.passed
              ? `You passed the quiz with a score of ${percentageScore}%`
              : `You scored ${percentageScore}%. Passing score is ${quiz.passing_score}%`}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your Score</span>
              <span className="font-semibold">{percentageScore}%</span>
            </div>
            <Progress
              value={percentageScore}
              className={`h-3 ${attempt.passed ? '[&>div]:bg-green-600' : '[&>div]:bg-destructive'}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-medium">Passing: {quiz.passing_score}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{attempt.score}%</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round((attempt.score / 100) * attempt.total_questions)}/{attempt.total_questions}
              </div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {attempt.time_taken_seconds ? Math.round(attempt.time_taken_seconds / 60) : 0}m
              </div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
          </div>

          {/* Attempt Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Attempt Number</span>
              <span className="font-medium">
                {attempt.attempt_number} of {quiz.max_attempts}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed At</span>
              <span className="font-medium">
                {new Date(attempt.completed_at).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      {questions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Answer Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = attempt.answers[question.id];
              const isCorrect = userAnswer === question.correct_answer;

              return (
                <div key={question.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {index + 1}. {question.question_text}
                      </p>
                    </div>
                  </div>

                  <div className="pl-7 space-y-2">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Your Answer: </span>
                      <span className={isCorrect ? 'text-green-600' : 'text-destructive'}>
                        {userAnswer || 'Not answered'}
                      </span>
                    </div>

                    {!isCorrect && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Correct Answer: </span>
                        <span className="text-green-600">{question.correct_answer}</span>
                      </div>
                    )}

                    {question.explanation && (
                      <div className="bg-muted/50 rounded p-2 text-sm">
                        <span className="font-medium">Explanation: </span>
                        {question.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onClose} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>

        {canRetake && (
          <Button onClick={onRetake} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Retake Quiz ({quiz.max_attempts - attempt.attempt_number} attempts left)
          </Button>
        )}

        {!attempt.passed && !canRetake && (
          <Badge variant="secondary">
            No retakes remaining. Contact instructor for help.
          </Badge>
        )}
      </div>
    </div>
  );
}
