// Pays de la CEMAC. La localisation des prestataires est un texte libre
// (ville ou pays) : on cherche donc aussi les principales villes de chaque pays.
export const CEMAC_COUNTRIES: { name: string; cities: string[] }[] = [
  { name: "Cameroun", cities: ["Douala", "Yaoundé", "Bafoussam", "Garoua", "Bamenda", "Kribi", "Limbé", "Buea", "Bertoua", "Maroua", "Ngaoundéré", "Ebolowa"] },
  { name: "Gabon", cities: ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Lambaréné"] },
  { name: "Congo", cities: ["Brazzaville", "Pointe-Noire", "Dolisie", "Oyo"] },
  { name: "Tchad", cities: ["N'Djamena", "Moundou", "Sarh", "Abéché"] },
  { name: "Centrafrique", cities: ["Bangui", "Bimbo", "Berbérati", "Bouar"] },
  { name: "Guinée équatoriale", cities: ["Malabo", "Bata", "Ebebiyin"] },
];

/** Termes de localisation à rechercher pour une valeur donnée (pays → pays + villes). */
export function locationTerms(loc: string): string[] {
  const country = CEMAC_COUNTRIES.find((c) => c.name.toLowerCase() === loc.trim().toLowerCase());
  return country ? [country.name, ...country.cities] : [loc];
}
