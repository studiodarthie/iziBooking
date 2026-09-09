"use client";

import { useState } from "react";
import { 
  startOfMonth, endOfMonth, eachDayOfInterval, format, 
  addMonths, subMonths, isSameDay, isToday, startOfDay,
  startOfWeek, endOfWeek, isSameMonth
} from "date-fns";
import { fr } from "date-fns/locale";
import { toggleBlockedDate } from "@/app/dashboard/calendar/actions";
import { 
  Loader2, ChevronLeft, ChevronRight, 
  Calendar as CalendarIcon, Users, 
  List, LayoutGrid, CalendarDays, Clock,
  Filter
} from "lucide-react";

type BlockedDateType = { id: string, date: string };
type BookingType = { id: string, date: string, title: string };

export default function AvailabilityCalendar({
  initialBlockedDates,
  initialBookings
}: {
  initialBlockedDates: BlockedDateType[];
  initialBookings: BookingType[];
}) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [blockedDates, setBlockedDates] = useState<Date[]>(
    initialBlockedDates.map(bd => startOfDay(new Date(bd.date)))
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const bookings = initialBookings.map(b => ({
    ...b,
    dateObj: startOfDay(new Date(b.date))
  }));

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(startOfMonth(new Date()));

  const handleDayClick = async (day: Date) => {
    const dayStart = startOfDay(day);
    
    const isBooked = bookings.some(b => isSameDay(b.dateObj, dayStart));
    if (isBooked) {
      alert("Cette date correspond à une réservation confirmée.");
      return;
    }

    const isBlocked = blockedDates.some(d => isSameDay(d, dayStart));
    setIsUpdating(true);

    try {
      if (isBlocked) {
        setBlockedDates(prev => prev.filter(d => !isSameDay(d, dayStart)));
      } else {
        setBlockedDates(prev => [...prev, dayStart]);
      }

      const dateStr = new Date(dayStart.getTime() - (dayStart.getTimezoneOffset() * 60000)).toISOString().split('T')[0] + 'T00:00:00.000Z';
      const res = await toggleBlockedDate(dateStr);
      
      if (!res.success) {
        alert(res.error || "Une erreur est survenue");
        if (isBlocked) {
          setBlockedDates(prev => [...prev, dayStart]);
        } else {
          setBlockedDates(prev => prev.filter(d => !isSameDay(d, dayStart)));
        }
      }
    } catch (e) {
      console.error(e);
      alert("Une erreur inattendue s'est produite.");
    } finally {
      setIsUpdating(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Dimanche (Sunday)
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  return (
    <div className="flex flex-col w-full gap-4 relative">
      
      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-50 rounded-xl">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      )}

      {/* Top Filters Bar */}
      <div className="bg-white p-2 rounded-xl border border-ink/10 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 border-r border-ink/10 pr-3">
          <Filter className="w-4 h-4 text-ink/40 ml-2" />
          <select className="px-2 py-1.5 bg-white text-sm font-medium text-ink/70 outline-none hover:text-ink cursor-pointer">
            <option>Tous les Services</option>
          </select>
        </div>
        
        <select className="px-2 py-1.5 bg-white text-sm font-medium text-ink/70 outline-none hover:text-ink cursor-pointer border-r border-ink/10 pr-3">
          <option>Tout le personnel</option>
        </select>
        
        <select className="px-2 py-1.5 bg-white text-sm font-medium text-ink/70 outline-none hover:text-ink cursor-pointer">
          <option>Tous les Clients</option>
        </select>

        <div className="flex items-center gap-2 border border-ink/10 rounded-lg p-1 ml-auto bg-sand/30">
          <button onClick={handlePreviousMonth} className="p-1 hover:bg-white rounded-md transition-colors"><ChevronLeft size={16} /></button>
          <span className="text-sm font-medium px-2 min-w-[140px] text-center capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: fr })}
          </span>
          <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded-md transition-colors"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* View Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-ink/10 rounded-lg p-1 shadow-sm gap-1">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-md">
              <CalendarDays size={16} /> Mois
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-ink/70 hover:bg-ink/5 rounded-md transition-colors">
              <LayoutGrid size={16} /> Semaine
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-ink/70 hover:bg-ink/5 rounded-md transition-colors">
              <Clock size={16} /> Jour
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-ink/70 hover:bg-ink/5 rounded-md transition-colors">
              <List size={16} /> Liste
            </button>
          </div>
          
          <button onClick={handleToday} className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
            Aujourd'hui
          </button>
        </div>

        <div className="text-sm text-ink/60 bg-white border border-ink/10 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
          <Users size={16} className="text-primary" /> 
          <span className="font-medium text-ink">{bookings.length} rendez-vous au total</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-ink/10 shadow-sm overflow-hidden flex flex-col mt-2">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-sand/20 border-b border-ink/10">
          {weekDays.map(day => (
            <div key={day} className="py-4 text-center text-sm font-bold text-ink">
              {day}
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {days.map((day, idx) => {
            const isTodayDate = isToday(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const dayStart = startOfDay(day);
            
            const isBlocked = blockedDates.some(d => isSameDay(d, dayStart));
            const dayBookings = bookings.filter(b => isSameDay(b.dateObj, dayStart));
            const hasBooking = dayBookings.length > 0;

            let cellClasses = "border-b border-r border-ink/10 p-2 transition-colors cursor-pointer ";
            
            if (!isCurrentMonth) {
              cellClasses += "bg-sand/10 text-ink/40 ";
            } else {
              cellClasses += "bg-white text-ink hover:bg-ink/5 ";
            }

            // Remove right border for last column, bottom border for last row
            if ((idx + 1) % 7 === 0) cellClasses = cellClasses.replace("border-r ", "");
            if (idx >= days.length - 7) cellClasses = cellClasses.replace("border-b ", "");

            if (hasBooking) {
              cellClasses += "!bg-trust/5 ";
            } else if (isBlocked) {
              cellClasses += "!bg-accent-700/5 ";
            }

            return (
              <div 
                key={day.toString()} 
                onClick={() => handleDayClick(day)}
                className={cellClasses + " flex flex-col"}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                    ${isTodayDate ? "bg-primary text-white" : ""}
                  `}>
                    {format(day, "d")}
                  </span>
                  
                  {/* Indicators for blocked/booked */}
                  <div className="flex gap-1 mt-1">
                    {hasBooking && (
                      <span className="w-2 h-2 rounded-full bg-trust" title={dayBookings.map(b => b.title).join(", ")}></span>
                    )}
                    {isBlocked && (
                      <span className="w-2 h-2 rounded-full bg-accent-700"></span>
                    )}
                  </div>
                </div>

                {/* Optional: Show booking names if space allows */}
                <div className="mt-2 flex-1 overflow-hidden flex flex-col gap-1">
                  {dayBookings.slice(0, 2).map((b, i) => (
                    <div key={i} className="text-[10px] font-medium bg-trust/20 text-trust px-1.5 py-0.5 rounded truncate">
                      {b.title}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-[10px] text-ink/50 font-medium px-1">
                      +{dayBookings.length - 2} plus
                    </div>
                  )}
                  {isBlocked && !hasBooking && (
                    <div className="text-[10px] font-medium bg-accent-700/20 text-accent-800 px-1.5 py-0.5 rounded truncate">
                      Bloqué
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-6 rounded-xl border border-ink/10 shadow-sm w-full mt-4">
        <h3 className="text-sm font-heading font-semibold text-ink mb-4 uppercase tracking-wider opacity-60">Légende</h3>
        <ul className="flex flex-wrap gap-8 text-sm text-ink/80">
          <li className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-ink/20 flex items-center justify-center bg-white"></div>
            <span>Date libre</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-accent-700/5 border border-ink/10 flex flex-col items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-accent-700"></span>
            </div>
            <span>Date bloquée (indisponible)</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-trust/5 border border-ink/10 flex flex-col items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-trust"></span>
            </div>
            <span>Réservation confirmée</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-primary/20 flex flex-col items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"></span>
            </div>
            <span>Aujourd'hui</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
