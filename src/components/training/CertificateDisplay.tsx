import { Award, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface CertificateDisplayProps {
  certificateNumber: string;
  userName: string;
  courseTitle: string;
  issuedAt: string;
  skills: string[];
  duration?: number;
}

export function CertificateDisplay({
  certificateNumber,
  userName,
  courseTitle,
  issuedAt,
  skills,
  duration,
}: CertificateDisplayProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-background to-accent/20 border-2">
      <CardContent className="p-8 md:p-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-primary" />
              <span className="font-semibold text-lg">filmmaker.AI</span>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="font-semibold">Feifer Film Academy</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Certificate of Completion
            </h1>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Verified Certification</span>
            </div>
          </div>

          {/* Body */}
          <div className="text-center space-y-6 py-8">
            <p className="text-lg text-muted-foreground">This certifies that</p>
            
            <div className="text-4xl font-bold text-primary">
              {userName}
            </div>

            <p className="text-lg text-muted-foreground">has successfully completed</p>

            <div className="text-2xl font-semibold">
              {courseTitle}
            </div>

            {duration && (
              <div className="text-sm text-muted-foreground">
                Duration: {duration} hours
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Completed on {format(new Date(issuedAt), 'MMMM d, yyyy')}
            </div>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-center">Skills Earned:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-end justify-between pt-8 border-t">
            <div className="text-sm text-muted-foreground">
              <div className="font-semibold">Certificate No:</div>
              <div className="font-mono">{certificateNumber}</div>
            </div>
            <div className="text-sm text-muted-foreground text-right">
              <div className="font-semibold">Verify at:</div>
              <div className="text-primary">filmmaker.ai/verify</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
