import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Award, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVerifyCertificate } from '@/hooks/useCertifications';
import { format } from 'date-fns';

export default function VerifyCertificate() {
  const { certificateNumber } = useParams<{ certificateNumber: string }>();
  const { data: certificate, isLoading } = useVerifyCertificate(certificateNumber || '');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  const isValid = !!certificate;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <Card className={isValid ? 'border-green-500/50' : 'border-destructive/50'}>
          <CardHeader className="text-center">
            {isValid ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-500/10 p-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Certificate Verified</CardTitle>
                <p className="text-muted-foreground">
                  This certificate is authentic and has been issued by Feifer Film Academy
                  through filmmaker.AI
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-destructive/10 p-4">
                    <XCircle className="h-12 w-12 text-destructive" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Certificate Not Found</CardTitle>
                <p className="text-muted-foreground">
                  The certificate number "{certificateNumber}" could not be verified in our
                  system
                </p>
              </div>
            )}
          </CardHeader>

          {isValid && certificate && (
            <CardContent className="space-y-6">
              <div className="border-t pt-6">
                <div className="grid gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Certificate Holder</div>
                    <div className="font-semibold text-lg">
                      {certificate.profile?.first_name} {certificate.profile?.last_name}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Course Completed</div>
                    <div className="font-semibold">{certificate.academy_courses?.title}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Category</div>
                    <Badge variant="secondary">{certificate.academy_courses?.category}</Badge>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Issue Date</div>
                    <div className="font-semibold">
                      {format(new Date(certificate.issued_at), 'MMMM d, yyyy')}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Certificate Number</div>
                    <div className="font-mono text-sm">{certificate.certificate_number}</div>
                  </div>

                  {certificate.skills_earned && certificate.skills_earned.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Skills Earned</div>
                      <div className="flex flex-wrap gap-2">
                        {certificate.skills_earned.map((skill: string) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-accent/50 rounded-lg p-4 flex items-start gap-3">
                <Award className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold mb-1">Verified by filmmaker.AI</div>
                  <p className="text-sm text-muted-foreground">
                    This certificate was issued through the Feifer Film Academy training
                    platform powered by filmmaker.AI
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            Want to earn your own certification?
          </p>
          <Button asChild>
            <Link to="/training">Browse Courses</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
