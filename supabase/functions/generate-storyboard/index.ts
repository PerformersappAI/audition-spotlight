import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Global style configuration for cinematic frames
const CINEMATIC_STYLE_PREFIX = `Cinematic film frame, 16:9 full-bleed (1920×1080), shot-on-set look, no borders, no frames, no paper, no hands, no sketchbook, no "drawn" look, not a comic panel. Clean composition, sharp focus, natural lighting, graded like a feature film.`;

const NEGATIVE_PROMPT = `NO overlays, NO text, NO numbers, NO grid lines, NO technical data, NO camera measurements, NO aspect ratio markers, NO framing guides, NO watermarks, NO borders, NO labels, NO annotations, NO UI elements, NO storyboard sheet, NO paper texture, NO drawing, NO sketch, NO comic style, NO panels, NO meta elements`;

function getCameraInstructions(cameraAngle: string): string {
  const angle = cameraAngle.toLowerCase();
  
  if (angle.includes('extreme close') || angle.includes('ecu')) {
    return 'EXTREME CLOSE-UP FRAMING: Face detail only, eyes or mouth fill frame, minimal background visible, ultra-tight composition';
  }
  if (angle.includes('close up') || angle.includes('close-up') || angle.includes('cu')) {
    return 'CLOSE-UP FRAMING: Head and shoulders only, subject fills frame, minimal background visible';
  }
  if (angle.includes('medium close') || angle.includes('mcu')) {
    return 'MEDIUM CLOSE-UP FRAMING: Chest and up visible, moderate background context, intimate feel';
  }
  if (angle.includes('medium') || angle.includes('ms')) {
    return 'MEDIUM SHOT FRAMING: Waist and up visible, balanced subject and environment, conversational distance';
  }
  if (angle.includes('long shot') || angle.includes('full shot') || angle.includes('ls')) {
    return 'LONG SHOT FRAMING: Full body visible head to toe, significant environmental context, establish location';
  }
  if (angle.includes('wide') || angle.includes('ws') || angle.includes('establishing')) {
    return 'WIDE SHOT FRAMING: Full environment emphasis, characters are smaller in frame, location is primary';
  }
  if (angle.includes('extreme wide') || angle.includes('ews')) {
    return 'EXTREME WIDE SHOT FRAMING: Vast environment, characters are tiny or distant, epic scope, aerial perspective';
  }
  if (angle.includes('high angle') || angle.includes('bird')) {
    return 'HIGH ANGLE FRAMING: Camera positioned above subject looking down, creates vulnerability or overview perspective';
  }
  if (angle.includes('low angle')) {
    return 'LOW ANGLE FRAMING: Camera positioned below subject looking up, creates power or dominance, heroic feel';
  }
  if (angle.includes('over shoulder') || angle.includes('os')) {
    return 'OVER-SHOULDER FRAMING: Frame includes foreground shoulder/head, subject in background, conversational setup';
  }
  
  return 'STANDARD FRAMING: Balanced composition appropriate for narrative, professional film framing';
}

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

    console.log('Request data:', { shotsCount: shots?.length, genre, tone });

    if (!shots || !Array.isArray(shots)) {
      console.error('Invalid shots data provided');
      return new Response(
        JSON.stringify({ error: 'Invalid shots data provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create dynamic visual style based on genre and tone
    const getVisualStyle = (genre: string, tone: string) => {
      const genreStyles: Record<string, string> = {
        'horror': 'dark, moody cinematography with deep shadows and cool blue/gray color palette, atmospheric noir lighting',
        'comedy': 'bright, warm color palette with natural cheerful lighting, clear visibility of characters and expressions',
        'documentary': 'realistic, natural lighting with authentic color grading, journalistic composition style',
        'sci-fi': 'futuristic color palette with blues and teals, dramatic lighting, high contrast cinematic style',
        'drama': 'naturalistic lighting with warm earth tones, intimate character-focused compositions',
        'action': 'dynamic high-contrast lighting, bold color palette, wide dramatic compositions',
        'romance': 'soft warm lighting with pastel tones, intimate close-up compositions',
        'thriller': 'high contrast lighting with stark shadows, desaturated color palette, tense compositions',
        'mystery': 'noir-style lighting with dramatic shadows, muted color palette, atmospheric compositions',
        'fantasy': 'magical ethereal lighting with rich vibrant colors, epic wide compositions'
      };

      const toneModifiers: Record<string, string> = {
        'dark': 'with deeper shadows, desaturated colors, and ominous atmosphere',
        'light': 'with bright natural lighting, saturated colors, and uplifting atmosphere',
        'serious': 'with realistic lighting, grounded color palette, and authentic compositions',
        'playful': 'with vibrant colors, dynamic lighting, and energetic compositions',
        'mysterious': 'with dramatic chiaroscuro lighting, muted colors, and enigmatic atmosphere',
        'epic': 'with grand cinematic lighting, rich colors, and sweeping wide compositions',
        'intimate': 'with soft natural lighting, warm tones, and close personal framing',
        'tense': 'with harsh contrasting lights, stark colors, and tight claustrophobic framing'
      };

      const baseStyle = genreStyles[genre?.toLowerCase()] || 'cinematic lighting with balanced color palette';
      const toneModifier = toneModifiers[tone?.toLowerCase()] || '';
      
      return `${baseStyle} ${toneModifier}`.trim();
    };

    const visualStyle = getVisualStyle(genre, tone);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Generating storyboard for ${shots.length} shots using OpenAI DALL-E 3`);

    const storyboardFrames = [];
    const batchSize = 5; // Process in batches to prevent timeouts
    
    // Process shots in batches for better performance and error handling
    for (let batchStart = 0; batchStart < shots.length; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, shots.length);
      const batch = shots.slice(batchStart, batchEnd);
      
      console.log(`Processing batch ${Math.floor(batchStart/batchSize) + 1}/${Math.ceil(shots.length/batchSize)} (shots ${batchStart + 1}-${batchEnd})`);
      
      // Process each shot in the current batch
      for (const shot of batch) {
        const cameraInstructions = getCameraInstructions(shot.cameraAngle);
        
        // Construct detailed prompt using rich AI-analyzed data
        const visualDesc = shot.visualDescription || shot.sceneAction || shot.description;
        const location = shot.location || '';
        const action = shot.action || shot.description;
        const lighting = shot.lighting || '';
        const keyProps = shot.keyProps || '';
        const emotionalTone = shot.emotionalTone || '';
        
        const imagePrompt = `${visualDesc}, 
black and white storyboard frame, 
film previsualization storyboard, 
professional concept art for film production, 
hand-drawn sketch aesthetic with clean linework, 
35mm film composition and framing, 
consistent character designs, 
production design reference sketch,
NOT a photograph, NOT in color, NOT realistic,
pen and ink illustration style,
${location ? `Location: ${location}` : ''}
${shot.characters && shot.characters.length > 0 ? `Characters: ${shot.characters.join(', ')} - ${action}` : ''}
${lighting ? `Lighting: ${lighting}` : ''}
${keyProps ? `Key Props: ${keyProps}` : ''}
${emotionalTone ? `Mood: ${emotionalTone}` : ''}
${cameraInstructions}`;

        console.log(`Generating storyboard image for shot: ${shot.shotNumber} with style: ${visualStyle}`);

        // Generate the actual storyboard image using OpenAI's DALL-E 3
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
        
        try {
          const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt: imagePrompt,
              n: 1,
              size: '1792x1024', // DALL-E 3 widescreen format
              quality: 'standard', // 'standard' is better for sketch style
              style: 'natural',
              response_format: 'b64_json'
            }),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          if (!imageResponse.ok) {
            const errorText = await imageResponse.text();
            console.error(`OpenAI Image API error for shot ${shot.shotNumber}:`, {
              status: imageResponse.status,
              statusText: imageResponse.statusText,
              error: errorText,
              apiKeyExists: !!OPENAI_API_KEY,
              promptLength: imagePrompt.length
            });
            
            // Create fallback SVG if image generation fails
            const fallbackImageData = `data:image/svg+xml;base64,${btoa(`
              <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                <rect width="512" height="512" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
                <text x="50%" y="25%" text-anchor="middle" font-size="16" font-family="Arial" fill="#495057" font-weight="bold">
                  Storyboard Frame ${shot.shotNumber}
                </text>
                <text x="50%" y="35%" text-anchor="middle" font-size="12" font-family="Arial" fill="#6c757d">
                  ${genre} | ${tone}
                </text>
                <text x="50%" y="45%" text-anchor="middle" font-size="11" font-family="Arial" fill="#6c757d">
                  ${shot.cameraAngle}
                </text>
                <text x="50%" y="55%" text-anchor="middle" font-size="10" font-family="Arial" fill="#6c757d">
                  ${shot.characters.join(', ')}
                </text>
                <text x="50%" y="75%" text-anchor="middle" font-size="9" font-family="Arial" fill="#adb5bd">
                  Image generation error: ${imageResponse.status}
                </text>
                <text x="50%" y="85%" text-anchor="middle" font-size="8" font-family="Arial" fill="#adb5bd">
                  Check function logs for details
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

          // gpt-image-1 returns base64 directly in b64_json field
          const base64Data = imageData.data[0].b64_json;
          
          if (!base64Data) {
            console.error('No base64 data in response for shot:', shot.shotNumber);
            // Use fallback SVG if no base64 data
            const fallbackImageData = `data:image/svg+xml;base64,${btoa(`
              <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                <rect width="512" height="512" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
                <text x="50%" y="40%" text-anchor="middle" font-size="16" font-family="Arial" fill="#495057" font-weight="bold">
                  Storyboard Frame ${shot.shotNumber}
                </text>
                <text x="50%" y="50%" text-anchor="middle" font-size="12" font-family="Arial" fill="#6c757d">
                  ${genre} | ${tone}
                </text>
                <text x="50%" y="70%" text-anchor="middle" font-size="10" font-family="Arial" fill="#adb5bd">
                  No image data returned - Please try regenerating
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

          console.log(`Successfully generated storyboard image for shot ${shot.shotNumber}`);
          
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.error(`Network error generating image for shot ${shot.shotNumber}:`, fetchError);
          
          // Create timeout/network error fallback
          const fallbackImageData = `data:image/svg+xml;base64,${btoa(`
            <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
              <rect width="512" height="512" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
              <text x="50%" y="40%" text-anchor="middle" font-size="16" font-family="Arial" fill="#495057" font-weight="bold">
                Storyboard Frame ${shot.shotNumber}
              </text>
              <text x="50%" y="50%" text-anchor="middle" font-size="12" font-family="Arial" fill="#6c757d">
                ${genre} | ${tone}
              </text>
              <text x="50%" y="70%" text-anchor="middle" font-size="10" font-family="Arial" fill="#adb5bd">
                Network timeout - Please try regenerating
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
      
      // Add a small delay between batches to prevent rate limiting
      if (batchEnd < shots.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Successfully generated ${storyboardFrames.length} storyboard frames using OpenAI DALL-E 3`);

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