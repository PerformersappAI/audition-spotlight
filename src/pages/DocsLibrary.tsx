import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Search, 
  Lock, 
  Users, 
  Music, 
  CheckCircle, 
  Camera, 
  Award 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  size: string;
  premium: boolean;
}

const documentBundles = [
  {
    id: "permits_location",
    name: "Permits & Location",
    icon: Camera,
    description: "Location agreements, filming permits, and property releases",
    documents: [
      { id: "1", title: "Location Agreement Template", description: "Standard location release form", category: "permits_location", format: "PDF", size: "2.3 MB", premium: true },
      { id: "2", title: "Public Space Filming Permit", description: "Template for public filming permits", category: "permits_location", format: "PDF", size: "1.8 MB", premium: true },
      { id: "3", title: "Property Release Form", description: "Release for private property filming", category: "permits_location", format: "PDF", size: "1.2 MB", premium: true },
    ]
  },
  {
    id: "talent_releases",
    name: "Talent & Minor Releases", 
    icon: Users,
    description: "Actor releases, minor consent forms, and talent agreements",
    documents: [
      { id: "4", title: "Adult Talent Release", description: "Standard adult actor release form", category: "talent_releases", format: "PDF", size: "2.1 MB", premium: true },
      { id: "5", title: "Minor Consent Form", description: "Parental consent for minor actors", category: "talent_releases", format: "PDF", size: "1.9 MB", premium: true },
      { id: "6", title: "Background Actor Release", description: "Release for background talent", category: "talent_releases", format: "PDF", size: "1.4 MB", premium: true },
    ]
  },
  {
    id: "music_cues",
    name: "Music & Cue Sheets",
    icon: Music,
    description: "Music licensing forms and cue sheet templates",
    documents: [
      { id: "7", title: "Music License Template", description: "Standard music licensing agreement", category: "music_cues", format: "PDF", size: "2.8 MB", premium: true },
      { id: "8", title: "Cue Sheet Template", description: "Music cue sheet for distribution", category: "music_cues", format: "Excel", size: "1.1 MB", premium: true },
      { id: "9", title: "Composer Agreement", description: "Agreement template for original music", category: "music_cues", format: "PDF", size: "2.2 MB", premium: true },
    ]
  },
  {
    id: "deliverables",
    name: "Deliverables Checklists",
    icon: CheckCircle,
    description: "Comprehensive checklists for post-production and distribution",
    documents: [
      { id: "10", title: "Festival Deliverables Checklist", description: "What festivals typically require", category: "deliverables", format: "PDF", size: "1.6 MB", premium: true },
      { id: "11", title: "Distribution Package Checklist", description: "Complete deliverables for distributors", category: "deliverables", format: "PDF", size: "2.4 MB", premium: true },
      { id: "12", title: "Post-Production Checklist", description: "Step-by-step post workflow", category: "deliverables", format: "PDF", size: "1.8 MB", premium: true },
    ]
  },
  {
    id: "epk_templates", 
    name: "EPK Templates",
    icon: FileText,
    description: "Electronic press kit templates and marketing materials",
    documents: [
      { id: "13", title: "EPK Template - Feature", description: "Complete EPK template for features", category: "epk_templates", format: "PDF", size: "3.2 MB", premium: true },
      { id: "14", title: "EPK Template - Short", description: "EPK template for short films", category: "epk_templates", format: "PDF", size: "2.6 MB", premium: true },
      { id: "15", title: "One-Sheet Template", description: "Marketing one-sheet template", category: "epk_templates", format: "PDF", size: "1.7 MB", premium: true },
    ]
  },
  {
    id: "festival_letters",
    name: "Festival Letters",
    icon: Award,
    description: "Cover letters and submission materials for film festivals",
    documents: [
      { id: "16", title: "Festival Cover Letter Template", description: "Professional festival submission letter", category: "festival_letters", format: "PDF", size: "1.3 MB", premium: true },
      { id: "17", title: "Press Release Template", description: "Festival acceptance press release", category: "festival_letters", format: "PDF", size: "1.5 MB", premium: true },
      { id: "18", title: "Festival Q&A Template", description: "Standard festival questionnaire", category: "festival_letters", format: "PDF", size: "1.1 MB", premium: true },
    ]
  }
];

export default function DocsLibrary() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Check if user has access (in real app, this would check subscription/payment status)
  const hasAccess = !!user; // Simplified for demo

  const allDocuments = documentBundles.flatMap(bundle => bundle.documents);

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (document: Document) => {
    if (!hasAccess) {
      alert("Please create an account to access premium documents.");
      return;
    }
    // In a real app, this would trigger the actual download
    console.log("Downloading:", document.title);
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <Lock className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Premium Document Library</h1>
            <p className="text-muted-foreground mb-8">
              Access essential filmmaking documents, templates, and checklists. 
              Create an account through our project intake form to unlock the complete library.
            </p>
            <Button asChild size="lg">
              <a href="/submit">Complete Project Intake</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Document Library</h1>
          <p className="text-muted-foreground">
            Essential forms, templates, and checklists for your filmmaking journey
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {documentBundles.map((bundle) => (
              <TabsTrigger key={bundle.id} value={bundle.id} className="text-xs">
                {bundle.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentBundles.map((bundle) => {
                const Icon = bundle.icon;
                return (
                  <Card key={bundle.id} className="group hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{bundle.name}</CardTitle>
                          <Badge variant="secondary">{bundle.documents.length} docs</Badge>
                        </div>
                      </div>
                      <CardDescription>{bundle.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedCategory(bundle.id)}
                      >
                        View Documents
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {documentBundles.map((bundle) => (
            <TabsContent key={bundle.id} value={bundle.id}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <bundle.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{bundle.name}</h2>
                    <p className="text-muted-foreground">{bundle.description}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {bundle.documents.map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">{doc.title}</h3>
                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{doc.format}</Badge>
                              <span className="text-xs text-muted-foreground">{doc.size}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleDownload(doc)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}

          {/* Search Results */}
          {searchTerm && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Search Results ({filteredDocuments.length})
              </h3>
              <div className="grid gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{doc.format}</Badge>
                            <span className="text-xs text-muted-foreground">{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleDownload(doc)}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}