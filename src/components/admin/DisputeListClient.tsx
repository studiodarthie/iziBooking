"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resolveDispute } from "@/app/admin/disputes/actions";

type OpenDispute = {
  id: string;
  reason: string;
  createdAt: Date;
  openedBy: { name: string | null; email: string | null };
  booking: {
    eventType: string;
    eventDate: Date;
    organizer: { name: string | null; email: string | null };
    providerProfile: { name: string; whatsapp: string | null; user: { email: string | null } };
  };
};

type ResolvedDispute = {
  id: string;
  resolvedAt: Date | null;
  resolutionNote: string | null;
  booking: { eventType: string; providerProfile: { name: string } };
};

export function DisputeListClient({ openDisputes, resolvedDisputes }: { openDisputes: OpenDispute[]; resolvedDisputes: ResolvedDispute[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleResolve = async (id: string) => {
    const note = prompt("Note de résolution (optionnel) :") || undefined;
    if (!confirm("Marquer ce litige comme résolu ?")) return;
    setBusyId(id);
    const res = await resolveDispute(id, note);
    setBusyId(null);
    if (res.success) router.refresh();
    else alert(res.error);
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">Ouverts ({openDisputes.length})</h2>

        {openDisputes.length === 0 ? (
          <div className="bg-white border border-ink/10 border-dashed rounded-2xl p-10 text-center text-ink/50">
            Aucun litige ouvert.
          </div>
        ) : (
          <div className="space-y-4">
            {openDisputes.map((d) => (
              <div key={d.id} className="bg-white border border-ink/10 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-ink">
                      {d.booking.eventType} — {d.booking.providerProfile.name}
                    </div>
                    <div className="text-xs text-ink/50 mt-1">
                      Organisateur : {d.booking.organizer.name} ({d.booking.organizer.email}) · Prestataire : {d.booking.providerProfile.whatsapp || d.booking.providerProfile.user.email}
                    </div>
                    <div className="text-xs text-ink/40 mt-1">
                      Signalé par {d.openedBy.name || d.openedBy.email} le {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <button
                    disabled={busyId === d.id}
                    onClick={() => handleResolve(d.id)}
                    className="shrink-0 text-xs font-bold text-primary hover:underline disabled:opacity-50"
                  >
                    Marquer résolu
                  </button>
                </div>
                <p className="mt-4 text-sm text-ink/70 bg-sand/30 rounded-xl p-4 whitespace-pre-wrap">{d.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {resolvedDisputes.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-ink mb-4">Résolus récemment</h2>
          <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand/30 text-xs uppercase font-bold text-ink/50 border-b border-ink/10">
                <tr>
                  <th className="px-6 py-4">Réservation</th>
                  <th className="px-6 py-4">Résolu le</th>
                  <th className="px-6 py-4">Note</th>
                </tr>
              </thead>
              <tbody>
                {resolvedDisputes.map((d) => (
                  <tr key={d.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-6 py-4 text-ink">{d.booking.eventType} — {d.booking.providerProfile.name}</td>
                    <td className="px-6 py-4 text-ink/50">{d.resolvedAt ? new Date(d.resolvedAt).toLocaleDateString('fr-FR') : "—"}</td>
                    <td className="px-6 py-4 text-ink/50">{d.resolutionNote || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
