"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { BookingStatus, Prisma } from "@prisma/client";

export async function updateBookingStatus(id: string, status: BookingStatus, totalAmount?: number) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "Vous devez être connecté." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    return { success: false, error: "Profil non autorisé." };
  }

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.providerProfileId !== user.providerProfile.id) {
      return { success: false, error: "Réservation introuvable ou non autorisée." };
    }

    const dataToUpdate: Prisma.BookingUpdateInput = { status };
    if (totalAmount !== undefined) {
      dataToUpdate.totalAmount = totalAmount;
    }

    await prisma.booking.update({
      where: { id },
      data: dataToUpdate
    });

    revalidatePath("/dashboard/bookings");
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}
