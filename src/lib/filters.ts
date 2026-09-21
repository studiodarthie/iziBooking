// Options des menus de filtres du catalogue et des occasions assurées par les prestataires.
export const OCCASIONS = [
  "Fête",
  "Fête d'entreprise",
  "Mariage",
  "Événement",
  "Cérémonie",
  "Réception",
  "Dîner",
  "Festival",
  "Spectacle en ligne",
];

export const GENRES = [
  "Afrobeat",
  "Makossa",
  "Bikutsi",
  "Rumba",
  "Coupé-décalé",
  "Amapiano",
  "Gospel",
  "Hip-hop",
  "Jazz",
  "Musique traditionnelle",
  "DJ set",
];

// Valeur de l'URL ("min-max", borne vide = illimitée) → libellé du menu.
export const BUDGETS = [
  { value: "0-50000", label: "Moins de 50 000 FCFA" },
  { value: "50000-150000", label: "50 000 – 150 000 FCFA" },
  { value: "150000-400000", label: "150 000 – 400 000 FCFA" },
  { value: "400000-", label: "Plus de 400 000 FCFA" },
];

export function parseBudget(value: string | undefined): { min?: number; max?: number } {
  const match = BUDGETS.find((b) => b.value === value);
  if (!match) return {};
  const [min, max] = match.value.split("-");
  return { min: min ? parseInt(min, 10) : undefined, max: max ? parseInt(max, 10) : undefined };
}
