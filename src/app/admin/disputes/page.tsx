import prisma from "@/lib/prisma";
import { AlertTriangle } from "lucide-react";
import { DisputeListClient } from "@/components/admin/DisputeListClient";

export default async function AdminDisputesPage() {
  const openDisputes = await prisma.dispute.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "asc" },
    include: {
      openedBy: { select: { name: true, email: true } },
      booking: {
        select: {
          eventType: true,
          eventDate: true,
          organizer: { select: { name: true, email: true } },
          providerProfile: { select: { name: true, whatsapp: true, user: { select: { email: true } } } },
        }
      }
    }
  });

  const resolvedDisputes = await prisma.dispute.findMany({
    where: { status: "RESOLVED" },
    orderBy: { resolvedAt: "desc" },
    take: 20,
    include: {
      booking: { select: { eventType: true, providerProfile: { select: { name: true } } } }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-ink">Litiges</h1>
        </div>
        <p className="mt-2 text-ink/60">
          Désaccords signalés par un organisateur ou un prestataire sur une réservation.
        </p>
      </div>

      <DisputeListClient openDisputes={openDisputes} resolvedDisputes={resolvedDisputes} />
    </div>
  );
}
