import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

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

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (mimeType === 'application/pdf') {
      try {
        console.log('Sending PDF to Gemini for processing...');
        
        // Send PDF to Gemini for text extraction
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: `Please extract and clean the script text from this PDF document. Focus on:
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
                  inline_data: {
                    mime_type: "application/pdf",
                    data: fileData
                  }
                }
              ]
            }],
            generationConfig: {
              temperature: 0,
              maxOutputTokens: 8192,
            }
          })
        });

        console.log(`Gemini response status: ${response.status}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API error:', response.status, errorText);
          return new Response(JSON.stringify({ 
            error: `Gemini API error: ${response.status} - ${errorText}`,
            success: false 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const result = await response.json();
        console.log('Gemini response received');
        
        if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
          console.error('Unexpected Gemini response format:', result);
          return new Response(JSON.stringify({ 
            error: 'No content returned from Gemini API',
            success: false 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const extractedText = result.candidates[0].content.parts[0].text;
        
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
        
      } catch (geminiError) {
        console.error('Gemini processing error:', geminiError);
        return new Response(JSON.stringify({ 
          error: "Failed to parse PDF with Gemini: " + (geminiError instanceof Error ? geminiError.message : geminiError),
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