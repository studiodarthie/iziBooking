"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { openDispute } from "./actions";

type Dispute = {
  status: string;
  reason: string;
  resolutionNote: string | null;
  createdAt: Date;
} | null;

export function DisputeSection({ bookingId, dispute }: { bookingId: string; dispute: Dispute }) {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (dispute || submitted) {
    const isOpen = dispute?.status === "OPEN" && !submitted;
    return (
      <div className={`rounded-2xl border p-6 ${isOpen ? "bg-red-50 border-red-100" : "bg-white border-ink/10"}`}>
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-2 text-red-600">
          <AlertTriangle className="w-4 h-4" /> Litige {isOpen ? "en cours" : "résolu"}
        </h3>
        <p className="text-sm text-ink/70 whitespace-pre-wrap">{dispute?.reason}</p>
        {dispute?.resolutionNote && (
          <p className="text-xs text-ink/50 mt-3 pt-3 border-t border-ink/10">
            Résolution : {dispute.resolutionNote}
          </p>
        )}
        {submitted && !dispute && (
          <p className="text-xs text-ink/50">L&apos;équipe iziBooking a été notifiée et va l&apos;examiner.</p>
        )}
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="text-xs text-ink/40 hover:text-red-500 underline underline-offset-2 text-left"
      >
        Signaler un problème avec cette réservation
      </button>
    );
  }

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    const res = await openDispute(bookingId, reason);
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-ink/10 p-6 space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink/50">
        <AlertTriangle className="w-4 h-4" /> Signaler un problème
      </h3>
      <textarea
        rows={3}
        placeholder="Décrivez le désaccord ou le problème rencontré..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-sand/30 border border-ink/10 rounded-lg focus:outline-none focus:border-primary resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={() => setShowForm(false)}
          className="px-4 py-2 text-xs font-semibold text-ink bg-white border border-ink/20 rounded-lg hover:bg-sand/50"
        >
          Annuler
        </button>
        <button
          disabled={loading || !reason.trim()}
          onClick={handleSubmit}
          className="flex-1 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
        >
          Envoyer à l&apos;équipe iziBooking
        </button>
      </div>
    </div>
  );
}
