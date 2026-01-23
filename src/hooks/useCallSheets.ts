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
  // New fields for industry-standard format
  lx_precall_time?: string;
  unit_call_time?: string;
  current_schedule?: string;
  current_script?: string;
  unit_base?: string;
  unit_base_address?: string;
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
  // New fields
  start_time?: string;
  int_ext?: string;
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
  // New fields for industry-standard format
  swf?: string;
  makeup_time?: string;
  costume_time?: string;
  travel_time?: string;
  on_set_time?: string;
}

export interface CallSheetCrew {
  id?: string;
  department: string;
  title: string;
  name: string;
  call_time?: string;
  phone?: string;
  off_set?: string;
}

export interface CallSheetBackground {
  id?: string;
  quantity?: number;
  description: string;
  call_time?: string;
  notes?: string;
  makeup_time?: string;
  costume_time?: string;
  travel_time?: string;
  on_set_time?: string;
}

export interface CallSheetBreak {
  id?: string;
  break_type: 'short_break' | 'lunch' | 'dinner';
  after_scene_index: number;
}

export interface CallSheetRequirement {
  id?: string;
  department: string;
  notes?: string;
}

// Sanitize "null" strings to actual null, and validate time fields
const sanitizeValue = (value: any, isTimeField: boolean = false): any => {
  // Convert "null" strings and empty strings to actual null
  if (value === 'null' || value === 'NULL' || value === '' || value === undefined) {
    return null;
  }
  
  // For time fields, validate HH:MM format or set to null
  if (isTimeField && value !== null) {
    const timeValue = String(value);
    // Check if it's a valid time format (HH:MM or HH:MM:SS)
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeValue)) {
      return timeValue;
    }
    return null;
  }
  
  return value;
};

const sanitizeCallSheetData = (data: CallSheetData): Partial<CallSheetData> => {
  const timeFields = ['general_crew_call', 'shooting_call', 'lunch_time', 'courtesy_breakfast_time', 'wrap_time'];
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (key === 'id') continue;
    sanitized[key] = sanitizeValue(value, timeFields.includes(key));
  }
  
  return sanitized;
};

const sanitizeCastData = (cast: CallSheetCast[]): CallSheetCast[] => {
  const timeFields = ['pickup_time', 'call_time', 'set_ready_time'];
  return cast.map(member => {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(member)) {
      if (key === 'id') continue;
      sanitized[key] = sanitizeValue(value, timeFields.includes(key));
    }
    return sanitized as CallSheetCast;
  });
};

const sanitizeCrewData = (crew: CallSheetCrew[]): CallSheetCrew[] => {
  return crew.map(member => {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(member)) {
      if (key === 'id') continue;
      sanitized[key] = sanitizeValue(value, key === 'call_time');
    }
    return sanitized as CallSheetCrew;
  });
};

const sanitizeBackgroundData = (background: CallSheetBackground[]): CallSheetBackground[] => {
  return background.map(item => {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(item)) {
      if (key === 'id') continue;
      sanitized[key] = sanitizeValue(value, key === 'call_time');
    }
    return sanitized as CallSheetBackground;
  });
};

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
    background: CallSheetBackground[],
    breaks: CallSheetBreak[] = [],
    requirements: CallSheetRequirement[] = []
  ) => {
    try {
      console.log('🚀 Starting call sheet save...', { callSheetData, scenesCount: scenes.length, castCount: cast.length });
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 User check:', user ? `Logged in as ${user.id}` : 'Not logged in');
      
      if (!user) throw new Error("Not authenticated");

      // Sanitize data before insert
      const sanitizedCallSheet = sanitizeCallSheetData(callSheetData);
      const sanitizedCast = sanitizeCastData(cast);
      const sanitizedCrew = sanitizeCrewData(crew);
      const sanitizedBackground = sanitizeBackgroundData(background);

      // Insert call sheet
      console.log('💾 Inserting call sheet to database...');
      const { data: callSheet, error: callSheetError } = await supabase
        .from('call_sheets')
        .insert({
          production_company: sanitizedCallSheet.production_company || '',
          project_name: sanitizedCallSheet.project_name || '',
          shoot_date: sanitizedCallSheet.shoot_date || new Date().toISOString().split('T')[0],
          day_number: sanitizedCallSheet.day_number,
          total_days: sanitizedCallSheet.total_days,
          script_color: sanitizedCallSheet.script_color,
          schedule_color: sanitizedCallSheet.schedule_color,
          general_crew_call: sanitizedCallSheet.general_crew_call,
          shooting_call: sanitizedCallSheet.shooting_call,
          lunch_time: sanitizedCallSheet.lunch_time,
          courtesy_breakfast_time: sanitizedCallSheet.courtesy_breakfast_time,
          wrap_time: sanitizedCallSheet.wrap_time,
          executive_producers: sanitizedCallSheet.executive_producers,
          producers: sanitizedCallSheet.producers,
          director: sanitizedCallSheet.director,
          associate_director: sanitizedCallSheet.associate_director,
          line_producer: sanitizedCallSheet.line_producer,
          upm: sanitizedCallSheet.upm,
          production_office_address: sanitizedCallSheet.production_office_address,
          shooting_location: sanitizedCallSheet.shooting_location,
          location_address: sanitizedCallSheet.location_address,
          crew_parking: sanitizedCallSheet.crew_parking,
          basecamp: sanitizedCallSheet.basecamp,
          nearest_hospital: sanitizedCallSheet.nearest_hospital,
          hospital_address: sanitizedCallSheet.hospital_address,
          weather_description: sanitizedCallSheet.weather_description,
          high_temp: sanitizedCallSheet.high_temp,
          low_temp: sanitizedCallSheet.low_temp,
          sunrise_time: sanitizedCallSheet.sunrise_time,
          sunset_time: sanitizedCallSheet.sunset_time,
          dawn_time: sanitizedCallSheet.dawn_time,
          twilight_time: sanitizedCallSheet.twilight_time,
          lx_precall_time: sanitizedCallSheet.lx_precall_time,
          unit_call_time: sanitizedCallSheet.unit_call_time,
          current_schedule: sanitizedCallSheet.current_schedule,
          current_script: sanitizedCallSheet.current_script,
          unit_base: sanitizedCallSheet.unit_base,
          unit_base_address: sanitizedCallSheet.unit_base_address,
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
          scene_number: scene.scene_number || '',
          pages: scene.pages,
          set_description: scene.set_description || '',
          day_night: scene.day_night,
          cast_ids: scene.cast_ids,
          notes: scene.notes,
          location: scene.location,
          start_time: scene.start_time,
          int_ext: scene.int_ext,
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
      if (sanitizedCast.length > 0) {
        console.log(`👥 Inserting ${sanitizedCast.length} cast members...`);
        const castWithId = sanitizedCast.map((member, index) => ({
          character_name: member.character_name || '',
          actor_name: member.actor_name || '',
          status: member.status,
          pickup_time: member.pickup_time,
          call_time: member.call_time,
          set_ready_time: member.set_ready_time,
          special_instructions: member.special_instructions,
          cast_id: member.cast_id,
          swf: member.swf,
          makeup_time: member.makeup_time,
          costume_time: member.costume_time,
          travel_time: member.travel_time,
          on_set_time: member.on_set_time,
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
      if (sanitizedCrew.length > 0) {
        console.log(`🎬 Inserting ${sanitizedCrew.length} crew members...`);
        const crewWithId = sanitizedCrew.map((member, index) => ({
          department: member.department || '',
          title: member.title || '',
          name: member.name || '',
          call_time: member.call_time,
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
      if (sanitizedBackground.length > 0) {
        console.log(`🎭 Inserting ${sanitizedBackground.length} background performers...`);
        const backgroundWithId = sanitizedBackground.map(item => ({
          description: item.description || '',
          quantity: item.quantity,
          call_time: item.call_time,
          notes: item.notes,
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

      // Insert breaks
      if (breaks.length > 0) {
        console.log(`⏸️ Inserting ${breaks.length} breaks...`);
        const breaksWithId = breaks.map(item => ({
          break_type: item.break_type,
          after_scene_index: item.after_scene_index,
          call_sheet_id: callSheetId,
        }));

        const { error: breaksError } = await supabase
          .from('call_sheet_breaks')
          .insert(breaksWithId);

        if (breaksError) {
          console.error('❌ Breaks insert error:', breaksError);
          throw breaksError;
        }
        console.log('✅ Breaks inserted');
      }

      // Insert requirements
      if (requirements.length > 0) {
        console.log(`📋 Inserting ${requirements.length} requirements...`);
        const reqWithId = requirements.map((item, index) => ({
          department: item.department,
          notes: item.notes,
          order_index: index,
          call_sheet_id: callSheetId,
        }));

        const { error: reqError } = await supabase
          .from('call_sheet_requirements')
          .insert(reqWithId);

        if (reqError) {
          console.error('❌ Requirements insert error:', reqError);
          throw reqError;
        }
        console.log('✅ Requirements inserted');
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