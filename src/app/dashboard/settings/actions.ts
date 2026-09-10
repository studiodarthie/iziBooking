"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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

  const basePrice = basePriceStr ? parseFloat(basePriceStr) : null;

  try {
    await prisma.providerProfile.update({
      where: { userId: user.id },
      data: {
        name,
        location,
        category,
        specialty,
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
