"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, MoveDiagonal2 } from "lucide-react";
import { PhotoZoneEditor, defaultPhotoZone } from "./PhotoZoneEditor";
import { updatePosterPhotoZone } from "@/app/dashboard/posters/actions";
import { buildPosterUrl, DEMO_PHOTO_PUBLIC_ID, type PhotoZone } from "@/lib/poster";
import type { PosterTheme } from "@prisma/client";

/**
 * Permet de recalibrer, après coup, la zone où la photo de chaque visiteur s'insère dans un
 * gabarit déjà créé — glisser pour déplacer, poignée pour redimensionner (cf. PhotoZoneEditor).
 * Un aperçu composité avec une photo de démonstration se met à jour en direct pour que
 * l'organisateur voie immédiatement le résultat, sans attendre qu'un visiteur génère une affiche.
 */
export function PosterZonePanel({
  campaignId,
  template,
  title,
  theme,
  showWatermark,
  initialZone,
}: {
  campaignId: string;
  template: { publicId: string; width: number; height: number };
  title: string;
  theme: PosterTheme;
  showWatermark: boolean;
  initialZone: PhotoZone | null;
}) {
  const [zone, setZone] = useState<PhotoZone>(() => initialZone ?? defaultPhotoZone(template));
  const [debouncedZone, setDebouncedZone] = useState(zone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedZone(zone), 200);
    return () => clearTimeout(id);
  }, [zone]);

  const previewUrl = buildPosterUrl({
    photoPublicId: DEMO_PHOTO_PUBLIC_ID,
    title,
    theme,
    showWatermark,
    template: { ...template, photoZone: debouncedZone },
  });

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const res = await updatePosterPhotoZone(campaignId, zone);
    setSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <MoveDiagonal2 size={16} className="text-primary" />
        <h2 className="font-heading font-bold text-ink">Cadrage de la photo</h2>
      </div>
      <p className="text-xs text-ink/50 mb-4">
        Ajustez le cadre pour qu&apos;il couvre exactement la zone transparente de votre gabarit.
        L&apos;aperçu à droite montre le résultat avec une photo de démonstration.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <PhotoZoneEditor template={template} value={zone} onChange={setZone} />

        <div className="mx-auto w-full max-w-[220px]">
          <div
            className="rounded-xl overflow-hidden border border-ink/10 shadow-sm"
            style={{ aspectRatio: `${template.width} / ${template.height}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
          </div>
          <p className="text-center text-ink/40 text-[11px] mt-2">Aperçu avec photo de démonstration</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary hover:bg-accent-600 text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {saving ? "Enregistrement..." : "Enregistrer le cadrage"}
        </button>
        {saved && <span className="text-sm font-semibold text-success">Enregistré ✓</span>}
        {error && <span className="text-sm font-semibold text-red-600">{error}</span>}
      </div>
    </div>
  );
}
