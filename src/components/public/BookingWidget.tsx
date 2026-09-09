"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MessageCircle, Share2, Heart } from "lucide-react";

interface BookingWidgetProps {
  profile: {
    id: string;
    basePrice: number | null;
    currency: string;
  };
}

export function BookingWidget({ profile }: BookingWidgetProps) {
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
          Prochaines disponibilités
        </div>
        {/* Mockup dates */}
        <div className="grid grid-cols-7 gap-1">
          {[12, 13, 14, 15, 16, 17, 18].map((day, i) => (
            <div 
              key={day} 
              className={`flex items-center justify-center h-8 rounded text-xs font-semibold
                ${[13, 15, 17].includes(day) ? 'bg-[#B5451B] text-white' : 'bg-white text-[#0d0d0d]/60'}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Link 
          href={`/book/${profile.id}`} 
          className="block w-full py-3.5 bg-[#B5451B] text-white font-semibold rounded-xl hover:bg-[#9a3915] transition-all text-center shadow-md shadow-[#B5451B]/20"
        >
          Demander un devis
        </Link>
        
        <button className="w-full py-3.5 bg-white text-[#0d0d0d] font-semibold rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2">
          <MessageCircle size={18} className="text-green-600" />
          Demande assistée WhatsApp
        </button>
      </div>

      <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-neutral-100">
        <button className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-[#0d0d0d]/60 hover:text-[#0d0d0d] hover:bg-neutral-50 transition-colors">
          <Share2 size={16} />
        </button>
        <button className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-[#0d0d0d]/60 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
          <Heart size={16} />
        </button>
      </div>
    </motion.div>
  );
}
