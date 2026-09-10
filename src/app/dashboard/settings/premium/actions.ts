"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { initiateSubscriptionPayment, isTranzakConfigured } from "@/lib/tranzak";

const PREMIUM_PRICE_XAF = 15000;
const PREMIUM_PERIOD_DAYS = 30;

export async function startPremiumCheckout() {
  if (!isTranzakConfigured()) {
    return { success: false, error: "Le paiement en ligne n'est pas encore disponible." };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, error: "Vous devez être connecté." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    return { success: false, error: "Profil non autorisé." };
  }

  const periodStart = new Date();
  const periodEnd = new Date(periodStart);
  periodEnd.setDate(periodEnd.getDate() + PREMIUM_PERIOD_DAYS);

  const subscriptionPayment = await prisma.subscriptionPayment.create({
    data: {
      providerProfileId: user.providerProfile.id,
      amount: PREMIUM_PRICE_XAF,
      periodStart,
      periodEnd,
    }
  });

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const result = await initiateSubscriptionPayment({
      amount: PREMIUM_PRICE_XAF,
      currencyCode: "XAF",
      description: "Abonnement Premium iziBooking (30 jours)",
      mchTransactionRef: subscriptionPayment.id,
      returnUrl: `${baseUrl}/dashboard/settings/premium`,
    });

    await prisma.subscriptionPayment.update({
      where: { id: subscriptionPayment.id },
      data: { tranzakReference: result.requestId }
    });

    if (!result.paymentPageUrl) {
      return { success: false, error: "Paiement initié mais le lien de paiement est introuvable. Contactez le support." };
    }

    return { success: true, paymentPageUrl: result.paymentPageUrl };
  } catch (error) {
    console.error("Erreur initiation paiement Tranzak:", error);
    return { success: false, error: "Impossible d'initier le paiement pour le moment. Réessayez dans quelques minutes." };
  }
}
