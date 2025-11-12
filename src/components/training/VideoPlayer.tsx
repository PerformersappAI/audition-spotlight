import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string | null;
  onProgress?: (percentage: number) => void;
}

export function VideoPlayer({ videoUrl, onProgress }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!videoUrl) {
    return (
      <Card className="aspect-video bg-muted flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Video content coming soon</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        <video
          src={videoUrl}
          className="w-full h-full"
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onVolumeChange={(e) => setIsMuted((e.target as HTMLVideoElement).muted)}
          onTimeUpdate={(e) => {
            const video = e.target as HTMLVideoElement;
            const percentage = (video.currentTime / video.duration) * 100;
            onProgress?.(Math.floor(percentage));
          }}
        />
      </div>
    </Card>
  );
}
