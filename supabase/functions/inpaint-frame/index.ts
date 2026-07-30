import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateUser, serverCalculateCost, ensureBalance, charge, insufficientCreditsBody, unauthorizedBody, capExceededBody, CapExceededError, logUsage } from "../_shared/credits.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authedUser = await authenticateUser(req);
  if (!authedUser) return unauthorizedBody();
  const started = Date.now();
  const frameCount = 1;
  let cost: number;
  try {
    cost = serverCalculateCost({ feature: "images", frames: frameCount });
  } catch (e) {
    if (e instanceof CapExceededError) return capExceededBody(e.message);
    throw e;
  }
  const balance = await ensureBalance(authedUser.id, cost);
  if (!balance.ok) return insufficientCreditsBody(cost, balance.available);

  try {
    const { imageData, maskData, prompt, artStyle } = await req.json();

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

    console.log('Starting in-paint operation with Lovable AI...');

    // Build the edit prompt
    const editPrompt = `Edit this storyboard frame: ${prompt}. ${artStyle ? `Maintain the ${artStyle} art style.` : ''} Keep the overall composition and unmasked areas unchanged.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.1-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: editPrompt
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
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const editedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!editedImageUrl) {
      console.error('No image in response:', data);
      throw new Error('Failed to generate edited image');
    }

    console.log('In-paint operation completed successfully');

    const chargeRes = await charge(authedUser.id, cost, "inpaint-frame", { frames: frameCount });
    await logUsage({ userId: authedUser.id, functionName: "inpaint-frame", provider: "lovable-gateway", operation: "image", status: "success", latencyMs: Date.now() - started, metadata: { frames: frameCount } });

    return new Response(
      JSON.stringify({ 
        imageData: editedImageUrl,
        message: data.choices?.[0]?.message?.content || 'Image edited successfully',
        available_credits: chargeRes.available
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in inpaint-frame function:', error);
    await logUsage({ userId: authedUser.id, functionName: "inpaint-frame", provider: "lovable-gateway", operation: "image", status: "error", metadata: { error: String(error) } });
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
