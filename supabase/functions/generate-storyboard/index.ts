import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { shots, genre, tone } = await req.json();

    if (!shots || !Array.isArray(shots)) {
      return new Response(
        JSON.stringify({ error: 'Invalid shots data provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log(`Generating storyboard for ${shots.length} shots`);

    const storyboardFrames = [];

    for (const shot of shots) {
      const prompt = `Create a cinematic storyboard frame for a ${genre} film with ${tone} tone. 
      Shot description: ${shot.description}
      Camera angle: ${shot.cameraAngle}
      Characters: ${shot.characters.join(', ')}
      Visual elements: ${shot.visualElements}
      
      Style: Professional storyboard illustration, black and white pencil sketch style, clear composition, cinematic framing, detailed but not photorealistic.`;

      console.log(`Generating image for shot: ${shot.shotNumber}`);

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'b64_json'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`OpenAI API error for shot ${shot.shotNumber}:`, errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const imageData = data.data[0].b64_json;

      storyboardFrames.push({
        shotNumber: shot.shotNumber,
        description: shot.description,
        cameraAngle: shot.cameraAngle,
        characters: shot.characters,
        visualElements: shot.visualElements,
        imageData: `data:image/png;base64,${imageData}`,
        generatedAt: new Date().toISOString()
      });

      console.log(`Successfully generated image for shot ${shot.shotNumber}`);
    }

    console.log(`Successfully generated ${storyboardFrames.length} storyboard frames`);

    return new Response(JSON.stringify({ 
      success: true, 
      storyboard: storyboardFrames,
      totalFrames: storyboardFrames.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-storyboard function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});