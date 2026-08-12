import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (b: unknown) => new Response(JSON.stringify(b), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!KEY) return json({ error: "LOVABLE_API_KEY is not configured" });
  try {
    const { mainQuestion = "", items = [] } = await req.json().catch(() => ({}));
    const qa = (items as { q: string; a: string }[])
      .filter((x) => x && x.a && String(x.a).trim())
      .map((x) => `Q: ${x.q}\nA: ${String(x.a).trim()}`)
      .join("\n\n");
    if (!qa) return json({ error: "Answer a few coaching questions first — then I can weave them into your answer." });

    const system = "You are a master screenwriter's development assistant. You turn a writer's scattered notes into ONE vivid, specific, cohesive answer. Rules: use ONLY the facts the writer gave you; you may smooth connective tissue, but do NOT invent major new facts (no new names, places, or events they did not mention). Write clean, confident prose — a short paragraph of 2 to 5 sentences. No headers, no bullet points, no preamble.";
    const user = `The writer is answering this question about their film's opening (the Ordinary World):\n\n"${mainQuestion}"\n\nHere are the writer's notes from a set of deeper coaching questions:\n\n${qa}\n\nWeave these notes into ONE polished answer to the question above — grounded only in what the writer provided. Return only the answer text.`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [ { role: "system", content: system }, { role: "user", content: user } ],
        temperature: 0.7,
        max_tokens: 700,
      }),
    });
    if (!r.ok) { const t = await r.text(); return json({ error: `AI gateway ${r.status}: ${t.slice(0, 200)}` }); }
    const j = await r.json();
    const content = j.choices?.[0]?.message?.content?.trim();
    return json({ text: content || "" });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) });
  }
});
