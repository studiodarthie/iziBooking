import Link from "next/link";
import {
  Target, BookOpen, Handshake, UserCircle, CalendarCheck, Coins, Wallet, Undo2, Crown, Scale, ShieldAlert,
  Copyright, Database, RefreshCw, Gavel, Users, Briefcase, PartyPopper, Star, Ban, UserCheck, Share2, Network,
  Clock, KeyRound, Lock, Cookie, Baby, Building2, PenLine, Server, Mail, Camera, ClipboardCheck, Globe,
  TriangleAlert, SearchCheck, FileText, type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { HomeFooter } from "@/components/public/HomeFooter";

export const LEGAL_LINKS = [
  { href: "/cgv", label: "CGV" },
  { href: "/reglement", label: "Règlement" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/dpa", label: "Accord de traitement (DPA)" },
  { href: "/mentions-legales", label: "Mentions légales" },
];

// Icône de chaque rubrique, choisie d'après son identifiant ; FileText par défaut.
const SECTION_ICONS: Record<string, LucideIcon> = {
  objet: Target, definitions: BookOpen, role: Handshake, comptes: UserCircle, reservation: CalendarCheck,
  prix: Coins, paiement: Wallet, paiements: Wallet, annulation: Undo2, premium: Crown, litiges: Scale,
  responsabilite: ShieldAlert, propriete: Copyright, donnees: Database, modification: RefreshCw,
  modifications: RefreshCw, droit: Gavel, communes: Users, prestataires: Briefcase, organisateurs: PartyPopper,
  avis: Star, sanctions: Ban, responsable: UserCheck, finalites: Target, destinataires: Share2,
  "sous-traitants": Network, conservation: Clock, droits: KeyRound, securite: Lock, cookies: Cookie,
  mineurs: Baby, editeur: Building2, publication: PenLine, hebergement: Server, contact: Mail, credits: Camera,
  roles: Users, obligations: ClipboardCheck, transferts: Globe, violation: TriangleAlert, duree: Clock,
  audit: SearchCheck,
};

export type LegalSection = { id: string; title: string; body: React.ReactNode };

export function LegalPage({
  current,
  title,
  intro,
  updated,
  sections,
}: {
  current: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-white text-ink font-sans flex flex-col">
      <PageHero eyebrow="Informations légales" title={title} description={intro}>
        <p className="mt-4 text-sm text-neutral-700">Dernière mise à jour : {updated}</p>
      </PageHero>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 md:py-16 grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-16 items-start">
        <aside className="lg:sticky lg:top-6 flex flex-col gap-8">
          <nav aria-label="Sommaire">
            <p className="text-xs font-bold tracking-[0.08em] uppercase text-primary mb-3">Sommaire</p>
            <ol className="flex flex-col gap-2 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-neutral-700 hover:text-primary transition-colors">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <nav aria-label="Autres documents légaux">
            <p className="text-xs font-bold tracking-[0.08em] uppercase text-primary mb-3">Autres documents</p>
            <ul className="flex flex-col gap-2 text-sm">
              {LEGAL_LINKS.filter((l) => l.href !== current).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-neutral-700 hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="max-w-3xl [&_p]:leading-relaxed [&_p]:text-neutral-700 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-neutral-700 [&_li]:leading-relaxed [&_strong]:text-ink [&_a]:text-primary [&_a]:font-medium [&_a:hover]:underline">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-6 mb-12">
              <div className="flex items-center gap-4">
                <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {(() => {
                    const Icon = SECTION_ICONS[s.id] ?? FileText;
                    return <Icon size={22} strokeWidth={1.8} />;
                  })()}
                </span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-ink">
                  {i + 1}. {s.title}
                </h2>
              </div>
              {s.body}
            </section>
          ))}
        </article>
      </div>

      <HomeFooter />
    </div>
  );
}
