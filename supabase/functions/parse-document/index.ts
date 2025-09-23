import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log(`Parsing document: ${fileName} (${mimeType})`);

    // For now, we'll use a simple approach that works with most text-based PDFs
    // In a production environment, you'd want to use a proper PDF parsing library
    
    if (mimeType === 'application/pdf') {
      try {
        // Convert base64 to ArrayBuffer
        const binaryString = atob(fileData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Simple text extraction - look for text patterns in PDF
        const pdfText = new TextDecoder('utf-8').decode(bytes);
        
        // Extract readable text using regex patterns common in PDFs
        const textMatches = pdfText.match(/\(([^)]+)\)/g) || [];
        const extractedLines = textMatches
          .map(match => match.replace(/[()]/g, ''))
          .filter(line => line.trim().length > 0 && !line.includes('\\') && line.length > 2)
          .join('\n');
          
        if (extractedLines.length > 50) {
          console.log(`Successfully extracted ${extractedLines.length} characters of text`);
          
          return new Response(JSON.stringify({ 
            success: true, 
            text: extractedLines,
            type: "document",
            confidence: 0.7
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // If simple extraction fails, return error with helpful message
        throw new Error("Could not extract readable text from PDF. The file may be image-based or protected.");
        
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        throw new Error("Failed to parse PDF: " + pdfError.message);
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