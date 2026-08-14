import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    const user = userData?.user;
    if (userError || !user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => null);
    const formId = typeof body?.formId === "string" ? body.formId : "";
    const pdfBase64 = typeof body?.pdfBase64 === "string" ? body.pdfBase64 : "";
    const fileName = typeof body?.fileName === "string" && body.fileName.length < 160
      ? body.fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
      : "cast-crew-contact-sheet.pdf";
    const contactCount = Number.isFinite(body?.contactCount) ? Number(body.contactCount) : 0;

    if (!formId || !pdfBase64) return json({ error: "formId and pdfBase64 are required" }, 400);
    if (pdfBase64.length > 12_000_000) return json({ error: "Report too large to email" }, 400);

    // Only the owner may email their own report, and only to their saved notify email.
    const { data: form, error: formError } = await supabase
      .from("cast_crew_forms")
      .select("id, production_name, notify_email, owner_user_id")
      .eq("id", formId)
      .eq("owner_user_id", user.id)
      .maybeSingle();

    if (formError) return json({ error: formError.message }, 500);
    if (!form) return json({ error: "Form not found" }, 404);

    const to = form.notify_email || user.email;
    if (!to) return json({ error: "No notification email set on your form" }, 400);

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) return json({ error: "RESEND_API_KEY is not configured" }, 500);
    const resend = new Resend(resendKey);

    const production = form.production_name?.trim() || "Your production";

    const { error: sendError } = await resend.emails.send({
      from: "Filmmaker Genius <noreply@filmmakergenius.com>",
      to: [to],
      subject: `${production} — Cast & Crew contact sheet (${contactCount})`,
      html: `
        <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#121220;">
          <h1 style="font-size:20px;margin:0 0 8px;">${production}</h1>
          <p style="color:#00b08c;font-weight:700;letter-spacing:.06em;font-size:12px;margin:0 0 20px;">CAST &amp; CREW CONTACT SHEET</p>
          <p style="line-height:1.7;color:#333;">Your contact sheet is attached as a PDF. It includes ${contactCount} contact${contactCount === 1 ? "" : "s"} collected through your shareable form, grouped into cast and crew.</p>
          <p style="line-height:1.7;color:#666;font-size:13px;">Confidential — contains personal contact information. Share only with people who need it.</p>
          <p style="margin-top:28px;font-size:12px;color:#999;">Filmmaker Genius · Where Genius Meets the Silver Screen</p>
        </div>
      `,
      attachments: [{ filename: fileName, content: pdfBase64 }],
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      return json({ error: "Email failed", details: String(sendError) }, 502);
    }

    return json({ success: true, sentTo: to });
  } catch (error) {
    console.error("send-cast-crew-report error:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
