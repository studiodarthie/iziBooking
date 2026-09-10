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
