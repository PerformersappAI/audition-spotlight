import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { User, MapPin, Calendar, Award, Briefcase } from "lucide-react";

export const ActorSidebar = () => {
  const { userProfile } = useAuth();

  // Mock data - will be replaced with actual profile data
  const actorProfile = {
    name: userProfile?.first_name && userProfile?.last_name 
      ? `${userProfile.first_name} ${userProfile.last_name}` 
      : "Actor Name",
    location: userProfile?.location || "Location",
    ageRange: "25-35",
    unionStatus: "Non-Union",
    skills: "Stage Combat, Dance, Singing",
    profileImage: null,
  };

  const getInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`;
    }
    return "AN";
  };

  return (
    <Card className="w-80 sticky top-6 self-start bg-surface/80 backdrop-blur-sm border-surface-dark/50">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarImage src={actorProfile.profileImage || undefined} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary-glow text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="text-xl font-bold">{actorProfile.name}</h3>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Location</p>
            <p className="font-medium">{actorProfile.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Age Range</p>
            <p className="font-medium">{actorProfile.ageRange}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <Award className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Union Status</p>
            <p className="font-medium">{actorProfile.unionStatus}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Special Skills</p>
            <p className="font-medium">{actorProfile.skills}</p>
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
