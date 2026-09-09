import Image from "next/image";
import { ChevronRight } from "lucide-react";

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  status: "Confirmé" | "Demande" | "En négociation";
  image?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmé":
      return "border-success text-success bg-success/5";
    case "Demande":
      return "border-ink/20 text-ink/70 bg-ink/5";
    case "En négociation":
      return "border-blue-500 text-blue-600 bg-blue-500/5";
    default:
      return "border-ink/20 text-ink/70";
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case "Confirmé":
      return "bg-success";
    case "Demande":
      return "bg-ink/30";
    case "En négociation":
      return "bg-blue-500";
    default:
      return "bg-ink/30";
  }
};

export function TimelineWidget({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-lg font-heading font-semibold text-ink flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent"></span> Programme du jour
          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-xs font-medium text-accent-dark">
            {events.length}
          </span>
        </h2>
        <button className="text-sm font-medium text-ink/60 hover:text-primary transition-colors flex items-center gap-1">
          Tout voir <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-6 pt-2">
        <div className="relative border-l border-ink/10 ml-16 space-y-6">
          {events.map((event, index) => (
            <div key={event.id} className="relative pl-6">
              {/* Timeline dot */}
              <div className={`absolute -left-1.5 top-2 w-3 h-3 rounded-full ${getStatusDot(event.status)} ring-4 ring-white`}></div>
              
              {/* Time */}
              <div className="absolute -left-16 top-1 text-xs font-medium text-ink/50 w-10 text-right">
                {event.time}
              </div>

              {/* Card */}
              <div className="bg-sand/30 border border-ink/5 rounded-xl p-4 flex items-center justify-between hover:bg-sand/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border border-ink/10">
                    {event.image ? (
                      <Image src={event.image} alt={event.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent-dark text-xs font-bold bg-accent/10">
                        {event.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">{event.title}</h4>
                    <p className="text-xs text-ink/50 flex items-center gap-1 mt-1">
                      <span className="text-ink/30">📍</span> {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`px-2.5 py-1 rounded-full border text-[10px] font-medium flex items-center gap-1 ${getStatusColor(event.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {event.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
