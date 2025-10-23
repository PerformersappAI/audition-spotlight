import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Global style configuration for cinematic frames
const getCinematicStylePrefix = (aspectRatio: string = "16:9") => {
  const format = aspectRatio === "9:16" ? "9:16 vertical format (1080×1920)" : "16:9 full-bleed (1920×1080)";
  return `Cinematic film frame, ${format}, shot-on-set look, no borders, no frames, no paper, no hands, no sketchbook, no "drawn" look, not a comic panel. Clean composition, sharp focus, natural lighting, graded like a feature film.`;
};

const NEGATIVE_PROMPT = `STRICTLY EXCLUDE: border, frame, paper texture, page, margin, white background, hand, hands, fingers, pencil, pen, marker, tape, Post-it, UI, watermark, text, caption, signature, drawing, comic, manga, storyboard sheet, panel lines, sketch, artist hands, person drawing, sketchbook, notepad, sticky notes, annotations, labels, any meta-framing elements, any reference to drawing or sketching, "concept art", letterbox, black bars, side bars`;

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
}

function getVisualStyle(genre: string, tone: string): string {
  const styles = {
    'Drama': {
      'Emotional': 'warm, intimate setting with soft lighting',
      'Serious': 'muted tones, thoughtful composition',
      'Inspiring': 'uplifting atmosphere with bright lighting'
    },
    'Comedy': {
      'Light': 'bright, cheerful setting',
      'Satirical': 'exaggerated expressions and poses',
      'Quirky': 'unusual perspective, whimsical elements'
    },
    'Thriller': {
      'Mysterious': 'dark shadows, high contrast lighting',
      'Suspenseful': 'tense atmosphere with dramatic shadows',
      'Dark': 'noir-style lighting with deep shadows'
    },
    'Action': {
      'Exciting': 'dynamic poses, energetic composition',
      'Intense': 'dramatic angles, high contrast',
      'Epic': 'grand scale, heroic positioning'
    },
    'Horror': {
      'Scary': 'eerie lighting, unsettling atmosphere',
      'Creepy': 'disturbing elements, unnatural shadows',
      'Disturbing': 'psychological tension, uncomfortable framing'
    },
    'Romance': {
      'Romantic': 'soft, warm lighting with intimate positioning',
      'Sweet': 'gentle lighting, tender expressions',
      'Passionate': 'dramatic lighting, intense emotional connection'
    }
  };

  const genreStyles = styles[genre as keyof typeof styles];
  if (genreStyles) {
    const toneStyle = genreStyles[tone as keyof typeof genreStyles];
    if (toneStyle) return toneStyle;
  }

  return 'clear, simple composition';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Generate-single-frame function called');

  try {
    const { shot, genre, tone, aspectRatio = "16:9" } = await req.json();
    
    if (!shot || !genre || !tone) {
      throw new Error('Missing required parameters: shot, genre, tone');
    }

    console.log(`Generating single frame for shot ${shot.shotNumber}`);

    const visualStyle = getVisualStyle(genre, tone);
    console.log(`Visual style for ${genre}/${tone}: ${visualStyle}`);

    // Summarize long descriptions to avoid overwhelming the AI
    const summarizeDescription = (desc: string): string => {
      if (desc.length <= 100) return desc;
      
      // Extract key visual elements and camera action
      const words = desc.split(' ');
      const keyWords = words.slice(0, 15).join(' ');
      return keyWords + (words.length > 15 ? '...' : '');
    };

    const cameraInstructions = getCameraInstructions(shot.cameraAngle);
    
    const cameraSetup = shot.cameraAngle.toLowerCase().includes('close') ? '85mm portrait lens, f/2.0' :
                        shot.cameraAngle.toLowerCase().includes('medium') ? '50mm standard lens, f/2.8' :
                        shot.cameraAngle.toLowerCase().includes('wide') ? '24mm wide lens, f/4.0' :
                        '50mm lens, f/2.8';

    const CINEMATIC_STYLE_PREFIX = getCinematicStylePrefix(aspectRatio);
    const outputFormat = aspectRatio === "9:16" ? "9:16 vertical format" : "16:9 widescreen format";

    const imagePrompt = `PROFESSIONAL FILM STORYBOARD FRAME - Pre-production planning reference for ${genre} film

${cameraInstructions}

CAMERA TECHNICAL:
Lens: ${cameraSetup}
Shot Type: ${shot.cameraAngle}

SCENE COMPOSITION:
Location/Setting: ${shot.visualElements || 'interior setting'}
Characters Present: ${shot.characters?.join(', ') || 'person'}
Scene Action: ${shot.sceneAction || shot.description}
Visual Mood: ${visualStyle}

PRODUCTION NOTES:
- Professional film set environment only
- Realistic character positioning and spatial relationships
- Clear blocking and composition
- Production design reference
- Shot on professional cinema camera
- ${outputFormat} aspect ratio

${NEGATIVE_PROMPT}

OUTPUT REQUIREMENT: Single photographic-quality film frame only, as if captured on set during production. No additional framing, borders, or meta-elements of any kind.`;

    console.log(`Generating image for shot ${shot.shotNumber} with prompt length: ${imagePrompt.length}`);
    console.log(`Full prompt: ${imagePrompt}`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Determine image size based on aspect ratio (gpt-image-1 supports 1536x1024, 1024x1536, 1024x1024)
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
        output_format: 'png',
        output_compression: 90,
        moderation: 'auto'
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`OpenAI Image API error for shot ${shot.shotNumber}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        apiKeyExists: !!openAIApiKey,
        promptLength: imagePrompt.length
      });

      // Return a fallback SVG for content policy violations or other errors
      const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f3f4f6"/>
          <text x="200" y="120" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">
            Storyboard Frame ${shot.shotNumber}
          </text>
          <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">
            ${shot.cameraAngle}
          </text>
          <text x="200" y="170" text-anchor="middle" font-family="Arial" font-size="10" fill="#9ca3af">
            ${shot.description.substring(0, 80)}${shot.description.length > 80 ? '...' : ''}
          </text>
          <text x="200" y="190" text-anchor="middle" font-family="Arial" font-size="10" fill="#9ca3af">
            Content policy prevented generation
          </text>
        </svg>
      `)}`;

      return new Response(JSON.stringify({ 
        imageData: fallbackSvg,
        shotNumber: shot.shotNumber,
        error: 'Content policy violation - using fallback'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const imageData = `data:image/png;base64,${data.data[0].b64_json}`;

    console.log(`Successfully generated image for shot ${shot.shotNumber}`);

    return new Response(JSON.stringify({ 
      imageData,
      shotNumber: shot.shotNumber,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-single-frame function:', error);
    
    // Return a fallback SVG for any error
    const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#fef2f2"/>
        <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="14" fill="#dc2626">
          Generation Error
        </text>
        <text x="200" y="160" text-anchor="middle" font-family="Arial" font-size="12" fill="#dc2626">
          Please try again
        </text>
      </svg>
    `)}`;

    return new Response(JSON.stringify({ 
      imageData: fallbackSvg,
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});