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
  MAX_TARGETS,
  buildTranslationsColumn,
  productionLanguages,
  translateWithRetry,
} from "../_shared/translate.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const MAX_BODY = 5000;

const TAGS = new Set([
  "general", "talent", "location", "props", "wardrobe", "makeup",
  "camera", "sound", "safety", "director", "ad", "production",
]);
const PRIORITIES = new Set(["normal", "important", "urgent"]);

const NOTE_FIELDS =
  "id, project_id, tag, body, source_language, translations, shoot_day, scene_id, priority, pinned, resolved, resolved_by_name, resolved_at, created_by_name, created_by_department, created_at, updated_at";

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

    const payload = await req.json();
    const projectId = payload?.project_id;
    const noteId = typeof payload?.note_id === "string" && payload.note_id ? payload.note_id : null;
    const tag = TAGS.has(payload?.tag) ? payload.tag : "general";
    const priority = PRIORITIES.has(payload?.priority) ? payload.priority : "normal";
    const shootDay = typeof payload?.shoot_day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(payload.shoot_day)
      ? payload.shoot_day
      : null;
    const sceneId = typeof payload?.scene_id === "string" && payload.scene_id ? payload.scene_id : null;
    let text = typeof payload?.body === "string" ? payload.body : "";

    if (!projectId || typeof projectId !== "string") return json({ error: "project_id is required" }, 400);
    if (text.trim().length < 2) return json({ error: "The note text is required" }, 400);
    text = text.slice(0, MAX_BODY);

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

    // Scene must belong to this production.
    if (sceneId) {
      const { data: scene } = await admin
        .from("breakdown_scenes")
        .select("id, project_id")
        .eq("id", sceneId)
        .maybeSingle();
      if (!scene || scene.project_id !== projectId) {
        return json({ error: "That scene is not part of this production" }, 400);
      }
    }

    // Existing note must belong to this production.
    if (noteId) {
      const { data: existing } = await admin
        .from("production_notes")
        .select("id, project_id")
        .eq("id", noteId)
        .maybeSingle();
      if (!existing || existing.project_id !== projectId) {
        return json({ error: "That note is not part of this production" }, 404);
      }
    }

    const targets = productionLanguages(project.languages).slice(0, MAX_TARGETS);
    if (targets.length < 2) {
      return json({ error: "Add at least two production languages before translating." }, 400);
    }

    const { result, status } = await translateWithRetry(LOVABLE_API_KEY, targets, null, text, "auto");
    if (status === 429) return json({ error: "Rate limit exceeded. Please try again in a moment." }, 429);
    if (status === 402) return json({ error: "Credits depleted. Please add credits to continue." }, 402);
    if (!result) return json({ error: "The translation came back incomplete. Please try again." }, 502);

    const detected = result.detected || "en";
    const translations = buildTranslationsColumn(result, detected);
    delete (translations as Record<string, unknown>)._subjects;

    const { data: profile } = await admin
      .from("profiles")
      .select("first_name")
      .eq("user_id", user.id)
      .maybeSingle();
    const authorName =
      (profile?.first_name || "").trim() ||
      (user.email ? user.email.split("@")[0] : "") ||
      "Someone";

    let saved: unknown = null;
    let saveError: { message?: string } | null = null;

    if (noteId) {
      const res = await admin
        .from("production_notes")
        .update({
          tag,
          priority,
          shoot_day: shootDay,
          scene_id: sceneId,
          body: text,
          source_language: detected,
          translations,
        })
        .eq("id", noteId)
        .select(NOTE_FIELDS)
        .single();
      saved = res.data;
      saveError = res.error;
    } else {
      const res = await admin
        .from("production_notes")
        .insert({
          project_id: projectId,
          tag,
          priority,
          shoot_day: shootDay,
          scene_id: sceneId,
          body: text,
          source_language: detected,
          translations,
          created_by_name: authorName,
          created_by_department: "Production",
          created_by_user_id: user.id,
        })
        .select(NOTE_FIELDS)
        .single();
      saved = res.data;
      saveError = res.error;
    }

    if (saveError || !saved) {
      console.error("note save failed", saveError?.message);
      return json({ error: "Could not save the translated note" }, 500);
    }

    const chargeRes = await charge(user.id, cost, "translate-note", {
      project_id: projectId,
      targets: Object.keys(translations).length,
    });

    await logUsage({
      userId: user.id,
      functionName: "translate-note",
      provider: "lovable-gateway",
      operation: "text",
      tokensInput: result.usage.prompt_tokens,
      tokensOutput: result.usage.completion_tokens,
      estimatedCostUsd: estimateUsd(result.usage.prompt_tokens, result.usage.completion_tokens),
      status: "success",
      latencyMs: Date.now() - started,
    });

    return json({ note: saved, available_credits: chargeRes.available });
  } catch (error) {
    console.error("translate-note error:", error);
    if (user) {
      await logUsage({
        userId: user.id,
        functionName: "translate-note",
        provider: "lovable-gateway",
        operation: "text",
        status: "error",
        latencyMs: Date.now() - started,
      });
    }
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
