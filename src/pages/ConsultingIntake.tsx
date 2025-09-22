import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  MessageCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar, 
  CheckCircle,
  ArrowRight 
} from "lucide-react";

interface ConsultingFormData {
  name: string;
  email: string;
  phone: string;
  project_title: string;
  project_stage: string;
  needs: string[];
  description: string;
  timeline: string;
  budget_range: string;
  urgency: string;
  preferred_contact: string;
  availability: string;
}

const initialFormData: ConsultingFormData = {
  name: "",
  email: "",
  phone: "",
  project_title: "",
  project_stage: "",
  needs: [],
  description: "",
  timeline: "",
  budget_range: "",
  urgency: "normal",
  preferred_contact: "email",
  availability: ""
};

const consultingServices = [
  {
    icon: DollarSign,
    title: "Distribution Strategy",
    description: "Navigate distribution options and maximize your film's reach"
  },
  {
    icon: Calendar,
    title: "Festival Strategy", 
    description: "Strategic festival submissions and premiere planning"
  },
  {
    icon: CheckCircle,
    title: "Deliverables Guidance",
    description: "Ensure you have everything needed for distribution"
  },
  {
    icon: Users,
    title: "Crew & Casting",
    description: "Find the right talent and team for your project"
  }
];

export default function ConsultingIntake() {
  const [formData, setFormData] = useState<ConsultingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = (field: keyof ConsultingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof ConsultingFormData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Consulting Request Submitted!",
        description: "Our producer desk will contact you within 24 hours.",
      });
      setIsSubmitting(false);
      setFormData(initialFormData);
    }, 1000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "destructive";
      case "normal": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Concierge / Consulting</h1>
          <p className="text-muted-foreground">
            Get personalized guidance from our experienced producer desk
          </p>
        </div>

        {/* Services Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {consultingServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Intake Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Consulting Intake Form
            </CardTitle>
            <CardDescription>
              Tell us about your project and how we can help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <Separator />

              {/* Project Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Project Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project_title">Project Title</Label>
                    <Input
                      id="project_title"
                      value={formData.project_title}
                      onChange={(e) => updateFormData("project_title", e.target.value)}
                      placeholder="Name of your project"
                    />
                  </div>
                  <div>
                    <Label>Project Stage</Label>
                    <Select value={formData.project_stage} onValueChange={(value) => updateFormData("project_stage", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="pre-production">Pre-Production</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="post-production">Post-Production</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="distribution">Distribution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Consulting Needs */}
              <div>
                <h3 className="text-lg font-semibold mb-4">What do you need help with? *</h3>
                <div className="flex flex-wrap gap-2">
                  {["distribution", "festivals", "deliverables", "crew", "casting", "budget", "EPK", "marketing", "post-production", "legal"].map((need) => (
                    <Badge
                      key={need}
                      variant={formData.needs.includes(need) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleArrayToggle("needs", need)}
                    >
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Project Description */}
              <div>
                <Label htmlFor="description">Project Description & Specific Needs *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Describe your project and the specific challenges or guidance you need..."
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>

              <Separator />

              {/* Timeline & Urgency */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Timeline & Priority</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeline">Project Timeline</Label>
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => updateFormData("timeline", e.target.value)}
                      placeholder="e.g., Shooting in 3 months, Festival deadline in 6 weeks"
                    />
                  </div>
                  <div>
                    <Label>Urgency Level</Label>
                    <Select value={formData.urgency} onValueChange={(value) => updateFormData("urgency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General guidance</SelectItem>
                        <SelectItem value="normal">Normal - Project planning</SelectItem>
                        <SelectItem value="high">High - Urgent deadline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <Label>Consulting Budget Range (Optional)</Label>
                <Select value={formData.budget_range} onValueChange={(value) => updateFormData("budget_range", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-500">Under $500</SelectItem>
                    <SelectItem value="500-1500">$500 - $1,500</SelectItem>
                    <SelectItem value="1500-5000">$1,500 - $5,000</SelectItem>
                    <SelectItem value="5000-plus">$5,000+</SelectItem>
                    <SelectItem value="discuss">Let's discuss</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Contact Preferences */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Preferred Contact Method</Label>
                    <Select value={formData.preferred_contact} onValueChange={(value) => updateFormData("preferred_contact", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="in-person">In-Person (if local)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Input
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => updateFormData("availability", e.target.value)}
                      placeholder="Best times to reach you"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Our producer desk will respond within 24 hours
                    </span>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || formData.needs.length === 0}
                    size="lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* What to Expect */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">What to Expect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Initial Response</h4>
                  <p className="text-muted-foreground">We'll review your request and respond within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Consultation Call</h4>
                  <p className="text-muted-foreground">Schedule a call to discuss your specific needs in detail</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Personalized Plan</h4>
                  <p className="text-muted-foreground">Receive tailored recommendations and next steps</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}