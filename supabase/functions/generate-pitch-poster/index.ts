import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TEMPLATE_DESCRIPTORS: Record<string, string> = {
  epic: "Epic / cinematic, deep blacks with rich gold accents, sweeping scale",
  faith: "Faith / inspirational, warm golden-hour light over deep navy, hopeful and reverent",
  noir: "Thriller / noir, high-contrast charcoal and crimson, deep shadows, moody chiaroscuro",
  scifi: "Sci-fi, cool cyan glow against deep navy, sleek futuristic atmosphere",
  western: "Western, sun-baked sienna and amber dust, wide vistas, weathered textures",
  drama: "Prestige drama, muted greys and soft naturalistic light, intimate and grounded",
  horror: "Horror, blood-red against pitch black, unsettling negative space, eerie lighting",
  comedy: "Comedy, vibrant warm yellows and energetic composition, playful and bold",
  documentary: "Documentary, naturalistic palette, candid and observational tone",
  action: "Action, high-energy orange and black, kinetic motion, explosive cinematic lighting",
};

interface PosterRequest {
  prompt?: string;
  projectTitle?: string;
  genre?: string[] | string;
  logline?: string;
  visualStyle?: string;
  template?: string;
}

function buildPrompt(body: PosterRequest): string {
  if (body.prompt && body.prompt.trim().length > 0) return body.prompt;

  const title = body.projectTitle?.trim() || "Untitled";
  const genres = Array.isArray(body.genre)
    ? body.genre.filter(Boolean).join(", ")
    : (body.genre || "").toString();
  const logline = body.logline?.trim() || "";
  const visualStyle = body.visualStyle?.trim() || "";
  const templateMood = body.template ? TEMPLATE_DESCRIPTORS[body.template] : "";

  const lines = [
    `Design a theatrical movie poster for the film titled "${title}".`,
    genres ? `Genre: ${genres}.` : "",
    logline ? `Logline: ${logline}` : "",
    templateMood ? `Mood and palette: ${templateMood}.` : "",
    visualStyle ? `Visual style direction: ${visualStyle}` : "",
    "Format: vertical 2:3 cinematic key art, professional theatrical poster composition, dramatic lighting, photoreal, highly detailed.",
    "Strict rules: NO text, NO title, NO tagline, NO credits block, NO logos, NO watermark of any kind. Pure visual artwork only.",
  ].filter(Boolean);

  return lines.join("\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as PosterRequest;

    if (!body.prompt && !body.projectTitle) {
      return new Response(
        JSON.stringify({
          error:
            "Missing project details. Add a project title (or pass a prompt) before generating a poster.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const finalPrompt = buildPrompt(body);
    console.log(
      "Generating poster for:",
      body.projectTitle || "(prompt-only)",
      "| prompt preview:",
      finalPrompt.substring(0, 160),
    );

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-image-preview",
          messages: [
            {
              role: "user",
              content: finalPrompt,
            },
          ],
          modalities: ["image", "text"],
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error:
              "AI credits exhausted. Add credits in Settings > Workspace > Usage.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: `AI gateway error (${response.status}): ${errorText.substring(0, 300)}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error(
        "No image in response:",
        JSON.stringify(data).substring(0, 500),
      );
      return new Response(
        JSON.stringify({
          error: "The AI did not return an image. Please try again.",
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Poster generated successfully");
    return new Response(
      JSON.stringify({
        imageUrl,
        message:
          data.choices?.[0]?.message?.content || "Poster generated successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Poster generation error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate poster",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
