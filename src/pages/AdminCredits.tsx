import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Minus, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminCredits = () => {
  const [credits, setCredits] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCredits();
    fetchTransactions();
  }, []);

  const fetchCredits = async () => {
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select(`
          *,
          profiles!user_credits_user_id_fkey(user_id, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCredits(data || []);
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch credits data"
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select(`
          *,
          profiles!credit_transactions_user_id_fkey(user_id, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch transactions"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCreditsToUser = async () => {
    if (!selectedUserId || !addAmount || !addDescription) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields"
      });
      return;
    }

    const amount = parseInt(addAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid amount"
      });
      return;
    }

    try {
      // First, find the user by email to get their user_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', selectedUserId)
        .maybeSingle();

      if (profileError || !profileData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not found. Please enter a valid email address."
        });
        return;
      }

      const actualUserId = profileData.user_id;

      // Get current credits
      const { data: currentCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', actualUserId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (currentCredits) {
        // Update existing credits
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({
            total_credits: currentCredits.total_credits + amount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', actualUserId);

        if (updateError) throw updateError;
      } else {
        // Create new credits record
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: actualUserId,
            total_credits: amount,
            used_credits: 0
          });

        if (insertError) throw insertError;
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: actualUserId,
          amount: amount,
          transaction_type: 'purchase',
          description: `Admin adjustment: ${addDescription}`
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
      }

      toast({
        title: "Success",
        description: `Added ${amount} credits to user`
      });

      // Reset form and close dialog
      setAddAmount('');
      setAddDescription('');
      setSelectedUserId('');
      setIsAddDialogOpen(false);

      // Refresh data
      await fetchCredits();
      await fetchTransactions();
    } catch (error) {
      console.error('Error adding credits:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add credits"
      });
    }
  };

  const filteredCredits = credits.filter(credit => {
    const email = credit.profiles?.email || '';
    return email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const stats = {
    totalCredits: credits.reduce((sum, c) => sum + (c.total_credits || 0), 0),
    usedCredits: credits.reduce((sum, c) => sum + (c.used_credits || 0), 0),
    availableCredits: credits.reduce((sum, c) => sum + (c.available_credits || 0), 0),
    totalUsers: credits.length
  };

  return (
    <AdminLayout title="Credits Management">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalCredits}</div>
                  <div className="text-sm text-muted-foreground">Total Credits</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.availableCredits}</div>
                  <div className="text-sm text-muted-foreground">Available Credits</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Minus className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.usedCredits}</div>
                  <div className="text-sm text-muted-foreground">Used Credits</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Users with Credits</div>
            </CardContent>
          </Card>
        </div>

        {/* User Credits Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Credits</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credits
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Total Credits</TableHead>
                    <TableHead>Used Credits</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading credits...
                      </TableCell>
                    </TableRow>
                  ) : filteredCredits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No credits data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCredits.map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell>{credit.profiles?.email || credit.user_id}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{credit.total_credits}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{credit.used_credits}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {credit.available_credits}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(credit.updated_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.profiles?.email || transaction.user_id}</TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.transaction_type === 'purchase' ? 'default' :
                            transaction.transaction_type === 'subscription' ? 'secondary' :
                            transaction.transaction_type === 'usage' ? 'destructive' :
                            transaction.transaction_type === 'refund' ? 'outline' :
                            'default'
                          }>
                            {transaction.transaction_type}
                          </Badge>
                        </TableCell>
                        <TableCell className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{transaction.description || '-'}</TableCell>
                        <TableCell>
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Credits Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Credits to User</DialogTitle>
              <DialogDescription>
                Manually add credits to a user's account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="userId">User Email</Label>
                <Input
                  id="userId"
                  placeholder="user@example.com"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Admin credit adjustment"
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addCreditsToUser}>
                Add Credits
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCredits;
