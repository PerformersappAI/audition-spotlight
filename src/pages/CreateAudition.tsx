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
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Role {
  role_name: string;
  role_type: string;
  age_range: string;
  gender_presentation: string;
  open_ethnicity: boolean;
  skills: string;
  description: string;
  work_dates: string;
  rate: string;
  sides_link: string;
}

export default function CreateAudition() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([{
    role_name: "",
    role_type: "Principal",
    age_range: "",
    gender_presentation: "",
    open_ethnicity: true,
    skills: "",
    description: "",
    work_dates: "",
    rate: "",
    sides_link: ""
  }]);
  
  const [formData, setFormData] = useState({
    project_name: "",
    project_type: "",
    union_status: "",
    production_company: "",
    director_cd: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    logline: "",
    synopsis: "",
    shoot_city: "",
    shoot_country: "",
    shoot_dates: "",
    audition_window: "",
    callback_dates: "",
    self_tape_deadline: "",
    location_type: "Stage",
    travel_lodging: "No",
    travel_details: "",
    compensation_type: "",
    compensation_rate: "",
    usage_terms: "",
    agent_fee_included: false,
    conflicts: "",
    has_nudity: false,
    has_intimacy: false,
    has_violence: false,
    safety_details: "",
    has_minors: false,
    slate_link: "",
    reel_link: "",
    additional_materials: "",
    posting_targets: [] as string[],
    visibility: "public",
    submission_deadline: "",
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
      const { data: auditionData, error: auditionError } = await supabase
        .from("audition_notices")
        .insert({
          user_id: user.id,
          ...formData,
          self_tape_deadline: formData.self_tape_deadline || null,
          submission_deadline: formData.submission_deadline || null,
          status: 'active',
        })
        .select()
        .single();

      if (auditionError) throw auditionError;

      const rolesWithAuditionId = roles.map(role => ({
        audition_id: auditionData.id,
        ...role,
      }));

      const { error: rolesError } = await supabase
        .from("audition_roles")
        .insert(rolesWithAuditionId);

      if (rolesError) throw rolesError;

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

  const updateRole = (index: number, field: keyof Role, value: any) => {
    setRoles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addRole = () => {
    setRoles(prev => [...prev, {
      role_name: "",
      role_type: "Principal",
      age_range: "",
      gender_presentation: "",
      open_ethnicity: true,
      skills: "",
      description: "",
      work_dates: "",
      rate: "",
      sides_link: ""
    }]);
  };

  const removeRole = (index: number) => {
    if (roles.length > 1) {
      setRoles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const togglePostingTarget = (target: string) => {
    setFormData(prev => ({
      ...prev,
      posting_targets: prev.posting_targets.includes(target)
        ? prev.posting_targets.filter(t => t !== target)
        : [...prev.posting_targets, target]
    }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Audition Notice</h1>
          <p className="text-muted-foreground">Post a professional casting breakdown</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="project" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="project">Project</TabsTrigger>
              <TabsTrigger value="story">Story</TabsTrigger>
              <TabsTrigger value="dates">Dates</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="submission">Submission</TabsTrigger>
            </TabsList>

            {/* Project Tab */}
            <TabsContent value="project">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Project Title *</Label>
                    <Input required value={formData.project_name} onChange={(e) => updateField("project_name", e.target.value)} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Project Type *</Label>
                      <Select required value={formData.project_type} onValueChange={(v) => updateField("project_type", v)}>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Feature Film">Feature Film</SelectItem>
                          <SelectItem value="Episodic TV">Episodic TV</SelectItem>
                          <SelectItem value="Limited Series">Limited Series</SelectItem>
                          <SelectItem value="Music Video">Music Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Union Status *</Label>
                      <Select required value={formData.union_status} onValueChange={(v) => updateField("union_status", v)}>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAG-AFTRA">SAG-AFTRA</SelectItem>
                          <SelectItem value="Non-Union">Non-Union</SelectItem>
                          <SelectItem value="Both (Union + Non-Union)">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Production Company</Label>
                    <Input value={formData.production_company} onChange={(e) => updateField("production_company", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Director / CD</Label>
                    <Input value={formData.director_cd} onChange={(e) => updateField("director_cd", e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contact Email *</Label>
                      <Input required type="email" value={formData.contact_email} onChange={(e) => updateField("contact_email", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input type="tel" value={formData.contact_phone} onChange={(e) => updateField("contact_phone", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input type="url" value={formData.website} onChange={(e) => updateField("website", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Story Tab */}
            <TabsContent value="story">
              <Card>
                <CardHeader>
                  <CardTitle>Story</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logline * (160 chars max)</Label>
                    <Input required maxLength={160} value={formData.logline} onChange={(e) => updateField("logline", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Synopsis *</Label>
                    <Textarea required rows={6} value={formData.synopsis} onChange={(e) => updateField("synopsis", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dates & Location Tab */}
            <TabsContent value="dates">
              <Card>
                <CardHeader>
                  <CardTitle>Dates & Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Shoot City *</Label>
                      <Input required value={formData.shoot_city} onChange={(e) => updateField("shoot_city", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Shoot Country *</Label>
                      <Input required value={formData.shoot_country} onChange={(e) => updateField("shoot_country", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Shoot Dates</Label>
                    <Input placeholder="Oct 16–17, 2025 or TBD" value={formData.shoot_dates} onChange={(e) => updateField("shoot_dates", e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Audition Window</Label>
                      <Input placeholder="ASAP / Range" value={formData.audition_window} onChange={(e) => updateField("audition_window", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Callback Date(s)</Label>
                      <Input value={formData.callback_dates} onChange={(e) => updateField("callback_dates", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Self-Tape Deadline</Label>
                    <Input type="datetime-local" value={formData.self_tape_deadline} onChange={(e) => updateField("self_tape_deadline", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Location Type</Label>
                    <Select value={formData.location_type} onValueChange={(v) => updateField("location_type", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stage">Stage</SelectItem>
                        <SelectItem value="Practical">Practical</SelectItem>
                        <SelectItem value="Remote/At-Home">Remote/At-Home</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Travel/Lodging Provided?</Label>
                    <Select value={formData.travel_lodging} onValueChange={(v) => updateField("travel_lodging", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes — details below</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.travel_lodging === "Yes" && (
                    <div className="space-y-2">
                      <Label>Travel/Lodging Details</Label>
                      <Textarea rows={2} value={formData.travel_details} onChange={(e) => updateField("travel_details", e.target.value)} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compensation Tab */}
            <TabsContent value="compensation">
              <Card>
                <CardHeader>
                  <CardTitle>Compensation & Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Compensation Type *</Label>
                      <Select required value={formData.compensation_type} onValueChange={(v) => updateField("compensation_type", v)}>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Day Rate">Day Rate</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Buyout">Buyout</SelectItem>
                          <SelectItem value="Deferred">Deferred</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Rate</Label>
                      <Input placeholder="$219/day" value={formData.compensation_rate} onChange={(e) => updateField("compensation_rate", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Usage (Commercial/Branded)</Label>
                    <Input placeholder="OLV, Social, 12 months, NA" value={formData.usage_terms} onChange={(e) => updateField("usage_terms", e.target.value)} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="agent_fee" checked={formData.agent_fee_included} onCheckedChange={(c) => updateField("agent_fee_included", c)} />
                    <Label htmlFor="agent_fee">Agent Fee Included</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Conflicts (Commercial)</Label>
                    <Textarea rows={2} placeholder="Guitars, musical instruments, etc." value={formData.conflicts} onChange={(e) => updateField("conflicts", e.target.value)} />
                  </div>

                  <div className="space-y-3">
                    <Label>Sensitive Content</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="nudity" checked={formData.has_nudity} onCheckedChange={(c) => updateField("has_nudity", c)} />
                      <Label htmlFor="nudity">Nudity/Partial Nudity</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="intimacy" checked={formData.has_intimacy} onCheckedChange={(c) => updateField("has_intimacy", c)} />
                      <Label htmlFor="intimacy">Intimacy coordination required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="violence" checked={formData.has_violence} onCheckedChange={(c) => updateField("has_violence", c)} />
                      <Label htmlFor="violence">Simulated violence/weapons</Label>
                    </div>
                    
                    {(formData.has_nudity || formData.has_intimacy || formData.has_violence) && (
                      <div className="space-y-2 pt-2">
                        <Label>Safety Details</Label>
                        <Input placeholder="Describe conditions, coverage, coordinator" value={formData.safety_details} onChange={(e) => updateField("safety_details", e.target.value)} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="minors" checked={formData.has_minors} onCheckedChange={(c) => updateField("has_minors", c)} />
                    <Label htmlFor="minors">Minor Talent Required</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles">
              <Card>
                <CardHeader>
                  <CardTitle>Roles</CardTitle>
                  <CardDescription>Add one or more roles for this audition</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {roles.map((role, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                      {roles.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeRole(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <h3 className="font-semibold">Role {index + 1}</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Role Name *</Label>
                          <Input required value={role.role_name} onChange={(e) => updateRole(index, "role_name", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Role Type</Label>
                          <Select value={role.role_type} onValueChange={(v) => updateRole(index, "role_type", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Principal">Principal</SelectItem>
                              <SelectItem value="Day Player">Day Player</SelectItem>
                              <SelectItem value="Co-Star">Co-Star</SelectItem>
                              <SelectItem value="Guest Star">Guest Star</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Age Range *</Label>
                          <Input required placeholder="30–45" value={role.age_range} onChange={(e) => updateRole(index, "age_range", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Gender Presentation</Label>
                          <Input value={role.gender_presentation} onChange={(e) => updateRole(index, "gender_presentation", e.target.value)} />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id={`ethnicity-${index}`} checked={role.open_ethnicity} onCheckedChange={(c) => updateRole(index, "open_ethnicity", c)} />
                        <Label htmlFor={`ethnicity-${index}`}>Open Ethnicity</Label>
                      </div>

                      <div className="space-y-2">
                        <Label>Skills / Special Requirements</Label>
                        <Input placeholder="Guitar, cowboy roping, etc." value={role.skills} onChange={(e) => updateRole(index, "skills", e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea required rows={4} value={role.description} onChange={(e) => updateRole(index, "description", e.target.value)} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Work Dates</Label>
                          <Input value={role.work_dates} onChange={(e) => updateRole(index, "work_dates", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Rate (if different)</Label>
                          <Input value={role.rate} onChange={(e) => updateRole(index, "rate", e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Sides / Notes (Link)</Label>
                        <Input type="url" value={role.sides_link} onChange={(e) => updateRole(index, "sides_link", e.target.value)} />
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addRole} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Another Role
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Submission Tab */}
            <TabsContent value="submission">
              <Card>
                <CardHeader>
                  <CardTitle>Submission Requirements & Posting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Self-Tape Link</Label>
                    <Input type="url" placeholder="https://…" value={formData.slate_link} onChange={(e) => updateField("slate_link", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Demo Reel Link</Label>
                    <Input type="url" placeholder="https://…" value={formData.reel_link} onChange={(e) => updateField("reel_link", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Materials</Label>
                    <Input placeholder="Voice sample, movement, instrument…" value={formData.additional_materials} onChange={(e) => updateField("additional_materials", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Submission Deadline</Label>
                    <Input type="date" value={formData.submission_deadline} onChange={(e) => updateField("submission_deadline", e.target.value)} />
                  </div>

                  <div className="space-y-3">
                    <Label>Where to Post</Label>
                    {["Actors Access", "Casting Networks", "Casting Frontier", "Internal Only"].map(target => (
                      <div key={target} className="flex items-center space-x-2">
                        <Checkbox
                          id={target}
                          checked={formData.posting_targets.includes(target)}
                          onCheckedChange={() => togglePostingTarget(target)}
                        />
                        <Label htmlFor={target}>{target}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select value={formData.visibility} onValueChange={(v) => updateField("visibility", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public Link</SelectItem>
                        <SelectItem value="invite">Invite-Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Casting
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
