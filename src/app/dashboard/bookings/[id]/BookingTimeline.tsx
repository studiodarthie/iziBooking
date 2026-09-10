"use client";

import { useState } from "react";
import { Check, AlertCircle, ShieldCheck } from "lucide-react";
import { updateBookingStatus, confirmDirectDeposit, initiateOnlineDeposit } from "./actions";
import type { BookingStatus, PaymentMethod } from "@prisma/client";

interface BookingTimelineProps {
  bookingId: string;
  status: string;
  isProvider: boolean;
  totalAmount: number | null;
  couponCode?: string;
  tranzakConfigured: boolean;
}

export function BookingTimeline({ bookingId, status, isProvider, totalAmount, couponCode, tranzakConfigured }: BookingTimelineProps) {
  const [loading, setLoading] = useState(false);
  const [proposedAmount, setProposedAmount] = useState<string>(totalAmount ? totalAmount.toString() : "");
  const [showDirectConfirm, setShowDirectConfirm] = useState(false);
  const [directMethod, setDirectMethod] = useState<PaymentMethod>("MOBILE_MONEY");

  // Map status to steps
  const steps = [
    { id: "PENDING", label: "Demande envoyée" },
    { id: "ACCEPTED", label: "Accord & Devis" },
    { id: "DEPOSIT_PAID", label: "Acompte versé (Sécurisé)" },
    { id: "COMPLETED", label: "Prestation terminée" }
  ];

  const getStepIndex = (s: string) => {
    switch (s) {
      case "PENDING": return 0;
      case "ACCEPTED": return 1;
      case "DEPOSIT_PAID":
      case "CONFIRMED": return 2;
      case "COMPLETED": return 3;
      case "CANCELLED": return -1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);
  const isCancelled = status === "CANCELLED";

  const handleUpdate = async (newStatus: BookingStatus, amount?: number) => {
    setLoading(true);
    await updateBookingStatus(bookingId, newStatus, amount);
    setLoading(false);
  };

  const handleOnlinePayment = async () => {
    setLoading(true);
    const res = await initiateOnlineDeposit(bookingId);
    if (res.success && res.paymentPageUrl) {
      window.location.href = res.paymentPageUrl;
      return;
    }
    setLoading(false);
    alert(res.error || "Une erreur s'est produite.");
  };

  const handleDirectConfirm = async () => {
    if (!confirm("Confirmez-vous avoir réglé l’acompte directement au prestataire (hors plateforme) ?")) return;
    setLoading(true);
    const res = await confirmDirectDeposit(bookingId, directMethod);
    setLoading(false);
    if (res.error) alert(res.error);
    else setShowDirectConfirm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-6 h-full flex flex-col">
      <h2 className="text-xl font-heading font-bold text-ink mb-6">Suivi de la prestation</h2>
      
      {isCancelled ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-red-50 rounded-xl border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
          <h3 className="text-red-700 font-bold mb-1">Réservation annulée</h3>
          <p className="text-red-600/70 text-sm">Cette réservation a été annulée et ne peut plus être modifiée.</p>
        </div>
      ) : (
        <div className="relative flex-1">
          {/* Ligne verticale de fond */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-ink/10"></div>
          
          <div className="space-y-8 relative">
            {steps.map((step, index) => {
              const isPast = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isFuture = index > currentIndex;

              return (
                <div key={step.id} className="relative pl-12">
                  {/* Icône du marqueur */}
                  <div className={`absolute left-0 top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors
                    ${isPast ? 'border-success text-success' : ''}
                    ${isCurrent ? 'border-primary text-primary shadow-[0_0_10px_rgba(181,69,27,0.2)]' : ''}
                    ${isFuture ? 'border-ink/20 text-ink/20' : ''}
                  `}>
                    {isPast ? <Check size={14} className="stroke-[3]" /> : 
                     isCurrent ? <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" /> : 
                     <span className="text-[10px] font-bold">{index + 1}</span>}
                  </div>

                  <div className={`transition-opacity ${isFuture ? 'opacity-50' : 'opacity-100'}`}>
                    <h3 className={`font-bold text-sm ${isCurrent ? 'text-primary' : 'text-ink'}`}>
                      {step.label}
                    </h3>

                    {/* Step 1: PENDING */}
                    {step.id === "PENDING" && isCurrent && isProvider && (
                      <div className="mt-3 p-3 bg-sand/30 rounded-xl border border-ink/5">
                        <p className="text-xs text-ink/70 mb-3">Veuillez étudier la demande et proposer un montant final.</p>
                        {couponCode && (
                          <p className="text-xs text-accent-700 font-medium mb-3">
                            Code promo {couponCode} appliqué par le client — la remise sera déduite automatiquement de ce montant.
                          </p>
                        )}
                        <div className="flex flex-col gap-2">
                          <input 
                            type="number" 
                            placeholder="Montant total (FCFA)"
                            value={proposedAmount}
                            onChange={(e) => setProposedAmount(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white border border-ink/20 rounded-lg focus:outline-none focus:border-primary"
                          />
                          <button 
                            disabled={loading || !proposedAmount}
                            onClick={() => handleUpdate("ACCEPTED", Number(proposedAmount))}
                            className="w-full py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                          >
                            Accepter avec ce montant
                          </button>
                        </div>
                      </div>
                    )}
                    {step.id === "PENDING" && isCurrent && !isProvider && (
                      <p className="text-xs text-ink/60 mt-1">En attente de la réponse du prestataire.</p>
                    )}

                    {/* Step 2: ACCEPTED */}
                    {step.id === "ACCEPTED" && isCurrent && !isProvider && (
                      <div className="mt-3 p-3 bg-accent/10 rounded-xl border border-accent/20 space-y-3">
                        <p className="text-xs text-ink/70">
                          Le devis a été validé. Réglez l’acompte pour sécuriser votre date.
                        </p>

                        {tranzakConfigured && (
                          <button
                            disabled={loading}
                            onClick={handleOnlinePayment}
                            className="w-full py-2.5 bg-trust hover:bg-trust/90 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            <ShieldCheck size={14} /> Payer en ligne maintenant (sécurisé)
                          </button>
                        )}

                        {!showDirectConfirm ? (
                          <button
                            disabled={loading}
                            onClick={() => setShowDirectConfirm(true)}
                            className="w-full text-center text-[11px] text-ink/50 hover:text-ink/80 underline underline-offset-2"
                          >
                            J’ai déjà réglé directement au prestataire (hors plateforme)
                          </button>
                        ) : (
                          <div className="pt-2 border-t border-accent/20 space-y-2">
                            <select
                              value={directMethod}
                              onChange={(e) => setDirectMethod(e.target.value as PaymentMethod)}
                              className="w-full px-2 py-1.5 text-xs bg-white border border-ink/20 rounded-lg focus:outline-none focus:border-primary"
                            >
                              <option value="MOBILE_MONEY">Mobile Money</option>
                              <option value="CASH">Espèces</option>
                              <option value="BANK_TRANSFER">Virement bancaire</option>
                              <option value="OTHER">Autre</option>
                            </select>
                            <button
                              disabled={loading}
                              onClick={handleDirectConfirm}
                              className="w-full py-2 bg-accent-600 hover:bg-accent-700 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                            >
                              Confirmer le paiement direct
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {step.id === "ACCEPTED" && isCurrent && isProvider && (
                      <p className="text-xs text-ink/60 mt-1">En attente du paiement de l’acompte par le client.</p>
                    )}

                    {/* Step 3: DEPOSIT_PAID */}
                    {step.id === "DEPOSIT_PAID" && isCurrent && isProvider && (
                      <div className="mt-3 p-3 bg-success/10 rounded-xl border border-success/20">
                        <p className="text-xs text-ink/70 mb-3">L’événement a-t-il eu lieu avec succès ? Validez pour clôturer.</p>
                        <button 
                          disabled={loading}
                          onClick={() => handleUpdate("COMPLETED")}
                          className="w-full py-2 bg-success hover:bg-success/90 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                        >
                          Marquer comme terminé
                        </button>
                      </div>
                    )}
                    {step.id === "DEPOSIT_PAID" && isCurrent && !isProvider && (
                      <p className="text-xs text-ink/60 mt-1">La date est réservée. Validation finale par le prestataire après l’événement.</p>
                    )}
                    
                    {/* Actions d'annulation (si pas encore complété) */}
                    {isCurrent && step.id !== "COMPLETED" && (
                      <div className="mt-3">
                        <button
                          disabled={loading}
                          onClick={() => handleUpdate("CANCELLED")}
                          className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline"
                        >
                          Annuler la réservation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
