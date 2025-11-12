import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoPlayer } from '@/components/training/VideoPlayer';
import { CourseEnrollButton } from '@/components/training/CourseEnrollButton';
import { ProgressTracker } from '@/components/training/ProgressTracker';
import { RelatedToolsSection } from '@/components/training/RelatedToolsSection';
import { QuizTaker } from '@/components/training/QuizTaker';
import { QuizResults } from '@/components/training/QuizResults';
import { DiscussionList } from '@/components/training/DiscussionList';
import { DiscussionThread } from '@/components/training/DiscussionThread';
import { useCourseQuizzes, useUserQuizAttempts } from '@/hooks/useCourseQuizzes';
import { useCourseDiscussions, Discussion } from '@/hooks/useCourseDiscussions';
import { ArrowLeft, Clock, BookOpen, Award, Download, FileQuestion, CheckCircle, XCircle } from 'lucide-react';
import type { AcademyCourse, UserCourseProgress } from '@/types/training';
import { useState } from 'react';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [videoProgress, setVideoProgress] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const { incrementViewCount } = useCourseDiscussions(courseId || '');

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academy_courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data as AcademyCourse;
    },
    enabled: !!courseId,
  });

  const { data: userProgress, refetch: refetchProgress } = useQuery({
    queryKey: ['user-progress', courseId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId!)
        .maybeSingle();

      if (error) throw error;
      return data as UserCourseProgress | null;
    },
    enabled: !!user?.id && !!courseId,
  });

  const { data: quizzes } = useCourseQuizzes(courseId || '');

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'pre-production': return 'bg-blue-500/10 text-blue-600';
      case 'production': return 'bg-green-500/10 text-green-600';
      case 'post-production': return 'bg-purple-500/10 text-purple-600';
      case 'distribution': return 'bg-orange-500/10 text-orange-600';
      case 'funding': return 'bg-yellow-500/10 text-yellow-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getLevelColor = (level: string | null) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-500/10 text-emerald-600';
      case 'intermediate': return 'bg-amber-500/10 text-amber-600';
      case 'advanced': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video" />
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Course not found</p>
          <Button asChild>
            <Link to="/training">Back to Training Hub</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/training">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Training Hub
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer 
              videoUrl={course.video_url} 
              onProgress={setVideoProgress}
            />

            {/* Course Info */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {course.category && (
                    <Badge className={getCategoryColor(course.category)}>
                      {course.category.replace('-', ' ').toUpperCase()}
                    </Badge>
                  )}
                  {course.level && (
                    <Badge variant="outline" className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  )}
                  {course.is_featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                </div>
                <CardTitle className="text-3xl">{course.title}</CardTitle>
                <CardDescription className="text-base">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration_hours} hours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.instructor}</span>
                  </div>
                  {course.price_credits > 0 && (
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>{course.price_credits} credits</span>
                    </div>
                  )}
                </div>

                {course.materials_url && (
                  <Button variant="outline" asChild>
                    <a href={course.materials_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download Course Materials
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p>{course.description}</p>
                  {course.category === 'pre-production' && (
                    <ul>
                      <li>Essential pre-production planning techniques</li>
                      <li>How to break down scripts efficiently</li>
                      <li>Budget management for indie productions</li>
                      <li>Industry-standard workflows and best practices</li>
                    </ul>
                  )}
                  {course.category === 'production' && (
                    <ul>
                      <li>On-set protocols and safety measures</li>
                      <li>Directing techniques for authentic performances</li>
                      <li>Camera and lighting fundamentals</li>
                      <li>Time and resource management on set</li>
                    </ul>
                  )}
                  {course.category === 'post-production' && (
                    <ul>
                      <li>Professional editing workflows</li>
                      <li>Color grading techniques for cinematic look</li>
                      <li>Sound design and mixing essentials</li>
                      <li>Export settings for various platforms</li>
                    </ul>
                  )}
                  {course.category === 'distribution' && (
                    <ul>
                      <li>Festival submission strategies</li>
                      <li>Building effective marketing materials</li>
                      <li>Distribution deal negotiations</li>
                      <li>Self-distribution platforms and tactics</li>
                    </ul>
                  )}
                  {course.category === 'funding' && (
                    <ul>
                      <li>Identifying funding opportunities</li>
                      <li>Crafting compelling pitches</li>
                      <li>Grant application best practices</li>
                      <li>Building relationships with investors</li>
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Related Tools */}
            <RelatedToolsSection relatedTool={course.related_tool} />

            {/* Tabs for Quizzes and Discussions */}
            <Tabs defaultValue="quizzes" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="quizzes">
                {/* Quizzes */}
            {quizzes && quizzes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileQuestion className="h-5 w-5" />
                    Course Quizzes
                  </CardTitle>
                  <CardDescription>
                    Test your knowledge and earn your certification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeQuiz ? (
                    quizResult ? (
                      <QuizResults
                        quiz={activeQuiz}
                        attempt={quizResult}
                        onRetake={() => setQuizResult(null)}
                        onClose={() => {
                          setActiveQuiz(null);
                          setQuizResult(null);
                        }}
                      />
                    ) : (
                      <QuizTaker
                        quiz={activeQuiz}
                        userId={user?.id || ''}
                        onComplete={(attempt) => setQuizResult(attempt)}
                        onCancel={() => setActiveQuiz(null)}
                      />
                    )
                  ) : (
                    <div className="space-y-4">
                      {quizzes.map((quiz) => {
                        const QuizAttemptStatus = ({ quizId }: { quizId: string }) => {
                          const { data: attempts } = useUserQuizAttempts(user?.id || '', quizId);
                          const lastAttempt = attempts?.[0];
                          const hasPassedAttempt = attempts?.some(a => a.passed);

                          return (
                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{quiz.title}</h3>
                                  {quiz.is_required_for_certification && (
                                    <Badge variant="secondary" className="text-xs">Required</Badge>
                                  )}
                                </div>
                                {quiz.description && (
                                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                                )}
                                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>Passing: {quiz.passing_score}%</span>
                                  <span>Max Attempts: {quiz.max_attempts}</span>
                                  {quiz.time_limit_minutes && (
                                    <span>Time: {quiz.time_limit_minutes} min</span>
                                  )}
                                </div>
                                {lastAttempt && (
                                  <div className="flex items-center gap-2 mt-2">
                                    {hasPassedAttempt ? (
                                      <Badge className="bg-green-500/10 text-green-600 gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        Passed ({lastAttempt.score}%)
                                      </Badge>
                                    ) : (
                                      <Badge variant="destructive" className="gap-1">
                                        <XCircle className="h-3 w-3" />
                                        Not Passed ({lastAttempt.score}%)
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      Attempt {lastAttempt.attempt_number}/{quiz.max_attempts}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <Button
                                onClick={() => setActiveQuiz(quiz)}
                                disabled={!user || !userProgress}
                              >
                                {lastAttempt ? 'Retake' : 'Start Quiz'}
                              </Button>
                            </div>
                          );
                        };

                        return <QuizAttemptStatus key={quiz.id} quizId={quiz.id} />;
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
              </TabsContent>

              <TabsContent value="discussions">
                <Card>
                  <CardContent className="pt-6">
                    {selectedDiscussion ? (
                      <DiscussionThread
                        discussion={selectedDiscussion}
                        onBack={() => setSelectedDiscussion(null)}
                      />
                    ) : (
                      <DiscussionList
                        courseId={courseId || ''}
                        onSelectDiscussion={(discussion) => {
                          setSelectedDiscussion(discussion);
                          incrementViewCount.mutate(discussion.id);
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment */}
            <Card>
              <CardContent className="pt-6">
                <CourseEnrollButton
                  courseId={course.id}
                  userProgress={userProgress}
                  onEnrolled={() => refetchProgress()}
                />
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            {user && (
              <ProgressTracker
                userProgress={userProgress}
                courseId={course.id}
                userId={user.id}
                currentVideoProgress={videoProgress}
              />
            )}

            {/* Instructor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{course.instructor}</p>
                    <p className="text-sm text-muted-foreground">
                      Feifer Film Academy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{course.duration_hours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium capitalize">{course.category?.replace('-', ' ')}</span>
                </div>
                {course.price_credits === 0 ? (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">{course.price_credits} credits</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
