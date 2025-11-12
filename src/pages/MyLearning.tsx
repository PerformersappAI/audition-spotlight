import { BookOpen, Clock, Award, TrendingUp, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useCertificationStats } from '@/hooks/useCertifications';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function MyLearning() {
  const { user } = useAuth();
  const { data: allProgress, isLoading: progressLoading } = useUserProgress(user?.id);
  const { data: certStats } = useCertificationStats(user?.id || '');
  const { data: allCourses } = useAcademyCourses({});

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Sign In to View Your Learning</h1>
        <p className="text-muted-foreground mb-6">
          Track your courses, progress, and certifications
        </p>
        <Button asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (progressLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-muted rounded-lg" />
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const inProgressCourses = allProgress?.filter(p => p.status === 'in_progress') || [];
  const completedCourses = allProgress?.filter(p => p.status === 'completed') || [];
  const totalHours = allProgress?.reduce((sum, p) => {
    const course = allCourses?.find(c => c.id === p.course_id);
    return sum + (course?.duration_hours || 0);
  }, 0) || 0;

  // Get recommended courses (courses not yet started)
  const enrolledCourseIds = allProgress?.map(p => p.course_id) || [];
  const recommendedCourses = allCourses?.filter(c => !enrolledCourseIds.includes(c.id)).slice(0, 3) || [];

  const hasActivity = (allProgress?.length || 0) > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Learning</h1>
        <p className="text-muted-foreground">
          Track your progress and continue your filmmaking education
        </p>
      </div>

      {hasActivity ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{allProgress?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Courses Enrolled</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <PlayCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{inProgressCourses.length}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{completedCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalHours}</div>
                    <div className="text-sm text-muted-foreground">Hours Learned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* In Progress Courses */}
              {inProgressCourses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5" />
                      Continue Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {inProgressCourses.map((progress) => {
                      const course = allCourses?.find(c => c.id === progress.course_id);
                      if (!course) return null;

                      return (
                        <Link
                          key={progress.id}
                          to={`/training/${course.id}`}
                          className="block group"
                        >
                          <div className="flex gap-4 p-4 rounded-lg border hover:bg-accent transition-colors">
                            {course.thumbnail_url && (
                              <img
                                src={course.thumbnail_url}
                                alt={course.title}
                                className="w-24 h-24 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                {course.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Badge variant="secondary">{course.category}</Badge>
                                <span>•</span>
                                <span>{course.duration_hours}h</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{progress.progress_percentage}%</span>
                                </div>
                                <Progress value={progress.progress_percentage} className="h-2" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Last accessed {format(new Date(progress.last_accessed_at), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Completed Courses */}
              {completedCourses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Completed Courses
                      </div>
                      {certStats && certStats.totalCertifications > 0 && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/training/certifications">View Certificates</Link>
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {completedCourses.map((progress) => {
                      const course = allCourses?.find(c => c.id === progress.course_id);
                      if (!course) return null;

                      return (
                        <Link
                          key={progress.id}
                          to={`/training/${course.id}`}
                          className="block group"
                        >
                          <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent transition-colors">
                            <div className="rounded-full bg-green-500/10 p-2">
                              <Award className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {course.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Completed {progress.completed_at && format(new Date(progress.completed_at), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                              Certified
                            </Badge>
                          </div>
                        </Link>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Certification Stats */}
              {certStats && certStats.totalCertifications > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-accent/50 rounded-lg">
                      <Award className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <div className="text-3xl font-bold mb-1">{certStats.totalCertifications}</div>
                      <div className="text-sm text-muted-foreground">Certifications Earned</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Skills Acquired</span>
                        <span className="font-semibold">{certStats.skillsAcquired}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Hours</span>
                        <span className="font-semibold">{certStats.totalHours}h</span>
                      </div>
                    </div>
                    <Button asChild className="w-full" size="sm">
                      <Link to="/training/certifications">View All Certificates</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Recommended Courses */}
              {recommendedCourses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recommended for You
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recommendedCourses.map((course) => (
                      <Link
                        key={course.id}
                        to={`/training/${course.id}`}
                        className="block group"
                      >
                        <div className="p-3 rounded-lg border hover:bg-accent transition-colors">
                          <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                            <span>•</span>
                            <span>{course.duration_hours}h</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/training">Browse All Courses</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Start Your Learning Journey</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Enroll in courses from Feifer Film Academy to track your progress and earn
              professional certifications.
            </p>
            <Button asChild size="lg">
              <Link to="/training">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
