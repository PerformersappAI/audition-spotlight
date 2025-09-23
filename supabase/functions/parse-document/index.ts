import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Parse-document function called');

  try {
    const { fileData, fileName, mimeType } = await req.json();

    console.log(`Processing file: ${fileName} (${mimeType})`);

    if (!fileData) {
      console.error('No file data provided');
      return new Response(
        JSON.stringify({ error: 'No file data provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (mimeType === 'application/pdf') {
      try {
        console.log('Sending PDF to OpenAI for processing...');
        
        // Convert PDF data to base64 if not already
        const base64Data = fileData.startsWith('data:') ? fileData.split(',')[1] : fileData;
        
        // Send PDF to OpenAI for text extraction using vision model
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o', // Use vision-capable model for PDF processing
            messages: [
              {
                role: 'system',
                content: `You are a professional script formatting assistant. Extract and clean script text from the provided document. Focus on:
1. Remove OCR artifacts, weird characters, and encoding issues
2. Standardize character names to ALL CAPS format
3. Clean up stage directions and put them in parentheses
4. Preserve scene headings (INT./EXT.) 
5. Remove page numbers, headers, footers
6. Ensure proper spacing between dialogue and action lines
7. Fix line breaks and formatting for readability
8. Remove any non-script content like title pages or notes

Return only the cleaned script text with proper formatting. Do not add commentary.`
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Please extract and clean the script text from this PDF document:'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:application/pdf;base64,${base64Data}`
                    }
                  }
                ]
              }
            ],
            max_completion_tokens: 8000,
          })
        });

        console.log(`OpenAI response status: ${response.status}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI API error:', response.status, errorText);
          
          // Handle specific OpenAI API errors more gracefully
          if (response.status === 503) {
            return new Response(JSON.stringify({ 
              error: 'OpenAI service is temporarily overloaded. Please try again in a few moments.',
              success: false,
              retryable: true
            }), {
              status: 503,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          return new Response(JSON.stringify({ 
            error: `PDF processing failed: ${response.status === 429 ? 'Rate limit exceeded. Please try again later.' : 'AI service error'}`,
            success: false,
            retryable: response.status === 429 || response.status >= 500
          }), {
            status: response.status >= 500 ? 503 : 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const result = await response.json();
        console.log('OpenAI response received');
        
        if (!result.choices || !result.choices[0] || !result.choices[0].message) {
          console.error('Unexpected OpenAI response format:', result);
          return new Response(JSON.stringify({ 
            error: 'No content returned from OpenAI API',
            success: false 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const extractedText = result.choices[0].message.content;
        
        if (!extractedText || extractedText.trim().length === 0) {
          console.error('No text content extracted');
          return new Response(JSON.stringify({ 
            error: 'No text content could be extracted from the PDF',
            success: false 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log(`Successfully extracted ${extractedText.length} characters of text`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          text: extractedText.trim(),
          type: "document",
          confidence: 0.95
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      } catch (openaiError) {
        console.error('OpenAI processing error:', openaiError);
        return new Response(JSON.stringify({ 
          error: "Failed to parse PDF with OpenAI: " + (openaiError instanceof Error ? openaiError.message : openaiError),
          success: false
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      console.error('Unsupported file type:', mimeType);
      return new Response(JSON.stringify({ 
        error: "Unsupported file type. Only PDF files are currently supported.",
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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