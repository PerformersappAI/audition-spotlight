import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import styleComic from "@/assets/style-comic.jpg";
import styleCinematic from "@/assets/style-cinematic.jpg";
import stylePencil from "@/assets/style-pencil.jpg";
import style3D from "@/assets/style-3d.jpg";
import styleWatercolor from "@/assets/style-watercolor.jpg";
import styleCharcoal from "@/assets/style-charcoal.jpg";
import styleAnime from "@/assets/style-anime.jpg";
import styleVector from "@/assets/style-vector.jpg";
import styleNoir from "@/assets/style-noir.jpg";
import styleStick from "@/assets/style-stick.jpg";
import styleGraphicNovel from "@/assets/style-graphic-novel.jpg";

export interface ArtStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  thumbnail: string | null;
}

export const artStyles: ArtStyle[] = [
  {
    id: 'comic',
    name: 'Comic Book',
    description: 'Bold lines and colors',
    promptModifier: 'comic book illustration style, bold ink lines, dynamic colors, graphic novel aesthetic',
    thumbnail: styleComic
  },
  {
    id: 'cinematic',
    name: 'Cinematic Photo',
    description: 'Photorealistic film look',
    promptModifier: 'cinematic photograph, 35mm film, photorealistic, movie still',
    thumbnail: styleCinematic
  },
  {
    id: 'soft-pencil',
    name: 'Soft Pencil',
    description: 'Gentle pencil sketch',
    promptModifier: 'soft pencil sketch, graphite drawing, subtle shading, artistic sketch',
    thumbnail: stylePencil
  },
  {
    id: 'animation-3d',
    name: 'Animation 3D',
    description: 'Pixar-style rendering',
    promptModifier: '3D animated style, Pixar aesthetic, smooth rendering, vibrant colors',
    thumbnail: style3D
  },
  {
    id: 'watercolor',
    name: 'Watercolor Paint',
    description: 'Flowing watercolor art',
    promptModifier: 'watercolor painting, flowing colors, artistic brushstrokes, painted illustration',
    thumbnail: styleWatercolor
  },
  {
    id: 'charcoal',
    name: 'Charcoal Sketch',
    description: 'Traditional charcoal art',
    promptModifier: 'charcoal drawing, dramatic shading, textured strokes, monochrome sketch',
    thumbnail: styleCharcoal
  },
  {
    id: 'anime',
    name: 'Dark Anime',
    description: 'Manga-style illustration',
    promptModifier: 'dark anime illustration, manga style, dramatic lighting, Japanese animation aesthetic',
    thumbnail: styleAnime
  },
  {
    id: 'vector',
    name: 'Flat Vector',
    description: 'Clean graphic design',
    promptModifier: 'flat vector illustration, minimalist design, clean shapes, graphic design style',
    thumbnail: styleVector
  },
  {
    id: 'noir',
    name: 'Film Noir',
    description: 'High contrast B&W',
    promptModifier: 'film noir aesthetic, high contrast black and white, dramatic shadows, classic cinema',
    thumbnail: styleNoir
  },
  {
    id: 'stick-figure',
    name: 'Stick Figure',
    description: 'Simple line art',
    promptModifier: 'stick figure illustration, simple line drawing, minimalist sketch, basic shapes',
    thumbnail: styleStick
  },
  {
    id: 'graphic-novel',
    name: 'Graphic Novel',
    description: 'Detailed comic art',
    promptModifier: 'graphic novel illustration, detailed ink work, sequential art, professional comic book style',
    thumbnail: styleGraphicNovel
  },
  {
    id: 'custom',
    name: 'Custom Style',
    description: 'Define your own style',
    promptModifier: '',
    thumbnail: null
  }
];

interface ArtStyleSelectorProps {
  selectedStyle: string;
  customStylePrompt: string;
  onStyleChange: (styleId: string) => void;
  onCustomPromptChange: (prompt: string) => void;
}

export function ArtStyleSelector({
  selectedStyle,
  customStylePrompt,
  onStyleChange,
  onCustomPromptChange
}: ArtStyleSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Art Style</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a visual style for your storyboard frames
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artStyles.map((style) => (
          <Card
            key={style.id}
            className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg relative ${
              selectedStyle === style.id
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:ring-1 hover:ring-border'
            }`}
            onClick={() => onStyleChange(style.id)}
          >
            <CardContent className="p-3">
              {style.thumbnail ? (
                <div className="aspect-square rounded-md overflow-hidden mb-2 bg-muted">
                  <img
                    src={style.thumbnail}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-md overflow-hidden mb-2 bg-muted flex items-center justify-center">
                  <span className="text-4xl">✨</span>
                </div>
              )}
              <CardTitle className="text-sm font-semibold mb-1">
                {style.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {style.description}
              </CardDescription>
              {selectedStyle === style.id && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStyle === 'custom' && (
        <div className="space-y-2 mt-4">
          <Label htmlFor="custom-style">Custom Style Description</Label>
          <Textarea
            id="custom-style"
            placeholder="Describe the visual style you want (e.g., 'oil painting with impressionist brushstrokes', 'retro 80s animation', 'minimalist line art')"
            value={customStylePrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Describe the artistic style, medium, and aesthetic for your storyboard frames
          </p>
        </div>
      )}
    </div>
  );
}
