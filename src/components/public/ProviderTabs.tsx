"use client";

import { useState } from "react";
import { PublicGallery } from "@/components/public/PublicGallery";
import { Star, User } from "lucide-react";
import Image from "next/image";
import type { Service, MediaLink } from "@prisma/client";

type ReviewWithOrganizer = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  organizer: { name: string | null; image: string | null };
};

interface ProviderTabsProps {
  bio: string | null;
  services: Service[];
  mediaLinks: MediaLink[];
  reviews: ReviewWithOrganizer[];
}

export function ProviderTabs({ bio, services, mediaLinks, reviews }: ProviderTabsProps) {
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
            
            {/* Reviews */}
            <div className="mt-12">
              <h2 className="text-xl font-heading font-bold text-[#0d0d0d] mb-6">
                Avis {reviews.length > 0 && `(${reviews.length})`}
              </h2>
              {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                  <p className="text-[#0d0d0d]/50 italic">Les avis apparaîtront ici dès que les clients auront laissé une note via iziBooking.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-sand overflow-hidden flex items-center justify-center shrink-0 relative">
                          {review.organizer.image ? (
                            <Image src={review.organizer.image} alt={review.organizer.name || "Client"} fill className="object-cover" />
                          ) : (
                            <User size={16} className="text-neutral-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0d0d0d]">{review.organizer.name || "Client iziBooking"}</p>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star key={n} size={12} className={review.rating >= n ? "fill-accent text-accent" : "text-neutral-200"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-[#0d0d0d]/70 whitespace-pre-wrap">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                <p className="text-neutral-500 italic">Aucun service n’a encore été ajouté.</p>
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
