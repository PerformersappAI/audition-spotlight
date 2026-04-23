import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import {
  Upload, Film, Wand2, Download, Users, Palette, FileText,
  Share2, MessageSquare, ArrowRight, Check, Sparkles, Camera,
} from "lucide-react";

const FAQS = [
  {
    q: "What is an AI storyboard generator?",
    a: "An AI storyboard generator automatically creates visual storyboard panels from a screenplay or script, using artificial intelligence to interpret scene descriptions and generate frame-by-frame imagery. FilmmakerGenius.com turns your written script into professional storyboards without requiring any design skill.",
  },
  {
    q: "How does FilmmakerGenius storyboarding work?",
    a: "Upload your script as a PDF or paste your text, select the scenes you want to visualize, choose an art style, and FilmmakerGenius generates professional storyboard frames using AI image generation. The full workflow takes minutes instead of days.",
  },
  {
    q: "Is FilmmakerGenius free to use?",
    a: "Yes. FilmmakerGenius offers a free tier with 50 credits on signup, enough to generate your first storyboard with no credit card required. You can upgrade to Creator ($19/month) or Pro ($49/month) at any time.",
  },
  {
    q: "What art styles are available?",
    a: "FilmmakerGenius supports Comic Book, Cinematic Photo, Soft Pencil, Animation 3D, Line Art, and more visual styles to match your project's tone. Choose the look that fits your director's vision.",
  },
  {
    q: "Can I export my storyboard?",
    a: "Yes. You can export a professional shot list as a PDF, download your storyboard frames, and export a GIF animatic directly from FilmmakerGenius — perfect for client review and pre-production meetings.",
  },
  {
    q: "How does FilmmakerGenius compare to Boords?",
    a: "FilmmakerGenius offers comparable storyboarding features including character consistency, animatic export, and client review links — starting at $19/month versus Boords Pro at $75/month. You get the same professional toolset at a fraction of the cost.",
  },
];

const STEPS = [
  { icon: Upload, title: "Upload Your Script", desc: "PDF or paste text. We parse every scene automatically." },
  { icon: Film, title: "Select Your Scenes", desc: "Choose which scenes to storyboard. Control your credit spend." },
  { icon: Wand2, title: "Generate Your Frames", desc: "AI generates visual storyboard panels in your chosen art style." },
  { icon: Download, title: "Export & Share", desc: "Download your shot list PDF, export a GIF animatic, share for client review." },
];

const FEATURES = [
  { icon: Film, title: "Scene Selector", desc: "Pick exactly which scenes to visualize. Never burn credits on scenes you don't need." },
  { icon: Palette, title: "10+ Art Styles", desc: "Comic Book, Cinematic, Soft Pencil, Animation 3D, Line Art and more." },
  { icon: Users, title: "Character Consistency", desc: "AI extracts your cast and maintains character appearance across every frame." },
  { icon: FileText, title: "Shot List PDF", desc: "Export a set-ready shot list with shot type and camera movement. Impress your crew." },
  { icon: Camera, title: "Animatic Export", desc: "String your frames into a timed GIF animatic. Perfect for pitches and pre-production." },
  { icon: Share2, title: "Client Review Links", desc: "Share password-protected review links. Get frame-level feedback without email chains." },
];

const ART_STYLES = [
  "Comic Book", "Cinematic Photo", "Soft Pencil", "Animation 3D", "Line Art", "Cinematic",
];

const TIERS = [
  {
    name: "Free", price: "$0", cadence: "forever",
    features: ["50 credits on signup", "2 saved projects", "Quick Storyboard", "PDF export"],
    cta: "Start Free", href: "/auth",
  },
  {
    name: "Creator", price: "$19", cadence: "/month", highlighted: true,
    features: ["600 credits/month", "Unlimited projects", "Shot list PDF", "Animatic GIF export", "Client review links"],
    cta: "Get Creator", href: "/storyboarding/pricing",
  },
  {
    name: "Pro", price: "$49", cadence: "/month",
    features: ["1,500 credits/month", "Priority queue", "MP4 export (coming)", "Bulk ZIP export", "White-label review"],
    cta: "Get Pro", href: "/storyboarding/pricing",
  },
];

interface Props {
  isAuthenticated: boolean;
}

export default function StoryboardingLanding({ isAuthenticated }: Props) {
  useEffect(() => {
    document.title = "AI Storyboard Generator for Filmmakers | FilmmakerGenius";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "Turn your screenplay into professional storyboards with AI. Scene selector, character consistency, animatic export, and client review tools. Free to start.",
    );

    // FAQ schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    let script = document.getElementById("faq-schema") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "faq-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      script?.remove();
    };
  }, []);

  const scrollToDemo = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  const primaryCta = isAuthenticated ? (
    <Button size="lg" asChild className="text-base">
      <Link to="/storyboarding?tool=1">Go to Storyboard Tool <ArrowRight className="ml-1" /></Link>
    </Button>
  ) : (
    <Button size="lg" asChild className="text-base">
      <Link to="/auth">Start for Free <ArrowRight className="ml-1" /></Link>
    </Button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-1 h-3 w-3" /> AI Storyboarding for Filmmakers
            </Badge>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
              Turn Your Script Into a Visual Storyboard in Minutes
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              AI-powered storyboarding for independent filmmakers. No design skills required.
              From script to animatic — all in one place on FilmmakerGenius.com.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {primaryCta}
              <Button size="lg" variant="outline" onClick={scrollToDemo} className="text-base">
                See How It Works ↓
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required · 50 free credits on signup · Cancel anytime
            </p>
          </div>

          {/* Hero visual: 3-panel mockup */}
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: "1. Script", icon: FileText, sub: "INT. CAFE — DAY\nMaya enters..." },
              { label: "2. Storyboard Frames", icon: Camera, sub: "AI-generated panels" },
              { label: "3. Animatic", icon: Film, sub: "Timed GIF export" },
            ].map((p) => (
              <Card key={p.label} className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <p.icon className="h-4 w-4" /> {p.label}
                  </div>
                  <div className="flex h-32 items-center justify-center rounded-md bg-muted/40 text-center text-xs text-muted-foreground whitespace-pre-line">
                    {p.sub}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-10">
          <p className="text-center text-sm uppercase tracking-wide text-muted-foreground">
            Used by independent filmmakers, commercial directors, and screenwriters worldwide
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              "[10,000+] frames generated",
              "[40+] countries",
              "50 free credits on signup",
              "No design skills needed",
            ].map((s) => (
              <Badge key={s} variant="secondary" className="px-4 py-2 text-sm">{s}</Badge>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-b border-border">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-center font-serif text-3xl font-bold md:text-4xl">
            From Script to Screen in 4 Steps
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            FilmmakerGenius takes you from raw screenplay to a shareable animatic in four simple steps.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <Card key={s.title} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    Step {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-border bg-card/20">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-center font-serif text-3xl font-bold md:text-4xl">
            Everything a Filmmaker Needs to Pre-Visualize
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ART STYLE SHOWCASE */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-center font-serif text-3xl font-bold md:text-4xl">
            Choose Your Visual Language
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Match the visual tone of your project with one of our supported art styles.
          </p>
          <div className="mt-10 flex gap-4 overflow-x-auto pb-4">
            {ART_STYLES.map((style) => (
              <div key={style} className="flex w-56 shrink-0 flex-col">
                <div className="flex aspect-video items-center justify-center rounded-md border border-border bg-gradient-to-br from-muted/40 to-muted/10 text-center text-xs text-muted-foreground">
                  {style} sample
                </div>
                <div className="mt-2 text-center text-sm font-medium">{style}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild>
              <Link to={isAuthenticated ? "/storyboarding?tool=1" : "/auth"}>
                Try it free <ArrowRight className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="border-b border-border bg-card/20">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-center font-serif text-3xl font-bold md:text-4xl">
            Simple, Filmmaker-Friendly Pricing
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            FilmmakerGenius Creator at $19/month includes everything Boords Pro offers at $75/month.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TIERS.map((t) => (
              <Card
                key={t.name}
                className={
                  t.highlighted
                    ? "border-primary/60 bg-card shadow-glow"
                    : "border-border/50 bg-card/50"
                }
              >
                <CardContent className="p-6">
                  {t.highlighted && (
                    <Badge className="mb-3">Most Popular</Badge>
                  )}
                  <h3 className="text-xl font-semibold">{t.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{t.price}</span>
                    <span className="text-sm text-muted-foreground">{t.cadence}</span>
                  </div>
                  <ul className="mt-6 space-y-2">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-6 w-full" variant={t.highlighted ? "default" : "outline"}>
                    <Link to={t.href}>{t.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/storyboarding/pricing" className="text-primary hover:underline">
              See full feature comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-center font-serif text-3xl font-bold md:text-4xl">
            What Filmmakers Are Saying
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <MessageSquare className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-sm italic text-muted-foreground">[TESTIMONIAL {n}]</p>
                  <div className="mt-4">
                    <div className="text-sm font-semibold">[Name]</div>
                    <div className="text-xs text-muted-foreground">[Role] · [Location]</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border bg-card/20">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-center font-serif text-3xl font-bold md:text-4xl">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section>
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="font-serif text-3xl font-bold md:text-5xl">Your Next Project Starts Here</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Upload your script and generate your first storyboard frame in under 5 minutes.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild className="text-base">
              <Link to={isAuthenticated ? "/storyboarding?tool=1" : "/auth"}>
                Start for Free <ArrowRight className="ml-1" />
              </Link>
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">No credit card required</p>
        </div>
      </section>
    </div>
  );
}
