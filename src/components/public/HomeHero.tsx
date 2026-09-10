"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Phone, Mail, User, Menu, X, Star, ChevronDown, MapPin, Wallet, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] flex flex-col lg:min-h-screen">
      {/* Background Image */}
      <Image
        src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920"
        alt="Artiste en scène"
        fill
        priority
        className="object-cover object-[center_25%] opacity-15 mix-blend-luminosity z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent z-10"></div>

      {/* Topbar */}
      <div className="relative z-20 justify-end items-center px-4 md:px-8 py-2 text-xs md:text-[12.5px] text-white/70 border-b border-white/10 hidden md:flex">
        <div className="flex gap-5">
          <a href="tel:+237600000000" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone size={13} /> Appelez-nous : +237 6 00 00 00 00
          </a>
          <a href="mailto:contact@izibooking.africa" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail size={13} /> contact@izibooking.africa
          </a>
        </div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-4 md:px-8 py-5 border-b border-white/5">
        <div>
          <Link href="/" className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight">
            iziBooking
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 mr-2">
            <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Accueil</Link>
            <Link href="/search" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Catalogue</Link>
            <Link href="#temoignages" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Références</Link>
          </div>
          <Link href="/login" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white/40 transition-colors">
            <User size={18} />
          </Link>
          <Link href="/onboarding" className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-accent-600 text-white border-none rounded-full py-2 pl-2 pr-5 flex items-center gap-2.5 text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(181,69,27,0.3)]"
            >
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-lg leading-none pb-0.5">+</span>
              Inscription gratuite
            </motion.button>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-white/80 hover:text-white ml-2 lg:hidden">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0d0d0d] flex flex-col p-6 lg:hidden">
          <div className="flex items-center justify-between mb-10">
            <span className="font-heading font-bold text-xl text-white">iziBooking</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white transition-colors">Accueil</Link>
            <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white transition-colors">Catalogue</Link>
            <Link href="#temoignages" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white transition-colors">Références</Link>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white transition-colors">Connexion</Link>
            <Link href="/onboarding" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-primary">Inscription gratuite</Link>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 lg:py-24 lg:flex-1 lg:flex lg:items-center">
        <div className="grid lg:grid-cols-[1fr_560px] gap-10 lg:gap-16 w-full items-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="text-[#C9982B] uppercase text-[12px] font-bold tracking-[0.1em] mb-4 inline-block">
              DÉCOUVREZ LES MEILLEURS PRESTATAIRES PRÈS DE VOUS
            </span>
            <h1 className="text-white font-heading font-extrabold text-[clamp(30px,4.4vw,54px)] leading-[1.1] mb-8">
              La scène africaine,<br/>
              <span className="text-[#C9982B] relative inline-block mt-2">
                réservable en un clic.
                <svg className="absolute -bottom-5 left-0 w-[60%]" viewBox="0 0 318 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 10.5C28 10.5 35 1 56 1C77 1 84.5 13.5 117.5 13.5C150.5 13.5 167 1.5 190.5 1.5C214 1.5 222 13.5 254 13.5C286 13.5 292.5 5 317 5" stroke="#B5451B" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col gap-3 max-w-xl mt-10 md:mt-12">
              <input 
                name="q"
                type="text" 
                placeholder="Que recherchez-vous ?" 
                className="h-14 px-5 bg-[#232323] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 w-full text-sm font-medium"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="relative">
                  <Sparkles size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  <select
                    name="pole"
                    value={selectedPole}
                    onChange={(e) => setSelectedPole(e.target.value)}
                    className="h-12 pl-9 pr-8 bg-[#232323] border border-white/10 rounded-lg text-white/90 text-[13px] focus:outline-none focus:border-accent/50 w-full cursor-pointer appearance-none truncate"
                  >
                    <option value="">Divertissement</option>
                    <option value="DIVERTISSEMENT">Divertissement</option>
                    <option value="RECEPTION">Réception</option>
                    <option value="IMAGE_SOUVENIR">Photo & Vidéo</option>
                    <option value="SERVICES">Services</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    name="category"
                    disabled={!selectedPole}
                    className={`h-12 pl-3 pr-8 bg-[#232323] border border-white/10 rounded-lg text-white/90 text-[13px] focus:outline-none focus:border-accent/50 w-full cursor-pointer appearance-none truncate ${!selectedPole ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Occasion</option>
                    {selectedPole && CATEGORIES_BY_POLE[selectedPole]?.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>

                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  <input
                    name="loc"
                    type="text"
                    placeholder="Pays"
                    className="h-12 pl-9 pr-3 bg-[#232323] border border-white/10 rounded-lg text-white/90 text-[13px] placeholder:text-white/50 focus:outline-none focus:border-accent/50 w-full"
                  />
                </div>

                <div className="relative">
                  <Wallet size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  <select name="budget" className="h-12 pl-9 pr-8 bg-[#232323] border border-white/10 rounded-lg text-white/90 text-[13px] focus:outline-none focus:border-accent/50 w-full cursor-pointer appearance-none truncate">
                    <option value="">Budget</option>
                    <option value="50000">{'< 50k FCFA'}</option>
                    <option value="150000">50k - 150k</option>
                    <option value="400000">150k - 400k</option>
                    <option value="400001">{'> 400k FCFA'}</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="h-14 bg-[#B5451B] text-white font-bold rounded-xl flex items-center justify-center gap-2 mt-2 hover:bg-[#953817] transition-colors w-full text-sm"
              >
                Rechercher <Search size={16} />
              </motion.button>
            </form>
          </motion.div>

          {/* Hero Featured Card */}
          {featured && (
            <Link href={`/p/${featured.id}`} className="hidden lg:block group">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="relative rounded-3xl overflow-hidden bg-[#1c1c1c] h-[520px] w-full max-w-[480px] ml-auto border border-white/5 shadow-2xl"
              >
                <div className="absolute inset-0 z-0">
                  {featured.image ? (
                    <Image
                      src={featured.image}
                      alt={featured.name}
                      fill
                      className="object-cover opacity-60 mix-blend-luminosity transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#232323]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/60 to-transparent"></div>
                </div>

                <div className="absolute top-5 left-5 bg-white text-black text-xs font-bold px-2 py-1 rounded-sm z-10">
                  {featured.category}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <div className="font-heading text-2xl font-bold mb-1">{featured.name}</div>
                  <div className="flex items-center gap-1.5 text-sm text-white/60 mb-5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {featured.location}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#2A2A2A] rounded-lg p-2 text-center border border-white/5 flex items-center justify-center gap-1.5">
                      <Star size={14} className="fill-[#C9982B] text-[#C9982B]" />
                      <div className="font-bold text-sm">
                        {featured.reviewCount > 0 ? featured.rating.toFixed(1) : "Nouveau"}
                      </div>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-lg p-2 text-center border border-white/5">
                      <div className="font-bold text-sm">{featured.reviewCount}</div>
                      <div className="text-[9px] text-white/50 uppercase tracking-wider mt-0.5">Avis</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
