// Limitation de débit : Upstash Redis (partagé entre toutes les instances Vercel) quand il est
// configuré, sinon repli en mémoire (dev / instance unique). Compatible runtime Edge (fetch seulement).
const memory = new Map<string, number[]>();

function memoryLimit(key: string, limit: number, windowSec: number): boolean {
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter((t) => now - t < windowSec * 1000);
  if (recent.length >= limit) {
    memory.set(key, recent);
    return false;
  }
  recent.push(now);
  memory.set(key, recent);
  return true;
}

/**
 * Fenêtre fixe : au plus `limit` appels par `windowSec` secondes pour une clé donnée.
 * Retourne true si l'appel est autorisé. En cas de panne d'Upstash, on laisse passer
 * (mieux vaut ne pas bloquer les vrais utilisateurs que de couper le site).
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return memoryLimit(key, limit, windowSec);

  const redisKey = `rl:${key}`;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, String(windowSec), "NX"],
      ]),
      signal: AbortSignal.timeout(2000),
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as { result?: number }[];
      const count = Number(data?.[0]?.result);
      if (Number.isFinite(count)) return count <= limit;
    }
  } catch {
    // Upstash injoignable : on laisse passer.
  }
  return true;
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
