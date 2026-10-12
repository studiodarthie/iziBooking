"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildTemplatePreviewUrl, type PhotoZone } from "@/lib/poster";

type DisplayRect = { x: number; y: number; width: number; height: number };

const MIN_SIZE = 24;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * Laisse l'organisateur positionner/redimensionner, par glisser-déposer, le cadre qui indique
 * où la photo de chaque visiteur doit s'insérer dans le gabarit (la zone transparente du PNG).
 * Le rectangle est manipulé en pixels d'affichage puis converti vers les pixels natifs du
 * gabarit (ce que `value`/`onChange` exposent) au moment de chaque mise à jour.
 */
export function PhotoZoneEditor({
  template,
  value,
  onChange,
}: {
  template: { publicId: string; width: number; height: number };
  value: PhotoZone;
  onChange: (zone: PhotoZone) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayWidth, setDisplayWidth] = useState<number | null>(null);
  const dragRef = useRef<{ mode: "move" | "resize"; startX: number; startY: number; startRect: DisplayRect } | null>(
    null
  );

  const previewUrl = buildTemplatePreviewUrl(template);
  const scale = displayWidth ? displayWidth / template.width : null;
  const displayHeight = displayWidth ? displayWidth * (template.height / template.width) : null;

  const rect: DisplayRect | null = scale
    ? { x: value.x * scale, y: value.y * scale, width: value.width * scale, height: value.height * scale }
    : null;

  const updateDisplayWidth = useCallback(() => {
    if (containerRef.current) setDisplayWidth(containerRef.current.clientWidth);
  }, []);

  useEffect(() => {
    updateDisplayWidth();
    window.addEventListener("resize", updateDisplayWidth);
    return () => window.removeEventListener("resize", updateDisplayWidth);
  }, [updateDisplayWidth]);

  const commitDisplayRect = useCallback(
    (next: DisplayRect) => {
      if (!scale) return;
      onChange({
        x: Math.round(next.x / scale),
        y: Math.round(next.y / scale),
        width: Math.round(next.width / scale),
        height: Math.round(next.height / scale),
      });
    },
    [scale, onChange]
  );

  const startDrag = (mode: "move" | "resize") => (e: React.PointerEvent) => {
    if (!rect) return;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragRef.current = { mode, startX: e.clientX, startY: e.clientY, startRect: rect };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || !displayWidth || !displayHeight) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.mode === "move") {
      commitDisplayRect({
        ...drag.startRect,
        x: clamp(drag.startRect.x + dx, 0, displayWidth - drag.startRect.width),
        y: clamp(drag.startRect.y + dy, 0, displayHeight - drag.startRect.height),
      });
    } else {
      commitDisplayRect({
        ...drag.startRect,
        width: clamp(drag.startRect.width + dx, MIN_SIZE, displayWidth - drag.startRect.x),
        height: clamp(drag.startRect.height + dy, MIN_SIZE, displayHeight - drag.startRect.y),
      });
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="relative select-none mx-auto max-w-[280px] rounded-lg overflow-hidden border border-ink/15 touch-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Gabarit"
          className="w-full h-auto block pointer-events-none"
          draggable={false}
          onLoad={updateDisplayWidth}
        />
        {rect && (
          <div
            onPointerDown={startDrag("move")}
            className="absolute border-2 border-primary bg-primary/15 cursor-move"
            style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
          >
            <div
              onPointerDown={startDrag("resize")}
              className="absolute -right-2 -bottom-2 w-5 h-5 bg-primary rounded-full border-2 border-white cursor-nwse-resize"
            />
          </div>
        )}
      </div>
      <p className="text-center text-ink/45 text-[11px] mt-2">
        Déplacez et redimensionnez le cadre pour qu&apos;il couvre la zone transparente de votre
        gabarit : c&apos;est là que la photo de chaque visiteur apparaîtra.
      </p>
    </div>
  );
}

/** Zone par défaut à l'ajout d'un gabarit : un rectangle portrait centré, à ajuster ensuite. */
export function defaultPhotoZone(template: { width: number; height: number }): PhotoZone {
  const width = Math.round(template.width * 0.45);
  const height = Math.round(template.height * 0.4);
  return {
    x: Math.round((template.width - width) / 2),
    y: Math.round((template.height - height) / 2),
    width,
    height,
  };
}
