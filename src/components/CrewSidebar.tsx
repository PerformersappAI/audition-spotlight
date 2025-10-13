import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { User, MapPin, Briefcase, Award, Wrench } from "lucide-react";

export const CrewSidebar = () => {
  const { userProfile } = useAuth();

  // Mock data - will be replaced with actual profile data
  const crewProfile = {
    name: userProfile?.first_name && userProfile?.last_name 
      ? `${userProfile.first_name} ${userProfile.last_name}` 
      : "Crew Member",
    location: userProfile?.location || "Location",
    department: "Camera Department",
    role: "Director of Photography",
    experience: "8+ years",
    skills: "RED Camera, ARRI Alexa, Steadicam, Lighting",
    unionStatus: "IATSE Local 600",
  };

  const getInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`;
    }
    return "CM";
  };

  return (
    <Card className="w-80 sticky top-6 self-start bg-surface/80 backdrop-blur-sm border-surface-dark/50">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary-glow text-white">
              <Wrench className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="text-xl font-bold">{crewProfile.name}</h3>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Location</p>
            <p className="font-medium">{crewProfile.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Department & Role</p>
            <p className="font-medium">{crewProfile.department}</p>
            <p className="font-medium text-muted-foreground">{crewProfile.role}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <Award className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Experience</p>
            <p className="font-medium">{crewProfile.experience}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <Wrench className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Skills & Equipment</p>
            <p className="font-medium">{crewProfile.skills}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <Award className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Union Status</p>
            <p className="font-medium">{crewProfile.unionStatus}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {/* Navigate to profile edit */}}
        >
          <User className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
};