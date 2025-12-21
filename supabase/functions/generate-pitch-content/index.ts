import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  type: "logline" | "synopsis" | "vision" | "character" | "comps" | "audience" | "distribution";
  context: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json() as GenerateRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "You are an expert Hollywood screenwriter and film producer with decades of experience creating successful pitch decks for major studios. Your writing is compelling, professional, and industry-standard.";
    let userPrompt = "";

    switch (type) {
      case "logline":
        userPrompt = `Create a compelling logline (1-2 sentences) for a ${context.type || "film"} project.
Title: ${context.title || "Untitled"}
Genre: ${(context.genre as string[])?.join(", ") || "Drama"}

The logline should hook the reader immediately, establish the protagonist, their goal, and the central conflict. Make it memorable and pitchable.

Return ONLY the logline text, no quotes or explanations.`;
        break;

      case "synopsis":
        userPrompt = `Expand the following logline into a compelling 300-400 word synopsis for a ${context.type || "film"} project.

Title: ${context.title || "Untitled"}
Logline: ${context.logline}
Genre: ${(context.genre as string[])?.join(", ") || "Drama"}

The synopsis should:
- Hook the reader in the first paragraph
- Introduce the main characters and their motivations
- Describe the central conflict and rising action
- Hint at the climax without giving everything away
- Leave the reader wanting more

Write in present tense, third person. Be vivid and cinematic in your descriptions.

Return ONLY the synopsis text.`;
        break;

      case "vision":
        userPrompt = `Write a compelling Director's Vision statement for this project.

Title: ${context.title || "Untitled"}
Genre: ${(context.genre as string[])?.join(", ") || "Drama"}
Synopsis: ${context.synopsis}

The vision statement should:
- Express the director's unique perspective on the material
- Describe the visual and tonal approach
- Reference specific filmmaking techniques or influences
- Convey passion and commitment to the project
- Be 150-200 words

Write in first person as if you are the director. Be authentic and passionate.

Return ONLY the vision statement text.`;
        break;

      case "character":
        userPrompt = `Write a compelling character description for a ${context.characterRole} character in this project.

Character Name: ${context.characterName}
Role Type: ${context.characterRole}
Project Synopsis: ${context.synopsis || "Not provided"}

The description should:
- Capture the character's essence in 2-3 sentences
- Describe their arc or transformation
- Hint at their internal conflict
- Make casting directors excited about the role

Return ONLY the character description text (2-4 sentences).`;
        break;

      case "comps":
        userPrompt = `Suggest 3-4 comparable films or TV shows for this project.

Title: ${context.title || "Untitled"}
Type: ${context.type || "film"}
Logline: ${context.logline || "Not provided"}
Genre: ${(context.genre as string[])?.join(", ") || "Drama"}

For each comparable, explain WHY it's similar (tone, audience, theme, visual style, or success metrics).

Return a JSON array with this exact format:
[
  {"title": "Film Title", "year": "2022", "whySimilar": "Explanation of similarity"},
  {"title": "Film Title 2", "year": "2020", "whySimilar": "Explanation of similarity"}
]

Only return the JSON array, no other text.`;
        break;

      case "audience":
        userPrompt = `Write a market analysis for this project.

Title: ${context.title || "Untitled"}
Type: ${context.type || "film"}
Logline: ${context.logline || "Not provided"}
Genre: ${(context.genre as string[])?.join(", ") || "Drama"}
Comparable Projects: ${JSON.stringify(context.comparables) || "None specified"}

The analysis should:
- Identify the primary and secondary target demographics
- Reference relevant market trends
- Cite comparable project performance if applicable
- Identify the unique market position
- Be 150-200 words

Write professionally, as if for a studio presentation.

Return ONLY the market analysis text.`;
        break;

      case "distribution":
        userPrompt = `Write a distribution strategy for this project.

Title: ${context.title || "Untitled"}
Type: ${context.type || "film"}
Genre: ${(context.genre as string[])?.join(", ") || "Drama"}
Budget Range: ${context.budgetRange || "Not specified"}
Target Platforms: ${(context.targetPlatforms as string[])?.join(", ") || "Not specified"}

The strategy should:
- Recommend a release approach (festival circuit, theatrical, streaming, hybrid)
- Suggest timing and market windows
- Identify potential distribution partners
- Outline a high-level marketing approach
- Be 150-200 words

Write professionally and strategically.

Return ONLY the distribution strategy text.`;
        break;

      default:
        throw new Error(`Unknown generation type: ${type}`);
    }

    console.log(`Generating ${type} content for pitch deck...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("No content generated");
    }

    console.log(`Successfully generated ${type} content`);

    // For comps, parse the JSON response
    if (type === "comps") {
      try {
        const comparables = JSON.parse(content);
        return new Response(
          JSON.stringify({ comparables }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        console.error("Failed to parse comps JSON:", content);
        return new Response(
          JSON.stringify({ content }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating pitch content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
