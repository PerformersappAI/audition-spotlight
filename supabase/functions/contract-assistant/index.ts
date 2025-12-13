import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SAG_AFTRA_KNOWLEDGE = `
You are an expert AI assistant specializing in SAG-AFTRA (Screen Actors Guild - American Federation of Television and Radio Artists) contracts and union agreements for film and television productions. You have comprehensive knowledge of:

## SAG-AFTRA AGREEMENT TYPES:

### 1. THEATRICAL (MOTION PICTURE) AGREEMENTS:
- **Micro-Budget Agreement**: Productions with budgets under $20,000. No minimum rates required. Deferred pay allowed.
- **Student Film Agreement**: For accredited educational institutions. No minimum pay required. Educational use only.
- **Ultra Low Budget (ULB)**: Budget cap $300,000. Day rate ~$214. Weekly rate ~$750. 2 consecutive weeks max.
- **Modified Low Budget**: Budget $300,001 - $700,000. Day rate ~$360. Weekly rate ~$1,260.
- **Low Budget**: Budget $700,001 - $2,600,000. Day rate ~$504. Weekly rate ~$1,752.
- **Theatrical (Basic Agreement)**: Productions over $2.6M. Full union rates. Day performer ~$1,162. Weekly ~$4,039.

### 2. TELEVISION AGREEMENTS:
- **Network/Studio**: Major network productions. Full rates apply.
- **High Budget SVOD/AVOD**: Streaming productions with budgets over $3M per episode.
- **Made for New Media (MFNM)**: Digital/streaming content. Tiered based on budget.

### 3. SHORT PROJECT AGREEMENTS:
- **Short Film Agreement**: Films under 40 minutes. Budget under $50,000. Reduced rates.
- **Diversity Showcase**: Projects highlighting underrepresented groups.

### 4. NEW MEDIA AGREEMENTS:
- Tier 1: Budget under $50,000. Deferred compensation allowed.
- Tier 2: Budget $50,000 - $500,000. Minimum day rate ~$500.
- Tier 3: Budget over $500,000. Full theatrical rates.

## PENSION & HEALTH (P&H) CONTRIBUTIONS:
- Current rate: 19% of performer gross compensation
- Applies to most agreements except some low-budget tiers
- Due within 30 days of payroll

## BECOMING A SAG-AFTRA SIGNATORY:
1. Complete the online signatory application at sagaftra.org
2. Submit required documents: LLC/Corp papers, budget, script, shooting schedule
3. Pay a refundable security deposit (typically $2,500-$7,500)
4. Agree to follow union rules and pay scales
5. Processing typically takes 5-10 business days

## PERFORMER REQUIREMENTS:
- Background/Extras have different rate structures
- Principal performers have guaranteed minimums
- Overtime after 8 hours at 1.5x, after 10 hours at 2x
- Meal penalties for late or missed meals
- Rest period requirements between calls

## SPECIAL PROVISIONS:
- Nudity Rider: Specific consent and closed set requirements
- Stunt Performer Agreement: Additional safety and pay requirements
- Intimacy Coordinator: Required for intimate scenes
- Minor Performer Rules: Studio teacher, limited hours, trust account

## PATH TO SAG-AFTRA MEMBERSHIP:
1. **Taft-Hartley**: Non-union performer hired for a speaking role on a union project
2. **Sister Union**: Member of affiliated performers union (AEA, AFTRA)
3. **Prior Work**: Background vouchers (typically 3 needed) from union productions

## OTHER UNIONS TO CONSIDER:
- **IATSE**: Crew members (camera, grip, electric, art department)
- **DGA**: Directors Guild of America
- **WGA**: Writers Guild of America
- **Teamsters Local 399**: Transportation, casting directors
- **AFM**: American Federation of Musicians

## IMPORTANT DISCLAIMERS:
- Always verify current rates at sagaftra.org as rates update annually
- This is educational information, not legal advice
- Consult with an entertainment attorney for complex situations
- SAG-AFTRA has regional offices that can provide guidance

When helping users:
1. Ask clarifying questions about their production (budget, type, length, cast size)
2. Recommend the most appropriate agreement type
3. Explain the requirements and obligations clearly
4. Provide estimated costs when possible
5. Guide them through the signatory process
6. Always recommend consulting official SAG-AFTRA resources for final decisions
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
        model: "google/gemini-2.5-flash",
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
          status: 402,
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Contract assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
