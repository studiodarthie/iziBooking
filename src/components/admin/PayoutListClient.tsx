"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markPayoutPaid } from "@/app/admin/payouts/actions";

type PendingPayout = {
  id: string;
  amount: number;
  currency: string;
  commissionAmount: number | null;
  createdAt: Date;
  booking: {
    eventType: string;
    eventDate: Date;
    organizer: { name: string | null };
    providerProfile: { name: string; whatsapp: string | null; user: { email: string | null } };
  };
};

type PaidPayout = {
  id: string;
  amount: number;
  currency: string;
  payoutAt: Date | null;
  payoutNote: string | null;
  booking: { providerProfile: { name: string } };
};

export function PayoutListClient({ pendingPayouts, paidPayouts }: { pendingPayouts: PendingPayout[]; paidPayouts: PaidPayout[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleMarkPaid = async (id: string) => {
    if (!confirm("Confirmes-tu avoir reversé cette somme au prestataire ?")) return;
    setBusyId(id);
    const res = await markPayoutPaid(id, notes[id]);
    setBusyId(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">À reverser ({pendingPayouts.length})</h2>

        {pendingPayouts.length === 0 ? (
          <div className="bg-white border border-ink/10 border-dashed rounded-2xl p-10 text-center text-ink/50">
            Rien en attente — tous les acomptes encaissés en ligne ont été reversés.
          </div>
        ) : (
          <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand/30 text-xs uppercase font-bold text-ink/50 border-b border-ink/10">
                <tr>
                  <th className="px-6 py-4">Prestataire</th>
                  <th className="px-6 py-4">Réservation</th>
                  <th className="px-6 py-4">Encaissé</th>
                  <th className="px-6 py-4">Commission</th>
                  <th className="px-6 py-4">Net à reverser</th>
                  <th className="px-6 py-4">Référence</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayouts.map((p) => {
                  const commission = p.commissionAmount ?? 0;
                  const net = p.amount - commission;
                  const contact = p.booking.providerProfile.whatsapp || p.booking.providerProfile.user.email || "—";
                  return (
                    <tr key={p.id} className="border-b border-ink/5 last:border-0 align-top">
                      <td className="px-6 py-4">
                        <div className="font-bold text-ink">{p.booking.providerProfile.name}</div>
                        <div className="text-xs text-ink/50">{contact}</div>
                      </td>
                      <td className="px-6 py-4 text-ink/70">
                        {p.booking.eventType}
                        <div className="text-xs text-ink/40">pour {p.booking.organizer.name || "un organisateur"}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-ink">{p.amount.toLocaleString('fr-FR')} {p.currency}</td>
                      <td className="px-6 py-4 text-ink/60">{commission.toLocaleString('fr-FR')} {p.currency}</td>
                      <td className="px-6 py-4 font-bold text-success">{net.toLocaleString('fr-FR')} {p.currency}</td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder="Réf. du virement"
                          value={notes[p.id] || ""}
                          onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })}
                          className="w-32 px-2 py-1.5 text-xs bg-sand/30 border border-ink/10 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          disabled={busyId === p.id}
                          onClick={() => handleMarkPaid(p.id)}
                          className="text-xs font-bold text-primary hover:underline disabled:opacity-50"
                        >
                          Marquer reversé
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {paidPayouts.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-ink mb-4">Reversés récemment</h2>
          <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand/30 text-xs uppercase font-bold text-ink/50 border-b border-ink/10">
                <tr>
                  <th className="px-6 py-4">Prestataire</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Reversé le</th>
                  <th className="px-6 py-4">Référence</th>
                </tr>
              </thead>
              <tbody>
                {paidPayouts.map((p) => (
                  <tr key={p.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-6 py-4 text-ink">{p.booking.providerProfile.name}</td>
                    <td className="px-6 py-4 text-ink/70">{p.amount.toLocaleString('fr-FR')} {p.currency}</td>
                    <td className="px-6 py-4 text-ink/50">
                      {p.payoutAt ? new Date(p.payoutAt).toLocaleDateString('fr-FR') : "—"}
                    </td>
                    <td className="px-6 py-4 text-ink/50">{p.payoutNote || "—"}</td>
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
