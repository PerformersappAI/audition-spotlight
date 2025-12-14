import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

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

    console.log(`Analyzing script for ${shotCount} shots using Gemini...`);

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a professional film director and cinematographer breaking down a script into specific storyboard shots. Your descriptions must be PRECISE and LITERAL - describe exactly what the camera sees, nothing more. 

CRITICAL RULES FOR SHOT DESCRIPTIONS:
- Be LITERAL: Describe only what is physically in the frame
- Be SPECIFIC: Include exact positions, distances, and compositions
- NO interpretation or metaphor - just visual facts
- NO extra elements that aren't in the script
- Each shot should have ONE clear focal point
- Think like a director planning actual camera setups

IMPORTANT: You must respond with ONLY valid JSON, no markdown formatting or code blocks.`;

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

Return ONLY valid JSON (no markdown, no code blocks):
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

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('Credits depleted. Please add credits to continue.');
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response received');

    const content = data.choices?.[0]?.message?.content;
    
    if (!content || content.trim() === '') {
      console.error('Empty content from Gemini. Full response:', JSON.stringify(data, null, 2));
      throw new Error('AI returned empty content');
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonContent = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.slice(7);
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.slice(3);
    }
    if (jsonContent.endsWith('```')) {
      jsonContent = jsonContent.slice(0, -3);
    }
    jsonContent = jsonContent.trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('JSON parse error. Content was:', content.substring(0, 500));
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }

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

    console.log(`Successfully analyzed ${analyzedShots.length} shots with Gemini`);

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
