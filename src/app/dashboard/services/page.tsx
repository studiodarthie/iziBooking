import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ServiceListClient } from "@/components/dashboard/ServiceForm";
import { LayoutList } from "lucide-react";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: { include: { services: { orderBy: { createdAt: 'desc' } } } } }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    redirect("/dashboard");
  }

  const services = user.providerProfile.services;

  return (
    <div className="flex flex-col h-full space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <LayoutList className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-ink">Catalogue de Services</h1>
          </div>
          <p className="mt-2 text-ink/60">
            Créez des "packages" ou services pour donner une idée de vos offres aux organisateurs d'événements.
          </p>
        </div>
      </div>
      
      <ServiceListClient initialServices={services} />
    </div>
  );
}
