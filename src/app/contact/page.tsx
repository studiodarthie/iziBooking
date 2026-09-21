import type { Metadata } from "next";
import { Mail, MessageCircleQuestion, Clock } from "lucide-react";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { HomeFooter } from "@/components/public/HomeFooter";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact - iziBooking",
  description: "Une question sur iziBooking ? Écrivez-nous, notre équipe vous répond.",
};

const faqs = [
  {
    q: "Comment mon acompte est-il sécurisé ?",
    a: "L'acompte est payé via la plateforme (mobile money ou carte) puis reversé au prestataire. Vous ne payez jamais en direct à l'aveugle.",
  },
  {
    q: "Comment devenir prestataire ?",
    a: "Créez votre profil gratuitement depuis « Inscription gratuite ». Une fois vérifié, vous apparaissez dans le catalogue.",
  },
  {
    q: "Que faire en cas de problème avec une prestation ?",
    a: "Signalez le litige depuis votre réservation. Notre équipe intervient pour trouver une solution avec le prestataire.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Orange Money, MTN MoMo, Wave, Moov Money, ainsi que la carte bancaire pour la diaspora.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-ink font-sans flex flex-col">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FBDDBF] via-[#FCE6CE] to-[#FCEFDD]">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/30 blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-[-120px] w-[460px] h-[460px] rounded-full bg-accent/40 blur-3xl pointer-events-none" />
        <PublicNavbar />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-24 md:pb-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-primary/10 text-primary text-[12px] font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-5">
              Contact
            </span>
            <h1 className="font-heading font-extrabold text-[clamp(34px,4.4vw,58px)] leading-[1.05] text-ink">
              On vous écoute.
            </h1>
            <p className="mt-5 text-neutral-700 text-base md:text-lg leading-relaxed">
              Une question, une suggestion, un souci avec une réservation ? Écrivez-nous, nous vous répondons par email.
            </p>
          </div>
        </div>
      </div>

      <section className="relative z-20 -mt-16 md:-mt-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 items-start">
          <ContactForm />

          <aside className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
              <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Mail size={22} /></span>
              <h2 className="font-heading font-bold text-xl text-ink mt-4">Écrivez-nous</h2>
              <a href="mailto:hello@izibooking.app" className="text-primary font-semibold hover:underline">hello@izibooking.app</a>
            </div>
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
              <span className="w-11 h-11 rounded-xl bg-accent-2-100 text-accent-2-600 flex items-center justify-center"><Clock size={22} /></span>
              <h2 className="font-heading font-bold text-xl text-ink mt-4">Notre réponse</h2>
              <p className="text-neutral-700 text-sm leading-relaxed mt-1">Nous lisons chaque message et répondons dès que possible, par email.</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="faq" className="py-16 md:py-24 px-4 md:px-8 max-w-4xl mx-auto w-full scroll-mt-4">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-primary text-xs font-bold tracking-[0.08em] uppercase">
            <MessageCircleQuestion size={16} /> Questions fréquentes
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-3">Peut-être une réponse ici</h2>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((f) => (
            <details key={f.q} className="group bg-[#FCEFDD] rounded-2xl px-6 py-4 open:bg-white open:border open:border-neutral-300 open:shadow-sm">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-heading font-bold text-lg text-ink">
                {f.q}
                <span className="text-primary text-2xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-neutral-700 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
