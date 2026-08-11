import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, Eye, EyeOff, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TEAL = '#00d4aa';

interface Props {
  email?: string | null;
  className?: string;
}

export default function PasswordSettingsCard({ email, className = '' }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSave = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password updated — use it next time you sign in.');
  };

  const handleEmailLink = async () => {
    if (!email) {
      toast.error('No email on file for this account');
      return;
    }
    setSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Password reset link sent to ${email}`);
  };

  return (
    <Card className={`p-6 bg-white/[0.03] border-white/10 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <KeyRound className="h-5 w-5" style={{ color: TEAL }} />
        <h2 className="text-xl font-semibold">Password &amp; Security</h2>
      </div>
      <p className="text-sm text-white/60 mb-5">
        Set a new password for {email || 'your account'}. Minimum 6 characters.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mb-5">
        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <KeyRound className="h-4 w-4 mr-2" />}
          {saving ? 'Updating…' : 'Update Password'}
        </Button>
        <Button variant="outline" onClick={handleEmailLink} disabled={sending}>
          {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
          Email me a reset link
        </Button>
      </div>
    </Card>
  );
}
