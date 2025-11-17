import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Film, Calendar, Users, MapPin, Clock, Mail, Phone, FileText, Briefcase, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { GlobalLayout } from "@/components/GlobalLayout";

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [applications, setApplications] = useState([]);
  const [callSheets, setCallSheets] = useState([]);
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

      // Fetch call sheets
      const { data: callSheetsData } = await supabase
        .from('call_sheets')
        .select('*')
        .eq('user_id', user.id)
        .order('shoot_date', { ascending: false });
      setCallSheets(callSheetsData || []);
      
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <GlobalLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center py-12 mb-8">
          <h1 className="text-5xl font-bold text-gold mb-4">
            Welcome back, {userProfile?.first_name}!
          </h1>
          <p className="text-xl text-foreground/80 mb-8">
            {userProfile?.role === 'filmmaker' ? 'Filmmaker Dashboard' : 'Film Festival Dashboard'}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => navigate('/create-project')} className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow transition-all duration-300" size="lg">
              <Plus className="h-5 w-5" />
              {userProfile?.role === 'filmmaker' ? 'New Project' : 'New Festival'}
            </Button>
          </div>
        </div>

        {/* Quick Access Tools - Filmmaker Only */}
        {userProfile?.role === 'filmmaker' && (
          <div className="flex flex-wrap gap-2 p-4 bg-surface rounded-lg border">
            <Button variant="outline" size="sm" onClick={() => navigate('/toolbox')}>
              🎬 Toolbox
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/submit')}>
              📝 Multi-Step Form
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/scene-analysis')}>
              🎭 Scene Analysis
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/upload-auditions')}>
              🎥 Upload Auditions
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/library')}>
              📚 Docs Library
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/consulting')}>
              💼 Consulting
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/calendar')}>
              📅 Calendar
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/call-sheet')}>
              📋 Call Sheet Maker
            </Button>
          </div>
        )}

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
              <CardTitle className="text-sm font-medium">Call Sheets</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{callSheets.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className={`grid w-full ${userProfile?.role === 'filmmaker' ? 'grid-cols-5' : 'grid-cols-3'}`}>
            <TabsTrigger value="projects">
              {userProfile?.role === 'filmmaker' ? 'Projects' : 'My Festivals'}
            </TabsTrigger>
            {userProfile?.role === 'filmmaker' && (
              <>
                <TabsTrigger value="auditions">Auditions</TabsTrigger>
                <TabsTrigger value="crew">Crew</TabsTrigger>
              </>
            )}
            <TabsTrigger value="callsheets">Call Sheets</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-4">
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

          {/* Auditions Tab - Filmmaker Only */}
          {userProfile?.role === 'filmmaker' && (
            <TabsContent value="auditions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Manage Auditions</h3>
                <Button onClick={() => navigate('/upload-auditions')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Audition
                </Button>
              </div>
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Set up auditions for your roles</p>
                  <Button onClick={() => navigate('/upload-auditions')}>
                    Upload Audition Materials
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Crew Tab - Filmmaker Only */}
          {userProfile?.role === 'filmmaker' && (
            <TabsContent value="crew" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Crew Listings</h3>
                <Button onClick={() => navigate('/create-project')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Crew Job
                </Button>
              </div>
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Create crew job listings for your projects</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                    <Button variant="outline" size="sm">Director</Button>
                    <Button variant="outline" size="sm">Cinematographer</Button>
                    <Button variant="outline" size="sm">Sound Engineer</Button>
                    <Button variant="outline" size="sm">Editor</Button>
                    <Button variant="outline" size="sm">Producer</Button>
                    <Button variant="outline" size="sm">Gaffer</Button>
                    <Button variant="outline" size="sm">Script Supervisor</Button>
                    <Button variant="outline" size="sm">Other</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          <TabsContent value="callsheets" className="space-y-4">
            {callSheets.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No call sheets yet</p>
                  <Button onClick={() => navigate("/call-sheet")}>
                    Create Your First Call Sheet
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {callSheets.map((sheet: any) => (
                  <Card key={sheet.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{sheet.project_name}</CardTitle>
                      <CardDescription>{sheet.production_company}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(sheet.shoot_date)}
                      </div>
                      {sheet.day_number && (
                        <div className="text-sm text-muted-foreground">
                          Day {sheet.day_number}
                        </div>
                      )}
                      {sheet.shooting_location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          {sheet.shooting_location}
                        </div>
                      )}
                    </CardContent>
                    <CardContent className="pt-0 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate(`/call-sheet?id=${sheet.id}`)}
                      >
                        View/Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={async () => {
                          try {
                            // Fetch complete call sheet data with all related tables
                            const { data: completeSheet, error } = await supabase
                              .from('call_sheets')
                              .select(`
                                *,
                                call_sheet_scenes(*),
                                call_sheet_cast(*),
                                call_sheet_crew(*),
                                call_sheet_background(*)
                              `)
                              .eq('id', sheet.id)
                              .single();

                            if (error) throw error;

                            const { exportCallSheetToPDF } = await import("@/utils/exportCallSheetToPDF");
                            await exportCallSheetToPDF(
                              completeSheet,
                              completeSheet.call_sheet_scenes || [],
                              completeSheet.call_sheet_cast || [],
                              completeSheet.call_sheet_crew || [],
                              completeSheet.call_sheet_background || []
                            );
                            toast({
                              title: "PDF Downloaded",
                              description: "Your call sheet has been downloaded.",
                            });
                          } catch (error) {
                            console.error('Error downloading PDF:', error);
                            toast({
                              title: "Error",
                              description: "Failed to download call sheet PDF.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        PDF
                      </Button>
                    </CardContent>
                  </Card>
                ))}
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
    </div>
    </GlobalLayout>
  );
};

export default Dashboard;