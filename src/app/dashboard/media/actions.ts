"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { MediaType } from "@prisma/client";

export async function addMediaToProfile(url: string, format: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Vous devez être connecté.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user || !user.providerProfile) {
    throw new Error("Profil prestataire non trouvé.");
  }

  let type: MediaType = "IMAGE";
  if (["mp4", "mov", "video"].includes(format)) {
    type = "VIDEO";
  } else if (["mp3", "wav", "audio"].includes(format)) {
    type = "AUDIO";
  }

  await prisma.mediaLink.create({
    data: {
      providerProfileId: user.providerProfile.id,
      url,
      type,
    }
  });

  revalidatePath("/dashboard/media");
  return { success: true };
}

export async function getMediaLinks() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: { include: { mediaLinks: true } } }
  });

  return user?.providerProfile?.mediaLinks || [];
}

export async function deleteMedia(mediaId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Vous devez être connecté.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user || !user.providerProfile) {
    throw new Error("Profil prestataire non trouvé.");
  }

  const media = await prisma.mediaLink.findUnique({
    where: { id: mediaId }
  });

  if (!media || media.providerProfileId !== user.providerProfile.id) {
    throw new Error("Média non trouvé ou non autorisé.");
  }

  await prisma.mediaLink.delete({
    where: { id: mediaId }
  });

  revalidatePath("/dashboard/media");
  return { success: true };
}
