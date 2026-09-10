"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getUnavailableDates(providerProfileId: string) {
  const [blockedDates, bookings] = await Promise.all([
    prisma.blockedDate.findMany({
      where: { providerProfileId },
      select: { date: true }
    }),
    prisma.booking.findMany({
      where: {
        providerProfileId,
        status: { in: ["ACCEPTED", "DEPOSIT_PAID", "CONFIRMED", "COMPLETED"] }
      },
      select: { eventDate: true }
    })
  ]);

  const dates = [...blockedDates.map(b => b.date), ...bookings.map(b => b.eventDate)];
  return dates.map(d => d.toISOString().split("T")[0]);
}

export async function validateCoupon(providerProfileId: string, code: string) {
  const coupon = await prisma.coupon.findUnique({
    where: { providerProfileId_code: { providerProfileId, code: code.trim().toUpperCase() } }
  });

  if (!coupon || !coupon.isActive) {
    return { valid: false, error: "Ce code n'existe pas ou n'est plus actif." };
  }

  const now = new Date();
  if (coupon.validFrom && now < coupon.validFrom) {
    return { valid: false, error: "Ce code n'est pas encore valide." };
  }
  if (coupon.validUntil && now > coupon.validUntil) {
    return { valid: false, error: "Ce code a expiré." };
  }
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, error: "Ce code a atteint sa limite d'utilisation." };
  }

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      usageLimit: coupon.usageLimit,
    }
  };
}

export async function submitBooking(data: {
  providerProfileId: string;
  eventDate: Date;
  eventType: string;
  eventLocation: string;
  clientWhatsApp?: string;
  budget?: number;
  details?: string;
  serviceId?: string;
  couponCode?: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "Vous devez être connecté pour envoyer une demande." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return { success: false, error: "Utilisateur introuvable." };
  }

  const dayStart = new Date(data.eventDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const [blockedDate, conflictingBooking] = await Promise.all([
    prisma.blockedDate.findFirst({
      where: { providerProfileId: data.providerProfileId, date: dayStart }
    }),
    prisma.booking.findFirst({
      where: {
        providerProfileId: data.providerProfileId,
        status: { in: ["ACCEPTED", "DEPOSIT_PAID", "CONFIRMED", "COMPLETED"] },
        eventDate: { gte: dayStart, lt: dayEnd }
      }
    })
  ]);

  if (blockedDate || conflictingBooking) {
    return { success: false, error: "Cette date n'est plus disponible pour ce prestataire. Merci d'en choisir une autre." };
  }

  let couponId: string | undefined;
  if (data.couponCode) {
    const validation = await validateCoupon(data.providerProfileId, data.couponCode);
    if (!validation.valid || !validation.coupon) {
      return { success: false, error: validation.error || "Code promo invalide." };
    }
    couponId = validation.coupon.id;
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      if (couponId) {
        // Incrément atomique : la comparaison usageCount < usageLimit se fait au niveau de la
        // requête SQL elle-même, donc deux organisateurs ne peuvent jamais consommer tous les
        // deux le dernier usage disponible (un seul des deux updateMany touchera une ligne).
        // Si la réservation échoue plus bas, la transaction annule aussi cet incrément.
        const coupon = await tx.coupon.findUniqueOrThrow({ where: { id: couponId } });
        const claim = await tx.coupon.updateMany({
          where: {
            id: couponId,
            isActive: true,
            ...(coupon.usageLimit !== null ? { usageCount: { lt: coupon.usageLimit } } : {})
          },
          data: { usageCount: { increment: 1 } }
        });
        if (claim.count === 0) {
          throw new Error("COUPON_EXHAUSTED");
        }
      }

      return tx.booking.create({
        data: {
          organizerId: user.id,
          providerProfileId: data.providerProfileId,
          eventDate: data.eventDate,
          eventType: data.eventType,
          eventLocation: data.eventLocation,
          clientWhatsApp: data.clientWhatsApp,
          budget: data.budget,
          details: data.details,
          serviceId: data.serviceId,
          couponId,
          status: "PENDING"
        }
      });
    });

    return { success: true, bookingId: booking.id };
  } catch (error) {
    if (error instanceof Error && error.message === "COUPON_EXHAUSTED") {
      return { success: false, error: "Ce code vient d'atteindre sa limite d'utilisation. Merci de retirer le code." };
    }
    console.error("Error creating booking:", error);
    return { success: false, error: "Erreur lors de la soumission de la demande." };
  }
}
