"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, User, ShieldCheck, Mail } from "lucide-react";

interface ProviderHeaderProps {
  profile: {
    id: string;
    name: string;
    pole: string;
    category: string;
    specialty: string | null;
    location: string;
    isVerified: boolean;
    basePrice: number | null;
    currency: string;
    user: {
      name: string | null;
      image: string | null;
    };
  };
}

export function ProviderHeader({ profile }: ProviderHeaderProps) {
  // Obfuscate or map the pole for display
  const poleLabels: Record<string, string> = {
    DIVERTISSEMENT: "Divertissement",
    RECEPTION: "Réception & Traiteur",
    IMAGE_SOUVENIR: "Image & Souvenir",
    SERVICES: "Services Événementiels",
  };

  const displayPole = poleLabels[profile.pole] || profile.pole;

  return (
    <div className="relative">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-48 md:h-72 w-full bg-[#1a1a1a] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d0d]/80 z-10" />
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <User size={160} className="text-white" />
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-20">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#FBF6EE] bg-white overflow-hidden shadow-xl shrink-0 relative flex items-center justify-center -mt-16 md:-mt-20"
          >
            {profile.user.image ? (
              <Image 
                src={profile.user.image} 
                alt={profile.user.name || profile.name} 
                fill 
                className="object-cover"
              />
            ) : (
              <User size={64} className="text-neutral-300" />
            )}
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-3 pt-2 md:pt-0 md:pb-2"
          >
            <button className="px-6 py-3 bg-white text-[#0d0d0d] font-semibold rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-2">
              <Mail size={18} />
              Contacter
            </button>
            <Link href={`/book/${profile.id}`} className="px-6 py-3 bg-[#B5451B] text-white font-semibold rounded-xl hover:bg-[#9a3915] transition-colors shadow-lg shadow-[#B5451B]/20 flex items-center gap-2">
              Réserver {profile.basePrice ? `dès ${profile.basePrice} ${profile.currency}` : ""}
            </Link>
          </motion.div>
        </div>
        
        <div className="pb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#B5451B]/10 text-[#B5451B] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {displayPole}
              </span>
              {profile.isVerified && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  <ShieldCheck size={14} /> Vérifié
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-[#0d0d0d] tracking-tight">
              {profile.name}
            </h1>
            <p className="text-lg md:text-xl text-[#0d0d0d]/70 font-medium mt-2">
              {profile.category} {profile.specialty && <span className="opacity-50">· {profile.specialty}</span>}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-[#0d0d0d]/60 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-[#C9982B]" />
                {profile.location}
              </div>
              <div className="flex items-center gap-1 text-[#C9982B]">
                <Star size={16} className="fill-current" />
                <span className="text-[#0d0d0d]/80">5.0 (0 avis)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
