import { Layout } from "@/components/Layout";
import { ActorSidebar } from "@/components/ActorSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Film } from "lucide-react";

const ActorHub = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Actor's Profile",
      description: "Manage your headshots, resume, and showreel",
      icon: User,
      route: "/actor/profile",
      gradient: "from-burgundy to-burgundy-dark",
    },
    {
      title: "Auditions",
      description: "Browse and apply for audition opportunities",
      icon: Film,
      route: "/auditions",
      gradient: "from-burgundy to-burgundy-dark",
    },
  ];

  return (
    <Layout userRole="ACTOR">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface/30">
        <div className="flex gap-6 p-6 max-w-7xl mx-auto">
          {/* Sidebar */}
          <ActorSidebar />

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-2">
                Actor Hub
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your acting career and find opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Card
                    key={module.title}
                    className="group hover:shadow-elegant transition-all duration-300 border-surface-dark/50 bg-surface/50 backdrop-blur-sm hover:scale-105"
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription className="text-base">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button
                        onClick={() => navigate(module.route)}
                        variant="burgundy"
                        className="w-full"
                      >
                        {module.title === "Actor's Profile" ? "Edit Profile" : "View Auditions"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActorHub;
