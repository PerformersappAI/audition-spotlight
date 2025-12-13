import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  FileText, 
  DollarSign, 
  Users, 
  Film, 
  MapPin, 
  Clock,
  Sparkles,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ProjectDetails {
  budget: string;
  projectType: string;
  runtime: string;
  castSize: string;
  location: string;
  distribution: string;
}

const QUICK_TOPICS = [
  { label: "Agreement Types", question: "Can you explain the different SAG-AFTRA agreement types and which one might be right for my production?" },
  { label: "Current Rates", question: "What are the current SAG-AFTRA day rates and weekly rates for different budget tiers?" },
  { label: "Becoming Signatory", question: "What's the process for becoming a SAG-AFTRA signatory producer? What documents do I need?" },
  { label: "P&H Contributions", question: "What are Pension & Health contributions and when do I need to pay them?" },
  { label: "Background Actors", question: "What are the rules and rates for hiring SAG-AFTRA background actors/extras?" },
  { label: "Union Membership", question: "How can an actor join SAG-AFTRA? What is the Taft-Hartley process?" },
];

const AGREEMENT_RECOMMENDATIONS = [
  { 
    name: "Student Film", 
    budgetRange: "$0 - $0",
    description: "For accredited educational institutions",
    requirements: "Must be enrolled student, educational use only"
  },
  { 
    name: "Micro-Budget", 
    budgetRange: "Under $20K",
    description: "Ultra-small productions with deferred pay",
    requirements: "No minimum rates, deferred compensation allowed"
  },
  { 
    name: "Ultra Low Budget", 
    budgetRange: "$20K - $300K",
    description: "Most common for indie features",
    requirements: "Day rate ~$214, 2 consecutive weeks max"
  },
  { 
    name: "Modified Low Budget", 
    budgetRange: "$300K - $700K",
    description: "Mid-tier independent productions",
    requirements: "Day rate ~$360, full P&H required"
  },
  { 
    name: "Low Budget", 
    budgetRange: "$700K - $2.6M",
    description: "Professional indie productions",
    requirements: "Day rate ~$504, standard union protections"
  },
];

export default function ContractAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm your SAG-AFTRA and Union Contract Assistant. I can help you understand:

• **Agreement Types** - From Student Film to full Theatrical agreements
• **Current Rates** - Day rates, weekly rates, and overtime rules  
• **Becoming Signatory** - Step-by-step process to hire union talent
• **P&H Contributions** - Pension & Health obligations
• **Other Unions** - IATSE, DGA, WGA, and more

What would you like help with today? You can also fill out your project details on the right to get personalized recommendations.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    budget: "",
    projectType: "",
    runtime: "",
    castSize: "",
    location: "",
    distribution: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = useCallback(async (userMessages: Message[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contract-assistant`;

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: userMessages,
        projectDetails: projectDetails.budget ? projectDetails : null
      }),
    });

    if (resp.status === 429) {
      throw new Error("Rate limits exceeded. Please wait a moment and try again.");
    }
    if (resp.status === 402) {
      throw new Error("AI credits required. Please add funds to continue.");
    }
    if (!resp.ok || !resp.body) {
      throw new Error("Failed to start chat stream");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && prev.length > 1) {
                return prev.map((m, i) => 
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  }, [projectDetails]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(updatedMessages);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTopic = (question: string) => {
    sendMessage(question);
  };

  const analyzeProject = () => {
    if (!projectDetails.budget && !projectDetails.projectType) {
      toast({
        title: "Missing Information",
        description: "Please enter at least a budget or project type",
        variant: "destructive",
      });
      return;
    }

    const analysisPrompt = `Based on my project details:
- Budget: ${projectDetails.budget || 'Not specified'}
- Project Type: ${projectDetails.projectType || 'Not specified'}
- Runtime: ${projectDetails.runtime || 'Not specified'} minutes
- Cast Size: ${projectDetails.castSize || 'Not specified'} performers
- Location: ${projectDetails.location || 'Not specified'}
- Distribution: ${projectDetails.distribution || 'Not specified'}

What SAG-AFTRA agreement would you recommend? Please explain the requirements, costs, and steps to become signatory.`;

    sendMessage(analysisPrompt);
  };

  const getSuggestedAgreement = () => {
    const budget = parseFloat(projectDetails.budget?.replace(/[^0-9.]/g, '') || '0');
    if (budget === 0) return null;
    if (budget < 20000) return AGREEMENT_RECOMMENDATIONS[1];
    if (budget < 300000) return AGREEMENT_RECOMMENDATIONS[2];
    if (budget < 700000) return AGREEMENT_RECOMMENDATIONS[3];
    if (budget < 2600000) return AGREEMENT_RECOMMENDATIONS[4];
    return null;
  };

  const suggestedAgreement = getSuggestedAgreement();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="h-10 w-10 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">SAG-AFTRA Contract Assistant</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AI-powered guidance for understanding union contracts and becoming a signatory producer
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <CardTitle>Chat with Contract Assistant</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col overflow-hidden">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-4 py-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === "user" && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-3">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Quick Topics */}
                <div className="py-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Quick Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_TOPICS.map((topic, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickTopic(topic.question)}
                        disabled={isLoading}
                        className="text-xs"
                      >
                        {topic.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="flex gap-2 pt-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about SAG-AFTRA agreements, rates, becoming signatory..."
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                  />
                  <Button 
                    onClick={() => sendMessage(input)} 
                    disabled={isLoading || !input.trim()}
                    className="px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Project Details Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Your Project</CardTitle>
                </div>
                <CardDescription>
                  Enter details for personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Budget
                  </Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $150,000"
                    value={projectDetails.budget}
                    onChange={(e) => setProjectDetails(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select 
                    value={projectDetails.projectType} 
                    onValueChange={(value) => setProjectDetails(prev => ({ ...prev, projectType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Feature Film</SelectItem>
                      <SelectItem value="short">Short Film</SelectItem>
                      <SelectItem value="tv-series">TV Series</SelectItem>
                      <SelectItem value="tv-movie">TV Movie</SelectItem>
                      <SelectItem value="web-series">Web Series</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="music-video">Music Video</SelectItem>
                      <SelectItem value="documentary">Documentary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="runtime" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Runtime (min)
                    </Label>
                    <Input
                      id="runtime"
                      type="number"
                      placeholder="90"
                      value={projectDetails.runtime}
                      onChange={(e) => setProjectDetails(prev => ({ ...prev, runtime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="castSize" className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> Cast Size
                    </Label>
                    <Input
                      id="castSize"
                      type="number"
                      placeholder="10"
                      value={projectDetails.castSize}
                      onChange={(e) => setProjectDetails(prev => ({ ...prev, castSize: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Los Angeles, CA"
                    value={projectDetails.location}
                    onChange={(e) => setProjectDetails(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distribution">Distribution Plan</Label>
                  <Select 
                    value={projectDetails.distribution} 
                    onValueChange={(value) => setProjectDetails(prev => ({ ...prev, distribution: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theatrical">Theatrical Release</SelectItem>
                      <SelectItem value="streaming">Streaming Platform</SelectItem>
                      <SelectItem value="festival">Film Festival Circuit</SelectItem>
                      <SelectItem value="broadcast">Broadcast TV</SelectItem>
                      <SelectItem value="digital">Digital/VOD</SelectItem>
                      <SelectItem value="undecided">Undecided</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={analyzeProject} 
                  className="w-full"
                  disabled={isLoading}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze My Project
                </Button>
              </CardContent>
            </Card>

            {/* Suggested Agreement */}
            {suggestedAgreement && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Suggested Agreement</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{suggestedAgreement.name}</span>
                      <Badge variant="secondary">{suggestedAgreement.budgetRange}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestedAgreement.description}</p>
                    <p className="text-xs text-muted-foreground">{suggestedAgreement.requirements}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resources Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Official Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a 
                  href="https://www.sagaftra.org/production-center" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                >
                  SAG-AFTRA Production Center →
                </a>
                <a 
                  href="https://www.sagaftra.org/contracts-industry-resources" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                >
                  Contracts & Industry Resources →
                </a>
                <a 
                  href="https://www.sagaftra.org/membership" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                >
                  SAG-AFTRA Membership Info →
                </a>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>
                    This AI provides educational information only, not legal advice. 
                    Always verify current rates and requirements with SAG-AFTRA directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
