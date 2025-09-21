import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Film, MapPin, DollarSign, Users, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { format } from "date-fns";

const CreateProject = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [auditionDate, setAuditionDate] = useState<Date>();
  const [deadlineDate, setDeadlineDate] = useState<Date>();

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    projectType: "",
    castingDirector: "",
    productionCompany: "",
    location: "",
    ageRange: "",
    genderPreference: "",
    compensation: "",
    contactEmail: "",
    contactPhone: "",
    requirements: ""
  });

  const projectTypes = [
    "Film", "Television", "Commercial", "Music Video", "Theater", 
    "Web Series", "Documentary", "Short Film", "Student Film"
  ];

  const genderOptions = ["Any", "Male", "Female", "Non-binary", "Male/Female", "Open"];

  const handleInputChange = (field: string, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!projectData.title || !projectData.description || !projectData.projectType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Project Created!",
        description: "Your casting call has been published successfully"
      });
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Layout userRole={userProfile?.role?.toUpperCase()}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Film className="h-8 w-8" />
              Create New Project
            </h1>
            <p className="text-muted-foreground">Post a new casting call for your project</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={projectData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={projectData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your project, the roles you're casting for, and what you're looking for in actors..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-type">Project Type *</Label>
                    <Select value={projectData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={projectData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Casting Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age-range">Age Range</Label>
                    <Input
                      id="age-range"
                      value={projectData.ageRange}
                      onChange={(e) => handleInputChange("ageRange", e.target.value)}
                      placeholder="e.g., 25-35"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={projectData.genderPreference} onValueChange={(value) => handleInputChange("genderPreference", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="requirements">Special Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={projectData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    placeholder="Any specific skills, experience, or requirements for actors..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="casting-director">Casting Director</Label>
                    <Input
                      id="casting-director"
                      value={projectData.castingDirector}
                      onChange={(e) => handleInputChange("castingDirector", e.target.value)}
                      placeholder="Name of casting director"
                    />
                  </div>

                  <div>
                    <Label htmlFor="production-company">Production Company</Label>
                    <Input
                      id="production-company"
                      value={projectData.productionCompany}
                      onChange={(e) => handleInputChange("productionCompany", e.target.value)}
                      placeholder="Company or organization name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="compensation">Compensation</Label>
                  <Input
                    id="compensation"
                    value={projectData.compensation}
                    onChange={(e) => handleInputChange("compensation", e.target.value)}
                    placeholder="e.g., Paid, Copy/Credit, Deferred, $500/day"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Audition Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {auditionDate ? format(auditionDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={auditionDate}
                        onSelect={setAuditionDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Application Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadlineDate ? format(deadlineDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deadlineDate}
                        onSelect={setDeadlineDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={projectData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="casting@yourproject.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-phone">Phone (Optional)</Label>
                  <Input
                    id="contact-phone"
                    value={projectData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4" />
                    {projectData.projectType || "Project Type"}
                  </div>
                  {projectData.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {projectData.location}
                    </div>
                  )}
                  {projectData.compensation && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {projectData.compensation}
                    </div>
                  )}
                  {auditionDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {format(auditionDate, "PPP")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading ? "Creating Project..." : "Publish Casting Call"}
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProject;