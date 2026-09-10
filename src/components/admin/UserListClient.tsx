"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleUserBan } from "@/app/admin/users/actions";

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  isAdmin: boolean;
  isBanned: boolean;
  banReason: string | null;
  providerProfile: { isVerified: boolean } | null;
};

export function UserListClient({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleToggle = async (user: UserRow) => {
    let reason: string | undefined;
    if (!user.isBanned) {
      reason = prompt(`Motif du bannissement de ${user.name || user.email} (optionnel) :`) || undefined;
      if (!confirm(`Confirmer le bannissement de ${user.name || user.email} ?`)) return;
    } else {
      if (!confirm(`Réactiver le compte de ${user.name || user.email} ?`)) return;
    }

    setBusyId(user.id);
    const res = await toggleUserBan(user.id, user.isBanned, reason);
    setBusyId(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-sand/30 text-xs uppercase font-bold text-ink/50 border-b border-ink/10">
          <tr>
            <th className="px-6 py-4">Nom</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Rôle</th>
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-ink/5 last:border-0">
              <td className="px-6 py-4 font-bold text-ink">
                {user.name || "—"}
                {user.isAdmin && <span className="ml-2 text-[10px] uppercase text-primary font-bold">Admin</span>}
              </td>
              <td className="px-6 py-4 text-ink/60">{user.email}</td>
              <td className="px-6 py-4 text-ink/60">
                {user.role === "PROVIDER" ? "Prestataire" : "Organisateur"}
                {user.providerProfile?.isVerified && (
                  <span className="ml-2 text-[10px] uppercase text-success font-bold">Vérifié</span>
                )}
              </td>
              <td className="px-6 py-4">
                {user.isBanned ? (
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600">
                    Banni{user.banReason ? ` — ${user.banReason}` : ""}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-success/10 text-success">
                    Actif
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                {user.isAdmin ? (
                  <span className="text-xs text-ink/30">—</span>
                ) : (
                  <button
                    disabled={busyId === user.id}
                    onClick={() => handleToggle(user)}
                    className={`text-xs font-bold hover:underline disabled:opacity-50 ${user.isBanned ? "text-success" : "text-red-500"}`}
                  >
                    {user.isBanned ? "Réactiver" : "Bannir"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
