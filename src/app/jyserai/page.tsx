import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { HomeFooter } from "@/components/public/HomeFooter";
import { Camera, Share2, Sparkles, ArrowRight, Crown, Users } from "lucide-react";
import { buildCloudinaryUrl } from "@/lib/poster";

// Exemple statique d'affiche avec gabarit personnalisé, montrant la zone où la photo du
// visiteur s'insère — plus parlant qu'un rendu généré automatiquement pour ce hero.
const HERO_DEMO_PUBLIC_ID = "izibooking/jyserai-hero-demo";

const STEPS = [
  {
    icon: Sparkles,
    title: "Créez votre affiche",
    text: "Titre, date, et si vous voulez votre propre visuel (comme une vraie affiche d'événement). Depuis votre tableau de bord, en une minute.",
  },
  {
    icon: Share2,
    title: "Partagez le lien",
    text: "Un lien unique à envoyer sur WhatsApp, Facebook, Instagram — à vos invités, vos abonnés, votre communauté.",
  },
  {
    icon: Camera,
    title: "Chacun génère la sienne",
    text: "Chaque visiteur ajoute sa photo, ajuste le cadrage, et télécharge sa propre affiche à repartager. Chaque partage fait connaître votre événement.",
  },
  {
    icon: Users,
    title: "Vous récupérez les contacts",
    text: "Nom, téléphone, email : chaque affiche générée vous laisse un contact intéressé par votre événement, exportable en un clic.",
  },
];

export default async function JySeraiLandingPage() {
  const session = await getServerSession(authOptions);
  const ctaHref = session?.user ? "/dashboard/posters" : "/inscription";

  const demoUrl = buildCloudinaryUrl(HERO_DEMO_PUBLIC_ID, "f_auto,q_auto");

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0B1130] via-[#141D45] to-[#1E2A5E]">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-culture/25 blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-[-120px] w-[460px] h-[460px] rounded-full bg-accent/40 blur-3xl pointer-events-none" />
        <PublicNavbar />

        <section className="relative z-10 px-4 md:px-8 py-10 md:py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-white/10 text-accent-2-300 text-[12px] font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-5">
                Gratuit · Sans compte pour vos invités
              </span>
              <h1 className="font-heading font-extrabold text-[clamp(32px,4.5vw,52px)] leading-[1.08] text-white">
                Faites parler de votre événement avec des affiches{" "}
                <span className="text-accent-2-300">« J'y serai »</span>
              </h1>
              <p className="mt-5 text-lg text-white/75 max-w-xl">
                Créez une campagne pour votre mariage, concert, festival ou conférence. Vos
                invités ajoutent leur photo et partagent leur propre affiche — chaque partage est
                une publicité gratuite, et vous récupérez leurs coordonnées au passage.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-primary font-bold rounded-full px-7 py-4 transition-colors"
                >
                  Créer mon affiche gratuitement <ArrowRight size={18} />
                </Link>
                <Link
                  href="/jyserai/galerie"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold rounded-full px-7 py-4 hover:bg-white/20 transition-colors"
                >
                  Voir les badges existants
                </Link>
              </div>
              <p className="mt-4 text-xs text-white/60 flex items-center gap-1.5">
                <Crown size={14} className="text-accent-2-300" />
                Avec Premium, le filigrane iziBooking disparaît de vos affiches.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-[320px] rounded-[28px] overflow-hidden shadow-2xl border-4 border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={demoUrl} alt="Exemple d'affiche J'y serai" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="px-4 md:px-8 py-10 md:py-16 bg-white border-y border-divider">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center font-heading font-bold text-2xl md:text-3xl text-ink mb-10">
            Comment ça marche
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-heading font-bold">
                  <s.icon size={24} />
                </div>
                <p className="text-xs font-bold text-primary tracking-wide uppercase mb-1">Étape {i + 1}</p>
                <h3 className="font-heading font-bold text-lg text-ink">{s.title}</h3>
                <p className="text-sm text-neutral-600 mt-2">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-14 text-center">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-ink">
          Prêt à faire parler de votre événement ?
        </h2>
        <Link
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center gap-2 bg-primary hover:bg-accent-600 text-white font-bold rounded-full px-7 py-4 transition-colors"
        >
          Créer mon affiche gratuitement <ArrowRight size={18} />
        </Link>
      </section>

      <HomeFooter />
    </div>
  );
}
