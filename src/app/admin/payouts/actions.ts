"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markPayoutPaid(paymentId: string, note?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { success: false, error: "Non autorisé" };

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!admin?.isAdmin) return { success: false, error: "Accès refusé" };

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.payoutStatus !== "PENDING") {
    return { success: false, error: "Ce paiement n'est pas (ou plus) en attente de reversement." };
  }

  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { payoutStatus: "PAID", payoutAt: new Date(), payoutNote: note?.trim() || undefined },
    });

    revalidatePath("/admin/payouts");
    return { success: true };
  } catch (error) {
    console.error("Erreur marquage reversement:", error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}
