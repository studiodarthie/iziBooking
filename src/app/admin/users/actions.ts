"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleUserBan(userId: string, currentlyBanned: boolean, reason?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { success: false, error: "Non autorisé" };

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!admin?.isAdmin) return { success: false, error: "Accès refusé" };
  if (admin.id === userId) return { success: false, error: "Vous ne pouvez pas vous bannir vous-même." };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: currentlyBanned
        ? { isBanned: false, bannedAt: null, banReason: null }
        : { isBanned: true, bannedAt: new Date(), banReason: reason?.trim() || undefined },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Erreur bannissement utilisateur:", error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}
