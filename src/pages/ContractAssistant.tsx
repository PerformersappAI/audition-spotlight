import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Upload,
  Phone,
  Building2,
  ShieldAlert
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

interface RegionalOffice {
  name: string;
  phone: string;
  email: string;
  states: string[];
  zipPrefixes: string[];
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

// SAG-AFTRA Regional Offices with ZIP code prefixes for lookup
const REGIONAL_OFFICES: RegionalOffice[] = [
  {
    name: "Los Angeles",
    phone: "(323) 954-1600",
    email: "losangeles@sagaftra.org",
    states: ["CA (Southern)"],
    zipPrefixes: ["900", "901", "902", "903", "904", "905", "906", "907", "908", "910", "911", "912", "913", "914", "915", "916", "917", "918", "919", "920", "921", "922", "923", "924", "925", "926", "927", "928", "930", "931", "932", "933", "934", "935"]
  },
  {
    name: "New York",
    phone: "(212) 944-1030",
    email: "newyork@sagaftra.org",
    states: ["NY", "NJ", "CT"],
    zipPrefixes: ["100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "070", "071", "072", "073", "074", "075", "076", "077", "078", "079", "060", "061", "062", "063", "064", "065", "066", "067", "068", "069"]
  },
  {
    name: "Chicago",
    phone: "(312) 573-8081",
    email: "chicago@sagaftra.org",
    states: ["IL", "WI", "IN", "MI", "MN"],
    zipPrefixes: ["600", "601", "602", "603", "604", "605", "606", "607", "608", "609", "530", "531", "532", "534", "535", "537", "538", "539", "460", "461", "462", "463", "464", "465", "466", "467", "468", "469", "480", "481", "482", "483", "484", "485", "486", "487", "488", "489", "490", "491", "492", "493", "494", "495", "496", "497", "498", "499", "550", "551", "553", "554", "555", "556", "557", "558", "559", "560", "561", "562", "563", "564", "565", "566", "567"]
  },
  {
    name: "San Francisco",
    phone: "(415) 391-7510",
    email: "sanfrancisco@sagaftra.org",
    states: ["CA (Northern)", "NV", "HI"],
    zipPrefixes: ["940", "941", "942", "943", "944", "945", "946", "947", "948", "949", "950", "951", "952", "953", "954", "955", "956", "957", "958", "959", "960", "961", "890", "891", "893", "894", "895", "896", "897", "898", "967", "968"]
  },
  {
    name: "Atlanta",
    phone: "(404) 239-0131",
    email: "atlanta@sagaftra.org",
    states: ["GA", "AL", "MS", "TN", "SC", "NC"],
    zipPrefixes: ["300", "301", "302", "303", "304", "305", "306", "307", "308", "309", "310", "311", "312", "313", "314", "315", "316", "317", "318", "319", "350", "351", "352", "354", "355", "356", "357", "358", "359", "360", "361", "362", "363", "364", "365", "366", "367", "368", "369", "386", "387", "388", "389", "390", "391", "392", "394", "395", "396", "397", "370", "371", "372", "373", "374", "375", "376", "377", "378", "379", "380", "381", "382", "383", "384", "385", "290", "291", "292", "293", "294", "295", "296", "297", "298", "299", "270", "271", "272", "273", "274", "275", "276", "277", "278", "279", "280", "281", "282", "283", "284", "285", "286", "287", "288", "289"]
  },
  {
    name: "Miami",
    phone: "(305) 670-7677",
    email: "miami@sagaftra.org",
    states: ["FL", "PR", "VI"],
    zipPrefixes: ["320", "321", "322", "323", "324", "325", "326", "327", "328", "329", "330", "331", "332", "333", "334", "335", "336", "337", "338", "339", "340", "341", "342", "344", "346", "347", "349", "006", "007", "008", "009"]
  },
  {
    name: "Dallas-Fort Worth",
    phone: "(214) 363-8300",
    email: "dallas@sagaftra.org",
    states: ["TX", "OK", "AR", "LA"],
    zipPrefixes: ["750", "751", "752", "753", "754", "755", "756", "757", "758", "759", "760", "761", "762", "763", "764", "765", "766", "767", "768", "769", "770", "771", "772", "773", "774", "775", "776", "777", "778", "779", "780", "781", "782", "783", "784", "785", "786", "787", "788", "789", "790", "791", "792", "793", "794", "795", "796", "797", "798", "799", "730", "731", "734", "735", "736", "737", "738", "739", "740", "741", "743", "744", "745", "746", "747", "748", "749", "716", "717", "718", "719", "720", "721", "722", "723", "724", "725", "726", "727", "728", "729", "700", "701", "703", "704", "705", "706", "707", "708"]
  },
  {
    name: "Boston",
    phone: "(617) 262-8001",
    email: "boston@sagaftra.org",
    states: ["MA", "ME", "NH", "VT", "RI"],
    zipPrefixes: ["010", "011", "012", "013", "014", "015", "016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "039", "040", "041", "042", "043", "044", "045", "046", "047", "048", "049", "030", "031", "032", "033", "034", "035", "036", "037", "038", "050", "051", "052", "053", "054", "056", "057", "058", "059", "028", "029"]
  },
  {
    name: "Seattle",
    phone: "(206) 270-0493",
    email: "seattle@sagaftra.org",
    states: ["WA", "OR", "AK", "MT", "ID"],
    zipPrefixes: ["980", "981", "982", "983", "984", "985", "986", "988", "989", "990", "991", "992", "993", "994", "970", "971", "972", "973", "974", "975", "976", "977", "978", "979", "995", "996", "997", "998", "999", "590", "591", "592", "593", "594", "595", "596", "597", "598", "599", "832", "833", "834", "835", "836", "837", "838"]
  },
  {
    name: "Washington D.C. / Mid-Atlantic",
    phone: "(301) 657-2560",
    email: "washingtonmidatlantic@sagaftra.org",
    states: ["DC", "MD", "VA", "WV", "DE", "PA"],
    zipPrefixes: ["200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256", "257", "258", "259", "260", "261", "262", "263", "264", "265", "266", "267", "268", "197", "198", "199", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196"]
  },
  {
    name: "Arizona-Utah",
    phone: "(602) 265-2712",
    email: "arizona@sagaftra.org",
    states: ["AZ", "UT", "NM", "CO"],
    zipPrefixes: ["850", "851", "852", "853", "855", "856", "857", "859", "860", "863", "864", "865", "840", "841", "843", "844", "845", "846", "847", "870", "871", "872", "873", "874", "875", "876", "877", "878", "879", "880", "881", "882", "883", "884", "800", "801", "802", "803", "804", "805", "806", "807", "808", "809", "810", "811", "812", "813", "814", "815", "816"]
  },
  {
    name: "National Office",
    phone: "(855) 724-2387",
    email: "info@sagaftra.org",
    states: ["All other areas"],
    zipPrefixes: []
  }
];

export default function ContractAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm an AI assistant here to help you understand SAG-AFTRA and other union contracts for your film or TV production.

**Important:** I am NOT affiliated with SAG-AFTRA or any union. I'm an educational tool to help you learn about:

• **Agreement Types** - From Student Film to full Theatrical agreements
• **Current Rates** - Day rates, weekly rates, and overtime rules  
• **Becoming Signatory** - Step-by-step process to hire union talent
• **P&H Contributions** - Pension & Health obligations
• **Other Unions** - IATSE, DGA, WGA, and more

For official guidance, you'll want to contact your regional SAG-AFTRA office directly. Enter your ZIP code on the right to find your local office.

How can I help you get started?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [matchedOffice, setMatchedOffice] = useState<RegionalOffice | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    budget: "",
    projectType: "",
    runtime: "",
    castSize: "",
    location: "",
    distribution: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Find regional office by ZIP code
  const findOfficeByZip = (zip: string) => {
    if (zip.length < 3) {
      setMatchedOffice(null);
      return;
    }
    const prefix = zip.substring(0, 3);
    const office = REGIONAL_OFFICES.find(o => o.zipPrefixes.includes(prefix));
    setMatchedOffice(office || REGIONAL_OFFICES[REGIONAL_OFFICES.length - 1]); // Default to National
  };

  useEffect(() => {
    findOfficeByZip(zipCode);
  }, [zipCode]);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.txt', '.docx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a PDF, TXT, or DOCX file with your production information.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingDoc(true);

    try {
      // For text files, read directly
      if (file.type === 'text/plain' || fileExtension === '.txt') {
        const text = await file.text();
        const prompt = `I've uploaded my production information document. Please analyze it and extract any relevant details for recommending a SAG-AFTRA agreement:

---
${text.substring(0, 8000)}
---

Based on this information, what SAG-AFTRA agreement would you recommend? What are the key requirements I should know about?`;
        
        sendMessage(prompt);
      } else {
        // For PDFs and DOCXs, use the parse-document edge function
        const formData = new FormData();
        formData.append('file', file);

        const { data, error } = await supabase.functions.invoke('parse-document', {
          body: formData,
        });

        if (error) throw error;

        const extractedText = data?.text || data?.content || '';
        if (!extractedText) {
          throw new Error("Could not extract text from document");
        }

        const prompt = `I've uploaded my production information document. Please analyze it and extract any relevant details for recommending a SAG-AFTRA agreement:

---
${extractedText.substring(0, 8000)}
---

Based on this information, what SAG-AFTRA agreement would you recommend? What are the key requirements I should know about?`;
        
        sendMessage(prompt);
      }

      toast({
        title: "Document Uploaded",
        description: "Analyzing your production information...",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process document",
        variant: "destructive",
      });
    } finally {
      setIsUploadingDoc(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
        {/* Legal Disclaimer Banner */}
        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
          <ShieldAlert className="h-5 w-5 text-amber-500" />
          <AlertTitle className="text-amber-700 dark:text-amber-400">Important Disclaimer</AlertTitle>
          <AlertDescription className="text-amber-700/90 dark:text-amber-400/90">
            <strong>This tool is NOT affiliated with, endorsed by, or connected to SAG-AFTRA or any labor union.</strong> We provide educational information only to help filmmakers understand union contracts. For official guidance, rates, and to become a signatory, you must contact SAG-AFTRA directly. Information may be outdated—always verify with official sources.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="h-10 w-10 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Union Contract Assistant</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Educational AI guidance for understanding SAG-AFTRA and other union contracts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-280px)] flex flex-col">
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
            {/* Find Your Regional Office */}
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Find Your SAG-AFTRA Office</CardTitle>
                </div>
                <CardDescription>
                  Enter your ZIP code to find your regional office
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Enter ZIP code (e.g., 90028)"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').substring(0, 5))}
                  maxLength={5}
                />
                {matchedOffice && (
                  <div className="p-3 bg-muted rounded-lg space-y-2">
                    <div className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {matchedOffice.name} Office
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${matchedOffice.phone}`} className="text-primary hover:underline">
                          {matchedOffice.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-3 w-3" />
                        <a href={`mailto:${matchedOffice.email}`} className="text-primary hover:underline text-xs">
                          {matchedOffice.email}
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Covers: {matchedOffice.states.join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upload Production Info */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Upload Production Info</CardTitle>
                </div>
                <CardDescription>
                  Upload a PDF, TXT, or DOCX with your production details instead of filling forms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingDoc || isLoading}
                >
                  {isUploadingDoc ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Supports: Budget summaries, production bibles, project briefs
                </p>
              </CardContent>
            </Card>

            {/* Project Details Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Or Enter Details Manually</CardTitle>
                </div>
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
                  Official SAG-AFTRA Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a 
                  href="https://www.sagaftra.org/production-center" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                >
                  Production Center →
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
                  href="https://www.sagaftra.org/signatory" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                >
                  Become a Signatory →
                </a>
              </CardContent>
            </Card>

            {/* Legal Disclaimer */}
            <Card className="bg-muted/50 border-amber-500/30">
              <CardContent className="pt-4">
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-500" />
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Legal Notice</p>
                    <p>
                      This AI assistant provides general educational information about union contracts. 
                      It is <strong>not</strong> affiliated with SAG-AFTRA, IATSE, DGA, WGA, or any labor organization.
                    </p>
                    <p>
                      This is <strong>not legal advice</strong>. For binding information about rates, agreements, 
                      and signatory requirements, contact SAG-AFTRA directly or consult an entertainment attorney.
                    </p>
                    <p>
                      Rates and requirements change periodically. Always verify current information at{" "}
                      <a href="https://www.sagaftra.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        sagaftra.org
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
