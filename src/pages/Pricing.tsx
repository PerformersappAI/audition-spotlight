import React from 'react';
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

const basicFeatures = [
  '50 monthly credits',
  'AI Script Analysis',
  'Storyboard Generation',
  'Scene Breakdown',
  'Basic Support',
  'Export to PDF',
];

const proFeatures = [
  '100 monthly credits',
  'Everything in Basic',
  'Priority Support',
  'Advanced Analytics',
  'Early Access to Features',
  'Custom Branding',
];

const creditCosts = [
  'Script Analysis: 5 credits',
  'Scene Analysis: 3 credits',
  'Storyboard Frame: 10 credits',
  'Document Upload / OCR: 2 credits',
];

const benefits = [
  'Credits never expire',
  'Use across all tools',
  'Monthly subscription credits reset',
  'Purchased credits stack with subscription',
];

const Check = () => (
  <span style={{ color: '#00d4aa', fontWeight: 700, flexShrink: 0 }}>✓</span>
);
const Bullet = () => (
  <span style={{ color: '#00d4aa', fontWeight: 700, flexShrink: 0 }}>•</span>
);

const Pricing = () => {
  return (
    <div style={{ background: '#0a0a12', color: '#fff', minHeight: '100vh' }}>
      <Seo
        title="Membership & Pricing — Filmmaker Genius"
        description="Simple membership and pricing for indie filmmakers: Basic and Pro monthly plans with credits for AI script analysis, storyboards, scene breakdowns, and PDF exports."
        canonical="https://filmmakergenius.com/pricing"
      />
      <style>{`
        .pr-card:hover { border-color: #2e2e50 !important; }
        .pr-btn-basic:hover { background: #222240 !important; }
        .pr-btn-pro:hover { background: #00f0c0 !important; }
        .pr-btn-purchase:hover { background: #222240 !important; }
        @media (max-width: 720px) {
          .pr-plan-grid { grid-template-columns: 1fr !important; }
          .pr-credits-grid { grid-template-columns: 1fr !important; }
          .pr-credits-header { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <div className="container mx-auto px-4" style={{ paddingTop: 18, paddingBottom: 0 }}>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            fontSize: 13,
            color: '#9ab1c2',
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9ab1c2')}
        >
          ← Back to Filmmaker Genius
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 48px 80px' }}>
        {/* HERO */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1 style={{ fontSize: '2.4em', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Choose Your Plan
          </h1>
          <p style={{ fontSize: '1.05em', color: '#888', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Unlock powerful filmmaking tools with our flexible pricing options
          </p>
        </div>

        {/* PLAN CARDS */}
        <div
          className="pr-plan-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 56 }}
        >
          {/* Basic */}
          <div
            className="pr-card"
            style={{
              background: '#0d0d1a',
              border: '1px solid #1e1e35',
              borderRadius: 12,
              padding: 36,
              position: 'relative',
            }}
          >
            <div style={{ fontSize: '1.15em', fontWeight: 700, marginBottom: 8 }}>Basic Plan</div>
            <div style={{ fontSize: '2.6em', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 4 }}>
              $19.99
              <span style={{ fontSize: '0.4em', fontWeight: 500, color: '#666' }}>/month</span>
            </div>
            <div style={{ fontSize: '0.85em', color: '#00d4aa', fontWeight: 600, marginBottom: 28 }}>
              50 credits per month
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {basicFeatures.map((f) => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.9em', color: '#bbb' }}>
                  <Check /> <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="/membership"
              className="pr-btn-basic"
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                padding: 14,
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.9em',
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid #2e2e50',
                textDecoration: 'none',
                boxSizing: 'border-box',
                transition: 'background 0.15s',
              }}
            >
              Subscribe to Basic Plan
            </a>
          </div>

          {/* Pro */}
          <div
            className="pr-card"
            style={{
              background: '#0d0d1a',
              border: '1px solid #00d4aa',
              borderRadius: 12,
              padding: 36,
              position: 'relative',
              boxShadow: '0 0 0 1px rgba(0,212,170,0.13), 0 0 32px rgba(0,212,170,0.07)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -13,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#00d4aa',
                color: '#000',
                fontSize: '0.72em',
                fontWeight: 800,
                padding: '4px 16px',
                borderRadius: 20,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Most Popular
            </div>
            <div style={{ fontSize: '1.15em', fontWeight: 700, marginBottom: 8 }}>Pro Plan</div>
            <div style={{ fontSize: '2.6em', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 4 }}>
              $24.99
              <span style={{ fontSize: '0.4em', fontWeight: 500, color: '#666' }}>/month</span>
            </div>
            <div style={{ fontSize: '0.85em', color: '#00d4aa', fontWeight: 600, marginBottom: 28 }}>
              100 credits per month
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {proFeatures.map((f) => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.9em', color: '#bbb' }}>
                  <Check /> <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="/membership"
              className="pr-btn-pro"
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                padding: 14,
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.9em',
                background: '#00d4aa',
                color: '#000',
                textDecoration: 'none',
                boxSizing: 'border-box',
                transition: 'background 0.15s',
              }}
            >
              Subscribe to Pro Plan
            </a>
          </div>
        </div>

        {/* NEED MORE CREDITS */}
        <div
          style={{
            background: '#0d0d1a',
            border: '1px solid #1e1e35',
            borderRadius: 12,
            padding: 36,
            marginBottom: 32,
          }}
        >
          <div
            className="pr-credits-header"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}
          >
            <div>
              <h2 style={{ fontSize: '1.25em', fontWeight: 700, marginBottom: 6 }}>Need More Credits?</h2>
              <p style={{ fontSize: '0.875em', color: '#666' }}>
                Purchase additional credits anytime. Credits never expire!
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                defaultValue=""
                style={{
                  background: '#0a0a12',
                  border: '1px solid #2a2a3a',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: 6,
                  fontFamily: 'inherit',
                  fontSize: '0.9em',
                }}
              >
                <option value="">Choose credit amount</option>
                <option>25 Credits</option>
                <option>50 Credits</option>
                <option>100 Credits</option>
                <option>250 Credits</option>
              </select>
              <a
                href="/membership"
                className="pr-btn-purchase"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#1a1a2e',
                  color: '#fff',
                  border: '1px solid #2e2e50',
                  padding: '10px 20px',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  fontSize: '0.9em',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >
                Purchase Credits
              </a>
            </div>
          </div>
        </div>

        {/* HOW CREDITS WORK */}
        <div style={{ background: '#0d0d1a', border: '1px solid #1e1e35', borderRadius: 12, padding: 36 }}>
          <h2 style={{ fontSize: '1.25em', fontWeight: 700 }}>How Credits Work</h2>
          <p style={{ fontSize: '0.85em', color: '#555', marginBottom: 28 }}>Understanding our credit system</p>
          <div className="pr-credits-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <div
                style={{
                  textTransform: 'uppercase',
                  fontSize: '0.8em',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#555',
                  marginBottom: 16,
                }}
              >
                Credit Costs
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {creditCosts.map((c) => (
                  <li key={c} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.875em', color: '#aaa' }}>
                    <Bullet /> <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div
                style={{
                  textTransform: 'uppercase',
                  fontSize: '0.8em',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#555',
                  marginBottom: 16,
                }}
              >
                Benefits
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {benefits.map((b) => (
                  <li key={b} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.875em', color: '#aaa' }}>
                    <Bullet /> <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
