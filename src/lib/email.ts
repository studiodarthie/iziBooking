import nodemailer from "nodemailer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
}

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

async function sendEmail(params: { to: string; subject: string; html: string }) {
  if (!process.env.EMAIL_SERVER_HOST) {
    console.warn(`SMTP non configuré — email "${params.subject}" non envoyé à ${params.to}`);
    return;
  }

  try {
    await getTransport().sendMail({
      from: process.env.EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  } catch (error) {
    // Un email qui ne part pas ne doit jamais faire échouer l'action métier (réservation, message).
    console.error(`Erreur d'envoi email ("${params.subject}" à ${params.to}):`, error);
  }
}

function emailShell(title: string, bodyHtml: string, ctaHref: string, ctaLabel: string): string {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #232323;">
      <p style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #B5451B; margin: 0 0 16px;">iziBooking</p>
      <h1 style="font-size: 20px; margin: 0 0 16px;">${title}</h1>
      <div style="font-size: 14px; line-height: 1.6; color: #444;">${bodyHtml}</div>
      <a href="${ctaHref}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #B5451B; color: #fff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">${ctaLabel}</a>
    </div>
  `;
}

export async function notifyNewBooking(params: {
  providerEmail: string;
  organizerName: string;
  eventType: string;
  eventDate: Date;
  bookingId: string;
}) {
  const eventDateLabel = format(params.eventDate, "EEEE d MMMM yyyy", { locale: fr });
  await sendEmail({
    to: params.providerEmail,
    subject: `Nouvelle demande de réservation — ${params.eventType}`,
    html: emailShell(
      "Nouvelle demande de réservation",
      `<p><strong>${params.organizerName}</strong> vous a envoyé une demande pour un événement de type <strong>${params.eventType}</strong>, prévu le ${eventDateLabel}.</p>
       <p>Consultez la demande pour l'étudier et proposer votre devis.</p>`,
      `${BASE_URL}/dashboard/bookings/${params.bookingId}`,
      "Voir la demande"
    ),
  });
}

export async function notifyNewMessage(params: {
  recipientEmail: string;
  senderName: string;
  content: string;
  bookingId: string;
}) {
  const preview = params.content.length > 140 ? `${params.content.slice(0, 140)}…` : params.content;
  await sendEmail({
    to: params.recipientEmail,
    subject: `Nouveau message de ${params.senderName}`,
    html: emailShell(
      "Nouveau message",
      `<p><strong>${params.senderName}</strong> vous a écrit :</p>
       <p style="padding: 12px 16px; background: #F4E9D8; border-radius: 10px; font-style: italic;">« ${preview} »</p>`,
      `${BASE_URL}/dashboard/bookings/${params.bookingId}`,
      "Répondre"
    ),
  });
}
