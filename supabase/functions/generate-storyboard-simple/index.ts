import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

function getShotFraming(cameraAngle: string): string {
  const angle = (cameraAngle || '').toLowerCase();
  
  if (angle.includes('extreme close') || angle.includes('ecu')) {
    return 'Extreme close-up. Detail fills frame.';
  }
  if (angle.includes('close-up') || angle.includes('close up') || angle.includes('cu')) {
    return 'Close-up. Head and shoulders only.';
  }
  if (angle.includes('medium close') || angle.includes('mcu')) {
    return 'Medium close-up. Chest and up visible.';
  }
  if (angle.includes('medium') || angle.includes('ms')) {
    return 'Medium shot. Waist and up visible.';
  }
  if (angle.includes('wide') || angle.includes('ws') || angle.includes('full') || angle.includes('long')) {
    return 'Wide shot. Full body and environment.';
  }
  if (angle.includes('extreme wide') || angle.includes('ews')) {
    return 'Extreme wide. Vast environment.';
  }
  if (angle.includes('high angle')) {
    return 'High angle. Camera above looking down.';
  }
  if (angle.includes('low angle')) {
    return 'Low angle. Camera below looking up.';
  }
  if (angle.includes('over shoulder') || angle.includes('os')) {
    return 'Over-the-shoulder framing.';
  }
  
  return 'Standard framing.';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Generate-storyboard-simple function called (Gemini 2.5 Flash Image)');

  try {
    const { scene_text, style } = await req.json();

    if (!scene_text || !style) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: scene_text, style' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Analyzing scene...');

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Analyze the scene to break it into shots
    const { data: shotsData, error: shotsError } = await supabase.functions.invoke('analyze-shots', {
      body: { 
        scriptText: scene_text, 
        genre: 'drama',
        tone: 'serious',
        shotCount: 6
      }
    });

    if (shotsError) {
      console.error('Error analyzing shots:', shotsError);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze scene' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const shots = shotsData.shots || [];
    console.log(`Analyzed into ${shots.length} shots`);

    // Step 2: Generate storyboard frames using Gemini 2.5 Flash Image
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const panels = [];

    for (const shot of shots) {
      console.log(`Generating image for shot ${shot.shotNumber}`);

      const framingPrompt = getShotFraming(shot.cameraAngle || 'medium shot');
      const description = shot.visualDescription || shot.description;

      // Build clean prompt for Gemini
      const storyboardPrompt = `Generate a storyboard frame for film production.

ART STYLE: ${style}

CAMERA FRAMING: ${framingPrompt}

SCENE DESCRIPTION: ${description}
${shot.location ? `LOCATION: ${shot.location}` : ''}
${shot.characters?.length > 0 ? `CHARACTERS IN FRAME: ${shot.characters.join(', ')}` : ''}

IMAGE FORMAT: Horizontal/landscape orientation (16:9 aspect ratio)`;

      try {
        const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              { role: 'user', content: storyboardPrompt }
            ],
            modalities: ['image', 'text']
          }),
        });

        if (!imageResponse.ok) {
          console.error(`Image generation failed for shot ${shot.shotNumber}:`, imageResponse.status);
          
          // Check for rate limits
          if (imageResponse.status === 429) {
            console.log('Rate limited, adding delay...');
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
          continue;
        }

        const imageData = await imageResponse.json();
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (imageUrl) {
          // Extract base64 data from data URL if present
          const base64Data = imageUrl.startsWith('data:image') 
            ? imageUrl.split(',')[1] 
            : imageUrl;
            
          panels.push({
            shot_id: shot.shotNumber,
            description: description,
            prompt_used: storyboardPrompt,
            image_b64: base64Data
          });
          console.log(`Successfully generated shot ${shot.shotNumber}`);
        }

      } catch (error) {
        console.error(`Error generating shot ${shot.shotNumber}:`, error);
      }

      // Delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Successfully generated ${panels.length} panels`);

    return new Response(JSON.stringify({ panels }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-storyboard-simple:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
