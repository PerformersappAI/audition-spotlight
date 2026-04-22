import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

interface Scene {
  sceneNumber: number;
  heading: string;
  summary: string;
  location: string;
  intExt: string;
  dayNight: string;
  characters: string[];
  estimatedShots: number;
  text: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { scriptText } = await req.json();
    if (!scriptText || typeof scriptText !== 'string' || scriptText.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: 'scriptText is required (min 20 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`extract-scenes: user=${user.id}, script length=${scriptText.length}`);

    const systemPrompt = `You are a script supervisor. Split a screenplay into discrete scenes for storyboarding triage. Be precise. Return ONLY valid JSON, no markdown, no code fences.`;

    const userPrompt = `Split this screenplay into scenes. A scene = one continuous location/time block, typically starting with INT./EXT. or a clear location change.

For each scene return:
- sceneNumber (1-indexed)
- heading: short slugline (e.g., "INT. KITCHEN - NIGHT")
- summary: 1-2 sentence description of what happens
- location: physical place
- intExt: "INT", "EXT", or "MIXED"
- dayNight: "DAY", "NIGHT", "DAWN", "DUSK", or "UNKNOWN"
- characters: array of character names appearing
- estimatedShots: integer 2-12, your estimate of how many storyboard frames this scene needs
- text: the verbatim portion of the script that belongs to this scene

If the script has no formal scene headings, infer logical scene breaks from location/time/action shifts.

SCRIPT:
${scriptText}

Return ONLY this JSON shape:
{
  "scenes": [
    {
      "sceneNumber": 1,
      "heading": "...",
      "summary": "...",
      "location": "...",
      "intExt": "INT",
      "dayNight": "DAY",
      "characters": ["..."],
      "estimatedShots": 4,
      "text": "..."
    }
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
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
      console.error('Lovable AI error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: `AI gateway error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    let content: string = data.choices?.[0]?.message?.content || '';
    content = content.trim();
    if (content.startsWith('```json')) content = content.slice(7);
    else if (content.startsWith('```')) content = content.slice(3);
    if (content.endsWith('```')) content = content.slice(0, -3);
    content = content.trim();

    let parsed: { scenes: Scene[] };
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error('JSON parse error. Content head:', content.substring(0, 400));
      return new Response(
        JSON.stringify({ error: 'AI returned invalid JSON' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const scenes = (parsed.scenes || []).map((s: any, i: number) => ({
      sceneNumber: s.sceneNumber ?? i + 1,
      heading: s.heading || `Scene ${i + 1}`,
      summary: s.summary || '',
      location: s.location || '',
      intExt: s.intExt || 'UNKNOWN',
      dayNight: s.dayNight || 'UNKNOWN',
      characters: Array.isArray(s.characters) ? s.characters : [],
      estimatedShots: typeof s.estimatedShots === 'number'
        ? Math.max(2, Math.min(12, Math.round(s.estimatedShots)))
        : 4,
      text: s.text || '',
    }));

    console.log(`extract-scenes: returned ${scenes.length} scenes`);

    return new Response(
      JSON.stringify({ scenes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('extract-scenes error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
