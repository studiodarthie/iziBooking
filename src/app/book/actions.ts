"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createBooking(providerProfileId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, error: "Non autorisé." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return { success: false, error: "Utilisateur non trouvé." };
  }

  const eventDate = formData.get("eventDate") as string;
  const eventType = formData.get("eventType") as string;
  const eventLocation = formData.get("eventLocation") as string;
  const details = formData.get("details") as string;
  const clientWhatsApp = formData.get("clientWhatsApp") as string;

  if (!eventDate || !eventType || !eventLocation) {
    return { success: false, error: "Veuillez remplir tous les champs obligatoires." };
  }

  try {
    await prisma.booking.create({
      data: {
        organizerId: user.id,
        providerProfileId,
        eventDate: new Date(eventDate),
        eventType,
        eventLocation,
        details,
        clientWhatsApp,
        status: "PENDING",
      }
    });
  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, error: "Une erreur est survenue lors de la réservation." };
  }
  
  // If successful, we redirect. We must do this outside try-catch because redirect throws an error internally in Next.js
  redirect("/dashboard/bookings");
}
