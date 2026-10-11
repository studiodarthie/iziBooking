import { PosterTheme } from "@prisma/client";

/**
 * Générateur d'affiches "J'y serai" — tout le rendu passe par des transformations Cloudinary
 * chaînées dans l'URL, sans appel serveur au SDK Cloudinary.
 *
 * Deux modes :
 * - Gabarit personnalisé : l'organisateur a fourni un PNG avec une zone transparente ; il est
 *   superposé tel quel sur la photo du visiteur (même principe que les cadres Facebook/Twibbon).
 * - Généré automatiquement (repli, aucun design requis) : la photo recadrée en cercle sur un
 *   fond de couleur unie, avec le titre et la date en texte superposé.
 */

export const POSTER_THEMES: Record<PosterTheme, { label: string; bg: string; accent: string; text: string }> = {
  BRIQUE: { label: "Brique", bg: "331408", accent: "C9982B", text: "FFFFFF" },
  DORE: { label: "Doré", bg: "332709", accent: "F2E0AC", text: "FFFFFF" },
  FORET: { label: "Forêt", bg: "0D1F17", accent: "E7EDE9", text: "FFFFFF" },
};

const GENERATED_CANVAS_W = 1080;
const GENERATED_CANVAS_H = 1350;

/** Taille recommandée pour un gabarit personnalisé, affichée dans l'UI d'upload. */
export const RECOMMENDED_TEMPLATE_SIZE = "1080 × 1350 px";

function cloudName(): string {
  const name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!name) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME manquant");
  return name;
}

/** Un public_id utilisé dans un calque (l_...) doit avoir ses "/" remplacés par ":". */
function layerId(publicId: string): string {
  return publicId.replace(/\//g, ":");
}

/** Encode un texte pour une transformation Cloudinary (l_text:...). */
function encodeCloudinaryText(value: string): string {
  return encodeURIComponent(value)
    .replace(/%2C/g, "%252C") // virgule = séparateur de transformation, doit être doublement encodée
    .replace(/\//g, "%252F");
}

export function slugifyPosterTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "evenement";
}

export type PosterTemplate = { publicId: string; width: number; height: number };

/** Aperçu du gabarit seul, avant que le visiteur n'ajoute sa photo. */
export function buildTemplatePreviewUrl(template: PosterTemplate): string {
  return `https://res.cloudinary.com/${cloudName()}/image/upload/w_${template.width},h_${template.height},c_fill/f_auto,q_auto/${template.publicId}`;
}

export function buildPosterUrl(params: {
  photoPublicId: string;
  title: string;
  eventDateLabel?: string | null;
  theme: PosterTheme;
  showWatermark: boolean;
  template?: PosterTemplate | null;
}): string {
  const { photoPublicId, theme, showWatermark, template } = params;
  const steps = template
    ? customTemplateSteps({ theme, showWatermark, template })
    : generatedSteps(params);
  steps.push("f_auto,q_auto");
  return `https://res.cloudinary.com/${cloudName()}/image/upload/${steps.join("/")}/${photoPublicId}`;
}

/** Mode gabarit personnalisé : photo redimensionnée au format du gabarit, gabarit posé par-dessus. */
function customTemplateSteps(params: {
  theme: PosterTheme;
  showWatermark: boolean;
  template: PosterTemplate;
}): string[] {
  const { theme, showWatermark, template } = params;
  const { publicId, width, height } = template;
  const t = POSTER_THEMES[theme];

  const steps: string[] = [
    `w_${width},h_${height},c_fill,g_auto`,
    `l_${layerId(publicId)},w_${width},h_${height},c_fill/fl_layer_apply,g_north_west,x_0,y_0`,
  ];

  if (showWatermark) {
    steps.push(`l_text:Poppins_28_bold:izibooking.app,co_rgb:${t.text},o_70,b_rgb:00000080/fl_layer_apply,g_south,y_30`);
  }

  return steps;
}

/** Mode généré : photo en cercle sur fond uni + texte, aucun gabarit requis. */
function generatedSteps(params: {
  title: string;
  eventDateLabel?: string | null;
  theme: PosterTheme;
  showWatermark: boolean;
}): string[] {
  const { title, eventDateLabel, theme, showWatermark } = params;
  const t = POSTER_THEMES[theme];

  const steps: string[] = [
    `w_440,h_440,c_thumb,g_face,r_max,bo_12px_solid_rgb:${t.accent}`,
    `b_rgb:${t.bg},w_${GENERATED_CANVAS_W},h_${GENERATED_CANVAS_H},c_pad,g_north,y_100`,
    `l_text:Poppins_76_bold:J%27Y%20SERAI,co_rgb:${t.text}/fl_layer_apply,g_north,y_1060`,
    `l_text:Poppins_46_bold:${encodeCloudinaryText(title)},co_rgb:${t.text},w_900,c_fit/fl_layer_apply,g_north,y_1170`,
  ];

  if (eventDateLabel) {
    steps.push(
      `l_text:Poppins_32:${encodeCloudinaryText(eventDateLabel)},co_rgb:${t.accent}/fl_layer_apply,g_north,y_1250`
    );
  }

  if (showWatermark) {
    steps.push(`l_text:Poppins_28_bold:izibooking.app,co_rgb:${t.text},o_55/fl_layer_apply,g_south,y_50`);
  }

  return steps;
}
