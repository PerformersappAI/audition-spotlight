-- Add foreign key from course_discussions to profiles
ALTER TABLE course_discussions
ADD CONSTRAINT course_discussions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(user_id)
ON DELETE CASCADE;

-- Add foreign key from discussion_replies to profiles
ALTER TABLE discussion_replies
ADD CONSTRAINT discussion_replies_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(user_id)
ON DELETE CASCADE;

-- Create function to increment discussion view count
CREATE OR REPLACE FUNCTION increment_discussion_views(discussion_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE course_discussions
  SET view_count = view_count + 1
  WHERE id = discussion_id;
END;
$$;