"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  CheckCircle,
  Image as ImageIcon,
  Clock,
  List,
  Tag,
  Crown,
  Mail,
  Sparkles,
} from "lucide-react";
import { signOut } from "next-auth/react";

const PROVIDER_SECTIONS = [
  {
    title: "VUE D'ENSEMBLE",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
    ]
  },
  {
    title: "GESTION DES RÉSERVATIONS",
    items: [
      { name: "Réservations", href: "/dashboard/bookings", icon: Clock },
      { name: "Messages", href: "/dashboard/messages", icon: Mail },
    ]
  },
  {
    title: "CONFIGURATION MÉTIER",
    items: [
      { name: "Services", href: "/dashboard/services", icon: List },
      { name: "Codes promo", href: "/dashboard/coupons", icon: Tag },
      { name: "Médiathèque", href: "/dashboard/media", icon: ImageIcon },
      { name: "Coach IA", href: "/dashboard/coach", icon: Sparkles, badge: "Nouveau" },
    ]
  },
  {
    title: "PARAMÈTRES",
    items: [
      { name: "Général", href: "/dashboard/settings", icon: Settings },
      { name: "Premium", href: "/dashboard/settings/premium", icon: Crown },
    ]
  }
];

const ORGANIZER_NAVIGATION = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mes Réservations", href: "/dashboard/bookings", icon: CheckCircle },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({
  role = "PROVIDER",
  unreadMessages = 0,
  onNavigate,
}: {
  role?: string;
  unreadMessages?: number;
  /** Appelé au clic sur un lien — utilisé pour refermer le menu mobile, qui sinon reste
   * ouvert par-dessus la page après une navigation côté client. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  
  return (
    <div className="flex h-full w-72 flex-col border-r border-primary/20 bg-primary text-white shadow-lg">
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-white/10">
        <Link href="/" aria-label="iziBooking - Accueil">
          <Image src="/logo-white.png" alt="iziBooking" width={1571} height={314} className="h-8 w-auto" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col overflow-y-auto custom-scrollbar">
        {role === "PROVIDER" ? (
          <div className="flex-1 px-4 py-4 space-y-8">
            {PROVIDER_SECTIONS.map((section, idx) => (
              <div key={idx}>
                <div className="px-2 mb-3">
                  <p className="text-[11px] font-bold tracking-[0.15em] text-white/50 uppercase">
                    {section.title}
                  </p>
                </div>
                <ul role="list" className="flex flex-col gap-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');

                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-white/20 text-white shadow-sm"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-x-3">
                            <item.icon
                              className={`h-[18px] w-[18px] shrink-0 ${
                                isActive ? "text-accent" : "text-white/60 group-hover:text-white"
                              }`}
                            />
                            {item.name}
                          </div>
                          {item.href === "/dashboard/messages" && unreadMessages > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">
                              {unreadMessages}
                            </span>
                          )}
                          {"badge" in item && item.badge && (
                            <span className="text-[10px] font-bold bg-accent-2-500 text-ink px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 px-4 py-6">
            <ul role="list" className="flex flex-col gap-y-2">
              {ORGANIZER_NAVIGATION.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-white/20 text-white shadow-sm"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-x-3">
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${
                            isActive ? "text-accent" : "text-white/60 group-hover:text-white"
                          }`}
                        />
                        {item.name}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Bottom action */}
        <div className="shrink-0 p-4 border-t border-white/10 mt-auto">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="group flex w-full items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-red-300"
          >
            <LogOut className="h-5 w-5 shrink-0 text-white/50 group-hover:text-red-300" />
            Déconnexion
          </button>
        </div>
      </nav>
    </div>
  );
}
