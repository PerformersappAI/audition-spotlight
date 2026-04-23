import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

export interface CharacterDefinition {
  name: string;
  description: string;
  traits: string;
  imageUrl?: string;
}

export interface CastMember {
  name: string;
  description: string;
  appears_in_scenes: number[];
}

export interface Shot {
  shotNumber: number;
  description: string;
  cameraAngle: string;
  characters: string[];
  visualElements: string;
  duration: string;
  scriptSegment: string;
  dialogueLines: string[];
  sceneAction: string;
  dialogue?: string;
  characterNotes?: Record<string, string>;
}

export interface StoryboardFrame {
  shotNumber: number;
  description: string;
  cameraAngle: string;
  characters: string[];
  visualElements: string;
  scriptSegment: string;
  dialogueLines: string[];
  sceneAction: string;
  imageData?: string;
  generatedAt?: string;
}

export interface StoryboardProject {
  id: string;
  user_id: string;
  script_text: string;
  genre: string | null;
  tone: string | null;
  character_count: number;
  shots: Shot[] | null;
  storyboard_frames: StoryboardFrame[] | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
  character_definitions?: CharacterDefinition[];
  style_reference_prompt?: string;
  // New named-project metadata
  project_title?: string | null;
  thumbnail_url?: string | null;
  art_style?: string | null;
  aspect_ratio?: string | null;
  scene_count?: number | null;
  frame_count?: number | null;
  cast_data?: CastMember[];
}

type DbStoryboardProject = Database['public']['Tables']['storyboard_projects']['Row'];

const mapRow = (row: any): StoryboardProject => ({
  id: row.id,
  user_id: row.user_id,
  script_text: row.script_text,
  genre: row.genre,
  tone: row.tone,
  character_count: row.character_count,
  shots: Array.isArray(row.shots) ? (row.shots as unknown as Shot[]) : null,
  storyboard_frames: Array.isArray(row.storyboard_frames)
    ? (row.storyboard_frames as unknown as StoryboardFrame[])
    : null,
  is_complete: row.is_complete,
  created_at: row.created_at,
  updated_at: row.updated_at,
  character_definitions: Array.isArray(row.character_definitions)
    ? (row.character_definitions as unknown as CharacterDefinition[])
    : [],
  style_reference_prompt: row.style_reference_prompt || '',
  project_title: row.project_title ?? null,
  thumbnail_url: row.thumbnail_url ?? null,
  art_style: row.art_style ?? null,
  aspect_ratio: row.aspect_ratio ?? null,
  scene_count: row.scene_count ?? 0,
  frame_count: row.frame_count ?? 0,
  cast_data: Array.isArray(row.cast_data) ? (row.cast_data as unknown as CastMember[]) : [],
});

export const useStoryboardProjects = () => {
  const { userProfile } = useAuth();
  const [projects, setProjects] = useState<StoryboardProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!userProfile?.user_id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('storyboard_projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load storyboard projects');
        return;
      }

      setProjects((data || []).map(mapRow));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load storyboard projects');
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async (
    scriptText: string,
    genre: string,
    tone: string,
    shots: Shot[],
    characterDefinitions?: CharacterDefinition[],
    styleReferencePrompt?: string,
    extras?: {
      project_title?: string;
      art_style?: string;
      aspect_ratio?: string;
      scene_count?: number;
      cast_data?: CastMember[];
    }
  ): Promise<StoryboardProject | null> => {
    if (!userProfile?.user_id) {
      toast.error('Please log in to save projects');
      return null;
    }

    try {
      const characterCount = (scriptText.match(/^[A-Z][A-Z\s]+$/gm) || []).length;

      const insertPayload: any = {
        user_id: userProfile.user_id,
        script_text: scriptText,
        genre,
        tone,
        character_count: characterCount,
        shots: shots as any,
        storyboard_frames: null,
        is_complete: false,
        character_definitions: (characterDefinitions as any) || [],
        style_reference_prompt: styleReferencePrompt || '',
      };
      if (extras?.project_title) insertPayload.project_title = extras.project_title;
      if (extras?.art_style) insertPayload.art_style = extras.art_style;
      if (extras?.aspect_ratio) insertPayload.aspect_ratio = extras.aspect_ratio;
      if (typeof extras?.scene_count === 'number') insertPayload.scene_count = extras.scene_count;
      if (extras?.cast_data) insertPayload.cast_data = extras.cast_data as any;

      const { data, error } = await supabase
        .from('storyboard_projects')
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        console.error('Error saving project:', error);
        toast.error('Failed to save project');
        return null;
      }

      if (data) {
        const transformed = mapRow(data);
        setProjects((prev) => [transformed, ...prev]);
        toast.success('Project saved successfully');
        return transformed;
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }

    return null;
  };

  const updateProject = async (
    id: string,
    updates: Partial<StoryboardProject>
  ): Promise<StoryboardProject | null> => {
    try {
      const dbUpdates: any = {};
      if (updates.shots) dbUpdates.shots = updates.shots as any;
      if (updates.storyboard_frames) dbUpdates.storyboard_frames = updates.storyboard_frames as any;
      if (updates.is_complete !== undefined) dbUpdates.is_complete = updates.is_complete;
      if (updates.genre) dbUpdates.genre = updates.genre;
      if (updates.tone) dbUpdates.tone = updates.tone;
      if (updates.character_definitions) dbUpdates.character_definitions = updates.character_definitions as any;
      if (updates.style_reference_prompt !== undefined)
        dbUpdates.style_reference_prompt = updates.style_reference_prompt;
      if (updates.project_title !== undefined) dbUpdates.project_title = updates.project_title;
      if (updates.thumbnail_url !== undefined) dbUpdates.thumbnail_url = updates.thumbnail_url;
      if (updates.art_style !== undefined) dbUpdates.art_style = updates.art_style;
      if (updates.aspect_ratio !== undefined) dbUpdates.aspect_ratio = updates.aspect_ratio;
      if (updates.scene_count !== undefined) dbUpdates.scene_count = updates.scene_count;
      if (updates.frame_count !== undefined) dbUpdates.frame_count = updates.frame_count;
      if (updates.cast_data !== undefined) dbUpdates.cast_data = updates.cast_data as any;

      const { data, error } = await supabase
        .from('storyboard_projects')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        toast.error('Failed to update project');
        return null;
      }

      if (data) {
        const transformed = mapRow(data);
        setProjects((prev) => prev.map((p) => (p.id === id ? transformed : p)));
        return transformed;
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }

    return null;
  };

  const renameProject = async (id: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return null;
    return updateProject(id, { project_title: trimmed });
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from('storyboard_projects').delete().eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
        return;
      }

      setProjects((prev) => prev.filter((project) => project.id !== id));
      toast.success('Project deleted');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userProfile?.user_id]);

  return {
    projects,
    loading,
    saveProject,
    updateProject,
    renameProject,
    deleteProject,
    refetch: fetchProjects,
  };
};
