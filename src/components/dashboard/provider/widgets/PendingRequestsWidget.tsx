import Image from "next/image";
import { ChevronRight, Check, X, MessageSquare } from "lucide-react";
import Link from "next/link";

export interface PendingRequest {
  id: string;
  clientName: string;
  clientInitials: string;
  clientImage?: string;
  date: string;
  time: string;
  location: string;
  eventType: string;
  budget?: string;
}

export function PendingRequestsWidget({ requests }: { requests: PendingRequest[] }) {
  const getAvatarColor = (initials: string) => {
    const colors = [
      "bg-accent-2", "bg-primary", "bg-trust", 
      "bg-accent-300", "bg-neutral-600", "bg-accent-500"
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-lg font-heading font-semibold text-ink flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span> 
          Demandes entrantes
          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-warning/20 text-xs font-medium text-warning">
            {requests.length}
          </span>
        </h2>
        <Link href="/dashboard/bookings" className="text-sm font-medium text-ink/60 hover:text-primary transition-colors flex items-center gap-1">
          Gérer <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {requests.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-ink/40 text-sm py-8">
            <p>Aucune demande en attente.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((req) => (
              <div key={req.id} className="group bg-sand/30 border border-ink/5 rounded-xl p-4 transition-colors hover:bg-sand/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(req.clientInitials)} overflow-hidden shadow-sm`}>
                      {req.clientImage ? (
                        <Image src={req.clientImage} alt={req.clientName} fill className="object-cover" />
                      ) : (
                        req.clientInitials
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-ink">{req.clientName}</h4>
                      <p className="text-xs font-medium text-primary mt-0.5">{req.eventType}</p>
                    </div>
                  </div>
                  {req.budget && (
                    <div className="text-right">
                      <span className="text-xs text-ink/50 uppercase font-semibold">Budget ref.</span>
                      <p className="text-sm font-bold text-ink">{req.budget}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink/70">
                  <div className="flex items-center gap-1.5">
                    <span className="text-ink/30">📅</span> {req.date} à {req.time}
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-ink/30">📍</span> {req.location}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button className="flex items-center justify-center gap-1 py-2 px-2 bg-success/10 text-success hover:bg-success hover:text-white rounded-lg text-xs font-semibold transition-colors">
                    <Check className="w-3.5 h-3.5" /> Accepter
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2 px-2 bg-ink/5 text-ink/70 hover:bg-ink hover:text-white rounded-lg text-xs font-semibold transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" /> Message
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2 px-2 bg-error/10 text-error hover:bg-error hover:text-white rounded-lg text-xs font-semibold transition-colors">
                    <X className="w-3.5 h-3.5" /> Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
