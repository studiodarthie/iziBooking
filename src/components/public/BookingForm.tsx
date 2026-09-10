"use client";

import { useState } from "react";
import { submitBooking } from "@/app/book/[id]/actions";
import { useRouter } from "next/navigation";
import { CheckCircle, Info } from "lucide-react";
import type { Service } from "@prisma/client";

export function BookingForm({ providerId, services }: { providerId: string, services: Service[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null); // null means "Sur-mesure"

  const [formData, setFormData] = useState({
    eventDate: "",
    eventType: "",
    eventLocation: "",
    clientWhatsApp: "",
    budget: "",
    details: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventDate || !formData.eventType || !formData.eventLocation || !formData.clientWhatsApp) {
      alert("Veuillez remplir tous les champs obligatoires, y compris votre numéro WhatsApp.");
      return;
    }

    setLoading(true);
    const data = {
      providerProfileId: providerId,
      eventDate: new Date(formData.eventDate),
      eventType: formData.eventType,
      eventLocation: formData.eventLocation,
      clientWhatsApp: formData.clientWhatsApp,
      budget: formData.budget ? Number(formData.budget) : undefined,
      details: formData.details,
      serviceId: selectedServiceId || undefined
    };

    const res = await submitBooking(data);
    setLoading(false);

    if (res.success) {
      // Redirect to organizer dashboard bookings list
      router.push("/dashboard/bookings");
    } else {
      alert(res.error || "Une erreur s'est produite.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200 shadow-sm max-w-3xl mx-auto space-y-8">
      
      {/* 1. Sélection du besoin */}
      <section>
        <h3 className="text-xl font-heading font-bold text-ink mb-4">1. Quel est votre besoin ?</h3>
        <p className="text-ink/60 text-sm mb-4">Choisissez un package prédéfini ou optez pour une demande sur-mesure.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            onClick={() => setSelectedServiceId(null)}
            className={`cursor-pointer relative rounded-xl border-2 p-4 transition-all ${
              selectedServiceId === null 
                ? "border-primary bg-primary/5" 
                : "border-neutral-200 hover:border-primary/50"
            }`}
          >
            {selectedServiceId === null && (
              <div className="absolute top-4 right-4 text-primary">
                <CheckCircle size={20} className="fill-primary/20" />
              </div>
            )}
            <h4 className="font-bold text-ink mb-1">Demande Sur-mesure</h4>
            <p className="text-xs text-ink/60">Décrivez exactement ce dont vous avez besoin, le prestataire vous proposera un devis adapté.</p>
          </div>

          {services.map(service => (
            <div 
              key={service.id}
              onClick={() => setSelectedServiceId(service.id)}
              className={`cursor-pointer relative rounded-xl border-2 p-4 transition-all ${
                selectedServiceId === service.id 
                  ? "border-primary bg-primary/5" 
                  : "border-neutral-200 hover:border-primary/50"
              }`}
            >
              {selectedServiceId === service.id && (
                <div className="absolute top-4 right-4 text-primary">
                  <CheckCircle size={20} className="fill-primary/20" />
                </div>
              )}
              <h4 className="font-bold text-ink mb-1 pr-6">{service.name}</h4>
              <p className="text-xs text-ink/60 line-clamp-2 mb-2">{service.description}</p>
              <div className="text-sm font-bold text-primary">
                {service.startingPrice ? `À partir de ${service.startingPrice.toLocaleString()} FCFA` : "Sur devis"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-neutral-100" />

      {/* 2. Détails de l'événement */}
      <section>
        <h3 className="text-xl font-heading font-bold text-ink mb-6">2. Détails de l’événement</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Date de l’événement *</label>
            <input 
              required
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.eventDate}
              onChange={e => setFormData({...formData, eventDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Type d’événement *</label>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
              value={formData.eventType}
              onChange={e => setFormData({...formData, eventType: e.target.value})}
            >
              <option value="">Sélectionner...</option>
              <option value="Mariage">Mariage</option>
              <option value="Anniversaire">Anniversaire</option>
              <option value="Soirée d'entreprise">Soirée d’entreprise</option>
              <option value="Concert / Festival">Concert / Festival</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Lieu (Ville, Salle) *</label>
            <input 
              required
              type="text"
              placeholder="Ex: Abidjan, Sofitel"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.eventLocation}
              onChange={e => setFormData({...formData, eventLocation: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Votre numéro WhatsApp *</label>
            <div className="relative">
              <input 
                required
                type="text"
                placeholder="Ex: +237..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={formData.clientWhatsApp}
                onChange={e => setFormData({...formData, clientWhatsApp: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Votre budget estimé (optionnel)</label>
            <div className="relative">
              <input 
                type="number"
                placeholder="Ex: 500000"
                className="w-full pl-4 pr-16 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
              />
              <span className="absolute right-4 top-3 text-ink/50 font-medium">FCFA</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Précisions supplémentaires</label>
          <textarea
            rows={4}
            placeholder="Détaillez vos attentes, le nombre d'invités, les horaires prévus..."
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
            value={formData.details}
            onChange={e => setFormData({...formData, details: e.target.value})}
          />
        </div>
      </section>

      <div className="pt-4 flex items-center justify-between">
        <div className="flex items-start gap-2 text-xs text-ink/60 max-w-sm">
          <Info size={16} className="shrink-0 mt-0.5 text-primary" />
          <p>Cette demande est sans engagement. Le prestataire vous enverra un devis définitif que vous pourrez valider.</p>
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer ma demande"}
        </button>
      </div>

    </form>
  );
}
