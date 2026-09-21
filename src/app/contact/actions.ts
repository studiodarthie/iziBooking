"use server";

import { headers } from "next/headers";
import { sendContactRequest } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export type ContactState = { status: "idle" | "success" | "error"; message?: string };

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
  if (!(await rateLimit(`contact:${clientIp(h)}`, 3, 600))) {
    return { status: "error", message: "Trop de messages envoyés. Réessayez dans quelques minutes." };
  }

  const sent = await sendContactRequest({ name, email, subject, message });
  if (!sent) {
    return { status: "error", message: "L'envoi a échoué. Écrivez-nous directement à hello@izibooking.app." };
  }
  return { status: "success" };
}
