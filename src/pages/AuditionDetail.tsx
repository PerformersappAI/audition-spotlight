import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Film,
  Clock,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";

export default function AuditionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [audition, setAudition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAudition();
      if (user) checkIfApplied();
    }
  }, [id, user]);

  const fetchAudition = async () => {
    try {
      const { data, error } = await supabase
        .from("audition_notices")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setAudition(data);
    } catch (error) {
      console.error("Error fetching audition:", error);
      toast({
        title: "Error",
        description: "Failed to load audition details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfApplied = async () => {
    if (!user || !id) return;
    
    try {
      const { data } = await supabase
        .from("applications")
        .select("id")
        .eq("applicant_user_id", user.id)
        .eq("project_id", id)
        .maybeSingle();

      setHasApplied(!!data);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for auditions",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsApplying(true);
    try {
      const { error } = await supabase.from("applications").insert({
        applicant_user_id: user.id,
        project_id: id,
        status: "pending",
      });

      if (error) throw error;

      setHasApplied(true);
      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the casting director",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading audition details...</p>
      </div>
    );
  }

  if (!audition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Audition not found</p>
          <Button onClick={() => navigate("/auditions")}>Browse Auditions</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/auditions")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Auditions
        </Button>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl mb-2">{audition.project_name}</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">{audition.project_type}</Badge>
                  {audition.union_status && (
                    <Badge variant="outline">{audition.union_status}</Badge>
                  )}
                </div>
              </div>
              {hasApplied ? (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Applied
                </Badge>
              ) : (
                <Button onClick={handleApply} disabled={isApplying} size="lg">
                  Apply Now
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Role Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role: {audition.role_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Character Description</h4>
              <p className="text-muted-foreground">{audition.role_description}</p>
            </div>

            {audition.character_background && (
              <div>
                <h4 className="font-semibold mb-2">Character Background</h4>
                <p className="text-muted-foreground">{audition.character_background}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {audition.age_range && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">Age Range</h4>
                  <p className="text-muted-foreground">{audition.age_range}</p>
                </div>
              )}
              {audition.gender_preference && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">Gender</h4>
                  <p className="text-muted-foreground">{audition.gender_preference}</p>
                </div>
              )}
              {audition.ethnicity_requirement && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">Ethnicity</h4>
                  <p className="text-muted-foreground">{audition.ethnicity_requirement}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-sm mb-1">Work Type</h4>
                <p className="text-muted-foreground">{audition.work_type}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work & Compensation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold text-sm">Rate of Pay</h4>
                  <p className="text-muted-foreground">{audition.rate_of_pay}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold text-sm">Location</h4>
                  <p className="text-muted-foreground">{audition.location}</p>
                </div>
              </div>
              {audition.work_dates && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold text-sm">Work Dates</h4>
                    <p className="text-muted-foreground">{audition.work_dates}</p>
                  </div>
                </div>
              )}
              {audition.audition_date && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold text-sm">Audition Date</h4>
                    <p className="text-muted-foreground">
                      {format(new Date(audition.audition_date), "PPp")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Project Story */}
        {audition.storyline && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                Project Storyline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{audition.storyline}</p>
            </CardContent>
          </Card>
        )}

        {/* Production Credits */}
        {(audition.producer ||
          audition.director ||
          audition.casting_director ||
          audition.line_producer ||
          audition.first_ad) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Production Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {audition.producer && (
                  <div>
                    <span className="font-semibold">Producer:</span> {audition.producer}
                  </div>
                )}
                {audition.director && (
                  <div>
                    <span className="font-semibold">Director:</span> {audition.director}
                  </div>
                )}
                {audition.casting_director && (
                  <div>
                    <span className="font-semibold">Casting Director:</span>{" "}
                    {audition.casting_director}
                  </div>
                )}
                {audition.line_producer && (
                  <div>
                    <span className="font-semibold">Line Producer:</span> {audition.line_producer}
                  </div>
                )}
                {audition.first_ad && (
                  <div>
                    <span className="font-semibold">1st AD:</span> {audition.first_ad}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submission Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Submission Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Deadline</h4>
              <p className="text-muted-foreground">
                {format(new Date(audition.submission_deadline), "PPPP")}
              </p>
            </div>

            {audition.materials_required && audition.materials_required.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Required Materials</h4>
                <div className="flex flex-wrap gap-2">
                  {audition.materials_required.map((material: string) => (
                    <Badge key={material} variant="secondary">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {audition.special_instructions && (
              <div>
                <h4 className="font-semibold mb-2">Special Instructions</h4>
                <p className="text-muted-foreground whitespace-pre-line">
                  {audition.special_instructions}
                </p>
              </div>
            )}

            {audition.allow_online_demo && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                Online demo clips accepted
              </div>
            )}
          </CardContent>
        </Card>

        {/* Apply Button */}
        {!hasApplied && (
          <Card>
            <CardContent className="py-6 flex justify-center">
              <Button onClick={handleApply} disabled={isApplying} size="lg">
                {isApplying ? "Submitting..." : "Apply for This Role"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
