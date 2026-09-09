"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  Music,
  Bell,
  CheckCircle,
  Users,
  Image as ImageIcon,
  BarChart,
  Clock,
  CreditCard,
  Tag,
  TrendingUp,
  List,
  MapPin,
  ClipboardList
} from "lucide-react";
import { signOut } from "next-auth/react";

const PROVIDER_SECTIONS = [
  {
    title: "VUE D'ENSEMBLE",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Statistiques", href: "#", icon: BarChart },
      { name: "Calendrier", href: "/dashboard/calendar", icon: Calendar },
    ]
  },
  {
    title: "GESTION DES RÉSERVATIONS",
    items: [
      { name: "Réservations", href: "/dashboard/bookings", icon: Clock, badge: 3 },
      { name: "Clients", href: "#", icon: Users },
      { name: "Paiements", href: "#", icon: CreditCard },
      { name: "Coupons", href: "#", icon: Tag },
      { name: "Tarifs dynamiques", href: "#", icon: TrendingUp },
    ]
  },
  {
    title: "CONFIGURATION MÉTIER",
    items: [
      { name: "Services", href: "/dashboard/services", icon: List },
      { name: "Équipe", href: "#", icon: Users },
      { name: "Lieux", href: "#", icon: MapPin },
      { name: "Médiathèque", href: "/dashboard/media", icon: ImageIcon },
    ]
  },
  {
    title: "PARAMÈTRES",
    items: [
      { name: "Champs personnalisés", href: "#", icon: ClipboardList },
      { name: "Notifications", href: "#", icon: Bell },
      { name: "Général", href: "/dashboard/settings", icon: Settings },
    ]
  }
];

const ORGANIZER_NAVIGATION = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mes Réservations", href: "/dashboard/bookings", icon: CheckCircle, badge: 1 },
  { name: "Artistes favoris", href: "/dashboard/artists", icon: Users },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ role = "PROVIDER" }: { role?: string }) {
  const pathname = usePathname();
  
  return (
    <div className="flex h-full w-72 flex-col border-r border-primary/20 bg-primary text-white shadow-lg">
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary transition-transform group-hover:scale-105 shadow-sm">
            <Music size={20} />
          </div>
          <span className="text-xl font-heading font-bold tracking-tight text-white">
            iziBooking
          </span>
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
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard' && item.href !== '#');
                    const isDraft = item.href === '#';
                    
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-white/20 text-white shadow-sm"
                              : isDraft 
                                ? "text-white/40 cursor-not-allowed hover:bg-transparent"
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
                          {item.badge && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-900 shadow-sm">
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
                      {item.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-900 shadow-sm">
                          {item.badge}
                        </span>
                      )}
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
            onClick={() => signOut()}
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
