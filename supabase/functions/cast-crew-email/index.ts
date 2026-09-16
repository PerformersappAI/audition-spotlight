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

const FROM = "Filmmaker Genius <noreply@filmmakergenius.com>";
const REMINDERS_PER_OWNER_24H = 200;
const RESEND_COOLDOWN_HOURS = 12;

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isUuid = (v: unknown) =>
  typeof v === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

const shell = (inner: string) => `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#0a0a12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
    <div style="background:#0d0d1a;border:1px solid #1e1e35;border-radius:18px;overflow:hidden;">
      ${inner}
    </div>
    <div style="padding:16px 8px;color:rgba(255,255,255,0.25);font-size:12px;text-align:center;">
      Filmmaker Genius · Where Genius Meets the Silver Screen
    </div>
  </div>
</body></html>`;

const header = (kicker: string, title: string, sub?: string | null) => `
  <div style="background:linear-gradient(135deg,#111124 0%,#0a0a12 100%);padding:26px 28px;border-bottom:1px solid #1e1e35;">
    <div style="color:#00d4aa;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">${esc(kicker)}</div>
    <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;">${esc(title)}</h1>
    ${sub ? `<div style="margin-top:6px;color:rgba(255,255,255,0.45);font-size:14px;">${esc(sub)}</div>` : ""}
  </div>`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: userData, error: userError } = await admin.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    const user = userData?.user;
    if (userError || !user) return json({ error: "Unauthorized" }, 401);

    const { data: isAdminRow } = await admin.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    const isAdmin = isAdminRow === true;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) return json({ error: "RESEND_API_KEY is not configured" }, 500);
    const resend = new Resend(resendKey);

    const body = await req.json().catch(() => ({}));
    const action = clean(body?.action, 40);

    /* ---------------------------------------------- confirm */
    if (action === "confirm") {
      const ids: string[] = Array.isArray(body?.contact_ids)
        ? body.contact_ids.filter(isUuid).slice(0, 100)
        : [];
      if (ids.length === 0) return json({ error: "contact_ids required" }, 400);

      const { data: contacts, error: contactError } = await admin
        .from("cast_crew_contacts")
        .select(
          "id, form_id, owner_user_id, first_name, last_name, phone, email, instagram_handle, job_position, other_role, character_name, actor_type, notes",
        )
        .in("id", ids);
      if (contactError) return json({ error: contactError.message }, 500);

      const formIds = [...new Set((contacts ?? []).map((c) => c.form_id))];
      const { data: forms } = await admin
        .from("cast_crew_forms")
        .select("id, owner_user_id, production_name, notify_email")
        .in("id", formIds.length ? formIds : ["00000000-0000-0000-0000-000000000000"]);
      const formById = new Map((forms ?? []).map((f) => [f.id, f]));

      const results: { id: string; sent: boolean; reason?: string }[] = [];

      for (const c of contacts ?? []) {
        const form = formById.get(c.form_id);
        if (!form || (!isAdmin && form.owner_user_id !== user.id)) {
          results.push({ id: c.id, sent: false, reason: "Not your contact" });
          continue;
        }
        if (!c.email || !isEmail(c.email)) {
          results.push({ id: c.id, sent: false, reason: "No valid email" });
          continue;
        }

        const production = form.production_name?.trim() || "the production";
        const role =
          c.job_position === "Other" && c.other_role ? c.other_role : c.job_position;
        const rows: [string, string | null][] = [
          ["Name", [c.first_name, c.last_name].filter(Boolean).join(" ") || null],
          ["Phone", c.phone],
          ["Email", c.email],
          ["Instagram", c.instagram_handle],
          ["Job / Position", role],
          ["Character / Role name", c.character_name],
          ["Type", c.actor_type],
          ["Notes", c.notes],
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

        const html = shell(`
          ${header("Filmmaker Genius", `We got it — you're on the ${production} cast & crew list`, production)}
          <div style="padding:24px 28px;">
            <p style="margin:0 0 16px;color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;">
              Thanks for sending your details. Here's what we have on file:
            </p>
            <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
          </div>
          <div style="padding:18px 28px;border-top:1px solid #1e1e35;color:rgba(255,255,255,0.35);font-size:13px;">
            If anything is wrong, just reply to this email.
          </div>`);

        try {
          const replyTo = form.notify_email || user.email || undefined;
          const { error: sendError } = await resend.emails.send({
            from: FROM,
            to: [c.email],
            reply_to: replyTo,
            subject: `We got it — you're on the ${production} cast & crew list`,
            html,
          });
          if (sendError) throw new Error(String(sendError));
          await admin
            .from("cast_crew_contacts")
            .update({ confirmation_sent_at: new Date().toISOString() })
            .eq("id", c.id);
          results.push({ id: c.id, sent: true });
        } catch (mailErr) {
          console.error("confirm email failed:", mailErr);
          results.push({ id: c.id, sent: false, reason: "Email failed" });
        }
      }

      return json({ success: true, results, sent: results.filter((r) => r.sent).length });
    }

    /* ---------------------------------------------- remind */
    if (action === "remind") {
      const formId = isUuid(body?.form_id) ? (body.form_id as string) : "";
      if (!formId) return json({ error: "form_id required" }, 400);

      const { data: form } = await admin
        .from("cast_crew_forms")
        .select("id, owner_user_id, slug, production_name, notify_email")
        .eq("id", formId)
        .maybeSingle();
      if (!form) return json({ error: "Form not found" }, 404);
      if (!isAdmin && form.owner_user_id !== user.id) {
        return json({ error: "Forbidden" }, 403);
      }

      const raw = Array.isArray(body?.recipients) ? body.recipients : [];
      const recipients = raw
        .map((r: unknown) => {
          const rec = r as { email?: unknown; name?: unknown };
          const email = clean(rec?.email, 320)?.toLowerCase() ?? "";
          return { email, name: clean(rec?.name, 120) };
        })
        .filter((r: { email: string }) => isEmail(r.email))
        .slice(0, 50);
      if (recipients.length === 0) return json({ error: "No valid email addresses" }, 400);

      const message =
        clean(body?.message, 2000) ??
        `We're putting together the cast & crew list for ${form.production_name || "our production"}. Please add your details using the link below — it takes about a minute.`;

      const since24h = new Date(Date.now() - 24 * 3600_000).toISOString();
      const { count: ownerCount } = await admin
        .from("cast_crew_reminders")
        .select("id", { count: "exact", head: true })
        .eq("sent_by_user_id", user.id)
        .gte("sent_at", since24h);
      let budget = REMINDERS_PER_OWNER_24H - (ownerCount ?? 0);
      if (budget <= 0) {
        return json(
          { error: "You've reached the limit of 200 reminders in 24 hours. Try again later." },
          429,
        );
      }

      const sinceCooldown = new Date(Date.now() - RESEND_COOLDOWN_HOURS * 3600_000).toISOString();
      const { data: recent } = await admin
        .from("cast_crew_reminders")
        .select("email")
        .eq("form_id", form.id)
        .gte("sent_at", sinceCooldown);
      const recentEmails = new Set((recent ?? []).map((r) => (r.email || "").toLowerCase()));

      const link = `https://filmmakergenius.com/f/${form.slug}`;
      const production = form.production_name?.trim() || "our production";
      const results: { email: string; sent: boolean; reason?: string }[] = [];

      for (const r of recipients) {
        if (recentEmails.has(r.email)) {
          results.push({ email: r.email, sent: false, reason: "Already reminded in the last 12 hours" });
          continue;
        }
        if (budget <= 0) {
          results.push({ email: r.email, sent: false, reason: "Daily reminder limit reached" });
          continue;
        }

        const html = shell(`
          ${header("Filmmaker Genius", `${production} — cast & crew list`, null)}
          <div style="padding:24px 28px;">
            ${r.name ? `<p style="margin:0 0 14px;color:#ffffff;font-size:16px;">Hi ${esc(r.name)},</p>` : ""}
            <p style="margin:0 0 22px;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.75;white-space:pre-wrap;">${esc(message)}</p>
            <a href="${esc(link)}" style="display:inline-block;background:#00d4aa;color:#04231d;font-weight:700;font-size:16px;text-decoration:none;padding:15px 28px;border-radius:12px;">Add my details</a>
            <p style="margin:22px 0 0;color:rgba(255,255,255,0.3);font-size:13px;">Or paste this link into your browser:<br>${esc(link)}</p>
          </div>`);

        try {
          const { error: sendError } = await resend.emails.send({
            from: FROM,
            to: [r.email],
            reply_to: form.notify_email || user.email || undefined,
            subject: `${production} — please add your cast & crew details`,
            html,
          });
          if (sendError) throw new Error(String(sendError));
          await admin.from("cast_crew_reminders").insert({
            form_id: form.id,
            email: r.email,
            name: r.name,
            sent_by_user_id: user.id,
          });
          recentEmails.add(r.email);
          budget -= 1;
          results.push({ email: r.email, sent: true });
        } catch (mailErr) {
          console.error("reminder email failed:", mailErr);
          results.push({ email: r.email, sent: false, reason: "Email failed" });
        }
      }

      return json({ success: true, results, sent: results.filter((x) => x.sent).length });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error("cast-crew-email error:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
