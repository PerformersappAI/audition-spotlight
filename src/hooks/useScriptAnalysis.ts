import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

export interface ScriptAnalysis {
  id: string;
  user_id: string;
  script_text: string;
  genre: string | null;
  tone: string | null;
  selected_directors: string[] | null;
  character_count: number;
  analysis_result: any;
  confidence_score: number | null;
  is_validated: boolean;
  created_at: string;
  updated_at: string;
}

type DbScriptAnalysis = Database['public']['Tables']['script_analyses']['Row'];

export const useScriptAnalysis = () => {
  const { userProfile } = useAuth();
  const [analyses, setAnalyses] = useState<ScriptAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyses = async () => {
    if (!userProfile?.user_id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('script_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analyses:', error);
        toast.error('Failed to load script analyses');
        return;
      }

      // Transform database rows to our interface
      const transformedAnalyses: ScriptAnalysis[] = (data || []).map((row: DbScriptAnalysis) => ({
        id: row.id,
        user_id: row.user_id,
        script_text: row.script_text,
        genre: row.genre,
        tone: row.tone,
        selected_directors: row.selected_directors,
        character_count: row.character_count,
        analysis_result: row.analysis_result,
        confidence_score: row.confidence_score,
        is_validated: row.is_validated,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
      setAnalyses(transformedAnalyses);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      toast.error('Failed to load script analyses');
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysis = async (
    scriptText: string,
    genre: string,
    tone: string,
    selectedDirectors: string[],
    analysisResult: any,
    confidenceScore: number = 0.5
  ): Promise<ScriptAnalysis | null> => {
    if (!userProfile?.user_id) {
      toast.error('Please log in to save analyses');
      return null;
    }

    try {
      const characterCount = (scriptText.match(/^[A-Z][A-Z\s]+$/gm) || []).length;
      
      const { data, error } = await supabase
        .from('script_analyses')
        .insert({
          user_id: userProfile.user_id,
          script_text: scriptText,
          genre,
          tone,
          selected_directors: selectedDirectors,
          character_count: characterCount,
          analysis_result: analysisResult,
          confidence_score: confidenceScore,
          is_validated: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving analysis:', error);
        toast.error('Failed to save analysis');
        return null;
      }

      if (data) {
        const transformedAnalysis: ScriptAnalysis = {
          id: data.id,
          user_id: data.user_id,
          script_text: data.script_text,
          genre: data.genre,
          tone: data.tone,
          selected_directors: data.selected_directors,
          character_count: data.character_count,
          analysis_result: data.analysis_result,
          confidence_score: data.confidence_score,
          is_validated: data.is_validated,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setAnalyses(prev => [transformedAnalysis, ...prev]);
        toast.success('Analysis saved successfully');
        return transformedAnalysis;
      }
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast.error('Failed to save analysis');
    }

    return null;
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('script_analyses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting analysis:', error);
        toast.error('Failed to delete analysis');
        return;
      }

      setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
      toast.success('Analysis deleted successfully');
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast.error('Failed to delete analysis');
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, [userProfile?.user_id]);

  return {
    analyses,
    loading,
    saveAnalysis,
    deleteAnalysis,
    refetch: fetchAnalyses
  };
};