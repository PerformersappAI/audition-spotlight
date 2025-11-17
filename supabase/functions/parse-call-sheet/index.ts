import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text must be provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log incoming text for debugging
    console.log('📄 Received text length:', text.length);
    console.log('📄 First 500 characters:', text.substring(0, 500));

    const systemPrompt = `You are an expert at extracting structured data from film production call sheets. 
Extract ALL information available from the call sheet. Be thorough and accurate.
For missing fields, use null. Extract complete information for all sections: general info, scenes, cast, crew, and background.`;

    const userContent = `Extract all information from this call sheet:\n\n${text}`;

    console.log('🤖 Calling Lovable AI with structured output...');
    
    // Define the structured output schema using tool calling
    const tools = [{
      type: "function",
      function: {
        name: "extract_call_sheet",
        description: "Extract call sheet data into structured format with all sections",
        parameters: {
          type: "object",
          properties: {
            production_company: { type: "string", description: "Production company name" },
            project_name: { type: "string", description: "Project/film name" },
            shoot_date: { type: "string", description: "Shoot date in YYYY-MM-DD format" },
            day_number: { type: "string", description: "Day number (e.g., 'Day 2 of 17')" },
            script_color: { type: "string", description: "Script color" },
            schedule_color: { type: "string", description: "Schedule color" },
            general_crew_call: { type: "string", description: "General crew call time (HH:MM)" },
            shooting_call: { type: "string", description: "Shooting call time (HH:MM)" },
            lunch_time: { type: "string", description: "Lunch time (HH:MM)" },
            courtesy_breakfast_time: { type: "string", description: "Breakfast time (HH:MM)" },
            wrap_time: { type: "string", description: "Wrap time (HH:MM)" },
            executive_producers: { 
              type: "array", 
              items: { type: "string" },
              description: "List of executive producer names"
            },
            producers: { 
              type: "array", 
              items: { type: "string" },
              description: "List of producer names"
            },
            director: { type: "string", description: "Director name" },
            associate_director: { type: "string", description: "Associate director name" },
            line_producer: { type: "string", description: "Line producer name" },
            upm: { type: "string", description: "Unit production manager name" },
            production_office_address: { type: "string", description: "Production office address" },
            shooting_location: { type: "string", description: "Shooting location name" },
            location_address: { type: "string", description: "Shooting location address" },
            crew_parking: { type: "string", description: "Crew parking location" },
            basecamp: { type: "string", description: "Basecamp location" },
            nearest_hospital: { type: "string", description: "Nearest hospital name" },
            hospital_address: { type: "string", description: "Hospital address" },
            weather_description: { type: "string", description: "Weather description" },
            high_temp: { type: "string", description: "High temperature" },
            low_temp: { type: "string", description: "Low temperature" },
            sunrise_time: { type: "string", description: "Sunrise time" },
            sunset_time: { type: "string", description: "Sunset time" },
            dawn_time: { type: "string", description: "Dawn time" },
            twilight_time: { type: "string", description: "Twilight time" },
            scenes: {
              type: "array",
              description: "List of all scenes in the call sheet",
              items: {
                type: "object",
                properties: {
                  scene_number: { type: "string", description: "Scene number" },
                  pages: { type: "string", description: "Number of pages" },
                  set_description: { type: "string", description: "Set/scene description" },
                  day_night: { type: "string", description: "Day/Night indicator (D/N)" },
                  cast_ids: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Cast member IDs in this scene"
                  },
                  notes: { type: "string", description: "Scene notes" },
                  location: { type: "string", description: "Scene location" }
                },
                required: ["scene_number", "set_description"]
              }
            },
            cast: {
              type: "array",
              description: "List of all cast members",
              items: {
                type: "object",
                properties: {
                  cast_id: { type: "string", description: "Cast member ID number" },
                  character_name: { type: "string", description: "Character name" },
                  actor_name: { type: "string", description: "Actor name" },
                  status: { type: "string", description: "Status (W/SW/etc)" },
                  pickup_time: { type: "string", description: "Pickup time (HH:MM)" },
                  call_time: { type: "string", description: "Call time (HH:MM)" },
                  set_ready_time: { type: "string", description: "Set ready time (HH:MM)" },
                  special_instructions: { type: "string", description: "Special instructions" }
                },
                required: ["character_name", "actor_name"]
              }
            },
            crew: {
              type: "array",
              description: "List of all crew members",
              items: {
                type: "object",
                properties: {
                  department: { type: "string", description: "Department name" },
                  title: { type: "string", description: "Job title" },
                  name: { type: "string", description: "Crew member name" },
                  call_time: { type: "string", description: "Call time (HH:MM)" }
                },
                required: ["title", "name"]
              }
            },
            background: {
              type: "array",
              description: "List of background actors/extras",
              items: {
                type: "object",
                properties: {
                  quantity: { type: "number", description: "Number of background actors" },
                  description: { type: "string", description: "Description of background role" },
                  call_time: { type: "string", description: "Call time (HH:MM)" },
                  notes: { type: "string", description: "Additional notes" }
                },
                required: ["description"]
              }
            }
          },
          required: ["production_company", "project_name", "shoot_date"]
        }
      }
    }];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        tools: tools,
        tool_choice: { type: "function", function: { name: "extract_call_sheet" } },
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('✅ AI response received');
    console.log('📊 Response structure:', JSON.stringify(data, null, 2).substring(0, 1000));

    // Extract the structured data from tool call
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('❌ No tool call in response');
      return new Response(
        JSON.stringify({ error: 'AI did not return structured data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parsedData = JSON.parse(toolCall.function.arguments);
    
    // Log extracted sections for debugging
    console.log('📋 General info fields:', Object.keys(parsedData).filter(k => !['scenes', 'cast', 'crew', 'background'].includes(k)));
    console.log('🎬 Scenes extracted:', parsedData.scenes?.length || 0);
    console.log('👥 Cast extracted:', parsedData.cast?.length || 0);
    console.log('🎥 Crew extracted:', parsedData.crew?.length || 0);
    console.log('🎭 Background extracted:', parsedData.background?.length || 0);

    // Validate and log warnings for missing critical data
    const warnings = [];
    if (!parsedData.production_company) warnings.push('Missing production_company');
    if (!parsedData.project_name) warnings.push('Missing project_name');
    if (!parsedData.shoot_date) warnings.push('Missing shoot_date');
    if (!parsedData.scenes || parsedData.scenes.length === 0) warnings.push('No scenes extracted');
    if (!parsedData.cast || parsedData.cast.length === 0) warnings.push('No cast extracted');
    if (!parsedData.crew || parsedData.crew.length === 0) warnings.push('No crew extracted');

    if (warnings.length > 0) {
      console.warn('⚠️ Extraction warnings:', warnings.join(', '));
    }

    // Return the structured data
    return new Response(
      JSON.stringify(parsedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in parse-call-sheet function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
