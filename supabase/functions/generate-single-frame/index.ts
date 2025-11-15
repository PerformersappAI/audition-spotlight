import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NEGATIVE_PROMPT = `NO overlays, NO text, NO numbers, NO grid lines, NO technical data, NO camera measurements, NO aspect ratio markers, NO framing guides, NO watermarks, NO borders, NO labels, NO annotations, NO UI elements, NO storyboard sheet, NO paper texture, NO drawing, NO sketch, NO comic style, NO panels, NO meta elements`;

function getStrictStyleInstructions(artStyle: string): string {
  const artStyleLower = artStyle.toLowerCase();
  
  // Black & white styles - STRICTLY enforce no color
  if (artStyleLower.includes('noir') || artStyleLower.includes('film noir')) {
    return `FILM NOIR STYLE - STRICTLY BLACK AND WHITE ONLY. ABSOLUTELY NO COLOR. High contrast monochrome cinematography. Deep shadows, dramatic lighting, venetian blind shadows, rain-slicked streets aesthetic. Classic 1940s crime film look. MUST BE PURE BLACK AND WHITE. NO color whatsoever. NO realistic photography - stylized noir illustration.`;
  }
  if (artStyleLower.includes('charcoal')) {
    return `CHARCOAL DRAWING STYLE - STRICTLY BLACK AND WHITE HAND-DRAWN ART. Rough charcoal texture, smudged shading, sketch-like quality. Hand-drawn on paper aesthetic with visible charcoal strokes and grain. ABSOLUTELY NO COLOR. MUST look hand-drawn with charcoal. NOT photography. Pure monochrome sketched art.`;
  }
  if (artStyleLower.includes('pencil')) {
    return `PENCIL SKETCH STYLE - STRICTLY BLACK AND WHITE HAND-DRAWN. Clean pencil lines, graphite shading, sketch aesthetic. Hand-drawn illustration with visible pencil strokes and hatching. ABSOLUTELY NO COLOR. MUST appear hand-sketched with pencil. NOT realistic photo. Pure monochrome pencil drawing.`;
  }
  
  // Illustrated styles - NOT photography
  if (artStyleLower.includes('graphic novel')) {
    return `GRAPHIC NOVEL ILLUSTRATION - PROFESSIONAL COMIC BOOK ART STYLE. Bold ink outlines, clear panel composition, sequential art aesthetic. Similar to DC Comics, Marvel, or Image Comics style. Strong ink work with defined shapes and dramatic composition. VIBRANT COLORS with professional comic book color palette. High contrast inking with solid blacks and clear line work. MUST look like professional comic book illustration. ABSOLUTELY NOT realistic photography. NOT sketch or rough drawing - finished professional comic art with polished inking and coloring.`;
  }
  if (artStyleLower.includes('comic')) {
    return `COMIC BOOK STYLE - BOLD PROFESSIONAL COMIC ILLUSTRATION. Strong outlines, clear shapes, dramatic poses and expressions. Classic superhero comic aesthetic with dynamic action poses. Professional comic book inking and coloring. Ben-Day dots optional. VIBRANT comic book colors. MUST look like published comic book art. NOT realistic photography. NOT sketch - finished professional comic illustration.`;
  }
  if (artStyleLower.includes('watercolor')) {
    return `WATERCOLOR PAINTING STYLE - HAND-PAINTED ARTISTIC AESTHETIC. Soft color washes, wet-on-wet blending, visible brushstrokes and paper texture. Loose painterly quality with flowing colors and organic edges. Traditional watercolor on paper look. MUST appear hand-painted with watercolors. NOT photography. Artistic interpretation with painterly quality and soft edges.`;
  }
  if (artStyleLower.includes('anime')) {
    return `ANIME ART STYLE - JAPANESE ANIMATION AESTHETIC. Clean cel-shaded look, characteristic anime features (large expressive eyes, distinctive hair), smooth gradients. Studio Ghibli or modern anime series quality. Vibrant colors with smooth shading. MUST look like Japanese animation frames. NOT realistic photography. Professional anime illustration with clean lines and cel-shading.`;
  }
  if (artStyleLower.includes('3d') || artStyleLower.includes('rendered')) {
    return `3D RENDERED STYLE - COMPUTER GENERATED IMAGERY (CGI). Clean Pixar/Disney 3D animation quality, smooth surfaces, professional 3D modeling and rendering. Stylized 3D characters and environments. Professional CG animation aesthetic. MUST look like 3D rendered animation. NOT realistic photography. Polished CGI with proper lighting and materials.`;
  }
  if (artStyleLower.includes('vector')) {
    return `VECTOR ART STYLE - CLEAN DIGITAL ILLUSTRATION. Flat colors, geometric shapes, smooth curves, no texture. Adobe Illustrator style with crisp edges and solid colors. Modern minimalist illustration aesthetic. MUST look like vector graphics. NOT photography. Clean digital art with flat colors and smooth shapes.`;
  }
  if (artStyleLower.includes('cinematic')) {
    return `CINEMATIC PHOTOGRAPHIC STYLE - PROFESSIONAL FILM PHOTOGRAPHY. 35mm film quality, proper depth of field, professional cinematography lighting. Movie production quality with cinematic color grading. Professional film camera aesthetic with bokeh and proper exposure. High-budget film production look. Realistic photographic quality with dramatic cinematic composition.`;
  }
  
  // Return the original style with strong emphasis
  return `ARTISTIC STYLE: ${artStyle}. THIS IS THE PRIMARY STYLE - FOLLOW IT EXACTLY. MUST look like ${artStyle}. NOT realistic photography unless specifically a photographic style. Create in the exact aesthetic of ${artStyle} with all its characteristic visual features.`;
}

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
    const { shot, artStyle, aspectRatio = "16:9", characterDescriptions = "", characterImages = [], styleReference = "" } = await req.json();
    
    if (!shot || !artStyle) {
      throw new Error('Missing required parameters: shot, artStyle');
    }

    console.log(`Generating single frame for shot ${shot.shotNumber} with art style`);

    const cameraInstructions = getCameraInstructions(shot.cameraAngle);

    // Get strict style instructions
    const strictStyleInstructions = getStrictStyleInstructions(artStyle);

    // Construct detailed prompt using rich AI-analyzed data
    const visualDesc = shot.visualDescription || shot.sceneAction || shot.description;
    const location = shot.location || '';
    const action = shot.action || shot.description;
    const lighting = shot.lighting || '';
    const keyProps = shot.keyProps || '';
    const emotionalTone = shot.emotionalTone || '';
    
    // Build comprehensive image prompt with style FIRST for priority
    let imagePrompt = '';
    
    // CRITICAL: Art style comes FIRST for highest priority
    imagePrompt += `${strictStyleInstructions}\n\n`;
    
    // Add style reference if provided
    if (styleReference) {
      imagePrompt += `VISUAL STYLE REFERENCE: ${styleReference}\n\nMAINTAIN THIS EXACT ARTISTIC STYLE THROUGHOUT.\n\n`;
    }
    
    // Add character descriptions if provided
    if (characterDescriptions) {
      imagePrompt += `CHARACTERS IN SCENE:\n${characterDescriptions}\n\nIMPORTANT: Characters must match these exact descriptions.\n\n`;
    }

    // Character images reference
    if (characterImages && characterImages.length > 0) {
      const charNames = characterImages.map((c: any) => c.name).join(', ');
      imagePrompt += `CHARACTER REFERENCE IMAGES PROVIDED FOR: ${charNames}. Match their exact appearance from the reference photos.\n\n`;
    }
    
    // Main shot description
    imagePrompt += `SCENE: ${visualDesc}

STORYBOARD FRAME - film previsualization, professional concept art for film production

${location ? `Location: ${location}` : ''}
${shot.characters && shot.characters.length > 0 ? `Characters: ${shot.characters.join(', ')} - ${action}` : ''}
${lighting ? `Lighting: ${lighting}` : ''}
${keyProps ? `Key Props: ${keyProps}` : ''}
${emotionalTone ? `Mood: ${emotionalTone}` : ''}
${cameraInstructions}

REMEMBER: ${strictStyleInstructions}

CRITICAL EXCLUSIONS: NO photograph unless specifically requested, NO sketch if not requested, NO realistic photo if illustration style is specified, NO pencil drawing if other style is specified. MAINTAIN THE SPECIFIED ARTISTIC STYLE EXACTLY.`;

    console.log(`Generating image for shot ${shot.shotNumber} with prompt length: ${imagePrompt.length}`);
    console.log(`Full prompt: ${imagePrompt}`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Determine image size based on aspect ratio (DALL-E 3 supports 1792x1024, 1024x1792, 1024x1024)
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
        quality: 'standard', // 'standard' is better for sketch style
        style: 'natural',
        response_format: 'b64_json'
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorData);
      } catch (e) {
        errorJson = { error: { message: errorData } };
      }
      
      console.error(`OpenAI Image API error for shot ${shot.shotNumber}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        apiKeyExists: !!openAIApiKey,
        promptLength: imagePrompt.length
      });

      // Check if it's a content policy violation
      const isContentPolicy = errorJson?.error?.code === 'content_policy_violation' || 
                             errorData.includes('content_policy_violation') ||
                             errorData.includes('content policy');
      const errorMessage = isContentPolicy 
        ? 'Content policy violation - Try adjusting the scene description'
        : `Generation failed: ${errorJson?.error?.message || 'Unknown error'}`;

      // Return a more informative fallback
      const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
        <svg width="1792" height="1024" xmlns="http://www.w3.org/2000/svg">
          <rect width="1792" height="1024" fill="#fef2f2"/>
          <text x="896" y="480" text-anchor="middle" font-family="Arial" font-size="24" fill="#dc2626">
            Generation Failed
          </text>
          <text x="896" y="520" text-anchor="middle" font-family="Arial" font-size="16" fill="#991b1b">
            ${isContentPolicy ? 'Content Policy Violation' : 'Error Occurred'}
          </text>
          <text x="896" y="560" text-anchor="middle" font-family="Arial" font-size="14" fill="#991b1b">
            ${isContentPolicy ? 'Try modifying the scene description' : 'Please try again'}
          </text>
        </svg>
      `)}`;

      return new Response(JSON.stringify({ 
        imageData: fallbackSvg,
        shotNumber: shot.shotNumber,
        error: errorMessage,
        errorType: isContentPolicy ? 'content_policy' : 'generation_error'
      }), {
        status: response.status,
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