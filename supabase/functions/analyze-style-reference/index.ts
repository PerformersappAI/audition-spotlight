import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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

    const { imageData } = await req.json();

    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing style reference image...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert visual style analyst. Analyze images and describe their visual style in detail for use as art direction prompts. Focus on:
- Art style (photorealistic, illustrated, animated, etc.)
- Color palette and saturation
- Lighting style and mood
- Line work and texture
- Composition tendencies
- Overall aesthetic feel

Provide a concise but detailed style description that could be used to generate similar-looking artwork.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and provide a detailed visual style description that can be used to generate artwork in the same style. Be specific about colors, lighting, art technique, and mood. Format as a single paragraph prompt.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const styleDescription = data.choices?.[0]?.message?.content || '';

    console.log('Style analysis complete');

    const chargeRes = await charge(user.id, cost, "analyze-style-reference", {});
    await logUsage({
      userId: user.id,
      functionName: "analyze-style-reference",
      provider: "lovable-gateway",
      operation: "text",
      tokensInput: data.usage?.prompt_tokens,
      tokensOutput: data.usage?.completion_tokens,
      estimatedCostUsd: estimateUsd(data.usage?.prompt_tokens ?? 0, data.usage?.completion_tokens ?? 0),
      status: "success",
      latencyMs: Date.now() - started,
    });

    return new Response(
      JSON.stringify({ 
        styleDescription,
        success: true,
        available_credits: chargeRes.available
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-style-reference:', error);
    if (userId) {
      await logUsage({
        userId,
        functionName: "analyze-style-reference",
        provider: "lovable-gateway",
        operation: "text",
        status: "error",
        latencyMs: Date.now() - started,
      });
    }
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
