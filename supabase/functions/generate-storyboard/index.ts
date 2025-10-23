import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Global style configuration for cinematic frames
const CINEMATIC_STYLE_PREFIX = `Cinematic film frame, 16:9 full-bleed (1920×1080), shot-on-set look, no borders, no frames, no paper, no hands, no sketchbook, no "drawn" look, not a comic panel. Clean composition, sharp focus, natural lighting, graded like a feature film.`;

const NEGATIVE_PROMPT = `border, frame, paper texture, page, margin, white background, hand, pencil, pen, marker, tape, Post-it, UI, watermark, text, caption, signature, drawing, comic, manga, storyboard sheet, panel lines, sketch, "concept art", letterbox, black bars, side bars`;

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
        // Map camera angle to cinematographic terms
        const cameraSetup = shot.cameraAngle.toLowerCase().includes('close') ? 'close-up, 85mm lens' :
                            shot.cameraAngle.toLowerCase().includes('medium') ? 'medium shot, 50mm lens' :
                            shot.cameraAngle.toLowerCase().includes('wide') ? 'wide shot, 24mm lens' :
                            shot.cameraAngle.toLowerCase().includes('bird') ? 'high angle, birds eye view' :
                            shot.cameraAngle.toLowerCase().includes('low') ? 'low angle, worms eye view' :
                            'eye level, 35mm lens';

        const imagePrompt = `${CINEMATIC_STYLE_PREFIX}

Camera: ${cameraSetup}, angle: eye level
Time: day
Location: ${shot.visualElements}
Characters: ${shot.characters.join(', ')}
Action: ${shot.sceneAction || shot.description}
Mood: ${tone}, ${visualStyle}

Exclude: ${NEGATIVE_PROMPT}
Output: 16:9 full-bleed image only.`;

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
              model: 'gpt-image-1',
              prompt: imagePrompt,
              n: 1,
              size: '1792x1024',
              quality: 'high',
              output_format: 'png',
              output_compression: 90,
              moderation: 'auto'
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

          // DALL-E 3 returns URL, need to fetch and convert to base64
          const imageUrl = imageData.data[0].url;
          
          let generatedImageData: string;
          
          try {
            // Fetch the image and convert to base64 safely
            const imageBlob = await fetch(imageUrl);
            if (!imageBlob.ok) {
              throw new Error(`Failed to fetch image: ${imageBlob.status}`);
            }
            
            const imageBuffer = await imageBlob.arrayBuffer();
            
            // Convert to base64 safely without stack overflow
            const uint8Array = new Uint8Array(imageBuffer);
            let binary = '';
            const chunkSize = 32768; // Process in chunks to avoid stack overflow
            
            for (let i = 0; i < uint8Array.length; i += chunkSize) {
              const chunk = uint8Array.slice(i, i + chunkSize);
              binary += String.fromCharCode(...chunk);
            }
            
            const base64Image = btoa(binary);
            generatedImageData = `data:image/png;base64,${base64Image}`;
            
          } catch (conversionError) {
            console.error(`Error converting image to base64 for shot ${shot.shotNumber}:`, conversionError);
            
            // Use fallback SVG if conversion fails
            generatedImageData = `data:image/svg+xml;base64,${btoa(`
              <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                <rect width="512" height="512" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
                <text x="50%" y="40%" text-anchor="middle" font-size="16" font-family="Arial" fill="#495057" font-weight="bold">
                  Storyboard Frame ${shot.shotNumber}
                </text>
                <text x="50%" y="50%" text-anchor="middle" font-size="12" font-family="Arial" fill="#6c757d">
                  ${genre} | ${tone}
                </text>
                <text x="50%" y="70%" text-anchor="middle" font-size="10" font-family="Arial" fill="#adb5bd">
                  Image conversion error - Please try regenerating
                </text>
              </svg>
            `)}`;
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