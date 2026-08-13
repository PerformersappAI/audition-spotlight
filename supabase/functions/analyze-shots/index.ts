import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { authenticateUser, serverCalculateCost, ensureBalance, charge, insufficientCreditsBody, unauthorizedBody, logUsage, estimateUsd } from "../_shared/credits.ts";

import { CORE_BRAIN } from "../_shared/prompts/core.ts";
import { STORYBOARD_SHOTS_PROMPT } from "../_shared/prompts/storyboarding.ts";
const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

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

  let user: { id: string } | null = null;
  const started = Date.now();
  try {
    user = await authenticateUser(req);
    if (!user) return unauthorizedBody();

    const cost = serverCalculateCost({ feature: "text" });
    const balance = await ensureBalance(user.id, cost);
    if (!balance.ok) return insufficientCreditsBody(cost, balance.available);

    console.log('Authenticated user:', user.id);
    const { scriptText, genre, tone, shotCount } = await req.json();

    console.log(`Analyzing script for ${shotCount} shots using Gemini...`);

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = CORE_BRAIN + "\n\n" + STORYBOARD_SHOTS_PROMPT;

    const userPrompt = `Break this script into exactly ${shotCount} storyboard shots. Each shot must be a specific camera setup that could be filmed.

CRITICAL WRITING RULES:
- Every text field below MUST be a COMPLETE SENTENCE (or more). No fragments like "Drinking water" or "Staring at stain". Use full sentences with subject + verb.
- "visualDescription" must be at least 2 full sentences, rich with concrete visual detail drawn from the script (who, what, where, body language, environment, props, light direction).
- "action" must be a complete sentence describing the single beat captured (e.g. "Sheriff Simmons slowly raises the tin cup to his lips while keeping his eyes locked on Tom across the table.").
- Anchor every detail in the actual script — do NOT invent props, locations, or characters that aren't in the script.

FOR EACH SHOT, PROVIDE:

1. **visualDescription**: 2-4 sentences. LITERAL description of what the camera captures. Be specific about:
   - Subject position in frame (left/center/right, foreground/background)
   - Distance from camera
   - Exact action being captured
   - Background elements visible
   Example: "Sheriff Simmons stands center frame, four feet from the camera, his weathered hand resting on the doorknob as he glances back over his left shoulder. The dimly lit hallway stretches behind him, lined with peeling wallpaper and a single flickering bulb."

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
        model: 'google/gemini-3-flash-preview',
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
      throw new Error(`Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
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
      visualElements: [shot.lighting, shot.emotionalTone].filter(Boolean).join(" · "),
      sceneAction: shot.visualDescription
    }));

    console.log(`Successfully analyzed ${analyzedShots.length} shots with Gemini`);

    const chargeRes = await charge(user!.id, cost, "analyze-shots", {});
    await logUsage({
      userId: user!.id,
      functionName: "analyze-shots",
      provider: "lovable-gateway",
      operation: "text",
      tokensInput: data.usage?.prompt_tokens,
      tokensOutput: data.usage?.completion_tokens,
      estimatedCostUsd: estimateUsd(data.usage?.prompt_tokens, data.usage?.completion_tokens),
      status: "success",
      latencyMs: Date.now() - started,
    });

    return new Response(
      JSON.stringify({ shots: analyzedShots, available_credits: chargeRes.available }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-shots function:', error);
    if (user) {
      await logUsage({
        userId: user.id,
        functionName: "analyze-shots",
        provider: "lovable-gateway",
        operation: "text",
        status: "error",
        latencyMs: Date.now() - started,
      });
    }
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
