import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const BUCKET = "table-reads";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { id } = await req.json().catch(() => ({ id: null }));
    if (!id || typeof id !== "string") {
      return json({ error: "Missing id" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: read, error } = await admin
      .from("table_reads")
      .select("id, user_id, audio_url, is_public")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Lookup failed:", error.message);
      return json({ error: "Lookup failed" }, 500);
    }
    if (!read || !read.audio_url) return json({ error: "Not found" }, 404);

    if (!read.is_public) {
      // Private: only the owner may fetch a link.
      const authHeader = req.headers.get("Authorization") ?? "";
      const token = authHeader.replace("Bearer ", "").trim();
      if (!token) return json({ error: "Not found" }, 404);
      const { data: userData } = await admin.auth.getUser(token);
      if (!userData?.user || userData.user.id !== read.user_id) {
        return json({ error: "Not found" }, 404);
      }
    }

    const marker = `/${BUCKET}/`;
    const idx = read.audio_url.indexOf(marker);
    const path =
      idx >= 0 ? read.audio_url.slice(idx + marker.length) : read.audio_url;

    const { data: signed, error: signError } = await admin.storage
      .from(BUCKET)
      .createSignedUrl(decodeURIComponent(path), 3600);

    if (signError || !signed) {
      console.error("Signing failed:", signError?.message);
      return json({ error: "Could not create audio link" }, 500);
    }

    return json({ url: signed.signedUrl });
  } catch (err) {
    console.error("table-read-audio error:", err);
    return json({ error: "Unexpected error" }, 500);
  }
});
