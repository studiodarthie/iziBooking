"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { slugifyPosterTitle } from "@/lib/poster";
import { PosterTheme } from "@prisma/client";

const MAX_CAMPAIGNS_PER_USER = 10;

/** Génère un slug unique à partir du titre, en ajoutant un suffixe aléatoire en cas de collision. */
async function uniqueSlug(title: string): Promise<string> {
  const base = slugifyPosterTitle(title);
  let slug = base;
  let attempt = 0;
  while (await prisma.posterCampaign.findUnique({ where: { slug }, select: { id: true } })) {
    attempt += 1;
    slug = `${base}-${Math.random().toString(36).slice(2, 2 + 4)}`;
    if (attempt > 10) throw new Error("Impossible de générer un lien unique, réessayez.");
  }
  return slug;
}

export async function createPosterCampaign(input: {
  title: string;
  eventDate?: string;
  theme: string;
  template?: { publicId: string; width: number; height: number } | null;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false as const, error: "Non autorisé" };

  const title = input.title.trim();
  if (!title) return { success: false as const, error: "Le titre est obligatoire." };
  if (title.length > 80) return { success: false as const, error: "Titre trop long (80 caractères max)." };

  const theme = (["BRIQUE", "DORE", "FORET"] as const).includes(input.theme as PosterTheme)
    ? (input.theme as PosterTheme)
    : "BRIQUE";

  const existingCount = await prisma.posterCampaign.count({ where: { userId: session.user.id } });
  if (existingCount >= MAX_CAMPAIGNS_PER_USER) {
    return { success: false as const, error: `Limite de ${MAX_CAMPAIGNS_PER_USER} campagnes atteinte.` };
  }

  const slug = await uniqueSlug(title);

  const campaign = await prisma.posterCampaign.create({
    data: {
      userId: session.user.id,
      title,
      eventDate: input.eventDate ? new Date(input.eventDate) : null,
      theme,
      slug,
      templatePublicId: input.template?.publicId,
      templateWidth: input.template?.width,
      templateHeight: input.template?.height,
    },
  });

  revalidatePath("/dashboard/posters");
  return { success: true as const, slug: campaign.slug };
}

export async function deletePosterCampaign(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false as const, error: "Non autorisé" };

  const campaign = await prisma.posterCampaign.findUnique({ where: { id }, select: { userId: true } });
  if (!campaign || campaign.userId !== session.user.id) {
    return { success: false as const, error: "Campagne introuvable." };
  }

  await prisma.posterCampaign.delete({ where: { id } });
  revalidatePath("/dashboard/posters");
  return { success: true as const };
}
