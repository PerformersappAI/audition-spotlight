import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type GenerationType =
  | "logline"
  | "synopsis"
  | "vision"
  | "character"
  | "comps"
  | "audience"
  | "distribution"
  | "visualStyle"
  | "northStar"
  | "worldSetting"
  | "episodes";

interface GenerateRequest {
  type?: string;
  field?: string;
  context: Record<string, any>;
}

const FIELD_ALIASES: Record<string, GenerationType> = {
  logline: "logline",
  synopsis: "synopsis",
  vision: "vision",
  directorvision: "vision",
  character: "character",
  characters: "character",
  comps: "comps",
  comparables: "comps",
  audience: "audience",
  market: "audience",
  marketanalysis: "audience",
  distribution: "distribution",
  distributionplan: "distribution",
  distributionstrategy: "distribution",
  visualstyle: "visualStyle",
  style: "visualStyle",
  northstar: "northStar",
  worldsetting: "worldSetting",
  world: "worldSetting",
  episodes: "episodes",
  episodebreakdown: "episodes",
};

// Shared craft rules taught to the model on every call.
// Distilled from SBS Scripted Pitch Deck Guide + Micah Haley's framework
// + the canonical 10-slide pitch-deck taxonomy.
const CRAFT_RULES = `You are a senior pitch-deck consultant for film and television.

CRAFT PRINCIPLES (apply to everything you write):

1. A pitch deck is a FINAL document, not a draft. Write like finished marketing copy
   for a movie that already exists. No "could", "might", "perhaps".

2. CARRY THE TONE OF THE GENRE. Comedy copy should be funny. Horror copy should evoke
   dread. Action copy should have driving momentum. The prose IS the proof of concept.

3. EVERY CHARACTER has an EXTERNAL goal (what they want) and an INTERNAL wound
   (what's broken in them). They cannot resolve the external until the internal heals.
   Reference: SBS Scripted Pitch Deck Guide.

4. THE LOCATION IS A CHARACTER. Never set a story somewhere generic. The world
   must be integral — the story could only happen here, now, to these people.

5. STRONG HOOK + INCITING INCIDENT must land in the first paragraph of any synopsis.
   Then: rising stakes, prickly problems, unexpected conflict, transformation.

6. NORTH STAR: every project has one — the single emotional truth at its center.
   Not a logline. The reason this story must be told.

7. WRITE IN PARAGRAPHS OF 3–5 SENTENCES. Never one giant wall of text. Use
   double-line-breaks between paragraphs.

8. NEVER name real celebrities, real brands, or real franchises in invented copy.
   Comparables are the exception — those are real titles by definition.

9. PRESENT TENSE, third person for synopses. First person only for director's vision.

10. NO MARKDOWN, NO HEADERS, NO BULLETS unless the schema explicitly asks for an array.
    Just clean prose.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json() as GenerateRequest;
    const rawType = (body.type ?? body.field ?? "").toString().toLowerCase().replace(/[_\s-]/g, "");
    const type: GenerationType | undefined = FIELD_ALIASES[rawType];
    const ctx = body.context ?? {};

    const context: Record<string, any> = {
      ...ctx,
      title: ctx.title ?? ctx.projectTitle,
      type: ctx.type ?? ctx.projectType,
      tone: ctx.tone ?? ctx.toneMood,
      themes: ctx.themes,
      template: ctx.template ?? ctx.selectedTemplate,
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = CRAFT_RULES;
    let userPrompt = "";

    const projectShape = `Title: ${context.title || "Untitled"}
Format: ${context.type || "film"}
Genre: ${(context.genre as string[])?.join(", ") || "Drama"}
Tone: ${context.tone || "—"}
Logline: ${context.logline || "—"}`;

    switch (type) {
      case "logline":
        userPrompt = `Write a single-sentence LOGLINE (max 30 words) for this project.

${projectShape}

Required structure: [PROTAGONIST] must [EXTERNAL GOAL] before/or [STAKES/OBSTACLE].
The logline must hook in 5 seconds. No quotes around it. No "logline:" prefix.

Return ONLY the logline sentence.`;
        break;

      case "northStar":
        userPrompt = `Write the NORTH STAR statement for this project — the single emotional truth that justifies the entire show's existence.

${projectShape}
Synopsis: ${context.synopsis || "—"}

Answer in 80–120 words covering: WHY this story, WHY now (cultural moment), and what is uniquely fresh about it. Write as the creator, with conviction. No marketing fluff. No "this story is about". Just say what the story SAYS.

Return ONLY the north-star statement.`;
        break;

      case "synopsis":
        userPrompt = `Write a 300–400 word SYNOPSIS for this project, in 3–4 paragraphs separated by blank lines.

${projectShape}

Paragraph 1: HOOK + INCITING INCIDENT (introduce protagonist + the moment everything changes).
Paragraph 2: Rising action + central conflict + the prickly problem the protagonist must solve.
Paragraph 3: Stakes escalate, allies/antagonists clarify, the impossible choice approaches.
Paragraph 4 (optional): A teaser of climax — never spoil the resolution.

Present tense, third person, cinematic verbs. Every paragraph must end with momentum that pulls the reader to the next.

Return ONLY the synopsis. Use double line breaks between paragraphs.`;
        break;

      case "vision":
        userPrompt = `Write a 150–200 word DIRECTOR'S VISION statement in first person.

${projectShape}
Synopsis: ${context.synopsis || "—"}

Cover, in 2–3 short paragraphs separated by blank lines:
- The personal reason you must tell this story
- The visual + tonal language (specific lensing, palette, pacing)
- One or two filmmaker references as tonal anchor (real directors, not stars)

Sound like a director who has already shot the film in their head.

Return ONLY the vision text. Use double line breaks between paragraphs.`;
        break;

      case "worldSetting":
        userPrompt = `Write a 100–140 word WORLD / SETTING statement explaining why this story can ONLY happen in this place at this time.

${projectShape}
Synopsis: ${context.synopsis || "—"}
Stated location: ${context.shootingLocations || "—"}

The location must function as a character: its weather, economy, history or culture must press on the protagonist's wound. Do not describe scenery — describe pressure.

Return ONLY the world statement. One or two short paragraphs.`;
        break;

      case "character":
        userPrompt = `Write a character profile for this role.

Character Name: ${context.characterName}
Role Type: ${context.characterRole}
Project Synopsis: ${context.synopsis || "—"}
Tone: ${context.tone || "—"}

Return STRICT JSON in this exact shape (no prose, no fences):
{
  "description": "2-3 sentences capturing essence, voice, contradiction.",
  "externalGoal": "One sentence: what they tangibly want in the world.",
  "internalWound": "One sentence: the broken thing inside that blocks them."
}`;
        break;

      case "episodes": {
        const count = Math.max(2, Math.min(12, Number(context.episodeCount) || 6));
        userPrompt = `Write a ${count}-EPISODE breakdown for this series.

${projectShape}
Synopsis: ${context.synopsis || "—"}

Each episode = a title (2–5 words, evocative, not generic) + a 2–3 sentence logline that escalates the season arc and ends on a hook into the next. Episode 1 = pilot/inciting event. Final episode = season climax.

Return STRICT JSON array (no prose, no fences):
[{"title": "...", "logline": "..."}, ...]`;
        break;
      }

      case "comps":
        userPrompt = `Suggest 3 COMPARABLE titles (real released films or TV shows) that prove the market for this project.

${projectShape}

Pick comps that are recent (last 8 years preferred), critically successful OR commercially profitable, and TONALLY similar — not just same genre. Avoid mega-blockbusters that no indie can credibly compare to.

Return STRICT JSON array (no prose, no fences):
[
  {"title": "...", "year": "2022", "whySimilar": "1 sentence on tone/audience overlap"},
  ...
]`;
        break;

      case "audience":
        userPrompt = `Write a 150–200 word MARKET ANALYSIS in 2 paragraphs separated by a blank line.

${projectShape}
Comparables: ${JSON.stringify(context.comparables) || "—"}

Paragraph 1: Primary demographic with specifics (e.g. "Adults 25–54, urban, streaming-first") + secondary audience + why this audience is underserved RIGHT NOW.
Paragraph 2: Market trend evidence (cite comp performance, platform appetite, cultural moment). End with a one-line market-position claim.

Return ONLY the analysis. Use a double line break between paragraphs.`;
        break;

      case "distribution":
        userPrompt = `Write a 150–200 word DISTRIBUTION STRATEGY in 2 paragraphs.

${projectShape}
Budget: ${context.budgetRange || "—"}
Target Platforms: ${(context.targetPlatforms as string[])?.join(", ") || "—"}

Paragraph 1: Release path (festival → theatrical / day-and-date / streaming-first / hybrid) with concrete window timing.
Paragraph 2: Likely distribution partners (by tier, not by name promise) + a sharp 1-sentence marketing hook.

Return ONLY the strategy. Use a double line break between paragraphs.`;
        break;

      case "visualStyle":
        userPrompt = `Write a 120–180 word VISUAL STYLE description in 2 short paragraphs.

${projectShape}
Template/Mood: ${context.template || "—"}

Paragraph 1: Palette + lighting + camera language (lensing, movement, framing).
Paragraph 2: Production design textures + 2 specific filmmaker/film references as tonal anchor.

Present tense, evocative but professional. No "we will", say what it IS.

Return ONLY the description. Double line break between paragraphs.`;
        break;

      default:
        throw new Error(`Unknown generation type: ${body.type ?? body.field ?? "undefined"}`);
    }

    console.log(`Generating ${type} content for pitch deck...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.75,
        max_tokens: 1400,
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
    if (!content) throw new Error("No content generated");

    console.log(`Successfully generated ${type} content`);

    // JSON-shaped responses
    if (type === "comps" || type === "episodes" || type === "character") {
      try {
        const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
        const parsed = JSON.parse(cleaned);
        const extra: Record<string, any> = {};
        if (type === "comps") extra.comparables = parsed;
        if (type === "episodes") extra.episodes = parsed;
        return new Response(
          JSON.stringify({ content: parsed, ...extra }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        console.error(`Failed to parse ${type} JSON:`, content);
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
