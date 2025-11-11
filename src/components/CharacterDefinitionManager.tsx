import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users } from "lucide-react";

export interface CharacterDefinition {
  name: string;
  description: string;
  traits: string;
}

interface CharacterDefinitionManagerProps {
  characters: CharacterDefinition[];
  onChange: (characters: CharacterDefinition[]) => void;
}

export const CharacterDefinitionManager = ({ characters, onChange }: CharacterDefinitionManagerProps) => {
  const addCharacter = () => {
    onChange([...characters, { name: "", description: "", traits: "" }]);
  };

  const updateCharacter = (index: number, field: keyof CharacterDefinition, value: string) => {
    const updated = [...characters];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeCharacter = (index: number) => {
    onChange(characters.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>Character Definitions</CardTitle>
        </div>
        <CardDescription>
          Define your characters once for consistent appearance across all panels. Include detailed physical descriptions, clothing, and distinguishing features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {characters.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No characters defined yet. Add your first character to improve consistency.</p>
          </div>
        )}
        
        {characters.map((character, index) => (
          <div key={index} className="space-y-4 p-4 border border-border/50 rounded-lg bg-muted/20">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-sm text-foreground">Character {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCharacter(index)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`char-name-${index}`}>Character Name</Label>
              <Input
                id={`char-name-${index}`}
                placeholder="e.g., SARAH, Detective Martinez"
                value={character.name}
                onChange={(e) => updateCharacter(index, "name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`char-desc-${index}`}>Physical Description</Label>
              <Textarea
                id={`char-desc-${index}`}
                placeholder="Detailed physical appearance: height, build, hair color/style, eye color, facial features, clothing, accessories, age appearance..."
                value={character.description}
                onChange={(e) => updateCharacter(index, "description", e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Be specific: "Tall woman, 5'10", athletic build, long straight black hair in ponytail, sharp green eyes, wearing navy suit with white blouse"
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`char-traits-${index}`}>Character Traits & Posture</Label>
              <Textarea
                id={`char-traits-${index}`}
                placeholder="Personality traits that affect appearance: confident posture, nervous mannerisms, calm demeanor, energetic movements..."
                value={character.traits}
                onChange={(e) => updateCharacter(index, "traits", e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
        ))}

        <Button onClick={addCharacter} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Character
        </Button>
      </CardContent>
    </Card>
  );
};
