import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Palette, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StyleReferenceInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const StyleReferenceInput = ({ value, onChange }: StyleReferenceInputProps) => {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <CardTitle>Style Reference (Optional but Recommended)</CardTitle>
        </div>
        <CardDescription>
          Provide a detailed description of the artistic style you want maintained across ALL panels. This helps ensure visual consistency.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="style-reference">Detailed Style Description</Label>
          <Textarea
            id="style-reference"
            placeholder="Example: Hand-drawn comic book style with bold black ink outlines, vibrant flat colors, minimal shading, dynamic action lines, classic 1960s Marvel Comics aesthetic with halftone dot patterns for depth..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground">
            Include: artistic medium, line style, color treatment, shading technique, specific era or artist influence
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Note:</strong> AI image generation produces variations between panels even with detailed prompts. 
            Character definitions and style references improve consistency but cannot guarantee identical visual treatment. 
            Consider this tool for pre-visualization and concept development.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
