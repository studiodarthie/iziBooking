import Image from "next/image";
import { ChevronRight } from "lucide-react";

type BookingStatus = "Confirmé" | "Demande" | "En négociation" | "Provisoire" | "Terminé" | "Annulé";

export interface BookingListItem {
  id: string;
  clientName: string;
  clientImage?: string;
  clientInitials: string;
  time: string;
  location: string;
  status: BookingStatus;
}

const getStatusStyles = (status: BookingStatus) => {
  switch (status) {
    case "Confirmé":
    case "Terminé":
      return "border-success text-success bg-success/5";
    case "Demande":
      return "border-ink/20 text-ink/70 bg-ink/5";
    case "En négociation":
      return "border-blue-500 text-blue-600 bg-blue-500/5"; // Keep a distinct blue for negotiation
    case "Provisoire":
      return "border-accent-500 text-accent-600 bg-accent-500/5"; // Orange-ish from brand
    case "Annulé":
      return "border-red-500 text-red-600 bg-red-500/5";
    default:
      return "border-ink/20 text-ink/70";
  }
};

const getAvatarColor = (initials: string) => {
  const colors = [
    "bg-accent-2", "bg-primary", "bg-trust", 
    "bg-accent-300", "bg-neutral-600", "bg-accent-500"
  ];
  // Simple hash to pick a color based on initials
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

export function BookingList({ bookings }: { bookings: BookingListItem[] }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-lg font-heading font-semibold text-ink flex items-center gap-2">
          <span className="text-accent">♪</span> Toutes les réservations
        </h2>
        <button className="text-sm font-medium text-ink/60 hover:text-primary transition-colors flex items-center gap-1">
          Tout voir <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between group hover:bg-sand/30 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(booking.clientInitials)} overflow-hidden`}>
                  {booking.clientImage ? (
                    <Image src={booking.clientImage} alt={booking.clientName} fill className="object-cover" />
                  ) : (
                    booking.clientInitials
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink">{booking.clientName}</h4>
                  <p className="text-xs text-ink/60 flex items-center gap-1.5 mt-0.5">
                    <span className="text-ink/30">⊙</span> {booking.time} · {booking.location}
                  </p>
                </div>
              </div>

              <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1.5 ${getStatusStyles(booking.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {booking.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-ink/10 text-center bg-sand/10">
        <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
          Voir les {bookings.length} réservations <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
