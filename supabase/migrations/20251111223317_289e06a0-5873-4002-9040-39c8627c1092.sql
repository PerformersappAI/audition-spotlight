-- Add character definitions and style reference to storyboard projects
ALTER TABLE storyboard_projects
ADD COLUMN IF NOT EXISTS character_definitions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS style_reference_prompt TEXT DEFAULT '';

-- Add comment explaining the schema
COMMENT ON COLUMN storyboard_projects.character_definitions IS 'Array of character objects with name, description, and traits for consistent character representation';
COMMENT ON COLUMN storyboard_projects.style_reference_prompt IS 'Detailed artistic style description applied to all panels for visual consistency';