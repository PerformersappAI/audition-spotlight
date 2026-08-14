import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const USER_ID = "294043c8-3cd5-499b-93a9-1ca7d1dff45d";

Deno.serve(async () => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const bytes = new Uint8Array(48);
  crypto.getRandomValues(bytes);
  const password = btoa(String.fromCharCode(...bytes)) + "aA1!";

  const { error } = await admin.auth.admin.updateUserById(USER_ID, { password });

  return new Response(
    JSON.stringify({ ok: !error, error: error?.message ?? null }),
    { headers: { "Content-Type": "application/json" } },
  );
});
