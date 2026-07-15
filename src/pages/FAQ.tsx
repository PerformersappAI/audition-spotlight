import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

const TEAL = "#00d4aa";
const TEAL_HOVER = "#00f0c0";

const FAQS: { q: string; a: string }[] = [
  {
    q: "What are credits and how do they work?",
    a: `Credits are what you spend to run the AI tools. Every plan comes with a monthly allowance — Basic gives you 50, Pro gives you 100 — and they reset each month.

Different tools cost different amounts: Scene Analysis is 3 credits, Script Analysis is 5, a Storyboard frame is 10, and a document upload is 2.

If you run low, you can buy more in packs of 25, 50, 100, or 250. Purchased credits never expire and stack on top of your monthly allowance.`,
  },
  {
    q: "Do my scripts, project files, and footage stay private?",
    a: `Yes. Your work is yours. We do not sell your content. We do not license it. We do not share it with other users, advertisers, or data brokers — ever. We do not use your scripts, footage, or project files to train AI models.

The only time your content leaves our systems is when you actively run an AI tool on it — the text is sent to our AI processing partner solely to generate your result, and for no other purpose.

When you delete a file, it's gone. Permanently, from our systems. We don't keep a copy "just in case."`,
  },
  {
    q: "What is the difference between the Basic and Pro plans?",
    a: `Basic is $19.99 a month and gives you 50 credits, AI Script Analysis, Storyboard Generation, Scene Breakdown, PDF export, and standard support.

Pro is $24.99 a month and gives you everything in Basic plus double the credits (100), priority support, advanced analytics, custom branding, and early access to new features.

If you're working on one project at a time, Basic is usually enough. If you're running multiple productions, Pro pays for itself in credits alone.`,
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: `Yes. Anytime, for any reason, with no notice period, no cancellation fee, and no phone call to some retention specialist. One click in your account settings and you're done.

You keep full access until the end of the billing period you've already paid for. You will not be charged again. Any credits you purchased outright are yours and don't expire.`,
  },
  {
    q: "Are the AI tools a replacement for professional services or a supplement?",
    a: `A supplement. Full stop.

These tools handle the work that eats your hours — breaking down a script, generating a storyboard, hearing your dialogue read aloud, building a call sheet. They give you a fast, cheap first pass so you can spend your real time on the decisions only a filmmaker can make.

They are not a replacement for a working cinematographer, a real editor, a script consultant, or an experienced producer sitting across the table from you. No AI has ever been on a set at 2am when the location fell through. Use these tools to move faster and arrive better prepared — not to skip the people who make films good.`,
  },
  {
    q: "Is my payment information secure?",
    a: `Yes. Payments are handled by Stripe, one of the most trusted payment processors in the world — the same infrastructure used by Amazon, Google, and Shopify.

Your card number never touches our servers. We never see it, never store it, and couldn't retrieve it if we tried. Stripe is PCI-DSS Level 1 certified — the highest level of payment security that exists.`,
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh" }}>
      <Seo
        title="FAQ — Filmmaker Genius: Answers for Indie Filmmakers"
        description="Answers to common questions about Filmmaker Genius: pricing, credits, tools, the academy, exports, and how filmmakers use the platform on real productions."
        canonical="https://filmmakergenius.com/faq"
        jsonLd={faqJsonLd}
      />
      <style>{`
        .faq-q { transition: background 0.15s, color 0.15s; }
        .faq-q:hover { background: #111122; }
        .faq-chev { transition: transform 0.2s, color 0.2s; display: inline-block; }
        .faq-btn-teal:hover { background: ${TEAL_HOVER} !important; }
        .faq-answer {
          overflow: hidden;
          max-height: 0;
          visibility: hidden;
          transition: max-height 0.25s ease, visibility 0s linear 0.25s;
        }
        .faq-answer.is-open {
          max-height: 2000px;
          visibility: visible;
          transition: max-height 0.35s ease, visibility 0s;
        }
        .faq-answer-inner p { margin: 0 0 12px; }
        .faq-answer-inner p:last-child { margin-bottom: 0; }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px 96px" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: TEAL, marginBottom: 14,
        }}>Support</div>

        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "2.4em", fontWeight: 700, letterSpacing: "-0.03em",
          lineHeight: 1.1, marginBottom: 16, margin: 0,
        }}>Frequently Asked Questions</h1>

        <p style={{
          fontSize: "1em", color: "rgba(255,255,255,0.45)", lineHeight: 1.6,
          maxWidth: 560, marginTop: 16, marginBottom: 56,
        }}>
          Quick answers about our tools, credits, membership, and privacy. Don't see your question? Reach out below.
        </p>

        {/* ACCORDION */}
        <div style={{
          border: "1px solid #1e1e35", borderRadius: 12,
          overflow: "hidden", marginBottom: 48,
        }}>
          {FAQS.map(({ q, a }, i) => {
            const isOpen = open === i;
            const isLast = i === FAQS.length - 1;
            const paragraphs = a.split(/\n\n+/);
            return (
              <div key={i} style={{ borderBottom: isLast ? "none" : "1px solid #1e1e35" }}>
                <button
                  className="faq-q"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    background: isOpen ? "#111122" : "#0d0d1a",
                    color: isOpen ? TEAL : "#fff",
                    border: "none",
                    fontSize: "0.95em",
                    fontWeight: 600,
                    textAlign: "left",
                    padding: "22px 24px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    fontFamily: "inherit",
                  }}
                >
                  <span>{q}</span>
                  <span
                    className="faq-chev"
                    style={{
                      fontSize: 18,
                      color: isOpen ? TEAL : "rgba(255,255,255,0.3)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >⌄</span>
                </button>
                <div className={`faq-answer${isOpen ? " is-open" : ""}`}>
                  <div
                    className="faq-answer-inner"
                    style={{
                      background: "#0a0a12",
                      padding: "18px 24px 22px",
                      borderTop: "1px solid #1e1e35",
                      fontSize: "0.9em",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.75,
                    }}
                  >
                    {paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTACT PROMPT */}
        <div style={{
          background: "#0d0d1a", border: "1px solid #1e1e35",
          borderRadius: 12, padding: 32, textAlign: "center",
        }}>
          <p style={{ margin: 0 }}>
            <span style={{ display: "block", color: "#fff", fontWeight: 700, fontSize: "1.1em", marginBottom: 8 }}>
              Didn't find your answer?
            </span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95em" }}>
              Send us your question and we'll get back to you within 24 hours.
            </span>
          </p>
          <Link
            to="/contact"
            className="faq-btn-teal"
            style={{
              display: "inline-block",
              background: TEAL,
              color: "#000",
              fontSize: "0.875em",
              fontWeight: 700,
              padding: "12px 28px",
              borderRadius: 6,
              marginTop: 20,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
