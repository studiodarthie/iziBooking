"use client";

import { useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Camera, Download, Share2, RefreshCw, Eye, Images, ChevronDown, Check } from "lucide-react";
import { buildPosterUrl, buildTemplatePreviewUrl, POSTER_THEMES, type PosterTemplate } from "@/lib/poster";
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
  const [photoPublicId, setPhotoPublicId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  const posterUrl = photoPublicId
    ? buildPosterUrl({ photoPublicId, title, eventDateLabel, theme, showWatermark, template })
    : null;
  const previewUrl = posterUrl ?? (template ? buildTemplatePreviewUrl(template) : null);
  const downloadUrl = posterUrl?.replace("/image/upload/", "/image/upload/fl_attachment/");

  const canvasRatio = template ? `${template.width}:${template.height}` : "1080:1350";
  const aspectCss = template ? `${template.width} / ${template.height}` : "1080 / 1350";

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
        <span
          className="inline-block text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full mb-3"
          style={{ backgroundColor: `#${t.accent}33`, color: `#${t.accent}` }}
        >
          J&apos;y serai
        </span>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">{title}</h1>
        {eventDateLabel && <p className="text-white/70 mt-1">{eventDateLabel}</p>}

        <div className="mt-4 flex items-center justify-center gap-4 text-white/60 text-sm">
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
              <div className="w-full h-full flex items-center justify-center text-white/50 text-sm px-8 text-center">
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
                cropping: true,
                croppingAspectRatio: template?.photoZone
                  ? template.photoZone.width / template.photoZone.height
                  : template
                    ? template.width / template.height
                    : 1080 / 1350,
                croppingShowDimensions: true,
                showSkipCropButton: false,
              }}
              onSuccess={(result: CloudinaryUploadWidgetResults) => {
                if (typeof result.info !== "object" || !result.info) return;
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
                  {photoPublicId ? "Changer la photo" : "1. Ajouter ma photo (cadrage ajustable)"}
                </button>
              )}
            </CldUploadWidget>
            <p className="text-center text-white/40 text-xs mt-3">
              Format conseillé : portrait, ratio {canvasRatio}.
            </p>
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
                disabled={!photoPublicId || isSubmitting}
                className="w-full flex items-center justify-center gap-2 font-bold rounded-xl px-4 py-3 mt-2 transition-colors disabled:opacity-40"
                style={{ backgroundColor: `#${t.accent}`, color: "#1a1208" }}
              >
                <Download size={18} />
                {isSubmitting ? "..." : "3. Télécharger"}
              </button>
              {!photoPublicId && (
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
      <div className="mt-8 max-w-2xl mx-auto bg-white/95 rounded-2xl overflow-hidden">
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

      <p className="text-center text-white/40 text-xs mt-6">
        Affiche générée avec{" "}
        <a href="/jyserai" className="underline">
          iziBooking
        </a>
      </p>
    </div>
  );
}
