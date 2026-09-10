import { DashboardShell } from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Vérifier l'utilisateur en base
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true }
  });

  if (!user) {
    redirect("/api/auth/signout?callbackUrl=/login");
  }

  if (user.isBanned) {
    redirect("/api/auth/signout?callbackUrl=/login?banned=1");
  }

  // Si l'utilisateur n'a pas encore de profil prestataire et n'est pas un organisateur
  // Mais ici, nous voulons que le dashboard se rende avec le rôle du user (user.role)
  // Onboarding est géré lors de la création du compte via next-auth "newUser"

  const unreadMessages = user.providerProfile
    ? await prisma.contactMessage.count({
        where: { providerProfileId: user.providerProfile.id, isRead: false }
      })
    : 0;

  return (
    <DashboardShell role={user.role} user={user} unreadMessages={unreadMessages}>
      {children}
    </DashboardShell>
  );
}
