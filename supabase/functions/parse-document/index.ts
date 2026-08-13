import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateUser, serverCalculateCost, ensureBalance, charge, insufficientCreditsBody, unauthorizedBody, logUsage, estimateUsd } from "../_shared/credits.ts";

import { PARSE_DOCUMENT_PDF_PROMPT, PARSE_DOCUMENT_IMAGE_PROMPT } from "../_shared/prompts/parse-document.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Parse-document function called');

  let user: { id: string } | null = null;
  const started = Date.now();
  try {
    user = await authenticateUser(req);
    if (!user) return unauthorizedBody();

    const cost = serverCalculateCost({ feature: "text" });
    const balance = await ensureBalance(user.id, cost);
    if (!balance.ok) return insufficientCreditsBody(cost, balance.available);

    const { fileData, fileName, mimeType, idempotencyKey } = await req.json();
    
    console.log(`Processing request - File: ${fileName}, Idempotency Key: ${idempotencyKey || 'none'}`);
    console.log(`Processing file: ${fileName} (${mimeType})`);

    if (!fileData) {
      console.error('No file data provided');
      return new Response(
        JSON.stringify({ error: 'No file data provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Validate file type
    const supportedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const isPDF = mimeType === 'application/pdf';
    const isImage = ['image/png', 'image/jpeg', 'image/jpg'].includes(mimeType);
    
    if (!supportedTypes.includes(mimeType)) {
      console.error('Unsupported file type:', mimeType);
      return new Response(JSON.stringify({ 
        error: "Unsupported file type. Supported types: PDF, PNG, JPEG",
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (isPDF || isImage) {
      try {
        console.log(`Processing ${isPDF ? 'PDF' : 'image'} with Lovable AI...`);
        
        // Convert data to base64 data URL
        const base64Data = fileData.startsWith('data:') ? fileData : `data:${mimeType};base64,${fileData}`;

        const prompt = isPDF ? PARSE_DOCUMENT_PDF_PROMPT : PARSE_DOCUMENT_IMAGE_PROMPT;

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
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  { type: 'image_url', image_url: { url: base64Data } }
                ]
              }
            ],
            max_tokens: 32000,
            temperature: 0.1
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('AI gateway error:', response.status, errorText);
          
          if (response.status === 429) {
            return new Response(JSON.stringify({ 
              error: 'Rate limit exceeded. Please try again later.',
              success: false,
              retryable: true
            }), {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          if (response.status === 402) {
            return new Response(JSON.stringify({ 
              error: 'Credits exhausted. Please add more credits.',
              success: false,
              retryable: false
            }), {
              status: 503,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          return new Response(JSON.stringify({ 
            error: `AI service error: ${response.status}`,
            success: false,
            retryable: true
          }), {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const result = await response.json();
        const extractedText = result.choices?.[0]?.message?.content;

        if (!extractedText) {
          console.error('No content in AI response');
          return new Response(JSON.stringify({ 
            error: 'Failed to extract text from document',
            success: false,
            retryable: true
          }), {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log(`✅ Successfully processed ${isPDF ? 'PDF' : 'image'}`);

        const chargeRes = await charge(user!.id, cost, "parse-document", {});
        await logUsage({
          userId: user!.id,
          functionName: "parse-document",
          provider: "lovable-gateway",
          operation: "text",
          tokensInput: result.usage?.prompt_tokens,
          tokensOutput: result.usage?.completion_tokens,
          estimatedCostUsd: estimateUsd(result.usage?.prompt_tokens, result.usage?.completion_tokens),
          status: "success",
          latencyMs: Date.now() - started,
        });
        
        return new Response(JSON.stringify({ 
          success: true, 
          text: extractedText.trim(),
          type: "document",
          confidence: 0.95,
          modelUsed: 'google/gemini-3-flash-preview',
          available_credits: chargeRes.available
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (processingError) {
        console.error('Processing error:', processingError);
        return new Response(JSON.stringify({ 
          error: `Failed to parse ${isPDF ? 'PDF' : 'image'}: ` + (processingError instanceof Error ? processingError.message : String(processingError)),
          success: false
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

  } catch (error) {
    console.error('Error in parse-document function:', error);
    if (user) {
      await logUsage({
        userId: user.id,
        functionName: "parse-document",
        provider: "lovable-gateway",
        operation: "text",
        status: "error",
        latencyMs: Date.now() - started,
      });
    }
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Unsupported request' }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
