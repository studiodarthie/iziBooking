"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ZoomIn } from "lucide-react";
import { buildCloudinaryUrl, defaultPhotoCrop, type PhotoCrop } from "@/lib/poster";

const MAX_ZOOM = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * Laisse le visiteur déplacer (glisser) et zoomer sa photo déjà envoyée, directement dans le
 * cadre au ratio de la zone du gabarit — sans avoir à ressélectionner un fichier. Émet le
 * recadrage choisi, en pixels natifs de la photo, pour que `buildPosterUrl` l'applique tel quel
 * (c_crop) plutôt que de laisser Cloudinary deviner un cadrage automatique.
 */
export function PhotoAdjuster({
  photo,
  aspectRatio,
  onChange,
}: {
  photo: { publicId: string; width: number; height: number };
  aspectRatio: number;
  onChange: (crop: PhotoCrop) => void;
}) {
  const baseCrop = useRef(defaultPhotoCrop(photo, aspectRatio)).current;
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayWidth, setDisplayWidth] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ cx: baseCrop.x + baseCrop.width / 2, cy: baseCrop.y + baseCrop.height / 2 });
  const dragRef = useRef<{ startX: number; startY: number; startCenter: { cx: number; cy: number } } | null>(null);

  const cropWidth = baseCrop.width / zoom;
  const cropHeight = baseCrop.height / zoom;
  const halfW = cropWidth / 2;
  const halfH = cropHeight / 2;
  const cx = clamp(center.cx, halfW, photo.width - halfW);
  const cy = clamp(center.cy, halfH, photo.height - halfH);
  const crop: PhotoCrop = {
    x: Math.round(cx - halfW),
    y: Math.round(cy - halfH),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight),
  };

  const updateDisplayWidth = useCallback(() => {
    if (containerRef.current) setDisplayWidth(containerRef.current.clientWidth);
  }, []);

  useEffect(() => {
    updateDisplayWidth();
    window.addEventListener("resize", updateDisplayWidth);
    return () => window.removeEventListener("resize", updateDisplayWidth);
  }, [updateDisplayWidth]);

  useEffect(() => {
    onChange(crop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop.x, crop.y, crop.width, crop.height]);

  const scale = displayWidth ? displayWidth / crop.width : null;

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startCenter: center };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || !scale) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    setCenter({
      cx: drag.startCenter.cx - dx / scale,
      cy: drag.startCenter.cy - dy / scale,
    });
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const imgUrl = buildCloudinaryUrl(photo.publicId, "f_auto,q_auto");
  const displayHeight = displayWidth ? displayWidth / aspectRatio : null;
  const imgDisplayWidth = scale ? photo.width * scale : 0;
  const imgDisplayHeight = scale ? photo.height * scale : 0;
  const imgLeft = scale ? -crop.x * scale : 0;
  const imgTop = scale ? -crop.y * scale : 0;

  return (
    <div>
      <div
        ref={containerRef}
        className="relative mx-auto overflow-hidden rounded-xl border-2 border-white/70 shadow-lg select-none touch-none cursor-move bg-black/20"
        style={{ width: "100%", maxWidth: 200, aspectRatio: `${aspectRatio}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {displayWidth && displayHeight && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgUrl}
            alt="Votre photo"
            draggable={false}
            className="absolute max-w-none pointer-events-none"
            style={{ width: imgDisplayWidth, height: imgDisplayHeight, left: imgLeft, top: imgTop }}
          />
        )}
      </div>

      <div className="flex items-center gap-2 mt-2.5 max-w-[200px] mx-auto">
        <ZoomIn size={14} className="text-white/50 shrink-0" />
        <input
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-white"
        />
      </div>
      <p className="text-center text-white/40 text-[11px] mt-1.5">Glissez pour repositionner, zoomez pour recadrer</p>
    </div>
  );
}
