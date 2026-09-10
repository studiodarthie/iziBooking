import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTranzakWebhookAuth } from "@/lib/tranzak";

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

  const subscriptionPayment = await prisma.subscriptionPayment.findUnique({
    where: { tranzakReference: requestId },
  });

  if (!subscriptionPayment) {
    // Rien à faire ici (référence inconnue) — on acquitte pour éviter des retentatives infinies.
    console.warn(`Webhook Tranzak : référence inconnue ${requestId}`);
    return NextResponse.json({ success: true });
  }

  // Idempotence : Tranzak peut renvoyer plusieurs fois la même notification.
  if (subscriptionPayment.status === "COMPLETED" || subscriptionPayment.status === "FAILED") {
    return NextResponse.json({ success: true });
  }

  const status = payload.resource?.status;

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
