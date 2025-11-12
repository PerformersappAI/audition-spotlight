import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Video, FileText, User, Calendar, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AuditionSubmission {
  id: string;
  actorName: string;
  email: string;
  role: string;
  videoFile: File | null;
  resumeFile: File | null;
  headshot: File | null;
  notes: string;
  submittedAt: Date;
  rating?: number;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
}

const UploadAuditions = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<AuditionSubmission[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Mock projects for the filmmaker
  const projects = [
    { id: "1", title: "Indie Drama 2024" },
    { id: "2", title: "Short Film Project" },
    { id: "3", title: "Commercial Casting" }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type.startsWith('video/')) {
        toast({
          title: "Video uploaded",
          description: `${file.name} is ready for review`
        });
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "reviewed": return "bg-blue-500";
      case "shortlisted": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const updateSubmissionStatus = (id: string, status: AuditionSubmission["status"]) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, status } : sub)
    );
    toast({
      title: "Status Updated",
      description: `Submission marked as ${status}`
    });
  };

  const rateSubmission = (id: string, rating: number) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, rating } : sub)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-12 mb-8">
          <h1 className="text-5xl font-bold text-gold mb-4">Audition Management</h1>
          <p className="text-xl text-foreground/80">Upload, review, and manage actor submissions</p>
        </div>

        {/* Project Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Select Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a project to manage auditions for" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Upload Area */}
        {selectedProject && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Audition Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? "border-primary bg-primary/10" 
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Drop audition files here or click to browse
                </h3>
                <p className="text-muted-foreground mb-4">
                  Supported: MP4, MOV, AVI videos • PDF resumes • JPG, PNG headshots
                </p>
                <Input
                  type="file"
                  multiple
                  accept="video/*,.pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Browse Files
                  </Button>
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Audition Submissions
              <Badge variant="secondary">{submissions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No submissions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Audition submissions will appear here once actors start uploading
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{submission.actorName}</h3>
                          <p className="text-sm text-muted-foreground">{submission.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs text-muted-foreground">
                              {submission.submittedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => rateSubmission(submission.id, star)}
                              className={`h-4 w-4 ${
                                submission.rating && star <= submission.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          ))}
                        </div>

                        {/* Status Badge */}
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>

                        {/* Action Buttons */}
                        <Select
                          value={submission.status}
                          onValueChange={(value: AuditionSubmission["status"]) => 
                            updateSubmissionStatus(submission.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Files */}
                    <div className="flex items-center gap-4 mt-4">
                      {submission.videoFile && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Video className="h-4 w-4" />
                          Audition Video
                        </div>
                      )}
                      {submission.resumeFile && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          Resume
                        </div>
                      )}
                      {submission.headshot && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          Headshot
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {submission.notes && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm">{submission.notes}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {submissions.filter(s => s.status === "pending").length}
              </div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {submissions.filter(s => s.status === "shortlisted").length}
              </div>
              <p className="text-sm text-muted-foreground">Shortlisted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {submissions.filter(s => s.rating && s.rating >= 4).length}
              </div>
              <p className="text-sm text-muted-foreground">4+ Star Rated</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadAuditions;