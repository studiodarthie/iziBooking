"use client";

import Image from "next/image";
import { Play } from "lucide-react";

type MediaLink = {
  id: string;
  url: string;
  type: string;
  publicId?: string | null;
};

export function PublicGallery({ mediaLinks }: { mediaLinks: MediaLink[] }) {
  if (!mediaLinks || mediaLinks.length === 0) {
    return (
      <div className="text-center py-12 bg-sand/30 rounded-xl border border-dashed border-ink/20">
        <p className="text-ink/60">Aucun média disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {mediaLinks.map((media) => {
        const isVideo = media.type.includes("video") || media.url.includes("video/upload");

        // Simple preview (for videos we'd ideally show a thumbnail, here we show an icon over the video)
        return (
          <div 
            key={media.id} 
            className="relative aspect-square rounded-xl overflow-hidden bg-ink/5 group cursor-pointer"
          >
            {isVideo ? (
              <>
                <video 
                  src={media.url} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-ink/20 flex items-center justify-center group-hover:bg-ink/30 transition-colors">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-primary shadow-lg">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                </div>
              </>
            ) : (
              <Image 
                src={media.url} 
                alt="Media" 
                fill 
                className="object-cover transition-transform duration-300 group-hover:scale-105" 
                unoptimized
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
