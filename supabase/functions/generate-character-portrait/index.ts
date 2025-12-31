import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      characterName, 
      characterDescription, 
      characterRole,
      referencePhotoUrl,
      styleDescription,
      genre,
      projectTitle
    } = await req.json();
    
    if (!characterName) {
      return new Response(
        JSON.stringify({ error: "Character name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt for character portrait
    const genreStyle = genre?.join(", ") || "dramatic";
    const styleGuide = styleDescription || "cinematic, professional film photography";
    
    let prompt = `Create a professional cinematic character portrait for a ${genreStyle} film titled "${projectTitle || 'Untitled'}".

Character: ${characterName}
Role: ${characterRole || 'main character'}
Description: ${characterDescription || 'A compelling character'}

Visual Style: ${styleGuide}

Requirements:
- Professional movie poster quality portrait
- Dramatic cinematic lighting
- Character should embody their role and personality
- High-end film production aesthetic
- 2:3 portrait aspect ratio
- Moody, atmospheric background that suggests the film's genre`;

    console.log("Generating character portrait for:", characterName);

    // If reference photo is provided, use multimodal input
    const messages: any[] = [];
    
    if (referencePhotoUrl) {
      prompt = `Using the person in this reference photo as inspiration for the face/likeness, create a professional cinematic character portrait.

${prompt}

Important: Transform this person into the character ${characterName} while maintaining recognizable features. Apply the film's visual style and make it look like a professional movie poster portrait.`;
      
      messages.push({
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: referencePhotoUrl } }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: prompt
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages,
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Character portrait generated for:", characterName);

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).substring(0, 500));
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        characterName,
        message: `Portrait generated for ${characterName}`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Character portrait generation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate character portrait" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
