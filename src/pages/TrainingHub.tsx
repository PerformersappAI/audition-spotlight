import { useState } from 'react';
import { GraduationCap, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CourseCard } from '@/components/training/CourseCard';
import { useAcademyCourses, useFeaturedCourses } from '@/hooks/useAcademyCourses';
import { Skeleton } from '@/components/ui/skeleton';
import type { CourseFilters } from '@/types/training';

export default function TrainingHub() {
  const [filters, setFilters] = useState<CourseFilters>({});
  const { data: allCourses, isLoading: allLoading } = useAcademyCourses(filters);
  const { data: featuredCourses, isLoading: featuredLoading } = useFeaturedCourses();

  const categories = [
    { value: null, label: 'All Categories' },
    { value: 'pre-production', label: 'Pre-Production' },
    { value: 'production', label: 'Production' },
    { value: 'post-production', label: 'Post-Production' },
    { value: 'distribution', label: 'Distribution' },
    { value: 'funding', label: 'Funding' },
  ];

  const levels = [
    { value: null, label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <Badge variant="outline" className="text-sm">Powered by Feifer Film Academy</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Training Academy
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Master the art of independent filmmaking with professional courses designed for real-world production
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>18 Expert-Led Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>Earn Certifications</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>Integrated with Your Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Courses */}
        {featuredCourses && featuredCourses.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLoading ? (
                <>
                  <Skeleton className="h-80" />
                  <Skeleton className="h-80" />
                  <Skeleton className="h-80" />
                </>
              ) : (
                featuredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              )}
            </div>
          </section>
        )}

        {/* Filters and Search */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <CardTitle>Find Your Course</CardTitle>
              </div>
              <CardDescription>Filter by category, level, or search for specific topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    className="pl-9"
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.value || 'all'}
                      variant={filters.category === cat.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, category: cat.value })}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>

                {/* Level Filter */}
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <Button
                      key={level.value || 'all'}
                      variant={filters.level === level.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, level: level.value })}
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* All Courses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              {filters.category || filters.level || filters.search ? 'Filtered Courses' : 'All Courses'}
            </h2>
            <span className="text-muted-foreground">
              {allCourses?.length || 0} courses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allLoading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80" />
                ))}
              </>
            ) : allCourses && allCourses.length > 0 ? (
              allCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No courses found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setFilters({})}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
