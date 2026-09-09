import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AvailabilityCalendar from "@/components/dashboard/AvailabilityCalendar";
import ScheduleSettingsClient from "./ScheduleSettingsClient";
import { Calendar, Settings } from "lucide-react";

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    redirect("/dashboard");
  }

  const profileId = user.providerProfile.id;

  // Fetch blocked dates
  const blockedDates = await prisma.blockedDate.findMany({
    where: { providerProfileId: profileId },
    select: { date: true, id: true }
  });

  // Fetch upcoming accepted/confirmed bookings
  const bookings = await prisma.booking.findMany({
    where: { 
      providerProfileId: user.providerProfile.id,
      status: { in: ["ACCEPTED", "CONFIRMED", "DEPOSIT_PAID"] }
    },
    select: { eventDate: true, eventType: true, id: true }
  });

  // Fetch Schedule Settings
  const scheduleSetting = await prisma.scheduleSetting.findUnique({
    where: { providerProfileId: user.providerProfile.id },
    include: { workingHours: true }
  });

  const parsedBlockedDates = blockedDates.map(bd => ({
    id: bd.id,
    date: bd.date.toISOString(),
  }));

  const parsedBookings = bookings.map(b => ({
    id: b.id,
    date: b.eventDate.toISOString(),
    title: b.eventType
  }));

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink">Calendrier & Disponibilités</h1>
          <p className="mt-1 text-ink/60">
            Gérez vos horaires de travail et vos jours d'indisponibilité pour contrôler quand vous pouvez être réservé.
          </p>
        </div>
        
        <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap">
          + Nouveau Rendez-vous
        </button>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-[600px]">
        {/* Left Column: Calendar (Blocks specific dates) */}
        <div className="xl:w-2/3 flex flex-col bg-sand/20 rounded-2xl p-6 border border-ink/10">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-ink">Jours spécifiques</h2>
          </div>
          <p className="text-sm text-ink/60 mb-6">
            Bloquez des dates ponctuelles (vacances, autres engagements) pour ne pas recevoir de demandes ces jours-là.
          </p>
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-ink/5">
            <AvailabilityCalendar 
              initialBlockedDates={parsedBlockedDates} 
              initialBookings={parsedBookings} 
            />
          </div>
        </div>

        {/* Right Column: Schedule Settings (Working Hours & Rules) */}
        <div className="xl:w-1/3 flex flex-col">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Settings className="w-5 h-5 text-ink/70" />
            <h2 className="text-xl font-bold text-ink">Paramètres récurrents</h2>
          </div>
          <ScheduleSettingsClient initialSchedule={scheduleSetting} />
        </div>
      </div>
    </div>
  );
}
