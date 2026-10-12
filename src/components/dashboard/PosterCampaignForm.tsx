"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Upload, Check } from "lucide-react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { createPosterCampaign } from "@/app/dashboard/posters/actions";
import { RECOMMENDED_TEMPLATE_SIZE, type PhotoZone } from "@/lib/poster";
import { PhotoZoneEditor, defaultPhotoZone } from "./PhotoZoneEditor";

const THEME_OPTIONS: { id: "BRIQUE" | "DORE" | "FORET"; label: string; swatch: string }[] = [
  { id: "BRIQUE", label: "Brique", swatch: "#331408" },
  { id: "DORE", label: "Doré", swatch: "#332709" },
  { id: "FORET", label: "Forêt", swatch: "#0D1F17" },
];

export function PosterCampaignForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [theme, setTheme] = useState<"BRIQUE" | "DORE" | "FORET">("BRIQUE");
  const [template, setTemplate] = useState<{ publicId: string; width: number; height: number } | null>(null);
  const [photoZone, setPhotoZone] = useState<PhotoZone | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setIsPending(true);
    const res = await createPosterCampaign({
      title,
      eventDate: eventDate || undefined,
      theme,
      template: template ? { ...template, photoZone } : null,
    });
    setIsPending(false);
    if (res.success) {
      setOpen(false);
      setTitle("");
      setEventDate("");
      setTheme("BRIQUE");
      setTemplate(null);
      setPhotoZone(null);
      router.refresh();
    } else {
      setError(res.error);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-primary hover:bg-accent-600 text-white font-bold rounded-xl px-5 py-3 transition-colors"
      >
        <Plus size={18} /> Créer une affiche
      </button>
    );
  }

  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-6 space-y-5 max-w-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg text-ink">Nouvelle affiche</h3>
        <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink">
          <X size={18} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Titre de l'événement *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Mariage de Pierre & Marie, Concert DJ Untel..."
          className="block w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
          maxLength={80}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Date (optionnel)</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="block w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
        />
      </div>

      <div className="border-t border-ink/10 pt-5">
        <label className="block text-sm font-semibold text-ink mb-1.5">Gabarit personnalisé (optionnel)</label>
        <p className="text-xs text-ink/50 mb-3">
          Un visuel PNG à vous, avec une zone transparente là où la photo de chaque visiteur
          doit apparaître (comme un cadre Facebook/Twibbon). Taille recommandée :{" "}
          {RECOMMENDED_TEMPLATE_SIZE}. Sans gabarit, une affiche simple est générée automatiquement.
        </p>

        {template ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-success bg-success/10 rounded-lg px-3 py-2.5">
              <Check size={16} /> Gabarit ajouté ({template.width}×{template.height}px)
              <button
                type="button"
                onClick={() => {
                  setTemplate(null);
                  setPhotoZone(null);
                }}
                className="ml-auto text-ink/40 hover:text-red-600"
              >
                <X size={14} />
              </button>
            </div>
            {photoZone && <PhotoZoneEditor template={template} value={photoZone} onChange={setPhotoZone} />}
          </div>
        ) : (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "kamita_preset"}
            options={{ sources: ["local"], multiple: false }}
            onSuccess={(result: CloudinaryUploadWidgetResults) => {
              if (typeof result.info !== "object" || !result.info) return;
              const info = result.info;
              if (!info.width || !info.height) return;
              const nextTemplate = { publicId: info.public_id, width: info.width, height: info.height };
              setTemplate(nextTemplate);
              setPhotoZone(defaultPhotoZone(nextTemplate));
            }}
          >
            {({ open: openWidget }) => (
              <button
                type="button"
                onClick={() => openWidget()}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-ink/15 rounded-xl px-4 py-3.5 text-sm font-semibold text-ink/60 hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Upload size={16} /> Importer un gabarit PNG
              </button>
            )}
          </CldUploadWidget>
        )}

        {!template && (
          <div className="mt-3 flex gap-3">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-2 rounded-xl border-2 px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  theme === t.id ? "border-primary bg-primary/5" : "border-ink/10 hover:border-ink/25"
                }`}
              >
                <span className="w-4 h-4 rounded-full border border-white shadow" style={{ background: t.swatch }} />
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!title.trim() || isPending}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-accent-600 text-white font-bold rounded-xl px-5 py-3 transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
        {isPending ? "Création..." : "Créer l'affiche"}
      </button>
    </div>
  );
}
