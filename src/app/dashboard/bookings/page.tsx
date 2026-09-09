import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BookingKanban } from "@/components/dashboard/BookingKanban";
import { ListTodo } from "lucide-react";

export default async function BookingsPage() {
  /*
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    redirect("/dashboard");
  }

  // Fetch bookings for this provider
  const bookings = await prisma.booking.findMany({
    where: { providerProfileId: user.providerProfile.id },
    include: {
      organizer: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  */

  const bookings: any[] = [];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <ListTodo className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-ink">Réservations & Devis</h1>
          </div>
          <p className="mt-2 text-ink/60">
            Gérez vos demandes de devis et suivez l'état de vos réservations de bout en bout.
          </p>
        </div>
      </div>
      
      <BookingKanban initialBookings={bookings} />
    </div>
  );
}
