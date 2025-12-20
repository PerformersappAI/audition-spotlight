import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { 
  Users, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign,
  Plus,
  Trash2,
  Send,
  Briefcase
} from "lucide-react";

interface CrewRole {
  id: string;
  role_title: string;
  department: string;
  num_positions: number;
  role_paid_or_unpaid: string;
  role_rate: string;
  role_start_date: string;
  role_end_date: string;
  requirements: string;
  gear_required: string;
  union_required: boolean;
}

interface CrewCallFormData {
  project_title: string;
  project_type: string;
  production_company: string;
  director_name: string;
  producer_name: string;
  logline: string;
  union_status: string;
  paid_or_unpaid: string;
  day_rate_range: string;
  benefits: string[];
  primary_location_city: string;
  primary_location_state_region: string;
  primary_location_country: string;
  is_remote_possible: boolean;
  shoot_dates: string;
  call_deadline: string;
  crew_roles: CrewRole[];
  application_instructions: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website_or_social_link: string;
  publish_on_public_board: boolean;
  allow_contact_via_platform: boolean;
}

const createEmptyRole = (): CrewRole => ({
  id: crypto.randomUUID(),
  role_title: "",
  department: "",
  num_positions: 1,
  role_paid_or_unpaid: "Paid",
  role_rate: "",
  role_start_date: "",
  role_end_date: "",
  requirements: "",
  gear_required: "",
  union_required: false,
});

const initialFormData: CrewCallFormData = {
  project_title: "",
  project_type: "",
  production_company: "",
  director_name: "",
  producer_name: "",
  logline: "",
  union_status: "",
  paid_or_unpaid: "",
  day_rate_range: "",
  benefits: [],
  primary_location_city: "",
  primary_location_state_region: "",
  primary_location_country: "USA",
  is_remote_possible: false,
  shoot_dates: "",
  call_deadline: "",
  crew_roles: [createEmptyRole()],
  application_instructions: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  website_or_social_link: "",
  publish_on_public_board: true,
  allow_contact_via_platform: true,
};

const projectTypes = [
  "Feature Film",
  "Short Film",
  "Vertical Series",
  "Web Series",
  "Commercial",
  "Music Video",
  "Documentary",
  "Other"
];

const unionStatuses = [
  "Non-Union",
  "SAG-AFTRA",
  "DGA",
  "IATSE",
  "Mixed / Other"
];

const compensationTypes = ["Paid", "Low-Pay", "Deferred", "Volunteer"];

const benefitOptions = [
  "Copy",
  "Credit",
  "IMDb Credit",
  "Meals",
  "Lodging",
  "Travel Stipend"
];

const departments = [
  "Camera",
  "Grip & Electric",
  "Sound",
  "Production",
  "Assistant Director",
  "Art / Production Design",
  "Wardrobe",
  "Hair & Makeup",
  "Post-Production",
  "Other"
];

export default function CrewHire() {
  const [formData, setFormData] = useState<CrewCallFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = <K extends keyof CrewCallFormData>(field: K, value: CrewCallFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBenefitToggle = (benefit: string) => {
    const currentBenefits = formData.benefits;
    const newBenefits = currentBenefits.includes(benefit)
      ? currentBenefits.filter(b => b !== benefit)
      : [...currentBenefits, benefit];
    updateFormData("benefits", newBenefits);
  };

  const addCrewRole = () => {
    if (formData.crew_roles.length >= 50) {
      toast({
        title: "Maximum roles reached",
        description: "You can add up to 50 crew roles per call.",
        variant: "destructive"
      });
      return;
    }
    updateFormData("crew_roles", [...formData.crew_roles, createEmptyRole()]);
  };

  const removeCrewRole = (id: string) => {
    if (formData.crew_roles.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "At least one crew role is required.",
        variant: "destructive"
      });
      return;
    }
    updateFormData("crew_roles", formData.crew_roles.filter(role => role.id !== id));
  };

  const updateCrewRole = (id: string, field: keyof CrewRole, value: any) => {
    updateFormData("crew_roles", formData.crew_roles.map(role => 
      role.id === id ? { ...role, [field]: value } : role
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.project_title.trim()) {
      toast({ title: "Project title is required", variant: "destructive" });
      return;
    }
    if (!formData.director_name.trim()) {
      toast({ title: "Director name is required", variant: "destructive" });
      return;
    }
    if (!formData.paid_or_unpaid) {
      toast({ title: "Compensation type is required", variant: "destructive" });
      return;
    }
    if (!formData.contact_name.trim() || !formData.contact_email.trim()) {
      toast({ title: "Contact name and email are required", variant: "destructive" });
      return;
    }
    if (!formData.application_instructions.trim()) {
      toast({ title: "Application instructions are required", variant: "destructive" });
      return;
    }

    const hasValidRole = formData.crew_roles.some(role => role.role_title.trim());
    if (!hasValidRole) {
      toast({ title: "At least one crew role with a title is required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Crew Call Posted!",
        description: "Your crew call has been submitted successfully.",
      });
      setIsSubmitting(false);
      setFormData(initialFormData);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">Crew Hire Tool</h1>
          </div>
          <p className="text-muted-foreground">
            Post a crew call to find talented crew members for your production
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Project Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Project Information
              </CardTitle>
              <CardDescription>Tell us about your production</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project_title">Project Title *</Label>
                  <Input
                    id="project_title"
                    value={formData.project_title}
                    onChange={(e) => updateFormData("project_title", e.target.value)}
                    placeholder="Enter project title"
                    required
                  />
                </div>
                <div>
                  <Label>Project Type *</Label>
                  <Select 
                    value={formData.project_type} 
                    onValueChange={(value) => updateFormData("project_type", value)}
                  >
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

              <div>
                <Label htmlFor="production_company">Production Company</Label>
                <Input
                  id="production_company"
                  value={formData.production_company}
                  onChange={(e) => updateFormData("production_company", e.target.value)}
                  placeholder="Enter production company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="director_name">Director Name *</Label>
                  <Input
                    id="director_name"
                    value={formData.director_name}
                    onChange={(e) => updateFormData("director_name", e.target.value)}
                    placeholder="Enter director name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="producer_name">Producer / Line Producer</Label>
                  <Input
                    id="producer_name"
                    value={formData.producer_name}
                    onChange={(e) => updateFormData("producer_name", e.target.value)}
                    placeholder="Enter producer name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logline">Logline / Project Summary</Label>
                <Textarea
                  id="logline"
                  value={formData.logline}
                  onChange={(e) => updateFormData("logline", e.target.value)}
                  placeholder="Brief description of your project..."
                  className="min-h-[80px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Union & Compensation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Union & Compensation
              </CardTitle>
              <CardDescription>Payment and union details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Union Status</Label>
                  <Select 
                    value={formData.union_status} 
                    onValueChange={(value) => updateFormData("union_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select union status" />
                    </SelectTrigger>
                    <SelectContent>
                      {unionStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Compensation Type *</Label>
                  <Select 
                    value={formData.paid_or_unpaid} 
                    onValueChange={(value) => updateFormData("paid_or_unpaid", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select compensation" />
                    </SelectTrigger>
                    <SelectContent>
                      {compensationTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="day_rate_range">Day Rate / Pay Range (overall)</Label>
                <Input
                  id="day_rate_range"
                  value={formData.day_rate_range}
                  onChange={(e) => updateFormData("day_rate_range", e.target.value)}
                  placeholder="$250–$350/12, scale, etc."
                />
              </div>

              <div>
                <Label className="mb-3 block">Additional Benefits</Label>
                <div className="flex flex-wrap gap-2">
                  {benefitOptions.map(benefit => (
                    <Badge
                      key={benefit}
                      variant={formData.benefits.includes(benefit) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleBenefitToggle(benefit)}
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Location & Schedule */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Schedule
              </CardTitle>
              <CardDescription>Where and when you'll be shooting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary_location_city">City *</Label>
                  <Input
                    id="primary_location_city"
                    value={formData.primary_location_city}
                    onChange={(e) => updateFormData("primary_location_city", e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="primary_location_state_region">State / Region *</Label>
                  <Input
                    id="primary_location_state_region"
                    value={formData.primary_location_state_region}
                    onChange={(e) => updateFormData("primary_location_state_region", e.target.value)}
                    placeholder="State or region"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="primary_location_country">Country *</Label>
                  <Input
                    id="primary_location_country"
                    value={formData.primary_location_country}
                    onChange={(e) => updateFormData("primary_location_country", e.target.value)}
                    placeholder="Country"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_remote_possible">Remote / Hybrid Work Possible?</Label>
                <Switch
                  id="is_remote_possible"
                  checked={formData.is_remote_possible}
                  onCheckedChange={(checked) => updateFormData("is_remote_possible", checked)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shoot_dates">Shoot Dates *</Label>
                  <Input
                    id="shoot_dates"
                    value={formData.shoot_dates}
                    onChange={(e) => updateFormData("shoot_dates", e.target.value)}
                    placeholder="e.g. October 10–14, 2026"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="call_deadline">Application Deadline</Label>
                  <Input
                    id="call_deadline"
                    type="date"
                    value={formData.call_deadline}
                    onChange={(e) => updateFormData("call_deadline", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Crew Roles (Repeater) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Crew Roles Needed
              </CardTitle>
              <CardDescription>Add the positions you're hiring for (1-50 roles)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.crew_roles.map((role, index) => (
                <div key={role.id} className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Role #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCrewRole(role.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Role Title *</Label>
                      <Input
                        value={role.role_title}
                        onChange={(e) => updateCrewRole(role.id, "role_title", e.target.value)}
                        placeholder="e.g. 1st AD, Gaffer, Sound Mixer"
                      />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Select 
                        value={role.department} 
                        onValueChange={(value) => updateCrewRole(role.id, "department", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Number of Positions *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={role.num_positions}
                        onChange={(e) => updateCrewRole(role.id, "num_positions", parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label>Compensation *</Label>
                      <Select 
                        value={role.role_paid_or_unpaid} 
                        onValueChange={(value) => updateCrewRole(role.id, "role_paid_or_unpaid", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {compensationTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Rate / Pay</Label>
                      <Input
                        value={role.role_rate}
                        onChange={(e) => updateCrewRole(role.id, "role_rate", e.target.value)}
                        placeholder="$300/day, $500 flat, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={role.role_start_date}
                        onChange={(e) => updateCrewRole(role.id, "role_start_date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={role.role_end_date}
                        onChange={(e) => updateCrewRole(role.id, "role_end_date", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Role Requirements</Label>
                    <Textarea
                      value={role.requirements}
                      onChange={(e) => updateCrewRole(role.id, "requirements", e.target.value)}
                      placeholder="Experience, software, gear, availability, etc."
                      className="min-h-[60px] resize-none"
                    />
                  </div>

                  <div>
                    <Label>Gear Required</Label>
                    <Input
                      value={role.gear_required}
                      onChange={(e) => updateCrewRole(role.id, "gear_required", e.target.value)}
                      placeholder="Camera package, sound kit, G&E gear, etc."
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor={`union_${role.id}`}>Union Crew Required for this Role?</Label>
                    <Switch
                      id={`union_${role.id}`}
                      checked={role.union_required}
                      onCheckedChange={(checked) => updateCrewRole(role.id, "union_required", checked)}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addCrewRole}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Role
              </Button>
            </CardContent>
          </Card>

          {/* Section 5: Application Instructions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Application & Contact
              </CardTitle>
              <CardDescription>How crew members should apply</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="application_instructions">How to Apply *</Label>
                <Textarea
                  id="application_instructions"
                  value={formData.application_instructions}
                  onChange={(e) => updateFormData("application_instructions", e.target.value)}
                  placeholder="Email resume + reel to..., include position in subject line, etc."
                  className="min-h-[100px] resize-none"
                  required
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_name">Contact Name *</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => updateFormData("contact_name", e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => updateFormData("contact_email", e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => updateFormData("contact_phone", e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="website_or_social_link">Website or Social Link</Label>
                  <Input
                    id="website_or_social_link"
                    value={formData.website_or_social_link}
                    onChange={(e) => updateFormData("website_or_social_link", e.target.value)}
                    placeholder="Production site, IG handle, etc."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Publishing Options */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
              <CardDescription>Control visibility and contact preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="publish_on_public_board">Publish on Public Board</Label>
                  <p className="text-sm text-muted-foreground">Make this crew call visible to all users</p>
                </div>
                <Switch
                  id="publish_on_public_board"
                  checked={formData.publish_on_public_board}
                  onCheckedChange={(checked) => updateFormData("publish_on_public_board", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow_contact_via_platform">Allow Contact via Platform</Label>
                  <p className="text-sm text-muted-foreground">Let crew members message you through Filmmaker AI</p>
                </div>
                <Switch
                  id="allow_contact_via_platform"
                  checked={formData.allow_contact_via_platform}
                  onCheckedChange={(checked) => updateFormData("allow_contact_via_platform", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Crew Call"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
