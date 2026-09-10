import { timingSafeEqual } from "crypto";

const PRODUCTION_BASE_URL = "https://dsapi.tranzak.me";
const SANDBOX_BASE_URL = "https://sandbox.dsapi.tranzak.me";

function getConfig() {
  const appId = process.env.TRANZAK_APP_ID;
  const appKey = process.env.TRANZAK_API_KEY;
  const authKey = process.env.TRANZAK_AUTH_KEY;
  if (!appId || !appKey || !authKey) return null;

  const baseUrl = appKey.startsWith("SAND_") ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL;
  return { appId, appKey, authKey, baseUrl };
}

export function isTranzakConfigured(): boolean {
  return getConfig() !== null;
}

// Un jeton par process serveur, régénéré un peu avant son expiration (7200s côté Tranzak).
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const config = getConfig();
  if (!config) throw new Error("Tranzak n'est pas configuré (variables d'environnement manquantes).");

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch(`${config.baseUrl}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appId: config.appId, appKey: config.appKey }),
  });

  const json = await res.json();
  if (!res.ok || !json?.success || !json?.data?.token) {
    throw new Error(`Échec d'authentification Tranzak : ${JSON.stringify(json)}`);
  }

  const expiresInMs = (json.data.expiresIn ?? 7200) * 1000;
  cachedToken = { token: json.data.token, expiresAt: Date.now() + expiresInMs - 60_000 };
  return cachedToken.token;
}

export async function initiateSubscriptionPayment(params: {
  amount: number;
  currencyCode: string;
  description: string;
  mchTransactionRef: string;
  returnUrl: string;
}): Promise<{ requestId: string; paymentPageUrl: string | null; raw: unknown }> {
  const config = getConfig();
  if (!config) throw new Error("Tranzak n'est pas configuré (variables d'environnement manquantes).");

  const token = await getAccessToken();

  const res = await fetch(`${config.baseUrl}/xp021/v1/request/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-App-ID": config.appId,
    },
    body: JSON.stringify({
      amount: params.amount,
      currencyCode: params.currencyCode,
      description: params.description,
      mchTransactionRef: params.mchTransactionRef,
      returnUrl: params.returnUrl,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json?.success || !json?.data?.requestId) {
    throw new Error(`Échec de création de la demande de paiement Tranzak : ${JSON.stringify(json)}`);
  }

  // Le nom exact du champ de redirection dans `links` n'est pas confirmé par la doc consultée
  // (elle renvoie vers la section "Details" sans détailler le sous-objet `links`) — on essaie les
  // clés les plus probables. À vérifier lors du premier vrai test et ajuster si besoin.
  const links = json.data.links ?? {};
  const paymentPageUrl: string | null =
    links.paymentPageUrl ?? links.checkoutPageUrl ?? links.checkoutUrl ?? links.paymentUrl ?? null;

  return { requestId: json.data.requestId, paymentPageUrl, raw: json.data };
}

// Le webhook Tranzak inclut la clé d'authentification directement dans le corps JSON
// (champ `authKey`), pas dans un header séparé — on la compare en temps constant à la
// valeur configurée pour ne jamais faire confiance à un appel non authentifié.
export function verifyTranzakWebhookAuth(payloadAuthKey: unknown): boolean {
  const config = getConfig();
  if (!config) return false;
  if (typeof payloadAuthKey !== "string" || !payloadAuthKey) return false;

  const expected = Buffer.from(config.authKey);
  const received = Buffer.from(payloadAuthKey);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}
