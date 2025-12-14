import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

  console.log('Generate-single-frame function called (gpt-image-1)');

  try {
    const { shot, artStyle, aspectRatio = "16:9", characterDescriptions = "", styleReference = "" } = await req.json();
    
    if (!shot || !artStyle) {
      throw new Error('Missing required parameters: shot, artStyle');
    }

    console.log(`Generating frame for shot ${shot.shotNumber} with gpt-image-1`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build clean, direct prompt for gpt-image-1
    const artStylePrompt = getArtStylePrompt(artStyle);
    const framingPrompt = getShotFraming(shot.shotType || shot.cameraAngle, shot.cameraAngle);
    
    // Get the visual description
    const visualDesc = shot.visualDescription || shot.sceneAction || shot.description;
    
    // Build prompt - gpt-image-1 follows instructions precisely, so be direct
    let imagePrompt = `Storyboard frame for film production.\n\n`;
    imagePrompt += `STYLE: ${artStylePrompt}\n\n`;
    imagePrompt += `FRAMING: ${framingPrompt}\n\n`;
    imagePrompt += `SCENE: ${visualDesc}\n`;
    
    if (shot.location) {
      imagePrompt += `LOCATION: ${shot.location}\n`;
    }
    
    if (shot.characters && shot.characters.length > 0) {
      imagePrompt += `CHARACTERS: ${shot.characters.join(', ')}\n`;
    }
    
    if (characterDescriptions) {
      imagePrompt += `CHARACTER DETAILS: ${characterDescriptions}\n`;
    }
    
    if (shot.lighting) {
      imagePrompt += `LIGHTING: ${shot.lighting}\n`;
    }
    
    if (shot.keyProps) {
      imagePrompt += `PROPS: ${shot.keyProps}\n`;
    }
    
    if (styleReference) {
      imagePrompt += `\nVISUAL REFERENCE: ${styleReference}\n`;
    }

    console.log(`Prompt for shot ${shot.shotNumber}: ${imagePrompt}`);

    // Determine image size - gpt-image-1 supports: 1024x1024, 1536x1024, 1024x1536
    const imageSize = aspectRatio === "9:16" ? "1024x1536" : "1536x1024";

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: imagePrompt,
        n: 1,
        size: imageSize,
        quality: 'high',
        output_format: 'png'
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`gpt-image-1 error for shot ${shot.shotNumber}:`, {
        status: response.status,
        error: errorData
      });

      // Check for content policy violation
      const isContentPolicy = errorData.includes('content_policy') || errorData.includes('safety');
      
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
    
    // gpt-image-1 returns base64 in b64_json field
    const base64Data = data.data?.[0]?.b64_json;
    
    if (!base64Data) {
      console.error('No image data returned for shot:', shot.shotNumber);
      throw new Error('No image data in response');
    }

    const imageData = `data:image/png;base64,${base64Data}`;

    console.log(`Successfully generated shot ${shot.shotNumber} with gpt-image-1`);

    return new Response(JSON.stringify({ 
      imageData,
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
