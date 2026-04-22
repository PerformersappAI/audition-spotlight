import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Parse-document function called');

  try {
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

        const prompt = isPDF
          ? `You are a comprehensive document OCR system. Extract ALL text content from this document with COMPLETE accuracy.

CRITICAL INSTRUCTIONS - Extract EVERYTHING:
1. Transcribe EVERY word, number, symbol, and text element visible
2. Include ALL production information: names, titles, roles, departments
3. Extract ALL contact information: phone numbers, emails, addresses  
4. Capture ALL scheduling data: times, dates, locations, durations
5. Preserve ALL tabular data: cast lists, crew lists, scene breakdowns, equipment lists
6. Include ALL metadata: production company, project names, day numbers, dates
7. Maintain document structure: headers, sections, tables, lists, notes
8. DO NOT filter based on content type - extract scripts, call sheets, schedules, forms equally
9. DO NOT remove anything - extract production documents completely
10. Clean OCR artifacts but preserve all legitimate content

For call sheets specifically, ensure you extract:
- Production company, project name, shoot date, day number
- All crew positions and names (director, producers, ADs, etc.)
- Complete cast list with character names and call times
- Full scene breakdown with numbers, descriptions, locations
- Background actors with quantities and call times
- All timing information (call times, meals, wrap)
- Weather, location addresses, contact numbers

Return the complete extracted text exactly as it appears. Include EVERY field and EVERY section.`
          : `Extract all readable text from this image using OCR.

Instructions:
1. Accurately transcribe all visible text
2. Preserve layout and structure where possible
3. Handle any handwriting if present
4. Clean up any OCR artifacts
5. If there are multiple sections or columns, transcribe them in logical reading order
6. Return plain text without markdown formatting

Return only the extracted text without any commentary.`;

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
              status: 402,
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
        
        return new Response(JSON.stringify({ 
          success: true, 
          text: extractedText.trim(),
          type: "document",
          confidence: 0.95,
          modelUsed: 'google/gemini-3-flash-preview'
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
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
