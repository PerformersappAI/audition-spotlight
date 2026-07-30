import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: unknown) => {
  console.log(`[STRIPE-WEBHOOK] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } },
);

// Resolve a Supabase user id from metadata or a Stripe customer id/email.
async function resolveUserId(
  metadataUserId: string | undefined | null,
  customerId: string | null,
): Promise<string | null> {
  if (metadataUserId) return metadataUserId;

  if (customerId) {
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    if (sub?.user_id) return sub.user_id;

    try {
      const customer = await stripe.customers.retrieve(customerId);
      const email = (customer as Stripe.Customer)?.email;
      if (email) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("email", email)
          .maybeSingle();
        if (profile?.user_id) return profile.user_id;
      }
    } catch (e) {
      logStep("Failed to retrieve customer", { customerId, error: String(e) });
    }
  }
  return null;
}

// Look up monthly credits for a Stripe price id via subscription_plans.
async function creditsForPrice(priceId: string | null): Promise<{ credits: number; name: string } | null> {
  if (!priceId) return null;
  const { data } = await supabase
    .from("subscription_plans")
    .select("name, limits")
    .eq("stripe_price_id", priceId)
    .maybeSingle();
  if (!data) return null;
  const credits = Number((data.limits as Record<string, unknown>)?.monthly_credits ?? 0);
  if (!credits) return null;
  return { credits, name: data.name as string };
}

async function priceIdForSubscription(subscriptionId: string): Promise<{ priceId: string | null; sub: Stripe.Subscription | null }> {
  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    return { priceId: (sub.items.data[0]?.price?.id as string) ?? null, sub };
  } catch (e) {
    logStep("Failed to retrieve subscription", { subscriptionId, error: String(e) });
    return { priceId: null, sub: null };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!webhookSecret) {
    logStep("ERROR: STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    // MUST be the async variant on Deno.
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (e) {
    logStep("Signature verification failed", { error: String(e) });
    return new Response(`Webhook signature verification failed: ${String(e)}`, { status: 400 });
  }

  logStep("Event received", { id: event.id, type: event.type });

  // Idempotency: bail if we've already processed this event id.
  const { error: dedupeError } = await supabase
    .from("processed_webhook_events")
    .insert({ event_id: event.id, event_type: event.type });

  if (dedupeError) {
    if (dedupeError.code === "23505") {
      logStep("Duplicate event ignored", { id: event.id });
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    logStep("Dedupe insert error (continuing)", { error: dedupeError.message });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = (session.customer as string) ?? null;
        const userId = await resolveUserId(session.metadata?.user_id, customerId);

        if (!userId) {
          logStep("Could not resolve user for session", { sessionId: session.id });
          break;
        }

        if (session.mode === "payment") {
          const amount = parseInt(session.metadata?.credit_amount ?? "0", 10);
          if (amount > 0) {
            const { error } = await supabase.rpc("grant_credits", {
              _user_id: userId,
              _amount: amount,
              _reason: `Credit top-up (${amount} credits)`,
              _metadata: { stripe_session_id: session.id, event_id: event.id },
            });
            if (error) throw new Error(`grant_credits failed: ${error.message}`);
            logStep("Top-up credits granted", { userId, amount });
          } else {
            logStep("Payment session with no credit_amount metadata", { sessionId: session.id });
          }
        } else if (session.mode === "subscription") {
          const subscriptionId = session.subscription as string;
          const { priceId, sub } = await priceIdForSubscription(subscriptionId);
          const plan = await creditsForPrice(priceId);

          const { error: upsertError } = await supabase
            .from("user_subscriptions")
            .upsert(
              {
                user_id: userId,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                plan_type: (plan?.name ?? session.metadata?.plan_type ?? "basic").toLowerCase(),
                status: "active",
                current_period_start: sub?.current_period_start
                  ? new Date(sub.current_period_start * 1000).toISOString()
                  : null,
                current_period_end: sub?.current_period_end
                  ? new Date(sub.current_period_end * 1000).toISOString()
                  : null,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id" },
            );
          if (upsertError) logStep("user_subscriptions upsert error", { error: upsertError.message });

          if (plan) {
            const { error } = await supabase.rpc("refresh_plan_credits", {
              _user_id: userId,
              _amount: plan.credits,
              _reason: `${plan.name} subscription — ${plan.credits} monthly credits`,
            });
            if (error) throw new Error(`refresh_plan_credits failed: ${error.message}`);
            logStep("Subscription credits set", { userId, plan: plan.name, credits: plan.credits });
          } else {
            logStep("No plan matched price id", { priceId });
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.billing_reason !== "subscription_cycle") {
          logStep("Invoice ignored", { billing_reason: invoice.billing_reason });
          break;
        }
        const customerId = (invoice.customer as string) ?? null;
        const userId = await resolveUserId(null, customerId);
        if (!userId) {
          logStep("Could not resolve user for invoice", { invoiceId: invoice.id });
          break;
        }
        const priceId = (invoice.lines?.data?.[0] as { price?: { id?: string } })?.price?.id ?? null;
        const plan = await creditsForPrice(priceId);
        if (!plan) {
          logStep("No plan matched invoice price", { priceId });
          break;
        }
        const { error } = await supabase.rpc("refresh_plan_credits", {
          _user_id: userId,
          _amount: plan.credits,
          _reason: `${plan.name} renewal — ${plan.credits} monthly credits`,
        });
        if (error) throw new Error(`refresh_plan_credits failed: ${error.message}`);
        logStep("Renewal credits refreshed", { userId, plan: plan.name, credits: plan.credits });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = (sub.customer as string) ?? null;
        const userId = await resolveUserId(sub.metadata?.user_id, customerId);
        if (!userId) {
          logStep("Could not resolve user for subscription event", { subId: sub.id });
          break;
        }
        const status = event.type === "customer.subscription.deleted" ? "canceled" : sub.status;
        const priceId = (sub.items.data[0]?.price?.id as string) ?? null;
        const plan = await creditsForPrice(priceId);

        const { error } = await supabase.from("user_subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: sub.id,
            plan_type: (plan?.name ?? "basic").toLowerCase(),
            status,
            cancel_at_period_end: sub.cancel_at_period_end ?? false,
            current_period_start: sub.current_period_start
              ? new Date(sub.current_period_start * 1000).toISOString()
              : null,
            current_period_end: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
        if (error) logStep("user_subscriptions upsert error", { error: error.message });
        else logStep("Subscription status synced", { userId, status });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logStep("ERROR handling event", { id: event.id, type: event.type, message });
    // Remove the dedupe row so Stripe's retry can reprocess.
    await supabase.from("processed_webhook_events").delete().eq("event_id", event.id);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
