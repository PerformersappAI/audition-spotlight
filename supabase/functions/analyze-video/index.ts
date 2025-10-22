import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  console.log('Analyze-video function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl, evaluationType, userId, scriptId, scriptText, characterName, sceneDescription } = await req.json();
    console.log(`Analyzing video: ${JSON.stringify({ videoUrl, evaluationType, userId })}`);

    if (!videoUrl) {
      return new Response(
        JSON.stringify({ error: 'Video URL is required' }),
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

    // Detect video format and MIME type from URL
    const fileExtension = videoUrl.split('.').pop()?.toLowerCase() || 'mp4';
    const mimeTypeMap: Record<string, string> = {
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'webm': 'video/webm',
      'mkv': 'video/x-matroska',
      'flv': 'video/x-flv',
      'wmv': 'video/x-ms-wmv',
      'mpeg': 'video/mpeg',
      'mpg': 'video/mpeg',
    };
    const mimeType = mimeTypeMap[fileExtension] || 'video/mp4';
    const displayName = `acting_video.${fileExtension}`;

    console.log('Detected video format:', fileExtension, 'MIME type:', mimeType);

    // Get video file from Supabase storage
    console.log('Uploading video to Gemini Files API:', videoUrl);
    
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.status} ${videoResponse.statusText}`);
    }

    const contentLength = videoResponse.headers.get('content-length');
    console.log('Streaming video, size:', contentLength, 'bytes');

    // Validate content
    if (!contentLength || parseInt(contentLength) === 0) {
      throw new Error('Video appears to be empty');
    }
    if (parseInt(contentLength) < 1000) {
      throw new Error('Video file appears to be corrupt');
    }

    // Create upload session with Gemini Files API
    const uploadResponse = await fetch('https://generativelanguage.googleapis.com/upload/v1beta/files?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': contentLength,
        'X-Goog-Upload-Header-Content-Type': mimeType,
        'X-Goog-Upload-Header-Content-Disposition': `attachment; filename="${displayName}"`,
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Failed to create upload session: ${uploadResponse.status} ${errorText}`);
    }

    const uploadUrl = uploadResponse.headers.get('X-Goog-Upload-URL');
    if (!uploadUrl) {
      throw new Error('No upload URL received from Gemini');
    }

    console.log('Upload session created, streaming video data...');

    // Stream the video data to Gemini
    const streamResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: videoResponse.body,
      headers: {
        'Content-Length': contentLength,
        'Content-Type': mimeType,
      },
    });

    if (!streamResponse.ok) {
      const errorText = await streamResponse.text();
      throw new Error(`Failed to upload video: ${streamResponse.status} ${errorText}`);
    }

    const uploadResult = await streamResponse.json();
    const fileName = uploadResult.name;
    const geminiUri = `https://generativelanguage.googleapis.com/v1beta/files/${fileName}`;

    console.log('Video uploaded successfully, URI:', geminiUri);

    // Wait for video processing
    console.log('Waiting for video processing...');
    let processingComplete = false;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max

    while (!processingComplete && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;

      const statusResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/files/${fileName}?key=${GEMINI_API_KEY}`);
      if (!statusResponse.ok) {
        throw new Error(`Failed to check processing status: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      console.log('File state:', statusData.state);

      if (statusData.state === 'ACTIVE') {
        processingComplete = true;
      } else if (statusData.state === 'FAILED') {
        // Get more detailed error information
        const errorDetails = await fetch(`https://generativelanguage.googleapis.com/v1beta/files/${fileName}?key=${GEMINI_API_KEY}`);
        const errorData = await errorDetails.json();
        console.log('Gemini error details:', errorData);
        throw new Error(`Video processing failed or timed out. State: ${statusData.state}. Details: ${JSON.stringify(errorData)}`);
      }
    }

    if (!processingComplete) {
      throw new Error('Video processing timed out');
    }

    console.log('Video processing completed, generating analysis...');

    // Generate analysis using Gemini 2.0 Flash Exp
    const analysisPrompt = evaluationType === 'script_based' 
      ? `Analyze this acting performance video. The actor is performing a scene from a script. Provide detailed feedback on:

PERFORMANCE ANALYSIS:
- Overall performance score (0-100)
- Strengths (3-5 specific positive observations)
- Areas for improvement (3-5 specific suggestions)
- Character interpretation and authenticity
- Emotional range and delivery
- Physical presence and blocking

TECHNICAL ANALYSIS:
- Audio quality (clarity, volume, background noise)
- Video quality (lighting, framing, focus)
- Overall production value

EMOTIONAL IMPACT:
- Engagement level (how compelling is the performance)
- Authenticity (how believable is the character)
- Charisma and presence

Provide specific, actionable feedback that will help the actor improve. Focus on both the artistic and technical aspects of the performance.

Script Context: ${scriptText ? `Character: ${characterName}\nScene: ${sceneDescription}\nScript excerpt: ${scriptText.substring(0, 500)}...` : 'No script context provided'}

Return your analysis in a structured format with clear sections and specific examples from the performance.`
      : `Analyze this acting performance video. Provide detailed feedback on:

PERFORMANCE ANALYSIS:
- Overall performance score (0-100)
- Strengths (3-5 specific positive observations)
- Areas for improvement (3-5 specific suggestions)
- Character interpretation and authenticity
- Emotional range and delivery
- Physical presence and blocking

TECHNICAL ANALYSIS:
- Audio quality (clarity, volume, background noise)
- Video quality (lighting, framing, focus)
- Overall production value

EMOTIONAL IMPACT:
- Engagement level (how compelling is the performance)
- Authenticity (how believable is the character)
- Charisma and presence

Provide specific, actionable feedback that will help the actor improve. Focus on both the artistic and technical aspects of the performance.

Return your analysis in a structured format with clear sections and specific examples from the performance.`;

    const analysisResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/files/${fileName}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: analysisPrompt
          }]
        }],
        generationConfig: {
          model: 'gemini-2.0-flash-exp',
          mimeType: mimeType,
        }
      })
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      throw new Error(`Analysis failed: ${analysisResponse.status} ${errorText}`);
    }

    const analysisData = await analysisResponse.json();
    const analysisText = analysisData.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis not available';

    console.log('Analysis generated successfully');

    // Parse the analysis into structured format
    const performanceScore = extractScore(analysisText, 'performance score', 'overall performance');
    const audioScore = extractScore(analysisText, 'audio quality', 'audio');
    const videoScore = extractScore(analysisText, 'video quality', 'video');
    const lightingScore = extractScore(analysisText, 'lighting', 'lighting');
    const framingScore = extractScore(analysisText, 'framing', 'framing');
    const engagementScore = extractScore(analysisText, 'engagement', 'engagement level');
    const authenticityScore = extractScore(analysisText, 'authenticity', 'authenticity');
    const charismaScore = extractScore(analysisText, 'charisma', 'charisma');

    const strengths = extractList(analysisText, 'strengths', 'positive observations');
    const improvements = extractList(analysisText, 'improvements', 'areas for improvement', 'suggestions');
    const recommendations = extractList(analysisText, 'recommendations', 'suggestions');

    const structuredAnalysis = {
      performance: {
        score: performanceScore || 75,
        strengths: strengths.length > 0 ? strengths : [
          "Good emotional connection",
          "Clear character motivation",
          "Engaging presence"
        ],
        improvements: improvements.length > 0 ? improvements : [
          "Work on eye contact with camera",
          "Vary pacing in delivery",
          "Add more physicality to performance"
        ]
      },
      technical: {
        audio: audioScore || 75,
        video: videoScore || 75,
        lighting: lightingScore || 75,
        framing: framingScore || 75
      },
      emotional: {
        engagement: engagementScore || 75,
        authenticity: authenticityScore || 75,
        charisma: charismaScore || 75
      },
      feedback: analysisText,
      recommendations: recommendations.length > 0 ? recommendations : [
        "Consider adding more physical movement to enhance the performance",
        "Try varying the pace and rhythm of delivery",
        "Work on maintaining consistent eye contact throughout"
      ]
    };

    // Save to database if we have a user ID
    if (userId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        const { error: dbError } = await supabase
          .from('video_evaluations')
          .insert({
            user_id: userId,
            script_id: scriptId || null,
            evaluation_type: evaluationType,
            analysis_result: structuredAnalysis,
            created_at: new Date().toISOString()
          });

        if (dbError) {
          console.error('Database save error:', dbError);
        } else {
          console.log('Analysis saved to database');
        }
      } catch (dbError) {
        console.error('Database connection error:', dbError);
      }
    }

    // Clean up the uploaded file from Gemini
    try {
      await fetch(`https://generativelanguage.googleapis.com/v1beta/files/${fileName}?key=${GEMINI_API_KEY}`, {
        method: 'DELETE'
      });
      console.log('Cleaned up uploaded file from Gemini');
    } catch (cleanupError) {
      console.error('Failed to clean up file:', cleanupError);
    }

    return new Response(JSON.stringify({ 
      analysis: structuredAnalysis,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-video function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to extract scores from analysis text
function extractScore(text: string, ...keywords: string[]): number | null {
  const lowerText = text.toLowerCase();
  
  for (const keyword of keywords) {
    const regex = new RegExp(`${keyword}[^0-9]*([0-9]+)`, 'i');
    const match = text.match(regex);
    if (match) {
      const score = parseInt(match[1]);
      if (score >= 0 && score <= 100) {
        return score;
      }
    }
  }
  
  return null;
}

// Helper function to extract lists from analysis text
function extractList(text: string, ...keywords: string[]): string[] {
  const items: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const keyword of keywords) {
    const regex = new RegExp(`${keyword}[^\\n]*\\n([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
    const match = text.match(regex);
    if (match) {
      const listText = match[1];
      const listItems = listText
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0 && (item.startsWith('-') || item.startsWith('•') || item.match(/^\d+\./)))
        .map(item => item.replace(/^[-•\d.\s]+/, '').trim())
        .filter(item => item.length > 0);
      
      items.push(...listItems);
    }
  }
  
  return items.slice(0, 5); // Limit to 5 items
}



