"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { Prisma } from "@prisma/client";

/**
 * Capture le contact d'un visiteur et, si c'est la première fois pour ce numéro sur cette
 * campagne, débloque le téléchargement de son affiche. C'est la vraie valeur du produit pour
 * l'organisateur : une liste de contacts intéressés, pas seulement des partages anonymes.
 * La contrainte unique (campaignId, phone) fait à la fois la déduplication et la limite
 * "une affiche par personne", sans logique métier séparée à maintenir.
 */
export async function submitPosterLead(
  slug: string,
  input: { firstName: string; lastName: string; phone: string; isWhatsapp: boolean; email?: string; consent: boolean }
) {
  const h = await headers();
  const ip = clientIp(h);

  const allowed = await rateLimit(`poster-lead:${ip}`, 20, 3600);
  if (!allowed) return { success: false as const, error: "Trop de tentatives, réessayez plus tard." };

  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const phone = input.phone.trim();
  const email = input.email?.trim() || undefined;

  if (!firstName || !lastName) return { success: false as const, error: "Prénom et nom sont obligatoires." };
  if (!phone || phone.length < 8) return { success: false as const, error: "Numéro de téléphone invalide." };
  if (!input.consent) return { success: false as const, error: "Merci d'accepter l'utilisation de vos informations pour continuer." };

  const campaign = await prisma.posterCampaign.findUnique({ where: { slug }, select: { id: true } });
  if (!campaign) return { success: false as const, error: "Campagne introuvable." };

  try {
    await prisma.$transaction([
      prisma.posterLead.create({
        data: {
          campaignId: campaign.id,
          firstName,
          lastName,
          phone,
          isWhatsapp: input.isWhatsapp,
          email,
        },
      }),
      prisma.posterCampaign.update({
        where: { id: campaign.id },
        data: { generatedCount: { increment: 1 } },
      }),
    ]);
    return { success: true as const };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false as const,
        error: "Vous avez déjà généré votre affiche pour cet événement avec ce numéro.",
        alreadyGenerated: true as const,
      };
    }
    console.error("Erreur soumission lead affiche:", error);
    return { success: false as const, error: "Une erreur est survenue, réessayez." };
  }
}

/** Compte une vue à l'ouverture de la page (distinct des affiches réellement générées). */
export async function registerPosterView(slug: string) {
  await prisma.posterCampaign
    .update({ where: { slug }, data: { viewCount: { increment: 1 } } })
    .catch(() => {}); // best-effort, ne doit jamais bloquer l'affichage
}
