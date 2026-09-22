import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Music,
  Utensils,
  Camera,
  Users,
  ShieldCheck,
  SmartphoneNfc,
  LockKeyhole,
  Handshake,
  ArrowRight,
  MessageCircle,
  Star,
  CalendarCheck,
} from "lucide-react";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { HomeFooter } from "@/components/public/HomeFooter";
import { HomeCTA } from "@/components/public/HomeCTA";

export const metadata: Metadata = {
  title: "À propos - iziBooking",
  description:
    "iziBooking rend la scène événementielle africaine réservable en un clic : artistes, traiteurs, salles, photographes et plus, avec paiement mobile money sécurisé.",
};

const poles = [
  { icon: Music, name: "Divertissement", desc: "Groupes, DJ, danseurs, percussionnistes, MC et artistes de scène.", tint: "bg-primary/10 text-primary" },
  { icon: Utensils, name: "Réception", desc: "Traiteurs, décorateurs, salles, sonorisation et éclairage.", tint: "bg-accent-2-100 text-accent-2-600" },
  { icon: Camera, name: "Image & Souvenir", desc: "Photographes, vidéastes, drone et photobooth.", tint: "bg-trust-tint text-trust" },
  { icon: Users, name: "Services", desc: "Sécurité, transport VIP, hôtesses et wedding planners.", tint: "bg-accent-200/60 text-accent-700" },
];

const promises = [
  { icon: ShieldCheck, title: "Des profils vérifiés", desc: "Chaque prestataire mis en avant passe un contrôle avant d'être visible. Vous savez à qui vous avez affaire." },
  { icon: SmartphoneNfc, title: "Le paiement qui vous ressemble", desc: "Mobile money (Orange Money, MTN MoMo, Wave, Moov Money) ou carte bancaire pour la diaspora." },
  { icon: LockKeyhole, title: "Un acompte sécurisé", desc: "Votre acompte est encaissé via la plateforme et reversé au prestataire : plus de virement à l'aveugle." },
  { icon: Handshake, title: "Un arbitre en cas de litige", desc: "Si une prestation ne se passe pas comme prévu, notre équipe intervient pour trouver une solution avec le prestataire." },
];

const journey = [
  { icon: MessageCircle, label: "Vous échangez" },
  { icon: CalendarCheck, label: "Vous réservez" },
  { icon: Star, label: "Vous notez" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-ink font-sans flex flex-col">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FBDDBF] via-[#FCE6CE] to-[#FCEFDD]">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/30 blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-[-120px] w-[460px] h-[460px] rounded-full bg-accent/40 blur-3xl pointer-events-none" />
        <PublicNavbar />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-20 md:pb-28 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <span className="inline-block bg-primary/10 text-primary text-[12px] font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-6">
              À propos d&apos;iziBooking
            </span>
            <h1 className="font-heading font-extrabold text-[clamp(34px,4.6vw,62px)] leading-[1.05] text-ink">
              Donner à la scène africaine
              <span className="text-primary"> l&apos;outil qu&apos;elle mérite.</span>
            </h1>
            <p className="mt-6 text-neutral-700 text-base md:text-lg leading-relaxed max-w-xl">
              Trouver un DJ, un traiteur ou un photographe fiable, c&apos;est encore trop souvent une affaire de bouche-à-oreille et de groupes WhatsApp.
              iziBooking réunit les talents et les organisateurs au même endroit, avec confiance et simplicité.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/search" className="inline-flex items-center gap-2 bg-primary hover:bg-accent-600 text-white font-bold rounded-full px-6 py-3 transition-colors shadow-lg shadow-primary/30">
                Trouver un prestataire <ArrowRight size={18} />
              </Link>
              <Link href="/inscription" className="inline-flex items-center gap-2 bg-white border border-neutral-400 text-ink font-semibold rounded-full px-6 py-3 hover:border-primary hover:text-primary transition-colors">
                Devenir prestataire
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block h-[440px]">
            <div className="absolute top-0 right-0 w-[70%] h-[300px] rounded-[2rem] overflow-hidden shadow-2xl rotate-2">
              <Image src="/images/home/traditional-dance.jpg" alt="Danse traditionnelle sur scène" fill priority className="object-cover" />
            </div>
            <div className="absolute bottom-0 left-4 w-[52%] h-[240px] rounded-[2rem] overflow-hidden shadow-2xl -rotate-3 border-4 border-white">
              <Image src="/images/home/wedding-dance.jpg" alt="Première danse des mariés" fill className="object-cover object-left" />
            </div>
          </div>
        </div>
      </div>

      {/* Constat */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <span className="text-primary text-xs font-bold tracking-[0.08em] uppercase">Pourquoi iziBooking</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-3 leading-tight">
              Un secteur immense, encore sans vraie plateforme
            </h2>
          </div>
          <div className="text-neutral-700 leading-relaxed space-y-4 text-[17px]">
            <p>
              Mariages, anniversaires, concerts, cérémonies d&apos;entreprise : les événements font vivre des milliers de prestataires en Afrique.
              Pourtant, la plupart travaillent sans endroit central où être découverts, comparés et réservés en confiance.
            </p>
            <p>
              Du côté des organisateurs, c&apos;est le même casse-tête : contacts glanés au fil des soirées, tarifs opaques, acomptes envoyés sans garantie.
            </p>
            <p className="font-semibold text-ink">
              iziBooking répond à ce manque, en commençant par l&apos;Afrique centrale et francophone, avec le mobile money au cœur du parcours.
            </p>
          </div>
        </div>
      </section>

      {/* Les 4 pôles */}
      <section className="bg-[#FCEFDD] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary text-xs font-bold tracking-[0.08em] uppercase">Toute la chaîne événementielle</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-3">Un seul endroit, quatre univers</h2>
            <p className="text-neutral-700 mt-4">De l&apos;artiste sur scène au photographe qui garde le souvenir, tout ce qui fait un événement réussi.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {poles.map((p) => (
              <div key={p.name} className="bg-white rounded-3xl p-7 shadow-sm border border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${p.tint}`}>
                  <p.icon size={26} strokeWidth={1.8} />
                </div>
                <h3 className="font-heading font-bold text-xl text-ink mt-5">{p.name}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mt-2">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos engagements */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
          <div>
            <span className="text-primary text-xs font-bold tracking-[0.08em] uppercase">Nos engagements</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-3 leading-tight">
              La confiance avant tout
            </h2>
            <p className="text-neutral-700 mt-4 leading-relaxed">
              Réserver un prestataire, c&apos;est engager de l&apos;argent et le jour le plus important d&apos;un événement. Nous avons construit iziBooking autour de ce que cela demande.
            </p>
            <div className="hidden lg:flex items-center gap-4 mt-8">
              {journey.map((j, i) => (
                <div key={j.label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30"><j.icon size={20} /></span>
                    <span className="text-xs font-semibold text-ink">{j.label}</span>
                  </div>
                  {i < journey.length - 1 && <span className="w-8 border-t-2 border-dashed border-accent-300 -mt-6" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {promises.map((p) => (
              <div key={p.title} className="rounded-3xl border border-neutral-200 p-6 bg-white hover:border-primary/40 hover:shadow-lg transition-all">
                <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><p.icon size={22} strokeWidth={1.8} /></span>
                <h3 className="font-heading font-bold text-lg text-ink mt-4">{p.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mt-2">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section className="bg-[#F6EBDD] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm">
            <span className="text-primary text-xs font-bold tracking-[0.08em] uppercase">Organisateurs</span>
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-ink mt-3">Organisez sans stress</h3>
            <ul className="mt-5 space-y-3 text-neutral-700">
              <li className="flex gap-3"><span className="text-primary font-bold">✓</span> Comparez profils, tarifs, avis et disponibilités.</li>
              <li className="flex gap-3"><span className="text-primary font-bold">✓</span> Échangez et réservez directement, sans intermédiaire.</li>
              <li className="flex gap-3"><span className="text-primary font-bold">✓</span> Payez votre acompte en toute sécurité.</li>
            </ul>
            <Link href="/search" className="inline-flex items-center gap-2 mt-7 text-primary font-bold hover:underline">
              Explorer le catalogue <ArrowRight size={18} />
            </Link>
          </div>
          <div className="bg-trust text-white rounded-3xl p-8 md:p-10 shadow-sm">
            <span className="text-accent-2-300 text-xs font-bold tracking-[0.08em] uppercase">Prestataires</span>
            <h3 className="font-heading font-bold text-2xl md:text-3xl mt-3">Faites rayonner votre talent</h3>
            <ul className="mt-5 space-y-3 text-white/85">
              <li className="flex gap-3"><span className="text-accent-2-300 font-bold">✓</span> Une vitrine professionnelle, gratuite à la création.</li>
              <li className="flex gap-3"><span className="text-accent-2-300 font-bold">✓</span> Un calendrier, des demandes qualifiées et vos acomptes garantis.</li>
              <li className="flex gap-3"><span className="text-accent-2-300 font-bold">✓</span> Des avis clients qui construisent votre réputation.</li>
            </ul>
            <Link href="/inscription" className="inline-flex items-center gap-2 mt-7 bg-white text-trust font-bold rounded-full px-6 py-3 hover:bg-accent-2-100 transition-colors">
              Créer mon profil <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact + CTA */}
      <section className="py-16 md:py-20 px-4 md:px-8 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink">Une question ? Parlons-en.</h2>
        <p className="text-neutral-700 mt-3">Notre équipe vous répond avec plaisir.</p>
        <a href="mailto:hello@izibooking.app" className="inline-block mt-5 text-primary font-bold text-lg hover:underline">
          hello@izibooking.app
        </a>
      </section>

      <HomeCTA />
      <HomeFooter />
    </div>
  );
}
