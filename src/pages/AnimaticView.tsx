import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Loader2 } from "lucide-react";

interface PublicAnimatic {
  id: string;
  project_title: string | null;
  animatic_url: string | null;
}

const AnimaticView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [data, setData] = useState<PublicAnimatic | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!projectId) return;
      const { data: row, error } = await supabase
        .from("storyboard_projects")
        .select("id, project_title, animatic_url")
        .eq("id", projectId)
        .maybeSingle();

      if (error || !row || !(row as any).animatic_url) {
        setNotFound(true);
      } else {
        setData(row as any);
      }
      setLoading(false);
    };
    load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !data?.animatic_url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-3">
            <Film className="h-10 w-10 mx-auto text-muted-foreground" />
            <h1 className="font-semibold text-lg">Animatic not available</h1>
            <p className="text-sm text-muted-foreground">
              This share link is invalid or the animatic hasn't been exported yet.
            </p>
            <Button asChild>
              <Link to="/storyboarding">Create your own →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">{data.project_title || "Untitled animatic"}</h1>
        </div>
        <Button asChild size="sm">
          <Link to="/storyboarding">Create your own →</Link>
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="relative max-w-4xl w-full">
          <img
            src={data.animatic_url}
            alt={`${data.project_title || "Animatic"} preview`}
            className="w-full rounded-lg shadow-lg bg-black"
          />
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Created with FilmmakerGenius.com
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-muted-foreground py-4">
        Share storyboards and animatics with your team —{" "}
        <Link to="/" className="text-primary underline">
          FilmmakerGenius
        </Link>
      </footer>
    </div>
  );
};

export default AnimaticView;
