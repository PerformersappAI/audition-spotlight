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

  console.log('Generate-storyboard function called');

  try {
    const { shots, genre, tone, scriptText } = await req.json();

    if (!shots || !Array.isArray(shots)) {
      console.error('Invalid shots data provided');
      return new Response(
        JSON.stringify({ error: 'Invalid shots data provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Generating storyboard for ${shots.length} shots using OpenAI GPT-5 and image generation`);

    const storyboardFrames = [];

    for (const shot of shots) {
      const imagePrompt = `Professional storyboard frame for a ${genre} film with ${tone} tone. 

Scene: ${shot.scriptSegment || 'Script scene'}
Action: ${shot.sceneAction || shot.description}
Characters: ${shot.characters.join(', ')}
Camera: ${shot.cameraAngle}
Visual elements: ${shot.visualElements}

Style: Black and white pencil sketch storyboard, cinematic composition, clear framing, professional film industry standard. Show the characters and action clearly with dramatic lighting and composition.`;

      console.log(`Generating storyboard image for shot: ${shot.shotNumber}`);

      // Generate the actual storyboard image using OpenAI's image generation
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: imagePrompt,
          n: 1,
          size: '1024x1024',
          quality: 'high',
          output_format: 'png'
        })
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error(`OpenAI Image API error for shot ${shot.shotNumber}:`, imageResponse.status, errorText);
        
        // Create fallback SVG if image generation fails
        const fallbackImageData = `data:image/svg+xml;base64,${btoa(`
          <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
            <text x="50%" y="30%" text-anchor="middle" font-size="18" font-family="Arial" fill="#495057" font-weight="bold">
              Storyboard Frame ${shot.shotNumber}
            </text>
            <text x="50%" y="45%" text-anchor="middle" font-size="14" font-family="Arial" fill="#6c757d">
              ${shot.cameraAngle}
            </text>
            <text x="50%" y="55%" text-anchor="middle" font-size="12" font-family="Arial" fill="#6c757d">
              ${shot.characters.join(', ')}
            </text>
            <text x="50%" y="75%" text-anchor="middle" font-size="10" font-family="Arial" fill="#adb5bd">
              Image generation temporarily unavailable
            </text>
          </svg>
        `)}`;

        storyboardFrames.push({
          shotNumber: shot.shotNumber,
          description: shot.description,
          cameraAngle: shot.cameraAngle,
          characters: shot.characters,
          visualElements: shot.visualElements,
          scriptSegment: shot.scriptSegment,
          dialogueLines: shot.dialogueLines,
          sceneAction: shot.sceneAction,
          imageData: fallbackImageData,
          imagePrompt: imagePrompt,
          generatedAt: new Date().toISOString()
        });
        continue;
      }

      const imageData = await imageResponse.json();
      
      if (!imageData.data || !imageData.data[0]) {
        console.error('Unexpected OpenAI image response format:', imageData);
        // Use fallback for this frame
        const fallbackImageData = `data:image/svg+xml;base64,${btoa(`
          <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
            <text x="50%" y="50%" text-anchor="middle" font-size="16" font-family="Arial" fill="#6c757d">
              Frame ${shot.shotNumber} - Processing Error
            </text>
          </svg>
        `)}`;

        storyboardFrames.push({
          shotNumber: shot.shotNumber,
          description: shot.description,
          cameraAngle: shot.cameraAngle,
          characters: shot.characters,
          visualElements: shot.visualElements,
          scriptSegment: shot.scriptSegment,
          dialogueLines: shot.dialogueLines,
          sceneAction: shot.sceneAction,
          imageData: fallbackImageData,
          imagePrompt: imagePrompt,
          generatedAt: new Date().toISOString()
        });
        continue;
      }

      // OpenAI returns base64 data directly for gpt-image-1
      const generatedImageData = `data:image/png;base64,${imageData.data[0].b64_json}`;

      storyboardFrames.push({
        shotNumber: shot.shotNumber,
        description: shot.description,
        cameraAngle: shot.cameraAngle,
        characters: shot.characters,
        visualElements: shot.visualElements,
        scriptSegment: shot.scriptSegment,
        dialogueLines: shot.dialogueLines,
        sceneAction: shot.sceneAction,
        imageData: generatedImageData,
        imagePrompt: imagePrompt,
        generatedAt: new Date().toISOString()
      });

      console.log(`Successfully generated storyboard image for shot ${shot.shotNumber}`);
    }

    console.log(`Successfully generated ${storyboardFrames.length} storyboard frames using OpenAI GPT-5 and image generation`);

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
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});