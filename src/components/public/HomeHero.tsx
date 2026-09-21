"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Star, ChevronDown, MapPin, Wallet, Sparkles, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CEMAC_COUNTRIES } from "@/lib/countries";
import { PublicNavbar } from "@/components/public/PublicNavbar";

const CATEGORIES_BY_POLE: Record<string, string[]> = {
  DIVERTISSEMENT: ["Groupes & musiciens", "DJ", "Danse & percussions", "Artistes & spectacles", "MC / Animateurs"],
  RECEPTION: ["Traiteurs", "Décoration", "Lieux & salles", "Sonorisation & éclairage"],
  IMAGE_SOUVENIR: ["Photographes", "Vidéastes", "Photobooth", "Drone"],
  SERVICES: ["Sécurité", "Transport / VIP", "Hôtesses", "Wedding planners"],
};

export type HeroFeaturedProvider = {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string | null;
  rating: number;
  reviewCount: number;
};

export function HomeHero({ featured }: { featured: HeroFeaturedProvider | null }) {
  const router = useRouter();

  const [selectedPole, setSelectedPole] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    const pole = formData.get("pole") as string;
    const category = formData.get("category") as string;
    const loc = formData.get("loc") as string;
    const budget = formData.get("budget") as string;
    
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (pole) params.set("pole", pole);
    if (category) params.set("category", category);
    if (loc) params.set("loc", loc);
    if (budget) params.set("budget", budget);
    
    router.push(`/search?${params.toString()}`);
  };

  const field = "h-12 bg-white hover:border-neutral-500 transition-colors border border-neutral-400 rounded-xl text-ink font-medium text-[14px] placeholder:text-neutral-700 placeholder:font-normal focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 w-full";

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FBDDBF] via-[#FCE6CE] to-[#FCEFDD]">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/35 blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-[-120px] w-[460px] h-[460px] rounded-full bg-accent/45 blur-3xl pointer-events-none" />

      <PublicNavbar theme="light" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-28 md:pb-36">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[12px] font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-6">
              <Sparkles size={14} /> Artistes & prestataires vérifiés
            </span>
            <h1 className="text-ink font-heading font-extrabold text-[clamp(30px,3.5vw,48px)] leading-[1.05]">
              La scène africaine,<br />
              <span className="text-primary inline-block sm:whitespace-nowrap mt-1 px-2 -mx-2 rounded-lg bg-[linear-gradient(transparent_50%,rgba(201,152,43,0.35)_50%,rgba(201,152,43,0.35)_82%,transparent_82%)] [box-decoration-break:clone]">
                réservable en un clic.
              </span>
            </h1>
            <p className="text-neutral-700 mt-6 text-base md:text-lg max-w-xl leading-relaxed">
              DJ, groupes, traiteurs, photographes, décorateurs… Comparez, échangez et réservez en toute confiance, avec paiement mobile money sécurisé.
            </p>

            {/* Search Form */}
            <div className="p-4 md:p-5 mt-8 rounded-3xl bg-white border border-neutral-300 shadow-xl shadow-primary/10 max-w-2xl">
              <form onSubmit={handleSearch} className="flex flex-col gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
                  <input
                    name="q"
                    type="text"
                    placeholder="Que recherchez-vous ? (Ex : DJ mariage, photographe…)"
                    className={`${field} h-14 pl-11 pr-4 font-medium`}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="relative">
                    <Sparkles size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
                    <select
                      name="pole"
                      value={selectedPole}
                      onChange={(e) => setSelectedPole(e.target.value)}
                      className={`${field} pl-9 pr-8 cursor-pointer appearance-none truncate`}
                    >
                      <option value="">Univers</option>
                      <option value="DIVERTISSEMENT">Divertissement</option>
                      <option value="RECEPTION">Réception</option>
                      <option value="IMAGE_SOUVENIR">Photo & Vidéo</option>
                      <option value="SERVICES">Services</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      name="category"
                      disabled={!selectedPole}
                      className={`${field} pl-3 pr-8 cursor-pointer appearance-none truncate ${!selectedPole ? "bg-neutral-100 text-neutral-700 cursor-not-allowed" : ""}`}
                    >
                      <option value="">Catégorie</option>
                      {selectedPole && CATEGORIES_BY_POLE[selectedPole]?.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
                    <select name="loc" className={`${field} pl-9 pr-8 cursor-pointer appearance-none truncate`}>
                      <option value="">Pays</option>
                      {CEMAC_COUNTRIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <Wallet size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
                    <select name="budget" className={`${field} pl-9 pr-8 cursor-pointer appearance-none truncate`}>
                      <option value="">Budget</option>
                      <option value="50000">{'< 50k FCFA'}</option>
                      <option value="150000">50k - 150k</option>
                      <option value="400000">150k - 400k</option>
                      <option value="400001">{'> 400k FCFA'}</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-800 pointer-events-none" />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="h-14 bg-primary hover:bg-accent-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors w-full text-sm shadow-lg shadow-primary/30"
                >
                  Rechercher <Search size={16} />
                </motion.button>
              </form>
            </div>

            <div className="flex flex-wrap gap-2 mt-5 items-center text-[13px] text-neutral-800">
              <span className="font-semibold">Populaire :</span>
              {["DJ", "Traiteurs", "Photographes", "Décoration"].map((t) => (
                <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="px-3 py-1 rounded-full bg-white border border-neutral-400 text-ink font-medium hover:border-primary hover:text-primary transition-colors">
                  {t}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Photo collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative hidden lg:block h-[560px]"
          >
            <div className="absolute top-0 right-0 w-[62%] h-[360px] rounded-[2rem] overflow-hidden shadow-2xl rotate-2">
              <Image src="/images/home/traditional-dance.jpg" alt="Danse traditionnelle sur scène" fill priority className="object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 w-[52%] h-[300px] rounded-[2rem] overflow-hidden shadow-2xl -rotate-3 border-4 border-white">
              <Image src="/images/home/wedding-dance.jpg" alt="Première danse des mariés" fill className="object-cover object-left" />
            </div>
            <div className="absolute bottom-6 right-6 w-[42%] h-[210px] rounded-[2rem] overflow-hidden shadow-2xl rotate-3 border-4 border-white">
              <Image src="/images/home/procession.jpg" alt="Cortège de mariage en tenues traditionnelles" fill className="object-cover" />
            </div>

            <div className="absolute top-[52%] left-[18%] bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 z-10">
              <span className="w-10 h-10 rounded-full bg-trust-tint text-trust flex items-center justify-center"><ShieldCheck size={20} /></span>
              <div>
                <div className="font-bold text-sm text-ink leading-tight">Paiement sécurisé</div>
                <div className="text-[11px] text-neutral-600">Acompte protégé</div>
              </div>
            </div>

            {featured && (
              <Link href={`/p/${featured.id}`} className="absolute top-4 left-4 bg-white rounded-2xl shadow-xl p-3 pr-5 flex items-center gap-3 z-10 hover:-translate-y-0.5 transition-transform max-w-[250px]">
                <span className="relative w-12 h-12 rounded-xl overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center font-bold text-primary">
                  {featured.image ? <Image src={featured.image} alt={featured.name} fill className="object-cover" /> : featured.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-ink truncate">{featured.name}</div>
                  <div className="text-[11px] text-neutral-600 truncate">{featured.category} · {featured.location}</div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-ink mt-0.5">
                    <Star size={11} className="fill-accent text-accent" />
                    {featured.reviewCount > 0 ? featured.rating.toFixed(1) : "Nouveau"}
                  </div>
                </div>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
