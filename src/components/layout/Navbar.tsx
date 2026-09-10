"use client";

import { Search, Menu } from "lucide-react";
import Image from "next/image";
import type { Prisma } from "@prisma/client";

export type NavbarUser = Prisma.UserGetPayload<{ include: { providerProfile: true } }>;

type NavbarProps = {
  user: NavbarUser;
  onMenuClick?: () => void;
};

export function Navbar({ user, onMenuClick }: NavbarProps) {
  const profile = user.providerProfile;
  const displayName = profile?.name || user.name || "Utilisateur";
  const displayRole = user.role === "PROVIDER" ? "Prestataire" : "Organisateur";

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
          <div className="flex items-center gap-x-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-accent/20 border border-accent/30 shadow-sm">
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
              <span className="text-xs text-ink/50">{displayRole}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
