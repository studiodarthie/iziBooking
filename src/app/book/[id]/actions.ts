"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getUnavailableDates(providerProfileId: string) {
  const [blockedDates, bookings] = await Promise.all([
    prisma.blockedDate.findMany({
      where: { providerProfileId },
      select: { date: true }
    }),
    prisma.booking.findMany({
      where: {
        providerProfileId,
        status: { in: ["ACCEPTED", "DEPOSIT_PAID", "CONFIRMED", "COMPLETED"] }
      },
      select: { eventDate: true }
    })
  ]);

  const dates = [...blockedDates.map(b => b.date), ...bookings.map(b => b.eventDate)];
  return dates.map(d => d.toISOString().split("T")[0]);
}

export async function submitBooking(data: {
  providerProfileId: string;
  eventDate: Date;
  eventType: string;
  eventLocation: string;
  clientWhatsApp?: string;
  budget?: number;
  details?: string;
  serviceId?: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "Vous devez être connecté pour envoyer une demande." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return { success: false, error: "Utilisateur introuvable." };
  }

  const dayStart = new Date(data.eventDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const [blockedDate, conflictingBooking] = await Promise.all([
    prisma.blockedDate.findFirst({
      where: { providerProfileId: data.providerProfileId, date: dayStart }
    }),
    prisma.booking.findFirst({
      where: {
        providerProfileId: data.providerProfileId,
        status: { in: ["ACCEPTED", "DEPOSIT_PAID", "CONFIRMED", "COMPLETED"] },
        eventDate: { gte: dayStart, lt: dayEnd }
      }
    })
  ]);

  if (blockedDate || conflictingBooking) {
    return { success: false, error: "Cette date n'est plus disponible pour ce prestataire. Merci d'en choisir une autre." };
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        organizerId: user.id,
        providerProfileId: data.providerProfileId,
        eventDate: data.eventDate,
        eventType: data.eventType,
        eventLocation: data.eventLocation,
        clientWhatsApp: data.clientWhatsApp,
        budget: data.budget,
        details: data.details,
        serviceId: data.serviceId,
        status: "PENDING"
      }
    });

    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Erreur lors de la soumission de la demande." };
  }
}
