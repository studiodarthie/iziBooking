"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";
import { createPosterCampaign } from "@/app/dashboard/posters/actions";

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
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setIsPending(true);
    const res = await createPosterCampaign({ title, eventDate: eventDate || undefined, theme });
    setIsPending(false);
    if (res.success) {
      setOpen(false);
      setTitle("");
      setEventDate("");
      setTheme("BRIQUE");
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

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Thème</label>
        <div className="flex gap-3">
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
