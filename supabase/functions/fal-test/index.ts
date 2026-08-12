import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const KEY = Deno.env.get("FAL_KEY");
  if (!KEY) {
    return new Response(JSON.stringify({ ok: false, error: "FAL_KEY is not configured" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  try {
    const r = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: { "Authorization": `Key ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const text = await r.text();
    const authOk = r.status !== 401 && r.status !== 403;
    return new Response(JSON.stringify({ ok: authOk, status: r.status, detail: text.slice(0, 200) }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
