import type { ProviderPlan } from "@prisma/client";

type PlanFields = {
  plan: ProviderPlan;
  planExpiresAt: Date | null;
};

// Calculé à la volée à chaque lecture, jamais un flag figé en base :
// un plan PREMIUM dont la date d'expiration est passée ne compte plus comme actif.
export function isPremium(profile: PlanFields): boolean {
  if (profile.plan !== "PREMIUM") return false;
  if (!profile.planExpiresAt) return true;
  return profile.planExpiresAt.getTime() > Date.now();
}

export function getCommissionRate(profile: PlanFields): number {
  return isPremium(profile) ? 0.06 : 0.12;
}

export const FREE_PHOTO_LIMIT = 3;
export const FREE_SERVICE_LIMIT = 2;

// Nombre de jours offerts en Premium à l'inscription d'un nouveau profil prestataire,
// pour l'inciter à s'inscrire sans engagement immédiat.
export const TRIAL_DAYS = 20;

export type PremiumTier = {
  id: "1m" | "3m" | "6m";
  label: string;
  months: number;
  days: number;
  price: number;
  /** Prix équivalent par mois, pour affichage comparatif. */
  perMonth: number;
  popular?: boolean;
};

// Plus l'engagement est long, plus le tarif mensuel baisse — sans reconduction automatique :
// à l'expiration, le compte repasse simplement en Free.
export const PREMIUM_TIERS: PremiumTier[] = [
  { id: "1m", label: "1 mois", months: 1, days: 30, price: 2999, perMonth: 2999 },
  { id: "3m", label: "3 mois", months: 3, days: 90, price: 7500, perMonth: 2500, popular: true },
  { id: "6m", label: "6 mois", months: 6, days: 180, price: 13500, perMonth: 2250 },
];

export function getPremiumTier(id: string): PremiumTier | undefined {
  return PREMIUM_TIERS.find((t) => t.id === id);
}
