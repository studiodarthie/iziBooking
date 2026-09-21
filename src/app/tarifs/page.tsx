import type { Metadata } from "next";
import Link from "next/link";
import { Check, Crown, ArrowRight, Users, Calculator } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { HomeFooter } from "@/components/public/HomeFooter";
import { FREE_PHOTO_LIMIT, FREE_SERVICE_LIMIT } from "@/lib/plan";

export const metadata: Metadata = {
  title: "Tarifs - iziBooking",
  description:
    "Gratuit pour les organisateurs, plan Free ou Premium pour les prestataires. Des tarifs simples, en FCFA, sans engagement.",
};

const PREMIUM_PRICE = 15000;
const FEE_ORGANIZER = 0.03;
const COMMISSION_FREE = 0.12;
const COMMISSION_PREMIUM = 0.06;

const fmt = (n: number) => n.toLocaleString("fr-FR");

const freeFeatures = [
  "Profil public dans le catalogue",
  `${FREE_PHOTO_LIMIT} photos`,
  `${FREE_SERVICE_LIMIT} services`,
  "Calendrier de disponibilités",
  "Messagerie avec les organisateurs",
  `Commission de ${COMMISSION_FREE * 100} % sur les réservations payées en ligne`,
];

const premiumFeatures = [
  "Tout le plan Free",
  "Photos et services en illimité",
  `Commission réduite à ${COMMISSION_PREMIUM * 100} %`,
  "Mise en avant dans les résultats de recherche",
  "Vérification de votre profil en priorité",
];

// Exemple chiffré : une prestation de 200 000 FCFA.
const EXAMPLE = 200000;
const exampleFee = EXAMPLE * FEE_ORGANIZER;
const exampleFree = EXAMPLE * (1 - COMMISSION_FREE);
const examplePremium = EXAMPLE * (1 - COMMISSION_PREMIUM);
const breakEven = PREMIUM_PRICE / (COMMISSION_FREE - COMMISSION_PREMIUM);

const faqs = [
  {
    q: "Puis-je m'inscrire gratuitement ?",
    a: "Oui. Créer un compte, un profil ou faire une demande de réservation est gratuit. Vous ne payez que lorsqu'une réservation est réglée.",
  },
  {
    q: "Le Premium engage-t-il sur la durée ?",
    a: "Non. C'est un abonnement mensuel sans engagement : à l'expiration, il n'est simplement plus renouvelé et vous repassez au plan Free.",
  },
  {
    q: "Comment est calculée la commission ?",
    a: "Elle est prélevée sur les paiements encaissés via la plateforme, au moment du reversement au prestataire. Elle est de 12 % en Free et de 6 % en Premium.",
  },
  {
    q: "Quels moyens de paiement sont acceptés ?",
    a: "Mobile money (Orange Money, MTN MoMo, Wave, Moov Money) et carte bancaire, via notre partenaire de paiement.",
  },
];

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-white text-ink font-sans flex flex-col">
      <PageHero
        overlap
        eyebrow="Tarifs"
        title={
          <>
            Simple, clair, <span className="text-primary">sans surprise.</span>
          </>
        }
        description="Gratuit pour les organisateurs. Pour les prestataires, un plan gratuit pour démarrer et un Premium pour accélérer."
      />

      {/* Plans prestataires */}
      <div className="bg-[#FCEFDD]">
      <section className="relative z-20 -mt-16 md:-mt-20 px-4 md:px-8 pb-16 md:pb-24 max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <div className="bg-white rounded-3xl border border-neutral-300 p-8 shadow-xl shadow-black/5 flex flex-col">
            <span className="text-primary text-xs font-bold tracking-[0.08em] uppercase">Prestataires</span>
            <h2 className="font-heading font-bold text-3xl text-ink mt-2">Free</h2>
            <p className="mt-3 flex items-end gap-2">
              <span className="font-heading font-extrabold text-5xl text-ink">0</span>
              <span className="text-neutral-700 pb-1.5">FCFA / mois</span>
            </p>
            <ul className="mt-6 space-y-3 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex gap-3 text-neutral-700 text-[15px]">
                  <Check size={18} className="text-trust shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="mt-8 inline-flex items-center justify-center gap-2 border border-neutral-400 text-ink font-bold rounded-full px-6 py-3 hover:border-primary hover:text-primary transition-colors">
              Créer mon profil gratuitement
            </Link>
          </div>

          <div className="relative bg-trust text-white rounded-3xl p-8 shadow-2xl shadow-trust/30 flex flex-col">
            <span className="absolute -top-3 right-6 inline-flex items-center gap-1.5 bg-accent-2-500 text-ink text-xs font-bold px-3 py-1 rounded-full">
              <Crown size={14} /> Recommandé
            </span>
            <span className="text-accent-2-300 text-xs font-bold tracking-[0.08em] uppercase">Prestataires</span>
            <h2 className="font-heading font-bold text-3xl mt-2">Premium</h2>
            <p className="mt-3 flex items-end gap-2">
              <span className="font-heading font-extrabold text-5xl">{fmt(PREMIUM_PRICE)}</span>
              <span className="text-white/80 pb-1.5">FCFA / mois</span>
            </p>
            <ul className="mt-6 space-y-3 flex-1">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex gap-3 text-white/90 text-[15px]">
                  <Check size={18} className="text-accent-2-300 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard/settings/premium" className="mt-8 inline-flex items-center justify-center gap-2 bg-white text-trust font-bold rounded-full px-6 py-3 hover:bg-accent-2-100 transition-colors">
              Passer en Premium <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-white/70 text-center mt-3">Sans engagement · annulable à tout moment</p>
          </div>
        </div>
      </section>
      </div>

      {/* Exemple chiffré */}
      <section className="max-w-5xl mx-auto w-full px-4 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 text-primary text-xs font-bold tracking-[0.08em] uppercase">
            <Calculator size={16} /> Un exemple concret
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-3">
            Une prestation à {fmt(EXAMPLE)} FCFA
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#FCEFDD] rounded-3xl p-6">
            <p className="text-sm font-semibold text-primary">L&apos;organisateur paie</p>
            <p className="font-heading font-extrabold text-3xl text-ink mt-2">{fmt(EXAMPLE + exampleFee)} FCFA</p>
            <p className="text-sm text-neutral-700 mt-2">{fmt(EXAMPLE)} pour la prestation + {fmt(exampleFee)} de frais de service ({FEE_ORGANIZER * 100} %).</p>
          </div>
          <div className="bg-[#F6EBDD] rounded-3xl p-6">
            <p className="text-sm font-semibold text-primary">Le prestataire Free reçoit</p>
            <p className="font-heading font-extrabold text-3xl text-ink mt-2">{fmt(exampleFree)} FCFA</p>
            <p className="text-sm text-neutral-700 mt-2">Après {COMMISSION_FREE * 100} % de commission ({fmt(EXAMPLE * COMMISSION_FREE)} FCFA).</p>
          </div>
          <div className="bg-trust-tint rounded-3xl p-6">
            <p className="text-sm font-semibold text-trust">Le prestataire Premium reçoit</p>
            <p className="font-heading font-extrabold text-3xl text-ink mt-2">{fmt(examplePremium)} FCFA</p>
            <p className="text-sm text-neutral-700 mt-2">Après {COMMISSION_PREMIUM * 100} % de commission ({fmt(EXAMPLE * COMMISSION_PREMIUM)} FCFA).</p>
          </div>
        </div>
        <p className="text-center text-neutral-700 mt-8 max-w-2xl mx-auto">
          Le Premium devient avantageux à partir d&apos;environ <strong className="text-ink">{fmt(breakEven)} FCFA</strong> de réservations payées en ligne par mois : la commission économisée couvre alors l&apos;abonnement.
        </p>
      </section>

      {/* Organisateurs */}
      <section className="bg-[#FCEFDD] py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <span className="w-16 h-16 rounded-2xl bg-white text-primary flex items-center justify-center shadow-sm"><Users size={30} /></span>
          <div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-ink">Pour les organisateurs : gratuit</h2>
            <p className="text-neutral-700 mt-2 leading-relaxed">
              Chercher, comparer, échanger et demander une réservation ne coûte rien. Un frais de service de {FEE_ORGANIZER * 100} % s&apos;ajoute au montant de la réservation : il finance la sécurisation des paiements, la vérification des profils et l&apos;arbitrage des litiges.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto w-full px-4 md:px-8 py-16 md:py-24">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink text-center mb-10">Questions sur les tarifs</h2>
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
        <p className="text-center text-neutral-700 mt-8">
          Une autre question ? <Link href="/contact" className="text-primary font-semibold hover:underline">Écrivez-nous</Link>.
        </p>
      </section>

      <HomeFooter />
    </div>
  );
}
