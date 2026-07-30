// Shared server-side credit enforcement helpers.
// Cost is ALWAYS computed server-side. Never trust a client-supplied cost.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

export function serviceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface AuthedUser {
  id: string;
  email?: string;
}

/** Validates the Bearer token and returns the user, or null. */
export async function authenticateUser(req: Request): Promise<AuthedUser | null> {
  const authHeader = req.headers.get("Authorization") ?? req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;
  const admin = serviceClient();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return null;
  return { id: data.user.id, email: data.user.email ?? undefined };
}

// ---------------------------------------------------------------------------
// Hard caps (protect against a single request running unlimited provider cost)
// ---------------------------------------------------------------------------
export const MAX_FRAMES_PER_REQUEST = 20;
export const MAX_VIDEO_SECONDS = 300; // 5 minutes
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200MB

export type Feature =
  | "text" // simple text tools
  | "pitch_deck"
  | "table_read_tts"
  | "images" // storyboard / frame image generation
  | "video";

export interface CostParams {
  feature: Feature;
  /** number of images/frames the request will generate */
  frames?: number;
  /** duration of the video in seconds */
  durationSeconds?: number;
}

export class CapExceededError extends Error {}

/**
 * Server-side cost calculation. Throws CapExceededError when hard caps are hit.
 */
export function serverCalculateCost(params: CostParams): number {
  switch (params.feature) {
    case "text":
      return 1;
    case "table_read_tts":
      return 1;
    case "pitch_deck":
      return 2;
    case "images": {
      const frames = Math.max(1, Math.ceil(params.frames ?? 1));
      if (frames > MAX_FRAMES_PER_REQUEST) {
        throw new CapExceededError(
          `Too many frames requested (${frames}). Maximum is ${MAX_FRAMES_PER_REQUEST} per request.`,
        );
      }
      // ~1 credit per 2 frames, minimum 2
      return Math.max(2, Math.ceil(frames / 2));
    }
    case "video": {
      const secs = Math.max(0, Math.ceil(params.durationSeconds ?? 0));
      if (secs > MAX_VIDEO_SECONDS) {
        throw new CapExceededError(
          `Video too long (${secs}s). Maximum is ${MAX_VIDEO_SECONDS}s.`,
        );
      }
      // 1 credit per 30s of video, minimum 2
      return Math.max(2, Math.ceil(secs / 30));
    }
    default:
      return 1;
  }
}

export async function getAvailableCredits(userId: string): Promise<number> {
  const admin = serviceClient();
  const { data, error } = await admin.rpc("get_available_credits", { _user_id: userId });
  if (error) throw new Error(`credit lookup failed: ${error.message}`);
  return Number(data ?? 0);
}

export interface BalanceCheck {
  ok: boolean;
  available: number;
  required: number;
}

export async function ensureBalance(userId: string, required: number): Promise<BalanceCheck> {
  const available = await getAvailableCredits(userId);
  return { ok: available >= required, available, required };
}

export interface ChargeResult {
  success: boolean;
  available: number;
}

export async function charge(
  userId: string,
  cost: number,
  feature: string,
  metadata: Record<string, unknown> = {},
): Promise<ChargeResult> {
  const admin = serviceClient();
  const { data, error } = await admin.rpc("spend_credits", {
    _user_id: userId,
    _cost: cost,
    _feature: feature,
    _metadata: metadata,
  });
  if (error) {
    console.error("spend_credits failed", error.message);
    return { success: false, available: 0 };
  }
  const row = Array.isArray(data) ? data[0] : data;
  return { success: !!row?.success, available: Number(row?.available_credits ?? 0) };
}

/** Standard 402 payload the client interceptor understands. */
export function insufficientCreditsBody(required: number, available: number) {
  return new Response(
    JSON.stringify({ error: "Insufficient credits", required, available }),
    { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

export function unauthorizedBody() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function capExceededBody(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// Usage logging
// ---------------------------------------------------------------------------
export interface UsageLog {
  userId: string;
  functionName: string;
  provider: string;
  operation?: string;
  tokensInput?: number;
  tokensOutput?: number;
  estimatedCostUsd?: number;
  status: string;
  latencyMs?: number;
  metadata?: Record<string, unknown>;
}

/** Rough USD estimate for Gemini-class flash models via the Lovable gateway. */
export function estimateUsd(tokensIn = 0, tokensOut = 0): number {
  return Number(((tokensIn / 1_000_000) * 0.1 + (tokensOut / 1_000_000) * 0.4).toFixed(6));
}

export async function logUsage(log: UsageLog): Promise<void> {
  try {
    const admin = serviceClient();
    await admin.from("api_usage_logs").insert({
      user_id: log.userId,
      function_name: log.functionName,
      provider: log.provider,
      operation: log.operation ?? null,
      estimated_cost_usd: log.estimatedCostUsd ?? null,
      tokens_input: log.tokensInput ?? null,
      tokens_output: log.tokensOutput ?? null,
      status: log.status,
      latency_ms: log.latencyMs ?? null,
      metadata: log.metadata ?? {},
    });
  } catch (e) {
    console.error("logUsage failed", e);
  }
}
