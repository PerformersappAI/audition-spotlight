import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

export interface CharacterDefinition {
  name: string;
  description: string;
  traits: string;
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
}

type DbStoryboardProject = Database['public']['Tables']['storyboard_projects']['Row'];

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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load storyboard projects');
        return;
      }

      // Transform database rows to our interface
      const transformedProjects: StoryboardProject[] = (data || []).map((row: DbStoryboardProject) => ({
        id: row.id,
        user_id: row.user_id,
        script_text: row.script_text,
        genre: row.genre,
        tone: row.tone,
        character_count: row.character_count,
        shots: Array.isArray(row.shots) ? row.shots as unknown as Shot[] : null,
        storyboard_frames: Array.isArray(row.storyboard_frames) ? row.storyboard_frames as unknown as StoryboardFrame[] : null,
        is_complete: row.is_complete,
        created_at: row.created_at,
        updated_at: row.updated_at,
        character_definitions: Array.isArray(row.character_definitions) ? row.character_definitions as unknown as CharacterDefinition[] : [],
        style_reference_prompt: row.style_reference_prompt || ''
      }));
      setProjects(transformedProjects);
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
    styleReferencePrompt?: string
  ): Promise<StoryboardProject | null> => {
    if (!userProfile?.user_id) {
      toast.error('Please log in to save projects');
      return null;
    }

    try {
      const characterCount = (scriptText.match(/^[A-Z][A-Z\s]+$/gm) || []).length;
      
      const { data, error } = await supabase
        .from('storyboard_projects')
        .insert({
          user_id: userProfile.user_id,
          script_text: scriptText,
          genre,
          tone,
          character_count: characterCount,
          shots: shots as any,
          storyboard_frames: null,
          is_complete: false,
          character_definitions: characterDefinitions as any || [],
          style_reference_prompt: styleReferencePrompt || ''
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving project:', error);
        toast.error('Failed to save project');
        return null;
      }

      if (data) {
        const transformedProject: StoryboardProject = {
          id: data.id,
          user_id: data.user_id,
          script_text: data.script_text,
          genre: data.genre,
          tone: data.tone,
          character_count: data.character_count,
          shots: Array.isArray(data.shots) ? data.shots as unknown as Shot[] : null,
          storyboard_frames: Array.isArray(data.storyboard_frames) ? data.storyboard_frames as unknown as StoryboardFrame[] : null,
          is_complete: data.is_complete,
          created_at: data.created_at,
          updated_at: data.updated_at,
          character_definitions: Array.isArray(data.character_definitions) ? data.character_definitions as unknown as CharacterDefinition[] : [],
          style_reference_prompt: data.style_reference_prompt || ''
        };
        setProjects(prev => [transformedProject, ...prev]);
        toast.success('Project saved successfully');
        return transformedProject;
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
      // Transform our interface back to database format
      const dbUpdates: any = {};
      if (updates.shots) dbUpdates.shots = updates.shots as any;
      if (updates.storyboard_frames) dbUpdates.storyboard_frames = updates.storyboard_frames as any;
      if (updates.is_complete !== undefined) dbUpdates.is_complete = updates.is_complete;
      if (updates.genre) dbUpdates.genre = updates.genre;
      if (updates.tone) dbUpdates.tone = updates.tone;
      if (updates.character_definitions) dbUpdates.character_definitions = updates.character_definitions as any;
      if (updates.style_reference_prompt !== undefined) dbUpdates.style_reference_prompt = updates.style_reference_prompt;
      
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
        const transformedProject: StoryboardProject = {
          id: data.id,
          user_id: data.user_id,
          script_text: data.script_text,
          genre: data.genre,
          tone: data.tone,
          character_count: data.character_count,
          shots: Array.isArray(data.shots) ? data.shots as unknown as Shot[] : null,
          storyboard_frames: Array.isArray(data.storyboard_frames) ? data.storyboard_frames as unknown as StoryboardFrame[] : null,
          is_complete: data.is_complete,
          created_at: data.created_at,
          updated_at: data.updated_at,
          character_definitions: Array.isArray(data.character_definitions) ? data.character_definitions as unknown as CharacterDefinition[] : [],
          style_reference_prompt: data.style_reference_prompt || ''
        };
        setProjects(prev => prev.map(p => p.id === id ? transformedProject : p));
        return transformedProject;
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }

    return null;
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('storyboard_projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
        return;
      }

      setProjects(prev => prev.filter(project => project.id !== id));
      toast.success('Project deleted successfully');
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
    deleteProject,
    refetch: fetchProjects
  };
};