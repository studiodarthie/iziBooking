"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Phone, Mail, User, Menu } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES_BY_POLE: Record<string, string[]> = {
  DIVERTISSEMENT: ["Groupes & musiciens", "DJ", "Danse & percussions", "Artistes & spectacles", "MC / Animateurs"],
  RECEPTION: ["Traiteurs", "Décoration", "Lieux & salles", "Sonorisation & éclairage"],
  IMAGE_SOUVENIR: ["Photographes", "Vidéastes", "Photobooth", "Drone"],
  SERVICES: ["Sécurité", "Transport / VIP", "Hôtesses", "Wedding planners"],
};

export function HomeHero() {
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

  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] min-h-screen flex flex-col">
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
      <div className="relative z-20 flex justify-end items-center px-4 md:px-8 py-2 text-xs md:text-[12.5px] text-white/70 border-b border-white/10 hidden md:flex">
        <div className="flex gap-5 mr-5">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <Phone size={13} /> Appelez-nous : +237 6 00 00 00 00
          </span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <Mail size={13} /> contact@izibooking.africa
          </span>
        </div>
        <div className="flex gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white transition-colors cursor-pointer"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white transition-colors cursor-pointer"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white transition-colors cursor-pointer"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
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
            <Link href="/about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">À propos</Link>
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
          <button className="text-white/80 hover:text-white ml-2">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 flex-1 flex items-center py-12 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_560px] gap-10 lg:gap-16 w-full items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="text-[#C9982B] uppercase text-[12px] font-bold tracking-[0.1em] mb-4 inline-block">
              DÉCOUVREZ LES MEILLEURS PRESTATAIRES PRÈS DE VOUS
            </span>
            <h1 className="text-white font-heading font-extrabold text-[clamp(34px,4.4vw,54px)] leading-[1.1] mb-8">
              La scène africaine,<br/>
              <span className="text-[#C9982B] relative inline-block mt-2">
                réservable en un clic.
                <svg className="absolute -bottom-5 left-0 w-[60%]" viewBox="0 0 318 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 10.5C28 10.5 35 1 56 1C77 1 84.5 13.5 117.5 13.5C150.5 13.5 167 1.5 190.5 1.5C214 1.5 222 13.5 254 13.5C286 13.5 292.5 5 317 5" stroke="#B5451B" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col gap-4 max-w-xl mt-12">
              <input 
                name="q"
                type="text" 
                placeholder="Que recherchez-vous ?" 
                className="h-14 px-5 bg-[#232323] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 w-full text-sm font-medium"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <select 
                  name="pole" 
                  value={selectedPole}
                  onChange={(e) => setSelectedPole(e.target.value)}
                  className="h-12 px-3 bg-[#232323] border border-white/10 rounded-lg text-white/90 text-sm focus:outline-none focus:border-accent/50 w-full cursor-pointer appearance-none"
                >
                  <option value="">Divertissement</option>
                  <option value="DIVERTISSEMENT">Divertissement</option>
                  <option value="RECEPTION">Réception</option>
                  <option value="IMAGE_SOUVENIR">Photo & Vidéo</option>
                  <option value="SERVICES">Services</option>
                </select>

                <select 
                  name="category" 
                  disabled={!selectedPole}
                  className={`h-12 px-3 bg-[#232323] border border-white/10 rounded-lg text-white/90 text-sm focus:outline-none focus:border-accent/50 w-full cursor-pointer appearance-none ${!selectedPole ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">Occasion</option>
                  {selectedPole && CATEGORIES_BY_POLE[selectedPole]?.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input 
                  name="loc"
                  type="text" 
                  placeholder="Pays" 
                  className="h-12 px-3 bg-[#232323] border border-white/10 rounded-lg text-white/90 text-sm placeholder:text-white/60 focus:outline-none focus:border-accent/50 w-full"
                />

                <select name="budget" className="h-12 px-3 bg-[#232323] border border-white/10 rounded-lg text-white/90 text-sm focus:outline-none focus:border-accent/50 w-full cursor-pointer appearance-none">
                  <option value="">Budget</option>
                  <option value="50000">{'< 50k FCFA'}</option>
                  <option value="150000">50k - 150k</option>
                  <option value="400000">150k - 400k</option>
                  <option value="400001">{'> 400k FCFA'}</option>
                </select>
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
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:block relative rounded-3xl overflow-hidden bg-[#1c1c1c] h-[520px] w-full max-w-[480px] ml-auto border border-white/5 shadow-2xl"
          >
            <div className="absolute inset-0 z-0">
              <Image 
                src="https://images.pexels.com/photos/3867522/pexels-photo-3867522.jpeg?auto=compress&cs=tinysrgb&w=900" 
                alt="Prestataire en vedette" 
                fill
                className="object-cover opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/60 to-transparent"></div>
            </div>
            
            <div className="absolute top-5 left-5 bg-white text-black text-xs font-bold px-2 py-1 rounded-sm z-10">
              DJ
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#C9982B] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(201,152,43,0.4)] cursor-pointer hover:scale-105 transition-transform z-10">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <div className="font-heading text-2xl font-bold mb-1">Kaya Groove Live</div>
              <div className="flex items-center gap-1.5 text-sm text-white/60 mb-5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Douala, Cameroun
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-[#2A2A2A] rounded-lg p-2 text-center border border-white/5">
                  <div className="font-bold text-sm">4.9</div>
                  <div className="text-[9px] text-white/50 uppercase tracking-wider mt-0.5">Note</div>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-2 text-center border border-white/5">
                  <div className="font-bold text-sm">86</div>
                  <div className="text-[9px] text-white/50 uppercase tracking-wider mt-0.5">Avis</div>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-2 text-center border border-white/5">
                  <div className="font-bold text-sm">1h</div>
                  <div className="text-[9px] text-white/50 uppercase tracking-wider mt-0.5">Réponse</div>
                </div>
                <div className="bg-[#2A2A2A] rounded-lg p-2 text-center border border-white/5">
                  <div className="font-bold text-sm">90k</div>
                  <div className="text-[9px] text-white/50 uppercase tracking-wider mt-0.5">FCFA</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
