import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "npm:stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });

const logStep = (step: string, details?: unknown) => {
  console.log(`[CANCEL-SUBSCRIPTION] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ success: false, error: "Billing is not configured." }, 500);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ success: false, error: "You must be signed in to cancel." }, 401);
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user?.email) {
      return json({ success: false, error: "You must be signed in to cancel." }, 401);
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // 1) Look up the stored active subscription row
    const { data: subRow } = await supabase
      .from("user_subscriptions")
      .select("id, stripe_subscription_id, stripe_customer_id, plan_type")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const subIds: string[] = [];
    let customerId: string | null = subRow?.stripe_customer_id ?? null;

    if (subRow?.stripe_subscription_id) {
      subIds.push(subRow.stripe_subscription_id as string);
      logStep("Using stored stripe_subscription_id", { id: subRow.stripe_subscription_id });
    } else {
      // 2) Fall back to Stripe lookup by email
      if (!customerId) {
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        customerId = customers.data[0]?.id ?? null;
      }
      if (customerId) {
        const [active, trialing] = await Promise.all([
          stripe.subscriptions.list({ customer: customerId, status: "active", limit: 10 }),
          stripe.subscriptions.list({ customer: customerId, status: "trialing", limit: 10 }),
        ]);
        for (const s of [...active.data, ...trialing.data]) subIds.push(s.id);
      }
      logStep("Fallback lookup", { customerId, found: subIds.length });
    }

    if (subIds.length === 0) {
      return json(
        { success: false, error: `No active subscription found for ${user.email}.` },
        404
      );
    }

    let periodEnd: number | null = null;
    for (const id of subIds) {
      const updated = await stripe.subscriptions.update(id, { cancel_at_period_end: true });
      customerId = customerId ?? (updated.customer as string);
      const end = (updated as unknown as { current_period_end?: number }).current_period_end ??
        (updated as unknown as { items?: { data?: Array<{ current_period_end?: number }> } })
          .items?.data?.[0]?.current_period_end ?? null;
      if (end && (!periodEnd || end > periodEnd)) periodEnd = end;
    }
    const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
    logStep("Canceled at period end", { subIds, currentPeriodEnd });

    // Best-effort DB sync
    try {
      if (subRow?.id) {
        await supabase
          .from("user_subscriptions")
          .update({
            cancel_at_period_end: true,
            stripe_subscription_id: subRow.stripe_subscription_id ?? subIds[0],
            stripe_customer_id: subRow.stripe_customer_id ?? customerId,
            ...(currentPeriodEnd ? { current_period_end: currentPeriodEnd } : {}),
          })
          .eq("id", subRow.id);
      }
    } catch (e) {
      logStep("DB sync failed (non-fatal)", { message: String(e) });
    }

    // Best-effort cancellation feedback log
    try {
      let reasonCode = "user_self_service";
      let additional: string | null = null;
      try {
        const body = await req.json();
        if (typeof body?.reason_code === "string") reasonCode = body.reason_code;
        if (typeof body?.additional_feedback === "string") additional = body.additional_feedback;
      } catch { /* no body */ }

      await supabase.from("cancellation_feedback").insert({
        user_id: user.id,
        user_email: user.email,
        reason_code: reasonCode,
        additional_feedback: additional,
        plan_name: subRow?.plan_type ?? null,
        subscription_id: subRow?.id ?? null,
      });
    } catch (e) {
      logStep("Feedback log failed (non-fatal)", { message: String(e) });
    }

    // Best-effort confirmation email
    try {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (resendKey) {
        const endText = currentPeriodEnd
          ? new Date(currentPeriodEnd).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })
          : "the end of your current billing period";
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "FilmmakerGenius <sal@howtoselftape.com>",
            to: [user.email],
            bcc: ["sal@howtoselftape.com"],
            subject: "Your FilmmakerGenius membership is canceled",
            html: `
              <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
                <h2>Your membership is canceled</h2>
                <p>We've canceled your FilmmakerGenius membership. You'll keep full access until <strong>${endText}</strong> — nothing else will be charged.</p>
                <p>Your remaining credits stay on your account.</p>
                <p>Changed your mind? You can resubscribe any time at
                  <a href="https://filmmakergenius.com/membership">filmmakergenius.com/membership</a>.
                </p>
                <p>— The FilmmakerGenius team</p>
              </div>`,
          }),
        });
        logStep("Confirmation email sent", { ok: res.ok });
      }
    } catch (e) {
      logStep("Email failed (non-fatal)", { message: String(e) });
    }

    return json({ success: true, current_period_end: currentPeriodEnd });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message });
    return json({ success: false, error: `We couldn't cancel your membership: ${message}` }, 500);
  }
});
