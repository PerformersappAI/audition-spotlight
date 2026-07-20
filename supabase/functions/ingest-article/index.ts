import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-ingest-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const SECRET = "sd_blog_ingest_9Fx4Tm2Qw7Lp";

function slugify(s: string) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80) || `post-${Date.now()}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "content-type": "application/json" } });
  try {
    const body = await req.json().catch(() => ({}));
    const secret = req.headers.get("x-ingest-secret") || (body as any).secret || "";
    if (secret !== SECRET) return json({ error: "unauthorized" }, 401);
    const title = String((body as any).title || "").trim();
    if (!title) return json({ error: "missing title" }, 400);
    const content = String((body as any).body || (body as any).content || "").trim();
    if (!content) return json({ error: "missing body" }, 400);
    let slug = slugify((body as any).slug || title);
    const published = (body as any).published === true;
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const row: Record<string, unknown> = {
      title,
      slug,
      body: content,
      excerpt: (body as any).excerpt ? String((body as any).excerpt) : null,
      cover_image: (body as any).imageUrl || (body as any).cover_image || null,
      author_name: (body as any).author_name || null,
      published,
      published_at: published ? new Date().toISOString() : null,
    };
    let ins = await sb.from("blog_posts").insert(row).select("id, slug").maybeSingle();
    if (ins.error && /duplicate|unique/i.test(ins.error.message)) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
      row.slug = slug;
      ins = await sb.from("blog_posts").insert(row).select("id, slug").maybeSingle();
    }
    if (ins.error) return json({ error: ins.error.message }, 500);
    return json({ ok: true, id: ins.data?.id, slug: ins.data?.slug, url: `/blog/${ins.data?.slug}` });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) });
  }
});
