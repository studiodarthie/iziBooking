"use client";

import { useState } from "react";
import { updateOrganizerName } from "@/app/dashboard/settings/actions";
import { Loader2 } from "lucide-react";

export function OrganizerSettingsForm({ initialName }: { initialName: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      const res = await updateOrganizerName(name);
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
    <form onSubmit={onSubmit} className="space-y-6 bg-sand rounded-2xl p-6 md:p-8 border border-ink/10">

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-ink">Nom affiché</label>
        <input type="text" id="name" name="name" defaultValue={initialName} required
          className="block w-full max-w-md rounded-xl border-ink/20 bg-transparent px-4 py-3 text-ink focus:border-primary focus:ring-primary sm:text-sm transition-colors" />
        <p className="text-xs text-ink/50">Ce nom est utilisé dans vos réservations et vos échanges avec les prestataires.</p>
      </div>

      <div className="pt-2 flex justify-end">
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-sand hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}
