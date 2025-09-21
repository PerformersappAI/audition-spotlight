import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Film, Calendar, Users, MapPin, Clock, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";

const Dashboard = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchUserContent();
  }, [user, navigate]);

  const fetchUserContent = async () => {
    if (!user) return;
    
    try {
      // Fetch projects if filmmaker
      if (userProfile?.role === 'filmmaker') {
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setProjects(projectsData || []);
      }

      // Fetch festivals if festival organizer
      if (userProfile?.role === 'film_festival') {
        const { data: festivalsData } = await supabase
          .from('film_festivals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setFestivals(festivalsData || []);
      }

      // Fetch applications
      const { data: applicationsData } = await supabase
        .from('applications')
        .select(`
          *,
          projects (title, project_type),
          film_festivals (name)
        `)
        .eq('applicant_user_id', user.id)
        .order('applied_at', { ascending: false });
      setApplications(applicationsData || []);
      
    } catch (error) {
      console.error('Error fetching user content:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'closed': return 'bg-red-500';
      case 'draft': return 'bg-yellow-500';
      case 'pending': return 'bg-blue-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Layout userRole={userProfile?.role?.toUpperCase()}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={userProfile?.role?.toUpperCase()}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {userProfile?.first_name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              {userProfile?.role === 'filmmaker' ? 'Filmmaker Dashboard' : 'Film Festival Dashboard'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/create-project')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {userProfile?.role === 'filmmaker' ? 'New Project' : 'New Festival'}
            </Button>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userProfile?.role === 'filmmaker' ? 'Active Projects' : 'Active Festivals'}
              </CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userProfile?.role === 'filmmaker' 
                  ? projects.filter((p: any) => p.status === 'active').length
                  : festivals.filter((f: any) => f.status === 'active').length
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userProfile?.role === 'filmmaker' ? projects.length : festivals.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings">
              {userProfile?.role === 'filmmaker' ? 'My Projects' : 'My Festivals'}
            </TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings" className="space-y-4">
            {userProfile?.role === 'filmmaker' ? (
              // Filmmaker Projects
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No projects yet</p>
                      <Button onClick={() => navigate('/create-project')}>
                        Create Your First Project
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  projects.map((project: any) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{project.title}</CardTitle>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{project.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Film className="h-4 w-4" />
                            {project.project_type}
                          </div>
                          {project.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {project.location}
                            </div>
                          )}
                          {project.audition_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(project.audition_date)}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Created {formatDate(project.created_at)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              // Festival Organizer Festivals
              <div className="space-y-4">
                {festivals.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No festivals yet</p>
                      <Button onClick={() => navigate('/create-festival')}>
                        Create Your First Festival
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  festivals.map((festival: any) => (
                    <Card key={festival.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{festival.name}</CardTitle>
                          <Badge className={getStatusColor(festival.status)}>
                            {festival.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{festival.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {festival.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(festival.start_date)}
                          </div>
                          {festival.submission_deadline && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Deadline: {formatDate(festival.submission_deadline)}
                            </div>
                          )}
                          {festival.categories && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {festival.categories.length} categories
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No applications yet</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((application: any) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {application.projects?.title || application.film_festivals?.name}
                      </CardTitle>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Applied {formatDate(application.applied_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        {application.projects ? 'Project' : 'Film Festival'}
                      </div>
                    </div>
                    {application.notes && (
                      <p className="mt-2 text-sm">{application.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;