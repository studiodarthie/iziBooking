"use client";

import { useState } from "react";
import { PublicGallery } from "@/components/public/PublicGallery";

interface Service {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  startingPrice: number | null;
}

interface ProviderTabsProps {
  bio: string | null;
  services: Service[];
  mediaLinks: any[];
}

export function ProviderTabs({ bio, services, mediaLinks }: ProviderTabsProps) {
  const [activeTab, setActiveTab] = useState<"presentation" | "services" | "medias">("presentation");

  return (
    <div>
      <div className="flex gap-6 border-b border-neutral-200 pb-2 mb-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab("presentation")}
          className={`pb-2 -mb-[9px] transition-colors ${
            activeTab === "presentation" 
              ? "text-[#0d0d0d] border-b-2 border-[#0d0d0d]" 
              : "text-[#0d0d0d]/50 hover:text-[#0d0d0d]"
          }`}
        >
          Présentation
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`pb-2 -mb-[9px] transition-colors ${
            activeTab === "services" 
              ? "text-[#0d0d0d] border-b-2 border-[#0d0d0d]" 
              : "text-[#0d0d0d]/50 hover:text-[#0d0d0d]"
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab("medias")}
          className={`pb-2 -mb-[9px] transition-colors ${
            activeTab === "medias" 
              ? "text-[#0d0d0d] border-b-2 border-[#0d0d0d]" 
              : "text-[#0d0d0d]/50 hover:text-[#0d0d0d]"
          }`}
        >
          Médias
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === "presentation" && (
          <div className="animate-in fade-in duration-300">
            {bio ? (
              <div className="prose prose-neutral max-w-none text-[#0d0d0d]/80 whitespace-pre-wrap leading-relaxed">
                {bio}
              </div>
            ) : (
              <p className="text-[#0d0d0d]/50 italic">Aucune description pour le moment.</p>
            )}
            
            {/* Reviews Mockup (can be shown in presentation) */}
            <div className="mt-12">
              <h2 className="text-xl font-heading font-bold text-[#0d0d0d] mb-6">Avis</h2>
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                <p className="text-[#0d0d0d]/50 italic">Les avis apparaîtront ici dès que les clients auront laissé une note via iziBooking.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="animate-in fade-in duration-300">
            {services && services.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                    {service.category && (
                      <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-wider rounded mb-3">
                        {service.category}
                      </span>
                    )}
                    <h3 className="font-bold text-lg text-[#0d0d0d] leading-tight mb-2">{service.name}</h3>
                    <p className="text-sm text-neutral-500 line-clamp-3 mb-4 min-h-[60px]">
                      {service.description || "Aucune description détaillée"}
                    </p>
                    <div className="pt-4 border-t border-neutral-100 flex items-end justify-between">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-neutral-400">À partir de</span>
                        <span className="font-heading font-bold text-lg text-[#b5451b]">
                          {service.startingPrice ? `${service.startingPrice.toLocaleString('fr-FR')} FCFA` : "Sur devis"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm text-center">
                <p className="text-neutral-500 italic">Aucun service n'a encore été ajouté.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "medias" && (
          <div className="animate-in fade-in duration-300">
            <PublicGallery mediaLinks={mediaLinks} />
          </div>
        )}
      </div>
    </div>
  );
}
