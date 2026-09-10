"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { ChevronDown, LayoutDashboard, Settings, LogOut } from "lucide-react";

export function AdminUserMenu({ name, email, image }: { name: string | null; email: string; image: string | null }) {
  const displayName = name || "Admin";
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
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsMenuOpen((v) => !v)}
        aria-expanded={isMenuOpen}
        className="flex items-center gap-x-3 rounded-xl px-2 py-1.5 -mx-2 hover:bg-ink/5 transition-colors"
      >
        <span className="text-sm font-bold text-ink hidden sm:inline">Mode Administrateur</span>
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
          {image ? (
            <Image src={image} alt={displayName} fill className="object-cover" />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-ink/40 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-ink/10 bg-white shadow-lg py-2 z-50">
          <div className="px-4 py-3 border-b border-ink/10">
            <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
            <p className="text-xs text-ink/50 truncate">{email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-sand/50 transition-colors"
            >
              <LayoutDashboard size={16} className="text-ink/40" />
              Retour au Dashboard
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/80 hover:bg-sand/50 transition-colors"
            >
              <Settings size={16} className="text-ink/40" />
              Paramètres du compte
            </Link>
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
  );
}
