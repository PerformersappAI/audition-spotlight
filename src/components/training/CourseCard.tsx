import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import type { AcademyCourse } from '@/types/training';

interface CourseCardProps {
  course: AcademyCourse;
}

export function CourseCard({ course }: CourseCardProps) {
  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'pre-production': return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20';
      case 'production': return 'bg-green-500/10 text-green-600 hover:bg-green-500/20';
      case 'post-production': return 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20';
      case 'distribution': return 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20';
      case 'funding': return 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20';
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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={getCategoryColor(course.category)}>
            {course.category?.replace('-', ' ').toUpperCase()}
          </Badge>
          {course.is_featured && (
            <Badge variant="default" className="bg-primary">Featured</Badge>
          )}
        </div>
        <CardTitle className="text-xl">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration_hours}h</span>
            </div>
            <Badge variant="outline" className={getLevelColor(course.level)}>
              {course.level}
            </Badge>
          </div>
          
          {course.related_tool && (
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                Pairs with: <span className="text-foreground font-medium">{course.related_tool.replace('_', ' ')}</span>
              </span>
            </div>
          )}
        </div>

        <Link to={`/training/${course.id}`} className="w-full">
          <Button className="w-full group">
            View Course
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
