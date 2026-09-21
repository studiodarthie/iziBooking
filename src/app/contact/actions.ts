"use server";

import { headers } from "next/headers";
import { sendContactRequest } from "@/lib/email";

export type ContactState = { status: "idle" | "success" | "error"; message?: string };

// Limitation simple par IP (en mémoire : efficace par instance, suffisant contre le spam basique).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Champ piège : les robots le remplissent, pas les humains.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { status: "error", message: "Merci de remplir tous les champs." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return { status: "error", message: "Adresse email invalide." };
  }
  if (name.length > 100 || subject.length > 150 || message.length < 10 || message.length > 3000) {
    return { status: "error", message: "Votre message doit faire entre 10 et 3000 caractères." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return { status: "error", message: "Trop de messages envoyés. Réessayez dans quelques minutes." };
  }

  const sent = await sendContactRequest({ name, email, subject, message });
  if (!sent) {
    return { status: "error", message: "L'envoi a échoué. Écrivez-nous directement à hello@izibooking.app." };
  }
  return { status: "success" };
}
