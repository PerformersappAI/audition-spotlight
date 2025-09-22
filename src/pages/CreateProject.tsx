import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Film, MapPin, DollarSign, Users, Clock, Upload, FileText } from "lucide-react";
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
  const [includeCrewCall, setIncludeCrewCall] = useState(false);
  const [selectedCrewPositions, setSelectedCrewPositions] = useState<string[]>([]);
  const [positionBudgets, setPositionBudgets] = useState<{[key: string]: string}>({});

  const [shootStartDate, setShootStartDate] = useState<Date>();
  const [shootEndDate, setShootEndDate] = useState<Date>();

  const [projectData, setProjectData] = useState({
    // Eco Cast Details
    ecoCastTitle: "",
    breakdownTitle: "",
    breakdownLeftHeading: "",
    
    // Production Credits
    executiveProducers: "",
    producers: "",
    castingDirector: "",
    laCastingDirectors: "",
    castingAssociates: "",
    castingAssistants: "",
    
    // Project Details
    description: "",
    storyline: "",
    projectType: "",
    location: "",
    filmingLocation: "",
    
    // Role Information
    roleName: "",
    roleDescription: "",
    ageRange: "",
    genderPreference: "",
    ethnicity: "",
    
    // Audition Details
    auditionInstructions: "",
    performanceNotes: "",
    submissionFormat: "",
    specialInstructions: "",
    
    // Contact & Submission
    contactEmail: "",
    contactPhone: "",
    submissionNotes: "",
    transmissionCost: "",
    
    // Additional
    compensation: "",
    requirements: "",
    unionStatus: "",
    budgetTier: "",
    exclusivityClauses: "",
    covidProtocols: "",
    
    experienceLevel: "",
    equipmentRequired: "",
    postingType: "casting"
  });

  const projectTypes = [
    "Feature Film", "Television Series", "Television Pilot", "Commercial", 
    "Music Video", "Theater", "Web Series", "Documentary", "Short Film", 
    "Student Film", "Streaming Series", "Cable Series", "Network Series"
  ];

  const genderOptions = ["Any", "Male", "Female", "Non-binary", "Male/Female", "Open"];
  
  const ethnicityOptions = [
    "Any Ethnicity", "African American", "Asian", "Caucasian", "Hispanic/Latino", 
    "Middle Eastern", "Native American", "Pacific Islander", "Mixed Race", "Other"
  ];

  const unionStatusOptions = [
    "SAG-AFTRA", "Non-Union", "SAG-AFTRA Eligible", "Skydance/Major Streaming Service"
  ];

  const budgetTiers = [
    "Studio/Major Network", "Cable Network", "Streaming Platform", 
    "Independent Feature", "Low Budget", "Student/No Budget"
  ];

  const submissionFormats = [
    "Self-Tape", "In-Person Audition", "Live Stream Audition", 
    "Taped Sides", "Improvisation", "Cold Read"
  ];

  const crewPositions = [
    'Director',
    'Producer',
    'Cinematographer/DP',
    'Camera Operator',
    'Gaffer',
    'Key Grip',
    'Sound Recordist',
    'Boom Operator',
    'Script Supervisor',
    'Production Designer',
    'Set Decorator',
    'Costume Designer',
    'Makeup Artist',
    'Hair Stylist',
    'Editor',
    'Colorist',
    'Sound Designer',
    'Composer',
    'Production Assistant',
    'Location Manager',
    'Stunt Coordinator',
    'Special Effects',
  ];

  const experienceLevels = [
    'Entry Level',
    'Intermediate',
    'Experienced',
    'Professional',
    'Any Level',
  ];

  const handleInputChange = (field: string, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleCrewPositionChange = (position: string, checked: boolean) => {
    if (checked) {
      setSelectedCrewPositions(prev => [...prev, position]);
    } else {
      setSelectedCrewPositions(prev => prev.filter(p => p !== position));
      setPositionBudgets(prev => {
        const { [position]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleBudgetChange = (position: string, budget: string) => {
    setPositionBudgets(prev => ({ ...prev, [position]: budget }));
  };

  const handleSubmit = async () => {
    if (!projectData.ecoCastTitle || !projectData.breakdownTitle || !projectData.projectType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields: Eco Cast Title, Breakdown Title, and Project Type"
      });
      return;
    }

    if (!projectData.roleName || !projectData.roleDescription) {
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Please fill in role name and description"
      });
      return;
    }

    if (includeCrewCall && selectedCrewPositions.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one crew position"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call with new posting type
    const postingType = includeCrewCall ? 'both' : 'casting';
    
    setTimeout(() => {
      toast({
        title: "Audition Notice Created!",
        description: includeCrewCall 
          ? "Your professional audition notice and crew call has been published successfully"
          : "Your professional audition notice has been published successfully"
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
              Create Professional Audition Notice
            </h1>
            <p className="text-muted-foreground">Create a comprehensive casting breakdown following industry standards</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="project" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="project">Project Info</TabsTrigger>
                <TabsTrigger value="casting">Role Details</TabsTrigger>
                <TabsTrigger value="audition">Audition Info</TabsTrigger>
                <TabsTrigger value="crew" disabled={!includeCrewCall}>Crew</TabsTrigger>
              </TabsList>
              
              <TabsContent value="project" className="space-y-6">
                {/* Eco Cast Invitation Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">Eco Cast Invitation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="eco-cast-title">Eco Cast Title *</Label>
                        <Input
                          id="eco-cast-title"
                          value={projectData.ecoCastTitle}
                          onChange={(e) => handleInputChange("ecoCastTitle", e.target.value)}
                          placeholder="e.g., KIN - 105 Tapes"
                        />
                      </div>

                      <div>
                        <Label htmlFor="breakdown-title">Breakdown Title *</Label>
                        <Input
                          id="breakdown-title"
                          value={projectData.breakdownTitle}
                          onChange={(e) => handleInputChange("breakdownTitle", e.target.value)}
                          placeholder="e.g., KIN Ep. #105 (Role of MAILMAN for South Central Release)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="breakdown-left">Union/Streaming Service</Label>
                        <Select value={projectData.breakdownLeftHeading} onValueChange={(value) => handleInputChange("breakdownLeftHeading", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select union status" />
                          </SelectTrigger>
                          <SelectContent>
                            {unionStatusOptions.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

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
                    </div>
                  </CardContent>
                </Card>

                {/* Production Credits */}
                <Card>
                  <CardHeader>
                    <CardTitle>Production Credits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="executive-producers">Executive Producers</Label>
                      <Textarea
                        id="executive-producers"
                        value={projectData.executiveProducers}
                        onChange={(e) => handleInputChange("executiveProducers", e.target.value)}
                        placeholder="List executive producers separated by commas"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="producers">Producers</Label>
                        <Input
                          id="producers"
                          value={projectData.producers}
                          onChange={(e) => handleInputChange("producers", e.target.value)}
                          placeholder="Producer names"
                        />
                      </div>

                      <div>
                        <Label htmlFor="casting-director">Casting Director *</Label>
                        <Input
                          id="casting-director"
                          value={projectData.castingDirector}
                          onChange={(e) => handleInputChange("castingDirector", e.target.value)}
                          placeholder="Name (Location Casting)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="la-casting">LA Casting Directors</Label>
                        <Input
                          id="la-casting"
                          value={projectData.laCastingDirectors}
                          onChange={(e) => handleInputChange("laCastingDirectors", e.target.value)}
                          placeholder="LA casting director names"
                        />
                      </div>

                      <div>
                        <Label htmlFor="casting-associates">Casting Associates</Label>
                        <Input
                          id="casting-associates"
                          value={projectData.castingAssociates}
                          onChange={(e) => handleInputChange("castingAssociates", e.target.value)}
                          placeholder="Associate names"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="casting-assistants">Casting Assistants</Label>
                      <Input
                        id="casting-assistants"
                        value={projectData.castingAssistants}
                        onChange={(e) => handleInputChange("castingAssistants", e.target.value)}
                        placeholder="Assistant names"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Filming Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Filming Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Shoot Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {shootStartDate ? format(shootStartDate, "PPP") : "Select start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={shootStartDate}
                              onSelect={setShootStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Shoot End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {shootEndDate ? format(shootEndDate, "PPP") : "Select end date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={shootEndDate}
                              onSelect={setShootEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="filming-location">Filming Location</Label>
                      <Input
                        id="filming-location"
                        value={projectData.filmingLocation}
                        onChange={(e) => handleInputChange("filmingLocation", e.target.value)}
                        placeholder="e.g., Austin, TX & Surrounding Areas"
                      />
                    </div>

                    <div>
                      <Label htmlFor="storyline">Storyline</Label>
                      <Textarea
                        id="storyline"
                        value={projectData.storyline}
                        onChange={(e) => handleInputChange("storyline", e.target.value)}
                        placeholder="Detailed storyline description of the project..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="crew-call" 
                        checked={includeCrewCall}
                        onCheckedChange={(checked) => {
                          setIncludeCrewCall(checked as boolean);
                          if (!checked) {
                            setSelectedCrewPositions([]);
                            setPositionBudgets({});
                          }
                        }}
                      />
                      <Label htmlFor="crew-call">Also looking for crew members</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="casting" className="space-y-6">
                {/* Role Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Role Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="role-name">Role Name *</Label>
                      <Input
                        id="role-name"
                        value={projectData.roleName}
                        onChange={(e) => handleInputChange("roleName", e.target.value)}
                        placeholder="e.g., MAILMAN"
                      />
                    </div>

                    <div>
                      <Label htmlFor="role-description">Role Description *</Label>
                      <Textarea
                        id="role-description"
                        value={projectData.roleDescription}
                        onChange={(e) => handleInputChange("roleDescription", e.target.value)}
                        placeholder="Detailed character description including age, ethnicity, personality, and story significance..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="age-range">Age Range</Label>
                        <Input
                          id="age-range"
                          value={projectData.ageRange}
                          onChange={(e) => handleInputChange("ageRange", e.target.value)}
                          placeholder="e.g., 40s-50s"
                        />
                      </div>

                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={projectData.genderPreference} onValueChange={(value) => handleInputChange("genderPreference", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {genderOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="ethnicity">Ethnicity</Label>
                        <Select value={projectData.ethnicity} onValueChange={(value) => handleInputChange("ethnicity", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ethnicity" />
                          </SelectTrigger>
                          <SelectContent>
                            {ethnicityOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="compensation">Compensation</Label>
                      <Input
                        id="compensation"
                        value={projectData.compensation}
                        onChange={(e) => handleInputChange("compensation", e.target.value)}
                        placeholder="e.g., GUEST STAR, Day Rate, Scale + 10%"
                      />
                    </div>

                    <div>
                      <Label htmlFor="requirements">Special Requirements & Skills</Label>
                      <Textarea
                        id="requirements"
                        value={projectData.requirements}
                        onChange={(e) => handleInputChange("requirements", e.target.value)}
                        placeholder="Any specific skills, certifications, or requirements needed for this role..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audition" className="space-y-6">
                {/* Audition Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Audition Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="audition-instructions">Audition Instructions</Label>
                      <Textarea
                        id="audition-instructions"
                        value={projectData.auditionInstructions}
                        onChange={(e) => handleInputChange("auditionInstructions", e.target.value)}
                        placeholder="Detailed instructions for actors (e.g., We would like for you to tape for KIN! The full script is not available at this time...)"
                        className="min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="performance-notes">Performance Notes</Label>
                      <Textarea
                        id="performance-notes"
                        value={projectData.performanceNotes}
                        onChange={(e) => handleInputChange("performanceNotes", e.target.value)}
                        placeholder="General performance guidance (e.g., We are looking for grounded, comedic performances. Feel free to do a second take with improv!)"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="submission-format">Submission Format</Label>
                        <Select value={projectData.submissionFormat} onValueChange={(value) => handleInputChange("submissionFormat", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            {submissionFormats.map(format => (
                              <SelectItem key={format} value={format}>{format}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="transmission-cost">Transmission Cost</Label>
                        <Input
                          id="transmission-cost"
                          value={projectData.transmissionCost}
                          onChange={(e) => handleInputChange("transmissionCost", e.target.value)}
                          placeholder="e.g., FREE - You are an Actors Access Plus subscriber"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="special-instructions">Special Instructions</Label>
                      <Textarea
                        id="special-instructions"
                        value={projectData.specialInstructions}
                        onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                        placeholder="Please also slate with the following information: Name, Height, City you base out of, Current city, Known conflicts during shoot dates..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submission Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={projectData.contactEmail}
                          onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                          placeholder="casting@production.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact-phone">Contact Phone</Label>
                        <Input
                          id="contact-phone"
                          value={projectData.contactPhone}
                          onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                          placeholder="Contact phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="submission-notes">Submission Notes</Label>
                      <Textarea
                        id="submission-notes"
                        value={projectData.submissionNotes}
                        onChange={(e) => handleInputChange("submissionNotes", e.target.value)}
                        placeholder="Additional notes for submissions..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Instructional Media</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Upload sides, scripts, or reference materials
                          </p>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Choose Files
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="crew" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Crew Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="experience-level">Experience Level Required</Label>
                      <Select value={projectData.experienceLevel} onValueChange={(value) => handleInputChange("experienceLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level.toLowerCase().replace(' ', '_')}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="equipment-required">Equipment Requirements</Label>
                      <Textarea
                        id="equipment-required"
                        value={projectData.equipmentRequired}
                        onChange={(e) => handleInputChange("equipmentRequired", e.target.value)}
                        placeholder="Specify if crew needs to bring own equipment, cameras, lighting, etc."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Crew Positions Needed</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {crewPositions.map((position) => (
                          <div key={position} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={position}
                                checked={selectedCrewPositions.includes(position)}
                                onCheckedChange={(checked) => handleCrewPositionChange(position, checked as boolean)}
                              />
                              <Label htmlFor={position} className="text-sm font-medium">
                                {position}
                              </Label>
                            </div>
                            {selectedCrewPositions.includes(position) && (
                              <Input
                                placeholder="Budget range (e.g., $500-1000/day)"
                                value={positionBudgets[position] || ''}
                                onChange={(e) => handleBudgetChange(position, e.target.value)}
                                className="ml-6"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
                  {includeCrewCall && selectedCrewPositions.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {selectedCrewPositions.length} crew position{selectedCrewPositions.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading 
                  ? "Publishing Professional Notice..." 
                  : includeCrewCall 
                    ? "Publish Audition Notice & Crew Call" 
                    : "Publish Professional Audition Notice"
                }
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