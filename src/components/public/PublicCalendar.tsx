"use client";

import { useState } from "react";
import { 
  startOfMonth, endOfMonth, eachDayOfInterval, format, 
  addMonths, subMonths, isSameDay, isToday, startOfDay 
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

type BlockedDateType = { id: string, date: Date };

export function PublicCalendar({
  blockedDates
}: {
  blockedDates: BlockedDateType[];
}) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(startOfMonth(new Date()));

  // We want to show 3 months at a time starting from `currentMonth`
  const monthsToShow = [
    currentMonth,
    addMonths(currentMonth, 1),
    addMonths(currentMonth, 2),
  ];

  return (
    <div className="flex flex-col w-full gap-8 relative">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-heading font-bold text-ink">
            Vue Trimestrielle
          </h3>
        </div>
        
        <div className="flex items-center gap-2 border border-ink/10 rounded-lg p-1 bg-sand/30">
          <button 
            onClick={handlePreviousMonth}
            className="p-1.5 hover:bg-white rounded-md transition-colors hover:shadow-sm"
          >
            <ChevronLeft size={20} className="text-ink/70" />
          </button>
          <button 
            onClick={handleToday}
            className="px-4 py-1.5 text-sm font-medium hover:bg-white rounded-md transition-colors text-ink/70 hover:shadow-sm"
          >
            Aujourd’hui
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-white rounded-md transition-colors hover:shadow-sm"
          >
            <ChevronRight size={20} className="text-ink/70" />
          </button>
        </div>
      </div>

      {/* Months List */}
      <div className="flex flex-col gap-6">
        {monthsToShow.map((monthDate) => {
          const monthStart = startOfMonth(monthDate);
          const monthEnd = endOfMonth(monthStart);
          const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

          return (
            <div key={monthDate.toString()} className="bg-white rounded-xl border border-ink/10 shadow-sm overflow-hidden flex flex-col min-w-0">
              
              {/* Month Header */}
              <div className="bg-sand/30 border-b border-ink/10 px-4 py-3 sticky left-0">
                <h3 className="text-sm font-semibold capitalize text-ink">
                  {format(monthDate, "MMMM yyyy", { locale: fr })}
                </h3>
              </div>
              
              {/* Timeline Grid (Horizontal Scroll) */}
              <div className="flex overflow-x-auto custom-scrollbar">
                <div className="flex min-w-max p-2 gap-1.5">
                  {days.map((day) => {
                    const isTodayDate = isToday(day);
                    const dayStart = startOfDay(day);
                    
                    const isBlocked = blockedDates.some(d => isSameDay(d.date, dayStart));
                    const isPast = dayStart < startOfDay(new Date());

                    // Déterminer le style de la cellule (lecture seule)
                    let cellClasses = "border border-ink/5 bg-white text-ink opacity-90 cursor-default";
                    if (isPast) {
                       cellClasses = "bg-ink/5 border-ink/10 text-ink/40 cursor-not-allowed";
                    } else if (isBlocked) {
                      cellClasses = "bg-red-50 border-red-200 text-red-900 cursor-not-allowed";
                    } else if (isTodayDate) {
                      cellClasses = "border-primary/50 bg-primary/5 text-primary font-semibold ring-1 ring-primary/20";
                    }

                    return (
                      <div 
                        key={day.toString()} 
                        className={`
                          flex flex-col items-center justify-center w-[72px] h-[84px] rounded-lg transition-all
                          ${cellClasses}
                        `}
                      >
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-60 mb-1">
                          {format(day, "EEE", { locale: fr })}
                        </span>
                        <span className={`text-xl font-bold ${isTodayDate && !isBlocked ? "text-primary" : ""}`}>
                          {format(day, "d")}
                        </span>
                        
                        {/* Indicateurs (pastilles) */}
                        <div className="flex gap-1 mt-2 h-1.5">
                           {!isPast && isBlocked && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Styles personnalisés pour la scrollbar horizontale */}
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
