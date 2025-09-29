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
}

function getVisualStyle(genre: string, tone: string): string {
  const styles = {
    'Drama': {
      'Emotional': 'warm color palette with natural lighting, intimate close-ups and medium shots, emotional depth in compositions',
      'Serious': 'muted earth tones, deliberate pacing, thoughtful framing with meaningful negative space',
      'Inspiring': 'uplifting warm tones, dynamic angles, inspiring compositions with aspirational lighting'
    },
    'Comedy': {
      'Light': 'bright and colorful palette, playful compositions, energetic framing with comedic timing',
      'Satirical': 'exaggerated visual elements, bold contrasts, ironic compositions with clever visual metaphors',
      'Quirky': 'unconventional angles, whimsical color choices, unique visual perspective with playful elements'
    },
    'Thriller': {
      'Mysterious': 'high contrast lighting with stark shadows, desaturated color palette, tense compositions with dramatic chiaroscuro lighting, muted colors, and enigmatic atmosphere',
      'Suspenseful': 'moody lighting with deep shadows, tension-building angles, atmospheric depth with noir influences',
      'Dark': 'noir-inspired cinematography, heavy shadows, cold color temperature with ominous undertones'
    },
    'Action': {
      'Exciting': 'dynamic camera angles, vibrant colors, fast-paced visual energy with motion blur effects',
      'Intense': 'high contrast lighting, aggressive framing, adrenaline-inducing compositions',
      'Epic': 'grand scale compositions, heroic lighting, cinematic scope with dramatic perspectives'
    },
    'Horror': {
      'Scary': 'low-key lighting, unsettling angles, psychological tension through visual composition',
      'Creepy': 'eerie atmosphere, disturbing visual elements, unnatural color grading',
      'Disturbing': 'psychological horror aesthetics, uncomfortable framing, haunting visual metaphors'
    },
    'Romance': {
      'Romantic': 'soft warm lighting, intimate compositions, beautiful color harmony with dreamy aesthetics',
      'Sweet': 'pastel color palette, gentle lighting, tender visual moments',
      'Passionate': 'dramatic romantic lighting, intense emotional framing, passionate color schemes'
    }
  };

  const genreStyles = styles[genre as keyof typeof styles];
  if (genreStyles) {
    const toneStyle = genreStyles[tone as keyof typeof genreStyles];
    if (toneStyle) return toneStyle;
  }

  return 'cinematic composition with professional lighting and visual storytelling';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Generate-single-frame function called');

  try {
    const { shot, genre, tone } = await req.json();
    
    if (!shot || !genre || !tone) {
      throw new Error('Missing required parameters: shot, genre, tone');
    }

    console.log(`Generating single frame for shot ${shot.shotNumber}`);

    const visualStyle = getVisualStyle(genre, tone);
    console.log(`Visual style for ${genre}/${tone}: ${visualStyle}`);

    // Construct safe, professional storyboard prompt
    const charactersText = shot.characters && shot.characters.length > 0
      ? `People in scene: ${shot.characters.length} character(s)`
      : '';

    // Create a safe, professional prompt focusing on cinematography
    const imagePrompt = `Professional storyboard illustration in black and white sketch style showing:

Scene setup: ${shot.description}
Camera perspective: ${shot.cameraAngle} 
Visual composition: ${shot.visualElements}
${charactersText}

Art style: Clean line art storyboard drawing, professional film pre-production illustration, ${visualStyle}

This should be a traditional storyboard panel with clear visual communication for film production, focusing on composition and cinematography rather than detailed character features.`;

    console.log(`Generating image for shot ${shot.shotNumber} with prompt length: ${imagePrompt.length}`);
    console.log(`Full prompt: ${imagePrompt}`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

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
        size: '1024x1024',
        quality: 'standard',
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