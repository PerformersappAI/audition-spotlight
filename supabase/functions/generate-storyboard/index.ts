import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getArtStylePrompt(genre: string, tone: string): string {
  // Generate a style hint based on genre/tone for default black & white storyboard
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

  console.log('Generate-storyboard function called (gpt-image-1)');

  try {
    const { shots, genre, tone, scriptText } = await req.json();

    console.log('Request:', { shotsCount: shots?.length, genre, tone });

    if (!shots || !Array.isArray(shots)) {
      return new Response(
        JSON.stringify({ error: 'Invalid shots data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const genreStyle = getArtStylePrompt(genre, tone);
    console.log(`Generating ${shots.length} frames with gpt-image-1`);

    const storyboardFrames = [];
    const batchSize = 3; // Smaller batches for gpt-image-1
    
    for (let batchStart = 0; batchStart < shots.length; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, shots.length);
      const batch = shots.slice(batchStart, batchEnd);
      
      console.log(`Processing batch ${Math.floor(batchStart/batchSize) + 1} (shots ${batchStart + 1}-${batchEnd})`);
      
      for (const shot of batch) {
        const framingPrompt = getShotFraming(shot.cameraAngle);
        const visualDesc = shot.visualDescription || shot.sceneAction || shot.description;
        
        // Build clean, direct prompt for gpt-image-1
        const imagePrompt = `Storyboard frame for film production.

STYLE: Black and white sketch. Clean pencil lines. Professional storyboard art. ${genreStyle}

FRAMING: ${framingPrompt}

SCENE: ${visualDesc}
${shot.location ? `LOCATION: ${shot.location}` : ''}
${shot.characters?.length > 0 ? `CHARACTERS: ${shot.characters.join(', ')}` : ''}
${shot.lighting ? `LIGHTING: ${shot.lighting}` : ''}
${shot.keyProps ? `PROPS: ${shot.keyProps}` : ''}`;

        console.log(`Generating shot ${shot.shotNumber}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout
        
        try {
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
              size: '1536x1024',
              quality: 'high',
              output_format: 'png'
            }),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          if (!imageResponse.ok) {
            const errorText = await imageResponse.text();
            console.error(`gpt-image-1 error for shot ${shot.shotNumber}:`, errorText);
            
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
          const base64Data = imageData.data?.[0]?.b64_json;
          
          if (!base64Data) {
            console.error('No base64 data for shot:', shot.shotNumber);
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
          
          const generatedImageData = `data:image/png;base64,${base64Data}`;

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

          console.log(`Successfully generated shot ${shot.shotNumber}`);
          
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
      
      // Delay between batches
      if (batchEnd < shots.length) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    console.log(`Generated ${storyboardFrames.length} frames with gpt-image-1`);

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
