"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Camera, Download, Share2, RefreshCw, Eye, Images, ChevronDown, Check } from "lucide-react";
import { buildPosterUrl, buildTemplatePreviewUrl, POSTER_THEMES, type PosterTemplate, type PhotoCrop } from "@/lib/poster";
import { PhotoAdjuster } from "./PhotoAdjuster";
import { submitPosterLead } from "@/app/jyserai/[slug]/actions";
import type { PosterTheme } from "@prisma/client";

const inputClass =
  "block w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none";

export function PosterGenerator({
  slug,
  title,
  eventDate,
  theme,
  showWatermark,
  template,
  viewCount,
  generatedCount,
  maxPerPerson,
}: {
  slug: string;
  title: string;
  eventDate: string | null;
  theme: PosterTheme;
  showWatermark: boolean;
  template: PosterTemplate | null;
  viewCount: number;
  generatedCount: number;
  maxPerPerson: number;
}) {
  const [photo, setPhoto] = useState<{ publicId: string; width: number; height: number } | null>(null);
  const [photoCrop, setPhotoCrop] = useState<PhotoCrop | null>(null);
  const [debouncedCrop, setDebouncedCrop] = useState<PhotoCrop | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Évite de régénérer l'URL Cloudinary (donc de spammer des requêtes) à chaque pixel de
  // glissement dans PhotoAdjuster — seul l'aperçu <img> affiché est retardé, pas le recadrage
  // réellement enregistré (photoCrop), utilisé tel quel au moment du téléchargement.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedCrop(photoCrop), 150);
    return () => clearTimeout(id);
  }, [photoCrop]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isWhatsapp, setIsWhatsapp] = useState(true);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  const t = POSTER_THEMES[theme];
  const eventDateLabel = eventDate
    ? new Date(eventDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const previewPosterUrl = photo
    ? buildPosterUrl({
        photoPublicId: photo.publicId,
        title,
        eventDateLabel,
        theme,
        showWatermark,
        template,
        photoCrop: debouncedCrop,
      })
    : null;
  const previewUrl = previewPosterUrl ?? (template ? buildTemplatePreviewUrl(template) : null);

  // Recadrage exact (non retardé) au moment du téléchargement, pour que le fichier téléchargé
  // corresponde pile à ce que le visiteur a validé, même si l'aperçu affiché a un léger délai.
  const finalPosterUrl = photo
    ? buildPosterUrl({
        photoPublicId: photo.publicId,
        title,
        eventDateLabel,
        theme,
        showWatermark,
        template,
        photoCrop,
        format: "png",
      })
    : null;
  const downloadUrl = finalPosterUrl?.replace("/image/upload/", "/image/upload/fl_attachment/");

  const canvasRatio = template ? `${template.width}:${template.height}` : "1080:1350";
  const aspectCss = template ? `${template.width} / ${template.height}` : "1080 / 1350";
  const zoneAspectRatio = template?.photoZone
    ? template.photoZone.width / template.photoZone.height
    : template
      ? template.width / template.height
      : 1080 / 1350;

  const handleDownload = async () => {
    setFormError(null);
    if (!firstName.trim() || !lastName.trim()) return setFormError("Prénom et nom sont obligatoires.");
    if (phone.trim().length < 8) return setFormError("Numéro de téléphone invalide.");
    if (!consent) return setFormError("Merci d'accepter l'utilisation de vos informations pour continuer.");

    setIsSubmitting(true);
    const res = await submitPosterLead(slug, {
      firstName,
      lastName,
      phone,
      isWhatsapp,
      email: email || undefined,
      consent,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setFormError(res.error);
      return;
    }

    setUnlocked(true);
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const shareText = eventDateLabel ? `${title} — ${eventDateLabel}` : title;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `J'y serai ! ${shareText} 👉 ${typeof window !== "undefined" ? window.location.href : ""}`
  )}`;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-block bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full mb-3">
          J&apos;y serai
        </span>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-ink">{title}</h1>
        {eventDateLabel && <p className="text-ink/60 mt-1">{eventDateLabel}</p>}

        <div className="mt-4 flex items-center justify-center gap-4 text-ink/50 text-sm">
          <span className="flex items-center gap-1.5">
            <Eye size={15} /> {viewCount} vue{viewCount > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Images size={15} /> {generatedCount} affiche{generatedCount > 1 ? "s" : ""} générée{generatedCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Colonne gauche : aperçu + upload */}
        <div>
          <div
            className="rounded-3xl overflow-hidden shadow-2xl border-4 mx-auto max-w-[420px]"
            style={{ borderColor: `#${t.accent}`, aspectRatio: aspectCss, backgroundColor: `#${t.bg}` }}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/60 text-sm px-8 text-center">
                Ajoutez votre photo pour générer votre affiche
              </div>
            )}
          </div>

          <div className="mt-5 max-w-[420px] mx-auto">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "kamita_preset"}
              options={{
                sources: ["local", "camera"],
                multiple: false,
                // Avec un gabarit, on gère nous-mêmes le recadrage après coup (PhotoAdjuster,
                // ajustable à tout moment) plutôt que de figer un cadrage unique à l'upload.
                cropping: !template,
                croppingAspectRatio: zoneAspectRatio,
                croppingShowDimensions: true,
                showSkipCropButton: false,
              }}
              onSuccess={(result: CloudinaryUploadWidgetResults) => {
                if (typeof result.info !== "object" || !result.info) return;
                const info = result.info;
                if (!info.width || !info.height) return;
                setPhoto({ publicId: info.public_id, width: info.width, height: info.height });
                setPhotoCrop(null);
                setDebouncedCrop(null);
              }}
            >
              {({ open }) =>
                photo && template ? (
                  <div className="flex flex-col items-center gap-3">
                    <PhotoAdjuster key={photo.publicId} photo={photo} aspectRatio={zoneAspectRatio} onChange={setPhotoCrop} />
                    <button
                      type="button"
                      onClick={() => open()}
                      className="inline-flex items-center gap-1.5 text-ink/60 hover:text-ink text-xs font-semibold transition-colors"
                    >
                      <RefreshCw size={13} /> Changer de photo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-accent-600 text-white font-bold rounded-xl px-5 py-3.5 transition-colors"
                  >
                    <Camera size={18} />
                    1. Ajouter ma photo
                  </button>
                )
              }
            </CldUploadWidget>
            {!(photo && template) && (
              <p className="text-center text-ink/40 text-xs mt-3">
                Format conseillé : portrait, ratio {canvasRatio}.
              </p>
            )}
          </div>
        </div>

        {/* Colonne droite : infos + téléchargement */}
        <div className="bg-white rounded-2xl p-5 shadow-xl">
          <h2 className="font-heading font-bold text-ink mb-1">2. Vos informations</h2>
          <p className="text-xs text-ink/50 mb-4">
            Pour recevoir votre affiche et que l&apos;organisateur puisse vous tenir informé.
          </p>

          {!unlocked ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom"
                  className={inputClass}
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom"
                  className={inputClass}
                />
              </div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Téléphone"
                type="tel"
                className={inputClass}
              />
              <label className="flex items-center gap-2 text-xs text-ink/70">
                <input
                  type="checkbox"
                  checked={isWhatsapp}
                  onChange={(e) => setIsWhatsapp(e.target.checked)}
                  className="rounded border-ink/30"
                />
                Ce numéro est aussi mon WhatsApp
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optionnel)"
                type="email"
                className={inputClass}
              />
              <label className="flex items-start gap-2 text-xs text-ink/60 pt-1">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-ink/30"
                />
                J&apos;accepte que mes informations soient collectées et utilisées par
                l&apos;organisateur de cet événement dans le cadre de cette campagne d&apos;affiches.
              </label>

              {formError && <p className="text-xs text-red-600 font-medium">{formError}</p>}

              <button
                onClick={handleDownload}
                disabled={!photo || isSubmitting}
                className="w-full flex items-center justify-center gap-2 font-bold rounded-xl px-4 py-3 mt-2 transition-colors disabled:opacity-40"
                style={{ backgroundColor: `#${t.accent}`, color: "#1a1208" }}
              >
                <Download size={18} />
                {isSubmitting ? "..." : "3. Télécharger"}
              </button>
              {!photo && (
                <p className="text-center text-ink/40 text-[11px]">Ajoutez d&apos;abord votre photo à gauche.</p>
              )}
              <p className="text-center text-ink/40 text-[11px]">{maxPerPerson} affiche par personne.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-success bg-success/10 rounded-lg px-3 py-2.5">
                <Check size={16} /> Affiche téléchargée !
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold rounded-xl px-4 py-3 hover:bg-[#1ebd5a] transition-colors"
              >
                <Share2 size={18} /> Partager sur WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Détails de l'événement */}
      <div className="mt-8 max-w-2xl mx-auto bg-white border border-ink/10 rounded-2xl overflow-hidden">
        <button
          onClick={() => setDetailsOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 font-heading font-bold text-ink"
        >
          Comment ça marche
          <ChevronDown size={18} className={`transition-transform ${detailsOpen ? "rotate-180" : ""}`} />
        </button>
        {detailsOpen && (
          <div className="px-5 pb-5 text-sm text-ink/70 space-y-2">
            <p>1. Ajoutez une photo nette (format portrait recommandé) et ajustez le cadrage.</p>
            <p>2. Renseignez vos informations pour débloquer le téléchargement.</p>
            <p>3. Téléchargez votre affiche en haute définition et partagez-la sur vos réseaux.</p>
          </div>
        )}
      </div>

      <p className="text-center text-ink/40 text-xs mt-6">
        Affiche générée avec{" "}
        <a href="/jyserai" className="underline hover:text-ink/60">
          iziBooking
        </a>
      </p>
    </div>
  );
}
