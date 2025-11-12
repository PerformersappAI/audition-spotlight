import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Clapperboard, Sparkles, Calendar, Users, Trophy, FileText } from 'lucide-react';

interface RelatedToolsSectionProps {
  relatedTool: string | null;
}

export function RelatedToolsSection({ relatedTool }: RelatedToolsSectionProps) {
  const toolMap: Record<string, { name: string; route: string; icon: any; description: string }> = {
    script_analysis: {
      name: 'Script Analysis',
      route: '/script-analysis',
      icon: Sparkles,
      description: 'Analyze your script with AI',
    },
    storyboarding: {
      name: 'Storyboarding',
      route: '/storyboarding',
      icon: Clapperboard,
      description: 'Create visual storyboards',
    },
    calendar: {
      name: 'Production Calendar',
      route: '/calendar',
      icon: Calendar,
      description: 'Schedule your production',
    },
    auditions: {
      name: 'Create Auditions',
      route: '/create-audition',
      icon: Users,
      description: 'Post casting calls',
    },
    festivals: {
      name: 'Festival Submitter',
      route: '/festivals',
      icon: Trophy,
      description: 'Submit to film festivals',
    },
    docs_library: {
      name: 'Document Library',
      route: '/library',
      icon: FileText,
      description: 'Access templates & forms',
    },
  };

  if (!relatedTool || !toolMap[relatedTool]) {
    return null;
  }

  const tool = toolMap[relatedTool];
  const Icon = tool.icon;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          Apply What You've Learned
        </CardTitle>
        <CardDescription>
          Put your knowledge into practice with our integrated tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium mb-1">{tool.name}</p>
            <p className="text-sm text-muted-foreground">{tool.description}</p>
          </div>
          <Button asChild>
            <Link to={tool.route}>
              Open Tool
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
