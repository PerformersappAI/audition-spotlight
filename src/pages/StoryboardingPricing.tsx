import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, X, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

interface Tier {
  id: "free" | "creator" | "pro";
  name: string;
  tagline: string;
  monthly: number;
  yearly: number; // per-month equivalent
  yearlyTotal: number;
  monthlyPlanType?: string;
  yearlyPlanType?: string;
  highlight?: boolean;
  cta: string;
  ctaTo?: string;
  icon: typeof Sparkles;
  features: { label: string; included: boolean }[];
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Try it out, no card required",
    monthly: 0,
    yearly: 0,
    yearlyTotal: 0,
    cta: "Get Started Free",
    ctaTo: "/storyboarding",
    icon: Sparkles,
    features: [
      { label: "50 credits on signup", included: true },
      { label: "2 saved projects", included: true },
      { label: "Quick Storyboard generation", included: true },
      { label: "Animatic preview player", included: true },
      { label: "1 review link per project", included: true },
      { label: "Detailed Breakdown + Shot list PDF", included: false },
      { label: "GIF animatic export", included: false },
      { label: "Character reference images", included: false },
      { label: "Watermark-free frames", included: false },
    ],
  },
  {
    id: "creator",
    name: "Creator",
    tagline: "Everything Boords Pro offers, at 1/4 the price",
    monthly: 19,
    yearly: 15,
    yearlyTotal: 180,
    monthlyPlanType: "creator_monthly",
    yearlyPlanType: "creator_yearly",
    highlight: true,
    cta: "Start Creator Plan",
    icon: Zap,
    features: [
      { label: "200 credits/month (rollover up to 400)", included: true },
      { label: "Unlimited saved projects", included: true },
      { label: "Full Detailed Breakdown + Shot list PDF", included: true },
      { label: "GIF animatic export", included: true },
      { label: "Character reference images + consistency", included: true },
      { label: "Unlimited review links + password protection", included: true },
      { label: "Frame annotations on review links", included: true },
      { label: "No watermark on generated frames", included: true },
      { label: "Priority generation queue", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For studios and high-volume creators",
    monthly: 49,
    yearly: 39,
    yearlyTotal: 468,
    monthlyPlanType: "pro_monthly",
    yearlyPlanType: "pro_yearly",
    cta: "Start Pro Plan",
    icon: Crown,
    features: [
      { label: "600 credits/month (rollover up to 1200)", included: true },
      { label: "Everything in Creator", included: true },
      { label: "Priority generation queue", included: true },
      { label: "MP4 export (when available)", included: true },
      { label: "White-label review links", included: true },
      { label: "Bulk export (ZIP all frames)", included: true },
      { label: "API access (coming soon)", included: true },
      { label: "Dedicated support", included: true },
    ],
  },
];

const COMPARISON = [
  {
    section: "Script Import & Parsing",
    rows: [
      { feature: "Paste script text", free: true, creator: true, pro: true },
      { feature: "PDF / Final Draft upload", free: true, creator: true, pro: true },
      { feature: "Auto scene detection", free: true, creator: true, pro: true },
    ],
  },
  {
    section: "Scene Selection & Shot List",
    rows: [
      { feature: "Quick Storyboard mode", free: true, creator: true, pro: true },
      { feature: "Detailed Breakdown (scene selector)", free: false, creator: true, pro: true },
      { feature: "Shot list PDF export", free: false, creator: true, pro: true },
    ],
  },
  {
    section: "Image Generation",
    rows: [
      { feature: "Frame generation", free: "Watermarked", creator: true, pro: true },
      { feature: "Multiple art styles", free: true, creator: true, pro: true },
      { feature: "Inpaint editor", free: false, creator: true, pro: true },
      { feature: "Priority generation queue", free: false, creator: false, pro: true },
    ],
  },
  {
    section: "Character Consistency",
    rows: [
      { feature: "Cast extraction", free: true, creator: true, pro: true },
      { feature: "Character reference images", free: false, creator: true, pro: true },
      { feature: "Consistency injection in frames", free: false, creator: true, pro: true },
    ],
  },
  {
    section: "Animatic Export",
    rows: [
      { feature: "In-browser preview player", free: true, creator: true, pro: true },
      { feature: "GIF export", free: false, creator: "2 credits", pro: "2 credits" },
      { feature: "MP4 export", free: false, creator: false, pro: "When available" },
      { feature: "Public share link", free: true, creator: true, pro: true },
    ],
  },
  {
    section: "Collaboration & Review",
    rows: [
      { feature: "Review links per project", free: "1", creator: "Unlimited", pro: "Unlimited" },
      { feature: "Password protection", free: false, creator: true, pro: true },
      { feature: "Comments per frame", free: "3 max", creator: "Unlimited", pro: "Unlimited" },
      { feature: "Frame annotations", free: false, creator: true, pro: true },
      { feature: "White-label review pages", free: false, creator: false, pro: true },
    ],
  },
  {
    section: "Project Management",
    rows: [
      { feature: "Saved projects", free: "2", creator: "Unlimited", pro: "Unlimited" },
      { feature: "Bulk ZIP export", free: false, creator: false, pro: true },
      { feature: "API access", free: false, creator: false, pro: "Coming soon" },
    ],
  },
  {
    section: "Support",
    rows: [
      { feature: "Community support", free: true, creator: true, pro: true },
      { feature: "Email support", free: false, creator: true, pro: true },
      { feature: "Dedicated support", free: false, creator: false, pro: true },
    ],
  },
];

const FAQS = [
  {
    q: "What is a credit?",
    a: "One credit generates one storyboard frame. Reference images and GIF exports also use credits (1 credit per character image, 2 credits per GIF export).",
  },
  {
    q: "Do credits roll over?",
    a: "Yes. Creator credits roll over up to 2 months (max 400 banked). Pro credits roll over up to 2 months (max 1200 banked).",
  },
  {
    q: "Can I use this for commercial projects?",
    a: "Yes. You own all generated content and can use it for commercial productions, client work, and pitch decks.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "You can purchase top-up packs anytime from your dashboard — 100 credits ($9), 300 credits ($24), or 1000 credits ($69).",
  },
  {
    q: "Is my script data private?",
    a: "Yes. We never store your scripts beyond your own project files, never train on them, and never share them with third parties.",
  },
  {
    q: "How does this compare to Boords?",
    a: "FilmmakerGenius Creator at $19/month includes everything Boords Pro offers at $75/month, plus animatic export and character consistency tools that Boords doesn't have at any price.",
  },
];

const renderCell = (val: boolean | string) => {
  if (val === true) return <Check className="mx-auto h-4 w-4 text-primary" />;
  if (val === false) return <X className="mx-auto h-4 w-4 text-muted-foreground/40" />;
  return <span className="text-xs text-muted-foreground">{val}</span>;
};

const StoryboardingPricing = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [billing, setBilling] = useState<Billing>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Subscription active! Welcome aboard.");
    } else if (searchParams.get("canceled") === "true") {
      toast.info("Checkout canceled. No charges made.");
    }
  }, [searchParams]);

  // SEO
  useEffect(() => {
    document.title = "Storyboarding Pricing — FilmmakerGenius";
    const meta =
      document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute(
      "content",
      "Professional storyboarding tools for indie filmmakers. Free, Creator $19/mo, Pro $49/mo. Compare to Boords Pro at $75."
    );
    if (!meta.parentElement) document.head.appendChild(meta);
  }, []);

  const handleSubscribe = async (tier: Tier) => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    const planType = billing === "yearly" ? tier.yearlyPlanType : tier.monthlyPlanType;
    if (!planType) return;

    setLoadingPlan(tier.id);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planType },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border/40 bg-gradient-to-b from-card/40 to-background py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-primary/40 text-primary">
            Storyboarding Suite
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Professional Storyboarding Tools
            <br />
            <span className="text-primary">for Independent Filmmakers</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From script to animatic in minutes. No design skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 justify-center text-sm text-muted-foreground">
            <span>✓ Trusted by filmmakers in 40+ countries</span>
            <span className="hidden sm:inline">•</span>
            <span>
              ✓ Boords Pro costs <span className="line-through">$75/mo</span> — Creator is{" "}
              <span className="text-primary font-semibold">$19/mo</span>
            </span>
          </div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="pt-12 pb-4 px-6">
        <div className="flex items-center justify-center gap-4">
          <span
            className={cn(
              "text-sm font-medium transition",
              billing === "monthly" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>
          <Switch
            checked={billing === "yearly"}
            onCheckedChange={(c) => setBilling(c ? "yearly" : "monthly")}
          />
          <span
            className={cn(
              "text-sm font-medium transition",
              billing === "yearly" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Yearly
          </span>
          <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/15">
            Save 20%
          </Badge>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const price = billing === "yearly" ? tier.yearly : tier.monthly;
            return (
              <Card
                key={tier.id}
                className={cn(
                  "relative p-8 flex flex-col",
                  tier.highlight && "border-primary border-2 shadow-lg shadow-primary/10"
                )}
              >
                {tier.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{tier.tagline}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">${price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  {billing === "yearly" && tier.yearlyTotal > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ${tier.yearlyTotal} billed yearly
                    </p>
                  )}
                  {billing === "monthly" && tier.monthly > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Billed monthly</p>
                  )}
                  {tier.monthly === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Free forever</p>
                  )}
                </div>

                {tier.ctaTo ? (
                  <Button asChild size="lg" variant={tier.highlight ? "default" : "outline"} className="w-full mb-6">
                    <Link to={tier.ctaTo}>{tier.cta}</Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant={tier.highlight ? "default" : "outline"}
                    className="w-full mb-6"
                    onClick={() => handleSubscribe(tier)}
                    disabled={loadingPlan === tier.id}
                  >
                    {loadingPlan === tier.id ? "Loading..." : tier.cta}
                  </Button>
                )}

                <ul className="space-y-3 text-sm">
                  {tier.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2">
                      {f.included ? (
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                      )}
                      <span className={cn(!f.included && "text-muted-foreground line-through")}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          Cancel anytime. No contracts. 100% money-back guarantee within 7 days.
        </p>
      </section>

      {/* Full Comparison Table */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Full Feature Comparison</h2>
          <p className="text-center text-muted-foreground mb-10">
            Every feature, every plan, side by side.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border/60 bg-background">
            <table className="w-full text-sm">
              <thead className="bg-card/60">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Feature</th>
                  <th className="px-6 py-4 font-medium text-center w-32">Free</th>
                  <th className="px-6 py-4 font-medium text-center w-32 text-primary">Creator</th>
                  <th className="px-6 py-4 font-medium text-center w-32">Pro</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((section) => (
                  <>
                    <tr key={section.section} className="bg-card/30">
                      <td colSpan={4} className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {section.section}
                      </td>
                    </tr>
                    {section.rows.map((row) => (
                      <tr key={row.feature} className="border-t border-border/40">
                        <td className="px-6 py-3">{row.feature}</td>
                        <td className="px-6 py-3 text-center">{renderCell(row.free)}</td>
                        <td className="px-6 py-3 text-center">{renderCell(row.creator)}</td>
                        <td className="px-6 py-3 text-center">{renderCell(row.pro)}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Loved by filmmakers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="p-6">
                <div className="text-3xl text-primary mb-3">"</div>
                <p className="text-muted-foreground mb-4 italic">[TESTIMONIAL {n}]</p>
                <div className="border-t border-border/40 pt-4">
                  <p className="font-medium">[Filmmaker Name]</p>
                  <p className="text-sm text-muted-foreground">Independent Filmmaker, Los Angeles</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to visualize your script?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start for free — no credit card required.
          </p>
          <Button asChild size="lg" className="px-8">
            <Link to="/storyboarding">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default StoryboardingPricing;
