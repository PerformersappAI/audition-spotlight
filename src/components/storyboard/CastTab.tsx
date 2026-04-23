import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, UserCircle2 } from "lucide-react";

export interface CastMember {
  name: string;
  description: string;
  appears_in_scenes: number[];
}

interface CastTabProps {
  cast: CastMember[];
}

export const CastTab = ({ cast }: CastTabProps) => {
  if (!cast || cast.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed border-border rounded-lg">
        <UserCircle2 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No cast extracted for this project yet.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Process a script through the Detailed Breakdown flow to populate the cast.
        </p>
      </div>
    );
  }

  const initials = (name: string) =>
    name
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-semibold text-base flex items-center gap-2">
          <UserCircle2 className="h-5 w-5 text-primary" />
          Cast ({cast.length})
        </h3>
        <p className="text-xs text-muted-foreground">
          Reference images coming soon — Pro feature.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cast.map((member) => (
          <Card key={member.name} className="border-border">
            <CardContent className="p-4 flex gap-3">
              <Avatar className="h-14 w-14 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {initials(member.name) || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm truncate">{member.name}</h4>
                  <Badge variant="outline" className="text-[10px]">
                    {member.appears_in_scenes.length} scene
                    {member.appears_in_scenes.length === 1 ? "" : "s"}
                  </Badge>
                </div>

                {member.description && (
                  <p className="text-xs text-muted-foreground leading-snug">
                    {member.description}
                  </p>
                )}

                {member.appears_in_scenes.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {member.appears_in_scenes.slice(0, 12).map((n) => (
                      <Badge
                        key={n}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        S{n}
                      </Badge>
                    ))}
                    {member.appears_in_scenes.length > 12 && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        +{member.appears_in_scenes.length - 12}
                      </Badge>
                    )}
                  </div>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  className="w-full mt-1 cursor-not-allowed opacity-70"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generate Reference Image — Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
