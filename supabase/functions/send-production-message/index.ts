import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateUser, logUsage, serviceClient, unauthorizedBody } from "../_shared/credits.ts";
import { LANGUAGE_NAMES, LANGUAGE_NATIVE, RTL_LANGUAGES } from "../_shared/translate.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOG_NAME = "send-production-message";
const MAX_RECIPIENTS = 100;
const SENDS_PER_MESSAGE_PER_HOUR = 5;
const RECIPIENTS_PER_OWNER_PER_DAY = 500;
const FROM = "Filmmaker Genius <noreply@filmmakergenius.com>";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const nl2br = (value: string) => escapeHtml(value).replace(/\r?\n/g, "<br />");

/** Server-side Open-Meteo lookup — silently skipped on any failure. */
async function weatherLine(location?: string | null): Promise<string> {
  if (!location || !location.trim()) return "";
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location.trim())}&count=1&language=en&format=json`,
    );
    if (!geoRes.ok) return "";
    const hit = (await geoRes.json())?.results?.[0];
    if (!hit) return "";
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${hit.latitude}&longitude=${hit.longitude}` +
        `&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
        `&timezone=auto&forecast_days=1`,
    );
    if (!res.ok) return "";
    const data = await res.json();
    const d = data?.daily;
    if (!data?.current || !d) return "";
    const clock = (iso: string) => (iso || "").slice(11, 16);
    return [
      [hit.name, hit.country].filter(Boolean).join(", "),
      `${Math.round(data.current.temperature_2m)}°C`,
      `High ${Math.round(d.temperature_2m_max?.[0])}° / Low ${Math.round(d.temperature_2m_min?.[0])}°`,
      d.precipitation_probability_max?.[0] != null ? `Rain ${d.precipitation_probability_max[0]}%` : "",
      d.sunrise?.[0] ? `Sunrise ${clock(d.sunrise[0])}` : "",
      d.sunset?.[0] ? `Sunset ${clock(d.sunset[0])}` : "",
    ].filter(Boolean).join(" · ");
  } catch {
    return "";
  }
}

interface Section {
  code: string;
  heading: string;
  subject: string | null;
  text: string;
}

function buildSections(row: Record<string, any>): Section[] {
  const label = (code: string) => {
    const native = LANGUAGE_NATIVE[code] || code;
    const english = LANGUAGE_NAMES[code] || code;
    return native === english ? native : `${native} / ${english}`;
  };

  const translations = (row.translations || {}) as Record<string, unknown>;
  const subjects = (translations._subjects && typeof translations._subjects === "object"
    ? translations._subjects
    : {}) as Record<string, unknown>;

  const sections: Section[] = [{
    code: row.source_language,
    heading: `${label(row.source_language)} — Original`,
    subject: row.subject || null,
    text: String(row.source_text || ""),
  }];

  for (const [code, value] of Object.entries(translations)) {
    if (code === "_subjects" || typeof value !== "string" || !value.trim()) continue;
    const sub = subjects[code];
    sections.push({
      code,
      heading: label(code),
      subject: typeof sub === "string" && sub.trim() ? sub.trim() : null,
      text: value,
    });
  }
  return sections;
}

function buildHtml(opts: {
  productionTitle: string;
  dateLine: string;
  weather: string;
  sections: Section[];
}): string {
  const blocks = opts.sections.map((s) => `
    <div style="margin-top:26px;padding-top:18px;border-top:1px solid #e6e6ec;">
      <div style="color:#00b08c;font-weight:700;font-size:13px;letter-spacing:.04em;margin-bottom:8px;">${escapeHtml(s.heading)}</div>
      <div${RTL_LANGUAGES.has(s.code) ? ' dir="rtl"' : ""}>
        ${s.subject ? `<div style="font-size:15px;font-weight:700;color:#121220;margin-bottom:8px;">${escapeHtml(s.subject)}</div>` : ""}
        <div style="font-size:15px;line-height:1.7;color:#333;">${nl2br(s.text)}</div>
      </div>
    </div>`).join("");

  return `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#121220;">
    <h1 style="font-size:20px;margin:0 0 6px;">${escapeHtml(opts.productionTitle)}</h1>
    <p style="color:#666;font-size:13px;margin:0;">${escapeHtml(opts.dateLine)}</p>
    ${opts.weather ? `<p style="color:#666;font-size:13px;margin:6px 0 0;">${escapeHtml(opts.weather)}</p>` : ""}
    ${blocks}
    <p style="margin-top:30px;font-size:12px;color:#999;">Sent with Filmmaker Genius Set Translator</p>
  </div>`;
}

function buildText(opts: {
  productionTitle: string;
  dateLine: string;
  weather: string;
  sections: Section[];
}): string {
  const parts = [opts.productionTitle, opts.dateLine];
  if (opts.weather) parts.push(opts.weather);
  const body = opts.sections.map((s) =>
    [`— ${s.heading} —`, s.subject || "", s.text].filter(Boolean).join("\n")
  ).join("\n\n");
  return `${parts.join("\n")}\n\n${body}\n\nSent with Filmmaker Genius Set Translator\n`;
}

interface Recipient { name: string; email: string }

async function sendOne(
  key: string,
  recipient: Recipient,
  subject: string,
  html: string,
  plain: string,
  replyTo?: string,
): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [recipient.email],
        subject,
        html,
        text: plain,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", res.status, (await res.text()).slice(0, 400));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend request failed:", (err as Error)?.message);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const started = Date.now();
  try {
    const user = await authenticateUser(req);
    if (!user) return unauthorizedBody();

    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) return json({ error: "Email sending is not configured." }, 500);

    const body = await req.json().catch(() => null);
    const messageId = typeof body?.message_id === "string" ? body.message_id : "";
    if (!messageId) return json({ error: "message_id is required" }, 400);

    const seen = new Set<string>();
    const recipients: Recipient[] = [];
    for (const entry of Array.isArray(body?.recipients) ? body.recipients : []) {
      const email = String((entry?.email ?? "")).trim().toLowerCase();
      if (!email || !isEmail(email) || seen.has(email)) continue;
      seen.add(email);
      recipients.push({ name: String(entry?.name ?? "").trim().slice(0, 120), email });
    }
    if (!recipients.length) return json({ error: "Add at least one valid email address." }, 400);
    if (recipients.length > MAX_RECIPIENTS) {
      return json({ error: `You can send to at most ${MAX_RECIPIENTS} people at a time.` }, 400);
    }

    const admin = serviceClient();

    const { data: message } = await admin
      .from("production_messages")
      .select("id, project_id, subject, source_language, source_text, translations, sent_to")
      .eq("id", messageId)
      .maybeSingle();
    if (!message) return json({ error: "That message no longer exists." }, 404);

    const { data: project } = await admin
      .from("breakdown_projects")
      .select("id, title, owner_id, shoot_location")
      .eq("id", message.project_id)
      .maybeSingle();
    if (!project) return json({ error: "That production no longer exists." }, 404);

    if (project.owner_id !== user.id) {
      const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) return json({ error: "You do not have access to this production." }, 403);
    }
    const ownerId = project.owner_id as string;

    // ---- rate limits (counted from the usage log) ---------------------------
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: messageSends } = await admin
      .from("api_usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("function_name", LOG_NAME)
      .gte("created_at", hourAgo)
      .filter("metadata->>message_id", "eq", messageId);
    if ((messageSends ?? 0) >= SENDS_PER_MESSAGE_PER_HOUR) {
      return json({ error: "This message has been sent several times already. Please try again later." }, 429);
    }

    const { data: dayLogs } = await admin
      .from("api_usage_logs")
      .select("metadata")
      .eq("function_name", LOG_NAME)
      .eq("user_id", ownerId)
      .gte("created_at", dayAgo)
      .limit(1000);
    const sentToday = (dayLogs || []).reduce(
      (sum: number, row: any) => sum + Number(row?.metadata?.recipients ?? 0),
      0,
    );
    if (sentToday + recipients.length > RECIPIENTS_PER_OWNER_PER_DAY) {
      return json({ error: "You've reached today's sending limit. Please try again tomorrow." }, 429);
    }

    // ---- build the email ---------------------------------------------------
    const productionTitle = String(project.title || "Production");
    const sections = buildSections(message as Record<string, any>);
    const weather = await weatherLine(project.shoot_location as string | null);
    const dateLine = new Date().toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "UTC",
    }) + " UTC";
    const subject = (message.subject || "").trim() || `Message from ${productionTitle}`;
    const html = buildHtml({ productionTitle, dateLine, weather, sections });
    const plain = buildText({ productionTitle, dateLine, weather, sections });

    let replyTo: string | undefined;
    try {
      const { data: ownerData } = await admin.auth.admin.getUserById(ownerId);
      replyTo = ownerData?.user?.email ?? undefined;
    } catch { /* optional */ }

    // ---- one email per recipient (batch first, sequential fallback) --------
    const results: Array<{ name: string; email: string; ok: boolean }> = [];
    let batchOk = false;
    try {
      const res = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(
          recipients.map((r) => ({
            from: FROM,
            to: [r.email],
            subject,
            html,
            text: plain,
            ...(replyTo ? { reply_to: replyTo } : {}),
          })),
        ),
      });
      if (res.ok) {
        batchOk = true;
        recipients.forEach((r) => results.push({ ...r, ok: true }));
      } else {
        console.error("Resend batch error:", res.status, (await res.text()).slice(0, 400));
      }
    } catch (err) {
      console.error("Resend batch failed:", (err as Error)?.message);
    }

    if (!batchOk) {
      const CONCURRENCY = 4;
      for (let i = 0; i < recipients.length; i += CONCURRENCY) {
        const slice = recipients.slice(i, i + CONCURRENCY);
        const oks = await Promise.all(
          slice.map((r) => sendOne(key, r, subject, html, plain, replyTo)),
        );
        slice.forEach((r, idx) => results.push({ ...r, ok: oks[idx] }));
      }
    }

    const sentCount = results.filter((r) => r.ok).length;
    const now = new Date().toISOString();
    const previous = Array.isArray(message.sent_to) ? message.sent_to : [];
    const appended = [
      ...previous,
      ...results.map((r) => ({ name: r.name, email: r.email, sent_at: now, ok: r.ok })),
    ].slice(-1000);

    await admin
      .from("production_messages")
      .update({ sent_at: now, sent_to: appended })
      .eq("id", messageId);

    await logUsage({
      userId: ownerId,
      functionName: LOG_NAME,
      provider: "resend",
      operation: "email",
      status: sentCount ? "success" : "error",
      latencyMs: Date.now() - started,
      metadata: {
        message_id: messageId,
        project_id: project.id,
        recipients: recipients.length,
        sent: sentCount,
      },
    });

    return json({
      sent: sentCount,
      failed: results.length - sentCount,
      results,
      sent_at: now,
    });
  } catch (error) {
    console.error("send-production-message error:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
