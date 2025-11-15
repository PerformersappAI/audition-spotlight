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
    const { prompt, existingShot } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a cinematography expert helping parse shot descriptions into structured data.
Extract detailed information from natural language descriptions and format them professionally.
If information isn't mentioned in the user's prompt, preserve the existing values from the shot.
NEVER use placeholder text like "[RECOMMEND SOMETHING]" - either keep the existing value or provide a real suggestion.
When making suggestions, be specific and creative based on the context of the shot.
Use proper cinematography terminology.`;

    const userPrompt = `Parse this shot description: "${prompt}"

${existingShot ? `Existing shot data for context:\n${JSON.stringify(existingShot, null, 2)}` : ''}

Extract and update ONLY the information that is clearly mentioned or can be intelligently inferred from the prompt.
For any field not mentioned:
- If there's an existing value, keep it unchanged (return null or undefined for that field)
- If you can make an intelligent suggestion based on context (e.g., inferring a location from the action), provide it
- NEVER use placeholder text like "[RECOMMEND SOMETHING]" - either skip the field or provide a real suggestion

Extract the following information:
- visualDescription: Overall visual description of the shot
- location: Where the shot takes place (be specific - e.g., "abandoned warehouse", "suburban kitchen", "city street at night")
- action: What action is happening
- shotType: Type of shot (e.g., close-up, medium shot, wide shot, extreme close-up, over-the-shoulder)
- cameraAngle: Camera angle/movement (e.g., high angle, low angle, eye level, Dutch angle, tracking shot)
- lighting: Lighting setup and mood (e.g., natural light, low-key, high-key, dramatic side lighting)
- emotionalTone: Emotional feeling of the shot
- keyProps: Important props visible in the shot
- characters: Array of character names in the shot
- duration: Estimated duration (e.g., "3-4 sec", "5 sec")`;

    const tools = [{
      type: "function",
      function: {
        name: "parse_shot_details",
        description: "Parse natural language shot description into structured cinematography fields",
        parameters: {
          type: "object",
          properties: {
            visualDescription: { 
              type: "string", 
              description: "Overall visual description of what's happening in the shot" 
            },
            location: { 
              type: "string", 
              description: "Physical location where the shot takes place" 
            },
            action: { 
              type: "string", 
              description: "The specific action or movement happening in the shot" 
            },
            shotType: { 
              type: "string", 
              description: "Type of shot (close-up, medium shot, wide shot, etc.)" 
            },
            cameraAngle: { 
              type: "string", 
              description: "Camera angle or movement (high angle, low angle, tracking, etc.)" 
            },
            lighting: { 
              type: "string", 
              description: "Lighting setup, mood, and quality" 
            },
            emotionalTone: { 
              type: "string", 
              description: "Emotional atmosphere or feeling of the shot" 
            },
            keyProps: { 
              type: "string", 
              description: "Important props or objects visible in the shot" 
            },
            characters: { 
              type: "array", 
              items: { type: "string" },
              description: "Names of characters appearing in the shot" 
            },
            duration: { 
              type: "string", 
              description: "Estimated duration of the shot (e.g., '3-4 sec', '5 sec')" 
            }
          },
          required: []
        }
      }
    }];

    console.log('Calling Lovable AI with prompt:', prompt);

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
        tools: tools,
        tool_choice: { type: "function", function: { name: "parse_shot_details" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits in Settings → Workspace → Usage.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI parsing failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Lovable AI response:', JSON.stringify(data, null, 2));

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function?.arguments) {
      console.error('No tool call in response:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to parse shot details' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parsedData = JSON.parse(toolCall.function.arguments);
    console.log('Parsed shot data:', parsedData);

    // Merge with existing shot, only updating fields that were provided
    const result = {
      ...existingShot,
      ...Object.fromEntries(
        Object.entries(parsedData).filter(([_, value]) => value !== null && value !== undefined && value !== '')
      )
    };

    return new Response(
      JSON.stringify({ parsedShot: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-parse-shot-prompt:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
