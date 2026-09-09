import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileSettingsForm from "@/components/dashboard/ProfileSettingsForm";

export default async function SettingsPage() {
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

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Paramètres du profil</h1>
        <p className="mt-1 text-sm text-ink/70">
          Mettez à jour vos informations publiques et vos tarifs de réservation.
        </p>
      </div>
      
      <ProfileSettingsForm initialData={user.providerProfile} />
    </div>
  );
}
