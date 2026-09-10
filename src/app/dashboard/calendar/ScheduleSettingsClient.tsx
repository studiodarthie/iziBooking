"use client";

import { useState } from "react";
import { Clock, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { updateScheduleSettings } from "./actions";
import { useRouter } from "next/navigation";
import type { Prisma } from "@prisma/client";

type ScheduleSettingWithHours = Prisma.ScheduleSettingGetPayload<{
  include: { workingHours: true };
}>;

export default function ScheduleSettingsClient({
  initialSchedule
}: {
  initialSchedule?: ScheduleSettingWithHours | null
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"hours" | "rules">("hours");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultDays = [
    { id: 1, name: "Lundi" },
    { id: 2, name: "Mardi" },
    { id: 3, name: "Mercredi" },
    { id: 4, name: "Jeudi" },
    { id: 5, name: "Vendredi" },
    { id: 6, name: "Samedi" },
    { id: 0, name: "Dimanche" },
  ];

  const initializeWorkingHours = () => {
    if (initialSchedule?.workingHours && initialSchedule.workingHours.length > 0) {
      return defaultDays.map(day => {
        const existing = initialSchedule.workingHours.find((wh) => wh.dayOfWeek === day.id);
        if (existing) {
          return { dayOfWeek: day.id, startTime: existing.startTime, endTime: existing.endTime, isActive: true };
        }
        return { dayOfWeek: day.id, startTime: "10:00", endTime: "18:00", isActive: false };
      });
    }
    // Defaults if nothing in DB
    return defaultDays.map(day => ({
      dayOfWeek: day.id,
      startTime: "10:00",
      endTime: "18:00",
      isActive: day.id !== 0 // Sunday off by default
    }));
  };

  const [workingHours, setWorkingHours] = useState(initializeWorkingHours());
  const [leadTimeHours, setLeadTimeHours] = useState(initialSchedule?.leadTimeHours || 48);
  const [bookingHorizon, setBookingHorizon] = useState(initialSchedule?.bookingHorizon || 180);
  const [timezone, setTimezone] = useState(initialSchedule?.timezone || "Africa/Douala");

  const handleWorkingHourChange = (dayId: number, field: "startTime" | "endTime" | "isActive", value: string | boolean) => {
    setWorkingHours(prev => prev.map(wh => 
      wh.dayOfWeek === dayId ? { ...wh, [field]: value } : wh
    ));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await updateScheduleSettings({
      timezone,
      leadTimeHours: Number(leadTimeHours),
      bookingHorizon: Number(bookingHorizon),
      workingHours
    });

    setLoading(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } else {
      alert(res.error || "Une erreur est survenue");
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex border-b border-ink/10 mb-6">
        <button 
          onClick={() => setActiveTab("hours")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === "hours" ? "border-primary text-primary" : "border-transparent text-ink/60 hover:text-ink"}`}
        >
          <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Horaires de travail</span>
        </button>
        <button 
          onClick={() => setActiveTab("rules")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === "rules" ? "border-primary text-primary" : "border-transparent text-ink/60 hover:text-ink"}`}
        >
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Règles de réservation</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-2 flex flex-col">
        {activeTab === "hours" && (
          <div className="space-y-4">
            <p className="text-sm text-ink/60 mb-6">
              Définissez vos horaires par défaut. Ces horaires détermineront les créneaux où les clients peuvent demander à vous réserver.
            </p>
            
            {defaultDays.map(day => {
              const wh = workingHours.find(w => w.dayOfWeek === day.id)!;
              return (
                <div key={day.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-sand/30 transition-colors">
                  <div className="flex items-center gap-3 w-1/3">
                    <input 
                      type="checkbox" 
                      checked={wh.isActive} 
                      onChange={(e) => handleWorkingHourChange(day.id, 'isActive', e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/20" 
                    />
                    <span className="font-medium text-ink">{day.name}</span>
                  </div>
                  
                  <div className={`flex items-center gap-3 w-2/3 justify-end transition-opacity ${wh.isActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                    <select 
                      value={wh.startTime}
                      onChange={(e) => handleWorkingHourChange(day.id, 'startTime', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-ink/10 bg-white text-sm outline-none focus:border-primary"
                    >
                      <option value="08:00">08:00</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="18:00">18:00</option>
                      <option value="20:00">20:00</option>
                    </select>
                    <span className="text-ink/40">à</span>
                    <select 
                      value={wh.endTime}
                      onChange={(e) => handleWorkingHourChange(day.id, 'endTime', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-ink/10 bg-white text-sm outline-none focus:border-primary"
                    >
                      <option value="12:00">12:00</option>
                      <option value="14:00">14:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                      <option value="22:00">22:00</option>
                      <option value="23:59">23:59</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "rules" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Délai minimum avant réservation</label>
              <p className="text-xs text-ink/50 mb-3">Combien de temps à l’avance un client doit-il faire sa demande ?</p>
              <select 
                value={leadTimeHours}
                onChange={(e) => setLeadTimeHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value={24}>24 heures</option>
                <option value={48}>48 heures</option>
                <option value={72}>72 heures</option>
                <option value={168}>1 semaine</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Horizon de réservation</label>
              <p className="text-xs text-ink/50 mb-3">Jusqu’à combien de temps à l’avance acceptez-vous des réservations ?</p>
              <select 
                value={bookingHorizon}
                onChange={(e) => setBookingHorizon(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value={90}>3 mois</option>
                <option value={180}>6 mois</option>
                <option value={365}>1 an</option>
                <option value={9999}>Pas de limite</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Fuseau horaire de référence</label>
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-ink/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="Africa/Douala">Afrique/Douala (WAT)</option>
                <option value="Europe/Paris">Europe/Paris (CET)</option>
                <option value="Africa/Abidjan">Afrique/Abidjan (GMT)</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-auto pt-6 flex items-center justify-between">
          {saved ? (
            <span className="flex items-center gap-2 text-success font-semibold text-sm animate-pulse">
              <CheckCircle2 className="w-5 h-5" /> Enregistré
            </span>
          ) : (
            <span className="text-xs text-ink/40">N’oubliez pas d’enregistrer vos modifications.</span>
          )}
          <button 
            type="submit"
            disabled={loading}
            className="bg-ink hover:bg-ink/90 disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" /> {loading ? "..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
