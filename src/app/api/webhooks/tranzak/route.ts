import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTranzakWebhookAuth } from "@/lib/tranzak";
import { getCommissionRate } from "@/lib/plan";

// Notification Tranzak (TPN). Doc : eventType "REQUEST.COMPLETED" est envoyé pour toute
// transaction terminée (succès OU échec) — le vrai résultat est dans resource.status.
interface TranzakWebhookPayload {
  eventType: string;
  resourceId: string;
  resource: {
    requestId: string;
    status: string; // "SUCCESSFUL" | "FAILED" | "CANCELLED" (valeur de succès non confirmée par la doc consultée)
    amount: number;
    mchTransactionRef: string;
  };
  authKey?: string;
}

export async function POST(req: NextRequest) {
  let payload: TranzakWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  // Vérification d'authenticité AVANT tout accès base de données.
  if (!verifyTranzakWebhookAuth(payload.authKey)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const requestId = payload.resource?.requestId || payload.resourceId;
  if (!requestId) {
    return NextResponse.json({ error: "resourceId manquant" }, { status: 400 });
  }

  const status = payload.resource?.status;

  const subscriptionPayment = await prisma.subscriptionPayment.findUnique({
    where: { tranzakReference: requestId },
  });

  if (subscriptionPayment) {
    // Idempotence : Tranzak peut renvoyer plusieurs fois la même notification.
    if (subscriptionPayment.status === "COMPLETED" || subscriptionPayment.status === "FAILED") {
      return NextResponse.json({ success: true });
    }

    if (status === "SUCCESSFUL") {
      await prisma.$transaction([
        prisma.subscriptionPayment.update({
          where: { id: subscriptionPayment.id },
          data: { status: "COMPLETED" },
        }),
        prisma.providerProfile.update({
          where: { id: subscriptionPayment.providerProfileId },
          data: { plan: "PREMIUM", planExpiresAt: subscriptionPayment.periodEnd },
        }),
      ]);
    } else if (status === "FAILED" || status === "CANCELLED") {
      await prisma.subscriptionPayment.update({
        where: { id: subscriptionPayment.id },
        data: { status: "FAILED" },
      });
    }
    // Tout autre statut intermédiaire (ex: PENDING) : on acquitte sans rien changer,
    // une notification ultérieure confirmera l'issue finale.

    return NextResponse.json({ success: true });
  }

  // Sinon, il pourrait s'agir d'un acompte de réservation payé en ligne.
  const bookingPayment = await prisma.payment.findUnique({
    where: { reference: requestId },
    include: { booking: { include: { providerProfile: true } } },
  });

  if (!bookingPayment) {
    // Rien à faire ici (référence inconnue d'aucun des deux côtés) — on acquitte pour
    // éviter des retentatives infinies de la part de Tranzak.
    console.warn(`Webhook Tranzak : référence inconnue ${requestId}`);
    return NextResponse.json({ success: true });
  }

  if (bookingPayment.status === "COMPLETED" || bookingPayment.status === "FAILED") {
    return NextResponse.json({ success: true });
  }

  if (status === "SUCCESSFUL") {
    const commissionRate = getCommissionRate(bookingPayment.booking.providerProfile);
    const commissionAmount = bookingPayment.amount * commissionRate;

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: bookingPayment.id },
        data: { status: "COMPLETED", commissionAmount, payoutStatus: "PENDING" },
      }),
      // Frais de service organisateur (3%) : encore à recouvrer, distinct de la commission
      // prélevée au prestataire ci-dessus.
      prisma.payment.create({
        data: {
          bookingId: bookingPayment.bookingId,
          amount: bookingPayment.amount * 0.03,
          currency: bookingPayment.currency,
          status: "PENDING",
          type: "SERVICE_FEE",
          collectedByPlatform: false,
          payoutStatus: "NOT_APPLICABLE",
        },
      }),
      prisma.booking.update({
        where: { id: bookingPayment.bookingId },
        data: { status: "DEPOSIT_PAID" },
      }),
    ]);
  } else if (status === "FAILED" || status === "CANCELLED") {
    await prisma.payment.update({
      where: { id: bookingPayment.id },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.json({ success: true });
}
