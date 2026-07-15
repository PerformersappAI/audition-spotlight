import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

const TEAL = "#00d4aa";

const SECTIONS: { h: string; body: string }[] = [
  {
    h: "You own your work",
    body: `Let's start with the most important thing, because most platforms bury it.

Everything you create, upload, or generate on Filmmaker Genius belongs to you. Your scripts. Your footage. Your storyboards. Your breakdowns. All of it. We claim no ownership, no copyright, no license to exploit it, and no share of anything it earns.

We need permission to store your files and run them through the tools you asked us to run them through — that's the only 'license' we take, it exists purely to make the product work, and it ends the moment you delete the file.`,
  },
  {
    h: "Your account",
    body: `You need an account to use the tools. Keep your password to yourself, tell us the truth about who you are, and don't share your login with people who haven't paid.

You must be at least 13 years old to use Filmmaker Genius. If you're under 18, get a parent or guardian's permission first.`,
  },
  {
    h: "Plans, credits, and billing",
    body: `Filmmaker Genius runs on credits. Your plan comes with a monthly allowance — 50 credits on Basic, 100 on Pro — which resets each month. Different tools cost different amounts, and the current costs are listed on the Pricing page.

Unused monthly credits do not roll over. Credits you purchase outright never expire and stack on top of your monthly allowance.

Subscriptions renew automatically each month until you cancel. We'll charge the card you gave Stripe. If a payment fails, we'll tell you before anything is cut off.`,
  },
  {
    h: "Cancelling — no games",
    body: `You can cancel anytime, for any reason, with no notice period and no cancellation fee. One click in your account settings. There is no retention call, no 'are you sure' maze, no form to fax.

When you cancel, you keep full access until the end of the billing period you've already paid for. You will not be charged again. Credits you purchased outright remain yours.

We do not refund partial months. If you cancel on day 3, you keep the rest of the month you paid for — we don't take it away, and we don't refund it either. That's the trade, and it's the same in both directions.`,
  },
  {
    h: "What the tools are — and what they aren't",
    body: `Our AI tools are assistants, not authorities. They produce drafts, suggestions, and first passes. They will sometimes be wrong.

Nothing generated on this platform is legal advice, financial advice, or a substitute for a qualified professional. Our Academy courses are educational, written by working filmmakers, and are not a guarantee of any outcome. A contract template is not a lawyer. A funding strategy is not a financial advisor. Use your judgement, and hire real professionals when the stakes are real.`,
  },
  {
    h: "Things you can't do",
    body: `Don't upload content you don't have the rights to.
Don't use the platform to break the law, harass anyone, or infringe someone's copyright.
Don't resell, scrape, or redistribute our Academy content or tools as your own.
Don't try to break, overload, or reverse-engineer the service.
Don't share one account across a team that should be paying for several.

If you do these things, we may suspend or close your account. We'll tell you why.`,
  },
  {
    h: "Uptime, and honesty about it",
    body: `We work hard to keep Filmmaker Genius running, but we're not going to promise you 100% uptime, because nobody can honestly promise that. Things break. Servers go down. When they do, we'll fix them and we'll tell you what happened.

The service is provided 'as is.' We're not liable for lost profits, missed deadlines, or a film that didn't get made. Back up your own work — that's true on every platform, including this one.`,
  },
  {
    h: "Changes to these terms",
    body: `If we change these terms in a way that materially affects you, we'll tell you clearly and give you notice before it takes effect. We won't quietly rewrite the deal and hope you don't notice.

If you don't like the new terms, cancel. No hard feelings.`,
  },
  {
    h: "Ending the relationship",
    body: `You can leave anytime and take your work with you. We can close an account that's breaking these terms, but we'll explain why and give you a chance to get your files out — unless the law prevents us.`,
  },
];

export default function Terms() {
  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh" }}>
      <Seo
        title="Terms of Service — Filmmaker Genius"
        description="The rules of using Filmmaker Genius, in plain English. You own your work. Cancel anytime. No tricks, no traps, no hidden clauses."
        canonical="https://filmmakergenius.com/terms"
      />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px 96px" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: TEAL,
            marginBottom: 14,
          }}
        >
          Legal
        </div>

        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "2.4em",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Terms of Service
        </h1>

        <p
          style={{
            fontSize: "0.875em",
            color: "rgba(255,255,255,0.35)",
            marginTop: 12,
            marginBottom: 40,
          }}
        >
          Last updated: July 2026
        </p>

        <p
          style={{
            fontSize: "1em",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.75,
            marginBottom: 40,
          }}
        >
          Most terms of service are written to protect the company from the customer. We'd rather write one that a filmmaker can actually read. Here's the deal between us, in plain English. No dense clauses buried on page nine. If you disagree with something here, tell us — we'd rather hear it than hide it.
        </p>

        {SECTIONS.map(({ h, body }) => (
          <section key={h} style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.5em",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                margin: "0 0 16px",
              }}
            >
              {h}
            </h2>
            {body.split(/\n\n+/).map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: "1em",
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.8,
                  margin: "0 0 14px",
                  whiteSpace: "pre-line",
                }}
              >
                {p}
              </p>
            ))}
          </section>
        ))}

        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.5em",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              margin: "0 0 16px",
            }}
          >
            Contact
          </h2>
          <p
            style={{
              fontSize: "1em",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Something here doesn't sit right? Something unclear?{" "}
            <Link
              to="/contact"
              style={{ color: TEAL, textDecoration: "none", fontWeight: 600 }}
            >
              Contact us
            </Link>{" "}
            — a real person will answer.
          </p>
        </section>
      </div>
    </div>
  );
}
