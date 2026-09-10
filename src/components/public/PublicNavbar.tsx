"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Menu, X, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

interface PublicNavbarProps {
  theme?: "dark" | "light";
  showTopbar?: boolean;
}

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/search", label: "Catalogue" },
  { href: "/#temoignages", label: "Références" },
];

export function PublicNavbar({ theme = "light", showTopbar = false }: PublicNavbarProps) {
  const isDark = theme === "dark";
  const { data: session } = useSession();
  const user = session?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {showTopbar && (
        <div className="relative z-20 justify-end items-center px-4 md:px-8 py-2 text-xs md:text-[12.5px] text-white/70 border-b border-white/10 hidden md:flex">
          <div className="flex gap-5">
            <a href="tel:+237600000000" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={13} /> Appelez-nous : +237 6 00 00 00 00
            </a>
            <a href="mailto:contact@izibooking.africa" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={13} /> contact@izibooking.africa
            </a>
          </div>
        </div>
      )}

      <nav className={`relative z-50 flex items-center justify-between px-4 md:px-8 py-5 border-b ${isDark ? 'border-white/5' : 'border-ink/5 bg-white'}`}>
        <div>
          <Link href="/" className={`font-heading font-bold text-xl md:text-2xl tracking-tight ${isDark ? 'text-white' : 'text-ink'}`}>
            izi<span className={isDark ? "" : "text-primary"}>Booking</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 mr-2">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors ${isDark ? 'text-white/70 hover:text-white' : 'text-ink/70 hover:text-ink'}`}>
                {link.label}
              </Link>
            ))}
          </div>
          {user ? (
            <Link href="/dashboard" className={`flex items-center gap-2 pl-1 pr-3 h-10 rounded-full border transition-colors ${
              isDark
                ? 'border-white/20 text-white/80 hover:text-white hover:border-white/40'
                : 'border-ink/20 text-ink/80 hover:text-ink hover:border-ink/40'
            }`}>
              <span className="relative w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-sm font-bold shrink-0">
                {user.image ? (
                  <Image src={user.image} alt={user.name || "Profil"} fill className="object-cover" />
                ) : (
                  (user.name || "?").charAt(0).toUpperCase()
                )}
              </span>
              <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">{user.name}</span>
            </Link>
          ) : (
            <Link href="/login" className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
              isDark
                ? 'border-white/20 text-white/80 hover:text-white hover:border-white/40'
                : 'border-ink/20 text-ink/80 hover:text-ink hover:border-ink/40'
            }`}>
              <User size={18} />
            </Link>
          )}
          <Link href="/onboarding" className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-primary hover:bg-accent-600 text-white border-none rounded-full py-2 pl-2 pr-5 flex items-center gap-2.5 text-sm font-semibold transition-colors ${isDark ? 'shadow-[0_0_15px_rgba(181,69,27,0.3)]' : 'shadow-sm'}`}
            >
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-lg leading-none pb-0.5">+</span>
              Inscription gratuite
            </motion.button>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`ml-2 lg:hidden ${isDark ? 'text-white/80 hover:text-white' : 'text-ink/80 hover:text-ink'}`}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className={`fixed inset-0 z-[100] flex flex-col p-6 lg:hidden ${isDark ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-10">
            <span className={`font-heading font-bold text-xl ${isDark ? 'text-white' : 'text-ink'}`}>iziBooking</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className={isDark ? 'text-white/80 hover:text-white' : 'text-ink/70 hover:text-ink'}>
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium transition-colors ${isDark ? 'text-white/80 hover:text-white' : 'text-ink/80 hover:text-ink'}`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium ${isDark ? 'text-white/80 hover:text-white' : 'text-ink/80 hover:text-ink'}`}>
                Mon tableau de bord
              </Link>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium ${isDark ? 'text-white/80 hover:text-white' : 'text-ink/80 hover:text-ink'}`}>
                Connexion
              </Link>
            )}
            <Link href="/onboarding" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-primary">
              Inscription gratuite
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
