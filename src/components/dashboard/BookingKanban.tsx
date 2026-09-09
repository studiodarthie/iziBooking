"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, MapPin, User, Check, X, MoreHorizontal } from "lucide-react";
import { updateBookingStatus } from "@/app/dashboard/bookings/actions";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  status: string;
  eventDate: Date;
  eventType: string;
  eventLocation: string;
  budget: number | null;
  totalAmount: number | null;
  organizer: {
    name: string | null;
    image: string | null;
  };
};

export function BookingKanban({ initialBookings }: { initialBookings: Booking[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Group bookings
  const pendingBookings = initialBookings.filter(b => b.status === "PENDING");
  const confirmedBookings = initialBookings.filter(b => ["ACCEPTED", "DEPOSIT_PAID", "CONFIRMED"].includes(b.status));
  const completedBookings = initialBookings.filter(b => b.status === "COMPLETED");
  const cancelledBookings = initialBookings.filter(b => b.status === "CANCELLED");

  const handleAction = async (id: string, status: any, totalAmount?: number) => {
    setLoadingId(id);
    const res = await updateBookingStatus(id, status, totalAmount);
    setLoadingId(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  const promptAccept = (id: string) => {
    const amount = prompt("Veuillez saisir le prix total proposé pour ce devis (en FCFA) :");
    if (amount && !isNaN(Number(amount))) {
      handleAction(id, "ACCEPTED", Number(amount));
    }
  };

  const renderCard = (booking: Booking, columnType: string) => (
    <div key={booking.id} className="bg-white border border-ink/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center overflow-hidden">
            {booking.organizer.image ? (
              <img src={booking.organizer.image} alt={booking.organizer.name || "Client"} className="w-full h-full object-cover" />
            ) : (
              <User size={14} className="text-ink/40" />
            )}
          </div>
          <span className="font-semibold text-sm text-ink truncate max-w-[120px]">
            {booking.organizer.name || "Client anonyme"}
          </span>
        </div>
        <button className="text-ink/40 hover:text-primary">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <h4 className="font-bold text-ink mb-2">{booking.eventType}</h4>
      
      <div className="space-y-1.5 mb-4 text-xs font-medium text-ink/70">
        <div className="flex items-center gap-1.5">
          <CalendarIcon size={14} className="text-primary" />
          {format(new Date(booking.eventDate), "d MMMM yyyy", { locale: fr })}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-ink/40" />
          <span className="truncate">{booking.eventLocation}</span>
        </div>
      </div>

      <div className="flex justify-between items-end border-t border-ink/5 pt-3">
        <div>
          <span className="block text-[10px] uppercase font-bold text-ink/40 tracking-wider mb-0.5">
            {booking.totalAmount ? "Prix fixé" : "Budget client"}
          </span>
          <span className="font-bold text-ink">
            {booking.totalAmount ? booking.totalAmount.toLocaleString() : (booking.budget ? booking.budget.toLocaleString() : "À définir")} FCFA
          </span>
        </div>
      </div>

      {/* Actions (Only in PENDING or ACCEPTED states usually, simplified for UI) */}
      {columnType === "PENDING" && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-ink/5">
          <button 
            disabled={loadingId === booking.id}
            onClick={() => handleAction(booking.id, "CANCELLED")}
            className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
          >
            Refuser
          </button>
          <button 
            disabled={loadingId === booking.id}
            onClick={() => promptAccept(booking.id)}
            className="flex-1 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
          >
            Faire un devis
          </button>
        </div>
      )}
      {columnType === "CONFIRMED" && booking.status === "ACCEPTED" && (
        <div className="mt-4 pt-3 border-t border-ink/5">
          <div className="text-xs text-center text-ink/50 italic mb-2">En attente de paiement</div>
          <button 
            disabled={loadingId === booking.id}
            onClick={() => handleAction(booking.id, "COMPLETED")}
            className="w-full py-1.5 text-xs font-semibold text-ink bg-sand hover:bg-sand/80 rounded-md transition-colors disabled:opacity-50"
          >
            Marquer comme terminé
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-6 flex-1 items-start min-h-[500px]">
      
      {/* Column: En Attente */}
      <div className="w-80 shrink-0 flex flex-col bg-sand/30 rounded-2xl p-4 border border-ink/5 h-full">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-ink">Nouvelles Demandes</h3>
          <span className="bg-ink/10 text-ink text-xs font-bold px-2 py-0.5 rounded-full">
            {pendingBookings.length}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {pendingBookings.map(b => renderCard(b, "PENDING"))}
          {pendingBookings.length === 0 && (
            <div className="text-center p-6 text-ink/40 text-sm border border-dashed border-ink/10 rounded-xl">
              Aucune demande
            </div>
          )}
        </div>
      </div>

      {/* Column: Confirmée */}
      <div className="w-80 shrink-0 flex flex-col bg-primary/5 rounded-2xl p-4 border border-primary/10 h-full">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-primary">Confirmées & Acceptées</h3>
          <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
            {confirmedBookings.length}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {confirmedBookings.map(b => renderCard(b, "CONFIRMED"))}
          {confirmedBookings.length === 0 && (
            <div className="text-center p-6 text-ink/40 text-sm border border-dashed border-primary/20 rounded-xl">
              Aucune réservation confirmée
            </div>
          )}
        </div>
      </div>

      {/* Column: Terminée */}
      <div className="w-80 shrink-0 flex flex-col bg-sand/30 rounded-2xl p-4 border border-ink/5 h-full">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-ink">Terminées</h3>
          <span className="bg-ink/10 text-ink text-xs font-bold px-2 py-0.5 rounded-full">
            {completedBookings.length}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {completedBookings.map(b => renderCard(b, "COMPLETED"))}
        </div>
      </div>

      {/* Column: Annulée */}
      <div className="w-80 shrink-0 flex flex-col bg-sand/30 rounded-2xl p-4 border border-ink/5 h-full opacity-70">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-ink/60">Annulées</h3>
          <span className="bg-ink/10 text-ink/60 text-xs font-bold px-2 py-0.5 rounded-full">
            {cancelledBookings.length}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {cancelledBookings.map(b => renderCard(b, "CANCELLED"))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
      `}} />
    </div>
  );
}
