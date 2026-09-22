"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { OCCASIONS } from "@/lib/filters";
import { generateBioDraft, checkAiQuota, isAiConfigured } from "@/lib/ai";
import { isPremium } from "@/lib/plan";

export async function updateProviderSettings(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "Vous devez être connecté." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== "PROVIDER") {
    return { success: false, error: "Profil non autorisé." };
  }

  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const category = formData.get("category") as string;
  const specialty = formData.get("specialty") as string;
  const bio = formData.get("bio") as string;
  const basePriceStr = formData.get("basePrice") as string;
  const currency = formData.get("currency") as string;
  const whatsapp = formData.get("whatsapp") as string;

  const occasions = formData.getAll("occasions").map(String).filter((o) => OCCASIONS.includes(o));

  const basePrice = basePriceStr ? parseFloat(basePriceStr) : null;

  try {
    await prisma.providerProfile.update({
      where: { userId: user.id },
      data: {
        name,
        location,
        category,
        specialty,
        occasions,
        bio,
        basePrice,
        currency,
        whatsapp,
      }
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}

export async function updateOrganizerName(name: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "Vous devez être connecté." };
  }

  if (!name.trim()) {
    return { success: false, error: "Le nom ne peut pas être vide." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return { success: false, error: "Utilisateur introuvable." };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}

export async function generateBioAction(input: {
  name: string;
  category: string;
  specialty?: string;
  location: string;
  basePrice?: number | null;
  currency: string;
  bio?: string;
}): Promise<{ success: true; bio: string } | { success: false; error: string }> {
  if (!isAiConfigured()) {
    return { success: false, error: "Le Coach IA n'est pas encore configuré." };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { success: false, error: "Non autorisé." };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true },
  });
  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    return { success: false, error: "Profil prestataire requis." };
  }

  const premium = isPremium(user.providerProfile);
  const allowed = await checkAiQuota(user.id, premium);
  if (!allowed) {
    return {
      success: false,
      error: premium
        ? "Quota mensuel atteint. Réessayez le mois prochain."
        : "Vous avez utilisé vos 3 générations gratuites ce mois-ci. Passez en Premium pour un accès illimité.",
    };
  }

  if (!input.name.trim() || !input.category.trim() || !input.location.trim()) {
    return { success: false, error: "Renseignez au moins le nom, la catégorie et la localisation avant de générer une bio." };
  }

  try {
    const bio = await generateBioDraft({
      name: input.name,
      category: input.category,
      specialty: input.specialty,
      location: input.location,
      basePrice: input.basePrice,
      currency: input.currency,
      bio: input.bio,
    });
    return { success: true, bio };
  } catch (error) {
    console.error("Erreur génération bio IA:", error);
    return { success: false, error: "Le Coach IA est momentanément indisponible. Réessayez dans un instant." };
  }
}
