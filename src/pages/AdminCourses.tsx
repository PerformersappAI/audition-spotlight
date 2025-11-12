import { useState } from 'react';
import { GraduationCap, Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration_hours: number;
  level: string;
  thumbnail_url: string;
  video_url: string;
  materials_url: string;
  related_tool: string;
  price_credits: number;
  is_featured: boolean;
  order_index: number;
}

const CATEGORIES = ['Pre-Production', 'Production', 'Post-Production', 'Distribution', 'Funding'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const RELATED_TOOLS = ['Script Analysis', 'Storyboarding', 'Scene Analysis', 'Video Evaluation', 'None'];

export default function AdminCourses() {
  const { user } = useAuth();
  const { data: courses, refetch } = useAcademyCourses({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    category: 'Pre-Production',
    instructor: 'Feifer Film Academy',
    duration_hours: 1,
    level: 'Beginner',
    thumbnail_url: '',
    video_url: '',
    materials_url: '',
    related_tool: 'None',
    price_credits: 0,
    is_featured: false,
    order_index: 0,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Pre-Production',
      instructor: 'Feifer Film Academy',
      duration_hours: 1,
      level: 'Beginner',
      thumbnail_url: '',
      video_url: '',
      materials_url: '',
      related_tool: 'None',
      price_credits: 0,
      is_featured: false,
      order_index: 0,
    });
    setEditingCourse(null);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      category: course.category || 'Pre-Production',
      instructor: course.instructor || 'Feifer Film Academy',
      duration_hours: course.duration_hours || 1,
      level: course.level || 'Beginner',
      thumbnail_url: course.thumbnail_url || '',
      video_url: course.video_url || '',
      materials_url: course.materials_url || '',
      related_tool: course.related_tool || 'None',
      price_credits: course.price_credits || 0,
      is_featured: course.is_featured || false,
      order_index: course.order_index || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCourse) {
        // Update existing course
        const { error } = await supabase
          .from('academy_courses')
          .update(formData)
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast.success('Course updated successfully');
      } else {
        // Create new course
        const { error } = await supabase
          .from('academy_courses')
          .insert([formData]);

        if (error) throw error;
        toast.success('Course created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('Error saving course:', error);
      toast.error(error.message || 'Failed to save course');
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('academy_courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      toast.success('Course deleted successfully');
      refetch();
    } catch (error: any) {
      console.error('Error deleting course:', error);
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const toggleFeatured = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('academy_courses')
        .update({ is_featured: !currentStatus })
        .eq('id', courseId);

      if (error) throw error;
      toast.success(currentStatus ? 'Course unfeatured' : 'Course featured');
      refetch();
    } catch (error: any) {
      console.error('Error toggling featured:', error);
      toast.error(error.message || 'Failed to update course');
    }
  };

  const updateOrder = async (courseId: string, direction: 'up' | 'down') => {
    const course = courses?.find(c => c.id === courseId);
    if (!course) return;

    const newOrder = direction === 'up' ? course.order_index - 1 : course.order_index + 1;

    try {
      const { error } = await supabase
        .from('academy_courses')
        .update({ order_index: newOrder })
        .eq('id', courseId);

      if (error) throw error;
      refetch();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <GraduationCap className="h-8 w-8" />
              Course Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage training academy courses and content
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level *</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({ ...formData, duration_hours: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                  <Input
                    id="thumbnail_url"
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials_url">Course Materials URL</Label>
                  <Input
                    id="materials_url"
                    type="url"
                    value={formData.materials_url}
                    onChange={(e) => setFormData({ ...formData, materials_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="related_tool">Related Tool</Label>
                  <Select value={formData.related_tool} onValueChange={(value) => setFormData({ ...formData, related_tool: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATED_TOOLS.map((tool) => (
                        <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_credits">Price (Credits)</Label>
                    <Input
                      id="price_credits"
                      type="number"
                      min="0"
                      value={formData.price_credits}
                      onChange={(e) => setFormData({ ...formData, price_credits: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order_index">Display Order</Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured Course</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{courses?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Courses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{courses?.filter(c => c.is_featured).length || 0}</div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{courses?.filter(c => c.price_credits === 0).length || 0}</div>
              <div className="text-sm text-muted-foreground">Free Courses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{CATEGORIES.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    {course.thumbnail_url && (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {course.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateOrder(course.id, 'up')}
                            disabled={course.order_index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateOrder(course.id, 'down')}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFeatured(course.id, course.is_featured || false)}
                          >
                            {course.is_featured ? (
                              <Eye className="h-4 w-4 text-primary" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(course)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(course.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant="outline">{course.level}</Badge>
                        <Badge variant="outline">{course.duration_hours}h</Badge>
                        {course.price_credits === 0 ? (
                          <Badge className="bg-green-500/10 text-green-600">Free</Badge>
                        ) : (
                          <Badge variant="outline">{course.price_credits} credits</Badge>
                        )}
                        {course.is_featured && (
                          <Badge className="bg-primary/10 text-primary">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No courses yet. Create your first course to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
