"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { BookingStatus, Prisma } from "@prisma/client";

export async function sendMessage(bookingId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Non autorisé" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "Utilisateur non trouvé" };

  if (!content.trim()) return { error: "Le message ne peut pas être vide" };

  try {
    await prisma.message.create({
      data: {
        bookingId,
        senderId: user.id,
        content: content.trim()
      }
    });

    revalidatePath(`/dashboard/bookings/${bookingId}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de l'envoi du message" };
  }
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus, totalAmount?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Non autorisé" };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });
  if (!user) return { error: "Non autorisé" };

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return { error: "Réservation introuvable" };

  const isProvider = user.providerProfile?.id === booking.providerProfileId;
  const isOrganizer = user.id === booking.organizerId;
  if (!isProvider && !isOrganizer) return { error: "Non autorisé" };

  const data: Prisma.BookingUpdateInput = { status };
  if (totalAmount !== undefined) {
    data.totalAmount = totalAmount;
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data
    });

    revalidatePath(`/dashboard/bookings/${bookingId}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de la mise à jour" };
  }
}

export async function submitReview(bookingId: string, rating: number, comment?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Non autorisé" };

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "La note doit être comprise entre 1 et 5." };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "Non autorisé" };

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return { error: "Réservation introuvable" };

  if (booking.organizerId !== user.id) return { error: "Non autorisé" };
  if (booking.status !== "COMPLETED") {
    return { error: "Vous ne pouvez laisser un avis qu'après la fin de la prestation." };
  }

  try {
    await prisma.review.create({
      data: {
        bookingId,
        providerProfileId: booking.providerProfileId,
        organizerId: user.id,
        rating,
        comment: comment?.trim() || undefined,
      }
    });

    revalidatePath(`/dashboard/bookings/${bookingId}`);
    revalidatePath(`/p/${booking.providerProfileId}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de l'envoi de l'avis" };
  }
}
