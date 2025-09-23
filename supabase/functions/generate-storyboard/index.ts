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

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Generating storyboard for ${shots.length} shots using Gemini`);

    const storyboardFrames = [];

    for (const shot of shots) {
      const prompt = `Create a detailed prompt for generating a cinematic storyboard frame image for a ${genre} film with ${tone} tone.

SCRIPT CONTEXT: ${shot.scriptSegment || 'Scene from the script'}

DIALOGUE: ${shot.dialogueLines?.length ? shot.dialogueLines.join(' ') : 'Character interaction'}

SCENE ACTION: ${shot.sceneAction || 'Action taking place'}

Shot description: ${shot.description}
Camera angle: ${shot.cameraAngle}
Characters present: ${shot.characters.join(', ')}
Visual elements: ${shot.visualElements}

Generate a text description for an image that specifically depicts the dialogue and action from the script context above. Show the characters ${shot.characters.join(' and ')} in a scene that matches the script content. Focus on the specific moment and emotion described in the script segment.

Style: Professional storyboard illustration, black and white pencil sketch style, clear composition, cinematic framing, detailed but not photorealistic.

Return ONLY the image generation prompt text, no additional commentary.`;

      console.log(`Generating image description for shot: ${shot.shotNumber}`);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error for shot ${shot.shotNumber}:`, response.status, errorText);
        return new Response(JSON.stringify({ 
          error: `Gemini API error: ${response.status} - ${errorText}`,
          success: false 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Unexpected Gemini response format:', data);
        return new Response(JSON.stringify({ 
          error: 'No content returned from Gemini API',
          success: false 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const imagePrompt = data.candidates[0].content.parts[0].text;

      // Create a placeholder image data (in a real implementation, you'd use an image generation API)
      const placeholderImageData = `data:image/svg+xml;base64,${btoa(`
        <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
          <rect width="512" height="512" fill="#f0f0f0"/>
          <text x="50%" y="40%" text-anchor="middle" font-size="24" font-family="Arial" fill="#666">
            Storyboard Frame ${shot.shotNumber}
          </text>
          <text x="50%" y="50%" text-anchor="middle" font-size="16" font-family="Arial" fill="#999">
            ${shot.cameraAngle}
          </text>
          <text x="50%" y="60%" text-anchor="middle" font-size="14" font-family="Arial" fill="#999">
            ${shot.characters.join(', ')}
          </text>
          <text x="50%" y="70%" text-anchor="middle" font-size="12" font-family="Arial" fill="#999">
            Generated with Gemini
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
        imageData: placeholderImageData,
        imagePrompt: imagePrompt,
        generatedAt: new Date().toISOString()
      });

      console.log(`Successfully generated description for shot ${shot.shotNumber}`);
    }

    console.log(`Successfully generated ${storyboardFrames.length} storyboard frames using Gemini`);

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