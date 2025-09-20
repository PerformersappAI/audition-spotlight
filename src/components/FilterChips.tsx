import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterChipsProps {
  states: string[];
  selectedStates: string[];
  onStateToggle: (state: string) => void;
  onClearAll: () => void;
}

const US_STATES = [
  'CA', 'NY', 'TX', 'FL', 'GA', 'IL', 'PA', 'NC', 'OH', 'MI',
  'WA', 'AZ', 'CO', 'OR', 'NV', 'UT', 'NM', 'MT', 'ID', 'WY'
];

export const FilterChips = ({ selectedStates, onStateToggle, onClearAll }: FilterChipsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Filter by States</h3>
        {selectedStates.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
            <X className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {US_STATES.map((state) => {
          const isSelected = selectedStates.includes(state);
          return (
            <Badge
              key={state}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected 
                  ? "bg-gradient-primary text-primary-foreground border-primary shadow-glow" 
                  : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onStateToggle(state)}
            >
              {state}
            </Badge>
          );
        })}
      </div>

      {selectedStates.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-muted-foreground">
            Filtering auditions in: <span className="text-primary font-medium">{selectedStates.join(', ')}</span>
          </p>
        </div>
      )}
    </div>
  );
};