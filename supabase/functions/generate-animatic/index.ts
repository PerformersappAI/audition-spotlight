import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Replicate from "https://esm.sh/replicate@0.25.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, prompt, motionType, duration } = await req.json();

    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY');
    
    // If Replicate API is configured, use it for video generation
    if (REPLICATE_API_KEY) {
      console.log('Using Replicate for video generation...');
      
      const replicate = new Replicate({
        auth: REPLICATE_API_KEY,
      });

      // Convert base64 to data URL if needed
      const imageUrl = imageData.startsWith('data:') 
        ? imageData 
        : `data:image/png;base64,${imageData}`;

      // Use Stability AI's image-to-video model
      const output = await replicate.run(
        "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
        {
          input: {
            input_image: imageUrl,
            motion_bucket_id: motionType === 'pan' ? 50 : motionType === 'zoom' ? 100 : 127,
            fps: 12,
            cond_aug: 0.02,
            decoding_t: 7,
            sizing_strategy: "maintain_aspect_ratio"
          }
        }
      );

      console.log('Video generation completed');

      return new Response(
        JSON.stringify({ 
          videoUrl: output,
          status: 'completed'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback: Use Lovable AI for enhanced image (simulated motion)
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'Video generation requires REPLICATE_API_KEY. Configure it in your Supabase secrets.',
          setupRequired: true
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Replicate not configured. Using Lovable AI for motion preview...');

    // Generate a motion-implied version using Lovable AI
    const motionPrompt = motionType === 'pan' 
      ? 'Add subtle motion blur suggesting camera pan movement'
      : motionType === 'zoom'
      ? 'Add radial blur suggesting camera zoom'
      : 'Add slight motion blur suggesting scene movement';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `${motionPrompt}. ${prompt || ''}`
              },
              {
                type: 'image_url',
                image_url: { url: imageData }
              }
            ]
          }
        ],
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
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
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const motionPreview = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    return new Response(
      JSON.stringify({ 
        motionPreview,
        status: 'preview_only',
        message: 'Full video generation requires Replicate API key. This is a motion preview.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-animatic function:', error);
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
