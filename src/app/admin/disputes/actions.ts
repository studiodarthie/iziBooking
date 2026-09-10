"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function resolveDispute(disputeId: string, resolutionNote?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { success: false, error: "Non autorisé" };

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!admin?.isAdmin) return { success: false, error: "Accès refusé" };

  try {
    await prisma.dispute.update({
      where: { id: disputeId },
      data: { status: "RESOLVED", resolvedAt: new Date(), resolutionNote: resolutionNote?.trim() || undefined },
    });

    revalidatePath("/admin/disputes");
    return { success: true };
  } catch (error) {
    console.error("Erreur résolution litige:", error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}
