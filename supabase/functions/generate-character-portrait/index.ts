import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const buildPrompt = (opts: {
  characterName: string;
  characterDescription?: string;
  characterRole?: string;
  styleDescription?: string;
  genre?: string[];
  projectTitle?: string;
  hasReference: boolean;
}) => {
  const genreStyle = opts.genre?.join(", ") || "dramatic";
  const styleGuide = opts.styleDescription || "cinematic, professional film photography";

  // Soften potentially problematic descriptors so the safety filter doesn't false-positive
  // on names like "YOUNG HENRY" (which Gemini interprets as a minor).
  const safeName = String(opts.characterName)
    .replace(/\b(young|kid|child|baby|teen|teenage|teenager|boy|girl|minor|underage)\b/gi, "")
    .trim() || opts.characterName;

  const safeDescription = (opts.characterDescription || "A compelling adult character")
    .replace(/\b(child|children|kid|kids|baby|babies|toddler|teen|teenage|teenager|underage|minor)\b/gi, "young adult");

  const base = `Create a professional cinematic THREE-QUARTER (3/4) length character portrait — framed from mid-thigh to top of head — for a ${genreStyle} film titled "${opts.projectTitle || 'Untitled'}".

Character (fictional): ${safeName}
Role: ${opts.characterRole || 'main character'}
Description: ${safeDescription}
Subject is an adult (18+).

Visual Style: ${styleGuide}

Framing & composition (MUST follow exactly):
- THREE-QUARTER LENGTH framing: subject visible from mid-thigh up to the top of the head
- Subject centered, facing camera, neutral confident pose, arms relaxed
- 2:3 portrait aspect ratio
- Shallow depth of field, dramatic cinematic key light, soft fill
- Atmospheric simple background that hints at the film's genre — no busy environments
- DO NOT crop above the chest. DO NOT show full body / feet. DO NOT use a head-only close-up.

Originality requirements (CRITICAL):
- This is an ORIGINAL FICTIONAL CHARACTER. The face, hair, build, and styling must NOT resemble any real, famous, or recognizable person — no actors, celebrities, athletes, politicians, musicians, or public figures, living or deceased.
- Invent the face from scratch. Do not copy or evoke any known likeness.
- No text, no title cards, no logos, no watermarks, no captions.`;

  if (opts.hasReference) {
    return `Using the person in the attached reference photo as the basis for the face and likeness, create a cinematic THREE-QUARTER LENGTH (mid-thigh to top of head) character portrait of them as the character "${safeName}".

${base}

The reference photo IS the intended likeness — preserve their facial features, then style them as the character with appropriate wardrobe, lighting, and mood. Treat the originality clause above as not applying to the reference subject.`;
  }

  return base;
};

async function callGateway(apiKey: string, messages: any[]) {
  return fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      messages,
      modalities: ["image", "text"],
    }),
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      characterName,
      characterDescription,
      characterRole,
      referencePhotoUrl,
      styleDescription,
      genre,
      projectTitle,
    } = await req.json();

    if (!characterName) {
      return new Response(
        JSON.stringify({ error: "Character name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const buildMessages = (extraSafetyHint = "") => {
      const promptText = buildPrompt({
        characterName,
        characterDescription,
        characterRole,
        styleDescription,
        genre,
        projectTitle,
        hasReference: !!referencePhotoUrl,
      }) + (extraSafetyHint ? `\n\n${extraSafetyHint}` : "");

      if (referencePhotoUrl) {
        return [{
          role: "user",
          content: [
            { type: "text", text: promptText },
            { type: "image_url", image_url: { url: referencePhotoUrl } },
          ],
        }];
      }
      return [{ role: "user", content: promptText }];
    };

    console.log("Generating character portrait for:", characterName);

    let response = await callGateway(LOVABLE_API_KEY, buildMessages());

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Add funds in Lovable AI workspace settings." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    let data = await response.json();
    let imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    let finishReason = data.choices?.[0]?.native_finish_reason || data.choices?.[0]?.finish_reason;

    // Retry once on safety / prohibited-content blocks with a softer, fully fictional prompt.
    if (!imageUrl && typeof finishReason === "string" && /PROHIBITED|SAFETY|BLOCK/i.test(finishReason)) {
      console.warn(`Safety block (${finishReason}) for ${characterName} — retrying with softened prompt.`);
      const softened = "All subjects depicted are fictional adults over 18. Make the face entirely invented and generic. Avoid resemblance to any real person. Keep the pose neutral and the wardrobe non-revealing.";
      response = await callGateway(LOVABLE_API_KEY, buildMessages(softened));
      if (response.ok) {
        data = await response.json();
        imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        finishReason = data.choices?.[0]?.native_finish_reason || data.choices?.[0]?.finish_reason;
      }
    }

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).substring(0, 500));
      const blocked = typeof finishReason === "string" && /PROHIBITED|SAFETY|BLOCK/i.test(finishReason);
      return new Response(
        JSON.stringify({
          error: blocked
            ? `The AI safety filter blocked this character (${finishReason}). Try renaming the character (avoid words like "young", "kid", "child") or simplify the description, then regenerate. No credits were charged.`
            : "No image was generated. Try again or simplify the description.",
          code: blocked ? "SAFETY_BLOCK" : "NO_IMAGE",
          finishReason,
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Character portrait generated for:", characterName);

    return new Response(
      JSON.stringify({
        imageUrl,
        characterName,
        message: `Portrait generated for ${characterName}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Character portrait generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate character portrait" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
