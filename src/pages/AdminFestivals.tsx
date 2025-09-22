import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Trash2, Eye, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminFestivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      const { data, error } = await supabase
        .from('film_festivals')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFestivals(data || []);
    } catch (error) {
      console.error('Error fetching festivals:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch festivals"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFestivalStatus = async (festivalId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('film_festivals')
        .update({ status })
        .eq('id', festivalId);

      if (error) throw error;

      setFestivals(festivals.map(festival => 
        festival.id === festivalId ? { ...festival, status } : festival
      ));

      toast({
        title: "Success",
        description: `Festival status updated to ${status}`
      });
    } catch (error) {
      console.error('Error updating festival status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update festival status"
      });
    }
  };

  const toggleFeatured = async (festivalId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('film_festivals')
        .update({ featured: !featured })
        .eq('id', festivalId);

      if (error) throw error;

      setFestivals(festivals.map(festival => 
        festival.id === festivalId ? { ...festival, featured: !featured } : festival
      ));

      toast({
        title: "Success",
        description: `Festival ${!featured ? 'featured' : 'unfeatured'}`
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update featured status"
      });
    }
  };

  const filteredFestivals = festivals.filter(festival => {
    const matchesSearch = 
      festival.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || festival.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'closed': return 'bg-destructive/10 text-destructive';
      case 'draft': return 'bg-warning/10 text-warning';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AdminLayout title="Festival Management">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{festivals.length}</div>
              <div className="text-sm text-muted-foreground">Total Festivals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {festivals.filter(f => f.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {festivals.filter(f => f.featured).length}
              </div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {festivals.filter(f => new Date(f.submission_deadline) > new Date()).length}
              </div>
              <div className="text-sm text-muted-foreground">Open for Submissions</div>
            </CardContent>
          </Card>
        </div>

        {/* Festivals Management */}
        <Card>
          <CardHeader>
            <CardTitle>Festival Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search festivals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading festivals...
                      </TableCell>
                    </TableRow>
                  ) : filteredFestivals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No festivals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFestivals.map((festival) => (
                      <TableRow key={festival.id}>
                        <TableCell>
                          <div className="font-medium">{festival.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {festival.description}
                          </div>
                        </TableCell>
                        <TableCell>{festival.location}</TableCell>
                        <TableCell>
                          {festival.profiles?.company_name || 
                           `${festival.profiles?.first_name} ${festival.profiles?.last_name}`}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(festival.start_date)}</div>
                            {festival.end_date && (
                              <div className="text-muted-foreground">
                                to {formatDate(festival.end_date)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(festival.status)}>
                            {festival.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={festival.featured ? "default" : "ghost"}
                            size="sm"
                            onClick={() => toggleFeatured(festival.id, festival.featured)}
                          >
                            <Star className={`w-4 h-4 ${festival.featured ? 'fill-current' : ''}`} />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Select
                              value={festival.status}
                              onValueChange={(status) => updateFestivalStatus(festival.id, status)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFestivals;