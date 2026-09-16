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
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const SYSTEM_PROMPT = `You are a professional film production coordinator. Analyze the following script scene and return a JSON object with these exact keys: scene_number (string — the FULL production scene identifier exactly as printed, including decimals and letter suffixes, e.g. 47, 47.3, 47A, 47.3-B, 12B; never truncate to just the leading number; empty string if none is printed), props (array of strings), locations (array of strings), makeup (array of strings — include both standard makeup needs and any special effects makeup), wardrobe (array of strings), vehicles (array of strings — include if any). Each array should list specific items mentioned or implied by the scene. Be thorough but not redundant. Return ONLY the JSON object.`;

const DEPT_MAP: Record<string, string> = {
  props: 'props',
  locations: 'locations',
  makeup: 'makeup_sfx',
  wardrobe: 'wardrobe',
  vehicles: 'vehicles',
};

function cleanList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const entry of raw) {
    if (typeof entry !== 'string') continue;
    const value = entry.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
    if (out.length >= 60) break;
  }
  return out;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let user: { id: string } | null = null;
  const started = Date.now();
  try {
    user = await authenticateUser(req);
    if (!user) return unauthorizedBody();

    const cost = serverCalculateCost({ feature: "text" });
    const balance = await ensureBalance(user.id, cost);
    if (!balance.ok) return insufficientCreditsBody(cost, balance.available);

    if (!LOVABLE_API_KEY) {
      return json({ error: 'LOVABLE_API_KEY not configured' }, 500);
    }

    const body = await req.json();
    const projectId = body?.project_id;
    let scriptText = body?.script_text;
    const userSceneNumber = typeof body?.scene_number === 'string' ? body.scene_number.trim() : '';
    const label = typeof body?.label === 'string' && body.label.trim() ? body.label.trim() : null;

    if (!projectId || typeof projectId !== 'string') {
      return json({ error: 'project_id is required' }, 400);
    }
    if (!scriptText || typeof scriptText !== 'string' || scriptText.trim().length < 20) {
      return json({ error: 'script_text is required (min 20 characters)' }, 400);
    }
    scriptText = scriptText.slice(0, 30000);

    const admin = serviceClient();

    // Ownership / admin check
    const { data: project, error: projectError } = await admin
      .from('breakdown_projects')
      .select('id, owner_id')
      .eq('id', projectId)
      .maybeSingle();

    if (projectError) {
      console.error('project lookup failed', projectError.message);
      return json({ error: 'Could not load project' }, 500);
    }
    if (!project) return json({ error: 'Project not found' }, 404);

    if (project.owner_id !== user.id) {
      const { data: isAdmin } = await admin.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      if (!isAdmin) return json({ error: 'You do not have access to this project' }, 403);
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `SCENE:\n${scriptText}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      if (response.status === 429) {
        return json({ error: 'Rate limit exceeded. Please try again in a moment.' }, 429);
      }
      if (response.status === 402) {
        return json({ error: 'Credits depleted. Please add credits to continue.' }, 503);
      }
      return json({ error: `AI gateway error: ${response.status}` }, 500);
    }

    const data = await response.json();
    let content: string = data.choices?.[0]?.message?.content || '';
    content = content.trim();
    if (content.startsWith('```json')) content = content.slice(7);
    else if (content.startsWith('```')) content = content.slice(3);
    if (content.endsWith('```')) content = content.slice(0, -3);
    content = content.trim();
    const first = content.indexOf('{');
    const last = content.lastIndexOf('}');
    if (first !== -1 && last > first) content = content.slice(first, last + 1);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error('JSON parse error. Content head:', content.substring(0, 400));
      return json({ error: 'AI returned invalid JSON' }, 500);
    }

    const departments: Record<string, string[]> = {};
    for (const [key, dept] of Object.entries(DEPT_MAP)) {
      departments[dept] = cleanList(pickKey(parsed, key));
    }

    const aiSceneNumber = typeof parsed.scene_number === 'string' ? parsed.scene_number.trim() : '';
    const sceneNumber = userSceneNumber || aiSceneNumber || null;

    // sort_order = current max + 1
    const { data: lastScene } = await admin
      .from('breakdown_scenes')
      .select('sort_order')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    const sortOrder = (lastScene?.sort_order ?? -1) + 1;

    const { data: scene, error: sceneError } = await admin
      .from('breakdown_scenes')
      .insert({
        project_id: projectId,
        scene_number: sceneNumber,
        label,
        script_text: scriptText,
        sort_order: sortOrder,
        analyzed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (sceneError || !scene) {
      console.error('scene insert failed', sceneError?.message);
      return json({ error: 'Could not save the scene' }, 500);
    }

    const rows = Object.entries(departments).flatMap(([dept, items]) =>
      items.map((text, index) => ({
        scene_id: scene.id,
        project_id: projectId,
        department: dept,
        text,
        original_text: text,
        source: 'ai',
        sort_order: index,
      })),
    );

    if (rows.length > 0) {
      const { error: itemsError } = await admin.from('breakdown_items').insert(rows);
      if (itemsError) {
        console.error('items insert failed', itemsError.message);
        await admin.from('breakdown_scenes').delete().eq('id', scene.id);
        return json({ error: 'Could not save the checklist items' }, 500);
      }
    }

    const chargeRes = await charge(user.id, cost, "breakdown-scene", { project_id: projectId });
    await logUsage({
      userId: user.id,
      functionName: "breakdown-scene",
      provider: "lovable-gateway",
      operation: "text",
      tokensInput: data.usage?.prompt_tokens,
      tokensOutput: data.usage?.completion_tokens,
      estimatedCostUsd: estimateUsd(data.usage?.prompt_tokens, data.usage?.completion_tokens),
      status: "success",
      latencyMs: Date.now() - started,
    });

    return json({
      scene_id: scene.id,
      scene_number: sceneNumber,
      counts: {
        props: departments.props.length,
        locations: departments.locations.length,
        makeup_sfx: departments.makeup_sfx.length,
        wardrobe: departments.wardrobe.length,
        vehicles: departments.vehicles.length,
      },
      available_credits: chargeRes.available,
    });
  } catch (error) {
    console.error('breakdown-scene error:', error);
    if (user) {
      await logUsage({
        userId: user.id,
        functionName: "breakdown-scene",
        provider: "lovable-gateway",
        operation: "text",
        status: "error",
        latencyMs: Date.now() - started,
      });
    }
    return json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});
