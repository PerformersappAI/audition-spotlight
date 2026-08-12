import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const KEY = (Deno.env.get("HIGGSFIELD_API_KEY") || "").trim();
  const SECRET = (Deno.env.get("HIGGSFIELD_API_SECRET") || "").trim();
  if (!KEY) {
    return new Response(JSON.stringify({ ok: false, error: "HIGGSFIELD_API_KEY is not configured" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const token = KEY.includes(":") ? KEY : (SECRET ? `${KEY}:${SECRET}` : `${KEY}:${KEY}`);
  try {
    const r = await fetch("https://platform.higgsfield.ai/higgsfield-ai/dop/standard", {
      method: "POST",
      headers: { Authorization: `Key ${token}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({}),
    });
    const text = await r.text();
    const authOk = r.status !== 401 && r.status !== 403;
    return new Response(JSON.stringify({ ok: authOk, status: r.status, detail: text.slice(0, 200) }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
