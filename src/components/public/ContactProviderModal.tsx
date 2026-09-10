"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Mail, X, Loader2, CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "@/app/p/[id]/actions";

export function ContactProviderModal({ providerProfileId, providerName }: { providerProfileId: string; providerName: string }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setContent("");
    setError(null);
    setSent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    const res = await sendContactMessage(providerProfileId, content);
    setIsSending(false);
    if (res.success) {
      setSent(true);
    } else {
      setError(res.error || "Erreur lors de l'envoi du message.");
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex-1 px-4 py-3.5 bg-white text-[#0d0d0d] font-semibold rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <Mail size={18} />
        Envoyer un message
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40" onClick={handleClose}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700">
              <X size={20} />
            </button>

            {sent ? (
              <div className="flex flex-col items-center text-center py-6">
                <CheckCircle2 size={40} className="text-green-600 mb-3" />
                <h3 className="text-lg font-bold text-[#0d0d0d] mb-1">Message envoyé</h3>
                <p className="text-sm text-neutral-500">{providerName} a été notifié par email et pourra vous répondre.</p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-[#B5451B] text-white font-semibold hover:bg-[#9a3915] transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-bold text-[#0d0d0d] mb-1">Message à {providerName}</h3>
                <p className="text-sm text-neutral-500 mb-4">
                  Posez votre question avant de faire une demande de réservation.
                </p>
                <textarea
                  required
                  autoFocus
                  rows={5}
                  maxLength={2000}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Bonjour, je souhaiterais avoir plus d'informations sur vos prestations...`}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#B5451B] focus:ring-1 focus:ring-[#B5451B] outline-none resize-none text-sm"
                />
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                <button
                  type="submit"
                  disabled={isSending || !content.trim()}
                  className="mt-4 w-full px-5 py-3 rounded-xl bg-[#B5451B] text-white font-semibold hover:bg-[#9a3915] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSending ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                  {isSending ? "Envoi..." : "Envoyer"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
