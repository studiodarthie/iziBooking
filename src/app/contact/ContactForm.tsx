"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { submitContact, type ContactState } from "./actions";

const SUBJECTS = ["Une question générale", "Je suis organisateur", "Je suis prestataire", "Paiement ou réservation", "Un litige", "Autre"];

const field =
  "w-full bg-white border border-neutral-400 rounded-xl px-4 text-[14px] text-ink font-medium placeholder:text-neutral-700 placeholder:font-normal hover:border-neutral-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-colors";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });

  if (state.status === "success") {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200 p-10 text-center shadow-xl shadow-primary/5">
        <span className="w-16 h-16 rounded-full bg-trust-tint text-trust flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} />
        </span>
        <h3 className="font-heading font-bold text-2xl text-ink mt-5">Message envoyé !</h3>
        <p className="text-neutral-700 mt-2">Merci de nous avoir écrit. Nous vous répondrons par email dès que possible.</p>
      </div>
    );
  }

  return (
    <form action={action} className="bg-white rounded-3xl border border-neutral-300 p-6 md:p-8 shadow-xl shadow-primary/5 flex flex-col gap-4">
      {/* Champ piège anti-robots, invisible pour les humains */}
      <div className="hidden" aria-hidden>
        <label>
          Site web <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-ink mb-1.5">Nom complet</label>
          <input id="name" name="name" type="text" required maxLength={100} placeholder="Votre nom" className={`${field} h-12`} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">Email</label>
          <input id="email" name="email" type="email" required maxLength={200} placeholder="vous@exemple.com" className={`${field} h-12`} />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-ink mb-1.5">Sujet</label>
        <select id="subject" name="subject" required defaultValue="" className={`${field} h-12 cursor-pointer`}>
          <option value="" disabled>Choisir un sujet</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-ink mb-1.5">Message</label>
        <textarea id="message" name="message" required minLength={10} maxLength={3000} rows={6} placeholder="Comment pouvons-nous vous aider ?" className={`${field} py-3 resize-y`} />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-14 bg-primary hover:bg-accent-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/30"
      >
        {pending ? "Envoi en cours…" : <>Envoyer le message <Send size={16} /></>}
      </button>
    </form>
  );
}
