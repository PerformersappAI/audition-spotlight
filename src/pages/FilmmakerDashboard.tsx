import { RoleCard } from "@/components/RoleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

const mockFilmmakerRoles = [
  {
    id: "1",
    name: "Lead Detective Sarah",
    description: "Strong-willed detective with a mysterious past. Must be comfortable with action sequences and emotional depth.",
    auditionDate: "2024-09-25T14:00:00Z",
    states: ["CA", "NV"],
    contactMethod: "Email",
    project: "Dark Waters - Pilot",
    submissionCount: 23,
    status: "OPEN"
  },
  {
    id: "2",
    name: "Young Entrepreneur", 
    description: "Charismatic tech startup founder, age 25-35. Looking for someone who can portray intelligence and ambition.",
    auditionDate: "2024-09-28T10:30:00Z",
    states: ["CA"],
    contactMethod: "Phone",
    project: "Silicon Dreams",
    submissionCount: 15,
    status: "OPEN"
  },
  {
    id: "3",
    name: "Mysterious Stranger",
    description: "Enigmatic character who appears throughout the series.",
    auditionDate: "2024-09-20T16:00:00Z",
    states: ["NY", "NJ"],
    contactMethod: "Email", 
    project: "The Midnight Series",
    submissionCount: 8,
    status: "LOCKED"
  }
];

const stats = {
  activeRoles: 7,
  maxRoles: 10,
  totalSubmissions: 46,
  upcomingAuditions: 2
};

export const FilmmakerDashboard = () => {
  const [roles] = useState(mockFilmmakerRoles);

  const activeRoles = roles.filter(role => role.status === 'OPEN').length;
  const lockedRoles = roles.filter(role => role.status === 'LOCKED').length;

  return (
    <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center py-12 mb-8">
            <h1 className="text-5xl font-bold text-gold mb-4">
              Filmmaker Dashboard
            </h1>
            <p className="text-xl text-foreground/80 mb-8">
              Manage your casting projects and auditions
            </p>
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              <Plus className="h-5 w-5 mr-2" />
              Create New Role
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-surface border-border shadow-surface">
              <CardHeader className="pb-3">
                <CardDescription className="text-muted-foreground">Active Roles</CardDescription>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {stats.activeRoles}
                  <span className="text-lg text-muted-foreground font-normal">
                    /{stats.maxRoles}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stats.activeRoles / stats.maxRoles) * 100}%` }}
                    />
                  </div>
                  <Badge variant="outline" className="border-primary text-primary">
                    {Math.round((stats.activeRoles / stats.maxRoles) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border shadow-surface">
              <CardHeader className="pb-3">
                <CardDescription className="text-muted-foreground">Total Submissions</CardDescription>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {stats.totalSubmissions}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-success">
                  <Users className="h-4 w-4 mr-1" />
                  <span>+12 this week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border shadow-surface">
              <CardHeader className="pb-3">
                <CardDescription className="text-muted-foreground">Upcoming Auditions</CardDescription>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {stats.upcomingAuditions}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-warning">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Next in 3 days</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border shadow-surface">
              <CardHeader className="pb-3">
                <CardDescription className="text-muted-foreground">Role Slots</CardDescription>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {stats.maxRoles - stats.activeRoles}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Available slots</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role Management Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-1">
                  Your Roles
                </h2>
                <p className="text-muted-foreground">
                  {activeRoles} active, {lockedRoles} locked
                </p>
              </div>
              {stats.activeRoles >= stats.maxRoles && (
                <Card className="bg-warning/10 border-warning/20 p-4">
                  <div className="flex items-center space-x-2 text-warning">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Role limit reached</span>
                  </div>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div key={role.id} className="relative">
                  {role.status === 'LOCKED' && (
                    <Badge className="absolute top-4 right-4 z-10 bg-muted text-muted-foreground">
                      Locked
                    </Badge>
                  )}
                  <RoleCard role={role} variant="filmmaker" />
                </div>
              ))}
            </div>

            {roles.length === 0 && (
              <Card className="bg-surface border-border text-center py-12">
                <CardContent>
                  <div className="text-muted-foreground">
                    <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No roles created yet</h3>
                    <p className="mb-4">Start casting by creating your first audition role.</p>
                    <Button className="bg-gradient-primary hover:shadow-glow">
                      Create Your First Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
};