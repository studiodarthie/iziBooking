"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createService(data: {
  name: string;
  description?: string;
  category?: string;
  startingPrice?: number;
}) {
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
    await prisma.service.create({
      data: {
        providerProfileId: user.providerProfile.id,
        name: data.name,
        description: data.description,
        category: data.category,
        startingPrice: data.startingPrice,
      }
    });

    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, error: "Erreur lors de la création du service." };
  }
}

export async function updateService(id: string, data: {
  name: string;
  description?: string;
  category?: string;
  startingPrice?: number;
}) {
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
    // Vérifier que le service appartient bien au provider
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service || service.providerProfileId !== user.providerProfile.id) {
      return { success: false, error: "Service non trouvé ou non autorisé." };
    }

    await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        startingPrice: data.startingPrice,
      }
    });

    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, error: "Erreur lors de la mise à jour du service." };
  }
}

export async function deleteService(id: string) {
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
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service || service.providerProfileId !== user.providerProfile.id) {
      return { success: false, error: "Service non trouvé ou non autorisé." };
    }

    await prisma.service.delete({
      where: { id }
    });

    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: "Erreur lors de la suppression du service." };
  }
}
