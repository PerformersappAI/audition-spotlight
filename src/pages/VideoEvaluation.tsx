import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Clock, 
  User, 
  Target,
  Brain,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { VideoUploadForm } from "@/components/video/VideoUploadForm";
import { VideoEvaluationResults } from "@/components/video/VideoEvaluationResults";

interface VideoAnalysis {
  id: string;
  videoFile: File | null;
  videoUrl: string;
  title: string;
  description: string;
  category: string;
  analysisResult: {
    performance: {
      score: number;
      strengths: string[];
      improvements: string[];
    };
    technical: {
      audio: number;
      video: number;
      lighting: number;
      framing: number;
    };
    emotional: {
      engagement: number;
      authenticity: number;
      charisma: number;
    };
    feedback: string;
    recommendations: string[];
  };
  createdAt: Date;
  status: "pending" | "analyzing" | "completed" | "error";
}

const VideoEvaluation = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<VideoAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<VideoAnalysis | null>(null);

  const handleAnalysisComplete = (analysis: any) => {
    const newAnalysis: VideoAnalysis = {
      id: Date.now().toString(),
      videoFile: null,
      videoUrl: '',
      title: 'Analysis Result',
      description: '',
      category: 'Analysis',
      analysisResult: analysis,
      createdAt: new Date(),
      status: 'completed'
    };

    setAnalyses(prev => [newAnalysis, ...prev]);
    setCurrentAnalysis(newAnalysis);

    toast({
      title: "Analysis complete",
      description: "Your video has been analyzed successfully"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-12 mb-8">
          <h1 className="text-5xl font-bold text-gold mb-4">Video Evaluation</h1>
          <p className="text-xl text-foreground/80">Upload and analyze video performances with AI</p>
        </div>

        {/* Video Upload Form */}
        <VideoUploadForm
          onAnalysisComplete={handleAnalysisComplete}
          evaluationType="standalone"
        />

        {/* Analysis Results */}
        {currentAnalysis && currentAnalysis.status === "completed" && (
          <VideoEvaluationResults
            analysis={currentAnalysis.analysisResult}
            videoTitle={currentAnalysis.title}
          />
        )}

        {/* Analysis History */}
        {analyses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Analysis History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => setCurrentAnalysis(analysis)}
                  >
                    <div className="flex items-center gap-3">
                      <Video className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{analysis.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {analysis.category} • {analysis.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={analysis.status === "completed" ? "default" : "secondary"}>
                        {analysis.status}
                      </Badge>
                      {analysis.status === "completed" && (
                        <span className="text-sm font-medium">
                          {analysis.analysisResult.performance.score}/100
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VideoEvaluation;
