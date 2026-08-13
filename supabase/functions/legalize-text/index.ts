import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CORE_BRAIN } from "../_shared/prompts/core.ts";
import { LEGALIZE_TEXT_PROMPT } from "../_shared/prompts/legalize-text.ts";
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

const SYSTEM_PROMPT = CORE_BRAIN + "\n\n" + LEGALIZE_TEXT_PROMPT;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  let userId: string | undefined;
  const started = Date.now();

  try {
    const user = await authenticateUser(req);
    if (!user) return unauthorizedBody();
    userId = user.id;

    const cost = serverCalculateCost({ feature: "text" });
    const balance = await ensureBalance(user.id, cost);
    if (!balance.ok) return insufficientCreditsBody(cost, balance.available);

    const { text = "", context = "" } = await req.json().catch(() => ({}));
    if (!String(text).trim()) return json({ error: "Text is required" }, 400);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userMessage = `Field: ${String(context || "Clause")}\n\n${String(text).trim()}`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.4,
        max_tokens: 500,
      }),
    });

    if (!r.ok) {
      const errorText = await r.text();
      console.error("AI gateway error:", r.status, errorText);
      if (r.status === 429) return json({ error: "Rate limit exceeded. Please try again in a moment." }, 429);
      return json({ error: "AI service error. Please try again." }, 500);
    }

    const data = await r.json();
    const rewritten = data.choices?.[0]?.message?.content?.trim() ?? "";

    const chargeRes = await charge(user.id, cost, "legalize-text", { context });
    await logUsage({
      userId: user.id,
      functionName: "legalize-text",
      provider: "lovable-gateway",
      operation: "text",
      tokensInput: data.usage?.prompt_tokens,
      tokensOutput: data.usage?.completion_tokens,
      estimatedCostUsd: estimateUsd(data.usage?.prompt_tokens ?? 0, data.usage?.completion_tokens ?? 0),
      status: "success",
      latencyMs: Date.now() - started,
    });

    return json({ text: rewritten, available_credits: chargeRes.available });
  } catch (error) {
    console.error("legalize-text error:", error);
    if (userId) {
      await logUsage({
        userId,
        functionName: "legalize-text",
        provider: "lovable-gateway",
        operation: "text",
        status: "error",
        latencyMs: Date.now() - started,
      });
    }
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
