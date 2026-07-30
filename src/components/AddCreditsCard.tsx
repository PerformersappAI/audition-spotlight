import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TEAL = '#00d4aa';
const VIOLET = '#a855f7';

interface AddCreditsCardProps {
  className?: string;
  /** Shows the "Need a bigger pack? See Membership." footer line. Hidden on the Membership page itself. */
  showMembershipLink?: boolean;
}

/**
 * Shared one-time $5 top-up box (10 credits).
 * Used on both the Refill (/refill) and Membership (/membership) pages so the two stay in sync.
 */
export default function AddCreditsCard({ className = '', showMembershipLink = true }: AddCreditsCardProps) {
  const [buying, setBuying] = useState(false);

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

  return (
    <Card className={`p-8 bg-white/[0.03] border-white/10 text-center ${className}`}>
      <div
        className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: `linear-gradient(135deg, ${TEAL}, ${VIOLET})` }}
      >
        <Zap className="h-6 w-6 text-black" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Add More Credits</h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Buy more credits to keep using the tools. One-time $5 top-up (10 credits) — no
        subscription change.
      </p>
      <Button
        size="lg"
        onClick={handleBuy}
        disabled={buying}
        className="text-black font-semibold"
        style={{ backgroundColor: TEAL }}
      >
        {buying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
        Buy More Credits — $5
      </Button>
      {showMembershipLink && (
        <p className="text-xs text-white/40 mt-4">
          Need a bigger pack? See <Link to="/membership" className="underline hover:text-white">Membership</Link>.
        </p>
      )}
    </Card>
  );
}
