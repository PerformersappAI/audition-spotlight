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
  // Expanded professional template fields (form + PDF only; not persisted)
  block_focus?: string;
  total_pages?: string;
  gate_access_code?: string;
  truck_parking?: string;
  emergency_numbers?: string;
  on_set_medic?: string;
  map_link?: string;
  precipitation?: string;
  wind?: string;
  second_meal_time?: string;
  sound_hard_out_time?: string;
  safety_briefing?: string;
  walkie_channels?: string;
  general_notes?: string;
  key_contacts?: string;
  next_day_label?: string;
}

export interface CallSheetScheduleRow {
  time?: string;
  activity?: string;
  description?: string;
}

export interface CallSheetAdvanceRow {
  scene_number?: string;
  set_description?: string;
  day_night?: string;
  cast?: string;
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
  wrap_time?: string;
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
  holding_area?: string;
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

/** Parent row payload shared by insert and update. */
const buildParentRow = (s: Partial<CallSheetData>) => ({
  production_company: s.production_company || '',
  project_name: s.project_name || '',
  shoot_date: s.shoot_date || new Date().toISOString().split('T')[0],
  day_number: s.day_number,
  script_color: s.script_color,
  schedule_color: s.schedule_color,
  general_crew_call: s.general_crew_call,
  shooting_call: s.shooting_call,
  lunch_time: s.lunch_time,
  courtesy_breakfast_time: s.courtesy_breakfast_time,
  wrap_time: s.wrap_time,
  executive_producers: s.executive_producers,
  producers: s.producers,
  director: s.director,
  associate_director: s.associate_director,
  line_producer: s.line_producer,
  upm: s.upm,
  production_office_address: s.production_office_address,
  shooting_location: s.shooting_location,
  location_address: s.location_address,
  crew_parking: s.crew_parking,
  basecamp: s.basecamp,
  nearest_hospital: s.nearest_hospital,
  hospital_address: s.hospital_address,
  weather_description: s.weather_description,
  high_temp: s.high_temp,
  low_temp: s.low_temp,
  sunrise_time: s.sunrise_time,
  sunset_time: s.sunset_time,
  dawn_time: s.dawn_time,
  twilight_time: s.twilight_time,
  lx_precall_time: s.lx_precall_time,
  unit_call_time: s.unit_call_time,
  current_schedule: s.current_schedule,
  current_script: s.current_script,
  unit_base: s.unit_base,
  unit_base_address: s.unit_base_address,
});

/** Insert all child rows for a call sheet. */
const insertChildren = async (
  callSheetId: string,
  scenes: CallSheetScene[],
  cast: CallSheetCast[],
  crew: CallSheetCrew[],
  background: CallSheetBackground[],
  breaks: CallSheetBreak[],
  requirements: CallSheetRequirement[]
) => {
  if (scenes.length > 0) {
    const { error } = await supabase.from('call_sheet_scenes').insert(
      scenes.map((scene, index) => ({
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
      }))
    );
    if (error) throw error;
  }

  if (cast.length > 0) {
    const { error } = await supabase.from('call_sheet_cast').insert(
      cast.map((member, index) => ({
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
      }))
    );
    if (error) throw error;
  }

  if (crew.length > 0) {
    const { error } = await supabase.from('call_sheet_crew').insert(
      crew.map((member, index) => ({
        department: member.department || '',
        title: member.title || '',
        name: member.name || '',
        call_time: member.call_time,
        call_sheet_id: callSheetId,
        order_index: index,
      }))
    );
    if (error) throw error;
  }

  if (background.length > 0) {
    const { error } = await supabase.from('call_sheet_background').insert(
      background.map(item => ({
        description: item.description || '',
        quantity: item.quantity,
        call_time: item.call_time,
        notes: item.notes,
        call_sheet_id: callSheetId,
      }))
    );
    if (error) throw error;
  }

  if (breaks.length > 0) {
    const { error } = await supabase.from('call_sheet_breaks').insert(
      breaks.map(item => ({
        break_type: item.break_type,
        after_scene_index: item.after_scene_index,
        call_sheet_id: callSheetId,
      }))
    );
    if (error) throw error;
  }

  if (requirements.length > 0) {
    const { error } = await supabase.from('call_sheet_requirements').insert(
      requirements.map((item, index) => ({
        department: item.department,
        notes: item.notes,
        order_index: index,
        call_sheet_id: callSheetId,
      }))
    );
    if (error) throw error;
  }
};

export interface LoadedCallSheet {
  callSheet: CallSheetData;
  scenes: CallSheetScene[];
  cast: CallSheetCast[];
  crew: CallSheetCrew[];
  background: CallSheetBackground[];
  breaks: CallSheetBreak[];
  requirements: CallSheetRequirement[];
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

  /** Load one saved call sheet (owner only) with all of its child rows. */
  const loadCallSheet = async (id: string): Promise<LoadedCallSheet | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('call_sheets')
      .select(`*,
        call_sheet_scenes(*),
        call_sheet_cast(*),
        call_sheet_crew(*),
        call_sheet_background(*),
        call_sheet_breaks(*),
        call_sheet_requirements(*)`)
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading call sheet:', error);
      return null;
    }
    if (!data) return null;

    const row: any = data;
    const sortBy = <T extends { order_index?: number | null }>(rows: T[]) =>
      [...rows].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

    return {
      callSheet: row as CallSheetData,
      scenes: sortBy(row.call_sheet_scenes || []) as CallSheetScene[],
      cast: sortBy(row.call_sheet_cast || []) as CallSheetCast[],
      crew: sortBy(row.call_sheet_crew || []) as CallSheetCrew[],
      background: (row.call_sheet_background || []) as CallSheetBackground[],
      breaks: (row.call_sheet_breaks || []) as CallSheetBreak[],
      requirements: sortBy(row.call_sheet_requirements || []) as CallSheetRequirement[],
    };
  };

  const saveCallSheet = async (
    callSheetData: CallSheetData,
    scenes: CallSheetScene[],
    cast: CallSheetCast[],
    crew: CallSheetCrew[],
    background: CallSheetBackground[],
    breaks: CallSheetBreak[] = [],
    requirements: CallSheetRequirement[] = [],
    // Carried for PDF export / future persistence; not stored in the current schema.
    _scheduleRows: CallSheetScheduleRow[] = [],
    _advanceRows: CallSheetAdvanceRow[] = []
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const sanitizedCallSheet = sanitizeCallSheetData(callSheetData);
      const sanitizedCast = sanitizeCastData(cast);
      const sanitizedCrew = sanitizeCrewData(crew);
      const sanitizedBackground = sanitizeBackgroundData(background);

      const existingId = callSheetData.id;
      let callSheetId = existingId;

      if (existingId) {
        // Editing a saved sheet: update the parent, then replace the child rows.
        const { error: updateError } = await supabase
          .from('call_sheets')
          .update(buildParentRow(sanitizedCallSheet))
          .eq('id', existingId)
          .eq('user_id', user.id);
        if (updateError) throw updateError;

        await Promise.all([
          supabase.from('call_sheet_scenes').delete().eq('call_sheet_id', existingId),
          supabase.from('call_sheet_cast').delete().eq('call_sheet_id', existingId),
          supabase.from('call_sheet_crew').delete().eq('call_sheet_id', existingId),
          supabase.from('call_sheet_background').delete().eq('call_sheet_id', existingId),
          supabase.from('call_sheet_breaks').delete().eq('call_sheet_id', existingId),
          supabase.from('call_sheet_requirements').delete().eq('call_sheet_id', existingId),
        ]);
      } else {
        const { data: callSheet, error: callSheetError } = await supabase
          .from('call_sheets')
          .insert({ ...buildParentRow(sanitizedCallSheet), user_id: user.id })
          .select()
          .single();
        if (callSheetError) throw callSheetError;
        callSheetId = callSheet.id;
      }

      await insertChildren(
        callSheetId!,
        scenes,
        sanitizedCast,
        sanitizedCrew,
        sanitizedBackground,
        breaks,
        requirements
      );

      toast({
        title: "Success",
        description: existingId ? "Call sheet updated successfully!" : "Call sheet saved successfully!",
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
    loadCallSheet,
    refetch: fetchCallSheets,
  };
};