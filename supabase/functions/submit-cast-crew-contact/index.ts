import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

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

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

const esc = (v: string | null) =>
  (v ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));

    // Honeypot — pretend success, do nothing.
    if (clean(body.website)) {
      return json({ success: true });
    }

    const slug = clean(body.slug, 64);
    if (!slug) return json({ error: "Missing slug" }, 400);

    const supabaseLookup = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // Public metadata lookup (production name only) for rendering the form.
    if (body.lookup_only === true) {
      const { data } = await supabaseLookup
        .from("cast_crew_forms")
        .select("production_name")
        .eq("slug", slug)
        .maybeSingle();
      if (!data) return json({ error: "Form not found" }, 404);
      return json({ production_name: data.production_name ?? null });
    }

    const first_name = clean(body.first_name, 120);
    const last_name = clean(body.last_name, 120);
    const phone = clean(body.phone, 60);
    const email = clean(body.email, 320);
    const job_position = clean(body.job_position, 120);

    if (!first_name || !last_name || !phone || !email || !job_position) {
      return json({ error: "Missing required fields" }, 400);
    }


    const contact = {
      first_name,
      last_name,
      phone,
      email,
      job_position,
      instagram_handle: clean(body.instagram_handle, 120),
      other_role: clean(body.other_role, 160),
      character_name: clean(body.character_name, 160),
      actor_type: clean(body.actor_type, 60),
      notes: clean(body.notes, 4000),
    };

    const supabase = supabaseLookup;


    const { data: form, error: formError } = await supabase
      .from("cast_crew_forms")
      .select("id, owner_user_id, notify_email, production_name")
      .eq("slug", slug)
      .maybeSingle();

    if (formError) {
      console.error("Form lookup failed:", formError.message);
      return json({ error: "Lookup failed" }, 500);
    }
    if (!form) return json({ error: "Form not found" }, 404);

    const { error: insertError } = await supabase
      .from("cast_crew_contacts")
      .insert({
        ...contact,
        form_id: form.id,
        owner_user_id: form.owner_user_id,
      });

    if (insertError) {
      console.error("Insert failed:", insertError.message);
      return json({ error: "Could not save submission" }, 500);
    }

    // Notification email (non-fatal)
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey && form.notify_email) {
      try {
        const resend = new Resend(resendKey);
        const rows: [string, string | null][] = [
          ["Name", `${first_name} ${last_name}`],
          ["Phone", phone],
          ["Email", email],
          ["Instagram", contact.instagram_handle],
          ["Job / Position", job_position],
          ["Specified role", contact.other_role],
          ["Character / Role name", contact.character_name],
          ["Type", contact.actor_type],
          ["Notes", contact.notes],
        ];

        const tableRows = rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) => `
              <tr>
                <td style="padding:10px 0;color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:0.06em;width:38%;vertical-align:top;">${esc(k)}</td>
                <td style="padding:10px 0;color:#ffffff;font-size:15px;vertical-align:top;">${esc(v)}</td>
              </tr>`,
          )
          .join("");

        await resend.emails.send({
          from: "Filmmaker Genius <noreply@filmmakergenius.com>",
          to: [form.notify_email],
          reply_to: email,
          subject: `New cast/crew submission: ${first_name} ${last_name} (${job_position})`,
          html: `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#0a0a12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
    <div style="background:#0d0d1a;border:1px solid #1e1e35;border-radius:18px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#111124 0%,#0a0a12 100%);padding:26px 28px;border-bottom:1px solid #1e1e35;">
        <div style="color:#00d4aa;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Filmmaker Genius</div>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;">New Cast &amp; Crew Submission</h1>
        ${form.production_name ? `<div style="margin-top:6px;color:rgba(255,255,255,0.45);font-size:14px;">${esc(form.production_name)}</div>` : ""}
      </div>
      <div style="padding:24px 28px;">
        <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
      </div>
      <div style="padding:18px 28px;border-top:1px solid #1e1e35;color:rgba(255,255,255,0.3);font-size:12px;">
        Reply to this email to reach ${esc(first_name)} directly.
      </div>
    </div>
  </div>
</body></html>`,
        });
      } catch (mailErr) {
        console.error("Notification email failed:", mailErr);
      }
    } else if (!resendKey) {
      console.warn("RESEND_API_KEY not set — skipped notification email.");
    }

    return json({ success: true });
  } catch (err) {
    console.error("submit-cast-crew-contact error:", err);
    return json({ error: "Unexpected error" }, 500);
  }
});
