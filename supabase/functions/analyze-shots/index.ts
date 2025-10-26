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

    console.log(`Analyzing script for ${shotCount} shots...`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a professional storyboard artist and cinematographer with decades of experience in film pre-production. Your job is to analyze scripts and break them down into specific, actionable storyboard frames that filmmakers can use as visual references.`;

    const userPrompt = `Analyze this script and break it down into exactly ${shotCount} specific storyboard frames. Each frame should capture a key visual moment that advances the story or reveals character.

For each frame, provide detailed information that would allow an artist to draw it or a filmmaker to plan the shot:

1. **visualDescription**: A vivid, specific description of what's literally in the frame. Include character positions, expressions, actions, setting details, and props. Be concrete and visual (e.g., "Tommy stands in narrow apartment hallway, hand raised mid-knock on door 3B, nervous expression, looking over shoulder toward dimly lit stairwell")

2. **characters**: Array of character names visible in this frame

3. **location**: Specific location with relevant details (e.g., "Third-floor apartment hallway, worn carpet, flickering fluorescent overhead, peeling wallpaper, door marked '3B'")

4. **action**: The specific action or moment being captured (e.g., "Hesitant knock while checking surroundings")

5. **emotionalTone**: The feeling this frame should convey to the audience (e.g., "Tension, uncertainty, mild paranoia")

6. **shotType**: Choose from: Extreme Wide Shot, Wide Shot, Medium Wide Shot, Medium Shot, Medium Close-Up, Close-Up, Extreme Close-Up, Over-the-Shoulder, POV Shot, Insert Shot, Two Shot

7. **cameraAngle**: Choose from: Eye Level, High Angle, Low Angle, Bird's Eye View, Dutch Angle, Worm's Eye View - and briefly explain why this angle serves the story

8. **lighting**: Specific lighting description that creates mood (e.g., "Overhead fluorescent creating harsh shadows, dim natural light from stairwell window")

9. **keyProps**: Important props or set dressing visible in frame (comma-separated)

10. **dialogue**: Any dialogue happening in this moment (or "None" if silent)

Script:
${scriptText}

Genre: ${genre}
Tone: ${tone}

Return ONLY a valid JSON object with this structure:
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

Make each frame description vivid and specific enough that a filmmaker could visualize the exact shot. Focus on visual storytelling - what the audience SEES, not what they're told.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 4000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

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
      description: shot.action, // Use action as the brief description
      visualElements: [shot.lighting, shot.emotionalTone], // Combine lighting and tone
      sceneAction: shot.visualDescription // Use full visual description
    }));

    console.log(`Successfully analyzed ${analyzedShots.length} shots`);

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
