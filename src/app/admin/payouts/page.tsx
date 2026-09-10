import prisma from "@/lib/prisma";
import { Banknote } from "lucide-react";
import { PayoutListClient } from "@/components/admin/PayoutListClient";

export default async function PayoutsPage() {
  const pendingPayouts = await prisma.payment.findMany({
    where: { collectedByPlatform: true, status: "COMPLETED", payoutStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      booking: {
        select: {
          eventType: true,
          eventDate: true,
          organizer: { select: { name: true } },
          providerProfile: { select: { name: true, whatsapp: true, user: { select: { email: true } } } },
        }
      }
    }
  });

  const paidPayouts = await prisma.payment.findMany({
    where: { collectedByPlatform: true, payoutStatus: "PAID" },
    orderBy: { payoutAt: "desc" },
    take: 20,
    include: {
      booking: {
        select: {
          providerProfile: { select: { name: true } },
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Banknote className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-ink">Reversements aux prestataires</h1>
        </div>
        <p className="mt-2 text-ink/60">
          Acomptes encaissés en ligne (Tranzak) sur le compte iziBooking, en attente de reversement manuel au prestataire.
        </p>
      </div>

      <PayoutListClient pendingPayouts={pendingPayouts} paidPayouts={paidPayouts} />
    </div>
  );
}
