import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target,
  CheckCircle,
  AlertCircle,
  Star,
  User,
  Volume2,
  Video,
  Lightbulb,
  Heart,
  Zap
} from 'lucide-react';

interface VideoAnalysisResult {
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
}

interface VideoEvaluationResultsProps {
  analysis: VideoAnalysisResult;
  videoTitle?: string;
  characterName?: string;
  sceneDescription?: string;
}

export const VideoEvaluationResults: React.FC<VideoEvaluationResultsProps> = ({
  analysis,
  videoTitle,
  characterName,
  sceneDescription
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-blue-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Video</h4>
              <p className="text-sm text-muted-foreground">{videoTitle || 'Untitled'}</p>
            </div>
            {characterName && (
              <div>
                <h4 className="font-medium mb-2">Character</h4>
                <p className="text-sm text-muted-foreground">{characterName}</p>
              </div>
            )}
            {sceneDescription && (
              <div>
                <h4 className="font-medium mb-2">Scene</h4>
                <p className="text-sm text-muted-foreground">{sceneDescription}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overall Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Overall Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`inline-block p-8 rounded-lg ${getScoreBgColor(analysis.performance.score)}`}>
              <div className="text-6xl font-bold mb-2">
                <span className={getScoreColor(analysis.performance.score)}>
                  {analysis.performance.score}
                </span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <div className="text-lg font-medium">
                {getScoreLabel(analysis.performance.score)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="emotional">Emotional</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.performance.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.performance.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.technical).map(([key, score]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    {key === 'audio' && <Volume2 className="h-4 w-4" />}
                    {key === 'video' && <Video className="h-4 w-4" />}
                    {key === 'lighting' && <Lightbulb className="h-4 w-4" />}
                    {key === 'framing' && <Target className="h-4 w-4" />}
                    {key}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Score</span>
                      <span className={`font-bold ${getScoreColor(score)}`}>
                        {score}/100
                      </span>
                    </div>
                    <Progress value={score} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {getScoreLabel(score)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emotional" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(analysis.emotional).map(([key, score]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    {key === 'engagement' && <Heart className="h-4 w-4" />}
                    {key === 'authenticity' && <User className="h-4 w-4" />}
                    {key === 'charisma' && <Zap className="h-4 w-4" />}
                    {key}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Score</span>
                      <span className={`font-bold ${getScoreColor(score)}`}>
                        {score}/100
                      </span>
                    </div>
                    <Progress value={score} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {getScoreLabel(score)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                Detailed Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {analysis.feedback}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={analysis.performance.score >= 80 ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <User className="h-3 w-3" />
              Performance: {analysis.performance.score}/100
            </Badge>
            <Badge 
              variant={analysis.technical.audio >= 80 ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <Volume2 className="h-3 w-3" />
              Audio: {analysis.technical.audio}/100
            </Badge>
            <Badge 
              variant={analysis.technical.video >= 80 ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <Video className="h-3 w-3" />
              Video: {analysis.technical.video}/100
            </Badge>
            <Badge 
              variant={analysis.emotional.engagement >= 80 ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <Heart className="h-3 w-3" />
              Engagement: {analysis.emotional.engagement}/100
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
