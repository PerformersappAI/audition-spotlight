import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getCameraInstructions(cameraAngle: string): string {
  const angle = cameraAngle.toLowerCase();
  
  if (angle.includes('extreme close') || angle.includes('ecu')) {
    return 'EXTREME CLOSE-UP FRAMING: Face detail only, eyes or mouth fill frame';
  }
  if (angle.includes('close up') || angle.includes('close-up') || angle.includes('cu')) {
    return 'CLOSE-UP FRAMING: Head and shoulders only';
  }
  if (angle.includes('medium close') || angle.includes('mcu')) {
    return 'MEDIUM CLOSE-UP FRAMING: Chest and up visible';
  }
  if (angle.includes('medium') || angle.includes('ms')) {
    return 'MEDIUM SHOT FRAMING: Waist and up visible';
  }
  if (angle.includes('long shot') || angle.includes('full shot') || angle.includes('ls')) {
    return 'LONG SHOT FRAMING: Full body visible';
  }
  if (angle.includes('wide') || angle.includes('ws') || angle.includes('establishing')) {
    return 'WIDE SHOT FRAMING: Full environment emphasis';
  }
  if (angle.includes('extreme wide') || angle.includes('ews')) {
    return 'EXTREME WIDE SHOT FRAMING: Vast environment, epic scope';
  }
  if (angle.includes('high angle') || angle.includes('bird')) {
    return 'HIGH ANGLE FRAMING: Camera above subject looking down';
  }
  if (angle.includes('low angle')) {
    return 'LOW ANGLE FRAMING: Camera below subject looking up';
  }
  if (angle.includes('over shoulder') || angle.includes('os')) {
    return 'OVER-SHOULDER FRAMING: Foreground shoulder visible';
  }
  
  return 'STANDARD FRAMING: Balanced composition';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Generate-storyboard-simple function called');

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
        genre: 'drama', // Default to drama for simple API
        tone: 'serious',
        shotCount: 6 // Default to 6 shots
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

    // Step 2: Generate storyboard frames for each shot
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const panels = [];

    for (const shot of shots) {
      console.log(`Generating image for shot ${shot.shotNumber}`);

      const cameraInstructions = getCameraInstructions(shot.cameraAngle || 'medium shot');
      const description = shot.visualDescription || shot.description;

      // Create the storyboard prompt with art style
      const storyboardPrompt = `${description}, 
storyboard frame, 
film previsualization, 
professional concept art for film production, 
35mm film composition and framing, 
${style},
${cameraInstructions}`;

      try {
        const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: storyboardPrompt,
            n: 1,
            size: '1792x1024',
            quality: 'standard', // Better for sketch style
            style: 'natural',
            response_format: 'b64_json'
          }),
        });

        if (!imageResponse.ok) {
          console.error(`Image generation failed for shot ${shot.shotNumber}`);
          continue;
        }

        const imageData = await imageResponse.json();
        const base64Data = imageData.data[0].b64_json;

        panels.push({
          shot_id: shot.shotNumber,
          description: description,
          prompt_used: storyboardPrompt,
          image_b64: base64Data
        });

        console.log(`Successfully generated shot ${shot.shotNumber}`);

      } catch (error) {
        console.error(`Error generating shot ${shot.shotNumber}:`, error);
        // Continue with other shots even if one fails
      }

      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Successfully generated ${panels.length} panels`);

    return new Response(JSON.stringify({ panels }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-storyboard-simple function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
