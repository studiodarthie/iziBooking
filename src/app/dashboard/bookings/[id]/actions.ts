"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
  } catch (err) {
    return { error: "Erreur lors de l'envoi du message" };
  }
}

export async function updateBookingStatus(bookingId: string, status: any, totalAmount?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Non autorisé" };

  const data: any = { status };
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
  } catch (err) {
    return { error: "Erreur lors de la mise à jour" };
  }
}
