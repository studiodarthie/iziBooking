"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

export type Testimonial = {
  id: string;
  rating: number;
  comment: string;
  organizerName: string;
  organizerImage: string | null;
  providerName: string;
};

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section id="temoignages" className="relative py-16 md:py-24 bg-[#FCEFDD] overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-primary text-xs font-bold tracking-[0.08em] uppercase">Ce qu’ils en disent</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-3">
            Des organisateurs déjà conquis
          </h2>
        </div>

        <div className={`grid gap-6 ${testimonials.length === 1 ? "max-w-xl mx-auto" : testimonials.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : "md:grid-cols-3"}`}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300"
            >
              <div className="flex gap-0.5 text-accent mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={16} className={n <= t.rating ? "fill-accent text-accent" : "text-neutral-300"} />
                ))}
              </div>
              <p className="text-ink leading-relaxed flex-1">« {t.comment} »</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-divider">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center text-sm font-bold text-accent shrink-0 ring-2 ring-offset-2 ring-accent/20">
                  {t.organizerImage ? (
                    <Image src={t.organizerImage} alt={t.organizerName} fill className="object-cover" />
                  ) : (
                    t.organizerName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-ink">{t.organizerName}</div>
                  <div className="text-neutral-500 text-xs">À propos de {t.providerName}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
