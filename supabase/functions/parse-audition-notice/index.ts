import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert at extracting audition notice information from text. 
Extract all available fields from the provided text and return them in the exact JSON format specified.
If a field is not found in the text, return null for that field.
For boolean fields, return true or false based on the text content.
For array fields like posting_targets, return an array of strings.`;

    const userPrompt = `Extract audition notice details from this text and return ONLY valid JSON with these exact fields:

IMPORTANT: If the text contains multiple roles/characters, extract ALL of them and include each one as a separate object in the "roles" array. Do not combine multiple roles into one entry.

{
  "project_name": "string or null",
  "project_type": "string or null (e.g., Feature Film, TV Series, Short Film, Commercial, Theater, Web Series, Student Film)",
  "union_status": "string or null (e.g., Union, Non-Union, SAG-AFTRA, Equity)",
  "production_company": "string or null",
  "director_cd": "string or null (director or casting director name)",
  "contact_email": "string or null",
  "contact_phone": "string or null",
  "website": "string or null",
  "logline": "string or null (one sentence description)",
  "synopsis": "string or null (longer description)",
  "shoot_city": "string or null",
  "shoot_country": "string or null",
  "shoot_dates": "string or null",
  "audition_window": "string or null",
  "callback_dates": "string or null",
  "self_tape_deadline": "string or null",
  "location_type": "string or null (Stage, On Location, Studio, Remote)",
  "travel_lodging": "string or null (Yes, No, Provided, Reimbursed)",
  "travel_details": "string or null",
  "compensation_type": "string or null (Paid, Deferred, Copy/Credit/Meals, Paid+Backend)",
  "compensation_rate": "string or null",
  "usage_terms": "string or null",
  "agent_fee_included": boolean,
  "conflicts": "string or null",
  "has_nudity": boolean,
  "has_intimacy": boolean,
  "has_violence": boolean,
  "safety_details": "string or null",
  "has_minors": boolean,
  "slate_link": "string or null",
  "reel_link": "string or null",
  "additional_materials": "string or null",
  "posting_targets": ["array of strings or empty array"],
  "visibility": "string or null (public or private)",
  "roles": [
    {
      "role_name": "string",
      "role_type": "string (Principal, Supporting, Background, Day Player, Featured Extra)",
      "age_range": "string",
      "gender_presentation": "string",
      "open_ethnicity": boolean,
      "skills": "string or null",
      "description": "string",
      "work_dates": "string or null",
      "rate": "string or null",
      "sides_link": "string or null"
    }
  ]
}

Note: Extract ALL roles mentioned in the text. If multiple characters/roles are described, include each one as a separate entry in the roles array.

Text to parse:
${text}`;

    console.log('Calling Lovable AI to parse audition notice...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response (handle markdown code blocks)
    let jsonText = content.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();
    
    const extractedData = JSON.parse(jsonText);
    
    console.log('Successfully extracted audition data');

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-audition-notice:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
