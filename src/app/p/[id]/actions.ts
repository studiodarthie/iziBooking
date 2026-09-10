"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { notifyContactMessage } from "@/lib/email";

export async function sendContactMessage(providerProfileId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, error: "Vous devez être connecté pour envoyer un message." };
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return { success: false, error: "Le message ne peut pas être vide." };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return { success: false, error: "Utilisateur introuvable." };
  }
  if (user.isBanned) {
    return { success: false, error: "Votre compte a été suspendu. Contactez le support pour plus d'informations." };
  }

  const providerProfile = await prisma.providerProfile.findUnique({
    where: { id: providerProfileId },
    include: { user: { select: { email: true } } }
  });
  if (!providerProfile) {
    return { success: false, error: "Prestataire introuvable." };
  }
  if (providerProfile.userId === user.id) {
    return { success: false, error: "Vous ne pouvez pas vous contacter vous-même." };
  }

  try {
    await prisma.contactMessage.create({
      data: { providerProfileId, senderId: user.id, content: trimmed }
    });

    if (providerProfile.user?.email) {
      await notifyContactMessage({
        providerEmail: providerProfile.user.email,
        senderName: user.name || "Un visiteur iziBooking",
        content: trimmed,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi message de contact:", error);
    return { success: false, error: "Erreur lors de l'envoi du message." };
  }
}
