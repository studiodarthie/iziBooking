"use client";

import { useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Camera, Download, Share2, RefreshCw } from "lucide-react";
import { buildPosterUrl, POSTER_THEMES } from "@/lib/poster";
import { registerPosterGeneration } from "@/app/jyserai/[slug]/actions";
import type { PosterTheme } from "@prisma/client";

export function PosterGenerator({
  slug,
  title,
  eventDate,
  theme,
  showWatermark,
}: {
  slug: string;
  title: string;
  eventDate: string | null;
  theme: PosterTheme;
  showWatermark: boolean;
}) {
  const [photoPublicId, setPhotoPublicId] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const t = POSTER_THEMES[theme];

  const eventDateLabel = eventDate
    ? new Date(eventDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const posterUrl = photoPublicId
    ? buildPosterUrl({ photoPublicId, title, eventDateLabel, theme, showWatermark })
    : null;

  const registerOnce = async () => {
    if (isGenerated) return;
    setIsGenerated(true);
    registerPosterGeneration(slug).catch(() => {});
  };

  const downloadUrl = posterUrl?.replace("/image/upload/", "/image/upload/fl_attachment/");
  const shareText = eventDateLabel ? `${title} — ${eventDateLabel}` : title;
  const whatsappHref = posterUrl
    ? `https://wa.me/?text=${encodeURIComponent(`J'y serai ! ${shareText} 👉 ${typeof window !== "undefined" ? window.location.href : ""}`)}`
    : "#";

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <span
          className="inline-block text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full mb-3"
          style={{ backgroundColor: `#${t.accent}33`, color: `#${t.accent}` }}
        >
          J&apos;y serai
        </span>
        <h1 className="text-2xl font-heading font-bold text-white">{title}</h1>
        {eventDateLabel && <p className="text-white/70 mt-1">{eventDateLabel}</p>}
      </div>

      <div
        className="rounded-3xl overflow-hidden shadow-2xl border-4"
        style={{ borderColor: `#${t.accent}`, aspectRatio: "1080 / 1350", backgroundColor: `#${t.bg}` }}
      >
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={posterUrl} alt={title} className="w-full h-full object-cover" onLoad={registerOnce} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50 text-sm px-8 text-center">
            Ajoutez votre photo pour générer votre affiche
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "kamita_preset"}
          onSuccess={(result: CloudinaryUploadWidgetResults) => {
            if (typeof result.info !== "object" || !result.info) return;
            setIsGenerated(false);
            setPhotoPublicId(result.info.public_id);
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="w-full flex items-center justify-center gap-2 bg-white text-ink font-bold rounded-xl px-5 py-3.5 hover:bg-white/90 transition-colors"
            >
              {photoPublicId ? <RefreshCw size={18} /> : <Camera size={18} />}
              {photoPublicId ? "Changer la photo" : "Ajouter ma photo"}
            </button>
          )}
        </CldUploadWidget>

        {posterUrl && (
          <div className="flex gap-3">
            <a
              href={downloadUrl}
              download
              onClick={registerOnce}
              className="flex-1 flex items-center justify-center gap-2 font-bold rounded-xl px-4 py-3 transition-colors"
              style={{ backgroundColor: `#${t.accent}`, color: "#1a1208" }}
            >
              <Download size={18} /> Télécharger
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={registerOnce}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold rounded-xl px-4 py-3 hover:bg-[#1ebd5a] transition-colors"
            >
              <Share2 size={18} /> Partager
            </a>
          </div>
        )}
      </div>

      <p className="text-center text-white/40 text-xs mt-6">
        Affiche générée avec{" "}
        <a href="/" className="underline">
          iziBooking
        </a>
      </p>
    </div>
  );
}
