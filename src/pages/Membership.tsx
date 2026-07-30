import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CreditCostTable from '@/components/CreditCostTable';
import AddCreditsCard from '@/components/AddCreditsCard';

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

const Check = () => (
  <span style={{ color: '#00d4aa', fontWeight: 700, flexShrink: 0 }}>✓</span>
);

const Membership = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { credits, subscription, loading, fetchSubscription, fetchCredits } = useCredits();
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);
  const [openingPortal, setOpeningPortal] = useState(false);

  // Handle success/cancel URL params
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const creditsPurchased = searchParams.get('credits_purchased');

    if (success === 'true') {
      if (creditsPurchased) {
        toast.success(`Successfully purchased ${creditsPurchased} credits!`);
      } else {
        toast.success('Subscription activated successfully!');
      }
      fetchSubscription();
      fetchCredits();
      navigate('/membership', { replace: true });
    } else if (canceled === 'true') {
      toast.info('Payment was canceled');
      navigate('/membership', { replace: true });
    }
  }, [searchParams, navigate, fetchSubscription, fetchCredits]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      navigate('/auth');
      return;
    }

    setSubscribingPlan(planId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType: planId }
      });

      if (error) {
        console.error('Checkout error:', error);
        toast.error('Failed to start checkout. Please try again.');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubscribingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      toast.error('Please sign in first');
      navigate('/auth');
      return;
    }

    setOpeningPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) {
        console.error('Portal error:', error);
        toast.error('Failed to open subscription management. Please try again.');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        toast.error('Failed to create portal session');
      }
    } catch (error) {
      console.error('Error opening portal:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setOpeningPortal(false);
    }
  };

  const plans = [
    { id: 'basic', name: 'Basic Plan', price: '$19.99', credits: '50 credits per month', features: basicFeatures, popular: false },
    { id: 'pro', name: 'Pro Plan', price: '$24.99', credits: '100 credits per month', features: proFeatures, popular: true },
  ];

  return (
    <div style={{ background: '#0a0a12', color: '#fff', minHeight: '100vh' }}>
      <Seo
        title="Filmmaker Genius Membership — Plans & Credits"
        description="Choose a Filmmaker Genius membership: monthly plans and credit packs that unlock AI script analysis, storyboards, scene breakdowns, and PDF exports."
        canonical="https://filmmakergenius.com/membership"
        type="website"
      />
      <style>{`
        .pr-card:hover { border-color: #2e2e50 !important; }
        .pr-btn-basic:hover { background: #222240 !important; }
        .pr-btn-pro:hover { background: #00f0c0 !important; }
        @media (max-width: 720px) {
          .pr-plan-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="container mx-auto px-4" style={{ paddingTop: 18 }}>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Filmmaker Genius
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* HERO */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '2.4em', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Choose Your Plan
          </h1>
          <p style={{ fontSize: '1.05em', color: '#888', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Unlock powerful filmmaking tools with our flexible pricing options
          </p>
          {user && !loading && (
            <div style={{ marginTop: 24, display: 'inline-block', background: '#12122a', border: '1px solid #1e1e35', padding: '10px 22px', borderRadius: 999, fontWeight: 600 }}>
              <span style={{ color: '#00d4aa' }}>⚡</span> {credits?.available_credits || 0} Credits Available
            </div>
          )}
        </div>

        {/* CURRENT SUBSCRIPTION */}
        {user && subscription && subscription.status === 'active' && (
          <div
            style={{
              background: '#0d0d1a',
              border: '1px solid #00d4aa',
              borderRadius: 12,
              padding: 24,
              marginBottom: 32,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                Current Plan: {subscription.plan_type === 'basic' ? 'Basic' : 'Pro'}
              </div>
              <div style={{ fontSize: '0.85em', color: '#888' }}>
                Status: {subscription.status} | Renews:{' '}
                {subscription.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
            <button
              className="pr-btn-basic"
              onClick={handleManageSubscription}
              disabled={openingPortal}
              style={{
                padding: '12px 20px',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.9em',
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid #2e2e50',
                cursor: openingPortal ? 'not-allowed' : 'pointer',
              }}
            >
              {openingPortal ? 'Opening…' : 'Manage Subscription'}
            </button>
          </div>
        )}

        {/* PLAN CARDS */}
        <div
          className="pr-plan-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 56 }}
        >
          {plans.map((plan) => {
            const isCurrentPlan = subscription?.plan_type === plan.id && subscription?.status === 'active';
            const isSubscribing = subscribingPlan === plan.id;
            return (
              <div
                key={plan.id}
                className="pr-card"
                style={{
                  background: '#0d0d1a',
                  border: plan.popular ? '1px solid #00d4aa' : '1px solid #1e1e35',
                  borderRadius: 12,
                  padding: 36,
                  position: 'relative',
                  boxShadow: plan.popular
                    ? '0 0 0 1px rgba(0,212,170,0.13), 0 0 32px rgba(0,212,170,0.07)'
                    : undefined,
                }}
              >
                {plan.popular && (
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
                )}
                <div style={{ fontSize: '1.15em', fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: '2.6em', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 4 }}>
                  {plan.price}
                  <span style={{ fontSize: '0.4em', fontWeight: 500, color: '#666' }}>/month</span>
                </div>
                <div style={{ fontSize: '0.85em', color: '#00d4aa', fontWeight: 600, marginBottom: 28 }}>
                  {plan.credits}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.9em', color: '#bbb' }}>
                      <Check /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={plan.popular ? 'pr-btn-pro' : 'pr-btn-basic'}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan || isSubscribing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: 14,
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: '0.9em',
                    background: plan.popular ? '#00d4aa' : '#1a1a2e',
                    color: plan.popular ? '#000' : '#fff',
                    border: plan.popular ? 'none' : '1px solid #2e2e50',
                    boxSizing: 'border-box',
                    cursor: isCurrentPlan || isSubscribing ? 'not-allowed' : 'pointer',
                    opacity: isCurrentPlan ? 0.7 : 1,
                    transition: 'background 0.15s',
                  }}
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ADD CREDITS */}
        <div style={{ maxWidth: 760, margin: '0 auto 56px' }}>
          <AddCreditsCard showMembershipLink={false} />
        </div>

        {/* CREDIT COSTS */}
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="text-white">
          <CreditCostTable />
        </div>
      </div>
    </div>
  );
};

export default Membership;
