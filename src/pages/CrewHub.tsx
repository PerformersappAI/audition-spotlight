import { Layout } from "@/components/Layout";
import { CrewSidebar } from "@/components/CrewSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Briefcase } from "lucide-react";

const CrewHub = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Crew Profile",
      description: "Manage your resume, portfolio, and reel",
      icon: User,
      route: "/crew/profile",
      gradient: "from-burgundy to-burgundy-dark",
    },
    {
      title: "Crew Jobs",
      description: "Browse and apply for crew positions",
      icon: Briefcase,
      route: "/crew/jobs",
      gradient: "from-burgundy to-burgundy-dark",
    },
  ];

  return (
    <Layout userRole="CREW">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface/30">
        <div className="flex gap-6 p-6 max-w-7xl mx-auto">
          {/* Sidebar */}
          <CrewSidebar />

          {/* Main Content */}
          <div className="flex-1">
            <div className="text-center py-12 mb-8">
              <h1 className="text-5xl font-bold text-gold mb-4">
                Crew Hub
              </h1>
              <p className="text-xl text-foreground/80">
                Manage your crew profile and find job opportunities
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
                        {module.title === "Crew Profile" ? "Edit Profile" : "View Jobs"}
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

export default CrewHub;