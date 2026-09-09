"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getBlockedDates() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { success: false, error: "Non autorisé" };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user?.providerProfile) {
    return { success: false, error: "Profil prestataire introuvable" };
  }

  const blockedDates = await prisma.blockedDate.findMany({
    where: { providerProfileId: user.providerProfile.id },
    select: { date: true }
  });

  return { success: true, dates: blockedDates.map(bd => bd.date.toISOString()) };
}

type WorkingHourInput = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

export async function updateScheduleSettings(data: {
  timezone: string;
  leadTimeHours: number;
  bookingHorizon: number;
  workingHours: WorkingHourInput[];
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { success: false, error: "Non autorisé" };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user?.providerProfile) {
    return { success: false, error: "Profil prestataire introuvable" };
  }

  const schedule = await prisma.scheduleSetting.upsert({
    where: { providerProfileId: user.providerProfile.id },
    update: {
      timezone: data.timezone,
      leadTimeHours: data.leadTimeHours,
      bookingHorizon: data.bookingHorizon,
    },
    create: {
      providerProfileId: user.providerProfile.id,
      timezone: data.timezone,
      leadTimeHours: data.leadTimeHours,
      bookingHorizon: data.bookingHorizon,
    }
  });

  await prisma.workingHour.deleteMany({
    where: { scheduleSettingId: schedule.id }
  });

  const activeDays = data.workingHours.filter(wh => wh.isActive);
  if (activeDays.length > 0) {
    await prisma.workingHour.createMany({
      data: activeDays.map(wh => ({
        scheduleSettingId: schedule.id,
        dayOfWeek: wh.dayOfWeek,
        startTime: wh.startTime,
        endTime: wh.endTime,
      }))
    });
  }

  revalidatePath("/dashboard/calendar");
  return { success: true };
}

export async function toggleBlockedDate(dateStr: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { success: false, error: "Non autorisé" };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user?.providerProfile) {
    return { success: false, error: "Profil prestataire introuvable" };
  }

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0); // Normalize to midnight

  const existing = await prisma.blockedDate.findFirst({
    where: {
      providerProfileId: user.providerProfile.id,
      date: date
    }
  });

  if (existing) {
    await prisma.blockedDate.delete({
      where: { id: existing.id }
    });
    return { success: true, action: "unblocked", date: date.toISOString() };
  } else {
    await prisma.blockedDate.create({
      data: {
        providerProfileId: user.providerProfile.id,
        date: date
      }
    });
    return { success: true, action: "blocked", date: date.toISOString() };
  }
}
