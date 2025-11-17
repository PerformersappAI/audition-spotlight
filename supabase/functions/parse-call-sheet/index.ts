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

    const systemPrompt = `You are an expert at extracting structured data from film production call sheets. 
Extract all relevant information and return it as valid JSON with the following structure:

{
  "production_company": "string",
  "project_name": "string",
  "shoot_date": "YYYY-MM-DD",
  "day_number": "string (e.g., 'Day 2 of 17')",
  "script_color": "string",
  "schedule_color": "string",
  "general_crew_call": "HH:MM",
  "shooting_call": "HH:MM",
  "lunch_time": "HH:MM",
  "courtesy_breakfast_time": "HH:MM",
  "wrap_time": "HH:MM",
  "executive_producers": ["name1", "name2"],
  "producers": ["name1", "name2"],
  "director": "string",
  "associate_director": "string",
  "line_producer": "string",
  "upm": "string",
  "production_office_address": "string",
  "shooting_location": "string",
  "location_address": "string",
  "crew_parking": "string",
  "basecamp": "string",
  "nearest_hospital": "string",
  "hospital_address": "string",
  "weather_description": "string",
  "high_temp": "string",
  "low_temp": "string",
  "sunrise_time": "string",
  "sunset_time": "string",
  "dawn_time": "string",
  "twilight_time": "string",
  "scenes": [
    {
      "scene_number": "string",
      "pages": "string",
      "set_description": "string",
      "day_night": "string (D/N indicator)",
      "cast_ids": ["1", "2", "3"],
      "notes": "string",
      "location": "string"
    }
  ],
  "cast": [
    {
      "cast_id": "string",
      "character_name": "string",
      "actor_name": "string",
      "status": "string (W/SW/etc)",
      "pickup_time": "HH:MM",
      "call_time": "HH:MM",
      "set_ready_time": "HH:MM",
      "special_instructions": "string"
    }
  ],
  "crew": [
    {
      "department": "string",
      "title": "string",
      "name": "string",
      "call_time": "HH:MM"
    }
  ],
  "background": [
    {
      "quantity": number,
      "description": "string",
      "call_time": "HH:MM",
      "notes": "string"
    }
  ]
}

Extract ALL information available. Use null for missing fields. Be thorough and accurate.`;

    // Use the extracted text directly
    const userContent = `Extract all information from this call sheet:\n\n${text}`;

    console.log('Calling Lovable AI for call sheet parsing...');
    
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
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received');

    let parsedContent = data.choices[0].message.content;
    
    // Remove markdown code blocks if present
    parsedContent = parsedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedData = JSON.parse(parsedContent);

    return new Response(
      JSON.stringify(parsedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-call-sheet function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});