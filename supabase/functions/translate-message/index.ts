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
import {
  LANGUAGE_NAMES,
  MAX_SUBJECT,
  MAX_TARGETS,
  MAX_TEXT,
  buildTranslationsColumn,
  productionLanguages,
  translateWithRetry,
} from "../_shared/translate.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const VALID_KINDS = new Set(["text", "pdf", "image", "spreadsheet"]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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
    const subject = typeof body?.subject === "string" && body.subject.trim()
      ? body.subject.trim().slice(0, MAX_SUBJECT)
      : null;
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

    const targets = productionLanguages(project.languages)
      .filter((c) => sourceLanguage === "auto" || c !== sourceLanguage)
      .slice(0, MAX_TARGETS);

    if (!targets.length) {
      return json({ error: "Add at least one other production language before translating." }, 400);
    }

    const { result, status } = await translateWithRetry(LOVABLE_API_KEY, targets, subject, text, sourceLanguage);
    if (status === 429) return json({ error: "Rate limit exceeded. Please try again in a moment." }, 429);
    if (status === 402) return json({ error: "Credits depleted. Please add credits to continue." }, 402);
    if (!result) return json({ error: "The translation came back incomplete. Please try again." }, 502);

    const detected = result.detected || (sourceLanguage === "auto" ? "en" : sourceLanguage);
    const storedSource = sourceLanguage === "auto" ? detected : sourceLanguage;
    const translations = buildTranslationsColumn(result, storedSource);

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
