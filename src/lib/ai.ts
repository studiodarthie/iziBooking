import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/ratelimit";

export function isAiConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// Quota mensuel : le Coach IA a un coût d'usage réel (appels API facturés au token),
// contrairement au reste de l'offre Premium. Free en a un avant-goût, Premium en illimité
// dans la pratique (plafond haut, juste pour éviter un abus).
const AI_MONTHLY_WINDOW_SEC = 30 * 24 * 60 * 60;
const AI_FREE_QUOTA = 3;
const AI_PREMIUM_QUOTA = 200;

export async function checkAiQuota(userId: string, premium: boolean): Promise<boolean> {
  const limit = premium ? AI_PREMIUM_QUOTA : AI_FREE_QUOTA;
  return rateLimit(`ai:${userId}`, limit, AI_MONTHLY_WINDOW_SEC);
}

function getClient(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const MODEL = "claude-sonnet-5";

export type ProviderContext = {
  name: string;
  category: string;
  specialty?: string | null;
  location: string;
  basePrice?: number | null;
  currency: string;
  bio?: string | null;
};

function contextBlock(p: ProviderContext): string {
  return [
    `Nom du prestataire : ${p.name}`,
    `Catégorie : ${p.category}${p.specialty ? ` (${p.specialty})` : ""}`,
    `Localisation : ${p.location}`,
    p.basePrice ? `Prix de base indiqué : ${p.basePrice.toLocaleString("fr-FR")} ${p.currency}` : "Prix de base : non renseigné",
    p.bio ? `Bio actuelle : ${p.bio}` : "Bio actuelle : aucune",
  ].join("\n");
}

const COACH_SYSTEM_PROMPT = `Tu es le Coach iziBooking, un assistant IA intégré à iziBooking, une marketplace africaine qui met en relation des organisateurs d'événements avec des prestataires (artistes, traiteurs, photographes, DJ, décorateurs, etc.), principalement au Cameroun et en zone CEMAC.

Ton rôle : aider les prestataires à mieux vendre leurs services — tarification, négociation, relation client, organisation, marketing de leur profil. Tu réponds en français, de façon concrète, brève et actionnable (pas de blabla). Tu tiens compte du contexte local : paiements en FCFA, mobile money (Orange Money, MTN MoMo), réalités du marché camerounais/CEMAC. Tu ne donnes jamais de conseil juridique formel (renvoie vers un professionnel si besoin) et tu restes toujours honnête : si tu ne sais pas, dis-le plutôt que d'inventer.

Tu n'es pas un chatbot générique : reste centré sur l'activité du prestataire sur iziBooking.`;

export async function askCoach(params: {
  provider: ProviderContext;
  question: string;
  history?: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  const client = getClient();
  const messages: Anthropic.MessageParam[] = [
    ...(params.history ?? []),
    { role: "user", content: params.question },
  ];

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1200,
    system: `${COACH_SYSTEM_PROMPT}\n\nContexte du prestataire qui te parle :\n${contextBlock(params.provider)}`,
    messages,
  });

  const block = response.content.find((b) => b.type === "text");
  return block?.type === "text" ? block.text : "";
}

export async function generateBioDraft(provider: ProviderContext): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: `${COACH_SYSTEM_PROMPT}\n\nTâche précise : rédige une bio de profil pour ce prestataire, en français, 3 à 5 phrases, chaleureuse et professionnelle, qui donne envie de réserver. Ne mets aucun guillemet ni introduction — réponds uniquement avec le texte de la bio, prêt à être copié tel quel.`,
    messages: [{
      role: "user",
      content: `Voici les informations du prestataire :\n${contextBlock(provider)}\n\nRédige la bio.`
    }],
  });
  const block = response.content.find((b) => b.type === "text");
  return block?.type === "text" ? block.text.trim() : "";
}

export async function generateMessageReply(params: {
  provider: ProviderContext;
  incomingMessage: string;
}): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: `${COACH_SYSTEM_PROMPT}\n\nTâche précise : le prestataire a reçu le message ci-dessous d'un organisateur. Rédige une proposition de réponse en français, professionnelle, chaleureuse et qui avance la conversation (pose une question utile si des informations manquent pour établir un devis). Réponds uniquement avec le texte du message, prêt à être envoyé — pas d'introduction ni de commentaire.`,
    messages: [{
      role: "user",
      content: `Contexte du prestataire :\n${contextBlock(params.provider)}\n\nMessage reçu de l'organisateur :\n"${params.incomingMessage}"\n\nRédige la réponse.`
    }],
  });
  const block = response.content.find((b) => b.type === "text");
  return block?.type === "text" ? block.text.trim() : "";
}

export async function generateQuoteDraft(params: {
  provider: ProviderContext;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  notes?: string | null;
}): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 900,
    system: `${COACH_SYSTEM_PROMPT}\n\nTâche précise : rédige un texte de devis/proposition commerciale en français pour cette demande de réservation, à envoyer tel quel à l'organisateur. Structure-le clairement (contexte, prestation proposée, prix indicatif basé sur le prix de base du prestataire si disponible sinon demande le budget, conditions de réservation). Reste réaliste : si des informations manquent, indique-le et demande-les plutôt que d'inventer un prix précis. Réponds uniquement avec le texte du devis, prêt à être copié.`,
    messages: [{
      role: "user",
      content: `Contexte du prestataire :\n${contextBlock(params.provider)}\n\nDemande de réservation :\nType d'événement : ${params.eventType}\nDate : ${params.eventDate}\nLieu : ${params.eventLocation}\n${params.notes ? `Notes de l'organisateur : ${params.notes}` : "Pas de notes supplémentaires."}\n\nRédige le devis.`
    }],
  });
  const block = response.content.find((b) => b.type === "text");
  return block?.type === "text" ? block.text.trim() : "";
}
