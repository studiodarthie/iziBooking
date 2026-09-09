"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ProviderPole } from "@prisma/client";

export async function submitProviderProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Vous devez être connecté.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Utilisateur non trouvé.");
  }

  // Update role to PROVIDER
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "PROVIDER" }
  });

  // Extract data from FormData
  const pole = formData.get("pole") as ProviderPole;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const specialty = formData.get("specialty") as string;
  const location = formData.get("location") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as string;
  
  const serviceName = formData.get("serviceName") as string;
  const servicePrice = formData.get("servicePrice") as string;
  const workingDaysStr = formData.get("workingDays") as string;

  // Create or update the provider profile
  const profile = await prisma.providerProfile.upsert({
    where: { userId: user.id },
    update: {
      pole,
      name,
      category,
      specialty,
      location,
      basePrice: price ? parseFloat(price) : null,
      onboardingCompleted: true,
    },
    create: {
      userId: user.id,
      pole,
      name,
      category,
      specialty,
      location,
      basePrice: price ? parseFloat(price) : null,
      onboardingCompleted: true,
    }
  });

  // Si on a une image, on met à jour le User
  if (image) {
    await prisma.user.update({
      where: { id: user.id },
      data: { image }
    });
  }

  // Création du premier Service s'il est fourni
  if (serviceName) {
    await prisma.service.create({
      data: {
        providerProfileId: profile.id,
        name: serviceName,
        startingPrice: servicePrice ? parseFloat(servicePrice) : null,
      }
    });
  }

  // Création des horaires (ScheduleSetting et WorkingHours)
  if (workingDaysStr) {
    const days = workingDaysStr.split(",").map(Number);
    const schedule = await prisma.scheduleSetting.upsert({
      where: { providerProfileId: profile.id },
      update: {},
      create: { providerProfileId: profile.id }
    });

    // Supprimer les anciens horaires pour recréer proprement
    await prisma.workingHour.deleteMany({
      where: { scheduleSettingId: schedule.id }
    });

    const workingHoursData = days.map(day => ({
      scheduleSettingId: schedule.id,
      dayOfWeek: day,
      startTime: "09:00",
      endTime: "18:00"
    }));

    if (workingHoursData.length > 0) {
      await prisma.workingHour.createMany({
        data: workingHoursData
      });
    }
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function submitOrganizerProfile() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Vous devez être connecté.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Utilisateur non trouvé.");
  }

  // Just update the role to ORGANIZER
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ORGANIZER" }
  });

  revalidatePath("/dashboard");
  return { success: true };
}
