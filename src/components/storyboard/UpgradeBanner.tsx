import { Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UpgradeBannerProps {
  message: string;
  ctaLabel?: string;
  className?: string;
  dismissible?: boolean;
}

export const UpgradeBanner = ({
  message,
  ctaLabel = "See plans",
  className,
  dismissible = true,
}: UpgradeBannerProps) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm",
        className
      )}
    >
      <Sparkles className="h-4 w-4 shrink-0 text-primary" />
      <span className="flex-1 text-foreground">{message}</span>
      <Button asChild size="sm" variant="default" className="h-7">
        <Link to="/storyboarding/pricing">{ctaLabel}</Link>
      </Button>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
