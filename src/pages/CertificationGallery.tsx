import { Award, TrendingUp, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CertificateDisplay } from '@/components/training/CertificateDisplay';
import { ShareCertificateButton } from '@/components/training/ShareCertificateButton';
import { useCertifications, useCertificationStats } from '@/hooks/useCertifications';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function CertificationGallery() {
  const { user } = useAuth();
  const { data: certifications, isLoading } = useCertifications(user?.id);
  const { data: stats } = useCertificationStats(user?.id || '');
  const [selectedCert, setSelectedCert] = useState<any>(null);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Sign In to View Certifications</h1>
        <p className="text-muted-foreground mb-6">
          Access your earned certificates and showcase your achievements
        </p>
        <Button asChild>
          <Link to="/auth">Sign In / Sign Up</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-48 bg-muted rounded-lg" />
            <div className="h-48 bg-muted rounded-lg" />
            <div className="h-48 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const hasCertifications = certifications && certifications.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Certifications</h1>
        <p className="text-muted-foreground">
          Professional credentials earned through Feifer Film Academy
        </p>
      </div>

      {hasCertifications ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats?.totalCertifications || 0}</div>
                    <div className="text-sm text-muted-foreground">Certifications Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats?.skillsAcquired || 0}</div>
                    <div className="text-sm text-muted-foreground">Skills Acquired</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats?.totalHours || 0}</div>
                    <div className="text-sm text-muted-foreground">Hours Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certificates Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert: any) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Award className="h-8 w-8 text-primary" />
                      <ShareCertificateButton
                        certificateNumber={cert.certificate_number}
                        courseTitle={cert.academy_courses?.title || 'Course'}
                        certificateUrl={cert.certificate_url}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1">{cert.academy_courses?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(cert.issued_at), 'MMMM d, yyyy')}
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <span className="font-mono">{cert.certificate_number}</span>
                    </div>

                    {cert.skills_earned && cert.skills_earned.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {cert.skills_earned.slice(0, 3).map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {cert.skills_earned.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{cert.skills_earned.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedCert(cert)}
                    >
                      View Certificate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Skills Dashboard */}
          {stats?.skills && stats.skills.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Skills Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stats.skills.map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Explore more courses to expand your skillset and earn additional certifications
              </p>
              <Button asChild>
                <Link to="/training">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <CardContent>
            <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Certifications Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Complete courses to earn professional certifications from Feifer Film Academy.
              Start learning today!
            </p>
            <Button asChild size="lg">
              <Link to="/training">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Certificate Modal */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificate of Completion</DialogTitle>
          </DialogHeader>
          {selectedCert && (
            <div className="space-y-4">
              <CertificateDisplay
                certificateNumber={selectedCert.certificate_number}
                userName={`${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || 'Student'}
                courseTitle={selectedCert.academy_courses?.title || 'Course'}
                issuedAt={selectedCert.issued_at}
                skills={selectedCert.skills_earned || []}
                duration={selectedCert.academy_courses?.duration_hours}
              />
              <div className="flex justify-center">
                <ShareCertificateButton
                  certificateNumber={selectedCert.certificate_number}
                  courseTitle={selectedCert.academy_courses?.title || 'Course'}
                  certificateUrl={selectedCert.certificate_url}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
