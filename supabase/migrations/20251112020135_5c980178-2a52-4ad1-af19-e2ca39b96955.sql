-- Create storage bucket for certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true);

-- RLS policies for certificate storage
CREATE POLICY "Users can view own certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Service can insert certificates"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificates');

-- Function to auto-generate certificate when course is completed
CREATE OR REPLACE FUNCTION auto_generate_certificate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if status changed to 'completed' and progress is 95% or higher
  IF NEW.status = 'completed' AND NEW.progress_percentage >= 95 AND 
     (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Call edge function to generate certificate asynchronously
    PERFORM net.http_post(
      url := 'https://bwrzcaxpiyhnidwjpapt.supabase.co/functions/v1/generate-certificate',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cnpjYXhwaXlobmlkd2pwYXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0MTQsImV4cCI6MjA3NDA1MDQxNH0.eYpQzQciIpNWFoYXHyvk4FcuDXfVGx8UTLu190TevPU'
      ),
      body := jsonb_build_object(
        'userId', NEW.user_id,
        'courseId', NEW.course_id,
        'completedAt', NEW.completed_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for auto certificate generation
CREATE TRIGGER trigger_auto_generate_certificate
AFTER UPDATE ON user_course_progress
FOR EACH ROW
EXECUTE FUNCTION auto_generate_certificate();