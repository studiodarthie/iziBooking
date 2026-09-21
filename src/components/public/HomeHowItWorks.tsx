"use client";

import { motion } from "framer-motion";
import { Search, MessagesSquare, CalendarCheck, PartyPopper } from "lucide-react";

const steps = [
  { icon: Search, title: "Trouvez", desc: "Filtrez par métier, pays, budget et disponibilité pour repérer les bons profils.", color: "bg-primary" },
  { icon: MessagesSquare, title: "Échangez", desc: "Posez vos questions et comparez les offres directement avec les prestataires.", color: "bg-accent-2-500" },
  { icon: CalendarCheck, title: "Réservez", desc: "Choisissez votre date et versez l'acompte en mobile money, sécurisé.", color: "bg-trust" },
  { icon: PartyPopper, title: "Profitez", desc: "Vivez votre événement, puis laissez un avis pour aider la communauté.", color: "bg-accent-700" },
];

export function HomeHowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-primary text-xs font-bold tracking-[0.08em] uppercase">Comment ça marche</span>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-3">Réservez en 4 étapes simples</h2>
      </div>

      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] border-t-2 border-dashed border-accent-300" aria-hidden />
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative flex flex-col items-center text-center"
          >
            <div className={`relative w-20 h-20 rounded-full ${s.color} text-white flex items-center justify-center shadow-lg ring-8 ring-white`}>
              <s.icon size={30} strokeWidth={1.8} />
              <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white text-ink text-xs font-bold flex items-center justify-center shadow">{i + 1}</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-ink mt-6">{s.title}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed mt-2 max-w-[240px]">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
