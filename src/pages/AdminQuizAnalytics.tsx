import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import { useCourseQuizzes } from '@/hooks/useCourseQuizzes';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, TrendingUp, TrendingDown, Clock, Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface QuizAttempt {
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

interface QuestionAnalytics {
  question_id: string;
  question_text: string;
  total_attempts: number;
  correct_count: number;
  incorrect_count: number;
  success_rate: number;
}

export default function AdminQuizAnalytics() {
  const { data: courses } = useAcademyCourses({});
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const { data: quizzes } = useCourseQuizzes(selectedCourseId);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionAnalytics, setQuestionAnalytics] = useState<QuestionAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedQuizId) {
      loadQuizAnalytics();
    }
  }, [selectedQuizId]);

  const loadQuizAnalytics = async () => {
    setIsLoading(true);
    try {
      // Load all attempts for the selected quiz
      const { data: attemptsData, error: attemptsError } = await supabase
        .from('user_quiz_attempts')
        .select('*')
        .eq('quiz_id', selectedQuizId)
        .order('completed_at', { ascending: false });

      if (attemptsError) throw attemptsError;
      setAttempts((attemptsData || []) as QuizAttempt[]);

      // Load quiz questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', selectedQuizId)
        .order('order_index');

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

      // Calculate question analytics
      if (attemptsData && questionsData) {
        const analytics = questionsData.map(question => {
          let correctCount = 0;
          let totalAttempts = 0;

          attemptsData.forEach(attempt => {
            if (attempt.answers[question.id] !== undefined) {
              totalAttempts++;
              if (attempt.answers[question.id] === question.correct_answer) {
                correctCount++;
              }
            }
          });

          return {
            question_id: question.id,
            question_text: question.question_text,
            total_attempts: totalAttempts,
            correct_count: correctCount,
            incorrect_count: totalAttempts - correctCount,
            success_rate: totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0,
          };
        });

        setQuestionAnalytics(analytics);
      }
    } catch (error) {
      console.error('Error loading quiz analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOverallStats = () => {
    if (attempts.length === 0) return null;

    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter(a => a.passed).length;
    const averageScore = attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts;
    const averageTime = attempts
      .filter(a => a.time_taken_seconds)
      .reduce((sum, a) => sum + (a.time_taken_seconds || 0), 0) / 
      attempts.filter(a => a.time_taken_seconds).length;
    
    const uniqueUsers = new Set(attempts.map(a => a.user_id)).size;
    const firstTimePassRate = attempts
      .filter(a => a.attempt_number === 1)
      .filter(a => a.passed).length / 
      attempts.filter(a => a.attempt_number === 1).length * 100;

    return {
      totalAttempts,
      passedAttempts,
      passRate: (passedAttempts / totalAttempts) * 100,
      averageScore,
      averageTime: Math.round(averageTime),
      uniqueUsers,
      firstTimePassRate: isNaN(firstTimePassRate) ? 0 : firstTimePassRate,
    };
  };

  const stats = calculateOverallStats();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getDifficultyBadge = (successRate: number) => {
    if (successRate >= 80) return { variant: 'default' as const, label: 'Easy', icon: TrendingUp };
    if (successRate >= 60) return { variant: 'secondary' as const, label: 'Medium', icon: BarChart3 };
    return { variant: 'destructive' as const, label: 'Hard', icon: TrendingDown };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Quiz Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Analyze student performance and identify areas for improvement
          </p>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Course</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedQuizId} 
                onValueChange={setSelectedQuizId}
                disabled={!selectedCourseId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a quiz" />
                </SelectTrigger>
                <SelectContent>
                  {quizzes?.map((quiz) => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      {quiz.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {selectedQuizId && stats && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Attempts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div className="text-2xl font-bold">{stats.totalAttempts}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.uniqueUsers} unique students
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pass Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div className="text-2xl font-bold">{stats.passRate.toFixed(1)}%</div>
                  </div>
                  <Progress value={stats.passRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Average Score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    First-time pass: {stats.firstTimePassRate.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div className="text-2xl font-bold">{formatTime(stats.averageTime)}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per completion
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="questions" className="space-y-4">
              <TabsList>
                <TabsTrigger value="questions">Question Analysis</TabsTrigger>
                <TabsTrigger value="attempts">Recent Attempts</TabsTrigger>
              </TabsList>

              {/* Question Analysis Tab */}
              <TabsContent value="questions">
                <Card>
                  <CardHeader>
                    <CardTitle>Question Performance</CardTitle>
                    <CardDescription>
                      Identify difficult questions that students struggle with
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {questionAnalytics.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Question</TableHead>
                            <TableHead>Attempts</TableHead>
                            <TableHead>Correct</TableHead>
                            <TableHead>Incorrect</TableHead>
                            <TableHead>Success Rate</TableHead>
                            <TableHead>Difficulty</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {questionAnalytics
                            .sort((a, b) => a.success_rate - b.success_rate)
                            .map((qa) => {
                              const difficulty = getDifficultyBadge(qa.success_rate);
                              const DifficultyIcon = difficulty.icon;
                              return (
                                <TableRow key={qa.question_id}>
                                  <TableCell className="max-w-md">
                                    <div className="line-clamp-2">{qa.question_text}</div>
                                  </TableCell>
                                  <TableCell>{qa.total_attempts}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      {qa.correct_count}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <XCircle className="h-4 w-4 text-destructive" />
                                      {qa.incorrect_count}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <div className="font-medium">{qa.success_rate.toFixed(1)}%</div>
                                      <Progress value={qa.success_rate} className="h-2" />
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={difficulty.variant} className="gap-1">
                                      <DifficultyIcon className="h-3 w-3" />
                                      {difficulty.label}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No question analytics available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Problem Questions Alert */}
                {questionAnalytics.some(q => q.success_rate < 50) && (
                  <Card className="border-destructive">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <CardTitle>Problem Questions Detected</CardTitle>
                      </div>
                      <CardDescription>
                        The following questions have a success rate below 50%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {questionAnalytics
                          .filter(q => q.success_rate < 50)
                          .map(q => (
                            <li key={q.question_id} className="flex items-start gap-2">
                              <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                              <div className="flex-1">
                                <div className="font-medium">{q.question_text}</div>
                                <div className="text-sm text-muted-foreground">
                                  Only {q.success_rate.toFixed(1)}% success rate ({q.correct_count}/{q.total_attempts})
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Recent Attempts Tab */}
              <TabsContent value="attempts">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Quiz Attempts</CardTitle>
                    <CardDescription>
                      Latest submissions from students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {attempts.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Attempt #</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Time Taken</TableHead>
                            <TableHead>Result</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attempts.slice(0, 20).map((attempt) => (
                            <TableRow key={attempt.id}>
                              <TableCell>
                                {new Date(attempt.completed_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">#{attempt.attempt_number}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{attempt.score}%</span>
                                  <Progress value={attempt.score} className="w-20 h-2" />
                                </div>
                              </TableCell>
                              <TableCell>
                                {attempt.time_taken_seconds
                                  ? formatTime(attempt.time_taken_seconds)
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {attempt.passed ? (
                                  <Badge variant="default" className="gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Passed
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="gap-1">
                                    <XCircle className="h-3 w-3" />
                                    Failed
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No attempts recorded yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {!selectedQuizId && (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Select a course and quiz to view analytics
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
