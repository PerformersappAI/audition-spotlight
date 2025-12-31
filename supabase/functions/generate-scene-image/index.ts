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
      sceneType,
      synopsis,
      visualStyle,
      genre,
      projectTitle,
      moodboardImages
    } = await req.json();
    
    if (!sceneType) {
      return new Response(
        JSON.stringify({ error: "Scene type is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const genreStyle = genre?.join(", ") || "dramatic";
    const styleGuide = visualStyle || "cinematic, professional film look";
    
    let scenePrompt = "";
    
    switch (sceneType) {
      case "synopsis":
        scenePrompt = `Create a dramatic cinematic scene that captures the essence of this story:

"${synopsis?.substring(0, 500) || 'A compelling dramatic story'}"

This is for a ${genreStyle} film titled "${projectTitle || 'Untitled'}".`;
        break;
      case "hero":
        scenePrompt = `Create a stunning hero shot for a ${genreStyle} film titled "${projectTitle || 'Untitled'}".
        
The image should be epic, cinematic, and capture the essence of ${genreStyle} storytelling.`;
        break;
      case "mood":
        scenePrompt = `Create an atmospheric mood shot that establishes the tone for a ${genreStyle} film.
        
Project: "${projectTitle || 'Untitled'}"
Style: ${styleGuide}

The image should evoke emotion and set the visual tone for the entire project.`;
        break;
      default:
        scenePrompt = `Create a cinematic scene for a ${genreStyle} film.`;
    }

    const prompt = `${scenePrompt}

Visual Style Requirements:
- ${styleGuide}
- Professional film production quality
- Cinematic aspect ratio (16:9)
- Dramatic lighting and composition
- Movie poster / key art quality
- High-end visual effects if appropriate for the genre`;

    console.log("Generating scene image:", sceneType);

    // Build messages - optionally with style reference images
    const messages: any[] = [];
    
    if (moodboardImages && moodboardImages.length > 0) {
      // Use moodboard as style reference
      const content: any[] = [
        { 
          type: "text", 
          text: `Use the visual style, color palette, and aesthetic from these reference images to inform the look of the generated scene:\n\n${prompt}` 
        }
      ];
      
      // Add up to 2 moodboard images as style references
      moodboardImages.slice(0, 2).forEach((img: string) => {
        content.push({ type: "image_url", image_url: { url: img } });
      });
      
      messages.push({ role: "user", content });
    } else {
      messages.push({ role: "user", content: prompt });
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
    console.log("Scene image generated:", sceneType);

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).substring(0, 500));
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        sceneType,
        message: `Scene image generated successfully`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Scene image generation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate scene image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
