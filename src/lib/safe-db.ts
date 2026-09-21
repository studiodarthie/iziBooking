/**
 * Exécute une requête base de données sans jamais faire échouer la page : un nouvel essai après
 * 1,5 s (réveil de Neon), puis la valeur de repli si la base reste injoignable.
 */
export async function safeDb<T>(query: () => Promise<T>, fallback: T, retries = 1): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await query();
    } catch (error) {
      if (attempt === retries) {
        console.error("Base de données indisponible :", error instanceof Error ? error.message.split("\n").filter(Boolean).slice(-1)[0] : error);
        return fallback;
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  return fallback;
}
