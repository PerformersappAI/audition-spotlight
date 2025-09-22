-- Add project_name field to projects table
ALTER TABLE public.projects 
ADD COLUMN project_name TEXT NOT NULL DEFAULT '';

-- Create index for efficient querying by project name
CREATE INDEX idx_projects_project_name ON public.projects(project_name);

-- Create index for user_id + project_name combination for better performance
CREATE INDEX idx_projects_user_project_name ON public.projects(user_id, project_name);