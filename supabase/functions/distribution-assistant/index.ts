import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a film distribution expert assistant helping filmmakers prepare their projects for distribution. You have deep knowledge of:

DISTRIBUTION MODELS:
- SVOD (Subscription Video on Demand) - Netflix, Hulu, Disney+, etc.
- TVOD (Transactional VOD) - iTunes, Amazon rentals, Google Play
- AVOD (Advertising VOD) - Tubi, Pluto TV, Roku Channel
- FAST (Free Ad-Supported Streaming TV) - Linear streaming channels
- Theatrical distribution

BUSINESS PACKAGING:
- Writing compelling loglines (1-2 sentences that hook buyers)
- Creating effective synopses (short and long versions)
- Selecting comparable titles (comps) that demonstrate market potential
- Building press kits and marketing materials

LEGAL REQUIREMENTS:
- Chain of title documentation
- E&O (Errors & Omissions) insurance
- Music clearances (sync and master rights)
- Talent and location releases

TECHNICAL DELIVERABLES:
- Master formats (ProRes, DNxHR, IMF)
- Audio specs (Stereo 2.0, 5.1, 7.1 surround)
- Captions/CC and SDH requirements
- M&E tracks for international versions
- Textless elements
- QC (Quality Control) requirements

PLATFORM-SPECIFIC GUIDANCE:
- Netflix, Hulu, Amazon, Apple TV technical specs
- Aggregator vs. direct platform relationships
- Sales agent strategies

Be concise, practical, and specific. When suggesting loglines or synopses, provide concrete examples. When explaining terminology, keep it accessible but accurate. Always relate advice to the filmmaker's specific situation when context is provided.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
          status: 402,
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("distribution-assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
