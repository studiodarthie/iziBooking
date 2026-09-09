"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function submitBooking(data: {
  providerProfileId: string;
  eventDate: Date;
  eventType: string;
  eventLocation: string;
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

  try {
    const booking = await prisma.booking.create({
      data: {
        organizerId: user.id,
        providerProfileId: data.providerProfileId,
        eventDate: data.eventDate,
        eventType: data.eventType,
        eventLocation: data.eventLocation,
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
