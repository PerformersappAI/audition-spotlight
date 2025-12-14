import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzedShot {
  shotNumber: number;
  visualDescription: string;
  characters: string[];
  location: string;
  action: string;
  emotionalTone: string;
  shotType: string;
  cameraAngle: string;
  lighting: string;
  keyProps: string;
  dialogue: string;
  description: string;
  visualElements: string[];
  sceneAction: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scriptText, genre, tone, shotCount } = await req.json();

    console.log(`Analyzing script for ${shotCount} shots using GPT-5.2...`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a professional film director and cinematographer breaking down a script into specific storyboard shots. Your descriptions must be PRECISE and LITERAL - describe exactly what the camera sees, nothing more. 

CRITICAL RULES FOR SHOT DESCRIPTIONS:
- Be LITERAL: Describe only what is physically in the frame
- Be SPECIFIC: Include exact positions, distances, and compositions
- NO interpretation or metaphor - just visual facts
- NO extra elements that aren't in the script
- Each shot should have ONE clear focal point
- Think like a director planning actual camera setups`;

    const userPrompt = `Break this script into exactly ${shotCount} storyboard shots. Each shot must be a specific camera setup that could be filmed.

FOR EACH SHOT, PROVIDE:

1. **visualDescription**: LITERAL description of what the camera captures. Be specific about:
   - Subject position in frame (left/center/right, foreground/background)
   - Distance from camera (in feet if helpful)
   - Exact action being captured
   - Background elements visible
   Example: "Woman stands center frame, 4 feet from camera, hand on doorknob, looking back over left shoulder. Dimly lit hallway behind her."

2. **characters**: Array of character names IN THIS FRAME ONLY

3. **location**: Specific set/location with only relevant visible details

4. **action**: The single action this frame captures (keep it simple)

5. **emotionalTone**: One or two words for the mood

6. **shotType**: EXACT shot size - choose from:
   - Extreme Close-Up (eyes only, or small object detail)
   - Close-Up (face fills frame, shoulders barely visible)
   - Medium Close-Up (chest up, some background)
   - Medium Shot (waist up, balanced with environment)
   - Medium Wide Shot (knees up, more environment)
   - Wide Shot (full body with environment)
   - Extreme Wide Shot (vast environment, small figures)

7. **cameraAngle**: Camera position - choose from:
   - Eye Level (neutral, standard)
   - High Angle (camera above, looking down)
   - Low Angle (camera below, looking up)
   - Dutch Angle (tilted for unease)
   - Over-the-Shoulder (from behind one character toward another)
   - POV (what the character sees)

8. **lighting**: Simple lighting description (e.g., "harsh overhead", "soft window light from left", "backlit silhouette")

9. **keyProps**: Only props VISIBLE in this specific frame

10. **dialogue**: Exact dialogue during this shot, or "None"

SCRIPT:
${scriptText}

GENRE: ${genre}
TONE: ${tone}

Return ONLY valid JSON:
{
  "shots": [
    {
      "shotNumber": 1,
      "visualDescription": "...",
      "characters": ["..."],
      "location": "...",
      "action": "...",
      "emotionalTone": "...",
      "shotType": "...",
      "cameraAngle": "...",
      "lighting": "...",
      "keyProps": "...",
      "dialogue": "..."
    }
  ]
}

REMEMBER: Each description should be precise enough that an AI image generator can create EXACTLY that shot with no ambiguity or added elements.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 6000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('GPT-5.2 response received');

    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    // Transform the AI response into the format expected by the frontend
    const analyzedShots: AnalyzedShot[] = parsed.shots.map((shot: any) => ({
      shotNumber: shot.shotNumber,
      visualDescription: shot.visualDescription,
      characters: shot.characters || [],
      location: shot.location,
      action: shot.action,
      emotionalTone: shot.emotionalTone,
      shotType: shot.shotType,
      cameraAngle: shot.cameraAngle,
      lighting: shot.lighting,
      keyProps: shot.keyProps,
      dialogue: shot.dialogue,
      // Also include legacy fields for backward compatibility
      description: shot.action,
      visualElements: [shot.lighting, shot.emotionalTone],
      sceneAction: shot.visualDescription
    }));

    console.log(`Successfully analyzed ${analyzedShots.length} shots with GPT-5.2`);

    return new Response(
      JSON.stringify({ shots: analyzedShots }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-shots function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
