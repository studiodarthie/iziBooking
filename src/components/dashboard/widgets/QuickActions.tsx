import Link from "next/link";
import { Calendar, CheckCircle, Users, MessageSquare, Zap } from "lucide-react";

export function QuickActions() {
  const actions = [
    { name: "Calendrier", icon: Calendar, href: "/dashboard/calendar", color: "text-accent-500", bg: "bg-accent/10" },
    { name: "Réservations", icon: CheckCircle, href: "/dashboard/bookings", color: "text-success", bg: "bg-success/10" },
    { name: "Artistes", icon: Users, href: "/dashboard/artists", color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Messages", icon: MessageSquare, href: "/dashboard/messages", color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-heading font-semibold text-ink mb-4">Actions Rapides</h2>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="bg-white border border-ink/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-sand/30 hover:border-ink/20 transition-all group shadow-sm"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${action.bg}`}>
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <span className="text-xs font-semibold text-ink/70 group-hover:text-ink">{action.name}</span>
          </Link>
        ))}
      </div>

      <Link
        href="/dashboard/bookings/new"
        className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
      >
        <Zap className="w-4 h-4" />
        Nouvelle Réservation
      </Link>
    </div>
  );
}
