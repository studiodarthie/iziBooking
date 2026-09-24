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

/** Adresse d'expédition avec un nom affiché — un "from" nu nuit à la délivrabilité. */
function fromAddress(): string {
  const raw = process.env.EMAIL_FROM || "no-reply@izibooking.app";
  return raw.includes("<") ? raw : `iziBooking <${raw}>`;
}

async function sendEmail(params: { to: string; subject: string; html: string; text?: string }) {
  if (!process.env.EMAIL_SERVER_HOST) {
    console.warn(`SMTP non configuré — email "${params.subject}" non envoyé à ${params.to}`);
    return;
  }

  try {
    await getTransport().sendMail({
      from: fromAddress(),
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
  } catch (error) {
    // Un email qui ne part pas ne doit jamais faire échouer l'action métier (réservation, message).
    console.error(`Erreur d'envoi email ("${params.subject}" à ${params.to}):`, error);
  }
}

// Pied de page présent sur chaque email : identifie clairement l'expéditeur (bonne pratique
// anti-spam/RGPD) et évite le rendu "template vide" qui déclenche certains filtres de contenu.
const EMAIL_FOOTER = `
  <p style="margin: 32px 0 0; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; line-height: 1.6; color: #999;">
    iziBooking.app — Ets Darthie, Douala, Cameroun<br/>
    Vous recevez cet email suite à une action effectuée sur iziBooking.app. Une question ? Écrivez-nous à hello@izibooking.app.
  </p>
`;

function emailShell(title: string, bodyHtml: string, ctaHref: string, ctaLabel: string): string {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #232323;">
      <p style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #B5451B; margin: 0 0 16px;">iziBooking</p>
      <h1 style="font-size: 20px; margin: 0 0 16px;">${title}</h1>
      <div style="font-size: 14px; line-height: 1.6; color: #444;">${bodyHtml}</div>
      <a href="${ctaHref}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #B5451B; color: #fff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">${ctaLabel}</a>
      ${EMAIL_FOOTER}
    </div>
  `;
}

/**
 * Email de connexion (lien magique NextAuth). Doit lever une exception en cas d'échec
 * d'envoi réel (NextAuth l'attend pour rediriger vers la page d'erreur), contrairement aux
 * autres emails de notification ci-dessus qui avalent l'erreur.
 */
export async function sendSignInEmail(params: { to: string; url: string }) {
  const transport = getTransport();
  const result = await transport.sendMail({
    from: fromAddress(),
    to: params.to,
    subject: "Votre lien de connexion iziBooking",
    text: `Connectez-vous à iziBooking en ouvrant ce lien (valable 24h, usage unique) :\n${params.url}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email sans risque.\n\niziBooking.app — Ets Darthie, Douala, Cameroun`,
    html: emailShell(
      "Votre lien de connexion",
      `<p>Bonjour,</p>
       <p>Voici votre lien pour vous connecter à votre compte iziBooking. Il est valable 24 heures et ne peut être utilisé qu'une seule fois.</p>
       <p style="color:#888; font-size:12px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email sans risque.</p>`,
      params.url,
      "Se connecter"
    ),
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email (${failed.join(", ")}) could not be sent`);
  }
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

export async function notifyContactMessage(params: {
  providerEmail: string;
  senderName: string;
  content: string;
}) {
  const preview = params.content.length > 300 ? `${params.content.slice(0, 300)}…` : params.content;
  await sendEmail({
    to: params.providerEmail,
    subject: `Nouveau message de contact — ${params.senderName}`,
    html: emailShell(
      "Nouveau message",
      `<p><strong>${params.senderName}</strong> vous a contacté via votre fiche iziBooking :</p>
       <p style="padding: 12px 16px; background: #F4E9D8; border-radius: 10px; font-style: italic;">« ${preview} »</p>`,
      `${BASE_URL}/dashboard/messages`,
      "Voir le message"
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

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Message du formulaire de contact public, envoyé à l'équipe. Retourne false si l'envoi échoue. */
export async function sendContactRequest(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const to = "hello@izibooking.app";
  if (!process.env.EMAIL_SERVER_HOST) {
    console.warn(`SMTP non configuré — message de contact de ${params.email} non envoyé`);
    return false;
  }

  try {
    await getTransport().sendMail({
      from: fromAddress(),
      to,
      replyTo: `${params.name.replace(/[<>"\r\n]/g, "")} <${params.email}>`,
      subject: `[Contact] ${params.subject.replace(/[\r\n]/g, " ")}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #232323;">
          <p style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #B5451B; margin: 0 0 12px;">Nouveau message de contact</p>
          <p style="margin: 0 0 4px;"><strong>${escapeHtml(params.name)}</strong> &lt;${escapeHtml(params.email)}&gt;</p>
          <p style="margin: 0 0 16px; color: #666;">Sujet : ${escapeHtml(params.subject)}</p>
          <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap; border-left: 3px solid #C9982B; padding-left: 12px;">${escapeHtml(params.message)}</div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Erreur d'envoi du message de contact:", error);
    return false;
  }
}

/**
 * Notifie l'équipe iziBooking dès qu'un compte est créé (première connexion Google ou lien
 * magique), avant même que la personne n'ait choisi Organisateur ou Prestataire dans l'onboarding.
 * Complémentaire de notifyNewProviderSignup ci-dessous, qui arrive plus tard avec le détail du
 * profil (catégorie, ville) une fois l'onboarding prestataire terminé — celui-ci permet de voir
 * toutes les inscriptions, y compris les organisateurs et les onboardings jamais terminés.
 */
export async function notifyNewUserSignup(params: { name: string | null; email: string | null; phone?: string | null; via?: string }) {
  // Un compte peut n'avoir ni email ni nom (connexion par téléphone) : on affiche ce qu'on a.
  const contact = params.email || params.phone || "contact inconnu";
  await sendEmail({
    to: "itsizibooking@gmail.com",
    subject: `Nouvelle inscription — ${params.name || contact}`,
    html: emailShell(
      "Nouvelle inscription",
      `<p><strong>${escapeHtml(params.name || "Sans nom")}</strong> (${escapeHtml(contact)}${params.via ? `, via ${escapeHtml(params.via)}` : ""}) vient de créer un compte sur iziBooking.</p>
       <p>Pas encore de profil à vérifier à ce stade — vous recevrez un second email dès que la personne choisira "Prestataire" et complétera son profil.</p>`,
      `${BASE_URL}/admin/users`,
      "Voir dans l'admin"
    ),
  });
}

/** Notifie l'équipe iziBooking qu'un nouveau prestataire vient de finaliser son profil. */
export async function notifyNewProviderSignup(params: {
  providerId: string;
  providerName: string;
  category: string;
  location: string;
}) {
  await sendEmail({
    to: "itsizibooking@gmail.com",
    subject: `Nouveau prestataire inscrit — ${params.providerName}`,
    html: emailShell(
      "Nouveau prestataire",
      `<p><strong>${escapeHtml(params.providerName)}</strong> vient de créer son profil sur iziBooking.</p>
       <p style="margin: 12px 0; padding: 12px 16px; background: #F4E9D8; border-radius: 10px;">
         Catégorie : <strong>${escapeHtml(params.category)}</strong><br/>
         Localisation : <strong>${escapeHtml(params.location)}</strong>
       </p>
       <p>Pensez à vérifier son profil pour qu'il apparaisse en priorité dans les résultats.</p>`,
      `${BASE_URL}/admin/providers`,
      "Voir dans l'admin"
    ),
  });
}
