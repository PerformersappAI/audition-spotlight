import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RoleCardProps {
  role: {
    id: string;
    name: string;
    description: string;
    auditionDate: string;
    states: string[];
    contactMethod: string;
    project?: string;
    submissionCount?: number;
    image?: string;
  };
  showActions?: boolean;
  variant?: 'actor' | 'filmmaker';
}

export const RoleCard = ({ role, showActions = true, variant = 'actor' }: RoleCardProps) => {
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: "Application Submitted",
      description: `Your application for "${role.name}" has been submitted successfully.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-surface border-border shadow-surface hover:shadow-glow transition-all duration-300 group overflow-hidden">
      {/* Character Image */}
      {role.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={role.image} 
            alt={`Character reference for ${role.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
          {variant === 'filmmaker' && role.submissionCount !== undefined && (
            <Badge variant="secondary" className="absolute top-3 right-3 bg-background/90 text-foreground">
              <Users className="h-3 w-3 mr-1" />
              {role.submissionCount}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-foreground group-hover:text-primary transition-colors">
              {role.name}
            </CardTitle>
            {role.project && (
              <CardDescription className="text-muted-foreground">
                {role.project}
              </CardDescription>
            )}
          </div>
          {!role.image && variant === 'filmmaker' && role.submissionCount !== undefined && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              {role.submissionCount}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {role.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">
              {formatDate(role.auditionDate)}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <div className="flex flex-wrap gap-1">
              {role.states.map((state) => (
                <Badge key={state} variant="outline" className="text-xs border-primary/20 text-primary">
                  {state}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Contact: {role.contactMethod}
          </span>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-4 border-t border-border/50">
          {variant === 'actor' ? (
            <div className="flex space-x-2 w-full">
              <Button 
                onClick={handleApply}
                className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                Apply Now
              </Button>
              <Button variant="outline" className="border-primary/20 hover:border-primary">
                Details
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2 w-full">
              <Button variant="outline" className="flex-1">
                View Submissions
              </Button>
              <Button variant="ghost" className="text-destructive hover:text-destructive">
                Clear Role
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};