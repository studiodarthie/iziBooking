"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleProviderVerification(providerId: string, currentStatus: boolean) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Non autorisé" };
    }

    // Vérifier si l'utilisateur est vraiment ADMIN
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return { success: false, error: "Accès refusé" };
    }

    // Mettre à jour le statut
    await prisma.providerProfile.update({
      where: { id: providerId },
      data: { isVerified: !currentStatus }
    });

    revalidatePath("/admin/providers");
    revalidatePath("/admin/users");
    revalidatePath("/search");
    revalidatePath(`/p/${providerId}`);

    return { success: true };
  } catch (error) {
    console.error("Erreur toggle verification:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
  }
}

/**
 * Bascule un profil prestataire en Premium (ou le repasse en Free), sans passer par un paiement.
 * Réservé aux tests internes / support — l'accès Premium payant normal passe par
 * `startPremiumCheckout` (src/app/dashboard/settings/premium/actions.ts).
 */
export async function setProviderPlanForTesting(providerId: string, makePremium: boolean) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Non autorisé" };
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    });

    if (!admin?.isAdmin) {
      return { success: false, error: "Accès refusé" };
    }

    await prisma.providerProfile.update({
      where: { id: providerId },
      data: makePremium
        ? { plan: "PREMIUM", planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
        : { plan: "FREE", planExpiresAt: null }
    });

    revalidatePath("/admin/providers");
    revalidatePath("/admin/users");
    revalidatePath("/search");
    revalidatePath(`/p/${providerId}`);

    return { success: true };
  } catch (error) {
    console.error("Erreur bascule Premium test:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
  }
}
