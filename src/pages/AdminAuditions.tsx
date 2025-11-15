import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function AdminAuditions() {
  const [auditions, setAuditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreatingSamples, setIsCreatingSamples] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchAuditions();
  }, []);

  const fetchAuditions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("audition_notices")
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            company_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAuditions(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch auditions", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const createSampleAuditions = async () => {
    if (!user) {
      toast.error("You must be logged in to create sample auditions");
      return;
    }

    setIsCreatingSamples(true);
    try {
      const sampleAuditions = [
        {
          user_id: user.id,
          project_name: "The Last Horizon",
          project_type: "Feature Film",
          role_name: "Dr. Sarah Mitchell",
          role_description: "Lead role. A brilliant astrophysicist who discovers a signal from deep space that could change humanity forever. Must convey intelligence, determination, and vulnerability.",
          storyline: "When a groundbreaking discovery threatens to upend everything we know about the universe, one scientist must race against time to decode a message from the stars before it's too late.",
          location: "Los Angeles, CA",
          work_type: "Union",
          rate_of_pay: "$5,000/week",
          submission_deadline: "2025-12-15",
          status: "active",
          union_status: "SAG-AFTRA",
          genre: "Sci-Fi Thriller",
          casting_director: "Jennifer Martinez - Spotlight Casting",
          age_range: "30-45",
          gender_preference: "Female",
          character_background: "PhD in Astrophysics from MIT. Divorced, workaholic, struggling to reconnect with her teenage daughter while pursuing the discovery of a lifetime.",
          materials_required: ["Headshot", "Resume", "Self-Tape"],
          production_company: "Horizon Films LLC"
        },
        {
          user_id: user.id,
          project_name: "Brooklyn Nights",
          project_type: "TV Series",
          role_name: "Marcus Chen",
          role_description: "Recurring role. A street-smart detective with a dark past. Season regular with potential for series lead in future seasons.",
          storyline: "A gritty crime drama following the lives of detectives in Brooklyn as they navigate corruption, family drama, and the pursuit of justice in a city that never sleeps.",
          location: "New York, NY",
          work_type: "Union",
          rate_of_pay: "$3,500/episode",
          submission_deadline: "2025-11-30",
          status: "active",
          union_status: "SAG-AFTRA",
          genre: "Crime Drama",
          casting_director: "David Park - Empire Casting",
          age_range: "35-50",
          gender_preference: "Male",
          character_background: "Former undercover cop who lost his partner in a botched operation. Now working homicide, haunted by his past and fighting to stay clean while taking down the criminals he once had to work alongside.",
          materials_required: ["Headshot", "Resume", "Reel"],
          production_company: "Empire Entertainment"
        }
      ];

      const { error } = await supabase
        .from("audition_notices")
        .insert(sampleAuditions);

      if (error) throw error;

      toast.success("Sample auditions created successfully!");
      fetchAuditions();
    } catch (error: any) {
      toast.error("Failed to create sample auditions", {
        description: error.message
      });
    } finally {
      setIsCreatingSamples(false);
    }
  };

  const updateAuditionStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("audition_notices")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success("Audition status updated");
      fetchAuditions();
    } catch (error: any) {
      toast.error("Failed to update status", {
        description: error.message
      });
    }
  };

  const filteredAuditions = auditions.filter(audition => {
    const matchesSearch = 
      audition.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audition.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (audition.casting_director || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || audition.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    };
    return variants[status] || variants.active;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout title="Audition Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Auditions</h2>
            <p className="text-muted-foreground">Manage all casting notices and auditions</p>
          </div>
          <Button onClick={createSampleAuditions} disabled={isCreatingSamples}>
            {isCreatingSamples ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Sample Auditions
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Auditions</CardTitle>
            <CardDescription>Search and filter audition notices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Search by project, role, or casting director..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Auditions ({filteredAuditions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredAuditions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No auditions found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Casting Director</TableHead>
                      <TableHead>Posted By</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuditions.map((audition) => (
                      <TableRow key={audition.id}>
                        <TableCell className="font-medium">{audition.project_name}</TableCell>
                        <TableCell>{audition.role_name}</TableCell>
                        <TableCell>{audition.project_type}</TableCell>
                        <TableCell>{audition.casting_director || "N/A"}</TableCell>
                        <TableCell>
                          {audition.profiles?.company_name || 
                           `${audition.profiles?.first_name || ""} ${audition.profiles?.last_name || ""}`.trim() ||
                           "Unknown"}
                        </TableCell>
                        <TableCell>{formatDate(audition.submission_deadline)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(audition.status)}>
                            {audition.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/audition/${audition.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Select
                              value={audition.status}
                              onValueChange={(value) => updateAuditionStatus(audition.id, value)}
                            >
                              <SelectTrigger className="w-[120px] h-9">
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
