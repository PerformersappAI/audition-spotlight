import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Shot {
  shotNumber: number;
  description: string;
  cameraAngle: string;
  characters: string[];
  visualElements: string;
  duration: number;
  scriptSegment?: string;
  dialogueLines?: string[];
  sceneAction?: string;
  visualDescription?: string;
  location?: string;
  action?: string;
  lighting?: string;
  keyProps?: string;
  emotionalTone?: string;
  shotType?: string;
}

function getArtStylePrompt(artStyle: string): string {
  const style = artStyle.toLowerCase();
  
  if (style.includes('noir') || style.includes('film noir')) {
    return 'Black and white film noir style. High contrast. Deep shadows. 1940s crime film aesthetic.';
  }
  if (style.includes('charcoal')) {
    return 'Charcoal drawing on paper. Rough textured strokes. Black and white only. Hand-drawn art style.';
  }
  if (style.includes('pencil')) {
    return 'Pencil sketch on white paper. Clean graphite lines. Black and white. Hand-drawn illustration.';
  }
  if (style.includes('graphic novel')) {
    return 'Graphic novel illustration. Bold ink outlines. Professional comic book coloring. Clear panel composition.';
  }
  if (style.includes('comic')) {
    return 'Comic book art style. Bold outlines. Vibrant colors. Dynamic composition.';
  }
  if (style.includes('watercolor')) {
    return 'Watercolor painting. Soft color washes. Visible brushstrokes. Artistic interpretation.';
  }
  if (style.includes('anime')) {
    return 'Anime art style. Clean cel-shaded look. Japanese animation aesthetic. Expressive characters.';
  }
  if (style.includes('3d') || style.includes('rendered')) {
    return '3D rendered CGI. Pixar/Disney animation quality. Smooth surfaces. Professional lighting.';
  }
  if (style.includes('vector')) {
    return 'Vector art. Flat colors. Geometric shapes. Clean digital illustration.';
  }
  if (style.includes('cinematic')) {
    return 'Cinematic photograph. 35mm film quality. Professional cinematography. Natural lighting.';
  }
  if (style.includes('stick')) {
    return 'Simple stick figure drawings. Minimalist black lines on white. Basic shapes only.';
  }
  
  return `${artStyle} artistic style.`;
}

function getShotFraming(shotType: string, cameraAngle: string): string {
  let framing = '';
  
  // Shot type
  const type = (shotType || '').toLowerCase();
  if (type.includes('extreme close')) {
    framing += 'Extreme close-up. Face detail fills entire frame.';
  } else if (type.includes('close-up') || type.includes('close up')) {
    framing += 'Close-up shot. Head and shoulders only.';
  } else if (type.includes('medium close')) {
    framing += 'Medium close-up. Chest and up visible.';
  } else if (type.includes('medium wide')) {
    framing += 'Medium wide shot. Knees and up visible.';
  } else if (type.includes('medium')) {
    framing += 'Medium shot. Waist and up visible.';
  } else if (type.includes('wide') || type.includes('full')) {
    framing += 'Wide shot. Full body and environment visible.';
  } else if (type.includes('extreme wide')) {
    framing += 'Extreme wide shot. Vast environment. Small figures.';
  } else {
    framing += 'Standard framing.';
  }
  
  // Camera angle
  const angle = (cameraAngle || '').toLowerCase();
  if (angle.includes('high')) {
    framing += ' Camera above subject looking down.';
  } else if (angle.includes('low')) {
    framing += ' Camera below subject looking up.';
  } else if (angle.includes('dutch')) {
    framing += ' Tilted camera angle.';
  } else if (angle.includes('over') && angle.includes('shoulder')) {
    framing += ' Over-the-shoulder framing.';
  } else if (angle.includes('pov')) {
    framing += ' Point-of-view perspective.';
  } else {
    framing += ' Eye level camera.';
  }
  
  return framing;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Generate-single-frame function called (Gemini 2.5 Flash Image)');

  try {
    const { 
      shot, 
      artStyle, 
      aspectRatio = "16:9", 
      characterDescriptions = "", 
      characterImages = [],  // Array of { name, imageUrl }
      styleReference = "",
      styleReferenceImage = ""  // Actual base64/URL of style reference
    } = await req.json();
    
    if (!shot || !artStyle) {
      throw new Error('Missing required parameters: shot, artStyle');
    }

    console.log(`Generating frame for shot ${shot.shotNumber} with Gemini 2.5 Flash Image`);
    console.log(`Character images provided: ${characterImages?.length || 0}`);
    console.log(`Style reference image provided: ${styleReferenceImage ? 'yes' : 'no'}`);

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build clean, direct prompt for Gemini
    const artStylePrompt = getArtStylePrompt(artStyle);
    const framingPrompt = getShotFraming(shot.shotType || shot.cameraAngle, shot.cameraAngle);
    
    // Get the visual description
    const visualDesc = shot.visualDescription || shot.sceneAction || shot.description;
    
    // Build text prompt
    let imagePrompt = `Generate a storyboard frame for film production.\n\n`;
    imagePrompt += `ART STYLE: ${artStylePrompt}\n\n`;
    imagePrompt += `CAMERA FRAMING: ${framingPrompt}\n\n`;
    imagePrompt += `SCENE DESCRIPTION: ${visualDesc}\n`;
    
    if (shot.location) {
      imagePrompt += `LOCATION: ${shot.location}\n`;
    }
    
    if (shot.characters && shot.characters.length > 0) {
      imagePrompt += `CHARACTERS IN FRAME: ${shot.characters.join(', ')}\n`;
    }
    
    if (characterDescriptions) {
      imagePrompt += `CHARACTER APPEARANCE: ${characterDescriptions}\n`;
    }
    
    if (shot.lighting) {
      imagePrompt += `LIGHTING: ${shot.lighting}\n`;
    }
    
    if (shot.keyProps) {
      imagePrompt += `KEY PROPS: ${shot.keyProps}\n`;
    }
    
    if (styleReference) {
      imagePrompt += `\nVISUAL STYLE REFERENCE: ${styleReference}\n`;
    }

    // Add aspect ratio hint
    if (aspectRatio === "9:16") {
      imagePrompt += `\nIMAGE FORMAT: Vertical/portrait orientation (9:16 aspect ratio)`;
    } else {
      imagePrompt += `\nIMAGE FORMAT: Horizontal/landscape orientation (16:9 aspect ratio)`;
    }

    // Add consistency instructions if reference images are provided
    const hasReferenceImages = (characterImages && characterImages.length > 0) || styleReferenceImage;
    if (hasReferenceImages) {
      imagePrompt += `\n\nCRITICAL CONSISTENCY INSTRUCTIONS:`;
      if (characterImages && characterImages.length > 0) {
        imagePrompt += `\n- Match the character appearance from the provided reference images EXACTLY`;
        imagePrompt += `\n- Maintain the same facial features, age, body type, and clothing as shown in the reference`;
        imagePrompt += `\n- The character(s) should look like the SAME person from the reference photos`;
        imagePrompt += `\n- Characters: ${characterImages.map((c: any) => c.name).join(', ')}`;
      }
      if (styleReferenceImage) {
        imagePrompt += `\n- Match the visual art style from the style reference image`;
        imagePrompt += `\n- Use similar color palette, line work, and rendering style`;
      }
    }

    console.log(`Prompt for shot ${shot.shotNumber}: ${imagePrompt.substring(0, 200)}...`);

    // Build multimodal content array for Gemini
    const content: any[] = [];

    // Add character reference images FIRST (Gemini uses them as visual context)
    if (characterImages && characterImages.length > 0) {
      for (const charImage of characterImages) {
        if (charImage.imageUrl) {
          console.log(`Adding character reference image for: ${charImage.name}`);
          content.push({
            type: 'image_url',
            image_url: { url: charImage.imageUrl }
          });
        }
      }
    }

    // Add style reference image if provided
    if (styleReferenceImage) {
      console.log('Adding style reference image');
      content.push({
        type: 'image_url',
        image_url: { url: styleReferenceImage }
      });
    }

    // Add text prompt last
    content.push({
      type: 'text',
      text: imagePrompt
    });

    // Use multimodal content if we have images, otherwise use simple string
    const messageContent = content.length > 1 ? content : imagePrompt;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          { role: 'user', content: messageContent }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Gemini error for shot ${shot.shotNumber}:`, {
        status: response.status,
        error: errorData
      });

      // Check for rate limits or credits
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.',
          errorType: 'rate_limit'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits required. Please add credits to continue.',
          errorType: 'credits_required'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check for content policy violation
      const isContentPolicy = errorData.includes('content') || errorData.includes('safety') || errorData.includes('blocked');
      
      const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
        <svg width="1536" height="1024" xmlns="http://www.w3.org/2000/svg">
          <rect width="1536" height="1024" fill="#fef2f2"/>
          <text x="768" y="480" text-anchor="middle" font-family="Arial" font-size="24" fill="#dc2626">
            Generation Failed - Shot ${shot.shotNumber}
          </text>
          <text x="768" y="520" text-anchor="middle" font-family="Arial" font-size="16" fill="#991b1b">
            ${isContentPolicy ? 'Content Policy - Try modifying the scene' : 'Please try again'}
          </text>
        </svg>
      `)}`;

      return new Response(JSON.stringify({ 
        imageData: fallbackSvg,
        shotNumber: shot.shotNumber,
        error: isContentPolicy ? 'Content policy violation' : 'Generation failed',
        errorType: isContentPolicy ? 'content_policy' : 'generation_error'
      }), {
        status: 200, // Return 200 with error info so frontend can handle gracefully
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    // Gemini returns images in the images array
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image data returned for shot:', shot.shotNumber, data);
      throw new Error('No image data in response');
    }

    console.log(`Successfully generated shot ${shot.shotNumber} with Gemini 2.5 Flash Image`);

    return new Response(JSON.stringify({ 
      imageData: imageUrl,
      shotNumber: shot.shotNumber,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-single-frame:', error);
    
    const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#fef2f2"/>
        <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#dc2626">
          Generation Error - Please try again
        </text>
      </svg>
    `)}`;

    return new Response(JSON.stringify({ 
      imageData: fallbackSvg,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
