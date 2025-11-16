import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

// Cache for discovered models (1 hour TTL)
const modelCache = {
  models: [] as string[],
  lastFetch: 0,
  ttl: 60 * 60 * 1000, // 1 hour
};

// Fallback models in order of preference
const FALLBACK_MODELS = [
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

async function discoverAvailableModels(): Promise<string[]> {
  // Check cache first
  const now = Date.now();
  if (modelCache.models.length > 0 && (now - modelCache.lastFetch) < modelCache.ttl) {
    console.log('Using cached models:', modelCache.models);
    return modelCache.models;
  }

  try {
    console.log('Discovering available Gemini models...');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    
    if (!response.ok) {
      console.warn(`Model discovery failed: ${response.status}, falling back to predefined models`);
      return FALLBACK_MODELS;
    }

    const data = await response.json();
    const availableModels = data.models
      ?.filter((model: any) => 
        model.name?.includes('gemini') && 
        model.supportedGenerationMethods?.includes('generateContent')
      )
      .map((model: any) => model.name.replace('models/', ''))
      .sort((a: string, b: string) => {
        // Prioritize newer models
        if (a.includes('2.0')) return -1;
        if (b.includes('2.0')) return 1;
        if (a.includes('1.5')) return -1;
        if (b.includes('1.5')) return 1;
        return 0;
      }) || [];

    if (availableModels.length > 0) {
      modelCache.models = availableModels;
      modelCache.lastFetch = now;
      console.log('Discovered models:', availableModels);
      return availableModels;
    }
  } catch (error) {
    console.warn('Model discovery error:', error);
  }

  console.log('Using fallback models:', FALLBACK_MODELS);
  return FALLBACK_MODELS;
}

async function processWithGemini(base64Data: string, modelName: string): Promise<any> {
  const prompt = `You are a professional script formatting assistant. Extract and clean script text from the provided PDF document. Focus on:
1. Remove OCR artifacts, weird characters, and encoding issues
2. Standardize character names to ALL CAPS format
3. Clean up stage directions and put them in parentheses
4. Preserve scene headings (INT./EXT.) 
5. Remove page numbers, headers, footers
6. Ensure proper spacing between dialogue and action lines
7. Fix line breaks and formatting for readability
8. Remove any non-script content like title pages or notes

Return only the cleaned script text with proper formatting. Do not add commentary.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "application/pdf",
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 8000,
        temperature: 0.1
      }
    })
  });

  return response;
}

async function processImageWithGemini(base64Data: string, modelName: string, mimeType: string): Promise<any> {
  const prompt = `Extract all readable text from this image using OCR.

Instructions:
1. Accurately transcribe all visible text
2. Preserve layout and structure where possible
3. Handle any handwriting if present
4. Clean up any OCR artifacts
5. If there are multiple sections or columns, transcribe them in logical reading order
6. Return plain text without markdown formatting

Return only the extracted text without any commentary.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 8000,
        temperature: 0.1
      }
    })
  });

  return response;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Parse-document function called');

  try {
    const { fileData, fileName, mimeType, idempotencyKey } = await req.json();
    
    // Log the request with idempotency key for debugging
    console.log(`Processing request - File: ${fileName}, Idempotency Key: ${idempotencyKey || 'none'}`);

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

    // Validate file type - support PDF and images
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
        console.log(`Processing ${isPDF ? 'PDF' : 'image'} with Gemini...`);
        
        // Convert data to base64 if not already
        const base64Data = fileData.startsWith('data:') ? fileData.split(',')[1] : fileData;
        
        // Discover available models
        const availableModels = await discoverAvailableModels();
        
        let lastError: { model: string; status?: number; error: any } | null = null;
        let successfulModel = null;
        
        // Try each available model until one works
        for (const modelName of availableModels) {
          try {
            console.log(`Attempting ${isPDF ? 'PDF' : 'image'} processing with model: ${modelName}`);
            
            const response = isPDF 
              ? await processWithGemini(base64Data, modelName)
              : await processImageWithGemini(base64Data, modelName, mimeType);
            
            console.log(`${modelName} response status: ${response.status}`);

            if (response.ok) {
              const result = await response.json();
              
              if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                successfulModel = modelName;
                console.log(`✅ Successfully processed ${isPDF ? 'PDF' : 'image'} with model: ${modelName}`);
                
                const extractedText = result.candidates[0].content.parts[0].text;
                
                return new Response(JSON.stringify({ 
                  success: true, 
                  text: extractedText.trim(),
                  type: "document",
                  confidence: 0.95,
                  modelUsed: modelName
                }), {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
              } else {
                console.warn(`Model ${modelName} returned empty content, trying next model...`);
                continue;
              }
            } else {
              const errorText = await response.text();
              lastError = { model: modelName, status: response.status, error: errorText };
              console.warn(`Model ${modelName} failed with status ${response.status}: ${errorText}`);
              
              // Handle specific errors that shouldn't retry other models
              if (response.status === 400 && errorText.includes('API key')) {
                console.error('API key issue detected, stopping model attempts');
                return new Response(JSON.stringify({ 
                  error: 'API key expired or invalid. Please update your Gemini API key.',
                  success: false,
                  retryable: false
                }), {
                  status: 401,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
              }
              
              continue; // Try next model
            }
          } catch (modelError) {
            console.warn(`Error with model ${modelName}:`, modelError);
            lastError = { model: modelName, error: modelError };
            continue; // Try next model
          }
        }
        
        // If we get here, all models failed
        console.error('All models failed. Last error:', lastError);
        
        // Handle specific error types
        if (lastError?.status === 503) {
          return new Response(JSON.stringify({ 
            error: 'Gemini service is temporarily overloaded. Please try again in a few moments.',
            success: false,
            retryable: true
          }), {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        if (lastError?.status === 429) {
          return new Response(JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again later.',
            success: false,
            retryable: true
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Create error message safely
        const errorMessage = lastError ? 
          (typeof lastError.error === 'string' ? lastError.error : 
           lastError.error instanceof Error ? lastError.error.message : 
           'Unknown error') : 'Unknown error';
        
        return new Response(JSON.stringify({ 
          error: `${isPDF ? 'PDF' : 'Image'} processing failed with all available models. Last error: ${errorMessage}`,
          success: false,
          retryable: true,
          modelsAttempted: availableModels
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (geminiError) {
        console.error('Gemini processing error:', geminiError);
        return new Response(JSON.stringify({ 
          error: `Failed to parse ${isPDF ? 'PDF' : 'image'} with Gemini: ` + (geminiError instanceof Error ? geminiError.message : String(geminiError)),
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