import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SCENE_ANALYSIS_FRAMEWORK = {
  core_dimensions: [
    "Scene Purpose: Why does this scene exist? What must change?",
    "Character Objectives: What does each character want and fear?",
    "Emotional Arc: Where does emotion start and end?",
    "Visual & Spatial Grammar: What must the audience see?",
    "Sound & Rhythm: How does pacing support emotion?",
    "Stakes: What is at risk?",
    "Transitions: How does this connect to surrounding scenes?"
  ]
};

const DIRECTOR_KNOWLEDGE = {
  "Christopher Nolan": {
    focus: "Scene geography, temporal structure, practical effects",
    questions: ["How does spatial layout intensify emotion?", "Does timing enhance tension?"]
  },
  "Steven Spielberg": {
    focus: "Emotional clarity, camera as audience guide, light as emotion",
    questions: ["What emotion must the audience feel?", "How can lighting guide emotion?"]
  },
  "David Fincher": {
    focus: "Hyper-precise blocking, controlled compositions, psychological truth",
    questions: ["What is the psychological truth?", "Where does subtle tension live?"]
  },
  "Quentin Tarantino": {
    focus: "Dialogue-driven power dynamics, tension through rhythm",
    questions: ["Where does power shift?", "How can dialogue build tension?"]
  },
  "Denis Villeneuve": {
    focus: "Atmosphere and mood, silence as tension, environmental storytelling",
    questions: ["What internal life lies beneath?", "How can atmosphere communicate?"]
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, scriptText, genre, tone, selectedDirectors, analysisResult } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build context for the AI
    let contextPrompt = `You are an expert film director and script consultant. You're helping a filmmaker understand their scene better.

SCENE ANALYSIS FRAMEWORK:
${SCENE_ANALYSIS_FRAMEWORK.core_dimensions.join('\n')}

`;

    if (selectedDirectors && selectedDirectors.length > 0) {
      contextPrompt += `\nDIRECTOR PERSPECTIVES TO CONSIDER:\n`;
      selectedDirectors.forEach((dir: string) => {
        const knowledge = DIRECTOR_KNOWLEDGE[dir as keyof typeof DIRECTOR_KNOWLEDGE];
        if (knowledge) {
          contextPrompt += `\n${dir}: ${knowledge.focus}\n`;
        }
      });
    }

    if (scriptText) {
      contextPrompt += `\n\nTHE SCENE:\n${scriptText.substring(0, 2000)}${scriptText.length > 2000 ? '...' : ''}\n`;
    }

    if (genre) contextPrompt += `\nGenre: ${genre}`;
    if (tone) contextPrompt += `\nTone: ${tone}`;

    contextPrompt += `\n\nProvide practical, actionable insights. Reference specific moments from the scene. Be conversational but professional.`;

    const systemMessage = {
      role: 'system',
      content: contextPrompt
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
