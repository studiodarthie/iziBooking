"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, SmartphoneNfc, LockKeyhole } from "lucide-react";

const advantages = [
  {
    icon: ShieldCheck,
    title: "Profils vérifiés",
    desc: "Chaque artiste vérifié passe un contrôle d'identité avant d'être visible sur la plateforme."
  },
  {
    icon: Clock,
    title: "Gagnez du temps",
    desc: "Comparez, échangez et réservez sans passer par le bouche-à-oreille ou des intermédiaires."
  },
  {
    icon: SmartphoneNfc,
    title: "Mobile money accepté",
    desc: "Orange Money, MTN MoMo, Wave, Moov Money — ou carte bancaire pour la diaspora."
  },
  {
    icon: LockKeyhole,
    title: "Litiges pris en charge",
    desc: "En cas de désaccord sur une prestation, notre équipe peut intervenir pour arbitrer et trouver une solution avec le prestataire."
  }
];

export function HomeAdvantages() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 justify-center mb-12">
          <div className="flex-1 max-w-[120px] h-px bg-divider"></div>
          <h5 className="font-heading font-semibold text-[13px] tracking-[0.08em] text-ink m-0">
            LES AVANTAGES IZIBOOKING
          </h5>
          <div className="flex-1 max-w-[120px] h-px bg-divider"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
          {advantages.map((adv, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full border-2 border-accent text-accent flex items-center justify-center mb-5 bg-white shadow-sm hover:bg-accent hover:text-white transition-colors duration-300">
                <adv.icon size={24} strokeWidth={1.8} />
              </div>
              <h6 className="font-bold text-ink mb-2 text-lg">{adv.title}</h6>
              <p className="text-neutral-600 text-[13px] leading-relaxed max-w-[260px]">
                {adv.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
