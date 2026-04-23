import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StoryboardStep = 1 | 2 | 3;

interface StepIndicatorProps {
  currentStep: StoryboardStep;
}

const STEPS: { num: StoryboardStep; label: string }[] = [
  { num: 1, label: "Select Scenes" },
  { num: 2, label: "Review Shot List" },
  { num: 3, label: "Generate" },
];

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 flex-wrap">
      {STEPS.map((step, idx) => {
        const isActive = step.num === currentStep;
        const isComplete = step.num < currentStep;
        return (
          <div key={step.num} className="flex items-center gap-2 sm:gap-4">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition-colors",
                isActive && "border-primary bg-primary/10 text-primary",
                isComplete && "border-primary/40 bg-primary/5 text-foreground",
                !isActive && !isComplete && "border-border bg-surface text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold",
                  isActive && "bg-primary text-primary-foreground",
                  isComplete && "bg-primary/30 text-foreground",
                  !isActive && !isComplete && "bg-muted text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="h-3 w-3" /> : step.num}
              </span>
              <span className="whitespace-nowrap">{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="hidden sm:block h-px w-6 bg-border" />
            )}
          </div>
        );
      })}
    </div>
  );
};
