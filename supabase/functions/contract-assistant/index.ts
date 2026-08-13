import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CORE_BRAIN } from "../_shared/prompts/core.ts";
import { CONTRACT_ASSISTANT_PROMPT } from "../_shared/prompts/contract-assistant.ts";
import {
  corsHeaders,
  authenticateUser,
  serverCalculateCost,
  ensureBalance,
  charge,
  insufficientCreditsBody,
  unauthorizedBody,
  logUsage,
  estimateUsd,
} from "../_shared/credits.ts";

const SAG_AFTRA_KNOWLEDGE = CORE_BRAIN + "\n\n" + CONTRACT_ASSISTANT_PROMPT;;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let userId: string | undefined;
  const started = Date.now();

  try {
    const user = await authenticateUser(req);
    if (!user) return unauthorizedBody();
    userId = user.id;

    const cost = serverCalculateCost({ feature: "text" });
    const balance = await ensureBalance(user.id, cost);
    if (!balance.ok) return insufficientCreditsBody(cost, balance.available);

    console.log('Authenticated user:', user.id);
    const { messages, projectDetails } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from project details if provided
    let projectContext = "";
    if (projectDetails) {
      projectContext = `\n\nCURRENT PROJECT DETAILS:
- Budget: ${projectDetails.budget || 'Not specified'}
- Project Type: ${projectDetails.projectType || 'Not specified'}
- Runtime: ${projectDetails.runtime || 'Not specified'} minutes
- Cast Size: ${projectDetails.castSize || 'Not specified'}
- Location: ${projectDetails.location || 'Not specified'}
- Distribution: ${projectDetails.distribution || 'Not specified'}

Based on these details, provide tailored recommendations.`;
    }

    const systemPrompt = SAG_AFTRA_KNOWLEDGE + projectContext + `

RESPONSE STYLE:
- Be conversational but professional
- Use clear formatting with headers and bullet points when helpful
- Provide specific numbers and requirements when available
- Always clarify that rates should be verified with official sources
- If you don't know something, say so and recommend official resources
- Break down complex information into digestible pieces`;

    console.log("Starting contract assistant chat...");

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Charge before streaming since the response body cannot be modified afterwards.
    await charge(user.id, cost, "contract-assistant", {});
    await logUsage({
      userId: user.id,
      functionName: "contract-assistant",
      provider: "lovable-gateway",
      operation: "text",
      estimatedCostUsd: estimateUsd(0, 0),
      status: "success",
      latencyMs: Date.now() - started,
    });

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Contract assistant error:", error);
    if (userId) {
      await logUsage({
        userId,
        functionName: "contract-assistant",
        provider: "lovable-gateway",
        operation: "text",
        status: "error",
        latencyMs: Date.now() - started,
      });
    }
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
