import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload, Download, Film, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCallSheets, type CallSheetData, type CallSheetScene, type CallSheetCast, type CallSheetCrew, type CallSheetBackground, type CallSheetBreak, type CallSheetRequirement } from "@/hooks/useCallSheets";
import { exportCallSheetToPDF } from "@/utils/exportCallSheetToPDF";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOCRUpload } from "@/hooks/useOCRUpload";
import { PDFUploadProgress } from "@/components/PDFUploadProgress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CallSheet = () => {
  const navigate = useNavigate();
  const { saveCallSheet } = useCallSheets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsingData, setIsParsingData] = useState(false);
  const { 
    processFile, 
    isProcessing: isProcessingFile,
    currentStage,
    currentFileName,
    currentFileSize,
    elapsedTime,
    progress
  } = useOCRUpload();
  
  const [formData, setFormData] = useState<CallSheetData>({
    production_company: "",
    project_name: "",
    shoot_date: "",
    day_number: "",
    script_color: "White",
    schedule_color: "White",
    general_crew_call: "",
    shooting_call: "",
    lunch_time: "",
    courtesy_breakfast_time: "",
    wrap_time: "",
    director: "",
    line_producer: "",
    upm: "",
    associate_director: "",
    shooting_location: "",
    location_address: "",
    crew_parking: "",
    basecamp: "",
    nearest_hospital: "",
    hospital_address: "",
    weather_description: "",
    high_temp: "",
    low_temp: "",
    sunrise_time: "",
    sunset_time: "",
    executive_producers: [],
    producers: [],
    // New fields
    lx_precall_time: "",
    unit_call_time: "",
    current_schedule: "",
    current_script: "",
    unit_base: "",
    unit_base_address: "",
  });

  const [scenes, setScenes] = useState<CallSheetScene[]>([{
    scene_number: "",
    pages: "",
    set_description: "",
    day_night: "",
    cast_ids: [],
    notes: "",
    location: "",
    start_time: "",
    int_ext: "",
  }]);

  const [cast, setCast] = useState<CallSheetCast[]>([{
    character_name: "",
    actor_name: "",
    cast_id: "",
    status: "",
    pickup_time: "",
    call_time: "",
    set_ready_time: "",
    special_instructions: "",
    swf: "",
    makeup_time: "",
    costume_time: "",
    travel_time: "",
    on_set_time: "",
  }]);

  const [crew, setCrew] = useState<CallSheetCrew[]>([{
    department: "",
    title: "",
    name: "",
    call_time: "",
    phone: "",
    off_set: "",
  }]);

  const [background, setBackground] = useState<CallSheetBackground[]>([{
    quantity: undefined,
    description: "",
    call_time: "",
    notes: "",
    makeup_time: "",
    costume_time: "",
    travel_time: "",
    on_set_time: "",
  }]);

  const [breaks, setBreaks] = useState<CallSheetBreak[]>([]);
  const [requirements, setRequirements] = useState<CallSheetRequirement[]>([]);


  const updateField = (field: keyof CallSheetData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addScene = () => {
    setScenes([...scenes, {
      scene_number: "",
      pages: "",
      set_description: "",
      day_night: "",
      cast_ids: [],
      notes: "",
      location: "",
      start_time: "",
      int_ext: "",
    }]);
  };

  const removeScene = (index: number) => {
    setScenes(scenes.filter((_, i) => i !== index));
  };

  const updateScene = (index: number, field: keyof CallSheetScene, value: any) => {
    const updated = [...scenes];
    updated[index] = { ...updated[index], [field]: value };
    setScenes(updated);
  };

  const addCast = () => {
    setCast([...cast, {
      character_name: "",
      actor_name: "",
      cast_id: "",
      status: "",
      pickup_time: "",
      call_time: "",
      set_ready_time: "",
      special_instructions: "",
      swf: "",
      makeup_time: "",
      costume_time: "",
      travel_time: "",
      on_set_time: "",
    }]);
  };

  const removeCast = (index: number) => {
    setCast(cast.filter((_, i) => i !== index));
  };

  const updateCast = (index: number, field: keyof CallSheetCast, value: any) => {
    const updated = [...cast];
    updated[index] = { ...updated[index], [field]: value };
    setCast(updated);
  };

  const addCrew = () => {
    setCrew([...crew, {
      department: "",
      title: "",
      name: "",
      call_time: "",
      phone: "",
      off_set: "",
    }]);
  };

  const removeCrew = (index: number) => {
    setCrew(crew.filter((_, i) => i !== index));
  };

  const updateCrew = (index: number, field: keyof CallSheetCrew, value: any) => {
    const updated = [...crew];
    updated[index] = { ...updated[index], [field]: value };
    setCrew(updated);
  };

  const addBackground = () => {
    setBackground([...background, {
      quantity: undefined,
      description: "",
      call_time: "",
      notes: "",
      makeup_time: "",
      costume_time: "",
      travel_time: "",
      on_set_time: "",
    }]);
  };

  const addRequirement = () => {
    setRequirements([...requirements, { department: "", notes: "" }]);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, field: keyof CallSheetRequirement, value: string) => {
    const updated = [...requirements];
    updated[index] = { ...updated[index], [field]: value };
    setRequirements(updated);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    // Step 1: Extract text from PDF using OCR
    await processFile(
      file,
      async (result) => {
        // Step 2: Parse extracted text into structured call sheet data
        setIsParsingData(true);
        try {
          const { data, error } = await supabase.functions.invoke('parse-call-sheet', {
            body: { text: result.text }
          });

          if (error) throw error;

          if (data) {
            // Populate form data
            if (data.production_company) updateField("production_company", data.production_company);
            if (data.project_name) updateField("project_name", data.project_name);
            if (data.shoot_date) updateField("shoot_date", data.shoot_date);
            if (data.day_number) updateField("day_number", data.day_number);
            if (data.script_color) updateField("script_color", data.script_color);
            if (data.schedule_color) updateField("schedule_color", data.schedule_color);
            if (data.general_crew_call) updateField("general_crew_call", data.general_crew_call);
            if (data.shooting_call) updateField("shooting_call", data.shooting_call);
            if (data.lunch_time) updateField("lunch_time", data.lunch_time);
            if (data.courtesy_breakfast_time) updateField("courtesy_breakfast_time", data.courtesy_breakfast_time);
            if (data.director) updateField("director", data.director);
            if (data.line_producer) updateField("line_producer", data.line_producer);
            if (data.upm) updateField("upm", data.upm);
            if (data.shooting_location) updateField("shooting_location", data.shooting_location);
            if (data.location_address) updateField("location_address", data.location_address);
            if (data.crew_parking) updateField("crew_parking", data.crew_parking);
            if (data.basecamp) updateField("basecamp", data.basecamp);
            if (data.nearest_hospital) updateField("nearest_hospital", data.nearest_hospital);
            if (data.hospital_address) updateField("hospital_address", data.hospital_address);
            if (data.weather_description) updateField("weather_description", data.weather_description);
            if (data.high_temp) updateField("high_temp", data.high_temp);
            if (data.low_temp) updateField("low_temp", data.low_temp);
            if (data.sunrise_time) updateField("sunrise_time", data.sunrise_time);
            if (data.sunset_time) updateField("sunset_time", data.sunset_time);
            if (data.executive_producers) updateField("executive_producers", data.executive_producers);
            if (data.producers) updateField("producers", data.producers);

            // Populate scenes
            if (data.scenes && data.scenes.length > 0) {
              setScenes(data.scenes);
            }

            // Populate cast
            if (data.cast && data.cast.length > 0) {
              setCast(data.cast);
            }

            // Populate crew
            if (data.crew && data.crew.length > 0) {
              setCrew(data.crew);
            }

            // Populate background
            if (data.background && data.background.length > 0) {
              setBackground(data.background);
            }

            toast({
              title: "Success",
              description: "Call sheet data extracted successfully.",
            });
          }
        } catch (error) {
          console.error('Call sheet parsing error:', error);
          toast({
            title: "Parsing Failed",
            description: error instanceof Error ? error.message : "Failed to parse call sheet",
            variant: "destructive",
          });
        } finally {
          setIsParsingData(false);
        }
      },
      (error) => {
        console.error('PDF processing error:', error);
        toast({
          title: "Upload Failed",
          description: error,
          variant: "destructive",
        });
      }
    );
    
    // Reset file input
    event.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('💾 Submit button clicked');
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('📝 Form data:', { 
        formData, 
        scenesCount: scenes.length, 
        castCount: cast.length,
        crewCount: crew.length,
        backgroundCount: background.length,
        breaksCount: breaks.length,
        requirementsCount: requirements.length
      });
      
      await saveCallSheet(formData, scenes, cast, crew, background, breaks, requirements);
      
      console.log('✅ Save successful, navigating to dashboard...');
      toast({
        title: "Success!",
        description: "Call sheet saved successfully.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save call sheet.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    exportCallSheetToPDF(formData, scenes, cast, crew, background, breaks, requirements);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Call Sheet Generator
            </h1>
            <p className="text-muted-foreground mt-2">Create professional production call sheets with smart OCR</p>
          </div>
          <Film className="h-12 w-12 text-primary" />
        </div>

        {(isProcessingFile || isParsingData) && (
          <Card className="mb-6">
            <CardContent className="py-6">
              {isProcessingFile && (
                <PDFUploadProgress
                  fileName={currentFileName}
                  fileSize={currentFileSize}
                  stage={currentStage}
                  elapsedTime={elapsedTime}
                  progress={progress}
                />
              )}
              {isParsingData && (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-lg">Extracting structured data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Existing Call Sheet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx"
                onChange={handleFileUpload}
                disabled={isProcessingFile || isParsingData}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  PDF, JPG, PNG, or Excel files (Max 20MB)
                </p>
              </Label>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="scenes">Scenes</TabsTrigger>
              <TabsTrigger value="cast">Cast</TabsTrigger>
              <TabsTrigger value="crew">Crew</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Production Company *</Label>
                      <Input required value={formData.production_company} onChange={(e) => updateField("production_company", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Project Name *</Label>
                      <Input required value={formData.project_name} onChange={(e) => updateField("project_name", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Shoot Date *</Label>
                      <Input type="date" required value={formData.shoot_date} onChange={(e) => updateField("shoot_date", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Day Number</Label>
                      <Input placeholder="Day 1 of 30" value={formData.day_number} onChange={(e) => updateField("day_number", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Script Color</Label>
                      <Input value={formData.script_color} onChange={(e) => updateField("script_color", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label>LX Precall</Label>
                      <Input type="time" value={formData.lx_precall_time} onChange={(e) => updateField("lx_precall_time", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Call</Label>
                      <Input type="time" value={formData.unit_call_time} onChange={(e) => updateField("unit_call_time", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Breakfast</Label>
                      <Input type="time" value={formData.courtesy_breakfast_time} onChange={(e) => updateField("courtesy_breakfast_time", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Lunch</Label>
                      <Input type="time" value={formData.lunch_time} onChange={(e) => updateField("lunch_time", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Est. Wrap</Label>
                      <Input type="time" value={formData.wrap_time} onChange={(e) => updateField("wrap_time", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Director</Label>
                      <Input value={formData.director} onChange={(e) => updateField("director", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>1st AD</Label>
                      <Input value={formData.associate_director} onChange={(e) => updateField("associate_director", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Line Producer/PM</Label>
                      <Input value={formData.line_producer} onChange={(e) => updateField("line_producer", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>UPM</Label>
                      <Input value={formData.upm} onChange={(e) => updateField("upm", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Shooting Location</Label>
                    <Input value={formData.shooting_location} onChange={(e) => updateField("shooting_location", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Location Address</Label>
                    <Textarea rows={2} value={formData.location_address} onChange={(e) => updateField("location_address", e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Unit Base</Label>
                      <Input value={formData.unit_base} onChange={(e) => updateField("unit_base", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Base Address</Label>
                      <Input value={formData.unit_base_address} onChange={(e) => updateField("unit_base_address", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Crew Parking</Label>
                      <Input value={formData.crew_parking} onChange={(e) => updateField("crew_parking", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Basecamp</Label>
                      <Input value={formData.basecamp} onChange={(e) => updateField("basecamp", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nearest Hospital</Label>
                      <Input value={formData.nearest_hospital} onChange={(e) => updateField("nearest_hospital", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Hospital Address</Label>
                      <Input value={formData.hospital_address} onChange={(e) => updateField("hospital_address", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Weather Description</Label>
                    <Input value={formData.weather_description} onChange={(e) => updateField("weather_description", e.target.value)} />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>High Temp</Label>
                      <Input value={formData.high_temp} onChange={(e) => updateField("high_temp", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Low Temp</Label>
                      <Input value={formData.low_temp} onChange={(e) => updateField("low_temp", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Sunrise</Label>
                      <Input value={formData.sunrise_time} onChange={(e) => updateField("sunrise_time", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Sunset</Label>
                      <Input value={formData.sunset_time} onChange={(e) => updateField("sunset_time", e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scenes">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Scenes</CardTitle>
                    <Button type="button" onClick={addScene} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Scene
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scenes.map((scene, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <Label>Scene #</Label>
                                <Input value={scene.scene_number} onChange={(e) => updateScene(index, "scene_number", e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Pages</Label>
                                <Input value={scene.pages} onChange={(e) => updateScene(index, "pages", e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>D/N</Label>
                                <Input value={scene.day_night} onChange={(e) => updateScene(index, "day_night", e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Cast IDs</Label>
                                <Input placeholder="1, 2, 3" value={scene.cast_ids?.join(', ')} onChange={(e) => updateScene(index, "cast_ids", e.target.value.split(',').map(s => s.trim()))} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Set & Description</Label>
                              <Textarea rows={2} value={scene.set_description} onChange={(e) => updateScene(index, "set_description", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Location</Label>
                              <Input value={scene.location} onChange={(e) => updateScene(index, "location", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Notes</Label>
                              <Textarea rows={2} value={scene.notes} onChange={(e) => updateScene(index, "notes", e.target.value)} />
                            </div>
                          </div>
                          {scenes.length > 1 && (
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeScene(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cast">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Cast</CardTitle>
                    <Button type="button" onClick={addCast} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cast Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cast.map((member, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <Label>Cast ID</Label>
                                <Input value={member.cast_id} onChange={(e) => updateCast(index, "cast_id", e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Character</Label>
                                <Input value={member.character_name} onChange={(e) => updateCast(index, "character_name", e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Actor</Label>
                                <Input value={member.actor_name} onChange={(e) => updateCast(index, "actor_name", e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Status</Label>
                                <Input placeholder="W/SW" value={member.status} onChange={(e) => updateCast(index, "status", e.target.value)} />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Pickup Time</Label>
                                <Input type="time" value={member.pickup_time} onChange={(e) => updateCast(index, "pickup_time", e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Call Time</Label>
                                <Input type="time" value={member.call_time} onChange={(e) => updateCast(index, "call_time", e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label>Set Ready</Label>
                                <Input type="time" value={member.set_ready_time} onChange={(e) => updateCast(index, "set_ready_time", e.target.value)} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Special Instructions</Label>
                              <Textarea rows={2} value={member.special_instructions} onChange={(e) => updateCast(index, "special_instructions", e.target.value)} />
                            </div>
                          </div>
                          {cast.length > 1 && (
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeCast(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crew">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Crew</CardTitle>
                    <Button type="button" onClick={addCrew} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Crew Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {crew.map((member, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>Department</Label>
                              <Input value={member.department} onChange={(e) => updateCrew(index, "department", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input value={member.title} onChange={(e) => updateCrew(index, "title", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input value={member.name} onChange={(e) => updateCrew(index, "name", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Call Time</Label>
                              <Input type="time" value={member.call_time} onChange={(e) => updateCrew(index, "call_time", e.target.value)} />
                            </div>
                          </div>
                          {crew.length > 1 && (
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeCrew(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="background">
              <Card>
                <CardHeader>
                  <CardTitle>Background Actors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {background.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input type="number" value={item.quantity || ''} onChange={(e) => {
                          const updated = [...background];
                          updated[index].quantity = parseInt(e.target.value) || undefined;
                          setBackground(updated);
                        }} />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input value={item.description} onChange={(e) => {
                          const updated = [...background];
                          updated[index].description = e.target.value;
                          setBackground(updated);
                        }} />
                      </div>
                      <div className="space-y-2">
                        <Label>Call Time</Label>
                        <Input type="time" value={item.call_time} onChange={(e) => {
                          const updated = [...background];
                          updated[index].call_time = e.target.value;
                          setBackground(updated);
                        }} />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input value={item.notes} onChange={(e) => {
                          const updated = [...background];
                          updated[index].notes = e.target.value;
                          setBackground(updated);
                        }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-6">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Call Sheet
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CallSheet;