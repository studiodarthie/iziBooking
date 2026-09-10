"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage, updateBookingStatus } from "./actions";
import { Send, CheckCircle2, XCircle, FileText } from "lucide-react";
import type { BookingStatus } from "@prisma/client";

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
};

export function ChatBox({
  bookingId,
  messages,
  currentUserId,
  bookingStatus,
  totalAmount,
  isProvider
}: {
  bookingId: string;
  messages: Message[];
  currentUserId: string;
  bookingStatus: string;
  totalAmount: number | null;
  isProvider: boolean;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [proposedPrice, setProposedPrice] = useState<string>(totalAmount?.toString() || "");
  const [showPriceInput, setShowPriceInput] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    const text = content;
    setContent(""); // optimistically clear

    await sendMessage(bookingId, text);
    
    setLoading(false);
  };

  const handleStatusChange = async (newStatus: BookingStatus, price?: number) => {
    setStatusLoading(true);
    await updateBookingStatus(bookingId, newStatus, price);
    setStatusLoading(false);
    setShowPriceInput(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden relative">
      
      {/* Sticky Header / Actions */}
      <div className="bg-sand/30 border-b border-ink/10 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-ink">Espace d’échange</h3>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white border border-ink/10 text-ink/70">
            {bookingStatus}
          </span>
        </div>

        {/* Provider Actions */}
        {isProvider && bookingStatus === "PENDING" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {!showPriceInput ? (
              <>
                <button 
                  onClick={() => handleStatusChange("ACCEPTED")}
                  disabled={statusLoading}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 size={16} /> Accepter
                </button>
                <button 
                  onClick={() => setShowPriceInput(true)}
                  disabled={statusLoading}
                  className="px-3 py-1.5 bg-white border border-ink/20 text-ink text-sm font-semibold rounded-lg hover:bg-sand transition-colors flex items-center gap-1.5"
                >
                  <FileText size={16} /> Proposer un prix
                </button>
                <button 
                  onClick={() => handleStatusChange("CANCELLED")}
                  disabled={statusLoading}
                  className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1.5 ml-auto"
                >
                  <XCircle size={16} /> Refuser
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder="Prix (ex: 500)"
                  className="flex-1 px-3 py-1.5 bg-white border border-ink/20 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button 
                  onClick={() => handleStatusChange("PENDING", Number(proposedPrice))}
                  disabled={statusLoading || !proposedPrice}
                  className="px-3 py-1.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Valider
                </button>
                <button 
                  onClick={() => setShowPriceInput(false)}
                  className="px-3 py-1.5 bg-sand text-ink text-sm font-semibold rounded-lg hover:bg-ink/5 transition-colors"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        )}

        {/* Organizer Actions (if Provider proposed a new price, but still PENDING) */}
        {!isProvider && bookingStatus === "PENDING" && totalAmount && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-ink">Devis proposé : <strong className="text-primary">{totalAmount}</strong></span>
            <button 
              onClick={() => handleStatusChange("CONFIRMED")}
              disabled={statusLoading}
              className="px-3 py-1.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 size={16} /> Confirmer
            </button>
          </div>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-ink/40 text-sm">
            Aucun message. Commencez la discussion !
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div 
                  className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                    isMe 
                      ? "bg-primary text-white rounded-br-sm" 
                      : "bg-sand text-ink rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[10px] text-ink/40 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-ink/10 flex items-center gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez un message..."
          className="flex-1 px-4 py-2.5 bg-sand/30 border border-ink/10 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-ink"
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-10 h-10 shrink-0 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-50"
        >
          <Send size={18} className="ml-1" />
        </button>
      </form>
      
    </div>
  );
}
