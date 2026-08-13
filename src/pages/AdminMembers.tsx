import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserCheck, UserCog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Member {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  created_at: string;
  is_internal: boolean;
  credits: number | null;
  plan: string;
}

const AdminMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showInternal, setShowInternal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const [profilesRes, creditsRes, subsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, user_id, email, first_name, last_name, company_name, created_at, is_internal')
          .order('created_at', { ascending: false }),
        supabase.from('user_credits').select('user_id, available_credits'),
        supabase.from('user_subscriptions').select('user_id, status, plan_type'),
      ]);

      if (profilesRes.error) throw profilesRes.error;

      const creditsMap = new Map<string, number | null>();
      (creditsRes.data || []).forEach((c: any) => creditsMap.set(c.user_id, c.available_credits));

      const planMap = new Map<string, string>();
      (subsRes.data || []).forEach((s: any) => {
        if (s.status === 'active') planMap.set(s.user_id, s.plan_type || 'Active');
      });

      setMembers(
        (profilesRes.data || []).map((p: any) => ({
          ...p,
          credits: creditsMap.has(p.user_id) ? creditsMap.get(p.user_id)! : null,
          plan: planMap.get(p.user_id) || 'Free',
        })),
      );
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load members' });
    } finally {
      setLoading(false);
    }
  };

  const toggleInternal = async (member: Member) => {
    const next = !member.is_internal;
    const { error } = await supabase
      .from('profiles')
      .update({ is_internal: next })
      .eq('id', member.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      return;
    }
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, is_internal: next } : m)));
    toast({
      title: next ? 'Marked internal' : 'Marked customer',
      description: member.email,
    });
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (!showInternal && m.is_internal) return false;
      if (!q) return true;
      const name = `${m.first_name || ''} ${m.last_name || ''}`.toLowerCase();
      return name.includes(q) || (m.email || '').toLowerCase().includes(q);
    });
  }, [members, search, showInternal]);

  return (
    <AdminLayout title="Members">
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle>
              {loading ? 'Loading members…' : `${visible.length} member${visible.length === 1 ? '' : 's'}`}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Switch id="show-internal" checked={showInternal} onCheckedChange={setShowInternal} />
              <Label htmlFor="show-internal" className="text-sm text-muted-foreground">
                Show internal/test accounts
              </Label>
            </div>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name or email…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Signed up</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">
                    {[m.first_name, m.last_name].filter(Boolean).join(' ') || '—'}
                    {m.is_internal && (
                      <Badge variant="secondary" className="ml-2">Internal</Badge>
                    )}
                  </TableCell>
                  <TableCell>{m.email || '—'}</TableCell>
                  <TableCell>{m.company_name || '—'}</TableCell>
                  <TableCell>{new Date(m.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{m.credits ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={m.plan === 'Free' ? 'outline' : 'default'}>{m.plan}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => toggleInternal(m)}>
                      {m.is_internal ? <UserCheck className="w-4 h-4" /> : <UserCog className="w-4 h-4" />}
                      {m.is_internal ? 'Mark customer' : 'Mark internal'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminMembers;
