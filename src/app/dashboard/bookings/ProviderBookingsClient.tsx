"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, MapPin, User, ChevronRight, MessageSquare, MoreHorizontal, LayoutList, KanbanSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProviderBookingsClient({ initialBookings }: { initialBookings: any[] }) {
  const [view, setView] = useState<"list" | "kanban">("kanban");
  
  // Categorize bookings for Kanban
  const pending = initialBookings.filter(b => b.status === "PENDING");
  const accepted = initialBookings.filter(b => ["ACCEPTED", "DEPOSIT_PAID", "CONFIRMED"].includes(b.status));
  const completed = initialBookings.filter(b => b.status === "COMPLETED");
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="bg-warning/20 text-warning text-xs font-semibold px-2.5 py-1 rounded-full">En attente</span>;
      case "ACCEPTED":
      case "CONFIRMED":
      case "DEPOSIT_PAID":
        return <span className="bg-success/20 text-success text-xs font-semibold px-2.5 py-1 rounded-full">Confirmée</span>;
      case "COMPLETED":
        return <span className="bg-ink/10 text-ink/70 text-xs font-semibold px-2.5 py-1 rounded-full">Terminée</span>;
      case "CANCELLED":
        return <span className="bg-error/20 text-error text-xs font-semibold px-2.5 py-1 rounded-full">Annulée</span>;
      default:
        return <span className="bg-ink/10 text-ink/70 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <div className="bg-white border border-ink/10 rounded-xl p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all relative group flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sand overflow-hidden relative">
            {booking.organizer.image ? (
              <Image src={booking.organizer.image} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent-2 text-white font-bold text-sm">
                {booking.organizer.name?.[0] || "?"}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-ink truncate w-32 md:w-auto">{booking.organizer.name}</h4>
            <p className="text-xs font-medium text-primary">{booking.eventType}</p>
          </div>
        </div>
        <button className="text-ink/40 hover:text-ink"><MoreHorizontal className="w-5 h-5" /></button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-ink/70">
        <div className="flex items-center gap-1.5 bg-sand/30 p-2 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-ink/40" />
          <span className="truncate">{format(new Date(booking.eventDate), "d MMM yyyy", { locale: fr })}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-sand/30 p-2 rounded-lg">
          <MapPin className="w-3.5 h-3.5 text-ink/40" />
          <span className="truncate">{booking.eventLocation}</span>
        </div>
      </div>
      
      {booking.budget && (
        <div className="flex items-center justify-between text-sm border-t border-ink/5 pt-3">
          <span className="text-ink/50">Budget ref.</span>
          <span className="font-bold text-ink">{booking.budget} FCFA</span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        <Link href={`/dashboard/bookings/${booking.id}`} className="flex-1 text-center py-2 bg-sand text-ink text-xs font-semibold rounded-lg hover:bg-ink/10 transition-colors">
          Détails
        </Link>
        <button className="flex-1 text-center py-2 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
          Message
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink">Réservations</h1>
          <p className="text-ink/60 mt-1">Gérez le flux de vos demandes et prestations.</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center bg-white border border-ink/10 rounded-lg p-1 shadow-sm">
          <button 
            onClick={() => setView("kanban")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "kanban" ? "bg-sand text-ink shadow-sm" : "text-ink/50 hover:text-ink"}`}
          >
            <KanbanSquare className="w-4 h-4" /> Board
          </button>
          <button 
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "list" ? "bg-sand text-ink shadow-sm" : "text-ink/50 hover:text-ink"}`}
          >
            <LayoutList className="w-4 h-4" /> Liste
          </button>
        </div>
      </div>

      {initialBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-ink/20 p-12 text-center flex-1 flex flex-col justify-center items-center">
          <Calendar className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-ink mb-1">Aucune réservation</h3>
          <p className="text-ink/60">Vous n'avez pas encore reçu de demande.</p>
        </div>
      ) : view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[600px] overflow-hidden">
          {/* Column 1: PENDING */}
          <div className="bg-sand/30 rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-ink/10">
              <h3 className="font-semibold text-ink flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                Nouvelles demandes
              </h3>
              <span className="bg-ink/5 text-ink/60 text-xs font-bold px-2 py-0.5 rounded-full">{pending.length}</span>
            </div>
            {pending.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>

          {/* Column 2: ACCEPTED/CONFIRMED */}
          <div className="bg-sand/30 rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-ink/10">
              <h3 className="font-semibold text-ink flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                Confirmées (À venir)
              </h3>
              <span className="bg-ink/5 text-ink/60 text-xs font-bold px-2 py-0.5 rounded-full">{accepted.length}</span>
            </div>
            {accepted.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>

          {/* Column 3: COMPLETED */}
          <div className="bg-sand/30 rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between pb-2 border-b border-ink/10">
              <h3 className="font-semibold text-ink flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ink/30"></span>
                Terminées
              </h3>
              <span className="bg-ink/5 text-ink/60 text-xs font-bold px-2 py-0.5 rounded-full">{completed.length}</span>
            </div>
            {completed.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand/50 text-ink/60 font-semibold border-b border-ink/10">
                <tr>
                  <th className="px-6 py-4">Client & Événement</th>
                  <th className="px-6 py-4">Date & Lieu</th>
                  <th className="px-6 py-4">Budget / Prix</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {initialBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-sand/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-2/20 flex items-center justify-center text-accent-600 font-bold text-xs">
                          {booking.organizer.name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-ink">{booking.organizer.name}</p>
                          <p className="text-xs text-ink/60">{booking.eventType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{format(new Date(booking.eventDate), "d MMM yyyy", { locale: fr })}</p>
                      <p className="text-xs text-ink/60 truncate max-w-[150px]">{booking.eventLocation}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-ink">{booking.totalAmount || booking.budget ? `${booking.totalAmount || booking.budget} FCFA` : "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/bookings/${booking.id}`} className="inline-flex items-center justify-center p-2 bg-sand text-ink rounded-lg hover:bg-primary hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
