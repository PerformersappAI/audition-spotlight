import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Sparkles, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QuickQuestion {
  label: string;
  question: string;
}

interface DistributionChatAssistantProps {
  context?: {
    projectTitle?: string;
    projectType?: string;
    budgetTier?: string;
    currentStep?: number;
  };
}

const QUICK_QUESTIONS: QuickQuestion[] = [
  { label: "Help with logline", question: "Help me write a compelling logline for my film. What makes a great logline?" },
  { label: "Suggest comps", question: "How do I choose good comparable titles (comps) for my film? What should I consider?" },
  { label: "E&O Insurance", question: "What is E&O insurance and why do I need it for distribution?" },
  { label: "Chain of Title", question: "What documents do I need for a complete chain of title?" },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/distribution-assistant`;

// Lightweight markdown formatter for chat responses
function formatMarkdown(text: string): string {
  if (!text) return "";
  
  let html = text
    // Escape HTML first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers (### Header)
    .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-base mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-semibold text-lg mt-3 mb-1">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="font-bold text-xl mt-4 mb-2">$1</h2>')
    // Bold (**text**)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic (*text*)
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    // Bullet points (- item or * item at start of line)
    .replace(/^[\-\*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Numbered lists (1. item)
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Wrap consecutive list items
    .replace(/(<li class="ml-4 list-disc">.*<\/li>\n?)+/g, '<ul class="my-2 space-y-1">$&</ul>')
    .replace(/(<li class="ml-4 list-decimal">.*<\/li>\n?)+/g, '<ol class="my-2 space-y-1">$&</ol>')
    // Inline code (`code`)
    .replace(/`([^`]+)`/g, '<code class="bg-background/50 px-1 py-0.5 rounded text-xs">$1</code>')
    // Paragraphs (double newlines)
    .replace(/\n\n+/g, '</p><p class="mb-2">')
    // Single newlines within paragraphs
    .replace(/\n/g, '<br/>');
  
  // Wrap in paragraph if not starting with a block element
  if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<ol')) {
    html = '<p class="mb-2">' + html + '</p>';
  }
  
  return html;
}

export function DistributionChatAssistant({ context }: DistributionChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInput("");

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          context 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Add empty assistant message
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

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
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            // Incomplete JSON, continue
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get response");
      // Remove the empty assistant message if error
      setMessages(prev => prev.filter((_, i) => i < prev.length - 1 || prev[i].content !== ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    streamChat(input.trim());
  };

  const handleQuickQuestion = (question: string) => {
    if (isLoading) return;
    streamChat(question);
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-lg overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/20 rounded-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-foreground block">Distribution Assistant</span>
              <span className="text-xs text-muted-foreground">Ask about loglines, comps, terms...</span>
            </div>
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`} 
          />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          {/* Quick Questions */}
          {messages.length === 0 && (
            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => handleQuickQuestion(q.question)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <ScrollArea className="h-[300px] px-4" ref={scrollRef}>
              <div className="space-y-3 pb-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-sm rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground ml-6"
                        : "bg-muted mr-4 prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground"
                    }`}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : msg.content ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                        className="[&>p]:mb-2 [&>p:last-child]:mb-0 [&>h4]:text-foreground [&>h3]:text-foreground [&>h2]:text-foreground [&>ul]:my-2 [&>ol]:my-2 leading-relaxed"
                      />
                    ) : (
                      isLoading && i === messages.length - 1 && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Input */}
          <div className="p-4 pt-2 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about distribution..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
                className="bg-background"
              />
              <Button 
                size="icon" 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
