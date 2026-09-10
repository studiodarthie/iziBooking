import prisma from "@/lib/prisma";
import { Users } from "lucide-react";
import { UserListClient } from "@/components/admin/UserListClient";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isAdmin: true,
      isBanned: true,
      banReason: true,
      providerProfile: { select: { isVerified: true } },
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-ink">Utilisateurs</h1>
        </div>
        <p className="mt-2 text-ink/60">
          Tous les comptes de la plateforme. Bannir un compte l&apos;empêche de se connecter et retire son profil des résultats publics s&apos;il est prestataire.
        </p>
      </div>

      <UserListClient users={users} />
    </div>
  );
}
