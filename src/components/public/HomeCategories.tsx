"use client";

import { motion, Variants } from "framer-motion";
import { Utensils, Home, Music, Palette, Camera, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Traiteurs", count: 38, icon: Utensils },
  { name: "Lieux & salles", count: 24, icon: Home },
  { name: "DJ", count: 41, icon: Music },
  { name: "Décoration", count: 19, icon: Palette },
  { name: "Photo & vidéo", count: 27, icon: Camera },
  { name: "Danse & artistes", count: 33, icon: Users },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function HomeCategories() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="bg-neutral-300 rounded-3xl p-8 md:p-14 grid lg:grid-cols-[1fr_1.3fr] gap-12 items-center shadow-inner">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent text-xs font-bold tracking-[0.08em] uppercase">
            Catégories populaires
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-3">
            Trouvez votre prestataire par catégorie
          </h2>
          <p className="text-neutral-700 mt-4 leading-relaxed">
            Des dizaines de types de prestataires vérifiés, classés par métier, pour organiser chaque étape de votre événement au même endroit.
          </p>
          <Link href="/search" className="inline-block mt-8">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-md shadow-primary/20"
            >
              Commencer <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {categories.map((cat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
              className="bg-white rounded-2xl text-center p-6 shadow-sm cursor-pointer transition-all border border-transparent hover:border-accent/20"
            >
              <div className="font-semibold text-ink">{cat.name}</div>
              <div className="text-xs text-neutral-500 mb-4 mt-1">({cat.count})</div>
              <div className="w-14 h-14 mx-auto rounded-full bg-accent-100 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                <cat.icon size={24} strokeWidth={1.8} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
