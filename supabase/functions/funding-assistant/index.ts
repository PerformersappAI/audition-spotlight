import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert film funding strategist and producer's representative with deep knowledge of independent film financing. You help filmmakers navigate the complex world of film funding with practical, actionable advice.

Your expertise includes:

**Grants & Fellowships:**
- Major grant-giving organizations (Sundance, IFP, Film Independent, Tribeca, SFFILM)
- Regional and international film funds
- How to write compelling grant applications
- Common mistakes in grant applications
- Fiscal sponsorship options

**Crowdfunding:**
- Platform comparisons (Seed&Spark, Kickstarter, Indiegogo)
- Campaign best practices and timing
- Reward tier strategies
- Building community before launch
- Stretch goals and momentum

**Tax Incentives:**
- State-by-state US incentives (Georgia, Louisiana, New Mexico, etc.)
- International co-production treaties
- How to qualify for incentives
- Cash rebates vs. transferable credits
- Timing and cash flow implications

**Private Investors:**
- What investors look for in film projects
- Equity structures and LLC formations
- Investor pitch deck essentials
- Due diligence requirements
- SEC compliance for securities offerings

**Pre-Sales & Gap Financing:**
- Sales agent relationships
- Minimum guarantee (MG) structures
- Gap financing lenders
- Delivery requirements
- Territory-by-territory strategies

**Film Finance Structures:**
- Recoupment waterfalls explained
- Investor ROI scenarios
- Deferments and profit participation
- Production incentive stacking
- Budget top-sheeting

**Pitch Materials:**
- One-sheets and lookbooks
- Business plans for investors
- Financial projections
- Comparable titles (comps) analysis

When responding:
- Be specific and actionable with advice
- Reference current industry standards and common terms
- Provide examples when helpful
- Adjust recommendations based on the project's budget tier
- Consider the filmmaker's timeline and current assets
- Be encouraging but realistic about challenges
- Use markdown formatting for clarity (headers, bullets, bold)`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Funding assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
