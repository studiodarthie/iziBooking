import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { CEMAC_COUNTRIES } from "@/lib/countries";

const FLAGS: Record<string, string> = {
  Gabon: "🇬🇦",
  Congo: "🇨🇬",
  Tchad: "🇹🇩",
  Centrafrique: "🇨🇫",
  "Guinée équatoriale": "🇬🇶",
};

const NAVIGATION = [
  { href: "/", label: "Accueil" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const LEGAL = [
  { href: "/reglement", label: "Règlement" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/dpa", label: "Accord de traitement (DPA)" },
];

const COMING_SOON = CEMAC_COUNTRIES.filter((c) => c.name !== "Cameroun");

const linkClass = "text-sm text-neutral-300 hover:text-accent transition-colors";
const headingClass = "text-neutral-400 font-semibold mb-5 text-sm uppercase tracking-wider";

export function HomeFooter() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-16">
          <div>
            <Image src="/logo-white.png" alt="iziBooking" width={1576} height={317} className="h-9 w-auto mb-5" />
            <p className="text-sm max-w-[32ch] leading-relaxed">
              La scène africaine, réservable en un clic. Le pont entre les talents et les événements inoubliables.
            </p>
            <div className="mt-8">
              <a href="mailto:hello@izibooking.app" className="text-sm text-neutral-300 hover:text-accent transition-colors">
                hello@izibooking.app
              </a>
            </div>
          </div>

          <div>
            <h6 className={headingClass}>Navigation</h6>
            <ul className="flex flex-col gap-3">
              {NAVIGATION.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className={headingClass}>Bientôt chez vous</h6>
            <ul className="flex flex-col gap-3">
              {COMING_SOON.map((c) => (
                <li key={c.name} className="text-sm text-neutral-300 flex items-center gap-2">
                  <span aria-hidden>{FLAGS[c.name]}</span> {c.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className={headingClass}>Légal</h6>
            <ul className="flex flex-col gap-3">
              {LEGAL.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t border-neutral-800 text-xs text-neutral-500 gap-4">
          <span>© {new Date().getFullYear()} iziBooking. Tous droits réservés.</span>
          <span className="flex items-center gap-1.5 text-neutral-300">
            Fait avec <Heart size={14} className="fill-primary text-primary" aria-label="amour" /> pour l&apos;Afrique
          </span>
        </div>
      </div>
    </footer>
  );
}
