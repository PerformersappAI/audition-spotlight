/**
 * aiInvoke — single entry point for calling AI edge functions from the client.
 *
 * Credits are enforced SERVER-SIDE. This wrapper surfaces the 402
 * "Insufficient credits" response as a toast + redirect to the refill page,
 * and returns the authoritative `available_credits` from the server so the
 * UI can refresh its displayed balance.
 */
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export class InsufficientCreditsError extends Error {
  required: number;
  available: number;
  constructor(required: number, available: number) {
    super("Insufficient credits");
    this.name = "InsufficientCreditsError";
    this.required = required;
    this.available = available;
  }
}

type Listener = (available: number) => void;
const listeners = new Set<Listener>();

/** Subscribe to authoritative balance updates coming back from the server. */
export function onCreditBalance(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function publishBalance(available: unknown) {
  if (typeof available !== "number" || Number.isNaN(available)) return;
  listeners.forEach((fn) => {
    try {
      fn(available);
    } catch {
      /* noop */
    }
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("credits:updated", { detail: { available } }));
  }
}

function goToRefill() {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/refill") {
    window.location.href = "/refill";
  }
}

export interface AiInvokeOptions {
  body?: unknown;
  /** Set false to suppress the automatic redirect on 402. */
  redirectOnPaywall?: boolean;
}

export async function aiInvoke<T = any>(
  functionName: string,
  options: AiInvokeOptions = {},
): Promise<T> {
  const { body, redirectOnPaywall = true } = options;

  const { data, error } = await supabase.functions.invoke(functionName, {
    body: body as any,
  });

  if (error) {
    // supabase-js wraps non-2xx in a FunctionsHttpError with a readable Response
    const res = (error as any)?.context as Response | undefined;
    if (res && typeof res.json === "function") {
      let payload: any = null;
      try {
        payload = await res.clone().json();
      } catch {
        /* not json */
      }
      if (res.status === 402 || payload?.error === "Insufficient credits") {
        const required = Number(payload?.required ?? 0);
        const available = Number(payload?.available ?? 0);
        publishBalance(available);
        toast.error("You're out of credits — top up to continue", {
          description:
            required > 0 ? `This action needs ${required} credit${required === 1 ? "" : "s"}. You have ${available}.` : undefined,
          action: { label: "Top up", onClick: goToRefill },
        });
        if (redirectOnPaywall) setTimeout(goToRefill, 800);
        throw new InsufficientCreditsError(required, available);
      }
      if (res.status === 401) {
        toast.error("Please sign in to use this tool");
        throw new Error("Unauthorized");
      }
      if (payload?.error) {
        throw new Error(payload.error);
      }
    }
    throw error;
  }

  publishBalance((data as any)?.available_credits);
  return data as T;
}

/**
 * Drop-in replacement for `supabase.functions.invoke` that keeps the
 * `{ data, error }` shape but adds credit-paywall handling (402 → toast +
 * redirect) and refreshes the displayed balance from `available_credits`.
 */
export async function aiInvokeSafe<T = any>(
  functionName: string,
  options: AiInvokeOptions = {},
): Promise<{ data: T | null; error: any }> {
  try {
    const data = await aiInvoke<T>(functionName, options);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
