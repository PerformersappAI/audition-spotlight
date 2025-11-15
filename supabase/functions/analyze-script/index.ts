import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// Comprehensive Scene Analysis Knowledge Base
const SCENE_ANALYSIS_FRAMEWORK = {
  core_framework: {
    scene_purpose: [
      "Why does this scene exist?",
      "What narrative purpose does it serve (reveal, tension, reversal, setup, payoff)?",
      "What MUST change in the audience or character by the end?"
    ],
    character_objectives: [
      "What does each character want?",
      "What is each character afraid of losing?",
      "What obstacles exist (internal/external)?",
      "How does the power dynamic shift during the scene?"
    ],
    emotional_arc: [
      "What is the emotional anchor of this scene?",
      "Where does the emotional state start and end?",
      "Is the emotion straightforward or contrasted?"
    ],
    visual_spatial_grammar: [
      "What must the audience SEE to understand the scene?",
      "Where should the camera be to reflect the emotional power?",
      "How is blocking used to support story?",
      "Are there insert shots carrying symbolism?"
    ],
    sound_rhythm: [
      "What does the soundscape communicate?",
      "Is silence used to build tension?",
      "What pacing supports the scene's emotion?"
    ],
    stakes: [
      "What is at risk for the character?",
      "How are the stakes visually communicated?"
    ],
    transitions: [
      "How does the previous scene feed into this?",
      "How does this scene prepare or launch the next?"
    ]
  },
  universal_checklist: [
    "Scene objective",
    "Character objectives",
    "Conflict and obstacles",
    "Emotional beat and arc",
    "Stakes",
    "Visual language and blocking",
    "Sound and rhythm",
    "Scene geography",
    "Insert shots and symbolism",
    "Transitions in and out",
    "Director-specific style layer"
  ]
};

// Director-specific scene analysis methods
const DIRECTOR_KNOWLEDGE = {
  "Christopher Nolan": {
    philosophy: "Time, memory, and layered narrative structures. Focus on non-linear storytelling, practical effects over CGI, and complex character psychology.",
    style_focus: [
      "Scene geography and physical space",
      "Temporal structure (non-linear possibilities)",
      "Insert shots as thematic anchors",
      "Practical effects and in-camera realism",
      "Momentum-driven storytelling"
    ],
    internal_questions: [
      "How does spatial layout intensify the emotional arc?",
      "Does timing (chronological or not) enhance tension?",
      "What object or detail anchors the theme?"
    ],
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
    style_focus: [
      "Emotional clarity",
      "Wide → medium → close-up progression",
      "Camera as audience POV guide",
      "Light as emotional language"
    ],
    internal_questions: [
      "What emotion must the audience feel?",
      "How can lighting and framing guide that emotion?",
      "When should the camera hold back vs get intimate?"
    ],
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
  "David Fincher": {
    philosophy: "Hyper-precise control and psychological depth. Perfection through repetition and meticulous planning.",
    style_focus: [
      "Hyper-precise blocking",
      "Controlled camera and compositions",
      "Multiple takes to refine micro-truth",
      "Cold, analytical tension"
    ],
    internal_questions: [
      "What is the most honest psychological truth here?",
      "Where does subtle tension live in the frame?",
      "What small detail changes the meaning?"
    ],
    techniques: [
      "Use controlled camera movements",
      "Create psychological tension through precision",
      "Employ dark, desaturated color palettes",
      "Build atmosphere through meticulous detail",
      "Use music to create unease"
    ],
    signature: "Psychological precision with dark aesthetics",
    examples: "Se7en's oppressive atmosphere, Fight Club's unreliable narrator, Gone Girl's manipulation"
  },
  "Quentin Tarantino": {
    philosophy: "Genre deconstruction through dialogue-driven character studies. Pop culture references and non-linear narrative.",
    style_focus: [
      "Dialogue-driven power dynamics",
      "Tension built through verbal rhythm",
      "Long builds with sudden release",
      "Music as ironic or thematic commentary"
    ],
    internal_questions: [
      "Where does the power shift in the conversation?",
      "How can dialogue rhythm build tension?",
      "What music elevates or contradicts the moment?"
    ],
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
  "James Cameron": {
    philosophy: "Clear storytelling with emotional universality. Technical innovation serving character-driven narratives.",
    style_focus: [
      "Clear objectives for every character",
      "Geographical clarity in action",
      "Emotional simplicity inside spectacle",
      "Engineering the scene through logic"
    ],
    internal_questions: [
      "Is every character's objective clear?",
      "Is the action geographically understandable?",
      "Is the emotional through-line universal?"
    ],
    techniques: [
      "Create clear character motivations",
      "Use technology to enhance emotion",
      "Build action with spatial clarity",
      "Focus on universal human themes",
      "Employ practical and digital effects seamlessly"
    ],
    signature: "Epic scale with emotional intimacy",
    examples: "Titanic's romance within disaster, Avatar's environmental themes, Terminator's relentless pursuit"
  },
  "Denis Villeneuve": {
    philosophy: "Atmospheric storytelling focused on mood and visual poetry. Science fiction as vehicle for human emotion.",
    style_focus: [
      "Atmosphere and mood",
      "Silence as tension",
      "Environmental storytelling",
      "Slow escalation → sharp release"
    ],
    internal_questions: [
      "What is the internal life beneath the surface?",
      "How can atmosphere communicate emotion?",
      "What does this space say about the character?"
    ],
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
  "Alfonso Cuarón": {
    philosophy: "Immersive realism through technical mastery. Long takes that place audience inside the experience.",
    style_focus: [
      "Immersive long takes",
      "Naturalistic movement",
      "Environmental realism",
      "Camera movement as emotional language"
    ],
    internal_questions: [
      "Can the audience be immersed rather than shown?",
      "How does movement reflect rising stakes?",
      "What details need space to breathe?"
    ],
    techniques: [
      "Use extended long takes",
      "Create immersive camera work",
      "Build realistic environments",
      "Focus on human experience in crisis",
      "Employ naturalistic lighting"
    ],
    signature: "Immersive realism with technical virtuosity",
    examples: "Children of Men's long takes, Gravity's survival tension, Roma's personal history"
  },
  "Martin Scorsese": {
    philosophy: "Moral complexity and character psychology. Visual energy reflecting internal chaos.",
    style_focus: [
      "Moral conflict",
      "Dynamic tracking shots",
      "Internal monologue or voiceover",
      "Music as commentary"
    ],
    internal_questions: [
      "What moral choice lives under this moment?",
      "What is the rhythm (frantic, smooth, spiraling)?",
      "What shot expresses the character's inner chaos?"
    ],
    techniques: [
      "Use dynamic camera movement",
      "Employ freeze frames and slow motion",
      "Create moral ambiguity",
      "Use popular music as counterpoint",
      "Build energy through editing rhythm"
    ],
    signature: "Kinetic energy with moral complexity",
    examples: "Goodfellas' Copacabana shot, Taxi Driver's isolation, The Departed's double lives"
  },
  "Clint Eastwood": {
    philosophy: "Simplicity and authenticity. Trust actors and minimal interference for emotional truth.",
    style_focus: [
      "Simplicity and minimal setups",
      "Trusting actors with space",
      "2–3 take philosophy",
      "Authentic emotional truth"
    ],
    internal_questions: [
      "What is the simplest true version of this moment?",
      "Is anything here over-directed?",
      "Can the actor bring more if I step back?"
    ],
    techniques: [
      "Use minimal coverage",
      "Trust actor instincts",
      "Employ natural lighting",
      "Create understated emotional moments",
      "Focus on character authenticity"
    ],
    signature: "Understated emotional truth",
    examples: "Unforgiven's moral weight, Million Dollar Baby's restraint, Gran Torino's redemption"
  },
  "Greta Gerwig": {
    philosophy: "Coming-of-age stories told with authenticity and emotional truth. Female perspective on universal experiences.",
    style_focus: [
      "Relationship-driven storytelling",
      "Emotional realism",
      "Micro-gestures and human truth",
      "Naturalistic pacing"
    ],
    internal_questions: [
      "How does this moment change their relationship?",
      "What subtle behavior expresses emotion better than words?",
      "Is this authentic to real human experience?"
    ],
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
    style_focus: [
      "Social commentary through genre",
      "Layered symbolism",
      "Paranoia and isolation",
      "Subverted expectations"
    ],
    internal_questions: [
      "What social anxiety does this scene explore?",
      "What symbols carry deeper meaning?",
      "How can genre conventions be subverted?"
    ],
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

    // Build comprehensive director-specific analysis context
    let directorContext = "";
    if (selectedDirectors.length > 0) {
      directorContext = selectedDirectors.map((director: any) => {
        const knowledge = DIRECTOR_KNOWLEDGE[director as keyof typeof DIRECTOR_KNOWLEDGE];
        if (knowledge) {
          return `
**${director}'s Analytical Lens:**

Philosophy: ${knowledge.philosophy}

Style Focus:
${knowledge.style_focus.map((f: string) => `- ${f}`).join('\n')}

Internal Questions:
${knowledge.internal_questions.map((q: string) => `- ${q}`).join('\n')}

Key Techniques:
${knowledge.techniques.map((t: string) => `- ${t}`).join('\n')}

Signature: ${knowledge.signature}
Examples: ${knowledge.examples}`;
        }
        return "";
      }).filter(Boolean).join('\n\n');
    }

    const systemPrompt = `You are an expert script analyst with deep knowledge of scene construction, character psychology, and directorial approaches.

CRITICAL INSTRUCTION: You are analyzing a SPECIFIC scene provided by the user. Every answer, every insight, every recommendation MUST be directly based on the actual content of this scene. 

DO NOT provide generic filmmaking advice or use placeholder names. Extract ACTUAL character names from the scene text (look for character names in ALL CAPS before dialogue, or in action lines). Analyze their SPECIFIC actions, dialogue, and motivations as they appear IN THIS SCENE.

Reference specific moments, dialogue lines, or actions from the scene in your analysis.

**COMPREHENSIVE SCENE ANALYSIS FRAMEWORK:**

Analyze THIS SPECIFIC SCENE through these essential dimensions:

1. **Scene Purpose (answer for THIS scene):**
   - Why does THIS specific scene exist in the story?
   - What specific narrative purpose does it serve (reveal, tension, reversal, setup, payoff)?
   - What MUST change by the end of THIS scene?
   - Quote or reference specific moments that reveal this purpose

2. **Character Objectives & Dynamics (from THIS scene's content):**
   - Extract each character's ACTUAL name from the scene text
   - What does each character specifically want IN THIS SCENE? (Reference their dialogue or actions)
   - What specific obstacle exists in THIS scene?
   - Describe the specific power dynamics and how they shift (reference specific moments)
   - What is each character afraid of losing IN THIS SCENE?

3. **Emotional Arc (of THIS scene):**
   - What specific emotion anchors THIS scene?
   - Describe the emotional journey from beginning to end of THIS scene
   - Reference specific moments or dialogue from the scene

4. **Visual & Spatial Grammar (for THIS scene specifically):**
   - What specific locations/settings appear in THIS scene?
   - Suggest camera positions that reflect the emotional dynamics of THIS scene
   - Reference specific blocking moments or character movements from the scene
   - What insert shots would work for THIS scene's specific props or objects?

5. **Sound & Rhythm (for THIS scene):**
   - What soundscape would fit THIS scene's specific setting and mood?
   - Where in THIS scene should silence be used?
   - What pacing supports THIS scene's specific emotional arc?

6. **Stakes (in THIS scene):**
   - What is specifically at risk for each character IN THIS SCENE?
   - How can the stakes be visually communicated based on THIS scene's content?

7. **Transitions:**
   - Based on THIS scene's content, what might have led to this moment?
   - Where does THIS scene leave the characters emotionally/dramatically?

${directorContext ? `\n**DIRECTOR-SPECIFIC ANALYSIS:**\n${directorContext}\n\nApply each director's style focus to THIS SPECIFIC SCENE. Answer their internal questions using actual content from the scene. Provide specific recommendations aligned with their methods for executing THIS PARTICULAR SCENE.\n` : ''}

Provide analysis in this exact JSON format. ALL FIELDS MUST REFERENCE THE ACTUAL SCENE CONTENT:

{
  "sceneSynopsis": "Summary of THIS scene's main events (reference specific actions/dialogue)",
  "castOfCharacters": [
    {
      "name": "ACTUAL character name from the scene (NEVER use 'Character 1', 'Main Character', etc.)",
      "description": "Brief description based on THIS scene",
      "role": "protagonist|antagonist|supporting|background",
      "objective": "What this specific character wants IN THIS SCENE (reference their dialogue/actions)",
      "fear": "What this character is afraid of losing IN THIS SCENE (based on scene content)"
    }
  ],
  "characterDescriptions": [
    {
      "name": "ACTUAL character name",
      "personality": "Traits evident IN THIS SCENE",
      "motivation": "What drives this character IN THIS SCENE (reference specific moments)",
      "arcTrajectory": "How this character develops IN THIS SCENE"
    }
  ],
  "emotionalBeats": ["Specific emotional shifts in THIS scene with references to actual moments"],
  "visualSuggestions": ["Specific camera ideas for THIS scene's locations, blocking, and moments"],
  "soundAndPacing": ["Soundscape for THIS scene's specific setting and mood"],
  "stakesAndPurpose": ["What's specifically at risk IN THIS SCENE and why it exists"],
  "characterMotivations": ["Specific motivations in THIS scene with dialogue/action references"],
  "directorNotes": ["Actionable guidance for executing THIS SPECIFIC SCENE"],
  "castingTips": ["Casting based on THIS scene's character requirements"],
  "technicalRequirements": ["Specific shots needed for THIS scene's locations and moments"],
  "estimatedDuration": "X-Y minutes",
  "difficultyLevel": "Beginner|Intermediate|Advanced",
  "keyMoments": ["Specific critical moments from THIS scene"],
  "directorInsights": ["Director-specific insights for THIS scene"]
}

Remember: Base EVERY answer on the ACTUAL scene content. Quote or reference specific moments. Use REAL character names from the scene text.`;

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
        max_completion_tokens: 6000,
        response_format: { type: "json_object" }
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

    let analysisResult: any;
    let confidenceScore = 0.9; // Default high confidence for successful parsing
    try {
      analysisResult = JSON.parse(data.choices[0].message.content);
      
      // Validate required fields are present and meaningful
      const requiredFields = ['sceneSynopsis', 'castOfCharacters', 'emotionalBeats'];
      const isValid = requiredFields.every((field: string) => 
        analysisResult[field] && 
        (Array.isArray(analysisResult[field]) ? analysisResult[field].length > 0 : analysisResult[field].trim().length > 10)
      );
      
      if (!isValid) {
        console.warn('AI response lacks required detailed content');
        confidenceScore = 0.4; // Low confidence for incomplete responses
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw AI response:', data.choices[0].message.content);
      
      return new Response(JSON.stringify({ 
        error: 'Unable to complete scene analysis. The response was incomplete or invalid. This may happen with very long scenes. Try analyzing a shorter scene or contact support if the issue persists.',
        success: false,
        retryable: true,
        rawError: parseError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Script analysis completed successfully');
    
    return new Response(JSON.stringify({ 
      success: true, 
      analysis: analysisResult,
      confidenceScore,
      isAiGenerated: true,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-script function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});