"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Search, Menu, ChevronDown, User as UserIcon, Settings, Crown, ShieldCheck, LogOut } from "lucide-react";
import Image from "next/image";
import type { Prisma } from "@prisma/client";
import { isPremium } from "@/lib/plan";

export type NavbarUser = Prisma.UserGetPayload<{ include: { providerProfile: true } }>;

type NavbarProps = {
  user: NavbarUser;
  onMenuClick?: () => void;
};

export function Navbar({ user, onMenuClick }: NavbarProps) {
  const profile = user.providerProfile;
  const displayName = profile?.name || user.name || "Utilisateur";
  const displayRole = user.role === "PROVIDER" ? "Prestataire" : "Organisateur";
  const premium = profile ? isPremium(profile) : false;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-ink/10 bg-background/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="-m-2.5 p-2.5 text-ink/70 lg:hidden hover:text-ink"
      >
        <span className="sr-only">Ouvrir le menu</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end lg:justify-between items-center">
        <form className="relative hidden flex-1 lg:flex items-center" action="/search" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Rechercher
          </label>
          <div className="relative w-full max-w-md">
            <Search
              className="pointer-events-none absolute inset-y-0 left-3 h-full w-4 text-ink/40"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-10 w-full rounded-full border border-ink/10 bg-white py-0 pl-10 pr-4 text-ink placeholder:text-ink/40 focus:ring-1 focus:ring-primary sm:text-sm transition-colors shadow-sm"
              placeholder="Rechercher un prestataire..."
              type="search"
              name="q"
            />
          </div>
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
          {/* Profile dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-expanded={isMenuOpen}
              className="flex items-center gap-x-3 rounded-xl px-2 py-1.5 -mx-2 hover:bg-ink/5 transition-colors"
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-full bg-accent/20 border border-accent/30 shadow-sm shrink-0">
                {user.image ? (
                  <Image src={user.image} alt={displayName} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-accent-dark">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="hidden lg:flex lg:flex-col lg:items-start">
                <span className="text-sm font-semibold text-ink" aria-hidden="true">
                  {displayName}
                </span>
                <span className="flex items-center gap-1 text-xs text-ink/50">
                  {displayRole}
                  {premium && <Crown size={12} className="text-accent-2" aria-label="Premium" />}
                </span>
              </div>
              <ChevronDown className={`hidden lg:block h-4 w-4 text-ink/40 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-ink/10 bg-white shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-ink/10">
                  <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
                  <p className="text-xs text-ink/50 truncate">{user.email}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-sand px-2 py-0.5 text-[11px] font-semibold text-ink/70">
                    {displayRole}
                    {premium && <Crown size={11} className="text-accent-2" />}
                  </span>
                </div>

                <div className="py-1">
                  {profile && (
                    <Link
                      href={`/p/${profile.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-sand/50 transition-colors"
                    >
                      <UserIcon size={16} className="text-ink/40" />
                      Voir mon profil public
                    </Link>
                  )}
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-sand/50 transition-colors"
                  >
                    <Settings size={16} className="text-ink/40" />
                    Paramètres du compte
                  </Link>
                  {profile && (
                    <Link
                      href="/dashboard/settings/premium"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-sand/50 transition-colors"
                    >
                      <Crown size={16} className="text-ink/40" />
                      {premium ? "Gérer mon abonnement" : "Passer Premium"}
                    </Link>
                  )}
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-sand/50 transition-colors"
                    >
                      <ShieldCheck size={16} className="text-ink/40" />
                      Mode Administrateur
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-ink/10">
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
