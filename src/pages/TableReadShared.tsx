import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Headphones, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface SharedRead {
  id: string;
  title: string;
  audio_url: string | null;
  character_count: number;
  line_count: number;
  is_public: boolean;
}

export default function TableReadShared() {
  const { id } = useParams<{ id: string }>();
  const [read, setRead] = useState<SharedRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from("table_reads")
        .select("id, title, audio_url, character_count, line_count, is_public")
        .eq("id", id)
        .maybeSingle();
      if (error) setError(error.message);
      else if (!data) setError("This table read doesn't exist or isn't shared publicly.");
      else setRead(data as SharedRead);
      setLoading(false);
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/table-read">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <Headphones className="w-5 h-5 text-pink-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Shared Table Read</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {loading && <p className="text-gray-400">Loading…</p>}
        {error && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-10 h-10 text-pink-400 mx-auto mb-3" />
              <p className="text-gray-200">{error}</p>
            </CardContent>
          </Card>
        )}
        {read && read.audio_url && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{read.title}</CardTitle>
              <p className="text-sm text-gray-400">{read.character_count} characters · {read.line_count} lines</p>
            </CardHeader>
            <CardContent>
              <audio controls src={read.audio_url} className="w-full" />
              <p className="text-xs text-gray-500 mt-4">Made with Filmmaker Genius — Table Read.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
