import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Zap, Loader2, CircleDot } from 'lucide-react';
import CreditCostTable from '@/components/CreditCostTable';
import AddCreditsCard from '@/components/AddCreditsCard';

import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TEAL = '#00d4aa';
const VIOLET = '#a855f7';




export default function Refill() {
  const { user, loading: authLoading } = useAuth();
  const { credits, transactions, loading, fetchCredits, fetchTransactions } = useCredits();
  const [buying, setBuying] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    document.title = 'Account & Credits | Filmmaker Genius';
  }, []);

  // Realtime credit updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('refill-credits')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_credits', filter: `user_id=eq.${user.id}` },
        () => { fetchCredits(); })
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'credit_transactions', filter: `user_id=eq.${user.id}` },
        () => { fetchTransactions(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchCredits, fetchTransactions]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/60" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;

  const granted = credits?.total_credits ?? 0;
  const used = credits?.used_credits ?? 0;
  const remaining = credits?.available_credits ?? Math.max(0, granted - used);

  const usageLog = transactions.filter(t => t.transaction_type === 'usage');

  const handleBuy = async () => {
    setBuying(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-credit-purchase', {
        body: { creditAmount: '10' }, // $5 = 10 credits (smallest existing pack)
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
      else throw new Error('No checkout URL returned');
    } catch (e: any) {
      toast.error(e.message || 'Could not start checkout');
    } finally {
      setBuying(false);
    }
  };

  const handleCancel = async () => {
    setCanceling(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
      else throw new Error('No portal URL');
    } catch (e: any) {
      toast.error(
        e?.message?.includes('No Stripe customer')
          ? 'No active membership found. Please contact support if this is unexpected.'
          : (e?.message || 'Please contact support to cancel your membership.')
      );
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: TEAL }}>
            FilmmakerGenius
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Account & Credits</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Top up your credits to keep working, or manage your membership below.
          </p>
        </div>

        {/* 1. Credit Activity */}
        <Card className="p-6 mb-8 bg-white/[0.03] border-white/10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Credit Activity</h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
              <CircleDot className="h-3 w-3 animate-pulse" style={{ color: TEAL }} />
              Live
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Stat label="Total Granted" value={granted} />
            <Stat label="Total Used" value={used} />
            <Stat label="Remaining" value={remaining} accent />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3">Recent Activity</h3>
            {loading ? (
              <p className="text-sm text-white/50">Loading…</p>
            ) : usageLog.length === 0 ? (
              <p className="text-sm text-white/50">
                No credit activity yet. Usage will appear here as you run tools.
              </p>
            ) : (
              <ul className="divide-y divide-white/5 border border-white/5 rounded-md">
                {usageLog.slice(0, 10).map(t => (
                  <li key={t.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <div>
                      <p className="text-white/90">{t.description || 'Tool usage'}</p>
                      <p className="text-xs text-white/40">
                        {new Date(t.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-white/70 font-mono">{t.amount}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        {/* 2. Add More Credits */}
        <AddCreditsCard className="mb-8" />

        {/* 3. How Your Credits Work */}
        <CreditCostTable className="mb-8" />


        {/* 4. Cancel Membership */}
        <div className="text-center pb-10">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-sm text-white/40 hover:text-white/70 underline underline-offset-4">
                Cancel Membership
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel your membership?</AlertDialogTitle>
                <AlertDialogDescription>
                  You'll be sent to Stripe's billing portal to manage or cancel your membership.
                  Your remaining credits stay on your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Membership</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel} disabled={canceling}>
                  {canceling ? 'Opening…' : 'Continue to Billing Portal'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center">
      <p className="text-xs uppercase tracking-wider text-white/50 mb-1">{label}</p>
      <p
        className="text-3xl font-bold tabular-nums"
        style={accent ? { color: TEAL } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
