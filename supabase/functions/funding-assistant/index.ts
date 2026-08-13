import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CORE_BRAIN } from "../_shared/prompts/core.ts";
import { FUNDING_STRATEGY_PROMPT } from "../_shared/prompts/funding-strategy.ts";
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

const SYSTEM_PROMPT = CORE_BRAIN + "\n\n" + FUNDING_STRATEGY_PROMPT;;

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
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build context-aware system message
    let contextualSystem = SYSTEM_PROMPT;
    if (context) {
      const contextParts: string[] = [];
      if (context.projectTitle) {
        contextParts.push(`Project: "${context.projectTitle}"`);
      }
      if (context.budgetRange) {
        const budgetLabels: Record<string, string> = {
          micro: "Micro Budget (Under $50K)",
          low: "Low Budget ($50K-$250K)",
          mid_low: "Mid-Low Budget ($250K-$500K)",
          mid: "Mid Budget ($500K-$1M)",
          mid_high: "Mid-High Budget ($1M-$5M)",
          high: "High Budget ($5M+)",
        };
        contextParts.push(`Budget: ${budgetLabels[context.budgetRange] || context.budgetRange}`);
      }
      if (context.timeline) {
        const timelineLabels: Record<string, string> = {
          immediate: "Ready to shoot within 3 months",
          short: "6-12 months to production",
          medium: "1-2 years to production",
          development: "Early development stage",
        };
        contextParts.push(`Timeline: ${timelineLabels[context.timeline] || context.timeline}`);
      }
      if (context.selectedSources && context.selectedSources.length > 0) {
        contextParts.push(`Interested in: ${context.selectedSources.join(", ")}`);
      }
      
      if (contextParts.length > 0) {
        contextualSystem += `\n\n**Current Project Context:**\n${contextParts.join("\n")}`;
      }
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
          { role: "system", content: contextualSystem },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await charge(user.id, cost, "funding-assistant", {});
    await logUsage({
      userId: user.id,
      functionName: "funding-assistant",
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
    console.error("Funding assistant error:", error);
    if (userId) {
      await logUsage({
        userId,
        functionName: "funding-assistant",
        provider: "lovable-gateway",
        operation: "text",
        status: "error",
        latencyMs: Date.now() - started,
      });
    }
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
