"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/search", label: "Catalogue" },
  { href: "/#temoignages", label: "Références" },
  { href: "/contact", label: "Contact" },
];

/**
 * Barre de navigation unique du site : pilules blanches flottantes.
 * `overlay` la pose par-dessus un hero (accueil) ; sinon elle s'insère dans le flux de la page.
 */
export function PublicNavbar({ overlay = false }: { overlay?: boolean }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={`z-50 px-4 md:px-8 pt-5 ${overlay ? "absolute top-0 inset-x-0" : "relative pb-4"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" aria-label="iziBooking - Accueil" className="bg-white rounded-2xl px-4 h-12 md:h-14 flex items-center border border-black/5 shadow-lg shadow-black/10">
            <Image src="/logo.png" alt="iziBooking" width={1576} height={317} priority className="h-6 md:h-7 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-white rounded-2xl h-14 px-3 border border-black/5 shadow-lg shadow-black/10">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="px-4 py-2 rounded-xl text-sm font-semibold text-ink/80 hover:text-primary hover:bg-neutral-100 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 bg-white rounded-2xl h-12 md:h-14 px-2 border border-black/5 shadow-lg shadow-black/10">
            {user ? (
              <Link href="/dashboard" className="flex items-center gap-2 h-10 pl-1 pr-3 rounded-xl hover:bg-neutral-100 transition-colors">
                <span className="relative w-8 h-8 rounded-full overflow-hidden bg-primary/15 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {user.image ? <Image src={user.image} alt={user.name || "Profil"} fill className="object-cover" /> : (user.name || "?").charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline text-sm font-semibold text-ink max-w-[110px] truncate">{user.name}</span>
              </Link>
            ) : (
              <>
                <Link href="/login" aria-label="Connexion" className="w-10 h-10 rounded-xl flex items-center justify-center text-ink/80 hover:bg-neutral-100 transition-colors">
                  <User size={18} />
                </Link>
                <Link href="/inscription" className="hidden md:inline-flex h-10 items-center bg-primary hover:bg-accent-600 text-white text-sm font-bold rounded-xl px-4 transition-colors">
                  Inscription gratuite
                </Link>
              </>
            )}
            <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-ink/80 hover:bg-neutral-100">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col p-6 lg:hidden bg-white">
          <div className="flex items-center justify-between mb-10">
            <Image src="/logo.png" alt="iziBooking" width={1576} height={317} className="h-8 w-auto" />
            <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="text-ink/70 hover:text-ink"><X size={24} /></button>
          </div>
          <div className="flex flex-col gap-6">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg font-medium text-ink/80 hover:text-ink">{l.label}</Link>
            ))}
            <Link href={user ? "/dashboard" : "/login"} onClick={() => setOpen(false)} className="text-lg font-medium text-ink/80">
              {user ? "Mon tableau de bord" : "Connexion"}
            </Link>
            <Link href="/inscription" onClick={() => setOpen(false)} className="text-lg font-bold text-primary">Inscription gratuite</Link>
          </div>
        </div>
      )}
    </>
  );
}
