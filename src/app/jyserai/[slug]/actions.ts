"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { rateLimit, clientIp } from "@/lib/ratelimit";

/**
 * Incrémente le compteur d'une campagne quand un visiteur génère réellement son affiche
 * (clic sur télécharger/partager, pas à chaque chargement de page). Limité par IP pour éviter
 * qu'un script ne gonfle artificiellement le compteur.
 */
export async function registerPosterGeneration(slug: string) {
  const h = await headers();
  const ip = clientIp(h);

  const allowed = await rateLimit(`poster-gen:${ip}`, 30, 3600);
  if (!allowed) return { success: false as const, error: "Trop de tentatives, réessayez plus tard." };

  try {
    await prisma.posterCampaign.update({
      where: { slug },
      data: { generatedCount: { increment: 1 } },
    });
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Campagne introuvable." };
  }
}
