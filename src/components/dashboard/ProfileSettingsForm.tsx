"use client";

import { useState } from "react";
import { updateProviderSettings } from "@/app/dashboard/settings/actions";
import { Loader2 } from "lucide-react";
import type { ProviderProfile } from "@prisma/client";

export default function ProfileSettingsForm({ initialData }: { initialData: ProviderProfile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateProviderSettings(formData);
      if (res.success) {
        setMessage({ type: "success", text: "Paramètres mis à jour avec succès." });
      } else {
        setMessage({ type: "error", text: res.error || "Une erreur est survenue." });
      }
    } catch {
      setMessage({ type: "error", text: "Une erreur est survenue." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 bg-sand rounded-2xl p-6 md:p-8 border border-ink/10">
      
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Profil Public */}
      <section className="space-y-4">
        <h2 className="text-lg font-heading font-semibold text-ink">Profil Public</h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-ink">Nom de scène / Entreprise</label>
            <input type="text" id="name" name="name" defaultValue={initialData?.name} required
              className="block w-full rounded-xl border-ink/20 bg-transparent px-4 py-3 text-ink focus:border-primary focus:ring-primary sm:text-sm transition-colors" />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-ink">Localisation (Ville, Pays)</label>
            <input type="text" id="location" name="location" defaultValue={initialData?.location} required
              className="block w-full rounded-xl border-ink/20 bg-transparent px-4 py-3 text-ink focus:border-primary focus:ring-primary sm:text-sm transition-colors" />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-ink">Catégorie exacte</label>
            <input type="text" id="category" name="category" defaultValue={initialData?.category} required
              placeholder="Ex: DJ, Photographe, Traiteur..."
              className="block w-full rounded-xl border-ink/20 bg-transparent px-4 py-3 text-ink focus:border-primary focus:ring-primary sm:text-sm transition-colors" />
          </div>

          <div className="space-y-2">
            <label htmlFor="whatsapp" className="block text-sm font-medium text-ink">Numéro WhatsApp</label>
            <input type="text" id="whatsapp" name="whatsapp" defaultValue={initialData?.whatsapp || ""} 
              placeholder="Ex: +237699112233"
              className="block w-full rounded-xl border-ink/20 bg-transparent px-4 py-3 text-ink focus:border-primary focus:ring-primary sm:text-sm transition-colors" />
          </div>

          <div className="space-y-2">
            <label htmlFor="specialty" className="block text-sm font-medium text-ink">Spécialité / Style</label>
            <input type="text" id="specialty" name="specialty" defaultValue={initialData?.specialty || ""} placeholder="ex: Afrobeats, Cuisine Locale..."
              className="block w-full rounded-xl border-ink/20 bg-transparent px-4 py-3 text-ink focus:border-primary focus:ring-primary sm:text-sm transition-colors" />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label htmlFor="bio" className="block text-sm font-medium text-ink">Biographie / Présentation</label>
          <textarea id="bio" name="bio" rows={4} defaultValue={initialData?.bio || ""} placeholder="Présentez-vous en quelques phrases..."
            className="block w-full rounded-xl border-ink/20 bg-transparent px-4 py-3 text-ink focus:border-primary focus:ring-primary sm:text-sm transition-colors resize-none" />
        </div>
      </section>

      <hr className="border-ink/10" />

      {/* Tarification */}
      <section className="space-y-4">
        <h2 className="text-lg font-heading font-semibold text-ink">Tarification</h2>
        <p className="text-sm text-ink/70">Définissez votre prix de base pour une prestation standard. Vous pourrez toujours faire une offre personnalisée par message.</p>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="basePrice" className="block text-sm font-medium text-ink">Prix de base</label>
            <input type="number" id="basePrice" name="basePrice" defaultValue={initialData?.basePrice || ""} min="0" placeholder="0"
              className="block w-full rounded-xl border-ink/20 bg-transparent px-4 py-3 text-ink focus:border-primary focus:ring-primary sm:text-sm transition-colors" />
          </div>

          <div className="space-y-2">
            <label htmlFor="currency" className="block text-sm font-medium text-ink">Devise</label>
            <select id="currency" name="currency" defaultValue={initialData?.currency || "XAF"}
              className="block w-full rounded-xl border-ink/20 bg-transparent px-4 py-3 text-ink focus:border-primary focus:ring-primary sm:text-sm transition-colors">
              <option value="XAF">FCFA (CEMAC)</option>
              <option value="XOF">FCFA (UEMOA)</option>
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar ($)</option>
            </select>
          </div>
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-sand hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}
