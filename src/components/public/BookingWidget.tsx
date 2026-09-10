"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Share2 } from "lucide-react";
import { isSameDay, startOfDay, addDays, format } from "date-fns";

interface BookingWidgetProps {
  profile: {
    id: string;
    basePrice: number | null;
    currency: string;
  };
  blockedDates: Date[];
}

export function BookingWidget({ profile, blockedDates }: BookingWidgetProps) {
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: "iziBooking", url });
      } catch {
        // user cancelled the share sheet, nothing to do
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Lien copié dans le presse-papiers !");
    }
  };

  const today = startOfDay(new Date());
  const next7Days = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm"
    >
      <div className="mb-6">
        <div className="text-3xl font-bold text-[#0d0d0d]">
          {profile.basePrice ? `${profile.basePrice} ${profile.currency}` : "Sur devis"}
        </div>
        <div className="text-[#0d0d0d]/60 text-xs mt-1">
          Tarif indicatif — acompte de 30% à la réservation
        </div>
      </div>

      <div className="bg-[#FBF6EE] rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 text-[#0d0d0d] font-medium text-sm">
          <CalendarIcon size={16} className="text-[#B5451B]" />
          Prochains jours
        </div>
        <div className="grid grid-cols-7 gap-1">
          {next7Days.map((day) => {
            const isBlocked = blockedDates.some((d) => isSameDay(startOfDay(d), day));
            return (
              <div
                key={day.toISOString()}
                title={isBlocked ? "Indisponible" : "Disponible"}
                className={`flex items-center justify-center h-8 rounded text-xs font-semibold
                  ${isBlocked ? 'bg-neutral-200 text-neutral-400 line-through' : 'bg-white text-[#0d0d0d]/60'}`}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-[#0d0d0d]/40 mt-2">Jours grisés : déjà réservés ou bloqués par le prestataire.</p>
      </div>

      <div className="space-y-3">
        <Link
          href={`/book/${profile.id}`}
          className="block w-full py-3.5 bg-[#B5451B] text-white font-semibold rounded-xl hover:bg-[#9a3915] transition-all text-center shadow-md shadow-[#B5451B]/20"
        >
          Demander un devis
        </Link>
      </div>

      <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-neutral-100">
        <button onClick={handleShare} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-[#0d0d0d]/60 hover:text-[#0d0d0d] hover:bg-neutral-50 transition-colors">
          <Share2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
