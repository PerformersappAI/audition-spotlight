import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface UserCredits {
  id: string;
  user_id: string;
  total_credits: number;
  used_credits: number;
  available_credits: number;
  created_at: string;
  updated_at: string;
}

interface UserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_type: 'basic' | 'pro';
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'purchase' | 'subscription' | 'usage' | 'refund';
  description: string | null;
  stripe_payment_id: string | null;
  created_at: string;
}

export const useCredits = () => {
  const { user, userProfile } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch current credits
  const fetchCredits = async () => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching credits:', error);
        return;
      }

      setCredits(data);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  // Fetch subscription
  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data as UserSubscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions((data || []) as CreditTransaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCredits(),
        fetchSubscription(),
        fetchTransactions()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  // Deduct credits for usage
  const deductCredits = async (amount: number, description: string): Promise<boolean> => {
    if (!user || !credits) {
      toast.error('Please log in to use credits');
      return false;
    }

    if (credits.available_credits < amount) {
      toast.error(`Insufficient credits. You need ${amount} credits but only have ${credits.available_credits}.`);
      return false;
    }

    try {
      // Update credits
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ 
          used_credits: credits.used_credits + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating credits:', updateError);
        toast.error('Failed to deduct credits');
        return false;
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: -amount,
          transaction_type: 'usage',
          description
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
      }

      // Refresh credits
      await fetchCredits();
      await fetchTransactions();

      return true;
    } catch (error) {
      console.error('Error deducting credits:', error);
      toast.error('Failed to deduct credits');
      return false;
    }
  };

  // Add credits (for purchases/subscriptions)
  const addCredits = async (amount: number, source: string, stripePaymentId?: string): Promise<boolean> => {
    if (!user || !credits) {
      return false;
    }

    try {
      // Update credits
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ 
          total_credits: credits.total_credits + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error adding credits:', updateError);
        return false;
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount,
          transaction_type: source.includes('subscription') ? 'subscription' : 'purchase',
          description: source,
          stripe_payment_id: stripePaymentId
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
      }

      // Refresh credits
      await fetchCredits();
      await fetchTransactions();

      toast.success(`${amount} credits added to your account!`);
      return true;
    } catch (error) {
      console.error('Error adding credits:', error);
      return false;
    }
  };

  // Check if user has enough credits
  const hasEnoughCredits = (amount: number): boolean => {
    return credits ? credits.available_credits >= amount : false;
  };

  return {
    credits,
    subscription,
    transactions,
    loading,
    fetchCredits,
    fetchSubscription,
    fetchTransactions,
    deductCredits,
    addCredits,
    hasEnoughCredits
  };
};