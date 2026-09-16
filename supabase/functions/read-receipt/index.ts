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
  callReceiptAi,
  parseReceipt,
  MAX_RECEIPT_BYTES,
  RECEIPT_MIME_TYPES,
} from "../_shared/receipt.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

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

    if (!LOVABLE_API_KEY) return json({ error: 'LOVABLE_API_KEY not configured' }, 500);

    const body = await req.json();
    const projectId = body?.project_id;
    const fileBase64: string = typeof body?.file_base64 === 'string' ? body.file_base64 : '';
    const mimeType: string = typeof body?.mime_type === 'string' ? body.mime_type.toLowerCase() : '';

    if (!projectId || typeof projectId !== 'string') return json({ error: 'project_id is required' }, 400);
    if (!fileBase64) return json({ error: 'file_base64 is required' }, 400);
    if (!RECEIPT_MIME_TYPES.includes(mimeType)) {
      return json({ error: 'Unsupported file type. Use a JPG, PNG, WEBP or PDF.' }, 400);
    }
    const decodedBytes = Math.floor((fileBase64.length * 3) / 4);
    if (decodedBytes > MAX_RECEIPT_BYTES) {
      return json({ error: 'That file is too large. Please use one under 8 MB.' }, 400);
    }

    const admin = serviceClient();

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

    const ai = await callReceiptAi(LOVABLE_API_KEY, fileBase64, mimeType);

    if (!ai.ok) {
      console.error('Lovable AI error:', ai.status, ai.body);
      if (ai.status === 429) {
        return json({ error: 'Rate limit exceeded. Please try again in a moment.' }, 429);
      }
      if (ai.status === 402) {
        return json({ error: 'Credits depleted. Please add credits to continue.' }, 503);
      }
      return json({ error: `AI gateway error: ${ai.status}` }, 500);
    }

    const parsed = parseReceipt(ai.content);
    if (!parsed) {
      console.error('receipt JSON parse error. Head:', ai.content.substring(0, 300));
      return json({ error: 'Could not read that receipt. Please type the details in.', raw: ai.content.slice(0, 2000) }, 422);
    }

    const chargeRes = await charge(user.id, cost, "read-receipt", { project_id: projectId });
    await logUsage({
      userId: user.id,
      functionName: "read-receipt",
      provider: "lovable-gateway",
      operation: "text",
      tokensInput: ai.usage?.prompt_tokens,
      tokensOutput: ai.usage?.completion_tokens,
      estimatedCostUsd: estimateUsd(ai.usage?.prompt_tokens, ai.usage?.completion_tokens),
      status: "success",
      latencyMs: Date.now() - started,
    });

    return json({ ...parsed, available_credits: chargeRes.available });
  } catch (error) {
    console.error('read-receipt error:', error);
    if (user) {
      await logUsage({
        userId: user.id,
        functionName: "read-receipt",
        provider: "lovable-gateway",
        operation: "text",
        status: "error",
        latencyMs: Date.now() - started,
      });
    }
    return json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});
