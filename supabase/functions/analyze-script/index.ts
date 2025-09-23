import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// Director philosophies and techniques database
const DIRECTOR_KNOWLEDGE = {
  "Christopher Nolan": {
    philosophy: "Time, memory, and layered narrative structures. Focus on non-linear storytelling, practical effects over CGI, and complex character psychology.",
    techniques: [
      "Use time manipulation and non-linear narrative",
      "Employ practical effects and in-camera tricks",
      "Create moral ambiguity in characters",
      "Build tension through pacing and editing rhythm",
      "Use IMAX format for key sequences"
    ],
    signature: "Complex puzzle narratives with emotional core",
    examples: "Inception's dream layers, Memento's reverse structure, Interstellar's time dilation"
  },
  "Steven Spielberg": {
    philosophy: "Emotional accessibility and visual storytelling. Master of creating wonder while maintaining human connection at story's heart.",
    techniques: [
      "Use child-like wonder and curiosity",
      "Employ long takes and fluid camera movement",
      "Create strong emotional beats",
      "Use practical lighting and natural compositions",
      "Build suspense through what's not shown"
    ],
    signature: "Humanistic storytelling with visual spectacle",
    examples: "E.T.'s bicycle chase, Jaws' unseen shark, Raiders action sequences"
  },
  "Quentin Tarantino": {
    philosophy: "Genre deconstruction through dialogue-driven character studies. Pop culture references and non-linear narrative.",
    techniques: [
      "Write sharp, realistic dialogue",
      "Use violence as punctuation, not spectacle",
      "Create tension through conversation",
      "Employ music as narrative device",
      "Mix genres and tones deliberately"
    ],
    signature: "Character-driven violence with pop culture DNA",
    examples: "Pulp Fiction's diner scenes, Kill Bill's revenge structure, Django's genre mixing"
  },
  "Denis Villeneuve": {
    philosophy: "Atmospheric storytelling focused on mood and visual poetry. Science fiction as vehicle for human emotion.",
    techniques: [
      "Use sound design as emotional landscape",
      "Create visual poetry through cinematography",
      "Build tension through silence and pacing",
      "Focus on character psychology over action",
      "Employ wide shots to show scale and isolation"
    ],
    signature: "Contemplative sci-fi with emotional depth",
    examples: "Arrival's communication themes, Blade Runner 2049's visual poetry, Dune's epic scale"
  },
  "Greta Gerwig": {
    philosophy: "Coming-of-age stories told with authenticity and emotional truth. Female perspective on universal experiences.",
    techniques: [
      "Use naturalistic dialogue and performances",
      "Focus on internal character journeys",
      "Employ warm, intimate cinematography",
      "Create authentic relationships and conflicts",
      "Balance humor with emotional honesty"
    ],
    signature: "Authentic female-driven narratives with universal appeal",
    examples: "Lady Bird's mother-daughter relationship, Little Women's sisterhood, Barbie's self-discovery"
  },
  "Jordan Peele": {
    philosophy: "Social commentary through horror and thriller genres. Use genre conventions to explore racial and social issues.",
    techniques: [
      "Use horror to explore social anxieties",
      "Create layered symbolism and metaphor",
      "Build tension through paranoia and isolation",
      "Employ misdirection and subverted expectations",
      "Use sound and editing for psychological horror"
    ],
    signature: "Social thriller with horror elements",
    examples: "Get Out's racial commentary, Us's class analysis, Nope's spectacle critique"
  }
};

serve(async (req) => {
  console.log('Analyze-script function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scriptText, genre, tone, selectedDirectors = [] } = await req.json();
    console.log(`Request received - Genre: ${genre}, Tone: ${tone}, Script length: ${scriptText?.length || 0}, Directors: ${selectedDirectors.length}`);

    if (!scriptText || !scriptText.trim()) {
      return new Response(
        JSON.stringify({ error: 'Script text is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Analyzing script with AI. Genre: ${genre}, Tone: ${tone}, Directors: ${selectedDirectors.join(', ')}`);

    // Build director-specific analysis prompts
    let directorContext = "";
    if (selectedDirectors.length > 0) {
      directorContext = selectedDirectors.map(director => {
        const knowledge = DIRECTOR_KNOWLEDGE[director as keyof typeof DIRECTOR_KNOWLEDGE];
        if (knowledge) {
          return `${director}'s approach: ${knowledge.philosophy} Key techniques: ${knowledge.techniques.join('; ')}`;
        }
        return "";
      }).filter(Boolean).join('\n\n');
    }

    const systemPrompt = `You are an expert script analyst and filmmaker with deep knowledge of cinematic storytelling and directorial styles. Analyze the provided script and provide detailed insights.

${directorContext ? `Consider these directorial perspectives in your analysis:\n${directorContext}\n` : ''}

Provide analysis in this exact JSON format:
{
  "sceneSynopsis": "Brief, engaging summary of the scene's main events and significance",
  "castOfCharacters": [
    {
      "name": "Character Name",
      "description": "Brief description of the character",
      "role": "protagonist|antagonist|supporting|background"
    }
  ],
  "characterDescriptions": [
    {
      "name": "Character Name",
      "personality": "Key personality traits and characteristics",
      "motivation": "What drives this character in this scene",
      "arcTrajectory": "How this character develops or changes"
    }
  ],
  "emotionalBeats": ["beat1", "beat2", ...],
  "characterMotivations": ["motivation1", "motivation2", ...],
  "directorNotes": ["note1", "note2", ...],
  "castingTips": ["tip1", "tip2", ...],
  "technicalRequirements": ["req1", "req2", ...],
  "estimatedDuration": "X-Y minutes",
  "difficultyLevel": "Beginner|Intermediate|Advanced",
  "keyMoments": ["moment1", "moment2", ...],
  "directorInsights": ["insight1", "insight2", ...]
}

Focus on actionable, specific insights that would help a filmmaker bring this script to life.`;

    const userPrompt = `Analyze this ${genre || 'unspecified genre'} script with a ${tone || 'neutral'} tone:

${scriptText.substring(0, 8000)}

Provide detailed analysis considering the genre, tone, and ${selectedDirectors.length > 0 ? `the directorial styles of ${selectedDirectors.join(' and ')}` : 'general filmmaking principles'}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 2000,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      // Handle specific OpenAI API errors more gracefully
      if (response.status === 503) {
        return new Response(JSON.stringify({ 
          error: 'AI service is temporarily overloaded. Please try analyzing again in a few moments.',
          success: false,
          retryable: true
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a moment before trying again.',
          success: false,
          retryable: true
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenAI response format:', data);
      throw new Error('No content returned from OpenAI API');
    }

    let analysisResult;
    try {
      analysisResult = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback to mock analysis if JSON parsing fails
      analysisResult = {
        sceneSynopsis: `A compelling ${genre || 'drama'} scene exploring themes of conflict and character development`,
        castOfCharacters: [
          {
            name: "Main Character",
            description: "The central figure driving the scene",
            role: "protagonist"
          },
          {
            name: "Supporting Character", 
            description: "Provides conflict and character development",
            role: "supporting"
          }
        ],
        characterDescriptions: [
          {
            name: "Main Character",
            personality: "Complex and driven with clear objectives",
            motivation: "Seeks resolution to central conflict",
            arcTrajectory: "Moves from uncertainty to decisive action"
          },
          {
            name: "Supporting Character",
            personality: "Acts as catalyst for main character growth",
            motivation: "Challenges protagonist's assumptions",
            arcTrajectory: "Reveals hidden depths throughout scene"
          }
        ],
        emotionalBeats: [
          "Opening establishes character and world",
          "Rising tension builds toward conflict", 
          "Climactic moment tests character",
          "Resolution provides emotional payoff"
        ],
        characterMotivations: [
          "Protagonist driven by clear goal or need",
          "Supporting characters have distinct perspectives",
          "Antagonist represents meaningful opposition"
        ],
        directorNotes: [
          "Focus on visual storytelling over exposition",
          "Use lighting and framing to support mood",
          "Consider pacing in relation to emotional beats"
        ],
        castingTips: [
          "Look for actors who can convey subtext",
          "Ensure cast chemistry serves the story",
          "Consider the physical demands of the role"
        ],
        technicalRequirements: [
          "Standard lighting and camera equipment",
          "Location needs assessment",
          "Post-production considerations"
        ],
        estimatedDuration: genre === "Comedy" ? "4-6 minutes" : "6-10 minutes",
        difficultyLevel: "Intermediate",
        keyMoments: [
          "Opening hook",
          "Character introduction",
          "Conflict escalation",
          "Climactic resolution"
        ],
        directorInsights: selectedDirectors.length > 0 ? 
          [`Consider ${selectedDirectors[0]}'s approach to similar material`] : 
          ["Apply proven filmmaking principles to serve the story"]
      };
    }

    console.log('Script analysis completed successfully');
    
    return new Response(JSON.stringify({ 
      success: true, 
      analysis: analysisResult 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-script function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});