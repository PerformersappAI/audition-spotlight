import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Search, TrendingDown, Activity, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Profile {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

interface Tx {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
}

interface UserSummary {
  user_id: string;
  email: string;
  name: string;
  used_this_month: number;
  used_all_time: number;
  last_used: string | null;
  tx_count: number;
}

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const AdminCreditUsage = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>(monthKey(new Date()));
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: txs } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('transaction_type', 'usage')
        .order('created_at', { ascending: false })
        .limit(1000);

      const txList = (txs || []) as Tx[];
      setTransactions(txList);

      const userIds = Array.from(new Set(txList.map((t) => t.user_id)));
      if (userIds.length) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('user_id, email, first_name, last_name')
          .in('user_id', userIds);
        const map: Record<string, Profile> = {};
        (profs || []).forEach((p: any) => { map[p.user_id] = p; });
        setProfiles(map);
      }
      setLoading(false);
    })();
  }, []);

  const months = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(monthKey(new Date(t.created_at))));
    set.add(monthKey(new Date()));
    return Array.from(set).sort().reverse();
  }, [transactions]);

  const summaries = useMemo<UserSummary[]>(() => {
    const map = new Map<string, UserSummary>();
    transactions.forEach((t) => {
      const credits = Math.abs(t.amount);
      const p = profiles[t.user_id];
      const name = p ? `${p.first_name || ''} ${p.last_name || ''}`.trim() : '';
      const existing = map.get(t.user_id) || {
        user_id: t.user_id,
        email: p?.email || 'Unknown',
        name: name || '—',
        used_this_month: 0,
        used_all_time: 0,
        last_used: null,
        tx_count: 0,
      };
      existing.used_all_time += credits;
      if (monthKey(new Date(t.created_at)) === selectedMonth) {
        existing.used_this_month += credits;
      }
      existing.tx_count += 1;
      if (!existing.last_used || new Date(t.created_at) > new Date(existing.last_used)) {
        existing.last_used = t.created_at;
      }
      map.set(t.user_id, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.used_this_month - a.used_this_month);
  }, [transactions, profiles, selectedMonth]);

  const filtered = summaries.filter((s) =>
    !search ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTx = transactions.filter((t) => {
    if (!search) return true;
    const p = profiles[t.user_id];
    const hay = `${p?.email || ''} ${p?.first_name || ''} ${p?.last_name || ''}`.toLowerCase();
    return hay.includes(search.toLowerCase());
  });

  const totalThisMonth = summaries.reduce((s, u) => s + u.used_this_month, 0);
  const activeUsers = summaries.filter((s) => s.used_this_month > 0).length;

  return (
    <AdminLayout title="Credit Usage">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> Credits used ({selectedMonth})
              </CardTitle>
            </CardHeader>
            <CardContent><div className="text-3xl font-bold">{totalThisMonth}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" /> Active spenders
              </CardTitle>
            </CardHeader>
            <CardContent><div className="text-3xl font-bold">{activeUsers}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total usage events</CardTitle>
            </CardHeader>
            <CardContent><div className="text-3xl font-bold">{transactions.length}</div></CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or name"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {months.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="by-user">
          <TabsList>
            <TabsTrigger value="by-user">By user</TabsTrigger>
            <TabsTrigger value="activity">Activity log</TabsTrigger>
          </TabsList>

          <TabsContent value="by-user">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Used in {selectedMonth}</TableHead>
                      <TableHead className="text-right">Used all-time</TableHead>
                      <TableHead className="text-right">Events</TableHead>
                      <TableHead>Last used</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
                    ) : filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No usage yet</TableCell></TableRow>
                    ) : filtered.map((u) => (
                      <TableRow key={u.user_id} className="cursor-pointer" onClick={() => setSelectedUser(u)}>
                        <TableCell>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{u.used_this_month}</TableCell>
                        <TableCell className="text-right">{u.used_all_time}</TableCell>
                        <TableCell className="text-right">{u.tx_count}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {u.last_used ? format(new Date(u.last_used), 'MMM d, yyyy p') : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }}>
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Feature</TableHead>
                      <TableHead className="text-right">Credits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
                    ) : filteredTx.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No activity</TableCell></TableRow>
                    ) : filteredTx.slice(0, 500).map((t) => {
                      const p = profiles[t.user_id];
                      return (
                        <TableRow key={t.id}>
                          <TableCell className="text-sm">{format(new Date(t.created_at), 'MMM d, yyyy p')}</TableCell>
                          <TableCell>
                            <div className="text-sm">{p?.email || 'Unknown'}</div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{t.description || '—'}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{Math.abs(t.amount)}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminCreditUsage;
