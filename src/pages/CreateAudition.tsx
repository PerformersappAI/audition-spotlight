import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function CreateAudition() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Project Info
    project_name: "",
    project_type: "",
    union_status: "",
    producer: "",
    director: "",
    casting_director: "",
    line_producer: "",
    first_ad: "",
    additional_credits: "",
    
    // Role Details
    role_name: "",
    role_description: "",
    character_background: "",
    ethnicity_requirement: "",
    age_range: "",
    gender_preference: "",
    work_type: "",
    
    // Work & Pay
    rate_of_pay: "",
    work_dates: "",
    shoot_start_date: "",
    shoot_end_date: "",
    location: "",
    audition_date: "",
    
    // Project Story
    storyline: "",
    genre: "",
    
    // Submission Details
    submission_deadline: "",
    materials_required: [] as string[],
    special_instructions: "",
    allow_online_demo: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create an audition notice",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("audition_notices").insert({
        user_id: user.id,
        ...formData,
        audition_date: formData.audition_date || null,
        shoot_start_date: formData.shoot_start_date || null,
        shoot_end_date: formData.shoot_end_date || null,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your audition notice has been posted",
      });

      navigate("/auditions");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create audition notice",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMaterial = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materials_required: prev.materials_required.includes(material)
        ? prev.materials_required.filter(m => m !== material)
        : [...prev.materials_required, material]
    }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Audition Notice</h1>
          <p className="text-muted-foreground">Post a professional casting breakdown for actors</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="project" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="project">Project</TabsTrigger>
              <TabsTrigger value="role">Role</TabsTrigger>
              <TabsTrigger value="work">Work & Pay</TabsTrigger>
              <TabsTrigger value="story">Story</TabsTrigger>
              <TabsTrigger value="submission">Submission</TabsTrigger>
            </TabsList>

            <TabsContent value="project">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>Basic details about your production</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_name">Project Title *</Label>
                    <Input
                      id="project_name"
                      required
                      value={formData.project_name}
                      onChange={(e) => updateField("project_name", e.target.value)}
                      placeholder="e.g., THE TRUSTING SOUL"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project_type">Project Type *</Label>
                      <Select required value={formData.project_type} onValueChange={(v) => updateField("project_type", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Feature Film">Feature Film</SelectItem>
                          <SelectItem value="TV Series">TV Series</SelectItem>
                          <SelectItem value="Short Film">Short Film</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Web Series">Web Series</SelectItem>
                          <SelectItem value="Theater">Theater</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="union_status">Union Status</Label>
                      <Select value={formData.union_status} onValueChange={(v) => updateField("union_status", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAG-AFTRA">SAG-AFTRA</SelectItem>
                          <SelectItem value="Non-Union">Non-Union</SelectItem>
                          <SelectItem value="SAG Eligible">SAG Eligible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="producer">Producer</Label>
                      <Input
                        id="producer"
                        value={formData.producer}
                        onChange={(e) => updateField("producer", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="director">Director</Label>
                      <Input
                        id="director"
                        value={formData.director}
                        onChange={(e) => updateField("director", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="casting_director">Casting Director</Label>
                      <Input
                        id="casting_director"
                        value={formData.casting_director}
                        onChange={(e) => updateField("casting_director", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="line_producer">Line Producer</Label>
                      <Input
                        id="line_producer"
                        value={formData.line_producer}
                        onChange={(e) => updateField("line_producer", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="first_ad">1st AD</Label>
                    <Input
                      id="first_ad"
                      value={formData.first_ad}
                      onChange={(e) => updateField("first_ad", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional_credits">Additional Credits</Label>
                    <Textarea
                      id="additional_credits"
                      value={formData.additional_credits}
                      onChange={(e) => updateField("additional_credits", e.target.value)}
                      placeholder="Any other production credits"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="role">
              <Card>
                <CardHeader>
                  <CardTitle>Role Details</CardTitle>
                  <CardDescription>Describe the character you're casting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role_name">Role Name *</Label>
                    <Input
                      id="role_name"
                      required
                      value={formData.role_name}
                      onChange={(e) => updateField("role_name", e.target.value)}
                      placeholder="e.g., LOU, DETECTIVE JONES"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role_description">Role Description *</Label>
                    <Textarea
                      id="role_description"
                      required
                      value={formData.role_description}
                      onChange={(e) => updateField("role_description", e.target.value)}
                      placeholder="Character traits, personality, key characteristics"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="character_background">Character Background</Label>
                    <Textarea
                      id="character_background"
                      value={formData.character_background}
                      onChange={(e) => updateField("character_background", e.target.value)}
                      placeholder="Detailed character history and context"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ethnicity_requirement">Ethnicity</Label>
                      <Input
                        id="ethnicity_requirement"
                        value={formData.ethnicity_requirement}
                        onChange={(e) => updateField("ethnicity_requirement", e.target.value)}
                        placeholder="e.g., Any, Caucasian, African American"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age_range">Age Range</Label>
                      <Input
                        id="age_range"
                        value={formData.age_range}
                        onChange={(e) => updateField("age_range", e.target.value)}
                        placeholder="e.g., 25-35"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender_preference">Gender</Label>
                      <Select value={formData.gender_preference} onValueChange={(v) => updateField("gender_preference", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                          <SelectItem value="Any">Any</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="work_type">Work Type *</Label>
                      <Select required value={formData.work_type} onValueChange={(v) => updateField("work_type", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Day Player">Day Player</SelectItem>
                          <SelectItem value="Series Regular">Series Regular</SelectItem>
                          <SelectItem value="Recurring">Recurring</SelectItem>
                          <SelectItem value="Guest Star">Guest Star</SelectItem>
                          <SelectItem value="Co-Star">Co-Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="work">
              <Card>
                <CardHeader>
                  <CardTitle>Work & Payment Details</CardTitle>
                  <CardDescription>Filming schedule and compensation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate_of_pay">Rate of Pay *</Label>
                    <Input
                      id="rate_of_pay"
                      required
                      value={formData.rate_of_pay}
                      onChange={(e) => updateField("rate_of_pay", e.target.value)}
                      placeholder="e.g., $200/day, $500/project, TBD"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="work_dates">Work Dates</Label>
                    <Input
                      id="work_dates"
                      value={formData.work_dates}
                      onChange={(e) => updateField("work_dates", e.target.value)}
                      placeholder="e.g., January 15-17, 2025"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shoot_start_date">Shoot Start Date</Label>
                      <Input
                        id="shoot_start_date"
                        type="date"
                        value={formData.shoot_start_date}
                        onChange={(e) => updateField("shoot_start_date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shoot_end_date">Shoot End Date</Label>
                      <Input
                        id="shoot_end_date"
                        type="date"
                        value={formData.shoot_end_date}
                        onChange={(e) => updateField("shoot_end_date", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Filming Location *</Label>
                    <Input
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="e.g., Los Angeles, CA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audition_date">Audition Date</Label>
                    <Input
                      id="audition_date"
                      type="datetime-local"
                      value={formData.audition_date}
                      onChange={(e) => updateField("audition_date", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="story">
              <Card>
                <CardHeader>
                  <CardTitle>Project Story</CardTitle>
                  <CardDescription>Tell actors about your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storyline">Storyline/Synopsis *</Label>
                    <Textarea
                      id="storyline"
                      required
                      value={formData.storyline}
                      onChange={(e) => updateField("storyline", e.target.value)}
                      placeholder="Provide a detailed description of your project's story"
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      value={formData.genre}
                      onChange={(e) => updateField("genre", e.target.value)}
                      placeholder="e.g., Drama, Comedy, Thriller"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submission">
              <Card>
                <CardHeader>
                  <CardTitle>Submission Requirements</CardTitle>
                  <CardDescription>How actors should apply</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="submission_deadline">Submission Deadline *</Label>
                    <Input
                      id="submission_deadline"
                      type="date"
                      required
                      value={formData.submission_deadline}
                      onChange={(e) => updateField("submission_deadline", e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Materials Required</Label>
                    <div className="space-y-2">
                      {["Headshot", "Resume", "Reel", "Size Card", "Voice Demo"].map((material) => (
                        <div key={material} className="flex items-center space-x-2">
                          <Checkbox
                            id={material}
                            checked={formData.materials_required.includes(material)}
                            onCheckedChange={() => toggleMaterial(material)}
                          />
                          <Label htmlFor={material} className="font-normal cursor-pointer">
                            {material}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special_instructions">Special Instructions</Label>
                    <Textarea
                      id="special_instructions"
                      value={formData.special_instructions}
                      onChange={(e) => updateField("special_instructions", e.target.value)}
                      placeholder="Any specific submission requirements or notes"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_online_demo"
                      checked={formData.allow_online_demo}
                      onCheckedChange={(checked) => updateField("allow_online_demo", checked)}
                    />
                    <Label htmlFor="allow_online_demo" className="font-normal cursor-pointer">
                      Allow online demo clips
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Audition Notice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
