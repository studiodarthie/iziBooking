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

/** Photo déjà hébergée sur Cloudinary, réutilisée pour les aperçus de démonstration (accueil, édition de zone). */
export const DEMO_PHOTO_PUBLIC_ID = "cdqqfmcr8eiq1hi0bkqd";

/** Logo blanc iziBooking (PNG transparent), uploadé une fois pour servir de filigrane. */
const WATERMARK_LOGO_PUBLIC_ID = "izibooking/watermark-logo-white";

/** Filigrane en bas à droite : le logo de l'app plutôt qu'un texte, dimensionné au canevas. */
function watermarkStep(canvasWidth: number): string {
  const logoWidth = Math.round(canvasWidth * 0.2);
  const margin = Math.round(canvasWidth * 0.035);
  return `l_${layerId(WATERMARK_LOGO_PUBLIC_ID)},w_${logoWidth},o_85/fl_layer_apply,g_south_east,x_${margin},y_${margin}`;
}

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

/** Position/taille (en pixels, dans le référentiel du gabarit) de la zone où insérer la photo. */
export type PhotoZone = { x: number; y: number; width: number; height: number };

/** Position/taille (en pixels, dans le référentiel de la PHOTO) du recadrage choisi par le visiteur. */
export type PhotoCrop = { x: number; y: number; width: number; height: number };

/** Le plus grand rectangle centré au ratio donné qui tient dans la photo (zoom minimal, "cover"). */
export function defaultPhotoCrop(photo: { width: number; height: number }, aspectRatio: number): PhotoCrop {
  let width: number;
  let height: number;
  if (photo.width / photo.height > aspectRatio) {
    height = photo.height;
    width = Math.round(height * aspectRatio);
  } else {
    width = photo.width;
    height = Math.round(width / aspectRatio);
  }
  return { x: Math.round((photo.width - width) / 2), y: Math.round((photo.height - height) / 2), width, height };
}

export type PosterTemplate = {
  publicId: string;
  width: number;
  height: number;
  photoZone?: PhotoZone | null;
};

/** Aperçu du gabarit seul, avant que le visiteur n'ajoute sa photo. */
export function buildTemplatePreviewUrl(template: PosterTemplate): string {
  return `https://res.cloudinary.com/${cloudName()}/image/upload/w_${template.width},h_${template.height},c_fill/f_auto,q_auto/${template.publicId}`;
}

/** URL Cloudinary brute pour un public_id donné, avec une transformation optionnelle. */
export function buildCloudinaryUrl(publicId: string, transform?: string): string {
  return `https://res.cloudinary.com/${cloudName()}/image/upload/${transform ? `${transform}/` : ""}${publicId}`;
}

export function buildPosterUrl(params: {
  photoPublicId: string;
  title: string;
  eventDateLabel?: string | null;
  theme: PosterTheme;
  showWatermark: boolean;
  template?: PosterTemplate | null;
  photoCrop?: PhotoCrop | null;
  /** "auto" (par défaut) laisse Cloudinary choisir le format le plus léger (souvent WebP) pour
   *  l'aperçu à l'écran ; "png" force un PNG pour le fichier réellement téléchargé. */
  format?: "auto" | "png";
}): string {
  const { photoPublicId, theme, showWatermark, template, photoCrop, format = "auto" } = params;
  const formatStep = format === "png" ? "f_png" : "f_auto,q_auto";

  if (template) {
    const steps = customTemplateSteps({ theme, showWatermark, template, photoPublicId, photoCrop });
    steps.push(formatStep);
    return `https://res.cloudinary.com/${cloudName()}/image/upload/${steps.join("/")}/${template.publicId}`;
  }

  const steps = generatedSteps(params);
  steps.push(formatStep);
  return `https://res.cloudinary.com/${cloudName()}/image/upload/${steps.join("/")}/${photoPublicId}`;
}

/**
 * Mode gabarit personnalisé — construit en "sandwich" :
 *  1. le gabarit en base (fixe les dimensions du canevas),
 *  2. la photo du visiteur en calque, redimensionnée/positionnée exactement sur la zone
 *     transparente (pas sur tout le canevas, sinon le cadrage choisi par le visiteur ne
 *     correspond pas à ce qui s'affiche réellement dans la petite fenêtre découpée),
 *  3. le gabarit à nouveau par-dessus, pour masquer précisément tout débord de la photo hors
 *     de la zone transparente et garder le cadre toujours net, même si la zone n'est pas
 *     pixel-parfaite.
 *
 * Si le visiteur a choisi un recadrage précis (photoCrop, via PhotoAdjuster), on l'applique
 * tel quel (c_crop) avant de normaliser à la taille de la zone — sinon on retombe sur un
 * recadrage automatique (c_fill,g_auto) sur la photo entière.
 */
function customTemplateSteps(params: {
  theme: PosterTheme;
  showWatermark: boolean;
  template: PosterTemplate;
  photoPublicId: string;
  photoCrop?: PhotoCrop | null;
}): string[] {
  const { showWatermark, template, photoPublicId, photoCrop } = params;
  const { width, height, photoZone } = template;
  const zone = photoZone ?? { x: 0, y: 0, width, height };
  const templateLayer = layerId(template.publicId);

  const photoTransform = photoCrop
    ? `c_crop,x_${photoCrop.x},y_${photoCrop.y},w_${photoCrop.width},h_${photoCrop.height}/c_fill,w_${zone.width},h_${zone.height}`
    : `w_${zone.width},h_${zone.height},c_fill,g_auto`;

  const steps: string[] = [
    `w_${width},h_${height},c_fit`,
    `l_${layerId(photoPublicId)},${photoTransform}/fl_layer_apply,g_north_west,x_${zone.x},y_${zone.y}`,
    `l_${templateLayer},w_${width},h_${height},c_fit/fl_layer_apply,g_north_west,x_0,y_0`,
  ];

  if (showWatermark) {
    steps.push(watermarkStep(width));
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
    steps.push(watermarkStep(GENERATED_CANVAS_W));
  }

  return steps;
}
