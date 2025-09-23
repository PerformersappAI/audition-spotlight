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

  try {
    const { fileData, fileName, mimeType } = await req.json();

    if (!fileData) {
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

    console.log(`Parsing document with Gemini: ${fileName} (${mimeType})`);

    if (mimeType === 'application/pdf') {
      try {
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
                  text: "Please extract all the text content from this PDF document. Return only the text content, preserving line breaks and formatting where possible. Do not add any commentary or explanations."
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

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API error:', response.status, errorText);
          throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        
        if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
          console.error('Unexpected Gemini response format:', result);
          throw new Error('No content returned from Gemini API');
        }

        const extractedText = result.candidates[0].content.parts[0].text;
        
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error('No text content could be extracted from the PDF');
        }

        console.log(`Successfully extracted ${extractedText.length} characters of text using Gemini`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          text: extractedText.trim(),
          type: "document",
          confidence: 0.95
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      } catch (geminiError) {
        console.error('Gemini parsing error:', geminiError);
        throw new Error("Failed to parse PDF with Gemini: " + geminiError.message);
      }
    } else {
      throw new Error("Unsupported file type. Only PDF files are currently supported.");
    }

  } catch (error) {
    console.error('Error in parse-document function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});