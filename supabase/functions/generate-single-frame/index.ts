import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Global style configuration for cinematic frames
const getCinematicStylePrefix = (aspectRatio: string = "16:9") => {
  const format = aspectRatio === "9:16" ? "9:16 vertical format (1080×1920)" : "16:9 full-bleed (1920×1080)";
  return `Cinematic film frame, ${format}, shot-on-set look, no borders, no frames, no paper, no hands, no sketchbook, no "drawn" look, not a comic panel. Clean composition, sharp focus, natural lighting, graded like a feature film.`;
};

const NEGATIVE_PROMPT = `border, frame, paper texture, page, margin, white background, hand, pencil, pen, marker, tape, Post-it, UI, watermark, text, caption, signature, drawing, comic, manga, storyboard sheet, panel lines, sketch, "concept art", letterbox, black bars, side bars`;

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

    const cameraSetup = shot.cameraAngle.toLowerCase().includes('close') ? 'close-up, 85mm lens' :
                        shot.cameraAngle.toLowerCase().includes('medium') ? 'medium shot, 50mm lens' :
                        shot.cameraAngle.toLowerCase().includes('wide') ? 'wide shot, 24mm lens' :
                        'standard framing, 50mm lens';

    const CINEMATIC_STYLE_PREFIX = getCinematicStylePrefix(aspectRatio);
    const outputFormat = aspectRatio === "9:16" ? "9:16 vertical format image only" : "16:9 full-bleed image only";

    const imagePrompt = `${CINEMATIC_STYLE_PREFIX}

Camera: ${cameraSetup}
Location: ${shot.visualElements || 'interior setting'}
Characters: ${shot.characters?.join(', ') || 'person'}
Action: ${shot.description}
Mood: ${visualStyle}

Exclude: ${NEGATIVE_PROMPT}
Output: ${outputFormat}.`;

    console.log(`Generating image for shot ${shot.shotNumber} with prompt length: ${imagePrompt.length}`);
    console.log(`Full prompt: ${imagePrompt}`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Determine image size based on aspect ratio
    const imageSize = aspectRatio === "9:16" ? "1024x1792" : "1792x1024";

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: imageSize,
        quality: 'hd',
        style: 'natural',
        response_format: 'b64_json'
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