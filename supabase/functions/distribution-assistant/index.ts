import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CORE_BRAIN } from "../_shared/prompts/core.ts";
import { DISTRIBUTION_ASSISTANT_PROMPT } from "../_shared/prompts/distribution-assistant.ts";
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

const SYSTEM_PROMPT = CORE_BRAIN + "\n\n" + DISTRIBUTION_ASSISTANT_PROMPT;

serve(async (req) => {
  if (req.method === "OPTIONS") {
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

    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system message
    let systemMessage = SYSTEM_PROMPT;
    if (context) {
      systemMessage += `\n\nCurrent project context:\n- Project: ${context.projectTitle || 'Untitled'}\n- Type: ${context.projectType || 'Not specified'}\n- Budget Tier: ${context.budgetTier || 'Not specified'}\n- Current Step: ${context.currentStep || 'Unknown'}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemMessage },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await charge(user.id, cost, "distribution-assistant", {});
    await logUsage({
      userId: user.id,
      functionName: "distribution-assistant",
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
    console.error("distribution-assistant error:", error);
    if (userId) {
      await logUsage({
        userId,
        functionName: "distribution-assistant",
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
