import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

const TEAL = "#00d4aa";

const SECTIONS: { h: string; body: string }[] = [
  {
    h: "The short version",
    body: `We do not sell your content. We do not license it. We do not share it with other users, advertisers, or data brokers. We do not use your scripts, footage, or project files to train AI models. When you delete something, it's gone. Your card number never touches our servers. You can leave whenever you want and take your work with you.

Everything below is the detail behind those promises.`,
  },
  {
    h: "What we collect",
    body: `Account information — your name, email address, and password (stored encrypted; we cannot read it).
Content you upload — scripts, documents, images, footage, and anything else you bring to the platform to work on.
Usage information — which tools you used and how many credits you spent, so we can bill you correctly and keep the service running.
Payment information — handled entirely by Stripe. We never see or store your card number.
Technical information — basic log data such as IP address and browser type, used for security and to diagnose problems.`,
  },
  {
    h: "What we do with your content",
    body: `We use it to do exactly what you asked us to do, and nothing else.

When you run an AI tool — a script analysis, a scene breakdown, a table read — the relevant text is sent to our AI processing partner to generate your result. That is the only time your content leaves our systems. It is used solely to produce your output. It is not stored by them for any other purpose, and it is not used to train their models.

We do not read your scripts for fun. We do not have a team browsing your footage. Your work is not a product we sell.`,
  },
  {
    h: "What we will never do",
    body: `We will never sell your content or your personal data. Not to advertisers, not to data brokers, not to anyone, at any price.
We will never license your work to a third party.
We will never use your scripts, footage, or projects to train an AI model — ours or anyone else's.
We will never show your private work to another user.
We will never claim ownership of anything you create. It's yours. It was always yours.`,
  },
  {
    h: "Deletion — and we mean it",
    body: `When you delete a file, it is removed from our systems. Permanently. We do not keep a quiet backup "just in case."

If you close your account, your content goes with it. You can request full deletion at any time by contacting us, and we will confirm when it's done.

The only exception is information we are legally required to retain — for example, basic billing records that tax law requires us to keep. That does not include your creative work.`,
  },
  {
    h: "Payments",
    body: `Payments are processed by Stripe, one of the most trusted payment processors in the world — the same infrastructure behind Amazon, Google, and Shopify.

Your card number never touches our servers. We never see it, never store it, and could not retrieve it if we tried. Stripe is PCI-DSS Level 1 certified, the highest level of payment security that exists.`,
  },
  {
    h: "Cookies",
    body: `We use the minimum necessary. Cookies keep you logged in and remember basic preferences. We do not run advertising trackers and we do not sell your browsing behaviour to anyone.`,
  },
  {
    h: "Your rights",
    body: `You have the right to see what data we hold about you, to correct it, to export it, and to have it deleted. You do not need a legal reason. Ask, and we'll do it.

Depending on where you live, you may have additional rights under laws such as the GDPR or the CCPA. We extend these rights to every user, everywhere, regardless of whether the law requires it. It's simpler, and it's the right thing to do.`,
  },
  {
    h: "Children",
    body: `Filmmaker Genius is not intended for children under 13, and we do not knowingly collect information from them.`,
  },
  {
    h: "Changes to this policy",
    body: `If we change this policy in a way that matters, we will tell you — clearly, and before it takes effect. We will not bury a material change in a silent update.`,
  },
];

export default function Privacy() {
  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh" }}>
      <Seo
        title="Privacy Policy — Filmmaker Genius"
        description="How Filmmaker Genius protects your scripts, footage, and personal data. We never sell your content, never train AI on your work, and delete it permanently when you say so."
        canonical="https://filmmakergenius.com/privacy"
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
          Privacy Policy
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
          This is your work. Your scripts, your footage, your story. We built Filmmaker Genius to help you make films — not to mine you for data. This page explains, in plain English, exactly what we collect, what we do with it, and what we will never do. If anything here is unclear, ask us. We'd rather over-explain than have you wondering.
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
            Questions about your privacy, your data, or anything on this page?{" "}
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
