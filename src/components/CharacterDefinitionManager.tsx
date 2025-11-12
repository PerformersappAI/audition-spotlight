import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users, Upload, X, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface CharacterDefinition {
  name: string;
  description: string;
  traits: string;
  imageUrl?: string;
}

interface CharacterDefinitionManagerProps {
  characters: CharacterDefinition[];
  onChange: (characters: CharacterDefinition[]) => void;
  onSave?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
}

export const CharacterDefinitionManager = ({ characters, onChange, onSave, canSave, isSaving }: CharacterDefinitionManagerProps) => {
  const { toast } = useToast();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addCharacter = () => {
    onChange([...characters, { name: "", description: "", traits: "", imageUrl: "" }]);
  };

  const updateCharacter = (index: number, field: keyof CharacterDefinition, value: string) => {
    const updated = [...characters];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeCharacter = (index: number) => {
    onChange(characters.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('storyboard-characters')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('storyboard-characters')
        .getPublicUrl(filePath);

      updateCharacter(index, 'imageUrl', publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Character reference image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload character image",
        variant: "destructive",
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  const removeImage = (index: number) => {
    updateCharacter(index, 'imageUrl', '');
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

            <div className="space-y-2">
              <Label htmlFor={`char-image-${index}`}>Reference Photo (Optional)</Label>
              <div className="flex flex-col gap-2">
                {character.imageUrl ? (
                  <div className="relative">
                    <img 
                      src={character.imageUrl} 
                      alt={`${character.name} reference`}
                      className="w-full h-48 object-cover rounded-md border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-md p-4 text-center">
                    <Input
                      id={`char-image-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                      disabled={uploadingIndex === index}
                    />
                    <Label 
                      htmlFor={`char-image-${index}`}
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {uploadingIndex === index ? 'Uploading...' : 'Click to browse for an image'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Max 5MB • JPG, PNG, WEBP
                      </span>
                    </Label>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload a reference photo to help maintain consistent character appearance across all panels
              </p>
            </div>
          </div>
        ))}

        <Button onClick={addCharacter} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Character
        </Button>

        {characters.length > 0 && onSave && (
          <Button 
            onClick={onSave} 
            disabled={!canSave || isSaving}
            className="w-full mt-2"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Characters'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
