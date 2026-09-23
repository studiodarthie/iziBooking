"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toggleUserBan, deleteUserPermanently } from "@/app/admin/users/actions";
import { toggleProviderVerification, setProviderPlanForTesting } from "@/app/admin/providers/actions";
import { isPremium } from "@/lib/plan";
import { MoreVertical, Eye, CheckCircle2, ShieldAlert, Ban, RotateCcw, Crown, Trash2 } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  isAdmin: boolean;
  isBanned: boolean;
  banReason: string | null;
  providerProfile: { id: string; isVerified: boolean; plan: string; planExpiresAt: Date | null } | null;
};

export function UserListClient({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const run = async (userId: string, action: () => Promise<{ success: boolean; error?: string }>) => {
    setBusyId(userId);
    setOpenMenuId(null);
    const res = await action();
    setBusyId(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Une erreur est survenue.");
    }
  };

  const handleBan = (user: UserRow) => {
    let reason: string | undefined;
    if (!user.isBanned) {
      reason = prompt(`Motif du bannissement de ${user.name || user.email} (optionnel) :`) || undefined;
      if (!confirm(`Confirmer le bannissement de ${user.name || user.email} ?`)) return;
    } else {
      if (!confirm(`Réactiver le compte de ${user.name || user.email} ?`)) return;
    }
    run(user.id, () => toggleUserBan(user.id, user.isBanned, reason));
  };

  const handleDelete = (user: UserRow) => {
    const label = user.name || user.email || "cet utilisateur";
    const typed = prompt(
      `Suppression DÉFINITIVE et IRRÉVERSIBLE de ${label}.\n` +
        `Seront aussi supprimés : ses réservations, avis, messages` +
        (user.providerProfile ? ", ainsi que son profil prestataire (médias, services, coupons...)." : ".") +
        `\n\nPour confirmer, tapez exactement son email :\n${user.email}`
    );
    if (typed === null) return;
    if (typed.trim() !== user.email) {
      alert("Email non confirmé — suppression annulée.");
      return;
    }
    run(user.id, () => deleteUserPermanently(user.id));
  };

  return (
    <div className="bg-white border border-ink/10 rounded-2xl overflow-visible">
      <table className="w-full text-left text-sm">
        <thead className="bg-sand/30 text-xs uppercase font-bold text-ink/50 border-b border-ink/10">
          <tr>
            <th className="px-6 py-4">Nom</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Rôle</th>
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const premium = user.providerProfile ? isPremium(user.providerProfile as { plan: "FREE" | "PREMIUM"; planExpiresAt: Date | null }) : false;
            return (
              <tr key={user.id} className="border-b border-ink/5 last:border-0 relative">
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
                  {premium && (
                    <span className="ml-2 text-[10px] uppercase text-accent-2-600 font-bold">Premium</span>
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
                <td className="px-6 py-4 text-right relative">
                  {user.isAdmin ? (
                    <span className="text-xs text-ink/30">—</span>
                  ) : (
                    <>
                      <button
                        disabled={busyId === user.id}
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-sand/60 text-ink/60 hover:bg-sand hover:text-ink transition-colors disabled:opacity-50"
                        aria-label="Actions"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === user.id && (
                        <>
                          {/* Zone invisible pour fermer le menu au clic extérieur */}
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-6 top-full mt-1 z-20 w-56 bg-white rounded-xl shadow-xl border border-ink/10 py-1.5 text-left">
                            {user.providerProfile && (
                              <Link
                                href={`/p/${user.providerProfile.id}`}
                                target="_blank"
                                onClick={() => setOpenMenuId(null)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-trust hover:bg-sand/40 transition-colors"
                              >
                                <Eye size={16} /> Voir le profil
                              </Link>
                            )}

                            {user.providerProfile && !user.providerProfile.isVerified && (
                              <button
                                onClick={() => run(user.id, () => toggleProviderVerification(user.providerProfile!.id, false))}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-success hover:bg-sand/40 transition-colors"
                              >
                                <CheckCircle2 size={16} /> Valider
                              </button>
                            )}

                            {user.providerProfile && user.providerProfile.isVerified && (
                              <button
                                onClick={() => run(user.id, () => toggleProviderVerification(user.providerProfile!.id, true))}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-warning-700 hover:bg-sand/40 transition-colors"
                              >
                                <ShieldAlert size={16} /> Mettre en attente
                              </button>
                            )}

                            <button
                              onClick={() => handleBan(user)}
                              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-sand/40 transition-colors ${
                                user.isBanned ? "text-success" : "text-red-600"
                              }`}
                            >
                              {user.isBanned ? <RotateCcw size={16} /> : <Ban size={16} />}
                              {user.isBanned ? "Réactiver" : "Bannir"}
                            </button>

                            {user.providerProfile && (
                              <>
                                <div className="my-1.5 border-t border-ink/10" />
                                <button
                                  onClick={() =>
                                    run(user.id, () => setProviderPlanForTesting(user.providerProfile!.id, !premium))
                                  }
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-pink-600 hover:bg-sand/40 transition-colors"
                                >
                                  <Crown size={16} />
                                  {premium ? "Repasser Free (test)" : "Passer Premium (test)"}
                                </button>
                              </>
                            )}

                            <div className="my-1.5 border-t border-ink/10" />
                            <button
                              onClick={() => handleDelete(user)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} /> Supprimer définitivement
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
