"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { askCoach, checkAiQuota, isAiConfigured, type ProviderContext } from "@/lib/ai";
import { isPremium } from "@/lib/plan";

async function getProviderOrThrow() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Non autorisé");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { providerProfile: true },
  });
  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    throw new Error("Profil prestataire requis");
  }
  return { user, profile: user.providerProfile };
}

export async function askCoachAction(
  question: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<{ success: true; answer: string } | { success: false; error: string }> {
  if (!isAiConfigured()) {
    return { success: false, error: "Le Coach IA n'est pas encore configuré." };
  }
  if (!question.trim()) {
    return { success: false, error: "Votre question est vide." };
  }

  try {
    const { user, profile } = await getProviderOrThrow();
    const premium = isPremium(profile);
    const allowed = await checkAiQuota(user.id, premium);
    if (!allowed) {
      return {
        success: false,
        error: premium
          ? "Quota mensuel atteint. Réessayez le mois prochain."
          : "Vous avez utilisé vos 3 questions gratuites ce mois-ci. Passez en Premium pour un accès illimité au Coach IA.",
      };
    }

    const providerContext: ProviderContext = {
      name: profile.name,
      category: profile.category,
      specialty: profile.specialty,
      location: profile.location,
      basePrice: profile.basePrice,
      currency: profile.currency,
      bio: profile.bio,
    };

    // On limite l'historique envoyé au modèle pour contenir le coût par appel.
    const trimmedHistory = history.slice(-10);
    const answer = await askCoach({ provider: providerContext, question: question.trim(), history: trimmedHistory });
    return { success: true, answer };
  } catch (error) {
    console.error("Erreur Coach IA:", error);
    return { success: false, error: "Le Coach IA est momentanément indisponible. Réessayez dans un instant." };
  }
}
