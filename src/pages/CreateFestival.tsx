import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trophy, MapPin, DollarSign, Users, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { format } from "date-fns";

const CreateFestival = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [submissionDeadline, setSubmissionDeadline] = useState<Date>();

  const [festivalData, setFestivalData] = useState({
    name: "",
    description: "",
    location: "",
    website: "",
    submissionFee: "",
    categories: [] as string[],
    requirements: "",
    contactEmail: "",
    contactPhone: ""
  });

  const availableCategories = [
    "Narrative Feature", "Documentary Feature", "Short Film", "Animation",
    "Music Video", "Experimental", "Student Film", "International", 
    "Local/Regional", "Comedy", "Drama", "Horror", "Sci-Fi"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFestivalData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    setFestivalData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async () => {
    if (!festivalData.name || !festivalData.description || !festivalData.location) {
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
        title: "Festival Created!",
        description: "Your festival has been published successfully"
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
              <Trophy className="h-8 w-8" />
              Create New Festival
            </h1>
            <p className="text-muted-foreground">Launch a new film festival and start accepting submissions</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Festival Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Festival Name *</Label>
                  <Input
                    id="name"
                    value={festivalData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter festival name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={festivalData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your festival, its mission, what makes it unique, and what you're looking for in submissions..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={festivalData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="City, State/Country"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Festival Website</Label>
                    <Input
                      id="website"
                      value={festivalData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://yourfestival.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableCategories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={category}
                        checked={festivalData.categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={category} className="text-sm cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="submission-fee">Submission Fee</Label>
                  <Input
                    id="submission-fee"
                    value={festivalData.submissionFee}
                    onChange={(e) => handleInputChange("submissionFee", e.target.value)}
                    placeholder="e.g., Free, $25, $50 Early Bird / $75 Regular"
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Submission Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={festivalData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    placeholder="Specify technical requirements, file formats, runtime limits, premiere status requirements, etc..."
                    className="min-h-[100px]"
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
                  <Label>Festival Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Festival End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Submission Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {submissionDeadline ? format(submissionDeadline, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={submissionDeadline}
                        onSelect={setSubmissionDeadline}
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
                    value={festivalData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="submissions@yourfestival.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-phone">Phone (Optional)</Label>
                  <Input
                    id="contact-phone"
                    value={festivalData.contactPhone}
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
                    <Trophy className="h-4 w-4" />
                    Film Festival
                  </div>
                  {festivalData.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {festivalData.location}
                    </div>
                  )}
                  {festivalData.submissionFee && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {festivalData.submissionFee}
                    </div>
                  )}
                  {festivalData.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </div>
                  )}
                  {festivalData.categories.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {festivalData.categories.length} categories
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading ? "Creating Festival..." : "Publish Festival"}
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

export default CreateFestival;