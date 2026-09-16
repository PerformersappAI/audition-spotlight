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

const SYSTEM_PROMPT = `You are an expense-tracking assistant for a film production. Read this receipt or invoice and return ONLY JSON: {"vendor": string, "date": "YYYY-MM-DD" or "", "currency": ISO 4217 code (infer from symbols/country: € EUR, KM or BAM → BAM, £ GBP, $ USD unless clearly CAD/AUD etc.; "" if unknown), "total": number (the final amount paid, as a plain number with a dot decimal), "lines": [{"text": string, "amount": number}]}. Convert European decimal commas to dots. Do not invent items.`;

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_DECODED_BYTES = 8 * 1024 * 1024;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function toNumber(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.round(raw * 100) / 100;
  if (typeof raw !== 'string') return 0;
  let s = raw.replace(/[^\d,.\-]/g, '');
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma !== -1 && lastDot !== -1) {
    s = lastComma > lastDot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else if (lastComma !== -1) {
    s = s.length - lastComma - 1 === 3 ? s.replace(/,/g, '') : s.replace(/,/g, '.');
  }
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
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
    if (!ALLOWED_MIME.includes(mimeType)) {
      return json({ error: 'Unsupported file type. Use a JPG, PNG, WEBP or PDF.' }, 400);
    }
    const decodedBytes = Math.floor((fileBase64.length * 3) / 4);
    if (decodedBytes > MAX_DECODED_BYTES) {
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

    const dataUrl = `data:${mimeType};base64,${fileBase64}`;
    const filePart = mimeType === 'application/pdf'
      ? { type: 'file', file: { filename: 'receipt.pdf', file_data: dataUrl } }
      : { type: 'image_url', image_url: { url: dataUrl } };

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
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Read this receipt or invoice and return the JSON described.' },
              filePart,
            ],
          },
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
      console.error('receipt JSON parse error. Head:', content.substring(0, 300));
      return json({ error: 'Could not read that receipt. Please type the details in.', raw: content.slice(0, 2000) }, 422);
    }

    const vendor = typeof parsed.vendor === 'string' ? parsed.vendor.trim().slice(0, 200) : '';
    const rawDate = typeof parsed.date === 'string' ? parsed.date.trim() : '';
    const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : '';
    const currency = typeof parsed.currency === 'string' && /^[A-Za-z]{3}$/.test(parsed.currency.trim())
      ? parsed.currency.trim().toUpperCase()
      : '';
    const total = toNumber(parsed.total);
    const lines = Array.isArray(parsed.lines)
      ? parsed.lines
          .map((entry) => {
            if (!entry || typeof entry !== 'object') return null;
            const e = entry as Record<string, unknown>;
            const text = typeof e.text === 'string' ? e.text.trim().slice(0, 200) : '';
            const amount = toNumber(e.amount);
            if (!text && !amount) return null;
            return { text, amount };
          })
          .filter(Boolean)
          .slice(0, 80)
      : [];

    const chargeRes = await charge(user.id, cost, "read-receipt", { project_id: projectId });
    await logUsage({
      userId: user.id,
      functionName: "read-receipt",
      provider: "lovable-gateway",
      operation: "text",
      tokensInput: data.usage?.prompt_tokens,
      tokensOutput: data.usage?.completion_tokens,
      estimatedCostUsd: estimateUsd(data.usage?.prompt_tokens, data.usage?.completion_tokens),
      status: "success",
      latencyMs: Date.now() - started,
    });

    return json({
      vendor,
      date,
      currency,
      total,
      lines,
      available_credits: chargeRes.available,
    });
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
