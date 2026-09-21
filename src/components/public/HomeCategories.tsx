"use client";

import { motion, Variants } from "framer-motion";
import { Utensils, Music, Camera, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const CATEGORY_STYLES: Record<string, { icon: typeof Utensils; tint: string; text: string }> = {
  "Divertissement": { icon: Music, tint: "bg-primary/10 group-hover:bg-primary", text: "text-primary" },
  "Réception & Traiteur": { icon: Utensils, tint: "bg-accent-2-100 group-hover:bg-accent-2-500", text: "text-accent-2-600" },
  "Photo & vidéo": { icon: Camera, tint: "bg-trust-tint group-hover:bg-trust", text: "text-trust" },
  "Services": { icon: Users, tint: "bg-accent-200/60 group-hover:bg-accent-400", text: "text-accent-700" },
};

/** count = null quand la base est indisponible : on n'affiche alors aucun compteur. */
export type CategoryCount = { name: string; count: number | null };

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export function HomeCategories({ categories }: { categories: CategoryCount[] }) {
  return (
    <section className="relative z-20 -mt-20 md:-mt-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        {categories.map((cat) => {
          const style = CATEGORY_STYLES[cat.name] || CATEGORY_STYLES["Services"];
          const Icon = style.icon;
          return (
            <Link key={cat.name} href={`/search?q=${encodeURIComponent(cat.name)}`} className="group">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="relative bg-white rounded-3xl text-center px-4 py-7 shadow-lg shadow-black/5 border border-neutral-100 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-shadow duration-300"
              >
                <ArrowUpRight size={16} className="absolute top-4 right-4 text-neutral-400 group-hover:text-primary transition-colors" />
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-colors duration-300 ${style.tint} ${style.text} group-hover:text-white`}>
                  <Icon size={28} strokeWidth={1.8} />
                </div>
                <div className="font-heading font-bold text-ink mt-4 text-[15px]">{cat.name}</div>
                {cat.count !== null && (
                  <div className="text-xs text-neutral-600 mt-1">
                    {cat.count === 0 ? "Bientôt disponible" : `${cat.count} prestataire${cat.count > 1 ? "s" : ""}`}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </section>
  );
}
