import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const KEY = Deno.env.get("ELEVENLABS_API_KEY");
  if (!KEY) {
    return new Response(JSON.stringify({ error: "ELEVENLABS_API_KEY is not configured" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let payload: { action?: string; voiceId?: string; text?: string } = {};
  try { payload = await req.json(); } catch { /* default to list */ }
  const action = payload.action || "list";

  try {
    if (action === "tts") {
      const { voiceId, text } = payload;
      if (!voiceId || !text) throw new Error("voiceId and text are required");
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
        method: "POST",
        headers: { "xi-api-key": KEY, "Content-Type": "application/json", "Accept": "audio/mpeg" },
        body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" }),
      });
      if (!r.ok) { const t = await r.text(); throw new Error(`ElevenLabs TTS ${r.status}: ${t.slice(0, 300)}`); }
      const bytes = new Uint8Array(await r.arrayBuffer());
      let binary = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      const b64 = btoa(binary);
      return new Response(JSON.stringify({ audio: `data:audio/mpeg;base64,${b64}` }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const r = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": KEY } });
    if (!r.ok) { const t = await r.text(); throw new Error(`ElevenLabs voices ${r.status}: ${t.slice(0, 300)}`); }
    const data = await r.json();
    const voices = (data.voices || []).map((v: { voice_id: string; name: string; category?: string }) => ({
      id: v.voice_id, name: v.name, category: v.category || "premade",
    }));
    return new Response(JSON.stringify({ voices }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
