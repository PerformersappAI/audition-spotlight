import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CertificateRequest {
  userId: string;
  courseId: string;
  completedAt: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's JWT to verify auth
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userId, courseId, completedAt }: CertificateRequest = await req.json();

    // Verify the requesting user matches the userId or is generating for themselves
    if (userId !== user.id) {
      console.error('User ID mismatch:', { requestedUserId: userId, authenticatedUserId: user.id });
      return new Response(
        JSON.stringify({ error: 'Forbidden: Cannot generate certificate for another user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating certificate for authenticated user:', userId, 'course:', courseId);

    // Use service role for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw new Error('User profile not found');
    }

    // Fetch course details
    const { data: course, error: courseError } = await supabase
      .from('academy_courses')
      .select('title, category, duration_hours')
      .eq('id', courseId)
      .single();

    if (courseError) {
      console.error('Error fetching course:', courseError);
      throw new Error('Course not found');
    }

    // Generate unique certificate number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const certificateNumber = `FFA-${year}-${randomNum}`;

    // Map category to skills
    const skillsMapping: Record<string, string[]> = {
      'Pre-Production': ['Script Analysis', 'Budgeting', 'Scheduling', 'Planning'],
      'Production': ['Directing', 'Cinematography', 'On-Set Management'],
      'Post-Production': ['Editing', 'Sound Design', 'Color Grading'],
      'Distribution': ['Festival Strategy', 'Marketing', 'Distribution'],
      'Funding': ['Pitching', 'Grant Writing', 'Investor Relations'],
    };

    const skillsEarned = skillsMapping[course.category || ''] || ['Filmmaking'];

    // Create certificate record
    const { data: certification, error: certError } = await supabase
      .from('user_certifications')
      .insert({
        user_id: userId,
        course_id: courseId,
        certificate_number: certificateNumber,
        issued_at: completedAt || new Date().toISOString(),
        skills_earned: skillsEarned,
      })
      .select()
      .single();

    if (certError) {
      console.error('Error creating certification:', certError);
      throw new Error('Failed to create certification record');
    }

    console.log('Certificate created successfully:', certificateNumber);

    return new Response(
      JSON.stringify({
        success: true,
        certificateNumber,
        certificationId: certification.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Certificate generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
