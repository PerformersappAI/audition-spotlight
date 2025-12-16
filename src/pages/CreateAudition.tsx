import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Loader2, Plus, Trash2, Upload, FileText, Download, Edit, Save } from "lucide-react";
import { useOCRUpload } from "@/hooks/useOCRUpload";
import { Progress } from "@/components/ui/progress";
import { exportAuditionToPDF } from "@/utils/exportAuditionToPDF";

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
  const [previousAuditions, setPreviousAuditions] = useState<any[]>([]);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isEditingSynopsis, setIsEditingSynopsis] = useState(true);
  
  const { 
    processFile, 
    isProcessing: isOCRProcessing, 
    currentStage,
    progress: ocrProgress,
    currentFileName 
  } = useOCRUpload();
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
    work_dates: "",
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

  useEffect(() => {
    const fetchPreviousAuditions = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("audition_notices")
        .select("id, project_name, project_type, created_at, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (!error && data) {
        setPreviousAuditions(data);
      }
    };

    fetchPreviousAuditions();
  }, [user]);

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
          project_name: formData.project_name,
          project_type: formData.project_type,
          union_status: formData.union_status,
          production_company: formData.production_company,
          director_cd: formData.director_cd,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          website: formData.website,
          logline: formData.logline,
          synopsis: formData.synopsis,
          shoot_city: formData.shoot_city,
          shoot_country: formData.shoot_country,
          work_dates: formData.work_dates,
          audition_window: formData.audition_window,
          callback_dates: formData.callback_dates,
          self_tape_deadline: formData.self_tape_deadline || null,
          location_type: formData.location_type,
          travel_lodging: formData.travel_lodging,
          travel_details: formData.travel_details,
          compensation_type: formData.compensation_type,
          compensation_rate: formData.compensation_rate,
          usage_terms: formData.usage_terms,
          agent_fee_included: formData.agent_fee_included,
          conflicts: formData.conflicts,
          has_nudity: formData.has_nudity,
          has_intimacy: formData.has_intimacy,
          has_violence: formData.has_violence,
          safety_details: formData.safety_details,
          has_minors: formData.has_minors,
          slate_link: formData.slate_link,
          reel_link: formData.reel_link,
          additional_materials: formData.additional_materials,
          posting_targets: formData.posting_targets,
          visibility: formData.visibility,
          submission_deadline: formData.submission_deadline || null,
          status: 'active',
          // Legacy fields for compatibility with current types
          location: formData.shoot_city || 'TBD',
          role_name: 'See Roles Tab',
          role_description: 'See Roles Tab',
          rate_of_pay: formData.compensation_rate || 'See Roles',
          storyline: formData.synopsis || formData.logline || '',
          work_type: 'See Roles',
        } as any)
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, image (JPG, PNG), text, CSV, or Excel file",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, process the file with OCR
      await processFile(
        file,
        async (ocrResult) => {
          // OCR complete, now parse with AI
          setIsParsingFile(true);
          
          try {
            const { data, error } = await supabase.functions.invoke('parse-audition-notice', {
              body: { text: ocrResult.text }
            });

            if (error) throw error;

            if (data.success && data.data) {
              const parsed = data.data;
              
              // Update form data
              setFormData(prev => ({
                ...prev,
                project_name: parsed.project_name || prev.project_name,
                project_type: parsed.project_type || prev.project_type,
                union_status: parsed.union_status || prev.union_status,
                production_company: parsed.production_company || prev.production_company,
                director_cd: parsed.director_cd || prev.director_cd,
                contact_email: parsed.contact_email || prev.contact_email,
                contact_phone: parsed.contact_phone || prev.contact_phone,
                website: parsed.website || prev.website,
                logline: parsed.logline || prev.logline,
                synopsis: parsed.synopsis || prev.synopsis,
                shoot_city: parsed.shoot_city || prev.shoot_city,
                shoot_country: parsed.shoot_country || prev.shoot_country,
                work_dates: parsed.work_dates || parsed.shoot_dates || prev.work_dates,
                audition_window: parsed.audition_window || prev.audition_window,
                callback_dates: parsed.callback_dates || prev.callback_dates,
                self_tape_deadline: parsed.self_tape_deadline || prev.self_tape_deadline,
                location_type: parsed.location_type || prev.location_type,
                travel_lodging: parsed.travel_lodging || prev.travel_lodging,
                travel_details: parsed.travel_details || prev.travel_details,
                compensation_type: parsed.compensation_type || prev.compensation_type,
                compensation_rate: parsed.compensation_rate || prev.compensation_rate,
                usage_terms: parsed.usage_terms || prev.usage_terms,
                agent_fee_included: parsed.agent_fee_included || prev.agent_fee_included,
                conflicts: parsed.conflicts || prev.conflicts,
                has_nudity: parsed.has_nudity || prev.has_nudity,
                has_intimacy: parsed.has_intimacy || prev.has_intimacy,
                has_violence: parsed.has_violence || prev.has_violence,
                safety_details: parsed.safety_details || prev.safety_details,
                has_minors: parsed.has_minors || prev.has_minors,
                slate_link: parsed.slate_link || prev.slate_link,
                reel_link: parsed.reel_link || prev.reel_link,
                additional_materials: parsed.additional_materials || prev.additional_materials,
                posting_targets: parsed.posting_targets?.length > 0 ? parsed.posting_targets : prev.posting_targets,
                visibility: parsed.visibility || prev.visibility,
              }));

              // Update roles if provided
              if (parsed.roles && Array.isArray(parsed.roles) && parsed.roles.length > 0) {
                setRoles(parsed.roles.map((role: any) => ({
                  role_name: role.role_name || "",
                  role_type: role.role_type || "Principal",
                  age_range: role.age_range || "",
                  gender_presentation: role.gender_presentation || "",
                  open_ethnicity: role.open_ethnicity !== undefined ? role.open_ethnicity : true,
                  skills: role.skills || "",
                  description: role.description || "",
                  work_dates: role.work_dates || "",
                  rate: role.rate || "",
                  sides_link: role.sides_link || ""
                })));
              }

              setIsEditingSynopsis(false);
              
              toast({
                title: "Success!",
                description: "Form populated from uploaded file. Please review and adjust as needed.",
              });
            } else {
              throw new Error('Failed to parse audition notice');
            }
          } catch (parseError: any) {
            console.error('Parse error:', parseError);
            toast({
              title: "Parsing Error",
              description: "Could not extract all fields. Please fill in manually.",
              variant: "destructive",
            });
          } finally {
            setIsParsingFile(false);
          }
        },
        (error) => {
          toast({
            title: "OCR Error",
            description: error || "Failed to read file",
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Upload Error",
        description: "Failed to process file",
        variant: "destructive",
      });
    }

    // Reset file input
    event.target.value = '';
  };

  const handleDownloadPDF = () => {
    try {
      exportAuditionToPDF(formData, roles);
      toast({
        title: "PDF Downloaded",
        description: "Your audition notice has been saved as a PDF",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Create Audition Notice</h1>
            <p className="text-muted-foreground">Post a professional casting breakdown</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadPDF}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* File Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Quick Fill from Document
            </CardTitle>
            <CardDescription>
              Upload a PDF, image (JPG/PNG), text, CSV, or Excel file of your audition notice to auto-populate the form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="audition-file"
                  accept=".pdf,.txt,.csv,.xls,.xlsx,image/jpeg,image/jpg,image/png"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isOCRProcessing || isParsingFile}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('audition-file')?.click()}
                  disabled={isOCRProcessing || isParsingFile}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {isOCRProcessing || isParsingFile ? 'Processing...' : 'Browse Files'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  PDF, Image, Text, CSV, or Excel (Max 20MB)
                </span>
              </div>

              {(isOCRProcessing || isParsingFile) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {isOCRProcessing ? `Processing: ${currentStage}` : 'Extracting information...'}
                    </span>
                    <span className="text-muted-foreground">
                      {currentFileName}
                    </span>
                  </div>
                  <Progress value={isOCRProcessing ? ocrProgress : 75} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
                    <div className="flex items-center justify-between">
                      <Label>Synopsis *</Label>
                      {isEditingSynopsis ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditingSynopsis(false);
                            toast({
                              title: "Saved",
                              description: "Synopsis saved successfully",
                            });
                          }}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingSynopsis(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                    {isEditingSynopsis ? (
                      <Textarea 
                        required 
                        rows={6} 
                        value={formData.synopsis} 
                        onChange={(e) => updateField("synopsis", e.target.value)} 
                      />
                    ) : (
                      <div className="p-3 rounded-md border bg-muted/50 min-h-[120px] whitespace-pre-wrap">
                        {formData.synopsis || "No synopsis provided"}
                      </div>
                    )}
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
                    <Input placeholder="Oct 16–17, 2025 or TBD" value={formData.work_dates} onChange={(e) => updateField("work_dates", e.target.value)} />
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

        {/* Previous Auditions Section */}
        {previousAuditions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Previous Auditions</CardTitle>
              <CardDescription>Recent casting notices you've posted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previousAuditions.map((audition) => (
                  <Link
                    key={audition.id}
                    to={`/audition/${audition.id}`}
                    className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{audition.project_name}</h4>
                        <p className="text-sm text-muted-foreground">{audition.project_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(audition.created_at).toLocaleDateString()}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          audition.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {audition.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
