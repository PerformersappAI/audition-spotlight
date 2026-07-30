import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Crown, CreditCard, Loader2, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CreditCostTable from '@/components/CreditCostTable';
import AddCreditsCard from '@/components/AddCreditsCard';

const TEAL = '#00d4aa';
const VIOLET = '#a855f7';



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
      // Refresh subscription and credits data
      fetchSubscription();
      fetchCredits();
      // Clean up URL
      navigate('/membership', { replace: true });
    } else if (canceled === 'true') {
      toast.info('Payment was canceled');
      navigate('/membership', { replace: true });
    }
  }, [searchParams, navigate, fetchSubscription, fetchCredits]);




  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 19.99,
      credits: 50,
      icon: Sparkles,
      features: [
        '50 monthly credits',
        'AI Script Analysis',
        'Storyboard Generation',
        'Scene Breakdown',
        'Basic Support',
        'Export to PDF'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 24.99,
      credits: 100,
      icon: Crown,
      features: [
        '100 monthly credits',
        'Everything in Basic',
        'Priority Support',
        'Advanced Analytics',
        'Early Access to Features',
        'Custom Branding'
      ],
      popular: true
    }
  ];

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



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Seo
        title="Filmmaker Genius Membership — Plans & Credits"
        description="Choose a Filmmaker Genius membership: monthly plans and credit packs that unlock AI script analysis, storyboards, scene breakdowns, and PDF exports."
        canonical="https://filmmakergenius.com/membership"
        type="website"
      />
      <div className="container mx-auto px-4 pt-4">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Filmmaker Genius
        </Link>
      </div>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          {user && !loading && (credits?.available_credits || 0) === 0 && !subscription ? (
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                Welcome to Filmmaker Genius!
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose a plan to get started and unlock powerful filmmaking tools
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                Choose Your Plan
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Unlock powerful filmmaking tools with our flexible pricing options
              </p>
            </>
          )}
          
          {user && !loading && (
            <div className="mt-6 inline-flex items-center gap-3 bg-accent/50 px-6 py-3 rounded-full">
              <Zap className="h-5 w-5 text-gold" />
              <span className="text-lg font-semibold">
                {credits?.available_credits || 0} Credits Available
              </span>
            </div>
          )}
        </div>

        {/* Current Subscription Status */}
        {user && subscription && subscription.status === 'active' && (
          <Card className="mb-8 border-gold/50 bg-gradient-to-r from-gold/10 to-gold-light/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-gold" />
                Current Plan: {subscription.plan_type === 'basic' ? 'Basic' : 'Pro'}
              </CardTitle>
              <CardDescription>
                Status: {subscription.status} | Renews: {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={handleManageSubscription}
                disabled={openingPortal}
              >
                {openingPortal ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Opening...
                  </>
                ) : (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Subscription
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {subscriptionPlans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = subscription?.plan_type === plan.id && subscription?.status === 'active';
            const isSubscribing = subscribingPlan === plan.id;
            
            return (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  plan.popular ? 'border-gold shadow-glow' : ''
                } ${isCurrentPlan ? 'ring-2 ring-gold' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-gold to-gold-light text-gold-foreground px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-br-lg">
                    Your Plan
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="mb-4 flex justify-center">
                    <div className={`p-4 rounded-full ${plan.popular ? 'bg-gradient-to-r from-gold to-gold-light' : 'bg-primary/10'}`}>
                      <Icon className={`h-8 w-8 ${plan.popular ? 'text-gold-foreground' : 'text-primary'}`} />
                    </div>
                  </div>
                  <CardTitle className="text-3xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="mt-2 text-lg">
                    {plan.credits} credits per month
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrentPlan || isSubscribing}
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : (
                      `Subscribe to ${plan.name}`
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Credit Top-Up Section */}
        <div className="max-w-3xl mx-auto">
          <AddCreditsCard showMembershipLink={false} />
        </div>

        {/* Credit Usage Information */}
        <div className="mt-16 max-w-4xl mx-auto text-white">
          <CreditCostTable />
        </div>


      </div>
    </div>
  );
};

export default Membership;
