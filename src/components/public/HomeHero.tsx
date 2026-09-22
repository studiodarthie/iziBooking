"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, MapPin, ChevronDown, ArrowRight, ShieldCheck, SmartphoneNfc, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { CEMAC_COUNTRIES } from "@/lib/countries";
import { PublicNavbar } from "@/components/public/PublicNavbar";

export function HomeHero() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const q = String(formData.get("q") ?? "").trim();
    const loc = String(formData.get("loc") ?? "");
    if (q) params.set("q", q);
    if (loc) params.set("loc", loc);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative overflow-hidden bg-[#3A1508] text-white">
      <Image
        src="/images/home/hero-artist.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[85%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#6E240C]/90 via-[#8E3414]/72 to-[#B5451B]/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#3A1508]/55 via-transparent to-[#3A1508]/85" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-accent/30 blur-[120px] pointer-events-none" />

      <PublicNavbar overlay />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-36 md:pt-44 pb-32 md:pb-40 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur pl-1.5 pr-4 py-1.5 text-sm">
            <span className="inline-flex items-center gap-1 bg-white text-primary font-bold text-xs rounded-full px-2.5 py-1">
              <Sparkles size={12} /> Nouveau
            </span>
            Réservez artistes et prestataires en confiance
          </span>

          <h1 className="font-heading font-extrabold text-[clamp(38px,6vw,76px)] leading-[1.02] mt-8">
            La scène africaine,
            <br />
            <span className="text-accent-2-300">réservable en un clic.</span>
          </h1>

          <p className="mt-6 text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed [text-shadow:0_1px_12px_rgba(58,21,8,0.6)]">
            Vous cherchez un artiste, instrumentiste, performeur, DJ, groupe de danse, traiteur, photographe pro, make-up artist, vidéaste… ? Sur iziBooking, comparez, échangez et réservez en toute sécurité pour la réussite de votre événement.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-10 mx-auto max-w-3xl bg-white rounded-3xl md:rounded-full p-2 flex flex-col md:flex-row gap-2 shadow-2xl shadow-black/30"
          >
            <div className="relative flex-1">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
              <input
                name="q"
                type="text"
                placeholder="DJ, photographe, traiteur…"
                className="w-full h-14 pl-12 pr-4 rounded-full bg-transparent text-ink font-medium placeholder:text-neutral-700 placeholder:font-normal focus:outline-none"
              />
            </div>
            <div className="relative md:w-48 border-t md:border-t-0 md:border-l border-neutral-300">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
              <select
                name="loc"
                aria-label="Pays"
                className="w-full h-14 pl-10 pr-9 bg-transparent text-ink font-medium text-[15px] focus:outline-none cursor-pointer appearance-none"
              >
                <option value="">Tous les pays</option>
                {CEMAC_COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="h-14 px-8 rounded-full bg-primary hover:bg-accent-600 text-white font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Rechercher
            </button>
          </form>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 text-sm text-white/85">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-accent-2-300" /> Profils vérifiés</span>
            <span className="flex items-center gap-2"><SmartphoneNfc size={16} className="text-accent-2-300" /> Mobile money accepté</span>
            <Link href="/inscription" className="flex items-center gap-1.5 font-semibold text-white hover:text-accent-2-300 transition-colors">
              Vous êtes prestataire ? Inscrivez-vous <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
