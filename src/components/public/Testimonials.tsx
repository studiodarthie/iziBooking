"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section id="temoignages" className="bg-accent-100 py-16 md:py-24 relative overflow-hidden min-h-[420px] flex items-center">
      {/* Decorative Photos */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:block absolute top-8 left-[6%] w-[160px] h-[180px] shadow-lg border-4 border-white rounded-xl z-0 overflow-hidden"
      >
        <Image src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Client" fill className="object-cover" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="hidden lg:block absolute bottom-5 left-[16%] w-[170px] h-[190px] shadow-lg border-4 border-white rounded-xl z-0 overflow-hidden"
      >
        <Image src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Client" fill className="object-cover" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 7 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="hidden lg:block absolute top-4 right-[6%] w-[170px] h-[190px] shadow-lg border-4 border-white rounded-xl z-0 overflow-hidden"
      >
        <Image src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Client" fill className="object-cover" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="hidden lg:block absolute bottom-2 right-[16%] w-[160px] h-[180px] shadow-lg border-4 border-white rounded-xl z-0 overflow-hidden"
      >
        <Image src="https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Client" fill className="object-cover" />
      </motion.div>

      {/* Content */}
      <div className="max-w-2xl mx-auto text-center relative z-20 px-6">
        <div className="flex justify-center gap-1 text-accent mb-6">
          <Star className="fill-accent text-accent" size={22} />
          <Star className="fill-accent text-accent" size={22} />
          <Star className="fill-accent text-accent" size={22} />
          <Star className="fill-accent text-accent" size={22} />
          <Star className="text-accent" size={22} />
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-2xl leading-relaxed text-ink m-0 font-medium"
        >
          « Nous avons réservé un traiteur et un DJ pour notre mariage en moins de deux jours. Tout était clair, du premier échange jusqu’à la prestation. »
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className="font-bold text-lg text-ink">Marielle K.</div>
          <div className="text-neutral-600 text-sm mt-1">Organisatrice, mariage à Douala</div>
          <div className="flex justify-center mt-4">
            <svg width="120" height="14" viewBox="0 0 140 16">
              <path d="M2 12 Q35 2 70 10 T138 6" fill="none" stroke="currentColor" className="text-accent" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
