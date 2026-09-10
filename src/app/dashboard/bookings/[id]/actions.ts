"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { BookingStatus, PaymentMethod, Prisma } from "@prisma/client";
import { notifyNewMessage } from "@/lib/email";
import { initiateTranzakPayment, isTranzakConfigured } from "@/lib/tranzak";

export async function sendMessage(bookingId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Non autorisé" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "Utilisateur non trouvé" };

  if (!content.trim()) return { error: "Le message ne peut pas être vide" };
  const trimmedContent = content.trim();

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        organizer: { select: { id: true, email: true } },
        providerProfile: { select: { user: { select: { id: true, email: true } } } }
      }
    });
    if (!booking) return { error: "Réservation introuvable" };

    await prisma.message.create({
      data: {
        bookingId,
        senderId: user.id,
        content: trimmedContent
      }
    });

    const recipient = user.id === booking.organizer.id ? booking.providerProfile.user : booking.organizer;
    if (recipient?.email) {
      await notifyNewMessage({
        recipientEmail: recipient.email,
        senderName: user.name || "Un utilisateur",
        content: trimmedContent,
        bookingId,
      });
    }

    revalidatePath(`/dashboard/bookings/${bookingId}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de l'envoi du message" };
  }
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus, totalAmount?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Non autorisé" };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });
  if (!user) return { error: "Non autorisé" };

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { coupon: true }
  });
  if (!booking) return { error: "Réservation introuvable" };

  const isProvider = user.providerProfile?.id === booking.providerProfileId;
  const isOrganizer = user.id === booking.organizerId;
  if (!isProvider && !isOrganizer) return { error: "Non autorisé" };

  const data: Prisma.BookingUpdateInput = { status };
  if (totalAmount !== undefined) {
    if (booking.coupon) {
      const rawDiscount = booking.coupon.discountType === "PERCENTAGE"
        ? totalAmount * (booking.coupon.discountValue / 100)
        : booking.coupon.discountValue;
      const discount = Math.min(rawDiscount, totalAmount);
      data.discountAmount = discount;
      data.totalAmount = totalAmount - discount;
    } else {
      data.totalAmount = totalAmount;
    }
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data
    });

    revalidatePath(`/dashboard/bookings/${bookingId}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de la mise à jour" };
  }
}

// Paiement direct organisateur → prestataire (hors plateforme), simplement déclaré ici.
// La plateforme n'a jamais tenu cet argent : payoutStatus reste NOT_APPLICABLE.
export async function confirmDirectDeposit(bookingId: string, method: PaymentMethod) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Non autorisé" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "Non autorisé" };

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return { error: "Réservation introuvable" };
  if (booking.organizerId !== user.id) return { error: "Non autorisé" };
  if (booking.status !== "ACCEPTED") return { error: "Cette réservation n'est pas en attente de paiement." };
  if (!booking.totalAmount) return { error: "Le montant n'a pas encore été fixé." };

  try {
    await prisma.$transaction([
      prisma.payment.create({
        data: {
          bookingId,
          amount: booking.totalAmount,
          method,
          status: "COMPLETED",
          type: "FULL",
          collectedByPlatform: false,
          payoutStatus: "NOT_APPLICABLE",
        }
      }),
      prisma.booking.update({ where: { id: bookingId }, data: { status: "DEPOSIT_PAID" } }),
    ]);

    revalidatePath(`/dashboard/bookings/${bookingId}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de l'enregistrement du paiement" };
  }
}

// Paiement en ligne réel via Tranzak : l'argent est encaissé par la plateforme, qui devra
// ensuite le reverser au prestataire (voir /admin/payouts) — d'où collectedByPlatform: true.
export async function initiateOnlineDeposit(bookingId: string) {
  if (!isTranzakConfigured()) {
    return { success: false, error: "Le paiement en ligne n'est pas encore disponible." };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { success: false, error: "Non autorisé" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { success: false, error: "Non autorisé" };

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { providerProfile: { select: { currency: true, name: true } } }
  });
  if (!booking) return { success: false, error: "Réservation introuvable" };
  if (booking.organizerId !== user.id) return { success: false, error: "Non autorisé" };
  if (booking.status !== "ACCEPTED") return { success: false, error: "Cette réservation n'est pas en attente de paiement." };
  if (!booking.totalAmount) return { success: false, error: "Le montant n'a pas encore été fixé." };

  const payment = await prisma.payment.create({
    data: {
      bookingId,
      amount: booking.totalAmount,
      currency: booking.providerProfile.currency,
      status: "PENDING",
      type: "FULL",
      collectedByPlatform: true,
      payoutStatus: "NOT_APPLICABLE",
    }
  });

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const result = await initiateTranzakPayment({
      amount: booking.totalAmount,
      currencyCode: booking.providerProfile.currency,
      description: `Acompte réservation — ${booking.providerProfile.name}`,
      mchTransactionRef: payment.id,
      returnUrl: `${baseUrl}/dashboard/bookings/${bookingId}`,
    });

    await prisma.payment.update({ where: { id: payment.id }, data: { reference: result.requestId } });

    if (!result.paymentPageUrl) {
      return { success: false, error: "Paiement initié mais le lien de paiement est introuvable. Contactez le support." };
    }

    return { success: true, paymentPageUrl: result.paymentPageUrl };
  } catch (error) {
    console.error("Erreur initiation paiement Tranzak (acompte):", error);
    return { success: false, error: "Impossible d'initier le paiement pour le moment. Réessayez dans quelques minutes." };
  }
}

export async function submitReview(bookingId: string, rating: number, comment?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Non autorisé" };

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "La note doit être comprise entre 1 et 5." };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "Non autorisé" };

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return { error: "Réservation introuvable" };

  if (booking.organizerId !== user.id) return { error: "Non autorisé" };
  if (booking.status !== "COMPLETED") {
    return { error: "Vous ne pouvez laisser un avis qu'après la fin de la prestation." };
  }

  try {
    await prisma.review.create({
      data: {
        bookingId,
        providerProfileId: booking.providerProfileId,
        organizerId: user.id,
        rating,
        comment: comment?.trim() || undefined,
      }
    });

    revalidatePath(`/dashboard/bookings/${bookingId}`);
    revalidatePath(`/p/${booking.providerProfileId}`);
    return { success: true };
  } catch {
    return { error: "Erreur lors de l'envoi de l'avis" };
  }
}

export async function openDispute(bookingId: string, reason: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Non autorisé" };
  if (!reason.trim()) return { error: "Merci de décrire le problème." };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });
  if (!user) return { error: "Non autorisé" };

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return { error: "Réservation introuvable" };

  const isProvider = user.providerProfile?.id === booking.providerProfileId;
  const isOrganizer = user.id === booking.organizerId;
  if (!isProvider && !isOrganizer) return { error: "Non autorisé" };

  try {
    await prisma.dispute.create({
      data: { bookingId, openedById: user.id, reason: reason.trim() }
    });

    revalidatePath(`/dashboard/bookings/${bookingId}`);
    return { success: true };
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { error: "Un litige est déjà ouvert pour cette réservation." };
    }
    console.error("Erreur ouverture litige:", error);
    return { error: "Erreur lors du signalement." };
  }
}
