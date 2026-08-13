import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { CORE_BRAIN } from "../_shared/prompts/core.ts";
import { BLOG_ARTICLE_PROMPT } from "../_shared/prompts/generate-blog-article.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = CORE_BRAIN + "\n\n" + BLOG_ARTICLE_PROMPT;;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic } = await req.json().catch(() => ({} as { topic?: string }));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = topic && topic.trim()
      ? `Write the article on this topic: ${topic.trim()}`
      : `Pick one high-value, low-difficulty topic from the SEO list and write the article.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        max_tokens: 4000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      const status = aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 500;
      return new Response(
        JSON.stringify({ error: `AI gateway error (${aiRes.status}): ${txt.substring(0, 400)}` }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await aiRes.json();
    let content: string = data.choices?.[0]?.message?.content ?? "";
    if (!content) {
      return new Response(JSON.stringify({ error: "No content returned by AI" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Strip code fences if the model wrapped the JSON.
    content = content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    }

    let parsed: { title?: string; excerpt?: string; body?: string; imagePrompt?: string };
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to salvage the first {...} block.
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) {
        return new Response(JSON.stringify({ error: "Model did not return JSON", raw: content.slice(0, 500) }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      parsed = JSON.parse(m[0]);
    }

    return new Response(
      JSON.stringify({
        title: parsed.title ?? "",
        excerpt: parsed.excerpt ?? "",
        body: parsed.body ?? "",
        imagePrompt: parsed.imagePrompt ?? "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
