import { GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import { Link } from 'react-router-dom';

interface ToolPageRecommendationsProps {
  toolName: string;
  category?: string;
  maxCourses?: number;
}

// Map tools to relevant course categories
const TOOL_CATEGORY_MAP: Record<string, string[]> = {
  'script-analysis': ['Pre-Production', 'Post-Production'],
  'storyboarding': ['Pre-Production', 'Production'],
  'scene-analysis': ['Production', 'Pre-Production'],
  'video-evaluation': ['Post-Production', 'Production'],
};

export function ToolPageRecommendations({ 
  toolName, 
  category,
  maxCourses = 3 
}: ToolPageRecommendationsProps) {
  const relevantCategories = category ? [category] : (TOOL_CATEGORY_MAP[toolName] || []);
  
  const { data: courses, isLoading } = useAcademyCourses({
    category: relevantCategories[0],
  });

  if (isLoading || !courses || courses.length === 0) {
    return null;
  }

  // Filter courses by all relevant categories if multiple
  const filteredCourses = relevantCategories.length > 1
    ? courses.filter(course => relevantCategories.includes(course.category || ''))
    : courses;

  const displayCourses = filteredCourses.slice(0, maxCourses);

  if (displayCourses.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GraduationCap className="h-5 w-5 text-primary" />
          Level Up Your Skills
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Learn the professional techniques behind this tool
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayCourses.map((course) => (
          <Link
            key={course.id}
            to={`/training/${course.id}`}
            className="block group"
          >
            <div className="flex gap-3 p-3 rounded-lg border bg-background hover:bg-accent transition-colors">
              {course.thumbnail_url && (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {course.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {course.category}
                  </Badge>
                  <span>•</span>
                  <span>{course.duration_hours}h</span>
                  {course.level && (
                    <>
                      <span>•</span>
                      <span>{course.level}</span>
                    </>
                  )}
                </div>
                {course.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                )}
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors self-center" />
            </div>
          </Link>
        ))}
        
        <Button asChild variant="outline" className="w-full" size="sm">
          <Link to="/training">
            Browse All Courses
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
