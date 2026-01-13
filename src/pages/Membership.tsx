import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Sparkles, Zap, Crown, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { toast } from 'sonner';

const Membership = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { credits, subscription, loading } = useCredits();
  const [selectedCreditPack, setSelectedCreditPack] = useState<string>('');

  const creditPacks = [
    { amount: 10, price: 5.00, pricePerCredit: 0.50 },
    { amount: 20, price: 9.00, pricePerCredit: 0.45 },
    { amount: 30, price: 12.00, pricePerCredit: 0.40 },
    { amount: 40, price: 14.00, pricePerCredit: 0.35 }
  ];

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

  const handleSubscribe = (planId: string) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      navigate('/auth');
      return;
    }

    // TODO: Integrate with Stripe when ready
    toast.info('Subscription feature coming soon! Stripe integration pending.');
    console.log('Subscribe to:', planId);
  };

  const handlePurchaseCredits = () => {
    if (!user) {
      toast.error('Please sign in to purchase credits');
      navigate('/auth');
      return;
    }

    if (!selectedCreditPack) {
      toast.error('Please select a credit pack');
      return;
    }

    // TODO: Integrate with Stripe when ready
    toast.info('Credit purchase coming soon! Stripe integration pending.');
    console.log('Purchase credits:', selectedCreditPack);
  };

  const selectedPack = creditPacks.find(pack => pack.amount.toString() === selectedCreditPack);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
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
        {user && subscription && (
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
          </Card>
        )}

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {subscriptionPlans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = subscription?.plan_type === plan.id;
            
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
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? 'Current Plan' : `Subscribe to ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Credit Top-Up Section */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-dashed border-primary/30">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Need More Credits?</CardTitle>
              <CardDescription className="text-base">
                Purchase additional credits anytime. Credits never expire!
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Credit Pack</label>
                <Select value={selectedCreditPack} onValueChange={setSelectedCreditPack}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose credit amount" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditPacks.map((pack) => (
                      <SelectItem key={pack.amount} value={pack.amount.toString()}>
                        {pack.amount} Credits - ${pack.price.toFixed(2)} (${pack.pricePerCredit.toFixed(2)}/credit)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPack && (
                <div className="bg-accent/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credits</span>
                    <span className="font-semibold">{selectedPack.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per credit</span>
                    <span className="font-semibold">${selectedPack.pricePerCredit.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold text-gold">${selectedPack.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full"
                size="lg"
                onClick={handlePurchaseCredits}
                disabled={!selectedCreditPack}
              >
                Purchase Credits
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Credit Usage Information */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>How Credits Work</CardTitle>
              <CardDescription>Understanding our credit system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="outline">Credit Costs</Badge>
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Script Analysis: <span className="font-semibold text-foreground">5 credits</span></li>
                    <li>• Scene Analysis: <span className="font-semibold text-foreground">3 credits</span></li>
                    <li>• Storyboard Frame: <span className="font-semibold text-foreground">10 credits</span></li>
                    <li>• Document Upload/OCR: <span className="font-semibold text-foreground">2 credits</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="outline">Benefits</Badge>
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Credits never expire</li>
                    <li>• Use across all tools</li>
                    <li>• Monthly subscription credits reset</li>
                    <li>• Purchased credits stack with subscription</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA for Non-logged Users */}
        {!user && (
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-gold/10 to-gold-light/10 border-gold/50">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
                <CardDescription className="text-base">
                  Sign up now and get 10 free credits to try out our tools!
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button 
                  size="lg"
                  variant="gold"
                  onClick={() => navigate('/auth')}
                  className="px-12"
                >
                  Sign Up Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Membership;