"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { askCoachAction } from "@/app/dashboard/coach/actions";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Comment fixer mon prix pour un mariage de 200 personnes ?",
  "Comment répondre à un organisateur qui négocie trop ?",
  "Comment rédiger une bonne description de service ?",
  "Un client ne répond plus après mon devis, que faire ?",
];

export function CoachChat({ premium, quotaHint }: { premium: boolean; quotaHint: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setError(null);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: question.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const res = await askCoachAction(question.trim(), messages);
    setLoading(false);

    if (res.success) {
      setMessages([...nextMessages, { role: "assistant", content: res.answer }]);
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="bg-white border border-ink/10 rounded-2xl flex flex-col h-[70vh]">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-ink/10">
        <div className="w-10 h-10 rounded-xl bg-accent-2/10 text-accent-2-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-ink">Coach iziBooking</p>
          <p className="text-xs text-ink/50">{quotaHint}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-ink/60">
              Posez une question sur votre tarification, vos réponses aux clients, ou la gestion de votre activité sur iziBooking.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs text-left bg-sand/60 hover:bg-sand text-ink/80 px-3 py-2 rounded-xl transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-primary text-white" : "bg-sand/60 text-ink"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-sand/60 text-ink/60 rounded-2xl px-4 py-2.5 text-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Le coach réfléchit…
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
            {!premium && error.includes("Premium") && (
              <a href="/dashboard/settings/premium" className="block mt-1 font-bold underline">
                Passer en Premium
              </a>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 p-4 border-t border-ink/10"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez votre question…"
          className="flex-1 bg-sand/40 border border-ink/10 rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-10 h-10 shrink-0 rounded-xl bg-primary hover:bg-accent-600 text-white flex items-center justify-center transition-colors disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
