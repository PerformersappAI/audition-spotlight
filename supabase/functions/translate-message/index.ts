import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  authenticateUser,
  serverCalculateCost,
  ensureBalance,
  charge,
  insufficientCreditsBody,
  unauthorizedBody,
  logUsage,
  estimateUsd,
  serviceClient,
} from "../_shared/credits.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const MAX_TARGETS = 8;
const MAX_TEXT = 20000;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", de: "German", bs: "Bosnian", hr: "Croatian", sr: "Serbian",
  es: "Spanish", fr: "French", it: "Italian", pt: "Portuguese", nl: "Dutch",
  pl: "Polish", cs: "Czech", hu: "Hungarian", ro: "Romanian", tr: "Turkish",
  el: "Greek", ru: "Russian", uk: "Ukrainian", ar: "Arabic", he: "Hebrew",
  hi: "Hindi", zh: "Chinese", ja: "Japanese", ko: "Korean", sv: "Swedish",
  no: "Norwegian", da: "Danish", fi: "Finnish",
};

const VALID_KINDS = new Set(["text", "pdf", "image", "spreadsheet"]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function systemPrompt(targets: string[]): string {
  const list = targets.map((c) => `${c} (${LANGUAGE_NAMES[c] || c})`).join(", ");
  return `You are a professional translator for an international film production crew. Translate the user's message into each of these languages: ${list}. Rules: keep names, times, dates, addresses, phone numbers, scene numbers and location names exactly as written; keep film-set terminology accurate (call time, wrap, lunch, company move, first team, holding, etc.) using the terms crews use in each language; preserve line breaks, lists and paragraph structure; use a clear, polite, professional register (formal 'Sie' in German, formal 'Vi' in Bosnian/Croatian/Serbian); do not add notes or explanations. Also identify the source language. Return ONLY JSON: {"detected_language": "<ISO 639-1 code>", "translations": {"<code>": "<translated text>", ...}}. If the subject is provided, translate it too as {"subject_translations": {"<code>": "..."}}.`;
}

function extractJson(raw: string): Record<string, unknown> | null {
  let content = (raw || "").trim();
  if (content.startsWith("```json")) content = content.slice(7);
  else if (content.startsWith("```")) content = content.slice(3);
  if (content.endsWith("```")) content = content.slice(0, -3);
  content = content.trim();
  const first = content.indexOf("{");
  const last = content.lastIndexOf("}");
  if (first !== -1 && last > first) content = content.slice(first, last + 1);
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

interface AiResult {
  detected: string;
  translations: Record<string, string>;
  subjects: Record<string, string>;
  usage: { prompt_tokens?: number; completion_tokens?: number };
}

async function callGateway(
  targets: string[],
  subject: string | null,
  text: string,
  sourceLanguage: string,
): Promise<{ result: AiResult | null; status: number }> {
  const userParts = [
    sourceLanguage === "auto"
      ? "The source language is unknown — detect it."
      : `The source language is ${sourceLanguage} (${LANGUAGE_NAMES[sourceLanguage] || sourceLanguage}).`,
    subject ? `SUBJECT:\n${subject}` : "",
    `MESSAGE:\n${text}`,
  ].filter(Boolean);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt(targets) },
        { role: "user", content: userParts.join("\n\n") },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Lovable AI error:", response.status, errorText);
    return { result: null, status: response.status };
  }

  const data = await response.json();
  const parsed = extractJson(data.choices?.[0]?.message?.content || "");
  if (!parsed) return { result: null, status: 502 };

  const rawTranslations = (parsed.translations || {}) as Record<string, unknown>;
  const rawSubjects = (parsed.subject_translations || {}) as Record<string, unknown>;
  const translations: Record<string, string> = {};
  const subjects: Record<string, string> = {};
  for (const code of targets) {
    const value = rawTranslations[code];
    if (typeof value === "string" && value.trim()) translations[code] = value;
    const sub = rawSubjects[code];
    if (subject && typeof sub === "string" && sub.trim()) subjects[code] = sub.trim();
  }

  const detectedRaw = typeof parsed.detected_language === "string" ? parsed.detected_language.trim().toLowerCase() : "";
  const detected = LANGUAGE_NAMES[detectedRaw] ? detectedRaw : sourceLanguage === "auto" ? "" : sourceLanguage;

  return {
    result: { detected, translations, subjects, usage: data.usage || {} },
    status: 200,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let user: { id: string; email?: string } | null = null;
  const started = Date.now();
  try {
    user = await authenticateUser(req);
    if (!user) return unauthorizedBody();

    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY not configured" }, 500);

    const body = await req.json();
    const projectId = body?.project_id;
    const subject = typeof body?.subject === "string" && body.subject.trim() ? body.subject.trim().slice(0, 300) : null;
    let text = typeof body?.text === "string" ? body.text : "";
    const sourceLanguageRaw = typeof body?.source_language === "string" ? body.source_language.trim().toLowerCase() : "auto";
    const sourceLanguage = sourceLanguageRaw === "auto" || LANGUAGE_NAMES[sourceLanguageRaw] ? sourceLanguageRaw : "auto";
    const sourceKind = VALID_KINDS.has(body?.source_kind) ? body.source_kind : "text";

    if (!projectId || typeof projectId !== "string") return json({ error: "project_id is required" }, 400);
    if (text.trim().length < 2) return json({ error: "text is required" }, 400);
    text = text.slice(0, MAX_TEXT);

    const cost = serverCalculateCost({ feature: "text" });
    const balance = await ensureBalance(user.id, cost);
    if (!balance.ok) return insufficientCreditsBody(cost, balance.available);

    const admin = serviceClient();

    const { data: project, error: projectError } = await admin
      .from("breakdown_projects")
      .select("id, owner_id, languages")
      .eq("id", projectId)
      .maybeSingle();

    if (projectError) {
      console.error("project lookup failed", projectError.message);
      return json({ error: "Could not load project" }, 500);
    }
    if (!project) return json({ error: "Project not found" }, 404);
    if (project.owner_id !== user.id) {
      const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) return json({ error: "You do not have access to this project" }, 403);
    }

    const languages = (Array.isArray(project.languages) ? project.languages : [])
      .filter((c: unknown): c is string => typeof c === "string" && !!LANGUAGE_NAMES[c]);
    const targets = languages
      .filter((c) => sourceLanguage === "auto" || c !== sourceLanguage)
      .slice(0, MAX_TARGETS);

    if (!targets.length) {
      return json({ error: "Add at least one other production language before translating." }, 400);
    }

    // One attempt, then a single retry, before giving up without charging.
    let result: AiResult | null = null;
    let lastStatus = 502;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const call = await callGateway(targets, subject, text, sourceLanguage);
      lastStatus = call.status;
      if (call.status === 429) return json({ error: "Rate limit exceeded. Please try again in a moment." }, 429);
      if (call.status === 402) return json({ error: "Credits depleted. Please add credits to continue." }, 402);
      if (call.result) {
        const detected = call.result.detected || sourceLanguage;
        const required = targets.filter((c) => c !== detected);
        const complete = required.every((c) => !!call.result!.translations[c]);
        if (complete) {
          result = call.result;
          break;
        }
        console.error("incomplete translation set", { attempt, got: Object.keys(call.result.translations) });
      }
    }

    if (!result) {
      return json({ error: "The translation came back incomplete. Please try again." }, lastStatus === 200 ? 502 : 502);
    }

    const detected = result.detected || (sourceLanguage === "auto" ? "en" : sourceLanguage);
    const storedSource = sourceLanguage === "auto" ? detected : sourceLanguage;

    const translations: Record<string, unknown> = {};
    for (const [code, value] of Object.entries(result.translations)) {
      if (code === storedSource) continue;
      translations[code] = value;
    }
    const subjects: Record<string, string> = {};
    for (const [code, value] of Object.entries(result.subjects)) {
      if (code === storedSource) continue;
      subjects[code] = value;
    }
    if (Object.keys(subjects).length) translations._subjects = subjects;

    const { data: profile } = await admin
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .maybeSingle();
    const createdByName =
      (profile?.first_name || "").trim() ||
      (user.email ? user.email.split("@")[0] : "") ||
      "Someone";

    const { data: saved, error: saveError } = await admin
      .from("production_messages")
      .insert({
        project_id: projectId,
        subject,
        source_language: storedSource,
        source_text: text,
        translations,
        source_kind: sourceKind,
        created_by_name: createdByName,
        created_by_user_id: user.id,
      })
      .select("id, project_id, subject, source_language, source_text, translations, source_kind, created_by_name, created_at")
      .single();

    if (saveError || !saved) {
      console.error("message insert failed", saveError?.message);
      return json({ error: "Could not save the translated message" }, 500);
    }

    const chargeRes = await charge(user.id, cost, "translate-message", {
      project_id: projectId,
      targets: Object.keys(translations).filter((k) => k !== "_subjects").length,
    });

    await logUsage({
      userId: user.id,
      functionName: "translate-message",
      provider: "lovable-gateway",
      operation: "text",
      tokensInput: result.usage.prompt_tokens,
      tokensOutput: result.usage.completion_tokens,
      estimatedCostUsd: estimateUsd(result.usage.prompt_tokens, result.usage.completion_tokens),
      status: "success",
      latencyMs: Date.now() - started,
    });

    return json({ message: saved, available_credits: chargeRes.available });
  } catch (error) {
    console.error("translate-message error:", error);
    if (user) {
      await logUsage({
        userId: user.id,
        functionName: "translate-message",
        provider: "lovable-gateway",
        operation: "text",
        status: "error",
        latencyMs: Date.now() - started,
      });
    }
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
