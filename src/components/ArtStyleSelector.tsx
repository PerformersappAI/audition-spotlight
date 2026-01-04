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
    id: 'camera-diagram',
    name: 'Camera Diagrams',
    description: 'Shot planning visuals',
    promptModifier: 'technical cinematography diagram, clean line art illustration showing camera positions and shot framing, educational storyboard style, top-down and side-view camera setup diagrams, simple black and white line drawing, film school instructional diagram, labeled camera angles, showing both camera placement and resulting shot, minimalist technical illustration',
    thumbnail: null
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
      <div className="mb-3">
        <h3 className="text-base font-semibold mb-1">Choose Art Style</h3>
        <p className="text-xs text-muted-foreground">
          Select a visual style for your storyboard frames
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory scrollbar-thin">
        {artStyles.map((style) => (
          <Card
            key={style.id}
            className={`flex-shrink-0 w-[140px] cursor-pointer transition-all hover:scale-105 relative ${
              selectedStyle === style.id
                ? 'ring-2 ring-primary'
                : 'hover:ring-1 hover:ring-border'
            }`}
            onClick={() => onStyleChange(style.id)}
          >
            <CardContent className="p-2">
              {style.thumbnail ? (
                <div className="w-full h-20 rounded-md overflow-hidden mb-1.5 bg-muted">
                  <img
                    src={style.thumbnail}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-20 rounded-md bg-muted flex items-center justify-center mb-1.5">
                  <span className="text-2xl">✨</span>
                </div>
              )}
              <div className="text-center">
                <p className="text-xs font-medium truncate">
                  {style.name}
                </p>
              </div>
              {selectedStyle === style.id && (
                <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                  <Check className="h-3 w-3" />
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
