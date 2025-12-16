import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CallSheetData {
  id?: string;
  production_company: string;
  project_name: string;
  shoot_date: string;
  day_number?: string;
  total_days?: string;
  script_color?: string;
  schedule_color?: string;
  general_crew_call?: string;
  shooting_call?: string;
  lunch_time?: string;
  courtesy_breakfast_time?: string;
  wrap_time?: string;
  executive_producers?: string[];
  producers?: string[];
  director?: string;
  associate_director?: string;
  line_producer?: string;
  upm?: string;
  production_office_address?: string;
  shooting_location?: string;
  location_address?: string;
  crew_parking?: string;
  basecamp?: string;
  nearest_hospital?: string;
  hospital_address?: string;
  weather_description?: string;
  high_temp?: string;
  low_temp?: string;
  sunrise_time?: string;
  sunset_time?: string;
  dawn_time?: string;
  twilight_time?: string;
}

export interface CallSheetScene {
  id?: string;
  scene_number: string;
  pages?: string;
  set_description: string;
  day_night?: string;
  cast_ids?: string[];
  notes?: string;
  location?: string;
}

export interface CallSheetCast {
  id?: string;
  cast_id?: string;
  character_name: string;
  actor_name: string;
  status?: string;
  pickup_time?: string;
  call_time?: string;
  set_ready_time?: string;
  special_instructions?: string;
}

export interface CallSheetCrew {
  id?: string;
  department: string;
  title: string;
  name: string;
  call_time?: string;
}

export interface CallSheetBackground {
  id?: string;
  quantity?: number;
  description: string;
  call_time?: string;
  notes?: string;
}

export const useCallSheets = () => {
  const [callSheets, setCallSheets] = useState<CallSheetData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCallSheets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('call_sheets')
        .select('*')
        .eq('user_id', user.id)
        .order('shoot_date', { ascending: false });

      if (error) throw error;
      setCallSheets(data || []);
    } catch (error) {
      console.error('Error fetching call sheets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch call sheets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCallSheet = async (
    callSheetData: CallSheetData,
    scenes: CallSheetScene[],
    cast: CallSheetCast[],
    crew: CallSheetCrew[],
    background: CallSheetBackground[]
  ) => {
    try {
      console.log('🚀 Starting call sheet save...', { callSheetData, scenesCount: scenes.length, castCount: cast.length });
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 User check:', user ? `Logged in as ${user.id}` : 'Not logged in');
      
      if (!user) throw new Error("Not authenticated");

      // Insert call sheet
      console.log('💾 Inserting call sheet to database...');
      const { data: callSheet, error: callSheetError } = await supabase
        .from('call_sheets')
        .insert({
          ...callSheetData,
          user_id: user.id,
        })
        .select()
        .single();

      if (callSheetError) {
        console.error('❌ Call sheet insert error:', callSheetError);
        throw callSheetError;
      }
      
      console.log('✅ Call sheet inserted:', callSheet.id);

      const callSheetId = callSheet.id;

      // Insert scenes
      if (scenes.length > 0) {
        console.log(`📋 Inserting ${scenes.length} scenes...`);
        const scenesWithId = scenes.map((scene, index) => ({
          ...scene,
          call_sheet_id: callSheetId,
          order_index: index,
        }));

        const { error: scenesError } = await supabase
          .from('call_sheet_scenes')
          .insert(scenesWithId);

        if (scenesError) {
          console.error('❌ Scenes insert error:', scenesError);
          throw scenesError;
        }
        console.log('✅ Scenes inserted');
      }

      // Insert cast
      if (cast.length > 0) {
        console.log(`👥 Inserting ${cast.length} cast members...`);
        const castWithId = cast.map((member, index) => ({
          ...member,
          call_sheet_id: callSheetId,
          order_index: index,
        }));

        const { error: castError } = await supabase
          .from('call_sheet_cast')
          .insert(castWithId);

        if (castError) {
          console.error('❌ Cast insert error:', castError);
          throw castError;
        }
        console.log('✅ Cast inserted');
      }

      // Insert crew
      if (crew.length > 0) {
        console.log(`🎬 Inserting ${crew.length} crew members...`);
        const crewWithId = crew.map((member, index) => ({
          ...member,
          call_sheet_id: callSheetId,
          order_index: index,
        }));

        const { error: crewError } = await supabase
          .from('call_sheet_crew')
          .insert(crewWithId);

        if (crewError) {
          console.error('❌ Crew insert error:', crewError);
          throw crewError;
        }
        console.log('✅ Crew inserted');
      }

      // Insert background
      if (background.length > 0) {
        console.log(`🎭 Inserting ${background.length} background performers...`);
        const backgroundWithId = background.map(item => ({
          ...item,
          call_sheet_id: callSheetId,
        }));

        const { error: backgroundError } = await supabase
          .from('call_sheet_background')
          .insert(backgroundWithId);

        if (backgroundError) {
          console.error('❌ Background insert error:', backgroundError);
          throw backgroundError;
        }
        console.log('✅ Background inserted');
      }

      console.log('🎉 Call sheet saved successfully! ID:', callSheetId);

      toast({
        title: "Success",
        description: "Call sheet saved successfully!",
      });

      await fetchCallSheets();
      return callSheetId;
    } catch (error) {
      console.error('❌ Error saving call sheet:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save call sheet. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCallSheets();
  }, []);

  return {
    callSheets,
    loading,
    saveCallSheet,
    refetch: fetchCallSheets,
  };
};