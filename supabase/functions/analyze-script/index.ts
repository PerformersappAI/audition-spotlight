import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);
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

    const systemPrompt = `You are an expert film director and script analyst. Your task is to analyze THIS SPECIFIC SCENE in deep detail.

**PRIMARY OBJECTIVES:**
1. FIRST: Carefully identify and list ALL characters who appear or are mentioned in this scene
2. Extract the SPECIFIC dramatic beats, action, and dialogue from THIS scene only
3. Analyze what makes THIS particular scene unique and cinematically important
4. Provide scene-specific insights that directly reference moments from the text

**SCENE ANALYSIS FRAMEWORK:**

Analyze THIS scene through these essential dimensions:

1. **Scene Purpose & Stakes:**
   - Why does THIS scene exist in the story?
   - What specific narrative purpose does it serve?
   - What MUST change by the end of THIS scene?
   - What is at risk for the characters IN THIS MOMENT?

2. **Character Objectives & Dynamics IN THIS SCENE:**
   - What does each character want IN THIS SPECIFIC MOMENT?
   - What is each character afraid of losing HERE?
   - What obstacles exist in THIS scene?
   - How does the power dynamic shift DURING THIS SCENE?

3. **Emotional Arc OF THIS SCENE:**
   - What is the emotional anchor of THIS scene?
   - Where does the emotional state start and end IN THIS SCENE?
   - How do emotions shift through THIS scene?

4. **Visual & Spatial Grammar FOR THIS SCENE:**
   - What must the audience SEE to understand THIS scene?
   - Where should the camera be for the key moments IN THIS SCENE?
   - How should blocking support the story beats IN THIS SCENE?
   - What insert shots could enhance THIS scene?

5. **Sound & Rhythm FOR THIS SCENE:**
   - What soundscape fits THIS scene?
   - Where should silence be used IN THIS SCENE?
   - What pacing supports THIS scene's emotion?

6. **Transitions:**
   - How might this scene connect to what comes before/after?

${directorContext ? `\n**DIRECTOR-SPECIFIC LENS FOR THIS SCENE:**\n${directorContext}\n\nApply the selected director's approach to THIS SPECIFIC SCENE. Reference specific moments from the scene and explain how this director would handle them.\n` : ''}

**CRITICAL: Base ALL analysis on the actual scene provided. Quote specific lines, reference specific moments, and give practical direction for shooting THIS scene.**


Provide analysis in this exact JSON format:
{
  "sceneSynopsis": "Write a detailed 4-6 sentence summary of WHAT SPECIFICALLY HAPPENS in this scene. Include: (1) The setting/location from the script, (2) Which characters are present and their relationships, (3) The main action or conflict that unfolds with specific examples, (4) Key dialogue moments or revelations (quote actual lines if possible), (5) How the scene ends and what changes. Be SPECIFIC to THIS script - no generic descriptions.",
  "castOfCharacters": [
    {
      "name": "Character Name",
      "description": "Brief description of the character",
      "role": "protagonist|antagonist|supporting|background",
      "objective": "What this character wants in the scene",
      "fear": "What this character is afraid of losing"
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
  "emotionalBeats": ["For each beat, describe WHAT SPECIFICALLY HAPPENS in the script that creates this emotion. Quote dialogue or describe specific actions. Format: 'When [specific moment from script], the audience feels [emotion] because [reason]'"],
  "visualSuggestions": ["Camera placement, blocking, insert shots, and visual symbolism ideas"],
  "soundAndPacing": ["Soundscape, use of silence, rhythm, and pacing recommendations"],
  "stakesAndPurpose": ["What's at risk, why this scene exists, what must change"],
  "characterMotivations": ["For each character BY NAME, explain what they want IN THIS SCENE and why. Reference their specific lines or actions as evidence. Format: '[CHARACTER NAME] wants [goal] because [reason from script]'"],
  "directorNotes": ["Specific, actionable direction for THIS scene. Reference specific lines or moments. Format: 'For the moment when [character] does [action], consider [specific camera/blocking/tone suggestion]'"],
  "castingTips": ["Specific casting advice for each named character based on their dialogue and actions in THIS scene. Reference specific moments that require certain acting skills."],
  "technicalRequirements": ["Specific equipment, lighting, or location needs based on the actual scene description. Reference specific moments requiring special consideration."],
  "estimatedDuration": "X-Y minutes",
  "difficultyLevel": "Beginner|Intermediate|Advanced",
  "keyMoments": ["List the 3-5 most important moments in THIS scene by describing exactly what happens. Quote dialogue or describe specific actions. Format: 'The moment when [specific thing happens] - this is crucial because [reason]'"],
  "directorInsights": ["Director-specific insights and recommendations"]
}

Focus on deep, actionable insights that help filmmakers understand the scene's psychological truth and execute it with precision.`;

    const userPrompt = `Analyze THIS SPECIFIC SCENE in detail:

${scriptText.substring(0, 8000)}

Genre: ${genre || 'unspecified'}
Tone: ${tone || 'neutral'}
${selectedDirectors.length > 0 ? `Director Style(s): ${selectedDirectors.join(', ')}` : ''}

CRITICAL INSTRUCTIONS FOR CHARACTER EXTRACTION - READ CAREFULLY:

**YOU MUST EXTRACT ACTUAL CHARACTER NAMES FROM THE SCRIPT TEXT. THIS IS MANDATORY.**

1. **SEARCH THE SCRIPT FOR CHARACTER NAMES IN THESE FORMATS:**
   a) Standard script format with character names before dialogue:
      - "JOHN:" or "JOHN" followed by dialogue
      - "SARAH:" or "SARAH" followed by dialogue
      - Look for any ALL CAPS words followed by colons or dialogue
   
   b) Character names in action lines:
      - "SARAH enters the room"
      - "JOHN looks at his watch"
      - Any consistently capitalized proper nouns
   
   c) Character names with descriptions:
      - "DETECTIVE MILLER (tired):"
      - "DR. CHEN:"
      - "MRS. JOHNSON:"

2. **EXTRACT EVERY UNIQUE CHARACTER NAME YOU FIND**
   - Make a list of ALL character names that appear in the script
   - Use their EXACT names as written (e.g., "JOHN", "SARAH", "DETECTIVE MILLER")
   - Include ALL speaking characters and main non-speaking characters

3. **THE "castOfCharacters" ARRAY MUST CONTAIN ACTUAL NAMES:**
   Example:
   "castOfCharacters": [
     {
       "name": "JOHN SMITH",
       "role": "protagonist",
       "description": "A detective investigating...",
       "objective": "To find the truth about...",
       "fear": "Losing his badge..."
     },
     {
       "name": "SARAH CHEN",
       "role": "supporting",
       "description": "John's partner who...",
       "objective": "To protect John from...",
       "fear": "Betraying her oath..."
     }
   ]

4. **FORBIDDEN - NEVER USE THESE:**
   ❌ "Main Character"
   ❌ "Supporting Character" 
   ❌ "Protagonist"
   ❌ "Antagonist"
   ❌ "Character A"
   ❌ Any generic placeholder

5. **IF YOU TRULY CANNOT FIND ANY NAMES:**
   - Only then use descriptive names like "The Detective" or "The Stranger"
   - But this should be extremely rare - scripts almost always have character names

**REMEMBER: Look at the actual script text provided and extract the names you see there. They are written in the script!**

SCENE ANALYSIS INSTRUCTIONS:
1. Extract the specific action, dialogue, and dramatic beats from THIS scene
2. Analyze what makes THIS particular scene unique and important
3. Provide scene-specific insights that directly reference moments from the uploaded text
4. Give directors practical, actionable guidance for shooting THIS scene
5. Consider the directorial style(s) and how they would approach THIS specific scene

Make your analysis deeply personal to this scene - reference specific lines, actions, and moments.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 3000,
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

    // Helper function to extract actual character names from script
    const extractCharacterNames = (script: string): string[] => {
      const names: Set<string> = new Set();
      
      // Match character names before dialogue (ALL CAPS lines)
      const dialogueMatches = script.match(/^([A-Z][A-Z\s'-]+)(\s*\(.*?\))?[\s:]/gm);
      if (dialogueMatches) {
        dialogueMatches.forEach(match => {
          const name = match.replace(/\(.*?\)/g, '').replace(/[:\s]/g, '').trim();
          if (name.length > 1 && name.length < 40) {
            names.add(name);
          }
        });
      }
      
      return Array.from(names);
    };

    // Helper to detect generic character names
    const isGenericName = (name: string): boolean => {
      const genericNames = [
        'main character', 'supporting character', 'protagonist', 'antagonist',
        'character a', 'character b', 'character 1', 'character 2',
        'lead character', 'primary character', 'secondary character',
        'the protagonist', 'the antagonist', 'narrator'
      ];
      return genericNames.some(generic => name.toLowerCase().includes(generic));
    };

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

      // Check for generic character names and replace with extracted ones
      if (analysisResult.castOfCharacters && Array.isArray(analysisResult.castOfCharacters)) {
        const hasGenericNames = analysisResult.castOfCharacters.some((char: any) => 
          isGenericName(char.name || '')
        );
        
        if (hasGenericNames) {
          console.warn('Detected generic character names, extracting from script...');
          const extractedNames = extractCharacterNames(scriptText);
          console.info(`Extracted actual names from script: ${extractedNames.join(', ')}`);
          
          if (extractedNames.length > 0) {
            // Replace generic names with extracted ones
            analysisResult.castOfCharacters = extractedNames.map((name, index) => ({
              name,
              description: analysisResult.castOfCharacters[index]?.description || 
                          (index === 0 ? "Primary character in the scene" : "Character in the scene"),
              role: analysisResult.castOfCharacters[index]?.role || 
                   (index === 0 ? "protagonist" : "supporting"),
              objective: analysisResult.castOfCharacters[index]?.objective,
              fear: analysisResult.castOfCharacters[index]?.fear
            }));
            
            // Also update characterDescriptions
            if (analysisResult.characterDescriptions && Array.isArray(analysisResult.characterDescriptions)) {
              analysisResult.characterDescriptions = extractedNames.map((name, index) => ({
                name,
                personality: analysisResult.characterDescriptions[index]?.personality || 
                           "Character analysis available with full AI processing",
                motivation: analysisResult.characterDescriptions[index]?.motivation || 
                          "Character motivation available with full AI processing",
                arcTrajectory: analysisResult.characterDescriptions[index]?.arcTrajectory || 
                             "Character arc available with full AI processing"
              }));
            }
            
            confidenceScore = 0.7; // Medium confidence with name substitution
          }
        }
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw AI response:', data.choices[0]?.message?.content);
      confidenceScore = 0.0; // Zero confidence for failed analysis
      
      // Return error state instead of fake generic content
      analysisResult = {
        sceneSynopsis: "⚠️ AI analysis failed - the response could not be parsed. Please try analyzing your script again. If this persists, the AI service may be experiencing issues.",
        castOfCharacters: [],
        characterDescriptions: [],
        emotionalBeats: ["⚠️ Analysis failed - please try again"],
        characterMotivations: ["⚠️ Analysis failed - please try again"],
        directorNotes: ["⚠️ Analysis failed - please try again"],
        castingTips: ["⚠️ Analysis failed - please try again"],
        technicalRequirements: ["⚠️ Analysis failed - please try again"],
        estimatedDuration: "Unknown",
        difficultyLevel: "Unknown",
        keyMoments: ["⚠️ Analysis failed - please try again"],
        directorInsights: ["⚠️ Analysis failed - please try again"]
      };
    }

    console.log('Script analysis completed successfully');
    
    // Log character extraction for debugging
    if (analysisResult.castOfCharacters) {
      console.log('Extracted characters:', analysisResult.castOfCharacters.map((c: any) => c.name).join(', '));
      console.log('Character count:', analysisResult.castOfCharacters.length);
    } else {
      console.log('WARNING: No castOfCharacters in analysis result!');
    }
    
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