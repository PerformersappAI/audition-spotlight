export interface AcademyCourse {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  instructor: string | null;
  duration_hours: number | null;
  level: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  materials_url: string | null;
  related_tool: string | null;
  price_credits: number | null;
  is_featured: boolean | null;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  last_accessed_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCertification {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string | null;
  issued_at: string;
  certificate_url: string | null;
  skills_earned: string[] | null;
  created_at: string;
}

export interface CourseFilters {
  category?: string | null;
  level?: string | null;
  relatedTool?: string | null;
  search?: string;
}
