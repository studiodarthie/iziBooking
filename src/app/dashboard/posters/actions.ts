"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { slugifyPosterTitle, type PhotoZone } from "@/lib/poster";
import { PosterTheme } from "@prisma/client";

/** Rejette toute zone qui déborderait du gabarit (donnée non fiable venant du client). */
function sanitizePhotoZone(zone: PhotoZone | null | undefined, template: { width: number; height: number }) {
  if (!zone) return null;
  const width = Math.min(Math.max(Math.round(zone.width), 1), template.width);
  const height = Math.min(Math.max(Math.round(zone.height), 1), template.height);
  const x = Math.min(Math.max(Math.round(zone.x), 0), template.width - width);
  const y = Math.min(Math.max(Math.round(zone.y), 0), template.height - height);
  return { x, y, width, height };
}

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
  template?: { publicId: string; width: number; height: number; photoZone?: PhotoZone | null } | null;
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
  const zone = input.template ? sanitizePhotoZone(input.template.photoZone, input.template) : null;

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
      photoZoneX: zone?.x,
      photoZoneY: zone?.y,
      photoZoneWidth: zone?.width,
      photoZoneHeight: zone?.height,
    },
  });

  revalidatePath("/dashboard/posters");
  return { success: true as const, slug: campaign.slug };
}

export async function updatePosterPhotoZone(campaignId: string, zone: PhotoZone) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false as const, error: "Non autorisé" };

  const campaign = await prisma.posterCampaign.findUnique({
    where: { id: campaignId },
    select: { userId: true, templateWidth: true, templateHeight: true },
  });
  if (!campaign || campaign.userId !== session.user.id) {
    return { success: false as const, error: "Campagne introuvable." };
  }
  if (!campaign.templateWidth || !campaign.templateHeight) {
    return { success: false as const, error: "Cette affiche n'a pas de gabarit personnalisé." };
  }

  const sanitized = sanitizePhotoZone(zone, { width: campaign.templateWidth, height: campaign.templateHeight });
  if (!sanitized) return { success: false as const, error: "Zone invalide." };

  await prisma.posterCampaign.update({
    where: { id: campaignId },
    data: {
      photoZoneX: sanitized.x,
      photoZoneY: sanitized.y,
      photoZoneWidth: sanitized.width,
      photoZoneHeight: sanitized.height,
    },
  });

  revalidatePath(`/dashboard/posters/${campaignId}`);
  revalidatePath("/dashboard/posters");
  return { success: true as const };
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
