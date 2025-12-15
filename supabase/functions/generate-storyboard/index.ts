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

function getArtStylePrompt(genre: string, tone: string): string {
  const genreHints: Record<string, string> = {
    'horror': 'Dark atmosphere. Deep shadows. Unsettling composition.',
    'comedy': 'Bright lighting. Clear expressions. Dynamic poses.',
    'drama': 'Naturalistic lighting. Emotional expressions. Intimate framing.',
    'action': 'Dynamic angles. High contrast. Energetic composition.',
    'thriller': 'High contrast. Tense atmosphere. Dramatic shadows.',
    'romance': 'Soft lighting. Warm tones. Intimate framing.',
    'sci-fi': 'Clean lines. Futuristic elements. Dramatic lighting.',
    'mystery': 'Noir lighting. Deep shadows. Atmospheric.',
    'fantasy': 'Epic scope. Rich detail. Dramatic composition.'
  };
  
  return genreHints[genre?.toLowerCase()] || 'Professional film composition.';
}

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
  if (angle.includes('medium wide')) {
    return 'Medium wide. Knees and up visible.';
  }
  if (angle.includes('medium') || angle.includes('ms')) {
    return 'Medium shot. Waist and up visible.';
  }
  if (angle.includes('wide') || angle.includes('ws') || angle.includes('full')) {
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
  
  return 'Standard framing. Eye level.';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Generate-storyboard function called (Gemini 2.5 Flash Image)');

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
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
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);
    const { shots, genre, tone, scriptText } = await req.json();

    console.log('Request:', { shotsCount: shots?.length, genre, tone });

    if (!shots || !Array.isArray(shots)) {
      return new Response(
        JSON.stringify({ error: 'Invalid shots data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const genreStyle = getArtStylePrompt(genre, tone);
    console.log(`Generating ${shots.length} frames with Gemini 2.5 Flash Image`);

    const storyboardFrames = [];
    
    for (const shot of shots) {
      const framingPrompt = getShotFraming(shot.cameraAngle);
      const visualDesc = shot.visualDescription || shot.sceneAction || shot.description;
      
      // Build clean, direct prompt for Gemini
      const imagePrompt = `Generate a storyboard frame for film production.

ART STYLE: Black and white sketch. Clean pencil lines. Professional storyboard art. ${genreStyle}

CAMERA FRAMING: ${framingPrompt}

SCENE DESCRIPTION: ${visualDesc}
${shot.location ? `LOCATION: ${shot.location}` : ''}
${shot.characters?.length > 0 ? `CHARACTERS IN FRAME: ${shot.characters.join(', ')}` : ''}
${shot.lighting ? `LIGHTING: ${shot.lighting}` : ''}
${shot.keyProps ? `KEY PROPS: ${shot.keyProps}` : ''}

IMAGE FORMAT: Horizontal/landscape orientation (16:9 aspect ratio)`;

      console.log(`Generating shot ${shot.shotNumber}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout
      
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
              { role: 'user', content: imagePrompt }
            ],
            modalities: ['image', 'text']
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error(`Gemini error for shot ${shot.shotNumber}:`, imageResponse.status, errorText);
          
          // Check for rate limits or credits
          if (imageResponse.status === 429) {
            console.log('Rate limited, adding delay...');
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
          
          // Create fallback SVG
          const fallbackImageData = `data:image/svg+xml;base64,${btoa(`
            <svg width="512" height="341" xmlns="http://www.w3.org/2000/svg">
              <rect width="512" height="341" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
              <text x="50%" y="40%" text-anchor="middle" font-size="16" font-family="Arial" fill="#495057" font-weight="bold">
                Shot ${shot.shotNumber}
              </text>
              <text x="50%" y="55%" text-anchor="middle" font-size="12" font-family="Arial" fill="#6c757d">
                ${shot.cameraAngle}
              </text>
              <text x="50%" y="70%" text-anchor="middle" font-size="10" font-family="Arial" fill="#adb5bd">
                Generation failed - Try regenerating
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
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (!imageUrl) {
          console.error('No image data for shot:', shot.shotNumber, imageData);
          const fallbackImageData = `data:image/svg+xml;base64,${btoa(`
            <svg width="512" height="341" xmlns="http://www.w3.org/2000/svg">
              <rect width="512" height="341" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
              <text x="50%" y="50%" text-anchor="middle" font-size="14" font-family="Arial" fill="#6c757d">
                Shot ${shot.shotNumber} - No data
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

        storyboardFrames.push({
          shotNumber: shot.shotNumber,
          description: shot.description,
          cameraAngle: shot.cameraAngle,
          characters: shot.characters,
          visualElements: shot.visualElements,
          scriptSegment: shot.scriptSegment,
          dialogueLines: shot.dialogueLines,
          sceneAction: shot.sceneAction,
          imageData: imageUrl,
          imagePrompt: imagePrompt,
          generatedAt: new Date().toISOString()
        });

        console.log(`Successfully generated shot ${shot.shotNumber}`);
        
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error(`Network error for shot ${shot.shotNumber}:`, fetchError);
        
        const fallbackImageData = `data:image/svg+xml;base64,${btoa(`
          <svg width="512" height="341" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="341" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
            <text x="50%" y="50%" text-anchor="middle" font-size="14" font-family="Arial" fill="#6c757d">
              Shot ${shot.shotNumber} - Timeout
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
      }
    }

    console.log(`Generated ${storyboardFrames.length} frames with Gemini 2.5 Flash Image`);

    return new Response(JSON.stringify({ 
      success: true, 
      storyboard: storyboardFrames,
      totalFrames: storyboardFrames.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-storyboard:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
