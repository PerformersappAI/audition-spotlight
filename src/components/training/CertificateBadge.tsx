import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCertificationStats } from '@/hooks/useCertifications';
import { Link } from 'react-router-dom';

interface CertificateBadgeProps {
  userId: string;
  variant?: 'compact' | 'detailed' | 'inline';
}

export function CertificateBadge({ userId, variant = 'compact' }: CertificateBadgeProps) {
  const { data: stats, isLoading } = useCertificationStats(userId);

  if (isLoading || !stats || stats.totalCertifications === 0) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <Link to="/training/certifications">
        <Badge variant="secondary" className="gap-1 hover:bg-secondary/80 transition-colors">
          <Award className="h-3 w-3" />
          {stats.totalCertifications} {stats.totalCertifications === 1 ? 'Certification' : 'Certifications'}
        </Badge>
      </Link>
    );
  }

  if (variant === 'inline') {
    return (
      <Link to="/training/certifications" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <Award className="h-4 w-4" />
        <span>{stats.totalCertifications} certifications earned</span>
      </Link>
    );
  }

  // Detailed variant
  return (
    <Link to="/training/certifications">
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Your Certifications</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {stats.totalCertifications} certificates earned
              </p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>• {stats.skillsAcquired} skills acquired</span>
                <span>• {stats.totalHours} hours completed</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
