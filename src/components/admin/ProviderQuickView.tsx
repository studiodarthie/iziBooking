"use client";

import { X, ShieldCheck, ShieldAlert, CheckCircle2, ExternalLink, MapPin, Tag, Video, Image as ImageIcon, Briefcase, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import type { ProviderWithDetails } from "@/app/admin/providers/page";

interface ProviderQuickViewProps {
  provider: ProviderWithDetails | null;
  onClose: () => void;
  onToggleVerification: (id: string, currentStatus: boolean) => void;
  isToggling: boolean;
}

export function ProviderQuickView({ provider, onClose, onToggleVerification, isToggling }: ProviderQuickViewProps) {
  
  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!provider) return null;

  const images = provider.mediaLinks?.filter((m) => m.type === "IMAGE") || [];
  const videos = provider.mediaLinks?.filter((m) => m.type === "VIDEO") || [];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-sand z-[110] shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0 border-l border-ink/10 overflow-hidden">
        
        {/* Header - Glassmorphism */}
        <div className="sticky top-0 z-10 bg-sand/80 backdrop-blur-md border-b border-ink/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-heading font-black text-xl text-ink">Centre d’Inspection</h2>
            {provider.isVerified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success">
                <CheckCircle2 size={12} /> Vérifié
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-warning/20 text-warning-700">
                <ShieldAlert size={12} /> En attente
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ink/5 text-ink/50 hover:text-ink transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Identity Section */}
          <div className="flex gap-4 items-start">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-ink/5 overflow-hidden shrink-0">
              {provider.user?.image ? (
                <img src={provider.user.image} alt={provider.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-primary/50 font-black bg-primary/10">
                  {provider.name?.charAt(0) || "P"}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink leading-tight">{provider.name}</h1>
              <p className="text-sm text-ink/60 mt-1">{provider.user?.email}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-ink/5 text-ink/70">
                  <Tag size={12} /> {provider.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-ink/5 text-ink/70">
                  <MapPin size={12} /> {provider.location}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {provider.bio && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink/40 mb-3">Biographie</h3>
              <p className="text-sm text-ink/80 leading-relaxed bg-white p-4 rounded-xl border border-ink/5 shadow-sm">
                {provider.bio}
              </p>
            </div>
          )}

          {/* Stats & Activity */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink/40 mb-3">Activité & Tarifs</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-xl border border-ink/5 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <CalendarCheck size={18} />
                </div>
                <div>
                  <p className="text-xs text-ink/50 font-bold">Réservations</p>
                  <p className="text-lg font-black text-ink">{provider._count?.bookings || 0}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-ink/5 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-xs text-ink/50 font-bold">Prix de base</p>
                  <p className="text-lg font-black text-ink">{provider.basePrice ? `${provider.basePrice} ${provider.currency}` : "Sur devis"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          {provider.services && provider.services.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink/40 mb-3">Services proposés ({provider.services.length})</h3>
              <div className="space-y-2">
                {provider.services.map((service) => (
                  <div key={service.id} className="bg-white p-3 rounded-xl border border-ink/5 shadow-sm flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-ink">{service.name}</p>
                      {service.category && <p className="text-xs text-ink/50">{service.category}</p>}
                    </div>
                    {service.startingPrice && (
                      <p className="text-sm font-black text-primary">Dès {service.startingPrice.toLocaleString('fr-FR')} {provider.currency}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Links */}
          {(images.length > 0 || videos.length > 0) && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink/40 mb-3">Portfolio ({provider.mediaLinks.length} médias)</h3>
              <div className="grid grid-cols-3 gap-2">
                {images.slice(0, 6).map((img) => (
                  <div key={img.id} className="aspect-square rounded-lg bg-ink/5 overflow-hidden relative group">
                    <img src={img.url} alt="Portfolio" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors flex items-center justify-center">
                      <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                  </div>
                ))}
              </div>
              {videos.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-ink/60 bg-white px-3 py-2 rounded-lg border border-ink/5">
                  <Video size={16} /> Contient {videos.length} vidéo(s)
                </div>
              )}
            </div>
          )}

          <div className="h-10" /> {/* Bottom padding */}
        </div>

        {/* Footer Action Bar */}
        <div className="mt-auto bg-white border-t border-ink/10 p-6 flex flex-col gap-3 shrink-0">
          <Link 
            href={`/p/${provider.id}`} 
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-ink/10 text-sm font-bold text-ink/70 hover:bg-ink/5 hover:text-ink transition-colors"
          >
            Voir la page publique <ExternalLink size={16} />
          </Link>

          <button
            disabled={isToggling}
            onClick={() => onToggleVerification(provider.id, provider.isVerified)}
            className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-70 ${
              provider.isVerified 
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100" 
                : "bg-success text-white hover:bg-success/90 shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
            }`}
          >
            {isToggling ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Traitement...
              </span>
            ) : provider.isVerified ? (
              "Retirer le badge (Révoquer)"
            ) : (
              <>
                <ShieldCheck size={20} /> Approuver le prestataire
              </>
            )}
          </button>
        </div>

      </div>
    </>
  );
}
