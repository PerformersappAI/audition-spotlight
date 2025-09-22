import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Upload, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  // Project Basics
  title: string;
  logline: string;
  format: string;
  status: string;
  runtime: string;
  genres: string[];
  language: string;
  
  // Scene Analyzer
  scene_text: string;
  intent_notes: string;
  
  // Characters
  character_cards: Array<{
    name: string;
    age_range: string;
    bio: string;
    conflicts: string;
    skills: string;
    demographics_optional: string;
    pages_count: string;
  }>;
  
  // Distribution & Festivals
  goal: string[];
  assets: string[];
  territories: string[];
  fee_budget_range: string;
  timeline_window: string;
  
  // Crew & Casting
  post_need: boolean;
  role_type: string;
  role_title: string;
  brief: string;
  paid: boolean;
  rate: string;
  location: string;
  dates: string;
  contact_method: string;
  deadline: string;
  
  // Library Access
  email: string;
  create_password: string;
  
  // Concierge
  needs: string[];
  notes: string;
  contact: string;
  urgency: string;
}

const initialFormData: FormData = {
  title: "",
  logline: "",
  format: "",
  status: "",
  runtime: "",
  genres: [],
  language: "",
  scene_text: "",
  intent_notes: "",
  character_cards: [{ name: "", age_range: "", bio: "", conflicts: "", skills: "", demographics_optional: "", pages_count: "" }],
  goal: [],
  assets: [],
  territories: [],
  fee_budget_range: "",
  timeline_window: "",
  post_need: false,
  role_type: "",
  role_title: "",
  brief: "",
  paid: false,
  rate: "",
  location: "",
  dates: "",
  contact_method: "",
  deadline: "",
  email: "",
  create_password: "",
  needs: [],
  notes: "",
  contact: "",
  urgency: ""
};

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { toast } = useToast();
  
  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    "Project Basics",
    "Scene Analyzer",
    "Characters", 
    "Distribution & Festivals",
    "Crew & Casting Board",
    "Library Access",
    "Concierge"
  ];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  const addCharacterCard = () => {
    setFormData(prev => ({
      ...prev,
      character_cards: [...prev.character_cards, { 
        name: "", age_range: "", bio: "", conflicts: "", skills: "", demographics_optional: "", pages_count: "" 
      }]
    }));
  };

  const removeCharacterCard = (index: number) => {
    setFormData(prev => ({
      ...prev,
      character_cards: prev.character_cards.filter((_, i) => i !== index)
    }));
  };

  const updateCharacterCard = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      character_cards: prev.character_cards.map((card, i) => 
        i === index ? { ...card, [field]: value } : card
      )
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Form Submitted!",
      description: "Your filmmaker intake has been submitted successfully.",
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  placeholder="Enter your project title"
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => updateFormData("language", e.target.value)}
                  placeholder="Primary language"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="logline">Logline (240 characters max) *</Label>
              <Textarea
                id="logline"
                value={formData.logline}
                onChange={(e) => updateFormData("logline", e.target.value)}
                placeholder="One-sentence description of your project"
                maxLength={240}
                className="resize-none"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {formData.logline.length}/240 characters
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Format *</Label>
                <Select value={formData.format} onValueChange={(value) => updateFormData("format", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short Film</SelectItem>
                    <SelectItem value="feature">Feature Film</SelectItem>
                    <SelectItem value="series">Series</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Status *</Label>
                <Select value={formData.status} onValueChange={(value) => updateFormData("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="post">Post-Production</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="runtime">Runtime (minutes)</Label>
                <Input
                  id="runtime"
                  type="number"
                  value={formData.runtime}
                  onChange={(e) => updateFormData("runtime", e.target.value)}
                  placeholder="Duration"
                />
              </div>
            </div>

            <div>
              <Label>Genres</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["drama", "comedy", "thriller", "horror", "doc", "action"].map((genre) => (
                  <Badge
                    key={genre}
                    variant={formData.genres.includes(genre) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleArrayToggle("genres", genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Scene Analyzer (Optional)</h3>
              <p className="text-muted-foreground">Upload a scene or paste text for AI-powered analysis</p>
            </div>
            
            <div>
              <Label htmlFor="scene_text">Scene Text or Upload File</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Button variant="outline">Upload File (.pdf, .txt)</Button>
                  <p className="text-sm text-muted-foreground">or paste your scene text below</p>
                </div>
              </div>
              <Textarea
                id="scene_text"
                value={formData.scene_text}
                onChange={(e) => updateFormData("scene_text", e.target.value)}
                placeholder="Paste your scene text here..."
                className="mt-4 min-h-[200px]"
              />
            </div>
            
            <div>
              <Label htmlFor="intent_notes">Intent Notes</Label>
              <Textarea
                id="intent_notes"
                value={formData.intent_notes}
                onChange={(e) => updateFormData("intent_notes", e.target.value)}
                placeholder="Tone, pacing, references..."
                className="resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Character Cards</h3>
              <Button onClick={addCharacterCard} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Character
              </Button>
            </div>
            
            {formData.character_cards.map((character, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Character {index + 1}</CardTitle>
                    {formData.character_cards.length > 1 && (
                      <Button
                        onClick={() => removeCharacterCard(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Character Name *</Label>
                      <Input
                        value={character.name}
                        onChange={(e) => updateCharacterCard(index, "name", e.target.value)}
                        placeholder="Character name"
                      />
                    </div>
                    <div>
                      <Label>Age Range</Label>
                      <Input
                        value={character.age_range}
                        onChange={(e) => updateCharacterCard(index, "age_range", e.target.value)}
                        placeholder="e.g., 25-35"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Bio</Label>
                    <Textarea
                      value={character.bio}
                      onChange={(e) => updateCharacterCard(index, "bio", e.target.value)}
                      placeholder="Character background and description"
                      className="resize-none"
                    />
                  </div>
                  
                  <div>
                    <Label>Conflicts & Motivations</Label>
                    <Textarea
                      value={character.conflicts}
                      onChange={(e) => updateCharacterCard(index, "conflicts", e.target.value)}
                      placeholder="Internal and external conflicts"
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Skills/Abilities</Label>
                      <Input
                        value={character.skills}
                        onChange={(e) => updateCharacterCard(index, "skills", e.target.value)}
                        placeholder="Special skills required"
                      />
                    </div>
                    <div>
                      <Label>Page Count</Label>
                      <Input
                        type="number"
                        value={character.pages_count}
                        onChange={(e) => updateCharacterCard(index, "pages_count", e.target.value)}
                        placeholder="Number of pages"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Demographics (Optional, Self-Described)</Label>
                    <Input
                      value={character.demographics_optional}
                      onChange={(e) => updateCharacterCard(index, "demographics_optional", e.target.value)}
                      placeholder="Optional, self-described only"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: Attributes are self-described and optional. We do not infer protected characteristics.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Distribution Goals</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["festivals", "AVOD", "TVOD", "educational", "Oprime channel"].map((goal) => (
                  <Badge
                    key={goal}
                    variant={formData.goal.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleArrayToggle("goal", goal)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Available Assets</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["poster", "trailer", "captions", "M&E", "5.1", "QC report"].map((asset) => (
                  <Badge
                    key={asset}
                    variant={formData.assets.includes(asset) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleArrayToggle("assets", asset)}
                  >
                    {asset}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="territories">Target Territories</Label>
              <Input
                id="territories"
                placeholder="e.g., North America, Europe, Global"
                onChange={(e) => {
                  const territories = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                  updateFormData("territories", territories);
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Festival Fee Budget</Label>
                <Select value={formData.fee_budget_range} onValueChange={(value) => updateFormData("fee_budget_range", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<$200">&lt;$200</SelectItem>
                    <SelectItem value="$200–$500">$200–$500</SelectItem>
                    <SelectItem value="$500–$1500">$500–$1500</SelectItem>
                    <SelectItem value=">$1500">&gt;$1500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Timeline Window</Label>
                <Select value={formData.timeline_window} onValueChange={(value) => updateFormData("timeline_window", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0–3 months">0–3 months</SelectItem>
                    <SelectItem value="3–6 months">3–6 months</SelectItem>
                    <SelectItem value="6–12 months">6–12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="post_need"
                checked={formData.post_need}
                onCheckedChange={(checked) => updateFormData("post_need", checked)}
              />
              <Label htmlFor="post_need">I need to post a crew or casting opportunity</Label>
            </div>
            
            {formData.post_need && (
              <div className="space-y-4 border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Role Type</Label>
                    <Select value={formData.role_type} onValueChange={(value) => updateFormData("role_type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cast">Cast</SelectItem>
                        <SelectItem value="crew">Crew</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="role_title">Role Title</Label>
                    <Input
                      id="role_title"
                      value={formData.role_title}
                      onChange={(e) => updateFormData("role_title", e.target.value)}
                      placeholder="e.g., Lead Actor, Director of Photography"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="brief">Role Description</Label>
                  <Textarea
                    id="brief"
                    value={formData.brief}
                    onChange={(e) => updateFormData("brief", e.target.value)}
                    placeholder="Detailed description of the role and requirements"
                    className="resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="paid"
                      checked={formData.paid}
                      onCheckedChange={(checked) => updateFormData("paid", checked)}
                    />
                    <Label htmlFor="paid">This is a paid position</Label>
                  </div>
                  
                  {formData.paid && (
                    <div>
                      <Label htmlFor="rate">Rate/Compensation</Label>
                      <Input
                        id="rate"
                        value={formData.rate}
                        onChange={(e) => updateFormData("rate", e.target.value)}
                        placeholder="e.g., $500/day, $2000 total"
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      placeholder="Shooting location"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dates">Dates</Label>
                    <Input
                      id="dates"
                      value={formData.dates}
                      onChange={(e) => updateFormData("dates", e.target.value)}
                      placeholder="Shooting dates"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Method</Label>
                    <Select value={formData.contact_method} onValueChange={(value) => updateFormData("contact_method", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="site messages">Site Messages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => updateFormData("deadline", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Library Access</h3>
              <p className="text-muted-foreground">Create an account to access our premium document library</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="create_password">Create Password *</Label>
                <Input
                  id="create_password"
                  type="password"
                  value={formData.create_password}
                  onChange={(e) => updateFormData("create_password", e.target.value)}
                  placeholder="Create a secure password"
                />
              </div>
            </div>
            
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">What's Included in the Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>• Permits & Location Forms</div>
                  <div>• Talent & Minor Releases</div>
                  <div>• Music & Cue Sheets</div>
                  <div>• Deliverables Checklists</div>
                  <div>• EPK Templates</div>
                  <div>• Festival Submission Letters</div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Concierge / Consulting</h3>
              <p className="text-muted-foreground">Get personalized guidance from our producer desk</p>
            </div>
            
            <div>
              <Label>What do you need help with?</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["distribution", "festivals", "deliverables", "crew", "casting", "budget", "EPK"].map((need) => (
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
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                placeholder="Describe your specific needs and challenges..."
                className="min-h-[120px] resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact">Preferred Contact</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => updateFormData("contact", e.target.value)}
                  placeholder="Email or phone number"
                />
              </div>
              
              <div>
                <Label>Urgency Level</Label>
                <Select value={formData.urgency} onValueChange={(value) => updateFormData("urgency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Filmmaker Project Intake</h1>
          <p className="text-muted-foreground">
            Complete this form to get personalized AI recommendations and access to our tools
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {stepTitles[currentStep - 1]}
              <Badge variant="outline">{currentStep}/{totalSteps}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === totalSteps ? (
            <Button onClick={handleSubmit}>
              Complete Intake
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next Step
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}